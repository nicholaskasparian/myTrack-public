const LRC_INLINE_PREFIX_TAG = '[:]';

function shouldSkipLyricLine(line) {
  return false;
}

function parseLRC(lrcText) {
  const normalizedText = lrcText
    .replace(/\r\n?/g, '\n')
    .replace(/\\n/g, '\n');

  // 1. Add newlines before AND after any timestamp tag
  let text = normalizedText.replace(/(\[\d{1,2}:\d{2}(?:\.\d+)?(?: - \d{1,2}:\d{2})?\])/g, '\n$1\n');
  
  // 2. Add newlines before AND after Lyria timestamp tags [15.0:]
  text = text.replace(/(\[\d+(?:\.\d+)?:\])/g, '\n$1\n');
  
  // 3. Add newlines before AND after structural tags
  text = text.replace(/(\[[a-zA-Z\s0-9]+\])/g, '\n$1\n');

  text = text.replace(/([.?!])\s+(?=[A-Z])/g, (match, punctuation, offset, source) => {
    return `${punctuation}\n `;
  });
  
  const lines = text.split('\n').map(l => l.trim());
  
  const parsed = [];
  const lrcRegex = /^\[(\d+):(\d+(?:\.\d+)?)\]$/;
  const timestampRegex = /^\[(\d+):(\d+)(?:\s*-\s*\d+:\d+)?\]$/;
  const lyriaRegex = /^\[(\d+(?:\.\d+)?):\]$/;
  const structureRegex = /^\[[a-zA-Z\s0-9]+\]$/;

  let hasTags = false;
  let lastTime = 0;

  for (const line of lines) {
    if (/^\[\[.*\]\]$/.test(line)) continue;
    if (/^(mosic|bpm|duration_secs|good_crop):\s*[\d.]+/.test(line)) continue;

    let match = lrcRegex.exec(line);
    if (match) {
      hasTags = true;
      lastTime = parseInt(match[1], 10) * 60 + parseFloat(match[2]);
      continue;
    }

    match = timestampRegex.exec(line);
    if (match) {
      hasTags = true;
      lastTime = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      continue;
    }
    
    match = lyriaRegex.exec(line);
    if (match) {
      hasTags = true;
      lastTime = parseFloat(match[1]);
      continue;
    }

    if (structureRegex.test(line)) {
      parsed.push({ time: lastTime, text: line });
      continue;
    }

    let cleanText = line;
    if (cleanText.startsWith('[:]')) {
      cleanText = cleanText.substring(3).trim();
    }
    if (cleanText !== '' && shouldSkipLyricLine(cleanText)) continue;
    
    if (hasTags) {
      parsed.push({ time: lastTime, text: cleanText });
    } else {
      parsed.push({ time: 0, text: cleanText });
      hasTags = true;
    }
  }

  if (parsed.length === 0) {
    const textLines = normalizedText
      .split('\n')
      .map(l => l.trim())
      .map((line) => (line.startsWith(LRC_INLINE_PREFIX_TAG) ? line.substring(LRC_INLINE_PREFIX_TAG.length).trim() : line))
      .filter((line) => line === '' || !shouldSkipLyricLine(line))
      .join('\n');
    return [{ time: 0, text: textLines }];
  }

  const grouped = [];
  for (const entry of parsed) {
    const existing = grouped.find(g => g.time === entry.time);
    if (existing) {
      existing.text += '\n' + entry.text;
    } else {
      grouped.push(entry);
    }
  }

  // trim the grouped texts
  grouped.forEach(g => {
    // replace 3+ newlines with 2 newlines to avoid massive gaps
    g.text = g.text.replace(/\n{3,}/g, '\n\n').trim();
  });

  return grouped.sort((a, b) => a.time - b.time);
}

const raw = `
[Chorus]
[15.0:]  Wait what about lyria 
[18.0:] tags
`
[0:05] Line 1
[0:10] Line 2

[Chorus]
[0:15] Line 3`;

console.log(parseLRC(raw));
