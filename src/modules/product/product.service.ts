import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '@lib';
import { AppError } from '@middlewares';
import {
  createProductValidatorSchema,
  updateProductValidatorSchema,
  createProductVariantValidatorSchema,
  updateProductVariantValidatorSchema,
  createProductImageValidatorSchema,
  updateProductImageValidatorSchema,
} from '@schemas';
import type { Request } from 'express';

export const ProductService = {
  getAll: async (req: Request) => {
    const { page = '1', limit = '10', sort = 'createdAt', categoryId, brandId, isActive, isFeatured, search } = req.query;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { sku: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [String(sort)]: 'desc' },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { data: products, total, page: Number(page), limit: Number(limit) };
  },

  getById: async (req: Request) => {
    const id = req.params.id;
    if (!id) throw new AppError('Product ID is required', 400);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  create: async (req: Request) => {
    const result = createProductValidatorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug: result.data.slug } });
    if (existingSlug) throw new AppError('A product with this slug already exists', 409);

    const existingSku = await prisma.product.findUnique({ where: { sku: result.data.sku } });
    if (existingSku) throw new AppError('A product with this SKU already exists', 409);

    return await prisma.product.create({ data: result.data });
  },

  update: async (req: Request) => {
    const id = req.params.id;
    if (!id) throw new AppError('Product ID is required', 400);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    const result = updateProductValidatorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    return await prisma.product.update({ where: { id }, data: result.data });
  },

  delete: async (req: Request) => {
    const id = req.params.id;
    if (!id) throw new AppError('Product ID is required', 400);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  },

  getVariants: async (req: Request) => {
    const productId = req.params.productId;
    if (!productId) throw new AppError('Product ID is required', 400);

    return await prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  },

  createVariant: async (req: Request) => {
    const productId = req.params.productId;
    if (!productId) throw new AppError('Product ID is required', 400);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Product not found', 404);

    const result = createProductVariantValidatorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    const existingSku = await prisma.productVariant.findUnique({ where: { sku: result.data.sku } });
    if (existingSku) throw new AppError('A variant with this SKU already exists', 409);

    const { attributes, ...rest } = result.data;
    return await prisma.productVariant.create({
      data: {
        ...rest,
        productId,
        ...(attributes !== undefined && { attributes: attributes ?? Prisma.JsonNull }),
      },
    });
  },

  updateVariant: async (req: Request) => {
    const { productId, variantId } = req.params;
    if (!productId || !variantId) throw new AppError('Product ID and Variant ID are required', 400);

    const existing = await prisma.productVariant.findFirst({ where: { id: variantId, productId } });
    if (!existing) throw new AppError('Product variant not found', 404);

    const result = updateProductVariantValidatorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    const { attributes, ...rest } = result.data;
    return await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        ...rest,
        ...(attributes !== undefined && { attributes: attributes ?? Prisma.JsonNull }),
      },
    });
  },

  deleteVariant: async (req: Request) => {
    const { productId, variantId } = req.params;
    if (!productId || !variantId) throw new AppError('Product ID and Variant ID are required', 400);

    const existing = await prisma.productVariant.findFirst({ where: { id: variantId, productId } });
    if (!existing) throw new AppError('Product variant not found', 404);

    await prisma.productVariant.delete({ where: { id: variantId } });
    return { message: 'Product variant deleted successfully' };
  },

  getImages: async (req: Request) => {
    const productId = req.params.productId;
    if (!productId) throw new AppError('Product ID is required', 400);

    return await prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
  },

  createImage: async (req: Request) => {
    const productId = req.params.productId;
    if (!productId) throw new AppError('Product ID is required', 400);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Product not found', 404);

    const result = createProductImageValidatorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    return await prisma.productImage.create({ data: { ...result.data, productId } });
  },

  updateImage: async (req: Request) => {
    const { productId, imageId } = req.params;
    if (!productId || !imageId) throw new AppError('Product ID and Image ID are required', 400);

    const existing = await prisma.productImage.findFirst({ where: { id: imageId, productId } });
    if (!existing) throw new AppError('Product image not found', 404);

    const result = updateProductImageValidatorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new AppError(`Validation failed — ${messages}`, 400);
    }

    return await prisma.productImage.update({ where: { id: imageId }, data: result.data });
  },

  deleteImage: async (req: Request) => {
    const { productId, imageId } = req.params;
    if (!productId || !imageId) throw new AppError('Product ID and Image ID are required', 400);

    const existing = await prisma.productImage.findFirst({ where: { id: imageId, productId } });
    if (!existing) throw new AppError('Product image not found', 404);

    await prisma.productImage.delete({ where: { id: imageId } });
    return { message: 'Product image deleted successfully' };
  },
};
