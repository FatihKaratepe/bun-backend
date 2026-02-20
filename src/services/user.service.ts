import { prisma } from '@lib';
import { AppError } from '@middlewares';
import { createUserValidatorSchema } from '@schemas';
import type { Request } from 'express';
import z from 'zod';

export const UserService = {
  getAll: async (req: Request) => {
    const { page = '1', limit = '10', sort = 'createdAt' } = req.query;

    return await prisma.user.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  },
  getById: async (req: Request) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      throw new AppError('Invalid or missing user id', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }
    return await prisma.user.findUnique({ where: { id: id } });
  },
  create: async (req: Request) => {
    const data = req.body;
    const valid = createUserValidatorSchema.safeParse(data);
    if(!valid.success) {
      return new AppError(`Validation Error: ${z.treeifyError(valid.error)}`, 400);
    }
    return await prisma.user.create({ data });
  },
  update: async (req: Request) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      throw new AppError('Invalid or missing user id', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const data = req.body;
    return await prisma.user.update({ where: { id }, data });
  },
};
