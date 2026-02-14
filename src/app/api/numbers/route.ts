
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const numbers = await prisma.virtualNumber.findMany({
            where: {
                userId: session.user.id,
                status: "ACTIVE",
            },
            select: {
                id: true,
                phoneNumber: true,
                country: true,
                numberType: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(numbers);
    } catch (error) {
        console.error("[NUMBERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
