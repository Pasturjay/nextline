import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@nexaline.com';
    const testPassword = 'AdminPassword123!';

    console.log(`--- PASSWORD VERIFICATION FOR ${email} ---`);
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.passwordHash) {
        console.log('User or password hash not found');
        return;
    }

    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    console.log('Password verification result:', isValid);
    console.log('Stored Hash:', user.passwordHash);

    // Also try with lower rounds to see if it makes a difference (it shouldn't for compare)
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('Newly generated hash (10 rounds):', newHash);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
