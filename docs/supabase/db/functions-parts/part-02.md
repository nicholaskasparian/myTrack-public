# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 2


Given the following schema with a relation between cities and countries, we can get the nested `CountriesWithCities` type:

```
1

create table countries (

2

"id" serial primary key,

3

"name" text

4

);

5

6

create table cities (

7

"id" serial primary key,

8

"name" text,

9

"country_id" int references "countries"

10

);
```

```
1

import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

2

3

const countriesWithCitiesQuery = supabase

4

.from("countries")

5

.select(`

6

id,

7

name,

8

cities (

9

id,

10

name

11

)

12

`);

13

type CountriesWithCities = QueryData<typeof countriesWithCitiesQuery>;

14

15

const { data, error } = await countriesWithCitiesQuery;

16

if (error) throw error;

17

const countriesWithCities: CountriesWithCities = data;
```

---

## Fetch data

`select(columns?, options?)`

Perform a SELECT query on the table or view.

When using `count` with `.range()` or `.limit()`, the returned `count` is the total number of rows that match your filters, not the number of rows in the current page. Use this to build pagination UI.

* By default, Supabase projects return a maximum of 1,000 rows. This setting can be changed in your project's [API settings](/dashboard/project/_/settings/api). It's recommended that you keep it low to limit the payload size of accidental or malicious requests. You can use `range()` queries to paginate through your data.
* `select()` can be combined with [Filters](/docs/reference/javascript/using-filters)
* `select()` can be combined with [Modifiers](/docs/reference/javascript/using-modifiers)
* `apikey` is a reserved keyword if you're using the [Supabase Platform](/docs/guides/platform) and [should be avoided as a column name](https://github.com/supabase/supabase/issues/5465). \*

### Parameters

* columns

  Optional

  Query

  The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
* options

  Optional

  object

  Named parameters

  Details

Getting your dataSelecting specific columnsQuery referenced tablesQuery referenced tables with spaces in their namesQuery referenced tables through a join tableQuery the same referenced table multiple timesFiltering through referenced tablesQuerying referenced table with countQuerying with count optionQuerying JSON dataQuerying referenced table with inner joinSwitching schemas per query

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()
```

Data source

Response

---

## Insert data

`insert(values, options?)`

Perform an INSERT into the table or view.

By default, inserted rows are not returned. To return it, chain the call with `.select()`.

### Parameters

* valuesOne of the following options

  Details

  + Option 1Row
  + Option 2Array<Row>
* options

  Optional

  object

  Details

Create a recordCreate a record and return itBulk create

```
1

const { error } = await supabase

2

.from('countries')

3

.insert({ id: 1, name: 'Mordor' })
```

Data source

Response

---

## Update data

`update(values, options)`

Perform an UPDATE on the table or view.

By default, updated rows are not returned. To return it, chain the call with `.select()` after filters.

* `update()` should always be combined with [Filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to update.

### Parameters

* valuesRow

  The values to update with
* optionsobject

  Named parameters

  Details

Updating your dataUpdate a record and return itUpdating JSON data

```
1

const { error } = await supabase

2

.from('instruments')

3

.update({ name: 'piano' })

4

.eq('id', 1)
```

Data source

Response

---

## Upsert data

`upsert(values, options?)`

Perform an UPSERT on the table or view. Depending on the column(s) passed to `onConflict`, `.upsert()` allows you to perform the equivalent of `.insert()` if a row with the corresponding `onConflict` columns doesn't exist, or if it does exist, perform an alternative action depending on `ignoreDuplicates`.

By default, upserted rows are not returned. To return it, chain the call with `.select()`.

* Primary keys must be included in `values` to use upsert.

### Parameters

* valuesOne of the following options

  Details

  + Option 1Row
  + Option 2Array<Row>
* options

  Optional

  object

  Details

Upsert a single row using a unique keyUpsert with conflict resolution and exact row countingUpsert your dataBulk Upsert your dataUpserting into tables with constraints

```
1

// Upserting a single row, overwriting based on the 'username' unique column

2

const { data, error } = await supabase

3

.from('users')

4

.upsert({ username: 'supabot' }, { onConflict: 'username' })

5

6

// Example response:

7

// {

8

//   data: [

9

//     { id: 4, message: 'bar', username: 'supabot' }

10

//   ],

11

//   error: null

12

// }
```

---

## Delete data

`delete(options)`

Perform a DELETE on the table or view.

By default, deleted rows are not returned. To return it, chain the call with `.select()` after filters.

* `delete()` should always be combined with [filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to delete.
* If you use `delete()` with filters and you have [RLS](/docs/learn/auth-deep-dive/auth-row-level-security) enabled, only rows visible through `SELECT` policies are deleted. Note that by default no rows are visible, so you need at least one `SELECT`/`ALL` policy that makes the rows visible.
* When using `delete().in()`, specify an array of values to target multiple rows with a single query. This is particularly useful for batch deleting entries that share common criteria, such as deleting users by their IDs. Ensure that the array you provide accurately represents all records you intend to delete to avoid unintended data removal.

### Parameters

* optionsobject

  Named parameters

  Details

Delete a single recordDelete a record and return itDelete multiple records

```
1

const response = await supabase

2

.from('countries')

3

.delete()

4

.eq('id', 1)
```

Data source

Response

---

## Call a Postgres function

`rpc(fn, args, options)`

Perform a function call.

### Parameters

* fnFnName

  The function name to call
* argsArgs

  The arguments to pass to the function call
* optionsobject

  Named parameters

  Details

Example 1Call a Postgres function without argumentsCall a Postgres function with argumentsBulk processingCall a Postgres function with filtersCall a read-only Postgres function

```
1

// For cross-schema functions where type inference fails, use overrideTypes:

2

const { data } = await supabase

3

.schema('schema_b')

4

.rpc('function_a', {})

5

.overrideTypes<{ id: string; user_id: string }[]>()
```

---

## Using filters

Filters allow you to only return rows that match certain conditions.

Filters can be used on `select()`, `update()`, `upsert()`, and `delete()` queries.

If a Postgres function returns a table response, you can also apply filters.

Applying FiltersChainingConditional ChainingFilter by values within a JSON columnFilter referenced tables

```
1

const { data, error } = await supabase

2

.from('instruments')

3

.select('name, section_id')
