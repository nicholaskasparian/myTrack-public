# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 20


`putVectors(options)`

Inserts or updates vectors in this index Convenience method that automatically includes bucket and index names

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Vector insertion options (bucket and index names automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Insert vectors into an index

```
1

const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')

2

await index.putVectors({

3

vectors: [

4

{

5

key: 'doc-1',

6

data: { float32: [0.1, 0.2, ...] },

7

metadata: { title: 'Introduction', page: 1 }

8

}

9

]

10

})
```

---

## Search vectors in index

`queryVectors(options)`

Queries for similar vectors in this index Convenience method that automatically includes bucket and index names

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Query options (bucket and index names automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Query similar vectors

```
1

const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')

2

const { data } = await index.queryVectors({

3

queryVector: { float32: [0.1, 0.2, ...] },

4

topK: 5,

5

filter: { category: 'technical' },

6

returnDistance: true,

7

returnMetadata: true

8

})
```
