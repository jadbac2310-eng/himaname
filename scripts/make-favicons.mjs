#!/usr/bin/env node
/**
 * public/favicon.svg から各サイズのPNG / ICO / apple-touch-icon を生成する。
 * SVGを更新したら `node scripts/make-favicons.mjs` を再実行するだけ。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.resolve(__dirname, '..', 'public');
const SVG = fs.readFileSync(path.join(PUB, 'favicon.svg'));

async function png(size, out, flattenBg) {
  let img = sharp(SVG, { density: 384 }).resize(size, size);
  if (flattenBg) img = img.flatten({ background: flattenBg });
  const buf = await img.png().toBuffer();
  fs.writeFileSync(path.join(PUB, out), buf);
  return buf;
}

const b16 = await png(16, 'favicon-16.png');
const b32 = await png(32, 'favicon-32.png');
const b48 = await png(48, 'favicon-48.png');
await png(180, 'apple-touch-icon.png', '#2563eb'); // iOS用は背景塗りつぶし
await png(192, 'icon-192.png', '#2563eb');          // PWA/Android用
await png(512, 'icon-512.png', '#2563eb');

const ico = await pngToIco([b16, b32, b48]);
fs.writeFileSync(path.join(PUB, 'favicon.ico'), ico);

console.log('✅ favicons generated: favicon.ico / favicon-16,32,48.png / apple-touch-icon.png / icon-192,512.png');
