import { Request, Response } from 'express';
import * as inboundCallModel from '../models/inboundCallModel.js';
import { handleError } from '../utils/errorHandler.js';

export const createInboundCall = async (req: Request, res: Response) => {
  try {
    const {
      call_start_time,
      call_end_time,
      call_duration_seconds,
      outcome,
      caller_sentiment,
      notes,
    } = req.body;

    // Basic validation
    if (!call_start_time || !call_end_time || !outcome || !caller_sentiment) {
      return res.status(400).json({
        message:
          'Missing required fields: call_start_time, call_end_time, outcome, caller_sentiment',
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

    // Validate dates
    const startTime = new Date(call_start_time);
    const endTime = new Date(call_end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format for call_start_time or call_end_time',
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        message: 'call_end_time must be after call_start_time',
      });
    }

    // Calculate duration if not provided
    let duration = call_duration_seconds;
    if (!duration) {
      duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    }

    const callData = {
      call_start_time: startTime,
      call_end_time: endTime,
      call_duration_seconds: duration,
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
