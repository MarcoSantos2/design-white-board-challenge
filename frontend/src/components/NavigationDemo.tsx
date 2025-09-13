import React, { useState } from 'react';
import { GlobalNav, Sidebar, Breadcrumb } from './ui/Navigation/Navigation';
import type { NavigationItem } from './ui/Navigation/Navigation';
import { Icon } from './ui/Icon/Icon';
import { Button } from './ui/Button/Button';

// ========================================
// NAVIGATION DEMO COMPONENT
// ========================================

export const NavigationDemo: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  // Sample navigation items for different contexts
  const globalNavItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '#dashboard',
      icon: 'grid',
      active: activePage === 'dashboard',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#projects',
      icon: 'folder',
      active: activePage === 'projects',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'messages',
      label: 'Messages',
      href: '#messages',
      icon: 'message',
      active: activePage === 'messages',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '#settings',
      icon: 'settings',
      active: activePage === 'settings',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
  ];

  const sidebarItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      href: '#overview',
      icon: 'grid',
      active: activePage === 'overview',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '#analytics',
      icon: 'trending-up',
      active: activePage === 'analytics',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '#reports',
      icon: 'document',
      active: activePage === 'reports',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'users',
      label: 'Users',
      href: '#users',
      icon: 'users',
      active: activePage === 'users',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
    {
      id: 'security',
      label: 'Security',
      href: '#security',
      icon: 'shield',
      disabled: true,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      href: '#integrations',
      icon: 'api',
      active: activePage === 'integrations',
      onClick: (e, item) => {
        e.preventDefault();
        setActivePage(item.id);
      },
    },
  ];

  const breadcrumbItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
      icon: 'home',
    },
    {
      id: 'workspace',
      label: 'Workspace',
      href: '#workspace',
    },
    {
      id: 'project',
      label: 'UX Design Project',
      href: '#project',
    },
    {
      id: 'page',
      label: 'Navigation Components',
      active: true,
    },
  ];

  const demoContainerStyles: React.CSSProperties = {
    backgroundColor: 'var(--surface-primary)',
    color: 'var(--text-primary)',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center' as const,
    padding: '32px 16px 24px',
    background: 'var(--surface-secondary)',
    borderBottom: '1px solid var(--stroke-stroke)',
  };

  const sectionStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  };

  const demoSectionStyles: React.CSSProperties = {
    marginBottom: '48px',
    padding: '24px',
    backgroundColor: 'var(--surface-secondary)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--stroke-stroke)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: '16px',
    color: 'var(--text-secondary-alt)',
    marginBottom: '24px',
    lineHeight: '1.6',
  };

  const featureListStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  };

  const featureItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--surface-primary)',
    border: '1px solid var(--stroke-stroke)',
    borderRadius: 'var(--radius-1)',
    fontSize: '14px',
    color: 'var(--text-primary)',
  };

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '12px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: 'var(--surface-primary)',
    border: '1px solid var(--stroke-stroke)',
    borderRadius: 'var(--radius-1)',
  };

  const demoAreaStyles: React.CSSProperties = {
    position: 'relative',
    border: '2px dashed var(--stroke-stroke)',
    borderRadius: 'var(--radius-2)',
    backgroundColor: 'var(--surface-primary)',
    minHeight: '400px',
    overflow: 'hidden',
  };

  return (
    <div style={demoContainerStyles}>
      {/* Demo Header */}
      <div style={headerStyles}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '8px',
          color: 'var(--text-secondary)',
          lineHeight: '1.2',
        }}>
          Navigation Components
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary-alt)',
          margin: 0,
        }}>
          Mobile-first responsive navigation with theme integration
        </p>
      </div>

      {/* Content */}
      <div style={sectionStyles}>
        
        {/* Global Navigation Demo */}
        <div style={demoSectionStyles}>
          <h2 style={titleStyles}>
            <Icon name="menu" size="md" color="var(--text-secondary)" />
            Global Navigation
          </h2>
          <p style={descriptionStyles}>
            Responsive top navigation bar with mobile menu, logo support, and action buttons. 
            Automatically adapts between desktop horizontal layout and mobile collapsible menu.
          </p>

          <div style={featureListStyles}>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Mobile-first responsive design</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Collapsible mobile menu</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Logo and actions support</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Active state management</span>
            </div>
          </div>

          <div style={demoAreaStyles}>
            <GlobalNav
              items={globalNavItems}
              logo={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="grid" size="md" color="var(--button-primary)" />
                  <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>
                    Whiteboard
                  </span>
                </div>
              }
              actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button variant="secondary" size="small">
                    <Icon name="bell" size="sm" />
                  </Button>
                  <Button variant="primary" size="small">
                    <Icon name="user" size="sm" />
                  </Button>
                </div>
              }
              size="medium"
            />
            
            {/* Content area to show the nav in context */}
            <div style={{ 
              padding: '80px 24px 24px', 
              textAlign: 'center',
              color: 'var(--text-secondary-alt)' 
            }}>
              <p>Active Page: <strong style={{ color: 'var(--text-secondary)' }}>{activePage}</strong></p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Try resizing your browser or using mobile view to see the responsive behavior
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Demo */}
        <div style={demoSectionStyles}>
          <h2 style={titleStyles}>
            <Icon name="grid" size="md" color="var(--text-secondary)" />
            Sidebar Navigation
          </h2>
          <p style={descriptionStyles}>
            Collapsible sidebar navigation perfect for admin panels and complex applications. 
            Features smooth collapse animations and tooltips when collapsed.
          </p>

          <div style={featureListStyles}>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Collapsible with animation</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Icon-only collapsed mode</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Header and footer support</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Disabled state support</span>
            </div>
          </div>

          <div style={controlsStyles}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              startIcon={<Icon name={sidebarCollapsed ? 'chevron-right' : 'chevron-left'} size="xs" />}
            >
              {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
          </div>

          <div style={{ ...demoAreaStyles, position: 'relative', height: '500px' }}>
            <Sidebar
              items={sidebarItems}
              collapsed={sidebarCollapsed}
              position="absolute"
              header={
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '16px', 
                    color: 'var(--text-secondary)' 
                  }}>
                    Admin Panel
                  </h3>
                </div>
              }
              footer={
                <div style={{ textAlign: 'center' }}>
                  <Button variant="secondary" size="small" fullWidth>
                    <Icon name="logout" size="xs" />
                    {!sidebarCollapsed && 'Sign Out'}
                  </Button>
                </div>
              }
            />
            
            {/* Main content area */}
            <div style={{ 
              marginLeft: sidebarCollapsed ? '60px' : '280px',
              padding: '24px',
              transition: 'margin-left 0.3s ease',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              color: 'var(--text-secondary-alt)',
            }}>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Main Content Area
              </h3>
              <p>Active Page: <strong style={{ color: 'var(--text-secondary)' }}>{activePage}</strong></p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Content automatically adjusts to sidebar width
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation Demo */}
        <div style={demoSectionStyles}>
          <h2 style={titleStyles}>
            <Icon name="chevron-right" size="md" color="var(--text-secondary)" />
            Breadcrumb Navigation
          </h2>
          <p style={descriptionStyles}>
            Hierarchical navigation breadcrumbs with automatic truncation for long paths. 
            Includes home icon and customizable separators.
          </p>

          <div style={featureListStyles}>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Automatic truncation</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Customizable separators</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Home icon support</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Current page highlight</span>
            </div>
          </div>

          <div style={demoAreaStyles}>
            <div style={{ padding: '24px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px' 
              }}>
                Standard Breadcrumb
              </h3>
              <Breadcrumb items={breadcrumbItems} />

              <h3 style={{ 
                fontSize: '18px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px',
                marginTop: '32px' 
              }}>
                Small Size
              </h3>
              <Breadcrumb items={breadcrumbItems} size="small" />

              <h3 style={{ 
                fontSize: '18px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px',
                marginTop: '32px' 
              }}>
                Without Home Icon
              </h3>
              <Breadcrumb 
                items={breadcrumbItems} 
                showHomeIcon={false}
                separator={<span style={{ color: 'var(--text-secondary-alt)' }}>/</span>}
              />

              <h3 style={{ 
                fontSize: '18px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px',
                marginTop: '32px' 
              }}>
                Long Path (Truncated)
              </h3>
              <Breadcrumb 
                items={[
                  { id: 'root', label: 'Root', href: '#' },
                  { id: 'level1', label: 'Level 1', href: '#' },
                  { id: 'level2', label: 'Level 2', href: '#' },
                  { id: 'level3', label: 'Level 3', href: '#' },
                  { id: 'level4', label: 'Level 4', href: '#' },
                  { id: 'level5', label: 'Level 5', href: '#' },
                  { id: 'current', label: 'Current Page', active: true },
                ]}
                maxItems={4}
              />
            </div>
          </div>
        </div>

        {/* Navigation States Demo */}
        <div style={demoSectionStyles}>
          <h2 style={titleStyles}>
            <Icon name="settings" size="md" color="var(--text-secondary)" />
            Navigation States & Interactions
          </h2>
          <p style={descriptionStyles}>
            All navigation components support multiple states including active, hover, disabled, 
            and loading states with smooth transitions and accessibility features.
          </p>

          <div style={featureListStyles}>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Hover & focus states</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Active page highlighting</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Disabled state support</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Keyboard navigation</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>ARIA accessibility</span>
            </div>
            <div style={featureItemStyles}>
              <Icon name="check" size="xs" color="var(--button-primary)" />
              <span>Theme integration</span>
            </div>
          </div>

          <div style={demoAreaStyles}>
            <div style={{ padding: '24px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '24px' 
              }}>
                <div>
                  <h4 style={{ 
                    fontSize: '16px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px' 
                  }}>
                    State Examples
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--surface-primary)',
                      border: '1px solid var(--stroke-stroke)',
                      borderRadius: 'var(--radius-1)',
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                    }}>
                      ✓ Active State
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--stroke-stroke)',
                      borderRadius: 'var(--radius-1)',
                      color: 'var(--text-primary)',
                    }}>
                      Default State
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--stroke-stroke)',
                      borderRadius: 'var(--radius-1)',
                      color: 'var(--text-secondary-alt)',
                      opacity: 0.5,
                    }}>
                      Disabled State
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ 
                    fontSize: '16px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '12px' 
                  }}>
                    Size Variants
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      padding: '6px 10px',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--stroke-stroke)',
                      borderRadius: 'var(--radius-1)',
                      fontSize: '13px',
                    }}>
                      Small Navigation
                    </div>
                    <div style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--stroke-stroke)',
                      borderRadius: 'var(--radius-1)',
                      fontSize: '15px',
                    }}>
                      Medium Navigation
                    </div>
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--stroke-stroke)',
                      borderRadius: 'var(--radius-1)',
                      fontSize: '16px',
                    }}>
                      Large Navigation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NavigationDemo;
