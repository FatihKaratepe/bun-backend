import { asyncHandler, authMiddleware } from '@middlewares';
import { Router } from 'express';
import { ProductController } from '../modules/product/product.controller';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product management endpoints
 *   - name: Product Variants
 *     description: Product variant management endpoints
 *   - name: Product Images
 *     description: Product image management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         name:
 *           type: string
 *           example: iPhone 15 Pro
 *         slug:
 *           type: string
 *           example: iphone-15-pro
 *         description:
 *           type: string
 *           nullable: true
 *           example: Latest Apple smartphone
 *         shortDescription:
 *           type: string
 *           nullable: true
 *           example: Apple flagship phone
 *         sku:
 *           type: string
 *           example: IPH-15-PRO-256
 *         barcode:
 *           type: string
 *           nullable: true
 *           example: "8901234567890"
 *         basePrice:
 *           type: number
 *           format: decimal
 *           example: 59999.99
 *         salePrice:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 54999.99
 *         currency:
 *           type: string
 *           example: TRY
 *         taxRate:
 *           type: number
 *           format: decimal
 *           example: 20.00
 *         stock:
 *           type: integer
 *           example: 100
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         trackStock:
 *           type: boolean
 *           example: true
 *         weight:
 *           type: number
 *           nullable: true
 *           example: 0.187
 *         width:
 *           type: number
 *           nullable: true
 *           example: 7.09
 *         height:
 *           type: number
 *           nullable: true
 *           example: 14.69
 *         length:
 *           type: number
 *           nullable: true
 *           example: 0.83
 *         isActive:
 *           type: boolean
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           example: false
 *         metaTitle:
 *           type: string
 *           nullable: true
 *           example: iPhone 15 Pro - Buy Online
 *         metaDescription:
 *           type: string
 *           nullable: true
 *           example: Buy iPhone 15 Pro at the best price
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         brandId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         brand:
 *           $ref: '#/components/schemas/Brand'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - sku
 *         - basePrice
 *       properties:
 *         name:
 *           type: string
 *           example: iPhone 15 Pro
 *         slug:
 *           type: string
 *           example: iphone-15-pro
 *         description:
 *           type: string
 *           example: Latest Apple smartphone
 *         shortDescription:
 *           type: string
 *           example: Apple flagship phone
 *         sku:
 *           type: string
 *           example: IPH-15-PRO-256
 *         barcode:
 *           type: string
 *           example: "8901234567890"
 *         basePrice:
 *           type: number
 *           example: 59999.99
 *         salePrice:
 *           type: number
 *           example: 54999.99
 *         currency:
 *           type: string
 *           example: TRY
 *         taxRate:
 *           type: number
 *           example: 20.00
 *         stock:
 *           type: integer
 *           example: 100
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         trackStock:
 *           type: boolean
 *           example: true
 *         weight:
 *           type: number
 *           example: 0.187
 *         width:
 *           type: number
 *           example: 7.09
 *         height:
 *           type: number
 *           example: 14.69
 *         length:
 *           type: number
 *           example: 0.83
 *         isActive:
 *           type: boolean
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           example: false
 *         metaTitle:
 *           type: string
 *           example: iPhone 15 Pro - Buy Online
 *         metaDescription:
 *           type: string
 *           example: Buy iPhone 15 Pro at the best price
 *         categoryId:
 *           type: string
 *           format: uuid
 *         brandId:
 *           type: string
 *           format: uuid
 *
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: iPhone 15 Pro Max
 *         slug:
 *           type: string
 *           example: iphone-15-pro-max
 *         description:
 *           type: string
 *           example: Updated description
 *         basePrice:
 *           type: number
 *           example: 64999.99
 *         salePrice:
 *           type: number
 *           example: 59999.99
 *         stock:
 *           type: integer
 *           example: 50
 *         isActive:
 *           type: boolean
 *           example: true
 *         categoryId:
 *           type: string
 *           format: uuid
 *         brandId:
 *           type: string
 *           format: uuid
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         total:
 *           type: integer
 *           example: 50
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         sku:
 *           type: string
 *           example: IPH-15-PRO-256-BLK
 *         barcode:
 *           type: string
 *           nullable: true
 *           example: "8901234567891"
 *         name:
 *           type: string
 *           example: Black - 256GB
 *         price:
 *           type: number
 *           format: decimal
 *           example: 59999.99
 *         stock:
 *           type: integer
 *           example: 25
 *         isActive:
 *           type: boolean
 *           example: true
 *         attributes:
 *           type: object
 *           nullable: true
 *           example: { "color": "Black", "storage": "256GB" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductVariantInput:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - price
 *       properties:
 *         sku:
 *           type: string
 *           example: IPH-15-PRO-256-BLK
 *         barcode:
 *           type: string
 *           example: "8901234567891"
 *         name:
 *           type: string
 *           example: Black - 256GB
 *         price:
 *           type: number
 *           example: 59999.99
 *         stock:
 *           type: integer
 *           example: 25
 *         isActive:
 *           type: boolean
 *           example: true
 *         attributes:
 *           type: object
 *           example: { "color": "Black", "storage": "256GB" }
 *
 *     UpdateProductVariantInput:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           example: IPH-15-PRO-512-BLK
 *         name:
 *           type: string
 *           example: Black - 512GB
 *         price:
 *           type: number
 *           example: 64999.99
 *         stock:
 *           type: integer
 *           example: 10
 *         isActive:
 *           type: boolean
 *           example: true
 *         attributes:
 *           type: object
 *           example: { "color": "Black", "storage": "512GB" }
 *
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         url:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/products/iphone-15-pro-front.jpg
 *         altText:
 *           type: string
 *           nullable: true
 *           example: iPhone 15 Pro front view
 *         sortOrder:
 *           type: integer
 *           example: 0
 *         isPrimary:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductImageInput:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/products/iphone-15-pro-front.jpg
 *         altText:
 *           type: string
 *           example: iPhone 15 Pro front view
 *         sortOrder:
 *           type: integer
 *           example: 0
 *         isPrimary:
 *           type: boolean
 *           example: true
 *
 *     UpdateProductImageInput:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/products/iphone-15-pro-back.jpg
 *         altText:
 *           type: string
 *           example: iPhone 15 Pro back view
 *         sortOrder:
 *           type: integer
 *           example: 1
 *         isPrimary:
 *           type: boolean
 *           example: false
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Smartphones
 *         slug:
 *           type: string
 *           example: smartphones
 *
 *     Brand:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Apple
 *         slug:
 *           type: string
 *           example: apple
 */


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by brand
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or SKU
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', asyncHandler(ProductController.getAllProducts));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid or missing product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', asyncHandler(ProductController.getProductById));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Product with same slug or SKU already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', asyncHandler(ProductController.createProduct));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', asyncHandler(ProductController.updateProduct));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       400:
 *         description: Invalid or missing product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', asyncHandler(ProductController.deleteProduct));


