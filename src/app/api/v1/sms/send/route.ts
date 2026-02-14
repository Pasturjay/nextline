import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth/api-key";
import { prisma } from "@/lib/db";
import { avoxiClient } from "@/lib/avoxi/client";
import { z } from "zod";

const sendSmsSchema = z.object({
    to: z.string().min(1, "Recipient number is required"),
    from: z.string().min(1, "Sender number is required"),
    message: z.string().min(1, "Message content is required"), // Docs say 'message', internal says 'text'
});

export async function POST(req: Request) {
    try {
        // 1. Authenticate via API Key
        const authHeader = req.headers.get("authorization");
        const userId = await validateApiKey(authHeader);

        if (!userId) {
            return NextResponse.json({
                error: "unauthorized",
                message: "Invalid or missing API Key"
            }, { status: 401 });
        }

        // 2. Parse & Validate Body
        const body = await req.json();
        const parseResult = sendSmsSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({
                error: "invalid_request",
                details: parseResult.error.flatten()
            }, { status: 400 });
        }

        const { to, from, message } = parseResult.data;

        // 3. Verify Ownership of 'from' number
        const number = await prisma.virtualNumber.findFirst({
            where: {
                phoneNumber: from,
                userId: userId // Use the ID from the API key
            },
        });

        if (!number) {
            return NextResponse.json({
                error: "forbidden",
                message: "Sender number not found or not owned by this account"
            }, { status: 403 });
        }

        // 4. Send via AVOXI
        let avoxiRes;
        try {
            avoxiRes = await avoxiClient.sendSMS({
                from,
                to,
                text: message
            });
        } catch (error) {
            console.error("AVOXI V1 Send Failed:", error);
            return NextResponse.json({
                error: "upstream_error",
                message: "Failed to dispatch message to carrier"
            }, { status: 502 });
        }

        // 5. Log Transaction
        const log = await prisma.smsLog.create({
            data: {
                numberId: number.id,
                direction: "OUTBOUND",
                fromNumber: from,
                toNumber: to,
                body: message,
                status: "SENT",
                avoXIMessageId: avoxiRes.message_id || `api_${Date.now()}`
            }
        });

        // 6. Return Success Response
        return NextResponse.json({
            id: log.id,
            status: "sent",
            to: log.toNumber,
            from: log.fromNumber,
            created_at: log.createdAt
        }, { status: 201 });

    } catch (error) {
        console.error("API V1 SMS Error:", error);
        return NextResponse.json({
            error: "internal_server_error",
            message: "An unexpected error occurred"
        }, { status: 500 });
    }
}
