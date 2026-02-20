import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Wrench, Truck, Palette, Ruler, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  t: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    cta: string;
    ctaButton: string;
    items: {
      title: string;
      description: string;
      features: string[];
    }[];
  };
}

const icons = [Compass, Palette, Wrench, Truck, Ruler, Sparkles];
const colors = [
  'from-blue-500/10 to-purple-500/10',
  'from-gold/10 to-orange-500/10',
  'from-emerald-500/10 to-teal-500/10',
  'from-rose-500/10 to-pink-500/10',
  'from-cyan-500/10 to-blue-500/10',
  'from-violet-500/10 to-purple-500/10',
];

const Services = ({ t }: ServicesProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-dark section-reveal"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent" />
      <div className="absolute top-40 left-10 w-20 h-20 rounded-full border border-gold/10" />
      <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-gold/5" />

      <div className="relative w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="services-title text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-xs tracking-widest uppercase">{t.badge}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-6">
            {t.title}
            <span className="text-gradient-gold"> {t.titleHighlight}</span>
          </h2>
          <p className="text-cream/60 text-lg">{t.description}</p>
        </div>

        {/* Services Grid - CURVED CARDS */}
        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {t.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className={`service-card group relative p-8 lg:p-10 rounded-3xl border border-cream/10 hover:border-gold/30 bg-gradient-to-br ${colors[index]} transition-all duration-500 hover-lift`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-500">
                  <Icon size={26} className="text-gold" />
                </div>

                <h3 className="font-serif text-2xl text-cream mb-4 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-cream/60 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-cream/5 text-cream/50 text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-cream/5 flex items-center justify-center">
                  <span className="font-logo text-sm text-cream/20 group-hover:text-gold/40 transition-colors tracking-wider">
                    0{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA - CURVED */}
        <div className="mt-16 lg:mt-24 text-center">
          <p className="text-cream/60 mb-6">{t.cta}</p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 rounded-full bg-gold text-dark text-sm tracking-wide font-medium hover:bg-gold-light transition-all duration-500 hover:shadow-gold-lg hover:scale-105"
          >
            {t.ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
