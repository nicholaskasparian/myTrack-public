# Source: https://supabase.com/docs/guides/storage/access-control
# Last fetched: 2026-03-27T18:38:37.271521+00:00

Storage

# Storage Access Control

---

Supabase Storage is designed to work perfectly with Postgres [Row Level Security](/docs/guides/database/postgres/row-level-security) (RLS).

You can use RLS to create [Security Access Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html) that are incredibly powerful and flexible, allowing you to restrict access based on your business needs.

## Access policies[#](#access-policies)

By default Storage does not allow any uploads to buckets without RLS policies. You selectively allow certain operations by creating RLS policies on the `storage.objects` table.

You can find the documentation for the storage schema [here](/docs/guides/storage/schema/design) , and to simplify the process of crafting your policies, you can utilize these [helper functions](/docs/guides/storage/schema/helper-functions) .

The RLS policies required for different operations are documented [here](/docs/reference/javascript/storage-createbucket)

For example, the only RLS policy required for [uploading](/docs/reference/javascript/storage-from-upload) objects is to grant the `INSERT` permission to the `storage.objects` table.

To allow overwriting files using the `upsert` functionality you will need to additionally grant `SELECT` and `UPDATE` permissions.

## Policy examples[#](#policy-examples)

An easy way to get started would be to create RLS policies for `SELECT`, `INSERT`, `UPDATE`, `DELETE` operations and restrict the policies to meet your security requirements. For example, one can start with the following `INSERT` policy:

```
1

create policy "policy_name"

2

ON storage.objects

3

for insert with check (

4

true

5

);
```

and modify it to only allow authenticated users to upload assets to a specific bucket by changing it to:

```
1

create policy "policy_name"

2

on storage.objects for insert to authenticated with check (

3

-- restrict bucket

4

bucket_id = 'my_bucket_id'

5

);
```

This example demonstrates how you would allow authenticated users to upload files to a folder called `private` inside `my_bucket_id`:

```
1

create policy "Allow authenticated uploads"

2

on storage.objects

3

for insert

4

to authenticated

5

with check (

6

bucket_id = 'my_bucket_id' and

7

(storage.foldername(name))[1] = 'private'

8

);
```

This example demonstrates how you would allow authenticated users to upload files to a folder called with their `users.id` inside `my_bucket_id`:

```
1

create policy "Allow authenticated uploads"

2

on storage.objects

3

for insert

4

to authenticated

5

with check (

6

bucket_id = 'my_bucket_id' and

7

(storage.foldername(name))[1] = (select auth.jwt()->>'sub')

8

);
```

Allow a user to access a file that was previously uploaded by the same user:

```
1

create policy "Individual user Access"

2

on storage.objects for select

3

to authenticated

4

using ( (select auth.jwt()->>'sub') = owner_id );
```

---

## Bypassing access controls[#](#bypassing-access-controls)

If you exclusively use Storage from trusted clients, such as your own servers, and need to bypass the RLS policies, you can use the `service key` in the `Authorization` header. Service keys entirely bypass RLS policies, granting you unrestricted access to all Storage APIs.

Remember you should not share the service key publicly.

Watch video guide

![Video guide preview](/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2F4ERX__Y908k%2F0.jpg&w=3840&q=75)

### Is this helpful?

No  Yes

### AI Tools

Copy as Markdown[Ask ChatGPT](https://chatgpt.com/?hint=search&q=Read from https://supabase.com/docs/guides/storage/security/access-control so I can ask questions about its contents)[Ask Claude](https://claude.ai/new?q=Read from https://supabase.com/docs/guides/storage/security/access-control so I can ask questions about its contents)
