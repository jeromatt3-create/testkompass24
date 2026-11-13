import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import yaml from 'js-yaml';
import sharp from 'sharp';
import {
  AD_PORTALS,
  GSC_VERIFICATION,
  INDEXNOW_KEY,
  OWNER_LEGAL,
} from './ad-portal-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const WEBSITES_DIR = path.join(ROOT_DIR, 'websites');

function escapeXml(str) {
  return String(str || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripEmojis(str) {
  return String(str || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapLines(text, maxChars = 25, maxLines = 3) {
  const words = stripEmojis(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const cand = current ? `${current} ${word}` : word;
    if (cand.length <= maxChars) {
      current = cand;
    } else {
      if (current) lines.push(current);
      if (lines.length >= maxLines) {
        current = '';
        break;
      }
      current = word.length > maxChars ? word.slice(0, maxChars - 1) : word;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.length > 0 ? lines : ['Ratgeber'];
}

function buildHeroSvg(portal, article) {
  const cat = portal.categories[article.category] || Object.values(portal.categories)[0];
  const lines = wrapLines(article.title, 30, 2);
  const accent = cat?.accent || portal.accentColor;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="${escapeXml(portal.primaryColor)}"/>
      <stop offset="100%" stop-color="${escapeXml(accent)}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1050" cy="120" r="190" fill="#ffffff" opacity="0.06"/>
  <circle cx="140" cy="540" r="220" fill="#ffffff" opacity="0.05"/>
  <rect x="80" y="84" width="380" height="46" rx="23" fill="#ffffff" opacity="0.16"/>
  <text x="270" y="114" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(stripEmojis(cat.name).toUpperCase())}</text>
  <text x="80" y="250" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="50" font-weight="800" fill="#ffffff">${escapeXml(lines[0] || '')}</text>
  <text x="80" y="322" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="50" font-weight="800" fill="#fde68a">${escapeXml(lines[1] || '')}</text>
  <text x="80" y="405" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="26" fill="#e2e8f0">${escapeXml(portal.name)}  •  Praxisnahe Schritt-für-Schritt-Hilfe</text>
  <rect x="80" y="472" width="320" height="58" rx="12" fill="${escapeXml(portal.accentColor)}"/>
  <text x="240" y="509" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="23" font-weight="800" fill="#ffffff" text-anchor="middle">Jetzt Anleitung lesen</text>
</svg>
`;
}

function buildSeedPinSvg(portal, article) {
  const cat = portal.categories[article.category] || Object.values(portal.categories)[0];
  const FONT = 'DejaVu Sans, Liberation Sans, Segoe UI, Arial, sans-serif';
  const titleLines = wrapLines(article.title, 23, 3);
  const titleStartY = titleLines.length <= 2 ? 275 : 245;
  const titleSvg = titleLines
    .map((line, i) => {
      const fill = i === titleLines.length - 1 ? '#fde68a' : '#ffffff';
      return `<text x="72" y="${titleStartY + i * 72}" font-family="${FONT}" font-size="54" font-weight="800" fill="${fill}">${escapeXml(line)}</text>`;
    })
    .join('\n  ');

  const points = (article.steps?.length ? article.steps.map((s) => ({
    label: `SCHRITT ${s.step}`,
    title: s.title,
    sub: s.summary,
  })) : (article.keyTakeaways || []).map((t, i) => ({
    label: `TIPP ${i + 1}`,
    title: t,
    sub: '',
  }))).slice(0, 3);

  const cardsSvg = points
    .map((pt, idx) => {
      const y = 505 + idx * 256;
      const badgeColor = idx === 0 ? portal.accentColor : idx === 1 ? portal.primaryColor : '#0f172a';
      const line1 = wrapLines(pt.title, 36, 1)[0] || '';
      const subLines = wrapLines(pt.sub || pt.title, 44, 2);
      return `
  <g transform="translate(72, ${y})">
    <rect width="856" height="226" rx="22" fill="#ffffff" fill-opacity="0.97"/>
    <rect x="28" y="24" width="210" height="40" rx="20" fill="${badgeColor}"/>
    <text x="133" y="51" font-family="${FONT}" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(pt.label)}</text>
    <text x="28" y="112" font-family="${FONT}" font-size="31" font-weight="800" fill="#0f172a">${escapeXml(line1)}</text>
    <text x="28" y="156" font-family="${FONT}" font-size="23" font-weight="500" fill="#475569">${escapeXml(subLines[0] || '')}</text>
    <text x="28" y="190" font-family="${FONT}" font-size="23" font-weight="500" fill="#475569">${escapeXml(subLines[1] || '')}</text>
  </g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500">
  <defs>
    <linearGradient id="pinBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="56%" stop-color="${escapeXml(portal.primaryColor)}"/>
      <stop offset="100%" stop-color="${escapeXml(cat?.accent || portal.accentColor)}"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1500" fill="url(#pinBg)"/>
  <circle cx="880" cy="140" r="240" fill="#ffffff" opacity="0.06"/>
  <circle cx="110" cy="1360" r="280" fill="#ffffff" opacity="0.05"/>

  <rect x="72" y="72" width="430" height="52" rx="26" fill="#ffffff" opacity="0.16"/>
  <text x="287" y="106" font-family="${FONT}" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(portal.badgeLabel)}</text>

  <rect x="524" y="72" width="404" height="52" rx="26" fill="${escapeXml(portal.accentColor)}"/>
  <text x="726" y="106" font-family="${FONT}" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(stripEmojis(cat.name).toUpperCase())}</text>

  ${titleSvg}

  <text x="72" y="472" font-family="${FONT}" font-size="25" font-weight="600" fill="#e2e8f0">Auf einen Blick – so geht es Schritt für Schritt:</text>

  ${cardsSvg}

  <rect x="72" y="1310" width="856" height="110" rx="20" fill="#0f172a" fill-opacity="0.9" stroke="#fde68a" stroke-width="3"/>
  <text x="500" y="1358" font-family="${FONT}" font-size="27" font-weight="800" fill="#fde68a" text-anchor="middle">Vollständige Anleitung &amp; FAQ lesen</text>
  <text x="500" y="1396" font-family="${FONT}" font-size="22" font-weight="600" fill="#f8fafc" text-anchor="middle">${escapeXml(portal.name)}</text>
</svg>
`;
}

function serializeSeedArticle(portal, article) {
  const frontmatter = {
    title: article.title,
    description: article.description,
    pubDate: article.pubDate,
    updatedDate: article.pubDate,
    category: article.category,
    heroImage: `/images/articles/${article.slug}.svg`,
    keywords: article.keywords,
    readingTime: article.readingTime || 6,
    keyTakeaways: article.keyTakeaways || [],
    steps: article.steps || [],
    faqs: article.faqs || [],
  };

  if (portal.theme === 'fintech-modern') {
    frontmatter.savingPotential = article.savingPotential || '';
    frontmatter.exampleCalculation = article.exampleCalculation || [];
  } else if (portal.theme === 'editorial-warm') {
    frontmatter.servings = article.servings || 2;
    frontmatter.prepMinutes = article.prepMinutes || 20;
    frontmatter.calories = article.calories || '';
    frontmatter.costPerServing = article.costPerServing || '';
    frontmatter.ingredients = article.ingredients || [];
  } else if (portal.theme === 'tech-diagnostic') {
    frontmatter.errorCodes = article.errorCodes || [];
    frontmatter.brands = article.brands || '';
    frontmatter.selfFixLevel = article.selfFixLevel || '';
    frontmatter.timeRequired = article.timeRequired || '';
    frontmatter.savedCost = article.savedCost || '';
  }

  const yamlStr = yaml.dump(frontmatter, { lineWidth: 1000, noRefs: true }).trim();
  return `---\n${yamlStr}\n---\n\n${article.bodyMarkdown.trim()}\n`;
}

async function writePortalFile(portalDir, relPath, content) {
  const abs = path.join(portalDir, relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, 'utf8');
}

function buildGlobalCss(portal) {
  const isWarm = portal.theme === 'editorial-warm';
  const headingFont = isWarm
    ? "Georgia, 'Times New Roman', serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

  return `:root {
  --bg: ${portal.bgColor};
  --surface: ${portal.surfaceColor};
  --surface-alt: ${portal.surfaceAltColor};
  --text: ${portal.textColor};
  --text-muted: ${portal.textMutedColor};
  --border: ${portal.borderColor};
  --primary: ${portal.primaryColor};
  --primary-dark: ${portal.primaryDark};
  --accent: ${portal.accentColor};
  --accent-light: ${portal.accentLight};
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 6px 16px rgba(15, 23, 42, 0.08);
  --radius: ${isWarm ? '16px' : '12px'};
  --container: 1160px;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.65;
}
h1, h2, h3, h4 { font-family: ${headingFont}; }
img { max-width: 100%; height: auto; display: block; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.container { max-width: var(--container); margin: 0 auto; padding: 0 1.25rem; }

/* Header */
.site-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 0.9rem 0;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
  font-size: 1.32rem;
  color: var(--text);
  text-decoration: none;
}
.brand:hover { text-decoration: none; }
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${portal.heroGradient};
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
}
.main-nav { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
.nav-link {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.42rem 0.72rem;
  border-radius: 8px;
}
.nav-link:hover { background: var(--surface-alt); color: var(--primary); text-decoration: none; }

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  background: var(--primary);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.72rem 1.25rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
}
.btn-primary:hover { background: var(--primary-dark); text-decoration: none; }
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--surface);
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  text-decoration: none;
  cursor: pointer;
}
.btn-secondary:hover { background: var(--surface-alt); text-decoration: none; }

/* Hero */
.hero {
  background: ${portal.heroGradient};
  color: #ffffff;
  padding: 3.1rem 0;
  border-bottom: 4px solid var(--accent);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 2rem;
  align-items: center;
}
.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fef08a;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.28rem 0.78rem;
  border-radius: 999px;
  margin-bottom: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.hero h1 { font-size: clamp(1.85rem, 3.4vw, 2.7rem); line-height: 1.18; margin: 0 0 0.9rem; }
.hero p { color: #e2e8f0; font-size: 1.06rem; margin: 0 0 1.4rem; }

/* Sections & Grids */
.section { padding: 2.5rem 0; }
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.4rem;
  flex-wrap: wrap;
}
.section-header h2 { margin: 0; font-size: 1.6rem; }

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
  gap: 1rem;
}
.category-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.15rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: var(--text);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}
.category-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
  text-decoration: none;
}
.category-icon { font-size: 1.65rem; }
.category-card h3 { margin: 0; font-size: 1.05rem; }
.category-card p { margin: 0; font-size: 0.86rem; color: var(--text-muted); }

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.article-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: transform 0.15s, box-shadow 0.15s;
}
.article-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.article-card-media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-alt); }
.article-card-media img { width: 100%; height: 100%; object-fit: cover; }
.article-card-body { padding: 1.2rem; display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
.article-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap; }
.cat-tag {
  background: var(--accent-light);
  color: var(--primary-dark);
  border: 1px solid var(--border);
  font-weight: 700;
  padding: 0.18rem 0.58rem;
  border-radius: 999px;
  font-size: 0.76rem;
}
.article-card h3 { margin: 0; font-size: 1.15rem; line-height: 1.35; }
.article-card h3 a { color: var(--text); }
.article-card p { margin: 0; font-size: 0.9rem; color: var(--text-muted); flex: 1; }
.article-card-footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.84rem;
  font-weight: 600;
}

/* Article Detail */
.article-layout { max-width: 920px; margin: 2rem auto 4rem; }
.breadcrumbs {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.article-header {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.9rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
}
.article-header h1 { font-size: clamp(1.6rem, 3vw, 2.3rem); line-height: 1.22; margin: 0.5rem 0 0.85rem; }
.article-byline {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.88rem;
  color: var(--text-muted);
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

/* Portal-Specific Widgets */
.tool-panel {
  background: var(--surface);
  border: 2px solid var(--primary);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}
.tool-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
.tool-tab {
  padding: 0.5rem 0.95rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface-alt);
  color: var(--text);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
}
.tool-tab.is-active { background: var(--primary); color: #fff; border-color: var(--primary); }
.calc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.9rem; margin-bottom: 1rem; }
.calc-field label { display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.3rem; }
.calc-field input {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.98rem;
  font-weight: 700;
}
.calc-result {
  background: var(--accent-light);
  border: 1px solid var(--accent);
  border-radius: 10px;
  padding: 1rem 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
}

.recipe-meta-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.25rem;
}
.portion-controls { display: flex; gap: 0.45rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center; }
.portion-btn {
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-weight: 700;
  cursor: pointer;
}
.portion-btn.is-active { background: var(--primary); color: #fff; border-color: var(--primary); }
.ingredient-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; }
.ingredient-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: var(--bg);
  cursor: pointer;
}
.ingredient-row.is-checked span { text-decoration: line-through; opacity: 0.55; }

