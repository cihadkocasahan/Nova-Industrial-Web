import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { heroSections } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAllHeroSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(heroSections)
      .orderBy(asc(heroSections.order));

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

export const getActiveHeroSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(heroSections)
      .where(eq(heroSections.active, true))
      .orderBy(asc(heroSections.order))
      .limit(1);

    if (result.length === 0) {
      // Active hero section yoksa, ilk hero section'ı döndür veya null döndür
      const allHeroSections = await db
        .select()
        .from(heroSections)
        .orderBy(asc(heroSections.order))
        .limit(1);
      
      if (allHeroSections.length > 0) {
        // İlk hero section'ı döndür
        return res.json({
          data: allHeroSections[0],
        });
      }
      
      // Hiç hero section yoksa, null döndür (frontend default kullanacak)
      return res.json({
        data: null,
      });
    }

    res.json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

// Tüm aktif hero sections'ı getir (slider için)
export const getActiveHeroSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(heroSections)
      .where(eq(heroSections.active, true))
      .orderBy(asc(heroSections.order));

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

