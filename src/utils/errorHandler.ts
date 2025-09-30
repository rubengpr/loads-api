export const handleError = (error: any) => {
  // If error already has statusCode and message, return as is
  if (error.statusCode && error.message) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Handle Prisma errors
  if (error.code === 'P2002') {
    return {
      message: 'A record with this information already exists',
      statusCode: 409,
    };
  }

  if (error.code === 'P2025') {
    return {
      message: 'Record not found',
      statusCode: 404,
    };
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return {
      message: 'Invalid input data',
      statusCode: 400,
    };
  }

  // Default error
  return {
    message: 'Internal server error',
    statusCode: 500,
  };
};
