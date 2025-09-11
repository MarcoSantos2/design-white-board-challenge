import React, { useState } from 'react';
import { 
  PrimaryButton, 
  SecondaryButton, 
  PrimaryAltButton, 
  SecondaryAltButton 
} from './ui/Button';

import { 
  ArrowRightIcon, 
  PlusIcon, 
  DownloadIcon, 
  CheckIcon,
  UserIcon,
  MessageIcon,
  StarIcon,
  Icon
} from './ui/Icon';

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
          🎯 Icon Integration with Buttons
        </h2>
        
        <div style={buttonRowStyle}>
          <PrimaryButton startIcon={<PlusIcon size="sm" />}>
            Create New
          </PrimaryButton>
          <SecondaryButton endIcon={<ArrowRightIcon size="sm" />}>
            Continue
          </SecondaryButton>
          <PrimaryAltButton 
            startIcon={<DownloadIcon size="sm" />}
            endIcon={<ArrowRightIcon size="sm" />}
          >
            Download
          </PrimaryAltButton>
        </div>
        
        <div style={buttonRowStyle}>
          <SecondaryAltButton 
            startIcon={<CheckIcon size="sm" />}
            loading={loadingStates.iconLoading}
            onClick={() => handleLoadingTest('iconLoading')}
          >
            {loadingStates.iconLoading ? 'Processing...' : 'Confirm'}
          </SecondaryAltButton>
          <PrimaryButton startIcon={<UserIcon size="sm" />}>
            Profile
          </PrimaryButton>
          <SecondaryButton startIcon={<MessageIcon size="sm" />}>
            Chat
          </SecondaryButton>
        </div>
      </section>

      {/* Comprehensive Icon System Showcase */}
      <section style={demoSectionStyle}>
        <h2 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          fontSize: '18px',
        }}>
          🎨 Comprehensive Icon System (20+ Icons)
        </h2>
        
        <p style={{ 
          color: 'var(--text-secondary-alt)', 
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.4',
        }}>
          Complete icon library with mobile-first design, multiple sizes, weights, and variants.
        </p>

        {/* Icon Sizes Demo */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            fontSize: '16px',
            marginBottom: '12px',
          }}>
            📏 Icon Sizes (Mobile-First)
          </h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flexWrap: 'wrap',
            background: 'var(--text-dialogue-bg)',
            padding: '12px',
            borderRadius: 'var(--radius-1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size="xs" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary-alt)' }}>xs (12px)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size="sm" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary-alt)' }}>sm (16px)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size="md" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary-alt)' }}>md (20px)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size="lg" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary-alt)' }}>lg (24px)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size="xl" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary-alt)' }}>xl (32px)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size="xxl" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary-alt)' }}>xxl (48px)</span>
            </div>
          </div>
        </div>

        {/* Icon Categories */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            fontSize: '16px',
            marginBottom: '12px',
          }}>
            📚 Icon Categories
          </h3>
          
          {/* Navigation Icons */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              Navigation & Arrows
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexWrap: 'wrap',
              background: 'var(--text-dialogue-bg)',
              padding: '12px',
              borderRadius: 'var(--radius-1)',
            }}>
              <Icon name="arrow-right" size="md" />
              <Icon name="arrow-left" size="md" />
              <Icon name="arrow-up" size="md" />
              <Icon name="arrow-down" size="md" />
              <Icon name="chevron-right" size="md" />
              <Icon name="chevron-left" size="md" />
              <Icon name="external-link" size="md" />
            </div>
          </div>

          {/* Action Icons */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              Actions & Controls
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexWrap: 'wrap',
              background: 'var(--text-dialogue-bg)',
              padding: '12px',
              borderRadius: 'var(--radius-1)',
            }}>
              <Icon name="plus" size="md" />
              <Icon name="minus" size="md" />
              <Icon name="x" size="md" />
              <Icon name="check" size="md" />
              <Icon name="edit" size="md" />
              <Icon name="trash" size="md" />
              <Icon name="copy" size="md" />
              <Icon name="share" size="md" />
              <Icon name="save" size="md" />
            </div>
          </div>

          {/* Interface Icons */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              Interface & Layout
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexWrap: 'wrap',
              background: 'var(--text-dialogue-bg)',
              padding: '12px',
              borderRadius: 'var(--radius-1)',
            }}>
              <Icon name="menu" size="md" />
              <Icon name="grid" size="md" />
              <Icon name="list" size="md" />
              <Icon name="search" size="md" />
              <Icon name="filter" size="md" />
              <Icon name="settings" size="md" />
              <Icon name="more-horizontal" size="md" />
            </div>
          </div>

          {/* Communication Icons */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              Communication & Social
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexWrap: 'wrap',
              background: 'var(--text-dialogue-bg)',
              padding: '12px',
              borderRadius: 'var(--radius-1)',
            }}>
              <Icon name="message" size="md" />
              <Icon name="chat" size="md" />
              <Icon name="mail" size="md" />
              <Icon name="phone" size="md" />
              <Icon name="video" size="md" />
              <Icon name="mic" size="md" />
              <Icon name="bell" size="md" />
            </div>
          </div>

          {/* Status & Feedback Icons */}
          <div>
            <h4 style={{ 
              color: 'var(--text-secondary-alt)', 
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              Status & Feedback
            </h4>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexWrap: 'wrap',
              background: 'var(--text-dialogue-bg)',
              padding: '12px',
              borderRadius: 'var(--radius-1)',
            }}>
              <Icon name="info" size="md" />
              <Icon name="warning" size="md" />
              <Icon name="error" size="md" />
              <Icon name="success" size="md" />
              <Icon name="star" size="md" />
              <Icon name="heart" size="md" />
              <Icon name="bookmark" size="md" />
            </div>
          </div>
        </div>

        {/* Interactive Icons Demo */}
        <div>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            fontSize: '16px',
            marginBottom: '12px',
          }}>
            ⚡ Interactive Icons (Click & Touch)
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <Icon 
              name="heart" 
              size="lg" 
              variant="outline"
              onClick={() => alert('Heart clicked! ❤️')}
              style={{ color: 'var(--button-primary)' }}
            />
            <Icon 
              name="star" 
              size="lg" 
              variant="filled"
              onClick={() => alert('Star clicked! ⭐')}
              style={{ color: '#FFD700' }}
            />
            <Icon 
              name="settings" 
              size="lg" 
              onClick={() => alert('Settings clicked! ⚙️')}
              style={{ color: 'var(--text-secondary-alt)' }}
            />
            <Icon 
              name="bell" 
              size="lg" 
              onClick={() => alert('Notification! 🔔')}
              style={{ color: 'var(--button-primary)' }}
            />
          </div>
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