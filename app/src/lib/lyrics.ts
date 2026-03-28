const SFX_LINE_REGEX = /^(?:\[[^\]]+\]|(?:low|high|soft|gentle|deep|distant|subtle)\s+)?(?:hum|humming|sfx|sound effect|ambient noise|fx|whisper|echo|drone)\b/i;
const BRACKETED_PRODUCTION_NOTE_REGEX = /^\[(?!\d{1,2}:\d{2}(?:\.\d+)?(?:\s*-\s*\d{1,2}:\d{2})?\]$)(?!\d+(?:\.\d+)?:\]$)(?![a-zA-Z\s0-9]+\]$).+\]$/;
const META_LINE_REGEX = /^(music|bpm|duration_secs|good_crop):/i;
const SECTION_NAME_REGEX = '(?:Intro|Verse(?:\\s+\\d+)?|Pre[- ]?Chorus|Chorus|Post[- ]?Chorus|Bridge|Hook|Refrain|Outro)';
const TAG_SPLIT_REGEX = new RegExp(`(\\[(?:\\d{1,2}:\\d{2}(?:\\.\\d+)?|\\d+(?:\\.\\d+)?:|${SECTION_NAME_REGEX})\\])`, 'gi');
const SECTION_TAG_REGEX = new RegExp(`^\\[(${SECTION_NAME_REGEX})\\]$`, 'i');

export type LyricLine = { time: number; text: string; isSection?: boolean };

export function shouldSkipLyricLine(line: string) {
  const cleanLine = line.trim();
  if (!cleanLine) return false; // DO NOT skip empty lines, we need them for linebreaks
  return SFX_LINE_REGEX.test(cleanLine) || BRACKETED_PRODUCTION_NOTE_REGEX.test(cleanLine) || META_LINE_REGEX.test(cleanLine);
}

export function sanitizeLyrics(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line === '' || !shouldSkipLyricLine(line))
    .join('\n');
}

export function parseTimedLyrics(raw: string): LyricLine[] {
  const normalized = raw.replace(/\r\n?/g, '\n').replace(/\\n/g, '\n');
  const lines = normalized
    .replace(TAG_SPLIT_REGEX, '\n$1\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // [mm:ss] or [mm:ss.ms], optionally followed by inline lyric text
  const mmssRegex = /^\[(\d{1,2}):(\d{2}(?:\.\d+)?)\](.*)$/;
  // Lyria-style [15.0:] timestamps
  const lyriaTimeRegex = /^\[(\d+(?:\.\d+)?):\](.*)$/;
  // Section tags: [Chorus], [Verse 1], [Bridge], etc.
  const result: LyricLine[] = [];
  let currentTime = 0;

  for (const line of lines) {
    if (!line) continue;
    if (META_LINE_REGEX.test(line)) continue;
    // Skip Lyria internal structural tags [[A0]]
    if (/^\[\[.*\]\]$/.test(line)) continue;

    const mmssMatch = mmssRegex.exec(line);
    if (mmssMatch) {
      currentTime = parseInt(mmssMatch[1], 10) * 60 + parseFloat(mmssMatch[2]);
      const inline = mmssMatch[3].trim();
      if (inline && !shouldSkipLyricLine(inline)) {
        result.push({ time: currentTime, text: inline });
      }
      continue;
    }

    const lyriaMatch = lyriaTimeRegex.exec(line);
    if (lyriaMatch) {
      currentTime = parseFloat(lyriaMatch[1]);
      const inline = lyriaMatch[2].trim();
      if (inline && !shouldSkipLyricLine(inline)) {
        result.push({ time: currentTime, text: inline });
      }
      continue;
    }

    if (SECTION_TAG_REGEX.test(line)) {
      result.push({ time: currentTime, text: line, isSection: true });
      continue;
    }

    if (shouldSkipLyricLine(line)) continue;
    result.push({ time: currentTime, text: line });
  }

  if (result.length === 0) {
    return [{ time: 0, text: normalized.trim() }];
  }

  return result.sort((a, b) => a.time - b.time);
}
