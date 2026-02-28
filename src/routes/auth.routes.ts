import { asyncHandler } from '@middlewares';
import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints (Keycloak)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - phone
 *         - userType
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: ahmet@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: SecurePass123!
 *         firstName:
 *           type: string
 *           example: Ahmet
 *         lastName:
 *           type: string
 *           example: Yılmaz
 *         phone:
 *           type: string
 *           example: "+905321234567"
 *         userType:
 *           $ref: '#/components/schemas/UserType'
 *         companyName:
 *           type: string
 *           description: Required if userType is CORPORATE
 *           example: Tech Firm A.Ş.
 *         taxNumber:
 *           type: string
 *           description: Required if userType is CORPORATE (10-11 digits)
 *           example: "1234567890"
 *         taxOffice:
 *           type: string
 *           description: Required if userType is CORPORATE
 *           example: Kadıköy
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: ahmet@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePass123!
 *     TokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         expiresIn:
 *           type: integer
 *           example: 300
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a user in Keycloak and saves profile to database. For CORPORATE users, companyName, taxNumber and taxOffice are required.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', asyncHandler(AuthController.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates against Keycloak and returns JWT tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', asyncHandler(AuthController.login));

export const AuthRoutes = router;
