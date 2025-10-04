import prisma from '../lib/prisma.js';

export interface CreateInboundCallData {
  outcome: 'transferred' | 'canceled';
  caller_sentiment: 'positive' | 'neutral' | 'negative';
  carrier_name?: string;
  mc_number?: number;
  notes?: string;
}

export const createInboundCall = async (data: CreateInboundCallData) => {
  try {
    return await prisma.inboundCall.create({
      data: {
        outcome: data.outcome,
        caller_sentiment: data.caller_sentiment,
        carrier_name: data.carrier_name,
        mc_number: data.mc_number,
        notes: data.notes,
      },
    });
  } catch (error) {
    console.error('❌ Database error in createInboundCall:', {
      data,
      error,
    });
    throw { message: 'Failed to create inbound call record', statusCode: 500 };
  }
};

export const getAnalytics = async () => {
  try {
    // Get total count
    const totalCalls = await prisma.inboundCall.count();

    // Group by month - using raw SQL through Prisma for date extraction
    const byMonth = await prisma.$queryRaw<
      Array<{ month: string; year: number; calls: bigint }>
    >`
      SELECT 
        TO_CHAR(created_at, 'Month') as month,
        EXTRACT(YEAR FROM created_at)::integer as year,
        COUNT(*)::integer as calls
      FROM inbound_calls
      GROUP BY TO_CHAR(created_at, 'Month'), EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(YEAR FROM created_at) DESC, EXTRACT(MONTH FROM created_at) DESC
      LIMIT 12
    `;

    // Group by sentiment
    const sentimentData = await prisma.inboundCall.groupBy({
      by: ['caller_sentiment'],
      _count: {
        caller_sentiment: true,
      },
    });

    // Group by outcome
    const outcomeData = await prisma.inboundCall.groupBy({
      by: ['outcome'],
      _count: {
        outcome: true,
      },
    });

    // Group by carrier (top 10)
    const carrierData = await prisma.inboundCall.groupBy({
      by: ['carrier_name'],
      _count: {
        carrier_name: true,
      },
      where: {
        carrier_name: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          carrier_name: 'desc',
        },
      },
      take: 10,
    });

    // Format the response
    const bySentiment = sentimentData.map((item) => ({
      sentiment: item.caller_sentiment,
      count: item._count.caller_sentiment,
      percentage:
        totalCalls > 0
          ? Math.round((item._count.caller_sentiment / totalCalls) * 1000) / 10
          : 0,
    }));

    const byOutcome = outcomeData.map((item) => ({
      outcome: item.outcome,
      count: item._count.outcome,
      percentage:
        totalCalls > 0
          ? Math.round((item._count.outcome / totalCalls) * 1000) / 10
          : 0,
    }));

    const byCarrier = carrierData.map((item) => ({
      carrier_name: item.carrier_name || 'Unknown',
      calls: item._count.carrier_name,
    }));

    const formattedByMonth = byMonth.map((item) => ({
      month: item.month.trim(),
      year: item.year,
      calls: Number(item.calls),
    }));

    return {
      summary: {
        total_calls: totalCalls,
        period: 'all_time',
        last_updated: new Date().toISOString(),
      },
      by_month: formattedByMonth,
      by_sentiment: bySentiment,
      by_outcome: byOutcome,
      by_carrier: byCarrier,
    };
  } catch (error) {
    console.error('❌ Database error in getAnalytics:', error);
    throw { message: 'Failed to fetch analytics data', statusCode: 500 };
  }
};
