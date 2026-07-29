import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Adds `is-in` once the element scrolls into view, then stops observing.
 *
 * The visible/hidden state is deliberately kept out of React state: the markup
 * must be byte-identical on the server and on the first client render, or
 * hydration mismatches. Hiding is done by CSS (`.js .reveal`), and this hook
 * only ever adds the class, so prerendered HTML stays readable without JS.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('is-in');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: 'reveal' };
}

/** True once the page has scrolled past the very top. No scroll listener. */
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    Object.assign(sentinel.style, {
      position: 'absolute',
      top: '0',
      height: '1px',
      width: '1px',
    });
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      (entries) => setScrolled(!entries[0].isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return scrolled;
}
