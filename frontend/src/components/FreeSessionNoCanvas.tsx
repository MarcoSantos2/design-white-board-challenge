import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './ui/Icon/Icon';
import { Button } from './ui/Button/Button';
import { chatService } from '../services/chatService';
import type { ChatMessage } from '../services/chatService';
import { useNavigate } from 'react-router-dom';

const FreeSessionNoCanvas: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m here to help you with your UX design questions. What would you like to work on today?',
      timestamp: new Date(),
      isTyping: false,
    }
  ]);
  const [sessionTime, setSessionTime] = useState(600); // 10 minutes in seconds
  const [isSessionActive, setIsSessionActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer functionality
  useEffect(() => {
    let interval: number;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          if (prev <= 1) {
            setIsSessionActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize functionality - only resize when text wraps to new line
    const textarea = e.target;
    const minHeight = 102;
    const maxHeight = 200;

    // If input is empty, reset to minimum height
    if (!e.target.value.trim()) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    // Store the current scroll position
    const scrollTop = textarea.scrollTop;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';

    // Get the scrollHeight
    const scrollHeight = textarea.scrollHeight;

    // Get computed style for line height calculation
    const computedStyle = getComputedStyle(textarea);

    // Get line height for more accurate calculation
    const lineHeight = parseFloat(computedStyle.lineHeight) || 20;

    // Create a temporary element to measure text width
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.height = 'auto';
    tempDiv.style.width = textarea.clientWidth + 'px';
    tempDiv.style.fontFamily = computedStyle.fontFamily;
    tempDiv.style.fontSize = computedStyle.fontSize;
    tempDiv.style.fontWeight = computedStyle.fontWeight;
    tempDiv.style.lineHeight = computedStyle.lineHeight;
    tempDiv.style.letterSpacing = computedStyle.letterSpacing;
    tempDiv.style.padding = '0';
    tempDiv.style.border = 'none';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.wordWrap = 'break-word';
    tempDiv.textContent = e.target.value;

    document.body.appendChild(tempDiv);
    const textHeight = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);

    // Use the measured text height to determine if we need to resize
    if (textHeight > lineHeight) {
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    } else {
      textarea.style.height = `${minHeight}px`;
    }

    // Restore scroll position
    textarea.scrollTop = scrollTop;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      isTyping: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Stream response
      const placeholderId = Date.now() + 1;
      setMessages(prev => [...prev, { id: placeholderId, type: 'assistant', content: '', timestamp: new Date(), isTyping: true }]);

      await chatService.sendMessageStream(inputValue, (chunk) => {
        setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: m.content + chunk } : m));
      });

      setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, isTyping: false, timestamp: new Date() } : m));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the server. Please check your connection and try again.",
        timestamp: new Date(),
        isTyping: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    // Add end session logic here
  };

  return (
    <>
      <style>
        {`
          .chat-input-textarea::-webkit-scrollbar {
            width: 4px;
          }
          .chat-input-textarea::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-input-textarea::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          .chat-input-textarea::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .chat-input-textarea {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
          
          @media (max-width: 768px) {
            .chat-container {
              max-width: 100% !important;
              padding: 16px !important;
            }
            .user-message {
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        `}
      </style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--surface-primary)',
        color: 'var(--text-primary)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid var(--stroke-stroke)',
          backgroundColor: 'var(--surface-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate('/')}
              style={{ padding: '8px' }}
            >
              <Icon name="arrow-left" size="sm" />
            </Button>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              color: 'var(--text-primary)'
            }}>
              UX Whiteboard Agent
            </h1>
          </div>
          
          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'var(--surface-tertiary)',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)'
          }}>
            <Icon name="clock" size="sm" />
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)'
            }}>
              {formatTime(sessionTime)}
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div className="chat-container" style={{
            width: '100%',
            maxWidth: '814px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '8px'
                }}
              >
                <div
                  className={message.type === 'user' ? 'user-message' : ''}
                  style={{
                    display: 'flex',
                    minHeight: message.type === 'user' ? '102px' : 'auto',
                    height: message.type === 'user' ? '102px' : 'auto',
                    padding: 'var(--spacing-7, 24px)',
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                    borderRadius: 'var(--spacing-7, 24px)',
                    backgroundColor: message.type === 'user' 
                      ? 'transparent' 
                      : 'var(--surface-secondary, #F2F2F2)',
                    color: message.type === 'user' 
                      ? 'var(--text-primary)' 
                      : 'var(--text-primary)',
                    border: message.type === 'user' 
                      ? 'none' 
                      : '1px solid var(--border-primary)',
                    boxShadow: 'none',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    maxWidth: message.type === 'user' ? '814px' : '70%',
                    width: message.type === 'user' ? '814px' : 'auto'
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: 'var(--surface-primary)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div className="chat-container" style={{
            width: '100%',
            maxWidth: '814px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--surface-secondary, #F2F2F2)',
            border: '1px solid var(--stroke-stroke)',
            borderRadius: '50px',
            padding: '8px 16px',
            gap: '12px',
            minHeight: '102px'
          }}>
            {/* Plus Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              color: 'var(--text-secondary)'
            }}>
              <Icon name="plus" size="xs" />
            </div>

            {/* Text Input */}
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className="chat-input-textarea"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '20px',
                resize: 'none',
                minHeight: '20px',
                maxHeight: '100px',
                fontFamily: 'inherit',
                padding: '12px 0',
                display: 'flex',
                alignItems: 'center',
                verticalAlign: 'middle'
              }}
            />

            {/* Send Button or Mic Icon */}
            {inputValue.trim() ? (
              <Button
                variant="primary"
                size="small"
                onClick={handleSendMessage}
                style={{
                  width: '28px',
                  height: '28px',
                  padding: '0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon name="arrow-up" size="xs" />
              </Button>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                color: 'var(--text-secondary)'
              }}>
                <Icon name="mic" size="xs" />
              </div>
            )}
          </div>
        </div>

        {/* Session Controls */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: 'var(--surface-primary)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={handleEndSession}
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            End Session
          </Button>
        </div>
      </div>
    </>
  );
};

export default FreeSessionNoCanvas;
