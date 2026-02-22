import type { Request, Response } from 'express';
import { AppError } from './error.middleware';

export const notFoundMiddleware = (req: Request, res: Response) => {
  throw new AppError(`Route not found: ${req.originalUrl}`, 404);
};
