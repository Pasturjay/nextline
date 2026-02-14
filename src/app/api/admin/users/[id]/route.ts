import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // Check admin authorization
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;
        const body = await req.json();
        const { role, suspended } = body;

        // Prevent admin from demoting themselves
        if (id === session.user.id && role && role !== 'ADMIN') {
            return NextResponse.json(
                { error: "You cannot change your own admin role" },
                { status: 400 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (role) {
            if (!['USER', 'ADMIN', 'SUPPORT', 'EDITOR', 'HR'].includes(role)) {
                return NextResponse.json(
                    { error: "Invalid role" },
                    { status: 400 }
                );
            }
            updateData.role = role;
        }

        if (typeof suspended === 'boolean') {
            updateData.suspendedAt = suspended ? new Date() : null;
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
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
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error("Admin User Update Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // Check admin authorization
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Fetch detailed user information
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                numbers: {
                    select: {
                        id: true,
                        phoneNumber: true,
                        status: true,
                        createdAt: true,
                    },
                    take: 10,
                },
                apiKeys: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        createdAt: true,
                    },
                    take: 10,
                },
                subscriptions: {
                    select: {
                        id: true,
                        planType: true,
                        status: true,
                        createdAt: true,
                    },
                    take: 10,
                },
                _count: {
                    select: {
                        numbers: true,
                        apiKeys: true,
                        subscriptions: true,
                        invoices: true,
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error("Admin User Detail Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
