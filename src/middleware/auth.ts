import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getDb } from '../../server/db.ts';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses ditolak: Token tidak ditemukan' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  // 1. Check if token is a direct user id from system accounts (admin, editor, guru)
  const db = getDb();
  const systemUser = db.users.find((u) => u.id === token || Buffer.from(u.id).toString('base64') === token);
  if (systemUser) {
    req.user = systemUser;
    return next();
  }

  // 2. Otherwise verify as Firebase ID Token
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Akses ditolak: Token tidak valid' });
  }
};
