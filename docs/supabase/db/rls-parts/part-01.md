# Source: https://supabase.com/docs/guides/auth/row-level-security
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# rls — Part 1


Database

# Row Level Security

## Secure your data using Postgres Row Level Security.

---

When you need granular authorization rules, nothing beats Postgres's [Row Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).

## Row Level Security in Supabase[#](#row-level-security-in-supabase)

Supabase allows convenient and secure data access from the browser, as long as you enable RLS.

RLS *must* always be enabled on any tables stored in an exposed schema. By default, this is the `public` schema.

RLS is enabled by default on tables created with the Table Editor in the dashboard. If you create one in raw SQL or with the SQL editor, remember to enable RLS yourself:

```
1

alter table <schema_name>.<table_name>

2

enable row level security;
```

RLS is incredibly powerful and flexible, allowing you to write complex SQL rules that fit your unique business needs. RLS can be combined with [Supabase Auth](/docs/guides/auth) for end-to-end user security from the browser to the database.

RLS is a Postgres primitive and can provide "[defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))" to protect your data from malicious actors even when accessed through third-party tooling.

## Policies[#](#policies)

[Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html) are Postgres's rule engine. Policies are easy to understand once you get the hang of them. Each policy is attached to a table, and the policy is executed every time a table is accessed.

You can just think of them as adding a `WHERE` clause to every query. For example a policy like this ...

```
1

create policy "Individuals can view their own todos."

2

on todos for select

3

using ( (select auth.uid()) = user_id );
```

.. would translate to this whenever a user tries to select from the todos table:

```
1

select *

2

from todos

3

where auth.uid() = todos.user_id;

4

-- Policy is implicitly added.
```

## Enabling Row Level Security[#](#enabling-row-level-security)

You can enable RLS for any table using the `enable row level security` clause:

```
1

alter table "table_name" enable row level security;
```

Once you have enabled RLS, no data will be accessible via the [API](/docs/guides/api) when using the public `anon` key, until you create policies.

## Auto-enable RLS for new tables[#](#auto-enable-rls-for-new-tables)

If you want RLS enabled automatically for new tables, you can create an event trigger that runs after table creation. This uses a Postgres [event trigger](/docs/guides/database/postgres/event-triggers) to call `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on each newly created table.

```
1

CREATE OR REPLACE FUNCTION rls_auto_enable()

2

RETURNS EVENT_TRIGGER

3

LANGUAGE plpgsql

4

SECURITY DEFINER

5

SET search_path = pg_catalog

6

AS $$

7

DECLARE

8

cmd record;

9

BEGIN

10

FOR cmd IN

11

SELECT *

12

FROM pg_event_trigger_ddl_commands()

13

WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')

14

AND object_type IN ('table','partitioned table')

15

LOOP

16

IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN

17

BEGIN

18

EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);

19

RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;

20

EXCEPTION

21

WHEN OTHERS THEN

22

RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;

23

END;

24

ELSE

25

RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;

26

END IF;

27

END LOOP;

28

END;

29

$$;

30

31

DROP EVENT TRIGGER IF EXISTS ensure_rls;

32

CREATE EVENT TRIGGER ensure_rls

33

ON ddl_command_end

34

WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')

35

EXECUTE FUNCTION rls_auto_enable();
```

Note that this applies to tables created after the trigger is installed. Existing tables still need RLS enabled manually.

##### `auth.uid()` Returns `null` When Unauthenticated

When a request is made without an authenticated user (e.g., no access token is provided or the session has expired), `auth.uid()` returns `null`.

This means that a policy like:

```
1

USING (auth.uid() = user_id)
```

will silently fail for unauthenticated users, because:

```
1

null = user_id
```

is always false in SQL.

To avoid confusion and make your intention clear, we recommend explicitly checking for authentication:

```
1

USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
```

## Authenticated and unauthenticated roles[#](#authenticated-and-unauthenticated-roles)

Supabase maps every request to one of the roles:

* `anon`: an unauthenticated request (the user is not logged in)
* `authenticated`: an authenticated request (the user is logged in)

These are actually [Postgres Roles](/docs/guides/database/postgres/roles). You can use these roles within your Policies using the `TO` clause:

```
1

create policy "Profiles are viewable by everyone"

2

on profiles for select

3

to authenticated, anon

4

using ( true );

5

6

-- OR

7

8

create policy "Public profiles are viewable only by authenticated users"

9

on profiles for select

10

to authenticated

11

using ( true );
```

##### Anonymous user vs the anon key

Using the `anon` Postgres role is different from an [anonymous user](/docs/guides/auth/auth-anonymous) in Supabase Auth. An anonymous user assumes the `authenticated` role to access the database and can be differentiated from a permanent user by checking the `is_anonymous` claim in the JWT.

## Creating policies[#](#creating-policies)

Policies are SQL logic that you attach to a Postgres table. You can attach as many policies as you want to each table.

Supabase provides some [helpers](#helper-functions) that simplify RLS if you're using Supabase Auth. We'll use these helpers to illustrate some basic policies:

### SELECT policies[#](#select-policies)

You can specify select policies with the `using` clause.

Let's say you have a table called `profiles` in the public schema and you want to enable read access to everyone.

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

create policy "Public profiles are visible to everyone."

13

on profiles for select

14

to anon         -- the Postgres Role (recommended)

15

using ( true ); -- the actual Policy
```

Alternatively, if you only wanted users to be able to see their own profiles:

```
1

create policy "User can see their own profile only."

2

on profiles

3

for select using ( (select auth.uid()) = user_id );
```

### INSERT policies[#](#insert-policies)

You can specify insert policies with the `with check` clause. The `with check` expression ensures that any new row data adheres to the policy constraints.

Let's say you have a table called `profiles` in the public schema and you only want users to be able to create a profile for themselves. In that case, we want to check their User ID matches the value that they are trying to insert:

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
