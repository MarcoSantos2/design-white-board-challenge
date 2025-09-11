/**
 * Design Tokens - TypeScript Implementation
 * Generated from Figma design system
 * 
 * Architecture:
 * - Primitive tokens (atomic values)
 * - Semantic tokens (context-aware aliases)
 * - Light/Dark mode support
 */

// ========================================
// PRIMITIVE TOKENS (Atomic Layer)
// ========================================

export const primitiveTokens = {
  // Neutral Colors
  neutral: {
    0: 'rgb(255, 255, 255)',
    50: 'rgb(242, 242, 242)', 
    100: 'rgb(230, 230, 230)',
    200: 'rgb(204, 204, 204)',
    300: 'rgb(179, 179, 179)',
    400: 'rgb(153, 153, 153)',
    500: 'rgb(128, 128, 128)',
    600: 'rgb(102, 102, 102)',
    700: 'rgb(77, 77, 77)',
    800: 'rgb(51, 51, 51)',
    900: 'rgb(26, 26, 26)',
  },
  
  // Yellow Colors
  yellow: {
    50: 'rgb(255, 250, 230)',
    100: 'rgb(255, 245, 204)',
    200: 'rgb(255, 235, 153)',
    300: 'rgb(255, 227, 105)',
    500: 'rgb(255, 222, 77)',
    600: 'rgb(255, 207, 0)',
    700: 'rgb(204, 166, 0)',
  },
  
  // Border Radius
  radius: {
    0: '0px',
    1: '8px',
    2: '16px',
    3: '24px',
    4: '32px',
    5: '40px',
  },
  
  // Spacing Scale
  spacing: {
    0: '0px',
    1: '2px',
    2: '4px',
    3: '8px',
    4: '12px',
    5: '16px',
    6: '20px',
    7: '24px',
    8: '32px',
    9: '40px',
    10: '48px',
    11: '64px',
    12: '80px',
    13: '96px',
    14: '112px',
    15: '120px',
  },
} as const;

// ========================================
// SEMANTIC TOKENS (Context-Aware Layer)
// ========================================

export const semanticTokens = {
  light: {
    // Surface Colors
    surface: {
      primary: primitiveTokens.neutral[0],
      secondary: primitiveTokens.neutral[50],
    },
    
    // Text Colors
    text: {
      primary: primitiveTokens.neutral[800],
      secondary: primitiveTokens.neutral[900],
      secondaryAlt: primitiveTokens.neutral[600],
      dialogue: primitiveTokens.neutral[600],
      dialogueBg: primitiveTokens.neutral[50],
    },
    
    // Button Colors
    button: {
      primary: primitiveTokens.neutral[900],
      onPrimary: primitiveTokens.yellow[300],
      primaryAlt: primitiveTokens.neutral[800],
      onPrimaryAlt: primitiveTokens.neutral[200],
      secondary: primitiveTokens.neutral[0],
      onSecondary: primitiveTokens.neutral[900],
      secondaryAlt: primitiveTokens.neutral[200],
      onSecondaryAlt: primitiveTokens.neutral[800],
    },
    
    // Stroke Colors
    stroke: {
      stroke: primitiveTokens.neutral[300],
      strokeContrast: primitiveTokens.neutral[600],
    },
  },
  
  dark: {
    // Surface Colors
    surface: {
      primary: primitiveTokens.neutral[900],
      secondary: primitiveTokens.neutral[800],
    },
    
    // Text Colors
    text: {
      primary: primitiveTokens.neutral[50],
      secondary: primitiveTokens.neutral[0],
      secondaryAlt: primitiveTokens.neutral[300],
      dialogue: primitiveTokens.neutral[300],
      dialogueBg: primitiveTokens.neutral[800],
    },
    
    // Button Colors
    button: {
      primary: primitiveTokens.yellow[300],
      onPrimary: primitiveTokens.neutral[900],
      primaryAlt: primitiveTokens.neutral[0],
      onPrimaryAlt: primitiveTokens.neutral[700],
      secondary: primitiveTokens.neutral[900],
      onSecondary: primitiveTokens.yellow[300],
      secondaryAlt: primitiveTokens.neutral[700],
      onSecondaryAlt: primitiveTokens.neutral[0],
    },
    
    // Stroke Colors
    stroke: {
      stroke: primitiveTokens.neutral[700],
      strokeContrast: primitiveTokens.neutral[400],
    },
  },
} as const;

// ========================================
// TOKEN UTILITY TYPES
// ========================================

export type ThemeMode = 'light' | 'dark';
export type PrimitiveToken = typeof primitiveTokens;
export type SemanticToken = typeof semanticTokens;

// ========================================
// TOKEN ACCESS FUNCTIONS
// ========================================

/**
 * Get semantic token for current theme mode
 */
export function getSemanticToken(mode: ThemeMode = 'light') {
  return semanticTokens[mode];
}

/**
 * Get primitive token (theme-agnostic)
 */
export function getPrimitiveToken() {
  return primitiveTokens;
}

// ========================================
// CSS VARIABLE MAPPING
// ========================================

/**
 * Maps TypeScript tokens to CSS variable names
 * Maintains compatibility with exported Figma CSS
 */
export const cssVariableMap = {
  // Primitive tokens
  neutral: {
    0: '--neutral-0',
    50: '--neutral-50',
    100: '--neutral-100',
    200: '--neutral-200',
    300: '--neutral-300',
    400: '--neutral-400',
    500: '--neutral-500',
    600: '--neutral-600',
    700: '--neutral-700',
    800: '--neutral-800',
    900: '--neutral-900',
  },
  yellow: {
    50: '--yellow-50',
    100: '--yellow-100',
    200: '--yellow-200',
    300: '--yellow-300',
    500: '--yellow-500',
    600: '--yellow-600',
    700: '--yellow-700',
  },
  radius: {
    0: '--radius-0',
    1: '--radius-1',
    2: '--radius-2',
    3: '--radius-3',
    4: '--radius-4',
    5: '--radius-5',
  },
  spacing: {
    0: '--spacing-0',
    1: '--spacing-1',
    2: '--spacing-2',
    3: '--spacing-3',
    4: '--spacing-4',
    5: '--spacing-5',
    6: '--spacing-6',
    7: '--spacing-7',
    8: '--spacing-8',
    9: '--spacing-9',
    10: '--spacing-10',
    11: '--spacing-11',
    12: '--spacing-12',
    13: '--spacing-13',
    14: '--spacing-14',
    15: '--spacing-15',
  },
  
  // Semantic tokens
  semantic: {
    surface: {
      primary: '--surface-primary',
      secondary: '--surface-secondary',
    },
    text: {
      primary: '--text-primary',
      secondary: '--text-secondary',
      secondaryAlt: '--text-secondary-alt',
      dialogue: '--text-dialogue',
      dialogueBg: '--text-dialogue-bg',
    },
    button: {
      primary: '--button-primary',
      onPrimary: '--button-on-primary',
      primaryAlt: '--button-primary-alt',
      onPrimaryAlt: '--button-on-primary-alt',
      secondary: '--button-secondary',
      onSecondary: '--button-on-secondary',
      secondaryAlt: '--button-secondary-alt',
      onSecondaryAlt: '--button-on-secondary-alt',
    },
    stroke: {
      stroke: '--stroke-stroke',
      strokeContrast: '--stroke-stroke-contrast',
    },
  },
} as const;
