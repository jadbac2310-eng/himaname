/**
 * ギルド名 / チーム名 / クラン名 ジェネレーター（エンジン）
 * 4パターン: 「The 形容詞 集団」/「集団 of 概念」/ 合成語 / ラテン語の標語
 * 各候補は name / kana / note(意味) を持つ。node/ブラウザ両対応。
 */

const ADJ = [
  ['Crimson','クリムゾン','深紅の'],['Fallen','フォールン','堕ちし'],['Eternal','エターナル','永遠の'],
  ['Iron','アイアン','鉄の'],['Shadow','シャドウ','影の'],['Frozen','フローズン','凍てつく'],
  ['Burning','バーニング','燃ゆる'],['Silent','サイレント','静寂の'],['Ashen','アッシェン','灰白の'],
  ['Golden','ゴールデン','黄金の'],['Savage','サヴェッジ','獰猛な'],['Radiant','レディアント','輝ける'],
  ['Hollow','ハロウ','虚ろな'],['Grim','グリム','峻厳な'],['Azure','アジュール','蒼き'],
  ['Obsidian','オブシディアン','黒曜の'],['Phantom','ファントム','幻影の'],['Wicked','ウィキッド','邪なる'],
];
const GROUP = [
  ['Order','オーダー','騎士団'],['Legion','レギオン','軍団'],['Covenant','カヴェナント','盟約'],
  ['Vanguard','ヴァンガード','先鋒'],['Reapers','リーパーズ','刈り手'],['Wolves','ウルブズ','狼たち'],
  ['Crown','クラウン','王冠'],['Brigade','ブリゲード','旅団'],['Blades','ブレイズ','刃'],
  ['Sentinels','センチネルズ','哨兵'],['Ravens','レイヴンズ','鴉'],['Knights','ナイツ','騎士'],
  ['Crusade','クルセイド','聖戦'],['Syndicate','シンジケート','組織'],['Dominion','ドミニオン','統治領'],
  ['Throne','スローン','王座'],['Eclipse','エクリプス','蝕'],['Requiem','レクイエム','鎮魂'],
];
const CONCEPT = [
  ['Dawn','ドーン','暁'],['Dusk','ダスク','黄昏'],['Eternity','エタニティ','永遠'],
  ['the Abyss','アビス','深淵'],['the Storm','ストーム','嵐'],['Ash','アッシュ','灰'],
  ['Ruin','ルイン','破滅'],['Valor','ヴァラー','武勇'],['the Void','ヴォイド','虚無'],
  ['Frost','フロスト','霜'],['Embers','エンバーズ','残り火'],['Shadows','シャドウズ','影'],
  ['Flame','フレイム','焔'],['Glory','グローリー','栄光'],['the Phoenix','フェニックス','不死鳥'],
];
const CMP_A = [
  ['Storm','ストーム','嵐'],['Blood','ブラッド','血'],['Iron','アイアン','鉄'],['Night','ナイト','夜'],
  ['Frost','フロスト','霜'],['Doom','ドゥーム','破滅'],['Grim','グリム','峻厳'],['Shadow','シャドウ','影'],
  ['Ash','アッシュ','灰'],['Dread','ドレッド','戦慄'],['Stone','ストーン','石'],['Wolf','ウルフ','狼'],
  ['Raven','レイヴン','鴉'],['Soul','ソウル','魂'],['Fire','ファイア','焔'],['Void','ヴォイド','虚無'],
];
const CMP_B = [
  ['guard','ガード','守護'],['fall','フォール','終焉'],['bane','ベイン','災厄'],['blade','ブレイド','刃'],
  ['fang','ファング','牙'],['claw','クロウ','爪'],['watch','ウォッチ','監視'],['forge','フォージ','鍛'],
  ['hold','ホールド','砦'],['crest','クレスト','頂'],['thorn','ソーン','茨'],['spire','スパイア','尖塔'],
  ['veil','ヴェイル','帷'],['reach','リーチ','領'],['fury','フューリー','憤怒'],
];
const LATIN = [
  ['Ad Astra','アド・アストラ','星々へ'],['Memento Mori','メメント・モリ','死を想え'],
  ['Per Aspera','ペル・アスペラ','困難を越えて'],['Dum Spiro Spero','ドゥム・スピロ・スペロ','息ある限り希望あり'],
  ['Sic Itur Ad Astra','シック・イトゥル・アド・アストラ','かくして星へ至る'],
  ['Ex Tenebris Lux','エクス・テネブリス・ルクス','闇より光を'],['Mors Vincit Omnia','モルス・ウィンキト・オムニア','死は全てを制す'],
  ['Fortis et Liber','フォルティス・エト・リベル','勇敢にして自由'],['Veni Vidi Vici','ウェニ・ウィディ・ウィキ','来た 見た 勝った'],
  ['Aut Vincere Aut Mori','アウト・ウィンケレ・アウト・モリ','勝利か死か'],
];

function pick(a, rnd) { return a[Math.floor(rnd() * a.length)]; }

function makeOne(rnd, mode) {
  const m = mode === 'mix' ? pick(['the', 'of', 'cmp', 'latin'], rnd) : mode;
  if (m === 'latin') {
    const [en, kana, ja] = pick(LATIN, rnd);
    return { name: en, kana, note: ja, cat: 'latin' };
  }
  if (m === 'cmp') {
    const a = pick(CMP_A, rnd), b = pick(CMP_B, rnd);
    return { name: a[0] + b[0], kana: a[1] + b[1], note: `${a[2]}の${b[2]}`, cat: 'cmp' };
  }
  if (m === 'of') {
    const g = pick(GROUP, rnd), c = pick(CONCEPT, rnd);
    return { name: `${g[0]} of ${c[0]}`, kana: `${g[1]}・オブ・${c[1]}`, note: `${c[2]}の${g[2]}`, cat: 'of' };
  }
  const ad = pick(ADJ, rnd), g = pick(GROUP, rnd);
  return { name: `The ${ad[0]} ${g[0]}`, kana: `${ad[1]}・${g[1]}`, note: `${ad[2]}${g[2]}`, cat: 'the' };
}

const seedRandom = (seed) => {
  if (seed == null) return Math.random;
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
};

export function generateGuild({ mode = 'mix', count = 12, seed = null } = {}) {
  const rnd = seedRandom(seed);
  const out = [], seen = new Set();
  let guard = 0;
  while (out.length < count && guard++ < count * 30) {
    const x = makeOne(rnd, mode);
    if (seen.has(x.name)) continue;
    seen.add(x.name);
    out.push(x);
  }
  return out;
}
