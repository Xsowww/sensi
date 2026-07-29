import { Icon } from '@/components/IconSprite';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

/* Opening sequence and brand presentation merged into one full-height moment:
   the wordmark sits over the photo, the photo expands as you scroll, then the
   positioning line and the calls to action arrive underneath.

   Both images are placeholders. picsum returns an unrelated random photo per
   seed, so real Pau photography has to be dropped in before this goes live: a
   view over the Boulevard des Pyrénées for the background, and a local property
   for the expanding frame. */
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
      title="Immo’visia"
      titleClassName="intro__wordmark"
      date="Pau et le Béarn"
      scrollToExpand="Faites défiler pour découvrir"
    >
      <div className="intro__copy">
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
    </ScrollExpandMedia>
  );
}
