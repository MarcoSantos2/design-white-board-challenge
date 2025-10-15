import React from 'react';

export interface PhoneMockProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const PhoneMock: React.FC<PhoneMockProps> = ({ width = 220, height = 420, style }) => {
  return (
    <div
      aria-hidden
      style={{
        width,
        height,
        borderRadius: 24,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.08))',
        border: '1px solid var(--stroke-stroke)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        gap: 12,
        ...style
      }}
    >
      <div style={{ height: 8, width: 64, alignSelf: 'center', borderRadius: 4, backgroundColor: 'var(--surface-secondary)' }} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ borderRadius: 12, backgroundColor: 'var(--surface-primary)', border: '1px solid var(--stroke-stroke)' }} />
        ))}
      </div>
      <div style={{ height: 10 }} />
    </div>
  );
};

export default PhoneMock;


