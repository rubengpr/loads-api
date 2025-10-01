import { Request, Response } from 'express';
import * as inboundCallModel from '../models/inboundCallModel.js';
import { handleError } from '../utils/errorHandler.js';

export const createInboundCall = async (req: Request, res: Response) => {
  try {
    const { outcome, caller_sentiment, notes } = req.body;

    // Basic validation
    if (!outcome || !caller_sentiment) {
      return res.status(400).json({
        message: 'Missing required fields: outcome, caller_sentiment',
      });
    }

    // Validate enums
    const validOutcomes = ['TRANSFERRED', 'CANCELED'];
    const validSentiments = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];

    if (!validOutcomes.includes(outcome)) {
      return res.status(400).json({
        message: 'Invalid outcome. Must be TRANSFERRED or CANCELED',
      });
    }

    if (!validSentiments.includes(caller_sentiment)) {
      return res.status(400).json({
        message:
          'Invalid caller_sentiment. Must be POSITIVE, NEUTRAL, or NEGATIVE',
      });
    }

    const callData = {
      outcome,
      caller_sentiment,
      notes: notes || undefined,
    };

    const newCall = await inboundCallModel.createInboundCall(callData);

    res.status(201).json({
      message: 'Inbound call record created successfully',
      call_id: newCall.call_id,
      call: newCall,
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    res.status(statusCode).json({ message });
  }
};
