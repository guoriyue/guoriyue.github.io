import { readdir, readFile } from 'node:fs/promises';

// Notify IndexNow-enabled search engines (Bing, DuckDuckGo, Yandex, Naver) of
// every exported page. The key is proven by the public/<key>.txt file.
const OUTPUT = 'dist/client';
const HOST = 'guoriyue.github.io';

const key = (await readdir('public')).find((name) => /^[0-9a-f]{32}\.txt$/.test(name))?.slice(0, -4);
if (!key) throw new Error('No IndexNow key file found in public/');

const sitemap = await readFile(`${OUTPUT}/sitemap.xml`, 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);
if (!response.ok && response.status !== 202) process.exit(1);
