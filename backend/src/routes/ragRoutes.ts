import { Router } from 'express';
import { RAGChatController } from '../controllers/ragChatController';

const router = Router();
const ragChatController = new RAGChatController();

// RAG Chat endpoints
router.post('/message', (req, res) => ragChatController.sendMessage(req, res));

// Document search endpoints
router.get('/search', (req, res) => ragChatController.searchDocuments(req, res));

// Document management endpoints
router.get('/stats', (req, res) => ragChatController.getDocumentStats(req, res));

export default router;

