# Source: https://raw.githubusercontent.com/pgvector/pgvector/master/README.md
# Last fetched: 2026-03-27T18:25:31.568507+00:00

# readme — Part 3

SELECT ...
COMMIT;
```

Also, if the table is small, a table scan may be faster.

#### Why isn’t a query using a parallel table scan?

The planner doesn’t consider [out-of-line storage](https://www.postgresql.org/docs/current/storage-toast.html) in cost estimates, which can make a serial scan look cheaper. You can reduce the cost of a parallel scan for a query with:

```sql
BEGIN;
SET LOCAL min_parallel_table_scan_size = 1;
SET LOCAL parallel_setup_cost = 1;
SELECT ...
COMMIT;
```

or choose to store vectors inline:

```sql
ALTER TABLE items ALTER COLUMN embedding SET STORAGE PLAIN;
```

#### Why are there less results for a query after adding an HNSW index?

Results are limited by the size of the dynamic candidate list (`hnsw.ef_search`), which is 40 by default. There may be even less results due to dead tuples or filtering conditions in the query. Enabling [iterative index scans](#iterative-index-scans) can help address this.

Also, note that `NULL` vectors are not indexed (as well as zero vectors for cosine distance).

#### Why are there less results for a query after adding an IVFFlat index?

The index was likely created with too little data for the number of lists. Drop the index until the table has more data.

```sql
DROP INDEX index_name;
```

Results can also be limited by the number of probes (`ivfflat.probes`). Enabling [iterative index scans](#iterative-index-scans) can address this.

Also, note that `NULL` vectors are not indexed (as well as zero vectors for cosine distance).

## Reference

- [Vector](#vector-type)
- [Halfvec](#halfvec-type)
- [Bit](#bit-type)
- [Sparsevec](#sparsevec-type)

### Vector Type

Each vector takes `4 * dimensions + 8` bytes of storage. Each element is a single-precision floating-point number (like the `real` type in Postgres), and all elements must be finite (no `NaN`, `Infinity` or `-Infinity`). Vectors can have up to 16,000 dimensions.

### Vector Operators

Operator | Description | Added
--- | --- | ---
\+ | element-wise addition |
\- | element-wise subtraction |
\* | element-wise multiplication | 0.5.0
\|\| | concatenate | 0.7.0
<-> | Euclidean distance |
<#> | negative inner product |
<=> | cosine distance |
<+> | taxicab distance | 0.7.0

### Vector Functions

Function | Description | Added
--- | --- | ---
binary_quantize(vector) → bit | binary quantize | 0.7.0
cosine_distance(vector, vector) → double precision | cosine distance |
inner_product(vector, vector) → double precision | inner product |
l1_distance(vector, vector) → double precision | taxicab distance | 0.5.0
l2_distance(vector, vector) → double precision | Euclidean distance |
l2_normalize(vector) → vector | Normalize with Euclidean norm | 0.7.0
subvector(vector, integer, integer) → vector | subvector | 0.7.0
vector_dims(vector) → integer | number of dimensions |
vector_norm(vector) → double precision | Euclidean norm |

### Vector Aggregate Functions

Function | Description | Added
--- | --- | ---
avg(vector) → vector | average |
sum(vector) → vector | sum | 0.5.0

### Halfvec Type

Each half vector takes `2 * dimensions + 8` bytes of storage. Each element is a half-precision floating-point number, and all elements must be finite (no `NaN`, `Infinity` or `-Infinity`). Half vectors can have up to 16,000 dimensions.

### Halfvec Operators

Operator | Description | Added
--- | --- | ---
\+ | element-wise addition | 0.7.0
\- | element-wise subtraction | 0.7.0
\* | element-wise multiplication | 0.7.0
\|\| | concatenate | 0.7.0
<-> | Euclidean distance | 0.7.0
<#> | negative inner product | 0.7.0
<=> | cosine distance | 0.7.0
<+> | taxicab distance | 0.7.0

### Halfvec Functions

Function | Description | Added
--- | --- | ---
binary_quantize(halfvec) → bit | binary quantize | 0.7.0
cosine_distance(halfvec, halfvec) → double precision | cosine distance | 0.7.0
inner_product(halfvec, halfvec) → double precision | inner product | 0.7.0
l1_distance(halfvec, halfvec) → double precision | taxicab distance | 0.7.0
l2_distance(halfvec, halfvec) → double precision | Euclidean distance | 0.7.0
l2_norm(halfvec) → double precision | Euclidean norm | 0.7.0
l2_normalize(halfvec) → halfvec | Normalize with Euclidean norm | 0.7.0
subvector(halfvec, integer, integer) → halfvec | subvector | 0.7.0
vector_dims(halfvec) → integer | number of dimensions | 0.7.0

### Halfvec Aggregate Functions

Function | Description | Added
--- | --- | ---
avg(halfvec) → halfvec | average | 0.7.0
sum(halfvec) → halfvec | sum | 0.7.0

### Bit Type

Each bit vector takes `dimensions / 8 + 8` bytes of storage. See the [Postgres docs](https://www.postgresql.org/docs/current/datatype-bit.html) for more info.

### Bit Operators

Operator | Description | Added
--- | --- | ---
<~> | Hamming distance | 0.7.0
<%> | Jaccard distance | 0.7.0

### Bit Functions

Function | Description | Added
--- | --- | ---
hamming_distance(bit, bit) → double precision | Hamming distance | 0.7.0
jaccard_distance(bit, bit) → double precision | Jaccard distance | 0.7.0

### Sparsevec Type

Each sparse vector takes `8 * non-zero elements + 16` bytes of storage. Each element is a single-precision floating-point number, and all elements must be finite (no `NaN`, `Infinity` or `-Infinity`). Sparse vectors can have up to 16,000 non-zero elements.

### Sparsevec Operators

Operator | Description | Added
--- | --- | ---
<-> | Euclidean distance | 0.7.0
<#> | negative inner product | 0.7.0
<=> | cosine distance | 0.7.0
<+> | taxicab distance | 0.7.0

### Sparsevec Functions

Function | Description | Added
--- | --- | ---
cosine_distance(sparsevec, sparsevec) → double precision | cosine distance | 0.7.0
inner_product(sparsevec, sparsevec) → double precision | inner product | 0.7.0
l1_distance(sparsevec, sparsevec) → double precision | taxicab distance | 0.7.0
l2_distance(sparsevec, sparsevec) → double precision | Euclidean distance | 0.7.0
l2_norm(sparsevec) → double precision | Euclidean norm | 0.7.0
l2_normalize(sparsevec) → sparsevec | Normalize with Euclidean norm | 0.7.0

## Installation Notes - Linux and Mac

### Postgres Location

If your machine has multiple Postgres installations, specify the path to [pg_config](https://www.postgresql.org/docs/current/app-pgconfig.html) with:

```sh
export PG_CONFIG=/Library/PostgreSQL/18/bin/pg_config
```

Then re-run the installation instructions (run `make clean` before `make` if needed). If `sudo` is needed for `make install`, use:

```sh
sudo --preserve-env=PG_CONFIG make install
```

A few common paths on Mac are:

- EDB installer - `/Library/PostgreSQL/18/bin/pg_config`
- Homebrew (arm64) - `/opt/homebrew/opt/postgresql@18/bin/pg_config`
- Homebrew (x86-64) - `/usr/local/opt/postgresql@18/bin/pg_config`

Note: Replace `18` with your Postgres server version

### Missing Header

If compilation fails with `fatal error: postgres.h: No such file or directory`, make sure Postgres development files are installed on the server.

For Ubuntu and Debian, use:

```sh
sudo apt install postgresql-server-dev-18
```

Note: Replace `18` with your Postgres server version

### Missing SDK

If compilation fails and the output includes `warning: no such sysroot directory` on Mac, your Postgres installation points to a path that no longer exists.

```sh
pg_config --cppflags
```

Reinstall Postgres to fix this.

### Portability

By default, pgvector compiles with `-march=native` on some platforms for best performance. However, this can lead to `Illegal instruction` errors if trying to run the compiled extension on a different machine.

To compile for portability, use:

```sh
make OPTFLAGS=""
```

## Installation Notes - Windows

### Missing Header

If compilation fails with `Cannot open include file: 'postgres.h': No such file or directory`, make sure `PGROOT` is correct.

### Mismatched Architecture

If compilation fails with `error C2196: case value '4' already used`, make sure you’re using the `x64 Native Tools Command Prompt`. Then run `nmake /F Makefile.win clean` and re-run the installation instructions.

### Missing Symbol

If linking fails with `unresolved external symbol float_to_shortest_decimal_bufn` with Postgres 17.0-17.2, upgrade to Postgres 17.3+.

### Permissions

If installation fails with `Access is denied`, re-run the installation instructions as an administrator.

## Additional Installation Methods

### Docker

Get the [Docker image](https://hub.docker.com/r/pgvector/pgvector) with:

```sh
docker pull pgvector/pgvector:pg18-trixie
```

This adds pgvector to the [Postgres image](https://hub.docker.com/_/postgres) (replace `18` with your Postgres server version, and run it the same way).

Supported tags are:

- `pg18-trixie`, `0.8.2-pg18-trixie`
- `pg18-bookworm`, `0.8.2-pg18-bookworm`, `pg18`, `0.8.2-pg18`
- `pg17-trixie`, `0.8.2-pg17-trixie`
- `pg17-bookworm`, `0.8.2-pg17-bookworm`, `pg17`, `0.8.2-pg17`
- `pg16-trixie`, `0.8.2-pg16-trixie`
- `pg16-bookworm`, `0.8.2-pg16-bookworm`, `pg16`, `0.8.2-pg16`
- `pg15-trixie`, `0.8.2-pg15-trixie`
- `pg15-bookworm`, `0.8.2-pg15-bookworm`, `pg15`, `0.8.2-pg15`
- `pg14-trixie`, `0.8.2-pg14-trixie`
- `pg14-bookworm`, `0.8.2-pg14-bookworm`, `pg14`, `0.8.2-pg14`
- `pg13-trixie`, `0.8.2-pg13-trixie`
- `pg13-bookworm`, `0.8.2-pg13-bookworm`, `pg13`, `0.8.2-pg13`

You can also build the image manually:

```sh
git clone --branch v0.8.2 https://github.com/pgvector/pgvector.git
cd pgvector
docker build --pull --build-arg PG_MAJOR=18 -t myuser/pgvector .
```

If you increase `maintenance_work_mem`, make sure `--shm-size` is at least that size to avoid an error with parallel HNSW index builds.

```sh
docker run --shm-size=1g ...
```

### Homebrew

With Homebrew Postgres, you can use:

```sh
brew install pgvector
```

Note: This only adds it to the `postgresql@18` and `postgresql@17` formulas

### PGXN

Install from the [PostgreSQL Extension Network](https://pgxn.org/dist/vector) with:

```sh
pgxn install vector
```

### APT

Debian and Ubuntu packages are available from the [PostgreSQL APT Repository](https://wiki.postgresql.org/wiki/Apt). Follow the [setup instructions](https://wiki.postgresql.org/wiki/Apt#Quickstart) and run:

```sh
sudo apt install postgresql-18-pgvector
```

Note: Replace `18` with your Postgres server version

### Yum

RPM packages are available from the [PostgreSQL Yum Repository](https://yum.postgresql.org/). Follow the [setup instructions](https://www.postgresql.org/download/linux/redhat/) for your distribution and run:

```sh
sudo yum install pgvector_18
# or
sudo dnf install pgvector_18
```

Note: Replace `18` with your Postgres server version

### pkg

Install the FreeBSD package with:

```sh
pkg install postgresql17-pgvector
```

or the port with:

```sh
cd /usr/ports/databases/pgvector
make install
```

### APK

Install the Alpine package with:

```sh
apk add postgresql-pgvector
```

### conda-forge

With Conda Postgres, install from [conda-forge](https://anaconda.org/conda-forge/pgvector) with:

```sh
conda install -c conda-forge pgvector
```

This method is [community-maintained](https://github.com/conda-forge/pgvector-feedstock) by [@mmcauliffe](https://github.com/mmcauliffe)

### Postgres.app

Download the [latest release](https://postgresapp.com/downloads.html) with Postgres 15+.

## Hosted Postgres

pgvector is available on [these providers](https://github.com/pgvector/pgvector/issues/54).

## Upgrading

[Install](#installation) the latest version (use the same method as the original installation). Then in each database you want to upgrade, run:

```sql
ALTER EXTENSION vector UPDATE;
```

You can check the version in the current database with:

```sql
SELECT extversion FROM pg_extension WHERE extname = 'vector';
```

## Thanks

Thanks to:

- [PASE: PostgreSQL Ultra-High-Dimensional Approximate Nearest Neighbor Search Extension](https://dl.acm.org/doi/pdf/10.1145/3318464.3386131)
- [Faiss: A Library for Efficient Similarity Search and Clustering of Dense Vectors](https://github.com/facebookresearch/faiss)
- [Using the Triangle Inequality to Accelerate k-means](https://cdn.aaai.org/ICML/2003/ICML03-022.pdf)
- [k-means++: The Advantage of Careful Seeding](https://theory.stanford.edu/~sergei/papers/kMeansPP-soda.pdf)
- [Concept Decompositions for Large Sparse Text Data using Clustering](https://www.cs.utexas.edu/users/inderjit/public_papers/concept_mlj.pdf)
- [Efficient and Robust Approximate Nearest Neighbor Search using Hierarchical Navigable Small World Graphs](https://arxiv.org/ftp/arxiv/papers/1603/1603.09320.pdf)

## History

View the [changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/pgvector/pgvector/issues)
- Fix bugs and [submit pull requests](https://github.com/pgvector/pgvector/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
make install
```

To run all tests:

```sh
make installcheck        # regression tests
make prove_installcheck  # TAP tests
```

To run single tests:

```sh
make installcheck REGRESS=functions                            # regression test
make prove_installcheck PROVE_TESTS=test/t/001_ivfflat_wal.pl  # TAP test
```

To enable assertions:

```sh
make clean && PG_CFLAGS="-DUSE_ASSERT_CHECKING" make && make install
```

To enable benchmarking:

```sh
make clean && PG_CFLAGS="-DIVFFLAT_BENCH" make && make install
```

To show memory usage:

```sh
make clean && PG_CFLAGS="-DHNSW_MEMORY -DIVFFLAT_MEMORY" make && make install
```

To get k-means metrics:

```sh
make clean && PG_CFLAGS="-DIVFFLAT_KMEANS_DEBUG" make && make install
```

Resources for contributors

