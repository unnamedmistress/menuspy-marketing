const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const permitTypes = ['DECK', 'FENCE', 'ELECTRICAL', 'PLUMBING', 'HVAC', 'BUILDING'];
const locations = ['seattle_wa', 'austin_tx', 'miami_fl', 'denver_co', 'phoenix_az'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  await prisma.prediction.deleteMany();
  await prisma.permit.deleteMany();
  await prisma.historicalPermit.deleteMany();

  await prisma.permit.createMany({
    data: [
      {
        title: 'Backyard Deck Addition',
        description: '220 sqft raised deck with stairs',
        type: 'DECK',
        status: 'REVIEWING',
        estimatedDays: 16,
        estimatedCost: 12000,
        squareFootage: 220,
        jurisdiction: 'seattle_wa',
        submittedAt: new Date('2026-02-15T00:00:00.000Z'),
      },
      {
        title: 'EV Charger Install',
        description: 'Level 2 charger in garage',
        type: 'ELECTRICAL',
        status: 'SUBMITTED',
        estimatedDays: 8,
        estimatedCost: 1600,
        jurisdiction: 'seattle_wa',
        submittedAt: new Date('2026-03-01T00:00:00.000Z'),
      },
    ],
  });

  await prisma.prediction.createMany({
    data: [
      {
        permitType: 'DECK',
        confidence: 92,
        triggerType: 'description_analysis',
        requiredDocs: JSON.stringify(['Site Plan', 'Framing Details', 'Structural Notes']),
        estimatedDays: 14,
        rationale: 'Deck projects over 200 sqft in Seattle usually require structural review.',
        status: 'PENDING',
      },
      {
        permitType: 'ELECTRICAL',
        confidence: 84,
        triggerType: 'equipment_upgrade',
        requiredDocs: JSON.stringify(['Electrical Scope', 'Load Calculations', 'Contractor License']),
        estimatedDays: 7,
        rationale: 'EV charger circuits require electrical permit review.',
        status: 'PENDING',
      },
    ],
  });

  const rows = Array.from({ length: 100 }).map((_, idx) => ({
    permitType: permitTypes[idx % permitTypes.length],
    location: locations[idx % locations.length],
    squareFootage: randomInt(80, 900),
    complexity: randomInt(1, 10),
    daysToApproval: randomInt(3, 45),
    submissionMonth: randomInt(1, 12),
  }));

  await prisma.historicalPermit.createMany({ data: rows });

  console.log('Seeded demo permits, predictions, and 100 historical permits.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
