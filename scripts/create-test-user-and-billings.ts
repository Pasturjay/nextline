import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 creating test user and billing data...");

    const email = "test@nexaline.com";
    const password = "password123";
    const hashedPassword = await hash(password, 10);

    // 1. Create or Update User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: hashedPassword,
            firstName: "Test",
            lastName: "User",
            accountType: "BUSINESS",
            stripeCustomerId: `cus_${Math.random().toString(36).substring(7)}`,
            emailVerified: new Date(),
        },
    });

    console.log(`👤 User ready: ${user.email} (${user.id})`);

    // 2. Create active subscription
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

    // 3. Create Invoices
    await prisma.invoice.deleteMany({ where: { userId: user.id } }); // Clear old invoices for clean state

    const invoices = [
        { amount: 49.00, status: 'PAID', date: new Date() },
        { amount: 49.00, status: 'PAID', date: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
        { amount: 125.50, status: 'OPEN', date: new Date() }, // Usage overage
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
                lineItems: JSON.stringify([{ description: "Monthly Services", amount: inv.amount }]),
                dueAt: new Date(new Date().setDate(new Date().getDate() + 7)),
                createdAt: inv.date,
                paidAt: inv.status === 'PAID' ? inv.date : null
            }
        });
    }

    console.log(`✅ Created ${invoices.length} invoices`);
    console.log("🚀 Billing setup completed! Login with: test@nexaline.com / password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
