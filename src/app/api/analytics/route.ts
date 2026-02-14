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

        // 1. Get Date Range (Defaults to last 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        // 2. Aggregate Calls
        const callStats = await prisma.callLog.aggregate({
            where: {
                number: { userId: userId },
                createdAt: { gte: thirtyDaysAgo }
            },
            _count: { id: true },
            _sum: { duration: true }
        });

        // 3. Aggregate SMS
        const smsStats = await prisma.smsLog.aggregate({
            where: {
                number: { userId: userId },
                createdAt: { gte: thirtyDaysAgo }
            },
            _count: { id: true }
        });

        // 4. Get Active Numbers Count
        const activeNumbers = await prisma.virtualNumber.count({
            where: { userId: userId, status: 'ACTIVE' }
        });

        // 5. Get Recent Activity (Mixed Stream)
        // Fetch last 5 calls
        const recentCalls = await prisma.callLog.findMany({
            where: { number: { userId: userId } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { number: true }
        });

        // Fetch last 5 SMS
        const recentSms = await prisma.smsLog.findMany({
            where: { number: { userId: userId } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { number: true }
        });

        // Merge and Sort
        const recentActivity = [
            ...recentCalls.map(c => ({ ...c, type: 'CALL' })),
            ...recentSms.map(s => ({ ...s, type: 'SMS' }))
        ]
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);

        return NextResponse.json({
            summary: {
                totalCalls: callStats._count.id,
                totalDuration: callStats._sum.duration || 0,
                totalSms: smsStats._count.id,
                activeNumbers
            },
            recentActivity
        });

    } catch (error) {
        console.error("General Analytics API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
