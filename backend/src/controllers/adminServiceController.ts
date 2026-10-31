import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { services } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(services).orderBy(asc(services.order));
    res.json({ data: result, meta: { total: result.length } });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, icon, iconText, order } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title ve description gereklidir' });
    }
    await db.insert(services).values({
      title,
      description,
      icon: icon || null,
      iconText: iconText || null,
      order: order || 0,
      visible: req.body.visible !== undefined ? req.body.visible : true,
    });
    // Get the inserted service by title (unique)
    const result = await db.select().from(services).where(eq(services.title, title)).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu başlık zaten kullanılıyor' });
    }
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, description, icon, iconText, order } = req.body;
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (iconText !== undefined) updateData.iconText = iconText;
    if (order !== undefined) updateData.order = order;
    if (req.body.visible !== undefined) updateData.visible = req.body.visible;
    
    await db.update(services).set(updateData).where(eq(services.id, id));
    const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu başlık zaten kullanılıyor' });
    }
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(services).where(eq(services.id, id));
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Hizmet visible toggle
export const toggleServiceVisible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const currentVisible = result[0].visible ?? true;
    await db.update(services).set({ visible: !currentVisible }).where(eq(services.id, id));
    
    const updated = await db.select().from(services).where(eq(services.id, id)).limit(1);
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
};

