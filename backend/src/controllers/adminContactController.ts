import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { contactForms } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const getAllContactForms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const result = await db.select().from(contactForms).orderBy(desc(contactForms.createdAt)).limit(limit).offset(offset);
    const total = await db.select().from(contactForms);
    res.json({ data: result, meta: { total: total.length, limit, offset } });
  } catch (error) {
    next(error);
  }
};

export const getContactFormById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(contactForms).where(eq(contactForms.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Contact form not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.update(contactForms).set({ read: true }).where(eq(contactForms.id, id));
    const result = await db.select().from(contactForms).where(eq(contactForms.id, id)).limit(1);
    if (result.length === 0) return res.status(404).json({ error: 'Contact form not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteContactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await db.delete(contactForms).where(eq(contactForms.id, id));
    res.json({ message: 'Contact form deleted successfully' });
  } catch (error) {
    next(error);
  }
};

