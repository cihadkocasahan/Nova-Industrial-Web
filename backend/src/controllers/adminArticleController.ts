import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { articles, categories } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Admin: Tüm makaleleri getir (published olmayanları da dahil)
export const getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select().from(articles);
    const total = totalResult.length;

    const data = result.map((item) => ({
      ...item.article,
      category: item.category,
    }));

    res.json({
      data,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Tek makale getir
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const data = {
      ...result[0].article,
      category: result[0].category,
    };

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

// Admin: Yeni makale oluştur
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, slug, excerpt, content, featuredImage, categoryId, publishedAt } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug ve content gereklidir' });
    }

    await db.insert(articles).values({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featuredImage: featuredImage || null,
      categoryId: categoryId ? Number(categoryId) : null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      visible: req.body.visible !== undefined ? req.body.visible : true,
    });

    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug))
      .limit(1);

    res.status(201).json({ data: { ...result[0].article, category: result[0].category } });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu slug veya başlık zaten kullanılıyor' });
    }
    next(error);
  }
};

// Admin: Makale güncelle
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, excerpt, content, featuredImage, categoryId, publishedAt } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (categoryId !== undefined) updateData.categoryId = categoryId ? Number(categoryId) : null;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    if (req.body.visible !== undefined) updateData.visible = req.body.visible;

    await db.update(articles).set(updateData).where(eq(articles.id, id));

    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ data: { ...result[0].article, category: result[0].category } });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu slug veya başlık zaten kullanılıyor' });
    }
    next(error);
  }
};

// Admin: Makale sil
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(articles).where(eq(articles.id, id));
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Makale visible toggle
export const toggleArticleVisible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const currentVisible = result[0].visible ?? true;
    await db.update(articles).set({ visible: !currentVisible }).where(eq(articles.id, id));
    
    const updated = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
};

