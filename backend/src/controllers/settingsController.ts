import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { settings } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';

// Helper function for raw queries (until migration is fixed)
const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USERNAME || 'nova_industrial',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'nova_industrial',
  });
};

// Site offline durumunu kontrol et
export const getSiteOffline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Önce Drizzle ile dene
    try {
      const result = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'site_offline'))
        .limit(1);

      const isOffline = result.length > 0 && result[0].value === 'true';
      return res.json({ data: { siteOffline: isOffline } });
    } catch (drizzleError) {
      // Eğer tablo yoksa raw query ile kontrol et
      const connection = await getConnection();
      const [rows]: any = await connection.execute(
        'SELECT value FROM settings WHERE `key` = ? LIMIT 1',
        ['site_offline']
      );
      await connection.end();
      
      const isOffline = rows.length > 0 && rows[0].value === 'true';
      return res.json({ data: { siteOffline: isOffline } });
    }
  } catch (error) {
    // Varsayılan olarak site açık
    res.json({ data: { siteOffline: false } });
  }
};

// Site offline durumunu güncelle (admin only)
export const updateSiteOffline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { siteOffline } = req.body;
    const value = siteOffline ? 'true' : 'false';

    try {
      // Var olan ayarı kontrol et
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'site_offline'))
        .limit(1);

      if (existing.length > 0) {
        // Güncelle
        await db
          .update(settings)
          .set({ value })
          .where(eq(settings.key, 'site_offline'));
      } else {
        // Yeni oluştur
        await db.insert(settings).values({
          key: 'site_offline',
          value,
          description: 'Site offline/bakım modu durumu',
        });
      }
    } catch (drizzleError) {
      // Raw query ile yap
      const connection = await getConnection();
      const [rows]: any = await connection.execute(
        'SELECT id FROM settings WHERE `key` = ? LIMIT 1',
        ['site_offline']
      );
      
      if (rows.length > 0) {
        await connection.execute(
          'UPDATE settings SET value = ? WHERE `key` = ?',
          [value, 'site_offline']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (`key`, value, description) VALUES (?, ?, ?)',
          ['site_offline', value, 'Site offline/bakım modu durumu']
        );
      }
      await connection.end();
    }

    res.json({ data: { siteOffline: siteOffline === true } });
  } catch (error) {
    next(error);
  }
};

// Tüm ayarları getir (admin)
export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.select().from(settings);
    const settingsMap: Record<string, any> = {};
    result.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });
    res.json({ data: settingsMap });
  } catch (error) {
    next(error);
  }
};

// Anasayfa blok görünürlük ayarlarını getir
export const getHomeSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keys = ['home_show_articles', 'home_show_services', 'home_show_projects', 'home_show_categories'];
    
    try {
      const result = await db.select().from(settings).where(eq(settings.key, keys[0]));
      // Tüm anahtarları kontrol et
      const settingsMap: Record<string, boolean> = {};
      
      for (const key of keys) {
        const [setting] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
        settingsMap[key] = setting ? setting.value === 'true' : true; // Default: true
      }
      
      res.json({ data: settingsMap });
    } catch (drizzleError) {
      // Raw query ile kontrol et
      const connection = await getConnection();
      const settingsMap: Record<string, boolean> = {};
      
      for (const key of keys) {
        const [rows]: any = await connection.execute(
          'SELECT value FROM settings WHERE `key` = ? LIMIT 1',
          [key]
        );
        settingsMap[key] = rows.length > 0 ? rows[0].value === 'true' : true;
      }
      
      await connection.end();
      res.json({ data: settingsMap });
    }
  } catch (error) {
    // Varsayılan değerler
    res.json({ 
      data: { 
        home_show_articles: true,
        home_show_services: true,
        home_show_projects: true,
        home_show_categories: true,
      } 
    });
  }
};

