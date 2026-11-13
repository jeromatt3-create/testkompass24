import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { discoverNextTopic, markQueueItemPublished } from './discover-trends.mjs';
import { generateArticle } from './generate-article.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const opts = {
    topic: '',
    category: '',
    count: 1,
    dryRun: false,
    build: false,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--build') opts.build = true;
    else if (arg.startsWith('--topic=')) opts.topic = arg.slice('--topic='.length);
    else if (arg.startsWith('--category=')) opts.category = arg.slice('--category='.length);
    else if (arg.startsWith('--count=')) {
      const n = Number(arg.slice('--count='.length));
      if (Number.isFinite(n) && n >= 1 && n <= 10) opts.count = Math.floor(n);
    }
  }

  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  console.log('🚀 Starte autonome Affiliate-Content-Pipeline...');
  console.log(
    `   Modus: ${opts.dryRun ? 'DRY-RUN (ohne API-Kosten / ohne Schreibvorgang)' : 'PRODUKTIV'} | Anzahl: ${opts.count}`
  );

  const results = [];
  const sessionSlugs = [];

  for (let i = 0; i < opts.count; i++) {
    console.log(`\n--- Durchlauf ${i + 1} von ${opts.count} ---`);
    const topic = await discoverNextTopic({
      requestedTopic: i === 0 ? opts.topic : '',
      requestedCategory: opts.category,
      dryRun: opts.dryRun,
      excludedSlugs: sessionSlugs,
    });

    sessionSlugs.push(topic.slug);
    console.log(`🎯 Gewähltes Thema: "${topic.title}"`);
    console.log(`   Kategorie: ${topic.category} | Slug: ${topic.slug} | Quelle: ${topic.source}`);
    console.log(`   Begründung: ${topic.rationale}`);

    const articleResult = await generateArticle({
      topic,
      dryRun: opts.dryRun,
    });

    if (!opts.dryRun && topic.queueId) {
      await markQueueItemPublished(topic.queueId);
      console.log(`📌 Queue-Eintrag "${topic.queueId}" als veröffentlicht markiert.`);
    }

    results.push(articleResult);
  }

  if (opts.build && !opts.dryRun) {
    console.log('\n🏗️ Starte Astro Produktions-Build (npm run build)...');
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('✅ Website erfolgreich gebaut!');
  }

  console.log('\n✨ Pipeline abgeschlossen:');
  for (const r of results) {
    if (r.dryRun) {
      console.log(
        `   [DRY-RUN] Würde schreiben: ${path.relative(ROOT_DIR, r.articlePath)} (Frontmatter OK: ${r.frontmatterValid}, Prompt-Länge: ${r.promptLength} Zeichen)`
      );
    } else {
      console.log(
        `   [PUBLISHED] ${r.title} -> ${path.relative(ROOT_DIR, r.articlePath)} (${r.productCount} Produkte)`
      );
    }
  }
}

main().catch((err) => {
  console.error('❌ Pipeline-Fehler:', err.message);
  process.exit(1);
});
