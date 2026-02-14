import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check daily limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyUsage = await prisma.virtualNumber.count({
            where: {
                userId: session.user.id,
                // Filter by OTP numbers using phoneNumber pattern or another method
                createdAt: {
                    gte: today
                },
                OR: [
                    { phoneNumber: { contains: 'OTP' } },
                    { monthlyPrice: 0 } // Free numbers
                ]
            }
        });

        const dailyLimit = 10;
        if (dailyUsage >= dailyLimit) {
            return NextResponse.json(
                { error: "Daily limit reached. Try again tomorrow or upgrade to a paid plan." },
                { status: 429 }
            );
        }

        // Generate a random temporary number (in production, this would provision from a pool)
        const phoneNumber = generateTempNumber();

        // Create OTP number record
        const otpNumber = await prisma.virtualNumber.create({
            data: {
                userId: session.user.id,
                phoneNumber,
                country: 'US',
                status: 'ACTIVE',
                monthlyPrice: 0,
                numberType: 'MOBILE',
                avoXINumberId: `otp-${Date.now()}`,
                pillar: 'OTP_VERIFY',
                avoXIWholesaleCost: 0,
            }
        });

        return NextResponse.json({
            phoneNumber: otpNumber.phoneNumber,
            id: otpNumber.id,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        });

    } catch (error) {
        console.error('OTP generation error:', error);
        return NextResponse.json(
            { error: "Failed to generate OTP number" },
            { status: 500 }
        );
    }
}

function generateTempNumber(): string {
    // Generate a random US number for demo purposes
    // In production, this would pull from a pool of real numbers
    const areaCode = ['415', '510', '650', '408', '925', '707'][Math.floor(Math.random() * 6)];
    const exchange = Math.floor(Math.random() * 900) + 100;
    const subscriber = Math.floor(Math.random() * 9000) + 1000;

    return `+1 (${areaCode}) ${exchange}-${subscriber}`;
}
