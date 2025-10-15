import React from 'react';

export interface PlayButtonIconProps {
  diameter?: number;
  style?: React.CSSProperties;
}

export const PlayButtonIcon: React.FC<PlayButtonIconProps> = ({ diameter = 56, style }) => {
  return (
    <div
      aria-hidden
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        backgroundColor: 'var(--button-primary, #FFE268)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        border: '1px solid var(--stroke-stroke)',
        ...style
      }}
    >
      <img src="/icons/playArrowFilled.svg" alt="" aria-hidden style={{ width: diameter * 0.42, height: diameter * 0.42 }} />
    </div>
  );
};

export default PlayButtonIcon;


