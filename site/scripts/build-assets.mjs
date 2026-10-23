// Builds web-ready textures for the site from images/anime/ (never images/people/).
// Run with `npm run assets`. Output goes to public/assets/, which Vite serves as-is.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ANIME = path.resolve('../images/anime');
const OUT = path.resolve('public/assets/letter-001');
fs.mkdirSync(OUT, { recursive: true });

const L = `${ANIME}/letter-001`;
const C = `${L}/cutouts`;

// [source, output name, max width, has alpha]
const jobs = [
  [`${L}/a01-hillside-back.png`, 'hill-back', 2048, false],
  [`${C}/a02-hillside-mid.png`, 'hill-mid', 2048, true],
  [`${C}/a03-hillside-front.png`, 'hill-front', 2048, true],
  [`${L}/a04a-cup-in-earth.png`, 'dig-cup', 2048, false],
  ...[1, 2, 3, 4, 5].map((i) => [`${C}/a04b-clump-0${i}.png`, `dig-clump-${i}`, 512, true]),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => [`${C}/a04c-piece-0${i}.png`, `dig-piece-${i}`, 512, true]),
  [`${C}/a04d-knife.png`, 'dig-knife', 640, true],
  [`${L}/a06-fireside-dusk.png`, 'fireside', 2048, false],
  [`${L}/a07-hume-drawing-room.png`, 'hume-room', 2048, false],
  [`${L}/a08-brooch.png`, 'brooch', 1536, false],
  [`${L}/a09-study-night.png`, 'study', 2048, false],
  [`${L}/a10-doorway.png`, 'doorway', 1536, false],
  [`${ANIME}/cutouts/alfred-percy-sinnett.png`, 'char-sinnett', 1024, true],
  [`${ANIME}/cutouts/helena-blavatsky.png`, 'char-blavatsky', 1024, true],
  [`${ANIME}/cutouts/henry-steel-olcott.png`, 'char-olcott', 1024, true],
  [`${ANIME}/cutouts/allan-octavian-hume.png`, 'char-hume', 1024, true],
];

const manifest = {};
for (const [src, name, maxW, alpha] of jobs) {
  const img = sharp(src).resize({ width: maxW, withoutEnlargement: true });
  const out = `${OUT}/${name}.webp`;
  const info = await img.webp({ quality: alpha ? 88 : 82, alphaQuality: 90, effort: 5 }).toFile(out);
  manifest[name] = { w: info.width, h: info.height };
  console.log(name.padEnd(16), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
// Natural sizes, so the scenes can lay planes out at the right aspect before textures load.
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
