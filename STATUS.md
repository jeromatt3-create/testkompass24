# Projektstand-Checkpoint (TestKompass24 – Autonomes Affiliate-Portal)

**Gespeichert am:** 13.11.2026  
**Workspace:** `c:\Users\jerom\Downloads\auto website affiliate`

---

## Was bereits fertig & getestet ist

1. **Astro 5 Vergleichsportal (`src/`):**
   - Zentrale Konfiguration (`src/config/site.config.mjs`) und Affiliate-Link-Engine (`src/utils/affiliate.js`) für `www.amazon.de`
   - UI-Komponenten: `BaseLayout.astro`, `ComparisonTable.astro`, `ProductCard.astro`, `FaqSection.astro`, `AffiliateNotice.astro`
   - Seiten: Startseite, Artikelseiten, 5 Kategorieseiten, `ueber-uns.astro`, `impressum.astro`, `datenschutz.astro`
   - **6 veröffentlichte Artikel** in `src/content/articles/` (alle 5 Kategorien gefüllt):
     1. `beste-heissluftfritteusen-vergleich.md`
     2. `bluetooth-kopfhoerer-noise-cancelling-vergleich.md`
     3. `saugroboter-mit-wischfunktion-vergleich.md`
     4. `kaffeevollautomat-unter-500-euro-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*
     5. `beste-powerbank-20000mah-usb-c-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*
     6. `walking-pad-laufband-vergleich.md` *(live durch Gemini + Google Search Grounding generiert)*

2. **Autonome Gemini-Pipeline (`scripts/`):**
   - `.env` ist mit aktivem `GEMINI_API_KEY` angelegt (durch `.gitignore` geschützt).
   - Standardmodell auf `gemini-flash-latest` (inkl. 404-Fallback & Google Search Grounding) konfiguriert.
   - `npm run build` (15 Seiten + `dist/sitemap-index.xml`) erfolgreich durchgelaufen.
   - `scripts/publish-github.mjs` (`npm run publish:github`) für den automatischen Upload via GitHub CLI (`gh`) eingerichtet.

3. **Cloud-Workflows (`.github/workflows/` & `cloud/`):**
   - `autonomous-affiliate.yml` (Cron Mo/Mi/Fr + manueller Trigger)
   - `deploy-pages.yml` (Automatisches Deployment auf GitHub Pages)
   - `cloud/Dockerfile` & `cloud/setup-gcp-scheduler.md` (optional für Google Cloud Run / Scheduler)

---

## Offene To-Dos beim Weitermachen

- [x] **1. Rechtliches personalisieren:** `src/pages/impressum.astro` und `src/pages/datenschutz.astro` mit `Jeronimo Mattmüller, Herbartstr. 1, 04318 Leipzig, jeromatt3@gmail.com` ausgefüllt und neu gebaut.
- [x] **2. Lokal ansehen:** Dev-Server läuft auf `http://localhost:4321/` und alle 5 Kategorien sind befüllt.
- [ ] **3. GitHub-Account anlegen & automatisch veröffentlichen:**
  - Kostenlosen GitHub-Account unter `https://github.com/signup` mit `jeromatt3@gmail.com` erstellen.
  - Einmalig mit `gh auth login --web --git-protocol https --scopes repo,workflow` anmelden und `npm run publish:github` ausführen.
- [ ] **4. Amazon PartnerNet einrichten:**
  - Die fertige Live-URL (`https://<github-name>.github.io/testkompass24/`) im linken Website-Feld bei `partnernet.amazon.de` eintragen (rechtes App-Feld leer lassen).
  - Erhaltene Tracking-ID (z. B. `deinname-21`) in `.env` und als GitHub Secret `AMAZON_PARTNER_TAG` eintragen.
