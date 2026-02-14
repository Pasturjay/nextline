const { Client } = require('pg');
const { hash } = require('bcryptjs');
require('dotenv').config();

async function main() {
    // Use connection string from env
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('DATABASE_URL not found in .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();

        const email = 'admin@nexaline.com';
        const password = 'AdminPassword123!';
        const hashedPassword = await hash(password, 12);

        // Check if user exists
        const res = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);

        if (res.rows.length > 0) {
            console.log('Admin user already exists.');
        } else {
            // Insert new user
            // Note: Adjust columns based on schema.prisma:
            // id, email, passwordHash, firstName, lastName, accountType, emailVerified, twoFactorEnabled, createdAt, ...
            // We'll use defaults for most.

            const insertQuery = `
        INSERT INTO "User" (
          "id", "email", "passwordHash", "firstName", "lastName", "accountType", "emailVerified", "twoFactorEnabled", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), $1, $2, 'Admin', 'User', 'AGENCY', NOW(), false, NOW(), NOW()
        ) RETURNING id, email
      `;

            // Note: gen_random_uuid() requires pgcrypto, but usually uuid-ossp or similar is enabled. 
            // If not, we can generate UUID in JS.
            // Let's generate UUID in JS to be safe.
            const { v4: uuidv4 } = require('uuid'); // We might not have uuid installed, so let's check.
            // Actually, let's use a simple random string or let DB handle it if @default(uuid()) means it's handled by Prisma? 
            // Prisma @default(uuid()) usually implies client-side generation OR db-side extension.
            // PostgreSQL doesn't have uuid() by default without extensions.
            // I'll try to use a static UUID or install uuid.

            // Better: Install uuid
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

// main();
// Wait, I need uuid.
