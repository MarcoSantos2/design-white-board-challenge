import { AppDataSource } from '../config/database';
import { openai, CHAT_CONFIG } from '../config/openai';
import { ChatMessage, ChatRequest, ChatResponse, ConversationSession } from '../types/chat';
import { Conversation, Message, MessageRole } from '../entities';

// System prompt for the UX Whiteboard Challenge Facilitator
const SYSTEM_PROMPT = `You are a senior UX interviewer at a tech company conducting 60-minute whiteboard design challenges. Your role is to evaluate candidates through realistic design problems commonly used in UX/UI job interviews.

Interview Approach:
- Begin with vague design prompts to evaluate how candidates handle ambiguity
- Let the candidate lead the conversation — do not suggest what they should do next, offer guidance, or prompt them to ask questions
- If the candidate explicitly asks for context (e.g., "who are you as a company?" or "what problem are we solving?"), provide brief, 1–2 sentence responses
- Do not give feedback or suggestions unless the candidate is clearly stuck and not progressing after multiple turns — in that case, offer a minimal nudge to help them move forward

Communication Style:
- Keep responses terse (1–2 sentences) and maintain a neutral, professional tone
- Do not over-explain or be overly supportive
- Focus on observing the candidate's problem-solving process rather than guiding them through it
- Simulate a realistic interview environment where the candidate must demonstrate initiative and structured thinking

Your goal is to assess how candidates approach design challenges, handle ambiguity, ask clarifying questions, and structure their problem-solving process independently.`;

export class ChatService {
  private conversationRepository = AppDataSource.getRepository(Conversation);
  private messageRepository = AppDataSource.getRepository(Message);

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      let conversation: Conversation;

      // Get or create conversation
      if (request.sessionId) {
        const existingConversation = await this.conversationRepository.findOne({
          where: { id: request.sessionId },
          relations: ['messages']
        });

        if (existingConversation) {
          conversation = existingConversation;
        } else {
          // Session ID provided but not found, create new conversation
          conversation = this.conversationRepository.create({
            id: request.sessionId,
            messages: []
          });
          await this.conversationRepository.save(conversation);
        }
      } else {
        // Create new conversation
        conversation = this.conversationRepository.create({
          messages: []
        });
        await this.conversationRepository.save(conversation);
      }

      // Add user message to conversation
      const userMessage = this.messageRepository.create({
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: request.message,
        timestamp: new Date()
      });
      await this.messageRepository.save(userMessage);

      // Prepare messages for OpenAI API (reload conversation to get latest messages)
      const updatedConversation = await this.conversationRepository.findOne({
        where: { id: conversation.id },
        relations: ['messages'],
        order: { messages: { timestamp: 'ASC' } }
      });

      if (!updatedConversation) {
        throw new Error('Failed to retrieve updated conversation');
      }

      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...updatedConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: CHAT_CONFIG.model,
        messages: messages,
        max_tokens: CHAT_CONFIG.maxTokens,
        temperature: CHAT_CONFIG.temperature,
      });

      const assistantMessage = completion.choices[0]?.message?.content || '';
      if (!assistantMessage) {
        throw new Error('No response from OpenAI API');
      }

      // Save assistant message to database
      const assistantMessageEntity = this.messageRepository.create({
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: assistantMessage,
        timestamp: new Date()
      });
      await this.messageRepository.save(assistantMessageEntity);

      // Update conversation lastUpdated
      conversation.lastUpdated = new Date();
      await this.conversationRepository.save(conversation);

      return {
        message: assistantMessage,
        conversationId: conversation.id,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to get response from chat service');
    }
  }

  async getConversation(conversationId: string): Promise<ConversationSession | null> {
    try {
      const conversation = await this.conversationRepository.findOne({
        where: { id: conversationId },
        relations: ['messages'],
        order: { messages: { timestamp: 'ASC' } }
      });

      if (!conversation) {
        return null;
      }

      // Convert TypeORM entities to interface format
      return {
        id: conversation.id,
        messages: conversation.messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        })),
        createdAt: conversation.createdAt,
        lastUpdated: conversation.lastUpdated
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async getAllConversations(): Promise<ConversationSession[]> {
    try {
      const conversations = await this.conversationRepository.find({
        relations: ['messages'],
        order: { lastUpdated: 'DESC' }
      });

      return conversations.map(conversation => ({
        id: conversation.id,
        messages: conversation.messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        })),
        createdAt: conversation.createdAt,
        lastUpdated: conversation.lastUpdated
      }));
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const result = await this.conversationRepository.delete(conversationId);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }
} 