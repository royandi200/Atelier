import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import type { Language } from '../translations';

interface NavigationProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  t: {
    nav: {
      about: string;
      process: string;
      gallery: string;
      materials: string;
      services: string;
      contact: string;
      cta: string;
    };
  };
}

const Navigation = ({ currentLang, onLanguageChange, t }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.materials, href: '#materials' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-luxury ${
          isScrolled
            ? 'bg-dark/90 backdrop-blur-xl py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between">
            {/* Logo - MODERN & LUXURIOUS */}
            <a href="#" className="flex items-center">
              <img
                src="/src/assets/luxury-logo.png"
                alt="Atelier Luxury Logo"
                className="h-16 md:h-[70px] w-auto hover:opacity-80 transition-opacity duration-500"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm tracking-wide text-cream/70 hover:text-gold transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold rounded-full transition-all duration-500 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Right Section: Language + CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Selector */}
              <LanguageSelector
                currentLang={currentLang}
                onLanguageChange={onLanguageChange}
              />

              {/* CTA Button - CURVED */}
              <button
                onClick={() => scrollToSection('#contact')}
                className="px-8 py-3 rounded-full border border-gold/50 text-gold text-sm tracking-wide hover:bg-gold hover:text-dark transition-all duration-500"
              >
                {t.nav.cta}
              </button>
            </div>

            {/* Mobile Menu Button - CURVED */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-cream p-3 rounded-full bg-cream/10 hover:bg-gold/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - CURVED */}
      <div
        className={`fixed inset-0 z-40 bg-dark/98 backdrop-blur-xl transition-all duration-700 ease-luxury lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {/* Language Selector Mobile */}
          <div className="mb-4">
            <LanguageSelector
              currentLang={currentLang}
              onLanguageChange={(lang) => {
                onLanguageChange(lang);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>

          {navLinks.map((link, index) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-serif text-cream/80 hover:text-gold transition-colors duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('#contact')}
            className="mt-8 px-10 py-4 rounded-full border border-gold text-gold text-sm tracking-wide hover:bg-gold hover:text-dark transition-all duration-500"
          >
            {t.nav.cta}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
