# Source: https://ai.google.dev/gemini-api/docs/embeddings
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# overview — Part 3

                mimeType: 'audio/mpeg',
                data: audioBase64,
            },
        }],
    });

    console.log(response.embeddings);
}

main();
```

### REST

```
AUDIO_PATH="/path/to/your/example.mp3"
AUDIO_BASE64=$(base64 -w0 "${AUDIO_PATH}")

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "content": {
            "parts": [{
                "inline_data": {
                    "mime_type": "audio/mpeg",
                    "data": "'"${AUDIO_BASE64}"'"
                }
            }]
        }
    }'
```

### Embedding video

The following example shows how to embed a video using
`gemini-embedding-2-preview`.

Videos can be provided as inline data or as uploaded files
through the [Files API](/gemini-api/docs/files).

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

with open('example.mp4', 'rb') as f:
    video_bytes = f.read()

result = client.models.embed_content(
    model='gemini-embedding-2-preview',
    contents=[
        types.Part.from_bytes(
            data=video_bytes,
            mime_type='video/mp4',
        ),
    ]
)

print(result.embeddings[0].values)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
    const ai = new GoogleGenAI({});

    const videoBase64 = fs.readFileSync("example.mp4", { encoding: "base64" });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [{
            inlineData: {
                mimeType: 'video/mp4',
                data: videoBase64,
            },
        }],
    });

    console.log(response.embeddings);
}

main();
```

### REST

```
VIDEO_PATH="/path/to/your/video.mp4"
VIDEO_BASE64=$(base64 -w0 "${VIDEO_PATH}")

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "content": {
            "parts": [{
                "inline_data": {
                    "mime_type": "video/mp4",
                    "data": "'"${VIDEO_BASE64}"'"
                }
            }]
        }
    }'
```

If you need to embed videos >120 seconds, you can chunk the video into
overlapping segments and embed those chunks individually.

### Embedding documents

documents in PDF format can be embedded directly. The model processes the visual and text
content of each page.

PDFs can be provided as inline data or as uploaded files
through the [Files API](/gemini-api/docs/files).

### Python

```
from google import genai
from google.genai import types

with open('example.pdf', 'rb') as f:
    pdf_bytes = f.read()

client = genai.Client()

result = client.models.embed_content(
    model='gemini-embedding-2-preview',
    contents=[
        types.Part.from_bytes(
            data=pdf_bytes,
            mime_type='application/pdf',
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

    const pdfBase64 = fs.readFileSync("example.pdf", { encoding: "base64" });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [{
            inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64,
            },
        }],
    });

    console.log(response.embeddings);
}

main();
```

### REST

```
PDF_PATH="/path/to/your/example.pdf"
PDF_BASE64=$(base64 -w0 "${PDF_PATH}")

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "content": {
            "parts": [{
                "inline_data": {
                    "mime_type": "application/pdf",
                    "data": "'"${PDF_BASE64}"'"
                }
            }]
        }
    }'
```

## Use cases

Text embeddings are crucial for a variety of common AI use cases, such as:

* **Retrieval-Augmented Generation (RAG):** Embeddings enhance the quality
  of generated text by retrieving and incorporating relevant information into
  the context of a model.
