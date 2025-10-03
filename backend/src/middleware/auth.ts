import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const providedKey = req.headers['x-api-key'] as string;
  const validKey = process.env.API_KEY;

  // Check if API key is configured
  if (!validKey) {
    console.error('API_KEY environment variable is not configured');
    return res.status(500).json({
      message: 'Server configuration error',
    });
  }

  // Check if API key is provided
  if (!providedKey) {
    return res.status(401).json({
      message: 'API key is required. Please provide X-API-Key header.',
      error: 'MISSING_API_KEY',
    });
  }

  // Validate API key
  if (providedKey !== validKey) {
    return res.status(401).json({
      message: 'Invalid API key',
      error: 'INVALID_API_KEY',
    });
  }

  // API key is valid, proceed to next middleware
  next();
};
