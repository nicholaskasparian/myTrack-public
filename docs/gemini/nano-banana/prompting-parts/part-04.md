# Source: https://ai.google.dev/gemini-api/docs/image-generation#prompting
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# prompting — Part 4

      tools: [
        {
          googleSearch: {
            searchTypes: {
              webSearch: {},
              imageSearch: {}
            }
          }
        }
      ]
    }
  });

  // Display grounding sources if available
  if (response.candidates && response.candidates[0].groundingMetadata && response.candidates[0].groundingMetadata.searchEntryPoint) {
      console.log(response.candidates[0].groundingMetadata.searchEntryPoint.renderedContent);
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
  model.Tools = []*pb.Tool{
    {
      GoogleSearch: &pb.GoogleSearch{
        SearchTypes: &pb.SearchTypes{
          WebSearch:   &pb.WebSearch{},
          ImageSearch: &pb.ImageSearch{},
        },
      },
    },
  }
  model.GenerationConfig = &pb.GenerationConfig{
    ResponseModalities: []pb.ResponseModality{genai.Image},
  }

  prompt := "A detailed painting of a Timareta butterfly resting on a flower"
  resp, err := model.GenerateContent(ctx, genai.Text(prompt))
  if err != nil {
    log.Fatal(err)
  }

  if resp.Candidates[0].GroundingMetadata != nil && resp.Candidates[0].GroundingMetadata.SearchEntryPoint != nil {
    fmt.Println(resp.Candidates[0].GroundingMetadata.SearchEntryPoint.RenderedContent)
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
    "contents": [{"parts": [{"text": "A detailed painting of a Timareta butterfly resting on a flower"}]}],
    "tools": [{"google_search": {"searchTypes": {"webSearch": {}, "imageSearch": {}}}}],
    "generationConfig": {
      "responseModalities": ["IMAGE"]
    }
  }'
```

**Display requirements**

When you use Image Search within Grounding with Google Search, you must comply
with the following conditions:

* **Source attribution**: You must provide a link to the webpage containing
  the source image (the "containing page," not the image file itself) in a
  manner that the user will recognize as a link.
* **Direct navigation**: If you also choose to display the source images, you
  must provide a direct, single-click path from the source images to its
  containing source webpage. Any other implementation that delays or abstracts
  the end user's access to the source webpage, including but not limited to
  any multi-click path or the use of an intermediate image viewer, is not
  permitted.

**Response**

For grounded responses using image search, the API provides clear attribution
and metadata to link its output to verified sources. Key fields in the
`groundingMetadata` object include:

* **`imageSearchQueries`**: The specific queries used by the model for visual
  context (image search).
* **`groundingChunks`**: Contains source information for retrieved results.
  For image sources, these will be returned as redirect URLs using a new image
  chunk type. This chunk includes:

  + **`uri`**: The web page URL for attribution (the landing page).
  + **`image_uri`**: The direct image URL.
* **`groundingSupports`**: Provides specific mappings that link the generated
  content to its relevant citation source in the chunks.
* **`searchEntryPoint`**: Includes the "Google Search" chip containing
  compliant HTML and CSS to render Search Suggestions.

### Generate images up to 4K resolution

Gemini 3 image models generate 1K images by default but can also output 2K,
4K, and 512 (0.5K) (Gemini 3.1 Flash Image only) images. To generate higher
resolution assets, specify the `image_size` in the `generation_config`.

You must use an uppercase 'K' (e.g. 1K, 2K, 4K). The `512` value does not use a 'K' suffix. Lowercase
parameters (e.g., 1k) will be rejected.

### Python

```
from google import genai
from google.genai import types

prompt = "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."
aspect_ratio = "1:1" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
resolution = "1K" # "512", "1K", "2K", "4K"

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
            image_size=resolution
        ),
    )
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif image:= part.as_image():
        image.save("butterfly.png")
