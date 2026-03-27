# Source: https://vercel.com/docs/frameworks/nextjs
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# deploy-nextjs — Part 2

    >
      Hello world!
    </div>,
    {
      width: 1200,
      height: 600,
    },
  );
}
```

```ts filename="app/api/og/route.tsx" framework=nextjs-app
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}
```

```js filename="app/api/og/route.jsx" framework=nextjs-app
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.

export async function GET(request) {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Hello world!
    </div>,
    {
      width: 1200,
      height: 600,
    },
  );
}
```

To see your generated image, run `npm run dev` in your terminal and visit the `/api/og` route in your browser (most likely `http://localhost:3000/api/og`).

**To summarize, the benefits of using Vercel OG with Next.js include:**

- Instant, dynamic social card images without needing headless browsers
- Generated images are automatically cached on the Vercel CDN
- Image generation is co-located with the rest of your frontend codebase

[Learn more about OG Image Generation](/docs/og-image-generation)

## Middleware

[Middleware](/docs/routing-middleware) is code that executes before a request is processed. Because Middleware runs before the cache, it's an effective way of providing personalization to statically generated content.

When deploying middleware with Next.js on Vercel, you get access to built-in helpers that expose each request's geolocation information. You also get access to the `NextRequest` and `NextResponse` objects, which enable rewrites, continuing the middleware chain, and more.

See [the Middleware API docs](/docs/routing-middleware/api) for more information.

**To summarize, Middleware with Next.js on Vercel:**

- Runs using [Middleware](/docs/routing-middleware) which are deployed globally
- Replaces needing additional services for customizable routing rules
- Helps you achieve the best performance for serving content globally

[Learn more about Middleware](/docs/routing-middleware)

## Draft Mode

[Draft Mode](/docs/draft-mode) enables you to view draft content from your [Headless CMS](/docs/solutions/cms) immediately, while still statically generating pages in production.

