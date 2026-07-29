import { useLocation } from 'react-router-dom';
import { Icon } from '@/components/IconSprite';
import { SectionLink } from '@/components/SectionLink';
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
  // Someone who clicked a nav link from a listing page is heading for a
  // section, so the opening sequence must not lock the page again.
  const location = useLocation();
  const skipCurtain = Boolean((location.state as { scrollTo?: string } | null)?.scrollTo);

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
      defaultExpanded={skipCurtain}
    >
      <div className="intro__copy">
        <span className="hero__rule" aria-hidden="true" />
        <p className="hero__lede">
          Agence immobilière à Pau. Achat, vente et location de maisons et
          d’appartements dans le Béarn et les vallées.
        </p>
        <div className="hero__actions">
          <SectionLink className="btn btn--primary" section="contact">
            Estimer mon bien
          </SectionLink>
          <SectionLink className="btn btn--ghost" section="biens">
            Voir les biens
            <Icon name="arrow-right" />
          </SectionLink>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
