import { Instagram, Linkedin, Facebook, ArrowUp } from 'lucide-react';
import type { Language } from '../translations';

interface FooterProps {
  t: {
    description: string;
    navigation: string;
    services: string;
    contact: string;
    legal: {
      privacy: string;
      terms: string;
    };
    copyright: string;
  };
  currentLang: Language;
}

const Footer = ({ t, currentLang }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegacion: [
      { label: currentLang === 'es' ? 'Nosotros' : 'About', href: '#about' },
      { label: currentLang === 'es' ? 'Proceso' : 'Process', href: '#process' },
      { label: currentLang === 'es' ? 'Proyectos' : 'Projects', href: '#gallery' },
      { label: currentLang === 'es' ? 'Servicios' : 'Services', href: '#services' },
      { label: currentLang === 'es' ? 'Contacto' : 'Contact', href: '#contact' },
    ],
    servicios: [
      { label: currentLang === 'es' ? 'Diseño Arquitectónico' : 'Architectural Design', href: '#services' },
      { label: currentLang === 'es' ? 'Mobiliario Custom' : 'Custom Furniture', href: '#services' },
      { label: currentLang === 'es' ? 'Fabricación' : 'Fabrication', href: '#services' },
      { label: currentLang === 'es' ? 'Instalación' : 'Installation', href: '#services' },
      { label: currentLang === 'es' ? 'Mantenimiento' : 'Maintenance', href: '#services' },
    ],
    legal: [
      { label: t.legal.privacy, href: '#' },
      { label: t.legal.terms, href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="relative bg-dark border-t border-cream/10">
      {/* Main Footer */}
      <div className="w-full px-6 lg:px-12 xl:px-20 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="font-logo text-3xl text-cream tracking-[0.3em]">
              ATELIER
            </a>
            <p className="text-cream/50 text-sm mt-4 leading-relaxed">
              {t.description}
            </p>
            
            {/* Social Links - CURVED */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-gold text-xs tracking-widest uppercase mb-6">
              {t.navigation}
            </h4>
            <ul className="space-y-3">
              {footerLinks.navegacion.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-cream/60 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold text-xs tracking-widest uppercase mb-6">
              {t.services}
            </h4>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-cream/60 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold text-xs tracking-widest uppercase mb-6">
              {t.contact}
            </h4>
            <div className="space-y-4 text-cream/60 text-sm">
              <p>Design District</p>
              <p>Miami, FL 33137</p>
              <p className="pt-2">+1 (305) 555-0147</p>
              <p>{currentLang === 'es' ? 'hola@atelier.miami' : 'hello@atelier.miami'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="w-full px-6 lg:px-12 xl:px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/40 text-xs">
              {currentYear} {t.copyright}
            </p>
            
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-cream/40 text-xs hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Back to Top - CURVED */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300"
              aria-label="Volver arriba"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Large Background Text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <p className="font-logo text-[20vw] text-cream/[0.02] leading-none text-center whitespace-nowrap tracking-[0.3em]">
          ATELIER
        </p>
      </div>
    </footer>
  );
};

export default Footer;
