/** ID・プレイヤーネームメーカー。キャメル / アンダーバー / 装飾 / 数字。name/kana/note/cat */
const W1 = [
  ['Shadow','シャドウ'],['Frost','フロスト'],['Void','ヴォイド'],['Ash','アッシュ'],['Raven','レイヴン'],
  ['Storm','ストーム'],['Lunar','ルナ'],['Ember','エンバー'],['Onyx','オニキス'],['Kaze','カゼ'],
  ['Yuki','ユキ'],['Ronin','ローニン'],['Nova','ノヴァ'],['Kage','カゲ'],['Rei','レイ'],['Zero','ゼロ'],
];
const W2 = [
  ['Fox','フォックス'],['Wolf','ウルフ'],['Raven','レイヴン'],['Byte','バイト'],['Blade','ブレイド'],
  ['Wisp','ウィスプ'],['Soul','ソウル'],['Edge','エッジ'],['Bane','ベイン'],['Heart','ハート'],['Reaper','リーパー'],
];
const NUM = ['7', '99', '0', '13', 'X', '404'];
const pick = (a, r) => a[Math.floor(r() * a.length)];
function makeOne(r, mode) {
  const m = mode === 'mix' ? pick(['camel', 'snake', 'deco', 'num'], r) : mode;
  const a = pick(W1, r), b = pick(W2, r);
  if (m === 'snake') return { name: `${a[0].toLowerCase()}_${b[0].toLowerCase()}`, kana: `${a[1]}${b[1]}`, note: 'アンダーバー', cat: 'snake' };
  if (m === 'deco') return { name: `˗ˏˋ ${a[0]}${b[0]} ˎˊ˗`, kana: `${a[1]}${b[1]}（装飾）`, note: '装飾', cat: 'deco' };
  if (m === 'num') return { name: `${a[0]}${pick(NUM, r)}`, kana: `${a[1]}`, note: '数字入り', cat: 'num' };
  return { name: `${a[0]}${b[0]}`, kana: `${a[1]}${b[1]}`, note: 'キャメル', cat: 'camel' };
}
const seedRandom = (seed) => { if (seed == null) return Math.random; let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
export function generateId({ mode = 'mix', count = 12, seed = null } = {}) {
  const r = seedRandom(seed), out = [], seen = new Set(); let g = 0;
  while (out.length < count && g++ < count * 30) { const x = makeOne(r, mode); if (seen.has(x.name)) continue; seen.add(x.name); out.push(x); }
  return out;
}
