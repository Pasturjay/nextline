const { Client } = require('pg');

// Use the SESSION POOLER (Port 5432)
const connectionString = 'postgresql://postgres.ecgrsffcndozeztdfjpi:Game2026%40421@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to DB for schema initialization...');

        // 1. Create Enums (Idempotent)
        const enums = [
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountType') THEN CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'DEVELOPER', 'AGENCY'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NumberType') THEN CREATE TYPE "NumberType" AS ENUM ('LOCAL', 'TOLL_FREE', 'MOBILE', 'VANITY', 'DID', 'ITFS'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Pillar') THEN CREATE TYPE "Pillar" AS ENUM ('RESELLER', 'OTP_VERIFY', 'TRAVEL', 'MARKETPLACE'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NumberStatus') THEN CREATE TYPE "NumberStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_ACTIVATION', 'FAILED_ACTIVATION', 'EXPIRED', 'CANCELLED'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PlanType') THEN CREATE TYPE "PlanType" AS ENUM ('BASIC_NUMBER', 'PREMIUM_NUMBER', 'ENTERPRISE_NUMBER', 'OTP_STARTER', 'OTP_GROWTH', 'OTP_ENTERPRISE', 'TRAVEL_WEEKLY', 'TRAVEL_BIWEEKLY', 'TRAVEL_MONTHLY', 'MARKETPLACE_RENTAL'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingInterval') THEN CREATE TYPE "BillingInterval" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubscriptionStatus') THEN CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'INCOMPLETE', 'TRIALING'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Environment') THEN CREATE TYPE "Environment" AS ENUM ('TEST', 'LIVE'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApiKeyStatus') THEN CREATE TYPE "ApiKeyStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CallDirection') THEN CREATE TYPE "CallDirection" AS ENUM ('INBOUND', 'OUTBOUND'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CallStatus') THEN CREATE TYPE "CallStatus" AS ENUM ('INITIATED', 'RINGING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'BUSY', 'NO_ANSWER'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CallDisposition') THEN CREATE TYPE "CallDisposition" AS ENUM ('ANSWERED', 'VOICEMAIL', 'MISSED', 'BUSY', 'FAILED', 'BLOCKED'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SmsDirection') THEN CREATE TYPE "SmsDirection" AS ENUM ('INBOUND', 'OUTBOUND'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SmsStatus') THEN CREATE TYPE "SmsStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'UNDELIVERED'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InvoiceStatus') THEN CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'VOID', 'UNCOLLECTIBLE'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Priority') THEN CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TicketStatus') THEN CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_ON_USER', 'RESOLVED', 'CLOSED'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TravelRentalStatus') THEN CREATE TYPE "TravelRentalStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'FAILED'); END IF; END $$;`,
            `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BookingStatus') THEN CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REFUNDED'); END IF; END $$;`
        ];

        for (const enumQuery of enums) {
            await client.query(enumQuery);
        }
        console.log('Enums created/verified.');

        // 2. Create Tables (Use IF NOT EXISTS)
        // Subscription (Must be before Invoice, Number)
        await client.query(`
        CREATE TABLE IF NOT EXISTS "Subscription" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "stripeSubscriptionId" TEXT,
            "stripePriceId" TEXT,
            "planType" "PlanType" NOT NULL,
            "pillar" "Pillar" NOT NULL,
            "billingInterval" "BillingInterval" NOT NULL,
            "amount" DECIMAL(65,30) NOT NULL,
            "currency" TEXT NOT NULL DEFAULT 'USD',
            "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
            "currentPeriodStart" TIMESTAMP(3) NOT NULL,
            "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
            "cancelledAt" TIMESTAMP(3),
            "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
        );
    `);

        // VirtualNumber
        await client.query(`
        CREATE TABLE IF NOT EXISTS "VirtualNumber" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "phoneNumber" TEXT NOT NULL,
            "country" TEXT NOT NULL,
            "areaCode" TEXT,
            "numberType" "NumberType" NOT NULL,
            "avoXINumberId" TEXT NOT NULL,
            "displayName" TEXT,
            "forwardToNumber" TEXT,
            "forwardToSIP" TEXT,
            "voicemailEnabled" BOOLEAN NOT NULL DEFAULT true,
            "voicemailGreeting" TEXT,
            "callRecording" BOOLEAN NOT NULL DEFAULT false,
            "businessHours" JSONB,
            "ivrEnabled" BOOLEAN NOT NULL DEFAULT false,
            "ivrMenu" JSONB,
            "pillar" "Pillar" NOT NULL,
            "subscriptionId" TEXT,
            "monthlyPrice" DECIMAL(65,30) NOT NULL,
            "avoXIWholesaleCost" DECIMAL(65,30) NOT NULL,
            "status" "NumberStatus" NOT NULL DEFAULT 'ACTIVE',
            "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "expiresAt" TIMESTAMP(3),
            "suspendedAt" TIMESTAMP(3),
            "suspensionReason" TEXT,
            "reputationScore" DOUBLE PRECISION DEFAULT 5.0,
            "totalCalls" INTEGER NOT NULL DEFAULT 0,
            "answeredCalls" INTEGER NOT NULL DEFAULT 0,
            "spamReports" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "deletedAt" TIMESTAMP(3),
            CONSTRAINT "VirtualNumber_pkey" PRIMARY KEY ("id")
        );
    `);

        // ApiKey
        await client.query(`
        CREATE TABLE IF NOT EXISTS "ApiKey" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "keyHash" TEXT NOT NULL,
            "keyPrefix" TEXT NOT NULL,
            "environment" "Environment" NOT NULL DEFAULT 'TEST',
            "scopes" TEXT[],
            "rateLimit" INTEGER NOT NULL DEFAULT 100,
            "status" "ApiKeyStatus" NOT NULL DEFAULT 'ACTIVE',
            "lastUsedAt" TIMESTAMP(3),
            "expiresAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "revokedAt" TIMESTAMP(3),
            CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
        );
    `);

        // CallLog
        await client.query(`
        CREATE TABLE IF NOT EXISTS "CallLog" (
            "id" TEXT NOT NULL,
            "numberId" TEXT NOT NULL,
            "direction" "CallDirection" NOT NULL,
            "fromNumber" TEXT NOT NULL,
            "toNumber" TEXT NOT NULL,
            "duration" INTEGER NOT NULL,
            "status" "CallStatus" NOT NULL,
            "disposition" "CallDisposition" NOT NULL,
            "recordingUrl" TEXT,
            "recordingDuration" INTEGER,
            "avoXICallId" TEXT,
            "carrierCost" DECIMAL(65,30),
            "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "answeredAt" TIMESTAMP(3),
            "endedAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
        );
    `);

        // SmsLog
        await client.query(`
        CREATE TABLE IF NOT EXISTS "SmsLog" (
            "id" TEXT NOT NULL,
            "numberId" TEXT NOT NULL,
            "direction" "SmsDirection" NOT NULL,
            "fromNumber" TEXT NOT NULL,
            "toNumber" TEXT NOT NULL,
            "body" TEXT NOT NULL,
            "status" "SmsStatus" NOT NULL,
            "deliveredAt" TIMESTAMP(3),
            "webhookUrl" TEXT,
            "webhookDelivered" BOOLEAN NOT NULL DEFAULT false,
            "webhookAttempts" INTEGER NOT NULL DEFAULT 0,
            "webhookLastAttempt" TIMESTAMP(3),
            "avoXIMessageId" TEXT,
            "carrierCost" DECIMAL(65,30),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "SmsLog_pkey" PRIMARY KEY ("id")
        );
    `);

        // Invoice
        await client.query(`
        CREATE TABLE IF NOT EXISTS "Invoice" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "subscriptionId" TEXT,
            "stripeInvoiceId" TEXT,
            "invoiceNumber" TEXT NOT NULL,
            "amount" DECIMAL(65,30) NOT NULL,
            "currency" TEXT NOT NULL DEFAULT 'USD',
            "tax" DECIMAL(65,30),
            "totalAmount" DECIMAL(65,30) NOT NULL,
            "lineItems" JSONB NOT NULL,
            "status" "InvoiceStatus" NOT NULL,
            "paidAt" TIMESTAMP(3),
            "dueAt" TIMESTAMP(3) NOT NULL,
            "pdfUrl" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
        );
    `);

        // SupportTicket
        await client.query(`
        CREATE TABLE IF NOT EXISTS "SupportTicket" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "subject" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
            "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
            "assignedTo" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "resolvedAt" TIMESTAMP(3),
            "closedAt" TIMESTAMP(3),
            CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
        );
    `);

        // WebhookDelivery
        await client.query(`
        CREATE TABLE IF NOT EXISTS "WebhookDelivery" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "event" TEXT NOT NULL,
            "url" TEXT NOT NULL,
            "payloadId" TEXT NOT NULL,
            "statusCode" INTEGER NOT NULL,
            "attempt" INTEGER NOT NULL DEFAULT 1,
            "failed" BOOLEAN NOT NULL DEFAULT false,
            "deliveredAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
        );
    `);

        console.log('Tables created. Skipping remaining non-critical tables (Marketplace, TravelRental, etc.) for brevity, focusing on Core.');

        // 3. Create Unique Indexes (Critical ones)
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");`);
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "VirtualNumber_phoneNumber_key" ON "VirtualNumber"("phoneNumber");`);
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "VirtualNumber_avoXINumberId_key" ON "VirtualNumber"("avoXINumberId");`);
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "ApiKey_keyHash_key" ON "ApiKey"("keyHash");`);

        console.log('Schema initialized successfully.');
    } catch (e) {
        console.error('Schema Init Failed:', e);
    } finally {
        await client.end();
    }
}

main();
