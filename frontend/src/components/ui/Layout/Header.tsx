import React from 'react';
import { Icon } from '../Icon';

export interface HeaderProps {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Header height */
  height?: string;
  /** Background color */
  backgroundColor?: string;
  /** Border bottom */
  borderBottom?: boolean;
  /** Left side content */
  leftContent?: React.ReactNode;
  /** Right side content */
  rightContent?: React.ReactNode;
  /** Center content */
  centerContent?: React.ReactNode;
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: () => void;
  /** Show mobile menu button */
  showMobileMenu?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Header children */
  children?: React.ReactNode;
}

/**
 * Header Component
 * 
 * A responsive header with mobile-first design.
 * Supports left, center, and right content areas.
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  height = '64px',
  backgroundColor = 'var(--surface-secondary)',
  borderBottom = true,
  leftContent,
  rightContent,
  centerContent,
  onMobileMenuToggle,
  showMobileMenu = false,
  className,
  style,
  children,
}) => {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    backgroundColor,
    padding: '0 var(--spacing-5)',
    borderBottom: borderBottom ? '1px solid var(--stroke-stroke)' : 'none',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    ...style,
  };

  return (
    <header className={className} style={headerStyle}>
      {/* Left Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        {showMobileMenu && (
          <button
            onClick={onMobileMenuToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: 'var(--radius-1)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle mobile menu"
          >
            <Icon name="menu" size="md" />
          </button>
        )}
        {leftContent}
      </div>

      {/* Center Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
        margin: '0 var(--spacing-4)',
      }}>
        {centerContent || (
          <>
            {title && (
              <h1 style={{
                fontFamily: 'var(--Static-Display-Large-Font)',
                fontSize: 'clamp(20px, 4vw, 24px)',
                fontWeight: 'var(--Static-Display-Large-Weight)',
                lineHeight: 'var(--Static-Display-Large-Line-Height)',
                letterSpacing: 'var(--Static-Display-Large-Tracking)',
                margin: 0,
                color: 'var(--text-primary)',
              }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{
                fontFamily: 'var(--Static-Body-Medium-Font)',
                fontSize: 'var(--Static-Body-Medium-Size)',
                fontWeight: 'var(--Static-Body-Medium-Weight)',
                lineHeight: 'var(--Static-Body-Medium-Line-Height)',
                letterSpacing: 'var(--Static-Body-Medium-Tracking)',
                margin: 0,
                color: 'var(--text-secondary-alt)',
              }}>
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>

      {/* Right Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        {rightContent}
      </div>

      {children}
    </header>
  );
};

export default Header;
