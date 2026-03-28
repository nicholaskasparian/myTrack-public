myTrack - Music made for you, not for an algorithm.

Tech Stack - 
Supabase (DB for storing taste profiles and songs)
Gemini APIs (Embedding 2 for semantic search, 3 flash for idea creation, 3.1 pro preview for prompt refinement and lyric generation, **Lyria 3 Pro** for song generation, **Nano Banana 2** for album cover generation)
Clerk (Auth, Spotify connection)

**How it works**
Basiclly, it analyzes ur past spotify history and creats a taste profile for u. then whenever u join main feed, gemini 3 

```mermaid
flowchart LR
    U[User] --> A[Sign in with Clerk]
    A --> B[Connect Spotify]
    B --> C[Spotify Sync API]

    C --> D[Build Sound Profile: top tracks + audio features]
    D --> E[Adaptive Generation Engine]

    E --> F1[Idea Generation: Gemini Flash]
    F1 --> F2[Lyrics and Prompt: Gemini Pro]
    F2 --> F3[Music Creation: Lyria]
    F2 --> F4[Cover Art: Nano Banana]

    F3 --> G[Store Audio in Supabase Storage]
    F4 --> H[Store Cover in Supabase Storage]
    G --> I[Song Record in Supabase DB]
    H --> I

    I --> J[User Playback in Generate and Library]
    J --> K[User Feedback: play count + rating]

    K --> L[Resurface and Queue Logic]
    L --> E

    I --> M[Embedding Generation: Gemini Embedding]
    M --> N[Vector Search with pgvector]
    N --> O[Semantic Library Search]
