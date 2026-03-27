# Docs.MD — Documentation Prefetch Instructions

This file instructs the documentation-fetching agent (5.3-codex) on which documentation to retrieve and cache into the working repository before any build agents run. Read this entire file first.

---

## 0. General Instructions

**Fetch all documentation listed below into subfolders under `/docs/` in the repository.** Use as many subfolders as possible to separate concerns — never dump multiple API references into a single file. Deep subfolder trees are preferred over flat structures because they reduce context window load: agents can `cat docs/gemini/lyria/generation.md` rather than loading an entire multi-topic reference.

**Format rules:**
- Convert all fetched HTML docs to clean Markdown. Strip nav, headers, footers, ads, cookie banners.
- Keep code examples intact and clearly fenced.
- Split long reference pages into topical sub-files. A file should cover one concept, not one URL.
- Max ~1500 lines per file. Split larger pages.
- Add a `# Source: [url]` header at the top of every file.
- Add a `# Last fetched: [date]` line below source.

**Index file:** after fetching, create `/docs/INDEX.md` listing every file, its topic, and one-line description. Agents should read this index before deciding which doc to load.

---

## 1. Google Gemini API

Base: `https://ai.google.dev/gemini-api/docs`

### 1.1 Core

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/gemini/overview.md` | `/gemini-api/docs` | Product overview, model list |
| `docs/gemini/models.md` | `/gemini-api/docs/models` | All model IDs, capabilities, context windows |
| `docs/gemini/gemini3.md` | `/gemini-api/docs/gemini-3` | Gemini 3 Flash and 3.1 Pro specifics |
| `docs/gemini/pricing.md` | `/gemini-api/docs/pricing` | Full pricing table — critical for cost control |
| `docs/gemini/rate-limits.md` | `/gemini-api/docs/rate-limits` | RPM/TPM limits per model |
| `docs/gemini/quickstart.md` | `/gemini-api/docs/quickstart` | SDK setup and first call |
| `docs/gemini/auth.md` | `/gemini-api/docs/api-key` | API key management |

### 1.2 Lyria

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/gemini/lyria/overview.md` | `/gemini-api/docs/music-generation` | Lyria overview, model IDs, capabilities |
| `docs/gemini/lyria/api-reference.md` | `/api/generate/music` | Full API reference for music generation endpoint |
| `docs/gemini/lyria/response-modalities.md` | `/gemini-api/docs/music-generation#response-modalities` | TEXT + AUDIO response handling — critical for lyrics extraction |
| `docs/gemini/lyria/prompting.md` | `/gemini-api/docs/music-generation#prompting` | Prompt engineering guide for Lyria |
| `docs/gemini/lyria/lyria3-pro.md` | `/gemini-api/docs/music-generation#lyria-3-pro` | lyria-3-pro-preview specific docs |

### 1.3 Nano Banana (Image Generation)

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/gemini/nano-banana/overview.md` | `/gemini-api/docs/image-generation` | Nano Banana overview and capabilities |
| `docs/gemini/nano-banana/api-reference.md` | `/api/generate/images` | Image generation API reference |
| `docs/gemini/nano-banana/prompting.md` | `/gemini-api/docs/image-generation#prompting` | Prompting best practices |

### 1.4 Embeddings

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/gemini/embeddings/overview.md` | `/gemini-api/docs/embeddings` | Embedding models, dimensions, task types |
| `docs/gemini/embeddings/text-embedding-002.md` | `/gemini-api/docs/embeddings#text-embedding-002` | text-embedding-002 specifics, 768-dim output |
| `docs/gemini/embeddings/task-types.md` | `/gemini-api/docs/embeddings#task-types` | RETRIEVAL_DOCUMENT vs RETRIEVAL_QUERY — critical for search |

### 1.5 SDK

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/gemini/sdk/genai-sdk.md` | `/gemini-api/docs/libraries` | @google/genai SDK setup |
| `docs/gemini/sdk/text-generation.md` | `/gemini-api/docs/text-generation` | Text generation API |
| `docs/gemini/sdk/streaming.md` | `/gemini-api/docs/text-generation#streaming` | Streaming responses |
| `docs/gemini/sdk/structured-output.md` | `/gemini-api/docs/structured-output` | JSON mode — used in /api/generate/ideas |
| `docs/gemini/sdk/context-caching.md` | `/gemini-api/docs/caching` | Context caching — used to cache Pro system prompt |

---

## 2. Supabase

Base: `https://supabase.com/docs`

