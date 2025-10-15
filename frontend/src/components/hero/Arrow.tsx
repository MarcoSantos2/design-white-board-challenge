import React from 'react';

export interface ArrowProps {
  direction?: 'up' | 'right' | 'down' | 'left';
  variant?: 'solid' | 'skinny';
  rotate?: number; // degrees, applied after direction
  style?: React.CSSProperties;
}

const ICON_PATHS: Record<'solid' | 'skinny', string> = {
  solid: '/icons/arrowRight.svg',
  skinny: '/icons/arrowRightDownSkinny.svg'
};

export const Arrow: React.FC<ArrowProps> = ({
  direction = 'right',
  variant = 'solid',
  rotate = 0,
  style
}) => {
  const directionRotation = {
    right: 0,
    down: 90,
    left: 180,
    up: -90
  }[direction];

  const totalRotation = directionRotation + rotate;

  return (
    <img
      aria-hidden
      src={ICON_PATHS[variant]}
      alt=""
      style={{
        width: 56,
        height: 56,
        transform: `rotate(${totalRotation}deg)`,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
        ...style
      }}
    />
  );
};

export default Arrow;


