import { randomBytes } from 'crypto';
import { hash, compare } from 'bcryptjs';
import { prisma } from '@/lib/db';

export interface GeneratedApiKey {
    key: string;      // The full key to show the user once (e.g., nexa_live_...)
    keyPrefix: string; // The first few chars to store for display
    keyHash: string;   // The bcrypt hash to store in DB
}

export async function generateApiKey(name: string): Promise<GeneratedApiKey> {
    // Generate a random 32-byte hex string
    const secret = randomBytes(24).toString('hex');
    const prefix = 'nexa_live_';
    const key = `${prefix}${secret}`;

    // Hash the full key
    const keyHash = await hash(key, 10);

    return {
        key,
        keyPrefix: key.substring(0, 14) + '...', // Store a safe display version
        keyHash,
    };
}

export async function verifyApiKey(plainKey: string, hashedKey: string): Promise<boolean> {
    return compare(plainKey, hashedKey);
}

export async function validateApiKey(authHeader: string | null): Promise<string | null> {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];

    // Performance note: In production with many keys, this linear scan is slow.
    // Recommended: Store a key ID or prefix in the token to allow direct lookup.
    // Current MVP: Iterate all active keys.
    const keys = await prisma.apiKey.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, keyHash: true, userId: true }
    });

    for (const k of keys) {
        const isValid = await compare(token, k.keyHash);
        if (isValid) {
            // Update Last Used
            await prisma.apiKey.update({
                where: { id: k.id },
                data: { lastUsedAt: new Date() }
            });
            return k.userId;
        }
    }

    return null;
}
