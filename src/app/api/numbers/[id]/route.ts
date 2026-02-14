import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia" as any,
});

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Use Promise for Next 15+
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        // 1. Verify Ownership
        const number = await prisma.virtualNumber.findUnique({
            where: { id },
            include: { subscription: true }
        });

        if (!number) {
            return new NextResponse("Number not found", { status: 404 });
        }

        if (number.userId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // 2. Cancel Subscription (if verified)
        if (number.subscriptionId && number.subscription?.stripeSubscriptionId && number.subscription.stripeSubscriptionId.startsWith('sub_')) {
            try {
                await stripe.subscriptions.cancel(number.subscription.stripeSubscriptionId);
            } catch (stripeError) {
                console.error("Stripe Cancellation Error:", stripeError);
                // Allow proceeding even if Stripe fails (e.g. already cancelled)
            }
        }

        // 3. Update DB Status
        // Mark Number as CANCELLED
        await prisma.virtualNumber.update({
            where: { id },
            data: {
                status: "CANCELLED",
                autoRenew: false,
                expiresAt: new Date() // Expire immediately
            }
        });

        // Mark Subscription as CANCELLED
        if (number.subscriptionId) {
            await prisma.subscription.update({
                where: { id: number.subscriptionId },
                data: {
                    status: "CANCELLED",
                    cancelledAt: new Date()
                }
            });
        }

        // 4. (Optional) Release from AVOXI
        // In a real strict environment, we might release immediately.
        // For now, we keep it "CANCELLED" in DB so we know it was used, but logically released.
        // A cron job could cleanup 'CANCELLED' numbers from AVOXI.

        return new NextResponse("Number Terminated", { status: 200 });

    } catch (error) {
        console.error("Termination Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
