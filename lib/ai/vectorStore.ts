import rawData from "../../data/index/schemes.index.json";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { resolveCanonicalSchemeId } from "./schemeIdHelper";

export interface VectorChunk {
  id: string;
  text: string;
  embedding: number[];
  magnitude: number;
  metadata: {
    schemeId: string;
    schemeName: string;
    category: string;
    section: string;
    officialUrl?: string;
  };
}

export interface SearchResult extends VectorChunk {
  score: number;
}

// In-memory cache structures
let cachedIndex: VectorChunk[] | null = null;
let schemeChunksMap: Map<string, VectorChunk[]> | null = null;
let schemeIdsSet: Set<string> | null = null;

function computeMagnitude(vector: number[]): number {
  let sum = 0;
  for (let i = 0; i < vector.length; i += 1) {
    sum += vector[i] * vector[i];
  }
  return Math.sqrt(sum);
}

function resolveIndexPath(): string {
  const candidatePaths = [
    path.join(process.cwd(), "data/index/schemes.index.json"),
    path.join(process.cwd(), "yojana-connect/data/index/schemes.index.json"),
    path.resolve(__dirname, "../../data/index/schemes.index.json"),
  ];

  for (const p of candidatePaths) {
    try {
      if (existsSync(p)) {
        return p;
      }
    } catch {
      // continue
    }
  }

  return path.join(process.cwd(), "data/index/schemes.index.json");
}

export async function loadIndex(): Promise<VectorChunk[]> {
  if (cachedIndex && cachedIndex.length > 0) {
    return cachedIndex;
  }

  let items: Array<{
    id: string;
    text: string;
    embedding: number[];
    metadata: VectorChunk["metadata"];
  }> = [];

  // 1. Try static import (handles both direct array and default export)
  if (Array.isArray(rawData)) {
    items = (rawData as unknown) as typeof items;
  } else if (rawData && typeof rawData === "object" && Array.isArray((rawData as { default?: unknown }).default)) {
    items = ((rawData as { default: unknown }).default as unknown) as typeof items;
  }

  // 2. Fallback to filesystem if static import was empty
  if (!items || items.length === 0) {
    const candidatePaths = [
      path.join(process.cwd(), "data/index/schemes.index.json"),
      path.join(process.cwd(), "yojana-connect/data/index/schemes.index.json"),
      path.resolve(__dirname, "../../data/index/schemes.index.json"),
      path.resolve(__dirname, "../../../data/index/schemes.index.json"),
    ];

    for (const p of candidatePaths) {
      try {
        if (existsSync(p)) {
          const content = await fs.readFile(p, "utf-8");
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            items = parsed;
            break;
          }
        }
      } catch {
        // continue
      }
    }
  }

  schemeChunksMap = new Map();
  schemeIdsSet = new Set();

  cachedIndex = items.map((item) => {
    const magnitude = computeMagnitude(item.embedding);
    const enriched: VectorChunk = {
      ...item,
      magnitude,
    };

    const sId = item.metadata?.schemeId;
    if (sId) {
      schemeIdsSet!.add(sId);
      if (!schemeChunksMap!.has(sId)) {
        schemeChunksMap!.set(sId, []);
      }
      schemeChunksMap!.get(sId)!.push(enriched);
    }

    return enriched;
  });

  return cachedIndex;
}

function fastCosineSimilarity(
  queryEmbedding: number[],
  queryMagnitude: number,
  chunk: VectorChunk
): number {
  let dot = 0;
  const chunkEmbedding = chunk.embedding;
  const len = Math.min(queryEmbedding.length, chunkEmbedding.length);

  for (let i = 0; i < len; i += 1) {
    dot += queryEmbedding[i] * chunkEmbedding[i];
  }

  const denominator = queryMagnitude * chunk.magnitude;
  if (denominator === 0 || !Number.isFinite(denominator)) return 0;
  const sim = dot / denominator;
  return Number.isFinite(sim) ? sim : 0;
}

export async function search(
  queryEmbedding: number[],
  options: { schemeId?: string | null; queryText?: string; limit?: number } = {}
): Promise<SearchResult[]> {
  const { schemeId = null, queryText = "", limit = 2 } = options;
  const allChunks = await loadIndex();

  const resolvedId = schemeId ? resolveCanonicalSchemeId(schemeId) : null;

  let candidates: VectorChunk[] = allChunks;
  if (resolvedId && schemeChunksMap?.has(resolvedId)) {
    candidates = schemeChunksMap.get(resolvedId)!;
  } else if (schemeId && schemeChunksMap?.has(schemeId)) {
    candidates = schemeChunksMap.get(schemeId)!;
  }

  // Ensure query vector dimension matches candidate embedding dimension (768)
  const targetDim = candidates[0]?.embedding?.length || 768;
  const normalizedQuery =
    queryEmbedding.length > targetDim ? queryEmbedding.slice(0, targetDim) : queryEmbedding;
  const queryMag = computeMagnitude(normalizedQuery);

  const queryTokens = queryText
    ? queryText.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
    : [];

  return candidates
    .map((item) => {
      let score = fastCosineSimilarity(normalizedQuery, queryMag, item);

      // Add lexical relevance boost for matching scheme title or section
      if (queryTokens.length > 0) {
        const titleAndSection = `${item.metadata.schemeName} ${item.metadata.section} ${item.metadata.schemeId}`.toLowerCase();
        let matches = 0;
        for (const token of queryTokens) {
          if (titleAndSection.includes(token)) {
            matches += 1;
          }
        }
        if (matches > 0) {
          score = Math.min(1.0, score + Math.min(0.15, matches * 0.05));
        }
      }

      return {
        ...item,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function hasScheme(schemeId?: string | null): Promise<boolean> {
  if (!schemeId) return false;
  await loadIndex();
  const resolvedId = resolveCanonicalSchemeId(schemeId);
  return (schemeIdsSet?.has(resolvedId) || schemeIdsSet?.has(schemeId)) ?? false;
}

export async function getChunksByScheme(
  schemeId?: string | null,
  limit = 2
): Promise<SearchResult[]> {
  const allChunks = await loadIndex();
  const resolvedId = schemeId ? resolveCanonicalSchemeId(schemeId) : null;
  let candidates: VectorChunk[] = [];
  if (resolvedId && schemeChunksMap?.has(resolvedId)) {
    candidates = schemeChunksMap.get(resolvedId)!;
  } else if (schemeId && schemeChunksMap?.has(schemeId)) {
    candidates = schemeChunksMap.get(schemeId)!;
  } else {
    candidates = allChunks;
  }
  return candidates.slice(0, limit).map((item) => ({ ...item, score: 0.99 }));
}

export function getIndexStats(): { isLoaded: boolean; totalChunks: number; totalSchemes: number } {
  return {
    isLoaded: Boolean(cachedIndex && cachedIndex.length > 0),
    totalChunks: cachedIndex ? cachedIndex.length : 0,
    totalSchemes: schemeIdsSet ? schemeIdsSet.size : 0,
  };
}