### 2.1 Core

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/supabase/quickstart-nextjs.md` | `/docs/guides/getting-started/quickstart/nextjs` | Next.js integration quickstart |
| `docs/supabase/client-setup.md` | `/docs/reference/javascript/installing` | @supabase/supabase-js setup |
| `docs/supabase/auth-overview.md` | `/docs/guides/auth` | Auth overview |

### 2.2 Database

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/supabase/db/rls.md` | `/docs/guides/auth/row-level-security` | RLS policies — critical |
| `docs/supabase/db/rls-policies.md` | `/docs/guides/database/postgres/row-level-security` | Policy syntax and examples |
| `docs/supabase/db/migrations.md` | `/docs/guides/database/migrations` | Schema migrations |
| `docs/supabase/db/functions.md` | `/docs/reference/javascript/select` | Query API |
| `docs/supabase/db/upsert.md` | `/docs/reference/javascript/upsert` | Upsert pattern — used for sound_profiles |

### 2.3 pgvector

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/supabase/pgvector/overview.md` | `/docs/guides/ai/vector-embeddings` | pgvector in Supabase |
| `docs/supabase/pgvector/setup.md` | `/docs/guides/ai/vector-embeddings#enable-the-extension` | Enabling vector extension |
| `docs/supabase/pgvector/hnsw.md` | `/docs/guides/ai/vector-embeddings#hnsw-indexes` | HNSW index setup — used for songs.embedding |
| `docs/supabase/pgvector/querying.md` | `/docs/guides/ai/vector-embeddings#querying-embeddings` | Cosine similarity query syntax |
| `docs/supabase/pgvector/nextjs.md` | `/docs/guides/ai/examples/nextjs-vector-search` | End-to-end Next.js + pgvector example |

### 2.4 Storage

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/supabase/storage/overview.md` | `/docs/guides/storage` | Storage overview |
| `docs/supabase/storage/buckets.md` | `/docs/guides/storage/buckets` | Bucket creation and access control |
| `docs/supabase/storage/upload.md` | `/docs/reference/javascript/storage-from-upload` | Upload API — used in /api/generate/music and /api/generate/cover |
| `docs/supabase/storage/cdn.md` | `/docs/guides/storage/cdn` | CDN URLs for public files |
| `docs/supabase/storage/rls.md` | `/docs/guides/storage/access-control` | Storage RLS policies |

---

## 3. Clerk

Base: `https://clerk.com/docs`

### 3.1 Next.js Integration

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/clerk/nextjs/quickstart.md` | `/docs/quickstarts/nextjs` | Full Next.js setup with App Router |
| `docs/clerk/nextjs/middleware.md` | `/docs/references/nextjs/auth-middleware` | Protecting routes with middleware.ts |
| `docs/clerk/nextjs/server-auth.md` | `/docs/references/nextjs/auth` | auth() server-side usage |
| `docs/clerk/nextjs/clerk-provider.md` | `/docs/components/clerk-provider` | ClerkProvider setup |
| `docs/clerk/nextjs/user-button.md` | `/docs/components/user/user-button` | UserButton component |
| `docs/clerk/nextjs/sign-in.md` | `/docs/components/authentication/sign-in` | SignIn component |

### 3.2 OAuth

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/clerk/oauth/social-connections.md` | `/docs/authentication/social-connections/overview` | Social OAuth overview |
| `docs/clerk/oauth/custom-provider.md` | `/docs/authentication/social-connections/custom-provider` | Custom OAuth provider (Spotify) |
| `docs/clerk/oauth/get-token.md` | `/docs/references/backend/user/get-user-oauth-access-token` | getUserOauthAccessToken — exact current API signature — CRITICAL |
| `docs/clerk/oauth/scopes.md` | `/docs/authentication/social-connections/oauth-scope` | OAuth scope configuration |

### 3.3 Backend SDK

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/clerk/backend/clerk-client.md` | `/docs/references/backend/overview` | clerkClient usage |
| `docs/clerk/backend/users.md` | `/docs/references/backend/user/get-user` | User management API |

### 3.4 Skills (if clerk-skills MCP is available)

If the Clerk Skills MCP is connected, fetch the following skill files into the repo for agent reference:

| File path | Skill | Notes |
|---|---|---|
| `docs/clerk/skills/nextjs-app-router.md` | Next.js App Router skill | Current patterns, not training-data patterns |
| `docs/clerk/skills/oauth-connection.md` | OAuth connection skill | Spotify OAuth exact implementation |
| `docs/clerk/skills/middleware.md` | Middleware skill | Route protection current pattern |

> **Why Clerk Skills:** Clerk's API changes frequently enough that training data patterns are often wrong. Skills contain the current implementation. Always prefer skills over the static docs where available.

---

## 4. Vercel

Base: `https://vercel.com/docs`

