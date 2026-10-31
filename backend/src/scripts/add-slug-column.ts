import { db } from '../db/connection.js';
import { sql } from 'drizzle-orm';

/**
 * Projects tablosuna slug ve SEO kolonlarını ekleyen migration
 */
async function addSlugColumns() {
  try {
    console.log('🔄 Projects tablosuna slug ve SEO kolonları ekleniyor...\n');

    // Slug kolonunu ekle (eğer yoksa)
    try {
      await db.execute(
        sql`ALTER TABLE projects ADD COLUMN slug VARCHAR(255) AFTER title`
      );
      console.log('✅ slug kolonu eklendi');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⏭️  slug kolonu zaten var');
      } else {
        throw error;
      }
    }

    // SEO kolonlarını ekle (eğer yoksa)
    try {
      await db.execute(
        sql`ALTER TABLE projects ADD COLUMN seo_title VARCHAR(255) AFTER location`
      );
      console.log('✅ seo_title kolonu eklendi');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⏭️  seo_title kolonu zaten var');
      } else {
        throw error;
      }
    }

    try {
      await db.execute(
        sql`ALTER TABLE projects ADD COLUMN seo_description TEXT AFTER seo_title`
      );
      console.log('✅ seo_description kolonu eklendi');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⏭️  seo_description kolonu zaten var');
      } else {
        throw error;
      }
    }

    try {
      await db.execute(
        sql`ALTER TABLE projects ADD COLUMN seo_keywords TEXT AFTER seo_description`
      );
      console.log('✅ seo_keywords kolonu eklendi');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⏭️  seo_keywords kolonu zaten var');
      } else {
        throw error;
      }
    }

    // Slug index'ini ekle (eğer yoksa)
    try {
      await db.execute(
        sql`CREATE INDEX slug_idx ON projects(slug)`
      );
      console.log('✅ slug index eklendi');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⏭️  slug index zaten var');
      } else {
        throw error;
      }
    }

    console.log('\n✨ Migration tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration başarısız:', error);
    process.exit(1);
  }
}

addSlugColumns();

