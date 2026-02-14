import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const keys = await prisma.apiKey.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                status: true,
                createdAt: true,
                lastUsedAt: true,
                // Never return keyHash
            }
        });

        return NextResponse.json({ keys });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate Key: nex_[32_random_chars]
        const rawKey = `nex_${crypto.randomBytes(24).toString('hex')}`;
        const keyPrefix = rawKey.substring(0, 12); // nex_ + first 8
        const keyHash = await bcrypt.hash(rawKey, 10);

        const newKey = await prisma.apiKey.create({
            data: {
                userId: session.user.id,
                name,
                keyHash,
                keyPrefix,
                scopes: ["*"], // Default full access for MVP
            }
        });

        // Return the raw key ONLY ONCE
        return NextResponse.json({
            apiKey: rawKey,
            id: newKey.id,
            name: newKey.name
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
    }
}
