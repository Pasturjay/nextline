import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- POPULATING USER NAMES ---');
    const users = await prisma.user.findMany();

    for (const user of users) {
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        await prisma.user.update({
            where: { id: user.id },
            data: { name: fullName }
        });
        console.log(`Updated user ${user.email}: ${fullName}`);
    }
    console.log('All users updated.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
