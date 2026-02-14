import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const userId = session.user.id;

        // Get user's Stripe customer ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stripeCustomerId: true }
        });

        // Check if using placeholder Stripe key
        const isPlaceholderKey = process.env.STRIPE_SECRET_KEY?.includes('placeholder');

        if (isPlaceholderKey) {
            // Return a mock URL for development
            return NextResponse.json({
                url: `${process.env.NEXTAUTH_URL}/dashboard/billing?demo=true`,
                isDemo: true
            });
        }

        if (!user?.stripeCustomerId) {
            return NextResponse.json(
                { error: "No Stripe customer found. Please contact support." },
                { status: 400 }
            );
        }

        // Create Stripe billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (error) {
        console.error("Billing Portal Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
