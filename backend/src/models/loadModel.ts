import prisma from '../lib/prisma.js';
import { Prisma } from '@prisma/client';
import { ValidatedLoadFilterData } from '../utils/validation.js';

export const getAllLoads = async () => {
  try {
    return await prisma.load.findMany({});
  } catch (error) {
    throw { message: 'Failed to fetch loads', statusCode: 500 };
  }
};

export const getLoadsWithFilters = async (filters: ValidatedLoadFilterData) => {
  try {
    const whereClause: Prisma.LoadWhereInput = {};

    if (filters.origin_city) {
      whereClause.origin_city = {
        contains: filters.origin_city,
        mode: 'insensitive',
      };
    }

    // Add destination_city filter with case-insensitive matching
    if (filters.destination_city) {
      whereClause.destination_city = {
        contains: filters.destination_city,
        mode: 'insensitive',
      };
    }

    // Add equipment_type filter with exact matching
    if (filters.equipment_type) {
      whereClause.equipment_type = filters.equipment_type;
    }

    return await prisma.load.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
    });
  } catch (error) {
    throw { message: 'Failed to fetch loads with filters', statusCode: 500 };
  }
};
