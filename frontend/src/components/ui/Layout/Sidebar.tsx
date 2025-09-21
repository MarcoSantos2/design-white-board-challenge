import React, { useState } from 'react';
import { Icon } from '../Icon';

export interface LayoutSidebarProps {
  /** Sidebar width */
  width?: string;
  /** Collapsed width */
  collapsedWidth?: string;
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Whether sidebar is collapsible */
  collapsible?: boolean;
  /** Sidebar position */
  position?: 'left' | 'right';
  /** Background color */
  backgroundColor?: string;
  /** Border */
  border?: boolean;
  /** Sidebar content */
  children: React.ReactNode;
  /** Collapse toggle handler */
  onToggle?: (collapsed: boolean) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Sidebar Component
 * 
 * A responsive sidebar with collapse functionality.
 * Mobile-first design with proper touch interactions.
 */
export const LayoutSidebar: React.FC<LayoutSidebarProps> = ({
  width = '280px',
  collapsedWidth = '64px',
  collapsed = false,
  collapsible = true,
  position = 'left',
  backgroundColor = 'var(--surface-secondary)',
  border = true,
  children,
  onToggle,
  className,
  style,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    if (collapsible) {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onToggle?.(newCollapsed);
    }
  };

  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? collapsedWidth : width,
    height: '100vh',
    backgroundColor,
    borderRight: border && position === 'left' ? '1px solid var(--stroke-stroke)' : 'none',
    borderLeft: border && position === 'right' ? '1px solid var(--stroke-stroke)' : 'none',
    position: 'fixed',
    [position]: 0,
    top: 0,
    zIndex: 90,
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  return (
    <aside className={className} style={sidebarStyle}>
      {/* Sidebar Header */}
      {collapsible && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: 'var(--spacing-4)',
          borderBottom: '1px solid var(--stroke-stroke)',
          minHeight: '64px',
        }}>
          {!isCollapsed && (
            <h2 style={{
              fontFamily: 'var(--Static-Title-Medium-Font)',
              fontSize: 'var(--Static-Title-Medium-Size)',
              fontWeight: 'var(--Static-Title-Medium-Weight)',
              lineHeight: 'var(--Static-Title-Medium-Line-Height)',
              letterSpacing: 'var(--Static-Title-Medium-Tracking)',
              margin: 0,
              color: 'var(--text-primary)',
            }}>
              Menu
            </h2>
          )}
          <button
            onClick={handleToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: 'var(--radius-1)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon 
              name={isCollapsed ? 'chevron-right' : 'chevron-left'} 
              size="sm" 
            />
          </button>
        </div>
      )}

      {/* Sidebar Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--spacing-4)',
      }}>
        {children}
      </div>
    </aside>
  );
};

export default LayoutSidebar;
