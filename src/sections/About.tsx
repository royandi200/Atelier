import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  t: {
    badge: string;
    title: string;
    titleHighlight: string;
    description1: string;
    description2: string;
    description3: string;
    quote: string;
    quoteAuthor: string;
    stats: {
      years: string;
      projects: string;
      clients: string;
    };
  };
}

const About = ({ t }: AboutProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -80, clipPath: 'circle(0% at 50% 50%)' },
        {
          opacity: 1,
          x: 0,
          clipPath: 'circle(100% at 50% 50%)',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Content stagger animation
      const contentElements = contentRef.current?.querySelectorAll('.reveal-item');
      if (contentElements) {
        gsap.fromTo(
          contentElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Award, value: '15+', label: t.stats.years },
    { icon: Users, value: '200+', label: t.stats.projects },
    { icon: Briefcase, value: '50+', label: t.stats.clients },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-dark section-reveal"
    >
      {/* Decorative Elements - CURVED */}
      <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full bg-gold/3 blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full border border-gold/10" />

      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image - CURVED */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src="/images/craftsmanship.jpg"
                alt="Master Craftsman at Work"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
            </div>
            
            {/* Floating Stats Card - CURVED */}
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-dark-light border border-gold/20 p-6 lg:p-8 rounded-3xl">
              <p className="font-logo text-4xl lg:text-5xl text-gold mb-2 tracking-wider">15+</p>
              <p className="text-cream/60 text-sm tracking-wider uppercase">{t.stats.years}</p>
            </div>

            {/* Gold accent - CURVED */}
            <div className="absolute -left-6 top-1/4 w-16 h-16 rounded-full border-2 border-gold/30" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="lg:pl-8">
            {/* Badge - CURVED */}
            <div className="reveal-item inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <span className="text-gold text-xs tracking-widest uppercase">{t.badge}</span>
            </div>
            
            <h2 className="reveal-item font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-8">
              {t.title}
              <span className="block text-gradient-gold">{t.titleHighlight}</span>
            </h2>

            <div className="reveal-item space-y-6 text-cream/70 text-base lg:text-lg leading-relaxed">
              <p>{t.description1}</p>
              <p>{t.description2}</p>
              <p>{t.description3}</p>
            </div>

            {/* Stats - CURVED */}
            <div className="reveal-item mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 rounded-2xl bg-dark-light/50 border border-cream/5">
                    <Icon size={20} className="text-gold mx-auto mb-2" />
                    <p className="font-logo text-2xl text-cream tracking-wider">{stat.value}</p>
                    <p className="text-cream/50 text-xs">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Signature */}
            <div className="reveal-item mt-10 pt-8 border-t border-gold/20">
              <p className="font-serif text-2xl text-gold italic">{t.quote}</p>
              <p className="text-cream/50 text-sm mt-2">{t.quoteAuthor}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
