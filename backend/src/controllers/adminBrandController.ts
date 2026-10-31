import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { brands } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(brands).orderBy(asc(brands.order));
    res.json({ data: result, meta: { total: result.length } });
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, logoUrl, websiteUrl, order, active, visible } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ error: 'Name ve logoUrl gereklidir' });
    }
    await db.insert(brands).values({
      name,
      logoUrl,
      websiteUrl: websiteUrl || null,
      order: order || 0,
      active: active !== undefined ? active : true,
      visible: visible !== undefined ? visible : true,
    });
    // Get the inserted brand by name (unique)
    const result = await db.select().from(brands).where(eq(brands.name, name)).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu marka zaten kullanılıyor' });
    }
    next(error);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, logoUrl, websiteUrl, order, active, visible } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (logoUrl) updateData.logoUrl = logoUrl;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    if (visible !== undefined) updateData.visible = visible;
    
    await db.update(brands).set(updateData).where(eq(brands.id, id));
    const result = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu marka zaten kullanılıyor' });
    }
    next(error);
  }
};

export const toggleBrandVisible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    const currentVisible = result[0].visible ?? true;
    await db.update(brands).set({ visible: !currentVisible }).where(eq(brands.id, id));
    
    const updated = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(brands).where(eq(brands.id, id));
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};

