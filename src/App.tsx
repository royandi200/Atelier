import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Process from './sections/Process';
import Gallery from './sections/Gallery';
import Materials from './sections/Materials';
import Services from './sections/Services';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import WhatsAppButton from './sections/WhatsAppButton';
import { translations, type Language } from './translations';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const mainRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang];

  useEffect(() => {
    // Smooth scroll behavior
    const sections = gsap.utils.toArray<HTMLElement>('.section-reveal');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-dark min-h-screen grain-overlay">
      <Navigation
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        t={t}
      />
      <main>
        <Hero t={t.hero} />
        <About t={t.about} />
        <Process t={t.process} />
        <Gallery t={t.gallery} />
        <Materials t={t.materials} />
        <Services t={t.services} />
        <Contact t={t.contact} />
      </main>
      <Footer t={t.footer} currentLang={currentLang} />
      <WhatsAppButton />
    </div>
  );
}

export default App;
