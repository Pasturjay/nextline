import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin(email: string, password: string) {
    console.log(`--- TESTING LOGIN FOR ${email} ---`);
    try {
        const normalizedEmail = email.toLowerCase();
        console.log(`Normalized email: ${normalizedEmail}`);

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!user) {
            console.log('User not found in DB');
            return;
        }

        console.log('User found in DB:', { id: user.id, email: user.email, role: user.role });

        if (!user.passwordHash) {
            console.log('User has no password hash');
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        console.log('Password valid:', isValid);

        if (isValid) {
            const userObject = {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
            };
            console.log('User object to be returned by satisfy/authorize:', userObject);

            // Re-verify findUnique with actual email string to be sure
            const reVerify = await prisma.user.findUnique({
                where: { email: user.email }
            });
            console.log('Re-verification successful:', !!reVerify);
        }
    } catch (error) {
        console.error('ERROR DURING LOGIN TEST:');
        console.error(error);
    }
}

testLogin('admin@nexaline.com', 'AdminPassword123!')
    .then(() => testLogin('Admin@nexaline.com', 'AdminPassword123!'))
    .finally(async () => {
        await prisma.$disconnect();
    });
