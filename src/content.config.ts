import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categories } from './lib/categories';

const localized = <T extends z.ZodType>(schema: T) => z.object({ tr: schema, en: schema });

const projeler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projeler' }),
  schema: ({ image }) =>
    z.object({
      title: localized(z.string()),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug sadece ASCII küçük harf, rakam ve tire içerir'),
      category: z.enum(categories),
      client: z.string().optional(),
      year: z.number().int(),
      services: localized(z.array(z.string()).min(1)),
      summary: localized(z.string()),
      cover: image(),
      gallery: z.array(image()).default([]),
      video: z.url().optional(),
      featured: z.boolean().default(false),
      order: z.number(),
    }),
});

export const collections = { projeler };
