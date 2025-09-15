import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { ChatRequest } from '../types/chat';

const chatService = new ChatService();

export class ChatController {
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, sessionId } = req.body;

      // Log incoming request
      console.log('📨 Incoming Chat Request:', {
        sessionId: sessionId || 'new',
        messageLength: message?.length || 0,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')?.substring(0, 50) || 'unknown'
      });

      if (!message || typeof message !== 'string') {
        console.log('❌ Invalid request: Missing or invalid message');
        res.status(400).json({
          error: 'Message is required and must be a string',
        });
        return;
      }

      const chatRequest: ChatRequest = {
        message: message.trim(),
        sessionId,
      };

      const response = await chatService.sendMessage(chatRequest);

      // Log successful response
      console.log('✅ Chat Response Sent:', {
        conversationId: response.conversationId,
        responseLength: response.message.length,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error('Error in chat controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process chat message',
      });
    }
  }

  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;

      if (!conversationId) {
        res.status(400).json({
          error: 'Conversation ID is required',
        });
        return;
      }

      const conversation = await chatService.getConversation(conversationId);

      if (!conversation) {
        res.status(404).json({
          error: 'Conversation not found',
        });
        return;
      }

      res.json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      console.error('Error getting conversation:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve conversation',
      });
    }
  }

  async getAllConversations(req: Request, res: Response): Promise<void> {
    try {
      const conversations = await chatService.getAllConversations();

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve conversations',
      });
    }
  }

  async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;

      if (!conversationId) {
        res.status(400).json({
          error: 'Conversation ID is required',
        });
        return;
      }

      const deleted = await chatService.deleteConversation(conversationId);

      if (!deleted) {
        res.status(404).json({
          error: 'Conversation not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Conversation deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete conversation',
      });
    }
  }
} 