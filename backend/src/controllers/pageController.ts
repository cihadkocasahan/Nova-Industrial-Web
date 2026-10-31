import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { pages } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(pages);

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

export const getPageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const result = await db
      .select()
      .from(pages)
      .where(eq(pages.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;

    const result = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

