import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { getCategoryBySlug } from '../src/config/site.config.mjs';
import { generateWithGemini, hasGeminiCredentials } from './gemini-client.mjs';
import { slugifyGerman } from './discover-trends.mjs';
import { generatePinImage } from './generate-pins.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'content', 'articles');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'articles');

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function splitTitleTwoLines(title, maxChars = 28) {
  const words = String(title || '').split(/\s+/);
  let line1 = '';
  let line2 = '';
  for (const word of words) {
    if ((line1 + ' ' + word).trim().length <= maxChars && !line2) {
      line1 = (line1 + ' ' + word).trim();
    } else {
      line2 = (line2 + ' ' + word).trim();
    }
  }
  if (line2.length > 34) {
    line2 = line2.slice(0, 31).trim() + '...';
  }
  return [line1 || title.slice(0, maxChars), line2];
}

export function buildArticleHeroSvg({ title, categorySlug }) {
  const cat = getCategoryBySlug(categorySlug);
  const accent = cat.accent || '#0f4c81';
  const [line1, line2] = splitTitleTwoLines(title);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="${escapeXml(accent)}"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1040" cy="140" r="190" fill="#ffffff" opacity="0.06"/>
  <circle cx="160" cy="520" r="210" fill="#ffffff" opacity="0.05"/>
  <rect x="80" y="90" width="280" height="44" rx="22" fill="#ffffff" opacity="0.18"/>
  <text x="220" y="119" font-family="Segoe UI, Arial, sans-serif" font-size="21" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(cat.name.toUpperCase())}</text>
  <text x="80" y="255" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="800" fill="#ffffff">${escapeXml(line1)}</text>
  <text x="80" y="325" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="800" fill="#fde68a">${escapeXml(line2)}</text>
  <text x="80" y="400" font-family="Segoe UI, Arial, sans-serif" font-size="27" fill="#f1f5f9">Unabhängiger Produktvergleich • Vor- &amp; Nachteile • Preis-Check</text>
  <rect x="80" y="470" width="300" height="58" rx="12" fill="#059669"/>
  <text x="230" y="507" font-family="Segoe UI, Arial, sans-serif" font-size="23" font-weight="700" fill="#ffffff" text-anchor="middle">✓ Testsieger &amp; Empfehlungen</text>
</svg>
`;
}

function q(value) {
  return JSON.stringify(String(value ?? '').trim());
}

function normalizeProduct(product, idx) {
  const rank = Number(product.rank) || idx + 1;
  const ratingRaw = Number(product.rating);
  const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, ratingRaw)) : 4.6;
  const name = String(product.name || `Produkt ${rank}`).trim();

  return {
    rank,
    name,
    badge: String(product.badge || (rank === 1 ? 'Testsieger' : 'Empfehlung')).trim(),
    rating: Number(rating.toFixed(1)),
    priceRange: String(product.priceRange || 'aktuellen Preis prüfen').trim(),
    searchQuery: String(product.searchQuery || name).trim(),
    highlight: String(product.highlight || 'Zuverlässiges Modell im aktuellen Vergleich.').trim(),
    specs: Array.isArray(product.specs) ? product.specs.slice(0, 5).map(String) : [],
    pros: Array.isArray(product.pros) ? product.pros.slice(0, 4).map(String) : ['Solide Verarbeitung'],
    cons: Array.isArray(product.cons) ? product.cons.slice(0, 3).map(String) : ['Preis kann variieren'],
  };
}

export function serializeArticleMarkdown({
  title,
  description,
  pubDate,
  category,
  heroImage,
  keywords,
  readingTime,
  products,
  faqs,
  bodyMarkdown,
}) {
  const lines = [
    '---',
    `title: ${q(title)}`,
    `description: ${q(description)}`,
    `pubDate: ${pubDate}`,
    `updatedDate: ${pubDate}`,
    `category: ${q(category)}`,
    `heroImage: ${q(heroImage)}`,
    'keywords:',
    ...keywords.map((kw) => `  - ${q(kw)}`),
    `readingTime: ${Number(readingTime) || 8}`,
    'products:',
  ];

  for (const p of products) {
    lines.push(`  - rank: ${p.rank}`);
    lines.push(`    name: ${q(p.name)}`);
    lines.push(`    badge: ${q(p.badge)}`);
    lines.push(`    rating: ${p.rating}`);
    lines.push(`    priceRange: ${q(p.priceRange)}`);
    lines.push(`    searchQuery: ${q(p.searchQuery)}`);
    lines.push(`    highlight: ${q(p.highlight)}`);
    lines.push('    specs:');
    for (const s of p.specs) lines.push(`      - ${q(s)}`);
    lines.push('    pros:');
    for (const pro of p.pros) lines.push(`      - ${q(pro)}`);
    lines.push('    cons:');
    for (const con of p.cons) lines.push(`      - ${q(con)}`);
  }

  lines.push('faqs:');
  for (const f of faqs) {
    lines.push(`  - question: ${q(f.question)}`);
    lines.push(`    answer: ${q(f.answer)}`);
  }

  lines.push('---', '', String(bodyMarkdown || '').trim(), '');
  return lines.join('\n');
}

function buildArticlePrompt(topicObj) {
  const today = new Date().toISOString().slice(0, 10);
  const year = new Date().getFullYear();

  return `
