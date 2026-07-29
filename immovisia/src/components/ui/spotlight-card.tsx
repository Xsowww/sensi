import React, { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface GlowCardProps {
  children?: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'brand';
  /** `dark` is the original treatment. `light` retunes the glow for pale grounds. */
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  // Narrow spread pins the hue near the brand orange instead of letting it
  // drift across the spectrum, so one accent holds across the whole page.
  brand: { base: 27, spread: 26 }
};

/* The original tuning assumes a dark ground: a grey backdrop, a white inner
   ring and a black drop shadow. On this page's sky blue none of that reads, so
   the light variant swaps the backdrop for a near-white tint, drops the white
   ring, and uses the palette's own sky-tinted shadow. */
const variantMap = {
  dark: {
    tokens: {
      '--backdrop': 'hsl(0 0% 60% / 0.12)',
      '--bg-spot-opacity': '0.1',
      '--border-light-opacity': '1',
      '--border-brightness': '2',
      // No --lightness here on purpose: the fallbacks differ per layer
      // (70 for the backdrop spot, 50 for the border) and setting it would
      // change the original dark rendering.
      '--outer': '1'
    },
    shadow: 'shadow-[0_1rem_2rem_-1rem_black]'
  },
  light: {
    tokens: {
      '--backdrop': 'hsl(205 60% 99% / 0.82)',
      '--bg-spot-opacity': '0.11',
      '--border-light-opacity': '0',
      '--border-brightness': '1',
      // Darker than the dark variant's 70: the spot has to sit against white.
      '--lightness': '46',
      '--outer': '0.7'
    },
    shadow: 'shadow-[0_18px_40px_-24px_rgba(23,66,102,0.35)]'
  }
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GLOW_STYLE_ID = 'glow-card-styles';

const glowStyles = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    /* Reveal the border ring only. The upstream rule intersected a fully
       transparent layer with an opaque one, which masks to transparent
       everywhere, so this pseudo-element never painted. Two opaque layers
       clipped to padding-box and border-box, subtracted, give the ring. */
    -webkit-mask: linear-gradient(#000, #000) padding-box, linear-gradient(#000, #000) border-box;
    mask: linear-gradient(#000, #000) padding-box, linear-gradient(#000, #000) border-box;
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    /* Blowing the highlight out only reads on a dark ground; on a pale one it
       washes the accent to white, so the light variant turns it down. */
    filter: brightness(var(--border-brightness, 2));
  }

  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }

  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }

  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

/* The stylesheet and the pointer listener are global, so they are shared across
   every mounted card instead of duplicated per instance. Rendering N cards used
   to inject N identical <style> tags and attach N pointermove listeners. */
const mountedCards = new Set<HTMLDivElement>();
let styleTag: HTMLStyleElement | null = null;

let frame = 0;
let pointer = { x: 0, y: 0 };

/* `--x`/`--y` are element-local. The upstream version fed viewport coordinates
   into a `background-attachment: fixed` layer, but Chromium sizes that layer
   against the element while positioning it against the viewport, so the
   spotlight landed far from the cursor. Local coordinates with the default
   attachment put it exactly under the pointer, and drop the fixed-attachment
   repaint cost that janks on iOS.
   `--xp`/`--yp` stay viewport-relative: they drive the hue shift across the
   screen, which is meant to be global. */
const applyPointer = () => {
  frame = 0;
  mountedCards.forEach((el) => {
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', (pointer.x - rect.left).toFixed(1));
    el.style.setProperty('--y', (pointer.y - rect.top).toFixed(1));
  });
};

const syncPointer = (e: PointerEvent) => {
  pointer = { x: e.clientX, y: e.clientY };

  const xp = (e.clientX / window.innerWidth).toFixed(2);
  const yp = (e.clientY / window.innerHeight).toFixed(2);
  mountedCards.forEach((el) => {
    el.style.setProperty('--xp', xp);
    el.style.setProperty('--yp', yp);
  });

  // Rect reads are batched into one frame so a fast pointer cannot force a
  // layout flush per event.
  if (!frame) frame = requestAnimationFrame(applyPointer);
};

const registerCard = (el: HTMLDivElement) => {
  if (mountedCards.size === 0) {
    styleTag = document.getElementById(GLOW_STYLE_ID) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = GLOW_STYLE_ID;
      styleTag.textContent = glowStyles;
      document.head.appendChild(styleTag);
    }
    document.addEventListener('pointermove', syncPointer);
  }
  mountedCards.add(el);

  return () => {
    mountedCards.delete(el);
    if (mountedCards.size === 0) {
      document.removeEventListener('pointermove', syncPointer);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      styleTag?.remove();
      styleTag = null;
    }
  };
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  variant = 'dark',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    return registerCard(el);
  }, []);

  const { base, spread } = glowColorMap[glowColor];
  const { tokens: variantTokens, shadow } = variantMap[variant];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = (): CSSProperties => {
    // Indexed signature so the CSS custom properties and the optional
    // width/height assignments below both typecheck.
    const baseStyles: CSSProperties & Record<string, string | number> = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '3',
      ...variantTokens,
      '--backup-border': 'var(--backdrop)',
      '--size': '200',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      touchAction: 'none',
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <div
      ref={cardRef}
      data-glow
      style={getInlineStyles()}
      className={`
        ${getSizeClasses()}
        ${!customSize ? 'aspect-[3/4]' : ''}
        rounded-2xl
        relative
        grid
        grid-rows-[1fr_auto]
        ${shadow}
        p-4
        gap-4
        backdrop-blur-[5px]
        ${className}
      `}
    >
      <div data-glow></div>
      {children}
    </div>
  );
};

export { GlowCard }
