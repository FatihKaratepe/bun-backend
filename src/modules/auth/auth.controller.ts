import type { Request, Response } from 'express';
import { login, logout, register, resetPassword, updateUser, verifyEmail } from './auth.service';
import { AppError } from '@middlewares';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const user = await register(req.body);
    res.status(201).json(user);
  },
  login: async (req: Request, res: Response) => {
    const tokens = await login(req.body);
    res.json(tokens);
  },
  logout: async (req: Request, res: Response) => {
    const tokens = await logout(req.body);
    res.json(tokens);
  },
  updateProfile: async (req: Request, res: Response) => {
    const keycloakId = req.user?.sub;
    if (!keycloakId) {
      throw new AppError('Unauthorized - User not found in request', 400);
    }
    const updatedUser = await updateUser(keycloakId, req.body);
    res.json(updatedUser);
  },
  resetPassword: async (req: Request, res: Response) => {
    const keycloakId = req.user?.sub;
    if (!keycloakId) {
      throw new AppError('Unauthorized - User not found in request', 400);
    }
    const { newPassword } = req.body;
    if (!newPassword) {
      throw new AppError('New password is required', 400);
    }
    const result = await resetPassword(keycloakId, newPassword);
    res.json(result);
  },
  verifyEmail: async (req: Request, res: Response) => {
    let token = req.query.token as string;

    if (!token && req.body.token) {
      token = req.body.token;
    }

    if (!token) {
      throw new AppError('Verification token is missing', 400);
    }

    const result = await verifyEmail(token);
    res.json(result);
  },
};
