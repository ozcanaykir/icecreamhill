// Proje kartlarında hover önizlemesi: [data-card-preview] videosu, kapsayan [data-preview-card] üzerine gelince oynar.
// Belge seviyesinde dinleyici: ClientRouter ile değişen sayfalarda yeniden bağlamaya gerek yok.

const enabled = window.matchMedia(
  '(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)',
);

const videoOf = (target: EventTarget | null) =>
  (target as Element | null)?.closest('[data-preview-card]')?.querySelector<HTMLVideoElement>('[data-card-preview]');

document.addEventListener('mouseover', (e) => {
  if (!enabled.matches) return;
  const video = videoOf(e.target);
  if (!video || !video.paused) return;
  if (!video.src && video.dataset.src) video.src = video.dataset.src;
  video.play().then(
    () => video.classList.replace('opacity-0', 'opacity-100'),
    () => {},
  );
});

document.addEventListener('mouseout', (e) => {
  const video = videoOf(e.target);
  // Kartın içindeki başka bir öğeye geçişte durma
  if (!video || video.closest('[data-preview-card]')?.contains(e.relatedTarget as Node | null)) return;
  video.pause();
  video.classList.replace('opacity-100', 'opacity-0');
});
