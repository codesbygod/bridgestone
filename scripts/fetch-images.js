'use strict';

/**
 * Copy the hosted Bridgestone photography into the repo.
 *
 * Reads src/data/image-sources.json, downloads each full-resolution original,
 * saves it to public/assets/img/<name>.webp (resized to at most 2400px wide)
 * and rewrites every reference to the hosted copy in src/data/*.json and
 * public/js/main.js to the local path. Run with `npm run images:fetch`, then
 * commit public/assets/img/ and the rewritten files.
 *
 * WebP conversion uses `sharp` when it is installed
 * (`npm install --no-save sharp`). Without it the originals are saved as PNG,
 * which works but is several times heavier.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'assets', 'img');
const SOURCES = path.join(ROOT, 'src', 'data', 'image-sources.json');
const REWRITE = [
  'src/data/images.json',
  'src/data/projects.json',
  'src/data/services.json',
  'src/data/leadership.json',
  'public/js/main.js',
];
const MAX_WIDTH = 2400;

function loadSharp() {
  try {
    return require('sharp');
  } catch (err) {
    return null;
  }
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const { images } = JSON.parse(fs.readFileSync(SOURCES, 'utf8'));
  const sharp = loadSharp();
  if (!sharp) console.warn('[images] sharp not installed: saving PNG originals (npm install --no-save sharp for WebP)');
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const replacements = [];
  for (const [name, src] of Object.entries(images)) {
    const raw = await download(src.original);
    let file;
    if (sharp) {
      file = `${name}.webp`;
      await sharp(raw)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(IMG_DIR, file));
    } else {
      file = `${name}.png`;
      fs.writeFileSync(path.join(IMG_DIR, file), raw);
    }
    const size = fs.statSync(path.join(IMG_DIR, file)).size;
    console.log(`[images] ${file} (${Math.round(size / 1024)} KB)`);
    const local = `/assets/img/${file}`;
    replacements.push([src.preview, local], [src.original, local]);
    // A rerun with sharp installed upgrades a PNG copy from an earlier run.
    if (file.endsWith('.webp')) replacements.push([`/assets/img/${name}.png`, local]);
  }

  for (const rel of REWRITE) {
    const abs = path.join(ROOT, rel);
    let text = fs.readFileSync(abs, 'utf8');
    let count = 0;
    for (const [from, to] of replacements) {
      const parts = text.split(from);
      count += parts.length - 1;
      text = parts.join(to);
    }
    fs.writeFileSync(abs, text);
    if (count) console.log(`[images] ${rel}: ${count} reference(s) now local`);
  }
  console.log('[images] done. Run npm run build, then commit public/assets/img/ and the files above.');
}

main().catch((err) => {
  console.error('[images] failed:', err.message);
  process.exit(1);
});
