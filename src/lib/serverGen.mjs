/** Discord/サーバー名メーカー（おしゃれ系）。場所型 / 装飾型 / 隠れ家型。name/kana/note/cat */
const AES = [
  ['Velvet','ヴェルヴェット'],['Moonlit','ムーンリット'],['Crimson','クリムゾン'],['Pastel','パステル'],
  ['Misty','ミスティ'],['Golden','ゴールデン'],['Twilight','トワイライト'],['Aurora','オーロラ'],
  ['Lunar','ルナ'],['Ember','エンバー'],['Cosy','コージー'],['Dreamy','ドリーミー'],
];
const PLACE = [
  ['Lounge','ラウンジ'],['Haven','ヘイヴン'],['Garden','ガーデン'],['Cafe','カフェ'],
  ['Den','デン'],['Hub','ハブ'],['Realm','レルム'],['Nest','ネスト'],['Sanctuary','サンクチュアリ'],['Atelier','アトリエ'],
];
const SOFT = [
  ['moon','ムーン'],['star','スター'],['cloud','クラウド'],['dream','ドリーム'],
  ['honey','ハニー'],['peach','ピーチ'],['angel','エンジェル'],['petal','ペタル'],
];
const pick = (a, r) => a[Math.floor(r() * a.length)];
function makeOne(r, mode) {
  const m = mode === 'mix' ? pick(['place', 'deco', 'den'], r) : mode;
  if (m === 'deco') { const s = pick(SOFT, r); return { name: `⊹ ˚ ${s[0]} ˚ ⊹`, kana: `${s[1]}（装飾）`, note: '装飾型', cat: 'deco' }; }
  if (m === 'den') { const s = pick(SOFT, r), p = pick(PLACE, r); return { name: `${s[0]}'s ${p[0]}`, kana: `${s[1]}ズ・${p[1]}`, note: '隠れ家型', cat: 'den' }; }
  const a = pick(AES, r), p = pick(PLACE, r); return { name: `${a[0]} ${p[0]}`, kana: `${a[1]}・${p[1]}`, note: '場所型', cat: 'place' };
}
const seedRandom = (seed) => { if (seed == null) return Math.random; let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
export function generateServer({ mode = 'mix', count = 12, seed = null } = {}) {
  const r = seedRandom(seed), out = [], seen = new Set(); let g = 0;
  while (out.length < count && g++ < count * 30) { const x = makeOne(r, mode); if (seen.has(x.name)) continue; seen.add(x.name); out.push(x); }
  return out;
}
