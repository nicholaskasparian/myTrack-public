# Source: https://v2.tauri.app/start/frontend/nextjs/
# Last fetched: 2026-03-27T18:45:30.652592+00:00

Next.js is a meta framework for React. Learn more at https://nextjs.org.
This guide is accurate as of Next.js 14.2.3.

- Use static exports by setting `output: "export"`; Tauri does not support server-based solutions.
- Use the `out` directory as `frontendDist` in `tauri.conf.json`.

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:3000",
    "frontendDist": "../out"
  }
}
```

```ts
const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
};

export default nextConfig;
```

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "tauri": "tauri"
  }
}
```

© 2026 Tauri Contributors. CC-BY / MIT
