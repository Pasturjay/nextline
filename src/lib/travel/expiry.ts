import { prisma } from "@/lib/db";
import { avoxiClient } from "@/lib/avoxi/client";

export async function activateRental(paymentIntentId: string) {
    const rental = await prisma.travelRental.findFirst({
        where: { paymentIntentId }
    });

    if (!rental || rental.status !== "PENDING") return;

    try {
        // 1. Provision Number via AVOXI
        const provisionRes = await avoxiClient.provisionNumber({
            phoneNumber: rental.phoneNumber,
            countryCode: rental.country
        });

        // 2. Configure Forwarding
        if (rental.forwardToNumber) {
            await avoxiClient.updateNumberConfig({
                numberId: provisionRes.id,
                forwardTo: rental.forwardToNumber
            });
        }

        // 3. Activate in DB
        await prisma.travelRental.update({
            where: { id: rental.id },
            data: {
                status: "ACTIVE",
                activatedAt: new Date(),
                // Update expiry to be relative to *activation* time, not creation time
                expiresAt: new Date(Date.now() + (parseInt(rental.duration) * 24 * 60 * 60 * 1000)),
                numberId: provisionRes.id
            }
        });

        console.log(`Activated rental ${rental.id} for ${rental.phoneNumber}`);
    } catch (error: any) {
        console.error(`Failed to activate rental ${rental.id}:`, error);
        await prisma.travelRental.update({
            where: { id: rental.id },
            data: {
                status: "FAILED",
                failureReason: error.message
            }
        });
    }
}

export async function checkExpiredRentals() {
    const now = new Date();

    // Find active rentals that have expired
    const expiredRentals = await prisma.travelRental.findMany({
        where: {
            status: "ACTIVE",
            expiresAt: { lt: now }
        }
    });

    for (const rental of expiredRentals) {
        try {
            if (rental.numberId) {
                // In real AVOXI API, we would 'release' or 'delete' the number
                // await avoxiClient.releaseNumber(rental.numberId);
                console.log(`Releasing number ${rental.phoneNumber} for rental ${rental.id}`);
            }

            await prisma.travelRental.update({
                where: { id: rental.id },
                data: { status: "EXPIRED" }
            });
        } catch (error) {
            console.error(`Failed to expire rental ${rental.id}:`, error);
        }
    }

    return expiredRentals.length;
}
