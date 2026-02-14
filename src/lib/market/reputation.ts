import { prisma } from "@/lib/db";

export async function updateListingReputation(listingId: string) {
    const reviews = await prisma.marketplaceReview.findMany({
        where: { listingId },
        select: { rating: true }
    });

    if (reviews.length === 0) {
        await prisma.marketplaceListing.update({
            where: { id: listingId },
            data: { averageRating: null, totalBookings: { increment: 0 } } // No change to rating
        });
        return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    await prisma.marketplaceListing.update({
        where: { id: listingId },
        data: {
            averageRating: avgRating,
            reputationScore: avgRating // Simplified: score equals rating for now
        }
    });
}

export async function flagSpam(numberId: string, reason?: string) {
    await prisma.spamReport.create({
        data: { numberId, reason }
    });

    // Downgrade reputation on spam report
    // This is a naive implementation; strictly reducing score requires tracking the number of reports
    // For now, let's just count them in the listing/number model
    await prisma.virtualNumber.update({
        where: { id: numberId },
        data: { spamReports: { increment: 1 } }
    });
}
