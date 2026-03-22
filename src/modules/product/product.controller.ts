import type { Request, Response } from 'express';
import { ProductService } from './product.service';

export const ProductController = {
  getAllProducts: async (req: Request, res: Response) => {
    const products = await ProductService.getAll(req);
    res.json(products);
  },

  getProductById: async (req: Request, res: Response) => {
    const product = await ProductService.getById(req);
    res.json(product);
  },

  createProduct: async (req: Request, res: Response) => {
    const product = await ProductService.create(req);
    res.status(201).json(product);
  },

  updateProduct: async (req: Request, res: Response) => {
    const product = await ProductService.update(req);
    res.json(product);
  },

  deleteProduct: async (req: Request, res: Response) => {
    const result = await ProductService.delete(req);
    res.json(result);
  },

  getVariants: async (req: Request, res: Response) => {
    const variants = await ProductService.getVariants(req);
    res.json(variants);
  },

  createVariant: async (req: Request, res: Response) => {
    const variant = await ProductService.createVariant(req);
    res.status(201).json(variant);
  },

  updateVariant: async (req: Request, res: Response) => {
    const variant = await ProductService.updateVariant(req);
    res.json(variant);
  },

  deleteVariant: async (req: Request, res: Response) => {
    const result = await ProductService.deleteVariant(req);
    res.json(result);
  },

  getImages: async (req: Request, res: Response) => {
    const images = await ProductService.getImages(req);
    res.json(images);
  },

  createImage: async (req: Request, res: Response) => {
    const image = await ProductService.createImage(req);
    res.status(201).json(image);
  },

  updateImage: async (req: Request, res: Response) => {
    const image = await ProductService.updateImage(req);
    res.json(image);
  },

  deleteImage: async (req: Request, res: Response) => {
    const result = await ProductService.deleteImage(req);
    res.json(result);
  },
};
