import { Link } from 'react-router-dom';
import { Icon } from '@/components/IconSprite';
import { SectionLink } from '@/components/SectionLink';

const sections = [
  { section: 'biens', label: 'Nos biens' },
  { section: 'services', label: 'Services' },
  { section: 'contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__inner">
        <Link className="brand brand--foot" to="/" aria-label="Immo’visia, accueil">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="house-line" />
          </span>
          <span className="brand__name">Immo’visia</span>
        </Link>
        <nav className="foot__links" aria-label="Liens de bas de page">
          {sections.map((link) => (
            <SectionLink key={link.section} section={link.section}>
              {link.label}
            </SectionLink>
          ))}
          <a href="#">Mentions légales</a>
        </nav>
        <p className="foot__legal">
          © {new Date().getFullYear()} Immo’visia, agence immobilière à Pau.
          Maquette de démonstration, biens et coordonnées fictifs.
        </p>
      </div>
    </footer>
  );
}
