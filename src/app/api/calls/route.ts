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
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        // Fetch Call Logs
        const calls = await prisma.callLog.findMany({
            where: {
                number: { userId: userId }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                number: true
            }
        });

        const total = await prisma.callLog.count({
            where: { number: { userId: userId } }
        });

        return NextResponse.json({
            calls,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Calls API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
