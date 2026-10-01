import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projeler'>;

/** Tüm projeler, order alanına göre sıralı */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projeler');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Detay sayfası için önceki / sonraki proje (liste başa sarar) */
export function getNeighbors(projects: Project[], slug: string) {
  const i = projects.findIndex((p) => p.data.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
