import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyApiKey } from "@/lib/auth/api-key";
import { avoxiClient } from "@/lib/avoxi/client";
import { z } from "zod";

// Helper to authenticate API Key
async function authenticate(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const key = authHeader.split(" ")[1];

    // Find key by prefix usually, but here we scan (not efficient for production, needs optimization)
    // Better: Store prefix in DB, query by prefix, then verify hash
    // Optimization: Extract prefix from key
    const prefix = key.substring(0, 14) + '...'; // Match format in generation

    // Actually, let's try finding by matching the *stored* prefix if we stored it exactly as we generated
    // But wait, we stored "nexa_live_..."(14 chars) + ...

    // For now, simpler approach:
    // We need to know which key record to check.
    // Standard practice: Key ID or just Prefix lookup.
    // Let's assume we can lookup by a prefix we extract.
    // We stored `keyPrefix` in generation as `key.substring(0, 14) + '...'`

    // Since we don't strictly enforce prefix length in the random generation beyond "nexa_live_", 
    // let's just find the key in DB that *matches* the prefix of the incoming key.

    // Limitation: If multiple keys involve same prefix (unlikely with random), this might be ambiguous.
    // Production fix: Include a public Key ID in the header or key format (e.g., prefix_KEYID_secret).

    // Fallback scan for MVP:
    const allKeys = await prisma.apiKey.findMany({ where: { status: 'ACTIVE' } });

    for (const k of allKeys) {
        const match = await verifyApiKey(key, k.keyHash);
        if (match) {
            // Update last used
            await prisma.apiKey.update({ where: { id: k.id }, data: { lastUsedAt: new Date() } });
            return k.userId;
        }
    }

    return null;
}

const provisionSchema = z.object({
    country: z.string().length(2),
    type: z.enum(["local", "mobile", "tollfree"]).optional().default("local")
});

export async function POST(req: Request) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized: Invalid API Key" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { country, type } = provisionSchema.parse(body);

        // 1. Search for a number (simplified: blindly buying first available or using specific provision logic)
        // Ideally, we search then buy.
        const searchRes = await avoxiClient.searchNumbers({
            country_code: country,
            type: type as any,
            limit: 1
        });

        if (!searchRes?.numbers || searchRes.numbers.length === 0) {
            return NextResponse.json({ message: "No numbers available for the specified criteria" }, { status: 404 });
        }

        const candidate = searchRes.numbers[0];

        // 2. Buy the number
        const provisionRes = await avoxiClient.provisionNumber({
            phoneNumber: candidate.phoneNumber,
            countryCode: country
        });

        // 3. Save to DB
        const number = await prisma.virtualNumber.create({
            data: {
                userId,
                phoneNumber: candidate.phoneNumber,
                country: country,
                numberType: "MOBILE", // Map correctly from response
                status: "ACTIVE",
                pillar: "OTP_VERIFY",
                monthlyPrice: 5.00, // Dynamic pricing needed
                avoXIWholesaleCost: 1.00,
                avoXINumberId: provisionRes.id || `temp_${Date.now()}` // Fallback if API response differs
            }
        });

        return NextResponse.json(number, { status: 201 });

    } catch (error) {
        console.error("V1 Provision Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const numbers = await prisma.virtualNumber.findMany({
            where: { userId, pillar: "OTP_VERIFY" },
            select: {
                id: true,
                phoneNumber: true,
                country: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json({ data: numbers });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
