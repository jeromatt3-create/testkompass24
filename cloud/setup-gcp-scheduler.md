# Google Cloud Run Job + Cloud Scheduler Setup (Optional für 9€ GCP-Guthaben)

Wenn du nicht nur deinen **Gemini API Key** über dein Google Cloud Abrechnungskonto (9 € Monatsguthaben) abrechnen möchtest, sondern auch den **Zeitplan-Trigger (Cronjob)** direkt in Google Cloud ausführen willst, gibt es zwei Wege:

---

## Option A (Empfohlen & 0 € Serverkosten): GitHub Actions + Gemini API Key aus Google Cloud

Die beste Kombination aus Aufwand, Kosten und Automatisierung:
1. Die **Gemini-API-Anfragen** laufen über deinen Google Cloud API Key (abgerechnet über das **9 € Google Cloud Monatsguthaben**).
2. Die **Ausführung & das Website-Hosting** laufen kostenlos über **GitHub Actions + GitHub Pages** (inkl. automatischem `git commit` der neuen Artikel).

---

## Option B: Google Cloud Scheduler → GitHub Workflow oder Cloud Run Job

Falls du den Zeitplan direkt in deinem **Google Cloud Projekt** verwalten möchtest:

### 1. Cloud Run Job bauen & deployen (einmalig in der Cloud Shell)
```bash
export PROJECT_ID="DEINE-GCP-PROJEKT-ID"
export REGION="europe-west1"

gcloud config set project $PROJECT_ID

# Container-Image mit Cloud Build erstellen
gcloud builds submit --tag gcr.io/$PROJECT_ID/affiliate-pipeline -f cloud/Dockerfile .

# Cloud Run Job anlegen (nutzt dein 9€ GCP-Guthaben / Free Tier)
gcloud run jobs create affiliate-content-job \
  --image gcr.io/$PROJECT_ID/affiliate-pipeline \
  --region $REGION \
  --set-env-vars "GEMINI_MODEL=gemini-2.5-flash,USE_SEARCH_GROUNDING=true" \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest"
```

### 2. Cloud Scheduler Cronjob anlegen (alle 2 Tage um 08:00 Uhr)
```bash
gcloud scheduler jobs create http affiliate-cron \
  --location=$REGION \
  --schedule="0 8 */2 * *" \
  --uri="https://${REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${PROJECT_ID}/jobs/affiliate-content-job:run" \
  --http-method=POST \
  --oauth-service-account-email="DEIN-SERVICE-ACCOUNT@${PROJECT_ID}.iam.gserviceaccount.com"
```

### Alternativ: Cloud Scheduler triggert direkt GitHub Actions
Du kannst in Google Cloud Scheduler auch einfach ein HTTP-POST auf die GitHub Workflow-Dispatch-API (`https://api.github.com/repos/DEIN-USER/DEIN-REPO/actions/workflows/autonomous-affiliate.yml/dispatches`) einrichten – so steuert Google Cloud den Zeitplan und GitHub speichert die generierten Artikel direkt im Repository!
