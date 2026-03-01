import type { Request, Response } from 'express';
import { UserService } from './user.service';

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    const users = await UserService.getAll(req);
    res.json(users);
  },

  getUserById: async (req: Request, res: Response) => {
    const user = await UserService.getById(req);
    res.json(user);
  },

  updateUser: async (req: Request, res: Response) => {
    const user = await UserService.update(req);
    res.json(user);
  },

};
