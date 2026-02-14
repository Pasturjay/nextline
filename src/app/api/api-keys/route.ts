import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { generateApiKey } from '@/lib/auth/api-key';
import { z } from 'zod';

const createKeySchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const keys = await prisma.apiKey.findMany({
            where: {
                userId: session.user.id,
                status: 'ACTIVE'
            },
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                createdAt: true,
                lastUsedAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(keys);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { name } = createKeySchema.parse(body);

        const { key, keyPrefix, keyHash } = await generateApiKey(name);

        const newKey = await prisma.apiKey.create({
            data: {
                userId: session.user.id,
                name,
                keyHash,
                keyPrefix,
                environment: 'LIVE', // Defaulting to LIVE for now
            }
        });

        return NextResponse.json({
            ...newKey,
            secretKey: key // Only returned once!
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid input", { status: 400 });
        }
        console.error("Create API Key Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        await prisma.apiKey.update({
            where: {
                id,
                userId: session.user.id
            },
            data: { status: 'REVOKED', revokedAt: new Date() }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
