import React from 'react';
import { useTheme } from '../design-tokens/SimpleThemeProvider';

export interface LogoProps {
  /** Desired width. Number interpreted as px. Defaults to responsive clamp. */
  size?: number | string;
  /** Alt text for accessibility */
  alt?: string;
  /** Optional additional className */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Logo component that automatically switches between light and dark variants
 * based on the current theme mode. Defaults to a responsive width.
 */
const Logo: React.FC<LogoProps> = ({
  size,
  alt = 'UX Whiteboard Logo',
  className,
  style,
}) => {
  const { mode } = useTheme();
  const src = mode === 'dark' ? '/logo/logodark.svg' : '/logo/logolight.svg';

  const computedWidth = typeof size === 'number'
    ? `${size}px`
    : (size || 'clamp(24px, 4vw, 32px)');

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ width: computedWidth, height: 'auto', display: 'block', ...style }}
    />
  );
};

export default Logo;


