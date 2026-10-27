// YouTube linklerinden video kimliği ve oran çıkarır (watch, youtu.be, shorts, embed)

export type YouTubeVideo = { id: string; shorts: boolean };

export function parseYouTube(url: string): YouTubeVideo {
  const u = new URL(url);
  const parts = u.pathname.split('/').filter(Boolean);
  let id = '';
  if (u.hostname.endsWith('youtu.be')) id = parts[0] ?? '';
  else if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') id = parts[1] ?? '';
  else id = u.searchParams.get('v') ?? '';
  if (!/^[\w-]{11}$/.test(id)) throw new Error(`Geçersiz YouTube linki: ${url}`);
  return { id, shorts: parts[0] === 'shorts' };
}
