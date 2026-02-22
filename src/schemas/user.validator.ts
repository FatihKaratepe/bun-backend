import { z } from 'zod';

export const UserTypeEnum = z.enum(['INDIVIDUAL', 'CORPORATE'], {
  error: 'User type must be either INDIVIDUAL or CORPORATE',
});

// --- Base schema (tam model, DB'den gelen veri) ---
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
  userType: UserTypeEnum,
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters' })
    .max(100, { message: 'Company name must be at most 100 characters' })
    .nullable()
    .optional(),
  taxNumber: z
    .string()
    .regex(/^\d{10,11}$/, { message: 'Tax number must be 10 or 11 digits' })
    .nullable()
    .optional(),
  taxOffice: z
    .string()
    .min(2, { message: 'Tax office must be at least 2 characters' })
    .nullable()
    .optional(),
  createdAt: z.iso.datetime({ message: 'Invalid date format' }),
  updatedAt: z.iso.datetime({ message: 'Invalid date format' }),
});

// --- Create schema: Adres hariç tüm alanlar zorunlu + CORPORATE/INDIVIDUAL kontrolü ---
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
    userType: UserTypeEnum,
    companyName: z
      .string()
      .min(2, { message: 'Company name must be at least 2 characters' })
      .max(100, { message: 'Company name must be at most 100 characters' })
      .optional(),
    taxNumber: z
      .string()
      .regex(/^\d{10,11}$/, { message: 'Tax number must be 10 or 11 digits' })
      .optional(),
    taxOffice: z
      .string()
      .min(2, { message: 'Tax office must be at least 2 characters' })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === 'CORPORATE') {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company name is required for corporate users',
          path: ['companyName'],
        });
      }
      if (!data.taxNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tax number is required for corporate users',
          path: ['taxNumber'],
        });
      }
      if (!data.taxOffice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tax office is required for corporate users',
          path: ['taxOffice'],
        });
      }
    }
  });

// --- Update schema: Tüm alanlar opsiyonel, keycloakId hariç, CORPORATE kontrolü korunur ---
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
  userType: UserTypeEnum.optional(),
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters' })
    .max(100, { message: 'Company name must be at most 100 characters' })
    .optional(),
  taxNumber: z
    .string()
    .regex(/^\d{10,11}$/, { message: 'Tax number must be 10 or 11 digits' })
    .optional(),
  taxOffice: z
    .string()
    .min(2, { message: 'Tax office must be at least 2 characters' })
    .optional(),
});

export const updateUserValidatorSchema = updateBaseSchema.superRefine((data, ctx) => {
  if (data.userType === 'CORPORATE') {
    if (!data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Company name is required for corporate users',
        path: ['companyName'],
      });
    }
    if (!data.taxNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tax number is required for corporate users',
        path: ['taxNumber'],
      });
    }
    if (!data.taxOffice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tax office is required for corporate users',
        path: ['taxOffice'],
      });
    }
  }
});

export type UserType = z.infer<typeof userValidatorSchema>;
export type CreateUserType = z.infer<typeof createUserValidatorSchema>;
export type UpdateUserType = z.infer<typeof updateUserValidatorSchema>;