
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing Dashboard Queries...');

    // Simulated User ID (Admin)
    // I need to find the admin ID first.
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@nexaline.com' }
    });

    if (!admin) {
        console.error('Admin user not found!');
        return;
    }
    console.log(`Found Admin: ${admin.id}`);

    console.log('1. Active Numbers Count');
    const activeNumbers = await prisma.virtualNumber.count({
        where: {
            userId: admin.id,
            status: 'ACTIVE',
        }
    });
    console.log(`Result: ${activeNumbers}`);

    console.log('2. Active Rentals Count');
    const activeRentals = await prisma.travelRental.count({
        where: {
            userId: admin.id,
            status: 'ACTIVE',
        }
    });
    console.log(`Result: ${activeRentals}`);

    console.log('3. API Usage (Calls + SMS)');
    const callCount = await prisma.callLog.count({
        where: { number: { userId: admin.id } }
    });
    const smsCount = await prisma.smsLog.count({
        where: { number: { userId: admin.id } }
    });
    console.log(`Result: ${callCount + smsCount}`);

    console.log('Dashboard Queries Verified.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
