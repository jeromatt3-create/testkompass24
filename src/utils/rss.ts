import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../config/site.config.mjs';

const DEFAULT_PUBLIC_ORIGIN = 'https://jeromatt3-create.github.io';
const DEFAULT_PUBLIC_BASE = '/testkompass24';

export function resolvePublicRootUrl(site?: URL): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const rawOrigin = site ? site.toString().replace(/\/+$/, '') : '';
  const isPlaceholder =
    !rawOrigin || rawOrigin.includes('dein-') || rawOrigin.includes('localhost');

  if (isPlaceholder) {
    return `${DEFAULT_PUBLIC_ORIGIN}${DEFAULT_PUBLIC_BASE}`;
  }
  return `${rawOrigin}${base}`;
}

export function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function getSortedArticles() {
  const articles = await getCollection('articles');
  return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getChannelTitle(): string {
  return `${SITE_CONFIG.name} – Unabhängige Produktvergleiche & Kaufberatungen`;
}
