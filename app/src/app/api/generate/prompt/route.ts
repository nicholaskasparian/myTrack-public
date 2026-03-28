import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ai, { MODELS } from '../../../../lib/gemini';
import { Concept, SoundProfile } from '../../../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { concept, sound_profile } = body as { concept: Concept; sound_profile: SoundProfile };

    if (!concept || !sound_profile) {
      return NextResponse.json({ error: 'Concept and Sound Profile are required' }, { status: 400 });
    }

    const systemInstruction = `You are an expert prompt engineer for Lyria, Google DeepMind's music generation model. Given a song concept and a user's Sound Profile, write a single Lyria generation prompt that will produce a high-quality, personalized music track.

Lyria prompts should:
- Start with the primary genre and tempo
- Describe instrumentation concretely (e.g. "acoustic guitar, soft synth pad, finger-snapped percussion")
- Specify mood and energy arc
- Include production style cues (e.g. "lo-fi vinyl warmth", "wide stereo field", "intimate close-mic vocals")
- Be 80-150 words. No preamble. No markdown. Output the prompt text only.`;

    const userPrompt = `Concept: ${JSON.stringify(concept)}
Sound Profile: ${JSON.stringify(sound_profile)}`;

    const generatePromise = ai.models.generateContent({
      model: MODELS.PRO,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction
      }
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('TIMEOUT'));
      }, 30000); // 30 seconds
    });

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]) as Awaited<ReturnType<typeof ai.models.generateContent>>;
      
      const promptText = response.text?.trim() || "";

      return NextResponse.json({ prompt: promptText });
    } catch (apiError: any) {
      if (apiError.message === 'TIMEOUT') {
        return NextResponse.json({ error: 'Prompt generation timed out. Please try again.' }, { status: 504 });
      }
      throw apiError;
    }

  } catch (error) {
    console.error('Error generating Lyria prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
