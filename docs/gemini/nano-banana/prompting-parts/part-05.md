# Source: https://ai.google.dev/gemini-api/docs/image-generation#prompting
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# prompting — Part 5

    "fmt"
    "log"
    "os"

    "google.golang.org/genai"
    pb "google.golang.org/genai/schema"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer client.Close()

    model := client.GenerativeModel("gemini-3.1-flash-image-preview")
    model.GenerationConfig = &pb.GenerationConfig{
        ResponseModalities: []pb.ResponseModality{genai.Image},
        ThinkingConfig: &pb.ThinkingConfig{
            ThinkingLevel:   "High",
            IncludeThoughts: true,
        },
    }

    prompt := "A futuristic city built inside a giant glass bottle floating in space"
    resp, err := model.GenerateContent(ctx, genai.Text(prompt))
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if part.Thought { // Skip outputting thoughts
            continue
        }
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("image.png", img.Data, 0644)
            if err != nil {
                log.Fatal(err)
            }
        }
    }
}
```

### REST

```
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "A futuristic city built inside a giant glass bottle floating in space"}]}],
    "generationConfig": {
      "responseModalities": ["IMAGE"],
      "thinkingConfig": {
        "thinkingLevel": "High",
        "includeThoughts": true
      }
    }
  }'
```

Note that thinking tokens are billed regardless of whether `includeThoughts` is
set to `true` or `false`, as the [thinking process](#thinking-process) always
happens by default whether you view the process or not.

#### Thought Signatures

Thought signatures are encrypted representations of the
model's internal thought process and are used to preserve reasoning context
across multi-turn interactions. All responses include a `thought_signature`
field. As a general rule, if you receive a thought signature in a model
response, you should pass it back exactly as received when sending the
conversation history in the next turn. Failure to circulate thought signatures
may cause the response to fail. Check the [thought signature](/gemini-api/docs/thought-signatures)
documentation for more explanations of signatures overall.

Here is how thought signatures work:

* All `inline_data` parts with image `mimetype` which are part of the response
  should have signature.
* If there are some text parts at the beginning (before any image) right after
  the thoughts, the first text part should also have a signature.
* If `inline_data` parts with image `mimetype` are part of thoughts, they won't
  have signatures.

The following code shows an example of where thought signatures are included:

```
[
  {
    "inline_data": {
      "data": "<base64_image_data_0>",
      "mime_type": "image/png"
    },
    "thought": true // Thoughts don't have signatures
  },
  {
    "inline_data": {
      "data": "<base64_image_data_1>",
      "mime_type": "image/png"
    },
    "thought": true // Thoughts don't have signatures
  },
  {
    "inline_data": {
      "data": "<base64_image_data_2>",
      "mime_type": "image/png"
    },
    "thought": true // Thoughts don't have signatures
  },
  {
    "text": "Here is a step-by-step guide to baking macarons, presented in three separate images.\n\n### Step 1: Piping the Batter\n\nThe first step after making your macaron batter is to pipe it onto a baking sheet. This requires a steady hand to create uniform circles.\n\n",
    "thought_signature": "<Signature_A>" // The first non-thought part always has a signature
  },
  {
    "inline_data": {
      "data": "<base64_image_data_3>",
      "mime_type": "image/png"
    },
    "thought_signature": "<Signature_B>" // All image parts have a signatures
  },
  {
    "text": "\n\n### Step 2: Baking and Developing Feet\n\nOnce piped, the macarons are baked in the oven. A key sign of a successful bake is the development of \"feet\"—the ruffled edge at the base of each macaron shell.\n\n"
    // Follow-up text parts don't have signatures
  },
  {
    "inline_data": {
      "data": "<base64_image_data_4>",
      "mime_type": "image/png"
    },
    "thought_signature": "<Signature_C>" // All image parts have a signatures
  },
  {
    "text": "\n\n### Step 3: Assembling the Macaron\n\nThe final step is to pair the cooled macaron shells by size and sandwich them together with your desired filling, creating the classic macaron dessert.\n\n"
  },
  {
    "inline_data": {
      "data": "<base64_image_data_5>",
      "mime_type": "image/png"
    },
    "thought_signature": "<Signature_D>" // All image parts have a signatures
  }
]
```

## Other image generation modes

Gemini supports other image interaction modes based on prompt structure and
context, including:

* **Text to image(s) and text (interleaved):** Outputs images with related text.
  + Example prompt: "Generate an illustrated recipe for a paella."
* **Image(s) and text to image(s) and text (interleaved)**: Uses input images and text to create new related images and text.
  + Example prompt: (With an image of a furnished room) "What other color sofas would work in my space? can you update the image?"

## Generate images in batch

If you need to generate a lot of images, you can use the
[Batch API](/gemini-api/docs/batch-api). You get higher
[rate limits](/gemini-api/docs/rate-limits) in exchange for a turnaround of up
to 24 hours.

Check the [Batch API image generation documentation](/gemini-api/docs/batch-api#image-generation) and the [cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb)
for Batch API image examples and code.

## Prompting guide and strategies

Mastering image generation starts with one fundamental principle:

> **Describe the scene, don't just list keywords.**
> The model's core strength is its deep language understanding. A narrative,
> descriptive paragraph will almost always produce a better, more coherent image
> than a list of disconnected words.

### Prompts for generating images

The following strategies will help you create effective prompts to
generate exactly the images you're looking for.

#### 1. Photorealistic scenes

For realistic images, use photography terms. Mention camera angles, lens types,
lighting, and fine details to guide the model toward a photorealistic result.

### Template

```
A photorealistic [shot type] of [subject], [action or expression], set in
[environment]. The scene is illuminated by [lighting description], creating
a [mood] atmosphere. Captured with a [camera/lens details], emphasizing
[key textures and details]. The image should be in a [aspect ratio] format.
```

### Prompt

```
A photorealistic close-up portrait of an elderly Japanese ceramicist with
deep, sun-etched wrinkles and a warm, knowing smile. He is carefully
inspecting a freshly glazed tea bowl. The setting is his rustic,
sun-drenched workshop. The scene is illuminated by soft, golden hour light
streaming through a window, highlighting the fine texture of the clay.
Captured with an 85mm portrait lens, resulting in a soft, blurred background
(bokeh). The overall mood is serene and masterful. Vertical portrait
orientation.
```

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful.",
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("photorealistic_example.png")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
    "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful.";

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("photorealistic_example.png", buffer);
      console.log("Image saved as photorealistic_example.png");
    }
  }
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
    "os"
    "google.golang.org/genai"
)

func main() {

    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-3.1-flash-image-preview",
        genai.Text("A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful."),
    )

    for _, part := range result.Candidates[0].Content.Parts {
        if part.Text != "" {
            fmt.Println(part.Text)
        } else if part.InlineData != nil {
            imageBytes := part.InlineData.Data
            outputFilename := "photorealistic_example.png"
            _ = os.WriteFile(outputFilename, imageBytes, 0644)
        }
    }
}
```

