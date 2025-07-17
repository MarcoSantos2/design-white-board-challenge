import React, { useState, useRef, useEffect } from 'react';
import { ChatService, type ChatMessage } from '../services/chatService';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await ChatService.sendMessage(
        inputMessage,
        conversationId || undefined
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(response.data.timestamp),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (!conversationId) {
        setConversationId(response.data.conversationId);
      }
    } catch (err) {
      setError('Failed to send message. Please check your API key and try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '500px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #eee'
      }}>
        <h3 style={{ margin: 0 }}>UX Whiteboard Challenge Facilitator</h3>
        <button 
          onClick={clearConversation}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Chat
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '0.5rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '1rem',
        padding: '0.5rem',
        backgroundColor: '#fafafa',
        borderRadius: '4px'
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontStyle: 'italic',
            marginTop: '2rem'
          }}>
            Welcome! I'm here to help you practice UX design interviews. 
            Try saying: "I need help with a design challenge"
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
              marginLeft: message.role === 'user' ? '20%' : '0',
              marginRight: message.role === 'assistant' ? '20%' : '0',
            }}
          >
            <div style={{
              fontWeight: 'bold',
              fontSize: '0.75rem',
              color: '#666',
              marginBottom: '0.25rem'
            }}>
              {message.role === 'user' ? 'You' : 'UX Facilitator'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginRight: '20%',
            color: '#666',
            fontStyle: 'italic'
          }}>
            UX Facilitator is typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about UX design challenges..."
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'none',
            minHeight: '60px',
            fontFamily: 'inherit'
          }}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isLoading || !inputMessage.trim() ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot; 