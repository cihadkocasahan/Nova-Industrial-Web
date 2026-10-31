import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { seoKeywords } from '../db/schema.js';
import { eq, asc, desc } from 'drizzle-orm';

// Tüm keywords'leri getir
export const getAllKeywords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeOnly = req.query.active === 'true';
    const result = activeOnly
      ? await db.select().from(seoKeywords).where(eq(seoKeywords.active, true)).orderBy(asc(seoKeywords.order), asc(seoKeywords.keyword))
      : await db.select().from(seoKeywords).orderBy(asc(seoKeywords.order), asc(seoKeywords.keyword));
    
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

// Keyword getir (ID ile)
export const getKeywordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(seoKeywords).where(eq(seoKeywords.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Keyword not found' });
    }
    
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

// Yeni keyword ekle
export const createKeyword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword, order, active } = req.body;
    
    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ error: 'Keyword gereklidir' });
    }
    
    // En yüksek order değerini bul
    const maxOrderResult = await db
      .select()
      .from(seoKeywords)
      .orderBy(desc(seoKeywords.order))
      .limit(1);
    
    const firstResult = maxOrderResult[0];
    const maxOrder = firstResult && firstResult.order !== null ? firstResult.order : 0;
    const newOrder = order !== undefined ? order : maxOrder + 1;
    
    await db.insert(seoKeywords).values({
      keyword: keyword.trim(),
      order: newOrder,
      active: active !== undefined ? active : true,
    });
    
    const result = await db.select().from(seoKeywords).where(eq(seoKeywords.keyword, keyword.trim())).limit(1);
    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu keyword zaten mevcut' });
    }
    next(error);
  }
};

// Keyword güncelle
export const updateKeyword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { keyword, order, active } = req.body;
    
    const existing = await db.select().from(seoKeywords).where(eq(seoKeywords.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Keyword not found' });
    }
    
    const updateData: any = {};
    if (keyword !== undefined) updateData.keyword = keyword.trim();
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    
    await db.update(seoKeywords).set(updateData).where(eq(seoKeywords.id, id));
    
    const result = await db.select().from(seoKeywords).where(eq(seoKeywords.id, id)).limit(1);
    res.json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu keyword zaten kullanılıyor' });
    }
    next(error);
  }
};

// Keyword sil
export const deleteKeyword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(seoKeywords).where(eq(seoKeywords.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Keyword not found' });
    }
    
    await db.delete(seoKeywords).where(eq(seoKeywords.id, id));
    res.json({ message: 'Keyword başarıyla silindi' });
  } catch (error) {
    next(error);
  }
};

// Keyword aktif/pasif yap
export const toggleKeywordActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(seoKeywords).where(eq(seoKeywords.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Keyword not found' });
    }
    
    const currentActive = result[0].active ?? true;
    await db.update(seoKeywords).set({ active: !currentActive }).where(eq(seoKeywords.id, id));
    
    const updated = await db.select().from(seoKeywords).where(eq(seoKeywords.id, id)).limit(1);
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
};

// Keywords sırasını güncelle (toplu)
export const updateKeywordsOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keywords } = req.body; // [{ id: 1, order: 0 }, { id: 2, order: 1 }, ...]
    
    if (!Array.isArray(keywords)) {
      return res.status(400).json({ error: 'Keywords array gereklidir' });
    }
    
    // Transaction benzeri işlem - her keyword için order güncelle
    for (const item of keywords) {
      if (item.id && item.order !== undefined) {
        await db
          .update(seoKeywords)
          .set({ order: item.order })
          .where(eq(seoKeywords.id, item.id));
      }
    }
    
    const result = await db.select().from(seoKeywords).orderBy(asc(seoKeywords.order), asc(seoKeywords.keyword));
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

