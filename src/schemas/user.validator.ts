import { z } from 'zod';

export const userValidatorSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { error: 'Name is required' }),
  createdAt: z.iso.datetime(),
});
export const createUserValidatorSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  createdAt: z.iso.datetime(),
});


export type UserValidatorType = z.infer<typeof userValidatorSchema>;