Du bist Chefredakteur eines führenden deutschen Verbraucher- und Produktvergleichsportals (wie AllesBeste oder Wirecutter).
Heutiges Datum: ${today}.

THEMA:
- Titel-Idee: "${topicObj.title}"
- Haupt-Keyword: "${topicObj.targetKeyword || topicObj.title}"
- Kategorie: "${topicObj.category}"

DEINE AUFGABE:
Recherchiere (nutze aktuelle Marktdaten für Deutschland / Amazon.de ${year}) 4 bis 5 reale, aktuell gut verfügbare und beliebte Produkte für genau dieses Thema.
Erstelle daraus einen hochwertigen, ehrlichen, extrem hilfreichen deutschen Vergleichsartikel mit hoher Conversion-Stärke.

WICHTIGE QUALITÄTSREGELN:
1. Nenne ausschließlich REAL EXISTIERENDE Markenmodelle (exakte Modellbezeichnung, z. B. "Anker 737 Power Bank (PowerCore 24K)"). Erfinde niemals fiktive Produkte!
2. Vergib realistische Auszeichnungen: Rank 1 = "Testsieger", Rank 2 = "Preis-Leistungs-Sieger", danach z. B. "Premium-Tipp", "Kompakt-Tipp" oder "Spar-Tipp".
3. "searchQuery" muss der exakte Marken- und Modellname für die Suche auf Amazon.de sein (ohne Wörter wie "kaufen" oder "Test").
4. "priceRange" im deutschen Format, z. B. "ca. 79 – 99 €".
5. "bodyMarkdown": Schreibe eine ausführliche, praxisnahe Kaufberatung auf Deutsch (mindestens 900 bis 1.300 Wörter!) mit Markdown-Überschriften (## und ###), Listen und konkreten Kaufkriterien, typischen Fehlkäufen, Pflegetipps und einem klaren Fazit. Verwende im Fließtext KEINE veralteten Jahreszahlen, sondern fokussiere auf zeitlose technische Kriterien und aktuelle Modellstärken.
6. "keywords": Nenne 6 bis 8 spezifische Long-Tail-Keywords (inkl. konkreter Alltagsprobleme, z. B. "Saugroboter für lange Hundehaare ohne Verheddern" oder "Kaffeevollautomat für kleine Küche leise").
7. "faqs": 5 häufige Google-Nutzerfragen ("Nutzer fragen auch" / People Also Ask) mit präzisen, direkten Antworten für Käufer.

Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt in genau dieser Struktur:
{
  "title": "SEO-optimierter Titel (55-75 Zeichen)",
  "description": "Überzeugende Meta-Description (135-160 Zeichen)",
  "keywords": ["Keyword 1", "Long-Tail-Problem 2", "Keyword 3", "Keyword 4", "Keyword 5", "Keyword 6"],
  "readingTime": 8,
  "products": [
    {
      "rank": 1,
      "name": "Exakter Produktname",
      "badge": "Testsieger",
      "rating": 4.9,
      "priceRange": "ca. 129 – 159 €",
      "searchQuery": "Marke Modellnummer",
      "highlight": "1 präziser Satz, für wen dieses Modell optimal ist.",
      "specs": ["Eckdaten 1", "Eckdaten 2", "Eckdaten 3", "Eckdaten 4"],
      "pros": ["Vorteil 1", "Vorteil 2", "Vorteil 3"],
      "cons": ["Nachteil 1", "Nachteil 2"]
    }
  ],
  "faqs": [
    {
      "question": "Konkrete Käuferfrage?",
      "answer": "Klare, hilfreiche Antwort."
    }
  ],
  "bodyMarkdown": "## Worauf kommt es beim Kauf wirklich an?\\n\\n..."
}
`.trim();
}

export async function generateArticle({
  topic,
  category = 'tech-gadgets',
  slug = '',
  dryRun = false,
} = {}) {
  const topicObj =
    typeof topic === 'string'
      ? {
          title: topic,
          targetKeyword: topic,
          category,
          slug: slug || slugifyGerman(topic),
        }
      : {
          ...topic,
          slug: slug || topic?.slug || slugifyGerman(topic?.title || 'produktvergleich'),
          category: topic?.category || category,
        };

  const today = new Date().toISOString().slice(0, 10);
  const articlePath = path.join(ARTICLES_DIR, `${topicObj.slug}.md`);
  const imageRelPath = `/images/articles/${topicObj.slug}.svg`;
  const imageAbsPath = path.join(IMAGES_DIR, `${topicObj.slug}.svg`);

  if (dryRun) {
    const mockMarkdown = serializeArticleMarkdown({
      title: topicObj.title,
      description: `Vergleich und Kaufberatung zum Thema ${topicObj.title} auf Amazon.de.`,
      pubDate: today,
      category: topicObj.category,
      heroImage: imageRelPath,
      keywords: [topicObj.targetKeyword || topicObj.title, 'Vergleich', 'Kaufberatung'],
      readingTime: 8,
      products: [
        normalizeProduct(
          {
            rank: 1,
            name: 'Beispiel Testsieger Modell',
            badge: 'Testsieger',
            rating: 4.9,
            priceRange: 'ca. 99 – 129 €',
            searchQuery: topicObj.targetKeyword || topicObj.title,
            highlight: 'Dry-Run Vorschau für das beste Gesamtmodell.',
            specs: ['Spezifikation A', 'Spezifikation B'],
            pros: ['Starke Gesamtleistung'],
            cons: ['Höherer Preis'],
          },
          0
        ),
      ],
      faqs: [
        {
          question: 'Welches Modell bietet das beste Preis-Leistungs-Verhältnis?',
          answer: 'Im Live-Lauf recherchiert Gemini mit Google Search Grounding 4–5 reale Bestseller.',
        },
      ],
      bodyMarkdown: '## Kaufberatung (Dry-Run Vorschau)\n\nDies ist eine Testvorschau ohne API-Aufruf.',
    });

    return {
      dryRun: true,
      slug: topicObj.slug,
      articlePath,
      imageAbsPath,
      frontmatterValid: mockMarkdown.startsWith('---'),
      promptLength: buildArticlePrompt(topicObj).length,
      topic: topicObj,
    };
  }

  if (!hasGeminiCredentials()) {
    throw new Error(
      'Fehlender GEMINI_API_KEY. Bitte lege eine .env Datei an (siehe .env.example) oder starte mit --dry-run.'
    );
  }

  console.log(`🤖 Generiere Vergleichsartikel für: "${topicObj.title}" (${topicObj.category})...`);
  const prompt = buildArticlePrompt(topicObj);

  const response = await generateWithGemini({
    prompt,
    temperature: 0.45,
    expectJson: true,
  });

  const payload = response.data;
  const products = (Array.isArray(payload.products) ? payload.products : [])
    .map(normalizeProduct)
    .sort((a, b) => a.rank - b.rank);

  if (products.length === 0) {
    throw new Error('Gemini hat keine gültige Produktliste zurückgegeben.');
  }

  const faqs = (Array.isArray(payload.faqs) ? payload.faqs : []).map((f) => ({
    question: String(f.question || '').trim(),
    answer: String(f.answer || '').trim(),
  })).filter((f) => f.question && f.answer);

  const finalTitle = String(payload.title || topicObj.title).trim();
  const markdown = serializeArticleMarkdown({
    title: finalTitle,
    description: String(payload.description || `${finalTitle} – Aktueller Vergleich & Kaufberatung.`).trim(),
    pubDate: today,
    category: topicObj.category,
    heroImage: imageRelPath,
    keywords: Array.isArray(payload.keywords) && payload.keywords.length > 0
      ? payload.keywords.map(String)
      : [topicObj.targetKeyword || finalTitle],
    readingTime: Number(payload.readingTime) || 8,
    products,
    faqs,
    bodyMarkdown: payload.bodyMarkdown || `## Kaufberatung: ${finalTitle}`,
  });

  await fs.mkdir(ARTICLES_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  await fs.writeFile(articlePath, markdown, 'utf8');
  await fs.writeFile(
    imageAbsPath,
    buildArticleHeroSvg({ title: finalTitle, categorySlug: topicObj.category }),
    'utf8'
  );
  const pinResult = await generatePinImage({
    slug: topicObj.slug,
    title: finalTitle,
    categorySlug: topicObj.category,
    products,
  });

  console.log(`✅ Artikel gespeichert: ${articlePath}`);
  console.log(`📌 Pinterest-Pin gespeichert: ${pinResult.pinAbsPath}`);
  console.log(
    `📊 Tokens: ${response.usage.totalTokens} | Geschätzte Kosten: ~${response.usage.estimatedEur.toFixed(5)} € | Search Grounding: ${response.groundingUsed ? 'aktiv' : 'aus'}`
  );

  return {
    dryRun: false,
    slug: topicObj.slug,
    title: finalTitle,
    category: topicObj.category,
    articlePath,
    imageAbsPath,
    pinAbsPath: pinResult.pinAbsPath,
    usage: response.usage,
    groundingUsed: response.groundingUsed,
    productCount: products.length,
  };
}

// Direkter CLI-Aufruf
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const topicArg = args.find((a) => a.startsWith('--topic='));
  const catArg = args.find((a) => a.startsWith('--category='));

  const topic = topicArg ? topicArg.split('=')[1] : 'Beste USB-C Powerbanks 20000 mAh im Vergleich';
  const category = catArg ? catArg.split('=')[1] : 'tech-gadgets';

  const result = await generateArticle({ topic, category, dryRun });
  console.log(JSON.stringify(result, null, 2));
}
