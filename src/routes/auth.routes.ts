import { asyncHandler } from '@middlewares';
import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));

export default router;
