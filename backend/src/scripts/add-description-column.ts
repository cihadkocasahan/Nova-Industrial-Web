import { db } from '../db/connection.js';
import { sql } from 'drizzle-orm';

/**
 * hero_sections tablosuna description kolonunu ekleyen migration
 */
async function addDescriptionColumn() {
  try {
    console.log('🔄 hero_sections tablosuna description kolonu ekleniyor...\n');

    // Description kolonunu ekle (eğer yoksa)
    try {
      await db.execute(
        sql`ALTER TABLE hero_sections ADD COLUMN description TEXT NULL AFTER subtitle`
      );
      console.log('✅ description kolonu eklendi');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⏭️  description kolonu zaten var');
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

addDescriptionColumn();

