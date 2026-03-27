# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 19


4

.listBuckets({ prefix: 'embeddings-' })

5

6

data?.vectorBuckets.forEach(bucket => {

7

console.log(bucket.vectorBucketName)

8

})
```

---

## Create a vector index

`createIndex(options)`

Creates a new vector index in this bucket Convenience method that automatically includes the bucket name

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Index configuration (vectorBucketName is automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Creating a vector index

```
1

const bucket = supabase.storage.vectors.from('embeddings-prod')

2

await bucket.createIndex({

3

indexName: 'documents-openai',

4

dataType: 'float32',

5

dimension: 1536,

6

distanceMetric: 'cosine',

7

metadataConfiguration: {

8

nonFilterableMetadataKeys: ['raw_text']

9

}

10

})
```

---

## Delete a vector index

`deleteIndex(indexName)`

Deletes an index from this bucket Convenience method that automatically includes the bucket name

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* indexNamestring

  Name of the index to delete

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Delete an index

```
1

const bucket = supabase.storage.vectors.from('embeddings-prod')

2

await bucket.deleteIndex('old-index')
```

---

## Retrieve a vector index

`getIndex(indexName)`

Retrieves metadata for a specific index in this bucket Convenience method that automatically includes the bucket name

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* indexNamestring

  Name of the index to retrieve

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Get index metadata

```
1

const bucket = supabase.storage.vectors.from('embeddings-prod')

2

const { data } = await bucket.getIndex('documents-openai')

3

console.log('Dimension:', data?.index.dimension)
```

---

## List all vector indexes

`listIndexes(options)`

Lists indexes in this bucket Convenience method that automatically includes the bucket name

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Listing options (vectorBucketName is automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

List indexes

```
1

const bucket = supabase.storage.vectors.from('embeddings-prod')

2

const { data } = await bucket.listIndexes({ prefix: 'documents-' })
```

---

## Access a vector index

`VectorBucketScope(indexName)`

Access operations for a specific index within this bucket Returns a scoped client for vector data operations

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* indexNamestring

  Name of the index

Accessing an index

```
1

const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')

2

3

// Insert vectors

4

await index.putVectors({

5

vectors: [

6

{ key: 'doc-1', data: { float32: [...] }, metadata: { title: 'Intro' } }

7

]

8

})

9

10

// Query similar vectors

11

const { data } = await index.queryVectors({

12

queryVector: { float32: [...] },

13

topK: 5

14

})
```

---

## Delete vectors from index

`deleteVectors(options)`

Deletes vectors by keys from this index Convenience method that automatically includes bucket and index names

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Deletion options (bucket and index names automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Delete vectors by keys

```
1

const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')

2

await index.deleteVectors({

3

keys: ['doc-1', 'doc-2', 'doc-3']

4

})
```

---

## Retrieve vectors from index

`getVectors(options)`

Retrieves vectors by keys from this index Convenience method that automatically includes bucket and index names

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Vector retrieval options (bucket and index names automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Get vectors by keys

```
1

const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')

2

const { data } = await index.getVectors({

3

keys: ['doc-1', 'doc-2'],

4

returnMetadata: true

5

})
```

---

## List vectors in index

`listVectors(options)`

Lists vectors in this index with pagination Convenience method that automatically includes bucket and index names

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsOmit

  Listing options (bucket and index names automatically set)

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

List vectors with pagination

```
1

const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')

2

const { data } = await index.listVectors({

3

maxResults: 500,

4

returnMetadata: true

5

})
```

---

## Add vectors to index
