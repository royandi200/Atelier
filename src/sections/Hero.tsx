import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroProps {
  t: {
    badge: string;
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

const Hero = ({ t }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial fade in of overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0.4, duration: 2, ease: 'power2.out' }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 80, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, delay: 0.5, ease: 'power3.out' }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 1, ease: 'power3.out' }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: 'power3.out' }
      );

      // Parallax effect on scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="hero-bg absolute inset-0 w-full h-full">
        <img
          src="/images/nightclub-bar.jpg"
          alt="Luxury Nightclub Interior"
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark"
      />

      {/* Curved Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-gold/20 animate-pulse-glow" />
      <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full border border-gold/10" />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-gold/5 blur-xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge - CURVED */}
        <div
          ref={subtitleRef}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8 opacity-0"
        >
          <Sparkles size={14} className="text-gold" />
          <span className="text-gold text-xs tracking-widest uppercase">
            {t.badge}
          </span>
        </div>

        {/* Main Title - MODERN LOGO FONT */}
        <h1
          ref={titleRef}
          className="font-logo text-6xl md:text-8xl lg:text-9xl text-cream leading-none tracking-[0.2em] mb-8 opacity-0"
        >
          <span className="block">ATELIER</span>
        </h1>

        {/* Tagline */}
        <p className="text-cream/60 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-12">
          {t.tagline}
        </p>

        {/* CTA Buttons - CURVED */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0">
          <button
            onClick={scrollToAbout}
            className="px-10 py-4 rounded-full bg-gold text-dark text-sm tracking-wide font-medium hover:bg-gold-light transition-all duration-500 hover:shadow-gold-lg hover:scale-105"
          >
            {t.ctaPrimary}
          </button>
          <button
            onClick={() => {
              const gallery = document.querySelector('#gallery');
              gallery?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 rounded-full border border-cream/30 text-cream text-sm tracking-wide hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-500"
          >
            {t.ctaSecondary}
          </button>
        </div>
      </div>

      {/* Scroll Indicator - CURVED */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-all duration-300 animate-bounce"
      >
        <ChevronDown size={20} />
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  );
};

export default Hero;
