import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Showroom as ShowroomApi, ZoneId } from '../showroom/scene';

gsap.registerPlugin(ScrollTrigger);

interface Stop {
  number: string;
  label: string;
  title: string;
  description: string;
  items?: string[];
  zone?: string;
}

export interface ShowroomT {
  badge: string;
  dragHint: string;
  scrollHint: string;
  finish: string;
  cta: string;
  loading: string;
  noWebgl: string;
  zones: Record<ZoneId, string>;
  swatches: Record<string, string>;
  stops: Stop[];
}

const IMAGES = [
  '/images/bar-counter.jpg',
  '/images/speakeasy.jpg',
  '/images/booth-seating.jpg',
  '/images/private-dining.jpg',
  '/images/lounge-area.jpg',
  '/images/wine-bar.jpg',
];

// Colores de las muestras (igual que en la escena) sin cargar Three.js antes de tiempo.
const SWATCH_COLORS: Record<ZoneId, { id: string; color: string }[]> = {
  bar: [
    { id: 'cognac', color: '#8a4b22' },
    { id: 'black', color: '#171413' },
    { id: 'oxblood', color: '#5a1a1d' },
    { id: 'cream', color: '#d9c9a8' },
  ],
  booths: [
    { id: 'emerald', color: '#0f4a3a' },
    { id: 'navy', color: '#18264d' },
    { id: 'burgundy', color: '#5c1424' },
    { id: 'mustard', color: '#b88a2a' },
  ],
  lounge: [
    { id: 'ivory', color: '#e6dfd0' },
    { id: 'terracotta', color: '#9b4b2e' },
    { id: 'stone', color: '#6f6a63' },
    { id: 'camel', color: '#a8784a' },
  ],
  wine: [
    { id: 'chocolate', color: '#3d2416' },
    { id: 'olive', color: '#4a5032' },
    { id: 'smoke', color: '#3b3b3f' },
    { id: 'blush', color: '#b88d86' },
  ],
};

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const Showroom = ({ t }: { t: ShowroomT }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<ShowroomApi | null>(null);
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<Record<ZoneId, number>>({ bar: 0, booths: 0, lounge: 0, wine: 0 });
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  // Carga Three.js solo cuando la sección se acerca a la pantalla.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let disposed = false;
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries[0].isIntersecting;
        setVisible(on);
        apiRef.current?.setVisible(on);
        if (on && !apiRef.current && !disposed) {
          if (!webglOk()) {
            setFailed(true);
            return;
          }
          import('../showroom/scene')
            .then(({ createShowroom }) => {
              if (disposed || !canvasRef.current || apiRef.current) return;
              apiRef.current = createShowroom(canvasRef.current, { images: IMAGES, labels: t.zones });
              apiRef.current.setProgress(progressRef.current);
              setReady(true);
            })
            .catch(() => setFailed(true));
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(wrap);
    return () => {
      disposed = true;
      io.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
    // los rótulos de zona se fijan al crear la escena
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El scroll dentro de la sección mueve la cámara.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress;
        apiRef.current?.setProgress(self.progress);
        setActive(Math.round(self.progress * (t.stops.length - 1)));
      },
    });
    return () => st.kill();
  }, [t.stops.length]);

  const pick = (zone: ZoneId, i: number) => {
    setPicked((p) => ({ ...p, [zone]: i }));
    apiRef.current?.setSwatch(zone, i);
  };

  const goTo = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const span = wrap.offsetHeight - window.innerHeight;
    const y = top + (span * i) / (t.stops.length - 1);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section id="showroom" ref={wrapRef} className="relative bg-dark" style={{ height: `${t.stops.length * 100}vh` }}>
      {/* escena fija mientras se recorre la sección */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label={t.badge} />
        {(!ready || failed) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#1a140c_0%,#070605_70%)]">
            {failed ? (
              <img src="/images/hero-bar.jpg" alt="" className="h-full w-full object-cover opacity-40" />
            ) : (
              <p className="font-logo text-xs uppercase text-gold/70">{t.loading}</p>
            )}
          </div>
        )}
        {/* degradados para leer el texto */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50 md:to-black/60" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

        {/* indicador de paradas */}
        <nav className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex" aria-label={t.badge}>
          {t.stops.map((s, i) => (
            <button
              key={s.number}
              onClick={() => goTo(i)}
              className="group flex items-center gap-3 text-left"
              aria-current={active === i}
            >
              <span className={`block h-px transition-all duration-500 ${active === i ? 'w-10 bg-gold' : 'w-5 bg-white/30 group-hover:bg-white/60'}`} />
              <span className={`font-logo text-[10px] uppercase transition-opacity ${active === i ? 'text-gold opacity-100' : 'text-white/50 opacity-0 group-hover:opacity-100'}`}>
                {s.label}
              </span>
            </button>
          ))}
        </nav>

        {ready && visible && (
          <p className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-black/50 px-4 py-2 font-logo text-[10px] uppercase text-gold/90 backdrop-blur">
            ⟲ {t.dragHint}
          </p>
        )}
      </div>

      {/* tarjetas: una por parada, pasan por encima de la escena */}
      <div className="pointer-events-none absolute inset-0">
        {t.stops.map((s0, i) => {
          const s = { ...s0, zone: s0.zone as ZoneId | undefined };
          return (
          <div key={s.number} className="flex h-screen items-end justify-end px-4 pb-20 md:items-center md:px-10 md:pb-0">
            <article
              className={`pointer-events-auto w-full max-w-md rounded-3xl border border-gold/25 bg-black/55 p-5 backdrop-blur-md transition-all duration-700 md:p-8 ${
                active === i ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-40'
              }`}
            >
              <p className="mb-4 flex items-center gap-3 font-logo text-[11px] uppercase text-gold">
                <span className="rounded-full bg-gold px-2 py-0.5 font-sans text-[10px] font-semibold tracking-normal text-dark">{s.number}</span>
                {s.label}
              </p>
              <h3 className="mb-2 text-2xl leading-tight text-cream md:mb-3 md:text-4xl">{s.title}</h3>
              <p className="text-[13px] leading-relaxed text-white/70 md:text-base">{s.description}</p>
              {s.items && (
                <ul className="mt-4 hidden flex-wrap gap-2 md:flex">
                  {s.items.map((it) => (
                    <li key={it} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                      {it}
                    </li>
                  ))}
                </ul>
              )}
              {s.zone && (
                <div className="mt-5">
                  <p className="mb-2 font-logo text-[10px] uppercase text-white/50">
                    {t.finish}: <span className="text-gold">{t.swatches[SWATCH_COLORS[s.zone][picked[s.zone]].id]}</span>
                  </p>
                  <div className="flex gap-2.5">
                    {SWATCH_COLORS[s.zone].map((sw, k) => (
                      <button
                        key={sw.id}
                        onClick={() => pick(s.zone!, k)}
                        title={t.swatches[sw.id]}
                        aria-label={t.swatches[sw.id]}
                        aria-pressed={picked[s.zone!] === k}
                        className={`h-9 w-9 rounded-full border-2 shadow-inner transition-transform hover:scale-110 ${
                          picked[s.zone!] === k ? 'scale-110 border-gold' : 'border-white/20'
                        }`}
                        style={{ background: `radial-gradient(circle at 35% 30%, ${sw.color}cc, ${sw.color} 60%, #000 140%)` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {i === 0 && <p className="mt-5 font-logo text-[10px] uppercase text-gold/70">{t.scrollHint} ↓</p>}
              {i === t.stops.length - 1 && (
                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-dark transition hover:bg-gold-light"
                >
                  {t.cta}
                </a>
              )}
            </article>
          </div>
          );
        })}
      </div>
    </section>
  );
};

export default Showroom;
