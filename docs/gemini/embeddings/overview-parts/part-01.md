# Source: https://ai.google.dev/gemini-api/docs/embeddings
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# overview — Part 1


Try the new [Gemini 3.1 Flash Live](/gemini-api/docs/live-api) audio-to-audio model in [AI Studio](https://aistudio.google.com/live?model=gemini-3.1-flash-live-preview).

* [Home](https://ai.google.dev/)
* [Gemini API](https://ai.google.dev/gemini-api)
* [Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Embeddings

The Gemini API offers embedding models to generate embeddings for text, images,
video, and other content. These resulting embeddings can then be used for tasks
such as semantic search, classification, and clustering, providing more accurate,
context-aware results than keyword-based approaches.

The latest model, `gemini-embedding-2-preview`, is the first multimodal
embedding model in the Gemini API. It maps text, images,
video, audio, and documents into a unified embedding space, enabling cross-modal
search, classification, and clustering across over 100 languages. See the
[multimodal embeddings section](#multimodal) to learn more. For text-only
use cases, `gemini-embedding-001` remains available.

Building Retrieval Augmented Generation (RAG) systems is a common use case for
AI products. Embeddings play a key role in significantly enhancing model outputs
with improved factual accuracy, coherence, and contextual richness. If you prefer
to use a managed RAG solution, we built the [File Search](/gemini-api/docs/file-search)
tool which makes doing RAG easier to manage and more cost effective.

## Generating embeddings

Use the `embedContent` method to generate text embeddings:

### Python

```
from google import genai

client = genai.Client()

result = client.models.embed_content(
        model="gemini-embedding-001",
        contents="What is the meaning of life?"
)

print(result.embeddings)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {

    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: 'What is the meaning of life?',
    });

    console.log(response.embeddings);
}

main();
```

### Go

```
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"

    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    contents := []*genai.Content{
        genai.NewContentFromText("What is the meaning of life?", genai.RoleUser),
    }
    result, err := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }

    embeddings, err := json.MarshalIndent(result.Embeddings, "", "  ")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(embeddings))
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: ${GEMINI_API_KEY}" \
    -d '{
        "model": "models/gemini-embedding-001",
        "content": {
        "parts": [{
            "text": "What is the meaning of life?"
        }]
        }
    }'
```

You can also generate embeddings for multiple chunks at once by passing them in
as a list of strings.

### Python

```
from google import genai

client = genai.Client()

result = client.models.embed_content(
        model="gemini-embedding-001",
        contents= [
            "What is the meaning of life?",
            "What is the purpose of existence?",
            "How do I bake a cake?"
        ]
)

for embedding in result.embeddings:
    print(embedding)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {

    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [
            'What is the meaning of life?',
            'What is the purpose of existence?',
            'How do I bake a cake?'
        ],
    });

    console.log(response.embeddings);
}

main();
```

### Go

```
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"

    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    contents := []*genai.Content{
        genai.NewContentFromText("What is the meaning of life?"),
        genai.NewContentFromText("How does photosynthesis work?"),
        genai.NewContentFromText("Tell me about the history of the internet."),
    }
    result, err := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }

    embeddings, err := json.MarshalIndent(result.Embeddings, "", "  ")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(embeddings))
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
    "content": {
        "parts": [
        {
            "text": "What is the meaning of life?"
        },
        {
            "text": "How much wood would a woodchuck chuck?"
        },
        {
            "text": "How does the brain work?"
        }
        ]
    },
    "taskType": "SEMANTIC_SIMILARITY"
    }'
```

## Specify task type to improve performance

You can use embeddings for a wide range of tasks from classification to document
search. Specifying the right task type helps optimize the embeddings for the
intended relationships, maximizing accuracy and efficiency. For a complete list
of supported task types, see the [Supported task types](#supported-task-types)
table.

The following example shows how you can use
`SEMANTIC_SIMILARITY` to check how similar in meaning strings of texts are.

### Python

```
from google import genai
from google.genai import types
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

client = genai.Client()

texts = [
    "What is the meaning of life?",
    "What is the purpose of existence?",
    "How do I bake a cake?",
]

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=texts,
    config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
)

# Create a 3x3 table to show the similarity matrix
df = pd.DataFrame(
    cosine_similarity([e.values for e in result.embeddings]),
    index=texts,
    columns=texts,
)

print(df)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
// npm i compute-cosine-similarity
import * as cosineSimilarity from "compute-cosine-similarity";

async function main() {
    const ai = new GoogleGenAI({});

    const texts = [
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ];

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: texts,
        config: { taskType: 'SEMANTIC_SIMILARITY' },
    });

    const embeddings = response.embeddings.map(e => e.values);

    for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
            const text1 = texts[i];
            const text2 = texts[j];
            const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
            console.log(`Similarity between '${text1}' and '${text2}': ${similarity.toFixed(4)}`);
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
    "math"

    "google.golang.org/genai"
)

// cosineSimilarity calculates the similarity between two vectors.
func cosineSimilarity(a, b []float32) (float64, error) {
    if len(a) != len(b) {
        return 0, fmt.Errorf("vectors must have the same length")
    }

    var dotProduct, aMagnitude, bMagnitude float64
    for i := 0; i < len(a); i++ {
        dotProduct += float64(a[i] * b[i])
        aMagnitude += float64(a[i] * a[i])
        bMagnitude += float64(b[i] * b[i])
    }

    if aMagnitude == 0 || bMagnitude == 0 {
        return 0, nil
    }

    return dotProduct / (math.Sqrt(aMagnitude) * math.Sqrt(bMagnitude)), nil
}

func main() {
    ctx := context.Background()
    client, _ := genai.NewClient(ctx, nil)
    defer client.Close()

    texts := []string{
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    }

    var contents []*genai.Content
    for _, text := range texts {
        contents = append(contents, genai.NewContentFromText(text, genai.RoleUser))
    }

    result, _ := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        &genai.EmbedContentRequest{TaskType: genai.TaskTypeSemanticSimilarity},
    )

    embeddings := result.Embeddings

    for i := 0; i < len(texts); i++ {
        for j := i + 1; j < len(texts); j++ {
            similarity, _ := cosineSimilarity(embeddings[i].Values, embeddings[j].Values)
            fmt.Printf("Similarity between '%s' and '%s': %.4f\n", texts[i], texts[j], similarity)
        }
    }
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
    -H "Content-Type: application/json" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -d '{
    "taskType": "SEMANTIC_SIMILARITY",
    "content": {
        "parts": [
        {
            "text": "What is the meaning of life?"
        },
        {
            "text": "How much wood would a woodchuck chuck?"
        },
        {
            "text": "How does the brain work?"
        }
        ]
    }
    }'
```

The code snippets will show how similar the different chunks of text are to one
another when run.

### Supported task types

Task type | Description | Examples || **SEMANTIC\_SIMILARITY** | Embeddings optimized to assess text similarity. | Recommendation systems, duplicate detection |
| **CLASSIFICATION** | Embeddings optimized to classify texts according to preset labels. | Sentiment analysis, spam detection |
| **CLUSTERING** | Embeddings optimized to cluster texts based on their similarities. | Document organization, market research, anomaly detection |
| **RETRIEVAL\_DOCUMENT** | Embeddings optimized for document search. | Indexing articles, books, or web pages for search. |
| **RETRIEVAL\_QUERY** | Embeddings optimized for general search queries. Use `RETRIEVAL_QUERY` for queries; `RETRIEVAL_DOCUMENT` for documents to be retrieved. | Custom search |
| **CODE\_RETRIEVAL\_QUERY** | Embeddings optimized for retrieval of code blocks based on natural language queries. Use `CODE_RETRIEVAL_QUERY` for queries; `RETRIEVAL_DOCUMENT` for code blocks to be retrieved. | Code suggestions and search |
| **QUESTION\_ANSWERING** | Embeddings for questions in a question-answering system, optimized for finding documents that answer the question. Use `QUESTION_ANSWERING` for questions; `RETRIEVAL_DOCUMENT` for documents to be retrieved. | Chatbox |
| **FACT\_VERIFICATION** | Embeddings for statements that need to be verified, optimized for retrieving documents that contain evidence supporting or refuting the statement. Use `FACT_VERIFICATION` for the target text; `RETRIEVAL_DOCUMENT` for documents to be retrieved | Automated fact-checking systems |

## Controlling embedding size

Both `gemini-embedding-001` and `gemini-embedding-2-preview` are trained using
the Matryoshka Representation Learning (MRL) technique which teaches a model to
learn high-dimensional embeddings that have initial segments (or prefixes) which
are also useful, simpler versions of the same data.

Use the `output_dimensionality` parameter to control the size of
the output embedding vector. Selecting a smaller output dimensionality can save
storage space and increase computational efficiency for downstream applications,
while sacrificing little in terms of quality. By default, both models output a
3072-dimensional embedding, but you can truncate it to a smaller size without
losing quality to save storage space. We recommend using 768, 1536, or 3072
output dimensions.

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents="What is the meaning of life?",
