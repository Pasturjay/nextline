import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyApiKey } from "@/lib/auth/api-key";
import { avoxiClient } from "@/lib/avoxi/client";
import { z } from "zod";

// Duplicated for speed, normally extract to middleware
async function authenticate(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const key = authHeader.split(" ")[1];
    const allKeys = await prisma.apiKey.findMany({ where: { status: 'ACTIVE' } });
    for (const k of allKeys) {
        if (await verifyApiKey(key, k.keyHash)) {
            await prisma.apiKey.update({ where: { id: k.id }, data: { lastUsedAt: new Date() } });
            return k.userId;
        }
    }
    return null;
}

const sendSmsSchema = z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    text: z.string().min(1)
});

export async function POST(req: Request) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { from, to, text } = sendSmsSchema.parse(body);

        // 1. Verify ownership of 'from' number
        const number = await prisma.virtualNumber.findUnique({
            where: { phoneNumber: from },
        });

        if (!number || number.userId !== userId) {
            return NextResponse.json({ message: "Invalid 'from' number or unauthorized" }, { status: 403 });
        }

        // 2. Send via AVOXI
        const avoxiRes = await avoxiClient.sendSMS({ from, to, text });

        // 3. Log it
        const log = await prisma.smsLog.create({
            data: {
                numberId: number.id,
                direction: "OUTBOUND",
                fromNumber: from,
                toNumber: to,
                body: text,
                status: "SENT", // Optimistic
                avoXIMessageId: avoxiRes.message_id || `temp_${Date.now()}`
            }
        });

        return NextResponse.json({
            id: log.id,
            status: "queued",
            details: avoxiRes
        }, { status: 200 });

    } catch (error) {
        console.error("V1 SMS Send Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
