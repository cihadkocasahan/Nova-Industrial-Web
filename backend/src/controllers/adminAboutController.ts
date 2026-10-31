import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { aboutSections } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAboutSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(aboutSections).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'About section not found' });
    }
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createAboutSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, visible } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title ve content gereklidir' });
    }
    
    // Mevcut kayıt varsa, yeni kayıt oluşturma
    const existing = await db.select().from(aboutSections).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'About section zaten mevcut. Güncelleme yapın.' });
    }
    
    await db.insert(aboutSections).values({
      title,
      content,
      visible: visible !== undefined ? visible : true,
    });
    
    const result = await db.select().from(aboutSections).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const updateAboutSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, content, visible } = req.body;
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (visible !== undefined) updateData.visible = visible;
    
    await db.update(aboutSections).set(updateData).where(eq(aboutSections.id, id));
    const result = await db.select().from(aboutSections).where(eq(aboutSections.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'About section not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const toggleAboutSectionVisible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(aboutSections).where(eq(aboutSections.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'About section not found' });
    }
    
    const currentVisible = result[0].visible ?? true;
    const newVisible = !currentVisible;
    
    await db.update(aboutSections).set({ visible: newVisible }).where(eq(aboutSections.id, id));
    
    const updated = await db.select().from(aboutSections).where(eq(aboutSections.id, id)).limit(1);
    
    if (updated.length === 0) {
      return res.status(404).json({ error: 'About section not found after update' });
    }
    
    res.json({ data: updated[0] });
  } catch (error) {
    console.error('Toggle about section visible error:', error);
    next(error);
  }
};

