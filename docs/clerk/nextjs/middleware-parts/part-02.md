# Source: https://clerk.com/docs/references/nextjs/auth-middleware
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# middleware — Part 2

    '/(api|trpc|__clerk)(.*)',
  ],
}
```

### [Custom proxy path](#custom-proxy-path)

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  frontendApiProxy: {
    enabled: true,
    path: '/custom-clerk-proxy',
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes and the proxy path
    '/(api|trpc|custom-clerk-proxy)(.*)',
  ],
}
```

### [`FrontendApiProxyOptions`](#frontend-api-proxy-options)

* Name
  :   `enabled`

  Type
  :   `boolean | ((url: URL) => boolean)`

  Description
  :   Enable Frontend API proxy handling. When `true`, requests to the proxy path are forwarded to [Clerk's Frontend API⁠](/docs/reference/frontend-api), and the `proxyUrl` is automatically derived for authentication handshake.
* Name
  :   `path?`

  Type
  :   `string`

  Description
  :   The path prefix for proxy requests. Defaults to `'/__clerk'`. Must be unique and not conflict with other routes in your application.

### [App Router route handlers](#app-router-route-handlers)

As an alternative to handling the proxy in middleware, you can use route handlers in a Next.js App Router. **This is useful if you prefer to keep proxy logic separate from your middleware.**

#### [`createFrontendApiProxyHandlers()`](#create-frontend-api-proxy-handlers)

Returns an object with `GET`, `POST`, `PUT`, `DELETE`, and `PATCH` handlers that can be directly exported from a route file.

Important

When using route handlers instead of the `frontendApiProxy` middleware option, the `proxyUrl` is **not** auto-derived. You must set the `proxyUrl` option on `clerkMiddleware()` or set the `NEXT_PUBLIC_CLERK_PROXY_URL` environment variable for the authentication handshake to work correctly.

app/api/\_\_clerk/[[...path]]/route.ts

```
import { createFrontendApiProxyHandlers } from '@clerk/nextjs/server'

export const { GET, POST, PUT, DELETE, PATCH } = createFrontendApiProxyHandlers()
```

#### [`clerkFrontendApiProxy()`](#clerk-frontend-api-proxy)

For more control, you can use `clerkFrontendApiProxy()` directly in individual route handlers.

app/api/\_\_clerk/[[...path]]/route.ts

```
import { clerkFrontendApiProxy } from '@clerk/nextjs/server'

export async function GET(request: Request) {
  return clerkFrontendApiProxy(request)
}

export async function POST(request: Request) {
  return clerkFrontendApiProxy(request)
}
```

## [`clerkMiddleware()` options](#clerk-middleware-options)

The `clerkMiddleware()` function accepts an optional object. The following options are available:

* Name
  :   `audience?`

  Type
  :   `string | string[]`

  Description
  :   A string or list of [audiences⁠](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.3). If passed, it is checked against the `aud` claim in the token.
* Name
  :   `authorizedParties?`

  Type
  :   `string[]`

  Description
  :   An allowlist of origins to verify against, to protect your application from the subdomain cookie leaking attack. For example: `['http://localhost:3000', 'https://example.com']`
* Name
  :   `clockSkewInMs?`

  Type
  :   `number`

  Description
  :   Specifies the allowed time difference (in milliseconds) between the Clerk server (which generates the token) and the clock of the user's application server when validating a token. Defaults to 5000 ms (5 seconds).
* Name
  :   `domain?`

  Type
  :   `string`

  Description
  :   The domain used for satellites to inform Clerk where this application is deployed.
* Name
  :   `isSatellite?`

  Type
  :   `boolean`

  Description
  :   When using Clerk's satellite feature, this should be set to `true` for secondary domains.
* Name
  :   `satelliteAutoSync?`

  Type
  :   `boolean`

  Description
  :   Controls whether a satellite app automatically syncs authentication state with the primary domain on first page load. When `false` (default), the satellite app skips the automatic redirect if no session cookies exist, and only triggers the handshake after the user initiates a sign-in or sign-up action. When `true`, the satellite app redirects to the primary domain on every first visit to sync state. Defaults to `false`. See [satellite domains](/docs/guides/dashboard/dns-domains/satellite-domains) for more details.
* Name
  :   `jwtKey`

  Type
  :   `string`

  Description
  :   Used to verify the session token in a networkless manner. Supply the **JWKS Public Key** from the [**API keys**⁠](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables) instead.** For more information, refer to [Manual JWT verification](/docs/guides/sessions/manual-jwt-verification).
* Name
  :   `organizationSyncOptions?`

  Type
  :   `OrganizationSyncOptions | undefined`

  Description
  :   Used to activate a specific [Organization](/docs/guides/organizations/overview) or Personal Account⁠ based on URL path parameters. If there's a mismatch between the Active Organization⁠ in the session (e.g., as reported by [auth()](/docs/reference/nextjs/app-router/auth)) and the Organization indicated by the URL, the middleware will attempt to activate the Organization specified in the URL.
* Name
  :   `proxyUrl?`

  Type
  :   `string`

  Description
  :   Specify the URL of the proxy, if using a proxy.
* Name
  :   `signInUrl`

  Type
  :   `string`

  Description
  :   The full URL or path to your sign-in page. Needs to point to your primary application on the client-side. **Required for a satellite application in a development instance.** It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
* Name
  :   `signUpUrl`

  Type
  :   `string`

  Description
  :   The full URL or path to your sign-up page. Needs to point to your primary application on the client-side. **Required for a satellite application in a development instance.** It's recommended to use [the environment variable](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
* Name
  :   `publishableKey`

  Type
  :   `string`

  Description
  :   The Clerk Publishable Key⁠ for your instance.
* Name
  :   `secretKey?`

  Type
  :   `string`

  Description
  :   The Clerk Secret Key⁠ for your instance. The `CLERK_ENCRYPTION_KEY` environment variable must be set when providing `secretKey` as an option, refer to [Dynamic keys](/docs/reference/nextjs/clerk-middleware#dynamic-keys).
* Name
  :   `frontendApiProxy?`

  Type
  :   [FrontendApiProxyOptions](/docs/reference/nextjs/clerk-middleware#frontend-api-proxy-options)

  Description
  :   Configure Frontend API proxy handling. When enabled, requests to the proxy path are forwarded to [Clerk's Frontend API⁠](/docs/reference/frontend-api), and the `proxyUrl` is automatically derived for authentication handshake.

It's also possible to dynamically set options based on the incoming request:

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(
  (auth, req) => {
    // Add your middleware checks
  },
  (req) => ({
    // Provide `domain` based on the request host
    domain: req.nextUrl.host,
  }),
)
```

### [Dynamic keys](#dynamic-keys)

Note

Dynamic keys are not accessible on the client-side.

The following options, known as "Dynamic Keys," are shared to the Next.js application server through `clerkMiddleware`, enabling access by server-side helpers like [auth()](/docs/reference/nextjs/app-router/auth):

* `signUpUrl`
* `signInUrl`
* `secretKey`
* `publishableKey`

Dynamic keys are encrypted and shared during request time using a [AES encryption algorithm⁠](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). When providing a `secretKey`, the `CLERK_ENCRYPTION_KEY` environment variable is mandatory and used as the encryption key. If no `secretKey` is provided to `clerkMiddleware`, the encryption key defaults to `CLERK_SECRET_KEY`.

When providing `CLERK_ENCRYPTION_KEY`, it is recommended to use a 32-byte (256-bit), pseudorandom value. You can use `openssl` to generate a key:

terminal

```
openssl rand --hex 32
```

For multi-tenant applications, you can dynamically define Clerk keys depending on the incoming request. Here's an example:

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

// You would typically fetch these keys from a external store or environment variables.
const tenantKeys = {
  tenant1: { publishableKey: 'pk_tenant1...', secretKey: 'sk_tenant1...' },
  tenant2: { publishableKey: 'pk_tenant2...', secretKey: 'sk_tenant2...' },
}

export default clerkMiddleware(
  (auth, req) => {
    // Add your middleware checks
  },
  (req) => {
    // Resolve tenant based on the request
    const tenant = getTenant(req)
    return tenantKeys[tenant]
  },
)
```

### [`OrganizationSyncOptions`](#organization-sync-options)

The `organizationSyncOptions` property on the [clerkMiddleware()](/docs/reference/nextjs/clerk-middleware#clerk-middleware-options) options
object has the type `OrganizationSyncOptions`, which has the following properties:

* Name
  :   `organizationPatterns`

  Type
  :   `Pattern[]`

  Description
  :   Specifies URL patterns that are Organization-specific, containing an Organization ID or slug as a path parameter. If a request matches this path, the Organization identifier will be used to set that Organization as active.

      If the route also matches the `personalAccountPatterns` prop, this prop takes precedence.

      Patterns must have a path parameter named either `:id` (to match a Clerk Organization ID) or `:slug` (to match a Clerk Organization slug).

      Warning

      If the Organization can't be activated—either because it doesn't exist or the user lacks access—the previously Active Organization⁠ will remain unchanged. Components must detect this case and provide an appropriate error and/or resolution pathway, such as calling `notFound()` or displaying an [<OrganizationSwitcher />](/docs/reference/components/organization/organization-switcher).

      Common examples:

      + `["/orgs/:slug", "/orgs/:slug/(.*)"]`
      + `["/orgs/:id", "/orgs/:id/(.*)"]`
      + `["/app/:any/orgs/:slug", "/app/:any/orgs/:slug/(.*)"]`
* Name
  :   `personalAccountPatterns`

  Type
  :   `Pattern[]`

  Description
  :   URL patterns for resources that exist within the context of a user's Personal Account⁠.

      If the route also matches the `organizationPattern` prop, the `organizationPattern` prop takes precedence.

      Common examples:

      + `["/me", "/me/(.*)"]`
      + `["/user/:any", "/user/:any/(.*)"]`

### [Pattern](#pattern)

A `Pattern` is a `string` that represents the structure of a URL path. In addition to any valid URL, it may include:

* Named path parameters prefixed with a colon (e.g., `:id`, `:slug`, `:any`).
* Wildcard token, `(.*)`, which matches the remainder of the path.

#### [Examples](#examples)

* `/orgs/:slug`

| URL | Matches | `:slug` value |
| --- | --- | --- |
| `/orgs/acmecorp` | ✅ | `acmecorp` |
| `/orgs` | ❌ | n/a |
| `/orgs/acmecorp/settings` | ❌ | n/a |

* `/app/:any/orgs/:id`

| URL | Matches | `:id` value |
| --- | --- | --- |
| `/app/petstore/orgs/org_123` | ✅ | `org_123` |
| `/app/dogstore/v2/orgs/org_123` | ❌ | n/a |

* `/personal-account/(.*)`

| URL | Matches |
| --- | --- |
| `/personal-account/settings` | ✅ |
| `/personal-account` | ❌ |

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/reference/nextjs/clerk-middleware.mdx)
