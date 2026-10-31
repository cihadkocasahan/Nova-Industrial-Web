import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { quoteRequests } from '../db/schema.js';
import { sendQuoteEmail } from '../services/emailService.js';
import { z } from 'zod';
import { desc } from 'drizzle-orm';

export const quoteSchema = z.object({
  fullName: z.string().min(1, 'Ad Soyad zorunludur').max(255),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(1, 'Telefon numarası zorunludur').max(50),
  serviceType: z.string().min(1, 'Hizmet türü seçilmelidir').max(100),
  farmLocation: z.string().max(255).optional(),
  landArea: z.string().max(100).optional(),
  landUnit: z.string().optional(),
  cropType: z.string().max(100).optional(),
  notes: z.string().optional(),
});

export const createQuoteRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = quoteSchema.parse(req.body);

    // Format land area if landUnit is provided
    let finalLandArea = validatedData.landArea;
    if (finalLandArea && validatedData.landUnit && !finalLandArea.includes(validatedData.landUnit)) {
      finalLandArea = `${finalLandArea} ${validatedData.landUnit}`;
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `AGRO-${year}-${randomSuffix}`;

    let insertedId: number | null = null;
    let savedInDb = false;

    // Database insertion with fallback if DB is offline
    try {
      const result = await db.insert(quoteRequests).values({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        serviceType: validatedData.serviceType,
        farmLocation: validatedData.farmLocation || null,
        landArea: finalLandArea || null,
        cropType: validatedData.cropType || null,
        notes: validatedData.notes || null,
        status: 'pending',
      });
      insertedId = result[0]?.insertId ?? null;
      savedInDb = true;
    } catch (dbError: any) {
      console.warn('⚠️ Database insert into quoteRequests failed, falling back to mock mode:', dbError.message);
    }

    // Send email notification (non-blocking)
    try {
      await sendQuoteEmail({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        serviceType: validatedData.serviceType,
        farmLocation: validatedData.farmLocation,
        landArea: finalLandArea,
        cropType: validatedData.cropType,
        notes: validatedData.notes,
        referenceCode,
      });
    } catch (emailError) {
      console.error('Failed to dispatch quote notification email:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Teklif talebiniz başarıyla alındı.',
      referenceCode,
      data: {
        id: insertedId || Date.now(),
        referenceCode,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        serviceType: validatedData.serviceType,
        farmLocation: validatedData.farmLocation,
        landArea: finalLandArea,
        cropType: validatedData.cropType,
        notes: validatedData.notes,
        status: 'pending',
        savedInDb,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
};

export const getAllQuoteRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    try {
      const result = await db
        .select()
        .from(quoteRequests)
        .orderBy(desc(quoteRequests.createdAt));

      return res.json({
        data: result,
        meta: {
          total: result.length,
        },
      });
    } catch (dbError: any) {
      console.warn('⚠️ Could not fetch quoteRequests from DB:', dbError.message);
      return res.json({
        data: [],
        meta: {
          total: 0,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
