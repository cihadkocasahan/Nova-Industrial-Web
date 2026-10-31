import { db } from '../db/connection.js';
import { projects } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateSlug } from '../utils/slug.js';

/**
 * Mevcut projelere slug ekleyen migration script
 * Eğer slug null veya boşsa, title'dan otomatik oluşturur
 */
async function migrateProjectsSlug() {
  try {
    console.log('🔄 Proje slug migration başlatılıyor...\n');

    // Tüm projeleri getir
    const allProjects = await db.select().from(projects);

    console.log(`📊 Toplam ${allProjects.length} proje bulundu.\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const project of allProjects) {
      try {
        // Slug null veya boşsa, title'dan oluştur
        if (!project.slug || project.slug.trim() === '') {
          const newSlug = generateSlug(project.title);
          
          // Slug'ın unique olduğundan emin ol (varsa sayı ekle)
          let finalSlug = newSlug;
          let counter = 1;
          
          while (true) {
            const existing = await db
              .select()
              .from(projects)
              .where(eq(projects.slug, finalSlug))
              .limit(1);
            
            // Kendi slug'ını buluyorsa veya hiç kimse yoksa, bu slug'ı kullan
            if (existing.length === 0 || existing[0].id === project.id) {
              break;
            }
            
            finalSlug = `${newSlug}-${counter}`;
            counter++;
          }

          // Drizzle ORM ile güncelleme
          await db
            .update(projects)
            .set({ slug: finalSlug })
            .where(eq(projects.id, project.id));

          console.log(`✅ Proje güncellendi: "${project.title}" -> "${finalSlug}"`);
          updatedCount++;
        } else {
          console.log(`⏭️  Slug zaten var: "${project.title}" (slug: "${project.slug}")`);
          skippedCount++;
        }
      } catch (error: any) {
        console.error(`❌ Hata (${project.title}):`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✨ Migration tamamlandı!`);
    console.log(`   - Güncellenen: ${updatedCount}`);
    console.log(`   - Atlanan: ${skippedCount}`);
    console.log(`   - Hata: ${errorCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration başarısız:', error);
    process.exit(1);
  }
}

migrateProjectsSlug();

