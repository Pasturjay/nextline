import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { addDays, differenceInDays } from "date-fns";

export const dynamic = 'force-dynamic';

const createBookingSchema = z.object({
    listingId: z.string().uuid(),
    startDate: z.string().datetime(), // ISO string
    durationDays: z.number().min(1),
    forwardToNumber: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { listingId, startDate: startDateStr, durationDays, forwardToNumber } = createBookingSchema.parse(body);
        const startDate = new Date(startDateStr);
        const endDate = addDays(startDate, durationDays);

        const listing = await prisma.marketplaceListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return new NextResponse("Listing not found", { status: 404 });
        }

        if (!listing.isAvailable) {
            return new NextResponse("Listing is currently unavailable", { status: 400 });
        }

        if (durationDays < listing.minRentalDays || durationDays > listing.maxRentalDays) {
            return new NextResponse(`Duration must be between ${listing.minRentalDays} and ${listing.maxRentalDays} days`, { status: 400 });
        }

        // Check availability overlap
        const overlap = await prisma.marketplaceBooking.findFirst({
            where: {
                listingId,
                status: { in: ['CONFIRMED', 'ACTIVE'] },
                OR: [
                    { startDate: { lte: endDate }, endDate: { gte: startDate } }
                ]
            }
        });

        if (overlap) {
            return new NextResponse("Selected dates are not available", { status: 409 });
        }

        // Calculate Price
        let totalPrice = Number(listing.pricePerDay) * durationDays;

        // Apply discounts
        let discount = 0;
        if (durationDays >= 30 && listing.monthlyDiscount) {
            discount = totalPrice * (listing.monthlyDiscount / 100);
        } else if (durationDays >= 7 && listing.weeklyDiscount) {
            discount = totalPrice * (listing.weeklyDiscount / 100);
        }

        const finalPrice = totalPrice - discount;

        // Create Booking Record (Pending Payment)
        const booking = await prisma.marketplaceBooking.create({
            data: {
                listingId,
                userId: session.user.id,
                startDate,
                endDate,
                totalDays: durationDays,
                pricePerDay: listing.pricePerDay,
                totalPrice,
                discount,
                finalPrice,
                forwardToNumber,
                status: 'PENDING'
            }
        });

        return NextResponse.json(booking, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid input", { status: 400 });
        }
        console.error("Create Booking Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
