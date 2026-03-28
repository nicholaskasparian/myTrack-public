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
