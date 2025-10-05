import React from 'react';

// ========================================
// ICON TYPES & INTERFACES
// ========================================

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type IconWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold';
export type IconVariant = 'outline' | 'filled' | 'duotone';

// Comprehensive icon library - 20+ essential icons
export type IconName = 
  // Navigation & Arrows
  | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down'
  | 'chevron-right' | 'chevron-left' | 'chevron-up' | 'chevron-down'
  | 'arrow-up-right' | 'arrow-down-left' | 'external-link'
  
  // Actions & Controls
  | 'plus' | 'minus' | 'x' | 'check' | 'check-circle'
  | 'edit' | 'trash' | 'copy' | 'share' | 'save'
  | 'refresh' | 'undo' | 'redo'
  
  // Interface & Layout
  | 'menu' | 'grid' | 'list' | 'search' | 'filter'
  | 'settings' | 'more-horizontal' | 'more-vertical'
  | 'maximize' | 'minimize' | 'expand'
  
  // Communication & Social
  | 'message' | 'chat' | 'mail' | 'phone' | 'video'
  | 'mic' | 'mic-off' | 'speaker' | 'volume-up' | 'volume-off'
  
  // File & Data
  | 'file' | 'folder' | 'download' | 'upload' | 'cloud'
  | 'image' | 'document' | 'link' | 'attachment'
  
  // User & Account
  | 'user' | 'users' | 'user-plus' | 'user-minus'
  | 'profile' | 'login' | 'logout'
  
  // Status & Feedback
  | 'info' | 'warning' | 'error' | 'success' | 'alert'
  | 'bell' | 'notification' | 'star' | 'heart' | 'bookmark'
  
  // Time & Calendar
  | 'clock' | 'calendar' | 'date' | 'time'
  
  // Location & Maps
  | 'location' | 'map' | 'navigation' | 'compass'
  
  // Technology & Tools
  | 'code' | 'terminal' | 'database' | 'server' | 'api'
  | 'monitor' | 'smartphone' | 'tablet' | 'desktop'
  
  // Additional Navigation Icons
  | 'home' | 'shield' | 'trending-up'
  
  // Theme & Display Icons
  | 'sun' | 'moon'
  
  // Visibility Icons
  | 'eye' | 'eye-off';

