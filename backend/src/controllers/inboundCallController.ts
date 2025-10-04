import { Request, Response } from 'express';
import * as inboundCallModel from '../models/inboundCallModel.js';
import { handleError } from '../utils/errorHandler.js';
import { validateInboundCallData } from '../utils/validation.js';

export const createInboundCall = async (req: Request, res: Response) => {
  try {
    const validatedCallData = validateInboundCallData(req.body);
    const newCall = await inboundCallModel.createInboundCall(validatedCallData);

    res.status(201).json({
      message: 'Inbound call record created successfully',
      call_id: newCall.call_id,
      call: newCall,
    });
  } catch (error) {
    // Enhanced error handling with context
    const { message, statusCode } = handleError(error, {
      endpoint: '/api/inbound-calls',
      method: req.method,
      params: {
        outcome: req.body?.outcome,
        caller_sentiment: req.body?.caller_sentiment,
        carrier_name: req.body?.carrier_name,
        mc_number: req.body?.mc_number,
      },
    });
    res.status(statusCode).json({ message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await inboundCallModel.getAnalytics();

    res.status(200).json(analytics);
  } catch (error) {
    // Enhanced error handling with context
    const { message, statusCode } = handleError(error, {
      endpoint: '/api/inbound-calls/analytics',
      method: req.method,
    });
    res.status(statusCode).json({ message });
  }
};
