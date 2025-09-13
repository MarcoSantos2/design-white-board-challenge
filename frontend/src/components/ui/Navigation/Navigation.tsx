import React, { forwardRef, useState } from 'react';
import { Icon, type IconName } from '../Icon';

// ========================================
// NAVIGATION TYPES & INTERFACES
// ========================================

export type NavigationVariant = 'global' | 'sidebar' | 'breadcrumb';
export type NavigationSize = 'small' | 'medium' | 'large';
export type NavigationState = 'default' | 'hover' | 'active' | 'disabled';

export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label */
  label: string;
  /** Navigation href or route */
  href?: string;
  /** Icon to display */
  icon?: IconName;
  /** Whether this item is currently active */
  active?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Child navigation items for nested navigation */
  children?: NavigationItem[];
  /** Click handler */
  onClick?: (e: React.MouseEvent, item: NavigationItem) => void;
}

export interface BaseNavigationProps {
  /** Navigation items */
  items: NavigationItem[];
  /** Navigation variant */
  variant?: NavigationVariant;
  /** Navigation size - mobile-first responsive */
  size?: NavigationSize;
  /** Custom className */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
}

// ========================================
// GLOBAL NAVIGATION COMPONENT
// ========================================

export interface GlobalNavProps extends BaseNavigationProps {
  /** Logo element */
  logo?: React.ReactNode;
  /** Actions to display on the right side */
  actions?: React.ReactNode;
  /** Mobile menu open state */
  mobileMenuOpen?: boolean;
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: () => void;
  /** Whether to show mobile menu toggle */
  showMobileMenu?: boolean;
}

