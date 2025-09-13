import React, { useState } from 'react';
import {
  MainLayout,
  Grid,
  Container,
  Header,
  LayoutSidebar,
  Canvas,
  Button,
  Icon,
  Card,
} from './ui';

/**
 * LayoutDemo Component
 * 
 * Comprehensive demonstration of the Layout system:
 * - Main layout with header, sidebar, and canvas
 * - Responsive grid system
 * - Container utilities
 * - Mobile-first responsive design
 */
export const LayoutDemo: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'full' | 'sidebar' | 'canvas'>('full');

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <h3 style={{ 
        fontFamily: 'var(--Static-Title-Medium-Font)',
        fontSize: 'var(--Static-Title-Medium-Size)',
        fontWeight: 'var(--Static-Title-Medium-Weight)',
        margin: 0,
        color: 'var(--text-primary)',
      }}>
        Navigation
      </h3>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {['Dashboard', 'Projects', 'Design', 'Settings', 'Help'].map((item, index) => (
          <button
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-3)',
              border: 'none',
              backgroundColor: index === 0 ? 'var(--button-primary)' : 'transparent',
              color: index === 0 ? 'var(--button-on-primary)' : 'var(--text-primary)',
              borderRadius: 'var(--radius-1)',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--font-family-roboto)',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <Icon name="home" size="sm" />
            {!sidebarCollapsed && item}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)' }}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          startIcon={<Icon name="chevron-left" size="sm" />}
        >
          {!sidebarCollapsed && 'Collapse'}
        </Button>
      </div>
    </div>
  );

  const canvasContent = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      gap: 'var(--spacing-6)',
    }}>
      <Icon name="monitor" size="xxl" color="var(--text-secondary)" />
      <h2 style={{
        fontFamily: 'var(--Static-Headline-Small-Font)',
        fontSize: 'var(--Static-Headline-Small-Size)',
        fontWeight: 'var(--Static-Headline-Small-Weight)',
        margin: 0,
        color: 'var(--text-primary)',
        textAlign: 'center',
      }}>
        Whiteboard Canvas
      </h2>
      <p style={{
        fontFamily: 'var(--Static-Body-Medium-Font)',
        fontSize: 'var(--Static-Body-Medium-Size)',
        fontWeight: 'var(--Static-Body-Medium-Weight)',
        margin: 0,
        color: 'var(--text-secondary-alt)',
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        This is the main canvas area where users can interact with the whiteboard.
        The layout is fully responsive and adapts to different screen sizes.
      </p>
    </div>
  );

  const gridItems = Array.from({ length: 6 }, (_, i) => (
    <Card key={i} variant="primary" size="comfortable">
      <h4 style={{ 
        fontFamily: 'var(--Static-Title-Medium-Font)',
        fontSize: 'var(--Static-Title-Medium-Size)',
        fontWeight: 'var(--Static-Title-Medium-Weight)',
        margin: '0 0 var(--spacing-3) 0',
        color: 'var(--text-primary)',
      }}>
        Grid Item {i + 1}
      </h4>
      <p style={{ 
        fontFamily: 'var(--Static-Body-Medium-Font)',
        fontSize: 'var(--Static-Body-Medium-Size)',
        fontWeight: 'var(--Static-Body-Medium-Weight)',
        margin: 0,
        color: 'var(--text-secondary-alt)',
        lineHeight: 1.5,
      }}>
        This is a sample grid item demonstrating the responsive grid system.
        Content adapts to different screen sizes automatically.
      </p>
    </Card>
  ));

  if (layoutMode === 'full') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface-primary)',
        fontFamily: 'var(--font-family-roboto)',
      }}>
        {/* Demo Controls */}
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setLayoutMode('sidebar')}
          >
            Sidebar Demo
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setLayoutMode('canvas')}
          >
            Canvas Demo
          </Button>
        </div>

        {/* Main Layout Demo */}
        <MainLayout
          header={{
            title: 'Layout System Demo',
            subtitle: 'Complete layout with header, sidebar, and canvas',
            rightContent: (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowSidebar(!showSidebar)}
                startIcon={<Icon name="menu" size="sm" />}
              >
                {showSidebar ? 'Hide' : 'Show'} Sidebar
              </Button>
            ),
          }}
          sidebar={showSidebar ? {
            children: sidebarContent,
            collapsible: true,
          } : undefined}
          canvas={{
            children: canvasContent,
            interactive: true,
          }}
          layout={{
            sidebarCollapsed: sidebarCollapsed,
            showMobileMenu: true,
          }}
        />
      </div>
    );
  }

  if (layoutMode === 'sidebar') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface-primary)',
        fontFamily: 'var(--font-family-roboto)',
      }}>
        {/* Demo Controls */}
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setLayoutMode('full')}
          >
            Full Layout
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setLayoutMode('canvas')}
          >
            Canvas Demo
          </Button>
        </div>

        {/* Sidebar Demo */}
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <LayoutSidebar
            width="280px"
            collapsedWidth="64px"
            collapsed={sidebarCollapsed}
            collapsible={true}
            onToggle={setSidebarCollapsed}
          >
            {sidebarContent}
          </LayoutSidebar>
          
          <div style={{ flex: 1, padding: 'var(--spacing-5)' }}>
            <h1 style={{
              fontFamily: 'var(--Static-Display-Large-Font)',
              fontSize: 'var(--Static-Display-Large-Size)',
              fontWeight: 'var(--Static-Display-Large-Weight)',
              margin: '0 0 var(--spacing-6) 0',
              color: 'var(--text-primary)',
            }}>
              Sidebar Layout Demo
            </h1>
            
            <Container maxWidth="lg">
              <p style={{
                fontFamily: 'var(--Static-Body-Medium-Font)',
                fontSize: 'var(--Static-Body-Medium-Size)',
                fontWeight: 'var(--Static-Body-Medium-Weight)',
                margin: '0 0 var(--spacing-6) 0',
                color: 'var(--text-secondary-alt)',
                lineHeight: 1.6,
              }}>
                This demonstrates the sidebar component with collapse functionality.
                The sidebar can be toggled and adapts to different screen sizes.
              </p>
            </Container>
          </div>
        </div>
      </div>
    );
  }

  if (layoutMode === 'canvas') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface-primary)',
        fontFamily: 'var(--font-family-roboto)',
      }}>
        {/* Demo Controls */}
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setLayoutMode('full')}
          >
            Full Layout
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setLayoutMode('sidebar')}
          >
            Sidebar Demo
          </Button>
        </div>

        {/* Canvas Demo */}
        <div style={{ padding: 'var(--spacing-5)' }}>
          <h1 style={{
            fontFamily: 'var(--Static-Display-Large-Font)',
            fontSize: 'var(--Static-Display-Large-Size)',
            fontWeight: 'var(--Static-Display-Large-Weight)',
            margin: '0 0 var(--spacing-6) 0',
            color: 'var(--text-primary)',
          }}>
            Canvas & Grid Demo
          </h1>
          
          <Container maxWidth="lg" style={{ marginBottom: 'var(--spacing-8)' }}>
            <p style={{
              fontFamily: 'var(--Static-Body-Medium-Font)',
              fontSize: 'var(--Static-Body-Medium-Size)',
              fontWeight: 'var(--Static-Body-Medium-Weight)',
              margin: '0 0 var(--spacing-6) 0',
              color: 'var(--text-secondary-alt)',
              lineHeight: 1.6,
            }}>
              This demonstrates the canvas component and responsive grid system.
              The grid automatically adapts to different screen sizes.
            </p>
          </Container>

          {/* Canvas Demo */}
          <div style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 style={{
              fontFamily: 'var(--Static-Headline-Small-Font)',
              fontSize: 'var(--Static-Headline-Small-Size)',
              fontWeight: 'var(--Static-Headline-Small-Weight)',
              margin: '0 0 var(--spacing-4) 0',
              color: 'var(--text-primary)',
            }}>
              Interactive Canvas
            </h2>
            <Canvas
              height="300px"
              interactive={true}
              shadow={true}
              onClick={() => alert('Canvas clicked!')}
            >
              {canvasContent}
            </Canvas>
          </div>

          {/* Grid Demo */}
          <div>
            <h2 style={{
              fontFamily: 'var(--Static-Headline-Small-Font)',
              fontSize: 'var(--Static-Headline-Small-Size)',
              fontWeight: 'var(--Static-Headline-Small-Weight)',
              margin: '0 0 var(--spacing-4) 0',
              color: 'var(--text-primary)',
            }}>
              Responsive Grid
            </h2>
            <Grid
              columns="auto-fit"
              minColumnWidth="250px"
              gap="var(--spacing-5)"
            >
              {gridItems}
            </Grid>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
