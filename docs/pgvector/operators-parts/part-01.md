# Source: https://github.com/pgvector/pgvector#distance
# Last fetched: 2026-03-27T18:25:31.568507+00:00

# operators — Part 1


[pgvector](/pgvector) 
/
**[pgvector](/pgvector/pgvector)**
Public

* [Notifications](/login?return_to=%2Fpgvector%2Fpgvector) You must be signed in to change notification settings
* [Fork
  1.1k](/login?return_to=%2Fpgvector%2Fpgvector)
* [Star
   20.5k](/login?return_to=%2Fpgvector%2Fpgvector)

* [Code](/pgvector/pgvector)
* [Issues
  8](/pgvector/pgvector/issues)
* [Pull requests
  7](/pgvector/pgvector/pulls)
* [Actions](/pgvector/pgvector/actions)
* [Security
  0](/pgvector/pgvector/security)
* [Insights](/pgvector/pgvector/pulse)

Additional navigation options

* [Code](/pgvector/pgvector)
* [Issues](/pgvector/pgvector/issues)
* [Pull requests](/pgvector/pgvector/pulls)
* [Actions](/pgvector/pgvector/actions)
* [Security](/pgvector/pgvector/security)
* [Insights](/pgvector/pgvector/pulse)

# pgvector/pgvector

master

[Branches](/pgvector/pgvector/branches)[Tags](/pgvector/pgvector/tags)

Go to file

Code

Open more actions menu

## Folders and files

| Name | | Name | Last commit message | Last commit date |
| --- | --- | --- | --- | --- |
| Latest commit   History[1,767 Commits](/pgvector/pgvector/commits/master/)   1,767 Commits | | |
| [.github/workflows](/pgvector/pgvector/tree/master/.github/workflows "This path skips through empty directories") | | [.github/workflows](/pgvector/pgvector/tree/master/.github/workflows "This path skips through empty directories") |  |  |
| [sql](/pgvector/pgvector/tree/master/sql "sql") | | [sql](/pgvector/pgvector/tree/master/sql "sql") |  |  |
| [src](/pgvector/pgvector/tree/master/src "src") | | [src](/pgvector/pgvector/tree/master/src "src") |  |  |
| [test](/pgvector/pgvector/tree/master/test "test") | | [test](/pgvector/pgvector/tree/master/test "test") |  |  |
| [.editorconfig](/pgvector/pgvector/blob/master/.editorconfig ".editorconfig") | | [.editorconfig](/pgvector/pgvector/blob/master/.editorconfig ".editorconfig") |  |  |
| [.gitignore](/pgvector/pgvector/blob/master/.gitignore ".gitignore") | | [.gitignore](/pgvector/pgvector/blob/master/.gitignore ".gitignore") |  |  |
| [CHANGELOG.md](/pgvector/pgvector/blob/master/CHANGELOG.md "CHANGELOG.md") | | [CHANGELOG.md](/pgvector/pgvector/blob/master/CHANGELOG.md "CHANGELOG.md") |  |  |
| [Dockerfile](/pgvector/pgvector/blob/master/Dockerfile "Dockerfile") | | [Dockerfile](/pgvector/pgvector/blob/master/Dockerfile "Dockerfile") |  |  |
| [LICENSE](/pgvector/pgvector/blob/master/LICENSE "LICENSE") | | [LICENSE](/pgvector/pgvector/blob/master/LICENSE "LICENSE") |  |  |
| [META.json](/pgvector/pgvector/blob/master/META.json "META.json") | | [META.json](/pgvector/pgvector/blob/master/META.json "META.json") |  |  |
| [Makefile](/pgvector/pgvector/blob/master/Makefile "Makefile") | | [Makefile](/pgvector/pgvector/blob/master/Makefile "Makefile") |  |  |
| [Makefile.win](/pgvector/pgvector/blob/master/Makefile.win "Makefile.win") | | [Makefile.win](/pgvector/pgvector/blob/master/Makefile.win "Makefile.win") |  |  |
| [README.md](/pgvector/pgvector/blob/master/README.md "README.md") | | [README.md](/pgvector/pgvector/blob/master/README.md "README.md") |  |  |
| [vector.control](/pgvector/pgvector/blob/master/vector.control "vector.control") | | [vector.control](/pgvector/pgvector/blob/master/vector.control "vector.control") |  |  |
| View all files | | |

## Repository files navigation

