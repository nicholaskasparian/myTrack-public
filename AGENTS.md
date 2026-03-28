
# AGENTS.md — myTrack Orchestration Rules v4 (Windows/NVIDIA Optimized)

Read this entire file before doing anything else. This is the source of truth for how agents are dispatched, which models to use, and how quality is verified. 

**Reference Material:** Use the docs\index.md file in the root directory as the primary entry point for all API schemas, library documentation, and environment setup guides.

---

## 0. Runtime Environment

**Antigravity Native Orchestration.** Antigravity serves as the native orchestrator. It runs as a background daemon, dispatching subagents via OpenCode CLI. This workflow relies strictly on free-tier models (NVIDIA/OpenCode) with exactly three targeted premium escalations to protect rate limits.

### Windows Dispatch Pattern (PowerShell)

```powershell
# Write task to file using UTF8 encoding to prevent character issues
$task = @"
[full task prompt]
"@
$task | Set-Content -Path .task_N.md -Encoding UTF8

# Dispatch agent via OpenCode CLI - Output captured to named file
opencode run --model [model-id] (Get-Content .task_N.md -Raw) > .output_N.md
```

---

## 1. Model Tiers & IDs

### Tier 1 — Free Workhorses (NVIDIA Preferred)
- **Max Reasoning / Architecture:** opencode/big-pickle
- **UI & Layout / Visuals:** nvidia/kimi-k2.5
- **General CRUD / Scaffolding:** nvidia/glm5

### Tier 2 — Free Fallbacks
- nvidia/qwen3-coder-480b
- opencode/minimax-m2.5-free

### Tier 3 — Premium Escalations (EXACTLY 1 USE EACH)
- anthropic/claude-sonnet-4-6-thinking (**Agent 2**: Spotify/Auth Integration)
- google/gemini-3.1-pro-high (**Agent 3**: Lyria Music Gen/Queue Logic)
- google/gemini-3.1-pro-low (**Agent 6**: DB Security/RLS Hardening)

---

## 2. Agent Groups & Dispatch Roster

| Group | Agent | Task | Assigned Model | Provider |
| :--- | :--- | :--- | :--- | :--- |
| G1 | Agent 1 | Project Scaffolding | nvidia/glm5 | NVIDIA |
| G2 | Agent 2 | Spotify OAuth + Profile | PREMIUM: claude-sonnet-4-6-thinking | Premium |
| | Agent 6 | DB Schema + Auth + Security | PREMIUM: gemini-3.1-pro-low | Premium |
| G3 | Agent 3 | Music Gen + Queue System | PREMIUM: gemini-3.1-pro-high | Premium |
| | Agent 4 | Embeddings + Vector Search | opencode/big-pickle | OpenCode |
| G4 | Agent 5 | Dashboard + UI Elements | nvidia/kimi-k2.5 | NVIDIA |
| | Agent 7 | Playlist CRUD + API | nvidia/glm5 | NVIDIA |
| G5 | Agent 8 | Library + Share + Deploy | nvidia/kimi-k2.5 | NVIDIA |
| G6 | Agent 9 | Playwright Suite + Audit | nvidia/kimi-k2.5 | NVIDIA |

---

## 3. QA Protocol — Dual Review

After every group completes, Antigravity runs both free review agents simultaneously. Both must return PASS before the next group is triggered.

```powershell
# Run Big Pickle (logic/security) and Kimi (design/integration) in parallel
opencode run --model opencode/big-pickle "Review .output_N.md for logic..." > .qa_logic.md
opencode run --model nvidia/kimi-k2.5 "Review .output_N.md for UI..." > .qa_design.md
```

---

## 4. Premium Task Prompts (One-Shot Optimized)

### Agent 2 (Sonnet 4.6 Thinking)
Task: Spotify OAuth via Clerk & Sound Profile algorithm.
Constraint: Consult docs\index.md to locate relevant documentation. Implement formula: (short * 0.5) + (med * 0.35) + (long * 0.15). Handle 429s with 10s Retry-After.

### Agent 3 (Gemini 3.1 Pro High)
Task: Full Generation Pipeline & Queue.
Constraint: Consult docs\index.md to locate relevant documentation. Coordinate lyria-3-pro-preview (music), gemini-3-flash (ideas), and nano-banana (covers). Implement diversity-based queueing and resurface-eligible logic (rating >= 8).

### Agent 6 (Gemini 3.1 Pro Low)
Task: Auth & Database Fortification.
Constraint: Consult docs\index.md to locate relevant documentation. Initialize pg_nanoid and pgvector. Every table MUST have exhaustive RLS USING and WITH CHECK policies.

---

## 5. Orchestrator Rules (Windows)

- Execution: Always check for node_modules and package.json before running scripts.
- Paths: Use backslashes \ for local file navigation; forward slashes / for Next.js routes.
- Failures: If a Tier 3 model fails, log to AGENT_STATE.md and fallback to nvidia/qwen3-coder-480b.
- QA: QA review is mandatory between groups; log results in AGENT_STATE.md.
- Status: End every response with: DISPATCHING GROUP [N] or DONE.

---

## 6. Document Reference Index
Refer to .\docs\index.md for detailed guidance on:
- Auth flow and token retrieval patterns.
- Music generation response modalities (AUDIO/TEXT).
- SQL table structures and vector dimensions.
- 1px grid / IBM Plex Sans / No rounded corners rules.

