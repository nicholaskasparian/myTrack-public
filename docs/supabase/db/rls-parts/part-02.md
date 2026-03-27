# Source: https://supabase.com/docs/guides/auth/row-level-security
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# rls — Part 2


create policy "Users can create a profile."

13

on profiles for insert

14

to authenticated                          -- the Postgres Role (recommended)

15

with check ( (select auth.uid()) = user_id );      -- the actual Policy
```

### UPDATE policies[#](#update-policies)

You can specify update policies by combining both the `using` and `with check` expressions.

The `using` clause represents the condition that must be true for the update to be allowed, and `with check` clause ensures that the updates made adhere to the policy constraints.

Let's say you have a table called `profiles` in the public schema and you only want users to be able to update their own profile.

You can create a policy where the `using` clause checks if the user owns the profile being updated. And the `with check` clause ensures that, in the resultant row, users do not change the `user_id` to a value that is not equal to their User ID, maintaining that the modified profile still meets the ownership condition.

```
1

-- 1. Create table

2

create table profiles (

3

id uuid primary key,

4

user_id uuid references auth.users,

5

avatar_url text

6

);

7

8

-- 2. Enable RLS

9

alter table profiles enable row level security;

10

11

-- 3. Create Policy

12

create policy "Users can update their own profile."

13

on profiles for update

14

to authenticated                    -- the Postgres Role (recommended)

15

using ( (select auth.uid()) = user_id )       -- checks if the existing row complies with the policy expression

16

with check ( (select auth.uid()) = user_id ); -- checks if the new row complies with the policy expression
```

If no `with check` expression is defined, then the `using` expression will be used both to determine which rows are visible (normal USING case) and which new rows will be allowed to be added (WITH CHECK case).

To perform an `UPDATE` operation, a corresponding [`SELECT` policy](#select-policies) is required. Without a `SELECT` policy, the `UPDATE` operation will not work as expected.

### DELETE policies[#](#delete-policies)

You can specify delete policies with the `using` clause.

Let's say you have a table called `profiles` in the public schema and you only want users to be able to delete their own profile:

```
1

-- 1. Create table

2

create table profiles (

3

id uuid primary key,

4

user_id uuid references auth.users,

5

avatar_url text

6

);

7

8

-- 2. Enable RLS

9

alter table profiles enable row level security;

10

11

-- 3. Create Policy

12

create policy "Users can delete a profile."

13

on profiles for delete

14

to authenticated                     -- the Postgres Role (recommended)

15

using ( (select auth.uid()) = user_id );      -- the actual Policy
```

### Views[#](#views)

Views bypass RLS by default because they are usually created with the `postgres` user. This is a feature of Postgres, which automatically creates views with `security definer`.

In Postgres 15 and above, you can make a view obey the RLS policies of the underlying tables when invoked by `anon` and `authenticated` roles by setting `security_invoker = true`.

```
1

create view <VIEW_NAME>

2

with(security_invoker = true)

3

as select <QUERY>
```

In older versions of Postgres, protect your views by revoking access from the `anon` and `authenticated` roles, or by putting them in an unexposed schema.

## Helper functions[#](#helper-functions)

Supabase provides some helper functions that make it easier to write Policies.

### `auth.uid()`[#](#authuid)

Returns the ID of the user making the request.

### `auth.jwt()`[#](#authjwt)

Not all information present in the JWT should be used in RLS policies. For instance, creating an RLS policy that relies on the `user_metadata` claim can create security issues in your application as this information can be modified by authenticated end users.

Returns the JWT of the user making the request. Anything that you store in the user's `raw_app_meta_data` column or the `raw_user_meta_data` column will be accessible using this function. It's important to know the distinction between these two:

* `raw_user_meta_data` - can be updated by the authenticated user using the `supabase.auth.update()` function. It is not a good place to store authorization data.
* `raw_app_meta_data` - cannot be updated by the user, so it's a good place to store authorization data.

The `auth.jwt()` function is extremely versatile. For example, if you store some team data inside `app_metadata`, you can use it to determine whether a particular user belongs to a team. For example, if this was an array of IDs:

```
1

create policy "User is in team"

2

on my_table

3

to authenticated

4

using ( team_id in (select auth.jwt() -> 'app_metadata' -> 'teams'));
```

Keep in mind that a JWT is not always "fresh". In the example above, even if you remove a user from a team and update the `app_metadata` field, that will not be reflected using `auth.jwt()` until the user's JWT is refreshed.

Also, if you are using Cookies for Auth, then you must be mindful of the JWT size. Some browsers are limited to 4096 bytes for each cookie, and so the total size of your JWT should be small enough to fit inside this limitation.

### MFA[#](#mfa)

The `auth.jwt()` function can be used to check for [Multi-Factor Authentication](/docs/guides/auth/auth-mfa#enforce-rules-for-mfa-logins). For example, you could restrict a user from updating their profile unless they have at least 2 levels of authentication (Assurance Level 2):

```
1

create policy "Restrict updates."

2

on profiles

3

as restrictive

4

for update

5

