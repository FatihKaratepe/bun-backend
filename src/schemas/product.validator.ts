import { z } from 'zod';

export const createProductValidatorSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }).max(255),
  slug: z.string().min(1, { message: 'Slug is required' }).max(255),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, { message: 'SKU is required' }),
  barcode: z.string().optional(),
  basePrice: z.number().positive({ message: 'Base price must be positive' }),
  salePrice: z.number().positive().optional(),
  currency: z.string().default('TRY'),
  taxRate: z.number().min(0).max(100).default(0),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  trackStock: z.boolean().default(true),
  weight: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  length: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryId: z.uuid().optional(),
  brandId: z.uuid().optional(),
});

export const updateProductValidatorSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1).optional(),
  barcode: z.string().optional(),
  basePrice: z.number().positive().optional(),
  salePrice: z.number().positive().nullable().optional(),
  currency: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  trackStock: z.boolean().optional(),
  weight: z.number().positive().nullable().optional(),
  width: z.number().positive().nullable().optional(),
  height: z.number().positive().nullable().optional(),
  length: z.number().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  brandId: z.string().uuid().nullable().optional(),
});

export const createProductVariantValidatorSchema = z.object({
  sku: z.string().min(1, { message: 'Variant SKU is required' }),
  barcode: z.string().optional(),
  name: z.string().min(1, { message: 'Variant name is required' }),
  price: z.number().positive({ message: 'Price must be positive' }),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  attributes: z.record(z.string(), z.any()).optional(),
});

export const updateProductVariantValidatorSchema = z.object({
  sku: z.string().min(1).optional(),
  barcode: z.string().nullable().optional(),
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  attributes: z.record(z.string(), z.any()).nullable().optional(),
});

export const createProductImageValidatorSchema = z.object({
  url: z.url({ message: 'Valid URL is required' }),
  altText: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export const updateProductImageValidatorSchema = z.object({
  url: z.url().optional(),
  altText: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

export type CreateProductType = z.infer<typeof createProductValidatorSchema>;
export type UpdateProductType = z.infer<typeof updateProductValidatorSchema>;
export type CreateProductVariantType = z.infer<typeof createProductVariantValidatorSchema>;
export type UpdateProductVariantType = z.infer<typeof updateProductVariantValidatorSchema>;
export type CreateProductImageType = z.infer<typeof createProductImageValidatorSchema>;
export type UpdateProductImageType = z.infer<typeof updateProductImageValidatorSchema>;
