import { PrismaClient, EquipmentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  EQUIPMENT_CONFIG,
  NOTES_TEMPLATES,
  MAJOR_CITIES,
} from './constants/equipment.js';
import cityData from './constants/cities.json' assert { type: 'json' };

const prisma = new PrismaClient();
const BASE_RATE_PER_MILE = 2.5;
const LOAD_COUNT = 120;

// Simple distance lookup - fallback to random if not found
function getDistance(origin: string, destination: string): number {
  const distances = cityData.distances as any;
  return (
    distances[origin]?.[destination] ||
    distances[destination]?.[origin] ||
    Math.floor(Math.random() * 1500) + 300
  );
}

// Calculate realistic rate
function calculateRate(
  miles: number,
  equipmentType: EquipmentType,
  origin: string,
  destination: string,
): number {
  const baseRate = miles * BASE_RATE_PER_MILE;
  const equipmentMultiplier = EQUIPMENT_CONFIG.rateMultipliers[equipmentType];
  const cityMultiplier =
    MAJOR_CITIES.includes(origin.toLowerCase()) ||
    MAJOR_CITIES.includes(destination.toLowerCase())
      ? 1.1
      : 1.0;
  const randomFactor = 0.9 + Math.random() * 0.2;

  return (
    Math.round(
      baseRate * equipmentMultiplier * cityMultiplier * randomFactor * 100,
    ) / 100
  );
}

// Generate realistic pickup/delivery times
function generateTimes(miles: number) {
  const now = new Date();
  const pickupDate = new Date(
    now.getTime() + Math.random() * (19 * 24 * 60 * 60 * 1000),
  );

  const pickupStartHour = 8 + Math.floor(Math.random() * 8);
  const pickupStart = new Date(pickupDate);
  pickupStart.setHours(pickupStartHour, Math.floor(Math.random() * 60), 0, 0);

  const pickupEnd = new Date(pickupStart);
  pickupEnd.setHours(
    pickupStartHour + 4 + Math.floor(Math.random() * 4),
    0,
    0,
    0,
  );

  const transitDays = Math.ceil(miles / 55 / 11);
  const deliveryDate = new Date(pickupStart);
  deliveryDate.setDate(deliveryDate.getDate() + transitDays);

  const deliveryStartHour = 8 + Math.floor(Math.random() * 6);
  const deliveryStart = new Date(deliveryDate);
  deliveryStart.setHours(
    deliveryStartHour,
    Math.floor(Math.random() * 60),
    0,
    0,
  );

  const deliveryEnd = new Date(deliveryStart);
  deliveryEnd.setHours(
    deliveryStartHour + 2 + Math.floor(Math.random() * 4),
    0,
    0,
    0,
  );

  return { pickupStart, pickupEnd, deliveryStart, deliveryEnd };
}

// Generate single load
function generateLoad() {
  const cities = cityData.cities as string[];
  const [origin, destination] =
    cities[Math.floor(Math.random() * cities.length)] ===
    cities[Math.floor(Math.random() * cities.length)]
      ? [cities[0], cities[1]]
      : [
          cities[Math.floor(Math.random() * cities.length)],
          cities[Math.floor(Math.random() * cities.length)],
        ];

  if (origin === destination) return generateLoad(); // Retry if same city

  const equipmentType = Object.values(EquipmentType)[
    Math.floor(Math.random() * 5)
  ] as EquipmentType;
  const miles = getDistance(origin, destination);
  const rate = calculateRate(miles, equipmentType, origin, destination);
  const times = generateTimes(miles);

  const commodities = EQUIPMENT_CONFIG.commodities[equipmentType];
  const commodity = commodities[Math.floor(Math.random() * commodities.length)];
  const dimensions = EQUIPMENT_CONFIG.dimensions[equipmentType];
  const dimension = dimensions[Math.floor(Math.random() * dimensions.length)];
  const weightRange = EQUIPMENT_CONFIG.weights[equipmentType];
  const weight = Math.floor(
    weightRange.min + Math.random() * (weightRange.max - weightRange.min),
  );

  return {
    load_id: Math.floor(100000 + Math.random() * 900000).toString(),
    origin_city: origin,
    destination_city: destination,
    pickup_start: times.pickupStart,
    pickup_end: times.pickupEnd,
    delivery_start: times.deliveryStart,
    delivery_end: times.deliveryEnd,
    equipment_type: equipmentType,
    loadboard_rate: new Decimal(rate),
    notes:
      Math.random() > 0.3
        ? NOTES_TEMPLATES[Math.floor(Math.random() * NOTES_TEMPLATES.length)]
        : null,
    weight: new Decimal(weight),
    commodity_type: commodity,
    num_of_pieces: Math.floor(Math.random() * 100) + 1,
    miles: new Decimal(miles),
    dimensions: dimension,
  };
}

// Main seeding function
async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    console.log('🗑️  Clearing existing loads...');
    await prisma.load.deleteMany({});

    console.log(`📦 Generating ${LOAD_COUNT} load records...`);
    const loads = Array.from({ length: LOAD_COUNT }, () => generateLoad());

    console.log('💾 Inserting loads into database...');
    await prisma.load.createMany({ data: loads });

    console.log(`✅ Successfully seeded database with ${loads.length} loads!`);

    // Show sample
    const samples = await prisma.load.findMany({
      take: 3,
      select: {
        load_id: true,
        origin_city: true,
        destination_city: true,
        miles: true,
        equipment_type: true,
        loadboard_rate: true,
        commodity_type: true,
      },
    });

    console.log('\n📋 Sample records:');
    samples.forEach((load, i) => {
      console.log(
        `${i + 1}. ${load.origin_city} → ${load.destination_city} (${load.miles} mi, ${load.equipment_type}, $${load.loadboard_rate})`,
      );
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(console.error);
