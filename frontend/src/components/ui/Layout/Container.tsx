import React from 'react';

export interface ContainerProps {
  /** Maximum width of the container */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full' | string;
  /** Container padding */
  padding?: string;
  /** Container margin */
  margin?: string;
  /** Center the container horizontally */
  centered?: boolean;
  /** Full width container */
  fullWidth?: boolean;
  /** Full height container */
  fullHeight?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Container children */
  children: React.ReactNode;
}

/**
 * Container Component
 * 
 * A responsive container that provides consistent spacing and max-width constraints.
 * Mobile-first design with breakpoint-based max-widths.
 */
export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  padding = 'var(--spacing-5)',
  margin = '0 auto',
  centered = true,
  fullWidth = false,
  fullHeight = false,
  backgroundColor,
  className,
  style,
  children,
}) => {
  const getMaxWidth = () => {
    if (fullWidth) return '100%';
    if (typeof maxWidth === 'string' && !['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full'].includes(maxWidth)) {
      return maxWidth;
    }
    
    const maxWidthMap = {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
      full: '100%',
    };
    
    return maxWidthMap[maxWidth as keyof typeof maxWidthMap] || '1024px';
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: getMaxWidth(),
    padding,
    margin: centered ? margin : undefined,
    backgroundColor,
    minHeight: fullHeight ? '100vh' : undefined,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

export default Container;
