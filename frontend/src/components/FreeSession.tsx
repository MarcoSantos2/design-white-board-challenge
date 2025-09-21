import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon } from './ui';
import { ExcalidrawWhiteboard } from './ui/Whiteboard';
import { chatService } from '../services/chatService';
import type { ChatMessage } from '../services/chatService';
import { useNavigate } from 'react-router-dom';

/**
 * FreeSession Component
 * 
 * Main session page with chat interface and whiteboard for UX design challenges.
 * Matches the Figma design with comprehensive functionality.
 */
export const FreeSession: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Welcome to your UX whiteboard session! I'm here to help you practice design challenges. Let's start with a simple task: Design a mobile app for a local coffee shop. What's your first thought?",
      timestamp: new Date(),
      isTyping: false,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(20);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize input height on component mount
  useEffect(() => {
    setInputHeight(20);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      isTyping: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

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
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize functionality - only resize when text wraps to new line
    const textarea = e.target;
    const minHeight = 20;
    const maxHeight = 100;
    
    // If input is empty, reset to minimum height
    if (!e.target.value.trim()) {
      textarea.style.height = `${minHeight}px`;
      setInputHeight(minHeight);
      return;
    }
    
    // Store the current scroll position
    const scrollTop = textarea.scrollTop;
    
    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Get the scrollHeight
    const scrollHeight = textarea.scrollHeight;
    
    // Get computed style for accurate single-line height (includes vertical padding)
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const singleLineTotalHeight = lineHeight + paddingTop + paddingBottom;

    // Only grow when content exceeds one full line including padding
    if (scrollHeight > singleLineTotalHeight + 1) {
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      setInputHeight(newHeight);
    } else {
      textarea.style.height = `${minHeight}px`;
      setInputHeight(minHeight);
    }
    
    // Restore scroll position
    textarea.scrollTop = scrollTop;
  };



  return (
    <div style={{
      height: '100vh',
      background: 'var(--surface-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family-roboto)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-4) var(--spacing-6)',
        borderBottom: '1px solid var(--stroke-stroke)',
        backgroundColor: 'var(--surface-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo and Session Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--button-primary)',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name="monitor" size="md" color="var(--button-on-primary)" />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 'var(--Static-Title-Medium-Size)',
              fontWeight: 'var(--Static-Title-Medium-Weight)',
              lineHeight: 'var(--Static-Title-Medium-Line-Height)',
              letterSpacing: 'var(--Static-Title-Medium-Tracking)',
              margin: 0,
              color: 'var(--text-primary)',
            }}>
              UX Whiteboard Session
            </h1>
            <p style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 'var(--Static-Body-Small-Size)',
              fontWeight: 'var(--Static-Body-Small-Weight)',
              lineHeight: 'var(--Static-Body-Small-Line-Height)',
              letterSpacing: 'var(--Static-Body-Small-Tracking)',
              margin: 0,
              color: 'var(--text-secondary)',
            }}>
              Coffee Shop App Design Challenge
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate('/')}
            startIcon={<Icon name="arrow-left" size="sm" />}
          >
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      className="main-content"
      >
        {/* Chat Panel */}
        <div style={{
          width: '400px',
          borderRight: '1px solid var(--stroke-stroke)',
          backgroundColor: 'var(--surface-secondary)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        className="chat-panel"
        >
          {/* Chat Header */}
          <div style={{
            padding: 'var(--spacing-4)',
            borderBottom: '1px solid var(--stroke-stroke)',
            backgroundColor: 'var(--surface-primary)',
          }}>
            <h3 style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 'var(--Static-Title-Small-Size)',
              fontWeight: 'var(--Static-Title-Small-Weight)',
              lineHeight: 'var(--Static-Title-Small-Line-Height)',
              letterSpacing: 'var(--Static-Title-Small-Tracking)',
              margin: 0,
              color: 'var(--text-primary)',
            }}>
              Design Assistant
            </h3>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: 'var(--spacing-4)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)',
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                  gap: 'var(--spacing-3)',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: message.type === 'user' 
                    ? 'var(--button-primary)' 
                    : 'var(--surface-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: message.type === 'assistant' ? '1px solid var(--stroke-stroke)' : 'none',
                }}>
                  <Icon 
                    name={message.type === 'user' ? 'user' : 'monitor'} 
                    size="sm" 
                    color={message.type === 'user' ? 'var(--button-on-primary)' : 'var(--text-primary)'} 
                  />
                </div>

                {/* Message Content */}
                <div style={{
                  maxWidth: '280px',
                  backgroundColor: message.type === 'user' 
                    ? 'var(--button-primary)' 
                    : 'var(--surface-primary)',
                  color: message.type === 'user' 
                    ? 'var(--button-on-primary)' 
                    : 'var(--text-primary)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-2)',
                  border: message.type === 'assistant' ? '1px solid var(--stroke-stroke)' : 'none',
                }}>
                  <p style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 'var(--Static-Body-Medium-Size)',
                    fontWeight: 'var(--Static-Body-Medium-Weight)',
                    lineHeight: 'var(--Static-Body-Medium-Line-Height)',
                    letterSpacing: 'var(--Static-Body-Medium-Tracking)',
                    margin: 0,
                  }}>
                    {message.content}
                  </p>
                  <p style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 'var(--Static-Body-Small-Size)',
                    fontWeight: 'var(--Static-Body-Small-Weight)',
                    lineHeight: 'var(--Static-Body-Small-Line-Height)',
                    letterSpacing: 'var(--Static-Body-Small-Tracking)',
                    margin: 'var(--spacing-2) 0 0 0',
                    opacity: 0.7,
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-3)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--stroke-stroke)',
                }}>
                  <Icon name="monitor" size="sm" color="var(--text-primary)" />
                </div>
                <div style={{
                  backgroundColor: 'var(--surface-primary)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-2)',
                  border: '1px solid var(--stroke-stroke)',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-secondary)',
                      animation: 'typing 1.4s infinite ease-in-out',
                    }} />
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-secondary)',
                      animation: 'typing 1.4s infinite ease-in-out 0.2s',
                    }} />
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-secondary)',
                      animation: 'typing 1.4s infinite ease-in-out 0.4s',
                    }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{
            padding: 'var(--spacing-4)',
            borderTop: '1px solid var(--stroke-stroke)',
            backgroundColor: 'var(--surface-primary)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--stroke-stroke)',
              borderRadius: '50px', // Pill shape
              padding: 'var(--spacing-2) var(--spacing-4)',
              gap: 'var(--spacing-3)',
              minHeight: '48px', // Slightly larger to avoid height shift when button appears
            }}>
              {/* Plus Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                flexShrink: 0,
                cursor: 'pointer',
              }}>
                <Icon name="plus" size="xs" color="var(--text-primary)" />
              </div>

              {/* Input Field */}
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything"
                className="chat-input-textarea"
                style={{
                  flex: 1,
                  height: `${inputHeight}px`,
                  minHeight: '20px',
                  maxHeight: '100px',
                  padding: 'var(--spacing-1) 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'var(--Static-Body-Medium-Size)',
                  fontWeight: 'var(--Static-Body-Medium-Weight)',
                  lineHeight: 'var(--Static-Body-Medium-Line-Height)',
                  letterSpacing: 'var(--Static-Body-Medium-Tracking)',
                  resize: 'none',
                  outline: 'none',
                  overflow: inputHeight >= 100 ? 'auto' : 'hidden',
                }}
              />

              {/* Right Side Icons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                flexShrink: 0,
              }}>
                {/* Microphone Icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}>
                  <Icon name="mic" size="xs" color="var(--text-primary)" />
                </div>

                {/* Send Button */}
                {inputValue.trim() ? (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleSendMessage}
                    style={{
                      minWidth: 'auto',
                      padding: 0,
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      minHeight: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="arrow-up" size="xs" color="var(--button-on-primary)" />
                  </Button>
                ) : (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Whiteboard Area - Desktop Only */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--surface-primary)',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
        className="whiteboard-area"
        >
          <ExcalidrawWhiteboard
            visible={true}
            onChange={(elements: readonly any[]) => {
              // Handle whiteboard changes if needed
              console.log('Whiteboard changed:', elements.length, 'elements');
            }}
            style={{
              width: '100%',
              height: '100%',
              minHeight: 0,
            }}
          />
        </div>

        {/* Mobile Message - Hidden on Desktop */}
        <div style={{
          flex: 1,
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-8)',
          backgroundColor: 'var(--surface-primary)',
          textAlign: 'center',
        }}
        className="mobile-message"
        >
          <div style={{
            maxWidth: '400px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--button-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-6)',
            }}>
              <Icon name="monitor" size="xl" color="var(--button-on-primary)" />
            </div>
            
            <h3 style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 'var(--Static-Title-Medium-Size)',
              fontWeight: 'var(--Static-Title-Medium-Weight)',
              lineHeight: 'var(--Static-Title-Medium-Line-Height)',
              letterSpacing: 'var(--Static-Title-Medium-Tracking)',
              margin: '0 0 var(--spacing-4) 0',
              color: 'var(--text-primary)',
            }}>
              Canvas Not Available on Mobile
            </h3>
            
            <p style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 'var(--Static-Body-Medium-Size)',
              fontWeight: 'var(--Static-Body-Medium-Weight)',
              lineHeight: 'var(--Static-Body-Medium-Line-Height)',
              letterSpacing: 'var(--Static-Body-Medium-Tracking)',
              margin: '0 0 var(--spacing-6) 0',
              color: 'var(--text-secondary-alt)',
            }}>
              The whiteboard interface is optimized for desktop and tablet screens. 
              For the best experience, please access this session from a larger screen.
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
              alignItems: 'center',
            }}>
              <Button
                variant="primary"
                size="medium"
                onClick={() => navigate('/')}
                startIcon={<Icon name="arrow-left" size="sm" />}
              >
                Back to Homepage
              </Button>
              
              <p style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 'var(--Static-Body-Small-Size)',
                fontWeight: 'var(--Static-Body-Small-Weight)',
                lineHeight: 'var(--Static-Body-Small-Line-Height)',
                letterSpacing: 'var(--Static-Body-Small-Tracking)',
                margin: 0,
                color: 'var(--text-secondary)',
              }}>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for responsive behavior, typing animation, and custom scrollbar */}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* ChatGPT-style scrollbar for textarea */
        .chat-input-textarea::-webkit-scrollbar {
          width: 6px;
        }

        .chat-input-textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-input-textarea::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .chat-input-textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        /* Firefox scrollbar */
        .chat-input-textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        /* Desktop Layout */
        @media (min-width: 1024px) {
          .main-content {
            flex-direction: row !important;
          }
          .chat-panel {
            width: 400px !important;
            border-right: 1px solid var(--stroke-stroke) !important;
          }
          .whiteboard-area {
            display: flex !important;
          }
          .mobile-message {
            display: none !important;
          }
        }

        /* Tablet Layout */
        @media (min-width: 768px) and (max-width: 1023px) {
          .main-content {
            flex-direction: row !important;
          }
          .chat-panel {
            width: 350px !important;
            border-right: 1px solid var(--stroke-stroke) !important;
          }
          .whiteboard-area {
            display: flex !important;
          }
          .mobile-message {
            display: none !important;
          }
        }

        /* Mobile Layout */
        @media (max-width: 767px) {
          .main-content {
            flex-direction: column !important;
          }
          .chat-panel {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--stroke-stroke) !important;
            height: 50vh !important;
          }
          .whiteboard-area {
            display: none !important;
          }
          .mobile-message {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
