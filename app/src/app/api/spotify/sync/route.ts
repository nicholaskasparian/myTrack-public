import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '../../../../lib/supabase';
import { nanoid } from 'nanoid';
import { AudioFeatures } from '../../../../lib/types';

/**
 * FIXED: redirect_uri: Not matching configuration
 * To resolve this, ensure you have added the following callback URL to your Spotify Developer Dashboard:
 * https://living-oarfish-19.clerk.accounts.dev/v1/oauth_callback
 * (Replace with your actual Clerk frontend API domain if different)
 */

async function fetchSpotify(url: string, token: string) {
  try {
    let res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Step 4: Implement 10s Retry-After for 429 errors
    if (res.status === 429) {
      let retryAfter = parseInt(res.headers.get('Retry-After') || '1', 10);
      if (retryAfter > 10) retryAfter = 10;
      console.log(`[Spotify] 429 Rate Limit. Retrying in ${retryAfter}s...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    
    // Step 5: Return clean JSON errors
    if (res.status === 401) {
      return { error: 'spotify_token_expired' };
    }

    if (!res.ok) {
      console.error(`Spotify API error on ${url}: ${res.status} ${res.statusText}`);
      return { error: 'spotify_api_error', status: res.status };
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Fetch error on ${url}:`, error);
    return { error: 'fetch_failed' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 3: Fix Clerk getUserOauthAccessToken flow to reliably refresh tokens if expired
    const client = await clerkClient();
    const tokenResponse = await client.users.getUserOauthAccessToken(userId, 'oauth_spotify');
    const spotifyToken = tokenResponse.data[0]?.token;

    if (!spotifyToken) {
      return NextResponse.json({ error: 'spotify_not_connected' }, { status: 400 });
    }

    // Step 2: Fetch Spotify Data
    const [
      shortTermRes,
      mediumTermRes,
      longTermRes,
      artistsRes,
      recentlyPlayedRes
    ] = await Promise.all([
      fetchSpotify('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', spotifyToken),
      fetchSpotify('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', spotifyToken),
      fetchSpotify('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', spotifyToken),
      fetchSpotify('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50', spotifyToken),
      fetchSpotify('https://api.spotify.com/v1/me/player/recently-played?limit=50', spotifyToken)
    ]);

    // Handle token errors (Step 5)
    const anyError = [shortTermRes, mediumTermRes, longTermRes, artistsRes, recentlyPlayedRes].find(r => r?.error);
    if (anyError?.error === 'spotify_token_expired') {
      return NextResponse.json({ error: 'spotify_token_expired' }, { status: 401 });
    }

    // Step 3: Fetch Audio Features
    const allTrackIds = Array.from(new Set([
      ...(shortTermRes?.items || []).map((t: any) => t?.id),
      ...(mediumTermRes?.items || []).map((t: any) => t?.id),
      ...(longTermRes?.items || []).map((t: any) => t?.id),
    ])).filter(Boolean) as string[];

    const audioFeaturesMap = new Map<string, any>();
    for (let i = 0; i < allTrackIds.length; i += 100) {
      const batch = allTrackIds.slice(i, i + 100);
      const data = await fetchSpotify(`https://api.spotify.com/v1/audio-features?ids=${batch.join(',')}`, spotifyToken);
      if (data?.audio_features) {
        data.audio_features.forEach((feat: any) => {
          if (feat) audioFeaturesMap.set(feat.id, feat);
        });
      }
    }

    // Step 4: Compute Sound Profile
    const dims: (keyof AudioFeatures)[] = ['tempo', 'energy', 'valence', 'danceability', 'acousticness', 'instrumentalness', 'speechiness', 'liveness'];
    
    const calcAvg = (tracks: any[], dimension: string) => {
      const validFeats = (tracks || [])
        .map(t => audioFeaturesMap.get(t?.id))
        .filter(f => f && typeof f[dimension] === 'number');
      
      console.log(`[Spotify Sync] validFeats.length for ${dimension}: ${validFeats.length}`);
      
      if (validFeats.length === 0) {
        console.warn(`[Spotify Sync] WARNING: No valid features found for dimension ${dimension}.`);
        const fallbacks: Record<string, number> = {
          tempo: 0.6,
          energy: 0.65,
          valence: 0.5,
          danceability: 0.6,
          acousticness: 0.2,
          instrumentalness: 0.05,
          speechiness: 0.1,
          liveness: 0.15
        };
        return fallbacks[dimension] ?? 0.5;
      }
      
      const sum = validFeats.reduce((acc, f) => {
        let val = f[dimension];
        if (dimension === 'tempo') {
          val = Math.min(val / 200, 1.0);
        }
        return acc + val;
      }, 0);
      
      return sum / validFeats.length;
    };

    const computedFeatures: AudioFeatures = {
      tempo: 0, energy: 0, valence: 0, danceability: 0,
      acousticness: 0, instrumentalness: 0, speechiness: 0, liveness: 0
    };

    // Step 1: Update weighting formula: (short_term * 0.5) + (med_term * 0.35) + (long_term * 0.15)
    for (const dim of dims) {
      const shortAvg = calcAvg(shortTermRes?.items || [], dim);
      const mediumAvg = calcAvg(mediumTermRes?.items || [], dim);
      const longAvg = calcAvg(longTermRes?.items || [], dim);
      computedFeatures[dim] = (shortAvg * 0.5) + (mediumAvg * 0.35) + (longAvg * 0.15);
    }

    // Genre extraction
    const genreCounts = new Map<string, number>();
    (artistsRes?.items || []).forEach((artist: any) => {
      (artist.genres || []).forEach((g: string) => {
        genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
      });
    });
    const topGenres = Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(e => e[0]);

    // Time-of-day pattern
    const windowCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    (recentlyPlayedRes?.items || []).forEach((item: any) => {
      const dt = new Date(item.played_at);
      const hour = dt.getUTCHours();
      if (hour >= 6 && hour < 12) windowCounts.morning++;
      else if (hour >= 12 && hour < 18) windowCounts.afternoon++;
      else if (hour >= 18 && hour < 24) windowCounts.evening++;
      else windowCounts.night++;
    });
    let dominantWindow: 'morning' | 'afternoon' | 'evening' | 'night' = 'evening';
    let maxCount = -1;
    for (const [w, count] of Object.entries(windowCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantWindow = w as 'morning' | 'afternoon' | 'evening' | 'night';
      }
    }

    // Top artists
    const topArtists = (artistsRes?.items || []).slice(0, 10).map((a: any) => a.name);

    // In-platform modifiers
    const supabase = getSupabaseAdmin();

    const { data: playHistoryData } = await supabase
      .from('play_history')
      .select('song_id')
      .eq('user_id', userId);
    const playHistory = playHistoryData || [];
    
    const { data: songRatingsData } = await supabase
      .from('song_ratings')
      .select('song_id, rating')
      .eq('user_id', userId);
    const songRatings = songRatingsData || [];

    const playCounts = new Map<string, number>();
    for (const p of playHistory) {
      playCounts.set(p.song_id, (playCounts.get(p.song_id) || 0) + 1);
    }

    const ratingMap = new Map<string, number>();
    for (const r of songRatings) {
      ratingMap.set(r.song_id, r.rating);
    }

    const allRelevantSongIds = Array.from(new Set([
      ...playHistory.map(p => p.song_id),
      ...songRatings.map(r => r.song_id)
    ]));

    let myTrackModifiers: Record<string, number> = {
      tempo: 0, energy: 0, valence: 0, danceability: 0,
      acousticness: 0, instrumentalness: 0, speechiness: 0, liveness: 0
    };

    if (allRelevantSongIds.length > 0) {
      const { data: songsData } = await supabase
        .from('songs')
        .select('id, concept_json')
        .in('id', allRelevantSongIds);
      
      const resurfacePromises: PromiseLike<any>[] = [];

      (songsData || []).forEach(song => {
        const pCount = playCounts.get(song.id) || 0;
        if (pCount === 0 && !ratingMap.has(song.id)) return;

        const features = song.concept_json?.features || song.concept_json;
        if (!features) return;

        const rating = ratingMap.get(song.id);
        let multiplier = pCount * 0.1;

        if (rating !== undefined) {
          if (rating >= 8) {
            multiplier *= 1.5;
            resurfacePromises.push(supabase.from('songs').update({ resurface: true }).eq('id', song.id).then());
          } else if (rating <= 4) {
            multiplier = Math.max(1, pCount) * -0.05;
            resurfacePromises.push(supabase.from('songs').update({ resurface: false }).eq('id', song.id).then());
          }
        }

        for (const dim of dims) {
          let val = features[dim] ?? (dim === 'tempo' ? features['bpm'] : null);
          if (typeof val === 'number') {
            if (dim === 'tempo' && val > 1.0) {
              val = Math.min(val / 200, 1.0);
            }
            myTrackModifiers[dim] += multiplier * val;
          }
        }
      });

      await Promise.all(resurfacePromises);
    }

    // Step 2: Apply 25% max cap on myTrackModifiers based on user ratings/play history
    for (const dim of dims) {
      const spotifyVal = computedFeatures[dim];
      let modifier = myTrackModifiers[dim];
      
      const maxMod = 0.25 * Math.abs(spotifyVal);
      if (modifier > maxMod) modifier = maxMod;
      if (modifier < -maxMod) modifier = -maxMod;
      
      computedFeatures[dim] = spotifyVal + modifier;
    }

    const avgRating = songRatings.length > 0
      ? songRatings.reduce((a, b) => a + b.rating, 0) / songRatings.length
      : null;

    // Step 5: Store Profile
    const profileId = nanoid(10);
    const profileData = {
      id: profileId,
      user_id: userId,
      synced_at: new Date().toISOString(),
      features: computedFeatures,
      top_genres: topGenres,
      top_artists: topArtists,
      dominant_listening_window: dominantWindow,
      spotify_track_count: allTrackIds.length,
      aura_play_count: playHistory.length,
      aura_avg_rating: avgRating,
    };

    const { error: upsertError } = await supabase
      .from('sound_profiles')
      .upsert(profileData, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Error upserting sound profile:', upsertError);
      return NextResponse.json({ error: 'Failed_to_save_profile' }, { status: 500 });
    }

    return NextResponse.json({ profile: profileData });

  } catch (error) {
    console.error('Error in Spotify sync route:', error);
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
