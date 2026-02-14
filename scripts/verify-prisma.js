
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Initializing Prisma Client...');
    const prisma = new PrismaClient();

    try {
        console.log('Connecting...');
        const userCount = await prisma.user.count();
        console.log(`Success! User count: ${userCount}`);
    } catch (e) {
        console.error('Prisma Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
