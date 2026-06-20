#!/usr/bin/env node
/**
 * ブログ本体の単発アセットを gpt-image で生成する汎用CLI。
 *   node scripts/gen-image.mjs "<プロンプト>" <出力パス> [size]
 * 例:
 *   node scripts/gen-image.mjs "flat minimal cat battle hero, white bg, no text" public/images/og-hero.png 1536x1024
 *
 * OPENAI_API_KEY は環境変数から読む。出力は自動でWebP併産（.webp）。
 */
import fs from 'node:fs';
import OpenAI from 'openai';
import sharp from 'sharp';

const [, , prompt, outPath, size = '1024x1024'] = process.argv;
if (!prompt || !outPath) {
  console.error('usage: node scripts/gen-image.mjs "<prompt>" <outPath> [size]');
  process.exit(1);
}
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('ERROR: OPENAI_API_KEY 未設定'); process.exit(1); }
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-1';

const openai = new OpenAI({ apiKey: KEY });
const r = await openai.images.generate({ model: MODEL, prompt, size, n: 1 });
const b64 = r.data[0].b64_json;
const buf = Buffer.from(b64, 'base64');

if (outPath.endsWith('.png')) {
  fs.writeFileSync(outPath, buf);
  await sharp(buf).webp({ quality: 82 }).toFile(outPath.replace(/\.png$/, '.webp'));
} else if (outPath.endsWith('.webp')) {
  await sharp(buf).webp({ quality: 82 }).toFile(outPath);
} else {
  fs.writeFileSync(outPath, buf);
}
console.log(`✅ generated: ${outPath}`);
