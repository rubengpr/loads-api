import prisma from '../lib/prisma.js';

export interface CreateInboundCallData {
  outcome: 'TRANSFERRED' | 'CANCELED';
  caller_sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  notes?: string;
}

export const createInboundCall = async (data: CreateInboundCallData) => {
  try {
    return await prisma.inboundCall.create({
      data: {
        outcome: data.outcome,
        caller_sentiment: data.caller_sentiment,
        notes: data.notes,
      },
    });
  } catch (error) {
    throw { message: 'Failed to create inbound call record', statusCode: 500 };
  }
};
