const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdminUser() {
    console.log('=== ADMIN USER SETUP ===\n');

    const adminEmail = 'admin@nexaline.com';
    const adminPassword = 'AdminPassword123!';

    try {
        // Check if admin user already exists
        console.log('1. Checking if admin user exists...');
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            console.log(`   ✓ Admin user found with ID: ${existingUser.id}`);
            console.log(`   Updating password to ensure it's correct...\n`);

            // Update the password to ensure it's correct
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await prisma.user.update({
                where: { id: existingUser.id },
                data: { passwordHash: hashedPassword }
            });

            console.log('   ✓ Password updated successfully\n');
        } else {
            console.log('   Admin user not found. Creating new admin user...\n');

            // Create new admin user
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const newUser = await prisma.user.create({
                data: {
                    email: adminEmail,
                    passwordHash: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'ADMIN'
                }
            });

            console.log(`   ✓ Admin user created with ID: ${newUser.id}\n`);
        }

        // Verify the login credentials work
        console.log('2. Verifying login credentials...');
        const user = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (!user || !user.passwordHash) {
            throw new Error('User or password hash not found!');
        }

        const isPasswordValid = await bcrypt.compare(adminPassword, user.passwordHash);

        if (isPasswordValid) {
            console.log('   ✓ ✓ ✓ PASSWORD VERIFICATION SUCCESSFUL ✓ ✓ ✓\n');
            console.log('=== ADMIN USER READY ===');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('\nYou can now login at: http://localhost:3000/auth/signin');
        } else {
            throw new Error('Password verification failed!');
        }

    } catch (error) {
        console.error('\n✗ ✗ ✗ ERROR ✗ ✗ ✗');
        console.error('Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
