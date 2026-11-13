import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const DEFAULT_GH_PATHS = [
  'C:\\Program Files\\GitHub CLI\\gh.exe',
  'C:\\Program Files (x86)\\GitHub CLI\\gh.exe',
  'gh',
];

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', 'websites']);
const BINARY_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.pdf', '.woff2']);

function resolveGhBinary() {
  for (const candidate of DEFAULT_GH_PATHS) {
    if (candidate === 'gh' || fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('GitHub CLI (gh) wurde nicht gefunden.');
}

function runGh(ghBin, args, { input, allowFail = false } = {}) {
  try {
    return execFileSync(ghBin, args, {
      cwd: ROOT_DIR,
      input,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 25 * 1024 * 1024,
    }).trim();
  } catch (err) {
    if (allowFail) {
      return { error: true, status: err.status, stderr: err.stderr?.toString() || err.message };
    }
    const detail = err.stderr?.toString()?.trim() || err.message;
    throw new Error(`gh ${args.join(' ')} fehlgeschlagen: ${detail}`);
  }
}

function ghApi(ghBin, endpoint, { method = 'GET', body = null, allowFail = false } = {}) {
  const args = ['api', endpoint, '--method', method, '-H', 'Accept: application/vnd.github+json'];
  let input;
  if (body !== null) {
    args.push('--input', '-');
    input = JSON.stringify(body);
  }
  const out = runGh(ghBin, args, { input, allowFail });
  if (typeof out === 'object' && out?.error) {
    return out;
  }
  if (!out) return null;
  try {
    return JSON.parse(out);
  } catch {
    return out;
  }
}

function shouldIgnoreFile(relPosixPath) {
  const base = path.posix.basename(relPosixPath);
  if (base === '.DS_Store' || base === 'Thumbs.db') return true;
  if (base.startsWith('npm-debug.log')) return true;
  if (base === '.env' || base === '.env.local' || (base.startsWith('.env.') && base !== '.env.example')) {
    return true;
  }
  return false;
}

async function collectWorkspaceFiles(dir = ROOT_DIR, relPrefix = '') {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absPath = path.join(dir, entry.name);
    const relPosix = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const nested = await collectWorkspaceFiles(absPath, relPosix);
      files.push(...nested);
    } else if (entry.isFile()) {
      if (shouldIgnoreFile(relPosix)) continue;
      files.push({ absPath, relPosix });
    }
  }

  return files.sort((a, b) => a.relPosix.localeCompare(b.relPosix));
}

function parseArgs(argv) {
  const opts = {
    repo: 'testkompass24',
    message: 'feat: TestKompass24 Affiliate-Portal & autonome Gemini-Pipeline',
    dryRun: false,
  };
  for (const arg of argv) {
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg.startsWith('--repo=')) opts.repo = arg.slice('--repo='.length).trim();
    else if (arg.startsWith('--message=')) opts.message = arg.slice('--message='.length).trim();
  }
  return opts;
}

