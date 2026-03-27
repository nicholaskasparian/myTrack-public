# Source: https://supabase.com/docs/reference/javascript/upsert
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upsert — Part 6

.order('id', { ascending: false })
```

Data source

Response

---

## Limit the number of rows returned

`limit(count, options)`

Limit the query result by `count`.

### Parameters

* countnumber

  The maximum number of rows to return
* optionsobject

  Named parameters

  Details

### Return Type

this

With `select()`On a referenced table

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select('name')

4

.limit(1)
```

Data source

Response

---

## Limit the query to a range

`range(from, to, options)`

Limit the query result by starting at an offset `from` and ending at the offset `to`. Only records within this range are returned. This respects the query order and if there is no order clause the range could behave unexpectedly. The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third and fourth rows of the query.

### Parameters

* fromnumber

  The starting index from which to limit the result
* tonumber

  The last index to which to limit the result
* optionsobject

  Named parameters

  Details

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

.range(0, 1)
```

Data source

Response

---

## Set an abort signal

`abortSignal(signal)`

Set the AbortSignal for the fetch request.

You can use this to set a timeout for the request.

### Parameters

* signalAbortSignal

  The AbortSignal to use for the fetch request

### Return Type

this

Aborting requests in-flightSet a timeout

```
1

const ac = new AbortController()

2

3

const { data, error } = await supabase

4

.from('very_big_table')

5

.select()

6

.abortSignal(ac.signal)

7

8

// Abort the request after 100 ms

9

setTimeout(() => ac.abort(), 100)
```

Response

Notes

---

## Retrieve one row of data

`single()`

Return `data` as a single object instead of an array of objects.

Query result must be one row (e.g. using `.limit(1)`), otherwise this returns an error.

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select('name')

4

.limit(1)

5

.single()
```

Data source

Response

---

## Retrieve zero or one row of data

`maybeSingle()`

Return `data` as a single object instead of an array of objects.

Query result must be zero or one row (e.g. using `.limit(1)`), otherwise this returns an error.

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.eq('name', 'Katniss')

5

.maybeSingle()
```

Data source

Response

---

## Retrieve as a CSV

`csv()`

Return `data` as a string in CSV format.

Return data as CSV

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.csv()
```

Data source

Response

Notes

---

## Override type of successful response

`returns()`

Override the type of the returned `data`.

* Deprecated: use overrideTypes method instead

Override type of successful responseOverride type of object response

```
1

const { data } = await supabase

2

.from('countries')

3

.select()

4

.returns<Array<MyType>>()
```

Response

---

## Partially override or replace type of successful response

`overrideTypes()`

Override the type of the returned `data` field in the response.

Example 1Complete Override type of successful responseComplete Override type of object responsePartial Override type of successful responsePartial Override type of object responseExample 5

```
1

// Merge with existing types (default behavior)

2

const query = supabase

3

.from('users')

4

.select()

5

.overrideTypes<{ custom_field: string }>()

6

7

// Replace existing types completely

8

const replaceQuery = supabase

9

.from('users')

10

.select()

11

.overrideTypes<{ id: number; name: string }, { merge: false }>()
```

---

## Using explain

`explain(options)`

Return `data` as the EXPLAIN plan for the query.

You need to enable the [db\_plan\_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain) setting before using this method.

### Parameters

* optionsobject

  Named parameters

  Details

### Return Type

One of the following options

Details

* Option 1PostgrestBuilder
* Option 2PostgrestBuilder

Get the execution planGet the execution plan with analyze and verbose

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.explain()
```

Data source

Response

Notes

---

## Overview

* The auth methods can be accessed via the `supabase.auth` namespace.
* By default, the supabase client sets `persistSession` to true and attempts to store the session in local storage. When using the supabase client in an environment that doesn't support local storage, you might notice the following warning message being logged:

  > No storage option exists to persist the session, which may result in unexpected behavior when using auth. If you want to set `persistSession` to true, please provide a storage option or you may set `persistSession` to false to disable this warning.

  This warning message can be safely ignored if you're not using auth on the server-side. If you are using auth and you want to set `persistSession` to true, you will need to provide a custom storage implementation that follows [this interface](https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/src/lib/types.ts#L1053).
* Any email links and one-time passwords (OTPs) sent have a default expiry of 24 hours. We have the following [rate limits](/docs/guides/platform/going-into-prod#auth-rate-limits) in place to guard against brute force attacks.
* The expiry of an access token can be set in the "JWT expiry limit" field in [your project's auth settings](/dashboard/project/_/auth/providers). A refresh token never expires and can only be used once.

Create auth clientCreate auth client (server-side)

```
1

import { createClient } from '@supabase/supabase-js'

2

3

const supabase = createClient(supabase_url, anon_key)
```

---

## Create a new user

`signUp(credentials)`

Creates a new user.

Be aware that if a user account exists in the system you may get back an error message that attempts to hide this information from the user. This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.

