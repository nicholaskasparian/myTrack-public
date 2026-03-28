import { GoogleGenAI } from '@google/genai';

// Export safety types for use in routes
export { HarmCategory, HarmBlockThreshold } from '@google/genai';

// ─── Gemini Client ─────────────────────────────────────────────────────
// Single client instance for all Gemini API calls
// Used server-side only in /api/generate/* routes
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default ai;

// ─── Model Constants (PRD §1) ──────────────────────────────────────────
export const MODELS = {
  /** Full-song music generation, 2m45s–3m, 48kHz stereo */
  LYRIA: 'lyria-3-pro-preview',
  /** Song concept generation, vibe descriptions (cheap, fast) */
  FLASH: 'gemini-3-flash-preview',
  /** Full Lyria prompt engineering from chosen concept */
  PRO: 'gemini-3.1-pro-preview',
  /** Cover art generation (accurate text + visual style) */
  NANO_BANANA: 'nano-banana-pro-preview',
  /** Semantic embedding for library search */
  EMBEDDING: 'gemini-embedding-2-preview',
} as const;
