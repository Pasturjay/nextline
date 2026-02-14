import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Check Authentication & Authorization
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || "";
        const role = searchParams.get('role');

        // 2. Build Query
        const where: any = {};

        if (query) {
            where.OR = [
                { email: { contains: query, mode: 'insensitive' } },
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } }
            ];
        }

        if (role && role !== 'ALL') {
            where.role = role;
        }

        // 3. Fetch Users
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                accountType: true,
                createdAt: true,
                emailVerified: true,
                deletedAt: true,
                _count: {
                    select: { numbers: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // Pagination limit
        });

        return NextResponse.json(users);

    } catch (error) {
        console.error("Admin Users List Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
