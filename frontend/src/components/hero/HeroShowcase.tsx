import React, { useMemo } from 'react';
import { StickyNote } from './StickyNote';
import { PhoneMock } from './PhoneMock';
import { PlayButtonIcon } from './PlayButtonIcon';
import { useInView } from './useInView';
import { useTheme } from '../../design-tokens/SimpleThemeProvider';
import heroLightSpec from '../../../figma/heroLight.json';
import heroDarkSpec from '../../../figma/heroDark.json';

type StickySpec = { variant: string; size?: 'sm'|'md'|'lg'; lines?: 1|2|3; left?: number; top?: number; x?: number; y?: number; width?: number; height?: number; z?: number };
type ArrowSpec = { icon: string; x?: number; y?: number; left?: number; top?: number; rotate?: number; size?: number; z?: number };
type LabelSpec = { text: string; x?: number; y?: number; left?: number; top?: number; width?: number; fontSize?: number; weight?: number; colorToken?: string };
type DecorSpec = { type: 'sparkles' | 'scribble'; x?: number; y?: number; left?: number; top?: number; width?: number; z?: number };
type LayoutSpec = { containerWidth: number; stickyNotes?: StickySpec[]; arrows?: ArrowSpec[]; labels?: LabelSpec[]; decor?: DecorSpec[] };

const VARIANT_MAP: Record<string, 'blue'|'red'|'green'|'yellow'|'purple'> = {
  'red': 'red',
  'blue': 'blue',
  'green': 'green',
  'yellow': 'yellow',
  'purple': 'purple',
  'art/red': 'red',
  'art/blue': 'blue',
  'art surface blue': 'blue',
  'art surface green': 'green',
  'art surface red': 'red',
  'art surface orange': 'yellow',
  'art/purple': 'purple'
};