export const GlobalNav = forwardRef<HTMLElement, GlobalNavProps>(
  (
    {
      items = [],
      logo,
      actions,
      mobileMenuOpen = false,
      onMobileMenuToggle,
      showMobileMenu = true,
      size = 'medium',
      className = '',
      'aria-label': ariaLabel = 'Global navigation',
      ...props
    },
    ref
  ) => {
    const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
    
    const isMenuOpen = mobileMenuOpen || internalMobileMenuOpen;
    const handleMenuToggle = onMobileMenuToggle || (() => setInternalMobileMenuOpen(!internalMobileMenuOpen));

    // Mobile-first responsive styles
    const containerStyles: React.CSSProperties = {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--surface-secondary)',
      borderBottom: '1px solid var(--stroke-stroke)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    };

    const innerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: size === 'small' ? '8px 16px' : size === 'large' ? '20px 24px' : '12px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      gap: '16px',
    };

    const logoStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: size === 'small' ? '18px' : size === 'large' ? '24px' : '20px',
      fontWeight: '600',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      flexShrink: 0,
    };

    // Desktop navigation styles
    const desktopNavStyles: React.CSSProperties = {
      display: 'none', // Hidden on mobile by default
      alignItems: 'center',
      gap: '8px',
    };

    // Mobile menu styles
    const mobileMenuStyles: React.CSSProperties = {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'var(--surface-secondary)',
      borderBottom: '1px solid var(--stroke-stroke)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
      opacity: isMenuOpen ? 1 : 0,
      visibility: isMenuOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 999,
    };

    const mobileActionsStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    };

    return (
      <nav
        ref={ref}
        className={`design-system-global-nav ${className}`}
        style={containerStyles}
        aria-label={ariaLabel}
        {...props}
      >
        <div style={innerStyles}>
          {/* Logo */}
          {logo && (
            <div style={logoStyles}>
              {logo}
            </div>
          )}

          {/* Desktop Navigation - Hidden on mobile */}
          <div style={desktopNavStyles} className="desktop-nav">
            {items.map((item) => (
              <NavigationLink
                key={item.id}
                item={item}
                size={size}
                variant="global"
              />
            ))}
          </div>

          {/* Actions & Mobile Menu Toggle */}
          <div style={mobileActionsStyles}>
            {actions}
            {showMobileMenu && (
              <button
                onClick={handleMenuToggle}
                style={{
                  display: 'flex', // Always show on mobile
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  borderRadius: 'var(--radius-1)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="mobile-menu-toggle"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                <Icon
                  name={isMenuOpen ? 'x' : 'menu'}
                  size="md"
                  color="var(--text-primary)"
                />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu - Collapsible */}
        {showMobileMenu && (
          <div style={mobileMenuStyles} className="mobile-menu">
            <div style={{ padding: '16px 20px' }}>
              {items.map((item) => (
                <NavigationLink
                  key={item.id}
                  item={item}
                  size={size}
                  variant="global"
                  mobile={true}
                  onClick={() => setInternalMobileMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Responsive CSS */}
        <style>{`
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .mobile-menu-toggle {
              display: none !important;
            }
          }
        `}</style>
      </nav>
    );
  }
);

GlobalNav.displayName = 'GlobalNav';

// ========================================
// SIDEBAR NAVIGATION COMPONENT
// ========================================

export interface SidebarProps extends BaseNavigationProps {
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Collapse toggle handler */
  onToggleCollapse?: () => void;
  /** Width of the sidebar */
  width?: string;
  /** Whether to show collapse button */
  showCollapseButton?: boolean;
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** CSS position strategy */
  position?: 'fixed' | 'absolute' | 'sticky' | 'static';
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items = [],
      collapsed = false,
      onToggleCollapse,
      width = '280px',
      showCollapseButton = true,
      header,
      footer,
      size = 'medium',
      className = '',
      'aria-label': ariaLabel = 'Sidebar navigation',
      position = 'fixed',
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
    
    const isCollapsed = collapsed || internalCollapsed;
    const handleToggle = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

    const sidebarStyles: React.CSSProperties = {
      position,
      top: position !== 'static' ? 0 : undefined,
      left: position !== 'static' ? 0 : undefined,
      height: position === 'fixed' ? '100vh' : '100%',
      width: isCollapsed ? '60px' : width,
      backgroundColor: 'var(--surface-secondary)',
      borderRight: '1px solid var(--stroke-stroke)',
      boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)',
      transition: 'width 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    };

    const headerStyles: React.CSSProperties = {
      padding: size === 'small' ? '12px' : size === 'large' ? '20px' : '16px',
      borderBottom: '1px solid var(--stroke-stroke)',
      backgroundColor: 'var(--surface-primary)',
      flexShrink: 0,
    };

    const navStyles: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: size === 'small' ? '8px' : size === 'large' ? '16px' : '12px',
    };

    const footerStyles: React.CSSProperties = {
      padding: size === 'small' ? '12px' : size === 'large' ? '20px' : '16px',
      borderTop: '1px solid var(--stroke-stroke)',
      backgroundColor: 'var(--surface-primary)',
      flexShrink: 0,
    };

    const toggleButtonStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      right: '-12px',
      transform: 'translateY(-50%)',
      width: '24px',
      height: '24px',
      border: '1px solid var(--stroke-stroke)',
      borderRadius: '50%',
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 1001,
    };

    return (
      <nav
        ref={ref}
        className={`design-system-sidebar ${className}`}
        style={sidebarStyles}
        aria-label={ariaLabel}
        {...props}
      >
        {/* Header */}
        {header && !isCollapsed && (
          <div style={headerStyles}>
            {header}
          </div>
        )}

        {/* Navigation Items */}
        <div style={navStyles}>
          {items.map((item) => (
            <NavigationLink
              key={item.id}
              item={item}
              size={size}
              variant="sidebar"
              collapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Footer */}
        {footer && !isCollapsed && (
          <div style={footerStyles}>
            {footer}
          </div>
        )}

        {/* Collapse Toggle Button */}
        {showCollapseButton && (
          <button
            onClick={handleToggle}
            style={toggleButtonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
              e.currentTarget.style.borderColor = 'var(--stroke-stroke-contrast)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
              e.currentTarget.style.borderColor = 'var(--stroke-stroke)';
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name={isCollapsed ? 'chevron-right' : 'chevron-left'}
              size="xs"
              color="var(--text-primary)"
            />
          </button>
        )}
      </nav>
    );
  }
);

Sidebar.displayName = 'Sidebar';

// ========================================
// BREADCRUMB COMPONENT
// ========================================

export interface BreadcrumbProps extends Omit<BaseNavigationProps, 'variant'> {
  /** Separator character */
  separator?: React.ReactNode;
  /** Maximum items to show before truncation */
  maxItems?: number;
  /** Whether to show home icon */
  showHomeIcon?: boolean;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items = [],
      separator = <Icon name="chevron-right" size="xs" color="var(--text-secondary-alt)" />,
      maxItems = 5,
      showHomeIcon = true,
      size = 'medium',
      className = '',
      'aria-label': ariaLabel = 'Breadcrumb navigation',
      ...props
    },
    ref
  ) => {
    // Handle truncation for long breadcrumbs
    const displayItems = items.length > maxItems 
      ? [
          items[0],
          { id: 'truncate', label: '...', disabled: true },
          ...items.slice(items.length - (maxItems - 2))
        ]
      : items;

    const breadcrumbStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: size === 'small' ? '8px 0' : size === 'large' ? '16px 0' : '12px 0',
      fontSize: size === 'small' ? '14px' : size === 'large' ? '16px' : '15px',
      color: 'var(--text-secondary-alt)',
      flexWrap: 'wrap',
    };

    return (
      <nav
        ref={ref}
        className={`design-system-breadcrumb ${className}`}
        style={breadcrumbStyles}
        aria-label={ariaLabel}
        {...props}
      >
        <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, padding: 0, listStyle: 'none' }}>
          {showHomeIcon && items.length > 1 && (
            <>
              <li>
                <Icon name="home" size="xs" color="var(--text-secondary-alt)" />
              </li>
              <li>{separator}</li>
            </>
          )}
          
          {displayItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <li>
                <NavigationLink
                  item={item}
                  size={size}
                  variant="breadcrumb"
                  isLast={index === displayItems.length - 1}
                />
              </li>
              {index < displayItems.length - 1 && (
                <li aria-hidden="true">{separator}</li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

// ========================================
// NAVIGATION LINK COMPONENT
// ========================================

interface NavigationLinkProps {
  item: NavigationItem;
  variant: NavigationVariant;
  size: NavigationSize;
  collapsed?: boolean;
  mobile?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  item,
  variant,
  size,
  collapsed = false,
  mobile = false,
  isLast = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    
    if (item.onClick) {
      item.onClick(e, item);
    }
    
    if (onClick) {
      onClick();
    }
  };

  // Variant-specific styles
  const getLinkStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? '0' : '8px',
      textDecoration: 'none',
      color: item.active ? 'var(--text-secondary)' : 'var(--text-primary)',
      fontWeight: item.active ? '600' : '400',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      opacity: item.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      userSelect: 'none',
      position: 'relative',
    };

    switch (variant) {
      case 'global':
        return {
          ...baseStyles,
          padding: mobile 
            ? '12px 0' 
            : size === 'small' ? '6px 12px' : size === 'large' ? '10px 16px' : '8px 14px',
          borderRadius: mobile ? '0' : 'var(--radius-1)',
          backgroundColor: mobile 
            ? 'transparent' 
            : (item.active || isHovered) ? 'var(--surface-primary)' : 'transparent',
          borderBottom: mobile ? '1px solid var(--stroke-stroke)' : 'none',
          fontSize: size === 'small' ? '14px' : size === 'large' ? '16px' : '15px',
          fontWeight: mobile ? '500' : baseStyles.fontWeight,
        };

      case 'sidebar':
        return {
          ...baseStyles,
          padding: collapsed 
            ? '12px' 
            : size === 'small' ? '8px 12px' : size === 'large' ? '12px 16px' : '10px 14px',
          borderRadius: 'var(--radius-1)',
          backgroundColor: item.active ? 'var(--surface-primary)' : isHovered ? 'var(--surface-primary)' : 'transparent',
          marginBottom: '4px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: '40px',
          fontSize: size === 'small' ? '14px' : size === 'large' ? '16px' : '15px',
        };

      case 'breadcrumb':
        return {
          ...baseStyles,
          padding: '2px 4px',
          borderRadius: 'var(--radius-1)',
          backgroundColor: isHovered && !isLast ? 'var(--surface-primary)' : 'transparent',
          color: isLast ? 'var(--text-secondary)' : 'var(--text-secondary-alt)',
          fontSize: size === 'small' ? '13px' : size === 'large' ? '15px' : '14px',
          fontWeight: isLast ? '500' : '400',
        };

      default:
        return baseStyles;
    }
  };

  const linkStyles = getLinkStyles();

  return (
    <a
      href={item.href}
      onClick={handleClick}
      style={linkStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-current={item.active ? 'page' : undefined}
      aria-disabled={item.disabled}
      title={collapsed ? item.label : undefined}
    >
      {item.icon && (
        <Icon
          name={item.icon}
          size={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'}
          color="currentColor"
        />
      )}
      
      {(!collapsed || variant !== 'sidebar') && (
        <span 
          style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {item.label}
        </span>
      )}
    </a>
  );
};

// ========================================
// EXPORTS
// ========================================

export { NavigationLink };
export default {
  GlobalNav,
  Sidebar,
  Breadcrumb,
};