```

### Javascript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
      'Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.';
  const aspectRatio = '1:1';
  const resolution = '1K';

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution,
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("image.png", buffer);
      console.log("Image saved as image.png");
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
    defer client.Close()

    model := client.GenerativeModel("gemini-3.1-flash-image-preview")
    model.GenerationConfig = &pb.GenerationConfig{
        ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
        ImageConfig: &pb.ImageConfig{
            AspectRatio: "1:1",
            ImageSize:   "1K",
        },
    }

    prompt := "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."
    resp, err := model.GenerateContent(ctx, genai.Text(prompt))
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("butterfly.png", img.Data, 0644)
            if err != nil {
                log.Fatal(err)
            }
        }
    }
}
```

### Java

```
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.GoogleSearch;
import com.google.genai.types.ImageConfig;
import com.google.genai.types.Part;
import com.google.genai.types.Tool;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class HiRes {
    public static void main(String[] args) throws IOException {

      try (Client client = new Client()) {
        GenerateContentConfig config = GenerateContentConfig.builder()
            .responseModalities("TEXT", "IMAGE")
            .imageConfig(ImageConfig.builder()
                .aspectRatio("16:9")
                .imageSize("4K")
                .build())
            .build();

        GenerateContentResponse response = client.models.generateContent(
            "gemini-3.1-flash-image-preview", """
              Da Vinci style anatomical sketch of a dissected Monarch butterfly.
              Detailed drawings of the head, wings, and legs on textured
              parchment with notes in English.
              """,
            config);

        for (Part part : response.parts()) {
          if (part.text().isPresent()) {
            System.out.println(part.text().get());
          } else if (part.inlineData().isPresent()) {
            var blob = part.inlineData().get();
            if (blob.data().isPresent()) {
              Files.write(Paths.get("butterfly.png"), blob.data().get());
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
    "contents": [{"parts": [{"text": "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."}]}],
    "tools": [{"google_search": {}}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {"aspectRatio": "1:1", "imageSize": "1K"}
    }
  }'
```

The following is an example image generated from this prompt:

![AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.](/static/gemini-api/docs/images/gemini3-4k-image.png)

AI-generated Da Vinci style anatomical sketch of a dissected Monarch butterfly.

### Thinking Process

Gemini 3 image models are thinking models that use a reasoning
process ("Thinking") for complex prompts. This feature is enabled by default and
cannot be disabled in the API. To learn more about the thinking process, see
the [Gemini Thinking](/gemini-api/docs/thinking) guide.

The model generates up to two interim images to test composition and logic. The
last image within Thinking is also the final rendered image.

You can check the thoughts that lead to the final image being produced.

### Python

```
for part in response.parts:
    if part.thought:
        if part.text:
            print(part.text)
        elif image:= part.as_image():
            image.show()
```

### Javascript

```
for (const part of response.candidates[0].content.parts) {
  if (part.thought) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync('image.png', buffer);
      console.log('Image saved as image.png');
    }
  }
}
```

#### Controlling thinking levels

With Gemini 3.1 Flash Image, you can control the amount of thinking the model
uses to balance quality and latency. The default `thinkingLevel` is `minimal`,
and the supported levels are `minimal` and `high`. Setting the
`thinkingLevel` to `minimal` provides the lowest latency responses. Note that
minimal thinking does not mean the model uses no thinking at all.

You can add the `includeThoughts` boolean to determine whether the model's
generated thoughts are returned in the response, or remain hidden.

### Python

```
from google import genai

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A futuristic city built inside a giant glass bottle floating in space",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        thinking_config=types.ThinkingConfig(
            thinking_level="High",
            include_thoughts=True
        ),
    )
)

for part in response.parts:
    if part.thought: # Skip outputting thoughts
      continue
    if part.text:
      display(Markdown(part.text))
    elif image:= part.as_image():
      image.show()
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: "A futuristic city built inside a giant glass bottle floating in space",
    config: {
      responseModalities: ["IMAGE"],
      thinkingConfig: {
        thinkingLevel: "High",
        includeThoughts: true
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.thought) { // Skip outputting thoughts
      continue;
    }
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("image.png", buffer);
      console.log("Image saved as image.png");
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
