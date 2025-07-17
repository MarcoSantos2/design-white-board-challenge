import { openai, CHAT_CONFIG } from '../config/openai';
import { ChatMessage, ChatRequest, ChatResponse, ConversationSession } from '../types/chat';
import { randomUUID } from 'crypto';

// In-memory storage for demo purposes - in production, use a database
const conversations: Map<string, ConversationSession> = new Map();

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
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      let conversationId: string = request.sessionId || randomUUID();
      let conversation: ConversationSession;

      // Get or create conversation session
      if (request.sessionId && conversations.has(request.sessionId)) {
        conversation = conversations.get(request.sessionId)!;
      } else {
        conversationId = randomUUID();
        conversation = {
          id: conversationId,
          messages: [],
          createdAt: new Date(),
          lastUpdated: new Date(),
        };
        conversations.set(conversationId, conversation);
      }

      // Add user message to conversation
      const userMessage: ChatMessage = {
        role: 'user',
        content: request.message,
        timestamp: new Date(),
      };
      conversation.messages.push(userMessage);

      // Prepare messages for OpenAI API
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversation.messages.map(msg => ({
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

      // Add assistant message to conversation
      const assistantChatMessage: ChatMessage = {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      };
      conversation.messages.push(assistantChatMessage);
      conversation.lastUpdated = new Date();

      return {
        message: assistantMessage,
        conversationId: conversationId,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to get response from chat service');
    }
  }

  getConversation(conversationId: string): ConversationSession | null {
    return conversations.get(conversationId) || null;
  }

  getAllConversations(): ConversationSession[] {
    return Array.from(conversations.values());
  }

  deleteConversation(conversationId: string): boolean {
    return conversations.delete(conversationId);
  }
} 