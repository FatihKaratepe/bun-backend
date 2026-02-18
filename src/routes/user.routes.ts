import { UserController } from '@controllers';
import { asyncHandler } from '@middlewares';
import { Router } from 'express';

const router = Router();

router.get('/', asyncHandler(UserController.getAllUsers));
router.get('/:id', asyncHandler(UserController.getUserById));
router.post('/', asyncHandler(UserController.createUser));
router.put('/:id', asyncHandler(UserController.updateUser));

export const UserRoutes = router;