.code-chip {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: #0f172a;
  color: #fde047;
  padding: 0.16rem 0.55rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.diag-search-box {
  display: flex;
  gap: 0.6rem;
  background: #ffffff;
  padding: 0.45rem;
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  margin-top: 1rem;
}
.diag-search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.55rem 0.75rem;
  color: #0f172a;
}

.takeaways-box {
  background: var(--accent-light);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: 10px;
  padding: 1.25rem 1.4rem;
  margin-bottom: 1.5rem;
}
.takeaways-box h2 { margin: 0 0 0.65rem; font-size: 1.15rem; }
.takeaways-box ul { margin: 0; padding-left: 1.2rem; }

.steps-grid { display: grid; gap: 1rem; margin-bottom: 1.8rem; }
.step-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.4rem;
  box-shadow: var(--shadow-sm);
}
.step-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.55rem; }
.step-num {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}
.step-tip {
  margin-top: 0.65rem;
  padding: 0.55rem 0.85rem;
  background: var(--surface-alt);
  border-radius: 8px;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.prose {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.9rem;
  margin-bottom: 1.8rem;
  box-shadow: var(--shadow-sm);
}
.prose h2 { font-size: 1.4rem; margin-top: 1.6rem; margin-bottom: 0.7rem; color: var(--primary-dark); }
.prose h2:first-child { margin-top: 0; }
.prose ul, .prose ol { padding-left: 1.3rem; }

.faq-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.6rem;
  box-shadow: var(--shadow-sm);
}
.faq-section h2 { margin-top: 0; }
.faq-item { border-bottom: 1px solid var(--border); padding: 0.8rem 0; }
.faq-item:last-child { border-bottom: none; }
.faq-item summary {
  font-weight: 700;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-item summary::after { content: '+'; font-size: 1.2rem; color: var(--primary); }
.faq-item[open] summary::after { content: '−'; }
.faq-item p { margin: 0.6rem 0 0; color: var(--text-muted); font-size: 0.94rem; }

/* Footer */
.site-footer { background: #0f172a; color: #cbd5e1; padding: 2.5rem 0 1.8rem; margin-top: 3rem; }
.footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 2rem; margin-bottom: 1.8rem; }
.footer-grid h4 { color: #ffffff; margin: 0 0 0.75rem; }
.footer-links { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
.footer-links a { color: #94a3b8; font-size: 0.9rem; }
.footer-links a:hover { color: #ffffff; }
.footer-bottom { border-top: 1px solid #1e293b; padding-top: 1.2rem; font-size: 0.82rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.4rem; }

@media (max-width: 768px) {
  .hero-grid, .footer-grid { grid-template-columns: 1fr; }
  .article-header, .prose { padding: 1.25rem; }
}
`;
}

function buildQuickCalculatorsAstro() {
  return `---
interface Props {
  compact?: boolean;
}
const { compact = false } = Astro.props;
---

<section class="tool-panel" id="schnellrechner">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.9rem;">
    <h2 style={compact ? 'margin:0;font-size:1.25rem;' : 'margin:0;font-size:1.45rem;'}>Interaktive Alltagsrechner</h2>
    <span class="cat-tag">Sofort-Ergebnis im Browser</span>
  </div>

  <div class="tool-tabs" role="tablist">
    <button type="button" class="tool-tab is-active" data-calc-tab="strom">⚡ Stromkosten</button>
    <button type="button" class="tool-tab" data-calc-tab="pendler">🚗 Pendlerpauschale</button>
    <button type="button" class="tool-tab" data-calc-tab="sparplan">📈 Sparziel &amp; Zins</button>
  </div>

  <div data-calc-panel="strom">
    <div class="calc-grid">
      <div class="calc-field">
        <label for="calc-watt">Leistung (Watt)</label>
        <input id="calc-watt" type="number" min="1" max="25000" value="150" />
      </div>
      <div class="calc-field">
        <label for="calc-hours">Laufzeit (Stunden / Tag)</label>
        <input id="calc-hours" type="number" min="0.1" max="24" step="0.5" value="4" />
      </div>
      <div class="calc-field">
        <label for="calc-price">Strompreis (Cent / kWh)</label>
        <input id="calc-price" type="number" min="5" max="150" step="0.5" value="35" />
      </div>
    </div>
    <div class="calc-result">
      <div><strong>Verbrauch/Jahr:</strong> <span id="out-strom-kwh">219,0 kWh</span></div>
      <div><strong>Kosten/Monat:</strong> <span id="out-strom-month">6,39 €</span></div>
      <div><strong>Kosten/Jahr:</strong> <span id="out-strom-year" style="font-size:1.2rem;font-weight:800;color:var(--primary-dark);">76,65 €</span></div>
    </div>
  </div>

  <div data-calc-panel="pendler" style="display:none;">
    <div class="calc-grid">
      <div class="calc-field">
        <label for="calc-km">Einfache Entfernung (km)</label>
        <input id="calc-km" type="number" min="1" max="300" value="25" />
      </div>
      <div class="calc-field">
        <label for="calc-days">Büro-Arbeitstage / Jahr</label>
        <input id="calc-days" type="number" min="1" max="300" value="210" />
      </div>
      <div class="calc-field">
        <label for="calc-tax">Grenzsteuersatz (ca. %)</label>
        <input id="calc-tax" type="number" min="0" max="45" value="32" />
      </div>
    </div>
    <div class="calc-result">
      <div><strong>Absetzbare Werbungskosten:</strong> <span id="out-pendler-sum">1.659,00 €</span></div>
      <div><strong>Steuerersparnis (oberhalb 1.230 €):</strong> <span id="out-pendler-save" style="font-size:1.15rem;font-weight:800;color:var(--primary-dark);">ca. 137,28 €</span></div>
    </div>
  </div>

  <div data-calc-panel="sparplan" style="display:none;">
    <div class="calc-grid">
      <div class="calc-field">
        <label for="calc-rate">Monatliche Sparrate (€)</label>
        <input id="calc-rate" type="number" min="10" max="10000" value="150" />
      </div>
      <div class="calc-field">
        <label for="calc-years">Laufzeit (Jahre)</label>
        <input id="calc-years" type="number" min="1" max="50" value="10" />
      </div>
      <div class="calc-field">
        <label for="calc-yield">Rendite (% p.a.)</label>
        <input id="calc-yield" type="number" min="0" max="15" step="0.5" value="5" />
      </div>
    </div>
    <div class="calc-result">
      <div><strong>Eigene Einzahlung:</strong> <span id="out-spar-in">18.000 €</span></div>
      <div><strong>Zinsgewinn:</strong> <span id="out-spar-gain">5.292 €</span></div>
      <div><strong>Endkapital:</strong> <span id="out-spar-total" style="font-size:1.2rem;font-weight:800;color:var(--primary-dark);">23.292 €</span></div>
    </div>
  </div>
</section>

<script>
  const tabs = document.querySelectorAll('[data-calc-tab]');
  const panels = document.querySelectorAll('[data-calc-panel]');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-calc-tab');
      tabs.forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.forEach((p) => {
        (p as HTMLElement).style.display = p.getAttribute('data-calc-panel') === target ? 'block' : 'none';
      });
    });
  });

  const fmtEur = (v: number) => v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  function updateAll() {
    const watt = Number((document.getElementById('calc-watt') as HTMLInputElement)?.value || 0);
    const hours = Number((document.getElementById('calc-hours') as HTMLInputElement)?.value || 0);
    const cent = Number((document.getElementById('calc-price') as HTMLInputElement)?.value || 0);
    const kwh = (watt / 1000) * hours * 365;
    const costYear = kwh * (cent / 100);
    const kwhEl = document.getElementById('out-strom-kwh');
    const monthEl = document.getElementById('out-strom-month');
    const yearEl = document.getElementById('out-strom-year');
    if (kwhEl) kwhEl.textContent = kwh.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' kWh';
    if (monthEl) monthEl.textContent = fmtEur(costYear / 12);
    if (yearEl) yearEl.textContent = fmtEur(costYear);

    const km = Number((document.getElementById('calc-km') as HTMLInputElement)?.value || 0);
    const days = Number((document.getElementById('calc-days') as HTMLInputElement)?.value || 0);
    const tax = Number((document.getElementById('calc-tax') as HTMLInputElement)?.value || 0);
    const perDay = Math.min(km, 20) * 0.30 + Math.max(0, km - 20) * 0.38;
    const pendlerSum = perDay * days;
    const overThreshold = Math.max(0, pendlerSum - 1230);
    const taxSave = overThreshold * (tax / 100);
    const pSumEl = document.getElementById('out-pendler-sum');
    const pSaveEl = document.getElementById('out-pendler-save');
    if (pSumEl) pSumEl.textContent = fmtEur(pendlerSum);
    if (pSaveEl) pSaveEl.textContent = 'ca. ' + fmtEur(taxSave);

    const rate = Number((document.getElementById('calc-rate') as HTMLInputElement)?.value || 0);
    const years = Number((document.getElementById('calc-years') as HTMLInputElement)?.value || 0);
    const yld = Number((document.getElementById('calc-yield') as HTMLInputElement)?.value || 0) / 100 / 12;
    const months = years * 12;
    const paid = rate * months;
    const total = yld > 0 ? rate * ((Math.pow(1 + yld, months) - 1) / yld) : paid;
    const gain = Math.max(0, total - paid);
    const sIn = document.getElementById('out-spar-in');
    const sGain = document.getElementById('out-spar-gain');
    const sTot = document.getElementById('out-spar-total');
    if (sIn) sIn.textContent = Math.round(paid).toLocaleString('de-DE') + ' €';
    if (sGain) sGain.textContent = Math.round(gain).toLocaleString('de-DE') + ' €';
    if (sTot) sTot.textContent = Math.round(total).toLocaleString('de-DE') + ' €';
  }

  document.querySelectorAll('#schnellrechner input').forEach((inp) => {
    inp.addEventListener('input', updateAll);
  });
  updateAll();
</script>
`;
}

function buildRecipeBoxAstro() {
  return `---
interface Ingredient {
  amount: number;
  unit: string;
  item: string;
}
interface Props {
  servings?: number;
  prepMinutes?: number;
  calories?: string;
  costPerServing?: string;
  ingredients?: Ingredient[];
}
const {
  servings = 2,
  prepMinutes = 20,
  calories = '',
  costPerServing = '',
  ingredients = [],
} = Astro.props;
---

<section class="tool-panel" id="rezept-zutaten" style="margin-bottom:1.75rem;">
  <div class="recipe-meta-strip">
    <div><strong>⏱️ Zubereitungszeit:</strong><br />ca. {prepMinutes} Min.</div>
    <div><strong>🍽️ Basis-Portionen:</strong><br /><span id="active-servings">{servings}</span> Portionen</div>
    {calories && <div><strong>🔥 Energie:</strong><br />{calories} / Portion</div>}
    {costPerServing && <div><strong>💶 Kosten:</strong><br />{costPerServing} / Portion</div>}
  </div>

  {
    ingredients.length > 0 && (
      <div>
        <div class="portion-controls" data-base-servings={servings}>
          <span style="font-weight:700;font-size:0.9rem;margin-right:0.3rem;">Portionen umrechnen:</span>
          {[1, 2, 4, 6].map((cnt) => (
            <button
              type="button"
              class={cnt === servings ? 'portion-btn is-active' : 'portion-btn'}
              data-set-servings={cnt}
            >
              {cnt} {cnt === 1 ? 'Portion' : 'Portionen'}
            </button>
          ))}
        </div>

        <h3 style="margin:0.5rem 0 0.75rem;">Zutatenliste (zum Abhaken beim Kochen)</h3>
        <ul class="ingredient-list">
          {ingredients.map((ing) => (
            <li>
              <label class="ingredient-row">
                <input type="checkbox" class="ing-check" />
                <span>
                  <strong data-base-amount={ing.amount}>{ing.amount}</strong> {ing.unit} {ing.item}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
</section>

<script>
  const controls = document.querySelector('.portion-controls');
  const baseServings = Number(controls?.getAttribute('data-base-servings') || 2);
  const buttons = document.querySelectorAll('[data-set-servings]');
  const activeLabel = document.getElementById('active-servings');
  const amounts = document.querySelectorAll('[data-base-amount]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.getAttribute('data-set-servings') || baseServings);
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      if (activeLabel) activeLabel.textContent = String(target);
      const factor = target / baseServings;
      amounts.forEach((el) => {
        const baseVal = Number(el.getAttribute('data-base-amount') || 0);
        const scaled = Math.round(baseVal * factor * 10) / 10;
        el.textContent = scaled.toLocaleString('de-DE');
      });
    });
  });

  document.querySelectorAll('.ing-check').forEach((chk) => {
    chk.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      input.closest('.ingredient-row')?.classList.toggle('is-checked', input.checked);
    });
  });
</script>
`;
}

function buildDiagnosticCardAstro() {
  return `---
interface Props {
  errorCodes?: string[];
  brands?: string;
  selfFixLevel?: string;
  timeRequired?: string;
  savedCost?: string;
}
const {
  errorCodes = [],
  brands = '',
  selfFixLevel = 'Selbst prüfbar',
  timeRequired = 'ca. 15 Min.',
  savedCost = 'Techniker-Anfahrt gespart',
} = Astro.props;
---

<section class="tool-panel" style="margin-bottom:1.75rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;margin-bottom:0.9rem;">
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
      <strong style="font-size:0.9rem;">Betroffene Codes:</strong>
      {errorCodes.map((c) => <span class="code-chip">{c}</span>)}
    </div>
    {brands && <span style="font-size:0.86rem;color:var(--text-muted);"><strong>Marken:</strong> {brands}</span>}
  </div>

  <div class="recipe-meta-strip" style="margin-bottom:0;">
    <div><strong>🚦 Selbsthilfe-Status:</strong><br />{selfFixLevel}</div>
    <div><strong>⏱️ Zeitaufwand:</strong><br />{timeRequired}</div>
    <div><strong>💶 Mögliche Ersparnis:</strong><br />{savedCost}</div>
  </div>
</section>
`;
}

function buildIndexAstro(portal) {
  const isFintech = portal.theme === 'fintech-modern';
  const isRecipe = portal.theme === 'editorial-warm';
  const isDiag = portal.theme === 'tech-diagnostic';

  const quickImport = isFintech
    ? "import QuickCalculators from '../components/QuickCalculators.astro';"
    : '';

  const heroRightBlock = isFintech
    ? `
      <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:1.35rem;display:grid;gap:0.85rem;">
        <div><strong>🧾 Klare Rechenwege</strong><br /><span style="font-size:0.88rem;color:#cbd5e1;">Jeder Ratgeber zeigt dir Pauschalen und Euro-Beispiele.</span></div>
        <div><strong>⚡ Live-Rechner inklusive</strong><br /><span style="font-size:0.88rem;color:#cbd5e1;">Strom, Arbeitsweg und Sparpläne direkt durchrechnen.</span></div>
        <div><strong>🏛️ Kostenlos &amp; aktuell</strong><br /><span style="font-size:0.88rem;color:#cbd5e1;">Freibeträge und Zuschüsse auf dem aktuellen Stand.</span></div>
      </div>`
    : isRecipe
    ? `
      <div style="background:rgba(255,255,255,0.11);border:1px solid rgba(255,255,255,0.22);border-radius:14px;padding:1.35rem;display:grid;gap:0.85rem;">
        <div><strong>⏱️ Maximal 25 Minuten</strong><br /><span style="font-size:0.88rem;color:#fef3c7;">Rezepte, die nach einem langen Arbeitstag sofort gelingen.</span></div>
        <div><strong>🍽️ Portions-Umrechner</strong><br /><span style="font-size:0.88rem;color:#fef3c7;">Mit einem Klick für 1, 2, 4 oder 6 Personen skalieren.</span></div>
        <div><strong>🥘 Wenig Abwasch</strong><br /><span style="font-size:0.88rem;color:#fef3c7;">One-Pot, Pfanne &amp; Airfryer mit Supermarkt-Zutaten.</span></div>
      </div>`
    : `
      <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:1.35rem;">
        <strong style="display:block;margin-bottom:0.5rem;">Häufig gesuchte Fehlercodes:</strong>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.8rem;">
          {['E18', 'E15', 'F.28', 'E24', 'WLAN', 'Update'].map((code) => (
            <button type="button" class="code-chip quick-code-btn" data-code={code} style="border:none;cursor:pointer;padding:0.32rem 0.7rem;">
              {code}
            </button>
          ))}
        </div>
        <div style="font-size:0.85rem;color:#cbd5e1;">
          Klicke einen Code an oder nutze das Suchfeld links, um sofort die passende Selbsthilfe-Anleitung anzuzeigen.
        </div>
      </div>`;

  const searchInHero = isDiag
    ? `
        <div class="diag-search-box">
          <input id="diag-search" type="search" placeholder="Fehlercode oder Problem eingeben (z. B. E18, E15, F.28, pumpt nicht)..." aria-label="Fehlercode suchen" />
          <a href="#alle-beitraege" class="btn-primary">Suchen</a>
        </div>`
    : `
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <a href="#alle-beitraege" class="btn-primary">${isRecipe ? 'Alle Rezepte entdecken ↓' : 'Aktuelle Ratgeber ansehen ↓'}</a>
          <a href={withBase('/ueber-uns/')} class="btn-secondary">Unsere Methodik</a>
        </div>`;

  const middleToolSection = isFintech
    ? `
  <section class="section" style="padding-bottom: 0.5rem;">
    <div class="container">
      <QuickCalculators />
    </div>
  </section>`
    : '';

  const diagFilterScript = isDiag
    ? `
<script>
  const searchInput = document.getElementById('diag-search') as HTMLInputElement | null;
  const cards = document.querySelectorAll('[data-diag-card]');
  const statusEl = document.getElementById('diag-filter-status');

  function applyFilter(query: string) {
    const q = query.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const hay = (card.getAttribute('data-search') || '').toLowerCase();
      const match = !q || hay.includes(q);
      (card as HTMLElement).style.display = match ? 'flex' : 'none';
      if (match) visible++;
    });
    if (statusEl) {
      statusEl.textContent = q
        ? visible + ' Diagnose(n) für „' + query.trim() + '“ gefunden'
        : cards.length + ' Fehlercode-Anleitungen verfügbar';
    }
  }

  searchInput?.addEventListener('input', () => applyFilter(searchInput.value));
  document.querySelectorAll('.quick-code-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-code') || '';
      if (searchInput) searchInput.value = c;
      applyFilter(c);
      document.getElementById('alle-beitraege')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
