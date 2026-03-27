# Source: https://ai.google.dev/gemini-api/docs/music-generation#lyria-3-pro
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# lyria3-pro — Part 3

        {"text": "[0:00 - 0:10] Intro: ..."}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["AUDIO", "TEXT"]
    }
  }'
```

## Generate instrumental tracks

For background music, game soundtracks, or any use case where vocals are not
required, you can prompt the model to produce instrumental-only tracks:

### Python

```
response = client.models.generate_content(
    model="lyria-3-clip-preview",
    contents="A bright chiptune melody in C Major, retro 8-bit "
             "video game style. Instrumental only, no vocals.",
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO", "TEXT"],
    ),
)
```

### JavaScript

```
const response = await ai.models.generateContent({
  model: "lyria-3-clip-preview",
  contents: "A bright chiptune melody in C Major, retro 8-bit " +
            "video game style. Instrumental only, no vocals.",
  config: {
    responseModalities: ["AUDIO", "TEXT"],
  },
});
```

### Go

```
result, err := client.Models.GenerateContent(
    ctx,
    "lyria-3-clip-preview",
    genai.Text("A bright chiptune melody in C Major, retro 8-bit " +
               "video game style. Instrumental only, no vocals."),
    config,
)
```

### Java

```
GenerateContentResponse response = client.models.generateContent(
    "lyria-3-clip-preview",
    "A bright chiptune melody in C Major, retro 8-bit "
        + "video game style. Instrumental only, no vocals.",
    config);
```

### C#

```
var response = await client.Models.GenerateContentAsync(
  model: "lyria-3-clip-preview",
  contents: "A bright chiptune melody in C Major, retro 8-bit " +
            "video game style. Instrumental only, no vocals.",
  config: config
);
```

### REST

```
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/lyria-3-clip-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "A bright chiptune melody in C Major, retro 8-bit video game style. Instrumental only, no vocals."}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["AUDIO", "TEXT"]
    }
  }'
```

## Generate music in different languages

Lyria 3 generates lyrics in the language of your prompt. To generate a song
with French lyrics, write your prompt in French. The model adapts its vocal
style and pronunciation to match the language.

### Python

```
response = client.models.generate_content(
    model="lyria-3-pro-preview",
    contents="Crée une chanson pop romantique en français sur un "
             "coucher de soleil à Paris. Utilise du piano et de "
             "la guitare acoustique.",
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO", "TEXT"],
    ),
)
```

### JavaScript

```
const response = await ai.models.generateContent({
  model: "lyria-3-pro-preview",
  contents: "Crée une chanson pop romantique en français sur un " +
            "coucher de soleil à Paris. Utilise du piano et de " +
            "la guitare acoustique.",
  config: {
    responseModalities: ["AUDIO", "TEXT"],
  },
});
```

### Go

```
result, err := client.Models.GenerateContent(
    ctx,
    "lyria-3-pro-preview",
    genai.Text("Crée une chanson pop romantique en français sur un " +
               "coucher de soleil à Paris. Utilise du piano et de " +
               "la guitare acoustique."),
    config,
)
```

### Java

```
GenerateContentResponse response = client.models.generateContent(
    "lyria-3-pro-preview",
    "Crée une chanson pop romantique en français sur un "
        + "coucher de soleil à Paris. Utilise du piano et de "
        + "la guitare acoustique.",
    config);
```

### C#

```
var response = await client.Models.GenerateContentAsync(
  model: "lyria-3-pro-preview",
  contents: "Crée une chanson pop romantique en français sur un " +
            "coucher de soleil à Paris. Utilise du piano et de " +
            "la guitare acoustique.",
  config: config
);
```

### REST

```
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/lyria-3-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Crée une chanson pop romantique en français sur un coucher de soleil à Paris. Utilise du piano et de la guitare acoustique."}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["AUDIO", "TEXT"]
    }
  }'
```

## Model intelligence

Lyria 3 analyzes your prompt process where the
model reasons through musical structure (intro, verse, chorus, bridge, etc.)
based on your prompt.
This happens before the audio is generated and ensures structural coherence and
musicality.

## Interactions API

You can use Lyria 3 models with the [Interactions API](/gemini-api/docs/interactions);
a unified interface for interacting with Gemini models and agents. It simplifies
state management and long-running tasks for complex multimodal use cases.

### Python

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="lyria-3-pro-preview",
    input="An epic cinematic orchestral piece about a journey home. " +
          "Starts with a solo piano intro, builds through sweeping " +
          "strings, and climaxes with a massive wall of sound.",
    response_modalities=["AUDIO", "TEXT"]
)

for output in interaction.outputs:
    if output.text:
        print(output.text)
    elif output.inline_data:
         with open("interaction_output.mp3", "wb") as f:
            f.write(output.inline_data.data)
         print("Audio saved to interaction_output.mp3")
```

### JavaScript

