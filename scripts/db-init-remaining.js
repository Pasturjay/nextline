const { Client } = require('pg');

// Use the IPv4 Transaction Pooler (via env or hardcoded if env fails)
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ecgrsffcndozeztdfjpi:Game2026%40421@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to DB for remaining schema initialization...');

        // TravelRental
        await client.query(`
        CREATE TABLE IF NOT EXISTS "TravelRental" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "phoneNumber" TEXT NOT NULL,
            "country" TEXT NOT NULL,
            "duration" TEXT NOT NULL,
            "forwardToNumber" TEXT NOT NULL,
            "price" DECIMAL(65,30) NOT NULL,
            "status" "TravelRentalStatus" NOT NULL DEFAULT 'PENDING',
            "failureReason" TEXT,
            "expiresAt" TIMESTAMP(3) NOT NULL,
            "activatedAt" TIMESTAMP(3),
            "numberId" TEXT,
            "paymentIntentId" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "TravelRental_pkey" PRIMARY KEY ("id")
        );
    `);
        await client.query(`CREATE INDEX IF NOT EXISTS "TravelRental_userId_idx" ON "TravelRental"("userId");`);

        // MarketplaceListing
        await client.query(`
        CREATE TABLE IF NOT EXISTS "MarketplaceListing" (
            "id" TEXT NOT NULL,
            "numberId" TEXT NOT NULL,
            "isAvailable" BOOLEAN NOT NULL DEFAULT true,
            "minRentalDays" INTEGER NOT NULL DEFAULT 7,
            "maxRentalDays" INTEGER NOT NULL DEFAULT 365,
            "pricePerDay" DECIMAL(65,30) NOT NULL,
            "weeklyDiscount" DOUBLE PRECISION,
            "monthlyDiscount" DOUBLE PRECISION,
            "reputationScore" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
            "totalBookings" INTEGER NOT NULL DEFAULT 0,
            "completedBookings" INTEGER NOT NULL DEFAULT 0,
            "averageRating" DECIMAL(65,30),
            "isFeatured" BOOLEAN NOT NULL DEFAULT false,
            "featuredUntil" TIMESTAMP(3),
            "listingTitle" TEXT,
            "listingDescription" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "MarketplaceListing_pkey" PRIMARY KEY ("id")
        );
    `);
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "MarketplaceListing_numberId_key" ON "MarketplaceListing"("numberId");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "MarketplaceListing_isAvailable_reputationScore_idx" ON "MarketplaceListing"("isAvailable", "reputationScore");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "MarketplaceListing_isFeatured_featuredUntil_idx" ON "MarketplaceListing"("isFeatured", "featuredUntil");`);

        // MarketplaceBooking
        await client.query(`
        CREATE TABLE IF NOT EXISTS "MarketplaceBooking" (
            "id" TEXT NOT NULL,
            "listingId" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "startDate" TIMESTAMP(3) NOT NULL,
            "endDate" TIMESTAMP(3) NOT NULL,
            "totalDays" INTEGER NOT NULL,
            "pricePerDay" DECIMAL(65,30) NOT NULL,
            "totalPrice" DECIMAL(65,30) NOT NULL,
            "discount" DECIMAL(65,30),
            "finalPrice" DECIMAL(65,30) NOT NULL,
            "forwardToNumber" TEXT,
            "forwardToSIP" TEXT,
            "voicemailEnabled" BOOLEAN NOT NULL DEFAULT true,
            "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
            "stripePaymentId" TEXT,
            "paidAt" TIMESTAMP(3),
            "campaignName" TEXT,
            "campaignGoal" TEXT,
            "cancelledAt" TIMESTAMP(3),
            "cancellationReason" TEXT,
            "refundAmount" DECIMAL(65,30),
            "totalCalls" INTEGER NOT NULL DEFAULT 0,
            "answeredCalls" INTEGER NOT NULL DEFAULT 0,
            "totalSMS" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "MarketplaceBooking_pkey" PRIMARY KEY ("id")
        );
    `);
        await client.query(`CREATE INDEX IF NOT EXISTS "MarketplaceBooking_userId_status_idx" ON "MarketplaceBooking"("userId", "status");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "MarketplaceBooking_listingId_startDate_endDate_idx" ON "MarketplaceBooking"("listingId", "startDate", "endDate");`);

        // MarketplaceReview
        await client.query(`
        CREATE TABLE IF NOT EXISTS "MarketplaceReview" (
            "id" TEXT NOT NULL,
            "bookingId" TEXT NOT NULL,
            "listingId" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "rating" INTEGER NOT NULL,
            "title" TEXT,
            "comment" TEXT,
            "callQualityRating" INTEGER,
            "reliabilityRating" INTEGER,
            "valueRating" INTEGER,
            "isVerified" BOOLEAN NOT NULL DEFAULT true,
            "isFlagged" BOOLEAN NOT NULL DEFAULT false,
            "flagReason" TEXT,
            "ownerResponse" TEXT,
            "ownerRespondedAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "MarketplaceReview_pkey" PRIMARY KEY ("id")
        );
    `);
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "MarketplaceReview_bookingId_key" ON "MarketplaceReview"("bookingId");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "MarketplaceReview_listingId_rating_idx" ON "MarketplaceReview"("listingId", "rating");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "MarketplaceReview_userId_idx" ON "MarketplaceReview"("userId");`);

        // SpamReport
        await client.query(`
        CREATE TABLE IF NOT EXISTS "SpamReport" (
            "id" TEXT NOT NULL,
            "numberId" TEXT NOT NULL,
            "reporter" TEXT,
            "reason" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "SpamReport_pkey" PRIMARY KEY ("id")
        );
    `);
        await client.query(`CREATE INDEX IF NOT EXISTS "SpamReport_numberId_idx" ON "SpamReport"("numberId");`);

        console.log('Remaining tables created successfully.');
    } catch (e) {
        console.error('Initialization Failed:', e);
    } finally {
        await client.end();
    }
}

main();
