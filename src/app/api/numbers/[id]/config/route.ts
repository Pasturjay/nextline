import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { avoxiClient } from "@/lib/avoxi/client";
import { z } from "zod";

const updateConfigSchema = z.object({
    forwardToNumber: z.string().optional(),
    forwardToSIP: z.string().optional(),
    voicemailEnabled: z.boolean().optional(),
    callRecording: z.boolean().optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { forwardToNumber, forwardToSIP, voicemailEnabled, callRecording } = updateConfigSchema.parse(body);

        const number = await prisma.virtualNumber.findUnique({
            where: { id },
        });

        if (!number || number.userId !== session.user.id) {
            return new NextResponse("Number not found or unauthorized", { status: 404 });
        }

        // Update in AVOXI
        // Note: AVOXI might require phone number or their ID, assuming 'avoXINumberId' is stored
        if (number.avoXINumberId) {
            await avoxiClient.updateNumberConfig({
                numberId: number.avoXINumberId,
                forwardTo: forwardToNumber || forwardToSIP,
                recordingEnabled: callRecording
            });
        }

        // Update in DB
        const updatedNumber = await prisma.virtualNumber.update({
            where: { id },
            data: {
                forwardToNumber,
                forwardToSIP,
                voicemailEnabled,
                callRecording,
            },
        });

        return NextResponse.json(updatedNumber);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid input", { status: 400 });
        }
        console.error("Update Config Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
