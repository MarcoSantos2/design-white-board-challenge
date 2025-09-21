import React, { useState } from 'react';
import { Header } from './Header';
import { LayoutSidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { Container } from './Container';

export interface MainLayoutProps {
  /** Header configuration */
  header?: {
    title?: string;
    subtitle?: string;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    centerContent?: React.ReactNode;
  };
  /** Sidebar configuration */
  sidebar?: {
    width?: string;
    collapsedWidth?: string;
    collapsible?: boolean;
    children: React.ReactNode;
  };
  /** Canvas configuration */
  canvas?: {
    backgroundColor?: string;
    interactive?: boolean;
    children?: React.ReactNode;
  };
  /** Layout configuration */
  layout?: {
    sidebarPosition?: 'left' | 'right';
    sidebarCollapsed?: boolean;
    showMobileMenu?: boolean;
  };
  /** Main content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * MainLayout Component
 * 
 * A complete layout system with header, sidebar, and canvas areas.
 * Mobile-first responsive design with proper touch interactions.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  header,
  sidebar,
  canvas,
  layout = {},
  children,
  className,
  style,
}) => {
  const {
    sidebarPosition = 'left',
    sidebarCollapsed = false,
    showMobileMenu = true,
  } = layout;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(sidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarWidth = sidebar?.width || '280px';
  const sidebarCollapsedWidth = sidebar?.collapsedWidth || '64px';
  const currentSidebarWidth = isSidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth;

  const mainContentStyle: React.CSSProperties = {
    marginLeft: sidebarPosition === 'left' && sidebar ? currentSidebarWidth : '0',
    marginRight: sidebarPosition === 'right' && sidebar ? currentSidebarWidth : '0',
    minHeight: '100vh',
    transition: 'margin 0.3s ease',
    ...style,
  };

  return (
    <div className={className} style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {sidebar && (
        <LayoutSidebar
          width={sidebarWidth}
          collapsedWidth={sidebarCollapsedWidth}
          collapsed={isSidebarCollapsed}
          collapsible={sidebar.collapsible}
          position={sidebarPosition}
          onToggle={handleSidebarToggle}
        >
          {sidebar.children}
        </LayoutSidebar>
      )}

      {/* Main Content Area */}
      <div style={mainContentStyle}>
        {/* Header */}
        {header && (
          <Header
            title={header.title}
            subtitle={header.subtitle}
            leftContent={header.leftContent}
            rightContent={header.rightContent}
            centerContent={header.centerContent}
            onMobileMenuToggle={handleMobileMenuToggle}
            showMobileMenu={showMobileMenu}
          />
        )}

        {/* Main Content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {canvas ? (
            <Container fullWidth fullHeight>
              <Canvas
                backgroundColor={canvas.backgroundColor}
                interactive={canvas.interactive}
                style={{ flex: 1 }}
              >
                {canvas.children || children}
              </Canvas>
            </Container>
          ) : (
            <Container fullWidth>
              {children}
            </Container>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && sidebar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 80,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
