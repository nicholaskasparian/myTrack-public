# Source: https://ai.google.dev/gemini-api/docs/image-generation
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# overview — Part 2

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
            {\"text\": \"'Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation\"},
            {
              \"inline_data\": {
                \"mime_type\":\"image/jpeg\",
                \"data\": \"<BASE64_IMAGE_DATA>\"
              }
            }
        ]
      }]
    }"
```

### Multi-turn image editing

Keep generating and editing images conversationally. Chat or multi-turn
conversation is the recommended way to iterate on images. The following
example shows a prompt to generate an infographic about photosynthesis.

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

chat = client.chats.create(
    model="gemini-3.1-flash-image-preview",
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        tools=[{"google_search": {}}]
    )
)

message = "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

response = chat.send_message(message)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif image:= part.as_image():
        image.save("photosynthesis.png")
```

### Javascript

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const chat = ai.chats.create({
    model: "gemini-3.1-flash-image-preview",
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      tools: [{googleSearch: {}}],
    },
  });
}

await main();

const message = "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

let response = await chat.sendMessage({message});

for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("photosynthesis.png", buffer);
      console.log("Image saved as photosynthesis.png");
    }
}
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
    }
    chat := model.StartChat()

    message := "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."

    resp, err := chat.SendMessage(ctx, genai.Text(message))
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("photosynthesis.png", img.Data, 0644)
            if err != nil {
                log.Fatal(err)
            }
        }
    }
}
```

### Java

```
import com.google.genai.Chat;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.GoogleSearch;
import com.google.genai.types.ImageConfig;
import com.google.genai.types.Part;
import com.google.genai.types.RetrievalConfig;
import com.google.genai.types.Tool;
import com.google.genai.types.ToolConfig;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class MultiturnImageEditing {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {

      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .tools(Tool.builder()
              .googleSearch(GoogleSearch.builder().build())
              .build())
          .build();

      Chat chat = client.chats.create("gemini-3.1-flash-image-preview", config);

      GenerateContentResponse response = chat.sendMessage("""
          Create a vibrant infographic that explains photosynthesis
          as if it were a recipe for a plant's favorite food.
          Show the "ingredients" (sunlight, water, CO2)
          and the "finished dish" (sugar/energy).
          The style should be like a page from a colorful
          kids' cookbook, suitable for a 4th grader.
          """);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("photosynthesis.png"), blob.data().get());
          }
        }
      }
      // ...
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
      "role": "user",
      "parts": [
        {"text": "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plants favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids cookbook, suitable for a 4th grader."}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"]
    }
  }'
```

![AI-generated infographic about photosynthesis](/static/gemini-api/docs/images/infographic-eng.png)

AI-generated infographic about photosynthesis

You can then use the same chat to change the language on the graphic to Spanish.

### Python

```
message = "Update this infographic to be in Spanish. Do not change any other elements of the image."
aspect_ratio = "16:9" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
resolution = "2K" # "512", "1K", "2K", "4K"

response = chat.send_message(message,
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
            image_size=resolution
        ),
    ))

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif image:= part.as_image():
        image.save("photosynthesis_spanish.png")
```

### Javascript

```
const message = 'Update this infographic to be in Spanish. Do not change any other elements of the image.';
const aspectRatio = '16:9';
const resolution = '2K';

let response = await chat.sendMessage({
  message,
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: {
      aspectRatio: aspectRatio,
      imageSize: resolution,
    },
    tools: [{googleSearch: {}}],
  },
});

for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("photosynthesis2.png", buffer);
      console.log("Image saved as photosynthesis2.png");
    }
}
```

### Go

```
message = "Update this infographic to be in Spanish. Do not change any other elements of the image."
aspect_ratio = "16:9" // "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
resolution = "2K"     // "512", "1K", "2K", "4K"

model.GenerationConfig.ImageConfig = &pb.ImageConfig{
    AspectRatio: aspect_ratio,
    ImageSize:   resolution,
}

resp, err = chat.SendMessage(ctx, genai.Text(message))
if err != nil {
    log.Fatal(err)
}

