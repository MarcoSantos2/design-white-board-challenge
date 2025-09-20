import { Router } from 'express';
import { ChatController } from '../controllers/chatController';

const router = Router();
const chatController = new ChatController();

// Chat endpoints
router.post('/message', chatController.sendMessage.bind(chatController));
router.post('/message/stream', chatController.streamMessage.bind(chatController));
router.get('/conversations', chatController.getAllConversations.bind(chatController));
router.get('/conversations/:conversationId', chatController.getConversation.bind(chatController));
router.delete('/conversations/:conversationId', chatController.deleteConversation.bind(chatController));

export default router; 