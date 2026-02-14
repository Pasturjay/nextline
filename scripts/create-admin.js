const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@nexaline.com';
    const password = 'AdminPassword123!';
    const hashedPassword = await hash(password, 12);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                passwordHash: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                accountType: 'AGENCY', // Giving high-level access
                emailVerified: new Date(),
            },
        });

        console.log('Admin user created/verified:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
