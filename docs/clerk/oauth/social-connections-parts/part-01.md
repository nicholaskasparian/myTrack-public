# Source: https://clerk.com/docs/authentication/social-connections/overview
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# social-connections — Part 1


# Social connections (OAuth)

1. [Before you start](#before-you-start)
2. [Enable a social connection](#enable-a-social-connection)
   1. [Development instances](#development-instances)
   2. [Production instances](#production-instances)
3. [Configure additional OAuth scopes](#configure-additional-o-auth-scopes)
4. [Request additional OAuth scopes after sign-up](#request-additional-o-auth-scopes-after-sign-up)
5. [Get an OAuth access token for a social provider](#get-an-o-auth-access-token-for-a-social-provider)
6. [Add a social connection after sign-up](#add-a-social-connection-after-sign-up)
7. [Connecting to social providers while signed in](#connecting-to-social-providers-while-signed-in)
8. [OAuth for native applications](#o-auth-for-native-applications)
9. [OAuth for Apple native applications](#o-auth-for-apple-native-applications)
10. [Supported social providers](#supported-social-providers)

Copy as markdownCopy as markdownOpenOpen

Social connections, also known as OAuth connections in Clerk, allow users to gain access to your application by using their existing credentials from an Identity Provider (IdP), like Google or Microsoft. For example, if you enable Google as a social provider, then when a user wants to sign in to your application, they can select Google and use their Google account to sign in.

Note

When using social connections, the sign-up and sign-in flows are equivalent. If a user doesn't have an account and tries to sign in, an account will be made for them, and vice versa.

The easiest way to add social connections to your Clerk app is by using [prebuilt components](/docs/reference/components/overview). If prebuilt components don't meet your specific needs or if you require more control over the logic, you can [rebuild the existing Clerk flows using the Clerk API](/docs/guides/development/custom-flows/authentication/oauth-connections).

## [Before you start](#before-you-start)

* You need to create a Clerk application in the [Clerk Dashboard⁠](https://dashboard.clerk.com/). For more information, check out the [setup guide](/docs/getting-started/quickstart/setup-clerk).
* You need to install the correct SDK for your application. For more information, see the [quickstart guides](/docs/getting-started/quickstart/overview).

## [Enable a social connection](#enable-a-social-connection)

### [Development instances](#development-instances)

For **development** instances, Clerk uses **pre-configured shared** OAuth credentials and redirect URIs to make the development flow as smooth as possible. This means that you can enable most social providers **without additional configuration**.

To enable a social connection:

1. In the Clerk Dashboard, navigate to the [**SSO connections**⁠](https://dashboard.clerk.com/~/user-authentication/sso-connections) page.
2. Select the **Add connection** button, and select **For all users**.
3. Select the provider you want to use.

### [Production instances](#production-instances)

For **production** instances, you will need to configure the provider with custom OAuth credentials. See the social provider's [dedicated guide](/docs/guides/configure/auth-strategies/social-connections/overview) for more information.

## [Configure additional OAuth scopes](#configure-additional-o-auth-scopes)

Each OAuth provider requires a specific set of scopes that are necessary for proper authentication with Clerk. These essential scopes are pre-configured and automatically included by Clerk. They typically include permissions for basic profile information and email access, which are fundamental for user authentication and account creation.

In addition to the core scopes, you can specify additional scopes supported by the provider. These scopes can be used to access additional user data from the provider.

To add additional OAuth scopes, when you are [enabling a new social connection](#enable-a-social-connection), enable **Use custom credentials**. The **Scopes** field will appear.

## [Request additional OAuth scopes after sign-up](#request-additional-o-auth-scopes-after-sign-up)

Clerk allows you to request additional OAuth scopes even after a user has signed up.

Pass the [additionalOAuthScopes](/docs/reference/components/user/user-profile) prop to the [<UserProfile/>](/docs/reference/components/user/user-profile) or [<UserButton />](/docs/reference/components/user/user-button) component, with any additional OAuth scope you would like per provider. The user will be prompted to reconnect their account on their user profile page.

Use the following tabs to see how to add additional OAuth scopes to the `<UserProfile/>` and `<UserButton/>` components.

<UserProfile />

<UserButton />

app/page.tsx

```
<UserProfile
  additionalOAuthScopes={{
    google: ['foo', 'bar'],
    github: ['qux'],
  }}
/>
```

app/page.tsx

```
<UserButton
  userProfileProps={{
    additionalOAuthScopes: {
      google: ['foo', 'bar'],
      github: ['qux'],
    },
  }}
/>
```

## [Get an OAuth access token for a social provider](#get-an-o-auth-access-token-for-a-social-provider)

You can use a social provider's OAuth access token⁠ to access user data from that provider in addition to their data from Clerk.

Use the [`getUserOauthAccessToken()`](/docs/reference/backend/user/get-user-oauth-access-token) method to get the user's OAuth access token. **This method must be used in a server environment, and cannot be run on the client.**

Note

Clerk does not automatically keep OAuth access tokens fresh behind the scenes. When you request an access token using [the relevant backend API endpoint⁠](/docs/reference/backend-api/tag/oauth-access-tokens/post/oauth_applications/access_tokens/verify), Clerk will attempt to obtain a fresh access token as well as a new refresh token. However, this process occurs only when you initiate the request; Clerk does not proactively refresh tokens on your behalf.

The following example demonstrates how to retrieve the OAuth access token for a user and use it to fetch user data from the Notion API. It assumes:

* You have already [enabled the Notion social connection in the Clerk Dashboard](/docs/guides/configure/auth-strategies/social-connections/notion).
* The user has already connected their Notion account to your application.
* The user has the correct permissions to access the Notion API.

**If your SDK isn't listed, you can use the comments in the example to help you adapt it to your SDK.**

Next.js

Astro

Express

JS Backend SDK

React Router

TanStack React Start

app/api/notion/route.tsx

```
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, userId } = await auth()

  // Protect the route from unauthenticated users
  if (!isAuthenticated) {
    return NextResponse.json({ message: 'User not found' })
  }

  const provider = 'notion'

  // Initialize the JS Backend SDK
  // This varies depending on the SDK you're using
  // https://clerk.com/docs/js-backend/getting-started/quickstart
  const client = await clerkClient()

  // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
  const clerkResponse = await client.users.getUserOauthAccessToken(userId, provider)
  const accessToken = clerkResponse.data[0].token || ''
  if (!accessToken) {
    return NextResponse.json({ message: 'Access token not found' }, { status: 401 })
  }

  // Fetch the user data from the Notion API
  // This endpoint fetches a list of users
  // https://developers.notion.com/reference/get-users
  const notionUrl = 'https://api.notion.com/v1/users'

  const notionResponse = await fetch(notionUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  // Handle the response from the Notion API
  const notionData = await notionResponse.json()

  return NextResponse.json({ message: notionData })
}
```

src/api/notion.ts

```
import { clerkClient } from '@clerk/astro/server'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (context) => {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, userId } = context.locals.auth()

  // Protect the route from unauthenticated users
  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 })
  }

  const provider = 'notion'

  // Initialize the JS Backend SDK
  // This varies depending on the SDK you're using
  // https://clerk.com/docs/js-backend/getting-started/quickstart
  // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
  const clerkResponse = await clerkClient(context).users.getUserOauthAccessToken(userId, provider)
  const accessToken = clerkResponse.data[0].token || ''
  if (!accessToken) {
    return new Response('Access token not found', { status: 401 })
  }

  // Fetch the user data from the Notion API
  // This endpoint fetches a list of users
  // https://developers.notion.com/reference/get-users
  const notionUrl = 'https://api.notion.com/v1/users'

  const notionResponse = await fetch(notionUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  // Handle the response from the Notion API
  const notionData = await notionResponse.json()

  // Return the Notion data
  return new Response(JSON.stringify({ notionData }))
}
```

notion.js

```
import { createClerkClient, getAuth } from '@clerk/express'
import express from 'express'

const app = express()
// Initialize the JS Backend SDK
// This varies depending on the SDK you're using
// https://clerk.com/docs/js-backend/getting-started/quickstart
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

app.get('/user', async (req, res) => {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, userId } = getAuth(req)

  // Protect the route from unauthenticated users
  if (!isAuthenticated) {
    res.status(401).json({ error: 'User not authenticated' })
  }

  const provider = 'notion'

  // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, provider)
  const accessToken = clerkResponse.data[0].token || ''
  if (!accessToken) {
    res.status(401).json({ error: 'Access token not found' })
  }

  // Fetch the user data from the Notion API
  // This endpoint fetches a list of users
  // https://developers.notion.com/reference/get-users
  const notionUrl = 'https://api.notion.com/v1/users'

  const notionResponse = await fetch(notionUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  // Handle the response from the Notion API
  const notionData = await notionResponse.json()

  // Return the Notion data
  res.json(notionData)
})
```

```
import { createClerkClient } from '@clerk/backend'

// Initialize the JS Backend SDK
// This varies depending on the SDK you're using
// https://clerk.com/docs/js-backend/getting-started/quickstart
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

async function getNotionData(request) {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, userId } = request.auth

  // Protect the route from unauthenticated users
  if (!isAuthenticated) {
    return null
  }

  // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
  const provider = 'notion'
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, provider)
  const accessToken = clerkResponse.data[0].token || ''
  if (!accessToken) {
    return null
  }

  // Fetch the user data from the Notion API
  // This endpoint fetches a list of users
  // https://developers.notion.com/reference/get-users
  const notionUrl = 'https://api.notion.com/v1/users'

  const notionResponse = await fetch(notionUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  // Handle the response from the Notion API
  const notionData = await notionResponse.json()

  // Return the Notion data
  return notionData
}
```

app/routes/notion.tsx

```
import { getAuth } from '@clerk/react-router/ssr.server'
import { createClerkClient } from '@clerk/react-router/server'
import type { Route } from './+types/notion'

// Initialize the JS Backend SDK
// This varies depending on the SDK you're using
// https://clerk.com/docs/js-backend/getting-started/quickstart
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export async function loader(args: Route.LoaderArgs) {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, userId } = await getAuth(args)

  // Protect the route from unauthenticated users
  if (!isAuthenticated) {
    return new Response('User not authenticated', {
      status: 404,
    })
  }

  const provider = 'notion'

  // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, provider)
  const accessToken = clerkResponse.data[0].token || ''
  if (!accessToken) {
    return new Response('Access token not found', {
      status: 401,
    })
  }

  // Fetch the user data from the Notion API
  // This endpoint fetches a list of users
  // https://developers.notion.com/reference/get-users
  const notionUrl = 'https://api.notion.com/v1/users'

  const notionResponse = await fetch(notionUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  // Handle the response from the Notion API
  const notionData = await notionResponse.json()

  // Return the Notion data
  return json({ notionData })
}
```

app/routes/api/notion.tsx

```
import { json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { auth, clerkClient } from '@clerk/tanstack-react-start/server'

export const ServerRoute = createFileRoute('/api/notion')({
  server: {
    handlers: {
      GET: async () => {
        // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
        // Accessing the `Auth` object differs depending on the SDK you're using
        // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
        const { isAuthenticated, userId } = await auth()

        // Protect the route from unauthenticated users
        if (!isAuthenticated) {
          return new Response('User not authenticated', {
            status: 404,
          })
        }

        const provider = 'notion'

        // Initialize the JS Backend SDK
        // This varies depending on the SDK you're using
        // https://clerk.com/docs/js-backend/getting-started/quickstart
        // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
        const clerkResponse = await clerkClient().users.getUserOauthAccessToken(userId, provider)
        const accessToken = clerkResponse.data[0].token || ''
        if (!accessToken) {
          return new Response('Access token not found', {
            status: 401,
          })
        }

        // Fetch the user data from the Notion API
        // This endpoint fetches a list of users
        // https://developers.notion.com/reference/get-users
        const notionUrl = 'https://api.notion.com/v1/users'

        const notionResponse = await fetch(notionUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Notion-Version': '2022-06-28',
          },
        })

        // Handle the response from the Notion API
        const notionData = await notionResponse.json()

        return json(notionData)
      },
    },
  },
})
```

## [Add a social connection after sign-up](#add-a-social-connection-after-sign-up)

For each social provider, you can disable the option to sign up and sign in to your application using the provider. This is especially useful for users that want to connect their OAuth account *after* authentication.

For example, say your application wants to read a user's GitHub repository data but doesn't want to allow the user to authenticate with their GitHub account. The user can sign up with their email and password, or whatever authentication method you choose, and then afterwards, connect their GitHub account to your application through their user profile. The easiest way to enable this for your users is by using the [<UserProfile />](/docs/reference/components/user/user-profile) component. If you prefer to build a custom user interface, see how to [build a social connection flow using the Clerk API](/docs/guides/development/custom-flows/authentication/oauth-connections).

To configure the option for users to sign up and sign in with a social provider:

1. In the Clerk Dashboard, navigate to the [**SSO connections**⁠](https://dashboard.clerk.com/~/user-authentication/sso-connections) page.
2. Select the social provider you want to configure.
3. Enable or disable **Enable for sign-up and sign-in**.
4. Save the changes.

## [Connecting to social providers while signed in](#connecting-to-social-providers-while-signed-in)

When signed in, a user can connect to further social providers. There is no need to perform another sign-up.
