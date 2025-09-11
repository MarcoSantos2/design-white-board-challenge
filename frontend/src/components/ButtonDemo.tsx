import React, { useState } from 'react';
import { 
  Button, 
  PrimaryButton, 
  SecondaryButton, 
  PrimaryAltButton, 
  SecondaryAltButton 
} from './ui/Button';

// Simple icons for demo (we'll build proper Icon system later)
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14m-7-7l7 7-7 7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14m-7-7h14"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// ========================================
// ADVANCED BUTTON DEMO COMPONENT
// ========================================

export const ButtonDemo: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingTest = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    
    // Simulate async operation
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  // Mobile-first responsive styles
  const demoSectionStyle: React.CSSProperties = {
    marginBottom: '24px', // Mobile: tighter spacing
    padding: '16px', // Mobile: smaller padding
    background: 'var(--surface-secondary)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--stroke-stroke)',
    transition: 'all 0.3s ease',
  };

  const buttonGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', // Mobile: smaller min width
    gap: '12px', // Mobile: smaller gap
    marginTop: '16px',
  };

  const buttonRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px', // Mobile: smaller gap
    flexWrap: 'wrap' as const,
    marginTop: '16px',
  };

  return (
    <div style={{ 
      maxWidth: '100%', // Mobile: full width
      margin: '0 auto', 
      padding: '16px', // Mobile: smaller padding
    }}>
      <h1 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: '24px',
        textAlign: 'center',
        fontSize: '24px', // Mobile: smaller heading
        lineHeight: '1.2',
      }}>
        Advanced Button System
      </h1>

      {/* Mobile-First Button Showcase */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px', // Mobile: smaller subheading
        }}>
          📱 Mobile-First Design
        </h2>
        
        <p style={{ 
          color: 'var(--text-secondary-alt)', 
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.4',
        }}>
          All buttons are optimized for touch with proper tap targets (44px+) and responsive design.
        </p>

        <div style={buttonRowStyle}>
          <PrimaryButton size="large" fullWidth>
            Mobile Primary
          </PrimaryButton>
        </div>
        
        <div style={buttonRowStyle}>
          <SecondaryButton size="medium">
            Secondary
          </SecondaryButton>
          <PrimaryAltButton size="medium">
            Primary Alt
          </PrimaryAltButton>
        </div>
      </section>

      {/* All Button Variants */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
          🎨 All Variants (Theme-Aware)
        </h2>
        
        <div style={buttonGridStyle}>
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <PrimaryAltButton>Primary Alt</PrimaryAltButton>
          <SecondaryAltButton>Secondary Alt</SecondaryAltButton>
        </div>
      </section>

      {/* Button Sizes */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
          📏 Responsive Sizes
        </h2>
        
        <div style={buttonRowStyle}>
          <PrimaryButton size="small">Small (36px)</PrimaryButton>
          <PrimaryButton size="medium">Medium (44px)</PrimaryButton>
          <PrimaryButton size="large">Large (52px)</PrimaryButton>
        </div>
        
        <div style={{ ...buttonRowStyle, marginTop: '12px' }}>
          <SecondaryButton size="small">Small</SecondaryButton>
          <SecondaryButton size="medium">Medium</SecondaryButton>
          <SecondaryButton size="large">Large</SecondaryButton>
        </div>
      </section>

      {/* Interactive States */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
        ⚡ Interactive States
        </h2>
        
        <div style={buttonRowStyle}>
          <PrimaryButton>Default</PrimaryButton>
          <PrimaryButton disabled>Disabled</PrimaryButton>
          <PrimaryButton 
            loading={loadingStates.primary}
            onClick={() => handleLoadingTest('primary')}
          >
            {loadingStates.primary ? 'Loading...' : 'Test Loading'}
          </PrimaryButton>
        </div>
        
        <div style={buttonRowStyle}>
          <SecondaryButton 
            loading={loadingStates.secondary}
            onClick={() => handleLoadingTest('secondary')}
          >
            {loadingStates.secondary ? 'Working...' : 'Async Action'}
          </SecondaryButton>
          <PrimaryButton fullWidth>Full Width Button</PrimaryButton>
        </div>
      </section>

      {/* Icons Integration */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
          🎯 Icon Integration
        </h2>
        
        <div style={buttonRowStyle}>
          <PrimaryButton startIcon={<PlusIcon />}>
            Create New
          </PrimaryButton>
          <SecondaryButton endIcon={<ArrowRightIcon />}>
            Continue
          </SecondaryButton>
          <PrimaryAltButton 
            startIcon={<DownloadIcon />}
            endIcon={<ArrowRightIcon />}
          >
            Download
          </PrimaryAltButton>
        </div>
        
        <div style={buttonRowStyle}>
          <SecondaryAltButton 
            startIcon={<CheckIcon />}
            loading={loadingStates.iconLoading}
            onClick={() => handleLoadingTest('iconLoading')}
          >
            {loadingStates.iconLoading ? 'Processing...' : 'Confirm'}
          </SecondaryAltButton>
        </div>
      </section>

      {/* Advanced Interactions */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
          🔥 Advanced Features
        </h2>
        
        <p style={{ 
          color: 'var(--text-secondary-alt)', 
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.4',
        }}>
          Try hovering (desktop) or tapping (mobile) these buttons to see smooth animations and state changes:
        </p>

        <div style={buttonRowStyle}>
          <PrimaryButton 
            onClick={() => alert('🎉 Perfect click interaction!')}
            startIcon={<CheckIcon />}
          >
            Click Me!
          </PrimaryButton>
          
          <SecondaryButton 
            onClick={() => alert('🚀 Secondary action!')}
            endIcon={<ArrowRightIcon />}
          >
            Try This
          </SecondaryButton>
        </div>
      </section>

      {/* Theme Integration Demo */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
          🌗 Perfect Theme Integration
        </h2>
        
        <p style={{ 
          color: 'var(--text-secondary-alt)', 
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.4',
        }}>
          All buttons automatically adapt using your Figma design tokens. 
          Toggle the theme (top-right) to see instant color switching!
        </p>

        <div style={buttonGridStyle}>
          <div style={{ 
            textAlign: 'center',
            padding: '16px',
            background: 'var(--text-dialogue-bg)',
            borderRadius: 'var(--radius-1)',
          }}>
            <h4 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '8px',
              fontSize: '14px',
            }}>
              Light Mode
            </h4>
            <p style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '12px',
              margin: 0,
            }}>
              Dark buttons with yellow accents
            </p>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '16px',
            background: 'var(--text-dialogue-bg)',
            borderRadius: 'var(--radius-1)',
          }}>
            <h4 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '8px',
              fontSize: '14px',
            }}>
              Dark Mode
            </h4>
            <p style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '12px',
              margin: 0,
            }}>
              Yellow buttons with dark accents
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};