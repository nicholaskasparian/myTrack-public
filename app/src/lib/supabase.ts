import { createClient } from '@supabase/supabase-js';

// Fallback to dummy URLs if env vars are missing so the build doesn't fail
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_key';

// ─── Client-side Supabase (anon key, RLS-scoped) ───────────────────────
// Used in client components for RLS-protected reads
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// ─── Server-side Supabase (service role, bypasses RLS) ─────────────────
// Used ONLY in API routes for admin operations + Storage writes
// NEVER import this in client components or expose via NEXT_PUBLIC_*
export function getSupabaseAdmin() {
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
