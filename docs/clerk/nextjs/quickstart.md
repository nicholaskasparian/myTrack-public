# Source: https://clerk.com/docs/quickstarts/nextjs
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# Next.js Quickstart (App Router)

1. [Create a new Next.js app](#create-a-new-next-js-app)
2. [Install `@clerk/nextjs`](#install-clerk-nextjs)
3. [Set your Clerk API keys](#set-your-clerk-api-keys)
4. [Add `clerkMiddleware()` to your app](#add-clerk-middleware-to-your-app)
5. [Add `<ClerkProvider>` and Clerk components to your app](#add-clerk-provider-and-clerk-components-to-your-app)
6. [Run your project](#run-your-project)
7. [Create your first user](#create-your-first-user)
8. [Next steps](#next-steps)

Available in other SDKs

[![](data:image/webp;base64,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)](/docs/tanstack-react-start/getting-started/quickstart)

Use this pre-built prompt to get started faster.

Open in CursorOpen in Cursor

Open in CursorOpen in Cursor

Copy promptCopy prompt

Copy promptCopy prompt

## Example repository

* [Next.js App Router Quickstart Repo](https://github.com/clerk/clerk-nextjs-app-quickstart)

## [Create a new Next.js app](#create-a-new-next-js-app)

If you don't already have a Next.js app, run the following commands to [create a new one⁠](https://nextjs.org/docs/getting-started/installation).

npm

pnpm

yarn

bun

terminal

```
npm create next-app@latest clerk-nextjs -- --yes
cd clerk-nextjs
npm install
```

terminal

```
pnpm create next-app clerk-nextjs --yes
cd clerk-nextjs
pnpm install
```

terminal

```
yarn create next-app clerk-nextjs --yes
cd clerk-nextjs
yarn install
```

terminal

```
bunx create-next-app clerk-nextjs --yes
cd clerk-nextjs
bun install
```

## [Install `@clerk/nextjs`](#install-clerk-nextjs)

The [Clerk Next.js SDK](/docs/reference/nextjs/overview) gives you access to prebuilt components, hooks, and helpers to make user authentication easier.

Run the following command to install the SDK:

npm

pnpm

yarn

bun

terminal

```
npm install @clerk/nextjs
```

terminal

```
pnpm add @clerk/nextjs
```

terminal

```
yarn add @clerk/nextjs
```

terminal

```
bun add @clerk/nextjs
```

## [Set your Clerk API keys](#set-your-clerk-api-keys)

Add the following keys to your `.env` file. These keys can always be retrieved from the [**API keys**⁠](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.

.env

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

## [Add `clerkMiddleware()` to your app](#add-clerk-middleware-to-your-app)

[clerkMiddleware()](/docs/reference/nextjs/clerk-middleware) grants you access to user authentication state throughout your app. It also allows you to protect specific routes from unauthenticated users. To add `clerkMiddleware()` to your app, follow these steps:

Important

If you're using Next.js ≤15, name your file `middleware.ts` instead of `proxy.ts`. The code itself remains the same; only the filename changes.

1. Create a `proxy.ts` file.

   * If you're using the `/src` directory, create `proxy.ts` in the `/src` directory.
   * If you're not using the `/src` directory, create `proxy.ts` in the root directory.
2. In your `proxy.ts` file, export the `clerkMiddleware()` helper:

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
3. By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes. See the [clerkMiddleware() reference](/docs/reference/nextjs/clerk-middleware) to learn how to require authentication for specific routes.

## [Add `<ClerkProvider>` and Clerk components to your app](#add-clerk-provider-and-clerk-components-to-your-app)

The [<ClerkProvider>](/docs/reference/components/clerk-provider) component provides session and user context to Clerk's hooks and components. It's recommended to wrap your entire app at the entry point with `<ClerkProvider>` to make authentication globally accessible. See the [reference docs](/docs/reference/components/clerk-provider) for other configuration options.

Copy and paste the following code into your `layout.tsx` file. This:

* Adds the `<ClerkProvider>` component to your app's layout, providing Clerk's authentication context to your app.
* Creates a header with Clerk's [prebuilt components](/docs/reference/components/overview) to allow users to sign in and out, and display different content for signed-in and signed-out users.

app/layout.tsx

```
import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

14 lines collapsedconst geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Clerk Next.js Quickstart',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
```

This example uses the following components:

* [<Show when="signed-in">](/docs/reference/components/control/show): Children of this component can only be seen while **signed in**.
* [<Show when="signed-out">](/docs/reference/components/control/show): Children of this component can only be seen while **signed out**.
* [<UserButton />](/docs/reference/components/user/user-button): Shows the signed-in user's avatar. Selecting it opens a dropdown menu with account management options.
* [<SignInButton />](/docs/reference/components/unstyled/sign-in-button): An unstyled component that links to the sign-in page. In this example, since no props or [environment variables](/docs/guides/development/clerk-environment-variables) are set for the sign-in URL, this component links to the [Account Portal sign-in page](/docs/guides/account-portal/overview#sign-in).
* [<SignUpButton />](/docs/reference/components/unstyled/sign-up-button): An unstyled component that links to the sign-up page. In this example, since no props or [environment variables](/docs/guides/development/clerk-environment-variables) are set for the sign-up URL, this component links to the [Account Portal sign-up page](/docs/guides/account-portal/overview#sign-up).

## [Run your project](#run-your-project)

Run your project with the following command:

npm

pnpm

yarn

bun

terminal

```
npm run dev
```

terminal

```
pnpm run dev
```

terminal

```
yarn dev
```

terminal

```
bun run dev
```

## [Create your first user](#create-your-first-user)

1. Visit your app's homepage at [http://localhost:3000⁠](http://localhost:3000).
2. Select "Sign up" on the page and authenticate to create your first user.

Important

To make configuration changes to your Clerk development instance, claim the Clerk keys that were generated for you by selecting **Configure your application** in the bottom right of your app. This will associate the application with your Clerk account.

## [Next steps](#next-steps)

Learn more about Clerk components, how to build custom authentication flows, and how to use Clerk's client-side helpers using the following guides.

### [Prebuilt components](/docs/reference/components/overview)

Learn how to quickly add authentication to your app using Clerk's suite of components.

### [Create a custom sign-in-or-up page](/docs/nextjs/guides/development/custom-sign-in-or-up-page)

Learn how to create a custom sign-in-or-up page with Clerk components.

### [Protect content and read user data](/docs/nextjs/guides/users/reading)

Learn how to use Clerk's hooks and helpers to protect content and read user data in your Next.js app.

### [Get started with Organizations](/docs/nextjs/guides/organizations/getting-started)

Learn how to create and manage Organizations in your Next.js app.

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/getting-started/quickstart.mdx)
