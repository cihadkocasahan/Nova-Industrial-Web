import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import { db } from '../db/connection.js';
import { adminUsers } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email ve şifre gereklidir' });
    }

    // Database'den kullanıcıyı bul
    const users = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.email, email), eq(adminUsers.active, true)))
      .limit(1);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const user = users[0];

    // Şifreyi kontrol et
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    // JWT token oluştur — JWT_SECRET mutlaka .env'de tanımlı olmalı (hardcoded fallback YASAK)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[SECURITY] JWT_SECRET is not set in environment variables!');
      return res.status(500).json({ error: 'Sunucu yapılandırma hatası' });
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN || '2h') as SignOptions['expiresIn'];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn } as SignOptions
    );

    return res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login işlemi başarısız' });
  }
});

// Me endpoint (current user) - protected
router.get('/me', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, userId))
      .limit(1);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    return res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ error: 'Kullanıcı bilgisi alınamadı' });
  }
});

export default router;
