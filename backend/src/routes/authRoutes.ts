import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/sync', requireAuth, controller.syncUser.bind(controller));

export default router;



