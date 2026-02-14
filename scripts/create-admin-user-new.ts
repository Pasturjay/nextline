import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3] || "admin123";

    if (!email) {
        console.error("❌ Usage: npx tsx scripts/create-admin-user.ts <email> [password]");
        console.error("   Example: npx tsx scripts/create-admin-user.ts admin@nexaline.com mypassword");
        process.exit(1);
    }

    console.log(`🔍 Checking for existing user: ${email}`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        // Promote existing user to admin
        if (existingUser.role === 'ADMIN') {
            console.log("ℹ️  User is already an admin");
            return;
        }

        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });

        console.log(`✅ User ${email} promoted to ADMIN`);
    } else {
        // Create new admin user
        const hashedPassword = await hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                firstName: "Admin",
                lastName: "User",
                role: "ADMIN",
                accountType: "BUSINESS",
                emailVerified: new Date(),
            },
        });

        console.log(`✅ Admin user created: ${email}`);
        console.log(`   Password: ${password}`);
    }

    console.log("\n🚀 Admin user ready!");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
