import { asyncHandler, authMiddleware } from '@middlewares';
import { Router } from 'express';
import { UserController } from '../modules/user/user.controller';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Keycloak JWT token
 *   schemas:
 *     UserType:
 *       type: string
 *       enum: [INDIVIDUAL, CORPORATE]
 *       example: INDIVIDUAL
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         keycloakId:
 *           type: string
 *           example: kc-abc123
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         firstName:
 *           type: string
 *           nullable: true
 *           example: John
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: Doe
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "+905001234567"
 *         userType:
 *           $ref: '#/components/schemas/UserType'
 *         companyName:
 *           type: string
 *           nullable: true
 *           example: Acme Corp
 *         taxNumber:
 *           type: string
 *           nullable: true
 *           example: "1234567890"
 *         taxOffice:
 *           type: string
 *           nullable: true
 *           example: Kadıköy
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - keycloakId
 *         - email
 *       properties:
 *         keycloakId:
 *           type: string
 *           example: kc-abc123
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: "+905001234567"
 *         userType:
 *           $ref: '#/components/schemas/UserType'
 *         companyName:
 *           type: string
 *           example: Acme Corp
 *         taxNumber:
 *           type: string
 *           example: "1234567890"
 *         taxOffice:
 *           type: string
 *           example: Kadıköy
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: "+905001234567"
 *         userType:
 *           $ref: '#/components/schemas/UserType'
 *         companyName:
 *           type: string
 *           example: Acme Corp
 *         taxNumber:
 *           type: string
 *           example: "1234567890"
 *         taxOffice:
 *           type: string
 *           example: Kadıköy
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           example: Home
 *         fullName:
 *           type: string
 *           example: John Doe
 *         phone:
 *           type: string
 *           example: "+905001234567"
 *         country:
 *           type: string
 *           example: Turkey
 *         city:
 *           type: string
 *           example: Istanbul
 *         district:
 *           type: string
 *           example: Kadıköy
 *         postalCode:
 *           type: string
 *           example: "34710"
 *         addressLine:
 *           type: string
 *           example: Moda Cad. No:1
 *         isInvoice:
 *           type: boolean
 *           example: false
 *         isShipping:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User not found
 *         statusCode:
 *           type: integer
 *           example: 404
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: Number of users per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', asyncHandler(UserController.getAllUsers));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or missing user id
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', asyncHandler(UserController.getUserById));


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or missing user id
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', asyncHandler(UserController.updateUser));

export const UserRoutes = router;
