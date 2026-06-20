/** 技名・必殺技メーカー。漢字連結 / 英語 / ○○の〜 の3型。name/kana/note/cat */
const PRE = [
  ['滅却','めっきゃく'],['紅蓮','ぐれん'],['蒼天','そうてん'],['獄炎','ごくえん'],['天魔','てんま'],
  ['絶対','ぜったい'],['虚空','こくう'],['烈風','れっぷう'],['雷光','らいこう'],['氷結','ひょうけつ'],
  ['焦熱','しょうねつ'],['神威','かむい'],['修羅','しゅら'],['黒曜','こくよう'],['終焉','しゅうえん'],
];
const SUF = [
  ['斬','ざん'],['破','は'],['波','は'],['爆','ばく'],['閃','せん'],
  ['撃','げき'],['砲','ほう'],['陣','じん'],['牙','が'],['拳','けん'],
];
const EADJ = [
  ['Crimson','クリムゾン'],['Void','ヴォイド'],['Final','ファイナル'],['Astral','アストラル'],
  ['Infernal','インフェルナル'],['Frost','フロスト'],['Holy','ホーリー'],['Chaos','カオス'],
  ['Divine','ディヴァイン'],['Phantom','ファントム'],['Radiant','レディアント'],['Dark','ダーク'],
];
const ENOUN = [
  ['Edge','エッジ'],['Breaker','ブレイカー'],['Strike','ストライク'],['Blade','ブレイド'],
  ['Fang','ファング'],['Storm','ストーム'],['Burst','バースト'],['Lance','ランス'],['Nova','ノヴァ'],['End','エンド'],
];
const NOBJ = [
  ['終焉','しゅうえん'],['深淵','しんえん'],['紅蓮','ぐれん'],['蒼穹','そうきゅう'],['虚無','きょむ'],['閃光','せんこう'],['業火','ごうか'],
];
const NACT = [
  ['一撃','いちげき'],['咆哮','ほうこう'],['煌めき','きらめき'],['慟哭','どうこく'],['旋律','せんりつ'],['楔','くさび'],
];
const pick = (a, r) => a[Math.floor(r() * a.length)];
function makeOne(r, mode) {
  const m = mode === 'mix' ? pick(['kanji', 'eng', 'no'], r) : mode;
  if (m === 'eng') { const a = pick(EADJ, r), n = pick(ENOUN, r); return { name: `${a[0]} ${n[0]}`, kana: `${a[1]}・${n[1]}`, note: '英語技', cat: 'eng' }; }
  if (m === 'no') { const o = pick(NOBJ, r), a = pick(NACT, r); return { name: `${o[0]}の${a[0]}`, kana: `${o[1]}の${a[1]}`, note: '○○の〜', cat: 'no' }; }
  const p = pick(PRE, r), s = pick(SUF, r); return { name: p[0] + s[0], kana: p[1] + s[1], note: '漢字技', cat: 'kanji' };
}
const seedRandom = (seed) => { if (seed == null) return Math.random; let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
export function generateSkill({ mode = 'mix', count = 12, seed = null } = {}) {
  const r = seedRandom(seed), out = [], seen = new Set(); let g = 0;
  while (out.length < count && g++ < count * 30) { const x = makeOne(r, mode); if (seen.has(x.name)) continue; seen.add(x.name); out.push(x); }
  return out;
}
