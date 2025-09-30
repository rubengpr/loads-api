import prisma from '../lib/prisma.js';

export const getAllLoads = async () => {
  try {
    return await prisma.load.findMany({});
  } catch (error) {
    throw { message: 'Failed to fetch loads', statusCode: 500 };
  }
};
