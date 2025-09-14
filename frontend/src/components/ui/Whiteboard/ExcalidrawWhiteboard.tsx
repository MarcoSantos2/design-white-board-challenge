import React, { useEffect, useRef } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import './excalidraw-overrides.css';

export interface ExcalidrawWhiteboardProps {
  /** Whether the whiteboard is visible */
  visible?: boolean;
  /** Initial data for the whiteboard */
  initialData?: any;
  /** Callback when data changes */
  onChange?: (elements: readonly any[], appState: any, files: any) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * ExcalidrawWhiteboard Component
 * 
 * A styled wrapper around Excalidraw that integrates with our design system.
 * Provides a clean whiteboard interface with proper theming.
 */
export const ExcalidrawWhiteboard: React.FC<ExcalidrawWhiteboardProps> = ({
  visible = true,
  initialData,
  onChange,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (elements: readonly any[], appState: any, files: any) => {
    if (onChange) {
      onChange(elements, appState, files);
    }
  };

  // Fix scaling issues by ensuring proper CSS isolation
  useEffect(() => {
    if (containerRef.current) {
      // Create a CSS isolation for Excalidraw with higher specificity
      const style = document.createElement('style');
      style.id = 'excalidraw-scaling-fix';
      style.textContent = `
        .excalidraw-container .excalidraw {
          font-size: 14px !important;
          transform: scale(1) !important;
          transform-origin: top left !important;
        }
        
        .excalidraw-container .excalidraw .App {
          font-size: 14px !important;
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island {
          font-size: 14px !important;
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          min-height: 40px !important;
          max-width: 40px !important;
          max-height: 40px !important;
          transform: scale(1) !important;
          font-size: 14px !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
          min-height: 20px !important;
          max-width: 20px !important;
          max-height: 20px !important;
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__label {
          font-size: 12px !important;
          line-height: 1.2 !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__keybinding {
          font-size: 10px !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
          min-height: 20px !important;
          max-width: 20px !important;
          max-height: 20px !important;
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg path,
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg circle,
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg rect,
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg g {
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg {
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon__icon {
          transform: scale(1) !important;
        }
        
        .excalidraw-container .excalidraw .App .Island .ToolIcon {
          transform: scale(1) !important;
        }
        
        /* Target specific Excalidraw classes with higher specificity */
        .excalidraw-container [class*="ToolIcon"] {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          min-height: 40px !important;
          max-width: 40px !important;
          max-height: 40px !important;
          transform: scale(1) !important;
        }
        
        .excalidraw-container [class*="ToolIcon"] [class*="icon"] {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
          min-height: 20px !important;
          max-width: 20px !important;
          max-height: 20px !important;
          transform: scale(1) !important;
        }
        
        .excalidraw-container [class*="ToolIcon"] svg {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
          min-height: 20px !important;
          max-width: 20px !important;
          max-height: 20px !important;
          transform: scale(1) !important;
        }
      `;
      document.head.appendChild(style);
      
      // Also try to apply styles after a delay to ensure Excalidraw has loaded
      const timeoutId = setTimeout(() => {
        const excalidrawElement = containerRef.current?.querySelector('.excalidraw');
        if (excalidrawElement) {
          // Force re-apply styles
          const additionalStyle = document.createElement('style');
          additionalStyle.id = 'excalidraw-scaling-fix-delayed';
          additionalStyle.textContent = `
            .excalidraw-container .excalidraw .App .Island .ToolIcon {
              width: 40px !important;
              height: 40px !important;
              min-width: 40px !important;
              min-height: 40px !important;
              max-width: 40px !important;
              max-height: 40px !important;
              transform: scale(1) !important;
            }
            
            .excalidraw-container .excalidraw .App .Island .ToolIcon__icon {
              width: 20px !important;
              height: 20px !important;
              min-width: 20px !important;
              min-height: 20px !important;
              max-width: 20px !important;
              max-height: 20px !important;
              transform: scale(1) !important;
            }
            
            .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg {
              width: 20px !important;
              height: 20px !important;
              min-width: 20px !important;
              min-height: 20px !important;
              max-width: 20px !important;
              max-height: 20px !important;
              transform: scale(1) !important;
            }
          `;
          document.head.appendChild(additionalStyle);
        }
      }, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        const existingStyle = document.getElementById('excalidraw-scaling-fix');
        const existingDelayedStyle = document.getElementById('excalidraw-scaling-fix-delayed');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
        if (existingDelayedStyle) {
          document.head.removeChild(existingDelayedStyle);
        }
      };
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`excalidraw-container ${className || ''}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'var(--surface-primary)',
        overflow: 'hidden',
        isolation: 'isolate',
        contain: 'layout style paint',
        ...style,
      }}
    >
      {/* Excalidraw Component */}
      <div 
        style={{ 
          width: '800px',
          height: '600px',
          position: 'relative',
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0 auto',
          fontSize: '14px',
        }}
      >
        <Excalidraw
          initialData={{
            ...initialData,
            appState: {
              ...initialData?.appState,
              zoom: {
                value: 0.4, // Set zoom to 40% to fix scaling issues
              },
            },
          }}
          onChange={handleChange}
          theme="light"
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
              export: false,
              toggleTheme: false,
            },
            tools: {
              image: false,
            },
          }}
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={true}
          name="UX Whiteboard"
        />
      </div>
      
      {/* Additional CSS override with maximum specificity */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .excalidraw-container .excalidraw .App .Island .ToolIcon {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            max-width: 40px !important;
            max-height: 40px !important;
            transform: scale(1) !important;
            font-size: 14px !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon__icon {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
            max-width: 20px !important;
            max-height: 20px !important;
            transform: scale(1) !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon__icon svg {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
            max-width: 20px !important;
            max-height: 20px !important;
            transform: scale(1) !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon__label {
            font-size: 12px !important;
            line-height: 1.2 !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon__keybinding {
            font-size: 10px !important;
          }
          
          /* More aggressive overrides */
          .excalidraw-container .excalidraw .App .Island .ToolIcon[title*="Export"] {
            width: 40px !important;
            height: 40px !important;
            transform: scale(1) !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon[title*="Find"] {
            width: 40px !important;
            height: 40px !important;
            transform: scale(1) !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon[title*="Help"] {
            width: 40px !important;
            height: 40px !important;
            transform: scale(1) !important;
          }
          
          .excalidraw-container .excalidraw .App .Island .ToolIcon[title*="Reset"] {
            width: 40px !important;
            height: 40px !important;
            transform: scale(1) !important;
          }
          
          /* Target all button elements */
          .excalidraw-container .excalidraw .App .Island button {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            max-width: 40px !important;
            max-height: 40px !important;
            transform: scale(1) !important;
            font-size: 14px !important;
          }
          
          .excalidraw-container .excalidraw .App .Island button svg {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
            max-width: 20px !important;
            max-height: 20px !important;
            transform: scale(1) !important;
          }
        `
      }} />
    </div>
  );
};

export default ExcalidrawWhiteboard;
