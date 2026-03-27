# Source: https://ai.google.dev/gemini-api/docs/gemini-3
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# gemini3 — Part 1


Try the new [Gemini 3.1 Flash Live](/gemini-api/docs/live-api) audio-to-audio model in [AI Studio](https://aistudio.google.com/live?model=gemini-3.1-flash-live-preview).

* [Home](https://ai.google.dev/)
* [Gemini API](https://ai.google.dev/gemini-api)
* [Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Gemini 3 Developer Guide

Gemini 3 is our most intelligent model family to date, built on a foundation of
state-of-the-art reasoning. It is designed to bring any idea to life by
mastering agentic workflows, autonomous coding, and complex multimodal tasks.
This guide covers key features of the Gemini 3 model family and how to get the
most out of it.

[Try Gemini 3.1 Pro Preview](https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-pro-preview)
[Try Gemini 3 Flash](https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview)
[Try Nano Banana 2](https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-flash-image-preview)

Explore our [collection of Gemini 3 apps](https://aistudio.google.com/app/apps?source=showcase&showcaseTag=gemini-3) to
see how the model handles advanced reasoning, autonomous coding, and complex
multimodal tasks.

Get started with a few lines of code:

### Python

```
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents="Find the race condition in this multi-threaded C++ snippet: [code here]",
)

print(response.text)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: "Find the race condition in this multi-threaded C++ snippet: [code here]",
  });

  console.log(response.text);
}

run();
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts": [{"text": "Find the race condition in this multi-threaded C++ snippet: [code here]"}]
    }]
  }'
```

## Meet the Gemini 3 series

Gemini 3.1 Pro is best for complex tasks that
require broad world knowledge and advanced reasoning across modalities.

Gemini 3 Flash is our latest 3-series model, with Pro-level intelligence at the
speed and pricing of Flash.

Nano Banana Pro (also known as Gemini 3 Pro Image) is our highest quality image
generation model, and Nano Banana 2 (also known as Gemini 3.1 Flash Image) is
the high-volume, high-efficiency, lower price-point equivalent.

Gemini 3.1 Flash-Lite is our workhorse model built for cost-efficiency model and
high-volume tasks.

All Gemini 3 models are currently in preview.

| Model ID | Context Window (In / Out) | Knowledge Cutoff | Pricing (Input / Output)\* |
| --- | --- | --- | --- |
| **gemini-3.1-flash-lite-preview** | 1M / 64k | Jan 2025 | $0.25 (text, image, video), $0.50 (audio) / $1.50 |
| **gemini-3.1-flash-image-preview** | 128k / 32k | Jan 2025 | $0.25 (Text Input) / $0.067 (Image Output)\*\* |
| **gemini-3.1-pro-preview** | 1M / 64k | Jan 2025 | $2 / $12 (<200k tokens)   $4 / $18 (>200k tokens) |
| **gemini-3-flash-preview** | 1M / 64k | Jan 2025 | $0.50 / $3 |
| **gemini-3-pro-image-preview** | 65k / 32k | Jan 2025 | $2 (Text Input) / $0.134 (Image Output)\*\* |

*\* Pricing is per 1 million tokens unless otherwise noted.*
*\*\* Image pricing varies by resolution. See the [pricing page](/gemini-api/docs/pricing) for details.*

For detailed limits, pricing, and additional information, see the
[models page](/gemini-api/docs/models/gemini).

## New API features in Gemini 3

Gemini 3 introduces new parameters designed to give developers more control over
latency, cost, and multimodal fidelity.

### Thinking level

Gemini 3 series models use dynamic thinking by default to reason through
prompts. You can use the `thinking_level` parameter, which controls the
**maximum** depth of the model's internal reasoning process before it produces a
response. Gemini 3 treats these levels as relative allowances for thinking
rather than strict token guarantees.

If `thinking_level` is not specified, Gemini 3 will default to `high`. For
faster, lower-latency responses when complex reasoning isn't required, you can
constrain the model's thinking level to `low`.

| Thinking Level | Gemini 3.1 Pro | Gemini 3.1 Flash-Lite | Gemini 3 Flash | Description |
| --- | --- | --- | --- | --- |
| **`minimal`** | Not supported | Supported (Default) | Supported | Matches the "no thinking" setting for most queries. The model may think very minimally for complex coding tasks. Minimizes latency for chat or high throughput applications. Note, `minimal` does not guarantee that thinking is off. |
| **`low`** | Supported | Supported | Supported | Minimizes latency and cost. Best for simple instruction following, chat, or high-throughput applications. |
| **`medium`** | Supported | Supported | Supported | Balanced thinking for most tasks. |
| **`high`** | Supported (Default, Dynamic) | Supported (Dynamic) | Supported (Default, Dynamic) | Maximizes reasoning depth. The model may take significantly longer to reach a first (non thinking) output token, but the output will be more carefully reasoned. |

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents="How does AI work?",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="low")
    ),
)

print(response.text)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: "How does AI work?",
    config: {
      thinkingConfig: {
        thinkingLevel: "low",
      }
    },
  });

