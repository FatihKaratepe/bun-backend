import { asyncHandler } from '@middlewares';
import { Router } from 'express';
import { CompanyController } from '../modules/company/company.controller';

const router = Router();

router.get('/', asyncHandler(CompanyController.getCompany));
router.post('/setup', asyncHandler(CompanyController.setupCompany));

export const CompanyRoutes = router;
