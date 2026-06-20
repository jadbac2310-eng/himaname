/**
 * RPG風かっこいい名前ジェネレーター（エンジン）
 * 3系統: 実在語(クラウド型) / 神話・ラテン・カバラ(セフィロス型) / 造語(幻想)
 * すべて name / kana(カナ読み) / note(由来 or 造語タグ) を持つ。
 * node でもブラウザでも動くプレーンなES module。
 */

// ── 実在語型（クラウドのように、喚起力ある実在の英単語を名前に転用）──
export const REAL = [
  ['Cloud','クラウド','雲'],['Frost','フロスト','霜'],['Raven','レイヴン','大鴉'],
  ['Storm','ストーム','嵐'],['Ash','アッシュ','灰'],['Vesper','ヴェスパー','宵の明星'],
  ['Onyx','オニキス','漆黒の宝石'],['Ember','エンバー','残り火'],['Sable','セーブル','漆黒'],
  ['Thorn','ソーン','茨'],['Vale','ヴェイル','谷'],['Wren','レン','ミソサザイ'],
  ['Slate','スレート','青灰の石'],['Reign','レイン','統治'],['Halo','ヘイロー','光輪'],
  ['Quill','クィル','羽根ペン'],['Dusk','ダスク','黄昏'],['Cobalt','コバルト','濃藍'],
  ['Indigo','インディゴ','藍'],['Sterling','スターリング','純銀'],['Hawk','ホーク','鷹'],
  ['Wolfe','ウルフ','狼'],['Cove','コーヴ','入江'],['Flint','フリント','火打石'],
  ['Grimm','グリム','厳格'],['Vow','ヴァウ','誓い'],['Rune','ルーン','古代文字'],
  ['Sage','セージ','賢者'],['Crow','クロウ','鴉'],['Mercer','マーサー','商人'],
  ['Ravage','ラヴァージュ','蹂躙'],['Solace','ソレス','慰め'],['Verge','ヴァージ','瀬戸際'],
  ['Wraith','レイス','亡霊'],['Bane','ベイン','破滅'],['Lyric','リリック','叙情詩'],
  // ── 増量 ──
  ['Obsidian','オブシディアン','黒曜石'],['Garnet','ガーネット','柘榴石'],['Jasper','ジャスパー','碧玉'],
  ['Beryl','ベリル','緑柱石'],['Opal','オパール','蛋白石'],['Amber','アンバー','琥珀'],
  ['Crimson','クリムゾン','深紅'],['Azure','アジュール','蒼天'],['Vermilion','ヴァーミリオン','朱'],
  ['Scarlet','スカーレット','緋色'],['Ivory','アイヴォリー','象牙'],['Gale','ゲイル','強風'],
  ['Tempest','テンペスト','大嵐'],['Cinder','シンダー','燃え殻'],['Talon','タロン','猛禽の爪'],
  ['Fang','ファング','牙'],['Shroud','シュラウド','屍衣'],['Spectre','スペクター','幽霊'],
  ['Vigil','ヴィジル','不寝番'],['Requiem','レクイエム','鎮魂歌'],['Eclipse','エクリプス','蝕'],
  ['Nova','ノヴァ','新星'],['Zephyr','ゼファー','西風'],['Mistral','ミストラル','北風'],
  ['Wisp','ウィスプ','鬼火'],['Hollow','ハロウ','虚無'],['Verdant','ヴァーダント','翠'],
  ['Nocturne','ノクターン','夜想曲'],['Cipher','サイファー','暗号'],['Relic','レリック','遺物'],
  ['Solstice','ソルスティス','至点'],['Mirage','ミラージュ','蜃気楼'],['Venom','ヴェノム','毒'],
  ['Quartz','クォーツ','水晶'],['Cyan','シアン','青緑'],['Sear','シア','灼熱'],
];

