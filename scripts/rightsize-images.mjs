/**
 * Right-sizes source images before they enter the repository.
 *
 * Any raster image wider than MAX_WIDTH is downscaled in place to MAX_WIDTH.
 * This caps Astro's generated variant count at our breakpoints (2x of the
 * 640px content column) so oversized originals never enter the srcset.
 *
 * Usage:
 *   bun scripts/rightsize-images.mjs            Scan all of content/ + src/assets/
 *   bun scripts/rightsize-images.mjs --staged   Process only staged images (used by
 *                                               the pre-commit hook); resized files
 *                                               are re-staged automatically.
 *
 * Scope: content/ and src/assets/ (the images Astro processes). Files in
 * public/ are served verbatim, so resizing them here would change what ships;
 * handle those manually if needed.
 *
 * Quality: PNG stays lossless. JPEG/WebP are re-encoded at high quality —
 * the only intended loss beyond resampling is negligible recompression.
 */
import { readdirSync, renameSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const MAX_WIDTH = 1280;
const DIRECTORIES = ['content', 'src/assets'];
const EXTENSIONS = /\.(png|jpe?g|webp)$/i;

const ENCODE_OPTIONS = {
  jpeg: { quality: 95, mozjpeg: true },
  webp: { quality: 92 },
  png: {}, // lossless
};

const stagedMode = process.argv.includes('--staged');

async function stagedImages() {
  const { stdout } = await execFileAsync('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
  ]);
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (file) =>
        file &&
        EXTENSIONS.test(file) &&
        DIRECTORIES.some((dir) => file.startsWith(`${dir}/`)),
    );
}

function* scanAll() {
  for (const dir of DIRECTORIES) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      continue; // directory does not exist yet
    }
    for (const entry of entries) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) yield* scanDir(path);
      else if (EXTENSIONS.test(entry)) yield path;
    }
  }
}

function* scanDir(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* scanDir(path);
    else if (EXTENSIONS.test(entry)) yield path;
  }
}

const files = stagedMode ? await stagedImages() : [...scanAll()];

let scanned = 0;
const resized = [];

for (const file of files) {
  scanned++;
  const { width, format } = await sharp(file).metadata();

  if (!width || width <= MAX_WIDTH || !(format in ENCODE_OPTIONS)) continue;

  const tmp = `${file}.rightsize.tmp`;
  await sharp(file)
    .resize({ width: MAX_WIDTH })
    .toFormat(format, ENCODE_OPTIONS[format])
    .toFile(tmp);
  renameSync(tmp, file);

  resized.push(file);
  console.log(`resized ${file} -> ${MAX_WIDTH}px wide`);
}

if (stagedMode && resized.length > 0) {
  await execFileAsync('git', ['add', '--', ...resized]);
}

console.log(
  resized.length === 0
    ? `rightsize: all ${scanned} images within ${MAX_WIDTH}px`
    : `rightsize: resized ${resized.length} of ${scanned} images`,
);
