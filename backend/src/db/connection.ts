import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

// MySQL connection pool
// Türkçe karakter desteği için utf8mb4 charset kullanılıyor
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'nova_user',
  password: process.env.DB_PASSWORD || 'NovaSecret2026!',
  database: process.env.DB_DATABASE || 'nova_industrial_db',
  charset: 'utf8mb4',
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  multipleStatements: false,
});

// Drizzle ORM instance
export const db = drizzle(connection, { schema, mode: 'default' });

export default connection;