### Java

```
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class PhotorealisticScene {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          """
          A photorealistic close-up portrait of an elderly Japanese ceramicist
          with deep, sun-etched wrinkles and a warm, knowing smile. He is
          carefully inspecting a freshly glazed tea bowl. The setting is his
          rustic, sun-drenched workshop with pottery wheels and shelves of
          clay pots in the background. The scene is illuminated by soft,
          golden hour light streaming through a window, highlighting the
          fine texture of the clay and the fabric of his apron. Captured
          with an 85mm portrait lens, resulting in a soft, blurred
          background (bokeh). The overall mood is serene and masterful.
          """,
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("photorealistic_example.png"), blob.data().get());
          }
        }
      }
    }
  }
}
```

### REST

```
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop with pottery wheels and shelves of clay pots in the background. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay and the fabric of his apron. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful."}
      ]
    }]
  }'
```

![A photorealistic close-up portrait of an elderly Japanese ceramicist...](/static/gemini-api/docs/images/photorealistic_example.png)

A photorealistic close-up portrait of an elderly Japanese ceramicist...

#### 2. Stylized illustrations & stickers

To create stickers, icons, or assets, be explicit about the style and request a
transparent background.

### Template

```
A [style] sticker of a [subject], featuring [key characteristics] and a
[color palette]. The design should have [line style] and [shading style].
The background must be transparent.
```

### Prompt

```
A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's
munching on a green bamboo leaf. The design features bold, clean outlines,
simple cel-shading, and a vibrant color palette. The background must be white.
```

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.",
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("red_panda_sticker.png")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
    "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.";

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("red_panda_sticker.png", buffer);
      console.log("Image saved as red_panda_sticker.png");
    }
  }
}

main();
```

### Go

```
