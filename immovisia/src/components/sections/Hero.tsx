import { Icon } from '@/components/IconSprite';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">
            Immo’visia
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          <p className="hero__lede">
            Agence immobilière à Pau. Achat, vente et location de maisons et
            d’appartements dans le Béarn et les vallées.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              Estimer mon bien
            </a>
            <a className="btn btn--ghost" href="#biens">
              Voir les biens
              <Icon name="arrow-right" />
            </a>
          </div>
        </div>

        <figure className="hero__media">
          {/* TODO: replace with real agency photography, 1000x1250 */}
          <img
            src="https://picsum.photos/seed/immovisia-maison-pau-hero/1000/1250"
            width={1000}
            height={1250}
            fetchPriority="high"
            decoding="async"
            alt="Maison contemporaine à Pau, façade vitrée ouverte sur le jardin"
          />
        </figure>
      </div>
    </section>
  );
}
