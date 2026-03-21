import { z } from 'zod';

export const userValidatorSchema = z.object({
  id: z.uuid({ message: 'User ID must be a valid UUID' }),
  keycloakId: z.string().min(1, { error: 'Keycloak ID is required' }),
  email: z
    .email({ message: 'Please provide a valid email address' })
    .min(1, { error: 'Email is required' }),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be at most 50 characters' }),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Please provide a valid phone number' }),
  createdAt: z.iso.datetime({ message: 'Invalid date format' }),
  updatedAt: z.iso.datetime({ message: 'Invalid date format' }),
});

export const createUserValidatorSchema = z
  .object({
    keycloakId: z.string().min(1, { error: 'Keycloak ID is required' }),
    email: z
      .email({ message: 'Please provide a valid email address' })
      .min(1, { error: 'Email is required' }),
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters' })
      .max(50, { message: 'First name must be at most 50 characters' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters' })
      .max(50, { message: 'Last name must be at most 50 characters' }),
    phone: z
      .string()
      .regex(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Please provide a valid phone number' }),
  });

const updateBaseSchema = z.object({
  email: z
    .email({ message: 'Please provide a valid email address' })
    .min(1, { error: 'Email is required' })
    .optional(),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be at most 50 characters' })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be at most 50 characters' })
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Please provide a valid phone number' })
    .optional(),
});

export const updateUserValidatorSchema = updateBaseSchema;

export type CreateUserType = z.infer<typeof createUserValidatorSchema>;
export type UpdateUserType = z.infer<typeof updateUserValidatorSchema>;