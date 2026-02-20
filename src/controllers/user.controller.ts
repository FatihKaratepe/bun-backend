import { UserService } from '@services';
import type { Request, Response } from 'express';

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    const users = await UserService.getAll(req);
    res.json(users);
  },
  getUserById: async (req: Request, res: Response) => {
    const user = await UserService.getById(req);
    res.json(user);
  },
  createUser: async (req: Request, res: Response) => {
    const user = await UserService.create(req);
    res.status(201).json(user);
  },
  updateUser: async (req: Request, res: Response) => {
    const user = await UserService.update(req);
    res.status(200).json(user);
  },
};
