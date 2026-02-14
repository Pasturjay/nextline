import { PrismaClient } from '@prisma/client';

// Try connecting to a default local postgres
const databaseUrl = 'postgresql://postgres:postgres@localhost:5432/postgres';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

async function main() {
    try {
        console.log(`Attempting to connect to ${databaseUrl}...`);
        await prisma.$connect();
        console.log('Connected successfully to default local Postgres!');

        // Check if we can query
        // const result = await prisma.$queryRaw`SELECT 1`;
        // console.log('Query result:', result);

        await prisma.$disconnect();
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    }
}

main();
