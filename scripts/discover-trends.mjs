import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { SITE_CONFIG, getCategoryList } from '../src/config/site.config.mjs';
import { generateWithGemini, hasGeminiCredentials } from './gemini-client.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'content', 'articles');
const QUEUE_PATH = path.join(ROOT_DIR, 'src', 'config', 'topic-queue.json');

export function slugifyGerman(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

export async function getExistingArticles() {
  try {
    const files = await fs.readdir(ARTICLES_DIR);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    const items = [];
    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf8');
      const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      items.push({
        slug: file.replace(/\.md$/, ''),
        title: titleMatch ? titleMatch[1] : file.replace(/\.md$/, ''),
      });
    }
    return items;
  } catch {
    return [];
  }
}

export async function loadTopicQueue() {
  try {
    const raw = await fs.readFile(QUEUE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function markQueueItemPublished(queueId) {
  if (!queueId) return;
  const queue = await loadTopicQueue();
  let updated = false;
  const next = queue.map((item) => {
    if (item.id === queueId) {
      updated = true;
      return { ...item, status: 'published', publishedAt: new Date().toISOString() };
    }
    return item;
  });
  if (updated) {
    await fs.writeFile(QUEUE_PATH, JSON.stringify(next, null, 2) + '\n', 'utf8');
  }
}

/**
 * Findet das lukrativste, noch nicht behandelte Vergleichsthema für den deutschen Markt.
 */
export async function discoverNextTopic({
  requestedTopic = '',
  requestedCategory = '',
  dryRun = false,
  excludedSlugs = [],
} = {}) {
  const validCategories = getCategoryList().map((c) => c.slug);
  const existing = await getExistingArticles();
  const existingSlugs = new Set([...existing.map((e) => e.slug), ...excludedSlugs]);
  const queue = await loadTopicQueue();

  // 1. Falls der Nutzer explizit ein Thema vorgibt
  if (requestedTopic) {
    const category = validCategories.includes(requestedCategory)
      ? requestedCategory
      : validCategories[0];
    const slug = slugifyGerman(requestedTopic);
    return {
      title: requestedTopic,
      slug,
      category,
      targetKeyword: requestedTopic,
      buyerIntent: 'commercial',
      queueId: null,
      source: 'cli-override',
      rationale: 'Manuell über CLI/Workflow vorgegebenes Thema.',
    };
  }

  // 2. Nächstes offenes Queue-Thema als sicherer Fallback (und für Dry-Run)
  const pendingQueue = queue.filter((item) => {
    if (item.status === 'published') return false;
    if (existingSlugs.has(item.id)) return false;
    if (requestedCategory && item.category !== requestedCategory) return false;
    return true;
  });

  const queueFallback = pendingQueue[0] || {
    id: `trend-vergleich-${Date.now()}`,
    category: validCategories.includes(requestedCategory) ? requestedCategory : 'tech-gadgets',
    keyword: 'Beste Smart-Home-Gadgets für den Alltag im Vergleich',
    intent: 'commercial',
  };

  if (dryRun || !hasGeminiCredentials()) {
    return {
      title: queueFallback.keyword,
      slug: slugifyGerman(queueFallback.id || queueFallback.keyword),
      category: queueFallback.category,
      targetKeyword: queueFallback.keyword,
      buyerIntent: queueFallback.intent || 'commercial',
      queueId: queueFallback.id || null,
      source: dryRun ? 'dry-run-queue' : 'queue-fallback-no-key',
      rationale: dryRun
        ? 'Dry-Run: Nächstes unveröffentlichtes Thema aus topic-queue.json gewählt.'
        : 'Kein GEMINI_API_KEY konfiguriert – Thema aus topic-queue.json gewählt.',
    };
  }

  // 3. Live Trend-Discovery über Gemini + Google Search Grounding
  const currentMonth = new Date().toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  });
  const allowedCategoriesText = Object.values(SITE_CONFIG.categories)
    .map((c) => `- "${c.slug}": ${c.name} (${c.description})`)
    .join('\n');

  const categoryConstraint = requestedCategory
    ? `WICHTIG: Wähle zwingend die Kategorie "${requestedCategory}".`
    : 'Wähle eine passende Kategorie aus der Liste.';

  const prompt = `
Du bist ein erfahrener SEO- und Affiliate-Marketing-Stratege für den deutschen Markt (Amazon.de).
Aktuelles Datum/Saison: ${currentMonth}.

AUFGABE:
Identifiziere GENAU EIN aktuell stark nachgefragtes Produktvergleichs-Thema für Deutschland mit hoher Kaufabsicht (Affiliate-Potenzial auf Amazon.de), das noch NICHT existiert.

Bereits veröffentlichte Artikel (NIEMALS wiederholen oder stark überlappen):
${existing.map((e) => `- ${e.title} (${e.slug})`).join('\n')}

Erlaubte Kategorien:
${allowedCategoriesText}
${categoryConstraint}

Inspirations-Kandidaten aus unserer Themen-Queue:
${pendingQueue
  .slice(0, 8)
  .map((q) => `- [${q.id}] (${q.category}) ${q.keyword} [Saison: ${q.seasonality || 'ganzjährig'}]`)
  .join('\n')}

Du darfst entweder einen starken Kandidaten aus der Queue auswählen (und dessen "queueId" angeben) ODER ein noch aktuelleres Trend-Thema aus deiner Google-Suche vorschlagen (dann "queueId": null).

Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt in genau diesem Format:
{
  "title": "Packender SEO-Titel für deutschen Vergleichsartikel (ca. 55-70 Zeichen)",
  "slug": "url-freundlicher-deutscher-slug-ohne-umlaute",
  "category": "eine-der-erlaubten-kategorien",
  "targetKeyword": "Haupt-Suchbegriff",
  "buyerIntent": "commercial",
  "queueId": "id-aus-queue-oder-null",
  "rationale": "Kurze Begründung (1-2 Sätze), warum dieses Produkt aktuell stark nachgefragt wird."
}
`.trim();

  try {
    const res = await generateWithGemini({
      prompt,
      temperature: 0.35,
      expectJson: true,
    });

    const pick = res.data;
    const chosenCategory = validCategories.includes(pick.category)
      ? pick.category
      : queueFallback.category;
    const slug = slugifyGerman(pick.slug || pick.title);

    if (!slug || existingSlugs.has(slug)) {
      throw new Error(`Vorgeschlagener Slug "${slug}" existiert bereits oder ist leer.`);
    }

    return {
      title: pick.title || queueFallback.keyword,
      slug,
      category: requestedCategory && validCategories.includes(requestedCategory)
        ? requestedCategory
        : chosenCategory,
      targetKeyword: pick.targetKeyword || pick.title || queueFallback.keyword,
      buyerIntent: pick.buyerIntent || 'commercial',
      queueId: pick.queueId || null,
      source: res.groundingUsed ? 'gemini-search-trends' : 'gemini-trends',
      rationale: pick.rationale || 'Durch Gemini-Marktanalyse ausgewählt.',
      usage: res.usage,
    };
  } catch (err) {
    console.warn(`⚠️ Live Trend-Discovery fehlgeschlagen (${err.message}), nutze Queue-Fallback.`);
    return {
      title: queueFallback.keyword,
      slug: slugifyGerman(queueFallback.id || queueFallback.keyword),
      category: queueFallback.category,
      targetKeyword: queueFallback.keyword,
      buyerIntent: queueFallback.intent || 'commercial',
      queueId: queueFallback.id || null,
      source: 'queue-fallback',
      rationale: 'Fallback auf topic-queue.json nach API-Warnung.',
    };
  }
}

// Direkter CLI-Aufruf
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const catArg = args.find((a) => a.startsWith('--category='));
  const topicArg = args.find((a) => a.startsWith('--topic='));

  const result = await discoverNextTopic({
    requestedCategory: catArg ? catArg.split('=')[1] : '',
    requestedTopic: topicArg ? topicArg.split('=')[1] : '',
    dryRun,
  });

  console.log(JSON.stringify(result, null, 2));
}
