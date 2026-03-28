import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const res = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: 'Concept: {} Sound Profile: {}',
    config: { 
      responseMimeType: 'application/json',
      responseSchema: { type: 'object', properties: { lyrics: { type: 'string' }, lyria_prompt: { type: 'string' } }, required: ['lyrics', 'lyria_prompt'] },
      systemInstruction: "test" 
    }
  });
  console.log(res.text);
}
run();