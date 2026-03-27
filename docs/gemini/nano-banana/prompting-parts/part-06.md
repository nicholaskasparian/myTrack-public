# Source: https://ai.google.dev/gemini-api/docs/image-generation#prompting
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# prompting — Part 6

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
        genai.Text("A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."),
    )

    for _, part := range result.Candidates[0].Content.Parts {
        if part.Text != "" {
            fmt.Println(part.Text)
        } else if part.InlineData != nil {
            imageBytes := part.InlineData.Data
            outputFilename := "red_panda_sticker.png"
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

public class StylizedIllustration {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          """
          A kawaii-style sticker of a happy red panda wearing a tiny bamboo
          hat. It's munching on a green bamboo leaf. The design features
          bold, clean outlines, simple cel-shading, and a vibrant color
          palette. The background must be white.
          """,
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("red_panda_sticker.png"), blob.data().get());
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
        {"text": "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It is munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."}
      ]
    }]
  }'
```

![A kawaii-style sticker of a happy red...](/static/gemini-api/docs/images/red_panda_sticker.png)

A kawaii-style sticker of a happy red panda...

#### 3. Accurate text in images

Gemini excels at rendering text. Be clear about the text, the font style
(descriptively), and the overall design. Use Gemini 3 Pro Image Preview for
professional asset production.

### Template

```
Create a [image type] for [brand/concept] with the text "[text to render]"
in a [font style]. The design should be [style description], with a
[color scheme].
```

### Prompt

```
Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.
```

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="1:1",
        )
    )
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("logo_example.jpg")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
    "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.";

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("logo_example.jpg", buffer);
      console.log("Image saved as logo_example.jpg");
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
        genai.Text("Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."),
        &genai.GenerateContentConfig{
            ImageConfig: &genai.ImageConfig{
              AspectRatio: "1:1",
            },
        },
    )

    for _, part := range result.Candidates[0].Content.Parts {
        if part.Text != "" {
            fmt.Println(part.Text)
        } else if part.InlineData != nil {
            imageBytes := part.InlineData.Data
            outputFilename := "logo_example.jpg"
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
import com.google.genai.types.ImageConfig;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class AccurateTextInImages {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .imageConfig(ImageConfig.builder()
              .aspectRatio("1:1")
              .build())
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          """
          Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.
          """,
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("logo_example.jpg"), blob.data().get());
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
        {"text": "Create a modern, minimalist logo for a coffee shop called The Daily Grind. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."}
      ]
    }],
    "generationConfig": {
      "imageConfig": {
        "aspectRatio": "1:1"
      }
    }
  }'
```

![Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'...](/static/gemini-api/docs/images/logo_example.jpg)

Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'...

#### 4. Product mockups & commercial photography

Perfect for creating clean, professional product shots for ecommerce,
advertising, or branding.

### Template

```
A high-resolution, studio-lit product photograph of a [product description]
on a [background surface/description]. The lighting is a [lighting setup,
e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp
focus on [key detail]. [Aspect ratio].
```

### Prompt

```
A high-resolution, studio-lit product photograph of a minimalist ceramic
coffee mug in matte black, presented on a polished concrete surface. The
lighting is a three-point softbox setup designed to create soft, diffused
highlights and eliminate harsh shadows. The camera angle is a slightly
elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with
sharp focus on the steam rising from the coffee. Square image.
```

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("product_mockup.png")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
    "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.";

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
      fs.writeFileSync("product_mockup.png", buffer);
      console.log("Image saved as product_mockup.png");
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
        genai.Text("A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."),
    )

    for _, part := range result.Candidates[0].Content.Parts {
        if part.Text != "" {
            fmt.Println(part.Text)
        } else if part.InlineData != nil {
            imageBytes := part.InlineData.Data
            outputFilename := "product_mockup.png"
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

public class ProductMockup {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          """
          A high-resolution, studio-lit product photograph of a minimalist
          ceramic coffee mug in matte black, presented on a polished
          concrete surface. The lighting is a three-point softbox setup
          designed to create soft, diffused highlights and eliminate harsh
          shadows. The camera angle is a slightly elevated 45-degree shot
          to showcase its clean lines. Ultra-realistic, with sharp focus
          on the steam rising from the coffee. Square image.
          """,
          config);

