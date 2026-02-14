import { prisma } from "@/lib/db";
import axios from "axios";
import crypto from "crypto";

interface WebhookPayload {
    id: string;
    event: string;
    timestamp: string;
    data: any;
}

export async function deliverWebhook(userId: string, event: string, data: any) {
    // 1. Fetch user's webhook config
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { webhookUrl: true, webhookSecret: true }
    });

    if (!user || !user.webhookUrl) {
        return { skipped: true, reason: "No webhook URL configured" };
    }

    const payload: WebhookPayload = {
        id: crypto.randomUUID(),
        event,
        timestamp: new Date().toISOString(),
        data
    };

    // 2. Sign payload
    const signature = user.webhookSecret
        ? crypto.createHmac("sha256", user.webhookSecret).update(JSON.stringify(payload)).digest("hex")
        : null;

    // 3. Attempt Delivery
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let responseStatus = 0;

    while (attempts < maxAttempts && !success) {
        attempts++;
        try {
            const res = await axios.post(user.webhookUrl, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "X-NexaLine-Signature": signature,
                    "X-NexaLine-Event": event
                },
                timeout: 5000
            });

            responseStatus = res.status;
            if (res.status >= 200 && res.status < 300) {
                success = true;
            }
        } catch (error: any) {
            responseStatus = error.response?.status || 0;
            console.warn(`Webhook attempt ${attempts} failed for user ${userId}:`, error.message);
            // specific logic for backoff could go here
        }
    }

    // 4. Log Delivery
    await prisma.webhookDelivery.create({
        data: {
            userId,
            event,
            url: user.webhookUrl,
            payloadId: payload.id,
            statusCode: responseStatus,
            attempt: attempts,
            failed: !success,
            deliveredAt: success ? new Date() : null
        }
    });

    return { success, attempts };
}
