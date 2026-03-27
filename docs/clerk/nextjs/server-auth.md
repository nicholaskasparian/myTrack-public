# Source: https://clerk.com/docs/references/nextjs/auth
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# `auth()`

1. [Parameters](#parameters)
2. [`auth.protect()`](#auth-protect)
   1. [Example](#example)
3. [Returns](#returns)
   1. [`redirectToSignIn()`](#redirect-to-sign-in)
4. [`auth()` usage](#auth-usage)
   1. [Protect pages and routes](#protect-pages-and-routes)
   2. [Check if a user is authorized](#check-if-a-user-is-authorized)
   3. [Verify machine requests](#verify-machine-requests)
   4. [Data fetching with `getToken()`](#data-fetching-with-get-token)

Copy as markdownCopy as markdownOpenOpen

The `auth()` helper returns the [Auth](/docs/reference/backend/types/auth-object) object of the currently active user, as well as the [redirectToSignIn()](/docs/reference/nextjs/app-router/auth#redirect-to-sign-in) method. It includes a single method, `protect()`, which you can use to check if a user is authenticated or authorized to access certain parts of your application or even entire routes.

* Only available for App Router.
* Only works on the server-side, such as in Server Components, Route Handlers, and Server Actions.
* Requires [clerkMiddleware()](/docs/reference/nextjs/clerk-middleware) to be configured.

## [Parameters](#parameters)

* Name
  :   `opts?`

  Type
  :   `{acceptsToken: TokenType, treatPendingAsSignedOut: boolean }`

  Description
  :   An optional object that can be used to configure the behavior of the `auth()` function. It accepts the following properties:

      + `acceptsToken?`: The type of authentication token(s) to accept. Valid values are:

        - `'session_token'` - authenticates a user session.
        - `'oauth_token'` - authenticates a machine request using OAuth.
        - `'m2m_token'` - authenticates a machine to machine request.
        - `'api_key'` - authenticates a machine request using API keys.

        Can be set to:

        - A single token type.
        - An array of token types.
        - `'any'` to accept all available token types.

        Defaults to `'session_token'`.
      + `treatPendingAsSignedOut?`: A boolean that indicates whether to treat [pending session status](/docs/reference/types/session-status#properties) as signed out. Defaults to `true`.

## [`auth.protect()`](#auth-protect)

`auth` includes a single property, the `protect()` method, which you can use in three ways:

* to check if a user is authenticated (signed in)
* to check if a user is authorized (has the correct Role, Permission, Feature, or Plan) to access something, such as a component or a route handler
* to check if a request includes a valid machine token (e.g. API key or OAuth token) and enforce access rules accordingly

The following table describes how `auth.protect()` behaves based on user authentication or authorization status:

| Authenticated | Authorized | `auth.protect()` will |
| --- | --- | --- |
| Yes | Yes | Return the [Auth](/docs/reference/backend/types/auth-object) object. |
| Yes | No | Return a `404` error. |
| No | No | Redirect the user to the sign-in page. |

Important

For non-document requests, such as API requests, `auth.protect()` returns:

* A `404` error for unauthenticated requests with session token type.
* A `401` error for unauthenticated requests with machine token types.

`auth.protect()` accepts the following parameters:

* Name
  :   `role?`

  Type
  :   `string`

  Description
  :   The Role to check for.
* Name
  :   `permission?`

  Type
  :   `string`

  Description
  :   The Permission to check for.
* Name
  :   `has?`

  Type
  :   `(isAuthorizedParams: CheckAuthorizationParamsWithCustomPermissions) => boolean`

  Description
  :   A function that checks if the user has an Organization Role or Custom Permission. See the [reference](/docs/reference/backend/types/auth-object#has) for more information.
* Name
  :   `unauthorizedUrl?`

  Type
  :   `string`

  Description
  :   The URL to redirect the user to if they are not authorized.
* Name
  :   `unauthenticatedUrl?`

  Type
  :   `string`

  Description
  :   The URL to redirect the user to if they are not authenticated.
* Name
  :   `token?`

  Type
  :   `TokenType`

  Description
  :   The type of authentication token(s) to accept. Valid values are:

      + `'session_token'` - authenticates a user session.
      + `'oauth_token'` - authenticates a machine request using OAuth.
      + `'machine_token'` - authenticates a machine to machine request.
      + `'api_key'` - authenticates a machine request using API keys.

      Can be set to:

      + A single token type.
      + An array of token types.
      + `'any'` to accept all available token types.

      Defaults to `'session_token'`.

### [Example](#example)

`auth.protect()` can be used to check if a user is authenticated or authorized to access certain parts of your application or even entire routes. See detailed examples in the [guide on verifying if a user is authorized](/docs/guides/secure/authorization-checks).

## [Returns](#returns)

The `auth()` helper returns the following:

* The [Auth](/docs/reference/backend/types/auth-object) object.
* The [redirectToSignIn()](/docs/reference/nextjs/app-router/auth#redirect-to-sign-in) method.

### [`redirectToSignIn()`](#redirect-to-sign-in)

The `auth()` helper returns the `redirectToSignIn()` method, which you can use to redirect the user to the sign-in page.

`redirectToSignIn()` accepts the following parameters:

* Name
  :   `returnBackUrl?`

  Type
  :   `string | URL`

  Description
  :   The URL to redirect the user back to after they sign in.

Note

`auth()` on the server-side can only access redirect URLs defined via [environment variables](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) or [clerkMiddleware dynamic keys](/docs/reference/nextjs/clerk-middleware#dynamic-keys).

#### [Example](#example-2)

The following example shows how to use `redirectToSignIn()` to redirect the user to the sign-in page if they are not authenticated. It's also common to use `redirectToSignIn()` in `clerkMiddleware()` to protect entire routes; see [the `clerkMiddleware()` docs](/docs/reference/nextjs/clerk-middleware) for more information.

app/page.tsx

```
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth()

  if (!isAuthenticated) return redirectToSignIn()

  return <h1>Hello, {userId}</h1>
}
```

## [`auth()` usage](#auth-usage)

### [Protect pages and routes](#protect-pages-and-routes)

You can use `auth()` to check if `isAuthenticated` is true. If it's false, then there is not an authenticated (signed in) user. See detailed examples in the [dedicated guide](/docs/guides/users/reading).

### [Check if a user is authorized](#check-if-a-user-is-authorized)

You can use `auth()` to check if a user is authorized to access certain parts of your application or even entire routes by checking their type of access control. See detailed examples in the [guide on verifying if a user is authorized](/docs/guides/secure/authorization-checks).

### [Verify machine requests](#verify-machine-requests)

You can use `auth()` to verify OAuth access tokens⁠ by passing in the `acceptsToken` parameter. See detailed examples in the [guide on verifying OAuth access tokens](/docs/guides/development/verifying-oauth-access-tokens).

### [Data fetching with `getToken()`](#data-fetching-with-get-token)

If you need to send a JWT along to a server, `getToken()` retrieves the current user's [session token](/docs/guides/sessions/session-tokens) or a [custom JWT template](/docs/guides/sessions/jwt-templates). See detailed examples in the [Auth object reference](/docs/reference/backend/types/auth-object#get-token).

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/reference/nextjs/app-router/auth.mdx)
