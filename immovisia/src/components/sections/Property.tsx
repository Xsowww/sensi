import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '@/components/IconSprite';
import { LocationMap } from '@/components/ui/expanded-map';
import { findListing, heroPhotoUrl, thumbPhotoUrl } from '@/data/listings';
import { SectionLink } from '@/components/SectionLink';

export function Property() {
  const { id } = useParams();
  const listing = id ? findListing(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!listing) {
    return (
      <section className="property property--missing">
        <div className="wrap">
          <h1 className="section-title">Ce bien n’est plus en ligne</h1>
          <p className="section-sub">
            Il a peut-être été vendu ou loué. Voici les biens actuellement
            disponibles.
          </p>
          <p className="hero__actions">
            <Link className="btn btn--primary" to="/">
              Retour aux biens
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <article className="property">
      <div className="wrap">
        <p className="property__back">
          <Link to="/">
            <span className="property__back-ico" aria-hidden="true">
              <Icon name="arrow-right" />
            </span>
            Tous les biens
          </Link>
        </p>

        <header className="property__head">
          <div>
            <p className="row__kind">
              {listing.kind}
              <span className="row__place">{listing.place}</span>
            </p>
            <h1 className="property__title">{listing.title}</h1>
            <p className="section-sub">{listing.summary}</p>
          </div>
          <p className="property__price">{listing.price}</p>
        </header>

        <figure className="property__hero">
          <img
            src={heroPhotoUrl(listing.photo.seed)}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            alt={listing.photo.alt}
          />
        </figure>

        {listing.gallery.length > 0 && (
          <ul className="property__gallery">
            {listing.gallery.map((shot) => (
              <li key={shot.seed}>
                <img
                  src={thumbPhotoUrl(shot.seed)}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  alt={shot.alt}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="property__grid">
          <div className="property__main">
            <h2 className="property__h2">Le bien</h2>
            {listing.description.map((para) => (
              <p key={para} className="property__para">
                {para}
              </p>
            ))}

            <h2 className="property__h2">Caractéristiques</h2>
            <ul className="row__features row__features--lg">
              {listing.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <h2 className="property__h2">Informations</h2>
            <dl className="property__facts">
              {listing.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="property__aside">
            <div className="property__card">
              <h2 className="property__h2">Situation</h2>
              <LocationMap
                location={listing.place}
                latitude={listing.coords.lat}
                longitude={listing.coords.lng}
                zoom={15}
                mapHeight={240}
                defaultExpanded
              />
              <p className="form__note property__note">
                Localisation approximative, à l’échelle du quartier.
              </p>
            </div>

            <div className="property__card">
              <h2 className="property__h2">Ce bien vous intéresse</h2>
              <p className="section-sub">
                Nous organisons les visites du mardi au samedi.
              </p>
              <SectionLink className="btn btn--primary btn--block" section="contact">
                Demander une visite
              </SectionLink>
              <p className="form__note">
                <a href="tel:+33559000000">05 59 00 00 00</a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
