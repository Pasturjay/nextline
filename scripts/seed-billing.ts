import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding billing data...");

    // 1. Get the most recent user
    const user = await prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
    });

    if (!user) {
        console.error("❌ No users found. Please create a user first.");
        process.exit(1);
    }

    console.log(`👤 Found user: ${user.email} (${user.id})`);

    // 2. Update User with Stripe Customer ID if missing
    if (!user.stripeCustomerId) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                stripeCustomerId: `cus_${Math.random().toString(36).substring(7)}`,
                accountType: 'BUSINESS'
            },
        });
        console.log("✅ Updated user with Stripe Customer ID");
    }

    // 3. Create active subscription
    const existingSub = await prisma.subscription.findFirst({
        where: { userId: user.id, status: 'ACTIVE' }
    });

    if (!existingSub) {
        await prisma.subscription.create({
            data: {
                userId: user.id,
                stripeSubscriptionId: `sub_${Math.random().toString(36).substring(7)}`,
                planType: 'OTP_GROWTH',
                pillar: 'OTP_VERIFY',
                billingInterval: 'MONTHLY',
                amount: 49.00,
                currency: 'USD',
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            }
        });
        console.log("✅ Created active OTP Growth subscription");
    } else {
        console.log("ℹ️ User already has an active subscription");
    }

    // 4. Create Invoices
    const invoices = [
        { amount: 49.00, status: 'PAID', date: new Date() },
        { amount: 49.00, status: 'PAID', date: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
        { amount: 15.00, status: 'OPEN', date: new Date() }, // Usage overage
    ];

    for (const inv of invoices) {
        await prisma.invoice.create({
            data: {
                userId: user.id,
                amount: inv.amount,
                totalAmount: inv.amount,
                currency: 'USD',
                status: inv.status as any,
                invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
                lineItems: JSON.stringify([{ description: "Monthly Subscription", amount: inv.amount }]),
                dueAt: new Date(new Date().setDate(new Date().getDate() + 7)),
                createdAt: inv.date,
                paidAt: inv.status === 'PAID' ? inv.date : null
            }
        });
    }

    console.log(`✅ Created ${invoices.length} invoices`);
    console.log("🚀 Billing seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
