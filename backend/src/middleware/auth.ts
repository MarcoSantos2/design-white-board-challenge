import { Request, Response, NextFunction } from 'express';
import { getFirebaseAdmin, DecodedIdToken } from '../config/firebaseAdmin';

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedIdToken | null;
  }
}

// Optional auth: verify token if present, otherwise continue
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = authHeader.substring('Bearer '.length);
    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token, true);
    req.user = decoded;
    return next();
  } catch (err) {
    // On error, treat as anonymous but continue
    req.user = null;
    return next();
  }
}

// Required auth: 401 if token invalid/missing
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.substring('Bearer '.length);
    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token, true);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}



