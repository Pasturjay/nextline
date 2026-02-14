import { prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function testAdminLogin() {
    try {
        console.log('🔍 Testing admin login...\n');

        const email = 'admin@nexaline.com';
        const password = 'admin123';

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                passwordHash: true,
                emailVerified: true,
                deletedAt: true,
            }
        });

        if (!user) {
            console.log('❌ User not found!');
            return;
        }

        console.log('✅ User found:');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Name:', `${user.firstName} ${user.lastName}`);
        console.log('   Role:', user.role);
        console.log('   Email Verified:', user.emailVerified);
        console.log('   Deleted:', user.deletedAt ? 'Yes' : 'No');
        console.log('   Has Password Hash:', user.passwordHash ? 'Yes' : 'No');

        if (!user.passwordHash) {
            console.log('\n❌ User has no password hash!');
            return;
        }

        // Test password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        console.log('\n🔐 Password test:');
        console.log('   Password:', password);
        console.log('   Valid:', isValid ? '✅ YES' : '❌ NO');

        if (!isValid) {
            console.log('\n⚠️  Password does not match! Resetting password...');
            const newHash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: newHash }
            });
            console.log('✅ Password reset successfully!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAdminLogin();
