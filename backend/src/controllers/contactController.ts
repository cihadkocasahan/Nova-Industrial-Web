import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { contactForms } from '../db/schema.js';
import { sendContactEmail } from '../services/emailService.js';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const createContactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = contactFormSchema.parse(req.body);

    // Insert into database
    const result = await db.insert(contactForms).values({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      subject: validatedData.subject,
      message: validatedData.message,
    });

    // Send email notification (don't block response if email fails)
    try {
      await sendContactEmail(validatedData);
    } catch (emailError) {
      console.error('Failed to send contact form email:', emailError);
      // Continue even if email fails - form is saved to database
    }

    res.status(201).json({
      data: {
        id: result[0].insertId,
        ...validatedData,
      },
      message: 'İletişim formu başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
};

