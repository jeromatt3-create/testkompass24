import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { getCategoryBySlug } from '../src/config/site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'content', 'articles');
const PINS_DIR = path.join(ROOT_DIR, 'public', 'images', 'pins');

const PIN_WIDTH = 1000;
const PIN_HEIGHT = 1500;
const FONT_STACK = 'DejaVu Sans, Liberation Sans, Segoe UI, Arial, sans-serif';

function stripEmojis(str) {
  return String(str || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(str) {
  return String(str || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncateText(str, maxLen = 36) {
  const clean = stripEmojis(str);
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 3).trim() + '...';
}

function wrapTitleLines(title, maxCharsPerLine = 23, maxLines = 3) {
  const words = stripEmojis(title).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (lines.length >= maxLines) {
        current = '';
        break;
      }
      current = word.length > maxCharsPerLine ? word.slice(0, maxCharsPerLine - 1) : word;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines) {
    const consumedWords = lines.join(' ').split(/\s+/).length;
    if (consumedWords < words.length) {
      const last = lines[maxLines - 1];
      lines[maxLines - 1] =
        last.length > maxCharsPerLine - 3
          ? last.slice(0, maxCharsPerLine - 3).trim() + '...'
          : `${last}...`;
    }
  }

  return lines.length > 0 ? lines : ['Produktvergleich'];
}

function defaultBadgeForRank(rank) {
  if (rank === 1) return 'Testsieger';
  if (rank === 2) return 'Preis-Leistung';
  return 'Top-Empfehlung';
}

function badgeColorForIndex(index) {
  if (index === 0) return '#059669';
  if (index === 1) return '#0f4c81';
  return '#d97706';
}

export function buildPinSvg({ title, categorySlug, products = [] }) {
  const cat = getCategoryBySlug(categorySlug);
  const accent = cat.accent || '#0f4c81';
  const titleLines = wrapTitleLines(title, 23, 3);
  const topProducts = [...(products || [])]
    .sort((a, b) => (Number(a.rank) || 99) - (Number(b.rank) || 99))
    .slice(0, 3);

  const titleStartY = titleLines.length <= 2 ? 275 : 245;
  const lineHeight = 72;

  const titleSvg = titleLines
    .map((line, i) => {
      const fill = i === titleLines.length - 1 ? '#fde68a' : '#ffffff';
      return `<text x="72" y="${titleStartY + i * lineHeight}" font-family="${FONT_STACK}" font-size="56" font-weight="800" fill="${fill}">${escapeXml(line)}</text>`;
    })
    .join('\n  ');

  const cardsStartY = 505;
  const cardHeight = 228;
  const cardGap = 28;

  const cardsSvg = topProducts
    .map((prod, idx) => {
      const y = cardsStartY + idx * (cardHeight + cardGap);
      const rank = Number(prod.rank) || idx + 1;
      const badgeText = truncateText(prod.badge || defaultBadgeForRank(rank), 28).toUpperCase();
      const badgeColor = badgeColorForIndex(idx);
      const nameText = truncateText(prod.name || `Modell ${rank}`, 44);
      const nameFontSize = nameText.length > 34 ? 29 : 34;
      const ratingNum = Number(prod.rating);
      const ratingStr = Number.isFinite(ratingNum) ? `${ratingNum.toFixed(1)} / 5` : '4.7 / 5';
      const priceText = truncateText(prod.priceRange || 'aktueller Preis', 26);
      const rankLabel = `PLATZ ${rank}  •  ${badgeText}`;
      const pillWidth = Math.min(620, Math.max(250, rankLabel.length * 14 + 44));

      return `
  <g transform="translate(72, ${y})">
    <rect width="856" height="${cardHeight}" rx="22" fill="#ffffff" fill-opacity="0.97"/>
    <rect x="28" y="24" width="${pillWidth}" height="42" rx="21" fill="${badgeColor}"/>
    <text x="${28 + pillWidth / 2}" y="52" font-family="${FONT_STACK}" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(rankLabel)}</text>
    <text x="28" y="122" font-family="${FONT_STACK}" font-size="${nameFontSize}" font-weight="800" fill="#0f172a">${escapeXml(nameText)}</text>
    <line x1="28" y1="152" x2="828" y2="152" stroke="#e2e8f0" stroke-width="2"/>
    <text x="28" y="196" font-family="${FONT_STACK}" font-size="25" font-weight="700" fill="#d97706">Bewertung: ${escapeXml(ratingStr)}</text>
    <text x="828" y="196" font-family="${FONT_STACK}" font-size="25" font-weight="800" fill="#0f4c81" text-anchor="end">${escapeXml(priceText)}</text>
  </g>`;
    })
    .join('\n');

  const categoryLabel = truncateText(cat.name, 26).toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PIN_WIDTH} ${PIN_HEIGHT}" width="${PIN_WIDTH}" height="${PIN_HEIGHT}">
  <defs>
    <linearGradient id="pinBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="58%" stop-color="${escapeXml(accent)}"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect width="${PIN_WIDTH}" height="${PIN_HEIGHT}" fill="url(#pinBg)"/>
  <circle cx="880" cy="140" r="240" fill="#ffffff" opacity="0.06"/>
  <circle cx="110" cy="1360" r="280" fill="#ffffff" opacity="0.05"/>

  <rect x="72" y="72" width="420" height="52" rx="26" fill="#ffffff" opacity="0.16"/>
  <text x="282" y="106" font-family="${FONT_STACK}" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">TESTKOMPASS24  •  VERGLEICH</text>

  <rect x="516" y="72" width="412" height="52" rx="26" fill="#059669"/>
  <text x="722" y="106" font-family="${FONT_STACK}" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(categoryLabel)}</text>

  ${titleSvg}

  <text x="72" y="472" font-family="${FONT_STACK}" font-size="25" font-weight="600" fill="#e2e8f0">Die Top-3 Empfehlungen im direkten Preis-Leistungs-Check:</text>

  ${cardsSvg}

  <rect x="72" y="1310" width="856" height="110" rx="20" fill="#0f172a" fill-opacity="0.88" stroke="#10b981" stroke-width="3"/>
  <text x="500" y="1358" font-family="${FONT_STACK}" font-size="27" font-weight="800" fill="#a7f3d0" text-anchor="middle">Alle Testergebnisse &amp; Preis-Check ansehen</text>
  <text x="500" y="1396" font-family="${FONT_STACK}" font-size="22" font-weight="600" fill="#f8fafc" text-anchor="middle">jetzt vergleichen auf TestKompass24</text>
</svg>
`;
}

export async function generatePinImage({ slug, title, categorySlug, products = [] }) {
  if (!slug) {
    throw new Error('Slug ist erforderlich, um ein Pinterest-Pin-Bild zu erzeugen.');
  }

  await fs.mkdir(PINS_DIR, { recursive: true });
  const svgMarkup = buildPinSvg({ title, categorySlug, products });
  const pinAbsPath = path.join(PINS_DIR, `${slug}.png`);
  const pinRelPath = `/images/pins/${slug}.png`;

  const pngBuffer = await sharp(Buffer.from(svgMarkup, 'utf8')).png({ quality: 90 }).toBuffer();
  await fs.writeFile(pinAbsPath, pngBuffer);

  return {
    slug,
    pinAbsPath,
    pinRelPath,
    bytes: pngBuffer.length,
  };
}

function parseMarkdownFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  return yaml.load(match[1]);
}

export async function generatePinsForAllArticles({ onlySlug = '' } = {}) {
  const files = await fs.readdir(ARTICLES_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md')).sort();
  const results = [];

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, '');
    if (onlySlug && slug !== onlySlug) continue;

    const raw = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const data = parseMarkdownFrontmatter(raw);
    if (!data) {
      console.warn(`⚠️ Konnte Frontmatter in ${file} nicht lesen, überspringe.`);
      continue;
    }

    const res = await generatePinImage({
      slug,
      title: data.title || slug,
      categorySlug: data.category || 'tech-gadgets',
      products: Array.isArray(data.products) ? data.products : [],
    });
    results.push(res);
    console.log(`📌 Pin erstellt: ${res.pinRelPath} (${(res.bytes / 1024).toFixed(1)} KB)`);
  }

  return results;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith('--slug='));
  const onlySlug = slugArg ? slugArg.slice('--slug='.length).trim() : '';

  const generated = await generatePinsForAllArticles({ onlySlug });
  console.log(`✅ ${generated.length} Pinterest-Pin(s) in public/images/pins/ generiert.`);
}
