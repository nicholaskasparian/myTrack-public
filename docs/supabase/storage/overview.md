# Source: https://supabase.com/docs/guides/storage
# Last fetched: 2026-03-27T18:38:37.271521+00:00

Storage

# Storage

## Use Supabase to store and serve files.

---

Supabase Storage is a robust, scalable solution for managing files of any size with fine-grained access controls and optimized delivery. Whether you're storing user-generated content, analytics data, or vector embeddings, Supabase Storage provides specialized bucket types to meet your specific needs.

## Key features[#](#key-features)

* **Multi Protocol** - S3 compatible Storage, RESTful API, TUS resumable uploads
* **Global CDN** - Serve your assets with lightning-fast performance from over 285 cities worldwide
* **Image Optimization** - Resize, compress, and transform media files on the fly with built-in image processing
* **Fine-grained Access Control** - Manage file permissions with row-level security and custom policies
* **Multiple Bucket Types** - Specialized storage solutions for different use cases

## Storage bucket types[#](#storage-bucket-types)

Supabase Storage offers different bucket types optimized for specific use cases:

### Files buckets[#](#files-buckets)

Store and serve traditional files including images, videos, documents, and general-purpose content. Ideal for user-generated content, media libraries, and asset management.

**Use cases:** Images, videos, documents, PDFs, archives

**Features:**

* Global CDN delivery
* Image optimization and transformation
* Row-level security integration
* Direct URL access for files

[Learn more about Files Buckets](/docs/guides/storage/quickstart)

### Analytics buckets[#](#analytics-buckets)

Purpose-built for storing and analyzing data in open table formats like Apache Iceberg. Perfect for time-series data, logs, and large-scale analytical workloads.

**Use cases:** Data lakes, analytics pipelines, ETL operations, historical data analysis

**Features:**

* Apache Iceberg table format support
* SQL-accessible via Postgres foreign tables
* Partitioned data organization
* Efficient data querying and transformation

[Learn more about Analytics Buckets](/docs/guides/storage/analytics/introduction)

### Vector buckets[#](#vector-buckets)

Specialized storage for vector embeddings and similarity search operations. Designed for AI and ML applications requiring semantic search capabilities.

**Use cases:** AI-powered search, semantic similarity matching, embedding storage, RAG systems

**Features:**

* Optimized vector indexing (HNSW, Flat)
* Multiple distance metrics (cosine, euclidean, L2)
* Metadata filtering for vectors
* Similarity search queries

[Learn more about Vector Buckets](/docs/guides/storage/vector/introduction)

## Examples[#](#examples)

Check out all of the Storage [templates and examples](https://github.com/supabase/supabase/tree/master/examples/storage) in our GitHub repository.

[![Resumable Uploads with Uppy](/docs/img/icons/github-icon-light.svg)

Resumable Uploads with Uppy

Use Uppy to upload files to Supabase Storage using the TUS protocol (resumable uploads).](https://github.com/supabase/supabase/tree/master/examples/storage/resumable-upload-uppy)

## Resources[#](#resources)

Find the source code and documentation in the Supabase GitHub repository.

[Supabase Storage API

View the source code.](https://github.com/supabase/storage-api)

[OpenAPI Spec

See the Swagger Documentation for Supabase Storage.](https://supabase.github.io/storage/)

### Is this helpful?

No  Yes

### AI Tools

Copy as Markdown[Ask ChatGPT](https://chatgpt.com/?hint=search&q=Read from https://supabase.com/docs/guides/storage so I can ask questions about its contents)[Ask Claude](https://claude.ai/new?q=Read from https://supabase.com/docs/guides/storage so I can ask questions about its contents)
