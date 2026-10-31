import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { articles, categories } from '../db/schema.js';
import { eq, desc, and, isNotNull } from 'drizzle-orm';

export const getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(and(isNotNull(articles.publishedAt), eq(articles.visible, true)))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    const data = result.map((item) => ({
      ...item.article,
      category: item.category,
    }));

    res.json({
      data,
      meta: {
        total: result.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    next(error);
  }
};

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

export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;

    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug))
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

