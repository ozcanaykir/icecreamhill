import tr from './tr.json';
import en from './en.json';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

const dictionaries = { tr, en } satisfies Record<Locale, typeof tr>;

export function getLocale(locale: string | undefined): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

export function t(locale: string | undefined) {
  return dictionaries[getLocale(locale)];
}

/** Sayfa adresleri, dile göre. tr prefix'siz, en /en/ altında. */
export const routes = {
  home: { tr: '/', en: '/en/' },
  works: { tr: '/isler', en: '/en/work' },
  services: { tr: '/hizmetler', en: '/en/services' },
  studio: { tr: '/studyo', en: '/en/studio' },
  contact: { tr: '/iletisim', en: '/en/contact' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function routePath(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

/** Proje detay adresi: /isler/<slug> veya /en/work/<slug> */
export function projectPath(slug: string, locale: Locale): string {
  return `${routes.works[locale]}/${slug}`;
}

/** Mevcut sayfanın diğer dildeki karşılığı. Alt yollar (proje slug'ı gibi) korunur. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const path = pathname.replace(/\/$/, '') || '/';
  // En uzun eşleşme önce ('/en/work' '/en'den önce denenmeli). tr ana sayfa ('/') fallback.
  const candidates = Object.values(routes)
    .flatMap((route) => locales.map((from) => ({ route, base: route[from].replace(/\/$/, '') })))
    .filter((c) => c.base)
    .sort((a, b) => b.base.length - a.base.length);

  for (const { route, base } of candidates) {
    if (path === base || path.startsWith(`${base}/`)) {
      const rest = path.slice(base.length);
      return rest ? route[target].replace(/\/$/, '') + rest : route[target];
    }
  }
  return routes.home[target];
}

/** Menüdeki sayfalar */
export const navRoutes = ['works', 'services', 'studio', 'contact'] as const;
