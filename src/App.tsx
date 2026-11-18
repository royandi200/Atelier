import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Process from './sections/Process';
import Gallery from './sections/Gallery';
import Materials from './sections/Materials';
import Showroom from './sections/Showroom';
import Services from './sections/Services';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import WhatsAppButton from './sections/WhatsAppButton';
import { translations, type Language } from './translations';
import { Preloader, Cursor, ScrollProgress, Marquee, useSmoothScroll, useReveals } from './fx/Effects';

const MARQUEE: Record<Language, string[]> = {
  es: ['Barras', 'Booths', 'Lounges', 'Tapicería', 'Cavas', 'Hecho a mano'],
  en: ['Bars', 'Booths', 'Lounges', 'Upholstery', 'Wine cellars', 'Handmade'],
};

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const mainRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang];
  useSmoothScroll();
  useReveals([currentLang]);

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
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Navigation
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        t={t}
      />
      <main>
        <Hero t={t.hero} />
        <About t={t.about} />
        <Process t={t.process} />
        <Marquee key={currentLang} words={MARQUEE[currentLang]} />
        <Gallery t={t.gallery} />
        <Showroom t={t.showroom} />
        <Materials t={t.materials} />
        <Services t={t.services} />
        <Contact t={t.contact} />
      </main>
      <Footer t={t.footer} currentLang={currentLang} />
      <WhatsAppButton />
      <div className="fx-vignette" aria-hidden="true" />
      <div className="fx-grain" aria-hidden="true" />
    </div>
  );
}

export default App;
