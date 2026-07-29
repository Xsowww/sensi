import { useEffect, useState } from 'react';
import { Icon } from '@/components/IconSprite';
import { useScrolled } from '@/hooks/useReveal';

const links = [
  { href: '#agence', label: 'L’agence' },
  { href: '#biens', label: 'Nos biens' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const wide = window.matchMedia('(min-width: 881px)');
    const onWide = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' is-stuck' : ''}`} id="nav">
      <div className="nav__inner">
        <a className="brand" href="#main" aria-label="Immo’visia, accueil">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="house-line" />
          </span>
          <span className="brand__name">Immo’visia</span>
        </a>

        <nav
          className={`nav__links${open ? ' is-open' : ''}`}
          id="nav-links"
          aria-label="Navigation principale"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--primary nav__cta" href="#contact">
          Estimer mon bien
        </a>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'x' : 'list'} />
        </button>
      </div>
    </header>
  );
}
