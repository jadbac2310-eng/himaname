# SEO要件チェックリスト（英語専門記事から抽出・2025/2026基準）

複数の英語SEO専門記事を調査して抽出した「満たすべき要件」一覧。
末尾の `[実装]` は本サイト(Astro)での対応状況。**このサイトは下記をすべて満たすことを目標とする。**

出典は本ファイル末尾の Sources を参照。

---

## 1. 技術的SEO（クロール・インデックス基盤）
- [x] **HTTPS/SSL** 必須（Vercelが自動付与） … 非交渉のベースライン `[実装: Vercel]`
- [x] **正規URL(canonical)** を全ページに出力 `[実装: BaseLayout]`
- [x] **XMLサイトマップ**：canonical・200のURLのみ、`lastmod`を正確に `[実装: @astrojs/sitemap]`
- [x] **robots.txt**：クロール許可＋サイトマップ場所を明示 `[実装: public/robots.txt]`
- [x] **全ページ200ステータス**（2025/12 レンダリング更新で非200はレンダリング対象外に）`[実装: 静的生成]`
- [x] **モバイルファースト**：レスポンシブ、viewport指定 `[実装: BaseLayout viewport]`
- [x] **404はカスタム404ページ**（ソフト404回避）`[実装: src/pages/404.astro]`
- [x] **クリーンなURL構造**（短く意味のあるパス）`[実装: /posts/<keyword>]`

## 2. オンページSEO
- [x] **title**：32〜60字目安、ターゲットKWを自然に含む、ページ固有 `[実装: 各ページ/生成]`
- [x] **meta description**：100〜160字、ページ固有・クリックを促す `[実装: 各ページ/生成]`
- [x] **H1は1ページ1つ**、ページ主題と一致 `[実装: post-title / index h1]`
- [x] **見出し階層** H2/H3を論理的に、関連語を自然に `[実装: 生成プロンプトで強制]`
- [x] **内部リンク**：説明的アンカーで関連ページへ（権威分配・回遊・クロール）`[実装: 関連記事＋パンくず]`
- [x] **canonicalタグ**／重複回避 `[実装: BaseLayout]`
- [x] **画像にalt**、ファイル名も意味のあるものに `[実装: 全img alt付与]`

## 3. 構造化データ（JSON-LD / Schema.org）
- [x] **JSON-LD形式**（Google推奨・AIが解析しやすい）`[実装]`
- [x] **Article schema**：headline / datePublished / dateModified / author(Person) / publisher(Organization) / image `[実装: 記事ページ]`
- [x] **BreadcrumbList schema**（高ROI・SERPにパンくず表示）`[実装: 記事ページ]`
- [x] **WebSite + Organization schema**（エンティティ理解・AI検索の土台）`[実装: 全ページ]`
- [x] **Blog/CollectionPage schema**（一覧ページ）`[実装: index]`
- [x] ページに無い内容をマークアップしない・必須プロパティを満たす・日付はISO8601 `[実装]`
- [ ] **公開前にRich Results Testで検証**（手動運用タスク）`[運用: デプロイ前に実施]`

## 4. Core Web Vitals / パフォーマンス（確定ランキング要因・競合クエリで25-30%の重み）
- [x] **LCP ≤ 2.5s**：HERO画像は遅延読込しない・`fetchpriority=high`・寸法指定 `[実装]`
- [x] **INP ≤ 200ms**：不要なJSを排除（本サイトはJSほぼゼロの静的出力）`[実装: Astro静的]`
- [x] **CLS ≤ 0.1**：全画像に width/height、Webフォント未使用 `[実装: 寸法指定＋system font]`
- [x] **画像の遅延読込**：HERO以外は `loading=lazy` `[実装: inline/banner]`
- [x] **次世代フォーマット**：WebPで配信（25-50%削減）`[実装: 生成時にsharpでWebP化]`
- [x] **軽量CSS・外部依存最小**（preconnect不要なほど） `[実装: 単一global.css]`

## 5. コンテンツ品質・E-E-A-T（2026 March更新：一次体験・信頼を重視）
- [x] **検索意図に即答**（冒頭で結論／AI検索の引用源を狙う）`[実装: 生成プロンプト]`
- [x] **著者バイライン**（一貫した署名）＋ author schema `[実装: 編集部署名＋/about]`
- [x] **Aboutページ**：運営者・編集方針・連絡先（信頼シグナル）`[実装: src/pages/about.astro]`
- [x] **AI利用の透明性**：AI生成＋編集方針を明示（正直さ＝信頼）`[実装: /about に明記]`
- [x] **公開日・更新日を表示** `[実装: pubDate/updatedDate表示＋schema]`
- [x] **独自性のある具体的中身**（薄い量産を避ける）`[実装: 各記事に独自の一覧/診断]`

## 6. 画像SEO・アクセシビリティ
- [x] **alt**＝アクセシビリティ＋SEO（スクリーンリーダー／画像理解）`[実装]`
- [x] **width/height指定でCLS防止** `[実装]`
- [x] **HERO/LCP要素は遅延読込しない** `[実装]`
- [x] **WebP配信** `[実装]`
- [x] **lang属性・セマンティックHTML**（header/main/article/nav/footer）`[実装]`

## 7. AEO / GEO（AI・アンサーエンジン最適化）
- [x] **構造化データでエンティティ関係を定義**（AI要約の引用源化）`[実装: schema一式]`
- [x] **質問に直接・簡潔に答える構成** `[実装: 生成プロンプト]`
- [x] **RSSフィード**（配信・AIボットの発見性）`[実装: /rss.xml]`
- [x] **lastmodをフレッシュネスシグナルとして正確に** `[実装: sitemap/RSS]`
- [x] **OGP/Twitter Card**（SNS・AI共有時の表示）`[実装: BaseLayout]`

---

## Sources（調査した英語専門記事）
- DebugBear — Technical SEO Checklist 2026: https://www.debugbear.com/blog/technical-seo-checklist
- PxlPeak — Google Search Essentials 2026: https://pxlpeak.com/blog/seo/google-search-essentials-complete-guide-2026
- NoGood — Technical SEO Checklist 2026: https://nogood.io/blog/technical-seo-checklist/
- Prateeksha — On-Page SEO Checklist 2026: https://prateeksha.com/blog/on-page-seo-checklist-2026-titles-headings-schema-core-web-vitals
- Orbit Media — On-Page SEO Best Practices: https://www.orbitmedia.com/blog/seo-best-practices/
- Digital Applied — Structured Data SEO 2026: https://www.digitalapplied.com/blog/structured-data-seo-2026-rich-results-guide
- Yoast — Structured Data / Schema Ultimate Guide: https://yoast.com/structured-data-schema-ultimate-guide/
- corewebvitals.io — LCP/INP/CLS 2026: https://www.corewebvitals.io/core-web-vitals
- NicoDigital — Core Web Vitals & SEO 2026: https://www.nicodigital.com/technical-seo/core-web-vitals-in-2025-why-page-experience-still-rules-seo-rankings/
- Digital Applied — E-E-A-T March 2026: https://www.digitalapplied.com/blog/e-e-a-t-march-2026-google-rewards-experience-content-guide
- Keywords Everywhere — E-E-A-T Guidelines 2026: https://keywordseverywhere.com/blog/google-e-e-a-t-guidelines-an-overview/
- Ignite Visibility — Image SEO in the Age of AI: https://ignitevisibility.com/image-seo/
- Digital Applied — Image SEO 2026: https://www.digitalapplied.com/blog/image-seo-2026-visual-search-optimization-guide
