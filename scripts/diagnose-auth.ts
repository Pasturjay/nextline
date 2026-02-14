import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function diagnoseAuth() {
    console.log('🔍 NextAuth Admin Login Diagnostic\n');
    console.log('='.repeat(50));

    try {
        // 1. Check database connection
        console.log('\n1️⃣  Database Connection Test');
        await prisma.$connect();
        console.log('   ✅ Database connected successfully');

        // 2. Find admin user
        console.log('\n2️⃣  Admin User Lookup');
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@nexaline.com' },
        });

        if (!admin) {
            console.log('   ❌ Admin user not found!');
            console.log('   💡 Run: npx tsx scripts/create-admin-user-new.ts admin@nexaline.com admin123');
            return;
        }

        console.log('   ✅ Admin user found');
        console.log('   📧 Email:', admin.email);
        console.log('   👤 Name:', `${admin.firstName} ${admin.lastName}`);
        console.log('   🔑 Role:', admin.role);
        console.log('   ✉️  Email Verified:', admin.emailVerified ? '✅ Yes' : '❌ No');
        console.log('   🗑️  Deleted:', admin.deletedAt ? '❌ Yes' : '✅ No');
        console.log('   🔐 Has Password:', admin.passwordHash ? '✅ Yes' : '❌ No');

        // 3. Test password
        console.log('\n3️⃣  Password Verification');
        const testPassword = 'admin123';

        if (!admin.passwordHash) {
            console.log('   ❌ No password hash found!');
            console.log('   💡 Setting password...');
            const hash = await bcrypt.hash(testPassword, 10);
            await prisma.user.update({
                where: { id: admin.id },
                data: { passwordHash: hash }
            });
            console.log('   ✅ Password set successfully!');
        } else {
            const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
            console.log('   🔐 Testing password: admin123');
            console.log('   Result:', isValid ? '✅ VALID' : '❌ INVALID');

            if (!isValid) {
                console.log('   💡 Resetting password...');
                const hash = await bcrypt.hash(testPassword, 10);
                await prisma.user.update({
                    where: { id: admin.id },
                    data: { passwordHash: hash }
                });
                console.log('   ✅ Password reset successfully!');
            }
        }

        // 4. Check environment variables
        console.log('\n4️⃣  Environment Variables');
        console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ NOT SET');
        console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ NOT SET');
        console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');

        // 5. Test auth flow simulation
        console.log('\n5️⃣  Auth Flow Simulation');
        console.log('   Simulating NextAuth credentials provider...');

        const credentials = {
            email: 'admin@nexaline.com',
            password: 'admin123'
        };

        const user = await prisma.user.findUnique({
            where: { email: credentials.email }
        });

        if (!user) {
            console.log('   ❌ User not found');
            return;
        }

        if (!user.passwordHash) {
            console.log('   ❌ No password hash');
            return;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
            console.log('   ❌ Invalid password');
            return;
        }

        console.log('   ✅ Auth flow would succeed!');
        console.log('   📦 Would return user object:');
        console.log('      {');
        console.log(`        id: "${user.id}",`);
        console.log(`        email: "${user.email}",`);
        console.log(`        name: "${user.firstName} ${user.lastName}",`);
        console.log(`        role: "${user.role}"`);
        console.log('      }');

        // 6. Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 DIAGNOSTIC SUMMARY');
        console.log('='.repeat(50));
        console.log('✅ Database: Connected');
        console.log('✅ Admin User: Found');
        console.log('✅ Password: Valid');
        console.log('✅ Auth Flow: Should work');
        console.log('\n🎯 Login Credentials:');
        console.log('   Email: admin@nexaline.com');
        console.log('   Password: admin123');
        console.log('   URL: http://localhost:3000/auth/signin');
        console.log('\n💡 If login still fails, check:');
        console.log('   1. Browser console for errors');
        console.log('   2. Network tab for failed API calls');
        console.log('   3. Server logs for auth errors');
        console.log('   4. Clear browser cookies and try again');

    } catch (error) {
        console.error('\n❌ Error during diagnostic:', error);
    } finally {
        await prisma.$disconnect();
    }
}

diagnoseAuth();
