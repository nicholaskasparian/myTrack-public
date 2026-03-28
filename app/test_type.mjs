import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const res = await ai.models.generateContent({
    model: 'nano-banana-pro-preview',
    contents: 'Album cover',
  });
  const part = res.candidates[0].content.parts[0];
  console.log("type:", typeof part.inlineData.data);
  console.log("isBuffer:", Buffer.isBuffer(part.inlineData.data));
  console.log("constructor:", part.inlineData.data.constructor.name);
}
run();