### 4.1 Next.js Deployment

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/vercel/deploy-nextjs.md` | `/docs/frameworks/nextjs` | Next.js deployment guide |
| `docs/vercel/env-vars.md` | `/docs/projects/environment-variables` | Environment variable management |
| `docs/vercel/build-config.md` | `/docs/build-output-api/the-build-output-api` | Build configuration |
| `docs/vercel/functions.md` | `/docs/functions/serverless-functions` | Serverless functions, maxDuration |
| `docs/vercel/functions-timeout.md` | `/docs/functions/configuring-functions/duration` | maxDuration configuration — critical for Lyria 120s timeout |
| `docs/vercel/storage-blob.md` | `/docs/storage/vercel-blob` | Vercel Blob storage (for Tauri build artifacts) |

---

## 5. Tauri

Base: `https://tauri.app/v2/`

### 5.1 Core

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/tauri/overview.md` | `https://tauri.app/v2/guide/` | Tauri 2.0 overview |
| `docs/tauri/quickstart.md` | `https://tauri.app/v2/guide/create/` | Project initialization |
| `docs/tauri/config.md` | `https://tauri.app/v2/reference/config/` | tauri.conf.json full reference |
| `docs/tauri/nextjs.md` | `https://tauri.app/v2/guide/frontend/nextjs/` | Next.js + Tauri integration |

### 5.2 Mobile (Android)

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/tauri/android/setup.md` | `https://tauri.app/v2/guide/prerequisites/android/` | Android prerequisites and setup |
| `docs/tauri/android/build.md` | `https://tauri.app/v2/distribute/google-play/` | Android build and distribution |
| `docs/tauri/android/signing.md` | `https://tauri.app/v2/guide/distribution/android-signing/` | APK signing for distribution |

### 5.3 Desktop

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/tauri/desktop/build.md` | `https://tauri.app/v2/guide/distribution/` | Desktop build targets |
| `docs/tauri/desktop/updater.md` | `https://tauri.app/v2/plugin/updater/` | Auto-updater plugin |
| `docs/tauri/desktop/signing.md` | `https://tauri.app/v2/guide/distribution/sign-macos/` | macOS code signing |

### 5.4 Plugins

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/tauri/plugins/fs.md` | `https://tauri.app/v2/plugin/fs/` | File system plugin — audio caching |
| `docs/tauri/plugins/media-session.md` | `https://github.com/tauri-apps/tauri-plugin-media-session` | Lock screen media controls (README) |
| `docs/tauri/plugins/share.md` | `https://tauri.app/v2/plugin/share/` | Native share sheet (Android) |

---

## 6. Playwright

Base: `https://playwright.dev/docs`

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/playwright/quickstart.md` | `/docs/intro` | Setup and first test |
| `docs/playwright/selectors.md` | `/docs/selectors` | Element selectors |
| `docs/playwright/assertions.md` | `/docs/test-assertions` | Assertions API |
| `docs/playwright/network.md` | `/docs/network` | Intercepting network requests — for mocking Lyria in tests |
| `docs/playwright/config.md` | `/docs/test-configuration` | playwright.config.ts reference |

---

## 7. Spotify Web API

Base: `https://developer.spotify.com/documentation/web-api`

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/spotify/overview.md` | `/documentation/web-api` | API overview |
| `docs/spotify/auth.md` | `/documentation/web-api/concepts/authorization` | OAuth flow overview |
| `docs/spotify/top-tracks.md` | `/documentation/web-api/reference/get-users-top-artists-and-tracks` | GET /me/top/tracks — used in Sound Profile |
| `docs/spotify/top-artists.md` | `/documentation/web-api/reference/get-users-top-artists-and-tracks` | GET /me/top/artists |
| `docs/spotify/recently-played.md` | `/documentation/web-api/reference/get-recently-played` | GET /me/player/recently-played |
| `docs/spotify/audio-features.md` | `/documentation/web-api/reference/get-several-audio-features` | GET /audio-features batch — energy, valence, BPM etc. |
| `docs/spotify/rate-limits.md` | `/documentation/web-api/concepts/rate-limits` | Rate limit handling and 429 responses |

---

## 8. pgvector

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/pgvector/readme.md` | `https://github.com/pgvector/pgvector/blob/master/README.md` | Full README — distance operators, index types |
| `docs/pgvector/hnsw.md` | `https://github.com/pgvector/pgvector#hnsw` | HNSW index configuration options |
| `docs/pgvector/operators.md` | `https://github.com/pgvector/pgvector#distance` | Distance operators: <-> (L2), <=> (cosine), <#> (inner product) |