```
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({});

const interaction = await client.interactions.create({
  model: 'lyria-3-pro-preview',
  input: 'An epic cinematic orchestral piece about a journey home. ' +
         'Starts with a solo piano intro, builds through sweeping ' +
         'strings, and climaxes with a massive wall of sound.',
  responseModalities: ['AUDIO', 'TEXT'],
});

for (const output of interaction.outputs) {
  if (output.text) {
    console.log(output.text);
  } else if (output.inlineData) {
    const buffer = Buffer.from(output.inlineData.data, 'base64');
    fs.writeFileSync('interaction_output.mp3', buffer);
    console.log('Audio saved to interaction_output.mp3');
  }
}
```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
-H "Content-Type: application/json" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-d '{
    "model": "lyria-3-pro-preview",
    "input": "An epic cinematic orchestral piece about a journey home. Starts with a solo piano intro, builds through sweeping strings, and climaxes with a massive wall of sound.",
    "responseModalities": ["AUDIO", "TEXT"]
}'
```

## Prompting guide

The more specific your prompt, the better the results. Here's what you can
include to guide the generation:

* **Genre**: Specify a genre or blend of genres (e.g., "lo-fi hip hop",
  "jazz fusion", "cinematic orchestral").
* **Instruments**: Name specific instruments (e.g., "Fender Rhodes piano",
  "slide guitar", "TR-808 drum machine").
* **BPM**: Set the tempo (e.g., "120 BPM", "slow tempo around 70 BPM").
* **Key/Scale**: Specify a musical key (e.g., "in G major", "D minor").
* **Mood and atmosphere**: Use descriptive adjectives (e.g., "nostalgic",
  "aggressive", "ethereal", "dreamy").
* **Structure**: Use tags like `[Verse]`, `[Chorus]`, `[Bridge]`, `[Intro]`,
  `[Outro]` or timestamps to control the song's progression.
* **Duration**: The Clip model always produces 30-second clips. For the Pro
  model, specify the desired length in your prompt (e.g., "create a 2-minute
  song") or use timestamps to control duration.

### Example prompts

Here are some examples of effective prompts:

* `"A 30-second lofi hip hop beat with dusty vinyl crackle, mellow Rhodes
  piano chords, a slow boom-bap drum pattern at 85 BPM, and a jazzy upright
  bass line. Instrumental only."`
* `"An upbeat, feel-good pop song in G major at 120 BPM with bright acoustic
  guitar strumming, claps, and warm vocal harmonies about a summer road trip."`
* `"A dark, atmospheric trap beat at 140 BPM with heavy 808 bass, eerie synth
  pads, sharp hi-hats, and a haunting vocal sample. In D minor."`

## Best practices

* **Iterate with Clip first.** Use the faster `lyria-3-clip-preview` model to
  experiment with prompts before committing to a full-length generation with
  `lyria-3-pro-preview`.
* **Be specific.** Vague prompts produce generic results. Mention instruments,
  BPM, key, mood, and structure for the best output.
* **Match your language.** Prompt in the language you want the lyrics in.
* **Use section tags.** `[Verse]`, `[Chorus]`, `[Bridge]` tags give the model
  clear structure to follow.
* **Separate lyrics from instructions.** When providing custom lyrics, clearly
  separate them from your musical direction instructions.

## Limitations

* **Safety**: All prompts are checked by safety filters. Prompts that trigger
  the filters will be blocked. This includes prompts that request specific
  artist voices or the generation of copyrighted lyrics.
* **Watermarking**: All generated audio includes a
  [SynthID audio watermark](/responsible/docs/safeguards/synthid) for
  identification. This watermark is imperceptible to the human ear and
  does not affect the listening experience.
* **Multi-turn editing**: Music generation is a single-turn process.
  Iterative editing or refining a generated clip through multiple prompts is
  not supported in the current version of Lyria 3.
* **Length**: The Clip model always generates 30-second clips. The Pro model
  generates songs that last a couple of minutes; exact duration can be
  influenced through your prompt.
* **Determinism**: Results may vary between calls, even with the same prompt.

## What's next

* Check [pricing](https://ai.google.dev/gemini-api/docs/pricing) for Lyria 3 models,
* Try [real-time, streaming music generation](https://ai.google.dev/gemini-api/docs/realtime-music-generation) with
  Lyria RealTime,
* Generate multi-speaker conversations with the
  [TTS models](https://ai.google.dev/gemini-api/docs/audio-generation),
* Discover how to generate [images](https://ai.google.dev/gemini-api/docs/image-generation) or [videos](https://ai.google.dev/gemini-api/docs/video),
* Find out how Gemini can [understand audio files](https://ai.google.dev/gemini-api/docs/audio),
* Have a real-time conversation with Gemini using the
  [Live API](https://ai.google.dev/gemini-api/docs/live).

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-03-25 UTC.

Need to tell us more?

[[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-03-25 UTC."],[],[]]
