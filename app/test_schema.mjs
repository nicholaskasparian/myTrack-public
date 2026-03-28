import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: 'test',
      config: { 
        responseMimeType: 'application/json',
        responseJsonSchema: { type: 'object', properties: { test: { type: 'string'} } }
      }
    });
    console.log('Success');
  } catch (e) {
    console.log('Error:', e.message);
  }
}
run();