import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;

        // Verify ownership
        const key = await prisma.apiKey.findUnique({
            where: { id },
        });

        if (!key || key.userId !== session.user.id) {
            return NextResponse.json({ error: "Key not found" }, { status: 404 });
        }

        await prisma.apiKey.update({
            where: { id },
            data: {
                status: "REVOKED",
                revokedAt: new Date()
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
    }
}
