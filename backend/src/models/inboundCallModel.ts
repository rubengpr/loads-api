import prisma from '../lib/prisma.js';

export interface CreateInboundCallData {
  outcome: 'transferred' | 'canceled';
  caller_sentiment: 'positive' | 'neutral' | 'negative';
  carrier_name?: string;
  notes?: string;
}

export const createInboundCall = async (data: CreateInboundCallData) => {
  try {
    return await prisma.inboundCall.create({
      data: {
        outcome: data.outcome,
        caller_sentiment: data.caller_sentiment,
        carrier_name: data.carrier_name,
        notes: data.notes,
      },
    });
  } catch (error) {
    throw { message: 'Failed to create inbound call record', statusCode: 500 };
  }
};