</script>`
    : '';

  return `---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import AdSlot from '../components/AdSlot.astro';
import { SITE_CONFIG, getCategoryList, getCategoryBySlug } from '../config/site.config.mjs';
import { withBase } from '../utils/url.js';
${quickImport}

const allArticles = await getCollection('articles');
const articles = allArticles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
const categories = getCategoryList();
---

<BaseLayout>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="hero-badge">${escapeXml(portal.name)} • Aktuell {new Date().getFullYear()}</span>
        <h1>${escapeXml(portal.heroHeadline)}</h1>
        <p>${escapeXml(portal.heroSubline)}</p>
        ${searchInHero}
      </div>
      ${heroRightBlock}
    </div>
  </section>

  ${middleToolSection}

  <section class="section">
    <div class="container">
      <div class="section-header">
        <h2>Themenbereiche</h2>
        <span style="color:var(--text-muted);font-size:0.9rem;">{articles.length} Beiträge in {categories.length} Rubriken</span>
      </div>
      <div class="category-grid">
        {categories.map((cat) => (
          <a href={withBase(\`/kategorie/\${cat.slug}/\`) } class="category-card">
            <span class="category-icon">{cat.icon}</span>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </a>
        ))}
      </div>
    </div>
  </section>

  <AdSlot placement="header" />

  <section class="section" id="alle-beitraege">
    <div class="container">
      <div class="section-header">
        <h2>${isRecipe ? 'Neueste Feierabend-Rezepte' : isDiag ? 'Alle Fehlercodes & Soforthilfen' : 'Aktuelle Ratgeber & Rechenbeispiele'}</h2>
        <span id="diag-filter-status" style="color:var(--text-muted);font-size:0.9rem;">{articles.length} Einträge</span>
      </div>

      <div class="articles-grid">
        {articles.map((article) => {
          const cat = getCategoryBySlug(article.data.category);
          const dateStr = article.data.pubDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' });
          const searchBlob = [
            article.data.title,
            article.data.description,
            article.data.brands || '',
            ...(article.data.errorCodes || []),
            ...(article.data.keywords || []),
          ].join(' ');
          return (
            <article class="article-card" data-diag-card data-search={searchBlob}>
              <a href={withBase(\`/artikel/\${article.id}/\`) } class="article-card-media">
                {article.data.heroImage && <img src={withBase(article.data.heroImage)} alt={article.data.title} loading="lazy" />}
              </a>
              <div class="article-card-body">
                <div class="article-meta-row">
                  <span class="cat-tag">{cat.icon} {cat.name}</span>
                  <span>{dateStr}</span>
                </div>
                {article.data.errorCodes && article.data.errorCodes.length > 0 && (
                  <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
                    {article.data.errorCodes.slice(0, 3).map((code) => <span class="code-chip">{code}</span>)}
                  </div>
                )}
                {article.data.prepMinutes && (
                  <div style="display:flex;gap:0.6rem;font-size:0.82rem;color:var(--primary-dark);font-weight:700;">
                    <span>⏱️ {article.data.prepMinutes} Min.</span>
                    {article.data.costPerServing && <span>💶 {article.data.costPerServing}</span>}
                  </div>
                )}
                {article.data.savingPotential && (
                  <div style="font-size:0.82rem;color:var(--primary-dark);font-weight:700;">
                    💡 Potenzial: {article.data.savingPotential}
                  </div>
                )}
                <h3><a href={withBase(\`/artikel/\${article.id}/\`) }>{article.data.title}</a></h3>
                <p>{article.data.description}</p>
                <div class="article-card-footer">
                  <span>{article.data.readingTime || 6} Min. Lesezeit</span>
                  <a href={withBase(\`/artikel/\${article.id}/\`) }>${isRecipe ? 'Zum Rezept →' : isDiag ? 'Zur Lösung →' : 'Ratgeber lesen →'}</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
</BaseLayout>
${diagFilterScript}
`;
}

function buildArticleDetailAstro(portal) {
  const isFintech = portal.theme === 'fintech-modern';
  const isRecipe = portal.theme === 'editorial-warm';
  const isDiag = portal.theme === 'tech-diagnostic';

  const specialImport = isFintech
    ? "import QuickCalculators from '../../components/QuickCalculators.astro';"
    : isRecipe
    ? "import RecipeBox from '../../components/RecipeBox.astro';"
    : "import DiagnosticCard from '../../components/DiagnosticCard.astro';";

  const specialComponentBlock = isFintech
    ? `{entry.data.exampleCalculation && entry.data.exampleCalculation.length > 0 && (
      <section class="tool-panel" style="margin-bottom:1.6rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.85rem;">
          <h2 style="margin:0;font-size:1.25rem;">Beispielrechnung auf einen Blick</h2>
          {entry.data.savingPotential && <span class="cat-tag">{entry.data.savingPotential}</span>}
        </div>
        <div class="recipe-meta-strip" style="margin-bottom:0;">
          {entry.data.exampleCalculation.map((row) => (
            <div><strong>{row.label}:</strong><br />{row.value}</div>
          ))}
        </div>
      </section>
    )}`
    : isRecipe
    ? `<RecipeBox
      servings={entry.data.servings}
      prepMinutes={entry.data.prepMinutes}
      calories={entry.data.calories}
      costPerServing={entry.data.costPerServing}
      ingredients={entry.data.ingredients || []}
    />`
    : `<DiagnosticCard
      errorCodes={entry.data.errorCodes || []}
      brands={entry.data.brands}
      selfFixLevel={entry.data.selfFixLevel}
      timeRequired={entry.data.timeRequired}
      savedCost={entry.data.savedCost}
    />`;

  const extraFintechBottom = isFintech
    ? `<div style="margin-bottom:1.8rem;"><QuickCalculators compact={true} /></div>`
    : '';

  return `---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import AdSlot from '../../components/AdSlot.astro';
import KeyTakeaways from '../../components/KeyTakeaways.astro';
import StepByStep from '../../components/StepByStep.astro';
import FaqSection from '../../components/FaqSection.astro';
import RelatedArticles from '../../components/RelatedArticles.astro';
import { getCategoryBySlug } from '../../config/site.config.mjs';
import { withBase } from '../../utils/url.js';
${specialImport}

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const category = getCategoryBySlug(entry.data.category);
const pubDateStr = entry.data.pubDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
const updatedDate = entry.data.updatedDate || entry.data.pubDate;

const jsonLd: Array<Record<string, unknown>> = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.data.title,
    description: entry.data.description,
    datePublished: entry.data.pubDate.toISOString(),
    dateModified: updatedDate.toISOString(),
    inLanguage: 'de-DE',
  },
];

${isRecipe ? `if (entry.data.ingredients && entry.data.ingredients.length > 0) {
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: entry.data.title,
    description: entry.data.description,
    totalTime: 'PT' + (entry.data.prepMinutes || 20) + 'M',
    recipeYield: (entry.data.servings || 2) + ' Portionen',
    recipeIngredient: entry.data.ingredients.map((i) => i.amount + ' ' + i.unit + ' ' + i.item),
    recipeInstructions: (entry.data.steps || []).map((s) => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.summary,
    })),
  });
}` : `if (entry.data.steps && entry.data.steps.length > 0) {
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: entry.data.title,
    description: entry.data.description,
    step: entry.data.steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.step,
      name: s.title,
      text: s.summary,
    })),
  });
}`}

if (entry.data.faqs && entry.data.faqs.length > 0) {
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  });
}
---

<BaseLayout title={entry.data.title} description={entry.data.description} jsonLd={jsonLd}>
  <div class="container article-layout">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href={withBase('/')}>Startseite</a>
      <span>›</span>
      <a href={withBase(\`/kategorie/\${category.slug}/\`) }>{category.icon} {category.name}</a>
      <span>›</span>
      <span>{entry.data.title}</span>
    </nav>

    <header class="article-header">
      <span class="cat-tag">{category.icon} {category.name}</span>
      <h1>{entry.data.title}</h1>
      <p style="font-size:1.06rem;color:var(--text-muted);margin:0 0 1rem;">{entry.data.description}</p>

      {entry.data.heroImage && (
        <div style="margin:1rem 0 1.2rem;border-radius:10px;overflow:hidden;border:1px solid var(--border);">
          <img src={withBase(entry.data.heroImage)} alt={entry.data.title} />
        </div>
      )}

      <div class="article-byline">
        <span>📅 Stand: {pubDateStr}</span>
        <span>⏱️ Lesezeit: ca. {entry.data.readingTime || 6} Min.</span>
      </div>
    </header>

    <KeyTakeaways items={entry.data.keyTakeaways || []} />

    ${specialComponentBlock}

    <AdSlot placement="in-article" />

    <StepByStep steps={entry.data.steps || []} heading="${isRecipe ? 'Zubereitung Schritt für Schritt' : isDiag ? 'Lösung & Diagnose Schritt für Schritt' : 'Schritt-für-Schritt-Anleitung'}" />

    ${extraFintechBottom}

    <section class="prose" id="hintergrund">
      <Content />
    </section>

    <FaqSection faqs={entry.data.faqs || []} />

    <AdSlot placement="footer" />

    <RelatedArticles currentSlug={entry.id} categorySlug={entry.data.category} />
  </div>
</BaseLayout>
`;
}

