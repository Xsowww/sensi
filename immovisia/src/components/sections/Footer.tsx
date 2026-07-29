import { Icon } from '@/components/IconSprite';

const links = [
  { href: '#biens', label: 'Nos biens' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
  { href: '#', label: 'Mentions légales' },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__inner">
        <a className="brand brand--foot" href="#main" aria-label="Immo’visia, accueil">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="house-line" />
          </span>
          <span className="brand__name">Immo’visia</span>
        </a>
        <nav className="foot__links" aria-label="Liens de bas de page">
          {links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="foot__legal">
          © {new Date().getFullYear()} Immo’visia, agence immobilière à Pau.
          Maquette de démonstration, biens et coordonnées fictifs.
        </p>
      </div>
    </footer>
  );
}
