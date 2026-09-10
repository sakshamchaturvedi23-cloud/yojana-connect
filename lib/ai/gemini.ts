import { GoogleGenAI } from "@google/genai";
import { SupportedLanguage } from "./language";

let clientInstance: GoogleGenAI | null = null;
let clientApiKey: string | null = null;

export function resolveEmbeddingModel(modelName?: string): string {
  if (!modelName || modelName === "text-embedding-004") {
    return "gemini-embedding-001";
  }
  return modelName.trim();
}

export function resolveGenerationModel(modelName?: string): string {
  if (!modelName) return "gemini-3.5-flash-lite";
  const normalized = modelName.trim().toLowerCase();
  if (
    normalized === "gemini-1.5-flash" ||
    normalized === "gemini-1.5-pro" ||
    normalized === "gemini-1.0-pro" ||
    normalized === "gemini-2.0-flash" ||
    normalized === "gemini-2.0-flash-exp"
  ) {
    return "gemini-3.5-flash-lite";
  }
  return modelName.trim();
}

function withTimeout<T>(promise: Promise<T>, milliseconds: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(
        () => reject(new Error(`${operation} timed out after ${milliseconds / 1000} seconds.`)),
        milliseconds
      );
    }),
  ]);
}

export function getGeminiClient(): GoogleGenAI {
  const rawKey = process.env.GEMINI_API_KEY || "";
  const apiKey = rawKey.trim().replace(/^["'\\]+|["'\\]+$/g, "").trim();

  if (!apiKey || apiKey === "PASTE_YOUR_KEY_HERE" || apiKey.includes("your-gemini-api-key")) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  if (clientInstance && clientApiKey === apiKey) {
    return clientInstance;
  }

  const options: Record<string, any> = { apiKey };

  if (process.env.GEMINI_VERTEX_AI === "true" || process.env.VERTEX_AI === "true") {
    options.vertexai = true;
  }
  if (process.env.GOOGLE_CLOUD_PROJECT || process.env.GEMINI_PROJECT_ID) {
    options.project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GEMINI_PROJECT_ID;
  }
  if (process.env.GOOGLE_CLOUD_LOCATION || process.env.GEMINI_LOCATION) {
    options.location = process.env.GOOGLE_CLOUD_LOCATION || process.env.GEMINI_LOCATION;
  }
  if (process.env.GEMINI_API_VERSION) {
    options.apiVersion = process.env.GEMINI_API_VERSION;
  }

  clientInstance = new GoogleGenAI(options);
  clientApiKey = apiKey;
  return clientInstance;
}

export async function embedMany(texts: string[]): Promise<number[][]> {
  let lastError: unknown;
  const primaryModel = resolveEmbeddingModel(process.env.EMBEDDING_MODEL);
  const candidateModels = [primaryModel, "gemini-embedding-001", "text-embedding-004"];
  const uniqueModels = [...new Set(candidateModels.filter(Boolean))];

  for (const model of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const client = getGeminiClient();
        const result = await withTimeout(
          client.models.embedContent({
            model,
            contents: texts,
            config: { outputDimensionality: 768 },
          }),
          10000,
          `Embedding request (${model})`
        );

        if (result.embeddings && result.embeddings.length > 0) {
          const mapped = result.embeddings.map((e) => (e.values ? Array.from(e.values) : []));
          if (mapped.length > 0 && mapped[0].length > 0) {
            return mapped;
          }
        }

        const anyResult = result as any;
        if (anyResult.embedding?.values) {
          return [Array.from(anyResult.embedding.values)];
        }
        if (Array.isArray(anyResult.values) && anyResult.values.length > 0) {
          return [Array.from(anyResult.values)];
        }

        throw new Error(`Empty embedding output returned by model ${model}`);
      } catch (error) {
        lastError = error;
        console.warn(
          `[Gemini API] embedContent attempt ${attempt}/2 failed (${model}):`,
          error instanceof Error ? error.message : error
        );
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Embedding request failed across candidate models: ${message}`);
}

export async function embed(text: string): Promise<number[]> {
  const list = await embedMany([text]);
  if (!list || !list[0] || list[0].length === 0) {
    throw new Error("No embedding vector returned for text query");
  }
  return list[0];
}

function getLanguageInstruction(language: SupportedLanguage): string {
  switch (language) {
    case "mr":
      return "Reply natively in Marathi (मराठी) using the Devanagari script. Do not reply in English or Hindi. Translate scheme details, benefits, and eligibility naturally into standard Marathi.";
    case "ta":
      return "Reply natively in Tamil (தமிழ்) using the Tamil script. Do not reply in English or Hindi. Translate scheme details, benefits, and eligibility naturally into standard Tamil.";
    case "hi":
      return "Reply natively in Hindi (हिंदी) using the Devanagari script. Do not reply in English. Translate scheme details and eligibility naturally into clear Hindi.";
    case "hinglish":
      return "Reply in conversational Hinglish (Hindi written phonetically using the Latin/English alphabet).";
    case "en":
    default:
      return "Reply in clear and concise English.";
  }
}

export async function generateAnswer(options: {
  prompt: string;
  language: SupportedLanguage;
}): Promise<string> {
  const { prompt, language } = options;
  let lastError: unknown;
  const primaryModel = resolveGenerationModel(process.env.GEMINI_MODEL);
  const candidateModels = [
    primaryModel,
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-3.7-flash",
    "gemini-flash-latest",
  ];
  const uniqueModels = [...new Set(candidateModels.filter(Boolean))];
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || "15000", 10);

  for (const model of uniqueModels) {
    try {
      const client = getGeminiClient();
      const result = await withTimeout(
        client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: [
              "You are Yojana Connect, a concise and factual assistant for Indian government schemes.",
              "Use only the supplied scheme context, user profile, and previous conversation history.",
              "When the user asks follow-up questions (such as 'Am I eligible?', 'What documents?', 'How do I apply?'), use the previous conversation history to understand which scheme is being discussed and apply the user profile.",
              "Never invent benefits, eligibility, documents, or URLs.",
              "Be concise, clear, and direct. Avoid conversational filler.",
              "If context is insufficient, start your reply with exactly INSUFFICIENT_CONTEXT: and state so plainly.",
              "Do not state that a user is definitely eligible; final eligibility is determined by official authorities.",
              getLanguageInstruction(language),
            ].join(" "),
            temperature: 0.1,
            maxOutputTokens: 250,
          },
        }),
        timeoutMs,
        `Gemini response (${model})`
      );

      let answer: string | undefined;
      try {
        answer = result.text?.trim();
      } catch {
        // Fall back to candidate text extraction if getter throws
      }

      if (!answer && result.candidates?.[0]?.content?.parts) {
        answer = result.candidates[0].content.parts
          .map((part) => part.text || "")
          .join("")
          .trim();
      }

      if (answer) return answer;
      lastError = new Error(`Empty response from model ${model}`);
    } catch (error) {
      lastError = error;
      console.warn(
        `[Gemini API] generateContent model ${model} failed:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Gemini generateContent failed across candidate models: ${message}`);
}
