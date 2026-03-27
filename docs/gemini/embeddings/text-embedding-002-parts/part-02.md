# Source: https://ai.google.dev/gemini-api/docs/embeddings#text-embedding-002
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# text-embedding-002 — Part 2

    config=types.EmbedContentConfig(output_dimensionality=768)
)

[embedding_obj] = result.embeddings
embedding_length = len(embedding_obj.values)

print(f"Length of embedding: {embedding_length}")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {
    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: 'What is the meaning of life?',
        config: { outputDimensionality: 768 },
    });

    const embeddingLength = response.embeddings[0].values.length;
    console.log(`Length of embedding: ${embeddingLength}`);
}

main();
```

### Go

```
package main

import (
    "context"
    "fmt"
    "log"

    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    // The client uses Application Default Credentials.
    // Authenticate with 'gcloud auth application-default login'.
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer client.Close()

    contents := []*genai.Content{
        genai.NewContentFromText("What is the meaning of life?", genai.RoleUser),
    }

    result, err := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        &genai.EmbedContentRequest{OutputDimensionality: 768},
    )
    if err != nil {
        log.Fatal(err)
    }

    embedding := result.Embeddings[0]
    embeddingLength := len(embedding.Values)
    fmt.Printf("Length of embedding: %d\n", embeddingLength)
}
```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
    -H 'Content-Type: application/json' \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
        "content": {"parts":[{ "text": "What is the meaning of life?"}]},
        "output_dimensionality": 768
    }'
```

Example output from the code snippet:

```
Length of embedding: 768
```

## Ensuring quality for smaller dimensions

The 3072 dimension embedding is normalized. Normalized embeddings produce more
accurate semantic similarity by comparing vector direction, not magnitude. For
other dimensions, including 768 and 1536, you need to normalize the embeddings
as follows:

### Python

```
import numpy as np
from numpy.linalg import norm

embedding_values_np = np.array(embedding_obj.values)
normed_embedding = embedding_values_np / np.linalg.norm(embedding_values_np)

print(f"Normed embedding length: {len(normed_embedding)}")
print(f"Norm of normed embedding: {np.linalg.norm(normed_embedding):.6f}") # Should be very close to 1
```

Example output from this code snippet:

```
Normed embedding length: 768
Norm of normed embedding: 1.000000
```

The following table shows the MTEB scores, a commonly used benchmark for
embeddings, for different dimensions. Notably, the result shows that performance
is not strictly tied to the size of the embedding dimension, with lower
dimensions achieving scores comparable to their higher dimension counterparts.

MRL Dimension | MTEB Score (Gemini Embedding 001) || 2048 | 68.16 |
| 1536 | 68.17 |
| 768 | 67.99 |
| 512 | 67.55 |
| 256 | 66.19 |
| 128 | 63.31 |

## Multimodal embeddings

The `gemini-embedding-2-preview` model supports multimodal input, allowing you
to embed images, video, audio, and documents content alongside text. All modalities
are mapped into the same embedding space, enabling cross-modal search and
comparison.

### Supported modalities and limits

The overall maximum input tokens limit is 8192 tokens.

Modality | Specifications and limits || **Text** | Supports up to 8,192 tokens. |
| **Image** | Maximum of 6 images per request. Supported formats: PNG, JPEG. |
| **Audio** | Maximum duration of 80 seconds. Supported formats: MP3, WAV. |
| **Video** | Maximum duration of 120 seconds. Supported formats: MP4, MOV. Supported codecs: H264, H265, AV1, VP9.  The system processes a maximum of 32 frames per video: short videos (≤32s) are sampled at 1 fps, while longer videos are uniformly sampled to 32 frames. Audio tracks are not processed in video files. |
| **Documents (PDF)** | Maximum of 6 pages. |

### Embedding images

The following example shows how to embed an image using
`gemini-embedding-2-preview`.

Images can be provided as inline data or as uploaded files
through the [Files API](/gemini-api/docs/files).

### Python