function buildGenerateArticleScript(portal) {
  const themePromptExtra =
    portal.theme === 'fintech-modern'
      ? `3. "savingPotential": kurze Angabe wie "ca. 150 – 350 € / Jahr".
4. "exampleCalculation": genau 4 kompakte Rechen-Eckdaten (label + value) als konkretes Rechenbeispiel für Deutschland.
5. "keyTakeaways": 3 prägnante Kernaussagen.
6. "steps": 3 klare Handlungsschritte (step, title, summary, tip).`
      : portal.theme === 'editorial-warm'
      ? `3. "servings": Zahl (z. B. 2).
4. "prepMinutes": realistische Gesamtdauer in Minuten als Zahl (z. B. 20).
5. "calories": z. B. "ca. 510 kcal".
6. "costPerServing": z. B. "ca. 2,40 €".
7. "ingredients": 6 bis 8 reale Supermarkt-Zutaten mit NUMERISCHER "amount" (z. B. 250, 1.5), "unit" (g, ml, EL, Stück) und "item".
8. "keyTakeaways": 3 kurze Küchen-Highlights.
9. "steps": 3 konkrete Kochschritte (step, title, summary, tip).`
      : `3. "errorCodes": 1 bis 4 betroffene Fehlercodes als Array (z. B. ["E24", "E25"]).
4. "brands": betroffene Marken (z. B. "Bosch, Siemens, Neff").
5. "selfFixLevel": z. B. "Grün: Selbst ohne Werkzeug lösbar" oder "Gelb: Äußere Prüfung – bei Gas/Starkstrom Fachbetrieb".
6. "timeRequired": z. B. "ca. 15 – 20 Min.".
7. "savedCost": z. B. "ca. 90 – 160 € Techniker-Anfahrt".
8. "keyTakeaways": 3 wichtige Diagnose-Fakten.
9. "steps": 3 sichere Prüfschritte mit Warnhinweis (Strom/Wasser/Gas beachten!).`;

  const jsonShape =
    portal.theme === 'fintech-modern'
      ? `"savingPotential": "ca. 150 € / Jahr",
  "exampleCalculation": [{ "label": "Pauschale", "value": "Wert" }],`
      : portal.theme === 'editorial-warm'
      ? `"servings": 2,
  "prepMinutes": 18,
  "calories": "ca. 510 kcal",
  "costPerServing": "ca. 2,50 €",
  "ingredients": [{ "amount": 250, "unit": "g", "item": "Zutat" }],`
      : `"errorCodes": ["E24", "E25"],
  "brands": "Bosch, Siemens, Neff",
  "selfFixLevel": "Grün: Meist selbst lösbar",
  "timeRequired": "ca. 15 Min.",
  "savedCost": "ca. 90 – 150 € Kundendienst",`;

  return `import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import yaml from 'js-yaml';
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

function splitTitleTwoLines(title, maxChars = 30) {
  const words = String(title || '').split(/\\s+/);
  let line1 = '';
  let line2 = '';
  for (const word of words) {
    if ((line1 + ' ' + word).trim().length <= maxChars && !line2) {
      line1 = (line1 + ' ' + word).trim();
    } else {
      line2 = (line2 + ' ' + word).trim();
    }
  }
  if (line2.length > 34) line2 = line2.slice(0, 31).trim() + '...';
  return [line1 || title.slice(0, maxChars), line2];
}

export function buildArticleHeroSvg({ title, categorySlug }) {
  const cat = getCategoryBySlug(categorySlug);
  const accent = cat.accent || '${portal.accentColor}';
  const [line1, line2] = splitTitleTwoLines(title);
  const cleanCat = cat.name.replace(/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\uFE0F]/gu, '').trim().toUpperCase();

  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="${portal.primaryColor}"/>
      <stop offset="100%" stop-color="\${escapeXml(accent)}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1040" cy="140" r="190" fill="#ffffff" opacity="0.06"/>
  <circle cx="160" cy="520" r="210" fill="#ffffff" opacity="0.05"/>
  <rect x="80" y="86" width="380" height="46" rx="23" fill="#ffffff" opacity="0.16"/>
  <text x="270" y="116" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">\${escapeXml(cleanCat)}</text>
  <text x="80" y="250" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="50" font-weight="800" fill="#ffffff">\${escapeXml(line1)}</text>
  <text x="80" y="322" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="50" font-weight="800" fill="#fde68a">\${escapeXml(line2)}</text>
  <text x="80" y="405" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="26" fill="#e2e8f0">${portal.name}  •  Praxisnahe Schritt-für-Schritt-Hilfe</text>
  <rect x="80" y="472" width="320" height="58" rx="12" fill="${portal.accentColor}"/>
  <text x="240" y="509" font-family="DejaVu Sans, Segoe UI, Arial, sans-serif" font-size="23" font-weight="800" fill="#ffffff" text-anchor="middle">Jetzt Anleitung lesen</text>
</svg>
\`;
}

function buildPrompt(topicObj) {
  const today = new Date().toISOString().slice(0, 10);
  return \`
Du bist Chefredakteur für das deutsche Online-Magazin "${portal.name}" (${portal.tagline}).
Heutiges Datum: \${today}.
THEMA: "\${topicObj.title}" | Keyword: "\${topicObj.targetKeyword || topicObj.title}" | Kategorie: "\${topicObj.category}".

AUFGABE:
Recherchiere aktuelle, verlässliche Fakten für Deutschland (ohne Erfinden fiktiver Gesetze/Werte) und schreibe einen extrem hilfreichen deutschen Ratgeber (keine Produktwerbung, keine Affiliate-Links!).
${themePromptExtra}
- "bodyMarkdown": ausführlicher, klar gegliederter Praxis-Text auf Deutsch (mind. 750–1.000 Wörter) mit ## Überschriften und Listen.
- "faqs": 3–4 echte Nutzerfragen mit klaren Antworten.

Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt:
{
  "title": "Prägnanter SEO-Titel (55-75 Zeichen)",
  "description": "Überzeugende Meta-Description (130-160 Zeichen)",
  "keywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"],
  "readingTime": 6,
  ${jsonShape}
  "keyTakeaways": ["Fakt 1", "Fakt 2", "Fakt 3"],
  "steps": [
    { "step": 1, "title": "Titel", "summary": "Was zu tun ist.", "tip": "Konkreter Praxistipp." },
    { "step": 2, "title": "Titel", "summary": "Was zu tun ist.", "tip": "Konkreter Praxistipp." },
    { "step": 3, "title": "Titel", "summary": "Was zu tun ist.", "tip": "Konkreter Praxistipp." }
  ],
  "faqs": [
    { "question": "Häufige Frage?", "answer": "Klare Antwort." }
  ],
  "bodyMarkdown": "## Hintergrund & Grundlagen\\n\\n..."
}
\`.trim();
}

export async function generateArticle({ topic, category = '', slug = '', dryRun = false } = {}) {
  const fallbackCat = Object.keys(${JSON.stringify(portal.categories)})[0];
  const topicObj = typeof topic === 'string'
    ? { title: topic, targetKeyword: topic, category: category || fallbackCat, slug: slug || slugifyGerman(topic) }
    : { ...topic, slug: slug || topic?.slug || slugifyGerman(topic?.title || 'ratgeber'), category: topic?.category || category || fallbackCat };

  const today = new Date().toISOString().slice(0, 10);
  const articlePath = path.join(ARTICLES_DIR, \`\${topicObj.slug}.md\`);
  const imageRelPath = \`/images/articles/\${topicObj.slug}.svg\`;
  const imageAbsPath = path.join(IMAGES_DIR, \`\${topicObj.slug}.svg\`);

  if (dryRun) {
    return { dryRun: true, slug: topicObj.slug, articlePath, imageAbsPath, frontmatterValid: true, promptLength: buildPrompt(topicObj).length, topic: topicObj };
  }
  if (!hasGeminiCredentials()) throw new Error('Fehlender GEMINI_API_KEY.');

  console.log(\`🤖 Generiere Beitrag für "${portal.name}": "\${topicObj.title}" (\${topicObj.category})...\`);
  const response = await generateWithGemini({ prompt: buildPrompt(topicObj), temperature: 0.45, expectJson: true });
  const p = response.data || {};
  const finalTitle = String(p.title || topicObj.title).trim();

  const fm = {
    title: finalTitle,
    description: String(p.description || finalTitle).trim(),
    pubDate: today,
    updatedDate: today,
    category: topicObj.category,
    heroImage: imageRelPath,
    keywords: Array.isArray(p.keywords) && p.keywords.length ? p.keywords.map(String) : [topicObj.targetKeyword || finalTitle],
    readingTime: Number(p.readingTime) || 6,
    keyTakeaways: Array.isArray(p.keyTakeaways) ? p.keyTakeaways.slice(0, 4).map(String) : [],
    steps: Array.isArray(p.steps) ? p.steps.slice(0, 6).map((s, idx) => ({
      step: Number(s.step) || idx + 1,
      title: String(s.title || \`Schritt \${idx + 1}\`),
      summary: String(s.summary || ''),
      tip: String(s.tip || ''),
    })) : [],
    faqs: Array.isArray(p.faqs) ? p.faqs.filter((f) => f.question && f.answer).map((f) => ({
      question: String(f.question),
      answer: String(f.answer),
    })) : [],
  };

  if ('${portal.theme}' === 'fintech-modern') {
    fm.savingPotential = String(p.savingPotential || '');
    fm.exampleCalculation = Array.isArray(p.exampleCalculation)
      ? p.exampleCalculation.slice(0, 4).map((r) => ({ label: String(r.label || ''), value: String(r.value || '') }))
      : [];
  } else if ('${portal.theme}' === 'editorial-warm') {
    fm.servings = Number(p.servings) || 2;
    fm.prepMinutes = Number(p.prepMinutes) || 20;
    fm.calories = String(p.calories || '');
    fm.costPerServing = String(p.costPerServing || '');
    fm.ingredients = Array.isArray(p.ingredients)
      ? p.ingredients.slice(0, 12).map((i) => ({
          amount: Number(i.amount) || 1,
          unit: String(i.unit || 'Stück'),
          item: String(i.item || ''),
        }))
      : [];
  } else if ('${portal.theme}' === 'tech-diagnostic') {
    fm.errorCodes = Array.isArray(p.errorCodes) ? p.errorCodes.slice(0, 5).map(String) : [];
    fm.brands = String(p.brands || '');
    fm.selfFixLevel = String(p.selfFixLevel || 'Selbst prüfbar');
    fm.timeRequired = String(p.timeRequired || 'ca. 15 Min.');
    fm.savedCost = String(p.savedCost || '');
  }

  const md = \`---\\n\${yaml.dump(fm, { lineWidth: 1000, noRefs: true }).trim()}\\n---\\n\\n\${String(p.bodyMarkdown || '').trim()}\\n\`;

  await fs.mkdir(ARTICLES_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.writeFile(articlePath, md, 'utf8');
  await fs.writeFile(imageAbsPath, buildArticleHeroSvg({ title: finalTitle, categorySlug: topicObj.category }), 'utf8');

  const pinRes = await generatePinImage({
    slug: topicObj.slug,
    title: finalTitle,
    categorySlug: topicObj.category,
    steps: fm.steps,
    keyTakeaways: fm.keyTakeaways,
  });

  console.log(\`✅ Artikel gespeichert: \${articlePath}\`);
  console.log(\`📌 Pinterest-Pin gespeichert: \${pinRes.pinAbsPath}\`);
  console.log(\`📊 Tokens: \${response.usage.totalTokens} | Kosten: ~\${response.usage.estimatedEur.toFixed(5)} € | Search Grounding: \${response.groundingUsed ? 'aktiv' : 'aus'}\`);

  return { dryRun: false, slug: topicObj.slug, title: finalTitle, category: topicObj.category, articlePath, imageAbsPath, pinAbsPath: pinRes.pinAbsPath, usage: response.usage, productCount: fm.steps.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dryRun = process.argv.includes('--dry-run');
  const topicArg = process.argv.find((a) => a.startsWith('--topic='));
  const catArg = process.argv.find((a) => a.startsWith('--category='));
  const result = await generateArticle({
    topic: topicArg ? topicArg.split('=')[1] : 'Praxisratgeber im Alltag',
    category: catArg ? catArg.split('=')[1] : '',
    dryRun,
  });
  console.log(JSON.stringify(result, null, 2));
}
`;
}

