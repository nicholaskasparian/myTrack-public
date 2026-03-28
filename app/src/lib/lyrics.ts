const SFX_LINE_REGEX = /^(?:\[[^\]]+\]|(?:low|high|soft|gentle|deep|distant|subtle)\s+)?(?:hum|humming|sfx|sound effect|ambient noise|fx|whisper|echo|drone)\b/i;
const BRACKETED_PRODUCTION_NOTE_REGEX = /^\[(?!\d{1,2}:\d{2}(?:\.\d+)?(?:\s*-\s*\d{1,2}:\d{2})?\]$)(?!\d+(?:\.\d+)?:\]$)(?![a-zA-Z\s0-9]+\]$).+\]$/;
const META_LINE_REGEX = /^(music|bpm|duration_secs|good_crop):/i;

export function shouldSkipLyricLine(line: string) {
  const cleanLine = line.trim();
  if (!cleanLine) return true;
  return SFX_LINE_REGEX.test(cleanLine) || BRACKETED_PRODUCTION_NOTE_REGEX.test(cleanLine) || META_LINE_REGEX.test(cleanLine);
}

export function sanitizeLyrics(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !shouldSkipLyricLine(line))
    .join('\n');
}
