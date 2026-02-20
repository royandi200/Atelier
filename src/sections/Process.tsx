import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PenTool, Hammer, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProcessProps {
  t: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    steps: {
      number: string;
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    }[];
  };
}

const Process = ({ t }: ProcessProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const icons = [Search, PenTool, Hammer, CheckCircle];
  const colors = [
    'from-purple-500/20 to-blue-500/20',
    'from-gold/20 to-orange-500/20',
    'from-emerald-500/20 to-teal-500/20',
    'from-rose-500/20 to-pink-500/20',
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.process-title',
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

      // Steps animation
      gsap.fromTo(
        '.process-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-dark section-reveal overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C9A962 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-20 right-20 w-40 h-40 rounded-full border border-gold/10" />
      <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-gold/5" />

      <div className="relative w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="process-title text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          {/* Badge - CURVED */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-xs tracking-widest uppercase">{t.badge}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-6">
            {t.title}
            <span className="text-gradient-gold"> {t.titleHighlight}</span>
          </h2>
          <p className="text-cream/60 text-lg">{t.description}</p>
        </div>

        {/* Process Steps - CURVED */}
        <div className="process-steps grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {t.steps.map((step, index) => {
              const Icon = icons[index];
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  className={`process-step w-full text-left p-6 lg:p-8 rounded-3xl border-2 transition-all duration-500 group ${
                    activeStep === index
                      ? 'border-gold bg-gradient-to-r ' + colors[index]
                      : 'border-cream/10 hover:border-gold/30 bg-dark-light/50'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    {/* Number - CURVED */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      activeStep === index ? 'bg-gold' : 'bg-cream/10'
                    }`}>
                      <span
                        className={`font-logo text-xl tracking-wider transition-colors duration-300 ${
                          activeStep === index ? 'text-dark' : 'text-cream/50'
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          size={18}
                          className={`transition-colors duration-300 ${
                            activeStep === index ? 'text-gold' : 'text-cream/40'
                          }`}
                        />
                        <span
                          className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                            activeStep === index ? 'text-gold' : 'text-cream/40'
                          }`}
                        >
                          {step.subtitle}
                        </span>
                      </div>
                      <h3
                        className={`font-serif text-2xl lg:text-3xl transition-colors duration-300 ${
                          activeStep === index ? 'text-cream' : 'text-cream/60'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Indicator - CURVED */}
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeStep === index
                          ? 'bg-gold scale-125'
                          : 'bg-cream/20 group-hover:bg-gold/50'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details - CURVED */}
          <div className="relative">
            <div className="sticky top-32 p-8 lg:p-12 rounded-3xl border border-gold/20 bg-gradient-to-br from-dark-light/50 to-dark/50">
              {/* Decorative corner curves */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gold/20" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full border border-gold/30" />

              <div className="relative">
                {/* Badge - CURVED */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 mb-6">
                  <span className="text-gold text-xs tracking-widest uppercase">
                    {t.steps[activeStep].number}
                  </span>
                </div>
                
                <h3 className="font-serif text-3xl lg:text-4xl text-cream mb-6">
                  {t.steps[activeStep].title}
                </h3>
                <p className="text-cream/70 text-lg leading-relaxed mb-8">
                  {t.steps[activeStep].description}
                </p>

                {/* CTA Button - CURVED */}
                <button
                  onClick={() => {
                    if (activeStep < t.steps.length - 1) {
                      setActiveStep(activeStep + 1);
                    } else {
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-3 rounded-full bg-gold/20 border border-gold/50 text-gold text-sm tracking-wide hover:bg-gold hover:text-dark transition-all duration-500"
                >
                  {t.steps[activeStep].cta}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator - CURVED */}
        <div className="flex justify-center gap-3 mt-16">
          {t.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                activeStep === index
                  ? 'w-12 bg-gold'
                  : 'w-4 bg-cream/20 hover:bg-gold/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
