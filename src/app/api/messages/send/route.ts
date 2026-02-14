import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { avoxiClient } from "@/lib/avoxi/client";
import { z } from "zod";

const sendSmsSchema = z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    text: z.string().min(1)
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { from, to, text } = sendSmsSchema.parse(body);

        // 1. Verify ownership of 'from' number
        const number = await prisma.virtualNumber.findFirst({
            where: {
                phoneNumber: from,
                userId: session.user.id
            },
        });

        if (!number) {
            return NextResponse.json({ message: "Invalid 'from' number or unauthorized" }, { status: 403 });
        }

        // 2. Send via AVOXI
        let avoxiRes;
        try {
            avoxiRes = await avoxiClient.sendSMS({ from, to, text });
        } catch (error) {
            console.error("AVOXI Send Failed:", error);
            // We might want to throw here or continue to log the failure
            // For now, let's assume if it fails we return error
            return NextResponse.json({ message: "Failed to send message via provider" }, { status: 502 });
        }

        // 3. Log it
        const log = await prisma.smsLog.create({
            data: {
                numberId: number.id,
                direction: "OUTBOUND",
                fromNumber: from,
                toNumber: to,
                body: text,
                status: "SENT",
                avoXIMessageId: avoxiRes.message_id || `temp_${Date.now()}`
            }
        });

        return NextResponse.json(log);

    } catch (error) {
        console.error("Internal SMS Send Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
