import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Vinext redirects nested routes during prerender with trailingSlash enabled.
// Render without that redirect, then provide GitHub Pages directory indexes.
async function addDirectoryIndexes(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await addDirectoryIndexes(path);
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const destination = path.slice(0, -5);
      await mkdir(destination, { recursive: true });
      await copyFile(path, join(destination, 'index.html'));
    }
  }
}
await addDirectoryIndexes('dist/client/blog');
