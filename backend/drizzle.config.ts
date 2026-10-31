import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USERNAME || 'nova_industrial',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'nova_industrial',
  },
} satisfies Config;

