import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- ADMIN USER DEBUG ---');
    const user = await prisma.user.findUnique({
        where: { email: 'admin@nexaline.com' },
    });

    if (user) {
        console.log({
            id: user.id,
            email: user.email,
            role: user.role,
            hasPasswordHash: !!user.passwordHash,
            passwordHashSnippet: user.passwordHash ? user.passwordHash.substring(0, 10) + '...' : 'null',
            deletedAt: user.deletedAt
        });
    } else {
        console.log('User admin@nexaline.com NOT FOUND');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
