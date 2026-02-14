import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth/api-key';
import { avoxiClient } from '@/lib/avoxi/client';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const buyNumberSchema = z.object({
    phoneNumber: z.string().min(1),
    countryCode: z.string().length(2),
});

export async function POST(req: Request) {
    // 1. Authenticate
    const authHeader = req.headers.get("authorization");
    const userId = await validateApiKey(authHeader);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parseResult = buyNumberSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ message: 'Invalid request', errors: parseResult.error.flatten() }, { status: 400 });
        }

        const { phoneNumber, countryCode } = parseResult.data;

        // 2. Check Balance (Placeholder logic)
        // In a real system, we'd check if user.balance >= number.price
        // For now, we'll assume post-paid or manual billing for API users unless a wallet exists.
        // We can just provision and log it for billing later.

        // 3. Provision via AVOXI
        // Note: AVOXI might return an ID or status
        await avoxiClient.provisionNumber({
            phoneNumber,
            countryCode
        });

        // 4. Create Subscription Record (Required for VirtualNumber)
        const subscription = await prisma.subscription.create({
            data: {
                userId: userId,
                stripeSubscriptionId: `api_${Date.now()}`, // Placeholder for API purchases
                planType: "BASIC_NUMBER",
                pillar: "RESELLER",
                billingInterval: "MONTHLY",
                amount: 5.00, // Default price
                status: "ACTIVE",
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }
        });

        // 5. Save to DB
        const newNumber = await prisma.virtualNumber.create({
            data: {
                userId: userId,
                subscriptionId: subscription.id,
                phoneNumber,
                country: countryCode,
                numberType: "LOCAL",
                status: "ACTIVE",
                pillar: "RESELLER",
                monthlyPrice: 5.00,
                avoXIWholesaleCost: 1.00,
                avoXINumberId: `avoxi_api_${Date.now()}`,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                autoRenew: true
            }
        });

        return NextResponse.json({
            status: 'success',
            message: 'Number provisioned successfully',
            number: newNumber
        }, { status: 201 });

    } catch (error) {
        console.error('API V1 Buy Number Error:', error);
        return NextResponse.json({ message: 'Provisioning failed' }, { status: 500 });
    }
}
