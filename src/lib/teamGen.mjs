/** チーム/パーティー名ジェネレーター。称号型 / 分隊型 / ギリシャ型。name/kana/note/cat */
const ADJ = [
  ['Crimson','クリムゾン'],['Azure','アジュール'],['Golden','ゴールデン'],['Shadow','シャドウ'],
  ['Iron','アイアン'],['Frost','フロスト'],['Savage','サヴェッジ'],['Royal','ロイヤル'],
  ['Wild','ワイルド'],['Phantom','ファントム'],['Cobalt','コバルト'],['Scarlet','スカーレット'],
];
const ANIMAL = [
  ['Wolves','ウルブズ'],['Hawks','ホークス'],['Ravens','レイヴンズ'],['Foxes','フォクシーズ'],
  ['Lions','ライオンズ'],['Dragons','ドラゴンズ'],['Vipers','ヴァイパーズ'],['Falcons','ファルコンズ'],
  ['Panthers','パンサーズ'],['Sharks','シャークス'],['Owls','オウルズ'],['Tigers','タイガース'],
];
const SQ = [
  ['Viper','ヴァイパー'],['Wolf','ウルフ'],['Phoenix','フェニックス'],['Raven','レイヴン'],
  ['Falcon','ファルコン'],['Cobra','コブラ'],['Hydra','ヒュドラ'],['Specter','スペクター'],
];
const SQTYPE = [['Squad','スクワッド'],['Crew','クルー'],['Unit','ユニット'],['Division','ディビジョン']];
const GREEK = [['Omega','オメガ'],['Sigma','シグマ'],['Alpha','アルファ'],['Delta','デルタ'],['Zeta','ゼータ'],['Kronos','クロノス'],['Nova','ノヴァ']];
const pick = (a, r) => a[Math.floor(r() * a.length)];
function makeOne(r, mode) {
  const m = mode === 'mix' ? pick(['adj', 'squad', 'greek'], r) : mode;
  if (m === 'squad') { const s = pick(SQ, r), t = pick(SQTYPE, r); return { name: `${s[0]} ${t[0]}`, kana: `${s[1]}・${t[1]}`, note: '分隊型', cat: 'squad' }; }
  if (m === 'greek') { const g = pick(GREEK, r), t = pick(SQTYPE, r); return { name: `Team ${g[0]}`, kana: `チーム・${g[1]}`, note: 'ギリシャ型', cat: 'greek' }; }
  const a = pick(ADJ, r), n = pick(ANIMAL, r); return { name: `The ${a[0]} ${n[0]}`, kana: `${a[1]}・${n[1]}`, note: '称号型', cat: 'adj' };
}
const seedRandom = (seed) => { if (seed == null) return Math.random; let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
export function generateTeam({ mode = 'mix', count = 12, seed = null } = {}) {
  const r = seedRandom(seed), out = [], seen = new Set(); let g = 0;
  while (out.length < count && g++ < count * 30) { const x = makeOne(r, mode); if (seen.has(x.name)) continue; seen.add(x.name); out.push(x); }
  return out;
}
