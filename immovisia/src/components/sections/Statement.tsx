import { useReveal } from '@/hooks/useReveal';

export function Statement() {
  const title = useReveal<HTMLHeadingElement>();
  const body = useReveal<HTMLParagraphElement>();

  return (
    <section className="statement" id="agence" aria-labelledby="statement-title">
      <div className="wrap statement__inner">
        <h2
          className={`statement__title ${title.className}`}
          id="statement-title"
          ref={title.ref}
        >
          Nous ne vendons que
          <br />
          ce que nous connaissons.
        </h2>
        <p
          className={`statement__body ${body.className}`}
          ref={body.ref}
          style={{ '--i': 1 } as React.CSSProperties}
        >
          Immo’visia couvre Pau et sa couronne depuis 2011. Chaque estimation
          s’appuie sur les ventes réellement signées dans le quartier, pas sur une
          moyenne départementale.
        </p>
      </div>
    </section>
  );
}
