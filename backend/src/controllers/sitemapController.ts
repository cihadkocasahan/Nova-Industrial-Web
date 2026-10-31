import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { projects, categories } from '../db/schema.js';
import { asc } from 'drizzle-orm';

export const generateSitemap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseUrl = process.env.BASE_URL || 'https://nova-industrial.demo';
    
    // Kategorileri getir
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.id));
    
    // Projeleri getir
    const allProjects = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.createdAt));
    
    // Sitemap XML oluştur
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Ana Sayfa -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- İletişim Sayfası -->
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Kategori Sayfaları -->
${allCategories.map(category => {
    const date = category.updatedAt || category.createdAt;
    const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
}).join('\n')}
  
  <!-- Proje Sayfaları -->
${allProjects.map(project => {
    const date = project.updatedAt || project.createdAt;
    const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${baseUrl}/proje/${project.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n')}
  
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    next(error);
  }
};

