import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { CompanyService } from './company.service';

const lockFilePath = path.join(process.cwd(), 'company.lock');

export const CompanyController = {
  async getCompany(req: Request, res: Response) {
    const company = await CompanyService.getCompany();
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }
    res.json(company);
  },

  async setupCompany(req: Request, res: Response) {
    if (fs.existsSync(lockFilePath)) {
      return res
        .status(403)
        .json({ message: 'Company setup already done. Please delete company.lock file to continue.' });
    }

    const data = req.body;
    const company = await CompanyService.upsertCompany(data);

    try {
      fs.writeFileSync(lockFilePath, `Setup date: ${new Date().toISOString()}`, 'utf-8');
    } catch (err) {
      console.error('Lock file could not be created:', err);
    }

    res.status(200).json({ message: 'Company setup successful.', company });
  },
};
