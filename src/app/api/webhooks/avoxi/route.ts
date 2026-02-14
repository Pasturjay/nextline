import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming integration with DB log models
import crypto from 'crypto';

// Verify AVOXI Webhook Signature (Conceptual - adjust to actual AVOXI method)
const verifySignature = (req: Request, body: string) => {
    const signature = req.headers.get('x-avoxi-signature');
    if (!signature) return false;

    const secret = process.env.AVOXI_WEBHOOK_SECRET || '';
    if (!secret) return true; // Dev mode mostly

    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');
    return signature === digest;
};

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();

        // Security Check
        if (!verifySignature(req, bodyText)) {
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(bodyText);
        const eventType = payload.event_type || payload.type;

        console.log(`Received AVOXI Webhook: ${eventType}`, payload);

        switch (eventType) {
            case 'call.completed':
                await handleCallCompleted(payload);
                break;
            case 'sms.received':
                await handleSmsReceived(payload);
                break;
            default:
                console.log('Unhandled event type:', eventType);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function handleCallCompleted(payload: any) {
    // Logic to update CallLog
    // Example:
    // await prisma.callLog.create({ data: { ... } })
    console.log('Processing Call Completed:', payload.call_id);
}

async function handleSmsReceived(payload: any) {
    // Logic to update SmsLog
    // Example:
    // await prisma.smsLog.create({ data: { ... } })
    console.log('Processing SMS Received:', payload.message_id);
}
