import React, { useState } from 'react';
import { Button, Icon } from './ui';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../design-tokens/SimpleThemeProvider';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../services/auth';

interface HeroIllustrationProps { mode?: 'light' | 'dark' | string }
const HeroIllustration: React.FC<HeroIllustrationProps> = ({ mode = 'light' }) => {
  const isDark = mode === 'dark';
  const parts = isDark
    ? [
        '/hero/heroPart1Dark.svg',
        '/hero/heroPart2Dark.svg',
        '/hero/heroPart3Dark.svg',
        '/hero/heroPart4Dark.svg',
      ]
    : [
        '/hero/heroPart1.svg',
        '/hero/heroPart2.svg',
        '/hero/heroPart3.svg',
        '/hero/heroPart4.svg',
      ];
  const staggerMs = 800; // delay between parts

  return (
    <div
      className="hero-illustration"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-2)',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
      aria-hidden="true"
   >
      {parts.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className="is-visible"
          style={{
            width: 'auto',
            animationDelay: `${index * staggerMs}ms`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Homepage Component
 * 
 * Main landing page with navigation bar and hero section.
 * Matches the Figma design with clean, modern layout.
 */
export const Homepage: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-actions {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @keyframes heroFadeInUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hero-illustration img { opacity: 0; transform: translateY(8px); height: clamp(160px, 32vw, 280px); }
        .hero-illustration img.is-visible {
          animation: heroFadeInUp 500ms ease-out forwards;
        }
        @media (min-width: 1280px) {
          .hero-illustration img { height: clamp(280px, 24vw, 420px); }
        }
        @media (min-width: 768px) {
          .hero-cta { flex-direction: row !important; }
        }
      `}</style>
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
        padding: 'var(--spacing-4) var(--spacing-4)',
        borderBottom: '1px solid var(--stroke-stroke)',
        backgroundColor: 'var(--surface-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        gap: 'var(--spacing-3)',
      }}>
        {/* Logo and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          flex: '1',
          minWidth: '200px',
        }}>
          <Logo size={101} />
          {/* Title removed per request; logo only */}
        </div>

        {/* Desktop Navigation Links - Center Position */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 'var(--spacing-6)',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        className="desktop-nav"
        >
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

        {/* Action Buttons - Responsive Layout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          flexWrap: 'wrap',
        }}>
          {/* Theme Toggle - Always Visible */}
          <Button
            variant="secondary"
            size="small"
            onClick={toggleMode}
            startIcon={<Icon name={mode === 'light' ? 'moon' : 'sun'} size="xs" />}
            style={{
              minWidth: 'auto',
              padding: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          />

        {/* Desktop Action Buttons */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
          }}
          className="desktop-actions"
          >
            {user ? (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  style={{
                    minWidth: 'auto',
                    padding: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Profile"
                >
                  <Icon name="user" size="xs" />
                </Button>
                <Button variant="secondary" size="small" onClick={() => signOutUser()}>Sign out</Button>
              </>
            ) : (
              <>
                <Button variant="primary" size="small" onClick={() => navigate('/signin')}>Log In</Button>
                <Button variant="secondary" size="small" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              minWidth: 'auto',
              padding: 'var(--spacing-2)',
            }}
            className="mobile-menu-toggle"
          >
            <Icon name={isMobileMenuOpen ? "x" : "menu"} size="sm" />
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            paddingTop: '80px',
          }}
          onClick={() => setIsMobileMenuOpen(false)}
          >
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--stroke-stroke)',
              borderRadius: 'var(--radius-2)',
              padding: 'var(--spacing-4)',
              margin: 'var(--spacing-4)',
              minWidth: '280px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Navigation Links */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)',
              }}>
                <a href="#features" style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'var(--Static-Body-Large-Size)',
                  fontWeight: 'var(--Static-Body-Large-Weight)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-1)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a href="#about" style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'var(--Static-Body-Large-Size)',
                  fontWeight: 'var(--Static-Body-Large-Weight)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-1)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a href="#contact" style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'var(--Static-Body-Large-Size)',
                  fontWeight: 'var(--Static-Body-Large-Weight)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-1)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>

              {/* Mobile Action Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
              }}>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    console.log('Login clicked');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ width: '100%' }}
                >
                  Log In
                </Button>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => {
                    console.log('Sign Up clicked');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ width: '100%' }}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(var(--spacing-8), 8vw, var(--spacing-15)) var(--spacing-4)',
        paddingTop: 'clamp(var(--spacing-6), 6vw, var(--spacing-12))',
        gap: 'clamp(var(--spacing-6), 6vw, var(--spacing-8))',
        position: 'relative',
      }}>
        {/* Dotted overlay (hero only) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.2,
            zIndex: 0,
            backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
            backgroundRepeat: 'repeat',
          }}
        >
        </div>
        {/* Content wrapper to keep content above the dots */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(var(--spacing-6), 6vw, var(--spacing-8))',
            width: '100%',
          }}
        >
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
          </p>

          {/* CTA Button */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-4)',
          }}>
            <div className="hero-cta" style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--spacing-3)',
              alignItems: 'center',
              width: '100%',
              maxWidth: '720px'
            }}>
              <Link to={user ? '/session' : '/signin'} style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="large"
                  style={{
                    fontSize: '18px',
                    padding: 'var(--spacing-4) var(--spacing-8)',
                    minWidth: '220px'
                  }}
                >
                  Start Free Session (with Canvas)
                </Button>
              </Link>
              <Link to={'/session-chat'} style={{ textDecoration: 'none' }}>
                <Button
                  variant="secondary"
                  size="large"
                  style={{
                    fontSize: '18px',
                    padding: 'var(--spacing-4) var(--spacing-8)',
                    minWidth: '220px',
                    backgroundColor: 'var(--button-secondary)',
                    color: 'var(--button-on-secondary)'
                  }}
                >
                  Start Free Session (Chat Only)
                </Button>
              </Link>
            </div>
            
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
          {/* Hero Illustration (SVG parts with staggered fade-in) */}
          <HeroIllustration mode={mode} />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" style={{
        padding: 'clamp(var(--spacing-8), 8vw, var(--spacing-15)) var(--spacing-4)',
        backgroundColor: 'var(--surface-primary)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(var(--spacing-6), 6vw, var(--spacing-8))',
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
    </>
  );
};
