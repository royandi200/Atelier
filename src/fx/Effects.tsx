import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = () => typeof window !== 'undefined' && matchMedia('(hover: none), (pointer: coarse)').matches;

/* ---------- Preloader: contador 0→100 + cortina que sube ---------- */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Las animaciones del sitio esperan a que se levante la cortina.
    gsap.globalTimeline.pause();
    if (!location.hash) {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
    document.documentElement.style.overflow = 'hidden';
    let loaded = document.readyState === 'complete';
    const onLoad = () => (loaded = true);
    window.addEventListener('load', onLoad);
    const start = performance.now();
    let v = 0;
    let raf = 0;
    const tick = () => {
      const t = performance.now() - start;
      // avanza solo hasta 90 mientras carga; luego completa
      const target = loaded && t > 900 ? 100 : Math.min(90, (t / 1400) * 90);
      v = Math.min(target, v + Math.max((target - v) * 0.1, 0.9));
      const shown = Math.min(100, Math.round(v));
      setN(shown);
      if (shown >= 100) {
        setOut(true);
        gsap.globalTimeline.resume();
        document.documentElement.style.overflow = '';
        onDone?.();
        setTimeout(() => setGone(true), 1300);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // seguridad: nunca más de 4 s
    const safety = setTimeout(() => (loaded = true), 4000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener('load', onLoad);
      gsap.globalTimeline.resume();
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div className={`fx-preloader ${out ? 'is-out' : ''}`} aria-hidden="true">
      <div className="fx-pre-inner">
        <p className="fx-pre-logo font-logo">
          {'ATELIER'.split('').map((c, i) => (
            <span key={i} style={{ animationDelay: `${i * 70}ms` }}>{c}</span>
          ))}
        </p>
        <div className="fx-pre-bar"><span style={{ transform: `scaleX(${n / 100})` }} /></div>
      </div>
      <p className="fx-pre-count font-display">{String(n).padStart(3, '0')}</p>
    </div>
  );
}

/* ---------- Scroll suave (Lenis) sincronizado con ScrollTrigger ---------- */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // anclas internas: viaje suave con un pequeño desfase por la barra fija
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.6 });
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

/* ---------- Barra de progreso dorada ---------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (s) => ref.current && (ref.current.style.transform = `scaleX(${s.progress})`),
    });
    return () => st.kill();
  }, []);
  return <div ref={ref} className="fx-progress" aria-hidden="true" />;
}

/* ---------- Cursor de dos capas + botones magnéticos ---------- */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (touch() || reduced()) return;
    document.documentElement.classList.add('fx-has-cursor');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const r = { x: pos.x, y: pos.y };
    let mode = '';
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement;
      const img = t.closest('img, [data-cursor="view"]');
      const canvas = t.closest('#showroom canvas');
      const link = t.closest('a, button, [role="button"], input, textarea, select, label');
      const next = canvas ? 'drag' : link ? 'link' : img ? 'view' : '';
      if (next !== mode) {
        mode = next;
        ring.current?.setAttribute('data-mode', mode);
        setLabel(mode === 'view' ? 'Ver' : mode === 'drag' ? '360°' : '');
      }
    };
    const down = () => ring.current?.classList.add('is-down');
    const up = () => ring.current?.classList.remove('is-down');
    const leave = () => { if (dot.current && ring.current) dot.current.style.opacity = ring.current.style.opacity = '0'; };
    const enter = () => { if (dot.current && ring.current) dot.current.style.opacity = ring.current.style.opacity = '1'; };

    const loop = () => {
      r.x += (pos.x - r.x) * 0.16;
      r.y += (pos.y - r.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px,${r.y}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    // Botones magnéticos: los CTA redondos se dejan atraer por el cursor
    const mags = new Map<HTMLElement, () => void>();
    const bind = () => {
      document.querySelectorAll<HTMLElement>('a.rounded-full, button.rounded-full').forEach((el) => {
        if (mags.has(el) || el.closest('#showroom nav')) return;
        const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const mm = (e: PointerEvent) => {
          const b = el.getBoundingClientRect();
          qx((e.clientX - (b.left + b.width / 2)) * 0.3);
          qy((e.clientY - (b.top + b.height / 2)) * 0.35);
        };
        const ml = () => { qx(0); qy(0); };
        el.addEventListener('pointermove', mm);
        el.addEventListener('pointerleave', ml);
        mags.set(el, () => { el.removeEventListener('pointermove', mm); el.removeEventListener('pointerleave', ml); });
      });
    };
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      mags.forEach((off) => off());
      removeEventListener('pointermove', move);
      removeEventListener('pointerdown', down);
      removeEventListener('pointerup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      document.documentElement.classList.remove('fx-has-cursor');
    };
  }, []);

  if (typeof window !== 'undefined' && (touch() || reduced())) return null;
  return (
    <>
      <div ref={ring} className="fx-cursor-ring" aria-hidden="true"><span>{label}</span></div>
      <div ref={dot} className="fx-cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ---------- Revelados al hacer scroll: títulos con máscara e imágenes con cortina ---------- */
export function useReveals(deps: unknown[] = []) {
  useEffect(() => {
    if (reduced()) return;
    const targets = [
      ...document.querySelectorAll<HTMLElement>('main section:not(#showroom) h2'),
      ...document.querySelectorAll<HTMLElement>('main section:not(#showroom):not(:first-child) img'),
    ].filter((el) => !el.classList.contains('fx-in'));
    targets.forEach((el) => el.classList.add(el.tagName === 'IMG' ? 'fx-img' : 'fx-title'));
    // rótulos de sección numerados con línea animada (como en HarrySound)
    let n = 0;
    document.querySelectorAll<HTMLElement>('main > section').forEach((sec) => {
      const badge = sec.querySelector<HTMLElement>('span.text-gold.tracking-widest.uppercase, p.text-gold.uppercase');
      if (!badge || sec.id === 'showroom') return;
      n++;
      badge.classList.add('fx-cue');
      badge.dataset.n = String(n).padStart(2, '0');
      targets.push(badge);
    });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('fx-in');
          io.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -12% 0px' }
    );
    targets.forEach((el) => io.observe(el));

    // parallax suave en las imágenes grandes
    const tweens = gsap.utils.toArray<HTMLElement>('main section:not(#showroom):not(:first-child) img').map((img) =>
      gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } })
    );
    return () => {
      io.disconnect();
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ---------- Franja de texto cinético que reacciona a la velocidad del scroll ---------- */
export function Marquee({ words }: { words: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    const st = ScrollTrigger.create({
      onUpdate: (s) => {
        dir = s.direction === 1 ? -1 : 1;
        boost = Math.min(12, Math.abs(s.getVelocity()) / 220);
      },
    });
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(el);
    const tick = () => {
      if (reduced() || !onScreen) return;
      boost *= 0.94;
      x += dir * (0.6 + boost);
      const w = el.scrollWidth / 2;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-dir * boost * 0.8}deg)`;
    };
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);
  const row = [...words, ...words];
  return (
    <div className="fx-marquee" aria-hidden="true">
      <div ref={track} className="fx-marquee-track">
        {row.map((w, i) => (
          <span key={i} className={i % 2 ? 'fx-outline' : ''}>
            {w}<i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
