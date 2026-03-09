import { prisma } from '../../lib/prisma';

export const CompanyService = {
  async getCompany() {
    return await prisma.company.findFirst();
  },

  async upsertCompany(data: any) {
    const existing = await prisma.company.findFirst();
    if (existing) {
      return await prisma.company.update({
        where: { id: existing.id },
        data,
      });
    }
    return await prisma.company.create({ data });
  },
};
