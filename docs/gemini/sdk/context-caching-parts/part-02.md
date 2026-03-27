# Source: https://ai.google.dev/gemini-api/docs/caching
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# context-caching — Part 2

```

To fetch the metadata for one cache object, if you know its name, use `get`:

```
client.caches.get(name=name)
```

### JavaScript

To list metadata for all uploaded caches, use `GoogleGenAI.caches.list()`:

```
console.log("My caches:");
const pager = await ai.caches.list({ config: { pageSize: 10 } });
let page = pager.page;
while (true) {
  for (const c of page) {
    console.log("    ", c.name);
  }
  if (!pager.hasNextPage()) break;
  page = await pager.nextPage();
}
```

### Go

The following example lists all caches.

```
caches, err := client.Caches.All(ctx)
if err != nil {
    log.Fatal(err)
}
fmt.Println("Listing all caches:")
for _, item := range caches {
    fmt.Println("   ", item.Name)
}
```

The following example lists caches using a page size of 2.

```
page, err := client.Caches.List(ctx, &genai.ListCachedContentsConfig{PageSize: 2})
if err != nil {
    log.Fatal(err)
}

pageIndex := 1
for {
    fmt.Printf("Listing caches (page %d):\n", pageIndex)
    for _, item := range page.Items {
        fmt.Println("   ", item.Name)
    }
    if page.NextPageToken == "" {
        break
    }
    page, err = page.Next(ctx)
    if err == genai.ErrPageDone {
        break
    } else if err != nil {
        return err
    }
    pageIndex++
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/cachedContents?key=$GEMINI_API_KEY"
```

### Update a cache

You can set a new `ttl` or `expire_time` for a cache. Changing anything else
about the cache isn't supported.

### Python

The following example shows how to update the `ttl` of a cache using
`client.caches.update()`.

```
from google import genai
from google.genai import types

client.caches.update(
  name = cache.name,
  config  = types.UpdateCachedContentConfig(
      ttl='300s'
  )
)
```

To set the expiry time, it will accepts either a `datetime` object
or an ISO-formatted datetime string (`dt.isoformat()`, like
`2025-01-27T16:02:36.473528+00:00`). Your time must include a time zone
(`datetime.utcnow()` doesn't attach a time zone,
`datetime.now(datetime.timezone.utc)` does attach a time zone).

```
from google import genai
from google.genai import types
import datetime

# You must use a time zone-aware time.
in10min = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=10)

client.caches.update(
  name = cache.name,
  config  = types.UpdateCachedContentConfig(
      expire_time=in10min
  )
)
```

### JavaScript

The following example shows how to update the `ttl` of a cache using
`GoogleGenAI.caches.update()`.

```
const ttl = `${2 * 3600}s`; // 2 hours in seconds
const updatedCache = await ai.caches.update({
  name: cache.name,
  config: { ttl },
});
console.log("After update (TTL):", updatedCache);
```

### Go

The following example shows how to update the `TTL` of a cache.

```
// Update the TTL (2 hours).
cache, err = client.Caches.Update(ctx, cache.Name, &genai.UpdateCachedContentConfig{
    TTL: 7200 * time.Second,
})
if err != nil {
    log.Fatal(err)
}
fmt.Println("After update:")
fmt.Println(cache)
```

### REST

The following example shows how to update the `ttl` of a cache.

```
curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/$CACHE_NAME?key=$GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-d '{"ttl": "600s"}'
```

### Delete a cache

The caching service provides a delete operation for manually removing content
from the cache. The following example shows how to delete a cache:

### Python

```
client.caches.delete(cache.name)
```

### JavaScript

```
await ai.caches.delete({ name: cache.name });
```

### Go

```
_, err = client.Caches.Delete(ctx, cache.Name, &genai.DeleteCachedContentConfig{})
if err != nil {
    log.Fatal(err)
}
fmt.Println("Cache deleted:", cache.Name)
```

### REST

```
curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/$CACHE_NAME?key=$GEMINI_API_KEY"
```

### Explicit caching using the OpenAI library

If you're using an [OpenAI library](/gemini-api/docs/openai), you can enable
explicit caching using the `cached_content` property on
[`extra_body`](/gemini-api/docs/openai#extra-body).

## When to use explicit caching

Context caching is particularly well suited to scenarios where a substantial
initial context is referenced repeatedly by shorter requests. Consider using
context caching for use cases such as:

* Chatbots with extensive [system instructions](/gemini-api/docs/system-instructions)
* Repetitive analysis of lengthy video files
* Recurring queries against large document sets
* Frequent code repository analysis or bug fixing

### How explicit caching reduces costs

Context caching is a paid feature designed to reduce cost. Billing is based on
the following factors:

1. **Cache token count:** The number of input tokens cached, billed at a
   reduced rate when included in subsequent prompts.
2. **Storage duration:** The amount of time cached tokens are stored (TTL),
   billed based on the TTL duration of cached token count. There are no minimum
   or maximum bounds on the TTL.
3. **Other factors:** Other charges apply, such as for non-cached input tokens
   and output tokens.

For up-to-date pricing details, refer to the Gemini API [pricing
page](/pricing). To learn how to count tokens, see the [Token
guide](/gemini-api/docs/tokens).

### Additional considerations

Keep the following considerations in mind when using context caching:

* The *minimum* input token count for context caching varies by model. The *maximum*
  is the same as the maximum for the given model. (For more on counting tokens,
  see the [Token guide](/gemini-api/docs/tokens)).
* The model doesn't make any distinction between cached tokens and regular
  input tokens. Cached content is a prefix to the prompt.
* There are no special rate or usage limits on context caching; the standard
  rate limits for `GenerateContent` apply, and token limits include cached
  tokens.
* The number of cached tokens is returned in the `usage_metadata` from the
  create, get, and list operations of the cache service, and also in
  `GenerateContent` when using the cache.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-03-24 UTC.

Need to tell us more?

[[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-03-24 UTC."],[],[]]
