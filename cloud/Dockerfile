FROM node:22-slim

WORKDIR /app

# Nur Produktions-Abhängigkeiten & Pipeline-Skripte kopieren
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY astro.config.mjs ./

# Optional: In Cloud Run Jobs kann das Ergebnis via Git Push oder Firebase CLI deployed werden.
# Standardmäßig führt der Container die Artikel-Generierung + Build-Verifikation aus.
ENV NODE_ENV=production

CMD ["node", "scripts/run-pipeline.mjs", "--count=1"]
