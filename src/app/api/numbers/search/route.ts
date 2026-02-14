import { NextResponse } from 'next/server';
import { avoxiClient } from '@/lib/avoxi/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'US';
    const type = searchParams.get('type') as 'local' | 'tollfree' | 'mobile' | undefined;
    const areaCode = searchParams.get('areaCode') || undefined;

    try {
        const numbers = await avoxiClient.searchNumbers({
            country_code: country,
            type: type,
            area_code: areaCode,
            limit: 10
        });

        return NextResponse.json(numbers);
    } catch (error) {
        console.error('Number Search Error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch numbers' },
            { status: 500 }
        );
    }
}
