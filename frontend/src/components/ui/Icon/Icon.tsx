import React from 'react';
import { primitiveTokens } from '../../../design-tokens';

// ========================================
// ICON TYPES & INTERFACES
// ========================================

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconName = 
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'plus'
  | 'minus'
  | 'x'
  | 'check'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-up'
  | 'chevron-down'
  | 'menu'
  | 'search'
  | 'settings'
  | 'user'
  | 'home'
  | 'edit'
  | 'trash'
  | 'download'
  | 'upload'
  | 'external-link'
  | 'copy'
  | 'heart'
  | 'star'
  | 'info'
  | 'warning'
  | 'error'
  | 'success';

export interface IconProps {
  /** Icon name */
  name: IconName;
  /** Icon size */
  size?: IconSize;
  /** Custom color (defaults to currentColor) */
  color?: string;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<SVGElement>) => void;
  /** Accessibility label */
  'aria-label'?: string;
  /** Additional props */
  [key: string]: any;
}

// ========================================
// ICON SIZE MAPPING
// ========================================

const sizeMap: Record<IconSize, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

// ========================================
// SVG ICON PATHS
// ========================================

const iconPaths: Record<IconName, string> = {
  // Arrows
  'arrow-right': 'M5 12h14m-7-7l7 7-7 7',
  'arrow-left': 'M19 12H5m7 7l-7-7 7-7',
  'arrow-up': 'M12 5v14m7-7l-7-7-7 7',
  'arrow-down': 'M12 19V5m-7 7l7 7 7-7',
  
  // Chevrons
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-up': 'M18 15l-6-6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  
  // Basic actions
  'plus': 'M12 5v14m-7-7h14',
  'minus': 'M5 12h14',
  'x': 'M18 6L6 18M6 6l12 12',
  'check': 'M20 6L9 17l-5-5',
  
  // Interface
  'menu': 'M3 12h18M3 6h18M3 18h18',
  'search': 'M21 21l-4.35-4.35M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0z',
  'settings': 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  
  // User & Navigation
  'user': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  
  // Actions
  'edit': 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  'trash': 'M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
  'copy': 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M15 4H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1z',
  
  // File operations
  'download': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  'upload': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  'external-link': 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
  
  // Status & feedback
  'heart': 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'info': 'M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
  'warning': 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  'error': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6',
  'success': 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
};

// ========================================
// MAIN ICON COMPONENT
// ========================================

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className = '',
  onClick,
  'aria-label': ariaLabel,
  ...props
}) => {
  const iconSize = sizeMap[size];
  const pathData = iconPaths[name];

  if (!pathData) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconPaths));
    return null;
  }

  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }
  };

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`design-system-icon ${className}`}
      onClick={onClick ? handleClick : undefined}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        ...props.style,
      }}
      aria-label={ariaLabel || `${name} icon`}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : -1}
      {...props}
    >
      <path d={pathData} />
    </svg>
  );
};

// ========================================
// CONVENIENCE ICON COMPONENTS
// ========================================

export const ArrowRightIcon = (props: Omit<IconProps, 'name'>) => <Icon name="arrow-right" {...props} />;
export const ArrowLeftIcon = (props: Omit<IconProps, 'name'>) => <Icon name="arrow-left" {...props} />;
export const PlusIcon = (props: Omit<IconProps, 'name'>) => <Icon name="plus" {...props} />;
export const XIcon = (props: Omit<IconProps, 'name'>) => <Icon name="x" {...props} />;
export const CheckIcon = (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />;
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />;
export const MenuIcon = (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />;
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="settings" {...props} />;
export const UserIcon = (props: Omit<IconProps, 'name'>) => <Icon name="user" {...props} />;
export const HomeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="home" {...props} />;
export const EditIcon = (props: Omit<IconProps, 'name'>) => <Icon name="edit" {...props} />;
export const TrashIcon = (props: Omit<IconProps, 'name'>) => <Icon name="trash" {...props} />;
export const DownloadIcon = (props: Omit<IconProps, 'name'>) => <Icon name="download" {...props} />;
export const ExternalLinkIcon = (props: Omit<IconProps, 'name'>) => <Icon name="external-link" {...props} />;
