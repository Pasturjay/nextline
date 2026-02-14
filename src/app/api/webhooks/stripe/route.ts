import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe, Stripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "customer.subscription.deleted":
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            case "invoice.payment_succeeded":
                // Handle renewal logic if needed
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error("Webhook handler failed:", error);
        return new NextResponse("Webhook handler failed", { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const stripeSubscriptionId = subscription.id;

    // Find the subscription in our DB
    const dbSubscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId },
        include: { numbers: true }
    });

    if (!dbSubscription) {
        console.error(`Subscription ${stripeSubscriptionId} not found in DB`);
        return;
    }

    // Mark subscription as cancelled
    await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
            status: "CANCELLED",
            cancelledAt: new Date()
        }
    });

    // Release associated numbers
    for (const number of dbSubscription.numbers) {
        await prisma.virtualNumber.update({
            where: { id: number.id },
            data: {
                status: "CANCELLED",
                // We could also disconnect userId here or keep it for audit
                // For strict "2ndNumber" logic, we might want to keep it assigned but inactive
                // until they pay again, OR fully release it.
                // Releasing it means:
                // userId: null (if schema allowed, but it doesn't)
                // So we set status CANCELLED.
                autoRenew: false
            }
        });
        console.log(`Number ${number.phoneNumber} cancelled due to subscription termination.`);
    }
}
