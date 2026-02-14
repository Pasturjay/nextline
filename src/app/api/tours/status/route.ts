import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tourProgress = await prisma.userTourProgress.findMany({
            where: { userId: session.user.id },
            select: {
                tourId: true,
                completed: true,
                skipped: true,
            },
        });

        return NextResponse.json({ tours: tourProgress });
    } catch (error) {
        console.error('Tour status error:', error);
        return NextResponse.json({ error: 'Failed to fetch tour status' }, { status: 500 });
    }
}
