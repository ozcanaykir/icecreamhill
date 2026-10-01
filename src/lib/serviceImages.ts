import type { ImageMetadata } from 'astro';
import laEsperanza1 from '../assets/projeler/la-esperanza/galeri-1.jpg';
import laEsperanza2 from '../assets/projeler/la-esperanza/galeri-2.jpg';
import kekVeKahve from '../assets/projeler/supercoff-berlin/kek-ve-kahve.jpg';
import tepsi from '../assets/projeler/supercoff-berlin/tepsi.jpg';
import icMekan from '../assets/projeler/supercoff-berlin/ic-mekan.jpg';
import badBegsKapak from '../assets/projeler/bad-begs-zeit/kapak.jpg';
import badBegs1 from '../assets/projeler/bad-begs-zeit/galeri-1.jpg';
import recrum from '../assets/projeler/recrum-artist-serisi/galeri-1.jpg';
import kirmiziFon2 from '../assets/projeler/kirmizi-fon-kampanyasi/galeri-2.jpg';
import supercoffKapak from '../assets/projeler/supercoff-berlin/kapak.jpg';
import kirmiziFonKapak from '../assets/projeler/kirmizi-fon-kampanyasi/kapak.jpg';

/**
 * Hizmetler sayfasında her hizmet satırının yanındaki küçük örnek görseller.
 * Sıra i18n services.items ile aynı (01-08). Uygun görsel yoksa boş dizi.
 */
export const serviceImages: ImageMetadata[][] = [
  [laEsperanza1, laEsperanza2], // 01 Sosyal medya içerik serileri
  [kekVeKahve, tepsi], // 02 Ürün filmi ve ürün fotoğrafı
  [], // 03 Fabrika ve tesis çekimi
  [icMekan], // 04 Fuar ve etkinlik
  [badBegsKapak, badBegs1], // 05 Müzik videosu
  [recrum, kirmiziFon2], // 06 Portre ve editoryal
  [supercoffKapak, kirmiziFonKapak], // 07 Kampanya çekimi
  [], // 08 Belgesel ve bilgilendirici
];
