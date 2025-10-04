export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  sessionId?: string;
  userId?: string;
}

export interface ChatResponse {
  message: string;
  conversationId?: string;
  timestamp: Date;
}

export interface ConversationSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
} 