export interface IconProps {
  /** Icon name from the comprehensive library */
  name: IconName;
  /** Icon size - mobile-first responsive */
  size?: IconSize;
  /** Stroke weight for outline icons */
  weight?: IconWeight;
  /** Icon variant style */
  variant?: IconVariant;
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
// MOBILE-FIRST ICON SIZE MAPPING
// ========================================

const sizeMap: Record<IconSize, string> = {
  xs: '12px',   // Mobile: tiny icons
  sm: '16px',   // Mobile: small icons (default)
  md: '20px',   // Mobile: medium icons
  lg: '24px',   // Mobile: large touch targets
  xl: '32px',   // Mobile: prominent icons
  xxl: '48px',  // Mobile: hero icons
};

// ========================================
// STROKE WEIGHT MAPPING
// ========================================

const weightMap: Record<IconWeight, string> = {
  thin: '1',
  light: '1.5',
  regular: '2',
  medium: '2.5',
  bold: '3',
};

// ========================================
// COMPREHENSIVE SVG ICON PATHS
// ========================================

const iconPaths: Record<IconName, string | { outline: string; filled?: string; duotone?: string }> = {
  // Navigation & Arrows
  'arrow-right': 'M5 12h14m-7-7l7 7-7 7',
  'arrow-left': 'M19 12H5m7 7l-7-7 7-7',
  'arrow-up': 'M12 5v14m7-7l-7-7-7 7',
  'arrow-down': 'M12 19V5m-7 7l7 7 7-7',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-up': 'M18 15l-6-6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  'arrow-up-right': 'M7 17L17 7M17 7H7M17 7v10',
  'arrow-down-left': 'M17 7L7 17M7 17h10M7 17V7',
  'external-link': 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
  
  // Actions & Controls
  'plus': 'M12 5v14m-7-7h14',
  'minus': 'M5 12h14',
  'x': 'M18 6L6 18M6 6l12 12',
  'check': 'M20 6L9 17l-5-5',
  'check-circle': {
    outline: 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    filled: 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  'edit': 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  'trash': 'M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
  'copy': 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M15 4H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1z',
  'share': 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
  'save': 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
  'refresh': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  'undo': 'M3 7v6h6M21 17a9 9 0 11-9-9c2.31 0 4.41.736 6.12 1.98L21 13',
  'redo': 'M21 7v6h-6M3 17a9 9 0 009-9c-2.31 0-4.41.736-6.12 1.98L3 13',
  
  // Interface & Layout
  'menu': 'M3 12h18M3 6h18M3 18h18',
  'grid': 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  'list': 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  'search': 'M21 21l-4.35-4.35M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0z',
  'filter': 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  'settings': 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  'more-horizontal': 'M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z',
  'more-vertical': 'M12 5a1 1 0 100-2 1 1 0 000 2zM12 12a1 1 0 100-2 1 1 0 000 2zM12 19a1 1 0 100-2 1 1 0 000 2z',
  'maximize': 'M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M16 21h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3',
  'minimize': 'M8 3v3a2 2 0 01-2 2H3M16 3v3a2 2 0 002 2h3M16 21v-3a2 2 0 012-2h3M8 21v-3a2 2 0 00-2-2H3',
  'expand': 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  
  // Communication & Social
  'message': 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  'chat': 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  'mail': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  'phone': 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  'video': 'M23 7l-7 5 7 5V7zM16 5H2a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1z',
  'mic': 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8',
  'mic-off': 'M1 1l22 22M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M19 10v2a7 7 0 01-1.61 4.48M12 19v4M8 23h8',
  'speaker': 'M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07',
  'volume-up': 'M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07',
  'volume-off': 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6',
  
  // File & Data
  'file': 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9zM13 2v7h7',
  'folder': 'M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z',
  'download': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  'upload': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  'cloud': 'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
  'image': 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM21 15l-5-5L5 21',
  'document': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'link': 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  'attachment': 'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48',
  
  // User & Account
  'user': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  'users': 'M17 21v-2a4 4 0 00-3-3.87M13 5a4 4 0 010 7.75M9 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M16 11a4 4 0 100-8 4 4 0 000 8z',
  'user-plus': 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6',
  'user-minus': 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12.5 11a4 4 0 100-8 4 4 0 000 8zM17 11h6',
  'profile': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z',
  'login': 'M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3',
  'logout': 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  
  // Status & Feedback
  'info': 'M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
  'warning': 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  'error': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6',
  'success': 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  'alert': 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  'bell': 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  'notification': 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0M12 2v2',
  'star': {
    outline: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    filled: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  'heart': {
    outline: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
    filled: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  },
  'bookmark': 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  
  // Time & Calendar
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  'calendar': 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM19 19H5V8h14v11zM7 10h5v5H7z',
  'date': 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
  'time': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6h4.5',
  
  // Location & Maps
  'location': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  'map': 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16',
  'navigation': 'M3 11l19-9-9 19-2-8-8-2z',
  'compass': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  
  // Technology & Tools
  'code': 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  'terminal': 'M4 17l6-6-6-6M12 19h8',
  'database': 'M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5c0 1.66 4.03 3 9 3s9-1.34 9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
  'server': 'M20 8H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2zM20 16H4a2 2 0 01-2-2v-2a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2zM6 6h.01M6 14h.01',
  'api': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'monitor': 'M20 3H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zM8 21h8',
  'smartphone': 'M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01',
  'tablet': 'M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01',
  'desktop': 'M21 2H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V3a1 1 0 00-1-1zM7 22h10',
  
  // Additional Navigation Icons
  'home': 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'trending-up': 'M23 6l-9.5 9.5-5-5L1 18',
  
  // Theme & Display Icons
  'sun': 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 100-10 5 5 0 000 10z',
  'moon': 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  
  // Visibility Icons
  'eye': 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 3a3 3 0 110-6 3 3 0 010 6z',
  'eye-off': 'M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.46A10.94 10.94 0 0112 5c7 0 11 7 11 7a18.54 18.54 0 01-5.08 5.66M6.11 8.53A18.93 18.93 0 001 12s4 7 11 7a10.94 10.94 0 004.18-.8'
};

// ========================================
// MAIN ICON COMPONENT
// ========================================

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'sm',
  weight = 'regular',
  variant = 'outline',
  color = 'currentColor',
  className = '',
  onClick,
  'aria-label': ariaLabel,
  ...props
}) => {
  const iconSize = sizeMap[size];
  const strokeWeight = weightMap[weight];
  const pathData = iconPaths[name];

  if (!pathData) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconPaths));
    return null;
  }

  // Handle different icon variants
  let path: string;
  if (typeof pathData === 'string') {
    path = pathData;
  } else {
    path = pathData[variant] || pathData.outline;
  }

  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<SVGElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e as any);
    }
  };

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill={variant === 'filled' ? color : 'none'}
      stroke={variant === 'filled' ? 'none' : color}
      strokeWidth={variant === 'filled' ? '0' : strokeWeight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`design-system-icon icon-${name} ${className}`}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        // Mobile-first touch optimization
        minHeight: onClick ? '44px' : 'auto',
        minWidth: onClick ? '44px' : 'auto',
        padding: onClick && size === 'sm' ? '14px' : onClick && size === 'md' ? '12px' : onClick ? '10px' : '0',
        borderRadius: onClick ? 'var(--radius-1)' : '0',
        ...props.style,
      }}
      aria-label={ariaLabel || `${name} icon`}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : -1}
      {...props}
    >
      <path d={path} />
    </svg>
  );
};

