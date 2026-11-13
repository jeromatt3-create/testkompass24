# Projektstand-Checkpoint (TestKompass24 – Autonomes Affiliate-Portal)

**Gespeichert am:** 13.11.2026  
**Workspace:** `c:\Users\jerom\Downloads\auto website affiliate`

---

## Was bereits fertig & getestet ist

1. **Astro 5 Vergleichsportal (`src/`):**
   - Zentrale Konfiguration (`src/config/site.config.mjs`) und Affiliate-Link-Engine (`src/utils/affiliate.js`) für `www.amazon.de`
   - UI-Komponenten: `BaseLayout.astro`, `ComparisonTable.astro`, `ProductCard.astro`, `FaqSection.astro`, `AffiliateNotice.astro`, `RelatedArticles.astro`
   - Seiten & Feeds: Startseite, Artikelseiten (inkl. interner Verlinkung), 5 Kategorieseiten, `/rss.xml`, `/pinterest-rss.xml`, `ueber-uns.astro`, `impressum.astro`, `datenschutz.astro`
   - **10 veröffentlichte Artikel** in `src/content/articles/` (alle 5 Kategorien gefüllt, je mit `.svg` Hero-Bild und `1000x1500` `.png` Pinterest-Pin):
     1. `beste-heissluftfritteusen-vergleich.md`
     2. `bluetooth-kopfhoerer-noise-cancelling-vergleich.md`
     3. `saugroboter-mit-wischfunktion-vergleich.md`
     4. `kaffeevollautomat-unter-500-euro-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*
     5. `beste-powerbank-20000mah-usb-c-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*
     6. `walking-pad-laufband-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*
     7. `akku-staubsauger-tierhaare-vergleich.md` *(autonom in GitHub Actions generiert)*
     8. `gan-usb-c-ladegeraet-65w-100w-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*
     9. `roborock-qrevo-s-vs-dreame-l10s-ultra-gen-2.md` *(live durch Gemini + Google Search Grounding generiert)*
     10. `smarte-heizkoerperthermostate-ohne-abo-test.md` *(live durch Gemini + Google Search Grounding generiert)*

2. **Autonome Gemini-Pipeline (`scripts/`):**
   - `.env` ist mit aktivem `GEMINI_API_KEY` angelegt (durch `.gitignore` geschützt).
   - Standardmodell auf `gemini-flash-latest` (inkl. 404-Fallback & Google Search Grounding) konfiguriert, geschärft auf kaufstarke Long-Tail- und „VS"-Vergleiche.
   - `scripts/generate-pins.mjs` (`npm run pins`): Generiert vertikale `1000x1500` `.png` Pinterest-Infografik-Pins via `sharp`.
   - `scripts/ping-indexnow.mjs` (`npm run indexnow`): Sendet neue URLs direkt per IndexNow (`public/b4e8f2a9c1d34e5f8a7b6c5d4e3f2a1b.txt`) an Bing, DuckDuckGo, Ecosia & Yandex.
   - `npm run build` (19 Seiten/Endpunkte + `dist/sitemap-index.xml`) erfolgreich durchgelaufen.
   - `scripts/publish-github.mjs` (`npm run publish:github`) für den automatischen Upload via GitHub CLI (`gh`) eingerichtet.

3. **Cloud-Workflows (`.github/workflows/` & `cloud/`):**
   - `autonomous-affiliate.yml` (**täglich 07:00 & 18:00 Uhr MEZ / 06:00 & 17:00 UTC** + manueller Trigger + automatischer IndexNow-Ping)
   - `deploy-pages.yml` (Automatisches Deployment auf GitHub Pages)
   - `cloud/Dockerfile` & `cloud/setup-gcp-scheduler.md` (optional für Google Cloud Run / Scheduler)

---

## Offene To-Dos beim Weitermachen

- [x] **1. Rechtliches personalisieren:** `src/pages/impressum.astro` und `src/pages/datenschutz.astro` mit `Jeronimo Mattmüller, Max-Grothe-Str. 4, 04324 Leipzig, vd1hz54pr@mozmail.com, Tel. 015754686543` ausgefüllt und neu gebaut.
- [x] **2. Lokal ansehen:** Dev-Server läuft auf `http://localhost:4321/` und alle 5 Kategorien sind befüllt.
- [x] **3. GitHub-Account anlegen & automatisch veröffentlichen:**
  - Repository live unter `https://github.com/jeromatt3-create/testkompass24`
  - Live-Website unter `https://jeromatt3-create.github.io/testkompass24/`
- [x] **4. Amazon PartnerNet einrichten:**
  - Tracking-ID `testkompass0a-21` in `.env`, Konfiguration, Workflows und GitHub Secrets aktiviert.
