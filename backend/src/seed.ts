import {
  PrismaClient,
  EquipmentType,
  CallOutcome,
  CallerSentiment,
  Prisma,
} from '@prisma/client';
import {
  EQUIPMENT_CONFIG,
  NOTES_TEMPLATES,
  MAJOR_CITIES,
} from './constants/equipment.js';
import cityData from './constants/cities.json' assert { type: 'json' };

const prisma = new PrismaClient();
const BASE_RATE_PER_MILE = 2.5;
const LOAD_COUNT = 120;
const INBOUND_CALL_COUNT = 100;

// Carrier companies with unique MC numbers (1:1 mapping)
const CARRIER_COMPANIES = [
  { name: 'swift transportation', mc_number: 823390 },
  { name: 'werner enterprises', mc_number: 137905 },
  { name: 'schneider national', mc_number: 172463 },
  { name: 'j.b. hunt transport', mc_number: 109695 },
  { name: 'knight-swift transport', mc_number: 640393 },
  { name: 'landstar system', mc_number: 82488 },
  { name: 'old dominion freight', mc_number: 139658 },
  { name: 'yrc worldwide', mc_number: 132666 },
  { name: 'estes express lines', mc_number: 104306 },
  { name: 'xpo logistics', mc_number: 574801 },
  { name: 'covenant transport', mc_number: 69556 },
  { name: 'pam transport', mc_number: 108595 },
  { name: 'usa truck', mc_number: 73655 },
  { name: 'marten transport', mc_number: 93697 },
  { name: 'heartland express', mc_number: 121841 },
];

const CALL_NOTES = [
  'Driver available for immediate dispatch',
  'Requesting rate confirmation',
  'Need detention time details',
  'Asking about fuel surcharge',
  'Interested in backhaul opportunities',
  'Driver prefers Midwest routes',
  'Team drivers available',
  'Has hazmat certification',
  'Preferred carrier - good history',
  'New carrier - first load',
  'Needs updated rate con sent',
  'Equipment available in 2 hours',
  'Driver wants home time consideration',
  'Asking about payment terms',
  'Interested in dedicated lanes',
];

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

// Generate single inbound call
function generateInboundCall(index: number) {
  // 75% transferred, 25% canceled
  const outcome: CallOutcome =
    index < 75 ? CallOutcome.transferred : CallOutcome.canceled;

  // 80% positive, distribute remaining 20% between neutral and negative
  let sentiment: CallerSentiment;
  if (index < 80) {
    sentiment = CallerSentiment.positive;
  } else if (index < 90) {
    sentiment = CallerSentiment.neutral;
  } else {
    sentiment = CallerSentiment.negative;
  }

  // Randomly assign a carrier company
  const carrier =
    CARRIER_COMPANIES[Math.floor(Math.random() * CARRIER_COMPANIES.length)];

  // 85% of calls have notes
  const notes =
    Math.random() > 0.15
      ? CALL_NOTES[Math.floor(Math.random() * CALL_NOTES.length)]
      : null;

  return {
    outcome,
    caller_sentiment: sentiment,
    carrier_name: carrier.name,
    mc_number: carrier.mc_number,
    notes,
  };
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
    loadboard_rate: new Prisma.Decimal(rate),
    notes:
      Math.random() > 0.3
        ? NOTES_TEMPLATES[Math.floor(Math.random() * NOTES_TEMPLATES.length)]
        : null,
    weight: new Prisma.Decimal(weight),
    commodity_type: commodity,
    num_of_pieces: Math.floor(Math.random() * 100) + 1,
    miles: new Prisma.Decimal(miles),
    dimensions: dimension,
  };
}

// Main seeding function
async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    console.log('🗑️  Clearing existing data...');
    await prisma.inboundCall.deleteMany({});
    await prisma.load.deleteMany({});

    // Seed Inbound Calls
    console.log(`📞 Generating ${INBOUND_CALL_COUNT} inbound call records...`);
    const inboundCalls = Array.from({ length: INBOUND_CALL_COUNT }, (_, i) =>
      generateInboundCall(i),
    );

    console.log('💾 Inserting inbound calls into database...');
    await prisma.inboundCall.createMany({ data: inboundCalls });

    console.log(`✅ Successfully seeded ${inboundCalls.length} inbound calls!`);

    // Seed Loads
    console.log(`📦 Generating ${LOAD_COUNT} load records...`);
    const loads = Array.from({ length: LOAD_COUNT }, () => generateLoad());

    console.log('💾 Inserting loads into database...');
    await prisma.load.createMany({ data: loads });

    console.log(`✅ Successfully seeded ${loads.length} loads!`);

    // Show inbound call samples and stats
    const callSamples = await prisma.inboundCall.findMany({
      take: 3,
      select: {
        call_id: true,
        outcome: true,
        caller_sentiment: true,
        carrier_name: true,
        mc_number: true,
      },
    });

    const transferredCount = await prisma.inboundCall.count({
      where: { outcome: CallOutcome.transferred },
    });
    const positiveCount = await prisma.inboundCall.count({
      where: { caller_sentiment: CallerSentiment.positive },
    });
    const uniqueCarriers = await prisma.inboundCall.groupBy({
      by: ['carrier_name'],
    });

    console.log('\n📊 Inbound Call Statistics:');
    console.log(
      `   • Transferred: ${transferredCount}/${INBOUND_CALL_COUNT} (${((transferredCount / INBOUND_CALL_COUNT) * 100).toFixed(1)}%)`,
    );
    console.log(
      `   • Positive Sentiment: ${positiveCount}/${INBOUND_CALL_COUNT} (${((positiveCount / INBOUND_CALL_COUNT) * 100).toFixed(1)}%)`,
    );
    console.log(`   • Unique Carriers: ${uniqueCarriers.length}`);

    console.log('\n📋 Sample Inbound Calls:');
    callSamples.forEach((call, i) => {
      console.log(
        `${i + 1}. ${call.carrier_name} (${call.mc_number}) - ${call.outcome}, ${call.caller_sentiment}`,
      );
    });

    // Show load samples
    const loadSamples = await prisma.load.findMany({
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

    console.log('\n📋 Sample Loads:');
    loadSamples.forEach((load, i) => {
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
