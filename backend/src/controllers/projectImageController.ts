import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { projectImages, projects } from '../db/schema.js';
import { eq, asc, and } from 'drizzle-orm';

export const getProjectImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    
    const result = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, projectId))
      .orderBy(asc(projectImages.order), asc(projectImages.createdAt));

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

export const createProjectImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);
    const { imageUrl, order } = req.body;

    // Projenin var olduğunu kontrol et
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await db.insert(projectImages).values({
      projectId,
      imageUrl,
      order: order || 0,
    });

    // Get the inserted image (by unique identifier or latest)
    const result = await db
      .select()
      .from(projectImages)
      .where(and(
        eq(projectImages.projectId, projectId),
        eq(projectImages.imageUrl, imageUrl)
      ))
      .orderBy(asc(projectImages.createdAt))
      .limit(1);

    res.status(201).json({ data: result[0] });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bu resim zaten ekli' });
    }
    next(error);
  }
};

export const deleteProjectImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(projectImages).where(eq(projectImages.id, id)).limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project image not found' });
    }

    await db.delete(projectImages).where(eq(projectImages.id, id));

    res.json({ message: 'Project image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateProjectImageOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { order } = req.body;

    const existingImage = await db.select().from(projectImages).where(eq(projectImages.id, id)).limit(1);

    if (existingImage.length === 0) {
      return res.status(404).json({ error: 'Project image not found' });
    }

    await db
      .update(projectImages)
      .set({ order: order !== undefined ? order : existingImage[0].order })
      .where(eq(projectImages.id, id));

    const result = await db.select().from(projectImages).where(eq(projectImages.id, id)).limit(1);

    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

