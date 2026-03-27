# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 13


  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Delete a factor for a user

```
1

const { data, error } = await supabase.auth.admin.mfa.deleteFactor({

2

id: '34e770dd-9ff9-416c-87fa-43b31d7ef225',

3

userId: 'a89baba7-b1b7-440f-b4bb-91026967f66b',

4

})
```

Response

---

## List all factors for a user (admin)

`listFactors(params)`

Lists all factors associated to a user.

### Parameters

* paramsAuthMFAAdminListFactorsParams

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

List all factors for a user

```
1

const { data, error } = await supabase.auth.admin.mfa.listFactors()
```

Response

---

## OAuth Admin

The OAuth Admin API allows you to manage OAuth clients programmatically. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth. These functions should only be called on a server. Never expose your `service_role` key in the browser.

---

## List OAuth clients

`listClients(params?)`

Lists all OAuth clients with optional pagination. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This function should only be called on a server. Never expose your `service_role` key in the browser.

### Parameters

* params

  Optional

  PageParams

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Get OAuth client

`getClient(clientId)`

Gets details of a specific OAuth client. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This function should only be called on a server. Never expose your `service_role` key in the browser.

### Parameters

* clientIdstring

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Create OAuth client

`createClient(params)`

Creates a new OAuth client. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This function should only be called on a server. Never expose your `service_role` key in the browser.

### Parameters

* paramsCreateOAuthClientParams

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Update OAuth client

`updateClient(clientId, params)`

Updates an existing OAuth client. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This function should only be called on a server. Never expose your `service_role` key in the browser.

### Parameters

* clientIdstring
* paramsUpdateOAuthClientParams

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Delete OAuth client

`deleteClient(clientId)`

Deletes an OAuth client. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This function should only be called on a server. Never expose your `service_role` key in the browser.

### Parameters

* clientIdstring

### Return Type

Promise<object>

Details

---

## Regenerate client secret

`regenerateClientSecret(clientId)`

Regenerates the secret for an OAuth client. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This function should only be called on a server. Never expose your `service_role` key in the browser.

### Parameters

* clientIdstring

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Invokes a Supabase Edge Function.

`invoke(functionName, options)`

Invokes a function

* Requires an Authorization header.
* Invoke params generally match the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) spec.
* When you pass in a body to your function, we automatically attach the Content-Type header for `Blob`, `ArrayBuffer`, `File`, `FormData` and `String`. If it doesn't match any of these types we assume the payload is `json`, serialize it and attach the `Content-Type` header as `application/json`. You can override this behavior by passing in a `Content-Type` header of your own.
* Responses are automatically parsed as `json`, `blob` and `form-data` depending on the `Content-Type` header sent by your function. Responses are parsed as `text` by default.

### Parameters

* functionNamestring

  The name of the Function to invoke.
* optionsFunctionInvokeOptions

  Options for invoking the Function.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1FunctionsResponseSuccess
* Option 2FunctionsResponseFailure

Example 1Basic invocationError handlingPassing custom headersCalling with DELETE HTTP verbInvoking a Function in the UsEast1 regionCalling with GET HTTP verbExample 7

```
1

const { data, error } = await functions.invoke('hello-world', {

2

body: { name: 'Ada' },

3

})
```

---

## CORS headers for Edge Functions

Default CORS headers for Supabase Edge Functions.

Includes all headers sent by Supabase client libraries and allows all standard HTTP methods. Use this for simple CORS configurations with wildcard origin.

Basic usage

```
1

import { corsHeaders } from '@supabase/supabase-js/cors'

2

3

Deno.serve(async (req) => {

4

if (req.method === 'OPTIONS') {

5

return new Response('ok', { headers: corsHeaders })

6

}

7

8

return new Response(

9

JSON.stringify({ data: 'Hello' }),

10

{ headers: { ...corsHeaders, 'Content-Type': 'application/json' } }

11

)

12

})
```

---

## Update authorization token

`setAuth(token)`

Updates the authorization header

### Parameters

* tokenstring

  the new jwt token sent in the authorisation header

### Return Type

void

Setting the authorization header

```
1

functions.setAuth(session.access_token)
```

---

## Subscribe to channel

`on(type, filter, callback)`

Creates an event handler that listens to changes.

* By default, Broadcast and Presence are enabled for all projects.
* By default, listening to database changes is disabled for new projects due to database performance and security concerns. You can turn it on by managing Realtime's [replication](/docs/guides/api#realtime-api-overview).
* You can receive the "previous" data for updates and deletes by setting the table's `REPLICA IDENTITY` to `FULL` (e.g., `ALTER TABLE your_table REPLICA IDENTITY FULL;`).
* Row level security is not applied to delete statements. When RLS is enabled and replica identity is set to full, only the primary key is sent to clients.

### Parameters

* typeOne of the following options

  Details

  + Option 1"presence"
  + Option 2"postgres\_changes"
  + Option 3"broadcast"
  + Option 4"system"
* filterOne of the following options

  Details

  + Option 1object

    Details
  + Option 2object

    Details
  + Option 3object

    Details
  + Option 4object

    Details
  + Option 5RealtimePostgresChangesFilter

    Details
  + Option 6RealtimePostgresChangesFilter

    Details
  + Option 7RealtimePostgresChangesFilter

    Details
  + Option 8RealtimePostgresChangesFilter

    Details
  + Option 9RealtimePostgresChangesFilter

    Details
  + Option 10object

    Details
  + Option 11object

    Details
  + Option 12object

    Details
  + Option 13object

    Details
  + Option 14object

    Details
* callbackfunction

  Details
