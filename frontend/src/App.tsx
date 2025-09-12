import React from 'react'
import { ThemeProvider, ThemeToggle, useTheme } from './design-tokens/SimpleThemeProvider'
import { ButtonDemo } from './components/ButtonDemo'
import { InputDemo } from './components/InputDemo'
import { CardDemo } from './components/CardDemo'

function AppContent() {
  const { mode } = useTheme()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'system-ui, sans-serif',
      transition: 'all 0.3s ease',
    }}>
      {/* Theme Toggle - Mobile-First Positioning */}
      <div style={{ 
        position: 'fixed',
        top: '16px', // Mobile: closer to edge
        right: '16px', // Mobile: closer to edge
        zIndex: 1000
      }}>
        <ThemeToggle />
      </div>

      {/* Header - Mobile-First */}
      <div style={{
        textAlign: 'center' as const,
        padding: '24px 16px 16px', // Mobile: smaller padding
        background: 'var(--surface-secondary)',
        borderBottom: '1px solid var(--stroke-stroke)',
      }}>
        <h1 style={{
          fontSize: '28px', // Mobile: smaller heading
          marginBottom: '8px',
          color: 'var(--text-secondary)',
          lineHeight: '1.2',
        }}>
          UX Whiteboard Challenge
        </h1>
        
        <p style={{
          fontSize: '16px', // Mobile: readable size
          color: 'var(--text-secondary-alt)',
          margin: 0,
        }}>
          Design System Components - Theme: <strong>{mode}</strong>
        </p>
      </div>

      {/* Main Content - Component Demos */}
      <CardDemo />
      <ButtonDemo />
      <InputDemo />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