console.log(response.text);
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts": [{"text": "How does AI work?"}]
    }],
    "generationConfig": {
      "thinkingConfig": {
        "thinkingLevel": "low"
      }
    }
  }'
```

### Media resolution

Gemini 3 introduces granular control over multimodal vision processing via the
`media_resolution` parameter. Higher resolutions improve the model's ability to
read fine text or identify small details, but increase token usage and latency.
The `media_resolution` parameter determines the **maximum number of tokens
allocated per input image or video frame.**

You can now set the resolution to `media_resolution_low`,
`media_resolution_medium`, `media_resolution_high`, or
`media_resolution_ultra_high` per individual media part or globally (via
`generation_config`, global not available for ultra high). If unspecified, the
model uses optimal defaults based on the media type.

**Recommended settings**

| Media Type | Recommended Setting | Max Tokens | Usage Guidance |
| --- | --- | --- | --- |
| **Images** | `media_resolution_high` | 1120 | Recommended for most image analysis tasks to ensure maximum quality. |
| **PDFs** | `media_resolution_medium` | 560 | Optimal for document understanding; quality typically saturates at `medium`. Increasing to `high` rarely improves OCR results for standard documents. |
| **Video** (General) | `media_resolution_low` (or `media_resolution_medium`) | 70 (per frame) | **Note:** For video, `low` and `medium` settings are treated identically (70 tokens) to optimize context usage. This is sufficient for most action recognition and description tasks. |
| **Video** (Text-heavy) | `media_resolution_high` | 280 (per frame) | Required only when the use case involves reading dense text (OCR) or small details within video frames. |

### Python

```
from google import genai
from google.genai import types
import base64

# The media_resolution parameter is currently only available in the v1alpha API version.
client = genai.Client(http_options={'api_version': 'v1alpha'})

response = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents=[
        types.Content(
            parts=[
                types.Part(text="What is in this image?"),
                types.Part(
                    inline_data=types.Blob(
                        mime_type="image/jpeg",
                        data=base64.b64decode("..."),
                    ),
                    media_resolution={"level": "media_resolution_high"}
                )
            ]
        )
    ]
)

print(response.text)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

// The media_resolution parameter is currently only available in the v1alpha API version.
const ai = new GoogleGenAI({ apiVersion: "v1alpha" });

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          { text: "What is in this image?" },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: "...",
            },
            mediaResolution: {
              level: "media_resolution_high"
            }
          }
        ]
      }
    ]
  });

  console.log(response.text);
}

run();
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1alpha/models/gemini-3.1-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts": [
        { "text": "What is in this image?" },
        {
          "inlineData": {
            "mimeType": "image/jpeg",
            "data": "..."
          },
          "mediaResolution": {
            "level": "media_resolution_high"
          }
        }
      ]
    }]
  }'
