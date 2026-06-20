#!/usr/bin/env node
/**
 * 毎日1本の記事を生成するパイプライン。
 *  1. data/keyword-queue.csv から status=todo の先頭ワードを1件取得
 *  2. Claude で本文、gpt-image で HERO + 記事中画像を生成
 *  3. src/content/posts/<slug>.md を書き出し
 *  4. キューCSVの該当行を status=done に更新（slug / posted_at 記録）
 *  5. data/posted-log.json に使用履歴を追記 ← これで二度と同じワードを使わない
 *
 * DRY_RUN=1 を付けると API を呼ばずスタブ記事＋プレースホルダ画像で動作確認できる。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const QUEUE = path.join(ROOT, 'data', 'keyword-queue.csv');
const LOG = path.join(ROOT, 'data', 'posted-log.json');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');
const IMG_DIR = path.join(ROOT, 'public', 'images');

const DRY_RUN = process.env.DRY_RUN === '1';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
const IMAGE_MODEL = process.env.IMAGE_MODEL || 'gpt-image-1';
const BANNER_IMG = process.env.BANNER_IMAGE_URL || '/images/game-banner.webp';
const BANNER_URL = process.env.BANNER_LINK_URL || 'https://app.adjust.com/21wgesyj';
const BANNER_ALT = process.env.BANNER_ALT || 'ぼくとネコ｜おすすめネコゲー、いますぐダウンロード';
const SITE_NAME = process.env.SITE_NAME || 'ひまつぶし・ネーミング研究所';
const AUTHOR_NAME = `${SITE_NAME} 編集部`;

// ---------- 最小CSV ----------
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}
function toCSV(rows) {
  const esc = (v) => {
    v = v == null ? '' : String(v);
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };
  return rows.map((r) => r.map(esc).join(',')).join('\n') + '\n';
}

function slugify(keyword) {
  return keyword.trim().replace(/\s+/g, '-').replace(/[\/\\?%*:|"<>.]/g, '');
}

// ---------- 生成 ----------
async function genArticle({ keyword, cluster }) {
  if (DRY_RUN) {
    return {
      title: `${keyword}【まとめ】`,
      description: `${keyword} について分かりやすくまとめた記事です。（ダミー）`,
      body:
        `これは DRY_RUN のダミー本文です。実際は Claude が「${keyword}」向けに生成します。\n\n` +
        `## 見出しの例\n\nここに本文。\n\n## もう一つの見出し\n\nここにも本文。\n`,
    };
  }
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const naming = cluster === 'ネーミング系';
  const spec = naming
    ? `これは「名前・ネーミングのアイデア集」記事です。読者は今まさに名前を決めたい人。
- 導入(2〜3文)で検索意図に即答する。
- **30個以上**のかっこいい名前を、読み(ふりがな)と一言の由来/意味を付けてMarkdownの表で提示する。サブテーマ別に2〜3グループに分ける。
- 「選び方のコツ」を最後に箇条書きで添える。`
    : `これは「心理テスト/診断/暇つぶしクイズ」記事です。読者はスマホで気軽に楽しみたい人。
- 導入(2〜3文)で何が分かるテストかを示す。
- 設問と回答方法を提示し、その後に結果パターン(最低4タイプ)を見出し付きで解説する。
- 最後に一言まとめ。`;

  const prompt = `あなたは日本語のWebメディア編集者です。検索キーワード「${keyword}」で上位表示を狙う記事を書いてください。

${spec}

制約:
- 出力は**JSONオブジェクトのみ**。前後に文章やコードフェンスを付けない。
- 形式: {"title": "...", "description": "...", "body": "..."}
- title: 32文字以内、キーワードを自然に含むクリックしたくなる見出し。
- description: 100文字前後のメタディスクリプション。
- body: **Markdown本文のみ**。H1(#)は使わず、H2(##)から始める。1200〜2000字程度。独自性のある具体的な中身にする。`;

  const res = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  try {
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
    return json;
  } catch {
    return { title: `${keyword}`, description: keyword, body: text };
  }
}

async function genImage({ prompt, size, outPath }) {
  if (DRY_RUN) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="100%" height="100%" fill="#eef2ff"/><text x="50%" y="50%" font-family="sans-serif" font-size="28" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">placeholder image</text></svg>`;
    fs.writeFileSync(outPath.replace(/\.png$/, '.svg'), svg);
    return path.basename(outPath).replace(/\.png$/, '.svg');
  }
  const { default: OpenAI } = await import('openai');
  const { default: sharp } = await import('sharp');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const r = await openai.images.generate({ model: IMAGE_MODEL, prompt, size, n: 1 });
  const b64 = r.data[0].b64_json;
  // 次世代フォーマット(WebP)で配信してCWV/転送量を改善
  const webpPath = outPath.replace(/\.png$/, '.webp');
  await sharp(Buffer.from(b64, 'base64')).webp({ quality: 82 }).toFile(webpPath);
  return path.basename(webpPath);
}

function imgPrompt(keyword, kind) {
  return `Flat, clean, minimal illustration for a Japanese blog about "${keyword}". White background, soft pastel accents, simple shapes, friendly. ${kind}. Absolutely no text, no letters, no words in the image.`;
}

// ---------- メイン ----------
async function main() {
  const rows = parseCSV(fs.readFileSync(QUEUE, 'utf8'));
  const header = rows[0];
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  const dataRows = rows.slice(1);

  const idx = dataRows.findIndex((r) => r[col.status] === 'todo');
  if (idx === -1) {
    console.log('✅ キューにtodoが残っていません。全消化済み。');
    return;
  }
  const r = dataRows[idx];
  const keyword = r[col.keyword];
  const cluster = r[col.cluster];
  const slug = slugify(keyword);
  console.log(`▶ 生成: "${keyword}" (cluster=${cluster}, slug=${slug}, dry=${DRY_RUN})`);

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(IMG_DIR, { recursive: true });

  // 本文
  const article = await genArticle({ keyword, cluster });

  // 画像（HERO + 記事中）
  const heroFile = await genImage({
    prompt: imgPrompt(keyword, 'wide hero banner illustration'),
    size: '1536x1024',
    outPath: path.join(IMG_DIR, `${slug}-hero.png`),
  });
  const inlineFile = await genImage({
    prompt: imgPrompt(keyword, 'small square supporting illustration'),
    size: '1024x1024',
    outPath: path.join(IMG_DIR, `${slug}-inline.png`),
  });

  // 記事中に画像とバナーを差し込む
  const blocks = article.body.split(/\n{2,}/);
  const inlineMd = `![${keyword}](/images/${inlineFile})`;
  const bannerMd = `[![${BANNER_ALT}](${BANNER_IMG})](${BANNER_URL})`;
  if (blocks.length > 2) blocks.splice(2, 0, inlineMd);
  else blocks.push(inlineMd);
  // バナーは早め（全体の約1/3地点・導入を読み終えた直後）に挿入。上部・下部バナーはレイアウト側で別途表示。
  const pos = Math.min(blocks.length, Math.max(3, Math.floor(blocks.length / 3)));
  blocks.splice(pos, 0, bannerMd);
  let body = blocks.join('\n\n');
  // 記事 → ツールへの内部リンク（クラスタ別）。サイロ化防止＋送客
  const toolLinks = cluster === 'ネーミング系'
    ? [['かっこいい名前ジェネレーター', '/tools/rpg-name'], ['二つ名ジェネレーター', '/tools/futatsuna'], ['ギルド名メーカー', '/tools/guild-name']]
    : [['オンラインおみくじ', '/tools/omikuji'], ['ガチャシミュレーター', '/tools/gacha'], ['かっこいい名前ジェネレーター', '/tools/rpg-name']];
  body += '\n\n---\n\n**🎮 あわせて使いたい無料ツール**\n\n' + toolLinks.map(([t, h]) => `- [${t}](${h})`).join('\n') + '\n';

  // frontmatter
  const today = new Date().toISOString().slice(0, 10);
  const fm = [
    '---',
    `title: ${JSON.stringify(article.title)}`,
    `description: ${JSON.stringify(article.description)}`,
    `keyword: ${JSON.stringify(keyword)}`,
    `cluster: ${JSON.stringify(cluster)}`,
    `author: ${JSON.stringify(AUTHOR_NAME)}`,
    `heroImage: ${JSON.stringify(`/images/${heroFile}`)}`,
    `pubDate: ${today}`,
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), fm + body + '\n', 'utf8');

  // キュー更新（重複防止の要）
  r[col.status] = 'done';
  r[col.slug] = slug;
  r[col.posted_at] = today;
  fs.writeFileSync(QUEUE, toCSV([header, ...dataRows]), 'utf8');

  // 使用ログ追記
  const log = JSON.parse(fs.readFileSync(LOG, 'utf8'));
  log.posts.push({ keyword, slug, cluster, title: article.title, postedAt: today });
  fs.writeFileSync(LOG, JSON.stringify(log, null, 2) + '\n', 'utf8');

  console.log(`✅ 完了: src/content/posts/${slug}.md / 残りtodo: ${dataRows.filter((x) => x[col.status] === 'todo').length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
