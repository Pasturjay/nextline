import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia" as any, // Use latest API version available or match package.json
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { amount, currency, metadata } = await req.json();

        if (!amount || !currency) {
            return new NextResponse("Invalid amount or currency", { status: 400 });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: session.user.id,
                ...metadata
            }
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Internal Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
