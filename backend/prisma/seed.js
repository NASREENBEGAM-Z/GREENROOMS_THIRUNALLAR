const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.room.createMany({
        data: [
            {
                name: 'Family Suite (A/C)',
                description: 'Spacious family suite with air conditioning. Limit 6 adults + children infinite.',
                price: 1799,
                // features: ['Air Conditioning', 'Family Suite', 'Attached Bathroom', 'TV', 'WiFi'],
            },
            {
                name: 'Family Suite (Non A/C)',
                description: 'Spacious family suite. Limit 6 adults + children infinite.',
                price: 1799,
                // features: ['Family Suite', 'Attached Bathroom', 'TV', 'WiFi', 'Fan'],
            },
            {
                name: 'Single Cot (A/C)',
                description: 'Cozy single cot room with air conditioning. 3 adults maximum and 2 children.',
                price: 999,
                // features: ['Air Conditioning', 'Single Cot', 'Attached Bathroom', 'TV', 'WiFi'],
            },
            {
                name: 'Single Cot (Non A/C)',
                description: 'Comfortable single cot room. 3 adults maximum and 2 children.',
                price: 999,
                // features: ['Single Cot', 'Attached Bathroom', 'TV', 'WiFi', 'Fan'],
            },
        ],
        skipDuplicates: true, // Prevents duplicate entries if you run the script multiple times
    });
    console.log('Rooms seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 