---

## 9. Index Generation

After all fetches complete, create `/docs/INDEX.md`:

```markdown
# Docs Index

Auto-generated by 5.3-codex. Last updated: [date].

## Gemini
- `gemini/overview.md` — Model overview and capabilities
- `gemini/models.md` — All model IDs and specs
- `gemini/pricing.md` — Full pricing table
- `gemini/lyria/overview.md` — Lyria music generation
- `gemini/lyria/lyria3-pro.md` — lyria-3-pro-preview specifics
- `gemini/lyria/response-modalities.md` — TEXT+AUDIO response handling
- `gemini/embeddings/text-embedding-002.md` — 768-dim embedding model
- `gemini/embeddings/task-types.md` — RETRIEVAL_DOCUMENT vs RETRIEVAL_QUERY
...

## Supabase
- `supabase/pgvector/hnsw.md` — HNSW index setup
- `supabase/pgvector/querying.md` — Cosine similarity query syntax
- `supabase/storage/upload.md` — File upload API
- `supabase/db/rls.md` — Row Level Security policies
...

## Clerk
- `clerk/oauth/get-token.md` — getUserOauthAccessToken current signature
- `clerk/nextjs/middleware.md` — Route protection
...

[continue for all fetched files]
```

---

## 10. Orchestrator Toolchain — OpenCode + opencode-antigravity-auth

These docs are specifically for the orchestrator agent, which needs to understand its own runtime environment. Fetch into `docs/toolchain/`.

---

### 10.1 OpenCode Core

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/toolchain/opencode/overview.md` | `https://opencode.ai/docs/` | What OpenCode is, terminal-first AI coding agent |
| `docs/toolchain/opencode/config.md` | `https://opencode.ai/docs/config/` | `opencode.json` full reference — providers, models, tools, snapshots, autoupdate |
| `docs/toolchain/opencode/modes.md` | `https://opencode.ai/docs/modes/` | Build / Plan / Review / Debug / Docs modes — when to use each |
| `docs/toolchain/opencode/models.md` | `https://opencode.ai/docs/models/` | Model selection, `--model` flag, model IDs |
| `docs/toolchain/opencode/cli.md` | `https://opencode.ai/docs/cli/` | CLI reference: `opencode run`, `opencode auth login`, flags |
| `docs/toolchain/opencode/providers.md` | `https://opencode.ai/docs/providers/` | Provider config, `enabled_providers`, `disabled_providers` |
| `docs/toolchain/opencode/mcp.md` | `https://opencode.ai/docs/mcp/` | MCP server configuration and usage |

**Key facts to inline in the fetched file headers:**
- `opencode run --model [id] "[prompt]" > output.md` — non-interactive batch dispatch
- Config lives at `~/.config/opencode/opencode.json` (all platforms including Windows)
- Snapshots track file changes; disable for large repos with `"snapshot": false`
- `small_model` option configures a lightweight model for title generation tasks
- `enabled_providers` acts as allowlist; `disabled_providers` takes priority if both set

---

### 10.2 opencode-antigravity-auth

The plugin that provides OAuth-based access to Antigravity quota (Opus 4.6, Sonnet 4.6, Gemini 3.1 Pro) via multiple burner Google accounts.

| File path | Fetch URL | Notes |
|---|---|---|
| `docs/toolchain/antigravity-auth/readme.md` | `https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/README.md` | Full README — installation, model list, features |
| `docs/toolchain/antigravity-auth/configuration.md` | `https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md` | Full `antigravity.json` reference — all settings |
| `docs/toolchain/antigravity-auth/multi-account.md` | `https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md` | Multi-account setup, rotation strategies, `pid_offset_enabled` |
| `docs/toolchain/antigravity-auth/troubleshooting.md` | `https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/TROUBLESHOOTING.md` | Common errors, quick reset, token revocation |

**Critical facts to inline at top of `docs/toolchain/antigravity-auth/multi-account.md`:**
```
# CRITICAL FOR THIS PROJECT

This project uses multiple burner Google accounts with pid_offset_enabled: true.
The orchestrator dispatches parallel agents (see AGENTS.md §7). Without
pid_offset_enabled, parallel processes race to select the same account and
trigger rate limits. With it, each process's starting account index is offset
by (PID mod num_accounts), distributing load automatically.

antigravity.json config for this project:
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true
}

Accounts stored at: ~/.config/opencode/antigravity-accounts.json
Add a burner account: opencode auth login (repeat for each account)
Check quotas: opencode auth login → "Check quotas"
Quick reset if broken: rm ~/.config/opencode/antigravity-accounts.json && opencode auth login
```

