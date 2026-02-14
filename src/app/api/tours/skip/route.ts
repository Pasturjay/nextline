import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { tourId } = await req.json();

        if (!tourId) {
            return NextResponse.json({ error: 'Tour ID required' }, { status: 400 });
        }

        // Upsert tour progress
        await prisma.userTourProgress.upsert({
            where: {
                userId_tourId: {
                    userId: session.user.id,
                    tourId,
                },
            },
            update: {
                skipped: true,
                completed: false,
            },
            create: {
                userId: session.user.id,
                tourId,
                skipped: true,
                completed: false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tour skip error:', error);
        return NextResponse.json({ error: 'Failed to save tour progress' }, { status: 500 });
    }
}
