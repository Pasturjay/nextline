const { Client } = require('pg');
const { hash } = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Session Pooler (Port 5432)
const connectionString = 'postgresql://postgres.ecgrsffcndozeztdfjpi:Game2026%40421@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

console.log('Attempting connection...');

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase in many environments
});

async function main() {
    try {
        await client.connect();
        console.log('Connected successfully to Supabase (Port 5432)!');

        // 1. Create Enum 'AccountType'
        try {
            await client.query(`CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'DEVELOPER', 'AGENCY');`);
            console.log("Created Enum 'AccountType'");
        } catch (e) {
            if (e.code === '42710') console.log("Enum 'AccountType' already exists");
            else console.warn("Enum creation warning:", e.message);
        }

        // 2. Create Table 'User'
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "passwordHash" TEXT,
            "firstName" TEXT NOT NULL,
            "lastName" TEXT NOT NULL,
            "accountType" "AccountType" NOT NULL DEFAULT 'INDIVIDUAL',
            "emailVerified" TIMESTAMP(3),
            "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
            "twoFactorSecret" TEXT,
            "stripeCustomerId" TEXT,
            "paypalEmail" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "lastLoginAt" TIMESTAMP(3),
            "timezone" TEXT DEFAULT 'UTC',
            "currency" TEXT DEFAULT 'USD',
            "locale" TEXT DEFAULT 'en',
            "webhookUrl" TEXT,
            "webhookSecret" TEXT,
            "pushToken" TEXT,
            "deletedAt" TIMESTAMP(3),
            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
    `;
        await client.query(createTableQuery);
        console.log("Ensured Table 'User' exists");

        // 3. Create Indexes
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`);
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId");`);
        console.log("Ensured Indexes exist");

        // 4. Create Admin User
        const email = 'admin@nexaline.com';
        const password = 'admin';
        const hashedPassword = await hash(password, 12);

        // Check if user exists
        const res = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);

        if (res.rows.length > 0) {
            console.log('Admin user already exists.');
        } else {
            const id = uuidv4();
            console.log('Creating admin user...');
            const insertQuery = `
        INSERT INTO "User" (
          "id", "email", "passwordHash", "firstName", "lastName", "accountType", "emailVerified", "twoFactorEnabled", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, 'Admin', 'User', 'AGENCY', NOW(), false, NOW(), NOW()
        ) RETURNING id
      `;

            await client.query(insertQuery, [id, email, hashedPassword]);
            console.log('Admin user created successfully.');
        }
    } catch (e) {
        console.error('Operation failed:', e);
        // Be explicit about error codes
        if (e.code) console.error('Error code:', e.code);
    } finally {
        await client.end();
    }
}

main();
