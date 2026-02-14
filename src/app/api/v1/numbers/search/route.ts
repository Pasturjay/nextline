import { NextResponse } from 'next/server';
import { avoxiClient } from '@/lib/avoxi/client';
import { validateApiKey } from '@/lib/auth/api-key';

export async function GET(req: Request) {
    // 1. Authenticate via API Key
    const authHeader = req.headers.get("authorization");
    const userId = await validateApiKey(authHeader);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'US';
    const type = searchParams.get('type') as 'local' | 'tollfree' | 'mobile' | undefined;
    const areaCode = searchParams.get('areaCode') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    try {
        const numbers = await avoxiClient.searchNumbers({
            country_code: country,
            type: type,
            area_code: areaCode,
            limit: Math.min(limit, 50) // Enforce max limit for public API
        });

        return NextResponse.json(numbers);
    } catch (error) {
        console.error('API V1 Number Search Error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch numbers' },
            { status: 500 }
        );
    }
}
