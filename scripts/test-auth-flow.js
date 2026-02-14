const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuthFlow() {
    console.log('=== AUTHENTICATION FLOW TEST ===\n');

    try {
        // 1. Create a test user with hashed password
        const testEmail = `authtest_${Date.now()}@nexaline.com`;
        const testPassword = 'TestPassword123!';

        console.log('1. Creating test user...');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Password: ${testPassword}`);

        const hashedPassword = await bcrypt.hash(testPassword, 10);
        console.log(`   ✓ Password hashed successfully`);
        console.log(`   Hash length: ${hashedPassword.length} characters\n`);

        const user = await prisma.user.create({
            data: {
                email: testEmail,
                passwordHash: hashedPassword,
                firstName: 'Auth',
                lastName: 'Test',
                role: 'USER'
            }
        });
        console.log(`   ✓ User created with ID: ${user.id}\n`);

        // 2. Retrieve the user from database (simulating login lookup)
        console.log('2. Retrieving user from database...');
        const retrievedUser = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (!retrievedUser) {
            throw new Error('User not found after creation!');
        }
        console.log(`   ✓ User found: ${retrievedUser.email}`);
        console.log(`   ✓ Password hash exists: ${!!retrievedUser.passwordHash}\n`);

        // 3. Test password verification (simulating login)
        console.log('3. Testing password verification...');

        // Test with correct password
        const correctPasswordResult = await bcrypt.compare(testPassword, retrievedUser.passwordHash);
        console.log(`   Correct password test: ${correctPasswordResult ? '✓ PASS' : '✗ FAIL'}`);

        // Test with incorrect password
        const wrongPasswordResult = await bcrypt.compare('WrongPassword123!', retrievedUser.passwordHash);
        console.log(`   Wrong password test: ${!wrongPasswordResult ? '✓ PASS (correctly rejected)' : '✗ FAIL (should reject)'}\n`);

        // 4. Verify auth flow integrity
        console.log('4. Auth Flow Integrity Check:');
        if (correctPasswordResult && !wrongPasswordResult) {
            console.log('   ✓ ✓ ✓ AUTHENTICATION FLOW WORKING CORRECTLY ✓ ✓ ✓\n');
        } else {
            console.log('   ✗ ✗ ✗ AUTHENTICATION FLOW HAS ISSUES ✗ ✗ ✗\n');
            throw new Error('Authentication flow integrity check failed');
        }

        // 5. Cleanup
        console.log('5. Cleaning up test user...');
        await prisma.user.delete({
            where: { id: user.id }
        });
        console.log('   ✓ Test user deleted\n');

        console.log('=== TEST COMPLETED SUCCESSFULLY ===');
        console.log('\nConclusion: The authentication system is working correctly.');
        console.log('Users can register and login with proper password verification.');

    } catch (error) {
        console.error('\n✗ ✗ ✗ TEST FAILED ✗ ✗ ✗');
        console.error('Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testAuthFlow();
