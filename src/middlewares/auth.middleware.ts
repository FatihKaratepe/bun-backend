import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/auth';
import { AppError } from './error.middleware';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new AppError('Unauthorized', 401);
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = await verifyToken(token);

    req.user = payload;
    next();
  } catch (err) {
    return new AppError('Invalid token', 401);
  }
}
