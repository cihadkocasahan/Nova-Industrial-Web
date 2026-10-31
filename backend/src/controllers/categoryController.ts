import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.visible, true));

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

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

