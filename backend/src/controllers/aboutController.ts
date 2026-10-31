import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { aboutSections } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Tek bir about section var, o yüzden direkt ilk kaydı döndürüyoruz
export const getAboutSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db
      .select()
      .from(aboutSections)
      .where(eq(aboutSections.visible, true))
      .limit(1);

    if (result.length === 0) {
      // Visible about section yoksa, tüm kayıtları kontrol et
      const allAboutSections = await db
        .select()
        .from(aboutSections)
        .limit(1);
      
      if (allAboutSections.length > 0) {
        return res.json({
          data: allAboutSections[0],
        });
      }
      
      // Hiç about section yoksa, null döndür
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

