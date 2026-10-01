// Proje kategorileri (slug'lar ASCII). Etiketler i18n "categories" altında.
export const categories = [
  'sosyal-medya',
  'urun',
  'fabrika-tesis',
  'fuar-etkinlik',
  'muzik-videosu',
  'portre-kampanya',
] as const;

export type Category = (typeof categories)[number];
