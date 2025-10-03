import { Request, Response } from 'express';
import * as loadModel from '../models/loadModel.js';
import { handleError } from '../utils/errorHandler.js';

export const getLoads = async (req: Request, res: Response) => {
  try {
    const loads = await loadModel.getAllLoads();

    res.status(200).json(loads);
  } catch (error) {
    const { message, statusCode } = handleError(error);
    res.status(statusCode).json({ message });
  }
};
