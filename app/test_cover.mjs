import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'nano-banana-pro-preview',
      contents: 'Album cover art for "Test", a Pop track. Happy atmosphere. Minimal, editorial. Black and white with one accent color. No faces. No text. Square format. Style: abstract, modern, influenced by Pop aesthetics',
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();