// Anasayfa blok görünürlük ayarlarını güncelle (admin only)
export const updateHomeSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { home_show_articles, home_show_services, home_show_projects, home_show_categories } = req.body;
    
    const updates = [
      { key: 'home_show_articles', value: home_show_articles },
      { key: 'home_show_services', value: home_show_services },
      { key: 'home_show_projects', value: home_show_projects },
      { key: 'home_show_categories', value: home_show_categories },
    ];

    try {
      for (const update of updates) {
        if (update.value === undefined) continue;
        
        const value = update.value ? 'true' : 'false';
        const existing = await db.select().from(settings).where(eq(settings.key, update.key)).limit(1);
        
        if (existing.length > 0) {
          await db.update(settings).set({ value }).where(eq(settings.key, update.key));
        } else {
          await db.insert(settings).values({
            key: update.key,
            value,
            description: `Anasayfada ${update.key.replace('home_show_', '').replace('_', ' ')} bloğunu göster/gizle`,
          });
        }
      }
    } catch (drizzleError) {
      // Raw query ile yap
      const connection = await getConnection();
      
      for (const update of updates) {
        if (update.value === undefined) continue;
        
        const value = update.value ? 'true' : 'false';
        const [rows]: any = await connection.execute(
          'SELECT id FROM settings WHERE `key` = ? LIMIT 1',
          [update.key]
        );
        
        if (rows.length > 0) {
          await connection.execute(
            'UPDATE settings SET value = ? WHERE `key` = ?',
            [value, update.key]
          );
        } else {
          await connection.execute(
            'INSERT INTO settings (`key`, value, description) VALUES (?, ?, ?)',
            [update.key, value, `Anasayfada ${update.key.replace('home_show_', '').replace('_', ' ')} bloğunu göster/gizle`]
          );
        }
      }
      
      await connection.end();
    }

    res.json({ 
      data: { 
        home_show_articles: home_show_articles !== undefined ? home_show_articles : true,
        home_show_services: home_show_services !== undefined ? home_show_services : true,
        home_show_projects: home_show_projects !== undefined ? home_show_projects : true,
        home_show_categories: home_show_categories !== undefined ? home_show_categories : true,
      } 
    });
  } catch (error) {
    next(error);
  }
};


// ========== SITE INFO SETTINGS ==========

// Site bilgileri için default değerler
const SITE_INFO_DEFAULTS: Record<string, string> = {
  site_name: 'Firma Adı',
  site_slogan: 'Güvenilir çözüm ortağınız.',
  site_email: 'info@example.com',
  site_phone: '+90 500 000 00 00',
  site_address: 'Adres bilgisi',
  site_whatsapp: '',
  site_primary_color: '#0ea5e9',
  site_cta_text: 'Teklif Al',
  site_meta_title: 'Firma Adı - Hizmetler',
  site_meta_description: 'Profesyonel hizmetler için bize ulaşın.',
  site_meta_keywords: '',
};

// Site bilgilerini getir (public)
export const getSiteInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keys = Object.keys(SITE_INFO_DEFAULTS);
    const result = await db.select().from(settings);

    const siteInfo: Record<string, string> = { ...SITE_INFO_DEFAULTS };
    result.forEach((s) => {
      if (keys.includes(s.key) && s.value !== null) {
        siteInfo[s.key] = s.value;
      }
    });

    res.json({ data: siteInfo });
  } catch (error) {
    // Hata durumunda default değerleri döndür
    res.json({ data: SITE_INFO_DEFAULTS });
  }
};

// Site bilgilerini güncelle (admin only)
export const updateSiteInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body as Record<string, string>;
    const allowedKeys = Object.keys(SITE_INFO_DEFAULTS);

    for (const [key, value] of Object.entries(updates)) {
      if (!allowedKeys.includes(key)) continue;
      if (value === undefined || value === null) continue;

      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db.update(settings).set({ value: String(value) }).where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({
          key,
          value: String(value),
          description: `Site bilgisi: ${key}`,
        });
      }
    }

    // Güncel değerleri döndür
    const result = await db.select().from(settings);
    const siteInfo: Record<string, string> = { ...SITE_INFO_DEFAULTS };
    result.forEach((s) => {
      if (allowedKeys.includes(s.key) && s.value !== null) {
        siteInfo[s.key] = s.value;
      }
    });

    res.json({ data: siteInfo });
  } catch (error) {
    next(error);
  }
};
