import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const planOrder: Record<string, number> = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
};

export const requirePlan = (minPlan: 'BASIC' | 'PREMIUM') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.sub;
      const sub = await prisma.subscription.findUnique({ where: { userId } });
      const userPlan = sub?.plan || 'FREE';

      if (planOrder[userPlan] < planOrder[minPlan]) {
        return res.status(403).json({
          message: 'Please upgrade your plan',
          upgradeRequired: true,
          requiredPlan: minPlan,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
