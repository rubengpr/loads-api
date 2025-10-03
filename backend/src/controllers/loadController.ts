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

      // Return consistent paginated response structure
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
      // No filters provided, return all loads with consistent structure
      const loads = await loadModel.getAllLoads();
      const total = loads.length;

      res.status(200).json({
        data: loads,
        pagination: {
          page: 1,
          limit: total,
          total: total,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
        filters: {},
      });
    }
  } catch (error) {
    // Enhanced error handling with context
    const { message, statusCode } = handleError(error, {
      endpoint: '/api/loads',
      method: req.method,
      params: {
        origin_city: req.query.origin_city,
        destination_city: req.query.destination_city,
        equipment_type: req.query.equipment_type,
        page: req.query.page,
        limit: req.query.limit,
      },
    });
    res.status(statusCode).json({ message });
  }
};