// ========================================
// CONVENIENCE ICON COMPONENTS
// ========================================

// Navigation Icons
export const ArrowRightIcon = (props: Omit<IconProps, 'name'>) => <Icon name="arrow-right" {...props} />;
export const ArrowLeftIcon = (props: Omit<IconProps, 'name'>) => <Icon name="arrow-left" {...props} />;
export const ChevronRightIcon = (props: Omit<IconProps, 'name'>) => <Icon name="chevron-right" {...props} />;
export const ChevronLeftIcon = (props: Omit<IconProps, 'name'>) => <Icon name="chevron-left" {...props} />;

// Action Icons
export const PlusIcon = (props: Omit<IconProps, 'name'>) => <Icon name="plus" {...props} />;
export const XIcon = (props: Omit<IconProps, 'name'>) => <Icon name="x" {...props} />;
export const CheckIcon = (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />;
export const EditIcon = (props: Omit<IconProps, 'name'>) => <Icon name="edit" {...props} />;
export const TrashIcon = (props: Omit<IconProps, 'name'>) => <Icon name="trash" {...props} />;

// Interface Icons
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />;
export const MenuIcon = (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />;
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="settings" {...props} />;
export const MoreHorizontalIcon = (props: Omit<IconProps, 'name'>) => <Icon name="more-horizontal" {...props} />;

// File Icons
export const DownloadIcon = (props: Omit<IconProps, 'name'>) => <Icon name="download" {...props} />;
export const UploadIcon = (props: Omit<IconProps, 'name'>) => <Icon name="upload" {...props} />;
export const FileIcon = (props: Omit<IconProps, 'name'>) => <Icon name="file" {...props} />;

// User Icons
export const UserIcon = (props: Omit<IconProps, 'name'>) => <Icon name="user" {...props} />;
export const UsersIcon = (props: Omit<IconProps, 'name'>) => <Icon name="users" {...props} />;

// Communication Icons
export const MessageIcon = (props: Omit<IconProps, 'name'>) => <Icon name="message" {...props} />;
export const MailIcon = (props: Omit<IconProps, 'name'>) => <Icon name="mail" {...props} />;

// Status Icons
export const InfoIcon = (props: Omit<IconProps, 'name'>) => <Icon name="info" {...props} />;
export const WarningIcon = (props: Omit<IconProps, 'name'>) => <Icon name="warning" {...props} />;
export const ErrorIcon = (props: Omit<IconProps, 'name'>) => <Icon name="error" {...props} />;
export const SuccessIcon = (props: Omit<IconProps, 'name'>) => <Icon name="success" {...props} />;

// Popular Icons
export const HeartIcon = (props: Omit<IconProps, 'name'>) => <Icon name="heart" {...props} />;
export const StarIcon = (props: Omit<IconProps, 'name'>) => <Icon name="star" {...props} />;