import { Request, Response } from 'express';
import * as loadModel from '../models/loadModel.js';
import { handleError } from '../utils/errorHandler.js';
import { validateLoadFilterData } from '../utils/validation.js';

export const getLoads = async (req: Request, res: Response) => {
  try {
    const { origin_city, destination_city, equipment_type, page, limit } =
      req.query;

    // Check if any filter parameters are provided
    const hasFilters = origin_city || destination_city || equipment_type;

    if (hasFilters) {
      // Validate filter and pagination parameters
      const filters = validateLoadFilterData({
        origin_city: origin_city as string,
        destination_city: destination_city as string,
        equipment_type: equipment_type as string,
        page: page as string,
        limit: limit as string,
      });

      const result = await loadModel.getLoadsWithFilters(filters);

      // Return paginated response with metadata
      res.status(200).json({
        data: result.data,
        pagination: result.pagination,
        filters: {
          origin_city: filters.origin_city,
          destination_city: filters.destination_city,
          equipment_type: filters.equipment_type,
        },
      });
    } else {
      // No filters provided, return all loads (backward compatibility)
      const loads = await loadModel.getAllLoads();
      res.status(200).json({
        data: loads,
        total: loads.length,
      });
    }
  } catch (error) {
    const { message, statusCode } = handleError(error);
    res.status(statusCode).json({ message });
  }
};