```
from google import genai
from google.genai import types

with open('example.png', 'rb') as f:
    image_bytes = f.read()

client = genai.Client()

result = client.models.embed_content(
    model='gemini-embedding-2-preview',
    contents=[
        types.Part.from_bytes(
            data=image_bytes,
            mime_type='image/png',
        ),
    ]
)

print(result.embeddings)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
    const ai = new GoogleGenAI({});

    const imgBase64 = fs.readFileSync("example.png", { encoding: "base64" });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [{
            inlineData: {
                mimeType: 'image/png',
                data: imgBase64,
            },
        }],
    });

    console.log(response.embeddings);
}

main();
```

### REST

```
IMG_PATH="/path/to/your/image.png"
IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "content": {
            "parts": [{
                "inline_data": {
                    "mime_type": "image/png",
                    "data": "'"${IMG_BASE64}"'"
                }
            }]
        }
    }'
```

### Embedding aggregation

When working with multimodal content, how you structure your input affects the
embedding output:

* **Single content entry:** Submitting multiple parts (for example, text and an
  image) within a single content entry produces one aggregated embedding for
  all modalities within that entry.
* **Multiple entries:** Sending multiple entries in the `contents` array
  returns separate embeddings for each entry.
* **Post-level representation:** For complex objects like social media posts
  with multiple media items, we recommend aggregating separate embeddings
  (for example, by averaging) to create a coherent post-level representation.

The following example shows how to create one aggregated embedding for text and image input.
Use the `parts` field to combine multiple inputs:

### Python

```
from google import genai
from google.genai import types

with open('dog.png', 'rb') as f:
    image_bytes = f.read()

result = client.models.embed_content(
    model='gemini-embedding-2-preview',
    contents=[
        types.Content(
            parts=[
                types.Part(text="An image of a dog"),
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/png',
                )
            ]
        )
    ]
)

# This produces one embedding
for embedding in result.embeddings:
    print(embedding.values)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
    const ai = new GoogleGenAI({});

    const imgBase64 = fs.readFileSync("dog.png", { encoding: "base64" });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: {
            parts: [
                { text: 'An image of a dog' },
                { inlineData: { mimeType: 'image/png', data: imgBase64 } },
            ],
        },
    });

    console.log(response.embeddings);
}

main();
```

### REST

```
IMG_PATH="/path/to/your/dog.png"
IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "content": {
            "parts": [
                {"text": "An image of a dog"},
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": "'"${IMG_BASE64}"'"
                    }
                }
            ]
        }
    }'
```

On the other hand, this example creates multiple embeddings in one embedding call:

### Python

```
from google import genai
from google.genai import types

with open('dog.png', 'rb') as f:
    image_bytes = f.read()

result = client.models.embed_content(
    model='gemini-embedding-2-preview',
    contents=[
        "The dog is cute",
        types.Part.from_bytes(
            data=image_bytes,
            mime_type='image/png',
        ),
    ]
)

# This produces two embeddings
for embedding in result.embeddings:
    print(embedding.values)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
    const ai = new GoogleGenAI({});

    const imgBase64 = fs.readFileSync("dog.png", { encoding: "base64" });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [
            'The dog is cute',
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: imgBase64,
                },
            },
        ],
    });

    console.log(response.embeddings);
}

main();
```

### REST

```
IMG_PATH="/path/to/your/dog.png"
IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:batchEmbedContents" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "requests": [
            {
                "model": "models/gemini-embedding-2-preview",
                "content": {"parts": [{"text": "The dog is cute"}]}
            },
            {
                "model": "models/gemini-embedding-2-preview",
                "content": {"parts": [{"inline_data": {"mime_type": "image/png", "data": "'"${IMG_BASE64}"'"}}]}
            }
        ]
    }'
```

### Embedding audio

The following example shows how to embed an audio file using
`gemini-embedding-2-preview`.

Audio files can be provided as inline data or as uploaded files
through the [Files API](/gemini-api/docs/files).

### Python

```
from google import genai
from google.genai import types

with open('example.mp3', 'rb') as f:
    audio_bytes = f.read()

client = genai.Client()

result = client.models.embed_content(
    model='gemini-embedding-2-preview',
    contents=[
        types.Part.from_bytes(
            data=audio_bytes,
            mime_type='audio/mpeg',
        ),
    ]
)

print(result.embeddings)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
    const ai = new GoogleGenAI({});

    const audioBase64 = fs.readFileSync("example.mp3", { encoding: "base64" });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [{
            inlineData: {
