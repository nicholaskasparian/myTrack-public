# Source: https://clerk.com/docs/references/nextjs/auth-middleware
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# middleware — Part 1


# clerkMiddleware() | Next.js

1. [Configure `clerkMiddleware()`](#configure-clerk-middleware)
2. [`createRouteMatcher()`](#create-route-matcher)
3. [Protect routes](#protect-routes)
   1. [Protect routes based on authentication status](#protect-routes-based-on-authentication-status)
   2. [Protect routes based on authorization status](#protect-routes-based-on-authorization-status)
4. [Protect multiple groups of routes](#protect-multiple-groups-of-routes)
5. [Protect all routes](#protect-all-routes)
6. [Protect routes based on token types](#protect-routes-based-on-token-types)
7. [Debug your Middleware](#debug-your-middleware)
8. [Combine Middleware](#combine-middleware)
9. [Frontend API proxy](#frontend-api-proxy)
   1. [Basic usage](#basic-usage)
   2. [Multi-domain support](#multi-domain-support)
   3. [Custom proxy path](#custom-proxy-path)
   4. [`FrontendApiProxyOptions`](#frontend-api-proxy-options)
   5. [App Router route handlers](#app-router-route-handlers)
10. [`clerkMiddleware()` options](#clerk-middleware-options)
    1. [Dynamic keys](#dynamic-keys)
    2. [`OrganizationSyncOptions`](#organization-sync-options)
    3. [Pattern](#pattern)

Copy as markdownCopy as markdownOpenOpen

The `clerkMiddleware()` helper integrates Clerk authentication into your Next.js application through Middleware. `clerkMiddleware()` is compatible with both the App and Pages routers.

## [Configure `clerkMiddleware()`](#configure-clerk-middleware)

Important

If you're using Next.js ≤15, name your file `middleware.ts` instead of `proxy.ts`. The code itself remains the same; only the filename changes.

Create a `proxy.ts` file at the root of your project, or in your `src/` directory if you have one.

Note

For more information about Middleware in Next.js, see the [Next.js documentation⁠](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

By default, `clerkMiddleware` will not protect any routes. All routes are public and you must opt-in to protection for routes.

## [`createRouteMatcher()`](#create-route-matcher)

`createRouteMatcher()` is a Clerk helper function that allows you to protect multiple routes. `createRouteMatcher()` accepts an array of routes and checks if the route the user is trying to visit matches one of the routes passed to it. The paths provided to this helper can be in the same format as the paths provided to the Next Middleware matcher.

The `createRouteMatcher()` helper returns a function that, if called with the `req` object from the Middleware, will return `true` if the user is trying to access a route that matches one of the routes passed to `createRouteMatcher()`.

In the following example, `createRouteMatcher()` sets all `/dashboard` and `/forum` routes as protected routes.

```
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])
```

## [Protect routes](#protect-routes)

You can protect routes using either or both of the following:

* [Authentication-based protection](/docs/reference/nextjs/clerk-middleware#protect-routes-based-on-authentication-status): Verify if the user is signed in.
* [Authorization-based protection](/docs/reference/nextjs/clerk-middleware#protect-routes-based-on-authorization-status): Verify if the user has the required Organization Roles or Custom Permissions.

Tip

If you have a `<Link>` tag on a public page that points to a protected page that returns a `400`-level error, like a `401`, the data prefetch will fail because it will be redirected to the sign-in page and throw a confusing error in the console. To prevent this behavior, disable prefetching by adding `prefetch={false}` to the `<Link>` component.

### [Protect routes based on authentication status](#protect-routes-based-on-authentication-status)

You can protect routes based on a user's authentication status by checking if the user is signed in.

There are two methods that you can use:

* Use [auth.protect()](/docs/reference/nextjs/app-router/auth#auth-protect) if you want to redirect unauthenticated users to the sign-in route automatically.
* Use [auth().isAuthenticated](/docs/reference/nextjs/app-router/auth#protect-pages-and-routes) if you want more control over what your app does based on user authentication status.

auth.protect()

auth().isAuthenticated()

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting

    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

### [Protect routes based on authorization status](#protect-routes-based-on-authorization-status)

You can protect routes based on a user's authorization status by checking if the user has the required Roles or Permissions.

There are two methods that you can use:

* Use [auth.protect()](/docs/reference/nextjs/app-router/auth#auth-protect) if you want Clerk to return a `404` if the user does not have the Role or Permission.
* Use [auth().has()](/docs/reference/backend/types/auth-object#has) if you want more control over what your app does based on the authorization status.

auth.protect()

auth().has()

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Restrict admin routes to users with specific Permissions
  if (isProtectedRoute(req)) {
    await auth.protect((has) => {
      return has({ permission: 'org:admin:example1' }) || has({ permission: 'org:admin:example2' })
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

Warning

Using `has()` **on the server-side** to check Permissions works only with **Custom Permissions**, as [System Permissions](/docs/guides/organizations/control-access/roles-and-permissions#system-permissions) aren't included in the session token claims. To check System Permissions, verify the user's Role instead.

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { has, redirectToSignIn } = await auth()
  // Restrict admin routes to users with specific Permissions
  if (
    (isProtectedRoute(req) && !has({ permission: 'org:admin:example1' })) ||
    !has({ permission: 'org:admin:example2' })
  ) {
    // Add logic to run if the user does not have the required Permissions

    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

## [Protect multiple groups of routes](#protect-multiple-groups-of-routes)

You can use more than one `createRouteMatcher()` in your application if you have two or more groups of routes.

The following example uses the [has()](/docs/reference/backend/types/auth-object#has) method from the `auth()` helper.

Tip

If you have a `<Link>` tag on a public page that points to a protected page that returns a `400`-level error, like a `401`, the data prefetch will fail because it will be redirected to the sign-in page and throw a confusing error in the console. To prevent this behavior, disable prefetching by adding `prefetch={false}` to the `<Link>` component.

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isTenantRoute = createRouteMatcher(['/organization-selector(.*)', '/orgid/(.*)'])

const isTenantAdminRoute = createRouteMatcher(['/orgId/(.*)/memberships', '/orgId/(.*)/domain'])

export default clerkMiddleware(async (auth, req) => {
  // Restrict admin routes to users with specific Permissions
  if (isTenantAdminRoute(req)) {
    await auth.protect((has) => {
      return has({ permission: 'org:admin:example1' }) || has({ permission: 'org:admin:example2' })
    })
  }
  // Restrict Organization routes to signed in users
  if (isTenantRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

## [Protect all routes](#protect-all-routes)

To protect all routes in your application and define specific routes as public, you can use any of the above methods and simply invert the `if` condition.

Tip

If you have a `<Link>` tag on a public page that points to a protected page that returns a `400`-level error, like a `401`, the data prefetch will fail because it will be redirected to the sign-in page and throw a confusing error in the console. To prevent this behavior, disable prefetching by adding `prefetch={false}` to the `<Link>` component.

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

## [Protect routes based on token types](#protect-routes-based-on-token-types)

You can protect routes based on token types by checking if the request includes the required token (e.g. OAuth token, API key, machine token or session token). This ensures that only requests with the appropriate token type can access the route.

The following example uses the [protect()](/docs/reference/nextjs/app-router/auth#auth-protect) method from the `auth()` helper. Requests without the required token will return an appropriate error:

* A `404` error for unauthenticated requests with a session token type.
* A `401` error for unauthenticated requests with machine token types.

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create route matchers to identify which token type each route should require
const isOAuthAccessible = createRouteMatcher(['/oauth(.*)'])
const isApiKeyAccessible = createRouteMatcher(['/api(.*)'])
const isMachineTokenAccessible = createRouteMatcher(['/m2m(.*)'])
const isUserAccessible = createRouteMatcher(['/user(.*)'])
const isAccessibleToAnyValidToken = createRouteMatcher(['/any(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Check if the request matches each route and enforce the corresponding token type
  if (isOAuthAccessible(req)) await auth.protect({ token: 'oauth_token' })
  if (isApiKeyAccessible(req)) await auth.protect({ token: 'api_key' })
  if (isMachineTokenAccessible(req)) await auth.protect({ token: 'm2m_token' })
  if (isUserAccessible(req)) await auth.protect({ token: 'session_token' })

  if (isAccessibleToAnyValidToken(req)) await auth.protect({ token: 'any' })
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

## [Debug your Middleware](#debug-your-middleware)

If you are having issues getting your Middleware dialed in, or are trying to narrow down auth-related issues, you can use the debugging feature in `clerkMiddleware()`. Add `{ debug: true }` to `clerkMiddleware()` and you will get debug logs in your terminal.

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(
  (auth, req) => {
    // Add your middleware checks
  },
  { debug: true },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

If you would like to set up debugging for your development environment only, you can use the `process.env.NODE_ENV` variable to conditionally enable debugging. For example, `{ debug: process.env.NODE_ENV === 'development' }`.

## [Combine Middleware](#combine-middleware)

You can combine other Middleware with Clerk's Middleware by returning the second Middleware from `clerkMiddleware()`.

proxy.ts

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'

import { AppConfig } from './utils/AppConfig'

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
})

const isProtectedRoute = createRouteMatcher(['dashboard/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()

  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

## [Frontend API proxy](#frontend-api-proxy)

The `frontendApiProxy` option enables built-in proxying of Clerk Frontend API requests through your application. Use this when requests to Clerk's API cannot be made directly from the browser and must be routed through your server.

When enabled, requests matching the proxy path (by default, `/__clerk`) are intercepted and forwarded to [Clerk's Frontend API⁠](/docs/reference/frontend-api) before authentication runs. The `proxyUrl` used for authentication handshake is automatically derived.

Note

You must also [enable proxying](/docs/guides/dashboard/dns-domains/proxy-fapi#enable-proxying) in the Clerk Dashboard and configure the client-side proxy URL so ClerkJS routes browser requests through your proxy.

### [Basic usage](#basic-usage)

Important

Ensure your middleware matcher includes the proxy path (by default, `/__clerk`) so proxy requests are handled by the middleware.

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  frontendApiProxy: {
    enabled: true,
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes and the proxy path
    '/(api|trpc|__clerk)(.*)',
  ],
}
```

### [Multi-domain support](#multi-domain-support)

For applications that serve multiple domains (e.g., preview deployments, staging environments), you can pass a function to `enabled` to conditionally enable proxying based on the request URL.

proxy.ts

```
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  frontendApiProxy: {
    // Only proxy on non-production domains
    enabled: (url) => url.hostname !== 'myapp.com',
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes and the proxy path
