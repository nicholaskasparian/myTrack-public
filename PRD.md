# myTrack — Product Requirements Document (v3)
*Built for the Build With Gemini Hackathon*

---

## 1. Product Overview

**myTrack** is a hyper-personalized AI music generation platform. It connects to your Spotify account, analyzes your listening history to build a **Sound Profile** — a quantitative fingerprint of your musical taste — and uses that profile to generate original full-length songs tailored specifically to you. Every track is unique: composed by AI at studio quality, scored by your actual listening habits, paired with generated cover art, and semantically searchable.

**GenMedia models used:**
- **Lyria 3 Pro Preview** (`lyria-3-pro-preview`) — full-song music generation, 2m45s–3m, 48kHz stereo, with lyrics returned as TEXT modality
- **Nano Banana** — cover art generation (image, optimized for accurate text and visual style)

**Supporting Gemini models:**
- **Gemini 3 Flash** — song concept generation, vibe description generation (cheap, fast)
- **Gemini 3.1 Pro** — full Lyria prompt engineering from the chosen concept
- **Gemini Embedding 2** — semantic embedding for library search (lyria prompt + AI vibe + Lyria lyrics)

**Stack:** Next.js 14 (React), deployed on Vercel. Inline styles only (no CSS framework). Auth via **Clerk** with Spotify OAuth. **Supabase** for Postgres (with `pgvector` for semantic search) + Storage (audio + cover art).

---

## 2. Core User Flow

### Onboarding

1. User arrives at `/` — landing page with hero copy and "Connect Spotify" CTA
2. Signs up / signs in via Clerk (Google, email, or GitHub)
3. Connects Spotify via OAuth (Clerk OAuth connection, scopes: `user-top-read`, `user-read-recently-played`)
4. `/api/spotify/sync` fires immediately: pulls top tracks (short/medium/long-term) + audio features + top artists + recently played → builds initial Sound Profile → stored in Supabase
5. Redirected to `/dashboard`

### Generation Flow

