import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

/* Opening sequence: the photo expands as you scroll, then the page proper
   begins underneath. Both images are placeholders. picsum returns an unrelated
   random photo per seed, so real Pau photography has to be dropped in here
   before this goes live: a view over the Boulevard des Pyrénées for the
   background, and a local property for the expanding frame. */
const BACKGROUND = 'https://picsum.photos/seed/immovisia-pau-boulevard-pyrenees/1920/1080';
const MEDIA = 'https://picsum.photos/seed/immovisia-pau-maison-bearnaise/1280/720';

export function Intro() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc={MEDIA}
      mediaAlt="Maison béarnaise en pierre, environs de Pau"
      bgImageSrc={BACKGROUND}
      bgImageAlt="Vue sur les Pyrénées depuis le boulevard, à Pau"
      title="Habiter le Béarn"
      date="Pau et ses environs"
      scrollToExpand="Faites défiler pour découvrir"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="section-title">Une agence, un territoire</h2>
        <p className="section-sub mx-auto">
          Nous couvrons Pau, Jurançon, Gan et les communes limitrophes. Vous
          trouverez plus bas les biens à la vente et ce que nous prenons en
          charge.
        </p>
        <div className="hero__actions justify-center">
          <a className="btn btn--primary" href="#biens">
            Voir les biens
          </a>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