for _, part := range resp.Candidates[0].Content.Parts {
    if txt, ok := part.(genai.Text); ok {
        fmt.Printf("%s", string(txt))
    } else if img, ok := part.(genai.ImageData); ok {
        err := os.WriteFile("photosynthesis_spanish.png", img.Data, 0644)
        if err != nil {
            log.Fatal(err)
        }
    }
}
```

### Java

```
String aspectRatio = "16:9"; // "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
String resolution = "2K"; // "512", "1K", "2K", "4K"

config = GenerateContentConfig.builder()
    .responseModalities("TEXT", "IMAGE")
    .imageConfig(ImageConfig.builder()
        .aspectRatio(aspectRatio)
        .imageSize(resolution)
        .build())
    .build();

response = chat.sendMessage(
    "Update this infographic to be in Spanish. " +
    "Do not change any other elements of the image.",
    config);

for (Part part : response.parts()) {
  if (part.text().isPresent()) {
    System.out.println(part.text().get());
  } else if (part.inlineData().isPresent()) {
    var blob = part.inlineData().get();
    if (blob.data().isPresent()) {
      Files.write(Paths.get("photosynthesis_spanish.png"), blob.data().get());
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
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [{"text": "Create a vibrant infographic that explains photosynthesis..."}]
      },
      {
        "role": "model",
        "parts": [{"inline_data": {"mime_type": "image/png", "data": "<PREVIOUS_IMAGE_DATA>"}}]
      },
      {
        "role": "user",
        "parts": [{"text": "Update this infographic to be in Spanish. Do not change any other elements of the image."}]
      }
    ],
    "tools": [{"google_search": {}}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {
        "aspectRatio": "16:9",
        "imageSize": "2K"
      }
    }
  }'
```

![AI-generated infographic of photosynthesis in Spanish](/static/gemini-api/docs/images/infographic-spanish.png)

AI-generated infographic of photosynthesis in Spanish

## New with Gemini 3 Image models

Gemini 3 offers state-of-the-art image generation and editing models. Gemini 3.1
Flash Image is optimized for speed and high-volume use-cases, and Gemini 3
Pro Image is optimized for professional asset production.
Designed to tackle the most challenging workflows through advanced reasoning,
they excel at complex, multi-turn creation and modification tasks.

* **High-resolution output**: Built-in generation capabilities for 1K, 2K, and 4K visuals.
  + **Gemini 3.1 Flash Image** adds the smaller 512 (0.5K) resolution.
* **Advanced text rendering**: Capable of generating legible, stylized text for
  infographics, menus, diagrams, and marketing assets.
* **Grounding with Google Search**: The model can use Google Search as a tool to
  verify facts and generate imagery based on real-time data (e.g., current
  weather maps, stock charts, recent events).
  + **Gemini 3.1 Flash Image** adds the integration of Grounding with Google Search for Images alongside Web Search.
* **Thinking mode**: The model utilizes a "thinking" process to reason through
  complex prompts. It generates interim "thought images" (visible in the backend
  but not charged) to refine the composition before producing the final
  high-quality output.
* **Up to 14 reference images**: You can now mix up to 14 reference images to
  produce the final image.
* **New aspect ratios**: Gemini 3.1 Flash Image Preview adds 1:4, 4:1, 1:8, and
  8:1 [aspect ratios](#aspect_ratios_and_image_size).

### Use up to 14 reference images

Gemini 3 image models let you to mix up to 14 reference images. These 14 images
can include the following:

| Gemini 3.1 Flash Image Preview | Gemini 3 Pro Image Preview |
| --- | --- |
| Up to 10 images of objects with high-fidelity to include in the final image | Up to 6 images of objects with high-fidelity to include in the final image |
| Up to 4 images of characters to maintain character consistency | Up to 5 images of characters to maintain character consistency |

### Python

```
from google import genai
from google.genai import types
from PIL import Image

prompt = "An office group photo of these people, they are making funny faces."
aspect_ratio = "5:4" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"
resolution = "2K" # "512", "1K", "2K", "4K"

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        prompt,
        Image.open('person1.png'),
        Image.open('person2.png'),
        Image.open('person3.png'),
        Image.open('person4.png'),
        Image.open('person5.png'),
    ],
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
        image.save("office.png")
```

### Javascript
