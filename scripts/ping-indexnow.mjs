import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { getCategoryList } from '../src/config/site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'content', 'articles');

const INDEXNOW_KEY = 'b4e8f2a9c1d34e5f8a7b6c5d4e3f2a1b';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_LIVE_ROOT = 'https://jeromatt3-create.github.io/testkompass24';

function resolveLiveRootUrl() {
  const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  const basePath = (process.env.BASE_PATH || '').trim().replace(/\/+$/, '');

  if (
    !siteUrl ||
    siteUrl.includes('dein-') ||
    siteUrl.includes('localhost') ||
    !siteUrl.startsWith('http')
  ) {
    return DEFAULT_LIVE_ROOT;
  }

  return `${siteUrl}${basePath === '/' ? '' : basePath}`;
}

export async function collectPortalUrls(liveRoot) {
  const urls = new Set([`${liveRoot}/`, `${liveRoot}/ueber-uns/`]);

  for (const cat of getCategoryList()) {
    urls.add(`${liveRoot}/kategorie/${cat.slug}/`);
  }

  const files = await fs.readdir(ARTICLES_DIR);
  for (const file of files.sort()) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    urls.add(`${liveRoot}/artikel/${slug}/`);
  }

  return Array.from(urls);
}

export async function pingIndexNow({ dryRun = false } = {}) {
  const liveRoot = resolveLiveRootUrl();
  const parsedRoot = new URL(liveRoot);
  const urlList = await collectPortalUrls(liveRoot);
  const keyLocation = `${liveRoot}/${INDEXNOW_KEY}.txt`;

  const payload = {
    host: parsedRoot.host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList,
  };

  if (dryRun) {
    console.log(`[DRY-RUN] IndexNow Ziel: ${INDEXNOW_ENDPOINT}`);
    console.log(`[DRY-RUN] Key-Location: ${keyLocation}`);
    console.log(`[DRY-RUN] URLs (${urlList.length}):`);
    for (const u of urlList) console.log(`  - ${u}`);
    return { dryRun: true, urlCount: urlList.length };
  }

  try {
    console.log(`🚀 Sende ${urlList.length} URLs an IndexNow (${parsedRoot.host})...`);
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text().catch(() => '');
    if (response.status === 200 || response.status === 202) {
      console.log(
        `✅ IndexNow erfolgreich (HTTP ${response.status}): ${urlList.length} URLs an Bing, DuckDuckGo, Ecosia & Yandex gemeldet.`
      );
      return { ok: true, status: response.status, urlCount: urlList.length };
    }

    console.warn(
      `⚠️ IndexNow Warnung (HTTP ${response.status}): ${responseText || response.statusText}`
    );
    return { ok: false, status: response.status, urlCount: urlList.length };
  } catch (err) {
    console.warn(`⚠️ IndexNow Netzwerk-Warnung (Build bleibt unberührt): ${err.message}`);
    return { ok: false, error: err.message, urlCount: urlList.length };
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dryRun = process.argv.includes('--dry-run');
  await pingIndexNow({ dryRun });
}
