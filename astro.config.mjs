// @ts-check
import { defineConfig } from 'astro/config';

import { rename, rm } from 'node:fs/promises';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Cloudflare Pages, eksik bir adres için o klasördeki en yakın 404.html dosyasını sunar.
 * Astro en/404.astro'yu en/404/index.html olarak üretir; /en/ altı için en/404.html'e taşınır.
 */
const localized404 = {
  name: 'localized-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const from = new URL('en/404/index.html', dir);
      await rename(from, new URL('en/404.html', dir));
      await rm(new URL('en/404/', dir), { recursive: true });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://icecreamhill.com',
  integrations: [
    // 404 sayfaları sitemap'e girmez. hreflang eşleşmeleri <head> içinde (Base.astro), slug'lar dile göre farklı olduğu için burada değil.
    sitemap({ filter: (page) => !/\/404\/?$/.test(page) }),
    localized404,
  ],
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
