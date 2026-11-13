import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { SITE_CONFIG, getCategoryBySlug } from '../config/site.config.mjs';
import {
  escapeXml,
  getChannelTitle,
  getSortedArticles,
  resolvePublicRootUrl,
} from '../utils/rss';

function getPinByteSize(slug: string): number {
  try {
    const pinPath = path.resolve(process.cwd(), 'public', 'images', 'pins', `${slug}.png`);
    const stat = fs.statSync(pinPath);
    return stat.size > 0 ? stat.size : 120000;
  } catch {
    return 120000;
  }
}

export const GET: APIRoute = async ({ site }) => {
  const rootUrl = resolvePublicRootUrl(site);
  const articles = await getSortedArticles();
  const feedUrl = `${rootUrl}/pinterest-rss.xml`;
  const lastBuildDate = (articles[0]?.data.pubDate || new Date()).toUTCString();

  const itemsXml = articles
    .map((article) => {
      const articleUrl = `${rootUrl}/artikel/${article.id}/`;
      const pinImageUrl = `${rootUrl}/images/pins/${article.id}.png`;
      const category = getCategoryBySlug(article.data.category);
      const sortedProducts = [...(article.data.products || [])].sort((a, b) => a.rank - b.rank);
      const winner = sortedProducts[0];
      const valuePick = sortedProducts[1];

      const pinTitle = winner
        ? `${article.data.title} – Testsieger: ${winner.name}`
        : article.data.title;

      const summaryParts = [article.data.description];
      if (winner) {
        summaryParts.push(`Testsieger: ${winner.name} (${winner.priceRange}).`);
      }
      if (valuePick) {
        summaryParts.push(`${valuePick.badge}: ${valuePick.name} (${valuePick.priceRange}).`);
      }
      const pinDescription = summaryParts.join(' ');
      const pinLength = getPinByteSize(article.id);

      return `    <item>
      <title>${escapeXml(pinTitle)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(pinDescription)}</description>
      <pubDate>${article.data.pubDate.toUTCString()}</pubDate>
      <category>${escapeXml(category.name)}</category>
      <enclosure url="${escapeXml(pinImageUrl)}" type="image/png" length="${pinLength}" />
      <media:content url="${escapeXml(pinImageUrl)}" type="image/png" medium="image" width="1000" height="1500" />
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${getChannelTitle()} (Pinterest Feed)`)}</title>
    <link>${escapeXml(rootUrl)}/</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>de-de</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
