import React from 'react';

type StickyNoteVariant = 'blue' | 'red' | 'green' | 'yellow' | 'purple';
type StickyNoteSize = 'sm' | 'md' | 'lg';

export interface StickyNoteProps {
  variant?: StickyNoteVariant;
  size?: StickyNoteSize;
  lines?: 1 | 2 | 3;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

const VARIANT_BG: Record<StickyNoteVariant, string> = {
  blue: 'var(--sticky-blue, #CFE3FF)',
  red: 'var(--sticky-red, #FFCFCF)',
  green: 'var(--sticky-green, #CFF7D3)',
  yellow: 'var(--sticky-yellow, #FFF3B0)',
  purple: 'var(--sticky-purple, #E0D4FF)'
};

const SIZE_DIMENSIONS: Record<StickyNoteSize, { width: number; height: number }> = {
  sm: { width: 120, height: 96 },
  md: { width: 148, height: 116 },
  lg: { width: 176, height: 132 }
};

export const StickyNote: React.FC<StickyNoteProps> = ({
  variant = 'blue',
  size = 'md',
  lines = 2,
  width: overrideWidth,
  height: overrideHeight,
  style
}) => {
  const { width, height } = SIZE_DIMENSIONS[size];
  const finalWidth = overrideWidth ?? width;
  const finalHeight = overrideHeight ?? height;
  const lineCount = Math.max(1, Math.min(3, lines));

  return (
    <div
      aria-hidden
      style={{
        width: finalWidth,
        height: finalHeight,
        backgroundColor: VARIANT_BG[variant],
        borderRadius: '12px',
        border: '1px solid var(--stroke-stroke)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px',
        gap: '8px',
        ...style
      }}
    >
      {Array.from({ length: lineCount }).map((_, idx) => (
        <div
          key={idx}
          style={{
            width: idx === 0 ? '80%' : idx === 1 ? '70%' : '60%',
            height: 8,
            borderRadius: 4,
            backgroundColor: 'var(--text-primary)',
            opacity: 0.25
          }}
        />
      ))}
    </div>
  );
};

export default StickyNote;


