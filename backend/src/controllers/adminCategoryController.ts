import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { categories } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(categories);
    res.json({ data: result, meta: { total: result.length } });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, visible } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name ve slug gereklidir' });
    }
    await db.insert(categories).values({
      name,
      slug,
      description: description || null,
      visible: visible !== undefined ? visible : true,
    });
    // Get the inserted category by slug (unique)
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu name veya slug zaten kullanılıyor' });
    }
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, slug, description, visible } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (visible !== undefined) updateData.visible = visible;
    
    await db.update(categories).set(updateData).where(eq(categories.id, id));
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu name veya slug zaten kullanılıyor' });
    }
    next(error);
  }
};

export const toggleCategoryVisible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const currentVisible = result[0].visible ?? true;
    await db.update(categories).set({ visible: !currentVisible }).where(eq(categories.id, id));
    
    const updated = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(categories).where(eq(categories.id, id));
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

