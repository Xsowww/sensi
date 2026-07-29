import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/IconSprite';
import { LocationMap } from '@/components/ui/expanded-map';
import {
  listingsByDeal,
  mainPhotoUrl,
  type Deal,
  type Listing,
} from '@/data/listings';
import { useReveal } from '@/hooks/useReveal';

const TABS: { deal: Deal; label: string }[] = [
  { deal: 'vente', label: 'Acheter' },
  { deal: 'location', label: 'Louer' },
];

function ListingRow({ listing, index }: { listing: Listing; index: number }) {
  const reveal = useReveal<HTMLElement>();

  return (
    <article
      className={`row ${reveal.className}`}
      ref={reveal.ref}
      style={{ '--i': index % 3 } as React.CSSProperties}
    >
      <figure className="row__media">
        <img
          src={mainPhotoUrl(listing.photo.seed)}
          width={960}
          height={720}
          loading="lazy"
          decoding="async"
          alt={listing.photo.alt}
        />
      </figure>

      <div className="row__body">
        <p className="row__kind">
          {listing.kind}
          <span className="row__place">{listing.place}</span>
        </p>

        <h3 className="row__title">
          {/* The whole title is the link, so the accessible name of the CTA and
              the heading agree, and there is no nested interactive content. */}
          <Link to={`/bien/${listing.id}`}>{listing.title}</Link>
        </h3>

        <p className="row__summary">{listing.summary}</p>

        <ul className="row__features">
          {listing.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <div className="row__foot">
          <p className="row__price">{listing.price}</p>
          <Link className="btn btn--primary" to={`/bien/${listing.id}`}>
            Voir le bien
            <Icon name="arrow-right" />
          </Link>
        </div>
      </div>

      <div className="row__map">
        <LocationMap
          location={listing.place}
          latitude={listing.coords.lat}
          longitude={listing.coords.lng}
          zoom={15}
          mapHeight={200}
          defaultExpanded
        />
      </div>
    </article>
  );
}

export function Listings() {
  const head = useReveal<HTMLElement>();
  const [deal, setDeal] = useState<Deal>('vente');
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = listingsByDeal(deal);

  // Roving arrow keys, which is what the tabs pattern expects.
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + TABS.length) % TABS.length;
    setDeal(TABS[next].deal);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="listings" id="biens" aria-labelledby="listings-title">
      <div className="wrap">
        <header className={`section-head ${head.className}`} ref={head.ref}>
          <h2 className="section-title" id="listings-title">
            Nos biens
          </h2>
          <p className="section-sub">
            À la vente et à la location sur Pau, Jurançon, Gan et les communes
            limitrophes.
          </p>
        </header>

        <div className="tabs" role="tablist" aria-label="Type de transaction">
          {TABS.map((tab, i) => (
            <button
              key={tab.deal}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${tab.deal}`}
              aria-selected={deal === tab.deal}
              aria-controls={`${tabsId}-panel`}
              tabIndex={deal === tab.deal ? 0 : -1}
              className={`tabs__tab${deal === tab.deal ? ' is-active' : ''}`}
              onClick={() => setDeal(tab.deal)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {tab.label}
              <span className="tabs__count">{listingsByDeal(tab.deal).length}</span>
            </button>
          ))}
        </div>

        <div
          className="rows"
          id={`${tabsId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-${deal}`}
          tabIndex={-1}
        >
          {shown.map((listing, i) => (
            // Keyed by id so switching tabs remounts rather than reusing a row.
            <ListingRow key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
