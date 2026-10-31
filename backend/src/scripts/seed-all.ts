// Nova Agro Unified Database Seeding Entry Point
import { seedAll as seedUnified } from './seed-unified.js';
import { seedProjects } from './seed-projects.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const isDirectRun = Boolean(
  process.argv[1] &&
  (import.meta.url === `file://${process.argv[1]}` ||
   fileURLToPath(import.meta.url) === path.resolve(process.argv[1]))
);

// Main seed all function - runs unified AgTech seeds followed by agricultural projects
async function seedAll() {
  try {
    console.log('🚀 Starting Nova Agro unified database seeding...');
    console.log('📌 Türkçe karakter desteği: utf8mb4_turkish_ci\n');
    
    // 1. Unified seeds (admin, settings, categories, services, brands, keywords, hero, about, articles)
    await seedUnified();

    // 2. Agricultural projects & case studies
    await seedProjects();
    
    console.log('🎉 Nova Agro database seeding completed successfully!');
    if (isDirectRun) {
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    if (isDirectRun) {
      process.exit(1);
    }
    throw error;
  }
}

// Run if called directly
if (isDirectRun) {
  seedAll();
}

export { seedAll };
