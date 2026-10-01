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
      // y: 0 -> Preloader.astro'daki inline translateY(-260%) değerini GSAP px olarak okur, sıfırlanmalı
      .fromTo(figure, { y: 0, yPercent: -260, rotate: -14 }, { yPercent: 0, rotate: 0, duration: 0.45, ease: 'power3.in' })
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

/* ------------------------------------------------- Sayfa geneli dondurma figürü */

const floatCone = () => document.querySelector<HTMLElement>('[data-float-cone]');

/** Tam sayfa scroll'unda 360° döner */
function coneRotation() {
  const el = floatCone();
  if (!el) return;
  gsap.fromTo(
    el,
    { rotate: 0 },
    { rotate: 360, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.8, invalidateOnRefresh: true } },
  );
}

/** Masaüstünde her bölüm boyunca bir kez yukarı çıkıp geri iner */
function coneBob() {
  const el = floatCone();
  if (!el) return;
  const sections = Math.max(1, document.querySelectorAll('main > section, footer').length);
  const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => yTo(Math.sin(self.progress * sections * Math.PI) * -48),
  });
}

// Figür bu öğelerin üstüne geldiğinde soluklaşır (okunurluk)
const TEXT_BLOCKS = 'p, h1, h2, h3, button, form, a.rounded-full, dt, dd';

/**
 * Nokta gerçekten metnin üstünde mi? Blok öğeler (p, h2) satır boyunca tam genişlik kaplar,
 * bu yüzden metin satırlarının kutularına bakılır. Buton, pill link ve form tüm kutusuyla sayılır.
 */
function overText(x: number, y: number) {
  const block = document.elementFromPoint(x, y)?.closest(TEXT_BLOCKS);
  if (!block) return false;
  if (block.matches('button, form, a.rounded-full')) return true;
  // Sadece metin düğümlerinin satır kutuları (iç içe blok span'ların tam genişlikli kutuları sayılmaz)
  const range = document.createRange();
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
  }
  return false;
}

/** Figürün kapladığı alandaki 5 noktadan altta kalan öğeye bakar (figür pointer-events: none) */
function coversText(box: DOMRect) {
  const inset = 0.25;
  const points = [
    [0.5, 0.5],
    [inset, inset],
    [1 - inset, inset],
    [inset, 1 - inset],
    [1 - inset, 1 - inset],
  ];
  return points.some(([px, py]) => overText(box.left + box.width * px, box.top + box.height * py));
}

/**
 * Figürün altındaki bölüme göre gölge rengi (mavi bölümde beyaz, diğerlerinde mavi),
 * metin üstünde soluklaşma ve [data-cone-hide] alanlarında gizlenme.
 * Hareket olmadığı için reduced motion'da da çalışır.
 */
let coneFrame = 0;
function updateConeContext() {
  coneFrame = 0;
  const el = floatCone();
  if (!el) return;
  const box = el.getBoundingClientRect();
  if (!box.width) return; // mobilde display: none
  const cy = box.top + box.height / 2;

  let theme = 'light';
  for (const section of document.querySelectorAll<HTMLElement>('[data-theme]')) {
    const r = section.getBoundingClientRect();
    if (r.top <= cy && r.bottom >= cy) theme = section.dataset.theme ?? 'light';
  }
  el.dataset.glow = theme === 'blue' ? 'white' : 'blue';

  const hidden = [...document.querySelectorAll<HTMLElement>('[data-cone-hide]')].some((zone) => {
    const r = zone.getBoundingClientRect();
    return r.top < box.bottom && r.bottom > box.top && r.left < box.right && r.right > box.left;
  });
  el.dataset.hidden = String(hidden);
  el.dataset.dim = String(!hidden && coversText(box));
}
const scheduleConeContext = () => {
  if (!coneFrame) coneFrame = requestAnimationFrame(updateConeContext);
};
window.addEventListener('scroll', scheduleConeContext, { passive: true });
window.addEventListener('resize', scheduleConeContext);
// Figür scroll durduktan sonra da bir süre salınıp döner: durumu 120 ms'de bir tazele
let lastConeCheck = 0;
gsap.ticker.add((time) => {
  if (time - lastConeCheck < 0.12) return;
  lastConeCheck = time;
  scheduleConeContext();
});

/* ------------------------------------------------------------- Yaşam döngüsü */

let mm: gsap.MatchMedia | undefined;

async function onPageLoad() {
  mm?.revert();
  mm = gsap.matchMedia();

  await playPreloader();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heroIntro();
    reveals();
  });
  // Sabit figür sadece masaüstünde (mobilde CSS ile gizli)
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
    coneRotation();
    coneBob();
  });

  updateConeContext();

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
  if (root.dataset.cursorMode) next.dataset.cursorMode = root.dataset.cursorMode;
  next.dataset.intro = 'off';
  e.newDocument.querySelector('[data-preloader]')?.remove();
});

document.addEventListener('astro:after-swap', () => window.lenis?.resize());
