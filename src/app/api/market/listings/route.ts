import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const createListingSchema = z.object({
    numberId: z.string().uuid(),
    pricePerDay: z.number().min(0.01),
    minRentalDays: z.number().min(1).default(7),
    maxRentalDays: z.number().min(1).default(365),
    listingTitle: z.string().optional(),
    listingDescription: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { numberId, pricePerDay, minRentalDays, maxRentalDays, listingTitle, listingDescription } = createListingSchema.parse(body);

        // Verify ownership
        const number = await prisma.virtualNumber.findUnique({
            where: { id: numberId },
        });

        if (!number || number.userId !== session.user.id) {
            return new NextResponse("Number not found or unauthorized", { status: 404 });
        }

        // Check if already listed
        const existing = await prisma.marketplaceListing.findUnique({
            where: { numberId },
        });

        if (existing) {
            return new NextResponse("Number already listed", { status: 409 });
        }

        // Create Listing
        const listing = await prisma.marketplaceListing.create({
            data: {
                numberId,
                pricePerDay,
                minRentalDays,
                maxRentalDays,
                listingTitle,
                listingDescription,
                isAvailable: true,
            },
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid input", { status: 400 });
        }
        console.error("Create Listing Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const country = searchParams.get('country');
        const type = searchParams.get('type');

        const listings = await prisma.marketplaceListing.findMany({
            where: {
                isAvailable: true,
                number: {
                    ...(country && { country }),
                    ...(type && { numberType: type as any })
                }
            },
            include: {
                number: {
                    select: {
                        phoneNumber: true,
                        country: true,
                        numberType: true
                    }
                }
            },
            orderBy: {
                reputationScore: 'desc'
            }
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("Fetch Listings Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
