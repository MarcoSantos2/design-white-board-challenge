import React, { useState } from 'react';
import {
  Card,
  PrimaryCard,
  SecondaryCard,
  MessageCard,
  ElevatedCard,
  MessageBubble,
  ContentContainer,
  Button,
  Icon,
} from './ui';

/**
 * CardDemo Component
 * 
 * Comprehensive demonstration of the Card system:
 * - All card variants and sizes
 * - Interactive cards with hover effects
 * - Message bubbles for chat interface
 * - Content containers for layout
 * - Mobile-first responsive design
 */
export const CardDemo: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // Update theme on document for CSS variables
    document.documentElement.setAttribute('data-Semantic-tokens', theme === 'light' ? 'Dark' : 'Light');
  };

  const sampleMessages = [
    {
      id: 1,
      sender: 'user' as const,
      content: 'Hello! Can you help me with my design project?',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'assistant' as const,
      content: 'Of course! I\'d be happy to help you with your design project. What specific aspect would you like assistance with?',
      timestamp: '10:31 AM',
    },
    {
      id: 3,
      sender: 'user' as const,
      content: 'I need help creating a user-friendly interface for a mobile app.',
      timestamp: '10:32 AM',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface-secondary)',
        padding: 'var(--spacing-5)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-8)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-4)',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(24px, 5vw, 32px)', // Mobile-first responsive
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Card System Demo
        </h1>
        <Button
          variant="secondary"
          size="medium"
          onClick={toggleTheme}
          startIcon={<Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />}
        >
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </div>

      {/* Card Variants Section */}
      <ContentContainer spacing="normal" style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-6)',
            margin: 0,
          }}
        >
          Card Variants
        </h2>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-5)',
            marginBottom: 'var(--spacing-7)',
          }}
        >
          <PrimaryCard size="comfortable">
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-primary)' }}>
              Primary Card
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary-alt)', lineHeight: 1.5 }}>
              Default card using primary surface colors. Perfect for main content areas.
            </p>
          </PrimaryCard>

          <SecondaryCard size="comfortable">
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-primary)' }}>
              Secondary Card
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary-alt)', lineHeight: 1.5 }}>
              Secondary surface card. Great for sidebar content or supplementary information.
            </p>
          </SecondaryCard>

          <MessageCard size="comfortable">
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-dialogue)' }}>
              Message Card
            </h3>
            <p style={{ margin: 0, color: 'var(--text-dialogue)', lineHeight: 1.5 }}>
              Designed for dialogue and chat interfaces with optimal text contrast.
            </p>
          </MessageCard>

          <ElevatedCard size="comfortable">
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-primary)' }}>
              Elevated Card
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary-alt)', lineHeight: 1.5 }}>
              Cards with built-in elevation and shadow for prominent content.
            </p>
          </ElevatedCard>
        </div>
      </ContentContainer>

      {/* Interactive Cards Section */}
      <ContentContainer spacing="normal" style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-6)',
            margin: 0,
          }}
        >
          Interactive Cards
        </h2>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-5)',
          }}
        >
          <Card
            variant="primary"
            size="comfortable"
            interactive
            onClick={() => alert('Primary card clicked!')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Icon name="mouse-pointer" size="md" color="var(--text-primary)" />
              <div>
                <h3 style={{ margin: '0 0 var(--spacing-2) 0', color: 'var(--text-primary)' }}>
                  Clickable Card
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary-alt)', fontSize: '14px' }}>
                  Click to interact • Hover for elevation
                </p>
              </div>
            </div>
          </Card>

          <Card
            variant="elevated"
            size="comfortable"
            interactive
            bordered
            onClick={() => alert('Settings opened!')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Icon name="settings" size="md" color="var(--text-primary)" />
              <div>
                <h3 style={{ margin: '0 0 var(--spacing-2) 0', color: 'var(--text-primary)' }}>
                  Settings Card
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary-alt)', fontSize: '14px' }}>
                  Bordered • Interactive • Elevated
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ContentContainer>

      {/* Card Sizes Section */}
      <ContentContainer spacing="normal" style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-6)',
            margin: 0,
          }}
        >
          Card Sizes
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card variant="secondary" size="compact">
            <strong>Compact Size:</strong> Minimal padding, perfect for tight layouts and mobile interfaces.
          </Card>
          
          <Card variant="secondary" size="comfortable">
            <strong>Comfortable Size:</strong> Balanced padding, ideal for most content and general use cases.
          </Card>
          
          <Card variant="secondary" size="spacious">
            <strong>Spacious Size:</strong> Generous padding, great for important content that needs breathing room.
          </Card>
        </div>
      </ContentContainer>

      {/* Message Bubbles Section */}
      <ContentContainer spacing="normal" style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2
          style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-6)',
            margin: 0,
          }}
        >
          Chat Interface
        </h2>
        
        <div
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: 'var(--radius-2)',
            padding: 'var(--spacing-5)',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {sampleMessages.map((message) => (
            <MessageBubble
              key={message.id}
              sender={message.sender}
              timestamp={message.timestamp}
              showTimestamp={true}
              avatar={
                message.sender === 'user' ? (
                  <Icon name="user" size="sm" />
                ) : (
                  <Icon name="bot" size="sm" />
                )
              }
            >
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {message.content}
              </p>
            </MessageBubble>
          ))}

          {/* Input Area */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              marginTop: 'var(--spacing-5)',
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-2)',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: 'var(--spacing-3)',
                border: '1px solid var(--stroke-stroke)',
                borderRadius: 'var(--radius-1)',
                backgroundColor: 'var(--surface-primary)',
                color: 'var(--text-primary)',
                fontSize: '16px', // Prevent zoom on iOS
                outline: 'none',
              }}
            />
            <Button variant="primary" size="small">
              <Icon name="send" size="sm" />
            </Button>
          </div>
        </div>
      </ContentContainer>

      {/* Features Summary */}
      <ContentContainer spacing="normal">
        <h2
          style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-6)',
            margin: 0,
          }}
        >
          Card System Features
        </h2>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-5)',
          }}
        >
          <Card variant="primary" size="comfortable" bordered>
            <Icon name="smartphone" size="lg" color="var(--text-primary)" style={{ marginBottom: 'var(--spacing-3)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-primary)' }}>
              Mobile-First Design
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary-alt)', lineHeight: 1.5 }}>
              Optimized touch targets, responsive layouts, and mobile-friendly interactions.
            </p>
          </Card>

          <Card variant="primary" size="comfortable" bordered>
            <Icon name="palette" size="lg" color="var(--text-primary)" style={{ marginBottom: 'var(--spacing-3)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-primary)' }}>
              Design Token Integration
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary-alt)', lineHeight: 1.5 }}>
              Perfect theme switching with Figma-exported design tokens and CSS variables.
            </p>
          </Card>

          <Card variant="primary" size="comfortable" bordered>
            <Icon name="zap" size="lg" color="var(--text-primary)" style={{ marginBottom: 'var(--spacing-3)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-3) 0', color: 'var(--text-primary)' }}>
              Interactive Components
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary-alt)', lineHeight: 1.5 }}>
              Built-in hover effects, touch feedback, and accessibility features.
            </p>
          </Card>
        </div>
      </ContentContainer>
    </div>
  );
};
