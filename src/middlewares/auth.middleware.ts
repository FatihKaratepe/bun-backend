import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/auth';
import { AppError } from './error.middleware';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized — No token provided', 401);
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new AppError('Unauthorized — Empty token', 401);
    }

    const payload = await verifyToken(token);

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError('Unauthorized — Invalid or expired token', 401);
  }
}
