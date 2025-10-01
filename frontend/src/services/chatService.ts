/**
 * Chat Service
 * 
 * Handles communication with the backend chat API
 */

export interface ChatMessage {
  id: number;
  type: 'user' | 'assistant' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    conversationId: string;
    timestamp: string;
  };
}

export interface ConversationSession {
  id: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  lastUpdated: string;
}

class ChatService {
  private baseUrl: string;
  private currentSessionId: string | null = null;

  constructor() {
    // Use environment variable or default to localhost
    // To set custom API URL, create a .env file with: VITE_API_URL=http://your-backend-url
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  /**
   * Send a message to the chat API
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          sessionId: this.currentSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Store the conversation ID for future messages
      if (data.success && data.data.conversationId) {
        this.currentSessionId = data.data.conversationId;
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  /**
   * Stream a message to the chat API using SSE
   */
  async sendMessageStream(message: string, onChunk: (text: string) => void): Promise<{ conversationId: string | null }> {
    const url = `${this.baseUrl}/api/chat/message/stream`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim(), sessionId: this.currentSessionId })
    });

    if (!res.ok || !res.body) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let acc = '';
    let sawAnyData = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        acc += decoder.decode(value, { stream: true });
        // Parse SSE lines
        const lines = acc.split(/\n\n/);
        acc = lines.pop() || '';
        for (const block of lines) {
          const isSession = block.split('\n').some(l => l.trim() === 'event: session');
          const isError = block.split('\n').some(l => l.trim() === 'event: error');
          const isDone = block.split('\n').some(l => l.trim() === 'event: done');
          const dataLine = block.split('\n').find(l => l.startsWith('data: '));
          if (!dataLine) continue;
          try {
            const payload = JSON.parse(dataLine.replace('data: ', ''));
            if (isSession && payload.conversationId) {
              this.currentSessionId = payload.conversationId;
              continue;
            }
            if (isError) {
              const msg = (payload && (payload.error || payload.message)) || 'streaming failed';
              throw new Error(typeof msg === 'string' ? msg : 'streaming failed');
            }
            if (isDone) {
              done = true;
              break;
            }
            if (payload && typeof payload.text === 'string' && payload.text.length > 0) {
              sawAnyData = true;
              onChunk(payload.text);
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }
    }

    if (!sawAnyData) {
      // Best-effort surface empty-stream situations
      throw new Error('No response received from server');
    }

    // return current session
    return { conversationId: this.currentSessionId };
  }

  /**
   * Get a specific conversation
   */
  async getConversation(conversationId: string): Promise<ConversationSession | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  /**
   * Get all conversations
   */
  async getAllConversations(): Promise<ConversationSession[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * Set session ID (useful for loading existing conversations)
   */
  setSessionId(sessionId: string): void {
    this.currentSessionId = sessionId;
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    this.currentSessionId = null;
  }

  /**
   * Check if backend is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;