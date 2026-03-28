const SFX_LINE_REGEX = /^(?:\[[^\]]+\]|(?:low|high|soft|gentle|deep|distant|subtle)\s+)?(?:hum|humming|sfx|sound effect|ambient noise|fx|whisper|echo|drone)\b/i;
const BRACKETED_PRODUCTION_NOTE_REGEX = /^\[(?!\d{1,2}:\d{2}(?:\.\d+)?(?:\s*-\s*\d{1,2}:\d{2})?\]$)(?!\d+(?:\.\d+)?:\]$)(?![a-zA-Z\s0-9]+\]$).+\]$/;
const META_LINE_REGEX = /^(music|bpm|duration_secs|good_crop):/i;
const SECTION_NAME_REGEX = '(?:Intro|Verse(?:\\s+\\d+)?|Pre[- ]?Chorus|Chorus|Post[- ]?Chorus|Bridge|Hook|Refrain|Outro)';
const TAG_SPLIT_REGEX = new RegExp(`(\\[(?:\\d{1,2}:\\d{2}(?:\\.\\d+)?|\\d+(?:\\.\\d+)?:|${SECTION_NAME_REGEX})\\])`, 'gi');
const SECTION_TAG_REGEX = new RegExp(`^\\[(${SECTION_NAME_REGEX})\\]$`, 'i');

export type LyricLine = { time: number; text: string; isSection?: boolean };

type LyricToken =
  | { kind: 'anchor'; time: number }
  | { kind: 'line'; text: string; isSection: boolean; time?: number };

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
  const tokens: LyricToken[] = [];

  for (const line of lines) {
    if (!line) continue;
    if (META_LINE_REGEX.test(line)) continue;
    // Skip Lyria internal structural tags [[A0]]
    if (/^\[\[.*\]\]$/.test(line)) continue;

    const mmssMatch = mmssRegex.exec(line);
    if (mmssMatch) {
      const parsedTime = parseInt(mmssMatch[1], 10) * 60 + parseFloat(mmssMatch[2]);
      tokens.push({ kind: 'anchor', time: parsedTime });
      const inline = mmssMatch[3].trim();
      if (inline && !shouldSkipLyricLine(inline)) {
        tokens.push({ kind: 'line', time: parsedTime, text: inline, isSection: false });
      }
      continue;
    }

    const lyriaMatch = lyriaTimeRegex.exec(line);
    if (lyriaMatch) {
      const parsedTime = parseFloat(lyriaMatch[1]);
      tokens.push({ kind: 'anchor', time: parsedTime });
      const inline = lyriaMatch[2].trim();
      if (inline && !shouldSkipLyricLine(inline)) {
        tokens.push({ kind: 'line', time: parsedTime, text: inline, isSection: false });
      }
      continue;
    }

    if (SECTION_TAG_REGEX.test(line)) {
      tokens.push({ kind: 'line', text: line, isSection: true });
      continue;
    }

    if (shouldSkipLyricLine(line)) continue;
    tokens.push({ kind: 'line', text: line, isSection: false });
  }

  const anchorIndices = tokens
    .map((token, idx) => (token.kind === 'anchor' ? idx : -1))
    .filter((idx) => idx >= 0);

  const allAnchorIndices = [-1, ...anchorIndices, tokens.length];

  for (let a = 0; a < allAnchorIndices.length - 1; a++) {
    const startIdx = allAnchorIndices[a];
    const endIdx = allAnchorIndices[a + 1];
    const startTime =
      startIdx >= 0 && tokens[startIdx]?.kind === 'anchor'
        ? (tokens[startIdx] as Extract<LyricToken, { kind: 'anchor' }>).time
        : 0;
    const endTime =
      endIdx < tokens.length && tokens[endIdx]?.kind === 'anchor'
        ? (tokens[endIdx] as Extract<LyricToken, { kind: 'anchor' }>).time
        : null;

    const untimedLyricIndices: number[] = [];
    for (let i = startIdx + 1; i < endIdx; i++) {
      const token = tokens[i];
      if (token.kind !== 'line') continue;
      if (token.time !== undefined) continue;
      if (token.isSection) {
        token.time = startTime;
        continue;
      }
      untimedLyricIndices.push(i);
    }

    const canInterpolate =
      endTime !== null && endTime > startTime && untimedLyricIndices.length > 0;

    if (canInterpolate) {
      const step = (endTime - startTime) / (untimedLyricIndices.length + 1);
      untimedLyricIndices.forEach((idx, offset) => {
        const token = tokens[idx] as Extract<LyricToken, { kind: 'line' }>;
        token.time = startTime + step * (offset + 1);
      });
    } else {
      untimedLyricIndices.forEach((idx) => {
        const token = tokens[idx] as Extract<LyricToken, { kind: 'line' }>;
        token.time = startTime;
      });
    }
  }

  const result: LyricLine[] = tokens
    .filter((token): token is Extract<LyricToken, { kind: 'line' }> => token.kind === 'line')
    .map((token) => ({
      time: token.time ?? 0,
      text: token.text,
      isSection: token.isSection ? true : undefined,
    }));

  if (result.length === 0) {
    return [{ time: 0, text: normalized.trim() }];
  }

  return result;
}
