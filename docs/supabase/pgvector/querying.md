# Source: https://supabase.com/docs/guides/ai/vector-columns#querying-embeddings
# Last fetched: 2026-03-27T18:43:18.241096+00:00

AI & Vectors

# Vector columns

---

Supabase offers a number of different ways to store and query vectors within Postgres. The SQL included in this guide is applicable for clients in all programming languages. If you are a Python user see your [Python client options](/docs/guides/ai/python-clients) after reading the `Learn` section.

Vectors in Supabase are enabled via [pgvector](https://github.com/pgvector/pgvector/), a Postgres extension for storing and querying vectors in Postgres. It can be used to store [embeddings](/docs/guides/ai/concepts#what-are-embeddings).

## Usage[#](#usage)

### Enable the extension[#](#enable-the-extension)

DashboardSQL

1. Go to the [Database](/dashboard/project/_/database/tables) page in the Dashboard.
2. Click on **Extensions** in the sidebar.
3. Search for "vector" and enable the extension.

### Create a table to store vectors[#](#create-a-table-to-store-vectors)

After enabling the `vector` extension, you will get access to a new data type called `vector`. The size of the vector (indicated in parenthesis) represents the number of dimensions stored in that vector.

```
1

create table documents (

2

id serial primary key,

3

title text not null,

4

body text not null,

5

embedding extensions.vector(384)

6

);
```

In the above SQL snippet, we create a `documents` table with a column called `embedding` (note this is just a regular Postgres column - you can name it whatever you like). We give the `embedding` column a `vector` data type with 384 dimensions. Change this to the number of dimensions produced by your embedding model. For example, if you are [generating embeddings](/docs/guides/ai/quickstarts/generate-text-embeddings) using the open source [`gte-small`](https://huggingface.co/Supabase/gte-small) model, you would set this number to 384 since that model produces 384 dimensions.

In general, embeddings with fewer dimensions perform best. See our [analysis on fewer dimensions in pgvector](/blog/fewer-dimensions-are-better-pgvector).

### Storing a vector / embedding[#](#storing-a-vector--embedding)

In this example we'll generate a vector using Transformers.js, then store it in the database using the Supabase JavaScript client.

```
1

import { pipeline } from '@huggingface/transformers'

2

const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small')

3

4

const title = 'First post!'

5

const body = 'Hello world!'

6

7

// Generate a vector using Transformers.js

8

const output = await generateEmbedding(body, {

9

pooling: 'mean',

10

normalize: true,

11

})

12

13

// Extract the embedding output

14

const embedding = Array.from(output.data)

15

16

// Store the vector in Postgres

17

const { data, error } = await supabase.from('documents').insert({

18

title,

19

body,

20

embedding,

21

})
```

This example uses the JavaScript Supabase client, but you can modify it to work with any [supported language library](/docs#client-libraries).

### Querying a vector / embedding[#](#querying-a-vector--embedding)

Similarity search is the most common use case for vectors. `pgvector` support 3 new operators for computing distance:

| Operator | Description |
| --- | --- |
| `<->` | Euclidean distance |
| `<#>` | negative inner product |
| `<=>` | cosine distance |

Choosing the right operator depends on your needs. Dot product tends to be the fastest if your vectors are normalized. For more information on how embeddings work and how they relate to each other, see [What are Embeddings?](/docs/guides/ai/concepts#what-are-embeddings).

Supabase client libraries like `supabase-js` connect to your Postgres instance via [PostgREST](/docs/guides/getting-started/architecture#postgrest-api). PostgREST does not currently support `pgvector` similarity operators, so we'll need to wrap our query in a Postgres function and call it via the `rpc()` method:

```
1

create or replace function match_documents (

2

query_embedding extensions.vector(384),

3

match_threshold float,

4

match_count int

5

)

6

returns table (

7

id bigint,

8

title text,

9

body text,

10

similarity float

11

)

12

language sql stable

13

as $$

14

select

15

documents.id,

16

documents.title,

17

documents.body,

18

1 - (documents.embedding <=> query_embedding) as similarity

19

from documents

20

where 1 - (documents.embedding <=> query_embedding) > match_threshold

21

order by (documents.embedding <=> query_embedding) asc

22

limit match_count;

23

$$;
```

This function takes a `query_embedding` argument and compares it to all other embeddings in the `documents` table. Each comparison returns a similarity score. If the similarity is greater than the `match_threshold` argument, it is returned. The number of rows returned is limited by the `match_count` argument.

Feel free to modify this method to fit the needs of your application. The `match_threshold` ensures that only documents that have a minimum similarity to the `query_embedding` are returned. Without this, you may end up returning documents that subjectively don't match. This value will vary for each application - you will need to perform your own testing to determine the threshold that makes sense for your app.

If you index your vector column, ensure that the `order by` sorts by the distance function directly (rather than sorting by the calculated `similarity` column, which may lead to the index being ignored and poor performance).

To execute the function from your client library, call `rpc()` with the name of your Postgres function:

```
1

const { data: documents } = await supabaseClient.rpc('match_documents', {

2

query_embedding: embedding, // Pass the embedding you want to compare

3

match_threshold: 0.78, // Choose an appropriate threshold for your data

4

match_count: 10, // Choose the number of matches

5

})
```

In this example `embedding` would be another embedding you wish to compare against your table of pre-generated embedding documents. For example if you were building a search engine, every time the user submits their query you would first generate an embedding on the search query itself, then pass it into the above `rpc()` function to match.

Be sure to use embeddings produced from the same embedding model when calculating distance. Comparing embeddings from two different models will produce no meaningful result.

Vectors and embeddings can be used for much more than search. Learn more about embeddings at [What are Embeddings?](/docs/guides/ai/concepts#what-are-embeddings).

### Indexes[#](#indexes)

Once your vector table starts to grow, you will likely want to add an index to speed up queries. See [Vector indexes](/docs/guides/ai/vector-indexes) to learn how vector indexes work and how to create them.

### Is this helpful?

No  Yes

### AI Tools

Copy as Markdown[Ask ChatGPT](https://chatgpt.com/?hint=search&q=Read from https://supabase.com/docs/guides/ai/vector-columns so I can ask questions about its contents)[Ask Claude](https://claude.ai/new?q=Read from https://supabase.com/docs/guides/ai/vector-columns so I can ask questions about its contents)
