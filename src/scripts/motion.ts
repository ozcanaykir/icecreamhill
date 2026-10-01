import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PRELOADER_KEY = 'ich:preloader';
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------------------------------------------------------- Lenis */

function startLenis() {
  if (window.lenis || reduceMotion.matches) return;
  window.lenis = new Lenis({ autoRaf: true });
  window.lenis.on('scroll', ScrollTrigger.update);
}

function stopLenis() {
  window.lenis?.destroy();
  window.lenis = undefined;
}

/* ------------------------------------------------------------ Preloader */

function removePreloader() {
  document.querySelector('[data-preloader]')?.remove();
  root.dataset.intro = 'off';
}

/** Oturumdaki ilk açılışta preloader'ı oynatır, bitince resolve olur. */
function playPreloader(): Promise<void> {
  const el = document.querySelector<HTMLElement>('[data-preloader]');
  if (!el || root.dataset.intro !== 'on' || reduceMotion.matches) {
    removePreloader();
    return Promise.resolve();
  }

  try {
    sessionStorage.setItem(PRELOADER_KEY, '1');
  } catch {
    /* gizli sekme vb. */
  }

  window.lenis?.stop();
  const figure = el.querySelector('[data-preloader-figure]');

  return new Promise((resolve) => {
    gsap
      .timeline({
        onComplete: () => {
          removePreloader();
          window.lenis?.start();
          resolve();
        },
      })
      // 0.8 sn: düşüş + küçük zıplama
      .fromTo(figure, { yPercent: -260, rotate: -14 }, { yPercent: 0, rotate: 0, duration: 0.45, ease: 'power3.in' })
      .to(figure, { yPercent: -16, duration: 0.17, ease: 'power2.out' })
      .to(figure, { yPercent: 0, duration: 0.18, ease: 'power2.in' })
      // Perde yukarı sıyrılır
      .to(el, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.05');
  });
}

/* ----------------------------------------------------------- Animasyonlar */

function heroIntro() {
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
  if (!lines.length) return;
  gsap.fromTo(
    lines,
    // y: 0 -> CSS'teki ön konumu (translateY(-130%)) GSAP'in px olarak okumasını sıfırlar
    { y: 0, yPercent: -130 },
    { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12 },
  );
  gsap.from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out', delay: 0.45, stagger: 0.08 });
}

function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const trigger = el.closest('section') ?? el;
    gsap.to(el, {
      yPercent: Number(el.dataset.parallaxY ?? -35),
      rotate: Number(el.dataset.parallaxRotate ?? 10),
      ease: 'none',
      scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

/* ------------------------------------------------------------- Yaşam döngüsü */

let mm: gsap.MatchMedia | undefined;

async function onPageLoad() {
  mm?.revert();
  mm = gsap.matchMedia();

  await playPreloader();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heroIntro();
    reveals();
    parallax();
  });

  ScrollTrigger.refresh();
}

function syncMotionFlag() {
  root.dataset.motion = reduceMotion.matches ? 'off' : 'on';
}

startLenis();

reduceMotion.addEventListener('change', (e) => {
  syncMotionFlag();
  if (e.matches) stopLenis();
  else startLenis();
});

document.addEventListener('astro:page-load', onPageLoad);

document.addEventListener('astro:before-swap', (e) => {
  // Eski sayfanın tween'leri onPageLoad'da revert edilir (geçiş sırasında sıçrama olmasın).
  // ClientRouter <html> attribute'larını yenisiyle değiştirir: durumu taşı,
  // preloader sadece ilk tam yüklemede oynar.
  const next = e.newDocument.documentElement;
  next.dataset.motion = root.dataset.motion;
  next.dataset.intro = 'off';
  e.newDocument.querySelector('[data-preloader]')?.remove();
});

document.addEventListener('astro:after-swap', () => window.lenis?.resize());
