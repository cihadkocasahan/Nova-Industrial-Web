import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { services } from '../db/schema.js';
import { asc, eq, and } from 'drizzle-orm';

export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(services)
      .where(eq(services.visible, true))
      .orderBy(asc(services.order));

    res.json({
      data: result,
      meta: {
        total: result.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

