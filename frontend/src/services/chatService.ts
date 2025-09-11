const API_BASE_URL = 'http://localhost:3001/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    conversationId: string;
    timestamp: string;
  };
}

export interface ConversationData {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  lastUpdated: string;
}

export class ChatService {
  static async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getConversation(conversationId: string): Promise<ConversationData> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  static async getAllConversations(): Promise<ConversationData[]> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
} 