import { Router } from 'express';
import { TestRAGController } from '../controllers/testRAGController';

const router = Router();
const testRAGController = new TestRAGController();

// Test RAG endpoints
router.get('/search', (req, res) => testRAGController.testSearch(req, res));
router.get('/stats', (req, res) => testRAGController.testStats(req, res));

export default router;

