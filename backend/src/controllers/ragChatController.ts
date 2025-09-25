import { Request, Response } from 'express';
import { RAGChatService } from '../services/ragChatService';
import { ChatRequest } from '../types/chat';

const ragChatService = new RAGChatService();

export class RAGChatController {
  /**
   * Send a message with RAG context
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, sessionId } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required and must be a string' });
        return;
      }

      const request: ChatRequest = {
        message: message.trim(),
        sessionId
      };

      const response = await ragChatService.sendMessageWithRAG(request);
      res.json(response);
    } catch (error) {
      console.error('Error in RAG chat controller:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Search documents for specific topics
   */
  async searchDocuments(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query is required and must be a string' });
        return;
      }

      const searchLimit = limit ? parseInt(limit as string) : 5;
      const results = await ragChatService.searchDocuments(query, searchLimit);

      res.json({
        success: true,
        data: {
          query,
          results,
          count: results.length
        }
      });
    } catch (error) {
      console.error('Error searching documents:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await ragChatService.getDocumentStats();
      
      if (!stats) {
        res.status(500).json({ error: 'Failed to retrieve document statistics' });
        return;
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting document stats:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