```

### Temperature

For all Gemini 3 models, we strongly recommend keeping the temperature parameter
at its default value of `1.0`.

While previous models often benefited from tuning temperature to control
creativity versus determinism, Gemini 3's reasoning capabilities are optimized
for the default setting. Changing the temperature (setting it below 1.0) may
lead to unexpected behavior, such as looping or degraded performance,
particularly in complex mathematical or reasoning tasks.

### Thought signatures

Gemini 3 uses [Thought signatures](/gemini-api/docs/thought-signatures) to
maintain reasoning context across API calls. These signatures are encrypted
representations of the model's internal thought process. To ensure the model
maintains its reasoning capabilities you must return these signatures back to
the model in your request exactly as they were received:

* **Function Calling (Strict):** The API enforces strict validation on the
  "Current Turn". Missing signatures will result in a 400 error.
* **Text/Chat:** Validation is not strictly enforced, but omitting signatures will degrade the model's reasoning and answer quality.
* **Image generation/editing (Strict)**: The API enforces strict validation on all Model parts including a `thoughtSignature`. Missing signatures will result in a 400 error.

#### Function calling (strict validation)

When Gemini generates a `functionCall`, it relies on the `thoughtSignature` to
process the tool's output correctly in the next turn. The "Current Turn"
includes all Model (`functionCall`) and User (`functionResponse`) steps that
occurred since the last standard **User** `text` message.

* **Single Function Call:** The `functionCall` part contains a signature. You must return it.
* **Parallel Function Calls:** Only the first `functionCall` part in the list will contain the signature. You must return the parts in the exact order received.
* **Multi-Step (Sequential):** If the model calls a tool, receives a result,
  and calls *another* tool (within the same turn), **both** function calls have
  signatures. You must return **all** accumulated signatures in the history.

#### Text and streaming

For standard chat or text generation, the presence of a signature is not
guaranteed.

* **Non-Streaming**: The final content part of the response may contain a
  `thoughtSignature`, though it is not always present. If one is returned, you
  should send it back to maintain best performance.
* **Streaming**: If a signature is generated, it may arrive in a final chunk
  that contains an empty text part. Ensure your stream parser checks for
  signatures even if the text field is empty.

#### Image generation and editing

For `gemini-3-pro-image-preview` and `gemini-3.1-flash-image-preview`, thought
signatures are critical for
conversational editing. When you ask the model to modify an image it relies on
the `thoughtSignature` from the previous turn to understand the composition and
logic of the original image.

* **Editing:** Signatures are guaranteed on the first part after the thoughts
  of the response (`text` or `inlineData`) and on every subsequent `inlineData`
  part. You must return all of these signatures to avoid errors.

#### Code examples

#### Multi-step Function Calling (Sequential)

The user asks a question requiring two separate steps (Check Flight -> Book Taxi) in one turn.

**Step 1: Model calls Flight Tool.**
The model returns a signature `<Sig_A>`

```
// Model Response (Turn 1, Step 1)
  {
    "role": "model",
    "parts": [
      {
        "functionCall": { "name": "check_flight", "args": {...} },
        "thoughtSignature": "<Sig_A>" // SAVE THIS
      }
    ]
  }
```

**Step 2: User sends Flight Result**
We must send back `<Sig_A>` to keep the model's train of thought.

```
// User Request (Turn 1, Step 2)
[
  { "role": "user", "parts": [{ "text": "Check flight AA100..." }] },
  {
    "role": "model",
    "parts": [
      {
        "functionCall": { "name": "check_flight", "args": {...} },
        "thoughtSignature": "<Sig_A>" // REQUIRED
      }
    ]
  },
  { "role": "user", "parts": [{ "functionResponse": { "name": "check_flight", "response": {...} } }] }
]
```

**Step 3: Model calls Taxi Tool**
The model remembers the flight delay via `<Sig_A>` and now decides to book a taxi. It generates a *new* signature `<Sig_B>`.

```
// Model Response (Turn 1, Step 3)
{
  "role": "model",
  "parts": [
    {
      "functionCall": { "name": "book_taxi", "args": {...} },
      "thoughtSignature": "<Sig_B>" // SAVE THIS
    }
  ]
}
```

**Step 4: User sends Taxi Result**
To complete the turn, you must send back the entire chain: `<Sig_A>` AND `<Sig_B>`.

```
// User Request (Turn 1, Step 4)
[
  // ... previous history ...
  {
    "role": "model",
    "parts": [
       { "functionCall": { "name": "check_flight", ... }, "thoughtSignature": "<Sig_A>" }
    ]
  },
  { "role": "user", "parts": [{ "functionResponse": {...} }] },
  {
    "role": "model",
    "parts": [
       { "functionCall": { "name": "book_taxi", ... }, "thoughtSignature": "<Sig_B>" }
    ]
  },
  { "role": "user", "parts": [{ "functionResponse": {...} }] }
]
```

#### Parallel Function Calling

The user asks: "Check the weather in Paris and London." The model returns two function calls in one response.

```