See [our Draft Mode docs](/docs/draft-mode#getting-started) to learn how to use it with Next.js.

### Self-hosting Draft Mode

When self-hosting, every request using Draft Mode hits the Next.js server, potentially incurring extra load or cost. Further, by spoofing the cookie, malicious users could attempt to gain access to your underlying Next.js server.

### Draft Mode security

Deployments on Vercel automatically secure Draft Mode behind the same authentication used for Preview Comments. In order to enable or disable Draft Mode, the viewer must be logged in as a member of the [Team](/docs/teams-and-accounts). Once enabled, Vercel's CDN will bypass the ISR cache automatically and invoke the underlying [Vercel Function](/docs/functions).

### Enabling Draft Mode in Preview Deployments

You and your team members can toggle Draft Mode in the Vercel Toolbar in [production](/docs/vercel-toolbar/in-production-and-localhost/add-to-production), [localhost](/docs/vercel-toolbar/in-production-and-localhost/add-to-localhost), and [Preview Deployments](/docs/deployments/environments#preview-environment-pre-production#comments). When you do so, the toolbar will become purple to indicate Draft Mode is active.

![Image](`/docs-assets/static/docs/workflow-collaboration/draft-mode/draft-toolbar1-light.png`)

Users outside your Vercel team cannot toggle Draft Mode.

**To summarize, the benefits of using Draft Mode with Next.js on Vercel include:**

- Easily server-render previews of static pages
- Adds additional security measures to prevent malicious usage
- Integrates with any headless provider of your choice
- You can enable and disable Draft Mode in [the comments toolbar](/docs/comments/how-comments-work) on Preview Deployments

[Learn more about Draft Mode](/docs/draft-mode)

## Web Analytics

Vercel's Web Analytics features enable you to visualize and monitor your application's performance over time. The Analytics section in your project's dashboard offers detailed insights into your website's visitors, with metrics like top pages, top referrers, and user demographics.

To use Web Analytics, navigate to the Analytics section in your project dashboard sidebar on Vercel and select **Enable** in the modal that appears.

To track visitors and page views, we recommend first installing our `@vercel/analytics` package by running the terminal command below in the root directory of your Next.js project:

<CodeBlock>
  <Code tab="pnpm">
    ```bash
    pnpm i @vercel/analytics
    ```
  </Code>
  <Code tab="yarn">
    ```bash
    yarn i @vercel/analytics
    ```
  </Code>
  <Code tab="npm">
    ```bash
    npm i @vercel/analytics
    ```
  </Code>
  <Code tab="bun">
    ```bash
    bun i @vercel/analytics
    ```
  </Code>
</CodeBlock>

Then, follow the instructions below to add the `Analytics` component to your app either using the `pages` directory or the `app` directory.

> For \['nextjs']:

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

If you are using the `pages` directory, add the following code to your main app file:

```tsx {2, 8} filename="pages/_app.tsx" framework=nextjs
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

```jsx {1, 7} filename="pages/_app.js" framework=nextjs
import { Analytics } from '@vercel/analytics/next';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

> For \['nextjs-app']:

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

Add the following code to the root layout:

```tsx {1, 15} filename="app/layout.tsx" framework=nextjs-app
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

```jsx {1, 11} filename="app/layout.jsx" framework=nextjs-app
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**To summarize, Web Analytics with Next.js on Vercel:**

- Enables you to track traffic and see your top-performing pages
- Offers you detailed breakdowns of visitor demographics, including their OS, browser, geolocation, and more

[Learn more about Web Analytics](/docs/analytics)

## Speed Insights

You can see data about your project's [Core Web Vitals](/docs/speed-insights/metrics#core-web-vitals-explained) performance in your dashboard on Vercel. Doing so will allow you to track your web application's loading speed, responsiveness, and visual stability so you can improve the overall user experience.

On Vercel, you can track your Next.js app's Core Web Vitals in your project's dashboard.

### reportWebVitals

> For \['nextjs-app']:

If you're self-hosting your app, you can use the [`useWebVitals`](https://nextjs.org/docs/advanced-features/measuring-performance#build-your-own) hook to send metrics to any analytics provider. The following example demonstrates a custom `WebVitals` component that you can use in your app's root `layout` file:

```jsx filename="app/_components/web-vitals.jsx" framework=all
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
  });
}
```

```tsx filename="app/_components/web-vitals.tsx" framework=all
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
  });
}
```

You could then reference your custom `WebVitals` component like this:

```ts filename="app/layout.ts" framework=all
import { WebVitals } from './_components/web-vitals';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

```js filename="app/layout.js" framework=all
import { WebVitals } from './_components/web-vitals';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

> For \['nextjs']:

If you're self-hosting your app, you can use the [`reportWebVitals`](https://nextjs.org/docs/advanced-features/measuring-performance#build-your-own) hook to send metrics to any analytics provider. Doing so requires [creating your own custom `app` component file](https://nextjs.org/docs/advanced-features/custom-app).

Then you must export a `reportWebVitals` function from your custom `app` component, as demonstrated below:

```js filename="pages/_app.js" framework=all
export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'FCP':
      // handle FCP results
      break;
    case 'LCP':
      // handle LCP results
      break;
    case 'CLS':
      // handle CLS results
      break;
    case 'FID':
      // handle FID results
      break;
    case 'TTFB':
      // handle TTFB results
      break;
    case 'INP':
      // handle INP results (note: INP is still an experimental metric)
      break;
    default:
      break;
  }
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

```ts filename="pages/_app.ts" framework=all
export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'FCP':
      // handle FCP results
      break;
    case 'LCP':
      // handle LCP results
      break;
    case 'CLS':
      // handle CLS results
      break;
    case 'FID':
      // handle FID results
      break;
    case 'TTFB':
      // handle TTFB results
      break;
    case 'INP':
      // handle INP results (note: INP is still an experimental metric)
      break;
    default:
      break;
  }
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

Next.js uses [Google's `web-vitals` library](https://github.com/GoogleChrome/web-vitals#web-vitals) to measure the Web Vitals metrics available in `reportWebVitals`.

**To summarize, tracking Web Vitals with Next.js on Vercel:**

- Enables you to track traffic performance metrics, such as [First Contentful Paint](/docs/speed-insights/metrics#first-contentful-paint-fcp), or [First Input Delay](/docs/speed-insights/metrics#first-input-delay-fid)
- Enables you to view performance analytics by page name and URL for more granular analysis
- Shows you [a score for your app's performance](/docs/speed-insights/metrics#how-the-scores-are-determined) on each recorded metric, which you can use to track improvements or regressions

[Learn more about Speed Insights](/docs/speed-insights)

## Service integrations

Vercel has partnered with popular service providers, such as MongoDB and Sanity, to create integrations that make using those services with Next.js easier. There are many integrations across multiple categories, such as [Commerce](/integrations#commerce), [Databases](/integrations#databases), and [Logging](/integrations#logging).

**To summarize, Integrations on Vercel:**

- Simplify the process of connecting your preferred services to a Vercel project
- Help you achieve the optimal setup for a Vercel project using your preferred service
- Configure your environment variables for you

[Learn more about Integrations](/integrations)

## More benefits

See [our Frameworks documentation page](/docs/frameworks) to learn about the benefits available to **all** frameworks when you deploy on Vercel.

## More resources

Learn more about deploying Next.js projects on Vercel with the following resources:

- [Build a fullstack Next.js app](/kb/guide/nextjs-prisma-postgres)
- [Build a multi-tenant app](/docs/multi-tenant)
- [Next.js with Contenful](/kb/guide/integrating-next-js-and-contentful-for-your-headless-cms)
- [Next.js with Stripe Checkout and Typescript](/kb/guide/getting-started-with-nextjs-typescript-stripe)
- [Next.js with Magic.link](/kb/guide/add-auth-to-nextjs-with-magic)
- [Generate a sitemap with Next.js](/kb/guide/how-do-i-generate-a-sitemap-for-my-nextjs-app-on-vercel)
- [Next.js ecommerce with Shopify](/kb/guide/deploying-locally-built-nextjs)
- [Deploy a locally built Next.js app](/kb/guide/deploying-locally-built-nextjs)
- [Deploying Next.js to Vercel](https://www.youtube.com/watch?v=AiiGjB2AxqA)
- [Learn about combining static and dynamic rendering on the same page in Next.js 14](https://www.youtube.com/watch?v=wv7w_Zx-FMU)
- [Learn about suspense boundaries and streaming when loading your UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)


---

[View full sitemap](/docs/sitemap)
