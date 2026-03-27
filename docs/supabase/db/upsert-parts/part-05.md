# Source: https://supabase.com/docs/reference/javascript/upsert
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upsert — Part 5


.from('issues')

3

.select('title')

4

.overlaps('tags', ['is:closed', 'severity:high'])
```

Data source

Response

---

## Match a string

`textSearch(column, query, options?)`

Only relevant for text and tsvector columns. Match only rows where `column` matches the query string in `query`.

* For more information, see [Postgres full text search](/docs/guides/database/full-text-search).

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* querystring
* options

  Optional

  object

  Details

### Return Type

this

Text searchBasic normalizationFull normalizationWebsearch

```
1

const result = await supabase

2

.from("texts")

3

.select("content")

4

.textSearch("content", `'eggs' & 'ham'`, {

5

config: "english",

6

});
```

Data source

Response

---

## Match an associated value

`match(query)`

Match only rows where each column in `query` keys is equal to its associated value. Shorthand for multiple `.eq()`s.

### Parameters

* queryOne of the following options

  Details

  + Option 1Record<ColumnName, Row['ColumnName']>
  + Option 2Record<string, unknown>

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select('name')

4

.match({ id: 2, name: 'Leia' })
```

Data source

Response

---

## Don't match the filter

`not(column, operator, value)`

Match only rows which doesn't satisfy the filter.

Unlike most filters, `opearator` and `value` are used as-is and need to follow [PostgREST syntax](https://postgrest.org/en/stable/api.html#operators). You also need to make sure they are properly sanitized.

not() expects you to use the raw PostgREST syntax for the filter values.

```
1

.not('id', 'in', '(5,6,7)')  // Use `()` for `in` filter

2

.not('arraycol', 'cs', '{"a","b"}')  // Use `cs` for `contains()`, `{}` for array values
```

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* operatorOne of the following options

  Details

  + Option 1FilterOperator
  + Option 2string
* valueOne of the following options

  Details

  + Option 1Row['ColumnName']
  + Option 2unknown

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('countries')

3

.select()

4

.not('name', 'is', null)
```

Data source

Response

---

## Match at least one filter

`or(filters, options)`

Match only rows which satisfy at least one of the filters.

Unlike most filters, `filters` is used as-is and needs to follow [PostgREST syntax](https://postgrest.org/en/stable/api.html#operators). You also need to make sure it's properly sanitized.

It's currently not possible to do an `.or()` filter across multiple tables.

or() expects you to use the raw PostgREST syntax for the filter names and values.

```
1

.or('id.in.(5,6,7), arraycol.cs.{"a","b"}')  // Use `()` for `in` filter, `{}` for array values and `cs` for `contains()`.

2

.or('id.in.(5,6,7), arraycol.cd.{"a","b"}')  // Use `cd` for `containedBy()`
```

### Parameters

* filtersstring

  The filters to use, following PostgREST syntax
* optionsobject

  Named parameters

  Details

### Return Type

this

With `select()`Use `or` with `and`Use `or` on referenced tables

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select('name')

4

.or('id.eq.2,name.eq.Han')
```

Data source

Response

---

## Match the filter

`filter(column, operator, value)`

Match only rows which satisfy the filter. This is an escape hatch - you should use the specific filter methods wherever possible.

Unlike most filters, `opearator` and `value` are used as-is and need to follow [PostgREST syntax](https://postgrest.org/en/stable/api.html#operators). You also need to make sure they are properly sanitized.

filter() expects you to use the raw PostgREST syntax for the filter values.

```
1

.filter('id', 'in', '(5,6,7)')  // Use `()` for `in` filter

2

.filter('arraycol', 'cs', '{"a","b"}')  // Use `cs` for `contains()`, `{}` for array values
```

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* operatorOne of the following options

  Details

  + Option 1FilterOperator
  + Option 2"not.match"
  + Option 3"not.eq"
  + Option 4"not.neq"
  + Option 5"not.gt"
  + Option 6"not.gte"
  + Option 7"not.lt"
  + Option 8"not.lte"
  + Option 9"not.like"
  + Option 10"not.ilike"
  + Option 11"not.is"
  + Option 12"not.isdistinct"
  + Option 13"not.in"
  + Option 14"not.cs"
  + Option 15"not.cd"
  + Option 16"not.sl"
  + Option 17"not.sr"
  + Option 18"not.nxl"
  + Option 19"not.nxr"
  + Option 20"not.adj"
  + Option 21"not.ov"
  + Option 22"not.fts"
  + Option 23"not.plfts"
  + Option 24"not.phfts"
  + Option 25"not.wfts"
  + Option 26"not.imatch"
  + Option 27string
* valueunknown

### Return Type

this

With `select()`On a referenced table

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.filter('name', 'in', '("Han","Yoda")')
```

Data source

Response

---

## Using modifiers

Filters work on the row level—they allow you to return rows that only match certain conditions without changing the shape of the rows. Modifiers are everything that don't fit that definition—allowing you to change the format of the response (e.g., returning a CSV string).

Modifiers must be specified after filters. Some modifiers only apply for queries that return rows (e.g., `select()` or `rpc()` on a function that returns a table response).

---

## Return data after inserting

`select(columns?)`

Perform a SELECT on the query result.

By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not return modified rows. By calling this method, modified rows are returned in `data`.

### Parameters

* columns

  Optional

  Query

  The columns to retrieve, separated by commas

With `upsert()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.upsert({ id: 1, name: 'Han Solo' })

4

.select()
```

Data source

Response

---

## Order the results

`order(column, options?)`

Order the query result by `column`.

You can call this method multiple times to order by multiple columns.

You can order referenced tables, but it only affects the ordering of the parent table if you use `!inner` in the query.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* options

  Optional

  object

  Details

### Return Type

this

With `select()`On a referenced tableOrder parent table by a referenced table

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select('id, name')

4

