'use strict';

/**
 * Build static HTML pages from shared layout + per-page content.
 * Run with `npm run build`. Output goes to public/*.html.
 */

const fs = require('fs');
const path = require('path');
const { page } = require('../src/site/layout');
const pages = require('../src/site/pages');
const images = require('../src/site/images');

const publicDir = path.join(__dirname, '..', 'public');

// Project pages are generated one per project, so clear the old set first:
// a project removed from projects.json must not leave its page behind.
const projectsDir = path.join(publicDir, 'projects');
fs.rmSync(projectsDir, { recursive: true, force: true });
fs.mkdirSync(projectsDir, { recursive: true });

let count = 0;
for (const def of pages) {
  const html = page(def);
  fs.writeFileSync(path.join(publicDir, def.file), html, 'utf8');
  count += 1;
  console.log(`  built ${def.file} (${html.length} bytes)`);
}
console.log(`[build] wrote ${count} pages`);

// Say out loud which real artwork was picked up, so a deploy that is still
// running on placeholders is obvious from the build log rather than the page.
const picked = Array.from(new Set(images._resolved));
if (picked.length) {
  console.log(`[build] using ${picked.length} supplied image(s): ${picked.join(', ')}`);
} else {
  console.log('[build] no page-level images in public/assets/img: using the fallbacks named in src/data/images.json');
}