* **Information retrieval:** Search for the most semantically similar text or
  documents given a piece of input text.

  [Document search tutorialtask](https://github.com/google-gemini/cookbook/blob/main/examples/Talk_to_documents_with_embeddings.ipynb)
* **Search reranking**: Prioritize the most relevant items by semantically
  scoring initial results against the query.

  [Search reranking tutorialtask](https://github.com/google-gemini/cookbook/blob/main/examples/Search_reranking_using_embeddings.ipynb)
* **Anomaly detection:** Comparing groups of embeddings can help identify
  hidden trends or outliers.

  [Anomaly detection tutorialbubble\_chart](https://github.com/google-gemini/cookbook/blob/main/examples/Anomaly_detection_with_embeddings.ipynb)
* **Classification:** Automatically categorize text based on its content, such
  as sentiment analysis or spam detection

  [Classification tutorialtoken](https://github.com/google-gemini/cookbook/blob/main/examples/Classify_text_with_embeddings.ipynb)
* **Clustering:** Effectively grasp complex relationships by creating clusters
  and visualizations of your embeddings.

  [Clustering visualization tutorialbubble\_chart](https://github.com/google-gemini/cookbook/blob/main/examples/clustering_with_embeddings.ipynb)

## Storing embeddings

As you take embeddings to production, it is common to
use **vector databases** to efficiently store, index, and retrieve
high-dimensional embeddings. Google Cloud offers managed data services that
can be used for this purpose including
[Vertex AI Vector Search 2.0](https://docs.cloud.google.com/vertex-ai/docs/vector-search-2/overview),
[BigQuery](https://cloud.google.com/bigquery/docs/introduction),
[AlloyDB](https://cloud.google.com/alloydb/docs/overview), and
[Cloud SQL](https://cloud.google.com/sql/docs/postgres/introduction).

The following tutorials show how to use other third party vector databases
with Gemini Embedding.

* [ChromaDB tutorialsbolt](https://docs.trychroma.com/integrations/embedding-models/google-gemini)
* [QDrant tutorialsbolt](https://qdrant.tech/documentation/embeddings/gemini/)
* [Weaviate tutorialsbolt](https://docs.weaviate.io/weaviate/model-providers/google)
* [Pinecone tutorialsbolt](https://github.com/google-gemini/cookbook/blob/main/examples/langchain/Gemini_LangChain_QA_Pinecone_WebLoad.ipynb)

## Model versions

### Gemini Embedding 2 Preview

| Property | Description |
| --- | --- |
| id\_cardModel code | **Gemini API**  `gemini-embedding-2-preview` |
| saveSupported data types | **Input**  Text, image, video, audio, PDF  **Output**  Text embeddings |
| token\_autoToken limits[[\*]](/gemini-api/docs/tokens) | **Input token limit**  8,192  **Output dimension size**  Flexible, supports: 128 - 3072, Recommended: 768, 1536, 3072 |
| 123Versions | Read the [model version patterns](/gemini-api/docs/models/gemini#model-versions) for more details.  * Preview: `gemini-embedding-2-preview` |
| calendar\_monthLatest update | November 2025 |

### Gemini Embedding

| Property | Description |
| --- | --- |
| id\_cardModel code | **Gemini API**  `gemini-embedding-001` |
| saveSupported data types | **Input**  Text  **Output**  Text embeddings |
| token\_autoToken limits[[\*]](/gemini-api/docs/tokens) | **Input token limit**  2,048  **Output dimension size**  Flexible, supports: 128 - 3072, Recommended: 768, 1536, 3072 |
| 123Versions | Read the [model version patterns](/gemini-api/docs/models/gemini#model-versions) for more details.  * Stable: `gemini-embedding-001` |
| calendar\_monthLatest update | June 2025 |

For deprecated Embeddings models, visit the [Deprecations](/gemini-api/docs/deprecations) page

## Migration from gemini-embedding-001

The embedding spaces between `gemini-embedding-001` and
`gemini-embedding-2-preview` are **incompatible**. This means you cannot
directly compare embeddings generated by one model with embeddings generated by
the other. If you are upgrading to `gemini-embedding-2-preview`, you must
re-embed all of your existing data.

## Batch embeddings

If latency is not a concern, try using the Gemini Embeddings models with
[Batch API](/gemini-api/docs/batch-api#batch-embedding). This
allows for much higher throughput at 50% of the default Embedding price.
Find examples on how to get started in the [Batch API cookbook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb).

## Responsible use notice

Unlike generative AI models that create new content, the Gemini Embedding model
is only intended to transform the format of your input data into a numerical
representation. While Google is responsible for providing an embedding model
that transforms the format of your input data to the numerical-format requested,
users retain full responsibility for the data they input and the resulting
embeddings. By using the Gemini Embedding model you confirm that you have the
necessary rights to any content that you upload. Do not generate content that
infringes on others' intellectual property or privacy rights. Your use of this
service is subject to our [Prohibited Use
Policy](https://policies.google.com/terms/generative-ai/use-policy) and
[Google's Terms of Service](/gemini-api/terms).

## Start building with embeddings

Check out the [embeddings quickstart
notebook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Embeddings.ipynb)
to explore the model capabilities and learn how to customize and visualize your
embeddings.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-03-23 UTC.

Need to tell us more?

[[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-03-23 UTC."],[],[]]
