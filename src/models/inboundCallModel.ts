import prisma from '../lib/prisma.js';

export interface CreateInboundCallData {
  call_start_time: Date;
  call_end_time: Date;
  call_duration_seconds: number;
  outcome: 'TRANSFERRED' | 'CANCELED';
  caller_sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  notes?: string;
}

export const createInboundCall = async (data: CreateInboundCallData) => {
  try {
    return await prisma.inboundCall.create({
      data: {
        call_start_time: data.call_start_time,
        call_end_time: data.call_end_time,
        call_duration_seconds: data.call_duration_seconds,
        outcome: data.outcome,
        caller_sentiment: data.caller_sentiment,
        notes: data.notes,
      },
    });
  } catch (error) {
    throw { message: 'Failed to create inbound call record', statusCode: 500 };
  }
};
