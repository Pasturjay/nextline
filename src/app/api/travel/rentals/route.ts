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
        const rentals = await prisma.travelRental.findMany({
            where: {
                userId: session.user.id,
                status: 'ACTIVE' // Only show active for now, or maybe all? Active is better for "Active Rentals" section details.
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ rentals });
    } catch (error) {
        console.error("Fetch Rentals Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
