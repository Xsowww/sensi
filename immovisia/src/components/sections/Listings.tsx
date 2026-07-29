import { listings, type Listing } from '@/data/listings';
import { useReveal } from '@/hooks/useReveal';

function ListingCard({ listing, index }: { listing: Listing; index: number }) {
  const reveal = useReveal<HTMLElement>();
  const isRow = listing.span === 12;

  return (
    <article
      className={`card card--w${listing.span} ${reveal.className}`}
      ref={reveal.ref}
      style={{ '--i': index % 2 } as React.CSSProperties}
    >
      <a className={`card__link${isRow ? ' card__link--row' : ''}`} href="#contact">
        <figure className={`card__media card__media--${listing.media}`}>
          <img
            src={listing.photo.src}
            width={listing.photo.width}
            height={listing.photo.height}
            loading="lazy"
            decoding="async"
            alt={listing.photo.alt}
          />
        </figure>
        <div className={`card__body${isRow ? ' card__body--row' : ''}`}>
          <p className="card__kind">{listing.kind}</p>
          <h3 className="card__title">{listing.title}</h3>
          <p className="card__place">{listing.place}</p>
          <ul className="card__specs">
            {listing.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <p className="card__price">{listing.price}</p>
        </div>
      </a>
    </article>
  );
}

export function Listings() {
  const head = useReveal<HTMLElement>();

  return (
    <section className="listings" id="biens" aria-labelledby="listings-title">
      <div className="wrap">
        <header className={`section-head ${head.className}`} ref={head.ref}>
          <h2 className="section-title" id="listings-title">
            Nos biens à la vente
          </h2>
          <p className="section-sub">
            Une sélection actuelle sur Pau, Jurançon et les communes limitrophes.
          </p>
        </header>

        <div className="bento">
          {listings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
