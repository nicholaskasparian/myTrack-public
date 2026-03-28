const fs = require('fs');

function fixZIndex(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/zIndex: 200/g, 'zIndex: 10000');
  fs.writeFileSync(filePath, content, 'utf8');
}

fixZIndex('app/src/app/library/page.tsx');
fixZIndex('app/src/app/generate/page.tsx');
fixZIndex('app/src/app/playlists/[id]/page.tsx');
fixZIndex('app/src/app/share/[id]/page.tsx');
