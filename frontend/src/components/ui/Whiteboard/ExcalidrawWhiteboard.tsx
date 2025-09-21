import React, { useEffect, useRef, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { loadLibraryFromBlob } from '@excalidraw/excalidraw';
import './excalidraw-overrides.css';
// Library will be loaded dynamically

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
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  const handleChange = (elements: readonly any[], appState: any, files: any) => {
    if (onChange) {
      onChange(elements, appState, files);
    }
  };

  // Load UX wireframing library on component mount
  useEffect(() => {
    const loadUXLibrary = async () => {
      try {
        // Dynamically import the library data
        const response = await fetch('/src/assets/basic-ux-wireframing-elements.excalidrawlib.json');
        const uxLibraryData = await response.json();
        
        // Convert the JSON data to a Blob
        const libraryBlob = new Blob([JSON.stringify(uxLibraryData)], {
          type: 'application/json'
        });
        
        // Load the library using Excalidraw's utility
        const loadedLibraryItems = await loadLibraryFromBlob(libraryBlob);
        setLibraryItems(loadedLibraryItems);
        setIsLibraryLoaded(true);
      } catch (error) {
        console.error('Failed to load UX wireframing library:', error);
        setIsLibraryLoaded(true); // Set to true anyway to prevent infinite loading
      }
    };

    loadUXLibrary();
  }, []);


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

  // Show loading state while library is being loaded
  if (!isLibraryLoaded) {
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <div style={{
          textAlign: 'center',
          color: 'var(--text-primary)',
          fontSize: '14px'
        }}>
          Loading UX wireframing library...
        </div>
      </div>
    );
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
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: 'scale(1)',
          transformOrigin: 'top left',
          fontSize: '14px',
        }}
      >
        <Excalidraw
          initialData={{
            ...initialData,
            libraryItems: libraryItems,
            appState: {
              ...initialData?.appState,
              zoom: {
                value: 1.0, // Set zoom to 100% for better visibility on larger canvas
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
