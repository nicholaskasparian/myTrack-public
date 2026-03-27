# Source: https://ai.google.dev/gemini-api/docs/image-generation
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# api-reference — Part 12

    -d "{
      \"contents\": [{
        \"parts\":[
            {\"text\": \"A studio portrait of this man against white, in profile looking right\"},
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

|  |  |  |
| --- | --- | --- |
| Input | Output 1 | Output 2 |
| Original input of a man in white glasses   Original image | Output of a man in white glasses looking right   Man in white glasses looking right | Output of a man in white glasses looking forward   Man in white glasses looking forward |

### Best Practices

To elevate your results from good to great, incorporate these professional
strategies into your workflow.

* **Be Hyper-Specific:** The more detail you provide, the more control you
  have. Instead of "fantasy armor," describe it: "ornate elven plate armor, etched
  with silver leaf patterns, with a high collar and pauldrons shaped like falcon
  wings."
* **Provide Context and Intent:** Explain the *purpose* of the image. The
  model's understanding of context will influence the final output. For example,
  "Create a logo for a high-end, minimalist skincare brand" will yield better
  results than just "Create a logo."
* **Iterate and Refine:** Don't expect a perfect image on the first try. Use
  the conversational nature of the model to make small changes. Follow up with
  prompts like, "That's great, but can you make the lighting a bit warmer?" or
  "Keep everything the same, but change the character's expression to be more
  serious."
* **Use Step-by-Step Instructions:** For complex scenes with many elements,
  break your prompt into steps. "First, create a background of a serene, misty
  forest at dawn. Then, in the foreground, add a moss-covered ancient stone altar.
  Finally, place a single, glowing sword on top of the altar."
* **Use "Semantic Negative Prompts":** Instead of saying "no cars," describe
  the desired scene positively: "an empty, deserted street with no signs of
  traffic."
* **Control the Camera:** Use photographic and cinematic language to control
  the composition. Terms like `wide-angle shot`, `macro shot`, `low-angle
  perspective`.

## Limitations

* For best performance, use the following languages: EN, ar-EG, de-DE, es-MX,
  fr-FR, hi-IN, id-ID, it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN.
* Image generation does not support audio or video inputs.
* The model won't always follow the exact number of image outputs that the
  user explicitly asks for.
* `gemini-2.5-flash-image` works best with up to 3 images as input, while
  `gemini-3-pro-image-preview` supports 5 images with high fidelity, and up to
  14 images in total. `gemini-3.1-flash-image-preview` supports character
  resemblance of up to 4 characters and the fidelity of up to 10 objects in a
  single workflow.
* When generating text for an image, Gemini works best if you first generate
  the text and then ask for an image with the text.
* `gemini-3.1-flash-image-preview` Grounding with Google Search does not support using real-world images of people from web search at this time.
* All generated images include a [SynthID watermark](/responsible/docs/safeguards/synthid).

## Optional configurations

You can optionally configure the response modalities and aspect ratio of the
model's output in the `config` field of `generate_content` calls.

### Output types

The model defaults to returning text and image responses
(i.e. `response_modalities=['Text', 'Image']`).
You can configure the response to return only images without text using
`response_modalities=['Image']`.

### Python

```
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[prompt],
    config=types.GenerateContentConfig(
        response_modalities=['Image']
    )
)
```

### JavaScript

```
const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
    config: {
        responseModalities: ['Image']
    }
  });
```

### Go

```
result, _ := client.Models.GenerateContent(
    ctx,
    "gemini-3.1-flash-image-preview",
    genai.Text("Create a picture of a nano banana dish in a " +
                " fancy restaurant with a Gemini theme"),
    &genai.GenerateContentConfig{
        ResponseModalities: "Image",
    },
  )
```

### Java

```
response = client.models.generateContent(
    "gemini-3.1-flash-image-preview",
    prompt,
    GenerateContentConfig.builder()
        .responseModalities("IMAGE")
        .build());
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
        {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["Image"]
    }
  }'
```

### Aspect ratios and image size

The model defaults to matching the output image size to that of your input
image, or otherwise generates 1:1 squares.
You can control the aspect ratio of the output image using the `aspect_ratio`
field under `image_config` in the response request, shown here:

### Python

```
# For gemini-2.5-flash-image
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
        )
    )
)

# For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[prompt],
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
            image_size="2K",
        )
    )
)
```

### JavaScript

```
// For gemini-2.5-flash-image
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    }
  });

// For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
const response_gemini3 = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "2K",
      },
    }
  });
```

### Go

```
// For gemini-2.5-flash-image
result, _ := client.Models.GenerateContent(
    ctx,
    "gemini-2.5-flash-image",
    genai.Text("Create a picture of a nano banana dish in a " +
                " fancy restaurant with a Gemini theme"),
    &genai.GenerateContentConfig{
        ImageConfig: &genai.ImageConfig{
          AspectRatio: "16:9",
        },
    }
  )

// For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
result_gemini3, _ := client.Models.GenerateContent(
    ctx,
    "gemini-3.1-flash-image-preview",
    genai.Text("Create a picture of a nano banana dish in a " +
                " fancy restaurant with a Gemini theme"),
    &genai.GenerateContentConfig{
        ImageConfig: &genai.ImageConfig{
          AspectRatio: "16:9",
          ImageSize: "2K",
        },
    }
  )
```

### Java

```
// For gemini-2.5-flash-image
response = client.models.generateContent(
    "gemini-2.5-flash-image",
    prompt,
    GenerateContentConfig.builder()
        .imageConfig(ImageConfig.builder()
            .aspectRatio("16:9")
            .build())
        .build());

// For gemini-3.1-flash-image-preview and gemini-3-pro-image-preview
response_gemini3 = client.models.generateContent(
    "gemini-3.1-flash-image-preview",
    prompt,
    GenerateContentConfig.builder()
        .imageConfig(ImageConfig.builder()
            .aspectRatio("16:9")
            .imageSize("2K")
            .build())
        .build());
```

### REST

```
# For gemini-2.5-flash-image
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
      ]
    }],
    "generationConfig": {
      "imageConfig": {
        "aspectRatio": "16:9"
      }
    }
  }'

# For gemini-3-pro-image-preview
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
      ]
    }],
    "generationConfig": {
      "imageConfig": {
        "aspectRatio": "16:9",
        "imageSize": "2K"
      }
    }
  }'
```

The different ratios available and the size of the image generated are listed in
the following tables:

### 3.1 Flash Image Preview

| Aspect ratio | 512 resolution | 0.5K tokens | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **1:1** | 512x512 | 747 | 1024x1024 | 1120 | 2048x2048 | 1680 | 4096x4096 | 2520 |
| **1:4** | 256x1024 | 747 | 512x2048 | 1120 | 1024x4096 | 1680 | 2048x8192 | 2520 |
| **1:8** | 192x1536 | 747 | 384x3072 | 1120 | 768x6144 | 1680 | 1536x12288 | 2520 |
| **2:3** | 424x632 | 747 | 848x1264 | 1120 | 1696x2528 | 1680 | 3392x5056 | 2520 |
| **3:2** | 632x424 | 747 | 1264x848 | 1120 | 2528x1696 | 1680 | 5056x3392 | 2520 |
| **3:4** | 448x600 | 747 | 896x1200 | 1120 | 1792x2400 | 1680 | 3584x4800 | 2520 |
| **4:1** | 1024x256 | 747 | 2048x512 | 1120 | 4096x1024 | 1680 | 8192x2048 | 2520 |
| **4:3** | 600x448 | 747 | 1200x896 | 1120 | 2400x1792 | 1680 | 4800x3584 | 2520 |
| **4:5** | 464x576 | 747 | 928x1152 | 1120 | 1856x2304 | 1680 | 3712x4608 | 2520 |
| **5:4** | 576x464 | 747 | 1152x928 | 1120 | 2304x1856 | 1680 | 4608x3712 | 2520 |
| **8:1** | 1536x192 | 747 | 3072x384 | 1120 | 6144x768 | 1680 | 12288x1536 | 2520 |
| **9:16** | 384x688 | 747 | 768x1376 | 1120 | 1536x2752 | 1680 | 3072x5504 | 2520 |
| **16:9** | 688x384 | 747 | 1376x768 | 1120 | 2752x1536 | 1680 | 5504x3072 | 2520 |
| **21:9** | 792x168 | 747 | 1584x672 | 1120 | 3168x1344 | 1680 | 6336x2688 | 2520 |

### 3 Pro Image Preview

| Aspect ratio | 1K resolution | 1K tokens | 2K resolution | 2K tokens | 4K resolution | 4K tokens |
| --- | --- | --- | --- | --- | --- | --- |
| **1:1** | 1024x1024 | 1120 | 2048x2048 | 1120 | 4096x4096 | 2000 |
| **2:3** | 848x1264 | 1120 | 1696x2528 | 1120 | 3392x5056 | 2000 |
| **3:2** | 1264x848 | 1120 | 2528x1696 | 1120 | 5056x3392 | 2000 |
| **3:4** | 896x1200 | 1120 | 1792x2400 | 1120 | 3584x4800 | 2000 |
| **4:3** | 1200x896 | 1120 | 2400x1792 | 1120 | 4800x3584 | 2000 |
| **4:5** | 928x1152 | 1120 | 1856x2304 | 1120 | 3712x4608 | 2000 |
| **5:4** | 1152x928 | 1120 | 2304x1856 | 1120 | 4608x3712 | 2000 |
| **9:16** | 768x1376 | 1120 | 1536x2752 | 1120 | 3072x5504 | 2000 |
| **16:9** | 1376x768 | 1120 | 2752x1536 | 1120 | 5504x3072 | 2000 |
| **21:9** | 1584x672 | 1120 | 3168x1344 | 1120 | 6336x2688 | 2000 |

### Gemini 2.5 Flash Image

| Aspect ratio | Resolution | Tokens |
| --- | --- | --- |
| 1:1 | 1024x1024 | 1290 |
| 2:3 | 832x1248 | 1290 |
| 3:2 | 1248x832 | 1290 |
| 3:4 | 864x1184 | 1290 |
| 4:3 | 1184x864 | 1290 |
| 4:5 | 896x1152 | 1290 |
| 5:4 | 1152x896 | 1290 |
| 9:16 | 768x1344 | 1290 |
| 16:9 | 1344x768 | 1290 |
| 21:9 | 1536x672 | 1290 |

## Model selection

Choose the model best suited for your specific use case.

* **Gemini 3.1 Flash Image Preview (Nano Banana 2 Preview)** should be your
  go-to image generation model, as the best all around performance and
  intelligence to cost and latency balance. Check the model [pricing](/gemini-api/docs/pricing#gemini-3.1-flash-image-preview) and [capabilities](/gemini-api/docs/models/gemini-3.1-flash-image-preview) page for more
  details.
* **Gemini 3 Pro Image Preview (Nano Banana Pro Preview)** is designed for
  professional asset production and complex instructions. This model features
  real-world grounding using Google Search, a default "Thinking" process that
  refines composition prior to generation, and can generate images of up to 4K
  resolutions. Check the model [pricing](/gemini-api/docs/pricing#gemini-3-pro-image-preview) and [capabilities](/gemini-api/docs/models/gemini-3-pro-image-preview) page for more
  details.
* **Gemini 2.5 Flash Image (Nano Banana)** is designed for speed and
  efficiency. This model is optimized for high-volume, low-latency tasks and
  generates images at 1024px resolution. Check the model [pricing](/gemini-api/docs/pricing#gemini-2.5-flash-image) and
  [capabilities](/gemini-api/docs/models/gemini-2.5-flash-image) page for more
  details.

### When to use Imagen

In addition to using Gemini's built-in image generation capabilities, you can
also access [Imagen](/gemini-api/docs/imagen), our specialized image generation
model, through the Gemini API.

Imagen 4 should be your go-to model when starting to generate images
with Imagen. Choose Imagen 4 Ultra for advanced
use-cases or when you need the best image quality (note that can only generate
one image at a time).

## What's next

* Find more examples and code samples in the [cookbook guide](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_Started_Nano_Banana.ipynb).
* Check out the [Veo guide](/gemini-api/docs/video) to learn how to generate
  videos with the Gemini API.
* To learn more about Gemini models, see [Gemini models](/gemini-api/docs/models/gemini).

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-03-23 UTC.

Need to tell us more?

[[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-03-23 UTC."],[],[]]
