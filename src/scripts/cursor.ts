import { gsap } from 'gsap';

// Masaüstü custom cursor: küçük dondurma figürü imleci gecikmeli takip eder.
// Sadece hassas işaretçi + hover destekli cihazlarda ve hareket azaltma kapalıyken açılır.
// Durum <html data-cursor-mode="on|off"> ile CSS'e iletilir (gerçek imleci gizler, form alanlarında geri getirir).

const root = document.documentElement;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

type State = 'default' | 'link' | 'watch' | 'field';

let el: HTMLElement | null = null;
let figure: HTMLElement | null = null;
let label: HTMLElement | null = null;
let xTo: gsap.QuickToFunc | undefined;
let yTo: gsap.QuickToFunc | undefined;
let visible = false;
let state: State = 'default';

const enabled = () => finePointer.matches && !reduceMotion.matches;

function setVisible(on: boolean) {
  if (!el || visible === on) return;
  visible = on;
  gsap.to(el, { autoAlpha: on ? 1 : 0, duration: 0.2, overwrite: 'auto' });
}

function setState(next: State) {
  if (!figure || !label || state === next) return;
  state = next;
  const active = next === 'link' || next === 'watch';
  // Tıklanabilir öğede 32px -> 48px ve 15° yatar
  gsap.to(figure, { scale: active ? 1.5 : 1, rotate: active ? 15 : 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
  gsap.to(label, { autoAlpha: next === 'watch' ? 1 : 0, scale: next === 'watch' ? 1 : 0.5, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
  // Form alanlarında gerçek imleç görünür, figür gizlenir
  if (el) gsap.to(el, { autoAlpha: next === 'field' || !visible ? 0 : 1, duration: 0.15, overwrite: 'auto' });
}

function bind() {
  el = document.querySelector<HTMLElement>('[data-cursor]');
  figure = el?.querySelector<HTMLElement>('[data-cursor-figure]') ?? null;
  label = el?.querySelector<HTMLElement>('[data-cursor-label]') ?? null;
  visible = false;
  state = 'default';

  if (!el || !figure || !label || !enabled()) {
    root.dataset.cursorMode = 'off';
    xTo = yTo = undefined;
    return;
  }

  root.dataset.cursorMode = 'on';
  gsap.set(label, { autoAlpha: 0, scale: 0.5 });
  xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
}

document.addEventListener(
  'mousemove',
  (e) => {
    if (!el || !xTo || !yTo) return;
    if (!visible) {
      // İlk harekette atlamadan imlecin yerinde belir
      gsap.set(el, { x: e.clientX, y: e.clientY });
      setVisible(state !== 'field');
      visible = true;
    }
    xTo(e.clientX);
    yTo(e.clientY);
  },
  { passive: true },
);

document.addEventListener('mouseover', (e) => {
  if (!xTo) return;
  const target = e.target as Element | null;
  if (!target?.closest) return;
  if (target.closest('input, textarea, select, [contenteditable]')) setState('field');
  else if (target.closest('[data-cursor-watch]')) setState('watch');
  else if (target.closest('a, button, [role="button"], label, summary')) setState('link');
  else setState('default');
});

document.documentElement.addEventListener('mouseleave', () => setVisible(false));
document.documentElement.addEventListener('mouseenter', () => xTo && setVisible(state !== 'field'));

// ClientRouter yeni <body> getirir: cursor öğesini yeniden bağla
document.addEventListener('astro:page-load', bind);
finePointer.addEventListener('change', bind);
reduceMotion.addEventListener('change', bind);
