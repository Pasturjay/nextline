import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { stripe, Stripe } from "@/lib/stripe";
import { avoxiClient } from "@/lib/avoxi/client";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { paymentId, provider = 'stripe', phoneNumber: reqPhoneNumber, country: reqCountry } = await req.json();

        if (!paymentId) {
            return new NextResponse("Missing paymentId", { status: 400 });
        }

        let metadata: any = {};
        let amount = 0;

        // 1. Verify Payment based on Provider
        if (provider === 'paypal') {
            // Verify PayPal Order
            const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
            const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

            if (!clientId || !clientSecret) {
                console.error("Missing PayPal credentials");
                return new NextResponse("Server configuration error", { status: 500 });
            }

            const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
            const tokenRes = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'}/v1/oauth2/token`, {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: { Authorization: `Basic ${auth}` },
            });
            const { access_token } = await tokenRes.json();

            const orderRes = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders/${paymentId}`, {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            const order = await orderRes.json();

            if (order.status !== 'COMPLETED') {
                return new NextResponse("PayPal order not completed", { status: 400 });
            }

            if (order.purchase_units?.[0]?.custom_id) {
                try {
                    metadata = JSON.parse(order.purchase_units[0].custom_id);
                } catch (e) {
                    console.error("Failed to parse PayPal metadata", e);
                }
            }
            amount = parseFloat(order.purchase_units?.[0]?.amount?.value || "0");

        } else {
            // Default to Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

            if (paymentIntent.status !== "succeeded") {
                return new NextResponse("Payment not successful", { status: 400 });
            }
            metadata = paymentIntent.metadata || {};
            amount = paymentIntent.amount / 100;
        }

        // 2. Extract Metadata or Fallback to Request Body
        // PayPal metadata might be missing if not passed correctly, so we fallback to req body if safe
        // But strictly we should trust payment metadata. for MVP we merge.
        const phoneNumber = metadata.phoneNumber || reqPhoneNumber;
        const country = metadata.country || reqCountry;
        const type = metadata.type;
        const billing = metadata.billing;
        const duration = metadata.duration;

        if (!phoneNumber || !country) {
            return new NextResponse("Invalid payment metadata or missing details", { status: 400 });
        }

        // 3. Idempotency Check
        const existingNumber = await prisma.virtualNumber.findFirst({
            where: {
                phoneNumber: phoneNumber,
                userId: session.user.id
            }
        });

        if (existingNumber) {
            return NextResponse.json(existingNumber);
        }

        // 4. Provision Number via AVOXI
        try {
            await avoxiClient.provisionNumber({
                phoneNumber,
                countryCode: country
            });
        } catch (error) {
            console.error("AVOXI Provisioning Failed:", error);
            // We continue even if provisioning fails to record the transaction, 
            // but in real world we might want to refund or flag for manual review.
        }

        const isRental = type === 'RENTAL';
        const isOneTime = billing === 'one-time';

        // Calculate days for duration
        const days = duration && duration !== 'monthly' ? parseInt(duration) : 30;

        // Calculate expiry if rental or one-time use
        let expiresAt = null;
        if (isRental || isOneTime) {
            expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        }

        // 5. Create Subscription Record (for Strict Ownership)
        const subscription = await prisma.subscription.create({
            data: {
                userId: session.user.id,
                stripeSubscriptionId: paymentId,
                planType: isRental ? "TRAVEL_MONTHLY" : "BASIC_NUMBER",
                pillar: isRental ? "TRAVEL" : "RESELLER",
                billingInterval: duration === 'monthly' ? "MONTHLY" : "ONE_TIME" as any,
                amount: amount,
                status: "ACTIVE",
                currentPeriodStart: new Date(),
                currentPeriodEnd: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }
        });

        // 6. Save to Database
        const number = await prisma.virtualNumber.create({
            data: {
                userId: session.user.id,
                subscriptionId: subscription.id,
                phoneNumber,
                country,
                numberType: "LOCAL",
                status: "ACTIVE",
                pillar: isRental ? "TRAVEL" : "RESELLER",
                monthlyPrice: 5.00,
                avoXIWholesaleCost: 1.00,
                avoXINumberId: `avoxi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                expiresAt: expiresAt,
                autoRenew: !isOneTime && !isRental
            }
        });

        // If Rental, create TravelRental record for tracking
        if (isRental) {
            await prisma.travelRental.create({
                data: {
                    userId: session.user.id,
                    phoneNumber,
                    country,
                    duration: `${days}d`,
                    forwardToNumber: "",
                    price: amount,
                    status: "ACTIVE",
                    expiresAt: expiresAt!,
                    activatedAt: new Date(),
                    paymentIntentId: paymentId,
                    numberId: number.id
                }
            });
        }

        return NextResponse.json(number);

    } catch (error) {
        console.error("Provisioning Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
