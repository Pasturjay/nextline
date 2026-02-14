import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { items, currency = "usd" } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items provided" }, { status: 400 });
        }

        // Calculate total amount
        // In a real app, you should fetch prices from your DB to prevent manipulation
        // For this MVP, we'll trust the payload but validate it against DB in phase 4
        const amount = calculateOrderAmount(items);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: session.user.id,
                items: JSON.stringify(items.map((i: any) => i.id)),
                ...(body.metadata || {})
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error("Payment Intent Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create payment intent" },
            { status: 500 }
        );
    }
}

function calculateOrderAmount(items: any[]): number {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
        // items should have price in cents (or smallest currency unit)
        // e.g. { id: 'num_123', price: 500 } = $5.00
        total += (item.price * 100);
    });

    // Enforce minimum charge amount for Stripe (e.g. 50 cents)
    return Math.max(50, total);
}
