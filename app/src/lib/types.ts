// myTrack — TypeScript interfaces derived from PRD §5.3, §6, §7, §9, §15

// ─── Sound Profile (PRD §5.3) ──────────────────────────────────────────

export interface AudioFeatures {
  tempo: number;
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
}

export interface SoundProfile {
  id: string;
  user_id: string;
  synced_at: string;
  features: AudioFeatures;
  top_genres: string[];
  top_artists: string[];
  dominant_listening_window: 'morning' | 'afternoon' | 'evening' | 'night';
  spotify_track_count: number;
  aura_play_count: number;
  aura_avg_rating: number | null;
  highly_rated_song_ids?: string[];
}

// ─── Song Concept (PRD §6.1) ───────────────────────────────────────────

export interface Concept {
  title: string;
  genre: string;
  secondary_genre: string | null;
  mood: string;
  bpm: number;
  key_instruments: string[];
  structure_hint: string;
  why: string;
}

// ─── Song (PRD §11.1 songs table) ──────────────────────────────────────

export interface Song {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  genre: string | null;
  mood: string | null;
  bpm: number | null;
  lyria_prompt: string;
  lyrics: string | null;
  vibe: string | null;
  concept_json: Concept | null;
  profile_snapshot: SoundProfile | null;
  audio_url: string | null;
  cover_url: string | null;
  duration_seconds: number | null;
  is_public: boolean;
  play_count: number;
  rating: number | null;
  resurface: boolean;
  status: 'queued' | 'ready' | 'played';
  queue_position: number | null;
}

// ─── Playlist (PRD §9) ────────────────────────────────────────────────

export interface Playlist {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  is_public: boolean;
  song_count?: number;
  cover_urls?: string[];
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
  song?: Song;
}

// ─── Play History ──────────────────────────────────────────────────────

export interface PlayEvent {
  id: string;
  user_id: string;
  song_id: string;
  played_at: string;
}

// ─── Song Rating ───────────────────────────────────────────────────────

export interface SongRating {
  id: string;
  user_id: string;
  song_id: string;
  rating: number;
  rated_at: string;
}

export interface GenerationTiming {
  started_at: string;
  prompt_ms: number;
  music_ms: number;
  cover_ms: number;
  upload_ms: number;
  total_ms: number;
}

export interface SongStats {
  play_count: number;
  avg_rating: number | null;
  ratings_count: number;
  related_songs: Song[];
}

// ─── Generation State Machine (PRD §6.6, §15) ─────────────────────────

export type GenerationStep =
  | 'idle'
  | 'ideas'
  | 'concept_selected'
  | 'prompting'
  | 'lyria'
  | 'cover'
  | 'uploading'
  | 'done'
  | 'error';

// ─── Client State (PRD §15) ───────────────────────────────────────────

export interface AppState {
  soundProfile: SoundProfile | null;
  isSyncing: boolean;
  generationStep: GenerationStep;
  concepts: Concept[] | null;
  selectedConcept: Concept | null;
  moodHint: string;
  lyriaPrompt: string | null;
  currentSong: Song | null;
  isPlaying: boolean;
  playbackPosition: number;
  showRatingPrompt: boolean;
  pendingRating: number;
  queue: Song[];
  queueGenerating: boolean;
  songs: Song[];
  searchQuery: string;
  searchResults: Song[] | null;
  isSearching: boolean;
  isLoadingSongs: boolean;
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  generationError: string | null;
}
