#!/usr/bin/env node
/** ガチャ用モンスター絵を gpt-image で生成（レア度別・透過）→ public/images/gacha/*.webp */
import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';
import sharp from 'sharp';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('OPENAI_API_KEY 未設定'); process.exit(1); }
const openai = new OpenAI({ apiKey: KEY });
const DIR = 'public/images/gacha';
fs.mkdirSync(DIR, { recursive: true });

const MONSTERS = [
  ['R', 'r-slime', 'a cute round blue slime monster with a happy face'],
  ['R', 'r-goblin', 'a small mischievous green goblin holding a wooden club'],
  ['R', 'r-bat', 'a small purple bat monster with big round eyes'],
  ['SR', 'sr-wolf', 'a fierce flaming fire wolf with a glowing orange mane'],
  ['SR', 'sr-eagle', 'a majestic ice eagle with crystal-blue feathers'],
  ['SR', 'sr-golem', 'a sturdy rock golem with a glowing green core'],
  ['SSR', 'ssr-dragon', 'a legendary golden dragon breathing radiant fire, majestic and powerful'],
  ['SSR', 'ssr-phoenix', 'a legendary rainbow phoenix with blazing spread wings, radiant'],
  ['SSR', 'ssr-lion', 'a legendary thunder lion with an electric golden mane, majestic'],
];

for (const [rarity, file, desc] of MONSTERS) {
  const prompt = `Flat, bold, vibrant mobile-game gacha card illustration of ${desc}. Cute but cool RPG monster, thick clean outline, full body centered, dramatic lighting, transparent background. No text, no letters, no frame, no border.`;
  process.stdout.write(`generating ${rarity} ${file} ... `);
  try {
    const r = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x1024', background: 'transparent', quality: 'medium', n: 1 });
    const buf = Buffer.from(r.data[0].b64_json, 'base64');
    await sharp(buf).resize(512, 512).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(DIR, `${file}.webp`));
    console.log('ok');
  } catch (e) { console.log('FAIL', e.message); }
}
console.log('done');
