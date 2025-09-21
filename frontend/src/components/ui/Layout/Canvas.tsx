import React from 'react';

export interface CanvasProps {
  /** Canvas background color */
  backgroundColor?: string;
  /** Canvas padding */
  padding?: string;
  /** Canvas margin */
  margin?: string;
  /** Whether canvas is interactive */
  interactive?: boolean;
  /** Canvas border */
  border?: boolean;
  /** Canvas border radius */
  borderRadius?: string;
  /** Canvas shadow */
  shadow?: boolean;
  /** Canvas width */
  width?: string;
  /** Canvas height */
  height?: string;
  /** Minimum height */
  minHeight?: string;
  /** Maximum height */
  maxHeight?: string;
  /** Canvas content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Canvas Component
 * 
 * A flexible canvas area for whiteboard and drawing functionality.
 * Responsive design with proper touch interactions.
 */
export const Canvas: React.FC<CanvasProps> = ({
  backgroundColor = 'var(--surface-primary)',
  padding = 'var(--spacing-5)',
  margin = '0',
  interactive = true,
  border = true,
  borderRadius = 'var(--radius-2)',
  shadow = false,
  width = '100%',
  height = '100%',
  minHeight = '400px',
  maxHeight,
  children,
  onClick,
  className,
  style,
}) => {
  const canvasStyle: React.CSSProperties = {
    width,
    height,
    minHeight,
    maxHeight,
    backgroundColor,
    padding,
    margin,
    border: border ? '1px solid var(--stroke-stroke)' : 'none',
    borderRadius,
    boxShadow: shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
    cursor: interactive ? 'crosshair' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={className} 
      style={canvasStyle}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? 'Interactive canvas area' : 'Canvas area'}
    >
      {children}
    </div>
  );
};

export default Canvas;