async function syncCloudTopicQueue(ghBin, fullRepo) {
  const localQueuePath = path.join(ROOT_DIR, 'src', 'config', 'topic-queue.json');
  const remoteFile = ghApi(ghBin, `repos/${fullRepo}/contents/src/config/topic-queue.json`, {
    allowFail: true,
  });
  if (!remoteFile || remoteFile.error || !remoteFile.content) {
    return;
  }

  let remoteQueue;
  let localQueue;
  try {
    const rawRemote = Buffer.from(String(remoteFile.content).replace(/\s+/g, ''), 'base64').toString('utf8');
    remoteQueue = JSON.parse(rawRemote);
    localQueue = JSON.parse(await fsp.readFile(localQueuePath, 'utf8'));
  } catch {
    return;
  }
  if (!Array.isArray(remoteQueue) || !Array.isArray(localQueue)) {
    return;
  }

  const cloudPublished = new Map();
  for (const item of remoteQueue) {
    if (item && item.id && item.status === 'published') {
      cloudPublished.set(item.id, item.publishedAt || new Date().toISOString());
    }
  }

  let updated = 0;
  const localIds = new Set();
  const merged = localQueue.map((item) => {
    if (item?.id) localIds.add(item.id);
    if (item?.id && cloudPublished.has(item.id) && item.status !== 'published') {
      updated++;
      return { ...item, status: 'published', publishedAt: cloudPublished.get(item.id) };
    }
    return item;
  });

  for (const item of remoteQueue) {
    if (item?.id && !localIds.has(item.id)) {
      merged.push(item);
      updated++;
    }
  }

  if (updated > 0) {
    await fsp.writeFile(localQueuePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    console.log(`🔄 Cloud-Queue synchronisiert (${updated} Einträge übernommen).`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = await collectWorkspaceFiles();

  if (opts.dryRun) {
    console.log(`[DRY-RUN] Repository-Ziel: <github-user>/${opts.repo}`);
    console.log(`[DRY-RUN] Gefundene Dateien für Upload: ${files.length}`);
    console.log(`[DRY-RUN] .env ausgeschlossen: ${!files.some((f) => f.relPosix === '.env')}`);
    console.log(
      `[DRY-RUN] Workflows enthalten: ${files.filter((f) => f.relPosix.startsWith('.github/workflows/')).map((f) => f.relPosix).join(', ')}`
    );
    return;
  }

  const ghBin = resolveGhBinary();

  // 1. Login prüfen
  const userCheck = runGh(ghBin, ['api', 'user', '--jq', '.login'], { allowFail: true });
  if (typeof userCheck === 'object' && userCheck?.error) {
    throw new Error(
      `Du bist noch nicht bei GitHub CLI angemeldet.\nBitte melde dich einmalig im Browser an mit:\n"${ghBin}" auth login --web --git-protocol https --scopes repo,workflow`
    );
  }
  const owner = userCheck;
  const fullRepo = `${owner}/${opts.repo}`;
  console.log(`👤 Angemeldet als GitHub-Nutzer: ${owner}`);

  // 2. Repository anlegen falls noch nicht vorhanden
  const repoView = runGh(ghBin, ['repo', 'view', fullRepo], { allowFail: true });
  if (typeof repoView === 'object' && repoView?.error) {
    console.log(`📦 Erstelle öffentliches GitHub-Repository ${fullRepo}...`);
    runGh(ghBin, [
      'repo',
      'create',
      opts.repo,
      '--public',
      '--description',
      'TestKompass24 - Autonomes KI-Affiliate-Vergleichsportal',
    ]);
  } else {
    console.log(`📦 Nutze vorhandenes Repository ${fullRepo}`);
  }

  // 3. Initialen Branch "main" sicherstellen, falls Repo leer ist
  let refData = ghApi(ghBin, `repos/${fullRepo}/git/ref/heads/main`, { allowFail: true });
  if (refData?.error) {
    console.log('🌱 Initialisiere main-Branch...');
    const seedContent = Buffer.from('# TestKompass24\n\nAutonomes Affiliate-Vergleichsportal.\n', 'utf8').toString('base64');
    ghApi(ghBin, `repos/${fullRepo}/contents/README.md`, {
      method: 'PUT',
      body: {
        message: 'chore: initialize repository',
        content: seedContent,
        branch: 'main',
      },
    });
    refData = ghApi(ghBin, `repos/${fullRepo}/git/ref/heads/main`);
  }

  const headCommitSha = refData.object.sha;
  const headCommit = ghApi(ghBin, `repos/${fullRepo}/git/commits/${headCommitSha}`);
  const baseTreeSha = headCommit?.tree?.sha;

  // 4. Secrets aus .env vor dem Push setzen, damit der push-Build direkt die neuesten Werte nutzt
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    runGh(ghBin, ['secret', 'set', 'GEMINI_API_KEY', '--repo', fullRepo], { input: geminiKey });
    console.log('🔐 Secret GEMINI_API_KEY gespeichert.');
  }
  const partnerTag = process.env.AMAZON_PARTNER_TAG || 'testkompass0a-21';
  runGh(ghBin, ['secret', 'set', 'AMAZON_PARTNER_TAG', '--repo', fullRepo], { input: partnerTag });
  console.log(`🔐 Secret AMAZON_PARTNER_TAG (${partnerTag}) gespeichert.`);

  // 5. GitHub Pages für GitHub Actions aktivieren
  const pagesRes = ghApi(ghBin, `repos/${fullRepo}/pages`, {
    method: 'POST',
    body: { build_type: 'workflow' },
    allowFail: true,
  });
  if (pagesRes?.error) {
    ghApi(ghBin, `repos/${fullRepo}/pages`, {
      method: 'PUT',
      body: { build_type: 'workflow' },
      allowFail: true,
    });
  }
  console.log('🌐 GitHub Pages (Build via GitHub Actions) aktiviert.');

  // 6. Cloud-Queue abgleichen & Dateien als Git Tree hochladen (löst deploy-pages.yml automatisch aus)
  await syncCloudTopicQueue(ghBin, fullRepo);
  console.log(`⬆️ Lade ${files.length} Projektdateien nach ${fullRepo} hoch...`);
  const tree = [];
  for (const file of files) {
    const ext = path.extname(file.absPath).toLowerCase();
    if (BINARY_EXTS.has(ext)) {
      const b64 = (await fsp.readFile(file.absPath)).toString('base64');
      const blob = ghApi(ghBin, `repos/${fullRepo}/git/blobs`, {
        method: 'POST',
        body: { content: b64, encoding: 'base64' },
      });
      tree.push({ path: file.relPosix, mode: '100644', type: 'blob', sha: blob.sha });
    } else {
      const text = await fsp.readFile(file.absPath, 'utf8');
      tree.push({ path: file.relPosix, mode: '100644', type: 'blob', content: text });
    }
  }

  const newTree = ghApi(ghBin, `repos/${fullRepo}/git/trees`, {
    method: 'POST',
    body: baseTreeSha ? { base_tree: baseTreeSha, tree } : { tree },
  });

  const newCommit = ghApi(ghBin, `repos/${fullRepo}/git/commits`, {
    method: 'POST',
    body: {
      message: opts.message,
      tree: newTree.sha,
      parents: [headCommitSha],
    },
  });

  ghApi(ghBin, `repos/${fullRepo}/git/refs/heads/main`, {
    method: 'PATCH',
    body: { sha: newCommit.sha, force: false },
  });
  console.log(`✅ Commit ${newCommit.sha.slice(0, 7)} auf main veröffentlicht.`);

  const liveUrl = `https://${owner}.github.io/${opts.repo}/`;
  console.log('\n🎉 Fertig! Dein Repository und Live-Portal werden jetzt automatisch gebaut:');
  console.log(`   Repository:   https://github.com/${fullRepo}`);
  console.log(`   Actions-Log:  https://github.com/${fullRepo}/actions`);
  console.log(`   Live-URL:     ${liveUrl}`);
}

main().catch((err) => {
  console.error('❌ Fehler:', err.message);
  process.exit(1);
});
