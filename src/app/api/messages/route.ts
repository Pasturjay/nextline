import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const numberId = searchParams.get('numberId');
        const contact = searchParams.get('contact');

        // Build query
        const where: any = {
            number: {
                userId: session.user.id
            }
        };

        if (numberId) {
            where.numberId = numberId;
        }

        // Filter by specific contact conversation if provided
        // This is tricky because 'contact' could be in 'fromNumber' (for INBOUND) or 'toNumber' (for OUTBOUND)
        if (contact) {
            where.OR = [
                { fromNumber: contact },
                { toNumber: contact }
            ];
        }

        const logs = await prisma.smsLog.findMany({
            where,
            include: {
                number: {
                    select: {
                        phoneNumber: true,
                        country: true,
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100 // Limit to last 100 messages for now
        });

        return NextResponse.json(logs);

    } catch (error) {
        console.error("Messages List Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
