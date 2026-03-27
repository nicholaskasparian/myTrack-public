# Source: https://ai.google.dev/gemini-api/docs/image-generation#prompting
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# prompting — Part 3


```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
      'An office group photo of these people, they are making funny faces.';
  const aspectRatio = '5:4';
  const resolution = '2K';

const contents = [
  { text: prompt },
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile1,
    },
  },
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile2,
    },
  },
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile3,
    },
  },
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile4,
    },
  },
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile5,
    },
  }
];

const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: contents,
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
            AspectRatio: "5:4",
            ImageSize:   "2K",
        },
    }

    img1, err := os.ReadFile("person1.png")
    if err != nil { log.Fatal(err) }
    img2, err := os.ReadFile("person2.png")
    if err != nil { log.Fatal(err) }
    img3, err := os.ReadFile("person3.png")
    if err != nil { log.Fatal(err) }
    img4, err := os.ReadFile("person4.png")
    if err != nil { log.Fatal(err) }
    img5, err := os.ReadFile("person5.png")
    if err != nil { log.Fatal(err) }

    parts := []genai.Part{
        genai.Text("An office group photo of these people, they are making funny faces."),
        genai.ImageData{MIMEType: "image/png", Data: img1},
        genai.ImageData{MIMEType: "image/png", Data: img2},
        genai.ImageData{MIMEType: "image/png", Data: img3},
        genai.ImageData{MIMEType: "image/png", Data: img4},
        genai.ImageData{MIMEType: "image/png", Data: img5},
    }

    resp, err := model.GenerateContent(ctx, parts...)
    if err != nil {
        log.Fatal(err)
    }

    for _, part := range resp.Candidates[0].Content.Parts {
        if txt, ok := part.(genai.Text); ok {
            fmt.Printf("%s", string(txt))
        } else if img, ok := part.(genai.ImageData); ok {
            err := os.WriteFile("office.png", img.Data, 0644)
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
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.ImageConfig;
import com.google.genai.types.Part;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class GroupPhoto {
  public static void main(String[] args) throws IOException {

    try (Client client = new Client()) {
      GenerateContentConfig config = GenerateContentConfig.builder()
          .responseModalities("TEXT", "IMAGE")
          .imageConfig(ImageConfig.builder()
              .aspectRatio("5:4")
              .imageSize("2K")
              .build())
          .build();

      GenerateContentResponse response = client.models.generateContent(
          "gemini-3.1-flash-image-preview",
          Content.fromParts(
              Part.fromText("An office group photo of these people, they are making funny faces."),
              Part.fromBytes(Files.readAllBytes(Path.of("person1.png")), "image/png"),
              Part.fromBytes(Files.readAllBytes(Path.of("person2.png")), "image/png"),
              Part.fromBytes(Files.readAllBytes(Path.of("person3.png")), "image/png"),
              Part.fromBytes(Files.readAllBytes(Path.of("person4.png")), "image/png"),
              Part.fromBytes(Files.readAllBytes(Path.of("person5.png")), "image/png")
          ), config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("office.png"), blob.data().get());
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
            {\"text\": \"An office group photo of these people, they are making funny faces.\"},
            {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_1>\"}},
            {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_2>\"}},
            {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_3>\"}},
            {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_4>\"}},
            {\"inline_data\": {\"mime_type\":\"image/png\", \"data\": \"<BASE64_DATA_IMG_5>\"}}
        ]
      }],
      \"generationConfig\": {
        \"responseModalities\": [\"TEXT\", \"IMAGE\"],
        \"imageConfig\": {
          \"aspectRatio\": \"5:4\",
          \"imageSize\": \"2K\"
        }
      }
    }"
```

![AI-generated office group photo](/static/gemini-api/docs/images/office-group-photo.jpeg)

AI-generated office group photo

### Grounding with Google Search

Use the [Google Search tool](/gemini-api/docs/google-search) to generate images
based on real-time information, such as weather forecasts, stock charts, or
recent events.

Note that when using Grounding with Google Search with image generation,
image-based search results are not passed to the generation model and are
excluded from the response (see [Grounding with Google Search for images](#image-search))

### Python

```
from google import genai
prompt = "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"
aspect_ratio = "16:9" # "1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"

client = genai.Client()

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
        image.save("weather.png")
```

### Javascript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt = 'Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day';
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
    tools: [{ googleSearch: {} }]
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
              Visualize the current weather forecast for the next 5 days
              in San Francisco as a clean, modern weather chart.
              Add a visual on what I should wear each day
              """,
          config);

      for (Part part : response.parts()) {
        if (part.text().isPresent()) {
          System.out.println(part.text().get());
        } else if (part.inlineData().isPresent()) {
          var blob = part.inlineData().get();
          if (blob.data().isPresent()) {
            Files.write(Paths.get("weather.png"), blob.data().get());
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
    "contents": [{"parts": [{"text": "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"}]}],
    "tools": [{"google_search": {}}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {"aspectRatio": "16:9"}
    }
  }'
```

![AI-generated five day weather chart for San Francisco](/static/gemini-api/docs/images/weather-forecast.png)

AI-generated five day weather chart for San Francisco

The response includes `groundingMetadata` which contains the following required
fields:

* **`searchEntryPoint`**: Contains the HTML and CSS to render the required
  search suggestions.
* **`groundingChunks`**: Returns the top 3 web sources used to ground the
  generated image

### Grounding with Google Search for Images (3.1 Flash)

Grounding with Google Search for images allows models to use web images retrieved via
Google Search as visual context for image generation. Image Search is a
new search type within the existing Grounding with Google Search tool,
functioning alongside standard [Web Search](#use-with-grounding).

To enable Image Search, configure the `googleSearch` tool in your API request
and specify `imageSearch` within the `searchTypes` object. Image Search can be
used independently or together with Web Search.

Note that Grounding with Google Search for images can't be used to search for people.

### Python

```
from google import genai
prompt = "A detailed painting of a Timareta butterfly resting on a flower"

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        tools=[
            types.Tool(google_search=types.GoogleSearch(
                search_types=types.SearchTypes(
                    web_search=types.WebSearch(),
                    image_search=types.ImageSearch()
                )
            ))
        ]
    )
)

# Display grounding sources if available
if response.candidates and response.candidates[0].grounding_metadata and response.candidates[0].grounding_metadata.search_entry_point:
    display(HTML(response.candidates[0].grounding_metadata.search_entry_point.rendered_content))
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt = "A detailed painting of a Timareta butterfly resting on a flower";

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
