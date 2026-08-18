import { GoogleGenAI } from "@google/genai";

/**
 * Resilient Gemini embedding API wrapper with Exponential Backoff + Jitter.
 */
export async function embedWithRetry(
  ai: GoogleGenAI,
  model: string,
  chunk: string,
  maxRetries = 5,
  baseDelay = 1000
): Promise<number[]> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await ai.models.embedContent({
        model,
        contents: chunk,
      });

      const values = res.embeddings?.[0]?.values;
      if (values && values.length > 0) {
        return values;
      }
      throw new Error("Received empty embedding vector from API.");
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isRateLimit = err?.status === 429 || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");
      const isTransient = isRateLimit || err?.status >= 500 || err?.code === "ETIMEDOUT" || err?.code === "ECONNRESET";

      if (attempt < maxRetries && isTransient) {
        const jitter = Math.random() * 250;
        const delay = baseDelay * Math.pow(2, attempt) + jitter;
        console.warn(
          `[API Backoff] Transient issue (${errMsg.slice(0, 80)}...). Retrying in ${Math.round(delay)}ms (Attempt ${attempt + 1}/${maxRetries})...`
        );
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw new Error(`Gemini Embedding API Error after ${attempt} retries: ${errMsg}`);
      }
    }
  }
  throw new Error("Failed to generate embedding vector.");
}

/**
 * Clamps Cosine Similarity score strictly between 0.0000 and 1.0000.
 */
export function calculateCosineSimilarity(cosineDistance: number): number {
  const rawSimilarity = 1 - cosineDistance;
  return Math.max(0, Math.min(1, rawSimilarity));
}
