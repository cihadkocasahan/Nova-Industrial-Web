import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { projects, categories, projectImages } from '../db/schema.js';
import { eq, asc, and } from 'drizzle-orm';

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    
    const baseQuery = db.select({
      project: projects,
      category: categories,
    })
    .from(projects)
    .leftJoin(categories, eq(projects.categoryId, categories.id));

    const result = categoryId
      ? await baseQuery
          .where(
            and(
              eq(projects.categoryId, categoryId),
              eq(projects.visible, true),
              eq(categories.visible, true)
            )
          )
          .orderBy(asc(projects.order), asc(projects.createdAt))
      : await baseQuery
          .where(
            and(
              eq(projects.visible, true),
              eq(categories.visible, true)
            )
          )
          .orderBy(asc(projects.order), asc(projects.createdAt));

    // Kategori gizliyse projeyi filtrele
    const formattedResult = result
      .filter((row) => row.category && row.category.visible !== false)
      .map((row) => ({
        ...row.project,
        category: row.category,
      }));

    res.json({
      data: formattedResult,
      meta: {
        total: formattedResult.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectsByCategorySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorySlug = req.params.categorySlug as string;

    // Önce kategoriyi bul ve visible kontrolü yap
    const categoryResult = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, categorySlug), eq(categories.visible, true)))
      .limit(1);

    if (categoryResult.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = categoryResult[0];

    // Kategoriye ait projeleri getir (sadece visible olanlar)
    // NOT: Kategori gizliyse projeler de görünmez (ancak projelerin visible özelliği değişmez)
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.categoryId, category.id), eq(projects.visible, true)))
      .orderBy(asc(projects.order), asc(projects.createdAt));

    // Her proje için resimleri getir
    const projectsWithImages = await Promise.all(
      result.map(async (project) => {
        const images = await db
          .select()
          .from(projectImages)
          .where(eq(projectImages.projectId, project.id))
          .orderBy(asc(projectImages.order), asc(projectImages.createdAt));
        return {
          ...project,
          images: images,
        };
      })
    );

    res.json({
      data: projectsWithImages,
      meta: {
        total: projectsWithImages.length,
        category: category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const result = await db
      .select({
        project: projects,
        category: categories,
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(projects.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Projeye ait resimleri getir
    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, result[0].project.id))
      .orderBy(asc(projectImages.order), asc(projectImages.createdAt));

    res.json({
      data: {
        ...result[0].project,
        category: result[0].category,
        images: images,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db
      .select({
        project: projects,
        category: categories,
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(projects.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Projeye ait resimleri getir
    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, id))
      .orderBy(asc(projectImages.order), asc(projectImages.createdAt));

    res.json({
      data: {
        ...result[0].project,
        category: result[0].category,
        images: images,
      },
    });
  } catch (error) {
    next(error);
  }
};

