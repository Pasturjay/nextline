import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const userId = session.user.id;

        // 1. Get Active Subscriptions
        const subscriptions = await prisma.subscription.findMany({
            where: { userId: userId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            include: {
                numbers: true // If subscription is tied to a number
            }
        });

        // 2. Get Past Invoices
        const invoices = await prisma.invoice.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // 3. Get Account Type / Plan
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { accountType: true, stripeCustomerId: true }
        });

        return NextResponse.json({
            accountType: user?.accountType,
            customerId: user?.stripeCustomerId,
            subscriptions,
            invoices
        });

    } catch (error) {
        console.error("Billing API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