/**
 * @swagger
 * /products/{productId}/variants:
 *   get:
 *     summary: Get all variants for a product
 *     tags: [Product Variants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:productId/variants', asyncHandler(ProductController.getVariants));

/**
 * @swagger
 * /products/{productId}/variants:
 *   post:
 *     summary: Create a variant for a product
 *     tags: [Product Variants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductVariantInput'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Variant with same SKU already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:productId/variants', asyncHandler(ProductController.createVariant));

/**
 * @swagger
 * /products/{productId}/variants/{variantId}:
 *   put:
 *     summary: Update a product variant
 *     tags: [Product Variants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductVariantInput'
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:productId/variants/:variantId', asyncHandler(ProductController.updateVariant));

/**
 * @swagger
 * /products/{productId}/variants/{variantId}:
 *   delete:
 *     summary: Delete a product variant
 *     tags: [Product Variants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product variant deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:productId/variants/:variantId', asyncHandler(ProductController.deleteVariant));


/**
 * @swagger
 * /products/{productId}/images:
 *   get:
 *     summary: Get all images for a product
 *     tags: [Product Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductImage'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:productId/images', asyncHandler(ProductController.getImages));

/**
 * @swagger
 * /products/{productId}/images:
 *   post:
 *     summary: Add an image to a product
 *     tags: [Product Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductImageInput'
 *     responses:
 *       201:
 *         description: Image added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:productId/images', asyncHandler(ProductController.createImage));

/**
 * @swagger
 * /products/{productId}/images/{imageId}:
 *   put:
 *     summary: Update a product image
 *     tags: [Product Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductImageInput'
 *     responses:
 *       200:
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:productId/images/:imageId', asyncHandler(ProductController.updateImage));

/**
 * @swagger
 * /products/{productId}/images/{imageId}:
 *   delete:
 *     summary: Delete a product image
 *     tags: [Product Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product image deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:productId/images/:imageId', asyncHandler(ProductController.deleteImage));

export const ProductRoutes = router;
