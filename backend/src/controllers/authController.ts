import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models';

export class AuthController {
  /**
   * Sync user after sign-in: upsert by firebaseUid; fallback to email if present.
   * Requires auth (req.user populated by middleware).
   */
  async syncUser(req: Request, res: Response): Promise<void> {
    try {
      const decoded = req.user;
      if (!decoded) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const firebaseUid = decoded.uid;
      const email = decoded.email || null;
      const emailVerified = !!decoded.email_verified;
      const name = decoded.name || null;
      const picture = (decoded as any).picture || null;
      const providerId = (decoded.firebase && decoded.firebase.sign_in_provider) || null;

      // Try find by firebaseUid; else by email
      const userRepo = AppDataSource.getRepository(User);
      let user = await userRepo.findOne({ where: [ { firebaseUid }, ...(email ? [{ email }] : []) ] as any });

      if (!user) {
        user = userRepo.create({ firebaseUid });
      }

      // Backfill fields
      user.firebaseUid = firebaseUid;
      user.email = email;
      user.emailVerified = emailVerified;
      user.name = name || user.name || undefined;
      if (!user.firstName && !user.lastName && name) {
        const [first, ...rest] = name.split(' ');
        user.firstName = first || null as any;
        user.lastName = rest.length ? rest.join(' ') : null as any;
      }
      user.photoUrl = picture || user.photoUrl || undefined;
      user.providerId = providerId || user.providerId || undefined;
      user.lastLoginAt = new Date();

      const saved = await userRepo.save(user);
      res.json({ success: true, data: { id: saved.id } });
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  }
}



