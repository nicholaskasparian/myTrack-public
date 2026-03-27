# Source: https://github.com/pgvector/pgvector#hnsw
# Last fetched: 2026-03-27T18:25:31.568507+00:00

# hnsw — Part 4

* [PASE: PostgreSQL Ultra-High-Dimensional Approximate Nearest Neighbor Search Extension](https://dl.acm.org/doi/pdf/10.1145/3318464.3386131)
* [Faiss: A Library for Efficient Similarity Search and Clustering of Dense Vectors](https://github.com/facebookresearch/faiss)
* [Using the Triangle Inequality to Accelerate k-means](https://cdn.aaai.org/ICML/2003/ICML03-022.pdf)
* [k-means++: The Advantage of Careful Seeding](https://theory.stanford.edu/~sergei/papers/kMeansPP-soda.pdf)
* [Concept Decompositions for Large Sparse Text Data using Clustering](https://www.cs.utexas.edu/users/inderjit/public_papers/concept_mlj.pdf)
* [Efficient and Robust Approximate Nearest Neighbor Search using Hierarchical Navigable Small World Graphs](https://arxiv.org/ftp/arxiv/papers/1603/1603.09320.pdf)

## History

View the [changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

* [Report bugs](https://github.com/pgvector/pgvector/issues)
* Fix bugs and [submit pull requests](https://github.com/pgvector/pgvector/pulls)
* Write, clarify, or fix documentation
* Suggest or add new features

To get started with development:

```
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
make install
```

To run all tests:

```
make installcheck        # regression tests
make prove_installcheck  # TAP tests
```

To run single tests:

```
make installcheck REGRESS=functions                            # regression test
make prove_installcheck PROVE_TESTS=test/t/001_ivfflat_wal.pl  # TAP test
```

To enable assertions:

```
make clean && PG_CFLAGS="-DUSE_ASSERT_CHECKING" make && make install
```

To enable benchmarking:

```
make clean && PG_CFLAGS="-DIVFFLAT_BENCH" make && make install
```

To show memory usage:

```
make clean && PG_CFLAGS="-DHNSW_MEMORY -DIVFFLAT_MEMORY" make && make install
```

To get k-means metrics:

```
make clean && PG_CFLAGS="-DIVFFLAT_KMEANS_DEBUG" make && make install
```

Resources for contributors

* [Extension Building Infrastructure](https://www.postgresql.org/docs/current/extend-pgxs.html)
* [Index Access Method Interface Definition](https://www.postgresql.org/docs/current/indexam.html)
* [Generic WAL Records](https://www.postgresql.org/docs/current/generic-wal.html)

## About

Open-source vector similarity search for Postgres

### Topics

[nearest-neighbor-search](/topics/nearest-neighbor-search "Topic: nearest-neighbor-search")
[approximate-nearest-neighbor-search](/topics/approximate-nearest-neighbor-search "Topic: approximate-nearest-neighbor-search")

### Resources

[Readme](#readme-ov-file)

### License

[View license](#License-1-ov-file)

### Security policy

[Security policy](#security-ov-file)

### Uh oh!

There was an error while loading. Please reload this page.

[Activity](/pgvector/pgvector/activity)

[Custom properties](/pgvector/pgvector/custom-properties)

### Stars

[**20.5k**
stars](/pgvector/pgvector/stargazers)

### Watchers

[**131**
watching](/pgvector/pgvector/watchers)

### Forks

[**1.1k**
forks](/pgvector/pgvector/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fpgvector%2Fpgvector&report=pgvector+%28user%29)

## [Releases](/pgvector/pgvector/releases)

[38
tags](/pgvector/pgvector/tags)

## [Packages 0](/orgs/pgvector/packages?repo_name=pgvector)

### Uh oh!

There was an error while loading. Please reload this page.

### Uh oh!

There was an error while loading. Please reload this page.

## [Contributors 25](/pgvector/pgvector/graphs/contributors)

* [![@ankane](https://avatars.githubusercontent.com/u/220358?s=64&v=4)](https://github.com/ankane)
* [![@hlinnaka](https://avatars.githubusercontent.com/u/191602?s=64&v=4)](https://github.com/hlinnaka)
* [![@jkatz](https://avatars.githubusercontent.com/u/1694?s=64&v=4)](https://github.com/jkatz)
* [![@binarycleric](https://avatars.githubusercontent.com/u/197226?s=64&v=4)](https://github.com/binarycleric)
* [![@Ngalstyan4](https://avatars.githubusercontent.com/u/4647374?s=64&v=4)](https://github.com/Ngalstyan4)
* [![@fanfuxiaoran](https://avatars.githubusercontent.com/u/4902937?s=64&v=4)](https://github.com/fanfuxiaoran)
* [![@nathan-bossart](https://avatars.githubusercontent.com/u/25780657?s=64&v=4)](https://github.com/nathan-bossart)
* [![@nodomain](https://avatars.githubusercontent.com/u/104389?s=64&v=4)](https://github.com/nodomain)
* [![@mulander](https://avatars.githubusercontent.com/u/107247?s=64&v=4)](https://github.com/mulander)
* [![@jeff-davis](https://avatars.githubusercontent.com/u/214386?s=64&v=4)](https://github.com/jeff-davis)
* [![@SamuelMarks](https://avatars.githubusercontent.com/u/807580?s=64&v=4)](https://github.com/SamuelMarks)
* [![@tucnak](https://avatars.githubusercontent.com/u/934682?s=64&v=4)](https://github.com/tucnak)
* [![@wlaurance](https://avatars.githubusercontent.com/u/1059214?s=64&v=4)](https://github.com/wlaurance)
* [![@chenrui333](https://avatars.githubusercontent.com/u/1580956?s=64&v=4)](https://github.com/chenrui333)

[+ 11 contributors](/pgvector/pgvector/graphs/contributors)

## Languages

* [C
  77.1%](/pgvector/pgvector/search?l=c)
* [Perl
  22.0%](/pgvector/pgvector/search?l=perl)
* Other
  0.9%
