import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { ChatRequest } from '../types/chat';

const chatService = new ChatService();

export class ChatController {
  // Server-Sent Events streaming endpoint using OpenAI Responses API
  async streamMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, sessionId } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required and must be a string' });
        return;
      }

      // Prepare SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const { conversation, responsesInput } = await chatService.prepareForStreaming({ message: message.trim(), sessionId, userId: req.user?.uid });

      // Start Responses API stream
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client: any = (require('../config/openai').openai);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stream: AsyncIterable<any> = await (client as any).responses.stream({
        model: require('../config/openai').CHAT_CONFIG.model,
        input: responsesInput,
        temperature: require('../config/openai').CHAT_CONFIG.temperature,
        max_output_tokens: require('../config/openai').CHAT_CONFIG.maxTokens,
      });

      let buffer = '';
      // Send session id early so client can store it
      res.write(`event: session\n`);
      res.write(`data: {"conversationId":"${conversation.id}"}\n\n`);
      for await (const event of stream as any) {
        // Prefer Responses API canonical event types
        if (event?.type === 'response.output_text.delta') {
          const delta = event.delta as string;
          if (delta) {
            buffer += delta;
            res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
          }
          continue;
        }
        if (event?.type === 'response.completed') {
          const finalText = (event.response && (event.response.output_text || '')) as string;
          if (finalText && buffer.length === 0) {
            buffer = finalText;
            res.write(`data: ${JSON.stringify({ text: finalText })}\n\n`);
          }
          break;
        }
        if (event?.type === 'response.error') {
          res.write(`event: error\n`);
          res.write(`data: {"error":"upstream error"}\n\n`);
          break;
        }

        // Fallback to older shapes if present
        const chunk = (event as any).output_text
          ?? ((event as any).delta?.content?.map((c: any) => c?.text?.value).join(''))
          ?? ((event as any).output?.map((p: any) => p.content?.map((c: any) => c.text?.value).join(' ')).join('\n'))
          ?? '';
        if (chunk) {
          buffer += chunk;
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
      }

      // Persist the final assistant message and close the stream
      if (buffer.trim().length > 0) {
        await chatService.saveAssistantMessage(conversation.id, buffer);
      }
      res.write(`event: done\n`);
      res.write(`data: {"ok":true}\n\n`);
      res.end();
    } catch (error) {
      console.error('Error in streaming controller:', error);
      try {
        res.write(`event: error\n`);
        res.write(`data: {"error":"streaming failed"}\n\n`);
        res.end();
      } catch {}
    }
  }
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
        userId: req.user?.uid,
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