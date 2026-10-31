import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

/**
 * JWT_SECRET must be set via environment variable.
 * Never use a hardcoded fallback — fail fast at startup if missing.
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      '[SECURITY] JWT_SECRET environment variable is not set. ' +
        'Set it in backend/.env before starting the server.'
    );
  }
  return secret;
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as { id: number; email: string };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('[SECURITY]')) {
      // Critical server misconfiguration — propagate to global error handler
      return next(error);
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};
