import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const musicResponse = await ai.models.generateContent({
    model: 'lyria-3-pro-preview',
    contents: 'Create a short pop song',
    config: {
      responseModalities: ['AUDIO', 'TEXT'],
    },
  });
  console.log(JSON.stringify(musicResponse, null, 2));
}
run();