// ── 神話・ラテン・カバラ・悪魔学・星名型（普通の日本人が思いつかない語源）──
export const MYTH = [
  // カバラ（セフィラ）
  ['Sephiroth','セフィロト','生命の樹の流出'],['Kether','ケテル','王冠（セフィラ）'],
  ['Malkuth','マルクト','王国（セフィラ）'],['Tiphereth','ティファレト','美（セフィラ）'],
  ['Geburah','ゲブラー','峻厳（セフィラ）'],['Chokmah','コクマー','叡智（セフィラ）'],
  ['Binah','ビナー','理解（セフィラ）'],['Yesod','イェソド','基盤（セフィラ）'],
  ['Chesed','ケセド','慈悲（セフィラ）'],['Netzach','ネツァク','勝利（セフィラ）'],
  // ラテン語
  ['Noctis','ノクティス','夜（羅）'],['Ignis','イグニス','焔（羅）'],['Umbra','ウンブラ','影（羅）'],
  ['Aether','アエテル','上天の気'],['Mortis','モルティス','死の（羅）'],['Lux','ルクス','光（羅）'],
  ['Caelum','カエルム','天空（羅）'],['Astra','アストラ','星々（羅）'],['Ferrum','フェルム','鉄（羅）'],
  ['Solis','ソリス','太陽の（羅）'],['Vesperus','ヴェスペルス','宵（羅）'],['Glacies','グラキエス','氷（羅）'],
  ['Tenebrae','テネブレ','闇（羅）'],['Fulgor','フルゴル','閃光（羅）'],['Cruor','クルオル','流血（羅）'],
  // ギリシア・冥府
  ['Erebus','エレボス','幽冥の神'],['Nyx','ニュクス','夜の女神'],['Tartarus','タルタロス','奈落'],
  ['Orpheus','オルフェウス','冥府の楽人'],['Thanatos','タナトス','死の神'],['Hypnos','ヒュプノス','眠りの神'],
  ['Charon','カロン','冥府の渡し守'],['Hecate','ヘカテー','冥府の女神'],['Nemesis','ネメシス','復讐の女神'],
  ['Hyperion','ヒュペリオン','光の巨神'],['Chronos','クロノス','時の神'],['Cerberus','ケルベロス','冥府の番犬'],
  ['Typhon','テュポン','怪物の父'],['Styx','ステュクス','憎しみの河'],['Acheron','アケロン','嘆きの河'],
  ['Cocytus','コキュトス','慟哭の河'],['Lethe','レーテ','忘却の河'],['Phlegethon','プレゲトン','火炎の河'],
  // 悪魔学（ゴエティア）
  ['Lucifer','ルシフェル','暁の明星'],['Belial','ベリアル','無頼の魔神'],['Abraxas','アブラクサス','至高神'],
  ['Azazel','アザゼル','堕天使'],['Valefor','ヴァレフォル','盗賊の魔神'],['Dantalion','ダンタリアン','三十六の魔神'],
  ['Phenex','フェネクス','不死鳥の魔神'],['Astaroth','アスタロト','冥府の大公'],['Asmodeus','アスモデウス','色欲の魔神'],
  ['Paimon','パイモン','従順なる魔王'],['Stolas','ストラス','梟の魔神'],['Marchosias','マルコシアス','狼の魔神'],
  ['Andras','アンドラス','不和の魔神'],['Zagan','ザガン','賢者の魔神'],['Gremory','グレモリー','愛の魔神'],
  ['Orobas','オロバス','真実の魔神'],['Decarabia','デカラビア','星の魔神'],['Amdusias','アムドゥスキアス','楽の魔神'],
  ['Bael','バエル','序列第一の魔王'],['Barbatos','バルバトス','森の魔神'],['Beleth','ベレト','騎乗の魔王'],
  // 北欧
  ['Fenrir','フェンリル','終焉の狼'],['Sleipnir','スレイプニル','八脚の駿馬'],['Jormungandr','ヨルムンガンド','世界蛇'],
  ['Surtr','スルト','焔の巨人'],['Ymir','ユミル','原初の巨人'],['Heimdall','ヘイムダル','番神'],
  ['Gungnir','グングニル','必中の槍'],['Gram','グラム','竜殺しの剣'],['Yggdrasil','ユグドラシル','世界樹'],
  ['Bifrost','ビフレスト','虹の橋'],['Vidar','ヴィダル','沈黙の神'],
  // 天使
  ['Metatron','メタトロン','契約の天使'],['Sandalphon','サンダルフォン','祈りの天使'],['Raziel','ラジエル','秘儀の天使'],
  ['Camael','カマエル','峻厳の天使'],['Uriel','ウリエル','焔の大天使'],['Azrael','アズラエル','死の天使'],
  ['Seraph','セラフ','熾天使'],['Sariel','サリエル','月の天使'],
  // 星座・恒星
  ['Sirius','シリウス','天狼星'],['Vega','ヴェガ','織女星'],['Rigel','リゲル','参宿七'],
  ['Altair','アルタイル','牽牛星'],['Antares','アンタレス','大火（さそり）'],['Arcturus','アークトゥルス','大角星'],
  ['Bellatrix','ベラトリクス','女戦士星'],['Polaris','ポラリス','北極星'],['Orion','オリオン','狩人座'],
  ['Draco','ドラコ','竜座'],['Corvus','コルヴス','鴉座'],['Cygnus','キグナス','白鳥座'],
  ['Bahamut','バハムート','竜王'],['Leviathan','レヴィアタン','海の獣'],
];

