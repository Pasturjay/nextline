const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- STRICT NUMBER LIFECYCLE VERIFICATION ---');

    // 1. Setup Test User
    const email = `lifecycle_test_${Date.now()}@nexaline.com`;
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: 'test',
            firstName: 'Test',
            lastName: 'User',
            role: 'USER'
        }
    });
    console.log(`1. Created Test User: ${user.id}`);

    // 2. Provision Number (Simulate API logic)
    const phoneNumber = `+1555${Math.floor(Math.random() * 10000000)}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create Subscription
    const subscription = await prisma.subscription.create({
        data: {
            userId: user.id,
            stripeSubscriptionId: `sub_test_${Date.now()}`,
            planType: "BASIC_NUMBER",
            pillar: "RESELLER",
            billingInterval: "MONTHLY",
            amount: 5.00,
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: expiresAt,
        }
    });

    // Create Number linked to Sub
    const number = await prisma.virtualNumber.create({
        data: {
            userId: user.id,
            subscriptionId: subscription.id,
            phoneNumber,
            country: 'US',
            numberType: "LOCAL",
            status: "ACTIVE",
            pillar: "RESELLER",
            monthlyPrice: 5.00,
            avoXIWholesaleCost: 1.00,
            avoXINumberId: `avoxi_test_${Date.now()}`,
            expiresAt: null, // Standard numbers don't expire unless cancelled
            autoRenew: true
        }
    });
    console.log(`2. Provisioned Number: ${number.phoneNumber} (Linked to Sub: ${subscription.id})`);
    console.log(`   - AutoRenew: ${number.autoRenew}`);
    console.log(`   - Status: ${number.status}`);

    if (!number.autoRenew || number.status !== 'ACTIVE') {
        throw new Error('Provisioning check failed: AutoRenew should be true and Status ACTIVE');
    }

    // 3. Simulate Termination (API DELETE Logic)
    console.log('3. Simulating Termination...');

    // a. Update Number
    const updatedNumber = await prisma.virtualNumber.update({
        where: { id: number.id },
        data: {
            status: "CANCELLED",
            autoRenew: false,
            expiresAt: new Date()
        }
    });

    // b. Update Subscription
    const updatedSub = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
            status: "CANCELLED",
            cancelledAt: new Date()
        }
    });

    console.log(`   - Updated Number Status: ${updatedNumber.status}`);
    console.log(`   - Updated Number AutoRenew: ${updatedNumber.autoRenew}`);
    console.log(`   - Updated Sub Status: ${updatedSub.status}`);

    if (updatedNumber.status !== 'CANCELLED' || updatedNumber.autoRenew !== false) {
        throw new Error('Termination check failed: Number should be CANCELLED and AutoRenew false');
    }
    if (updatedSub.status !== 'CANCELLED') {
        throw new Error('Termination check failed: Subscription should be CANCELLED');
    }

    console.log('--- VERIFICATION SUCCESSFUL ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
