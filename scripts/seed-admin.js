const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const email = "admin@nexaline.com";
    const password = "AdminPassword123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: "ADMIN" // Ensure this matches enum string
        },
        create: {
            email,
            passwordHash: hashedPassword,
            firstName: "System",
            lastName: "Admin",
            role: "ADMIN",
            emailVerified: new Date(),
        }
    });

    console.log("Admin user created/updated:", user.email);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
