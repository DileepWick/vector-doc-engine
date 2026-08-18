import { ChromaClient } from "chromadb";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { embedWithRetry, calculateCosineSimilarity } from "./embedder";

dotenv.config();

export interface QueryOptions {
  query: string;
  geminiApiKey?: string;
  chromaUrl?: string;
  embeddingModel?: string;
  collectionName?: string;
  topK?: number;
  minSimilarity?: number;
}

export interface QueryResultMatch {
  doc: string;
  score: number;
  chunkIndex: number | string;
  sourceFile: string;
  fileName?: string;
}

/**
 * Programmatic vector search query function.
 */
export async function queryVectorSearch(options: QueryOptions): Promise<QueryResultMatch[]> {
  const geminiApiKey = options.geminiApiKey || process.env.GEMINI_API_KEY;
  const chromaUrl = options.chromaUrl || process.env.CHROMA_URL || "http://localhost:8000";
  const embeddingModel = options.embeddingModel || process.env.GEMINI_EMBED_MODEL || "gemini-embedding-2-preview";
  const collectionName = options.collectionName || "pdf_chunks";
  const topK = options.topK || 3;
  const minSimilarity = options.minSimilarity !== undefined ? options.minSimilarity : 0.35;

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not defined in options or environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  const chroma = new ChromaClient({ path: chromaUrl });

  const collection = await chroma.getOrCreateCollection({
    name: collectionName,
    metadata: { "hnsw:space": "cosine" },
  });

  const queryVector = await embedWithRetry(ai, embeddingModel, options.query);

  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: topK,
  });

  const docs = results.documents?.[0] || [];
  const metadatas = results.metadatas?.[0] || [];
  const distances = results.distances?.[0] || [];

  if (!docs.length) {
    return [];
  }

  const matches: QueryResultMatch[] = docs
    .map((doc, idx) => {
      const rawDistance = distances[idx] !== undefined && distances[idx] !== null ? Number(distances[idx]) : 1.0;
      const score = calculateCosineSimilarity(rawDistance);
      const meta = metadatas[idx] || {};
      return {
        doc: doc || "",
        score,
        chunkIndex: typeof meta.chunkIndex === "number" || typeof meta.chunkIndex === "string" ? meta.chunkIndex : "N/A",
        sourceFile: typeof meta.sourceFile === "string" ? meta.sourceFile : "Unknown",
        fileName: typeof meta.fileName === "string" ? meta.fileName : undefined,
      };
    })
    .filter((match) => match.doc.length > 0 && match.score >= minSimilarity);

  return matches;
}

// CLI Execution Entry Point
if (require.main === module) {
  const question = process.argv[2];
  if (!question) {
    console.log('Usage: npx ts-node src/ask.ts "Your question about the PDF"');
  } else {
    queryVectorSearch({ query: question })
      .then((matches) => {
        console.log(`\nSearch Query: "${question}"\n`);
        if (matches.length === 0) {
          console.log("No relevant excerpts found matching query threshold (Score < 0.35).");
          return;
        }

        console.log(`--- Top ${matches.length} Most Relevant Document Excerpts ---`);
        matches.forEach((match, idx) => {
          console.log(
            `\n[Match ${idx + 1}] Similarity Score: ${match.score.toFixed(4)} | Chunk #${match.chunkIndex} | Source: "${match.sourceFile}"`
          );
          console.log(`Excerpt: "${match.doc}"`);
        });
      })
      .catch((err) => {
        console.error("Vector search query failed:", err.message || err);
        process.exit(1);
      });
  }
}
