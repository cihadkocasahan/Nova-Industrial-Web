import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { brands } from '../db/schema.js';
import { asc, eq, and } from 'drizzle-orm';

export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(brands)
      .orderBy(asc(brands.order));

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

export const getActiveBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('getActiveBrands called');
    const result = await db
      .select()
      .from(brands)
      .where(and(eq(brands.active, true), eq(brands.visible, true)))
      .orderBy(asc(brands.order));

    console.log('Active brands found:', result.length);
    res.json({
      data: result,
      meta: {
        total: result.length,
      },
    });
  } catch (error) {
    console.error('Error in getActiveBrands:', error);
    next(error);
  }
};

export const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(brands)
      .where(eq(brands.id, parseInt(id as string)))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

