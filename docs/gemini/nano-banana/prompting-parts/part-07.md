# Source: https://ai.google.dev/gemini-api/docs/image-generation#prompting
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# prompting — Part 7

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("product_mockup.png"), blob.data().get());
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
        {"text": "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."}
      ]
    }]
  }'
```

![A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug...](/static/gemini-api/docs/images/product_mockup.png)

A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug...

#### 5. Minimalist & negative space design

Excellent for creating backgrounds for websites, presentations, or marketing
materials where text will be overlaid.

### Template

```
A minimalist composition featuring a single [subject] positioned in the
[bottom-right/top-left/etc.] of the frame. The background is a vast, empty
[color] canvas, creating significant negative space. Soft, subtle lighting.
[Aspect ratio].
```

### Prompt

```
A minimalist composition featuring a single, delicate red maple leaf
positioned in the bottom-right of the frame. The background is a vast, empty
off-white canvas, creating significant negative space for text. Soft,
diffused lighting from the top left. Square image.
```

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("minimalist_design.png")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
    "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.";

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
      fs.writeFileSync("minimalist_design.png", buffer);
      console.log("Image saved as minimalist_design.png");
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
        genai.Text("A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."),
    )

    for _, part := range result.Candidates[0].Content.Parts {
        if part.Text != "" {
            fmt.Println(part.Text)
        } else if part.InlineData != nil {
            imageBytes := part.InlineData.Data
            outputFilename := "minimalist_design.png"
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

public class MinimalistDesign {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          """
          A minimalist composition featuring a single, delicate red maple
          leaf positioned in the bottom-right of the frame. The background
          is a vast, empty off-white canvas, creating significant negative
          space for text. Soft, diffused lighting from the top left.
          Square image.
          """,
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("minimalist_design.png"), blob.data().get());
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
        {"text": "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."}
      ]
    }]
  }'
```

![A minimalist composition featuring a single, delicate red maple leaf...](/static/gemini-api/docs/images/minimalist_design.png)

A minimalist composition featuring a single, delicate red maple leaf...

#### 6. Sequential art (Comic panel / Storyboard)

Builds on character consistency and scene description to create panels for
visual storytelling. For accuracy with text and storytelling ability, these
prompts work best with Gemini 3 Pro and Gemini 3.1 Flash Image Preview.

### Template

```
Make a 3 panel comic in a [style]. Put the character in a [type of scene].
```

### Prompt

```
Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.
```

### Python

```
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

image_input = Image.open('/path/to/your/man_in_white_glasses.jpg')
text_input = "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[text_input, image_input],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("comic_panel.jpg")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const imagePath = "/path/to/your/man_in_white_glasses.jpg";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    {text: "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."},
    {
      inlineData: {
        mimeType: "image/jpeg",
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
      fs.writeFileSync("comic_panel.jpg", buffer);
      console.log("Image saved as comic_panel.jpg");
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

    imagePath := "/path/to/your/man_in_white_glasses.jpg"
    imgData, _ := os.ReadFile(imagePath)

    parts := []*genai.Part{
      genai.NewPartFromText("Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."),
      &genai.Part{
        InlineData: &genai.Blob{
          MIMEType: "image/jpeg",
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
            outputFilename := "comic_panel.jpg"
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

public class ComicPanel {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          Content.fromParts(
              Part.fromText("""
                  Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.
                  """),
              Part.fromBytes(
                  Files.readAllBytes(
                      Path.of("/path/to/your/man_in_white_glasses.jpg")),
                  "image/jpeg")),
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("comic_panel.jpg"), blob.data().get());
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
        {"text": "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."},
        {"inline_data": {"mime_type": "image/jpeg", "data": "<BASE64_IMAGE_DATA>"}}
      ]
    }]
  }'
```

|  |  |
| --- | --- |
| Input | Output |
| Man in white glasses   Input image | Make a 3 panel comic in a gritty, noir art style...   Make a 3 panel comic in a gritty, noir art style... |

#### 7. Grounding with Google Search

Use Google Search to generate images based on recent or real-time information.
This is useful for news, weather, and other time-sensitive topics.

### Prompt

```
Make a simple but stylish graphic of last night's Arsenal game in the Champion's League
```

### Python

```
from google import genai
from google.genai import types
prompt = "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League"
aspect_ratio = "16:9" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"

client = genai.Client()