// ── 造語型（発音可能な音節を組合せた幻想名。各パーツが romaji+kana を持つ）──
const HEADS = [
  ['Seph','セフ'],['Zeph','ゼフ'],['Vael','ヴァエル'],['Kael','ケイル'],['Lyr','リル'],
  ['Mor','モル'],['Nyx','ニュクス'],['Thal','サル'],['Vor','ヴォル'],['Syl','シル'],
  ['Xan','ザン'],['Gael','ゲイル'],['Vesp','ヴェスプ'],['Cor','コル'],['Zar','ザール'],
  ['Vyn','ヴィン'],['Tyr','ティル'],['Oren','オレン'],['Quel','クェル'],['Sol','ソル'],
  ['Faus','ファウス'],['Gris','グリス'],['Lan','ラン'],['Cael','カエル'],['Mal','マル'],
  ['Drae','ドレイ'],['Vesh','ヴェシュ'],['Bel','ベル'],['Gryph','グリフ'],['Hel','ヘル'],
  ['Nec','ネク'],['Drak','ドラク'],['Aur','オール'],['Var','ヴァール'],['Kor','コール'],
];
const TAILS = [
  ['iel','イエル'],['oth','オス'],['ion','イオン'],['ius','イウス'],['eth','エス'],
  ['ara','アラ'],['wyn','ウィン'],['is','イス'],['or','オル'],['yx','ィクス'],
  ['an','アン'],['us','ウス'],['en','エン'],['as','アス'],['ira','イラ'],['mund','ムント'],
  // 子音始まり（どの head とも綺麗に繋がる）
  ['dris','ドリス'],['nax','ナクス'],['ven','ヴェン'],['gar','ガル'],['mir','ミル'],
  ['ric','リク'],['lith','リス'],['mar','マル'],['rok','ロク'],['gorn','ゴルン'],
];

// 手作りの“当たり造語”（質を担保するシード。完璧なカナ付き）
const COINED_GEMS = [
  ['Sephion','セフィオン'],['Vaeloth','ヴァエロス'],['Kaelriel','ケイルリエル'],
  ['Lysandor','リサンドール'],['Morveth','モルヴェス'],['Zephyrine','ゼフィリン'],
  ['Nyxaris','ニュクサリス'],['Velgrath','ヴェルグラス'],
  ['Solenne','ソレンヌ'],['Drathmor','ドラスモル'],['Aetherius','アエテリウス'],
  ['Vorenix','ヴォレニクス'],['Sylvareth','シルヴァレス'],['Throne','スローン'],
  ['Galdrim','ガルドリム'],['Requiel','レクィエル'],['Mortaine','モルテイン'],
  // ── 増量 ──
  ['Velneth','ヴェルネス'],['Caldris','カルドリス'],['Xaravel','ザラヴェル'],
  ['Vorleth','ヴォルレス'],['Sythara','シサラ'],['Draevon','ドレイヴォン'],
  ['Maelor','メイロル'],['Kathien','カシエン'],['Lirien','リリエン'],
  ['Theron','セロン'],['Valerion','ヴァレリオン'],['Auberon','オーベロン'],
  ['Cassius','カシウス'],['Severin','セヴェリン'],['Cyrenth','シレンス'],
  ['Galadon','ガラドン'],['Vesperion','ヴェスペリオン'],['Mordaine','モルデイン'],
  ['Zaelthar','ザエルサール'],['Lucan','ルカン'],['Orveth','オルヴェス'],['Nymeria','ニメリア'],
];

function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }

// カナの母音衝突を整える（例: ニュクスイオン→ニュクシオン、セフイエル→セフィエル）
function smoothKana(k) {
  const rules = [
    ['クスイ','クシ'],['クスエ','クセ'],['クスア','クサ'],['クスオ','クソ'],
    ['フイ','フィ'],['プイ','ピ'],['ヴイ','ヴィ'],['ムイ','ミ'],
    ['ルイ','リ'],['ルア','ラ'],['ルオ','ロ'],['ルエ','レ'],['ルウス','ルス'],
    ['ンイ','ニ'],['ンア','ナ'],['ンオ','ノ'],['ンエ','ネ'],['ンウス','ンス'],
    ['フオ','フォ'],['ヴオ','ヴォ'],
    ['スイ','シ'],['スエ','セ'],['スア','サ'],['スオ','ソ'],['リイ','リ'],
  ];
  for (const [a, b] of rules) k = k.split(a).join(b);
  return k;
}

// 造語1件を生成（30%は当たりシード、70%は head+tail 合成）
function coinOne(rnd) {
  if (rnd() < 0.32) {
    const [name, kana] = pick(COINED_GEMS, rnd);
    return { name, kana, note: '造語', cat: 'coined' };
  }
  const [hr, hk] = pick(HEADS, rnd);
  const [tr, tk] = pick(TAILS, rnd);
  const name = (hr + tr).charAt(0).toUpperCase() + (hr + tr).slice(1);
  const kana = smoothKana(hk + tk);
  return { name, kana, note: '造語', cat: 'coined' };
}

const seedRandom = (seed) => {
  if (seed == null) return Math.random;
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
};

export function generate({ mode = 'mix', count = 12, seed = null } = {}) {
  const rnd = seedRandom(seed);
  const fromList = (list, cat) => {
    const [n, k, m] = pick(list, rnd);
    return { name: n, kana: k, note: m, cat };
  };
  const out = [];
  const seen = new Set();
  let guard = 0;
  while (out.length < count && guard++ < count * 30) {
    let item;
    const r = rnd();
    const m = mode === 'mix' ? (r < 0.34 ? 'real' : r < 0.67 ? 'myth' : 'coined') : mode;
    if (m === 'real') item = fromList(REAL, 'real');
    else if (m === 'myth') item = fromList(MYTH, 'myth');
    else item = coinOne(rnd);
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    out.push(item);
  }
  return out;
}
