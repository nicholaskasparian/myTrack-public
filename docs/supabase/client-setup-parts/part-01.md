# Source: https://supabase.com/docs/reference/javascript/installing
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# client-setup — Part 1


Javascript Reference v2.0

# JavaScript Client Library

@supabase/supabase-js[View on GitHub](https://github.com/supabase/supabase-js)

This reference documents every object and method available in Supabase's isomorphic JavaScript library, `supabase-js`. You can use `supabase-js` to interact with your Postgres database, listen to database changes, invoke Deno Edge Functions, build login and user management functionality, and manage large files.

To convert SQL queries to `supabase-js` calls, use the [SQL to REST API translator](/docs/guides/api/sql-to-rest).

---

## Installing

### Install as package[#](#install-as-package)

You can install @supabase/supabase-js via the terminal.

npmYarnpnpm

```
1

npm install @supabase/supabase-js
```

### Install via CDN[#](#install-via-cdn)

You can install @supabase/supabase-js via CDN links.

```
1

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

2

//or

3

<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
```

### Use at runtime in Deno[#](#use-at-runtime-in-deno)

You can use supabase-js in the Deno runtime via [JSR](https://jsr.io/@supabase/supabase-js):

```
1

import { createClient } from 'npm:@supabase/supabase-js@2'
```

---

## Initializing

Create a new client for use in the browser.

### Parameters

* supabaseUrlstring

  The unique Supabase URL which is supplied when you create a new project in your project dashboard.
* supabaseKeystring

  The unique Supabase Key which is supplied when you create a new project in your project dashboard.
* options

  Optional

  SupabaseClientOptions

  Details

Creating a clientWith a custom domainWith additional parametersWith custom schemasCustom fetch implementationReact Native options with AsyncStorageReact Native options with Expo SecureStoreWith a database query

```
1

import { createClient } from '@supabase/supabase-js'

2

3

// Create a single supabase client for interacting with your database

4

const supabase = createClient('https://xyzcompany.supabase.co', 'publishable-or-anon-key')
```

---

## TypeScript support

`supabase-js` has TypeScript support for type inference, autocompletion, type-safe queries, and more.

With TypeScript, `supabase-js` detects things like `not null` constraints and [generated columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html). Nullable columns are typed as `T | null` when you select the column. Generated columns will show a type error when you insert to it.

`supabase-js` also detects relationships between tables. A referenced table with one-to-many relationship is typed as `T[]`. Likewise, a referenced table with many-to-one relationship is typed as `T | null`.

## Generating TypeScript Types[#](#generating-typescript-types)

You can use the Supabase CLI to [generate the types](/docs/reference/cli/supabase-gen-types). You can also generate the types [from the dashboard](https://supabase.com/dashboard/project/_/api?page=tables-intro).

```
1

supabase gen types typescript --project-id abcdefghijklmnopqrst > database.types.ts
```

These types are generated from your database schema. Given a table `public.movies`, the generated types will look like:

```
1

create table public.movies (

2

id bigint generated always as identity primary key,

3

name text not null,

4

data jsonb null

5

);
```

```
1

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

2

3

export interface Database {

4

public: {

5

Tables: {

6

movies: {

7

Row: {               // the data expected from .select()

8

id: number

9

name: string

10

data: Json | null

11

}

12

Insert: {            // the data to be passed to .insert()

13

id?: never         // generated columns must not be supplied

14

name: string       // `not null` columns with no default must be supplied

15

data?: Json | null // nullable columns can be omitted

16

}

17

Update: {            // the data to be passed to .update()

18

id?: never

19

name?: string      // `not null` columns are optional on .update()

20

data?: Json | null

21

}

22

}

23

}

24

}

25

}
```

## Using TypeScript type definitions[#](#using-typescript-type-definitions)

You can supply the type definitions to `supabase-js` like so:

```
1

import { createClient } from '@supabase/supabase-js'

2

import { Database } from './database.types'

3

4

const supabase = createClient<Database>(

5

process.env.SUPABASE_URL,

6

process.env.SUPABASE_ANON_KEY

7

)
```

## Helper types for Tables and Joins[#](#helper-types-for-tables-and-joins)

You can use the following helper types to make the generated TypeScript types easier to use.

Sometimes the generated types are not what you expect. For example, a view's column may show up as nullable when you expect it to be `not null`. Using [type-fest](https://github.com/sindresorhus/type-fest), you can override the types like so:

```
1

export type Json = // ...

2

3

export interface Database {

4

// ...

5

}
```

```
1

import { MergeDeep } from 'type-fest'

2

import { Database as DatabaseGenerated } from './database-generated.types'

3

export { Json } from './database-generated.types'

4

5

// Override the type for a specific column in a view:

6

export type Database = MergeDeep<

7

DatabaseGenerated,

8

{

9

public: {

10

Views: {

11

movies_view: {

12

Row: {

13

// id is a primary key in public.movies, so it must be `not null`

14

id: number

15

}

16

}

17

}

18

}

19

}

20

>
```

You can also override the type of an individual successful response if needed:

```
1

// Partial type override allows you to only override some of the properties in your results

2

const { data } = await supabase.from('countries').select().overrideTypes<Array<{ id: string }>>()

3

// For a full replacement of the original return type use the `{ merge: false }` property as second argument

4

const { data } = await supabase

5

.from('countries')

6

.select()

7

.overrideTypes<Array<{ id: string }>, { merge: false }>()

8

// Use it with `maybeSingle` or `single`

9

const { data } = await supabase.from('countries').select().single().overrideTypes<{ id: string }>()
```

The generated types provide shorthands for accessing tables and enums.

```
1

import { Database, Tables, Enums } from "./database.types.ts";

2

3

// Before 😕

4

let movie: Database['public']['Tables']['movies']['Row'] = // ...

5

6

// After 😍

7

let movie: Tables<'movies'>
```

### Response types for complex queries[#](#response-types-for-complex-queries)

`supabase-js` always returns a `data` object (for success), and an `error` object (for unsuccessful requests).

These helper types provide the result types from any query, including nested types for database joins.
