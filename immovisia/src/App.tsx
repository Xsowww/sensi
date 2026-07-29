import { Route, Routes } from 'react-router-dom';
import { SectionLink, useScrollToSection } from '@/components/SectionLink';
import { IconSprite } from '@/components/IconSprite';
import { Nav } from '@/components/sections/Nav';
import { Intro } from '@/components/sections/Intro';
import { Statement } from '@/components/sections/Statement';
import { Listings } from '@/components/sections/Listings';
import { Services } from '@/components/sections/Services';
import { Contact } from '@/components/sections/Contact';
import { Property } from '@/components/sections/Property';
import { Footer } from '@/components/sections/Footer';

function Home() {
  useScrollToSection();

  return (
    <>
      <Intro />
      <Statement />
      <Listings />
      <Services />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <>
      <IconSprite />

      <SectionLink className="skip-link" section="main">
        Aller au contenu
      </SectionLink>

      <Nav />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bien/:id" element={<Property />} />
          {/* Anything else falls through to the "no longer listed" panel. */}
          <Route path="*" element={<Property />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
