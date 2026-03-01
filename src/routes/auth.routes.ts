import { asyncHandler, authMiddleware } from '@middlewares';
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

/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update user profile
 *     description: Updates the authenticated user's profile in Postgres and Keycloak
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               companyName:
 *                 type: string
 *               taxNumber:
 *                 type: string
 *               taxOffice:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/update', authMiddleware, asyncHandler(AuthController.updateProfile));

/**
 * @swagger
 * /auth/password:
 *   put:
 *     summary: Update user password
 *     description: Updates the authenticated user's password in Keycloak
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: NewSecurePass123!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/password', authMiddleware, asyncHandler(AuthController.resetPassword));

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify email address via token link
 *     description: Activates user account in Postgres and Keycloak
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Activation token sent to the user email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-email', asyncHandler(AuthController.verifyEmail));

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address via token payload
 *     description: Activates user account in Postgres and Keycloak
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify-email', asyncHandler(AuthController.verifyEmail));

export const AuthRoutes = router;
