import 'dotenv/config';

const FALLBACK_MODEL = 'gemini-flash-latest';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || FALLBACK_MODEL;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function hasGeminiCredentials() {
  return Boolean(
    process.env.GEMINI_API_KEY ||
      (process.env.GCP_PROJECT_ID && process.env.GCP_ACCESS_TOKEN)
  );
}

/**
 * Extrahiert ein JSON-Objekt aus einer Gemini-Antwort (auch mit Markdown-Codefences).
 */
export function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Leere Antwort von Gemini erhalten.');
  }

  const trimmed = text.trim();

  // 1. Direkter JSON-Parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // weiter versuchen
  }

  // 2. ```json ... ``` Block
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch && fencedMatch[1]) {
    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch {
      // weiter versuchen
    }
  }

  // 3. Erstes { bis letztes }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    return JSON.parse(candidate);
  }

  throw new Error(`Konnte kein gültiges JSON aus der Gemini-Antwort parsen:\n${trimmed.slice(0, 400)}`);
}

/**
 * Schätzt die ungefähren Kosten in Euro für Gemini 2.5 Flash.
 */
export function estimateCostEur(usageMetadata = {}) {
  const promptTokens = usageMetadata.promptTokenCount || 0;
  const outputTokens = usageMetadata.candidatesTokenCount || 0;
  // Konservative Schätzung für Gemini 2.5 Flash (USD -> EUR ~0.95)
  const usd = (promptTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.6;
  return {
    promptTokens,
    outputTokens,
    totalTokens: usageMetadata.totalTokenCount || promptTokens + outputTokens,
    estimatedEur: Number((usd * 0.95).toFixed(5)),
  };
}

function buildEndpointUrl(model) {
  if (process.env.GCP_PROJECT_ID && process.env.GCP_ACCESS_TOKEN && !process.env.GEMINI_API_KEY) {
    const location = process.env.GCP_LOCATION || 'europe-west1';
    const projectId = process.env.GCP_PROJECT_ID;
    return {
      url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GCP_ACCESS_TOKEN}`,
      },
      mode: 'vertex-ai',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Kein GEMINI_API_KEY gesetzt. Bitte trage deinen Key in .env oder GitHub Secrets ein.'
    );
  }

  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'ai-studio',
  };
}

/**
 * Sendet einen Prompt an Google Gemini (inkl. optionalem Google Search Grounding & Retry).
 */
export async function generateWithGemini({
  prompt,
  systemInstruction = '',
  model = DEFAULT_MODEL,
  useSearchGrounding = process.env.USE_SEARCH_GROUNDING !== 'false',
  temperature = 0.4,
  expectJson = true,
  maxRetries = 3,
}) {
  let currentModel = model;

  async function sendRequest(enableGrounding, activeModel) {
    const { url, headers, mode } = buildEndpointUrl(activeModel);
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    // Bei deaktiviertem Grounding können wir striktes JSON-MIME erzwingen;
    // bei aktivem Search-Grounding funktioniert JSON über Prompt-Vorgabe am stabilsten.
    if (expectJson && !enableGrounding) {
      body.generationConfig.responseMimeType = 'application/json';
    }

    if (enableGrounding) {
      body.tools = [{ google_search: {} }];
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      const err = new Error(`Gemini API Fehler (${res.status}, ${mode}): ${errorBody}`);
      err.status = res.status;
      err.errorBody = errorBody;
      err.mode = mode;
      throw err;
    }

    return { json: await res.json(), mode };
  }

  let lastError = null;
  let groundingActive = Boolean(useSearchGrounding);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { json: data, mode } = await sendRequest(groundingActive, currentModel);
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts
        .map((p) => p.text || '')
        .join('\n')
        .trim();

      if (!text) {
        throw new Error('Gemini hat keinen Text zurückgegeben.');
      }

      const usage = estimateCostEur(data?.usageMetadata);
      const parsed = expectJson ? extractJsonFromText(text) : null;

      return {
        text,
        data: parsed,
        usage,
        groundingUsed: groundingActive,
        groundingMetadata: data?.candidates?.[0]?.groundingMetadata || null,
        model: currentModel,
        mode,
      };
    } catch (err) {
      lastError = err;

      // Falls ein älteres Modell für neue Keys 404 liefert, automatisch auf gemini-flash-latest wechseln.
      if (err.status === 404 && currentModel !== FALLBACK_MODEL) {
        console.warn(
          `⚠️ Modell "${currentModel}" nicht verfügbar (404) – wechsle auf "${FALLBACK_MODEL}"...`
        );
        currentModel = FALLBACK_MODEL;
        continue;
      }

      // Falls Google Search Grounding für das Projekt/Modell nicht verfügbar ist,
      // automatisch ohne Grounding wiederholen.
      if (groundingActive && err.status === 400) {
        console.warn(
          '⚠️ Google Search Grounding wurde abgelehnt (400) – wechsle auf Standard-Generierung...'
        );
        groundingActive = false;
        continue;
      }

      if (attempt < maxRetries && (err.status === 429 || err.status >= 500 || !err.status)) {
        const waitMs = 1500 * Math.pow(2, attempt - 1);
        console.warn(`⏳ Versuch ${attempt} fehlgeschlagen, neuer Versuch in ${waitMs} ms...`);
        await sleep(waitMs);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}
