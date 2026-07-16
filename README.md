# game-blog — 毎日自動投稿ブログ

ラッコキーワード調査で選定した**低競合×そこそこ検索される**ロングテール697件をキューにして、
毎朝 Claude API で本文・gpt-image で画像を生成し、自社ゲームのバナーへ流入させる自動ブログ。

- ホスティング: Vercel（Git連携で自動デプロイ）
- 生成: GitHub Actions（毎朝 JST 6:00）
- フレームワーク: Astro（静的生成・白背景のシンプルデザイン）

## ディレクトリ

```
data/keyword-queue.csv   ← 記事ネタ697件。status(todo/done)で消化管理。これが重複防止の本体
data/posted-log.json     ← 使用済みワードの履歴
scripts/generate.mjs     ← 1日1本生成（キュー先頭→Claude→gpt-image→md書き出し→status更新）
src/content/posts/*.md   ← 生成された記事
src/pages, layouts, ...  ← 表示側（Astro）
.github/workflows/daily.yml ← 毎朝6時の自動実行
```

## キーワードの重複防止

`generate.mjs` は毎回 `keyword-queue.csv` の **status=todo の先頭1件**だけを使い、
生成後に **status=done** へ更新して `posted-log.json` に記録する。
このCSVをリポジトリにコミットして状態を持ち越すため、**同じワードは二度使われない**。
難易度の低い（=勝ちやすい）順に並んでいるので、上から順に消化される。

## セットアップ

```bash
npm install
cp .env.example .env   # キーを記入（ANTHROPIC_API_KEY / OPENAI_API_KEY / BANNER_*）

# 動作確認（APIを呼ばずダミー生成）
npm run generate:dry
npm run build

# 本番1本生成（要キー）
npm run generate
```

### Vercel
1. このリポジトリを Vercel にインポート（フレームワークは Astro 自動検出）
2. Environment Variables に `SITE_URL` / `SITE_NAME` / `BANNER_IMAGE_URL` を設定

### GitHub Actions（自動投稿）
リポジトリの Settings > Secrets に登録:
`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`,（任意）`CLAUDE_MODEL`, `IMAGE_MODEL`, `BANNER_IMAGE_URL`

Actions は記事を生成して push するだけ。ビルド＆公開は Vercel の Git 連携が担う。

## バナー
`/public/images/game-banner.png` を置き、`.env`（および Vercel/Actions の環境変数）で
`BANNER_IMAGE_URL` を設定する。
記事の上部・中盤・下部の3箇所に表示される。

リンク先の Adjust 計測リンクは `src/components/Banner.astro` と `scripts/generate.mjs` に
ハードコードしてある（環境変数だと設定漏れで古いリンクのまま配信される事故が起きたため）。
変更する場合はこの2箇所と既存記事の Markdown を一括置換する。
