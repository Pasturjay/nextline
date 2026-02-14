import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { z } from "zod";

const dialSchema = z.object({
    toNumber: z.string().min(1, "Phone number is required"),
    duration: z.number().nonnegative().optional().default(0),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const result = dialSchema.safeParse(body);

        if (!result.success) {
            return new NextResponse("Invalid request data", { status: 400 });
        }

        const { toNumber, duration } = result.data;

        // Find a virtual number to use as caller ID
        const virtualNumber = await prisma.virtualNumber.findFirst({
            where: {
                userId: session.user.id,
                status: 'ACTIVE'
            }
        });

        if (!virtualNumber) {
            return new NextResponse("No active virtual number found to place call.", { status: 400 });
        }

        // Create Call Log
        const call = await prisma.callLog.create({
            data: {
                numberId: virtualNumber.id,
                direction: 'OUTBOUND',
                fromNumber: virtualNumber.phoneNumber,
                toNumber: toNumber,
                duration: duration,
                status: 'COMPLETED',
                disposition: duration > 0 ? 'ANSWERED' : 'BUSY',
                startedAt: new Date(Date.now() - duration * 1000), // Backdate start time
                endedAt: new Date(),
                answeredAt: duration > 0 ? new Date(Date.now() - duration * 1000) : null
            }
        });

        return NextResponse.json(call);

    } catch (error) {
        console.error("[CALL_DIAL_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
