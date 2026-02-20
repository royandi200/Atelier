import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, X, Moon, Sun } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface GalleryProps {
  t: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    filters: {
      all: string;
      night: string;
      day: string;
    };
    nightBadge: string;
    materials: string;
    cta: string;
  };
}

const projects = [
  {
    id: 1,
    title: 'Neon Dreams',
    category: 'Nightclub',
    location: 'Wynwood, Miami',
    image: '/images/nightclub-bar.jpg',
    description: 'Un nightclub de vanguardia donde la iluminación LED crea atmósferas inmersivas. La barra curva con tiras de luces se convierte en el epicentro de la experiencia nocturna.',
    materials: ['Superficies Reflectantes', 'LED RGB', 'Acero Pulido'],
    isNight: true,
  },
  {
    id: 2,
    title: 'The Hideaway',
    category: 'Speakeasy',
    location: 'Brickell, Miami',
    image: '/images/speakeasy.jpg',
    description: 'Un speakeasy íntimo que evoca la época dorada con un toque contemporáneo. Chesterfield de cuero, latón y velas crean una atmósfera de misterio y sofisticación.',
    materials: ['Cuero Italiano', 'Latón', 'Madera de Nogal'],
    isNight: true,
  },
  {
    id: 3,
    title: 'Skyline Lounge',
    category: 'Rooftop Nightclub',
    location: 'Downtown Miami',
    image: '/images/rooftop-nightclub.jpg',
    description: 'Un rooftop que domina el skyline de Miami. Instalaciones de luces neón suspendidas, piscina infinity y áreas VIP para una experiencia nocturna inolvidable.',
    materials: ['Mármol Blanco', 'Neón Artístico', 'Muebles Outdoor'],
    isNight: true,
  },
  {
    id: 4,
    title: 'Velvet Room',
    category: 'Cocktail Lounge',
    location: 'Design District, Miami',
    image: '/images/cocktail-lounge.jpg',
    description: 'Un lounge de cócteles donde el verde esmeralda y el mármol negro crean un ambiente de lujo discreto. La barra circular es el corazón palpitante del espacio.',
    materials: ['Terciopelo Esmeralda', 'Mármol Negro', 'Latón'],
    isNight: true,
  },
  {
    id: 5,
    title: 'Tiki Moon',
    category: 'Beach Club',
    location: 'South Beach, Miami',
    image: '/images/beach-club.jpg',
    description: 'Un beach club que fusiona el estilo tiki con el lujo moderno. Fogatas, palmeras iluminadas y vistas al océano crean la escena perfecta para las noches de Miami.',
    materials: ['Bambú', 'Madera Teca', 'Iluminación Ambiental'],
    isNight: true,
  },
  {
    id: 6,
    title: 'Cielo Rooftop',
    category: 'Rooftop Lounge',
    location: 'South Beach, Miami',
    image: '/images/rooftop-bar.jpg',
    description: 'Un oasis urbano con vistas panorámicas de Miami. Mobiliario de exterior diseñado para resistir los elementos sin sacrificar el estilo.',
    materials: ['Teca Certificada', 'Cuerda Náutica', 'Acero Inoxidable'],
    isNight: false,
  },
  {
    id: 7,
    title: 'Sakura Omakase',
    category: 'Restaurante Japonés',
    location: 'Wynwood, Miami',
    image: '/images/sushi-restaurant.jpg',
    description: 'Diseño minimalista japonés que honra la tradición. Madera de nogal oscuro y piedra natural crean un ambiente de serenidad contemplativa.',
    materials: ['Nogal Americano', 'Piedra Basalto', 'Papel Washi'],
    isNight: false,
  },
  {
    id: 8,
    title: 'Vino & Alma',
    category: 'Wine Bar',
    location: 'Design District, Miami',
    image: '/images/wine-bar.jpg',
    description: 'Un templo para los amantes del vino donde la arquitectura de la bodega se convierte en arte. Estantes de latón suspendidos exhiben una colección impresionante.',
    materials: ['Roble Francés', 'Latón', 'Vidrio Templado'],
    isNight: false,
  },
];

const Gallery = ({ t }: GalleryProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'night' | 'day'>('all');

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'night') return project.isNight;
    return !project.isNight;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-title',
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
        '.gallery-item',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filter]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-dark section-reveal"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="gallery-title flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6">{t.badge}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
              {t.title}
              <span className="text-gradient-gold block">{t.titleHighlight}</span>
            </h2>
          </div>
          
          {/* Filter Buttons - CURVED */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gold text-dark'
                  : 'border border-cream/30 text-cream hover:border-gold hover:text-gold'
              }`}
            >
              {t.filters.all}
            </button>
            <button
              onClick={() => setFilter('night')}
              className={`px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-300 flex items-center gap-2 ${
                filter === 'night'
                  ? 'bg-gold text-dark'
                  : 'border border-cream/30 text-cream hover:border-gold hover:text-gold'
              }`}
            >
              <Moon size={14} />
              {t.filters.night}
            </button>
            <button
              onClick={() => setFilter('day')}
              className={`px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-300 flex items-center gap-2 ${
                filter === 'day'
                  ? 'bg-gold text-dark'
                  : 'border border-cream/30 text-cream hover:border-gold hover:text-gold'
              }`}
            >
              <Sun size={14} />
              {t.filters.day}
            </button>
          </div>
        </div>

        {/* Gallery Grid - CURVED CARDS */}
        <div className="gallery-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="gallery-item group relative aspect-[4/5] overflow-hidden rounded-3xl bg-dark-light"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {project.isNight && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-500/30 backdrop-blur-sm border border-purple-400/30">
                  <span className="text-purple-300 text-xs flex items-center gap-1">
                    <Moon size={10} />
                    {t.filters.night}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-gold text-xs tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {project.category}
                  </p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-cream mb-1">
                    {project.title}
                  </h3>
                  <p className="text-cream/50 text-sm">{project.location}</p>
                </div>

                <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:border-gold group-hover:bg-gold">
                  <ArrowUpRight size={18} className="text-cream group-hover:text-dark" />
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl border-2 border-gold/0 group-hover:border-gold/50 transition-all duration-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Project Modal - CURVED */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-dark/98 backdrop-blur-xl overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center hover:border-gold hover:bg-gold transition-all duration-300"
          >
            <X size={20} className="text-cream" />
          </button>

          <div
            className="min-h-screen flex items-center justify-center p-6 lg:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden rounded-3xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                {selectedProject.isNight && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 w-fit mb-4">
                    <Moon size={14} className="text-purple-400" />
                    <span className="text-purple-300 text-xs tracking-wide">{t.nightBadge}</span>
                  </div>
                )}

                <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
                  {selectedProject.category}
                </p>
                <h2 className="font-serif text-4xl lg:text-5xl text-cream mb-4">
                  {selectedProject.title}
                </h2>
                <p className="text-cream/50 text-sm mb-8">{selectedProject.location}</p>

                <p className="text-cream/70 text-lg leading-relaxed mb-8">
                  {selectedProject.description}
                </p>

                <div className="mb-8">
                  <p className="text-cream/40 text-xs tracking-widest uppercase mb-4">
                    {t.materials}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.materials.map((material, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-full border border-gold/30 text-gold text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProject(null);
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="self-start px-8 py-4 rounded-full bg-gold text-dark text-sm tracking-wide font-medium hover:bg-gold-light transition-all duration-500"
                >
                  {t.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
