import React, { createContext, useContext, useEffect, useState } from 'react';

// ========================================
// SIMPLE THEME CONTEXT (No external deps)
// ========================================

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ========================================
// SIMPLE THEME PROVIDER COMPONENT
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
    
    // Debug: Log what we're setting
    console.log('🎨 Theme changed to:', mode);
    console.log('📋 data-Semantic-tokens:', root.getAttribute('data-Semantic-tokens'));
    console.log('🔧 data-Primitive-tokens:', root.getAttribute('data-Primitive-tokens'));
    
    // Test CSS variable values
    const computedStyle = getComputedStyle(root);
    console.log('🎯 --button-primary:', computedStyle.getPropertyValue('--button-primary'));
    console.log('🎯 --surface-primary:', computedStyle.getPropertyValue('--surface-primary'));
    console.log('🧪 --test-color:', computedStyle.getPropertyValue('--test-color'));
    
    // Test primitive variables
    console.log('🔵 --neutral-0:', computedStyle.getPropertyValue('--neutral-0'));
    console.log('🔵 --neutral-900:', computedStyle.getPropertyValue('--neutral-900'));
    console.log('🟡 --yellow-300:', computedStyle.getPropertyValue('--yellow-300'));
    
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
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
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
