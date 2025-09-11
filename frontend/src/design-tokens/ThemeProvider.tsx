import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from './tokens';

// ========================================
// THEME CONTEXT
// ========================================

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ========================================
// THEME PROVIDER COMPONENT
// ========================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ 
  children, 
  defaultMode = 'light' 
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode === 'light' || savedMode === 'dark') {
      setModeState(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Update DOM attributes when mode changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme mode attributes for CSS variable switching
    root.setAttribute('data-Semantic-tokens', mode === 'light' ? 'Light' : 'Dark');
    root.setAttribute('data-Primitive-tokens', 'Mode-1');
    root.setAttribute('data-theme', mode);
    
    // Save to localStorage
    localStorage.setItem('theme-mode', mode);
    
    // Add theme class for additional styling
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${mode}`);
    
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    mode,
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================
// THEME HOOK
// ========================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ========================================
// THEME TOGGLE COMPONENT
// ========================================

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className={`theme-toggle ${className}`}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      style={{
        background: 'var(--button-secondary)',
        color: 'var(--button-on-secondary)',
        border: '1px solid var(--stroke-stroke)',
        borderRadius: 'var(--radius-1)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
      }}
    >
      <span>{mode === 'light' ? '🌙' : '☀️'}</span>
      <span>{mode === 'light' ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
}

// ========================================
// THEME UTILITIES
// ========================================

/**
 * Hook to get current theme mode without provider access
 */
export function useSystemTheme(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return mode;
}

/**
 * Apply theme to any element
 */
export function applyTheme(element: HTMLElement, mode: ThemeMode) {
  element.setAttribute('data-Semantic-tokens', mode === 'light' ? 'Light' : 'Dark');
  element.setAttribute('data-Primitive-tokens', 'Mode-1');
  element.setAttribute('data-theme', mode);
  element.classList.remove('theme-light', 'theme-dark');
  element.classList.add(`theme-${mode}`);
}
