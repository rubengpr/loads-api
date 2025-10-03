import { Request, Response } from 'express';
import * as inboundCallModel from '../models/inboundCallModel.js';
import { handleError } from '../utils/errorHandler.js';
import { validateInboundCallData } from '../utils/validation.js';

export const createInboundCall = async (req: Request, res: Response) => {
  try {
    const callData = validateInboundCallData(req.body);
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
