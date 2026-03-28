import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ai, { MODELS } from '@/lib/gemini';
import { SoundProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sound_profile, mood_hint } = body as { sound_profile: SoundProfile; mood_hint: string | null };

    if (!sound_profile) {
      return NextResponse.json({ error: 'Sound profile is required' }, { status: 400 });
    }

    const systemInstruction = `You are a music director for a personalized AI music platform. Given a user's Sound Profile and optional mood hint, generate exactly 3 distinct song concepts. Each concept must feel genuinely tailored to the user's taste — not generic.

Respond ONLY with valid JSON — no markdown, no preamble.

Return:
[
  {
    "title": "Short evocative song title (2-4 words)",
    "genre": "Primary genre",
    "secondary_genre": "Secondary genre or null",
    "mood": "One or two adjectives",
    "bpm": 88,
    "key_instruments": ["..."],
    "structure_hint": "Short description of sonic arc",
    "why": "One sentence explaining why this fits this user's Sound Profile"
  }
]`;

    const userPrompt = `Sound Profile: ${JSON.stringify(sound_profile)}
${mood_hint ? `Mood Hint: ${mood_hint}` : 'Mood Hint: None'}`;

    const generatePromise = ai.models.generateContent({
      model: MODELS.FLASH,
      contents: userPrompt,
      config: { 
        responseMimeType: 'application/json',
        systemInstruction: systemInstruction
      }
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('TIMEOUT'));
      }, 15000); // 15 seconds
    });

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]) as Awaited<ReturnType<typeof ai.models.generateContent>>;
      
      const text = response.text || "";
      const concepts = JSON.parse(text);

      return NextResponse.json({ concepts });
    } catch (apiError: any) {
      if (apiError.message === 'TIMEOUT') {
        return NextResponse.json({ error: 'Generation timed out. Please try again.' }, { status: 504 });
      }
      throw apiError;
    }

  } catch (error) {
    console.error('Error generating concepts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
