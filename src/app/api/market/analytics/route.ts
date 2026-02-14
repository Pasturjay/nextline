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
        // Analytics for the Renter (Buyer)
        const stats = await prisma.marketplaceBooking.aggregate({
            where: { userId: session.user.id },
            _sum: {
                // Schema has: totalCalls, answeredCalls, totalSMS
                totalCalls: true,
                answeredCalls: true,
                totalSMS: true,
                totalPrice: true
            },
            _count: {
                id: true // Total bookings
            }
        });

        // Get recent activity for charts
        const recentBookings = await prisma.marketplaceBooking.findMany({
            where: { userId: session.user.id },
            orderBy: { startDate: 'desc' },
            take: 5,
            include: {
                listing: {
                    include: { number: true }
                }
            }
        });

        const totalSpent = stats._sum.totalPrice ? Number(stats._sum.totalPrice) : 0;
        const totalCalls = stats._sum.totalCalls || 0;
        const totalSms = stats._sum.totalSMS || 0;
        const answeredCalls = stats._sum.answeredCalls || 0;
        const activeCampaigns = stats._count.id || 0;

        return NextResponse.json({
            summary: {
                totalSpent,
                activeCampaigns,
                totalCalls,
                totalSms,
                answeredRate: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0
            },
            recentActivity: recentBookings
        });

    } catch (error) {
        console.error("Analytics API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
