import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from './connection.js';
import { seedAll } from '../scripts/seed-all.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function runMigrations() {
  try {
    // Türkçe karakter desteği için database charset ayarla
    console.log('🔧 Ensuring database charset and collation for Turkish characters...');
    try {
      const tempConnection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USERNAME || 'nova_user',
        password: process.env.DB_PASSWORD || 'NovaSecret2026!',
        database: process.env.DB_DATABASE || 'nova_industrial_db',
      });
      
      await tempConnection.query('ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci');
      await tempConnection.query('SET NAMES utf8mb4 COLLATE utf8mb4_turkish_ci');
      await tempConnection.end();
      
      console.log('✅ Database charset set to utf8mb4_turkish_ci');
    } catch (error: any) {
      console.log('ℹ️  Database charset already configured or cannot be changed (this is OK)');
    }

    console.log('🔄 Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully!');
    
    // Seed initial data if AUTO_SEED is enabled (default: true)
    const shouldSeed = process.env.AUTO_SEED !== 'false';
    if (shouldSeed) {
      console.log('🌱 Auto-seeding enabled, running seed scripts...');
      await seedAll();
      console.log('✅ Auto-seeding completed successfully!');
    } else {
      console.log('ℹ️  Auto-seeding skipped (AUTO_SEED=false)');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migration process completed!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Migration process failed:', err);
      process.exit(1);
    });
}

export { runMigrations };
