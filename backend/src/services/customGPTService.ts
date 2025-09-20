import { openai, CHAT_CONFIG } from '../config/openai';
import { Conversation, Message, MessageRole } from '../models';
import AppDataSource from '../config/datasource';

export class CustomGPTService {
  /**
   * Send a message using OpenAI with custom GPT instructions
   */
  async sendMessage(message: string, conversationId?: string): Promise<{
    success: boolean;
    data: {
      message: string;
      conversationId: string;
      timestamp: string;
    };
  }> {
    try {
      let conversation: Conversation | null = null;

      if (conversationId) {
        // Load existing conversation
        conversation = await AppDataSource.manager.findOne(Conversation, {
          where: { id: conversationId },
          relations: ['messages']
        });

        if (!conversation) {
          throw new Error('Conversation not found');
        }
      } else {
        // Create new conversation
        conversation = new Conversation();
        conversation.id = this.generateConversationId();
        conversation.createdAt = new Date();
        conversation.lastUpdated = new Date();
        await AppDataSource.manager.save(conversation);
      }

      // Add user message to conversation
      const userMessage = new Message();
      userMessage.role = MessageRole.USER;
      userMessage.content = message;
      userMessage.conversation = conversation;
      userMessage.timestamp = new Date();
      await AppDataSource.manager.save(userMessage);

      // Prepare messages for OpenAI API (reload conversation to get latest messages)
      const conversationWithMessages = await AppDataSource.manager.findOne(Conversation, {
        where: { id: conversation.id },
        relations: ['messages'],
        order: { messages: { timestamp: 'ASC' } }
      });

      if (!conversationWithMessages) {
        throw new Error('Conversation not found');
      }

      // Build messages array with system prompt
      const messages = [
        {
          role: 'system' as const,
          content: `You are a UX Design Challenge Facilitator, an expert in user experience design, design thinking, and interview preparation. Your role is to help candidates practice for UX design interviews by providing realistic design challenges, constructive feedback, and guidance.

## Your Expertise:
- User Experience (UX) Design
- User Interface (UI) Design
- Design Thinking methodology
- User research and usability testing
- Information architecture
- Interaction design
- Design systems and patterns
- Mobile and web design
- Accessibility and inclusive design
- Design critique and feedback

## Your Approach:
1. **Present realistic design challenges** that mirror actual interview scenarios
2. **Guide candidates through the design process** step by step
3. **Ask probing questions** to help candidates think deeply about their decisions
4. **Provide constructive feedback** on their approach and solutions
5. **Suggest improvements** and alternative approaches
6. **Help with time management** during design exercises
7. **Explain design principles** and best practices

## Challenge Types:
- Mobile app design
- Web application design
- E-commerce experiences
- Dashboard and data visualization
- Onboarding flows
- Error handling and edge cases
- Accessibility improvements
- Design system creation

## Your Style:
- Encouraging and supportive
- Professional but approachable
- Focused on learning and growth
- Asks follow-up questions
- Provides specific, actionable feedback
- Helps candidates think like a designer

Remember: You're not just giving answers - you're helping candidates develop their design thinking skills and confidence for real interviews.`
        },
        ...conversationWithMessages.messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: CHAT_CONFIG.model,
        messages: messages,
        max_tokens: CHAT_CONFIG.maxTokens,
        temperature: CHAT_CONFIG.temperature,
      });

      // Log token usage for monitoring
      const usage = completion.usage;
      if (usage) {
        console.log('🔍 OpenAI API Usage:', {
          conversationId: conversation.id,
          model: CHAT_CONFIG.model,
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          estimatedCost: `$${((usage.total_tokens * 0.00003).toFixed(6))}`, // Rough estimate for GPT-4o
        });
      }

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI API');
      }

      // Save assistant message to database
      const assistantMessage = new Message();
      assistantMessage.role = MessageRole.ASSISTANT;
      assistantMessage.content = responseText;
      assistantMessage.conversation = conversation;
      assistantMessage.timestamp = new Date();
      await AppDataSource.manager.save(assistantMessage);

      // Update conversation timestamp
      conversation.lastUpdated = new Date();
      await AppDataSource.manager.save(conversation);

      console.log('🤖 Custom GPT response generated successfully');

      return {
        success: true,
        data: {
          message: responseText,
          conversationId: conversation.id,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Custom GPT service error:', error);
      throw new Error('Failed to get response from custom GPT');
    }
  }

  /**
   * Get conversation with messages
   */
  async getConversation(conversationId: string) {
    try {
      const conversation = await AppDataSource.manager.findOne(Conversation, {
        where: { id: conversationId },
        relations: ['messages'],
        order: { messages: { timestamp: 'ASC' } }
      });

      if (!conversation) {
        return null;
      }

      return {
        id: conversation.id,
        messages: conversation.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        createdAt: conversation.createdAt.toISOString(),
        lastUpdated: conversation.lastUpdated.toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting conversation:', error);
      return null;
    }
  }

  /**
   * Get all conversations
   */
  async getAllConversations() {
    try {
      const conversations = await AppDataSource.manager.find(Conversation, {
        relations: ['messages'],
        order: { lastUpdated: 'DESC' }
      });

      return conversations.map((conversation: any) => ({
        id: conversation.id,
        messages: conversation.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        createdAt: conversation.createdAt.toISOString(),
        lastUpdated: conversation.lastUpdated.toISOString()
      }));
    } catch (error) {
      console.error('❌ Error getting conversations:', error);
      return [];
    }
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string) {
    try {
      const conversation = await AppDataSource.manager.findOne(Conversation, {
        where: { id: conversationId }
      });

      if (!conversation) {
        return false;
      }

      // Delete associated messages first
      await AppDataSource.manager.delete(Message, { conversation: { id: conversationId } });
      
      // Delete conversation
      await AppDataSource.manager.delete(Conversation, { id: conversationId });

      return true;
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      return false;
    }
  }

  private generateConversationId(): string {
    return 'conv_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

export const customGPTService = new CustomGPTService();
