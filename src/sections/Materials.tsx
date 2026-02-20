import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MaterialsProps {
  t: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    featuredLabel: string;
    featuredTitle: string;
    varieties: string;
    stats: { number: string; label: string }[];
  };
}

const materials = [
  {
    name: 'Mármol',
    nameEn: 'Marble',
    varieties: ['Carrara', 'Calacatta', 'Negro Marquina'],
    description: 'Piedra natural de origen italiano, cada losa es única con vetas que cuentan una historia de millones de años.',
    color: 'from-gray-400/20 to-white/10',
  },
  {
    name: 'Maderas Nobles',
    nameEn: 'Noble Woods',
    varieties: ['Nogal Americano', 'Caoba', 'Teca'],
    description: 'Maderas de origen sostenible, seleccionadas por su grano, durabilidad y carácter único.',
    color: 'from-amber-700/20 to-yellow-600/10',
  },
  {
    name: 'Metales',
    nameEn: 'Metals',
    varieties: ['Latón', 'Bronce', 'Cobre'],
    description: 'Acabados en metales que desarrollan una pátina natural con el tiempo, añadiendo carácter y sofisticación.',
    color: 'from-yellow-500/20 to-orange-400/10',
  },
];

const Materials = ({ t }: MaterialsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.materials-title',
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
        '.material-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.materials-grid',
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-dark section-reveal overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full border border-gold/10" />
      <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-gold/5" />

      <div className="relative w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="materials-title text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-xs tracking-widest uppercase">{t.badge}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-6">
            {t.title}
            <span className="text-gradient-gold"> {t.titleHighlight}</span>
          </h2>
          <p className="text-cream/60 text-lg">{t.description}</p>
        </div>

        {/* Featured Image - CURVED */}
        <div className="mb-16 lg:mb-24">
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
            <img
              src="/images/materials.jpg"
              alt="Premium Materials"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 px-6 py-4 rounded-2xl bg-dark/80 backdrop-blur-sm border border-gold/30">
              <p className="text-gold text-xs tracking-widest uppercase mb-1">{t.featuredLabel}</p>
              <p className="font-serif text-2xl text-cream">{t.featuredTitle}</p>
            </div>
          </div>
        </div>

        {/* Materials Grid - CURVED CARDS */}
        <div className="materials-grid grid md:grid-cols-3 gap-8">
          {materials.map((material, index) => (
            <div
              key={index}
              className={`material-card group relative p-8 lg:p-10 rounded-3xl border border-cream/10 hover:border-gold/30 bg-gradient-to-br ${material.color} transition-all duration-500 hover-lift`}
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                <span className="font-logo text-lg text-dark tracking-wider">0{index + 1}</span>
              </div>

              <h3 className="font-serif text-2xl lg:text-3xl text-cream mb-4 group-hover:text-gold transition-colors duration-300">
                {material.name}
              </h3>

              <div className="mb-6">
                <p className="text-cream/40 text-xs tracking-widest uppercase mb-3">
                  {t.varieties}
                </p>
                <div className="flex flex-wrap gap-2">
                  {material.varieties.map((variety, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-cream/10 text-cream/70 text-sm"
                    >
                      {variety}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-cream/60 text-sm leading-relaxed">
                {material.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info - CURVED */}
        <div className="mt-16 lg:mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {t.stats.map((stat, index) => (
            <div key={index} className="p-6 rounded-2xl bg-dark-light/30 border border-cream/5">
              <p className="font-logo text-4xl lg:text-5xl text-gold mb-2 tracking-wider">{stat.number}</p>
              <p className="text-cream/60 text-sm tracking-wider uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Materials;
