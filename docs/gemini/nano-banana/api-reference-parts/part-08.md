# Source: https://ai.google.dev/gemini-api/docs/image-generation
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# api-reference — Part 8

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=['Text', 'Image'],
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
        ),
        tools=[{"google_search": {}}]
    )
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif image:= part.as_image():
        image.save("football-score.jpg")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt = "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League";

  const aspectRatio = '16:9';
  const resolution = '2K';

const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution,
      },
      tools: [{"google_search": {}}],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("football-score.jpg", buffer);
      console.log("Image saved as football-score.jpg");
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
        pb.NewGoogleSearchTool(),
    }
    model.GenerationConfig = &pb.GenerationConfig{
        ResponseModalities: []pb.ResponseModality{genai.Text, genai.Image},
        ImageConfig: &pb.ImageConfig{
            AspectRatio: "16:9",
        },
    }

    prompt := "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League"
    resp, err := model.GenerateContent(ctx, genai.Text(prompt))
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("football-score.jpg", img.Data, 0644)
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

public class SearchGrounding {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .imageConfig(ImageConfig.builder()
              .aspectRatio("16:9")
              .build())
          .tools(Tool.builder()
              .googleSearch(GoogleSearch.builder().build())
              .build())
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview", """
              Make a simple but stylish graphic of last night's Arsenal game in the Champion's League
              """,
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("football-score.jpg"), blob.data().get());
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
    "contents": [{"parts": [{"text": "Make a simple but stylish graphic of last nights Arsenal game in the Champions League"}]}],
    "tools": [{"google_search": {}}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {"aspectRatio": "16:9"}
    }
  }'
```

![AI-generated graphic of an Arsenal football score](/static/gemini-api/docs/images/football-score.jpg)

AI-generated graphic of an Arsenal football score

### Prompts for editing images

These examples show how to provide images alongside your text prompts for
editing, composition, and style transfer.

#### 1. Adding and removing elements

Provide an image and describe your change. The model will match the original
image's style, lighting, and perspective.

### Template

```
Using the provided image of [subject], please [add/remove/modify] [element]
to/from the scene. Ensure the change is [description of how the change should
integrate].
```

### Prompt

```
"Using the provided image of my cat, please add a small, knitted wizard hat
on its head. Make it look like it's sitting comfortably and matches the soft
lighting of the photo."
```

### Python

```
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

# Base image prompt: "A photorealistic picture of a fluffy ginger cat sitting on a wooden floor, looking directly at the camera. Soft, natural light from a window."
image_input = Image.open('/path/to/your/cat_photo.png')
text_input = """Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."""

# Generate an image from a text prompt
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[text_input, image_input],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("cat_with_hat.png")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const imagePath = "/path/to/your/cat_photo.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    { text: "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off." },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

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
      fs.writeFileSync("cat_with_hat.png", buffer);
      console.log("Image saved as cat_with_hat.png");
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

  imagePath := "/path/to/your/cat_photo.png"
  imgData, _ := os.ReadFile(imagePath)

  parts := []*genai.Part{
    genai.NewPartFromText("Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."),
    &genai.Part{
      InlineData: &genai.Blob{
        MIMEType: "image/png",
        Data:     imgData,
      },
    },
  }

  contents := []*genai.Content{
    genai.NewContentFromParts(parts, genai.RoleUser),
  }

  result, _ := client.Models.GenerateContent(
      ctx,
      "gemini-3.1-flash-image-preview",
      contents,
  )

  for _, part := range result.Candidates[0].Content.Parts {
      if part.Text != "" {
          fmt.Println(part.Text)
      } else if part.InlineData != nil {
          imageBytes := part.InlineData.Data
          outputFilename := "cat_with_hat.png"
          _ = os.WriteFile(outputFilename, imageBytes, 0644)
      }
  }
}
```

### Java

```
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AddRemoveElements {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          Content.fromParts(
              Part.fromText("""
                  Using the provided image of my cat, please add a small,
                  knitted wizard hat on its head. Make it look like it's
                  sitting comfortably and not falling off.
                  """),
              Part.fromBytes(
                  Files.readAllBytes(
                      Path.of("/path/to/your/cat_photo.png")),
                  "image/png")),
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("cat_with_hat.png"), blob.data().get());
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
    -H 'Content-Type: application/json' \
    -d "{
      \"contents\": [{
        \"parts\":[
            {\"text\": \"Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off.\"},
            {
              \"inline_data\": {
                \"mime_type\":\"image/png\",
                \"data\": \"<BASE64_IMAGE_DATA>\"
              }
            }
        ]
      }]
    }"
```

|  |  |
| --- | --- |
| Input | Output |
| A photorealistic picture of a fluffy ginger cat..   A photorealistic picture of a fluffy ginger cat... | Using the provided image of my cat, please add a small, knitted wizard hat...   Using the provided image of my cat, please add a small, knitted wizard hat... |

#### 2. Inpainting (Semantic masking)

Conversationally define a "mask" to edit a specific part of an image while
leaving the rest untouched.

### Template

```
Using the provided image, change only the [specific element] to [new
element/description]. Keep everything else in the image exactly the same,
preserving the original style, lighting, and composition.
```

### Prompt

```
"Using the provided image of a living room, change only the blue sofa to be
a vintage, brown leather chesterfield sofa. Keep the rest of the room,
including the pillows on the sofa and the lighting, unchanged."
```

### Python

```
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

# Base image prompt: "A wide shot of a modern, well-lit living room with a prominent blue sofa in the center. A coffee table is in front of it and a large window is in the background."
living_room_image = Image.open('/path/to/your/living_room.png')
text_input = """Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged."""
