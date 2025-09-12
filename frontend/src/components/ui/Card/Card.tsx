import React, { forwardRef } from 'react';

// ========================================
// CARD TYPES & INTERFACES
// ========================================

export type CardVariant = 'primary' | 'secondary' | 'message' | 'elevated';
export type CardSize = 'compact' | 'comfortable' | 'spacious';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card visual variant for different surface levels */
  variant?: CardVariant;
  /** Card size preset - controls padding and spacing */
  size?: CardSize;
  /** Custom padding override */
  padding?: CardPadding;
  /** Adds subtle border styling */
  bordered?: boolean;
  /** Adds elevation with shadow */
  elevated?: boolean;
  /** Makes card clickable with hover effects */
  interactive?: boolean;
  /** Full width card */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

// ========================================
// MOBILE-FIRST RESPONSIVE STYLES
// ========================================

const getCardStyles = (
  variant: CardVariant,
  size: CardSize,
  padding: CardPadding,
  bordered: boolean,
  elevated: boolean,
  interactive: boolean,
  fullWidth: boolean
): React.CSSProperties => {
  // Base styles - mobile-first
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: fullWidth ? '100%' : 'auto',
    borderRadius: 'var(--radius-2)', // 16px - consistent with design system
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    boxSizing: 'border-box',
    // Mobile optimization
    WebkitTapHighlightColor: 'transparent',
    touchAction: interactive ? 'manipulation' : 'auto',
  };

  // Mobile-first size styles
  const sizeStyles: Record<CardSize, React.CSSProperties> = {
    compact: {
      gap: 'var(--spacing-3)', // 8px
      minHeight: 'auto',
    },
    comfortable: {
      gap: 'var(--spacing-4)', // 12px
      minHeight: 'auto',
    },
    spacious: {
      gap: 'var(--spacing-5)', // 16px
      minHeight: 'auto',
    },
  };

  // Padding styles with mobile-first approach
  const paddingStyles: Record<CardPadding, React.CSSProperties> = {
    none: {
      padding: '0',
    },
    small: {
      padding: 'var(--spacing-4)', // 12px - mobile optimized
    },
    medium: {
      padding: 'var(--spacing-5)', // 16px - comfortable on mobile
    },
    large: {
      padding: 'var(--spacing-6)', // 20px - spacious for important content
    },
  };

  // Auto padding based on size if no custom padding
  const autoPadding = padding === 'none' ? sizeStyles[size] : paddingStyles[padding];
  const finalPadding = padding !== 'none' 
    ? paddingStyles[padding] 
    : size === 'compact' 
      ? paddingStyles.small 
      : size === 'comfortable' 
        ? paddingStyles.medium 
        : paddingStyles.large;

  // Variant styles using surface tokens
  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--surface-primary)',
      color: 'var(--text-primary)',
    },
    secondary: {
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--text-primary)',
    },
    message: {
      backgroundColor: 'var(--text-dialogue-bg)',
      color: 'var(--text-dialogue)',
    },
    elevated: {
      backgroundColor: 'var(--surface-primary)',
      color: 'var(--text-primary)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  // Border styles
  const borderStyles: React.CSSProperties = bordered 
    ? {
        border: '1px solid var(--stroke-stroke)',
      }
    : {};

  // Elevation styles
  const elevationStyles: React.CSSProperties = elevated || variant === 'elevated'
    ? {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)',
      }
    : {};

  // Interactive styles
  const interactiveStyles: React.CSSProperties = interactive
    ? {
        cursor: 'pointer',
        userSelect: 'none',
      }
    : {};

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...finalPadding,
    ...variantStyles[variant],
    ...borderStyles,
    ...elevationStyles,
    ...interactiveStyles,
  };
};

