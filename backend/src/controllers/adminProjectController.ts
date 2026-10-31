import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { projects } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { generateSlug } from '../utils/slug.js';

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    
    const result = categoryId
      ? await db.select().from(projects).where(eq(projects.categoryId, categoryId)).orderBy(desc(projects.createdAt))
      : await db.select().from(projects).orderBy(desc(projects.createdAt));

    res.json({
      data: result,
      meta: {
        total: result.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, title, slug, description, content, image, location, seoTitle, seoDescription, seoKeywords, order } = req.body;

    if (!categoryId || !title || !content) {
      return res.status(400).json({ error: 'categoryId, title ve content gereklidir' });
    }

    // Slug oluştur (verilmemişse title'dan oluştur)
    const projectSlug = slug || generateSlug(title);

    await db.insert(projects).values({
      categoryId: Number(categoryId),
      title,
      slug: projectSlug,
      description: description || null,
      content,
      image: image || null,
      location: location || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      seoKeywords: seoKeywords || null,
      order: order || 0,
      visible: req.body.visible !== undefined ? req.body.visible : true,
    });

    // Get the inserted project by title (unique identifier)
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.title, title))
      .orderBy(desc(projects.createdAt))
      .limit(1);

    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu proje zaten mevcut' });
    }
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { categoryId, title, slug, description, content, image, location, seoTitle, seoDescription, seoKeywords, order } = req.body;

    const existingProject = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (existingProject.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Slug güncelle (verilmemişse veya title değiştiyse title'dan oluştur)
    let projectSlug = slug || existingProject[0].slug;
    if (title && title !== existingProject[0].title && !slug) {
      projectSlug = generateSlug(title);
    }

    const updateData: any = {
      categoryId: categoryId !== undefined ? Number(categoryId) : existingProject[0].categoryId,
      title: title || existingProject[0].title,
      slug: projectSlug,
      description: description !== undefined ? description : existingProject[0].description,
      content: content || existingProject[0].content,
      image: image !== undefined ? image : existingProject[0].image,
      location: location !== undefined ? location : existingProject[0].location,
      seoTitle: seoTitle !== undefined ? seoTitle : existingProject[0].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription : existingProject[0].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords : existingProject[0].seoKeywords,
      order: order !== undefined ? order : existingProject[0].order,
    };
    
    if (req.body.visible !== undefined) updateData.visible = req.body.visible;
    
    await db.update(projects).set(updateData).where(eq(projects.id, id));

    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    res.json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu title zaten kullanılıyor' });
    }
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await db.delete(projects).where(eq(projects.id, id));

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Proje visible toggle
export const toggleProjectVisible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const currentVisible = result[0].visible ?? true;
    await db.update(projects).set({ visible: !currentVisible }).where(eq(projects.id, id));
    
    const updated = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
};

