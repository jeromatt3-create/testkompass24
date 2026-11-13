# Anleitung: Dein autonomes KI-Affiliate-Portal in 15 Minuten live schalten

Dieses Projekt kombiniert **Astro** (ultraschnelle, SEO-starke Vergleichs-Website) mit einer **autonomen Gemini-Pipeline** (Trend-Suche per Google Search Grounding + Artikelerstellung + automatische Veröffentlichung).

---

## 1. Dein 9 € Google Cloud Guthaben (Gemini Pro Abo) optimal nutzen

Im Rahmen von **Google AI Pro / Google Developer Program** erhältst du monatlich ca. **9 € (10 USD) Google Cloud Guthaben**. So verbindest du dieses Guthaben mit deiner Pipeline:

1. **Google Cloud Projekt prüfen / verknüpfen:**
   - Öffne die [Google Cloud Console](https://console.cloud.google.com/billing) und stelle sicher, dass dein **Abrechnungskonto mit dem monatlichen Guthaben** mit deinem Google Cloud Projekt verknüpft ist.
2. **Gemini API Key erstellen:**
   - Öffne [Google AI Studio (aistudio.google.com/apikey)](https://aistudio.google.com/apikey).
   - Klicke auf **„API-Schlüssel erstellen“** und wähle genau das **Google Cloud Projekt**, auf dem dein 9 € Guthaben liegt.
   - Kopiere den Key (`AIzaSy...`).
3. **Warum dein 9 € Guthaben für hunderte Artikel pro Monat reicht:**
   - Die Pipeline nutzt standardmäßig **`gemini-2.5-flash`**.
   - Ein kompletter Produktvergleich (Trend-Analyse + 1.200 Wörter Kaufberatung + Vergleichstabelle + FAQs) verbraucht ca. **4.000–7.000 Tokens** und kostet mit `gemini-2.5-flash` rund **0,002 € bis 0,005 €** pro Artikel.
   - Selbst bei **Google Search Grounding** (Live-Websuche für aktuelle Produktmodelle & Preise) deckt dein **9 € Monatsguthaben** problemlos den kompletten monatlichen Betrieb für ein stark wachsendes Portal ab.
   - *Tipp:* In der Google Cloud Console unter *Abrechnung → Budgets & Benachrichtigungen* kannst du optional ein Budget von `9 €` einstellen, sodass du volle Kostenkontrolle behältst.

---

## 2. Website kostenlos auf GitHub Pages online stellen (5 Minuten)

Da für Amazon PartnerNet eine **echte, erreichbare Website mit ersten Artikeln + Impressum** nötig ist, schaltest du das Portal zuerst mit den **3 bereits vorinstallierten Vergleichsartikeln** live:

1. **Impressum & Datenschutz personalisieren:**
   - Öffne `src/pages/impressum.astro` und `src/pages/datenschutz.astro`.
   - Ersetze die Platzhalter `[Dein Vor- und Nachname]`, `[Deine Straße ...]`, `[deine-email@beispiel.de]` mit deinen Daten.
2. **Repository auf GitHub erstellen & Code hochladen:**
   - Erstelle auf [github.com](https://github.com) ein neues Repository (z. B. `testkompass-portal`).
   - Lade alle Dateien aus diesem Ordner hoch (oder per `git push` auf Branch `main`).
3. **GitHub Pages aktivieren:**
   - Gehe im GitHub-Repository auf **Settings → Pages**.
   - Stelle unter **Build and deployment → Source** auf **`GitHub Actions`**.
4. **Secrets für den Autopilot eintragen:**
   - Gehe auf **Settings → Secrets and variables → Actions → New repository secret**:
     - `GEMINI_API_KEY`: Dein Key aus Schritt 1 (`AIzaSy...`)
     - `AMAZON_PARTNER_TAG`: Vorerst `dein-tag-21` (wird in Schritt 3 ersetzt!)
   - Fertig! Nach dem Push baut `.github/workflows/deploy-pages.yml` deine Website automatisch und zeigt unter *Settings → Pages* deine fertige Live-URL an (z. B. `https://dein-name.github.io/testkompass-portal/`).

> **Alternative:** Du kannst den Ordner `dist/` nach `npm run build` auch kostenlos auf **Cloudflare Pages** oder **Firebase Hosting** (ebenfalls mit deinem Google Cloud Projekt) hosten.

---

## 3. Amazon PartnerNet Account erstellen & verknüpfen (5 Minuten)

Amazon PartnerNet ist der einfachste und zuverlässigste Einstieg ins Affiliate-Marketing (ca. **1 % bis 10 % Provision** auf den gesamten Amazon-Warenkorb innerhalb von 24 Stunden nach Klick!).

1. **Anmelden:**
   - Öffne [partnernet.amazon.de](https://partnernet.amazon.de) und melde dich mit deinem normalen Amazon-Konto an.
2. **Website angeben:**
   - Gib bei der Registrierung deine neue Live-URL aus Schritt 2 ein.
   - Da die Website bereits **3 ausführliche Artikel, Vergleichstabellen, Impressum, Datenschutz und Partner-Hinweise** besitzt, erfüllt sie direkt alle Anforderungen.
3. **Tracking-ID eintragen:**
   - Nach der Anmeldung erhältst du sofort deine persönliche **Partner-ID / Tracking-ID** (Format meist `deinname-21`).
   - Trage diese ID in **GitHub → Settings → Secrets → `AMAZON_PARTNER_TAG`** ein (und lokal in `.env` bzw. `src/config/site.config.mjs`).
   - Sobald der nächste Build läuft (oder du unter *Actions → Website auf GitHub Pages veröffentlichen → Run workflow* klickst), werden **alle bestehenden und zukünftigen Produkt-Buttons** automatisch mit deinem Partner-Tag ausgeliefert!

> **Wichtiger Hinweis zu Amazon PartnerNet:** Nach der Anmeldung hast du **180 Tage Zeit**, mindestens **3 qualifizierte Verkäufe** zu erzielen, damit dein Konto endgültig bestätigt bleibt. (Eigene Bestellungen über deinen Link zählen nicht als qualifizierter Verkauf.)

---

## 4. Autonomen Cloud-Workflow starten & steuern

### Vollautomatischer Zeitplan
Die Datei `.github/workflows/autonomous-affiliate.yml` startet automatisch **täglich um 07:00 Uhr und 18:00 Uhr MEZ (06:00 & 17:00 UTC – 2 Artikel pro Tag)**:
1. Gemini durchsucht aktuelle Long-Tail- und Vergleichs-Trends in Deutschland (oder wählt das nächste Thema aus `src/config/topic-queue.json`).
2. Gemini schreibt einen neuen SEO-Vergleich mit 4–5 realen Amazon-Produkten, Vor-/Nachteilen, Preisen und FAQs.
3. Automatisch werden ein Hero-Bild (`.svg`) **und ein vertikaler 1000×1500 Pinterest-Pin (`.png`)** erzeugt.
4. Der neue Artikel wird automatisch ins Repository gespeichert, neu gebaut, auf GitHub Pages veröffentlicht und sofort per **IndexNow** an Suchmaschinen gemeldet.

---

## 5. Automatisierte Traffic-Kanäle (SEO, IndexNow & Pinterest)

1. **Interne Verlinkung & RSS-Feed (`/rss.xml`):**
   - Unter jedem Artikel werden automatisch bis zu 3 passende Vergleiche verlinkt (`RelatedArticles.astro`).
   - Der reguläre RSS-Feed liegt unter `https://jeromatt3-create.github.io/testkompass24/rss.xml`.
2. **IndexNow Sofort-Indexierung (Bing, DuckDuckGo, Ecosia, Yandex & ChatGPT Search):**
   - Nach jedem automatischen Deployment meldet `scripts/ping-indexnow.mjs` alle Artikel- und Kategorieseiten direkt über `https://api.indexnow.org/indexnow` (Verifizierung über `public/b4e8f2a9c1d34e5f8a7b6c5d4e3f2a1b.txt`).
   - Manueller Auslöser lokal: `npm run indexnow`
3. **Pinterest RSS Auto-Publish (`/pinterest-rss.xml`):**
   - Jeder Artikel bekommt automatisch eine vertikale `1000×1500`-Pin-Grafik unter `/images/pins/<slug>.png`.
   - Lege optional einen kostenlosen **Pinterest-Business-Account** an, gehe in den Einstellungen auf **RSS-Feed verbinden (Claim / Auto-Publish)** und trage diese Feed-URL ein:
     `https://jeromatt3-create.github.io/testkompass24/pinterest-rss.xml`
   - Pinterest veröffentlicht danach jeden neuen Vergleich automatisch als fertigen Pin inkl. Link zum Artikel!

### Manuell über GitHub (1 Klick)
Gehe auf GitHub auf **Actions → Autonomer Affiliate Content-Workflow → Run workflow**. Dort kannst du optional auch direkt ein Wunsch-Thema (`topic`), eine Kategorie oder die Anzahl (`count`) angeben.

### Lokal auf diesem PC testen & steuern
```bash
# 1. Abhängigkeiten installieren (einmalig)
npm install

# 2. .env Datei anlegen (Vorlage kopieren und GEMINI_API_KEY eintragen)
copy .env.example .env

# 3. Lokale Website im Browser ansehen
npm run dev

# 4. Pipeline trocken testen (ohne API-Kosten)
npm run pipeline -- --dry-run

# 5. Echten neuen Artikel mit Gemini generieren + Website testen
npm run pipeline -- --count=1 --build
```

### Optional: Cronjob komplett in Google Cloud (Cloud Run + Cloud Scheduler)
Falls du den Zeitplan lieber direkt in Google Cloud statt GitHub Actions laufen lassen möchtest, findest du die fertige Docker- und `gcloud`-Anleitung in `cloud/setup-gcp-scheduler.md`.
