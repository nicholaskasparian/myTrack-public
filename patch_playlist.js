const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add state for creating playlist
  const stateRegex = /const \[isLoadingPlaylists, setIsLoadingPlaylists\] = useState\(false\);/;
  if (content.match(stateRegex) && !content.includes('const [isCreatingPlaylist, setIsCreatingPlaylist]')) {
    content = content.replace(stateRegex, 
`const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');`);
  }

  // Add handleCreatePlaylist function
  const funcRegex = /const selectPlaylist = async \(playlistId: string\) => \{/;
  if (content.match(funcRegex) && !content.includes('const handleCreatePlaylist')) {
    content = content.replace(funcRegex,
`const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    setIsCreatingPlaylist(true);
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName })
      });
      if (res.ok) {
        const newPlaylist = await res.json();
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
        // optionally auto-add song
        await selectPlaylist(newPlaylist.id);
      }
    } catch (err) {
      console.error('Error creating playlist', err);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const selectPlaylist = async (playlistId: string) => {`);
  }

  // Update modal UI
  const modalRegex = /<h3 style=\{\{ margin: '0 0 1rem 0' \}\}>Add to Playlist<\/h3>\s*\{isLoadingPlaylists \? \(\s*<p>Loading playlists\.\.\.<\/p>\s*\) : playlists\.length === 0 \? \(\s*<p style=\{\{ color: 'var\(--ink-muted\)' \}\}>No playlists found\.<\/p>\s*\) : \(\s*<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' \}\}>\s*\{playlists\.map\(p => \(\s*<button\s*key=\{p\.id\}\s*onClick=\{\(\) => selectPlaylist\(p\.id\)\}\s*style=\{\{\s*padding: '12px', textAlign: 'left', background: 'var\(--bg\)', border: '1px solid var\(--border\)', cursor: 'pointer',\s*borderRadius: 0, fontFamily: 'inherit'\s*\}\}\s*>\s*\{p\.name\}\s*<\/button>\s*\)\)\}\s*<\/div>\s*\)\}/m;
  
  const replacement = `<h3 style={{ margin: '0 0 1rem 0' }}>Add to Playlist</h3>
            {isLoadingPlaylists ? (
              <p>Loading playlists...</p>
            ) : playlists.length === 0 ? (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--ink-muted)' }}>No playlists found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {playlists.map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectPlaylist(p.id)}
                    style={{
                      padding: '12px', textAlign: 'left', background: 'var(--bg)', border: '1px solid var(--border)', cursor: 'pointer',
                      borderRadius: 0, fontFamily: 'inherit'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input 
                type="text" 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New playlist name..."
                style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
              />
              <button 
                onClick={handleCreatePlaylist}
                disabled={isCreatingPlaylist || !newPlaylistName.trim()}
                style={{ 
                  padding: '10px 16px', 
                  background: 'var(--ink)', 
                  color: 'var(--bg)', 
                  border: 'none', 
                  cursor: (isCreatingPlaylist || !newPlaylistName.trim()) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: (isCreatingPlaylist || !newPlaylistName.trim()) ? 0.5 : 1
                }}
              >
                Create
              </button>
            </div>`;

  if (content.match(modalRegex)) {
    content = content.replace(modalRegex, replacement);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('app/src/app/playlists/[id]/page.tsx');
replaceInFile('app/src/app/share/[id]/page.tsx');
