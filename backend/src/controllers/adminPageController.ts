import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { pages } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(pages);
    res.json({ data: result, meta: { total: result.length } });
  } catch (error) {
    next(error);
  }
};

export const getPageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, slug, content, seoTitle, seoDescription, publishedAt } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug ve content gereklidir' });
    }
    await db.insert(pages).values({
      title,
      slug,
      content,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    });
    // Get the inserted page by slug (unique)
    const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu slug veya title zaten kullanılıyor' });
    }
    next(error);
  }
};

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, content, seoTitle, seoDescription, publishedAt } = req.body;
    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    
    await db.update(pages).set(updateData).where(eq(pages.id, id));
    const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu slug veya title zaten kullanılıyor' });
    }
    next(error);
  }
};

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(pages).where(eq(pages.id, id));
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    next(error);
  }
};

