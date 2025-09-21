import React from 'react';

export interface GridProps {
  /** Number of columns for the grid */
  columns?: number | 'auto' | 'auto-fit' | 'auto-fill';
  /** Minimum column width */
  minColumnWidth?: string;
  /** Gap between grid items */
  gap?: string;
  /** Row gap (overrides gap for rows) */
  rowGap?: string;
  /** Column gap (overrides gap for columns) */
  columnGap?: string;
  /** Grid template areas */
  areas?: string[];
  /** Grid template columns */
  templateColumns?: string;
  /** Grid template rows */
  templateRows?: string;
  /** Justify items alignment */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  /** Align items alignment */
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  /** Justify content alignment */
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  /** Align content alignment */
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Grid children */
  children: React.ReactNode;
}

/**
 * Responsive Grid Component
 * 
 * A flexible grid system that adapts to different screen sizes.
 * Uses CSS Grid with mobile-first responsive design.
 */
export const Grid: React.FC<GridProps> = ({
  columns = 'auto-fit',
  minColumnWidth = '250px',
  gap = 'var(--spacing-5)',
  rowGap,
  columnGap,
  areas,
  templateColumns,
  templateRows,
  justifyItems = 'stretch',
  alignItems = 'stretch',
  justifyContent = 'start',
  alignContent = 'start',
  className,
  style,
  children,
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: rowGap && columnGap ? undefined : gap,
    rowGap: rowGap || (rowGap && columnGap ? rowGap : undefined),
    columnGap: columnGap || (rowGap && columnGap ? columnGap : undefined),
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    ...style,
  };

  // Handle different column configurations
  if (templateColumns) {
    gridStyle.gridTemplateColumns = templateColumns;
  } else if (typeof columns === 'number') {
    gridStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else if (columns === 'auto') {
    gridStyle.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
  } else if (columns === 'auto-fit') {
    gridStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`;
  } else if (columns === 'auto-fill') {
    gridStyle.gridTemplateColumns = `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`;
  }

  if (templateRows) {
    gridStyle.gridTemplateRows = templateRows;
  }

  if (areas && areas.length > 0) {
    gridStyle.gridTemplateAreas = areas.map(area => `"${area}"`).join(' ');
  }

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
};

export default Grid;