async function scaffoldPortal(portal) {
  const portalDir = path.join(WEBSITES_DIR, portal.slug);
  console.log(`\n🏗️ Erstelle Portal "${portal.name}" unter websites/${portal.slug}/ (${portal.theme})...`);

  // 1. package.json, .gitignore, .env.example, .env, astro.config.mjs
  const pkgJson = {
    name: `${portal.slug}-portal`,
    type: 'module',
    version: '1.0.0',
    description: `${portal.name} – ${portal.tagline}`,
    scripts: {
      dev: 'astro dev',
      build: 'astro build',
      preview: 'astro preview',
      astro: 'astro',
      pipeline: 'node scripts/run-pipeline.mjs',
      discover: 'node scripts/discover-trends.mjs',
      generate: 'node scripts/generate-article.mjs',
      pins: 'node scripts/generate-pins.mjs',
      indexnow: 'node scripts/ping-indexnow.mjs',
      'publish:github': 'node scripts/publish-github.mjs',
    },
    dependencies: {
      '@astrojs/sitemap': '^3.2.0',
      astro: '^5.5.0',
      dotenv: '^16.4.7',
      'js-yaml': '^4.1.0',
      sharp: '^0.33.5',
    },
  };
  await writePortalFile(portalDir, 'package.json', JSON.stringify(pkgJson, null, 2) + '\n');

  await writePortalFile(
    portalDir,
    '.gitignore',
    'node_modules/\ndist/\n.astro/\n.env\n.env.local\n.env.*.local\nnpm-debug.log*\n.DS_Store\nThumbs.db\n'
  );

  await writePortalFile(
    portalDir,
    '.env.example',
    `GEMINI_API_KEY="DEIN-GEMINI-API-KEY"\nGEMINI_MODEL="gemini-flash-latest"\nUSE_SEARCH_GROUNDING="true"\nSITE_NAME="${portal.name}"\nSITE_URL="https://jeromatt3-create.github.io"\nBASE_PATH="/"\nPUBLIC_ADSENSE_CLIENT=""\n`
  );

  const envLines = [
    process.env.GEMINI_API_KEY ? `GEMINI_API_KEY=${JSON.stringify(process.env.GEMINI_API_KEY)}` : 'GEMINI_API_KEY=""',
    'GEMINI_MODEL="gemini-flash-latest"',
    'USE_SEARCH_GROUNDING="true"',
    `SITE_NAME=${JSON.stringify(portal.name)}`,
    'SITE_URL="https://dein-nutzername.github.io"',
    'BASE_PATH="/"',
    'PUBLIC_ADSENSE_CLIENT=""',
  ];
  await writePortalFile(portalDir, '.env', envLines.join('\n') + '\n');

  await writePortalFile(
    portalDir,
    'astro.config.mjs',
    `import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import 'dotenv/config';

const siteUrl = process.env.SITE_URL || 'https://jeromatt3-create.github.io';
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  site: siteUrl,
  base: basePath,
  integrations: [sitemap()],
});
`
  );

  // 2. Public files (favicon, IndexNow key)
  await writePortalFile(portalDir, `public/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
  await writePortalFile(
    portalDir,
    'public/favicon.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${portal.primaryColor}"/>
      <stop offset="100%" stop-color="${portal.accentColor}"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="42" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#ffffff" text-anchor="middle">${portal.name.slice(0, 1)}</text>
</svg>
`
  );

  // 3. Config & Content Schema
  await writePortalFile(
    portalDir,
    'src/config/site.config.mjs',
    `const env = typeof process !== 'undefined' && process.env ? process.env : {};

export const SITE_CONFIG = {
  slug: ${JSON.stringify(portal.slug)},
  name: env.SITE_NAME || ${JSON.stringify(portal.name)},
  theme: ${JSON.stringify(portal.theme)},
  tagline: ${JSON.stringify(portal.tagline)},
  description: ${JSON.stringify(portal.description)},
  adsenseClientId: env.PUBLIC_ADSENSE_CLIENT || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PUBLIC_ADSENSE_CLIENT : '') || '',
  categories: ${JSON.stringify(portal.categories, null, 2)},
};

export function getCategoryList() {
  return Object.values(SITE_CONFIG.categories);
}

export function getCategoryBySlug(slug) {
  const list = Object.values(SITE_CONFIG.categories);
  return SITE_CONFIG.categories[slug] || list[0];
}
`
  );

  await writePortalFile(
    portalDir,
    'src/config/topic-queue.json',
    JSON.stringify(portal.topicQueue, null, 2) + '\n'
  );

  await writePortalFile(
    portalDir,
    'src/content.config.ts',
    `import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stepSchema = z.object({
  step: z.number(),
  title: z.string(),
  summary: z.string(),
  tip: z.string().optional().default(''),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const ingredientSchema = z.object({
  amount: z.number(),
  unit: z.string(),
  item: z.string(),
});

const calcRowSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    heroImage: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    readingTime: z.number().optional().default(6),
    keyTakeaways: z.array(z.string()).default([]),
    steps: z.array(stepSchema).default([]),
    faqs: z.array(faqSchema).default([]),
    // Fintech / Rechner fields
    savingPotential: z.string().optional().default(''),
    exampleCalculation: z.array(calcRowSchema).default([]),
    // Food / Recipe fields
    servings: z.number().optional(),
    prepMinutes: z.number().optional(),
    calories: z.string().optional().default(''),
    costPerServing: z.string().optional().default(''),
    ingredients: z.array(ingredientSchema).default([]),
    // Diagnostic / Fehlercode fields
    errorCodes: z.array(z.string()).default([]),
    brands: z.string().optional().default(''),
    selfFixLevel: z.string().optional().default(''),
    timeRequired: z.string().optional().default(''),
    savedCost: z.string().optional().default(''),
  }),
});

export const collections = { articles };
`
  );

  // 4. Utils
  await writePortalFile(
    portalDir,
    'src/utils/url.js',
    `export function withBase(path = '/') {
  const base = (import.meta.env.BASE_URL || '/').replace(/\\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : \`/\${path}\`;
  return \`\${base}\${cleanPath}\` || '/';
}
`
  );

  await writePortalFile(
    portalDir,
    'src/utils/rss.ts',
    `import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../config/site.config.mjs';

const DEFAULT_PUBLIC_ORIGIN = 'https://jeromatt3-create.github.io';
const DEFAULT_PUBLIC_BASE = '/${portal.slug}';

export function resolvePublicRootUrl(site?: URL): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\\/+$/, '');
  const rawOrigin = site ? site.toString().replace(/\\/+$/, '') : '';
  const isPlaceholder = !rawOrigin || rawOrigin.includes('dein-') || rawOrigin.includes('localhost');
  return isPlaceholder ? \`\${DEFAULT_PUBLIC_ORIGIN}\${DEFAULT_PUBLIC_BASE}\` : \`\${rawOrigin}\${base}\`;
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
  return \`\${SITE_CONFIG.name} – \${SITE_CONFIG.tagline}\`;
}
`
  );

  // 5. Styles & Layout
  await writePortalFile(portalDir, 'src/styles/global.css', buildGlobalCss(portal));

  await writePortalFile(
    portalDir,
    'src/layouts/BaseLayout.astro',
    `---
import { SITE_CONFIG, getCategoryList } from '../config/site.config.mjs';
import { withBase } from '../utils/url.js';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const {
  title = \`\${SITE_CONFIG.name} – \${SITE_CONFIG.tagline}\`,
  description = SITE_CONFIG.description,
  canonicalPath = Astro.url.pathname,
  jsonLd,
} = Astro.props;

const categories = getCategoryList();
const siteOrigin = Astro.site ? Astro.site.toString().replace(/\\/+$/, '') : '';
const canonicalUrl = siteOrigin ? \`\${siteOrigin}\${canonicalPath}\` : canonicalPath;
const currentYear = new Date().getFullYear();
const adsenseClient = SITE_CONFIG.adsenseClientId;
---

<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:locale" content="de_DE" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="google-site-verification" content="${GSC_VERIFICATION}" />
    <link rel="icon" type="image/svg+xml" href={withBase('/favicon.svg')} />
    <link rel="alternate" type="application/rss+xml" title={SITE_CONFIG.name} href={withBase('/rss.xml')} />
    {adsenseClient && (
      <script async src={\`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=\${adsenseClient}\`} crossorigin="anonymous"></script>
    )}
    {jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}
  </head>
  <body>
    <header class="site-header">
      <div class="container header-inner">
        <a href={withBase('/')} class="brand">
          <span class="brand-mark">${portal.name.slice(0, 1)}</span>
          <span>{SITE_CONFIG.name}</span>
        </a>
        <nav class="main-nav" aria-label="Rubriken">
          {categories.map((cat) => (
            <a href={withBase(\`/kategorie/\${cat.slug}/\`) } class="nav-link">{cat.icon} {cat.name}</a>
          ))}
          <a href={withBase('/ueber-uns/')} class="nav-link">Über uns</a>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>{SITE_CONFIG.name}</h4>
            <p style="font-size:0.9rem;color:#94a3b8;margin:0;">{SITE_CONFIG.tagline}. {SITE_CONFIG.description}</p>
          </div>
          <div>
            <h4>Rubriken</h4>
            <ul class="footer-links">
              {categories.map((cat) => (
                <li><a href={withBase(\`/kategorie/\${cat.slug}/\`) }>{cat.icon} {cat.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Rechtliches &amp; Feeds</h4>
            <ul class="footer-links">
              <li><a href={withBase('/ueber-uns/')}>Über uns &amp; Methodik</a></li>
              <li><a href={withBase('/impressum/')}>Impressum</a></li>
              <li><a href={withBase('/datenschutz/')}>Datenschutz</a></li>
              <li><a href={withBase('/rss.xml')}>RSS-Feed</a></li>
              <li><a href={withBase('/pinterest-rss.xml')}>Pinterest-Feed</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© {currentYear} {SITE_CONFIG.name}. Redaktionelle Alltags- und Informationshinweise ohne Gewähr.</div>
        </div>
      </div>
    </footer>
  </body>
</html>
`
  );

  // 6. Components
  await writePortalFile(
    portalDir,
    'src/components/AdSlot.astro',
    `---
import { SITE_CONFIG } from '../config/site.config.mjs';

interface Props {
  placement: 'header' | 'in-article' | 'footer';
}
const { placement } = Astro.props;
const client = SITE_CONFIG.adsenseClientId;
---

{
  client ? (
    <div class="container" style="margin: 1.4rem auto; text-align: center;" data-ad-placement={placement}>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client={client}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script is:inline>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  ) : (
    <Fragment set:html={\`<!-- AdSlot ready: \${placement} -->\`} />
  )
}
`
  );

  await writePortalFile(
    portalDir,
    'src/components/KeyTakeaways.astro',
    `---
interface Props {
  items: string[];
}
const { items = [] } = Astro.props;
---

{items.length > 0 && (
  <section class="takeaways-box">
    <h2>Das Wichtigste in Kürze</h2>
    <ul>
      {items.map((item) => <li>{item}</li>)}
    </ul>
  </section>
)}
`
  );

  await writePortalFile(
    portalDir,
    'src/components/StepByStep.astro',
    `---
interface StepItem {
  step: number;
  title: string;
  summary: string;
  tip?: string;
}
interface Props {
  steps: StepItem[];
  heading?: string;
}
const { steps = [], heading = 'Schritt-für-Schritt-Anleitung' } = Astro.props;
---

{steps.length > 0 && (
  <section style="margin-bottom:2rem;">
    <h2 style="font-size:1.5rem;margin-bottom:1rem;">{heading}</h2>
    <div class="steps-grid">
      {steps.map((s) => (
        <div class="step-card">
          <div class="step-head">
            <span class="step-num">{s.step}</span>
            <h3 style="margin:0;font-size:1.14rem;">{s.title}</h3>
          </div>
          <p style="margin:0;">{s.summary}</p>
          {s.tip && <div class="step-tip"><strong>Praxis-Tipp:</strong> {s.tip}</div>}
        </div>
      ))}
    </div>
  </section>
)}
`
  );

  await writePortalFile(
    portalDir,
    'src/components/FaqSection.astro',
    `---
interface Faq { question: string; answer: string; }
interface Props { faqs: Faq[]; }
const { faqs = [] } = Astro.props;
---
{faqs.length > 0 && (
  <section class="faq-section" id="faq">
    <h2>Häufig gestellte Fragen (FAQ)</h2>
    <div>
      {faqs.map((item) => (
        <details class="faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
)}
`
  );

  await writePortalFile(
    portalDir,
    'src/components/RelatedArticles.astro',
    `---
import { getCollection } from 'astro:content';
import { getCategoryBySlug } from '../config/site.config.mjs';
import { withBase } from '../utils/url.js';

interface Props { currentSlug: string; categorySlug: string; }
const { currentSlug, categorySlug } = Astro.props;
const allArticles = await getCollection('articles');
const related = allArticles
  .filter((e) => e.id !== currentSlug)
  .sort((a, b) => {
    const sa = a.data.category === categorySlug ? 1 : 0;
    const sb = b.data.category === categorySlug ? 1 : 0;
    if (sa !== sb) return sb - sa;
    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  })
  .slice(0, 3);
---
{related.length > 0 && (
  <section class="related-articles" style="margin-top:2.4rem;padding-top:1.8rem;border-top:1px solid var(--border);">
    <div class="section-header" style="margin-bottom:1.1rem;">
      <h2 style="font-size:1.4rem;">Weitere passende Beiträge</h2>
    </div>
    <div class="articles-grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
      {related.map((item) => {
        const cat = getCategoryBySlug(item.data.category);
        return (
          <article class="article-card">
            <a href={withBase(\`/artikel/\${item.id}/\`) } class="article-card-media">
              {item.data.heroImage && <img src={withBase(item.data.heroImage)} alt={item.data.title} loading="lazy" />}
            </a>
            <div class="article-card-body">
              <div class="article-meta-row"><span class="cat-tag">{cat.icon} {cat.name}</span></div>
              <h3 style="font-size:1.04rem;"><a href={withBase(\`/artikel/\${item.id}/\`) }>{item.data.title}</a></h3>
              <p style="font-size:0.86rem;">{item.data.description}</p>
              <div class="article-card-footer">
                <span>{item.data.readingTime || 6} Min.</span>
                <a href={withBase(\`/artikel/\${item.id}/\`) }>Lesen →</a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
)}
`
  );

  if (portal.theme === 'fintech-modern') {
    await writePortalFile(portalDir, 'src/components/QuickCalculators.astro', buildQuickCalculatorsAstro());
  } else if (portal.theme === 'editorial-warm') {
    await writePortalFile(portalDir, 'src/components/RecipeBox.astro', buildRecipeBoxAstro());
  } else {
    await writePortalFile(portalDir, 'src/components/DiagnosticCard.astro', buildDiagnosticCardAstro());
  }

  // 7. Pages
  await writePortalFile(portalDir, 'src/pages/index.astro', buildIndexAstro(portal));
  await writePortalFile(portalDir, 'src/pages/artikel/[...slug].astro', buildArticleDetailAstro(portal));

  await writePortalFile(
    portalDir,
    'src/pages/kategorie/[category].astro',
    `---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCategoryList, getCategoryBySlug, SITE_CONFIG } from '../../config/site.config.mjs';
import { withBase } from '../../utils/url.js';

export async function getStaticPaths() {
  return getCategoryList().map((cat) => ({ params: { category: cat.slug }, props: { category: cat } }));
}

const { category } = Astro.props;
const allArticles = await getCollection('articles');
const categoryArticles = allArticles
  .filter((a) => a.data.category === category.slug)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<BaseLayout title={\`\${category.name} | \${SITE_CONFIG.name}\`} description={category.description}>
  <section class="hero" style="padding:2.3rem 0;">
    <div class="container">
      <nav class="breadcrumbs" style="color:#cbd5e1;">
        <a href={withBase('/')} style="color:#fff;">Startseite</a>
        <span>›</span>
        <span>{category.name}</span>
      </nav>
      <h1 style="margin-bottom:0.45rem;">{category.icon} {category.name}</h1>
      <p style="margin:0;max-width:720px;">{category.description}</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="articles-grid">
        {categoryArticles.map((article) => {
          const catInfo = getCategoryBySlug(article.data.category);
          const dateStr = article.data.pubDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' });
          return (
            <article class="article-card">
              <a href={withBase(\`/artikel/\${article.id}/\`) } class="article-card-media">
                {article.data.heroImage && <img src={withBase(article.data.heroImage)} alt={article.data.title} loading="lazy" />}
              </a>
              <div class="article-card-body">
                <div class="article-meta-row"><span class="cat-tag">{catInfo.icon} {catInfo.name}</span><span>{dateStr}</span></div>
                <h3><a href={withBase(\`/artikel/\${article.id}/\`) }>{article.data.title}</a></h3>
                <p>{article.data.description}</p>
                <div class="article-card-footer">
                  <span>{article.data.readingTime || 6} Min. Lesezeit</span>
                  <a href={withBase(\`/artikel/\${article.id}/\`) }>Lesen →</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
</BaseLayout>
`
  );

  await writePortalFile(
    portalDir,
    'src/pages/impressum.astro',
    `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE_CONFIG } from '../config/site.config.mjs';
---
<BaseLayout title={\`Impressum | \${SITE_CONFIG.name}\`}>
  <div class="container article-layout">
    <div class="prose">
      <h1>Impressum</h1>
      <p><strong>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</strong></p>
      <p>
        <strong>${OWNER_LEGAL.name}</strong><br />
        ${OWNER_LEGAL.street}<br />
        ${OWNER_LEGAL.city}<br />
        ${OWNER_LEGAL.country}
      </p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href="mailto:${OWNER_LEGAL.email}">${OWNER_LEGAL.email}</a><br />
        Telefon: ${OWNER_LEGAL.phone}
      </p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>${OWNER_LEGAL.name}, Anschrift wie oben.</p>
      <h2>Hinweis zu Inhalten &amp; Finanzierung</h2>
      <p>
        {SITE_CONFIG.name} ist ein kostenloses Informations- und Ratgeberportal. Alle Hinweise werden nach bestem Wissen recherchiert, ersetzen im Einzelfall jedoch keine professionelle Steuer-, Rechts- oder Fachhandwerker-Beratung. Zur Deckung der Betriebskosten können Werbeeinblendungen (z. B. über Google AdSense) eingesetzt werden.
      </p>
    </div>
  </div>
</BaseLayout>
`
  );

  await writePortalFile(
    portalDir,
    'src/pages/datenschutz.astro',
    `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE_CONFIG } from '../config/site.config.mjs';
---
<BaseLayout title={\`Datenschutzerklärung | \${SITE_CONFIG.name}\`}>
  <div class="container article-layout">
    <div class="prose">
      <h1>Datenschutzerklärung</h1>
      <p>Nachfolgend informieren wir dich über den Umgang mit Daten beim Besuch von {SITE_CONFIG.name}.</p>
      <h2>1. Verantwortliche Stelle</h2>
      <p>${OWNER_LEGAL.name}, ${OWNER_LEGAL.street}, ${OWNER_LEGAL.city}, E-Mail: ${OWNER_LEGAL.email}.</p>
      <h2>2. Hosting &amp; Server-Logfiles</h2>
      <p>
        Diese Website wird als statische Seite über GitHub Pages bereitgestellt. Beim Aufruf verarbeitet der Hosting-Anbieter technisch erforderliche Verbindungsdaten (IP-Adresse, Zeitpunkt, Browsertyp) zur Auslieferung und Systemsicherheit (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <h2>3. Werbung / Google AdSense (optional bei Aktivierung)</h2>
      <p>
        Sofern Werbeanzeigen (z. B. über Google AdSense) auf dieser Website eingeblendet werden, können Cookies oder pseudonyme Kennungen zur Aussteuerung und Abrechnung genutzt werden. Aktuell werden ohne aktive Einbindung keine Werbecookies gesetzt.
      </p>
      <h2>4. Deine Rechte</h2>
      <p>Du hast im Rahmen der DSGVO das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung.</p>
    </div>
  </div>
</BaseLayout>
`
  );

  await writePortalFile(
    portalDir,
    'src/pages/ueber-uns.astro',
    `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE_CONFIG } from '../config/site.config.mjs';
---
<BaseLayout title={\`Über \${SITE_CONFIG.name}\`}>
  <div class="container article-layout">
    <div class="prose">
      <h1>Über {SITE_CONFIG.name}</h1>
      <p>{SITE_CONFIG.description}</p>
      <h2>Unser Anspruch</h2>
      <ul>
        <li><strong>Praxis statt Theorie:</strong> Jede Anleitung liefert konkrete Schritte, Formeln oder Mengenangaben für den Alltag.</li>
        <li><strong>Unabhängig nutzbar:</strong> Alle Beiträge und Werkzeuge stehen ohne Registrierung und ohne Bezahlschranke offen.</li>
        <li><strong>Sicherheit geht vor:</strong> Bei technischen Arbeiten oder rechtlichen Themen weisen wir klar auf Grenzen und Fachbetriebe hin.</li>
      </ul>
    </div>
  </div>
</BaseLayout>
`
  );

  // 8. Feeds & Robots
  await writePortalFile(
    portalDir,
    'src/pages/robots.txt.ts',
    `import type { APIRoute } from 'astro';
import { resolvePublicRootUrl } from '../utils/rss';

export const GET: APIRoute = ({ site }) => {
  const rootUrl = resolvePublicRootUrl(site);
  const body = \`User-agent: *\\nAllow: /\\n\\nSitemap: \${rootUrl}/sitemap-index.xml\\n\`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
`
  );

  await writePortalFile(
    portalDir,
    'src/pages/rss.xml.ts',
    `import type { APIRoute } from 'astro';
import { SITE_CONFIG, getCategoryBySlug } from '../config/site.config.mjs';
import { escapeXml, getChannelTitle, getSortedArticles, resolvePublicRootUrl } from '../utils/rss';

export const GET: APIRoute = async ({ site }) => {
  const rootUrl = resolvePublicRootUrl(site);
  const articles = await getSortedArticles();
  const lastBuildDate = (articles[0]?.data.pubDate || new Date()).toUTCString();
  const itemsXml = articles.map((a) => {
    const url = \`\${rootUrl}/artikel/\${a.id}/\`;
    const cat = getCategoryBySlug(a.data.category);
    return \`    <item>
      <title>\${escapeXml(a.data.title)}</title>
      <link>\${escapeXml(url)}</link>
      <guid isPermaLink="true">\${escapeXml(url)}</guid>
      <description>\${escapeXml(a.data.description)}</description>
      <pubDate>\${a.data.pubDate.toUTCString()}</pubDate>
      <category>\${escapeXml(cat.name)}</category>
    </item>\`;
  }).join('\\n');

  const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>\${escapeXml(getChannelTitle())}</title>
    <link>\${escapeXml(rootUrl)}/</link>
    <description>\${escapeXml(SITE_CONFIG.description)}</description>
    <language>de-de</language>
    <lastBuildDate>\${lastBuildDate}</lastBuildDate>
    <atom:link href="\${escapeXml(rootUrl)}/rss.xml" rel="self" type="application/rss+xml" />
\${itemsXml}
  </channel>
</rss>
\`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
`
  );

  await writePortalFile(
    portalDir,
    'src/pages/pinterest-rss.xml.ts',
    `import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { SITE_CONFIG, getCategoryBySlug } from '../config/site.config.mjs';
import { escapeXml, getChannelTitle, getSortedArticles, resolvePublicRootUrl } from '../utils/rss';

function getPinSize(slug: string): number {
  try {
    return fs.statSync(path.resolve(process.cwd(), 'public', 'images', 'pins', \`\${slug}.png\`)).size || 120000;
  } catch { return 120000; }
}

export const GET: APIRoute = async ({ site }) => {
  const rootUrl = resolvePublicRootUrl(site);
  const articles = await getSortedArticles();
  const lastBuildDate = (articles[0]?.data.pubDate || new Date()).toUTCString();
  const itemsXml = articles.map((a) => {
    const url = \`\${rootUrl}/artikel/\${a.id}/\`;
    const pinUrl = \`\${rootUrl}/images/pins/\${a.id}.png\`;
    const cat = getCategoryBySlug(a.data.category);
    return \`    <item>
      <title>\${escapeXml(a.data.title)}</title>
      <link>\${escapeXml(url)}</link>
      <guid isPermaLink="true">\${escapeXml(url)}</guid>
      <description>\${escapeXml(a.data.description)}</description>
      <pubDate>\${a.data.pubDate.toUTCString()}</pubDate>
      <category>\${escapeXml(cat.name)}</category>
      <enclosure url="\${escapeXml(pinUrl)}" type="image/png" length="\${getPinSize(a.id)}" />
      <media:content url="\${escapeXml(pinUrl)}" type="image/png" medium="image" width="1000" height="1500" />
    </item>\`;
  }).join('\\n');

  const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>\${escapeXml(getChannelTitle())} (Pinterest Feed)</title>
    <link>\${escapeXml(rootUrl)}/</link>
    <description>\${escapeXml(SITE_CONFIG.description)}</description>
    <language>de-de</language>
    <lastBuildDate>\${lastBuildDate}</lastBuildDate>
    <atom:link href="\${escapeXml(rootUrl)}/pinterest-rss.xml" rel="self" type="application/rss+xml" />
\${itemsXml}
  </channel>
</rss>
\`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
`
  );

  // 9. Seed Articles, SVGs & PNG Pins
  for (const art of portal.seedArticles) {
    await writePortalFile(portalDir, `src/content/articles/${art.slug}.md`, serializeSeedArticle(portal, art));
    await writePortalFile(portalDir, `public/images/articles/${art.slug}.svg`, buildHeroSvg(portal, art));
    const pinSvg = buildSeedPinSvg(portal, art);
    const pinBuf = await sharp(Buffer.from(pinSvg, 'utf8')).png({ quality: 90 }).toBuffer();
    const pinAbs = path.join(portalDir, 'public', 'images', 'pins', `${art.slug}.png`);
    await fs.mkdir(path.dirname(pinAbs), { recursive: true });
    await fs.writeFile(pinAbs, pinBuf);
  }

  // 10. Pipeline & Automation Scripts
  const geminiClientSource = await fs.readFile(path.join(ROOT_DIR, 'scripts', 'gemini-client.mjs'), 'utf8');
  await writePortalFile(portalDir, 'scripts/gemini-client.mjs', geminiClientSource);

  const runPipelineSource = await fs.readFile(path.join(ROOT_DIR, 'scripts', 'run-pipeline.mjs'), 'utf8');
  await writePortalFile(portalDir, 'scripts/run-pipeline.mjs', runPipelineSource);

  await writePortalFile(
    portalDir,
    'scripts/discover-trends.mjs',
    `import fs from 'node:fs/promises';
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
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}

export async function getExistingArticles() {
  try {
    const files = (await fs.readdir(ARTICLES_DIR)).filter((f) => f.endsWith('.md'));
    const items = [];
    for (const file of files) {
      const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf8');
      const m = content.match(/^title:\\s*["']?(.+?)["']?\\s*$/m);
      items.push({ slug: file.replace(/\\.md$/, ''), title: m ? m[1] : file.replace(/\\.md$/, '') });
    }
    return items;
  } catch { return []; }
}

export async function loadTopicQueue() {
  try { return JSON.parse(await fs.readFile(QUEUE_PATH, 'utf8')); } catch { return []; }
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
  if (updated) await fs.writeFile(QUEUE_PATH, JSON.stringify(next, null, 2) + '\\n', 'utf8');
}

export async function discoverNextTopic({ requestedTopic = '', requestedCategory = '', dryRun = false, excludedSlugs = [] } = {}) {
  const validCategories = getCategoryList().map((c) => c.slug);
  const existing = await getExistingArticles();
  const existingSlugs = new Set([...existing.map((e) => e.slug), ...excludedSlugs]);
  const queue = await loadTopicQueue();

  if (requestedTopic) {
    const category = validCategories.includes(requestedCategory) ? requestedCategory : validCategories[0];
    return { title: requestedTopic, slug: slugifyGerman(requestedTopic), category, targetKeyword: requestedTopic, buyerIntent: 'informational', queueId: null, source: 'cli-override', rationale: 'Manuell vorgegebenes Thema.' };
  }

  const pendingQueue = queue.filter((item) => {
    if (item.status === 'published' || existingSlugs.has(item.id)) return false;
    if (requestedCategory && item.category !== requestedCategory) return false;
    return true;
  });

  const queueFallback = pendingQueue[0] || {
    id: \`ratgeber-\${Date.now()}\`,
    category: validCategories.includes(requestedCategory) ? requestedCategory : validCategories[0],
    keyword: '${portal.tagline}',
    intent: 'informational',
  };

  if (dryRun || !hasGeminiCredentials()) {
    return { title: queueFallback.keyword, slug: slugifyGerman(queueFallback.id || queueFallback.keyword), category: queueFallback.category, targetKeyword: queueFallback.keyword, buyerIntent: 'informational', queueId: queueFallback.id || null, source: dryRun ? 'dry-run-queue' : 'queue-fallback', rationale: 'Aus topic-queue.json gewählt.' };
  }

  const currentMonth = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const allowedCategoriesText = Object.values(SITE_CONFIG.categories).map((c) => \`- "\${c.slug}": \${c.name} (\${c.description})\`).join('\\n');
  const categoryConstraint = requestedCategory ? \`WICHTIG: Wähle zwingend Kategorie "\${requestedCategory}".\` : 'Wähle eine passende Kategorie aus der Liste.';

  const prompt = \`
Du bist SEO-Redakteur für das deutsche Portal "${portal.name}" (${portal.tagline}).
Saison: \${currentMonth}.

AUFGABE:
Wähle GENAU EIN stark gesuchtes, praxisnahes Long-Tail-Thema für Deutschland (KEINE Produktvergleiche, KEINE Affiliate-Themen!), das noch nicht existiert.

Bereits veröffentlicht (NICHT wiederholen):
\${existing.map((e) => \`- \${e.title} (\${e.slug})\`).join('\\n')}

Erlaubte Kategorien:
\${allowedCategoriesText}
\${categoryConstraint}

Queue-Vorschläge:
\${pendingQueue.slice(0, 8).map((q) => \`- [\${q.id}] (\${q.category}) \${q.keyword}\`).join('\\n')}

Antworte AUSSCHLIESSLICH mit validem JSON:
{
  "title": "Klarer deutscher SEO-Titel (55-75 Zeichen)",
  "slug": "url-slug-ohne-umlaute",
  "category": "erlaubte-kategorie",
  "targetKeyword": "Haupt-Suchbegriff",
  "queueId": "id-aus-queue-oder-null",
  "rationale": "Kurze Begründung (1 Satz)."
}
\`.trim();

  try {
    const res = await generateWithGemini({ prompt, temperature: 0.35, expectJson: true });
    const pick = res.data;
    const chosenCategory = validCategories.includes(pick.category) ? pick.category : queueFallback.category;
    const slug = slugifyGerman(pick.slug || pick.title);
    if (!slug || existingSlugs.has(slug)) throw new Error(\`Slug "\${slug}" existiert bereits.\`);
    return {
      title: pick.title || queueFallback.keyword,
      slug,
      category: requestedCategory && validCategories.includes(requestedCategory) ? requestedCategory : chosenCategory,
      targetKeyword: pick.targetKeyword || pick.title || queueFallback.keyword,
      buyerIntent: 'informational',
      queueId: pick.queueId || null,
      source: res.groundingUsed ? 'gemini-search-trends' : 'gemini-trends',
      rationale: pick.rationale || 'Gemini Trend-Analyse.',
      usage: res.usage,
    };
  } catch (err) {
    console.warn(\`⚠️ Discovery-Fallback (\${err.message})\`);
    return { title: queueFallback.keyword, slug: slugifyGerman(queueFallback.id || queueFallback.keyword), category: queueFallback.category, targetKeyword: queueFallback.keyword, buyerIntent: 'informational', queueId: queueFallback.id || null, source: 'queue-fallback', rationale: 'Fallback auf topic-queue.json.' };
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dryRun = process.argv.includes('--dry-run');
  const catArg = process.argv.find((a) => a.startsWith('--category='));
  const res = await discoverNextTopic({ requestedCategory: catArg ? catArg.split('=')[1] : '', dryRun });
  console.log(JSON.stringify(res, null, 2));
}
`
  );

  await writePortalFile(
    portalDir,
    'scripts/generate-pins.mjs',
    `import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { getCategoryBySlug } from '../src/config/site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'content', 'articles');
const PINS_DIR = path.join(ROOT_DIR, 'public', 'images', 'pins');
const FONT = 'DejaVu Sans, Liberation Sans, Segoe UI, Arial, sans-serif';

function stripEmojis(str) {
  return String(str || '').replace(/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\uFE0F]/gu, '').replace(/\\s+/g, ' ').trim();
}
function escapeXml(str) {
  return String(str || '').replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function wrapLines(text, maxChars = 24, maxLines = 3) {
  const words = stripEmojis(text).split(/\\s+/).filter(Boolean);
  const lines = []; let current = '';
  for (const w of words) {
    const c = current ? \`\${current} \${w}\` : w;
    if (c.length <= maxChars) current = c;
    else {
      if (current) lines.push(current);
      if (lines.length >= maxLines) { current = ''; break; }
      current = w.length > maxChars ? w.slice(0, maxChars - 1) : w;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.length > 0 ? lines : ['Ratgeber'];
}

export function buildPinSvg({ title, categorySlug, steps = [], keyTakeaways = [] }) {
  const cat = getCategoryBySlug(categorySlug);
  const titleLines = wrapLines(title, 23, 3);
  const startY = titleLines.length <= 2 ? 275 : 245;
  const titleSvg = titleLines.map((l, i) => \`<text x="72" y="\${startY + i * 72}" font-family="\${FONT}" font-size="54" font-weight="800" fill="\${i === titleLines.length - 1 ? '#fde68a' : '#ffffff'}">\${escapeXml(l)}</text>\`).join('\\n  ');

  const items = (steps.length ? steps.map((s) => ({ label: \`SCHRITT \${s.step}\`, title: s.title, sub: s.summary })) : keyTakeaways.map((t, i) => ({ label: \`TIPP \${i + 1}\`, title: t, sub: '' }))).slice(0, 3);
  const cardsSvg = items.map((pt, idx) => {
    const y = 505 + idx * 256;
    const badgeColor = idx === 0 ? '${portal.accentColor}' : idx === 1 ? '${portal.primaryColor}' : '#0f172a';
    const l1 = wrapLines(pt.title, 36, 1)[0] || '';
    const sub = wrapLines(pt.sub || pt.title, 44, 2);
    return \`
  <g transform="translate(72, \${y})">
    <rect width="856" height="226" rx="22" fill="#ffffff" fill-opacity="0.97"/>
    <rect x="28" y="24" width="210" height="40" rx="20" fill="\${badgeColor}"/>
    <text x="133" y="51" font-family="\${FONT}" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">\${escapeXml(pt.label)}</text>
    <text x="28" y="112" font-family="\${FONT}" font-size="31" font-weight="800" fill="#0f172a">\${escapeXml(l1)}</text>
    <text x="28" y="156" font-family="\${FONT}" font-size="23" font-weight="500" fill="#475569">\${escapeXml(sub[0] || '')}</text>
    <text x="28" y="190" font-family="\${FONT}" font-size="23" font-weight="500" fill="#475569">\${escapeXml(sub[1] || '')}</text>
  </g>\`;
  }).join('\\n');

  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500">
  <defs>
    <linearGradient id="pinBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="56%" stop-color="${portal.primaryColor}"/>
      <stop offset="100%" stop-color="\${escapeXml(cat.accent || '${portal.accentColor}')}"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1500" fill="url(#pinBg)"/>
  <circle cx="880" cy="140" r="240" fill="#ffffff" opacity="0.06"/>
  <rect x="72" y="72" width="430" height="52" rx="26" fill="#ffffff" opacity="0.16"/>
  <text x="287" y="106" font-family="\${FONT}" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(portal.badgeLabel)}</text>
  <rect x="524" y="72" width="404" height="52" rx="26" fill="${portal.accentColor}"/>
  <text x="726" y="106" font-family="\${FONT}" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">\${escapeXml(stripEmojis(cat.name).toUpperCase())}</text>
  \${titleSvg}
  <text x="72" y="472" font-family="\${FONT}" font-size="25" font-weight="600" fill="#e2e8f0">Auf einen Blick – so geht es Schritt für Schritt:</text>
  \${cardsSvg}
  <rect x="72" y="1310" width="856" height="110" rx="20" fill="#0f172a" fill-opacity="0.9" stroke="#fde68a" stroke-width="3"/>
  <text x="500" y="1358" font-family="\${FONT}" font-size="27" font-weight="800" fill="#fde68a" text-anchor="middle">Vollständige Anleitung &amp; FAQ lesen</text>
  <text x="500" y="1396" font-family="\${FONT}" font-size="22" font-weight="600" fill="#f8fafc" text-anchor="middle">${escapeXml(portal.name)}</text>
</svg>\`;
}

export async function generatePinImage({ slug, title, categorySlug, steps = [], keyTakeaways = [] }) {
  await fs.mkdir(PINS_DIR, { recursive: true });
  const svg = buildPinSvg({ title, categorySlug, steps, keyTakeaways });
  const pinAbsPath = path.join(PINS_DIR, \`\${slug}.png\`);
  const pngBuffer = await sharp(Buffer.from(svg, 'utf8')).png({ quality: 90 }).toBuffer();
  await fs.writeFile(pinAbsPath, pngBuffer);
  return { slug, pinAbsPath, pinRelPath: \`/images/pins/\${slug}.png\`, bytes: pngBuffer.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const files = (await fs.readdir(ARTICLES_DIR)).filter((f) => f.endsWith('.md')).sort();
  for (const file of files) {
    const raw = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const m = raw.match(/^---\\r?\\n([\\s\\S]*?)\\r?\\n---/);
    if (!m) continue;
    const data = yaml.load(m[1]);
    await generatePinImage({ slug: file.replace(/\\.md$/, ''), title: data.title, categorySlug: data.category, steps: data.steps || [], keyTakeaways: data.keyTakeaways || [] });
  }
  console.log(\`✅ Pins für \${files.length} Beiträge erstellt.\`);
}
`
  );

  await writePortalFile(portalDir, 'scripts/generate-article.mjs', buildGenerateArticleScript(portal));

  await writePortalFile(
    portalDir,
    'scripts/ping-indexnow.mjs',
    `import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { getCategoryList } from '../src/config/site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'content', 'articles');
const INDEXNOW_KEY = '${INDEXNOW_KEY}';
const DEFAULT_LIVE_ROOT = 'https://jeromatt3-create.github.io/${portal.slug}';

function resolveLiveRootUrl() {
  const siteUrl = (process.env.SITE_URL || '').trim().replace(/\\/+$/, '');
  const basePath = (process.env.BASE_PATH || '').trim().replace(/\\/+$/, '');
  if (!siteUrl || siteUrl.includes('dein-') || siteUrl.includes('localhost') || !siteUrl.startsWith('http')) {
    return DEFAULT_LIVE_ROOT;
  }
  return \`\${siteUrl}\${basePath === '/' ? '' : basePath}\`;
}

export async function pingIndexNow() {
  const liveRoot = resolveLiveRootUrl();
  const parsedRoot = new URL(liveRoot);
  const urls = new Set([\`\${liveRoot}/\`, \`\${liveRoot}/ueber-uns/\`]);
  for (const cat of getCategoryList()) urls.add(\`\${liveRoot}/kategorie/\${cat.slug}/\`);
  for (const f of (await fs.readdir(ARTICLES_DIR)).sort()) {
    if (f.endsWith('.md')) urls.add(\`\${liveRoot}/artikel/\${f.replace(/\\.md$/, '')}/\`);
  }
  const urlList = Array.from(urls);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: parsedRoot.host,
        key: INDEXNOW_KEY,
        keyLocation: \`\${liveRoot}/\${INDEXNOW_KEY}.txt\`,
        urlList,
      }),
    });
    console.log(\`IndexNow (\${DEFAULT_LIVE_ROOT}): HTTP \${res.status} für \${urlList.length} URLs\`);
  } catch (err) {
    console.warn('IndexNow Warnung:', err.message);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await pingIndexNow();
}
`
  );

  const publishGithubRaw = await fs.readFile(path.join(ROOT_DIR, 'scripts', 'publish-github.mjs'), 'utf8');
  const publishGithubCustom = publishGithubRaw
    .replace("repo: 'testkompass24'", `repo: '${portal.slug}'`)
    .replace('TestKompass24 Affiliate-Portal & autonome Gemini-Pipeline', `${portal.name} – ${portal.tagline}`)
    .replace("'TestKompass24 - Autonomes KI-Affiliate-Vergleichsportal'", `'${portal.name} - ${portal.tagline}'`)
    .replace(/const partnerTag[\s\S]*?gespeichert\.`\);/, '// Werbefinanziertes Ratgeberportal (kein Amazon-Secret nötig)');
  await writePortalFile(portalDir, 'scripts/publish-github.mjs', publishGithubCustom);

  // 11. Workflows
  await writePortalFile(
    portalDir,
    '.github/workflows/deploy-pages.yml',
    `name: Website auf GitHub Pages veröffentlichen

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - id: pages
        uses: actions/configure-pages@v5
      - name: Astro Website bauen
        env:
          SITE_NAME: \${{ vars.SITE_NAME || '${portal.name}' }}
          SITE_URL: \${{ vars.SITE_URL || steps.pages.outputs.origin }}
          BASE_PATH: \${{ vars.BASE_PATH || steps.pages.outputs.base_path || '/' }}
          PUBLIC_ADSENSE_CLIENT: \${{ vars.PUBLIC_ADSENSE_CLIENT || '' }}
        run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4
`
  );

  await writePortalFile(
    portalDir,
    '.github/workflows/autonomous-content.yml',
    `name: Autonomer Content-Workflow (${portal.name})

on:
  schedule:
    # ${portal.cronLabel}
    - cron: '${portal.cronSchedule}'
  workflow_dispatch:
    inputs:
      topic:
        description: 'Optional: Spezifisches Thema'
        required: false
        default: ''
        type: string
      category:
        description: 'Optional: Kategorie'
        required: false
        default: ''
        type: string
      count:
        description: 'Anzahl neuer Beiträge (1-3)'
        required: false
        default: '1'
        type: string

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: pages-and-content
  cancel-in-progress: false

jobs:
  generate-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Autonome Gemini Content-Pipeline
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          GEMINI_MODEL: \${{ vars.GEMINI_MODEL || 'gemini-flash-latest' }}
          USE_SEARCH_GROUNDING: \${{ vars.USE_SEARCH_GROUNDING || 'true' }}
          INPUT_TOPIC: \${{ github.event.inputs.topic || '' }}
          INPUT_CATEGORY: \${{ github.event.inputs.category || '' }}
          INPUT_COUNT: \${{ github.event.inputs.count || '1' }}
        run: |
          ARGS=("--count=\${INPUT_COUNT}")
          if [ -n "\$INPUT_TOPIC" ]; then ARGS+=("--topic=\${INPUT_TOPIC}"); fi
          if [ -n "\$INPUT_CATEGORY" ]; then ARGS+=("--category=\${INPUT_CATEGORY}"); fi
          node scripts/run-pipeline.mjs "\${ARGS[@]}"
      - name: Neue Beiträge committen
        run: |
          git config user.name "Content-Bot"
          git config user.email "content-bot@users.noreply.github.com"
          git add src/content/articles/ public/images/articles/ public/images/pins/ src/config/topic-queue.json
          if git diff --staged --quiet; then
            echo "Keine Änderungen."
          else
            git commit -m "chore(content): neue Beiträge automatisch veröffentlicht"
            git push
          fi
      - id: pages
        uses: actions/configure-pages@v5
      - name: Astro Website bauen
        env:
          SITE_NAME: \${{ vars.SITE_NAME || '${portal.name}' }}
          SITE_URL: \${{ vars.SITE_URL || steps.pages.outputs.origin }}
          BASE_PATH: \${{ vars.BASE_PATH || steps.pages.outputs.base_path || '/' }}
          PUBLIC_ADSENSE_CLIENT: \${{ vars.PUBLIC_ADSENSE_CLIENT || '' }}
        run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4
      - name: IndexNow Ping senden
        env:
          SITE_URL: \${{ vars.SITE_URL || steps.pages.outputs.origin }}
          BASE_PATH: \${{ vars.BASE_PATH || steps.pages.outputs.base_path || '/' }}
        run: node scripts/ping-indexnow.mjs
`
  );

  console.log(`✅ Portal "${portal.name}" angelegt (${portal.seedArticles.length} Basis-Artikel + Pins).`);
}

async function main() {
  for (const portal of AD_PORTALS) {
    await scaffoldPortal(portal);
  }
  console.log('\n🎉 Alle 3 unterschiedlichen Portale erfolgreich unter websites/ angelegt!');
}

main().catch((err) => {
  console.error('❌ Scaffold-Fehler:', err);
  process.exit(1);
});
