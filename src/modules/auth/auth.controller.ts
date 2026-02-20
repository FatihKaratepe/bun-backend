import type { Request, Response } from 'express';
import { login, logout, register } from './auth.service';

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
};