export const HeroShowcase: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const clusterBase = {
    opacity: inView ? 1 : 0,
    transform: `translateY(${inView ? 0 : 24}px)`,
    transition: 'opacity 400ms ease, transform 400ms ease'
  } as const;

  const { mode } = useTheme();

  const spec: LayoutSpec = useMemo(() => {
    return (mode === 'dark' ? (heroDarkSpec as any) : (heroLightSpec as any)) as LayoutSpec;
  }, [mode]);

  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1032,
        margin: '0 auto',
        paddingTop: 'var(--spacing-8)',
      }}
      ref={ref}
    >
      {/* Grid wrapper: 12 cols, 3 clusters */}
      <div
        className="hero-showcase-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--spacing-4)',
          alignItems: 'center',
        }}
      >
        {/* Single canvas area for positioned items, scaled from 1440 reference */}
        <div style={{ gridColumn: '1 / span 12', position: 'relative', ...clusterBase }}>
          {/* Maintain aspect ratio 1440x780 */}
          <div style={{ position: 'relative', width: '100%', height: 0, paddingTop: `${(780 / 1440) * 100}%` }}>
          {(() => {
            const refW = (spec as any).containerWidth || 1440; // reference width
            const refH = 780;  // reference height from design
            const notes = (spec.stickyNotes || []);
            const allTops = [
              ...notes.map(n => (n.top ?? n.y ?? 0)),
              ...((spec.labels || []).map(l => (l.top ?? l.y ?? 0))),
              ...((spec.arrows || []).map(a => (a.top ?? a.y ?? 0))),
              ...((spec.decor || []).map(d => (d.top ?? d.y ?? 0)))
            ];
            const yOrigin = allTops.reduce((min, val) => Math.min(min, val), Number.POSITIVE_INFINITY);
            // LEFT GROUP WRAPPER (compute bounding box)
            const leftNotes = notes.filter(n => (n as any).group === 'left');
            const leftLabels = (spec.labels || []).filter(l => (l as any).group === 'left');
            const leftArrows = (spec.arrows || []).filter(a => (a as any).group === 'left');
            const leftDecor = (spec.decor || []).filter(d => (d as any).group === 'left');

            const itemsForBox = [
              ...leftNotes.map(n => ({ left: n.left ?? (n as any).x ?? 0, top: n.top ?? (n as any).y ?? 0, width: (n as any).width ?? 100, height: (n as any).height ?? 100 })),
              ...leftLabels.map(l => ({ left: (l as any).left ?? (l as any).x ?? 0, top: (l as any).top ?? (l as any).y ?? 0, width: (l as any).width ?? 192, height: (l as any).height ?? 36 })),
              ...leftArrows.map(a => ({ left: (a as any).left ?? (a as any).x ?? 0, top: (a as any).top ?? (a as any).y ?? 0, width: (a as any).width ?? (a as any).size ?? 56, height: (a as any).height ?? (a as any).size ?? 56 })),
              ...leftDecor.map(d => ({ left: (d as any).left ?? (d as any).x ?? 0, top: (d as any).top ?? (d as any).y ?? 0, width: (d as any).width ?? 100, height: (d as any).height ?? 100 }))
            ];

            const boxLeft = itemsForBox.reduce((m, v) => Math.min(m, v.left), Number.POSITIVE_INFINITY);
            const boxTop = itemsForBox.reduce((m, v) => Math.min(m, v.top), Number.POSITIVE_INFINITY);
            const boxRight = itemsForBox.reduce((m, v) => Math.max(m, v.left + v.width), 0);
            const boxBottom = itemsForBox.reduce((m, v) => Math.max(m, v.top + v.height), 0);
            const boxW = Math.max(1, boxRight - boxLeft);
            const boxH = Math.max(1, boxBottom - boxTop);

            const leftWrapper = (
              <div key="left-wrapper" style={{
                position: 'absolute',
                left: `calc(${boxLeft} / ${refW} * 100%)`,
                top: `calc( ${(boxTop - (Number.isFinite(yOrigin) ? yOrigin : 0))} / ${refH} * 100%)`,
                width: `calc(${boxW} / ${refW} * 100%)`,
                height: `calc(${boxH} / ${refH} * 100%)`
              }}>
                {/* Left sticky notes */}
                {leftNotes.map((n, idx) => {
                  const variant = VARIANT_MAP[n.variant] || 'blue';
                  const l = (n.left ?? (n as any).x ?? 0) - boxLeft;
                  const t = (n.top ?? (n as any).y ?? 0) - boxTop;
                  const w = (n as any).width ?? 100;
                  const h = (n as any).height ?? 100;
                  return (
                    <StickyNote
                      key={`ln-${idx}`}
                      variant={variant}
                      size={n.size as any}
                      lines={n.lines as any}
                      style={{
                        position: 'absolute',
                        left: `calc(${l} / ${boxW} * 100%)`,
                        top: `calc(${t} / ${boxH} * 100%)`,
                        width: `calc(${w} / ${boxW} * 100%)`,
                        height: `calc(${h} / ${boxH} * 100%)`,
                        zIndex: (n as any).z ?? 1
                      }}
                    />
                  );
                })}
                {/* Left label */}
                {leftLabels.map((l, idx) => {
                  const lx = ((l as any).left ?? (l as any).x ?? 0) - boxLeft;
                  const ly = ((l as any).top ?? (l as any).y ?? 0) - boxTop;
                  const w = (l as any).width ?? 192;
                  const fs = (l as any).fontSize ?? 24;
                  const fw = (l as any).weight ?? 700;
                  return (
                    <div key={`ll-${idx}`} style={{ position: 'absolute', left: `calc(${lx} / ${boxW} * 100%)`, top: `calc(${ly} / ${boxH} * 100%)`, width: `calc(${w} / ${boxW} * 100%)`, color: (l as any).colorToken || 'var(--text-primary)', fontFamily: '"Figma Hand", "Kalam", cursive', fontSize: fs, fontWeight: fw, lineHeight: '36px', whiteSpace: 'nowrap', zIndex: (l as any).z ?? 3 }}>
                      {(l as any).text}
                    </div>
                  );
                })}
                {/* Left decor */}
                {leftDecor.map((d, idx) => {
                  const dx = ((d as any).left ?? (d as any).x ?? 0) - boxLeft;
                  const dy = ((d as any).top ?? (d as any).y ?? 0) - boxTop;
                  const w = (d as any).width ?? 100;
                  const h = (d as any).height;
                  const rot = (d as any).rotate ?? 0;
                  const src = ((d as any).type) === 'scribble' ? '/icons/Scribble.svg' : '/icons/sparkles.svg';
                  return (
                    <img key={`ld-${idx}`} src={src} alt="" aria-hidden style={{ position: 'absolute', left: `calc(${dx} / ${boxW} * 100%)`, top: `calc(${dy} / ${boxH} * 100%)`, width: `calc(${w} / ${boxW} * 100%)`, height: h ? `calc(${h} / ${boxH} * 100%)` : undefined, transform: `rotate(${rot}deg)`, zIndex: (d as any).z ?? 4 }} />
                  );
                })}
                {/* Left arrows */}
                {leftArrows.map((a, idx) => {
                  const ax = ((a as any).left ?? (a as any).x ?? 0) - boxLeft;
                  const ay = ((a as any).top ?? (a as any).y ?? 0) - boxTop;
                  const w = (a as any).width ?? (a as any).size ?? 56;
                  const h = (a as any).height ?? (a as any).size;
                  const rot = (a as any).rotate ?? 0;
                  const icon = (a as any).icon;
                  const path = icon === 'arrowRightDown' ? '/icons/arrowRightDown.svg' : icon === 'arrowRightDownSkinny2' ? '/icons/arrowRightDownSkinny2.svg' : icon === 'arrowRightDownSkinny' ? '/icons/arrowRightDownSkinny.svg' : '/icons/arrowRight.svg';
                  return (
                    <img key={`la-${idx}`} src={path} alt="" aria-hidden style={{ position: 'absolute', left: `calc(${ax} / ${boxW} * 100%)`, top: `calc(${ay} / ${boxH} * 100%)`, width: `calc(${w} / ${boxW} * 100%)`, height: h ? `calc(${h} / ${boxH} * 100%)` : undefined, transform: `rotate(${rot}deg)`, zIndex: (a as any).z ?? 3 }} />
                  );
                })}
              </div>
            );
            // Arrows
            const arrowPath = (icon: string) => {
              switch (icon) {
                case 'arrowRight': return '/icons/arrowRight.svg';
                case 'arrowRightUp': return '/icons/arrowRightUp.svg';
                case 'arrowRightDown': return '/icons/arrowRightDown.svg';
                case 'arrowRightDownSkinny': return '/icons/arrowRightDownSkinny.svg';
                case 'arrowRightDownSkinny2': return '/icons/arrowRightDownSkinny2.svg';
                default: return '/icons/arrowRight.svg';
              }
            };
            const arrowEls = (spec.arrows || []).filter(a => (a as any).group !== 'left').map((a, idx) => {
              const ax = (a.left ?? a.x ?? 0);
              const ay = (a.top ?? a.y ?? 0) - (Number.isFinite(yOrigin) ? yOrigin : 0);
              const w = a.size ?? 56;
              return (
                <img key={`arr-${idx}`} src={arrowPath(a.icon)} alt="" aria-hidden
                  style={{ position: 'absolute', left: `calc(${ax} / ${refW} * 100%)`, top: `calc(${ay} / ${refH} * 100%)`, width: `calc(${w} / ${refW} * 100%)`, transform: `rotate(${a.rotate || 0}deg)`, zIndex: a.z ?? 2 }} />
              );
            });
            // Labels
            const labelEls = (spec.labels || []).filter(l => (l as any).group !== 'left').map((l, idx) => {
              const lx = (l.left ?? l.x ?? 0);
              const ly = (l.top ?? l.y ?? 0) - (Number.isFinite(yOrigin) ? yOrigin : 0);
              const w = l.width ?? 192;
              const fs = l.fontSize ?? 24;
              const fw = l.weight ?? 700;
              return (
                <div key={`lbl-${idx}`} style={{ position: 'absolute', left: `calc(${lx} / ${refW} * 100%)`, top: `calc(${ly} / ${refH} * 100%)`, width: `calc(${w} / ${refW} * 100%)`, color: l.colorToken || 'var(--text-primary)', fontFamily: '"Figma Hand", "Kalam", cursive', fontSize: fs, fontWeight: fw, fontStyle: 'italic', lineHeight: '36px', whiteSpace: 'nowrap' }}>
                  {l.text}
                </div>
              );
            });
            // Decor (sparkles, scribble)
            const decorPath = (t: string) => t === 'scribble' ? '/icons/Scribble.svg' : '/icons/sparkles.svg';
            const decorEls = (spec.decor || []).filter(d => (d as any).group !== 'left').map((d, idx) => {
              const dx = (d.left ?? d.x ?? 0);
              const dy = (d.top ?? d.y ?? 0) - (Number.isFinite(yOrigin) ? yOrigin : 0);
              const w = d.width ?? 100;
              return (
                <img key={`dec-${idx}`} src={decorPath(d.type)} alt="" aria-hidden
                  style={{ position: 'absolute', left: `calc(${dx} / ${refW} * 100%)`, top: `calc(${dy} / ${refH} * 100%)`, width: `calc(${w} / ${refW} * 100%)`, zIndex: d.z ?? 2 }} />
              );
            });
            return [leftWrapper, ...arrowEls, ...labelEls, ...decorEls];
          })()}
          <PhoneMock style={{ position: 'absolute', right: 0, top: 0 }} />
          <PlayButtonIcon style={{ position: 'absolute', left: '50%', top: '15%' }} />
          </div>
        </div>
      </div>

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 1024px) {
          .hero-showcase-grid { grid-template-columns: repeat(6, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-showcase-grid { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default HeroShowcase;


