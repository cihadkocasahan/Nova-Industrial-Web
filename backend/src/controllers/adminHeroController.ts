import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { heroSections } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAllHeroSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(heroSections).orderBy(asc(heroSections.order));
    res.json({ data: result, meta: { total: result.length } });
  } catch (error) {
    next(error);
  }
};

export const getHeroSectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(heroSections).where(eq(heroSections.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Hero section not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createHeroSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, subtitle, description, ctaText, ctaLink, backgroundImage, active, order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title gereklidir' });
    }
    
    // Birden fazla slide aktif olabilir, radio button mantığı kaldırıldı
    await db.insert(heroSections).values({
      title,
      subtitle: subtitle || null,
      description: description || null,
      ctaText: ctaText || null,
      ctaLink: ctaLink || null,
      backgroundImage: backgroundImage || null,
      active: active || false,
      order: order || 0,
    });
    // Get the inserted hero section by title
    const result = await db.select().from(heroSections).where(eq(heroSections.title, title)).orderBy(asc(heroSections.id)).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const updateHeroSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, subtitle, description, ctaText, ctaLink, backgroundImage, active, order } = req.body;
    const updateData: any = {};
    if (title) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (ctaText !== undefined) updateData.ctaText = ctaText;
    if (ctaLink !== undefined) updateData.ctaLink = ctaLink;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage;
    if (active !== undefined) {
      updateData.active = active;
      // Birden fazla slide aktif olabilir, radio button mantığı kaldırıldı
    }
    if (order !== undefined) updateData.order = order;
    
    await db.update(heroSections).set(updateData).where(eq(heroSections.id, id));
    const result = await db.select().from(heroSections).where(eq(heroSections.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Hero section not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteHeroSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(heroSections).where(eq(heroSections.id, id));
    res.json({ message: 'Hero section deleted successfully' });
  } catch (error) {
    next(error);
  }
};

