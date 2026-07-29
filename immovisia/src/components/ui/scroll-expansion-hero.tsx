import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'motion/react';

/* Adapted from the upstream ScrollExpandMedia block. Changes required to run
   here, all noted in the README:
   - `next/image` replaced with <img>; this is a Vite app, not Next.js
   - imports from `motion/react` (current package) rather than `framer-motion`
   - native event types instead of React's synthetic ones on window listeners
   - progress kept in a ref so the listeners are attached once, not re-bound on
     every wheel tick
   - keyboard and reduced-motion escapes, because the upstream version pins the
     window at scrollY 0 and only listens for wheel/touch, which leaves keyboard
     users unable to reach the rest of the page at all */

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  bgImageAlt?: string;
  mediaAlt?: string;
  title?: string;
  /** Appended to the title, so a wordmark can be scaled past the default. */
  titleClassName?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  bgImageAlt = '',
  mediaAlt,
  title,
  titleClassName = '',
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobileState, setIsMobileState] = useState(false);

  // Mirrors of the two values the listeners need, so the effect below can bind
  // once instead of tearing down five window listeners on every scroll tick.
  const progressRef = useRef(0);
  const expandedRef = useRef(false);
  const touchStartYRef = useRef(0);

  const setProgress = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), 1);
    progressRef.current = clamped;
    setScrollProgress(clamped);

    if (clamped >= 1) {
      expandedRef.current = true;
      setShowContent(true);
    } else if (clamped < 0.75) {
      setShowContent(false);
    }
  };

  const finish = () => {
    progressRef.current = 1;
    expandedRef.current = true;
    setScrollProgress(1);
    setShowContent(true);
  };

  useEffect(() => {
    // Anyone who asked for less motion gets the page already open, never the
    // scroll lock.
    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const collapse = () => {
      progressRef.current = 0;
      expandedRef.current = false;
      setScrollProgress(0);
      setShowContent(false);
    };

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (expandedRef.current) {
        if (e.deltaY < 0 && window.scrollY <= 5) collapse();
        return;
      }
      e.preventDefault();
      setProgress(progressRef.current + e.deltaY * 0.0009);
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartYRef.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;

      if (expandedRef.current) {
        if (deltaY < -20 && window.scrollY <= 5) collapse();
        return;
      }
      e.preventDefault();
      setProgress(progressRef.current + deltaY * (deltaY < 0 ? 0.008 : 0.005));
      touchStartYRef.current = touchY;
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = 0;
    };

    // Without this the section is a keyboard trap: handleScroll pins the window
    // at 0, and nothing advances progress, so Tab/PageDown never get past it.
    const advanceKeys = new Set([
      'PageDown', 'ArrowDown', ' ', 'Spacebar', 'End', 'Enter',
    ]);
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (expandedRef.current) return;
      if (e.key === 'Tab' || advanceKeys.has(e.key)) {
        // Open immediately rather than animating: a keyboard user is trying to
        // reach the content, not to watch a transition.
        finish();
      }
    };

    // The scroll lock also swallows in-page anchors, which leaves the whole nav
    // dead until the intro has been expanded. Release it first, in capture so
    // it runs before the browser performs the jump.
    const handleAnchorClick = (e: globalThis.MouseEvent) => {
      if (expandedRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('a[href^="#"]')) finish();
    };

    const handleScroll = () => {
      if (!expandedRef.current) window.scrollTo(0, 0);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleAnchorClick, true);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt={bgImageAlt}
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="w-screen h-[100dvh] object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#10202b]/35" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0 34px 70px -34px rgba(23, 66, 102, 0.55)',
                }}
              >
                {mediaType === 'video' ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-xl"
                      controls={false}
                      disablePictureInPicture
                    />
                    <motion.div
                      className="absolute inset-0 bg-[#10202b]/30 rounded-xl"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.6 - scrollProgress * 0.4 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={mediaSrc}
                      alt={mediaAlt || title || ''}
                      width={1280}
                      height={720}
                      decoding="async"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <motion.div
                      className="absolute inset-0 bg-[#10202b]/40 rounded-xl"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.6 - scrollProgress * 0.4 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 gap-1">
                  {date && (
                    <p
                      className="text-lg md:text-2xl text-[#f2f8fd]"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-[#f2f8fd]/85 font-medium text-center"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <h2
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#f2f8fd] ${titleClassName}`}
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </h2>
                {restOfTitle && (
                  <h2
                    className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#f2f8fd] ${titleClassName}`}
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {restOfTitle}
                  </h2>
                )}
              </div>
            </div>

            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              aria-hidden={!showContent}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
