import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

/* The motion from the sign-in-card block, reduced to the part worth reusing:
   a 3D tilt that follows the pointer plus light beams travelling the border.
   The sign-in form itself is not carried over, and the dark purple treatment is
   replaced by the page palette.

   Changes against the upstream code:
   - `next/link` dropped; this is Vite, not Next.js
   - imports from `motion/react` rather than `framer-motion`
   - the per-frame `setMousePosition` state is gone. It re-rendered the whole
     card on every mouse move and its value was never read
   - `whileFocus` on the wrapper divs removed: a div is not focusable, so it
     never fired
   - honours `prefers-reduced-motion`, and holds the card flat while a field
     inside has focus, since a form that tilts while you type is unusable */

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Degrees of rotation at the corners. */
  maxTilt?: number;
  /** Light beams travelling the border. Decorative, off by default. */
  beams?: boolean;
}

const SPRING = { stiffness: 150, damping: 20, mass: 0.6 };

export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  beams = true,
}: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const [holding, setHolding] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);
  const rotateX = useTransform(springY, [-300, 300], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-300, 300], [-maxTilt, maxTilt]);

  const active = !reduceMotion && !holding;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Motion values, not state: this runs on every pointer move and must not
    // re-render the subtree.
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const flatten = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const showBeams = beams && !reduceMotion;

  return (
    <div className={className} style={{ perspective: 1500 }}>
      <motion.div
        ref={ref}
        className="relative"
        style={active ? { rotateX, rotateY } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={flatten}
        // A tilting form is hard to type into, so hold it flat while a field
        // inside is focused. Capture phase catches focus on any descendant.
        onFocusCapture={() => {
          setHolding(true);
          flatten();
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setHolding(false);
          }
        }}
      >
        {showBeams && (
          <div
            className="pointer-events-none absolute -inset-px overflow-hidden rounded-[18px]"
            aria-hidden="true"
          >
            <motion.div
              className="absolute top-0 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[#b3580f] to-transparent"
              animate={{ left: ['-50%', '100%'] }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4 }}
            />
            <motion.div
              className="absolute top-0 right-0 h-1/2 w-px bg-gradient-to-b from-transparent via-[#b3580f] to-transparent"
              animate={{ top: ['-50%', '100%'] }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4, delay: 0.8 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[#b3580f] to-transparent"
              animate={{ right: ['-50%', '100%'] }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4, delay: 1.6 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-1/2 w-px bg-gradient-to-b from-transparent via-[#b3580f] to-transparent"
              animate={{ bottom: ['-50%', '100%'] }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4, delay: 2.4 }}
            />
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
}

export default TiltCard;
