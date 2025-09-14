import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon } from './ui';
import { useTheme } from '../design-tokens/SimpleThemeProvider';

/**
 * FreeSession Component
 * 
 * Main session page with chat interface and whiteboard for UX design challenges.
 * Matches the Figma design with comprehensive functionality.
 */
export const FreeSession: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const [messages, setMessages] = useState([
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
  const [selectedTool, setSelectedTool] = useState('pen');
  const [canvasHistory] = useState<string[]>([]);
  const [currentCanvas, setCurrentCanvas] = useState(0);
  const [inputHeight, setInputHeight] = useState(20);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date(),
      isTyping: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: "That's a great approach! I can see you're thinking about the user journey. Let's dive deeper into the key features. What would be the most important functionality for a coffee shop app?",
        timestamp: new Date(),
        isTyping: false,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
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
    
    // Calculate the actual content height by subtracting padding
    const computedStyle = getComputedStyle(textarea);
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const actualContentHeight = scrollHeight - paddingTop - paddingBottom;
    
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
    // This is more accurate than using scrollHeight calculations
    if (textHeight > lineHeight) {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file.name);
    }
  };

  const tools = [
    { id: 'pen', name: 'Pen', icon: 'edit' },
    { id: 'eraser', name: 'Eraser', icon: 'trash' },
    { id: 'text', name: 'Text', icon: 'type' },
    { id: 'shapes', name: 'Shapes', icon: 'grid' },
    { id: 'arrow', name: 'Arrow', icon: 'arrow-right' },
    { id: 'sticky', name: 'Sticky Note', icon: 'bookmark' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family-roboto)',
      display: 'flex',
      flexDirection: 'column',
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
            onClick={toggleMode}
            startIcon={<Icon name={mode === 'light' ? 'moon' : 'sun'} size="sm" />}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {mode === 'light' ? 'Dark' : 'Light'}
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => window.history.back()}
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
        height: 'calc(100vh - 80px)',
        flexDirection: 'column',
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
              minHeight: '44px', // Minimum height for proper touch targets
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
                      padding: 'var(--spacing-1)',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
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
        }}
        className="whiteboard-area"
        >
          {/* Tool Palette */}
          <div style={{
            padding: 'var(--spacing-4)',
            borderBottom: '1px solid var(--stroke-stroke)',
            backgroundColor: 'var(--surface-secondary)',
          }}>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => setSelectedTool(tool.id)}
                  startIcon={<Icon name={tool.icon as any} size="sm" />}
                >
                  {tool.name}
                </Button>
              ))}
              <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--stroke-stroke)', margin: '0 var(--spacing-2)' }} />
              <Button
                variant="secondary"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<Icon name="upload" size="sm" />}
              >
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Canvas Area */}
          <div style={{
            flex: 1,
            position: 'relative',
            backgroundColor: 'var(--surface-primary)',
            overflow: 'hidden',
          }}>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                cursor: selectedTool === 'pen' ? 'crosshair' : 'default',
                backgroundColor: 'var(--surface-primary)',
              }}
              onMouseDown={() => {
                // Handle canvas drawing logic here
                console.log('Canvas mouse down', selectedTool);
              }}
            />
            
            {/* Canvas Overlay for UI elements */}
            <div style={{
              position: 'absolute',
              top: 'var(--spacing-4)',
              right: 'var(--spacing-4)',
              display: 'flex',
              gap: 'var(--spacing-2)',
            }}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setCurrentCanvas(Math.max(0, currentCanvas - 1))}
                disabled={currentCanvas === 0}
                startIcon={<Icon name="arrow-left" size="sm" />}
              >
                Undo
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setCurrentCanvas(Math.min(canvasHistory.length, currentCanvas + 1))}
                disabled={currentCanvas >= canvasHistory.length}
                startIcon={<Icon name="arrow-right" size="sm" />}
              >
                Redo
              </Button>
            </div>
          </div>
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
              Whiteboard Not Available on Mobile
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
                onClick={() => window.history.back()}
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
