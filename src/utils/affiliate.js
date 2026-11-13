import { SITE_CONFIG } from '../config/site.config.mjs';

/**
 * Erzeugt einen sicheren Amazon.de Affiliate-Link.
 * Standardmäßig wird die gezielte Produktsuche (?k=...) mit Partner-Tag genutzt,
 * da KI-generierte oder veraltete ASINs bei Amazon häufiger zu 404-Seiten führen,
 * während die exakte Modellsuche zuverlässig auf das richtige Produkt mit aktivem Partner-Cookie leitet.
 */
export function buildAmazonAffiliateUrl({
  asin = '',
  searchQuery = '',
  partnerTag = '',
  preferDirectAsin = SITE_CONFIG.preferDirectAsin,
} = {}) {
  const tag = (partnerTag || SITE_CONFIG.amazonPartnerTag || 'dein-tag-21').trim();
  const marketplace = SITE_CONFIG.amazonMarketplace || 'www.amazon.de';
  const cleanAsin = typeof asin === 'string' ? asin.trim().toUpperCase() : '';
  const isValidAsin = /^[A-Z0-9]{10}$/.test(cleanAsin);

  if (preferDirectAsin && isValidAsin) {
    const url = new URL(`https://${marketplace}/dp/${cleanAsin}`);
    url.searchParams.set('tag', tag);
    url.searchParams.set('linkCode', 'll1');
    url.searchParams.set('language', 'de_DE');
    return url.toString();
  }

  const query = (searchQuery || cleanAsin || 'Bestseller').trim();
  const url = new URL(`https://${marketplace}/s`);
  url.searchParams.set('k', query);
  url.searchParams.set('tag', tag);
  url.searchParams.set('linkCode', 'll2');
  return url.toString();
}

/**
 * Sekundärer Preisvergleichs-Link (Idealo / Google Shopping Suche).
 */
export function buildPriceCheckUrl({ searchQuery = '' } = {}) {
  const query = encodeURIComponent((searchQuery || '').trim());
  return `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${query}`;
}