to authenticated using (

6

(select auth.jwt()->>'aal') = 'aal2'

7

);
```

## Bypassing Row Level Security[#](#bypassing-row-level-security)

Supabase provides special "Service" keys, which can be used to bypass RLS. These should never be used in the browser or exposed to customers, but they are useful for administrative tasks.

Supabase will adhere to the RLS policy of the signed-in user, even if the client library is initialized with a Service Key.

You can also create new [Postgres Roles](/docs/guides/database/postgres/roles) which can bypass Row Level Security using the "bypass RLS" privilege:

```
1

alter role "role_name" with bypassrls;
```

This can be useful for system-level access. You should *never* share login credentials for any Postgres Role with this privilege.

## RLS performance recommendations[#](#rls-performance-recommendations)

Every authorization system has an impact on performance. While row level security is powerful, the performance impact is important to keep in mind. This is especially true for queries that scan every row in a table - like many `select` operations, including those using limit, offset, and ordering.

Based on a series of [tests](https://github.com/GaryAustin1/RLS-Performance), we have a few recommendations for RLS:

### Add indexes[#](#add-indexes)

Make sure you've added [indexes](/docs/guides/database/postgres/indexes) on any columns used within the Policies which are not already indexed (or primary keys). For a Policy like this:

```
1

create policy "rls_test_select" on test_table

2

to authenticated

3

using ( (select auth.uid()) = user_id );
```

You can add an index like:

```
1

create index userid

2

on test_table

3

using btree (user_id);
```

#### Benchmarks[#](#benchmarks)

| Test | Before (ms) | After (ms) | % Improvement | Change |
| --- | --- | --- | --- | --- |
| [test1-indexed](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test1-indexed) | 171 | < 0.1 | 99.94% | Before: No index  After: `user_id` indexed |

### Call functions with `select`[#](#call-functions-with-select)

You can use `select` statement to improve policies that use functions. For example, instead of this:

```
1

create policy "rls_test_select" on test_table

2

to authenticated

3

using ( auth.uid() = user_id );
```

You can do:

```
1

create policy "rls_test_select" on test_table

2

to authenticated

3

using ( (select auth.uid()) = user_id );
```

This method works well for JWT functions like `auth.uid()` and `auth.jwt()` as well as `security definer` Functions. Wrapping the function causes an `initPlan` to be run by the Postgres optimizer, which allows it to "cache" the results per-statement, rather than calling the function on each row.

You can only use this technique if the results of the query or function do not change based on the row data.

#### Benchmarks[#](#benchmarks)

| Test | Before (ms) | After (ms) | % Improvement | Change |
| --- | --- | --- | --- | --- |
| [test2a-wrappedSQL-uid](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test2a-wrappedSQL-uid()) | 179 | 9 | 94.97% | Before: `auth.uid() = user_id`   After:  `(select auth.uid()) = user_id` |
| [test2b-wrappedSQL-isadmin](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test2b-wrappedSQL-isadmin()) | 11,000 | 7 | 99.94% | Before: `is_admin()` *table join*  After: `(select is_admin())` *table join* |
| [test2c-wrappedSQL-two-functions](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test2c-wrappedSQL-two-functions) | 11,000 | 10 | 99.91% | Before: `is_admin() OR auth.uid() = user_id`  After: `(select is_admin()) OR (select auth.uid() = user_id)` |
| [test2d-wrappedSQL-sd-fun](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test2d-wrappedSQL-sd-fun) | 178,000 | 12 | 99.993% | Before: `has_role() = role`   After: (select has\_role()) = role |
| [test2e-wrappedSQL-sd-fun-array](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test2e-wrappedSQL-sd-fun-array) | 173000 | 16 | 99.991% | Before: `team_id=any(user_teams())`   After: team\_id=any(array(select user\_teams())) |

### Add filters to every query[#](#add-filters-to-every-query)

Policies are "implicit where clauses," so it's common to run `select` statements without any filters. This is a bad pattern for performance. Instead of doing this (JS client example):

```
1

const { data } = supabase

2

.from('table')

3

.select()
```

You should always add a filter:

```
1

const { data } = supabase

2

.from('table')

3

.select()

4

.eq('user_id', userId)
```

Even though this duplicates the contents of the Policy, Postgres can use the filter to construct a better query plan.

#### Benchmarks[#](#benchmarks)

| Test | Before (ms) | After (ms) | % Improvement | Change |
| --- | --- | --- | --- | --- |
| [test3-addfilter](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test3-addfilter) | 171 | 9 | 94.74% | Before: `auth.uid() = user_id`  After: add `.eq` or `where` on `user_id` |

### Use security definer functions[#](#use-security-definer-functions)

A "security definer" function runs using the same role that *created* the function. This means that if you create a role with a superuser (like `postgres`), then that function will have `bypassrls` privileges. For example, if you had a policy like this:

```
1

create policy "rls_test_select" on test_table

2

to authenticated

3

using (

4

exists (

5

select 1 from roles_table

6

where (select auth.uid()) = user_id and role = 'good_role'

7

)

8

);
```

We can instead create a `security definer` function which can scan `roles_table` without any RLS penalties:

```