* [README](#)
* [License](#)
* [Security](#)

# pgvector

Open-source vector similarity search for Postgres

Store your vectors with the rest of your data. Supports:

* exact and approximate nearest neighbor search
* single-precision, half-precision, binary, and sparse vectors
* L2 distance, inner product, cosine distance, L1 distance, Hamming distance, and Jaccard distance
* any [language](#languages) with a Postgres client

Plus [ACID](https://en.wikipedia.org/wiki/ACID) compliance, point-in-time recovery, JOINs, and all of the other [great features](https://www.postgresql.org/about/) of Postgres

[![Build Status](https://github.com/pgvector/pgvector/actions/workflows/build.yml/badge.svg)](https://github.com/pgvector/pgvector/actions)

## Installation

### Linux and Mac

Compile and install the extension (supports Postgres 13+)

```
cd /tmp
git clone --branch v0.8.2 https://github.com/pgvector/pgvector.git
cd pgvector
make
make install # may need sudo
```

See the [installation notes](#installation-notes---linux-and-mac) if you run into issues

You can also install it with [Docker](#docker), [Homebrew](#homebrew), [PGXN](#pgxn), [APT](#apt), [Yum](#yum), [pkg](#pkg), [APK](#apk), or [conda-forge](#conda-forge), and it comes preinstalled with [Postgres.app](#postgresapp) and many [hosted providers](#hosted-postgres). There are also instructions for [GitHub Actions](https://github.com/pgvector/setup-pgvector).

### Windows

Ensure [C++ support in Visual Studio](https://learn.microsoft.com/en-us/cpp/build/building-on-the-command-line?view=msvc-170#download-and-install-the-tools) is installed and run `x64 Native Tools Command Prompt for VS [version]` as administrator. Then use `nmake` to build:

```
set "PGROOT=C:\Program Files\PostgreSQL\18"
cd %TEMP%
git clone --branch v0.8.2 https://github.com/pgvector/pgvector.git
cd pgvector
nmake /F Makefile.win
nmake /F Makefile.win install
```

See the [installation notes](#installation-notes---windows) if you run into issues

You can also install it with [Docker](#docker) or [conda-forge](#conda-forge).

## Getting Started

Enable the extension (do this once in each database where you want to use it)

```
CREATE EXTENSION vector;
```

Create a vector column with 3 dimensions

```
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
```

Insert vectors

```
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

Get the nearest neighbors by L2 distance

```
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

Also supports inner product (`<#>`), cosine distance (`<=>`), and L1 distance (`<+>`)

Note: `<#>` returns the negative inner product since Postgres only supports `ASC` order index scans on operators

## Storing

Create a new table with a vector column

```
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
```

Or add a vector column to an existing table

```
ALTER TABLE items ADD COLUMN embedding vector(3);
```

Also supports [half-precision](#half-precision-vectors), [binary](#binary-vectors), and [sparse](#sparse-vectors) vectors

Insert vectors

```
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

Or load vectors in bulk using `COPY` ([example](https://github.com/pgvector/pgvector-python/blob/master/examples/loading/example.py))

```
COPY items (embedding) FROM STDIN WITH (FORMAT BINARY);
```

Upsert vectors

```
INSERT INTO items (id, embedding) VALUES (1, '[1,2,3]'), (2, '[4,5,6]')
    ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding;
```

Update vectors

```
UPDATE items SET embedding = '[1,2,3]' WHERE id = 1;
```

Delete vectors

```
DELETE FROM items WHERE id = 1;
```

## Querying

Get the nearest neighbors to a vector

```
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

Supported distance functions are:

* `<->` - L2 distance
* `<#>` - (negative) inner product
* `<=>` - cosine distance
* `<+>` - L1 distance
* `<~>` - Hamming distance (binary vectors)
* `<%>` - Jaccard distance (binary vectors)

Get the nearest neighbors to a row

```
SELECT * FROM items WHERE id != 1 ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1) LIMIT 5;
```

Get rows within a certain distance

```
SELECT * FROM items WHERE embedding <-> '[3,1,2]' < 5;
```

Note: Combine with `ORDER BY` and `LIMIT` to use an index

#### Distances

Get the distance

```
SELECT embedding <-> '[3,1,2]' AS distance FROM items;
```

For inner product, multiply by -1 (since `<#>` returns the negative inner product)

```
SELECT (embedding <#> '[3,1,2]') * -1 AS inner_product FROM items;
```

For cosine similarity, use 1 - cosine distance

```
SELECT 1 - (embedding <=> '[3,1,2]') AS cosine_similarity FROM items;
```

#### Aggregates

Average vectors

```
SELECT AVG(embedding) FROM items;
```

Average groups of vectors

```
SELECT category_id, AVG(embedding) FROM items GROUP BY category_id;
```

## Indexing

By default, pgvector performs exact nearest neighbor search, which provides perfect recall.

You can add an index to use approximate nearest neighbor search, which trades some recall for speed. Unlike typical indexes, you will see different results for queries after adding an approximate index.

Supported index types are:

* [HNSW](#hnsw)
* [IVFFlat](#ivfflat)

## HNSW

An HNSW index creates a multilayer graph. It has better query performance than IVFFlat (in terms of speed-recall tradeoff), but has slower build times and uses more memory. Also, an index can be created without any data in the table since there isn’t a training step like IVFFlat.

Add an index for each distance function you want to use.

L2 distance

```
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
```

Note: Use `halfvec_l2_ops` for `halfvec` and `sparsevec_l2_ops` for `sparsevec` (and similar with the other distance functions)

Inner product

```
CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);
```

Cosine distance

```
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

L1 distance

```
CREATE INDEX ON items USING hnsw (embedding vector_l1_ops);
```

Hamming distance

```
CREATE INDEX ON items USING hnsw (embedding bit_hamming_ops);
```

Jaccard distance

```
CREATE INDEX ON items USING hnsw (embedding bit_jaccard_ops);
```

Supported types are:

* `vector` - up to 2,000 dimensions
* `halfvec` - up to 4,000 dimensions
* `bit` - up to 64,000 dimensions
* `sparsevec` - up to 1,000 non-zero elements

### Index Options

Specify HNSW parameters

* `m` - the max number of connections per layer (16 by default)
* `ef_construction` - the size of the dynamic candidate list for constructing the graph (64 by default)

```
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WITH (m = 16, ef_construction = 64);
```

A higher value of `ef_construction` provides better recall at the cost of index build time / insert speed.

### Query Options

Specify the size of the dynamic candidate list for search (40 by default)

```
SET hnsw.ef_search = 100;
```

A higher value provides better recall at the cost of speed.

Use `SET LOCAL` inside a transaction to set it for a single query

```
BEGIN;
SET LOCAL hnsw.ef_search = 100;
SELECT ...
COMMIT;
```

### Index Build Time

Indexes build significantly faster when the graph fits into `maintenance_work_mem`

```
SET maintenance_work_mem = '8GB';
```

A notice is shown when the graph no longer fits

```
NOTICE:  hnsw graph no longer fits into maintenance_work_mem after 100000 tuples
DETAIL:  Building will take significantly more time.
HINT:  Increase maintenance_work_mem to speed up builds.
```

Note: Do not set `maintenance_work_mem` so high that it exhausts the memory on the server

Like other index types, it’s faster to create an index after loading your initial data

You can also speed up index creation by increasing the number of parallel workers (2 by default)

```
SET max_parallel_maintenance_workers = 7; -- plus leader
```

For a large number of workers, you may need to increase `max_parallel_workers` (8 by default)

The [index options](#index-options) also have a significant impact on build time (use the defaults unless seeing low recall)

### Indexing Progress

Check [indexing progress](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)

```
SELECT phase, round(100.0 * blocks_done / nullif(blocks_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

The phases for HNSW are:

1. `initializing`
2. `loading tuples`

## IVFFlat

An IVFFlat index divides vectors into lists, and then searches a subset of those lists that are closest to the query vector. It has faster build times and uses less memory than HNSW, but has lower query performance (in terms of speed-recall tradeoff).

Three keys to achieving good recall are:

1. Create the index *after* the table has some data
2. Choose an appropriate number of lists - a good place to start is `rows / 1000` for up to 1M rows and `sqrt(rows)` for over 1M rows
3. When querying, specify an appropriate number of [probes](#query-options) (higher is better for recall, lower is better for speed) - a good place to start is `sqrt(lists)`

Add an index for each distance function you want to use.

L2 distance

```
CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
```

Note: Use `halfvec_l2_ops` for `halfvec` (and similar with the other distance functions)

Inner product

```
CREATE INDEX ON items USING ivfflat (embedding vector_ip_ops) WITH (lists = 100);
```

Cosine distance

```
CREATE INDEX ON items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Hamming distance

```
CREATE INDEX ON items USING ivfflat (embedding bit_hamming_ops) WITH (lists = 100);
```

Supported types are:

* `vector` - up to 2,000 dimensions
* `halfvec` - up to 4,000 dimensions
* `bit` - up to 64,000 dimensions

### Query Options

Specify the number of probes (1 by default)

```
SET ivfflat.probes = 10;
```
