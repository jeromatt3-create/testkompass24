import type { APIRoute } from 'astro';
import { SITE_CONFIG, getCategoryBySlug } from '../config/site.config.mjs';
import {
  escapeXml,
  getChannelTitle,
  getSortedArticles,
  resolvePublicRootUrl,
} from '../utils/rss';

export const GET: APIRoute = async ({ site }) => {
  const rootUrl = resolvePublicRootUrl(site);
  const articles = await getSortedArticles();
  const feedUrl = `${rootUrl}/rss.xml`;
  const lastBuildDate = (articles[0]?.data.pubDate || new Date()).toUTCString();

  const itemsXml = articles
    .map((article) => {
      const articleUrl = `${rootUrl}/artikel/${article.id}/`;
      const category = getCategoryBySlug(article.data.category);
      return `    <item>
      <title>${escapeXml(article.data.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(article.data.description)}</description>
      <pubDate>${article.data.pubDate.toUTCString()}</pubDate>
      <category>${escapeXml(category.name)}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(getChannelTitle())}</title>
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