**Key facts about the plugin:**
- Provides Claude Opus 4.6, Sonnet 4.6, and Gemini 3.1 Pro/Flash via Google OAuth with multi-account support that auto-rotates when one account is rate-limited
- For parallel subagents, `pid_offset_enabled: true` distributes sessions across accounts based on process ID — without it, multiple processes select the same account causing rate limit collisions
- Account selection strategies: `sticky` (same account until rate-limited, best for prompt cache), `round-robin` (rotate every request, maximum throughput), `hybrid` (health score + token bucket + LRU, best overall distribution)
- For Gemini models, the plugin accesses both Antigravity and Gemini CLI quota pools per account — effectively doubling Gemini quota through automatic fallback
- `OPENCODE_ANTIGRAVITY_DEBUG=1 opencode` — enable debug logging to `~/.config/opencode/antigravity-logs/`
- ⚠️ Terms of Service warning: there are reports of Google blocking accounts using this plugin; use burner accounts only

---

### 10.3 Recommended Project Config Files

**`docs/toolchain/configs/antigravity.json`** — place at `~/.config/opencode/antigravity.json`:
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "soft_quota_threshold_percent": 85
}
```

**`docs/toolchain/configs/opencode.json`** — relevant excerpt for `~/.config/opencode/opencode.json`:
```json
{
  "plugin": ["opencode-antigravity-auth"],
  "provider": {
    "anthropic": {
      "models": {
        "claude-opus-4-6-thinking": {},
        "claude-sonnet-4-6-thinking": {}
      }
    },
    "google": {
      "models": {
        "gemini-3.1-pro-high": {},
        "gemini-3.1-pro-low": {},
        "gemini-3-flash": {}
      }
    }
  },
  "model": "anthropic/claude-opus-4-6-thinking",
  "small_model": "google/gemini-3-flash"
}
```

---

### 10.4 OpenCode Zen Models Reference

For fallback when Tier 1 auth fails. No API keys required.

**`docs/toolchain/zen-models.md`** — create this file manually (no fetch URL):
```markdown
# OpenCode Zen Free Models

No API key required. No rate limit.

| Model ID | Strengths | Use for |
|---|---|---|
| opencode/big-pickle-max | Best Zen quality | Primary Tier 1 fallback |
| opencode/big-pickle-high | Good quality, faster | General coding fallback |
| opencode/big-pickle | Fast, reliable | Simple tasks |
| opencode/minimax-m2.5-free | Best tool-calling in Zen | API routes, structured output |
| opencode/mimo-v2-pro-free | General purpose | Boilerplate |
| opencode/mimo-v2-omni-free | Fast | Very simple tasks only |
| opencode/nemotron-3-super-free | Weakest | Last resort |

NVIDIA Build (free at 40 RPM — higher quality than Zen):
| nvidia/kimi-k2.5 | Strong complex code | Integration tasks |
| nvidia/glm-5 | Strong visual reasoning | Design rule checking |
| nvidia/qwen-3.5-397b | Fast, reliable | Boilerplate |

Dispatch syntax:
  opencode run --model opencode/big-pickle-max "[prompt]" > output.md
  opencode run --model nvidia/kimi-k2.5 "[prompt]" > output.md
```

---

## 11. Prefetch Priority Order

Fetch in this order (most blocking to least blocking):

1. `docs/toolchain/antigravity-auth/` (all) — orchestrator needs this before running anything
2. `docs/toolchain/opencode/` (all) — orchestrator CLI reference
3. `docs/toolchain/configs/` (all) — copy config templates into place
4. `docs/clerk/oauth/get-token.md` — Agent 2 (Spotify OAuth) blocks on this
5. `docs/gemini/lyria/` (all) — Agent 3 (generation routes) blocks on this
6. `docs/supabase/pgvector/` (all) — Agent 4 (embedding) and Agent 6 (schema) block on this
7. `docs/supabase/db/rls.md` + `rls-policies.md` — Agent 6 (schema/security) blocks on this
8. `docs/gemini/embeddings/` (all) — Agent 4 (embed + search) blocks on this
9. `docs/clerk/nextjs/middleware.md` — Agent 6 (auth) blocks on this
10. `docs/tauri/` (all) — Agent 9 blocks on this
11. `docs/playwright/` (all) — Agent 10 blocks on this
12. Remaining Gemini, Supabase, Vercel, Spotify docs