# myTrack

**Personalized music generation built around your listening history.**

**Solo project · UCLA hackathon — Honorable Mention**

myTrack connects a Spotify listening profile to a multi-step AI workflow that generates original songs, artwork, and a personal music library.

## What it does

- Builds a listening profile from Spotify tracks and artists.
- Generates song concepts, lyrics, music, and cover art using Gemini and Lyria.
- Lets users play, rate, organize, search, and share generated tracks.
- Supports semantic song search with embeddings and pgvector, with text-search fallback when vector search is unavailable.

## Engineering

- **App:** Next.js, React, TypeScript
- **Authentication and Spotify connection:** Clerk
- **Data and files:** Supabase Postgres and Storage
- **AI pipeline:** Gemini for ideas, prompts, artwork, and embeddings; Lyria for music

The main technical challenge is coordinating several model and API calls while keeping generated assets, song metadata, playback, and user data consistent. Authentication is checked server-side in API routes; privileged database access stays on the server.

## Local setup

The full app needs configured Gemini, Clerk (including Spotify OAuth), and Supabase services and schema.

```bash
cd app
npm install
npm run dev
```

Set the relevant Clerk keys, `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `app/.env.local`. Do not commit secrets. Open `http://localhost:3000`.

Implementation lives in [`app/`](app/). API and platform reference material lives in [`docs/`](docs/).
