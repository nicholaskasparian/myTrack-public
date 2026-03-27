# Source: https://ai.google.dev/gemini-api/docs/image-generation
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# overview — Part 11

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
            {
              \"inline_data\": {
                \"mime_type\":\"image/png\",
                \"data\": \"<BASE64_IMAGE_DATA_1>\"
              }
            },
            {
              \"inline_data\": {
                \"mime_type\":\"image/png\",
                \"data\": \"<BASE64_IMAGE_DATA_2>\"
              }
            },
            {\"text\": \"Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt.\"}
        ]
      }]
    }"
```

|  |  |  |
| --- | --- | --- |
| Input 1 | Input 2 | Output |
| A professional headshot of a woman with brown hair and blue eyes...   A professional headshot of a woman with brown hair and blue eyes... | A simple, modern logo with the letters 'G' and 'A'...   A simple, modern logo with the letters 'G' and 'A'... | Take the first image of the woman with brown hair, blue eyes, and a neutral expression...   Take the first image of the woman with brown hair, blue eyes, and a neutral expression... |

#### 6. Bring something to life

Upload a rough sketch or drawing and ask the model to refine it into a finished image.

### Template

```
Turn this rough [medium] sketch of a [subject] into a [style description]
photo. Keep the [specific features] from the sketch but add [new details/materials].
```

### Prompt

```
"Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."
```

### Python

```
from google import genai
from PIL import Image

client = genai.Client()

# Base image prompt: "A rough pencil sketch of a flat sports car on white paper."
sketch_image = Image.open('/path/to/your/car_sketch.png')
text_input = """Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."""

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[sketch_image, text_input],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("car_photo.png")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const imagePath = "/path/to/your/car_sketch.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
    { text: "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting." },
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
      fs.writeFileSync("car_photo.png", buffer);
      console.log("Image saved as car_photo.png");
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

  imgData, _ := os.ReadFile("/path/to/your/car_sketch.png")

  parts := []*genai.Part{
    &genai.Part{
      InlineData: &genai.Blob{
        MIMEType: "image/png",
        Data:     imgData,
      },
    },
    genai.NewPartFromText("Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."),
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
          outputFilename := "car_photo.png"
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

public class BringToLife {
  public static void main(String[] args) throws IOException {
    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          Content.fromParts(
              Part.fromBytes(
                  Files.readAllBytes(
                      Path.of("/path/to/your/car_sketch.png")),
                  "image/png"),
              Part.fromText("""
                  Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.
                  """)),
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("car_photo.png"), blob.data().get());
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
            {
              \"inline_data\": {
                \"mime_type\":\"image/png\",
                \"data\": \"<BASE64_IMAGE_DATA>\"
              }
            },
            {\"text\": \"Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.\"}
        ]
      }]
    }"
```

|  |  |
| --- | --- |
| Input | Output |
| Sketch of a car   Rough sketch of a car | Output showing the final concept car   Polished photo of a car |

#### 7. Character consistency: 360 view

You can generate 360-degree views of a character by iteratively prompting for
different angles. For best results, include previously generated images in
subsequent prompts to maintain consistency. For complex poses, include a
reference image of the desired pose.

### Template

```
A studio portrait of [person] against [background], [looking forward/in profile looking right/etc.]
```

### Prompt

```
A studio portrait of this man against white, in profile looking right
```

### Python

```
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

image_input = Image.open('/path/to/your/man_in_white_glasses.jpg')
text_input = """A studio portrait of this man against white, in profile looking right"""

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[text_input, image_input],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("man_right_profile.png")
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
    { text: "A studio portrait of this man against white, in profile looking right" },
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
      fs.writeFileSync("man_right_profile.png", buffer);
      console.log("Image saved as man_right_profile.png");
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
    genai.NewPartFromText("A studio portrait of this man against white, in profile looking right"),
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
          outputFilename := "man_right_profile.png"
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

public class CharacterConsistency {
  public static void main(String[] args) throws IOException {
    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          Content.fromParts(
              Part.fromText("""
                  A studio portrait of this man against white, in profile looking right
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
            Files.write(Paths.get("man_right_profile.png"), blob.data().get());
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
