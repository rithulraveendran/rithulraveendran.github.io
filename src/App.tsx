import { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { ThemeToggle } from '@/components/common/ThemeToggle/ThemeToggle';
import { Hero } from '@/components/sections/01_Hero/Hero';
import { About } from '@/components/sections/02_About/About';
import { Experience } from '@/components/sections/03_Experience/Experience';
import { Projects } from '@/components/sections/04_Projects/Projects';
import { OpenSource } from '@/components/sections/05_OpenSource/OpenSource';
import { GitHub } from '@/components/sections/06_GitHub/GitHub';
import { Competitive } from '@/components/sections/07_Competitive/Competitive';
import { Certifications } from '@/components/sections/08_Certifications/Certifications';
import { DigitalBadges } from '@/components/sections/09_DigitalBadges/DigitalBadges';
import { Skills } from '@/components/sections/10_Skills/Skills';
import { Footer } from '@/components/sections/11_Footer/Footer';

export function App() {
  // Wire global smooth scrolling lifecycle
  useLenis();

  // Strip #top anchor from URL bar if navigated to
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#top') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <>
      <ThemeToggle />
      <main id="main-content">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <OpenSource />
      <GitHub />
      <Competitive />
      <Certifications />
      <DigitalBadges />
      <Skills />
      <Footer />
    </main>
  </>
  );
}

export default App;