// ========================================
// MAIN CARD COMPONENT
// ========================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'primary',
      size = 'comfortable',
      padding = 'none', // Auto-calculate based on size
      bordered = false,
      elevated = false,
      interactive = false,
      fullWidth = false,
      className = '',
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const cardStyles = getCardStyles(
      variant,
      size,
      padding,
      bordered,
      elevated,
      interactive,
      fullWidth
    );

    // Enhanced styles for interactive states
    const enhancedStyles: React.CSSProperties = {
      ...cardStyles,
      ...style,
      // Hover effects (desktop only)
      ...(isHovered && interactive && {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
      }),
      // Active/pressed effects (mobile + desktop)
      ...(isPressed && interactive && {
        transform: 'translateY(0px)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      }),
    };

    // Event handlers for interactive cards
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        setIsHovered(false);
        setIsPressed(false);
      }
      onMouseLeave?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) setIsPressed(true);
      onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) setIsPressed(false);
      onMouseUp?.(e);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if (interactive) setIsPressed(true);
      onTouchStart?.(e);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      if (interactive) setIsPressed(false);
      onTouchEnd?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        onClick?.(e);
      }
    };

    return (
      <div
        ref={ref}
        className={`design-system-card ${className}`}
        style={enhancedStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ========================================
// CARD VARIANTS (Convenience Components)
// ========================================

export const PrimaryCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  (props, ref) => <Card ref={ref} variant="primary" {...props} />
);

export const SecondaryCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  (props, ref) => <Card ref={ref} variant="secondary" {...props} />
);

export const MessageCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  (props, ref) => <Card ref={ref} variant="message" {...props} />
);

export const ElevatedCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  (props, ref) => <Card ref={ref} variant="elevated" {...props} />
);

PrimaryCard.displayName = 'PrimaryCard';
SecondaryCard.displayName = 'SecondaryCard';
MessageCard.displayName = 'MessageCard';
ElevatedCard.displayName = 'ElevatedCard';

// ========================================
// SPECIALIZED CARD COMPONENTS
// ========================================

export interface MessageBubbleProps extends Omit<CardProps, 'variant'> {
  /** Message sender type */
  sender: 'user' | 'assistant';
  /** Message timestamp */
  timestamp?: string;
  /** Avatar content */
  avatar?: React.ReactNode;
  /** Show timestamp */
  showTimestamp?: boolean;
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  (
    {
      sender,
      timestamp,
      avatar,
      showTimestamp = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isUser = sender === 'user';
    
    return (
      <div
        className={`message-bubble-wrapper ${isUser ? 'user-message' : 'assistant-message'}`}
        style={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 'var(--spacing-3)',
          width: '100%',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        {/* Avatar */}
        {avatar && (
          <div
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: isUser ? 'var(--button-primary)' : 'var(--surface-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: isUser ? 'var(--button-on-primary)' : 'var(--text-primary)',
            }}
          >
            {avatar}
          </div>
        )}

        {/* Message Content */}
        <div
          style={{
            maxWidth: '85%', // Mobile-first: leave space for avatar
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <Card
            ref={ref}
            variant="message"
            size="comfortable"
            className={`message-bubble ${className}`}
            style={{
              borderRadius: isUser
                ? 'var(--radius-2) var(--radius-1) var(--radius-1) var(--radius-2)'
                : 'var(--radius-1) var(--radius-2) var(--radius-2) var(--radius-1)',
              ...props.style,
            }}
            {...props}
          >
            {children}
          </Card>

          {/* Timestamp */}
          {showTimestamp && timestamp && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary-alt)',
                marginTop: 'var(--spacing-1)',
                textAlign: isUser ? 'right' : 'left',
              }}
            >
              {timestamp}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';

// ========================================
// CONTENT CONTAINER COMPONENT
// ========================================

export interface ContentContainerProps extends CardProps {
  /** Container type for semantic meaning */
  container?: 'section' | 'article' | 'aside' | 'main';
  /** Responsive spacing */
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ContentContainer = forwardRef<HTMLDivElement, ContentContainerProps>(
  (
    {
      container = 'section',
      spacing = 'normal',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const spacingStyles: Record<string, React.CSSProperties> = {
      tight: {
        padding: 'var(--spacing-4) var(--spacing-5)', // Mobile: 12px 16px
      },
      normal: {
        padding: 'var(--spacing-5) var(--spacing-6)', // Mobile: 16px 20px
      },
      loose: {
        padding: 'var(--spacing-6) var(--spacing-7)', // Mobile: 20px 24px
      },
    };

    const Component = container === 'main' ? 'main' 
      : container === 'article' ? 'article'
      : container === 'aside' ? 'aside'
      : 'section';

    return (
      <Component
        ref={ref as any}
        className={`content-container ${className}`}
        style={{
          ...spacingStyles[spacing],
          ...style,
        }}
        {...props}
      >
        <Card variant="primary" fullWidth style={{ height: '100%' }}>
          {children}
        </Card>
      </Component>
    );
  }
);

ContentContainer.displayName = 'ContentContainer';
