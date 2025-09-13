import React, { forwardRef } from 'react';

// ========================================
// BUTTON TYPES & INTERFACES
// ========================================

export type ButtonVariant = 'primary' | 'secondary' | 'primary-alt' | 'secondary-alt';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size - mobile-first responsive */
  size?: ButtonSize;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  startIcon?: React.ReactNode;
  /** Icon to display after text */
  endIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

// ========================================
// MOBILE-FIRST RESPONSIVE STYLES
// ========================================

const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  loading: boolean,
  disabled: boolean,
  fullWidth: boolean
): React.CSSProperties => {
  // Base styles - mobile-first
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px', // Mobile: smaller gap
    fontFamily: 'var(--font-family-roboto, Roboto, sans-serif)',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    borderRadius: '9999px', // Pill-shaped buttons like Figma design
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    outline: 'none',
    WebkitTapHighlightColor: 'transparent', // Remove mobile tap highlight
    touchAction: 'manipulation', // Optimize for touch
    userSelect: 'none',
  };

  // Mobile-first size styles
  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    small: {
      padding: '8px 12px', // Mobile: more compact
      fontSize: '14px',
      minHeight: '36px', // Mobile: smaller touch target
      lineHeight: '1.2',
    },
    medium: {
      padding: '12px 16px', // Mobile: good touch target
      fontSize: '16px',
      minHeight: '44px', // Mobile: Apple recommended 44px
      lineHeight: '1.3',
    },
    large: {
      padding: '16px 24px', // Mobile: larger for primary actions
      fontSize: '18px',
      minHeight: '52px', // Mobile: generous touch target
      lineHeight: '1.4',
    },
  };

  // Variant styles using CSS variables for perfect theme switching
  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--button-primary)',
      color: 'var(--button-on-primary)',
      border: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    'primary-alt': {
      backgroundColor: 'var(--button-primary-alt)',
      color: 'var(--button-on-primary-alt)',
      border: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    secondary: {
      backgroundColor: 'var(--button-secondary)',
      color: 'var(--button-on-secondary)',
      border: '1px solid var(--stroke-stroke)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    'secondary-alt': {
      backgroundColor: 'var(--button-secondary-alt)',
      color: 'var(--button-on-secondary-alt)',
      border: '1px solid var(--stroke-stroke)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

// ========================================
// LOADING SPINNER COMPONENT
// ========================================

const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px';
  
  return (
    <>
      <style>
        {`
          @keyframes button-spinner {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '2px solid currentColor',
          borderRadius: '50%',
          borderTopColor: 'transparent',
          animation: 'button-spinner 0.8s linear infinite',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    </>
  );
};

// ========================================
// MAIN BUTTON COMPONENT
// ========================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      startIcon,
      endIcon,
      fullWidth = false,
      className = '',
      children,
      disabled = false,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      onTouchStart,
      onTouchEnd,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const buttonStyles = getButtonStyles(variant, size, loading, disabled, fullWidth);

    // Enhanced styles for interactive states - mobile-optimized
    const enhancedStyles: React.CSSProperties = {
      ...buttonStyles,
      ...style,
      // Hover effects (desktop only)
      ...(isHovered && !disabled && !loading && {
        transform: 'translateY(-1px)',
        boxShadow: variant.includes('primary') 
          ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
          : '0 4px 8px rgba(0, 0, 0, 0.12)',
      }),
      // Active/pressed effects (mobile + desktop)
      ...(isPressed && !disabled && !loading && {
        transform: 'translateY(0px)',
        boxShadow: variant.includes('primary') 
          ? '0 2px 4px rgba(0, 0, 0, 0.2)' 
          : '0 1px 2px rgba(0, 0, 0, 0.12)',
      }),
      // Focus effects (accessibility)
      ...(isFocused && !disabled && {
        boxShadow: isPressed 
          ? `0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px var(--button-on-primary, rgba(255, 227, 105, 0.3))`
          : isHovered
          ? `0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 3px var(--button-on-primary, rgba(255, 227, 105, 0.3))`
          : `0 0 0 3px var(--button-on-primary, rgba(255, 227, 105, 0.3))`,
      }),
    };

    // Event handlers - mobile-first
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      setIsPressed(false);
      onMouseLeave?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onMouseUp?.(e);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      onTouchStart?.(e);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onTouchEnd?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <button
        ref={ref}
        className={`design-system-button ${className}`}
        style={enhancedStyles}
        disabled={disabled || loading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={loading ? 'Loading...' : props['aria-label']}
        aria-busy={loading}
        {...props}
      >
        {/* Start Icon or Loading Spinner */}
        {loading ? (
          <LoadingSpinner size={size} />
        ) : startIcon ? (
          <span className="button-start-icon" style={{ flexShrink: 0 }}>
            {startIcon}
          </span>
        ) : null}

        {/* Button Text */}
        {children && (
          <span 
            className="button-text"
            style={{ 
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
              minWidth: 0, // Allow text to shrink
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: size === 'small' ? 'nowrap' : 'normal',
            }}
          >
            {children}
          </span>
        )}

        {/* End Icon (hidden during loading) */}
        {!loading && endIcon && (
          <span className="button-end-icon" style={{ flexShrink: 0 }}>
            {endIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ========================================
// BUTTON VARIANTS (Convenience Components)
// ========================================

export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
);

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
);

export const PrimaryAltButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="primary-alt" {...props} />
);

export const SecondaryAltButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="secondary-alt" {...props} />
);

PrimaryButton.displayName = 'PrimaryButton';
SecondaryButton.displayName = 'SecondaryButton';
PrimaryAltButton.displayName = 'PrimaryAltButton';
SecondaryAltButton.displayName = 'SecondaryAltButton';