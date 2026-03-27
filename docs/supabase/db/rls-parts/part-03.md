# Source: https://supabase.com/docs/guides/auth/row-level-security
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# rls — Part 3

1

create function private.has_good_role()

2

returns boolean

3

language plpgsql

4

security definer -- will run as the creator

5

as $$

6

begin

7

return exists (

8

select 1 from roles_table

9

where (select auth.uid()) = user_id and role = 'good_role'

10

);

11

end;

12

$$;

13

14

-- Update our policy to use this function:

15

create policy "rls_test_select"

16

on test_table

17

to authenticated

18

using ( (select private.has_good_role()) );
```

Security-definer functions should never be created in a schema in the "Exposed schemas" inside your [API settings](/dashboard/project/_/settings/api)`.

### Minimize joins[#](#minimize-joins)

You can often rewrite your Policies to avoid joins between the source and the target table. Instead, try to organize your policy to fetch all the relevant data from the target table into an array or set, then you can use an `IN` or `ANY` operation in your filter.

For example, this is an example of a slow policy which joins the source `test_table` to the target `team_user`:

```
1

create policy "rls_test_select" on test_table

2

to authenticated

3

using (

4

(select auth.uid()) in (

5

select user_id

6

from team_user

7

where team_user.team_id = team_id -- joins to the source "test_table.team_id"

8

)

9

);
```

We can rewrite this to avoid this join, and instead select the filter criteria into a set:

```
1

create policy "rls_test_select" on test_table

2

to authenticated

3

using (

4

team_id in (

5

select team_id

6

from team_user

7

where user_id = (select auth.uid()) -- no join

8

)

9

);
```

In this case you can also consider [using a `security definer` function](#use-security-definer-functions) to bypass RLS on the join table:

If the list exceeds 1000 items, a different approach may be needed or you may need to analyze the approach to ensure that the performance is acceptable.

#### Benchmarks[#](#benchmarks)

| Test | Before (ms) | After (ms) | % Improvement | Change |
| --- | --- | --- | --- | --- |
| [test5-fixed-join](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test5-fixed-join) | 9,000 | 20 | 99.78% | Before: `auth.uid()` in table join on col  After: col in table join on `auth.uid()` |

### Specify roles in your policies[#](#specify-roles-in-your-policies)

Always use the Role of inside your policies, specified by the `TO` operator. For example, instead of this query:

```
1

create policy "rls_test_select" on rls_test

2

using ( auth.uid() = user_id );
```

Use:

```
1

create policy "rls_test_select" on rls_test

2

to authenticated

3

using ( (select auth.uid()) = user_id );
```

This prevents the policy `( (select auth.uid()) = user_id )` from running for any `anon` users, since the execution stops at the `to authenticated` step.

#### Benchmarks[#](#benchmarks)

| Test | Before (ms) | After (ms) | % Improvement | Change |
| --- | --- | --- | --- | --- |
| [test6-To-role](https://github.com/GaryAustin1/RLS-Performance/tree/main/tests/test6-To-role) | 170 | < 0.1 | 99.78% | Before: No `TO` policy  After: `TO authenticated` (anon accessing) |

## More resources[#](#more-resources)

* [Testing your database](/docs/guides/database/testing)
* [RLS Guide and Best Practices](https://github.com/orgs/supabase/discussions/14576)
* Community repo on testing RLS using [pgTAP and dbdev](https://github.com/usebasejump/supabase-test-helpers/tree/main)

### Is this helpful?

No  Yes

### AI Tools

Copy as Markdown[Ask ChatGPT](https://chatgpt.com/?hint=search&q=Read from https://supabase.com/docs/guides/database/postgres/row-level-security so I can ask questions about its contents)[Ask Claude](https://claude.ai/new?q=Read from https://supabase.com/docs/guides/database/postgres/row-level-security so I can ask questions about its contents)
