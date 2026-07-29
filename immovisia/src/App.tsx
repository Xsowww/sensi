import { IconSprite } from '@/components/IconSprite';
import { Nav } from '@/components/sections/Nav';
import { Intro } from '@/components/sections/Intro';
import { Hero } from '@/components/sections/Hero';
import { Statement } from '@/components/sections/Statement';
import { Listings } from '@/components/sections/Listings';
import { Services } from '@/components/sections/Services';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default function App() {
  return (
    <>
      <IconSprite />

      <a className="skip-link" href="#main">
        Aller au contenu
      </a>

      <Nav />

      <main id="main">
        <Intro />
        <Hero />
        <Statement />
        <Listings />
        <Services />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
