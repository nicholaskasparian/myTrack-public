# Source: https://supabase.com/docs/reference/javascript/storage-from-upload
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upload — Part 18


---

## Access an analytics bucket

Creates a new StorageAnalyticsClient instance

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* urlstring

  The base URL for the storage API
* headers{ [key: string]: string }

  HTTP headers to include in requests
* fetch

  Optional

  function

  Optional custom fetch implementation

  Details

Creating a StorageAnalyticsClient instance

```
1

const client = new StorageAnalyticsClient(url, headers)
```

---

## Create a new analytics bucket

`createBucket(name)`

Creates a new analytics bucket using Iceberg tables Analytics buckets are optimized for analytical queries and data processing

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

* Creates a new analytics bucket using Iceberg tables
* Analytics buckets are optimized for analytical queries and data processing

### Parameters

* namestring

  A unique name for the bucket you are creating

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create analytics bucket

```
1

const { data, error } = await supabase

2

.storage

3

.analytics

4

.createBucket('analytics-data')
```

Response

---

## List analytics buckets

`listBuckets(options?)`

Retrieves the details of all Analytics Storage buckets within an existing project Only returns buckets of type 'ANALYTICS'

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

* Retrieves the details of all Analytics Storage buckets within an existing project
* Only returns buckets of type 'ANALYTICS'

### Parameters

* options

  Optional

  object

  Query parameters for listing buckets

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

List analytics buckets

```
1

const { data, error } = await supabase

2

.storage

3

.analytics

4

.listBuckets({

5

limit: 10,

6

offset: 0,

7

sortColumn: 'created_at',

8

sortOrder: 'desc'

9

})
```

Response

---

## Delete an analytics bucket

`deleteBucket(bucketName)`

Deletes an existing analytics bucket A bucket can't be deleted with existing objects inside it You must first empty the bucket before deletion

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

* Deletes an analytics bucket

### Parameters

* bucketNamestring

  The unique identifier of the bucket you would like to delete

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Delete analytics bucket

```
1

const { data, error } = await supabase

2

.storage

3

.analytics

4

.deleteBucket('analytics-data')
```

Response

---

## Vector Buckets

This section contains methods for working with Vector Buckets.

---

## Access a vector bucket

`from(vectorBucketName)`

Access operations for a specific vector bucket Returns a scoped client for index and vector operations within the bucket

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* vectorBucketNamestring

  Name of the vector bucket

Accessing a vector bucket

```
1

const bucket = supabase.storage.vectors.from('embeddings-prod')
```

---

## Create a vector bucket

`createBucket(vectorBucketName)`

Creates a new vector bucket Vector buckets are containers for vector indexes and their data

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* vectorBucketNamestring

  Unique name for the vector bucket

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Creating a vector bucket

```
1

const { data, error } = await supabase

2

.storage

3

.vectors

4

.createBucket('embeddings-prod')
```

---

## Delete a vector bucket

`deleteBucket(vectorBucketName)`

Deletes a vector bucket (bucket must be empty) All indexes must be deleted before deleting the bucket

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* vectorBucketNamestring

  Name of the vector bucket to delete

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Delete a vector bucket

```
1

const { data, error } = await supabase

2

.storage

3

.vectors

4

.deleteBucket('embeddings-old')
```

---

## Retrieve a vector bucket

`getBucket(vectorBucketName)`

Retrieves metadata for a specific vector bucket

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* vectorBucketNamestring

  Name of the vector bucket

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

Get bucket metadata

```
1

const { data, error } = await supabase

2

.storage

3

.vectors

4

.getBucket('embeddings-prod')

5

6

console.log('Bucket created:', data?.vectorBucket.creationTime)
```

---

## List all vector buckets

`listBuckets(options)`

Lists all vector buckets with optional filtering and pagination

**Public alpha:** This API is part of a public alpha release and may not be available to your account type.

### Parameters

* optionsListVectorBucketsOptions

  Optional filters (prefix, maxResults, nextToken)

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1SuccessResponse

  Details
* Option 2ErrorResponse

  Details

List vector buckets

```
1

const { data, error } = await supabase

2

.storage

3

.vectors
