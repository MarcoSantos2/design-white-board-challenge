import React from 'react';
import { Button, Icon } from './ui';
import { useTheme } from '../design-tokens/SimpleThemeProvider';

/**
 * Homepage Component
 * 
 * Main landing page with navigation bar and hero section.
 * Matches the Figma design with clean, modern layout.
 */
export const Homepage: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family-roboto)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-5) var(--spacing-6)',
        borderBottom: '1px solid var(--stroke-stroke)',
        backgroundColor: 'var(--surface-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo and Title */}
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
          <h1 style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'var(--Static-Title-Large-Size)',
            fontWeight: 'var(--Static-Title-Large-Weight)',
            lineHeight: 'var(--Static-Title-Large-Line-Height)',
            letterSpacing: 'var(--Static-Title-Large-Tracking)',
            margin: 0,
            color: 'var(--text-primary)',
          }}>
            UX Whiteboard
          </h1>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-6)',
        }}>
          <a href="#features" style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'var(--Static-Body-Medium-Size)',
            fontWeight: 'var(--Static-Body-Medium-Weight)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            Features
          </a>
          <a href="#about" style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'var(--Static-Body-Medium-Size)',
            fontWeight: 'var(--Static-Body-Medium-Weight)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            About
          </a>
          <a href="#contact" style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'var(--Static-Body-Medium-Size)',
            fontWeight: 'var(--Static-Body-Medium-Weight)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            Contact
          </a>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={toggleMode}
            startIcon={<Icon name="settings" size="sm" />}
          >
            {mode === 'light' ? 'Dark' : 'Light'}
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={() => console.log('Login clicked')}
          >
            Log In
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => console.log('Sign Up clicked')}
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--spacing-15) var(--spacing-6)',
        gap: 'var(--spacing-8)',
      }}>
        {/* Main Title */}
        <h2 style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'clamp(48px, 8vw, 72px)',
          fontWeight: 'var(--Static-Display-Large-Weight)',
          lineHeight: 'clamp(56px, 9vw, 80px)',
          letterSpacing: 'var(--Static-Display-Large-Tracking)',
          margin: 0,
          color: 'var(--text-primary)',
          maxWidth: '800px',
        }}>
          Practice for UX Whiteboard Challenges
        </h2>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 'var(--Static-Body-Medium-Weight)',
          lineHeight: 'clamp(24px, 4vw, 32px)',
          letterSpacing: 'var(--Static-Body-Medium-Tracking)',
          margin: 0,
          color: 'var(--text-secondary-alt)',
          maxWidth: '600px',
        }}>
          Master your UX design skills with interactive whiteboard challenges. 
          Practice real-world scenarios and improve your design thinking process.
        </p>

        {/* CTA Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
        }}>
          <Button
            variant="primary"
            size="large"
            onClick={() => console.log('Start Free Session clicked')}
            style={{
              fontSize: '18px',
              padding: 'var(--spacing-4) var(--spacing-8)',
              minWidth: '200px',
            }}
          >
            Start Free Session
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
            No credit card required
          </p>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" style={{
        padding: 'var(--spacing-15) var(--spacing-6)',
        backgroundColor: 'var(--surface-secondary)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <h3 style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'var(--Static-Headline-Small-Size)',
            fontWeight: 'var(--Static-Headline-Small-Weight)',
            lineHeight: 'var(--Static-Headline-Small-Line-Height)',
            letterSpacing: 'var(--Static-Headline-Small-Tracking)',
            margin: '0 0 var(--spacing-8) 0',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}>
            Why Choose UX Whiteboard?
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-8)',
          }}>
            {[
              {
                icon: 'monitor',
                title: 'Interactive Whiteboard',
                description: 'Practice with a real whiteboard interface that mimics actual UX interviews.',
              },
              {
                icon: 'users',
                title: 'Real Scenarios',
                description: 'Work through authentic design challenges used in top tech companies.',
              },
              {
                icon: 'star',
                title: 'AI Expert Feedback',
                description: 'Get detailed feedback from an experienced AI agent.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-6)',
                  backgroundColor: 'var(--surface-primary)',
                  borderRadius: 'var(--radius-2)',
                  border: '1px solid var(--stroke-stroke)',
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'var(--button-primary)',
                  borderRadius: 'var(--radius-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-4)',
                }}>
                  <Icon name={feature.icon as any} size="lg" color="var(--button-on-primary)" />
                </div>
                <h4 style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'var(--Static-Title-Medium-Size)',
                  fontWeight: 'var(--Static-Title-Medium-Weight)',
                  lineHeight: 'var(--Static-Title-Medium-Line-Height)',
                  letterSpacing: 'var(--Static-Title-Medium-Tracking)',
                  margin: '0 0 var(--spacing-3) 0',
                  color: 'var(--text-primary)',
                }}>
                  {feature.title}
                </h4>
                <p style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'var(--Static-Body-Medium-Size)',
                  fontWeight: 'var(--Static-Body-Medium-Weight)',
                  lineHeight: 'var(--Static-Body-Medium-Line-Height)',
                  letterSpacing: 'var(--Static-Body-Medium-Tracking)',
                  margin: 0,
                  color: 'var(--text-secondary-alt)',
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'var(--spacing-8) var(--spacing-6)',
        backgroundColor: 'var(--surface-primary)',
        borderTop: '1px solid var(--stroke-stroke)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'var(--Static-Body-Small-Size)',
          fontWeight: 'var(--Static-Body-Small-Weight)',
          lineHeight: 'var(--Static-Body-Small-Line-Height)',
          letterSpacing: 'var(--Static-Body-Small-Tracking)',
          margin: 0,
          color: 'var(--text-secondary)',
        }}>
          © 2024 UX Whiteboard. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
