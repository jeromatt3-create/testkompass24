import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const origin = site ? site.toString().replace(/\/+$/, '') : '';
  const sitemapUrl = `${origin}${base}/sitemap-index.xml`;
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
