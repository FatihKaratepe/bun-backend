import { prisma } from '@lib';
import { AppError } from '@middlewares';
import { updateUserValidatorSchema } from '@schemas';
import type { Request } from 'express';

export const UserService = {
  getAll: async (req: Request) => {
    const { page = '1', limit = '10', sort = 'createdAt' } = req.query;

    return await prisma.user.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
  },

  getById: async (req: Request) => {
    const id = req.params.id;
    if (!id) {
      throw new AppError('User ID is required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    return existingUser;
  },

  update: async (req: Request) => {
    const id = req.params.id;
    if (!id) {
      throw new AppError('User ID is required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const result = updateUserValidatorSchema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    return await prisma.user.update({ where: { id }, data: result.data });
  },
};
