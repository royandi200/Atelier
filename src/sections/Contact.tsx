import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  t: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      businessType: string;
      businessTypes: {
        select: string;
        restaurant: string;
        bar: string;
        nightclub: string;
        hotel: string;
        lounge: string;
        other: string;
      };
      message: string;
      messagePlaceholder: string;
      submit: string;
      success: string;
    };
    info: {
      title: string;
      details: string[];
    }[];
  };
}

const Contact = ({ t }: ContactProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-title',
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
        '.contact-form',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        '.contact-info',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const icons = [MapPin, Phone, Mail, Clock];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-dark section-reveal"
    >
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-gold/3 blur-2xl" />
      <div className="absolute top-20 left-20 w-20 h-20 rounded-full border border-gold/10" />

      <div className="relative w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="contact-title text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-xs tracking-widest uppercase">{t.badge}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-6">
            {t.title}
            <span className="text-gradient-gold"> {t.titleHighlight}</span>
          </h2>
          <p className="text-cream/60 text-lg">{t.description}</p>
        </div>

        {/* Content */}
        <div className="contact-content grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form - CURVED */}
          <div className="contact-form p-8 lg:p-10 rounded-3xl bg-dark-light/30 border border-cream/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-cream/60 text-xs tracking-widest uppercase mb-3">
                    {t.form.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-cream/5 rounded-2xl border border-cream/10 px-5 py-4 text-cream focus:border-gold focus:outline-none transition-colors duration-300"
                    placeholder={t.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-xs tracking-widest uppercase mb-3">
                    {t.form.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-cream/5 rounded-2xl border border-cream/10 px-5 py-4 text-cream focus:border-gold focus:outline-none transition-colors duration-300"
                    placeholder={t.form.emailPlaceholder}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-cream/60 text-xs tracking-widest uppercase mb-3">
                    {t.form.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-cream/5 rounded-2xl border border-cream/10 px-5 py-4 text-cream focus:border-gold focus:outline-none transition-colors duration-300"
                    placeholder={t.form.phonePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-xs tracking-widest uppercase mb-3">
                    {t.form.businessType}
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full bg-cream/5 rounded-2xl border border-cream/10 px-5 py-4 text-cream focus:border-gold focus:outline-none transition-colors duration-300"
                  >
                    <option value="" className="bg-dark">{t.form.businessTypes.select}</option>
                    <option value="restaurant" className="bg-dark">{t.form.businessTypes.restaurant}</option>
                    <option value="bar" className="bg-dark">{t.form.businessTypes.bar}</option>
                    <option value="nightclub" className="bg-dark">{t.form.businessTypes.nightclub}</option>
                    <option value="hotel" className="bg-dark">{t.form.businessTypes.hotel}</option>
                    <option value="lounge" className="bg-dark">{t.form.businessTypes.lounge}</option>
                    <option value="other" className="bg-dark">{t.form.businessTypes.other}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cream/60 text-xs tracking-widest uppercase mb-3">
                  {t.form.message}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-cream/5 rounded-2xl border border-cream/10 px-5 py-4 text-cream focus:border-gold focus:outline-none transition-colors duration-300 resize-none"
                  placeholder={t.form.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className={`w-full py-4 rounded-full flex items-center justify-center gap-3 text-sm tracking-wide font-medium transition-all duration-500 ${
                  isSubmitted
                    ? 'bg-green-600 text-white'
                    : 'bg-gold text-dark hover:bg-gold-light hover:shadow-gold-lg hover:scale-[1.02]'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle size={18} />
                    {t.form.success}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {t.form.submit}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info - CURVED */}
          <div className="contact-info">
            <div className="grid sm:grid-cols-2 gap-6">
              {t.info.map((info, index) => {
                const Icon = icons[index];
                return (
                  <div key={index} className="group p-6 rounded-2xl bg-dark-light/30 border border-cream/10 hover:border-gold/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <Icon size={20} className="text-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-cream mb-3">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-cream/60 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder - CURVED */}
            <div className="mt-8 aspect-video rounded-3xl border border-cream/10 bg-dark-light/50 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin size={28} className="text-gold/50" />
                </div>
                <p className="text-cream/40 text-sm">Miami Design District</p>
                <p className="text-cream/60 text-xs mt-1">Florida, USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
