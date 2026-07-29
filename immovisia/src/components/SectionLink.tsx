import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

/* With HashRouter the hash is the route, so a plain `<a href="#biens">` is read
   as a navigation to /biens and lands on the not-found panel. These links keep
   the href for semantics and for the no-JS prerender, where the browser just
   jumps to the element, but intercept the click: scroll when already on the
   home page, otherwise navigate home and scroll once it has rendered. */

interface SectionLinkProps {
  section: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function SectionLink({
  section,
  children,
  className,
  onNavigate,
}: SectionLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks fall through so "open in new tab" still works.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();

    if (location.pathname === '/') {
      document.getElementById(section)?.scrollIntoView({ block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: section } });
    }
  };

  return (
    <a href={`#${section}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

/** Consumes the scroll target left by a SectionLink that had to navigate home. */
export function useScrollToSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const target = (location.state as { scrollTo?: string } | null)?.scrollTo;

  useEffect(() => {
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({ block: 'start' });
    // Clear it so a reload or a back-navigation does not jump again.
    navigate('.', { replace: true, state: null });
  }, [target, navigate]);
}