6. User clicks **Generate** from dashboard or `/generate`
7. Optional: user types a mood or occasion hint (e.g. "late night drive", "studying", "hype workout") — or leaves blank for fully automatic
8. `/api/generate/ideas` call (Gemini 3 Flash, ~3s): returns 3 song concepts tailored to their Sound Profile
9. Concepts displayed as cards — user picks one (or auto-selects #1 after 5s)
10. `/api/generate/prompt` (Gemini 3.1 Pro) + `/api/generate/music` (Lyria 3 Pro) + `/api/generate/cover` (Nano Banana) fire for the selected concept
11. Song lands in the player — playable immediately, auto-saved to library. Lyria returns TEXT modality (lyrics + structure) alongside audio — stored in DB.
12. **Background, after song loads:** vibe description generated via Gemini 3 Flash → song embedded via Gemini Embedding 2 → stored in `songs.embedding` pgvector column. Queue pre-generation fires simultaneously (see §6.6).
13. After the song finishes (or after 20s), a **rating prompt** appears: slide to rate 0–10 (see §8)

### Discovery & Library

14. `/library` shows all generated songs — grid of cards with cover art, title, vibe, rating badge, timestamp. **Search bar** at top for semantic library search.
15. Songs are playable inline. Play events + ratings feed back into Sound Profile on next sync
16. Songs can be saved to **Playlists** (see §9). Playlists can be made public with a share link.
17. `/playlists/[id]` — public or private playlist page with ordered song list + player

---

## 3. Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, "Enter the web app" CTA, feature callouts |
| `/dashboard` | Sound Profile overview, listening stats, Generate button |
| `/generate` | Full-screen generation flow (concept picker → progress → player → queue) |
| `/library` | User's generated song grid + semantic search bar |
| `/playlists` | User's playlist index |
| `/playlists/[id]` | Playlist detail — ordered song list, public or private |
| `/sign-in` | Clerk-hosted sign-in |
| `/sign-up` | Clerk-hosted sign-up |
| `/share/[id]` | Public read-only song player + cover |
| `/api/spotify/sync` | Pull Spotify data → compute + store Sound Profile |
| `/api/generate/ideas` | Gemini 3 Flash → 3 song concepts (JSON) |
| `/api/generate/prompt` | Gemini 3.1 Pro → Lyria prompt string |
| `/api/generate/music` | Lyria 3 Pro → audio + lyrics → upload to Supabase Storage |
| `/api/generate/cover` | Nano Banana → cover art → upload to Supabase Storage |
| `/api/generate/queue` | Pre-generate next 3 songs into queue (background) |
| `/api/generate/embed` | Gemini 3 Flash vibe generation + Gemini Embedding 2 → store vector |
| `/api/songs` | CRUD for generated songs |
| `/api/songs/search` | Semantic search via pgvector cosine similarity |
| `/api/songs/[id]/play` | Record play event to `play_history` |
| `/api/songs/[id]/rate` | Submit 0–10 rating |
| `/api/playlists` | CRUD for playlists |
| `/api/playlists/[id]/songs` | Add/remove/reorder songs in a playlist |

---

## 4. UI Layout

### 4.1 Landing Page (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ◈ myTrack                                        [Sign In]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│         Music made for you.                                      │
│         Not the algorithm. You.                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Enter the web app →                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Your listening history → Your Sound Profile → Your songs        │
└──────────────────────────────────────────────────────────────────┘
```

- "Enter the web app →" — full-width filled black button. Routes to `/dashboard` if authenticated, `/sign-up` if not.
- No rounded corners. IBM Plex Sans.
- 1px border grid separating hero from feature strip.

### 4.2 Dashboard (`/dashboard`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ◈ myTrack    [Library]  [Playlists]  [Sync ↻]  [<UserButton />]   │
├──────────────────────────────────────────────────────────────────┤
│  YOUR SOUND PROFILE                  RECENT SONGS                │
│  ┌────────────────────────────┐      ┌──────────────────────┐   │
│  │  Genre: Lo-fi, Indie Pop   │      │  [cover] Song Title  │   │
│  │  Energy: ████░░  62%       │      │  [cover] Song Title  │   │
│  │  Valence: ███░░  48%       │      │  [cover] Song Title  │   │
│  │  BPM: 94 avg               │      └──────────────────────┘   │
│  │  Danceability: ██████ 81%  │                                  │
│  │  Top artists: ...          │      [Generate New Song →]       │
│  └────────────────────────────┘                                  │
│                                                                  │
│  [Sync Spotify]  Last synced: 2h ago                            │
└──────────────────────────────────────────────────────────────────┘
```

- Sound Profile panel: bar charts for each audio feature dimension (inline SVG, no chart library)
- Top 3 genres shown as pills (1px border, no fill)
- Recent songs: last 3 generated, each with cover thumbnail + title + vibe tag + star rating if rated

### 4.3 Generate Page (`/generate`)

Three sequential states rendered in place:

**State 1 — Concept Picker**
```
┌──────────────────────────────────────────────────────────────────┐
│  Based on your Sound Profile, pick a direction:                  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │ "Dusk Commute" │  │ "Static Bloom" │  │ "Low Current"  │    │
│  │ Lo-fi / 88 BPM │  │ Indie / 96 BPM │  │ Ambient / 72 BPM│   │
│  │ Melancholic    │  │ Warm, layered  │  │ Focus, minimal │    │
│  │ [Select]       │  │ [Select]       │  │ [Select]       │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                  │
│  [Optional mood hint ________________________]  [Regenerate]     │
└──────────────────────────────────────────────────────────────────┘
```

**State 2 — Generating**
```
┌──────────────────────────────────────────────────────────────────┐
│  Crafting your song...                                           │
│                                                                  │
│  ✓  Song concept selected: "Dusk Commute"                       │
│  ✓  Lyria prompt engineered                                      │
│  ●  Composing with Lyria...  ████████░░░░░░  58%                │
│  ○  Generating cover art...                                      │
└──────────────────────────────────────────────────────────────────┘
```

**State 3 — Player + Rating**
```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────┐   "Dusk Commute"                                   │
│  │ [cover]  │   Lo-fi · 88 BPM · 0:30                           │
│  │          │   Generated for you                                │
│  └──────────┘   [▶ Play]  [+ Playlist]  [↗ Share]               │
│                                                                  │
│  ─────────────────────────────── 0:00 / 0:30                   │
│                                                                  │
│  ┌─── Rate this song ───────────────────────────────────────┐   │
│  │  ○─────────────────────────────○  7 / 10                 │   │
│  │  [Skip rating]                    [Submit →]             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  UP NEXT (3 ready)                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ [cover]  │  │ [cover]  │  │ [cover]  │                      │
│  │ Title    │  │ Title    │  │ Title    │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                          [Skip→] │
└──────────────────────────────────────────────────────────────────┘
```

- Rating prompt appears automatically after song ends (or after 20s of playback)
- Slider: 0–10, integer steps, custom styled horizontal bar — not native `<input type="range">`
- "Skip rating" dismisses without recording; rating is optional
- Queue shows next 3 pre-generated songs as mini cards. [Skip →] plays next immediately.
- Queue cards show cover + title only. Generating indicator (animated dots) if a slot is still generating.

### 4.4 Library Page (`/library`)

```
┌──────────────────────────────────────────────────────────────────┐
│  YOUR SONGS                                    24 songs          │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🔍  Search your songs by vibe, mood, lyrics...        │     │
│  └────────────────────────────────────────────────────────┘     │
├──────────────────────────────────────────────────────────────────┤
│  [song card]  [song card]  [song card]  [song card]             │
│  [song card]  [song card]  [song card]  [song card]             │
└──────────────────────────────────────────────────────────────────┘
```

4-column song card grid (4-col desktop, 2-col tablet):
- Cover art (square, Supabase Storage CDN)
- Title (max 30 chars)
- Genre + BPM badge
- Rating badge ("7/10", omitted if unrated)
- Relative timestamp
- [▶ Play] [+ Playlist] [↗ Share] [🗑 Delete] actions

Clicking cover or title opens inline player in the card (expands with custom scrubber).

**Search:** 1px border input at top of page. Debounce 300ms. On input: POST to `/api/songs/search` with the query string → returns re-ranked song list → grid re-renders. Showing search results replaces the default grid; clearing the input restores it. Search results show a muted "X results for 'late night vibe'" count below the input.

Empty state: "No songs yet. Generate →"

### 4.5 Playlists Page (`/playlists`)

```
┌──────────────────────────────────────────────────────────────────┐
│  YOUR PLAYLISTS                             [+ New Playlist]     │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────┐                 │
│  │ [4-cover mosaic]   │  │ [4-cover mosaic]   │                 │
│  │ Late Night Drives  │  │ Study Sessions     │                 │
│  │ 12 songs · Public  │  │ 8 songs · Private  │                 │
│  │ [Open] [↗ Share]   │  │ [Open]             │                 │
│  └────────────────────┘  └────────────────────┘                 │
└──────────────────────────────────────────────────────────────────┘
```

- Playlist card cover: 2×2 mosaic of the first 4 song covers (or fewer if less than 4 songs)
- Public playlists show [↗ Share] button; private show lock icon
- [+ New Playlist] → inline modal: name input + private/public toggle

### 4.6 Playlist Detail (`/playlists/[id]`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Late Night Drives                       [Edit] [↗ Share] [🗑]  │
│  12 songs · Public · Created Mar 2025                           │
├──────────────────────────────────────────────────────────────────┤
│  [▶ Play All]                                                    │
│  ──────────────────────────────────────────────────────────────  │
│  1  [cover]  Dusk Commute      Lo-fi · 88 BPM  7/10  [⠿] [🗑]  │
│  2  [cover]  Static Bloom      Indie · 96 BPM  9/10  [⠿] [🗑]  │
│  3  [cover]  Low Current       Ambient · 72 BPM  —   [⠿] [🗑]  │
│  ...                                                             │
└──────────────────────────────────────────────────────────────────┘
```

- Songs are drag-reorderable via [⠿] handle (mouse only — no touch drag required)
- [🗑] removes song from playlist (does not delete the song from library)
- [▶ Play All] plays songs sequentially using the inline player
- Public playlist: visible to anyone with the link, no auth required, no edit controls shown

---

## 5. Sound Profile Algorithm

The Sound Profile is a JSON object stored per-user in Supabase. Rebuilt on every Spotify sync.

### 5.1 Spotify Data Pulled

| Endpoint | Term | Limit |
|---|---|---|
| `GET /me/top/tracks` | `short_term` (4 weeks) | 50 |
| `GET /me/top/tracks` | `medium_term` (6 months) | 50 |
| `GET /me/top/tracks` | `long_term` (all time) | 50 |
| `GET /me/top/artists` | `medium_term` | 50 |
| `GET /me/player/recently-played` | — | 50 |
| `GET /audio-features` | batch of all top track IDs | — |

### 5.2 Computation

For each audio feature dimension (`tempo`, `energy`, `valence`, `danceability`, `acousticness`, `instrumentalness`, `speechiness`, `liveness`):

```
weighted_avg = (short_avg × 0.5) + (medium_avg × 0.35) + (long_avg × 0.15)
```

Short-term is weighted heaviest — the Sound Profile should reflect *current* taste, not just all-time.

**Genre extraction:** flatten all artists' `genres` arrays → frequency count → top 5 genres by count.

**Time-of-day pattern** (from `recently-played` timestamps):
- Bin play events into Morning (6–12), Afternoon (12–18), Evening (18–24), Night (0–6)
- Output: dominant listening window (e.g. `"evening"`)

**In-platform history:** pull `play_history` and `song_ratings` rows for this user → extract genre/vibe/feature signals from played and highly-rated songs → apply as additive modifiers to the profile:

- **Play count modifier:** for each myTrack song played, add 0.1 × (feature values from that song's `concept_json`) to the relevant feature averages. Cap total myTrack influence at 20% of final profile weight.
- **Rating modifier:** ratings 8–10 → treated as a strong positive signal (weight ×1.5 on that song's feature contribution). Ratings 0–4 → negative signal (subtract 0.05 × feature values). Ratings 5–7 → neutral (standard play weight).
- **Resurfacing:** songs rated 8+ have a `resurface: true` flag set in the `songs` table. These songs are included as one of the 3 concepts shown in the next generation cycle — the user's queue will occasionally include a regeneration of a highly-rated concept with a fresh Lyria generation (same concept parameters, new generation). Max 1 resurfaced concept per 5 generations.

### 5.3 Sound Profile Schema

```json
{
  "user_id": "...",
  "synced_at": "...",
  "features": {
    "tempo": 94.2,
    "energy": 0.62,
    "valence": 0.48,
    "danceability": 0.81,
    "acousticness": 0.31,
    "instrumentalness": 0.22,
    "speechiness": 0.05,
    "liveness": 0.12
  },
  "top_genres": ["lo-fi hip hop", "indie pop", "chillwave", "bedroom pop", "alternative r&b"],
  "dominant_listening_window": "evening",
  "top_artists": ["Artist A", "Artist B", "Artist C"],
  "spotify_track_count": 150,
  "aura_play_count": 12,
  "aura_avg_rating": 7.4,
  "highly_rated_song_ids": ["abc123", "def456"]
}
```

Stored in `sound_profiles` table. One row per user, upserted on each sync. Also stored as a snapshot JSON on each `songs` row (for historical accuracy — prompts reference the profile at generation time).

---

## 6. Generation Pipeline

### 6.1 Ideas Endpoint (`/api/generate/ideas`) — Gemini 3 Flash

**System prompt:**
```
You are a music director for a personalized AI music platform. Given a user's Sound Profile and optional mood hint, generate exactly 3 distinct song concepts. Each concept must feel genuinely tailored to the user's taste — not generic.

Respond ONLY with valid JSON — no markdown, no preamble.

Return:
[
  {
    "title": "Short evocative song title (2-4 words)",
    "genre": "Primary genre",
    "secondary_genre": "Secondary genre or null",
    "mood": "One or two adjectives",
    "bpm": 88,
    "key_instruments": ["..."],
    "structure_hint": "Short description of sonic arc (e.g. 'builds slowly, drops at 1:00')",
    "why": "One sentence explaining why this fits this user's Sound Profile"
  },
  ...
]
```

**Request body sent:**
```json
{
  "sound_profile": { ...full Sound Profile JSON... },
  "mood_hint": "late night drive" | null
}
```

**Timeout:** 15 seconds. On timeout → return cached concept set if any, else error state with "Retry" button.

### 6.2 Prompt Endpoint (`/api/generate/prompt`) — Gemini 3.1 Pro

**System prompt:**
```
You are an expert prompt engineer for Lyria, Google DeepMind's music generation model. Given a song concept and a user's Sound Profile, write a single Lyria generation prompt that will produce a high-quality, personalized music track.

Lyria prompts should:
- Start with the primary genre and tempo
- Describe instrumentation concretely (e.g. "acoustic guitar, soft synth pad, finger-snapped percussion")
- Specify mood and energy arc
- Include production style cues (e.g. "lo-fi vinyl warmth", "wide stereo field", "intimate close-mic vocals")
- Be 80–150 words. No preamble. No markdown. Output the prompt text only.
```

**Request body:**
```json
{
  "concept": { ...chosen concept object... },
  "sound_profile": { ...Sound Profile JSON... }
}
```

**Response:** raw prompt string. Stored on the `songs` row as `lyria_prompt`.

**Timeout:** 30 seconds.

### 6.3 Music Endpoint (`/api/generate/music`) — Lyria 3 Pro Preview

- Model: `lyria-3-pro-preview` via `@google/genai` SDK
- Input: `lyria_prompt` string from step 6.2. Append duration guidance to prompt: "Create a song between 2 minutes 45 seconds and 3 minutes long."
- `responseModalities: ["AUDIO", "TEXT"]` — TEXT returns the generated lyrics and song structure alongside audio
- Audio output: 48kHz stereo. Upload blob to Supabase Storage bucket `audio` at `{userId}/{songId}.mp3`
- Lyrics output: extracted from TEXT modality response → stored as `songs.lyrics` (text field)
- Return: `{ audio_url, lyrics }` — both stored on the songs row
- **Cost:** $0.08 per song (flat rate, not token-based)
- **Timeout:** `maxDuration: 120` seconds in `vercel.json` (3-minute songs take longer to generate than 30s clips)

### 6.4 Cover Endpoint (`/api/generate/cover`) — Nano Banana

- Model: Nano Banana via `@google/genai` SDK (image generation)
- Prompt crafted inline from concept title + genre + mood + top genre colors
- Cover prompt template:
  ```
  Album cover art for "{title}", a {genre} track. {mood} atmosphere.
  Minimal, editorial. Black and white with one accent color.
  No faces. No text. Square format.
  Style: {derived from top genre}
  ```
- Output: image blob → upload to Supabase Storage bucket `covers` at `{userId}/{songId}.jpg`
- Return: `{ cover_url }`
- **Cost:** ~$0.039 per image (1024×1024px at $30/1M tokens, 1290 tokens per image)
- **Runs in parallel** with Lyria in the client

### 6.5 Embed Endpoint (`/api/generate/embed`) — Gemini 3 Flash + Gemini Embedding 2

Fires in the background after the song row exists in the DB (non-blocking — does not delay the player).

**Step 1 — Vibe generation (Gemini 3 Flash):**
```
System: You are a music journalist writing short, evocative descriptions. Given a song's metadata, write a single sentence (max 25 words) that captures its feel. Be specific, sensory, and avoid clichés. Output the sentence only — no quotes, no preamble.

Input: { title, genre, mood, bpm, lyria_prompt_excerpt }
Output: "Warm analog static over a slow groove, like driving home at 2am with the windows down."
```
Stored as `songs.vibe` (text field, shown on song cards and share page).

**Step 2 — Embedding (Gemini Embedding 2):**
Concatenate: `{vibe} | {lyria_prompt} | {lyrics_excerpt (first 200 chars)}`
→ Call Gemini Embedding 2 with `task_type: "RETRIEVAL_DOCUMENT"`
→ Store 768-dim vector in `songs.embedding` (pgvector column)
→ Cost: ~$0.00015 per song (negligible)

**The embed endpoint returns:** `{ vibe, embedding_stored: true }`

### 6.6 Progress State Machine

| Step | Label shown to user | Duration estimate |
|---|---|---|
| `ideas` | "Reading your Sound Profile…" | ~3s |
| `concept_selected` | "Direction selected" | instant |
| `prompting` | "Engineering your track…" | ~8s |
| `lyria` | "Composing with Lyria…" | ~45–90s |
| `cover` | "Generating cover art…" | ~10s (parallel) |
| `uploading` | "Saving your song…" | ~3s |
| `done` | "Your song is ready" | — |
| `vibe+embed` | *(silent background — not shown to user)* | ~5s after done |

The vibe generation + embedding step is entirely background — it does not block the player and is not shown in the UI. The vibe text appears on the song card once it resolves; until then the card shows the genre + mood fields.

### 6.6 Song Queue — Pre-generation

After the first song finishes loading and the player renders (State 3), the client immediately fires `/api/generate/queue` in the background. This endpoint silently pre-generates 3 more songs and stores them as `status: 'queued'` rows in the `songs` table.

**`/api/generate/queue` behavior:**
1. Generate 3 new concept sets via Flash (one batch call returning 9 concepts → pick best 3 by diversity score)
2. For each of the 3 concepts: run `/api/generate/prompt` + `/api/generate/music` + `/api/generate/cover` in parallel
3. Store each completed song in Supabase with `status: 'queued'`, `queue_position: 1|2|3`
4. Return `{ queued: 3 }` once all 3 are stored — client updates queue display

**Client queue state:**
- Queue slots show as "generating…" (animated dots on cover placeholder) until their individual song resolves
- Each slot resolves independently as generation completes — slot 1 may be ready while slot 2 is still generating
- When user clicks a queued song or hits [Skip →], that song plays immediately if ready; if still generating, show a progress indicator
- After playing a queued song, fire a new `/api/generate/queue` call to refill the emptied slot (keep queue at 3)
- Queued songs that are never played are garbage-collected after 24h (Supabase scheduled function or cron on Vercel)

**Resurfacing in queue:** if the user has any songs with `resurface: true` (rated 8+), one of the 3 queue slots is replaced with a fresh regeneration of that concept — same `concept_json`, new Lyria generation call. Max 1 resurfaced slot per queue fill. Cycle through eligible resurfaceable songs in order of rating descending.

---

## 7. Semantic Library Search

### 7.1 Overview

Users can search their song library using natural language — "late night sad," "something energetic for the gym," "that song that sounded like rain." The search is semantic, not keyword — it finds songs by meaning, not exact text match.

Each song has a 768-dimensional embedding generated from the concatenation of its vibe description + Lyria prompt + lyrics excerpt. Searches embed the query with the same model and retrieve songs by cosine similarity via pgvector.

### 7.2 Embedding Model

- Model: **Gemini Embedding 2** (`text-embedding-002`)
- `task_type: "RETRIEVAL_DOCUMENT"` for song embedding at generation time
- `task_type: "RETRIEVAL_QUERY"` for search query embedding at search time
- Dimensions: 768 (default output)
- Cost: ~$0.15/M tokens. A song document (~300 tokens) + query (~20 tokens) = negligible per-search cost

### 7.3 Search Endpoint (`/api/songs/search`)

```
POST /api/songs/search
Body: { query: "late night sad lo-fi" }
Auth: Required
```

1. Embed the query string with Gemini Embedding 2 (`task_type: "RETRIEVAL_QUERY"`)
2. Run pgvector similarity search on `songs` table filtered to `user_id = auth.uid()`:
   ```sql
   SELECT id, title, cover_url, genre, bpm, mood, vibe, rating, created_at,
          1 - (embedding <=> $query_vector) AS similarity
   FROM songs
   WHERE user_id = $user_id
     AND status = 'ready'
     AND embedding IS NOT NULL
   ORDER BY embedding <=> $query_vector
   LIMIT 20;
   ```
3. Return ordered results. Songs without embeddings yet (still processing) are excluded from results but remain in the default grid.

### 7.4 What Gets Embedded Per Song

The document sent to Gemini Embedding 2 at generation time:
```
{vibe_description} | {lyria_prompt} | {first 200 chars of lyrics}
```

Example:
```
Warm analog static over a slow groove, like driving home at 2am | 
Lo-fi hip hop, 88 BPM, Rhodes piano, tape hiss, brushed snare, melancholic |
[Verse 1] City lights fade slow, the radio plays soft...
```

This three-part document covers: subjective feel (vibe), production characteristics (prompt), and lyrical content (lyrics) — making the search responsive to queries on all three dimensions.

---

## 8. Rating System

### 8.1 Rating UI

After a song finishes playing (or after 20 seconds of playback, whichever comes first), a rating prompt slides up inside the player card. It is non-blocking — the user can skip it or dismiss it at any time.

- Slider: 0–10, integer steps, custom styled horizontal bar (inline styles, not native `<input type="range">`)
- Default position: 5 (neutral)
- [Submit →] button: posts rating, dismisses prompt, shows "Rated 7/10" confirmation for 2s
- [Skip rating] link: dismisses without posting — no rating stored

Rating is optional and can only be submitted once per song. If already rated, the player shows the existing rating as a static badge instead of the slider.

### 8.2 Rating API (`/api/songs/[id]/rate`)

```
POST /api/songs/[id]/rate
Body: { rating: 7 }   // integer 0–10
Auth: Required
```

- Inserts row into `song_ratings` table
- Updates `songs.rating` column with the value
- If `rating >= 8`: sets `songs.resurface = true`
- If `rating <= 4`: sets `songs.resurface = false` (suppress from future queue)
- Returns `{ ok: true, resurface: bool }`
- Idempotent: second POST for same song updates the existing rating row rather than inserting

### 8.3 How Ratings Feed the Algorithm

Ratings are incorporated into the Sound Profile on the next `/api/spotify/sync` call per §5.2. Key effects:

- **High ratings (8–10):** the song's genre, BPM, and feature dimensions are weighted positively. The concept is eligible for resurfacing in the queue (§6.6).
- **Low ratings (0–4):** the song's feature dimensions are subtracted as a negative signal. The concept is excluded from future queue resurfacing.
- **Neutral (5–7):** treated identically to a play event — minor positive reinforcement.
- `aura_avg_rating` in the Sound Profile JSON is recomputed as the rolling average of all rated songs.

---

## 9. Playlists

### 9.1 Overview

Users can organize their generated songs into named playlists. Playlists are private by default and can be made public with a shareable link. Public playlist pages are readable without auth.

### 8.2 Playlist API

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/playlists` | Required | Returns all playlists for user with song count + cover mosaic URLs |
| `POST` | `/api/playlists` | Required | Create playlist: `{ name, is_public }` |
| `PATCH` | `/api/playlists/[id]` | Required | Update name or `is_public` toggle |
| `DELETE` | `/api/playlists/[id]` | Required | Deletes playlist row (does not delete songs) |
| `GET` | `/api/playlists/[id]/songs` | Required (or public if `is_public`) | Ordered song list with full song data |
| `POST` | `/api/playlists/[id]/songs` | Required | Add song: `{ song_id }` |
| `DELETE` | `/api/playlists/[id]/songs/[song_id]` | Required | Remove song from playlist |
| `PATCH` | `/api/playlists/[id]/songs` | Required | Reorder: `{ ordered_song_ids: [...] }` |

### 8.3 "+ Playlist" Flow

From any song card (library, player, queue) clicking [+ Playlist]:
1. A dropdown appears listing the user's existing playlists + [+ New Playlist] option
2. Selecting an existing playlist → immediately adds song, shows "Added to [name]" toast
3. Selecting [+ New Playlist] → inline name input → creates playlist + adds song in one operation

### 8.4 Public Playlist Share Page (`/playlists/[id]`)

When `is_public = true`, the playlist page is readable without auth:
- Shows playlist name, song count, creator's display name (first name only from Clerk)
- Ordered song list with cover thumbnails, titles, genre/BPM
- [▶ Play All] plays songs sequentially
- No edit controls shown to public viewers
- "Make your own on myTrack →" footer CTA

---

## 9. Spotify OAuth

### 9.1 Overview

Clerk's social OAuth handles sign-in identity only by default. We need Spotify **API access tokens** to call `/me/top/tracks` etc. The implementation uses Clerk's **OAuth connection** feature: Spotify is added as a custom OAuth provider in the Clerk dashboard with the required scopes. The user's Spotify access token is retrieved server-side via `clerkClient.users.getUserOauthAccessToken(userId, 'oauth_spotify')`.

This means: Clerk handles auth + session, Spotify connection is an OAuth credential on the Clerk user object. No separate Spotify auth flow or token storage needed in Supabase.

### 9.2 Required Scopes

```
user-top-read
user-read-recently-played
```

Set in Clerk dashboard under the Spotify OAuth provider configuration.

### 9.3 Sync Endpoint (`/api/spotify/sync`)

1. Verify Clerk session via `auth()`
2. Fetch Spotify token: `clerkClient.users.getUserOauthAccessToken(userId, 'oauth_spotify')`
3. If token missing or expired → return `{ error: 'spotify_not_connected' }` → client shows reconnect prompt
4. Call Spotify API for all required endpoints (§5.1) — run in parallel with `Promise.all`
5. Fetch audio features for all unique track IDs (batch max 100 per request)
6. Compute Sound Profile per §5.2
7. Upsert `sound_profiles` row in Supabase
8. Return `{ profile: SoundProfile }` to client

**Rate limit handling:** Spotify returns 429 with `Retry-After` header. On 429 → wait `Retry-After` seconds (max 10s) → retry once → if still 429 → return partial profile using whatever data was fetched.

---

## 10. Auth — Clerk

### 10.1 Setup

```
/app/layout.tsx           → wrap with <ClerkProvider>
/middleware.ts            → protect /dashboard, /generate, /library, /playlists, /api/songs, /api/spotify/*, /api/generate/*, /api/playlists/*
/app/sign-in/[[...sign-in]]/page.tsx  → <SignIn routing="path" />
/app/sign-up/[[...sign-up]]/page.tsx  → <SignUp routing="path" />
```

### 10.2 Spotify Connection State

On dashboard load, check if user has Spotify connected:
```ts
// server component or API route
const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_spotify');
const spotifyConnected = tokens.length > 0;
```

If not connected → prompt on dashboard: "Connect Spotify to build your Sound Profile." → clicking opens Clerk's `openUserProfile()` to the connected accounts tab, or redirects to a custom `/connect-spotify` flow that uses Clerk's OAuth connect.

### 10.3 Env Vars (Clerk)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client-side Clerk init |
| `CLERK_SECRET_KEY` | Server-side Clerk verification |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |

---

## 11. Database & Storage — Supabase

### 11.1 Schema

```sql
-- Enable required extensions
create extension if not exists "pg_nanoid";
create extension if not exists "vector";           -- pgvector for semantic search

-- Sound profiles
create table sound_profiles (
  id           text primary key default nanoid(10),
  user_id      text not null unique,
  synced_at    timestamptz default now(),
  features     jsonb not null,
  top_genres   text[] default '{}',
  top_artists  text[] default '{}',
  dominant_listening_window text,
  spotify_track_count int default 0,
  aura_play_count int default 0,
  aura_avg_rating numeric(3,1) default null
);

alter table sound_profiles enable row level security;
create policy "own profile" on sound_profiles
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

-- Generated songs
create table songs (
  id               text primary key default nanoid(10),
  user_id          text not null,
  created_at       timestamptz default now(),
  title            text not null,
  genre            text,
  mood             text,
  bpm              int,
  lyria_prompt     text not null,
  lyrics           text,                           -- returned by Lyria TEXT modality
  vibe             text,                           -- AI one-sentence description (Flash)
  embedding        vector(768),                    -- Gemini Embedding 2, pgvector
  concept_json     jsonb,
  profile_snapshot jsonb,
  audio_url        text,
  cover_url        text,
  duration_seconds int,
  is_public        bool default false,
  play_count       int default 0,
  rating           int default null,       -- 0–10, null if unrated
  resurface        bool default false,     -- true if rating >= 8
  status           text default 'ready',  -- 'queued' | 'ready' | 'played'
  queue_position   int default null       -- 1|2|3 while status='queued'
);

-- HNSW index for fast approximate nearest-neighbor search
create index on songs using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

alter table songs enable row level security;
create policy "own songs" on songs
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "public songs readable" on songs
  for select using (is_public = true);

-- In-platform play history
create table play_history (
  id         text primary key default nanoid(10),
  user_id    text not null,
  song_id    text references songs(id) on delete cascade,
  played_at  timestamptz default now()
);

alter table play_history enable row level security;
create policy "own history" on play_history
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

-- Song ratings (normalized — one row per rated song)
create table song_ratings (
  id         text primary key default nanoid(10),
  user_id    text not null,
  song_id    text references songs(id) on delete cascade unique,
  rating     int not null check (rating >= 0 and rating <= 10),
  rated_at   timestamptz default now()
);

alter table song_ratings enable row level security;
create policy "own ratings" on song_ratings
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

-- Playlists
create table playlists (
  id         text primary key default nanoid(10),
  user_id    text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name       text not null,
  is_public  bool default false
);

alter table playlists enable row level security;
create policy "own playlists" on playlists
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "public playlists readable" on playlists
  for select using (is_public = true);

-- Playlist songs (ordered join table)
create table playlist_songs (
  id          text primary key default nanoid(10),
  playlist_id text references playlists(id) on delete cascade,
  song_id     text references songs(id) on delete cascade,
  position    int not null,
  added_at    timestamptz default now(),
  unique (playlist_id, song_id)
);

alter table playlist_songs enable row level security;
create policy "own playlist songs" on playlist_songs
  using (
    exists (
      select 1 from playlists p
      where p.id = playlist_songs.playlist_id
        and p.user_id = auth.uid()::text
    )
  );

create policy "public playlist songs readable" on playlist_songs
  for select using (
    exists (
      select 1 from playlists p
      where p.id = playlist_songs.playlist_id
        and p.is_public = true
    )
  );
```

### 11.2 Storage Buckets

| Bucket | Path pattern | Access |
|---|---|---|
| `audio` | `{userId}/{songId}.mp3` | Public CDN — streamed in player |
| `covers` | `{userId}/{songId}.jpg` | Public CDN — displayed in library + share |

Both buckets are public-read, write-restricted to service role key only.

### 11.3 Env Vars (Supabase)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin (bypasses RLS) |

---

## 12. Songs API (`/api/songs`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/songs` | Required | Returns latest 50 songs for user; includes `audio_url`, `cover_url`, `rating`, `resurface` |
| `GET` | `/api/songs/[id]` | Required (or public if `is_public`) | Full song row |
| `PATCH` | `/api/songs/[id]` | Required | Toggle `is_public`; update title |
| `DELETE` | `/api/songs/[id]` | Required | Deletes Storage audio + cover + row |
| `POST` | `/api/songs/[id]/play` | Required | Inserts `play_history` row; increments `play_count`; sets `status: 'played'` |
| `POST` | `/api/songs/[id]/rate` | Required | Submits 0–10 rating (see §8.2) |
| `POST` | `/api/songs/search` | Required | Semantic search via Gemini Embedding 2 + pgvector (see §7.3) |

---

## 13. Share Page (`/share/[id]`)

- Fetches song row where `is_public = true` (server component, no auth required)
- Shows: cover art, title, genre/BPM badge, vibe description, audio player, collapsible "Lyrics" section, collapsible "Lyria Prompt" section (IBM Plex Mono)
- Audio player: custom styled controls (play/pause, scrubber, volume) — div-based, inline styles
- Footer: "Made with myTrack" + CTA to generate your own
- If song not found or `is_public = false` → 404 page

---

## 14. Security

### 14.1 Data Isolation

- All `/api/songs`, `/api/playlists`, and `/api/generate/*` routes call `auth()` from `@clerk/nextjs/server` — reject 401 before any DB query
- Supabase RLS ensures rows are scoped to `auth.uid()` — API routes using anon key can't cross-read
- Service role key is server-only — never in `NEXT_PUBLIC_*` vars

### 14.2 Spotify Token Security

- Spotify token fetched server-side via `clerkClient` — never exposed to client
- Token not stored in Supabase — always fetched fresh from Clerk per request

### 14.3 Storage

- `audio` and `covers` buckets are public-read (needed for streaming/display)
- Write access requires `SUPABASE_SERVICE_ROLE_KEY` — only `/api/generate/music` and `/api/generate/cover` server routes can write
- File paths use `{userId}/{songId}` — non-guessable IDs via `nanoid(10)`

### 14.4 GenAI API Keys

- `GEMINI_API_KEY` is server-only — used only in `/api/generate/*` routes
- Never referenced in any `NEXT_PUBLIC_*` variable

---

## 15. State Management

| State | Type | Purpose |
|---|---|---|
| `soundProfile` | `SoundProfile \| null` | Current user's Sound Profile |
| `isSyncing` | `bool` | Spotify sync in progress |
| `generationStep` | `string` | Current step in generation pipeline |
| `concepts` | `Concept[] \| null` | 3 song concepts from Flash |
| `selectedConcept` | `Concept \| null` | User-chosen concept |
| `moodHint` | `string` | Optional mood/occasion input |
| `lyriaPrompt` | `string \| null` | Engineered prompt from Pro |
| `currentSong` | `Song \| null` | Currently playing song object |
| `isPlaying` | `bool` | Audio player state |
| `playbackPosition` | `number` | Current playback time (seconds) |
| `showRatingPrompt` | `bool` | Whether rating slider is visible |
| `pendingRating` | `number` | Slider value before submission (0–10) |
| `queue` | `Song[]` | Pre-generated queue (up to 3, may be partially resolved) |
| `queueGenerating` | `bool` | Background queue generation in progress |
| `songs` | `Song[]` | User's full song library |
| `searchQuery` | `string` | Current library search input |
| `searchResults` | `Song[] \| null` | Semantic search results; null = showing default grid |
| `isSearching` | `bool` | Search API call in-flight |
| `isLoadingSongs` | `bool` | Library fetch in progress |
| `playlists` | `Playlist[]` | User's playlists |
| `activePlaylist` | `Playlist \| null` | Currently open playlist |
| `generationError` | `string \| null` | Any generation step error |

---

## 16. Styling

### 16.1 Color Scheme (CSS custom properties on `:root`)

```css
:root {
  --bg: #F7F6F2;
  --ink: #111111;
  --ink-muted: #555555;
  --border: #D0CEC8;
  --accent: #111111;
  --accent-inverse: #F7F6F2;
  --progress: #111111;
  --card-bg: #FFFFFF;
}
```

No hardcoded hex values in component code. No Tailwind. No MUI.

### 16.2 Typography

- **UI font**: IBM Plex Sans — all headings, body, labels, buttons, inputs, tags. Loaded via `next/font`.
- **Code font**: IBM Plex Mono — Lyria prompts and lyrics display only. Nowhere else.

### 16.3 Component Rules

- Inline JS style objects for component-scoped styles
- No rounded corners on structural elements (cards, panels, buttons, inputs, search bar)
- 1px `var(--border)` grid separating major layout regions
- Generous whitespace — minimum 16px padding on all panels
- Bar charts in Sound Profile: pure inline SVG, no chart library
- Audio scrubber: div-based, inline styles — not native `<input type="range">`
- Rating slider: div-based, inline styles — not native `<input type="range">`

---

## 17. Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | All Gemini + Lyria + Nano Banana + Embedding API calls |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk client |
| `CLERK_SECRET_KEY` | Yes | Clerk server + OAuth token fetch |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | `/dashboard` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase server (admin ops + Storage writes) |

---

## 18. Key Dependencies

| Package | Version | Role |
|---|---|---|
| `next` | ^14.2.0 | Framework |
| `react` / `react-dom` | ^18.3.0 | UI |
| `@google/genai` | ^1.0.0 | Gemini, Lyria 3 Pro, Nano Banana, Embedding 2 |
| `@clerk/nextjs` | ^5.0.0 | Auth + Spotify OAuth |
| `@supabase/supabase-js` | ^2.0.0 | DB (pgvector) + Storage |
| `nanoid` | ^5.0.0 | Song/share ID generation |

No audio processing libraries. No chart libraries. No component libraries.

---

## 19. Subagent Build Plan

| Agent | Task | Key Sections |
|---|---|---|
| **1** | Scaffold Next.js 14, install all deps, folder structure, `.env.local` template, `.gitignore`, `vercel.json` | §17, §18 |
| **2** | Spotify OAuth via Clerk + `/api/spotify/sync` + Sound Profile algorithm | §9, §5 |
| **3** | Generation routes: ideas, prompt, music (Lyria 3 Pro), cover (Nano Banana), queue | §6 |
| **4** | Embed + search: `/api/generate/embed` (Flash vibe + Embedding 2) + `/api/songs/search` (pgvector) | §7, §6.5 |
| **5** | Dashboard UI + Generate page (all 3 states) + queue display + rating slider | §4.2, §4.3, §6.6, §15 |
| **6** | Clerk auth + Supabase schema (pgvector, all 6 tables) + Storage buckets + `/api/songs` CRUD | §10, §11, §12, §14 |
| **7** | Playlists: API routes + `/playlists` + `/playlists/[id]` + drag-reorder | §9, §4.5, §4.6 |
| **8** | Library + landing + share page + integration pass + Vercel deploy | §4.1, §4.4, §13 |
| **9** | Styling audit + Playwright E2E verification across all pages | §16 |

---

## 20. API Cost Estimate (1 Active User Hour)

Assumes: user generates ~10 songs/hour (4 chosen + 6 background queue), rates ~5, searches ~8 times.

| Expense | Rate | Volume | Cost |
|---|---|---|---|
| **Lyria 3 Pro Preview** | $0.08/song | 10 songs | **$0.80** |
| **Nano Banana covers** | ~$0.039/image | 10 images | **$0.39** |
| **Gemini 3.1 Pro** (prompt engineering) | $2/$12 per M tokens in/out | 10 × ~1K tokens | **~$0.04** |
| **Gemini 3 Flash** (concepts + vibes) | $0.50/$3 per M tokens | 14 × ~800 tokens | **~$0.01** |
| **Gemini Embedding 2** (songs + searches) | $0.15/M tokens | 18 × ~300 tokens | **~$0.001** |
| **Total** | | | **~$1.24/hr** |

**Savings strategies:**

1. **Queue uses Lyria Clip ($0.04)** instead of Pro — saves $0.24/hr. Only chosen songs use Pro.
2. **Context cache the Pro system prompt** — 90% discount on repeat input tokens. Saves ~$0.015/hr.
3. **Swap prompt engineering to Flash** — 4× cheaper, minimal quality loss. Saves ~$0.03/hr.
4. **Reduce queue to 2 songs** — saves $0.08–$0.16/hr depending on tier.
5. **With all optimizations applied:** **~$0.55/hr** (55% reduction)

---

## 20. Out of Scope

- Mobile native app or desktop app
- Stem separation or remixing
- Real-time generation progress via WebSocket (polling sufficient)
- Apple Music / Tidal integration
- Downloaded audio export to device filesystem
- Model fine-tuning on user feedback
- Collaborative playlist editing (playlists are single-owner)
