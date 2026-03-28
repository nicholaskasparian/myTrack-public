import { test, expect } from '@playwright/test';

test('Player queue behavior and play button', async ({ page }) => {
  // Set up mock song data
  const mockSong = {
    id: 'mock-song-1',
    title: 'Test Song 1',
    genre: 'Pop',
    lyrics: '[Chorus]\n[0:01:] This is a test\n[0:02:] With a linebreak\n\n[0:03:] And another',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Simple safe mock audio
    cover_url: 'https://picsum.photos/200',
    duration_seconds: 180,
    status: 'ready',
    rating: 0
  };

  const mockQueueSong = {
    id: 'mock-song-2',
    title: 'Test Song 2',
    genre: 'Rock',
    lyrics: '[Verse]\n[0:01:] Second song\n[0:02:] Coming up',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover_url: 'https://picsum.photos/200',
    duration_seconds: 180,
    status: 'queued',
    queue_position: 1,
    rating: 0
  };

  // Mock all the API endpoints the app calls on the generate page
  await page.route('/api/songs/stats', async route => {
    await route.fulfill({ json: { played_count: 0, queued_count: 1 } });
  });

  await page.route('/api/playlists', async route => {
    await route.fulfill({ json: [] });
  });

  await page.route('/api/songs/recent', async route => {
    await route.fulfill({ json: [] });
  });

  await page.route('/api/generate/queue', async route => {
    await route.fulfill({ json: { queued: 1, summary: { generated: 1 } } });
  });

  // Start with no active song, but one in queue
  let activeSongRouteHit = false;
  await page.route('/api/songs/active', async route => {
    if (!activeSongRouteHit) {
      activeSongRouteHit = true;
      await route.fulfill({ json: null });
    } else {
      await route.fulfill({ json: mockSong });
    }
  });

  await page.route('/api/songs/queue', async route => {
    await route.fulfill({ json: [mockSong, mockQueueSong] });
  });
  
  await page.route(/\/api\/songs\/.*\/play/, async route => {
    await route.fulfill({ json: { success: true } });
  });

  // Navigate to generate page
  
  await page.waitForTimeout(2000);
  console.log(await page.content());
  
  // Wait for the UI to load
  await expect(page.locator('text=myTrack')).toBeVisible();

  // 1. Simulate track finishing to test Queue promotion and auto-play
  // We'll just click "Skip to" on the first queued item
  const skipButton = page.locator('button:has-text("Skip to")').first();
  await skipButton.waitFor({ state: 'visible', timeout: 10000 });
  await skipButton.click();

  // Wait for the fullscreen player to open (indicated by Exit fullscreen text)
  const exitFullscreen = page.locator('text=Exit fullscreen');
  await exitFullscreen.waitFor({ state: 'visible', timeout: 5000 });

  // 2. Check Lyrics Linebreaks
  // Verify that the lyrics are rendered and contain the correct text
  await expect(page.locator('text=This is a test')).toBeVisible();
  await expect(page.locator('text=With a linebreak')).toBeVisible();

  // 3. Check Play Button State
  // The play button should show "⏸" because auto-play started it
  const playPauseButton = page.locator('button', { hasText: '⏸' });
  await playPauseButton.waitFor({ state: 'visible', timeout: 5000 });

  // Simulate skipping to the next track in the queue
  const nextButton = page.locator('button:has-text("⏭")');
  await nextButton.click();

  // Check that the new song loaded
  await expect(page.locator('text=Second song')).toBeVisible();

  // And verify the play button is STILL "⏸" (auto-played)
  const playPauseButton2 = page.locator('button', { hasText: '⏸' });
  await playPauseButton2.waitFor({ state: 'visible', timeout: 5000 });
});