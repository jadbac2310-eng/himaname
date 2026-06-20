# ラッコキーワードAPI

- **OpenAPI Version:** `3.1.1`
- **API Version:** `1.7.0`

ラッコキーワードAPIの仕様です。\
スタンダードプランでAPIキー（最大5個）を発行することで利用できます。\
取得データは社内利用の範囲でご利用いただけます。サービスへの組み込み等をご検討の際はAPI利用ガイドライン・利用規約を厳守の上ご利用ください。\
MCPの設定方法や接続手順については、MCP設定ガイドをご覧ください。\
\
[API Docs（JSON（OpenAPI）/ AI・プログラム向け）](/api-docs.json)\
[API Docs（Markdown / 人間向け）](/api-docs.md)

## Servers

- **URL:** `https://api.rakkokeyword.com`
  - **Description:** 本番環境

## Operations

### サジェストキーワード取得

- **Method:** `POST`
- **Path:** `/v1/suggest-keywords`
- **Tags:** サジェストキーワード取得

検索したキーワードに対して、複数の検索エンジンから取得したサジェストキーワードを一括取得します。サジェストキーワードに加えて、SEO難易度、月間検索数、CPC（$）、競合性のデータを返却します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — サジェスト取得の元となる検索キーワード。1文字以上の文字列を指定する。

- **`filter`**

  `object` — 結果のフィルタリング条件。検索ボリューム・SEO難易度・CPC・競合性・出現時期・サジェストクラスなどで絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — クリック単価（CPC）フィルタ（USD、範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`firstSeenRange`**

    `object` — 出現時期フィルタ

    - **`include`**

      `string`, possible values: `"last_7_days", "last_30_days", "last_90_days", "within_6_months", "within_1_year", "over_1_year"` — 出現時期の選択肢

  - **`keyword`**

    `object` — キーワードフィルタ

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索ボリュームフィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`suggestClass`**

    `array` — サジェストクラスフィルタ（0-3の配列）。0: ＋（サジェスト）, 1: ＋＋（サジェストのサジェスト）, 2: ＋α（拡張サジェスト）, 3: ＋＋＋（拡張/深掘りサジェスト）

    **Items:**

    `integer`

- **`increaseKeyword`**

  `boolean`, default: `false` — キーワード増量オプション。true にすると、より多くのサジェストキーワードを取得する（消費クレジットが増加する）。省略時は false。

- **`limit`**

  `integer` — 取得件数の上限。正の整数を指定。省略時はすべての結果を返す。

- **`modes`**

  `array`, default: `["google"]` — サジェストキーワードを取得する検索エンジン（複数選択可）。google / bing / youtube / googleVideo / amazon / rakuten / googleShopping / googleImage から選択。省略時は google のみ。

  **Items:**

  `string`, possible values: `"google", "bing", "youtube", "googleVideo", "amazon", "rakuten", "googleShopping", "googleImage"`

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"keyword", "suggestClass", "seoDifficulty", "searchVolume", "cpc", "competition", "firstSeenRange"`, default: `"searchVolume"` — 結果のソート項目。keyword / suggestClass / seoDifficulty / searchVolume / cpc / competition / firstSeenRange。省略時は searchVolume。

**Example:**

```json
{
  "keyword": "ラッコ",
  "modes": [
    "google",
    "bing"
  ],
  "increaseKeyword": false,
  "filter": {
    "suggestClass": [
      0,
      1
    ],
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "firstSeenRange": {
      "include": "last_30_days"
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 10
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — サジェストキーワード検索結果データ

  - **`items` (required)**

    `array` — サジェストキーワードのリスト。各アイテムにキーワード・サジェスト分類・SEO指標・取得エンジン情報を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — サジェストキーワード文字列

    - **`metrics` (required)**

      `object` — SEO関連の各種指標（検索ボリューム・SEO難易度・CPC・競合性・出現時期）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）

      - **`firstSeenRange` (required)**

        `object` — 出現時期。キーワードが最初に検出された時期を日付範囲ラベルで表す。不明な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`suggestClass` (required)**

      `string` — サジェストキーワードの区分ラベル。＋（0: サジェスト）, ＋＋（1: サジェストのサジェスト）, ＋α（2: 拡張サジェスト）, ＋＋＋（3: 「＋＋」または「＋α」からさらに展開されたサジェスト）

    - **`suggestEngines` (required)**

      `object` — このサジェストキーワードを返した検索エンジンの情報（エンジン数と一覧）

      - **`active` (required)**

        `array` — このキーワードが取得できたサーチエンジン一覧

        **Items:**

        `string`, possible values: `"google", "bing", "youtube", "googleVideo", "amazon", "rakuten", "googleShopping", "googleImage"`

      - **`count` (required)**

        `number` — このキーワードが取得できたサーチエンジン数

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報（キーワードと対象エンジン）

    - **`keyword` (required)**

      `string` — サジェスト取得の元になった検索キーワード

    - **`suggestEngines` (required)**

      `array` — サジェストキーワードの取得対象としたサーチエンジン一覧。単一取得の場合も配列で出力されます。

      **Items:**

      `string`, possible values: `"google", "bing", "youtube", "googleVideo", "amazon", "rakuten", "googleShopping", "googleImage"`

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。取得対象の検索エンジン数に応じて増減する（1エンジンにつき1クレジット）。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 1
  },
  "data": {
    "query": {
      "keyword": "ラッコ",
      "suggestEngines": [
        "google"
      ]
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ 水族館",
        "suggestClass": "＋",
        "metrics": {
          "seoDifficulty": 45,
          "searchVolume": 12000,
          "cpc": 1.5,
          "competition": 2,
          "firstSeenRange": "last_30_days"
        },
        "suggestEngines": {
          "count": 2,
          "active": [
            "google",
            "youtube"
          ]
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 関連キーワード取得

- **Method:** `POST`
- **Path:** `/v1/related-keywords`
- **Tags:** 関連キーワード取得

ラッコキーワードのキーワードデータベースから検索条件にマッチしたキーワードを一括取得します。関連キーワードに加えてSEO難易度、月間検索数、CPC（$）、競合性のデータを返却します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — 関連キーワード取得の元となる検索キーワード。1文字以上の文字列を指定する。

- **`filter`**

  `object` — 結果のフィルタリング条件。検索ボリューム・SEO難易度・CPC・競合性・出現時期などで絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — クリック単価（CPC）フィルタ（USD、範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`firstSeenRange`**

    `object` — 出現時期フィルタ

    - **`include`**

      `string`, possible values: `"last_7_days", "last_30_days", "last_90_days", "within_6_months", "within_1_year", "over_1_year"` — 出現時期の選択肢

  - **`keyword`**

    `object` — キーワードフィルタ

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索ボリュームフィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

- **`limit`**

  `integer`, default: `1000` — 取得件数の上限。1〜25000 の整数を指定。省略時は 1000 件。

- **`matchType`**

  `string`, possible values: `"partialMatch", "phraseMatch", "prefixMatch", "suffixMatch", "wordMatch"`, default: `"partialMatch"` — キーワードのマッチタイプ。partialMatch: 部分一致 / phraseMatch: フレーズ一致 / prefixMatch: 前方一致 / suffixMatch: 後方一致 / wordMatch: 単語一致。省略時は partialMatch。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"seoDifficulty", "searchVolume", "cpc", "competition", "firstSeenRange"`, default: `"searchVolume"` — 結果のソート項目。seoDifficulty / searchVolume / cpc / competition / firstSeenRange。省略時は searchVolume。

**Example:**

```json
{
  "keyword": "ラッコ",
  "matchType": "partialMatch",
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "firstSeenRange": {
      "include": "last_30_days"
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 100
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 関連キーワード検索結果データ

  - **`items` (required)**

    `array` — 関連キーワードのリスト。各アイテムにキーワード・SEO指標を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — 検索キーワードを元に取得した関連キーワード

    - **`metrics` (required)**

      `object` — SEO関連の各種指標（検索ボリューム・SEO難易度・CPC・競合性・出現時期）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）

      - **`firstSeenRange` (required)**

        `object` — 出現時期。キーワードが最初に検出された時期を日付範囲ラベルで表す。不明な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 関連キーワード取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 1
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ 水族館",
        "metrics": {
          "seoDifficulty": 40,
          "searchVolume": 90500,
          "cpc": 0,
          "competition": 1,
          "firstSeenRange": "last_30_days"
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 潜在的な検索キーワード/質問（LSI/PAA）取得

- **Method:** `POST`
- **Path:** `/v1/other-keywords`
- **Tags:** 潜在的な検索キーワード/質問（LSI/PAA）取得

潜在的な検索キーワード/質問（LSI/PAA）を取得します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — 潜在的な検索キーワード（LSI）および関連する質問（PAA）を取得するための検索キーワード。1文字以上の文字列を指定する。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"importance", "seoDifficulty", "searchVolume", "cpc", "competition", "firstSeenRange"`, default: `"importance"` — 結果のソート項目。importance / seoDifficulty / searchVolume / cpc / competition / firstSeenRange。省略時は importance。

**Example:**

```json
{
  "keyword": "ラッコ",
  "sortBy": "importance",
  "orderBy": "desc"
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 潜在的な検索キーワード/関連する質問の検索結果データ

  - **`items` (required)**

    `array` — LSI/PAA アイテムのリスト。LSI アイテムが先に、PAA アイテムが後に並ぶ。各アイテムに種別・重要度・取得元キーワードを含み、LSI の場合は SEO 指標も含まれる。

    **Items:**

    - **`importance` (required)**

      `string`, possible values: `"low", "medium", "high"` — 重要度。高いほど関連性や注目度が高いことを示す。high: 高 / medium: 中 / low: 低。

    - **`sourceKeyword` (required)**

      `string` — このキーワードまたは質問の取得元となったキーワード

    - **`type` (required)**

      `string`, possible values: `"lsi", "paa"` — データ種別。lsi: 潜在的な検索キーワード / paa: 関連する質問。

    - **`keyword`**

      `string` — 取得した潜在的な検索キーワード。type が lsi の場合に含まれる。

    - **`metrics`**

      `object` — SEO関連の各種指標。type が lsi の場合のみ含まれる。

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）

      - **`firstSeenRange` (required)**

        `object` — 出現時期。キーワードが最初に検出された時期を日付範囲ラベルで表す。不明な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`question`**

      `string` — 取得した関連する質問。type が paa の場合に含まれる。

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 潜在的な検索キーワード/質問（LSI/PAA）取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — LSI/PAA の件数サマリー

    - **`lsiCount` (required)**

      `number` — LSI（潜在的な検索キーワード）の件数

    - **`paaCount` (required)**

      `number` — PAA（People Also Ask / 関連する質問）の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 15
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "lsiCount": 1,
      "paaCount": 1
    },
    "items": [
      {
        "type": "lsi",
        "keyword": "ラッコ 水族館",
        "question": "ラッコはどこで見れますか？",
        "importance": "high",
        "sourceKeyword": "ラッコ",
        "metrics": {
          "seoDifficulty": 30,
          "searchVolume": 33100,
          "cpc": 2.17,
          "competition": 5,
          "firstSeenRange": "last_30_days"
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### よくある質問検索取得

- **Method:** `POST`
- **Path:** `/v1/question-search`
- **Tags:** よくある質問検索

キーワードに関連するよくある質問を取得します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — よくある質問検索の元となる検索キーワード。1文字以上の文字列を指定する。

- **`limit`**

  `integer`, default: `100` — 出力数の上限。1〜200 の整数を指定。省略時は 100。

**Example:**

```json
{
  "keyword": "ラッコ",
  "limit": 100
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — よくある質問検索結果データ

  - **`items` (required)**

    `array` — 質問アイテムのリスト

    **Items:**

    - **`question` (required)**

      `string` — 検索キーワードに関連する質問

  - **`query` (required)**

    `object` — 検索クエリ情報

    - **`keyword` (required)**

      `string` — よくある質問検索の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 2
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "question": "ラッコが絶滅しそうな理由は何ですか?"
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword must be a string"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 同時ランクインキーワード取得

- **Method:** `POST`
- **Path:** `/v1/ranking-keywords`
- **Tags:** 同時ランクインキーワード

指定キーワードのGoogle検索結果の上位{searchTop}件のURLが、{searchRange}以内にランクインしているキーワードを取得します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — 同時ランクインキーワード取得の元となる検索キーワード。指定キーワードの検索上位URLが他にランクインしているキーワードを取得する。1文字以上の文字列を指定する。

- **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・月間検索数・CPC・競合性・関連度で絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — クリック単価（CPC）フィルタ（USD、範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`keyword`**

    `object` — キーワードフィルタ

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`relevance`**

    `object` — 関連度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`searchVolume`**

    `object` — 月間検索ボリュームフィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

- **`limit`**

  `integer`, default: `500` — 取得件数。1〜5000 の整数を指定する。省略時は 500。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`searchRange`**

  `object`, default: `50` — 検索順位範囲。この順位以内にランクインしているキーワードを対象にする。選択肢: 10 / 20 / 30 / 50 / 100。省略時は 50。

- **`searchTop`**

  `object`, default: `20` — 検索上位参照数。上位何件のURLを同時ランクイン判定に使用するかを指定する。選択肢: 3 / 5 / 10 / 20 / 30 / 50。省略時は 20。

- **`sortBy`**

  `string`, possible values: `"seoDifficulty", "searchVolume", "cpc", "competition", "relevance"`, default: `"relevance"` — 結果のソート項目。seoDifficulty / searchVolume / cpc / competition / relevance。省略時は relevance。

**Example:**

```json
{
  "keyword": "ラッコ",
  "searchTop": 20,
  "searchRange": 50,
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "relevance": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "relevance",
  "orderBy": "desc",
  "limit": 500
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 同時ランクインキーワード検索結果データ

  - **`items` (required)**

    `array` — 同時ランクインキーワード結果のリスト。各アイテムにキーワード・単語数・SEO指標を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — 同時ランクインしているキーワード

    - **`metrics` (required)**

      `object` — SEO関連の各種指標（SEO難易度・月間検索数・CPC・競合性・関連度）

      - **`competition` (required)**

        `number` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `number` — 推定クリック単価（USD）

      - **`relevance` (required)**

        `number` — 同時ランクイン度。1–100で表し、高いほど元キーワードと検索結果の重複度が高いことを示す。

      - **`searchVolume` (required)**

        `number` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`wordCount` (required)**

      `number` — キーワードのスペース区切りの単語数

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 同時ランクインキーワード取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ 水族館",
        "wordCount": 2,
        "metrics": {
          "seoDifficulty": 30,
          "searchVolume": 10000,
          "cpc": 0.5,
          "competition": 32,
          "relevance": 5
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword should not be empty"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 一括キーワード調査登録

- **Method:** `POST`
- **Path:** `/v1/search-volume`
- **Tags:** 一括キーワード調査

一括キーワード調査を登録するAPIです。最大50,000件のキーワードを一括登録できます。

#### Request Body

##### Content-Type: application/json

- **`keywords` (required)**

  `array` — キーワード（入力上限50,000件）

  **Items:**

  `string`

- **`aggregationPeriodMonths`**

  `object`, default: `12` — 集計期間（月数）。12/24/36/48 のいずれか。省略時は 12。

- **`dataCompletion`**

  `boolean`, default: `true` — データ補完フラグ。true の場合にデータ補完を行う。省略時は true。

- **`deduplicate`**

  `boolean`, default: `true` — キーワードの重複除去を行うかどうか。省略時は true。

- **`language`**

  `string`, default: `"Japanese"` — 言語名。Google Ads API の LanguageCriterion に準拠。省略時は Japanese。

- **`location`**

  `string`, default: `"Japan"` — 地域名。Google Ads API の LocationCriterion に準拠。省略時は Japan。

- **`seoDifficulty`**

  `boolean`, default: `false` — SEO難易度取得フラグ。true の場合にSEO難易度を取得する。省略時は false。

**Example:**

```json
{
  "keywords": [
    "ラッコ",
    "カワウソ"
  ],
  "seoDifficulty": false,
  "dataCompletion": true,
  "location": "Japan",
  "language": "Japanese",
  "deduplicate": true,
  "aggregationPeriodMonths": 12
}
```

#### Responses

##### Status: 201 登録成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 履歴登録結果

  - **`requestId`**

    `number` — リクエストID

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 10
  },
  "data": {
    "requestId": 1234567
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keywords is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 一括キーワード調査履歴一覧取得

- **Method:** `GET`
- **Path:** `/v1/search-volume/histories`
- **Tags:** 一括キーワード調査

一括キーワード調査の過去リクエスト履歴を作成日時降順で一覧取得するAPIです。

#### Parameters

##### `limit`

- **In:** `query`

取得件数。1〜100の整数を指定する。省略時は 100。

`number`, default: `100`

##### `offset`

- **In:** `query`

取得開始位置。0以上の整数を指定する。省略時は 0。

`number`, default: `0`

##### `status`

- **In:** `query`

ステータスフィルタ。completed: 全処理完了 / processing: 処理中。省略時は全件取得。

`string`, possible values: `"completed", "processing"`

#### Responses

##### Status: 200 取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 一括キーワード調査履歴一覧データ

  - **`items` (required)**

    `array` — 一括キーワード調査履歴アイテムのリスト

    **Items:**

    - **`aggregationPeriodMonths` (required)**

      `number` — 集計期間（月数）

    - **`completedAt` (required)**

      `object` — 全処理完了日時（ISO 8601、UTC）。未完了時は null。

    - **`createdAt` (required)**

      `string`, format: `date-time` — リクエスト作成日時（ISO 8601、UTC）

    - **`dataCompletion` (required)**

      `boolean` — データ補完が有効かどうか

    - **`keywordCount` (required)**

      `number` — キーワードの件数

    - **`keywordSummary` (required)**

      `string` — キーワードのサマリ（カンマ区切り、先頭20件・255文字以内で切り詰め）

    - **`language` (required)**

      `string` — 言語名。Google Ads API の LanguageCriterion に準拠。

    - **`location` (required)**

      `string` — 地域名。Google Ads API の LocationCriterion に準拠。

    - **`requestId` (required)**

      `number` — リクエストID

    - **`seoDifficulty` (required)**

      `boolean` — SEO難易度取得が有効かどうか

    - **`status` (required)**

      `string`, possible values: `"completed", "processing"` — 全体ステータス。statuses の searchVolume と seoDifficulty の両方が processed の場合に completed（seoDifficulty が skip の場合も完了扱い）、それ以外は processing。noiseReduction は判定対象外。

    - **`statuses` (required)**

      `object` — 各処理のステータス情報

      - **`noiseReduction` (required)**

        `string`, possible values: `"unprocessed", "processing", "processed"` — ノイズ除去ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。ノイズ除去には時間がかかる可能性があります。

      - **`searchVolume` (required)**

        `string`, possible values: `"unprocessed", "processing", "processed"` — 月間検索数取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

      - **`seoDifficulty` (required)**

        `string`, possible values: `"skip", "unprocessed", "processing", "processed"` — SEO難易度取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / skip: スキップ（SEO難易度取得OFFの場合）。

  - **`query` (required)**

    `object` — リクエストで指定されたクエリパラメータ

    - **`limit` (required)**

      `number` — リクエストで指定された取得件数

    - **`offset` (required)**

      `number` — リクエストで指定された取得開始位置

    - **`status` (required)**

      `object` — リクエストで指定されたステータスフィルタ

  - **`summary` (required)**

    `object` — 件数サマリ

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "limit": 100,
      "offset": 0,
      "status": null
    },
    "summary": {
      "totalCount": 1,
      "returnedCount": 1
    },
    "items": [
      {
        "requestId": 1500,
        "createdAt": "2026-05-31T01:00:00.000Z",
        "completedAt": null,
        "status": "processing",
        "statuses": {
          "searchVolume": "processed",
          "seoDifficulty": "unprocessed",
          "noiseReduction": "processing"
        },
        "keywordSummary": "ラッコ,カワウソ",
        "keywordCount": 2,
        "seoDifficulty": true,
        "location": "Japan",
        "language": "Japanese",
        "aggregationPeriodMonths": 12,
        "dataCompletion": true
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Invalid query parameters"
  ]
}
```

##### Status: 403 認証失敗

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

### 一括キーワード調査ステータス取得

- **Method:** `GET`
- **Path:** `/v1/search-volume/{requestId}/status`
- **Tags:** 一括キーワード調査

一括キーワード調査のステータスを取得するAPIです。月間検索数取得、ノイズ除去、SEO難易度取得の各ステータスを確認できます。

#### Parameters

##### `requestId` required

- **In:** `path`

リクエストID

`number`

#### Responses

##### Status: 200 ステータス取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — ステータス情報

  - **`isCompleted`**

    `boolean` — 全処理完了フラグ。searchVolume が processed かつ seoDifficulty が processed または skip の場合に true。noiseReduction は判定対象外。

  - **`statuses`**

    `object` — 各処理のステータス情報

    - **`noiseReduction`**

      `string`, possible values: `"unprocessed", "processing", "processed"` — ノイズ除去ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。ノイズ除去には時間がかかる可能性があります。

    - **`searchVolume`**

      `string`, possible values: `"unprocessed", "processing", "processed"` — 月間検索数取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

    - **`seoDifficulty`**

      `string`, possible values: `"skip", "unprocessed", "processing", "processed"` — SEO難易度取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / skip: スキップ。

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "isCompleted": true,
    "statuses": {
      "searchVolume": "processed",
      "noiseReduction": "processing",
      "seoDifficulty": "skip"
    }
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Invalid requestId"
  ]
}
```

##### Status: 403 認証失敗

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

### 一括キーワード調査データ取得

- **Method:** `POST`
- **Path:** `/v1/search-volume/{requestId}/results`
- **Tags:** 一括キーワード調査

一括キーワード調査データを取得するAPIです。フィルタやソート条件を指定できます。

#### Parameters

##### `requestId` required

- **In:** `path`

リクエストID

`number`

#### Request Body

##### Content-Type: application/json

- **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・月間検索数・CPC・競合性で絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — CPCフィルタ（範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`keyword`**

    `object` — キーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

- **`limit`**

  `integer`, default: `100` — 取得件数。1〜50,000の整数を指定する。省略時は 100。

- **`noiseReduction`**

  `boolean`, default: `true` — ノイズ除去フラグ。true の場合にノイズ除去を適用する。省略時は true。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"keyword", "seoDifficulty", "searchVolume", "rateOfChange", "cpc", "competition"`, default: `"searchVolume"` — ソート項目。keyword / seoDifficulty / searchVolume / rateOfChange / cpc / competition。省略時は searchVolume。

**Example:**

```json
{
  "noiseReduction": true,
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 100
}
```

#### Responses

##### Status: 200 データ取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 検索ボリューム結果データ

  - **`items`**

    `array` — 検索結果アイテムのリスト

    **Items:**

    - **`dataSource` (required)**

      `object` — 検索数データの取得元。取得できなかった場合は null。

    - **`keyword` (required)**

      `string` — キーワード

    - **`metrics` (required)**

      `object` — 各種指標（SEO難易度・月間検索数・CPC・広告競合性）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い。無効な場合は null。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）。無効な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）。無効な場合は null。

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い。不明な場合は null。

    - **`trends` (required)**

      `object` — 検索数トレンド（増減率・月別検索数）

      - **`changeRate` (required)**

        `object` — 検索数の増減率（3か月・6か月・12か月）

        - **`12m` (required)**

          `object` — 直近12か月に対する直近月の検索数増減率

        - **`3m` (required)**

          `object` — 直近3か月に対する直近月の検索数増減率

        - **`6m` (required)**

          `object` — 直近6か月に対する直近月の検索数増減率

        - **`yoy1y` (required)**

          `object` — 1年前同月比（集計期間24か月以上で算出）

        - **`yoy2y` (required)**

          `object` — 2年前同月比（集計期間36か月以上で算出）

        - **`yoy3y` (required)**

          `object` — 3年前同月比（集計期間48か月以上で算出）

      - **`monthlySearchVolume` (required)**

        `object` — 月ごとの検索数。キーは YYYY-MM 形式。データがない場合は null。

  - **`query`**

    `object` — クエリ情報（リクエストID・地域・言語）

    - **`aggregationPeriodMonths` (required)**

      `number` — 集計期間（月数）

    - **`language` (required)**

      `string` — 検索ボリューム取得対象の言語

    - **`location` (required)**

      `string` — 検索ボリューム取得対象の地域

    - **`requestId` (required)**

      `number` — リクエストID

  - **`summary`**

    `object` — 件数サマリー

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "requestId": 1234567,
      "location": "Japan",
      "language": "Japanese",
      "aggregationPeriodMonths": 12
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ",
        "dataSource": "GoogleLive",
        "metrics": {
          "seoDifficulty": 40,
          "searchVolume": 90500,
          "cpc": 0,
          "competition": 1
        },
        "trends": {
          "changeRate": {
            "12m": 0.4159,
            "6m": 0.0796,
            "3m": -0.0695,
            "yoy1y": 0.1523,
            "yoy2y": -0.0845,
            "yoy3y": 0.2311
          },
          "monthlySearchVolume": {
            "2025-01": 2740000,
            "2025-02": 2240000
          }
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Invalid request parameters"
  ]
}
```

##### Status: 403 認証失敗

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

### 地域一覧取得

- **Method:** `GET`
- **Path:** `/v1/search-volume/locations`
- **Tags:** 一括キーワード調査メタデータ

一括キーワード調査で指定可能な地域（location）の一覧を取得するAPIです。認証は不要です。Google Ads API の LocationCriterion に準拠した地域名を返却します。

#### Responses

##### Status: 200 取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 地域一覧

  - **`locations` (required)**

    `array` — 指定可能な地域の一覧

    **Items:**

    - **`code` (required)**

      `number` — Google Ads API の LocationCriterion ID

    - **`countryIsoCode` (required)**

      `string` — ISO 3166-1 alpha-2 国コード

    - **`name` (required)**

      `string` — 地域名（Google Ads API の LocationCriterion 準拠）

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "locations": [
      {
        "name": "Japan",
        "code": 2392,
        "countryIsoCode": "JP"
      }
    ]
  },
  "errors": []
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 言語一覧取得

- **Method:** `GET`
- **Path:** `/v1/search-volume/languages`
- **Tags:** 一括キーワード調査メタデータ

一括キーワード調査で指定可能な言語（language）の一覧を取得するAPIです。認証は不要です。Google Ads API の LanguageCriterion に準拠した言語名を返却します。

#### Responses

##### Status: 200 取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 言語一覧

  - **`languages` (required)**

    `array` — 指定可能な言語の一覧

    **Items:**

    - **`code` (required)**

      `string` — 言語コード（ISO 639-1）

    - **`name` (required)**

      `string` — 言語名（Google Ads API の LanguageCriterion 準拠）

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "languages": [
      {
        "name": "Japanese",
        "code": "ja"
      }
    ]
  },
  "errors": []
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 獲得キーワード調査取得

- **Method:** `POST`
- **Path:** `/v1/influx-keywords`
- **Tags:** 獲得キーワード調査

獲得キーワード調査のキーワード軸データを一括取得します。

#### Request Body

##### Content-Type: application/json

- **`targets` (required)**

  `array` — 獲得キーワード調査の対象ドメインまたはURLとマッチタイプの配列。最大20件まで指定可能。

  **Items:**

  - **`url` (required)**

    `string` — ドメインまたはURL

  - **`matchType`**

    `string`, possible values: `"url", "forward_url", "domain", "sub_domain"`, default: `"sub_domain"` — マッチタイプ。url / forward\_url / domain / sub\_domain。省略時は sub\_domain。

- **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・検索順位・月間検索数・CPC・競合性・推定流入数で絞り込む。

  - **`competition`**

    `object` — 広告競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — CPC（$）フィルタ（範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`etv`**

    `object` — 推定流入数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`keyword`**

    `object` — キーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`rank`**

    `object` — 検索順位フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`searchVolume`**

    `object` — 月間検索数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

- **`keywordCollapse`**

  `boolean`, default: `false` — キーワード重複除去の有効/無効。true にすると同一キーワードの重複を除去する。省略時は false。

- **`limit`**

  `integer`, default: `100` — 取得件数。1〜10000 の整数を指定する。省略時は 100。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"keyword", "seoDifficulty", "rank", "searchVolume", "cpc", "competition", "etv"`, default: `"etv"` — ソート項目。keyword / seoDifficulty / rank / searchVolume / cpc / competition / etv。省略時は etv。

**Example:**

```json
{
  "targets": [
    {
      "url": "https://rakkokeyword.com/",
      "matchType": "sub_domain"
    }
  ],
  "keywordCollapse": false,
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "rank": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "etv": {
      "min": 100,
      "max": 10000
    }
  },
  "sortBy": "etv",
  "orderBy": "desc",
  "limit": 100
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 獲得キーワード調査結果データ

  - **`items` (required)**

    `array` — 獲得キーワード調査結果のリスト。各アイテムに対象・キーワード・指標・順位情報を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — 対象が獲得しているSEOキーワード

    - **`metrics` (required)**

      `object` — キーワードの各種指標（SEO難易度・月間検索数・CPC・広告競合性）

      - **`competition` (required)**

        `number` — 広告競合性。0〜100 で表し、高いほど広告出稿の競合が激しい。

      - **`cpc` (required)**

        `number` — 推定クリック単価（USD）

      - **`searchVolume` (required)**

        `number` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`ranking` (required)**

      `object` — 検索順位情報（順位・推定流入数・ランクインURL）

      - **`estimatedTraffic` (required)**

        `number` — このキーワードからの推定検索流入数（月間）

      - **`position` (required)**

        `number` — 検索順位

      - **`url` (required)**

        `string` — ランクインしているURL

    - **`target` (required)**

      `string` — このキーワードを獲得している対象URLまたはドメイン

  - **`query` (required)**

    `object` — リクエストで指定されたクエリ情報

    - **`targets` (required)**

      `array` — 獲得キーワード調査の対象URLまたはドメイン一覧

      **Items:**

      `string`

  - **`summary` (required)**

    `object` — 集計サマリー（件数・推定流入数・キーワード数）

    - **`estimatedTraffic` (required)**

      `number` — 対象全体の推定検索流入数（月間）

    - **`keywordCount` (required)**

      `number` — ランクインしているキーワード数

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "targets": [
        "https://example.com/"
      ]
    },
    "summary": {
      "totalCount": 983,
      "returnedCount": 100,
      "estimatedTraffic": 2824,
      "keywordCount": 983
    },
    "items": [
      {
        "target": "https://example.com/",
        "keyword": "ラッコ",
        "metrics": {
          "seoDifficulty": 30,
          "searchVolume": 10000,
          "cpc": 0,
          "competition": 0
        },
        "ranking": {
          "position": 1,
          "estimatedTraffic": 438,
          "url": "https://example.com/page"
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "urls must be a string"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 獲得ページ調査取得

- **Method:** `POST`
- **Path:** `/v1/influx-pages`
- **Tags:** 獲得キーワード調査

獲得キーワード調査のページ軸データを一括取得します。

#### Request Body

##### Content-Type: application/json

- **`targets` (required)**

  `array` — 獲得キーワード調査（ページ軸）の対象ドメインまたはURLとマッチタイプの配列。最大20件まで指定可能。

  **Items:**

  - **`url` (required)**

    `string` — ドメインまたはURL

  - **`matchType`**

    `string`, possible values: `"url", "forward_url", "domain", "sub_domain"`, default: `"sub_domain"` — マッチタイプ。url / forward\_url / domain / sub\_domain。省略時は sub\_domain。

- **`filter`**

  `object` — 結果のフィルタリング条件。合計推定流入数・キーワード数・合計集客価値・タイトル・URL・トップキーワード・SEO難易度で絞り込む。

  - **`keywordCount`**

    `object` — キーワード数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`title`**

    `object` — タイトルフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`topKeyword`**

    `object` — トップキーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`topSeoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`totalEtv`**

    `object` — 合計推定流入数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`totalTrafficValue`**

    `object` — 合計集客価値（USD）フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`url`**

    `object` — URLフィルタ（含む/含まないURL指定）

    - **`includes`**

      `array` — 含むURLのリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まないURLのリスト

      **Items:**

      `string`

- **`limit`**

  `integer`, default: `100` — 取得件数。1〜10000 の整数を指定する。省略時は 100。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"totalEtv", "totalTrafficValue", "keywordCount"`, default: `"totalEtv"` — ソート項目。totalEtv / totalTrafficValue / keywordCount。省略時は totalEtv。

- **`topKeywordCollapse`**

  `boolean`, default: `false` — トップキーワード重複除去の有効/無効。true にすると同一トップキーワードの重複を除去する。省略時は false。

**Example:**

```json
{
  "targets": [
    {
      "url": "https://rakkokeyword.com/",
      "matchType": "sub_domain"
    }
  ],
  "topKeywordCollapse": false,
  "filter": {
    "totalEtv": {
      "min": 100,
      "max": 10000
    },
    "keywordCount": {
      "min": 100,
      "max": 10000
    },
    "totalTrafficValue": {
      "min": 100,
      "max": 10000
    },
    "title": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "url": {
      "includes": [
        "https://rakkokeyword.com/"
      ],
      "notIncludes": [
        "https://rakkokeyword.com/result/"
      ]
    },
    "topKeyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "topSeoDifficulty": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "totalEtv",
  "orderBy": "desc",
  "limit": 100
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 獲得キーワード調査結果（ページ軸）データ

  - **`items` (required)**

    `array` — 獲得キーワード調査結果（ページ軸）のリスト。各アイテムに対象・ページ情報・パフォーマンス指標・代表キーワードを含む。

    **Items:**

    - **`page` (required)**

      `object` — ページ情報（タイトル・URL）

      - **`title` (required)**

        `string` — ページタイトル

      - **`url` (required)**

        `string` — ページURL

    - **`performance` (required)**

      `object` — パフォーマンス指標（ランクインキーワード数・推定流入数・集客価値）

      - **`estimatedTraffic` (required)**

        `number` — このページの推定検索流入数（月間）

      - **`rankingKeywordCount` (required)**

        `number` — このページでランクインしているキーワード数

      - **`trafficValue` (required)**

        `number` — このページの集客価値（USD）。推定流入数×CPC で算出される広告換算価値。

    - **`target` (required)**

      `string` — このページが属する対象URLまたはドメイン

    - **`topKeyword` (required)**

      `object` — 代表キーワード情報（キーワード・順位・指標）

      - **`keyword` (required)**

        `string` — このページで最も代表的な獲得キーワード

      - **`metrics` (required)**

        `object` — 代表キーワードの各種指標（SEO難易度・月間検索数）

        - **`searchVolume` (required)**

          `number` — 代表キーワードの月間検索数（年平均）

        - **`seoDifficulty` (required)**

          `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

      - **`position` (required)**

        `number` — 代表キーワードでの検索順位

  - **`query` (required)**

    `object` — リクエストで指定されたクエリ情報

    - **`targets` (required)**

      `array` — 獲得キーワード調査の対象URLまたはドメイン一覧

      **Items:**

      `string`

  - **`summary` (required)**

    `object` — 集計サマリー（件数・推定流入数・キーワード数）

    - **`estimatedTraffic` (required)**

      `number` — 対象全体の推定検索流入数（月間）

    - **`keywordCount` (required)**

      `number` — ランクインしているキーワード数

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "targets": [
        "https://example.com/"
      ]
    },
    "summary": {
      "totalCount": 319,
      "returnedCount": 100,
      "estimatedTraffic": 2824,
      "keywordCount": 983
    },
    "items": [
      {
        "target": "https://example.com/",
        "page": {
          "title": "ラッコキーワード｜キーワード分析ツール",
          "url": "https://rakkokeyword.com/"
        },
        "performance": {
          "rankingKeywordCount": 2173,
          "estimatedTraffic": 10000,
          "trafficValue": 5000
        },
        "topKeyword": {
          "keyword": "ラッコ",
          "position": 1,
          "metrics": {
            "seoDifficulty": 30,
            "searchVolume": 10000
          }
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "urls must be a string"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 競合サイト抽出

- **Method:** `POST`
- **Path:** `/v1/competitive`
- **Tags:** 獲得キーワード調査

特定ドメインの競合抽出データを取得します。

#### Request Body

##### Content-Type: application/json

- **`url` (required)**

  `string` — 競合分析を行う対象のドメインURL。対象サイトの競合サイトを抽出し、キーワード重複率や流入数などの指標を比較する。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"duplicate", "duplicateRate", "competitorUnique", "targetUnique", "etv", "keywordCount", "trafficValue", "pageCount"`, default: `"etv"` — ソート項目。duplicate / duplicateRate / competitorUnique / targetUnique / etv / keywordCount / trafficValue / pageCount。省略時は etv。

**Example:**

```json
{
  "url": "https://rakkokeyword.com/",
  "sortBy": "etv",
  "orderBy": "desc"
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 競合サイト抽出結果データ

  - **`items` (required)**

    `array` — 競合サイト抽出結果のリスト。各アイテムにサイト情報と各種指標を含む。

    **Items:**

    - **`metrics` (required)**

      `object` — 競合サイトの各種指標（流入数・集客価値・キーワード数・重複率など）

      - **`competitorUniqueKeywordCount` (required)**

        `number` — 競合サイトにのみ存在し、入力対象サイトには存在しないキーワード数

      - **`duplicateKeywordCount` (required)**

        `number` — 入力対象サイトと競合サイトで重複しているキーワード数

      - **`duplicateRate` (required)**

        `number` — 重複キーワード率。0〜1 で表し、高いほど入力対象とのキーワード重複率が高い。

      - **`estimatedTraffic` (required)**

        `number` — 競合サイト全体の推定検索流入数（月間）

      - **`keywordCount` (required)**

        `number` — 競合サイトが獲得しているキーワード数

      - **`pageCount` (required)**

        `number` — 競合サイトのインデックスされたページ数

      - **`targetUniqueKeywordCount` (required)**

        `number` — 入力対象サイトにのみ存在し、競合サイトには存在しないキーワード数

      - **`trafficValue` (required)**

        `number` — 競合サイト全体の集客価値（USD）。推定流入数×CPC で算出される広告換算価値。

    - **`site` (required)**

      `object` — 競合サイト情報（ドメイン・タイトル）

      - **`domain` (required)**

        `string` — 競合サイトのドメイン名

      - **`title` (required)**

        `string` — 競合サイトのタイトル。SERP データから取得できない場合は空文字。

  - **`query` (required)**

    `object` — リクエストで指定されたクエリ情報

    - **`targets` (required)**

      `array` — 競合サイト抽出の対象URLまたはドメイン一覧

      **Items:**

      `string`

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "targets": [
        "https://rakkoma.com/"
      ]
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "site": {
          "domain": "rakko.inc",
          "title": "ラッコ株式会社"
        },
        "metrics": {
          "estimatedTraffic": 15803,
          "trafficValue": 51386,
          "keywordCount": 119,
          "pageCount": 51,
          "duplicateKeywordCount": 119,
          "duplicateRate": 1,
          "competitorUniqueKeywordCount": 0,
          "targetUniqueKeywordCount": 596
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "urls must be a string"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 集客コンテンツ検索

- **Method:** `POST`
- **Path:** `/v1/content-search`
- **Tags:** 集客コンテンツ検索

SEO集客のあるWEBページをSEO集客力の高い順に取得

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — 集客コンテンツ検索の検索キーワード。指定キーワードに関連する上位表示コンテンツを検索する。1文字以上の文字列を指定する。

- **`filter`**

  `object` — 結果のフィルタリング条件。推定流入数・ランクインキーワード数・集客価値・タイトル・URL・トップキーワード・ディスクリプション・SEO難易度で絞り込む。

  - **`description`**

    `object` — ディスクリプションフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`estimatedTraffic`**

    `object` — 推定流入数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`rankingKeywordCount`**

    `object` — ランクインキーワード数フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`title`**

    `object` — タイトルフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`topKeyword`**

    `object` — トップキーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`trafficValue`**

    `object` — 集客価値（USD）フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`url`**

    `object` — URLフィルタ（含む/含まないURL指定）

    - **`includes`**

      `array` — 含むURLのリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まないURLのリスト

      **Items:**

      `string`

- **`isAdvancedSearch`**

  `boolean`, default: `true` — 拡張検索の有効/無効。true にするとキーワードを形態素解析して検索精度を高める。省略時は true。

- **`limit`**

  `integer`, default: `100` — 取得件数。1〜5000 の整数を指定する。省略時は 100。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`searchTarget`**

  `string`, possible values: `"title", "keyword", "description", "titleAndKeyword", "titleAndKeywordAndDescription"`, default: `"titleAndKeywordAndDescription"` — 検索対象。title / keyword / description / titleAndKeyword / titleAndKeywordAndDescription。省略時は titleAndKeywordAndDescription。

- **`sortBy`**

  `string`, possible values: `"estimatedTraffic", "trafficValue", "rankingKeywordCount"`, default: `"trafficValue"` — 結果のソート項目。estimatedTraffic / trafficValue / rankingKeywordCount。省略時は trafficValue。

- **`topKeywordCollapse`**

  `boolean`, default: `false` — トップキーワード除去の有効/無効。true にすると同一トップキーワードの重複を除去する。省略時は false。

**Example:**

```json
{
  "keyword": "ラッコ",
  "searchTarget": "titleAndKeywordAndDescription",
  "isAdvancedSearch": true,
  "topKeywordCollapse": false,
  "filter": {
    "estimatedTraffic": {
      "min": 100,
      "max": 10000
    },
    "rankingKeywordCount": {
      "min": 1,
      "max": 100
    },
    "trafficValue": {
      "min": 100,
      "max": 10000
    },
    "title": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "url": {
      "includes": [
        "https://rakkokeyword.com/"
      ],
      "notIncludes": [
        "https://rakkokeyword.com/result/"
      ]
    },
    "topKeyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "description": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "trafficValue",
  "orderBy": "desc",
  "limit": 100
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 集客コンテンツ検索結果データ

  - **`items` (required)**

    `array` — 集客コンテンツ検索結果のリスト。各アイテムにページ情報・指標・トップキーワードを含む。

    **Items:**

    - **`metrics` (required)**

      `object` — ページの各種指標（推定流入数・集客価値・ランクインキーワード数）

      - **`estimatedTraffic` (required)**

        `number` — このページの推定検索流入数（月間）

      - **`rankingKeywordCount` (required)**

        `number` — このページでランクインしているキーワード数

      - **`trafficValue` (required)**

        `number` — このページの集客価値（USD）。推定流入数×CPC で算出される広告換算価値。

    - **`page` (required)**

      `object` — ページ情報（ドメイン・URL・タイトル・ディスクリプション）

      - **`description` (required)**

        `string` — ページの説明文

      - **`domain` (required)**

        `string` — ページのドメイン名

      - **`title` (required)**

        `string` — ページのタイトル

      - **`url` (required)**

        `string` — ページの完全なURL

    - **`topKeyword` (required)**

      `object` — トップキーワード情報（代表キーワード・単語数・順位・指標）

      - **`keyword` (required)**

        `string` — このページで最も代表的な獲得キーワード

      - **`metrics` (required)**

        `object` — 代表キーワードの各種指標（SEO難易度・月間検索数）

        - **`searchVolume` (required)**

          `number` — 代表キーワードの月間検索数（年平均）

        - **`seoDifficulty` (required)**

          `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

      - **`position` (required)**

        `number` — 代表キーワードでの検索順位

      - **`wordCount` (required)**

        `number` — 代表キーワードを構成する単語数（スペース区切り）

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 集客コンテンツ検索の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "page": {
          "domain": "rakkokeyword.com",
          "url": "https://rakkokeyword.com/result/contentSearch?q=%E3%83%A9%E3%83%83%E3%82%B3",
          "title": "ラッコキーワード",
          "description": "多機能でサクサク使えるキーワードリサーチツール。生成AIによる記事生成機能搭載。SEO/市場ニーズ調査/競合分析/コンテンツ制作/商品開発にお役立ていただけます。無料でも使えます！"
        },
        "metrics": {
          "estimatedTraffic": 14000,
          "trafficValue": 2266,
          "rankingKeywordCount": 18
        },
        "topKeyword": {
          "keyword": "ラッコ",
          "wordCount": 1,
          "position": 2,
          "metrics": {
            "seoDifficulty": 37,
            "searchVolume": 5000
          }
        }
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 見出し抽出取得

- **Method:** `POST`
- **Path:** `/v1/headline`
- **Tags:** 見出し抽出

Google検索結果上位20ページの見出しを抽出します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — 見出し抽出を行う検索キーワード。1文字以上の文字列を指定する。

- **`h1`**

  `boolean`, default: `true` — h1タグの見出しを含めるかどうか。省略時は true。

- **`h2`**

  `boolean`, default: `true` — h2タグの見出しを含めるかどうか。省略時は true。

- **`h3`**

  `boolean`, default: `true` — h3タグの見出しを含めるかどうか。省略時は true。

- **`h4`**

  `boolean`, default: `true` — h4タグの見出しを含めるかどうか。省略時は true。

- **`h5`**

  `boolean`, default: `false` — h5タグの見出しを含めるかどうか。省略時は false。

- **`h6`**

  `boolean`, default: `false` — h6タグの見出しを含めるかどうか。省略時は false。

- **`lessCharacters`**

  `boolean`, default: `false` — 文字数1,000未満のページを除外するかどうか。true で除外する。省略時は false。

- **`lessHeadlines`**

  `boolean`, default: `false` — 見出し5件未満のページを除外するかどうか。true で除外する。省略時は false。

- **`limit`**

  `integer`, default: `20` — 取得件数。1〜20 の整数を指定する。省略時は 20。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"asc"` — ソート順。asc: 昇順 / desc: 降順。省略時は asc。

- **`sortBy`**

  `string`, possible values: `"position", "title", "headlineCount", "wordCount"`, default: `"position"` — ソート項目。position / title / headlineCount / wordCount。省略時は position。

**Example:**

```json
{
  "keyword": "ラッコ",
  "lessHeadlines": false,
  "lessCharacters": false,
  "h1": true,
  "h2": true,
  "h3": true,
  "h4": true,
  "h5": false,
  "h6": false,
  "sortBy": "position",
  "orderBy": "asc",
  "limit": 20
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 見出し抽出の検索結果データ

  - **`items` (required)**

    `array` — 見出し抽出アイテムのリスト。各アイテムにページ情報・指標・見出し一覧を含む。

    **Items:**

    - **`headlines` (required)**

      `array` — ページ内の見出し一覧。指定した見出しレベル（h1–h6）に応じてフィルタされる。

      **Items:**

      - **`level` (required)**

        `string` — 見出しレベル（h1, h2, h3, h4 など）

      - **`text` (required)**

        `string` — 見出しテキスト

    - **`metrics` (required)**

      `object` — ページの各種指標（検索順位・見出し数・文字数）

      - **`headlineCount` (required)**

        `number` — このページに含まれる見出し数

      - **`position` (required)**

        `number` — 検索順位

      - **`wordCount` (required)**

        `number` — このページの文字数

    - **`page` (required)**

      `object` — 検索結果ページの基本情報（URL・タイトル・ディスクリプション）

      - **`description` (required)**

        `string` — 検索結果ページのディスクリプション

      - **`title` (required)**

        `string` — 検索結果ページのタイトル

      - **`url` (required)**

        `string` — 検索結果ページの URL

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 見出し抽出の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数・文字数・見出し数のサマリー情報

    - **`averageHeadlineCount` (required)**

      `number` — 1ページあたりの平均見出し数

    - **`averageWordCount` (required)**

      `number` — 1ページあたりの平均文字数

    - **`maxWordCount` (required)**

      `number` — ページ文字数の最大値

    - **`minWordCount` (required)**

      `number` — ページ文字数の最小値

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 2
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100,
      "averageHeadlineCount": 19.5,
      "averageWordCount": 7782,
      "minWordCount": 2935,
      "maxWordCount": 12629
    },
    "items": [
      {
        "page": {
          "url": "https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%83%E3%82%B3",
          "title": "ラッコ - Wikipedia",
          "description": "ラッコは、..."
        },
        "metrics": {
          "position": 1,
          "headlineCount": 19,
          "wordCount": 14190
        },
        "headlines": [
          {
            "level": "h1",
            "text": "ラッコ"
          }
        ]
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 共起語取得

- **Method:** `POST`
- **Path:** `/v1/co-occurrence`
- **Tags:** 共起語取得

検索したキーワードの共起語を一括取得します。

#### Request Body

##### Content-Type: application/json

- **`keyword` (required)**

  `string` — 共起語取得の元となる検索キーワード。1文字以上の文字列を指定する。

- **`getDetails`**

  `boolean`, default: `true` — URLごとの詳細情報を取得するかどうか。true にすると各共起語について検索上位ページごとの出現情報を返す。省略時は true。

- **`limit`**

  `integer` — 取得件数の上限。正の整数を指定。省略時はすべての結果を返す。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"word", "occurrencePageCount", "occurrenceTitleCount", "occurrenceHeadingCount", "siteCountTotal", "siteCountHeading"`, default: `"siteCountTotal"` — ソート項目。word / occurrencePageCount / occurrenceTitleCount / occurrenceHeadingCount / siteCountTotal / siteCountHeading。省略時は siteCountTotal。

**Example:**

```json
{
  "keyword": "ラッコ",
  "getDetails": true,
  "sortBy": "siteCountTotal",
  "orderBy": "desc",
  "limit": 10
}
```

#### Responses

##### Status: 200 検索成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 共起語検索結果データ

  - **`items` (required)**

    `array` — 共起語アイテムのリスト。各アイテムに共起語・指標・詳細情報を含む。

    **Items:**

    - **`metrics` (required)**

      `object` — 共起語の各種指標（本文・タイトル・見出しの出現回数、出現サイト数）

      - **`occurrenceHeadingCount` (required)**

        `number` — 検索上位ページの見出し内でこの共起語が出現した回数

      - **`occurrencePageCount` (required)**

        `number` — 検索上位ページ内でこの共起語が出現した回数

      - **`occurrenceTitleCount` (required)**

        `number` — 検索上位ページのタイトル内でこの共起語が出現した回数

      - **`siteCountHeading` (required)**

        `number` — 検索上位サイトのうち、この共起語が見出し内に出現したサイト数

      - **`siteCountTotal` (required)**

        `number` — 検索上位サイトのうち、この共起語が本文内で出現したサイト数

    - **`word` (required)**

      `string` — 検索上位ページから抽出した共起語

    - **`pageDetails`**

      `array` — URLごとの詳細情報（getDetails=true の場合のみ）

      **Items:**

      - **`count` (required)**

        `number` — 共起語の本文内出現回数

      - **`countInHeadline` (required)**

        `number` — 共起語の見出し内出現回数

      - **`countInTitle` (required)**

        `number` — 共起語のタイトル内出現回数

      - **`pageCount` (required)**

        `number` — 共起語が出現したページ数

      - **`pageCountInHeadline` (required)**

        `number` — 見出しに共起語が出現したページ数

      - **`rank` (required)**

        `number` — 検索結果における順位

      - **`title` (required)**

        `string` — ページタイトル

      - **`url` (required)**

        `string` — ページURL

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 共起語取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 2
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "word": "水族館",
        "metrics": {
          "occurrencePageCount": 230,
          "occurrenceTitleCount": 8,
          "occurrenceHeadingCount": 21,
          "siteCountTotal": 13,
          "siteCountHeading": 7
        },
        "pageDetails": [
          {
            "rank": 1,
            "title": "ラッコ",
            "url": "https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%83%E3%82%B3",
            "count": 3,
            "countInHeadline": 0,
            "countInTitle": 0,
            "pageCount": 1,
            "pageCountInHeadline": 0
          }
        ]
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keyword is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 検索順位チェック登録

- **Method:** `POST`
- **Path:** `/v1/search-rank`
- **Tags:** 検索順位チェック

検索順位チェックを登録するAPIです。キーワードとURLを指定して、検索順位チェックに登録します。

#### Request Body

##### Content-Type: application/json

- **`keywords` (required)**

  `array` — 順位チェックするキーワードの配列

  **Items:**

  `string`

- **`urls` (required)**

  `array` — 順位チェックするURL/ドメインの配列。最大50件まで指定可能。

  **Items:**

  `string`

- **`deduplicate`**

  `boolean`, default: `true` — キーワードの重複除去を行うかどうか。省略時は true。

- **`depth`**

  `integer`, default: `30` — 検索結果の取得深度。30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 のいずれかを指定。省略時は 30。

- **`isSearchVolumeAndSeoDifficultyEnabled`**

  `boolean`, default: `false` — 月間検索数/SEO難易度を取得するかどうか。省略時は false。

- **`matchType`**

  `string`, possible values: `"url", "forward_url", "domain", "sub_domain"`, default: `"sub_domain"` — マッチタイプ。url: 完全一致URL / forward\_url: 前方一致URL / domain: ドメイン完全一致 / sub\_domain: サブドメイン含むドメイン一致。省略時は sub\_domain。

**Example:**

```json
{
  "keywords": [
    "ラッコ",
    "カワウソ"
  ],
  "urls": [
    "https://rakkokeyword.com",
    "https://rakkokeyword.com/result/contentSearch?q=%E3%83%A9%E3%83%83%E3%82%B3"
  ],
  "matchType": "sub_domain",
  "depth": 30,
  "isSearchVolumeAndSeoDifficultyEnabled": false,
  "deduplicate": true
}
```

#### Responses

##### Status: 201 登録成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 履歴登録結果

  - **`requestId`**

    `string` — リクエストID

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 1.2
  },
  "data": {
    "requestId": "01HQZX5Y4JMQK8XNQ7WVZXZ5Y4"
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "keywords is a required field"
  ]
}
```

##### Status: 402 クレジット不足

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Insufficient credits. Required: 1, Available: 0"
  ]
}
```

##### Status: 403 認証エラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

##### Status: 503 Service Unavailable - データベース接続エラーなど

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Service Unavailable"
  ]
}
```

### 検索順位チェック履歴一覧取得

- **Method:** `GET`
- **Path:** `/v1/search-rank/histories`
- **Tags:** 検索順位チェック

検索順位チェックの過去リクエスト履歴を作成日時降順で一覧取得するAPIです。

#### Parameters

##### `limit`

- **In:** `query`

取得件数。1〜100の整数を指定する。省略時は 100。

`number`, default: `100`

##### `offset`

- **In:** `query`

取得開始位置。0以上の整数を指定する。省略時は 0。

`number`, default: `0`

##### `status`

- **In:** `query`

ステータスフィルタ。completed: 全処理完了 / processing: 処理中。省略時は全件取得。

`string`, possible values: `"completed", "processing"`

#### Responses

##### Status: 200 取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 検索順位チェック履歴一覧データ

  - **`items` (required)**

    `array` — 検索順位チェック履歴アイテムのリスト

    **Items:**

    - **`completedAt` (required)**

      `object` — 全処理完了日時（ISO 8601、UTC）。未完了時は null。

    - **`createdAt` (required)**

      `string`, format: `date-time` — リクエスト作成日時（ISO 8601、UTC）

    - **`depth` (required)**

      `object` — 検索結果の取得深度。30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 のいずれか。取得深度が記録されていない古い履歴では null を返す。

    - **`isSearchVolumeAndSeoDifficultyEnabled` (required)**

      `boolean` — 月間検索数/SEO難易度の取得が有効かどうか

    - **`keywordCount` (required)**

      `number` — キーワードの件数

    - **`keywordSummary` (required)**

      `string` — キーワードのサマリ（カンマ区切り、先頭20件・255文字以内で切り詰め）

    - **`matchType` (required)**

      `string`, possible values: `"url", "forward_url", "domain", "sub_domain"` — マッチタイプ。url: 完全一致URL / forward\_url: 前方一致URL / domain: ドメイン完全一致 / sub\_domain: サブドメイン含むドメイン一致。

    - **`requestId` (required)**

      `string` — リクエストID

    - **`status` (required)**

      `string`, possible values: `"completed", "processing"` — 全体ステータス。statuses の両方が processed の場合に completed（月間検索数/SEO難易度取得 OFF の場合は serp のみで判定）。

    - **`statuses` (required)**

      `object` — 各処理のステータス情報

      - **`serp` (required)**

        `string`, possible values: `"unprocessed", "processing", "processed"` — SERP取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

      - **`searchVolumeAndSeoDifficulty`**

        `string`, possible values: `"unprocessed", "processing", "processed", "failed", "integration_failed"` — 月間検索数/SEO難易度ステータス。月間検索数/SEO難易度取得 OFF のリクエストでは欠落する。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / failed: 失敗 / integration\_failed: 統合失敗。

    - **`urlCount` (required)**

      `number` — URLの件数

    - **`urlSummary` (required)**

      `string` — URLのサマリ（カンマ区切り、先頭20件・255文字以内で切り詰め）

  - **`query` (required)**

    `object` — リクエストで指定されたクエリパラメータ

    - **`limit` (required)**

      `number` — リクエストで指定された取得件数

    - **`offset` (required)**

      `number` — リクエストで指定された取得開始位置

    - **`status` (required)**

      `object` — リクエストで指定されたステータスフィルタ

  - **`summary` (required)**

    `object` — 件数サマリ

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "limit": 100,
      "offset": 0,
      "status": null
    },
    "summary": {
      "totalCount": 1,
      "returnedCount": 1
    },
    "items": [
      {
        "requestId": "01HQZX5Y4JMQK8XNQ7WVZXZ5Y4",
        "createdAt": "2026-05-31T01:00:00.000Z",
        "completedAt": null,
        "status": "processing",
        "statuses": {
          "serp": "processed",
          "searchVolumeAndSeoDifficulty": "processing"
        },
        "keywordSummary": "ラッコ,カワウソ",
        "urlSummary": "https://rakkokeyword.com,https://rakko.inc",
        "keywordCount": 2,
        "urlCount": 2,
        "matchType": "sub_domain",
        "depth": 30,
        "isSearchVolumeAndSeoDifficultyEnabled": true
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Invalid query parameters"
  ]
}
```

##### Status: 403 認証失敗

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

### 検索順位チェックステータス取得

- **Method:** `GET`
- **Path:** `/v1/search-rank/{requestId}/status`
- **Tags:** 検索順位チェック

検索順位チェックのステータスを取得するAPIです。検索結果取得、月間検索数/SEO難易度取得の各ステータスを確認できます。

#### Parameters

##### `requestId` required

- **In:** `path`

リクエストID

`string`

#### Responses

##### Status: 200 ステータス取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — ステータス情報

  - **`isCompleted`**

    `boolean` — 全処理完了フラグ。statuses.serp が processed かつ statuses.searchVolumeAndSeoDifficulty が processed またはなし の場合に true。failed または integration\_failed の場合は false。

  - **`statuses`**

    `object` — 各処理のステータス情報

    - **`searchVolumeAndSeoDifficulty`**

      `string`, possible values: `"unprocessed", "processing", "processed", "failed", "integration_failed"` — 月間検索数/SEO難易度ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / failed: 失敗 / integration\_failed: 統合失敗。

    - **`serp`**

      `string`, possible values: `"unprocessed", "processing", "processed"` — SERP取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "isCompleted": true,
    "statuses": {
      "serp": "processed",
      "searchVolumeAndSeoDifficulty": "processing"
    }
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Invalid requestId"
  ]
}
```

##### Status: 403 認証失敗

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

### 検索順位チェック結果データ取得

- **Method:** `POST`
- **Path:** `/v1/search-rank/{requestId}/results`
- **Tags:** 検索順位チェック

検索順位チェック結果データを取得するAPIです。フィルタやソート条件を指定できます。

#### Parameters

##### `requestId` required

- **In:** `path`

リクエストID

`string`

#### Request Body

##### Content-Type: application/json

- **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・月間検索数で絞り込む。

  - **`keyword`**

    `object` — キーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

- **`limit`**

  `integer`, default: `100` — 取得件数。1以上の整数を指定する。省略時は 100。

- **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

- **`sortBy`**

  `string`, possible values: `"keyword", "seoDifficulty", "searchVolume"`, default: `"searchVolume"` — ソート項目。keyword / seoDifficulty / searchVolume。省略時は searchVolume。

- **`withAggregation`**

  `boolean`, default: `false` — ターゲットごとの集計情報（推定流入数）を出力するかどうか。省略時は false。

**Example:**

```json
{
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 100,
  "withAggregation": false
}
```

#### Responses

##### Status: 200 データ取得成功

###### Content-Type: application/json

- **`data` (required)**

  `object` — 検索順位チェック結果データ

  - **`items` (required)**

    `array` — 検索順位チェック結果アイテムのリスト

    **Items:**

    - **`keyword` (required)**

      `string` — 検索順位を確認したキーワード

    - **`metrics` (required)**

      `object` — 各種指標（SEO難易度・月間検索数・CPC・広告競合性）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。無効な場合は null。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）。無効な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）。無効な場合は null。

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`rankings` (required)**

      `array` — ターゲットごとの検索順位情報

      **Items:**

      - **`estimatedTraffic` (required)**

        `number` — このキーワードでの推定検索流入数

      - **`position` (required)**

        `object` — 検索順位。圏外または未検出の場合は null。

      - **`rankedUrl` (required)**

        `object` — 実際にランクインしたURL。未検出の場合は null。

      - **`target` (required)**

        `string` — 順位チェック対象のURLパターンまたはドメイン

  - **`query` (required)**

    `object` — 検索クエリ情報

    - **`requestId` (required)**

      `string` — 検索順位チェック結果を識別するリクエストID

  - **`summary` (required)**

    `object` — 件数サマリー

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`targets` (required)**

      `array` — ターゲットごとの検索順位分布と推定流入数（フィルター条件にマッチした全件の集計）

      **Items:**

      - **`estimatedTraffic` (required)**

        `number` — 推定検索流入数の合計（withAggregation=false の場合は0）

      - **`rankingPositionDistribution` (required)**

        `object` — フィルター条件にマッチした全件の順位分布

        - **`1-3` (required)**

          `number` — 順位1〜3位のキーワード数

        - **`101+` (required)**

          `number` — 順位101位以上のキーワード数

        - **`11-20` (required)**

          `number` — 順位11〜20位のキーワード数

        - **`21-30` (required)**

          `number` — 順位21〜30位のキーワード数

        - **`31-50` (required)**

          `number` — 順位31〜50位のキーワード数

        - **`4-10` (required)**

          `number` — 順位4〜10位のキーワード数

        - **`51-100` (required)**

          `number` — 順位51〜100位のキーワード数

      - **`target` (required)**

        `string` — 順位チェック対象のURLパターンまたはドメイン

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

- **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

- **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

- **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "requestId": "sr_20260309_001"
    },
    "summary": {
      "totalCount": 2,
      "returnedCount": 2,
      "targets": [
        {
          "target": "*.rakkoma.com/*",
          "estimatedTraffic": 7391,
          "rankingPositionDistribution": {
            "1-3": 40,
            "4-10": 15,
            "11-20": 5,
            "21-30": 4,
            "31-50": 5,
            "51-100": 3,
            "101+": 10
          }
        }
      ]
    },
    "items": [
      {
        "keyword": "サイト売買 個人",
        "metrics": {
          "seoDifficulty": 23,
          "searchVolume": 70,
          "cpc": 3.47,
          "competition": 41
        },
        "rankings": [
          {
            "target": "*.rakkoma.com/*",
            "position": 3,
            "rankedUrl": "https://rakkoma.com/",
            "estimatedTraffic": 9
          }
        ]
      }
    ]
  },
  "errors": []
}
```

##### Status: 400 バリデーションエラー

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Invalid request parameters"
  ]
}
```

##### Status: 403 認証失敗

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Forbidden"
  ]
}
```

##### Status: 429 レート制限超過

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "Rate limit exceeded. Please try again later."
  ]
}
```

##### Status: 500 Internal Server Error

###### Content-Type: application/json

- **`data`**

  `object`

- **`errors`**

  `array`

  **Items:**

  `string`

- **`result`**

  `boolean`

**Example:**

```json
{
  "result": false,
  "data": {},
  "errors": [
    "500 Internal Server Error"
  ]
}
```

## Schemas

### SuggestKeywordsDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — サジェスト取得の元となる検索キーワード。1文字以上の文字列を指定する。

* **`filter`**

  `object` — 結果のフィルタリング条件。検索ボリューム・SEO難易度・CPC・競合性・出現時期・サジェストクラスなどで絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — クリック単価（CPC）フィルタ（USD、範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`firstSeenRange`**

    `object` — 出現時期フィルタ

    - **`include`**

      `string`, possible values: `"last_7_days", "last_30_days", "last_90_days", "within_6_months", "within_1_year", "over_1_year"` — 出現時期の選択肢

  - **`keyword`**

    `object` — キーワードフィルタ

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索ボリュームフィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`suggestClass`**

    `array` — サジェストクラスフィルタ（0-3の配列）。0: ＋（サジェスト）, 1: ＋＋（サジェストのサジェスト）, 2: ＋α（拡張サジェスト）, 3: ＋＋＋（拡張/深掘りサジェスト）

    **Items:**

    `integer`

* **`increaseKeyword`**

  `boolean`, default: `false` — キーワード増量オプション。true にすると、より多くのサジェストキーワードを取得する（消費クレジットが増加する）。省略時は false。

* **`limit`**

  `integer` — 取得件数の上限。正の整数を指定。省略時はすべての結果を返す。

* **`modes`**

  `array`, default: `["google"]` — サジェストキーワードを取得する検索エンジン（複数選択可）。google / bing / youtube / googleVideo / amazon / rakuten / googleShopping / googleImage から選択。省略時は google のみ。

  **Items:**

  `string`, possible values: `"google", "bing", "youtube", "googleVideo", "amazon", "rakuten", "googleShopping", "googleImage"`

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"keyword", "suggestClass", "seoDifficulty", "searchVolume", "cpc", "competition", "firstSeenRange"`, default: `"searchVolume"` — 結果のソート項目。keyword / suggestClass / seoDifficulty / searchVolume / cpc / competition / firstSeenRange。省略時は searchVolume。

**Example:**

```json
{
  "keyword": "ラッコ",
  "modes": [
    "google",
    "bing"
  ],
  "increaseKeyword": false,
  "filter": {
    "suggestClass": [
      0,
      1
    ],
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "firstSeenRange": {
      "include": "last_30_days"
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 10
}
```

### SuggestKeywordsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — サジェストキーワード検索結果データ

  - **`items` (required)**

    `array` — サジェストキーワードのリスト。各アイテムにキーワード・サジェスト分類・SEO指標・取得エンジン情報を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — サジェストキーワード文字列

    - **`metrics` (required)**

      `object` — SEO関連の各種指標（検索ボリューム・SEO難易度・CPC・競合性・出現時期）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）

      - **`firstSeenRange` (required)**

        `object` — 出現時期。キーワードが最初に検出された時期を日付範囲ラベルで表す。不明な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`suggestClass` (required)**

      `string` — サジェストキーワードの区分ラベル。＋（0: サジェスト）, ＋＋（1: サジェストのサジェスト）, ＋α（2: 拡張サジェスト）, ＋＋＋（3: 「＋＋」または「＋α」からさらに展開されたサジェスト）

    - **`suggestEngines` (required)**

      `object` — このサジェストキーワードを返した検索エンジンの情報（エンジン数と一覧）

      - **`active` (required)**

        `array` — このキーワードが取得できたサーチエンジン一覧

        **Items:**

        `string`, possible values: `"google", "bing", "youtube", "googleVideo", "amazon", "rakuten", "googleShopping", "googleImage"`

      - **`count` (required)**

        `number` — このキーワードが取得できたサーチエンジン数

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報（キーワードと対象エンジン）

    - **`keyword` (required)**

      `string` — サジェスト取得の元になった検索キーワード

    - **`suggestEngines` (required)**

      `array` — サジェストキーワードの取得対象としたサーチエンジン一覧。単一取得の場合も配列で出力されます。

      **Items:**

      `string`, possible values: `"google", "bing", "youtube", "googleVideo", "amazon", "rakuten", "googleShopping", "googleImage"`

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。取得対象の検索エンジン数に応じて増減する（1エンジンにつき1クレジット）。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 1
  },
  "data": {
    "query": {
      "keyword": "ラッコ",
      "suggestEngines": [
        "google"
      ]
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ 水族館",
        "suggestClass": "＋",
        "metrics": {
          "seoDifficulty": 45,
          "searchVolume": 12000,
          "cpc": 1.5,
          "competition": 2,
          "firstSeenRange": "last_30_days"
        },
        "suggestEngines": {
          "count": 2,
          "active": [
            "google",
            "youtube"
          ]
        }
      }
    ]
  },
  "errors": []
}
```

### RelatedKeywordsDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — 関連キーワード取得の元となる検索キーワード。1文字以上の文字列を指定する。

* **`filter`**

  `object` — 結果のフィルタリング条件。検索ボリューム・SEO難易度・CPC・競合性・出現時期などで絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — クリック単価（CPC）フィルタ（USD、範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`firstSeenRange`**

    `object` — 出現時期フィルタ

    - **`include`**

      `string`, possible values: `"last_7_days", "last_30_days", "last_90_days", "within_6_months", "within_1_year", "over_1_year"` — 出現時期の選択肢

  - **`keyword`**

    `object` — キーワードフィルタ

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索ボリュームフィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

* **`limit`**

  `integer`, default: `1000` — 取得件数の上限。1〜25000 の整数を指定。省略時は 1000 件。

* **`matchType`**

  `string`, possible values: `"partialMatch", "phraseMatch", "prefixMatch", "suffixMatch", "wordMatch"`, default: `"partialMatch"` — キーワードのマッチタイプ。partialMatch: 部分一致 / phraseMatch: フレーズ一致 / prefixMatch: 前方一致 / suffixMatch: 後方一致 / wordMatch: 単語一致。省略時は partialMatch。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"seoDifficulty", "searchVolume", "cpc", "competition", "firstSeenRange"`, default: `"searchVolume"` — 結果のソート項目。seoDifficulty / searchVolume / cpc / competition / firstSeenRange。省略時は searchVolume。

**Example:**

```json
{
  "keyword": "ラッコ",
  "matchType": "partialMatch",
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "firstSeenRange": {
      "include": "last_30_days"
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 100
}
```

### RelatedKeywordsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 関連キーワード検索結果データ

  - **`items` (required)**

    `array` — 関連キーワードのリスト。各アイテムにキーワード・SEO指標を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — 検索キーワードを元に取得した関連キーワード

    - **`metrics` (required)**

      `object` — SEO関連の各種指標（検索ボリューム・SEO難易度・CPC・競合性・出現時期）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）

      - **`firstSeenRange` (required)**

        `object` — 出現時期。キーワードが最初に検出された時期を日付範囲ラベルで表す。不明な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 関連キーワード取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 1
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ 水族館",
        "metrics": {
          "seoDifficulty": 40,
          "searchVolume": 90500,
          "cpc": 0,
          "competition": 1,
          "firstSeenRange": "last_30_days"
        }
      }
    ]
  },
  "errors": []
}
```

### OtherKeywordsDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — 潜在的な検索キーワード（LSI）および関連する質問（PAA）を取得するための検索キーワード。1文字以上の文字列を指定する。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"importance", "seoDifficulty", "searchVolume", "cpc", "competition", "firstSeenRange"`, default: `"importance"` — 結果のソート項目。importance / seoDifficulty / searchVolume / cpc / competition / firstSeenRange。省略時は importance。

**Example:**

```json
{
  "keyword": "ラッコ",
  "sortBy": "importance",
  "orderBy": "desc"
}
```

### OtherKeywordsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 潜在的な検索キーワード/関連する質問の検索結果データ

  - **`items` (required)**

    `array` — LSI/PAA アイテムのリスト。LSI アイテムが先に、PAA アイテムが後に並ぶ。各アイテムに種別・重要度・取得元キーワードを含み、LSI の場合は SEO 指標も含まれる。

    **Items:**

    - **`importance` (required)**

      `string`, possible values: `"low", "medium", "high"` — 重要度。高いほど関連性や注目度が高いことを示す。high: 高 / medium: 中 / low: 低。

    - **`sourceKeyword` (required)**

      `string` — このキーワードまたは質問の取得元となったキーワード

    - **`type` (required)**

      `string`, possible values: `"lsi", "paa"` — データ種別。lsi: 潜在的な検索キーワード / paa: 関連する質問。

    - **`keyword`**

      `string` — 取得した潜在的な検索キーワード。type が lsi の場合に含まれる。

    - **`metrics`**

      `object` — SEO関連の各種指標。type が lsi の場合のみ含まれる。

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）

      - **`firstSeenRange` (required)**

        `object` — 出現時期。キーワードが最初に検出された時期を日付範囲ラベルで表す。不明な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`question`**

      `string` — 取得した関連する質問。type が paa の場合に含まれる。

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 潜在的な検索キーワード/質問（LSI/PAA）取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — LSI/PAA の件数サマリー

    - **`lsiCount` (required)**

      `number` — LSI（潜在的な検索キーワード）の件数

    - **`paaCount` (required)**

      `number` — PAA（People Also Ask / 関連する質問）の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 15
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "lsiCount": 1,
      "paaCount": 1
    },
    "items": [
      {
        "type": "lsi",
        "keyword": "ラッコ 水族館",
        "question": "ラッコはどこで見れますか？",
        "importance": "high",
        "sourceKeyword": "ラッコ",
        "metrics": {
          "seoDifficulty": 30,
          "searchVolume": 33100,
          "cpc": 2.17,
          "competition": 5,
          "firstSeenRange": "last_30_days"
        }
      }
    ]
  },
  "errors": []
}
```

### SearchQuestionDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — よくある質問検索の元となる検索キーワード。1文字以上の文字列を指定する。

* **`limit`**

  `integer`, default: `100` — 出力数の上限。1〜200 の整数を指定。省略時は 100。

**Example:**

```json
{
  "keyword": "ラッコ",
  "limit": 100
}
```

### SearchQuestionResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — よくある質問検索結果データ

  - **`items` (required)**

    `array` — 質問アイテムのリスト

    **Items:**

    - **`question` (required)**

      `string` — 検索キーワードに関連する質問

  - **`query` (required)**

    `object` — 検索クエリ情報

    - **`keyword` (required)**

      `string` — よくある質問検索の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 2
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "question": "ラッコが絶滅しそうな理由は何ですか?"
      }
    ]
  },
  "errors": []
}
```

### RankingKeywordsDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — 同時ランクインキーワード取得の元となる検索キーワード。指定キーワードの検索上位URLが他にランクインしているキーワードを取得する。1文字以上の文字列を指定する。

* **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・月間検索数・CPC・競合性・関連度で絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — クリック単価（CPC）フィルタ（USD、範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`keyword`**

    `object` — キーワードフィルタ

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`relevance`**

    `object` — 関連度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`searchVolume`**

    `object` — 月間検索ボリュームフィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

* **`limit`**

  `integer`, default: `500` — 取得件数。1〜5000 の整数を指定する。省略時は 500。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`searchRange`**

  `object`, default: `50` — 検索順位範囲。この順位以内にランクインしているキーワードを対象にする。選択肢: 10 / 20 / 30 / 50 / 100。省略時は 50。

* **`searchTop`**

  `object`, default: `20` — 検索上位参照数。上位何件のURLを同時ランクイン判定に使用するかを指定する。選択肢: 3 / 5 / 10 / 20 / 30 / 50。省略時は 20。

* **`sortBy`**

  `string`, possible values: `"seoDifficulty", "searchVolume", "cpc", "competition", "relevance"`, default: `"relevance"` — 結果のソート項目。seoDifficulty / searchVolume / cpc / competition / relevance。省略時は relevance。

**Example:**

```json
{
  "keyword": "ラッコ",
  "searchTop": 20,
  "searchRange": 50,
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "relevance": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "relevance",
  "orderBy": "desc",
  "limit": 500
}
```

### RankingKeywordsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 同時ランクインキーワード検索結果データ

  - **`items` (required)**

    `array` — 同時ランクインキーワード結果のリスト。各アイテムにキーワード・単語数・SEO指標を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — 同時ランクインしているキーワード

    - **`metrics` (required)**

      `object` — SEO関連の各種指標（SEO難易度・月間検索数・CPC・競合性・関連度）

      - **`competition` (required)**

        `number` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。

      - **`cpc` (required)**

        `number` — 推定クリック単価（USD）

      - **`relevance` (required)**

        `number` — 同時ランクイン度。1–100で表し、高いほど元キーワードと検索結果の重複度が高いことを示す。

      - **`searchVolume` (required)**

        `number` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`wordCount` (required)**

      `number` — キーワードのスペース区切りの単語数

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 同時ランクインキーワード取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ 水族館",
        "wordCount": 2,
        "metrics": {
          "seoDifficulty": 30,
          "searchVolume": 10000,
          "cpc": 0.5,
          "competition": 32,
          "relevance": 5
        }
      }
    ]
  },
  "errors": []
}
```

### SearchVolumeHistoryDto

- **Type:**`object`

* **`keywords` (required)**

  `array` — キーワード（入力上限50,000件）

  **Items:**

  `string`

* **`aggregationPeriodMonths`**

  `object`, default: `12` — 集計期間（月数）。12/24/36/48 のいずれか。省略時は 12。

* **`dataCompletion`**

  `boolean`, default: `true` — データ補完フラグ。true の場合にデータ補完を行う。省略時は true。

* **`deduplicate`**

  `boolean`, default: `true` — キーワードの重複除去を行うかどうか。省略時は true。

* **`language`**

  `string`, default: `"Japanese"` — 言語名。Google Ads API の LanguageCriterion に準拠。省略時は Japanese。

* **`location`**

  `string`, default: `"Japan"` — 地域名。Google Ads API の LocationCriterion に準拠。省略時は Japan。

* **`seoDifficulty`**

  `boolean`, default: `false` — SEO難易度取得フラグ。true の場合にSEO難易度を取得する。省略時は false。

**Example:**

```json
{
  "keywords": [
    "ラッコ",
    "カワウソ"
  ],
  "seoDifficulty": false,
  "dataCompletion": true,
  "location": "Japan",
  "language": "Japanese",
  "deduplicate": true,
  "aggregationPeriodMonths": 12
}
```

### SearchVolumeHistoryResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 履歴登録結果

  - **`requestId`**

    `number` — リクエストID

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 10
  },
  "data": {
    "requestId": 1234567
  },
  "errors": []
}
```

### SearchVolumeHistoryOverallStatus

- **Type:**`string`

**Example:**

### SearchVolumeHistoriesResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 一括キーワード調査履歴一覧データ

  - **`items` (required)**

    `array` — 一括キーワード調査履歴アイテムのリスト

    **Items:**

    - **`aggregationPeriodMonths` (required)**

      `number` — 集計期間（月数）

    - **`completedAt` (required)**

      `object` — 全処理完了日時（ISO 8601、UTC）。未完了時は null。

    - **`createdAt` (required)**

      `string`, format: `date-time` — リクエスト作成日時（ISO 8601、UTC）

    - **`dataCompletion` (required)**

      `boolean` — データ補完が有効かどうか

    - **`keywordCount` (required)**

      `number` — キーワードの件数

    - **`keywordSummary` (required)**

      `string` — キーワードのサマリ（カンマ区切り、先頭20件・255文字以内で切り詰め）

    - **`language` (required)**

      `string` — 言語名。Google Ads API の LanguageCriterion に準拠。

    - **`location` (required)**

      `string` — 地域名。Google Ads API の LocationCriterion に準拠。

    - **`requestId` (required)**

      `number` — リクエストID

    - **`seoDifficulty` (required)**

      `boolean` — SEO難易度取得が有効かどうか

    - **`status` (required)**

      `string`, possible values: `"completed", "processing"` — 全体ステータス。statuses の searchVolume と seoDifficulty の両方が processed の場合に completed（seoDifficulty が skip の場合も完了扱い）、それ以外は processing。noiseReduction は判定対象外。

    - **`statuses` (required)**

      `object` — 各処理のステータス情報

      - **`noiseReduction` (required)**

        `string`, possible values: `"unprocessed", "processing", "processed"` — ノイズ除去ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。ノイズ除去には時間がかかる可能性があります。

      - **`searchVolume` (required)**

        `string`, possible values: `"unprocessed", "processing", "processed"` — 月間検索数取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

      - **`seoDifficulty` (required)**

        `string`, possible values: `"skip", "unprocessed", "processing", "processed"` — SEO難易度取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / skip: スキップ（SEO難易度取得OFFの場合）。

  - **`query` (required)**

    `object` — リクエストで指定されたクエリパラメータ

    - **`limit` (required)**

      `number` — リクエストで指定された取得件数

    - **`offset` (required)**

      `number` — リクエストで指定された取得開始位置

    - **`status` (required)**

      `object` — リクエストで指定されたステータスフィルタ

  - **`summary` (required)**

    `object` — 件数サマリ

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "limit": 100,
      "offset": 0,
      "status": null
    },
    "summary": {
      "totalCount": 1,
      "returnedCount": 1
    },
    "items": [
      {
        "requestId": 1500,
        "createdAt": "2026-05-31T01:00:00.000Z",
        "completedAt": null,
        "status": "processing",
        "statuses": {
          "searchVolume": "processed",
          "seoDifficulty": "unprocessed",
          "noiseReduction": "processing"
        },
        "keywordSummary": "ラッコ,カワウソ",
        "keywordCount": 2,
        "seoDifficulty": true,
        "location": "Japan",
        "language": "Japanese",
        "aggregationPeriodMonths": 12,
        "dataCompletion": true
      }
    ]
  },
  "errors": []
}
```

### SearchVolumeStatusResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — ステータス情報

  - **`isCompleted`**

    `boolean` — 全処理完了フラグ。searchVolume が processed かつ seoDifficulty が processed または skip の場合に true。noiseReduction は判定対象外。

  - **`statuses`**

    `object` — 各処理のステータス情報

    - **`noiseReduction`**

      `string`, possible values: `"unprocessed", "processing", "processed"` — ノイズ除去ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。ノイズ除去には時間がかかる可能性があります。

    - **`searchVolume`**

      `string`, possible values: `"unprocessed", "processing", "processed"` — 月間検索数取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

    - **`seoDifficulty`**

      `string`, possible values: `"skip", "unprocessed", "processing", "processed"` — SEO難易度取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / skip: スキップ。

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "isCompleted": true,
    "statuses": {
      "searchVolume": "processed",
      "noiseReduction": "processing",
      "seoDifficulty": "skip"
    }
  },
  "errors": []
}
```

### SearchVolumeResultsDto

- **Type:**`object`

* **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・月間検索数・CPC・競合性で絞り込む。

  - **`competition`**

    `object` — 競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — CPCフィルタ（範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`keyword`**

    `object` — キーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

* **`limit`**

  `integer`, default: `100` — 取得件数。1〜50,000の整数を指定する。省略時は 100。

* **`noiseReduction`**

  `boolean`, default: `true` — ノイズ除去フラグ。true の場合にノイズ除去を適用する。省略時は true。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"keyword", "seoDifficulty", "searchVolume", "rateOfChange", "cpc", "competition"`, default: `"searchVolume"` — ソート項目。keyword / seoDifficulty / searchVolume / rateOfChange / cpc / competition。省略時は searchVolume。

**Example:**

```json
{
  "noiseReduction": true,
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 100
}
```

### SearchVolumeResultsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 検索ボリューム結果データ

  - **`items`**

    `array` — 検索結果アイテムのリスト

    **Items:**

    - **`dataSource` (required)**

      `object` — 検索数データの取得元。取得できなかった場合は null。

    - **`keyword` (required)**

      `string` — キーワード

    - **`metrics` (required)**

      `object` — 各種指標（SEO難易度・月間検索数・CPC・広告競合性）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い。無効な場合は null。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）。無効な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）。無効な場合は null。

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い。不明な場合は null。

    - **`trends` (required)**

      `object` — 検索数トレンド（増減率・月別検索数）

      - **`changeRate` (required)**

        `object` — 検索数の増減率（3か月・6か月・12か月）

        - **`12m` (required)**

          `object` — 直近12か月に対する直近月の検索数増減率

        - **`3m` (required)**

          `object` — 直近3か月に対する直近月の検索数増減率

        - **`6m` (required)**

          `object` — 直近6か月に対する直近月の検索数増減率

        - **`yoy1y` (required)**

          `object` — 1年前同月比（集計期間24か月以上で算出）

        - **`yoy2y` (required)**

          `object` — 2年前同月比（集計期間36か月以上で算出）

        - **`yoy3y` (required)**

          `object` — 3年前同月比（集計期間48か月以上で算出）

      - **`monthlySearchVolume` (required)**

        `object` — 月ごとの検索数。キーは YYYY-MM 形式。データがない場合は null。

  - **`query`**

    `object` — クエリ情報（リクエストID・地域・言語）

    - **`aggregationPeriodMonths` (required)**

      `number` — 集計期間（月数）

    - **`language` (required)**

      `string` — 検索ボリューム取得対象の言語

    - **`location` (required)**

      `string` — 検索ボリューム取得対象の地域

    - **`requestId` (required)**

      `number` — リクエストID

  - **`summary`**

    `object` — 件数サマリー

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "requestId": 1234567,
      "location": "Japan",
      "language": "Japanese",
      "aggregationPeriodMonths": 12
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "keyword": "ラッコ",
        "dataSource": "GoogleLive",
        "metrics": {
          "seoDifficulty": 40,
          "searchVolume": 90500,
          "cpc": 0,
          "competition": 1
        },
        "trends": {
          "changeRate": {
            "12m": 0.4159,
            "6m": 0.0796,
            "3m": -0.0695,
            "yoy1y": 0.1523,
            "yoy2y": -0.0845,
            "yoy3y": 0.2311
          },
          "monthlySearchVolume": {
            "2025-01": 2740000,
            "2025-02": 2240000
          }
        }
      }
    ]
  },
  "errors": []
}
```

### LocationsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 地域一覧

  - **`locations` (required)**

    `array` — 指定可能な地域の一覧

    **Items:**

    - **`code` (required)**

      `number` — Google Ads API の LocationCriterion ID

    - **`countryIsoCode` (required)**

      `string` — ISO 3166-1 alpha-2 国コード

    - **`name` (required)**

      `string` — 地域名（Google Ads API の LocationCriterion 準拠）

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "locations": [
      {
        "name": "Japan",
        "code": 2392,
        "countryIsoCode": "JP"
      }
    ]
  },
  "errors": []
}
```

### LanguagesResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 言語一覧

  - **`languages` (required)**

    `array` — 指定可能な言語の一覧

    **Items:**

    - **`code` (required)**

      `string` — 言語コード（ISO 639-1）

    - **`name` (required)**

      `string` — 言語名（Google Ads API の LanguageCriterion 準拠）

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "languages": [
      {
        "name": "Japanese",
        "code": "ja"
      }
    ]
  },
  "errors": []
}
```

### InfluxKeywordsKeywordDto

- **Type:**`object`

* **`targets` (required)**

  `array` — 獲得キーワード調査の対象ドメインまたはURLとマッチタイプの配列。最大20件まで指定可能。

  **Items:**

  - **`url` (required)**

    `string` — ドメインまたはURL

  - **`matchType`**

    `string`, possible values: `"url", "forward_url", "domain", "sub_domain"`, default: `"sub_domain"` — マッチタイプ。url / forward\_url / domain / sub\_domain。省略時は sub\_domain。

* **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・検索順位・月間検索数・CPC・競合性・推定流入数で絞り込む。

  - **`competition`**

    `object` — 広告競合性フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`cpc`**

    `object` — CPC（$）フィルタ（範囲指定）

    - **`max`**

      `number` — 最大CPC

    - **`min`**

      `number` — 最小CPC

  - **`etv`**

    `object` — 推定流入数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`keyword`**

    `object` — キーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`rank`**

    `object` — 検索順位フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`searchVolume`**

    `object` — 月間検索数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

* **`keywordCollapse`**

  `boolean`, default: `false` — キーワード重複除去の有効/無効。true にすると同一キーワードの重複を除去する。省略時は false。

* **`limit`**

  `integer`, default: `100` — 取得件数。1〜10000 の整数を指定する。省略時は 100。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"keyword", "seoDifficulty", "rank", "searchVolume", "cpc", "competition", "etv"`, default: `"etv"` — ソート項目。keyword / seoDifficulty / rank / searchVolume / cpc / competition / etv。省略時は etv。

**Example:**

```json
{
  "targets": [
    {
      "url": "https://rakkokeyword.com/",
      "matchType": "sub_domain"
    }
  ],
  "keywordCollapse": false,
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "rank": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    },
    "cpc": {
      "min": 0.5,
      "max": 10
    },
    "competition": {
      "min": 1,
      "max": 100
    },
    "etv": {
      "min": 100,
      "max": 10000
    }
  },
  "sortBy": "etv",
  "orderBy": "desc",
  "limit": 100
}
```

### InfluxKeywordsKeywordResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 獲得キーワード調査結果データ

  - **`items` (required)**

    `array` — 獲得キーワード調査結果のリスト。各アイテムに対象・キーワード・指標・順位情報を含む。

    **Items:**

    - **`keyword` (required)**

      `string` — 対象が獲得しているSEOキーワード

    - **`metrics` (required)**

      `object` — キーワードの各種指標（SEO難易度・月間検索数・CPC・広告競合性）

      - **`competition` (required)**

        `number` — 広告競合性。0〜100 で表し、高いほど広告出稿の競合が激しい。

      - **`cpc` (required)**

        `number` — 推定クリック単価（USD）

      - **`searchVolume` (required)**

        `number` — 月間検索数（年平均）

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`ranking` (required)**

      `object` — 検索順位情報（順位・推定流入数・ランクインURL）

      - **`estimatedTraffic` (required)**

        `number` — このキーワードからの推定検索流入数（月間）

      - **`position` (required)**

        `number` — 検索順位

      - **`url` (required)**

        `string` — ランクインしているURL

    - **`target` (required)**

      `string` — このキーワードを獲得している対象URLまたはドメイン

  - **`query` (required)**

    `object` — リクエストで指定されたクエリ情報

    - **`targets` (required)**

      `array` — 獲得キーワード調査の対象URLまたはドメイン一覧

      **Items:**

      `string`

  - **`summary` (required)**

    `object` — 集計サマリー（件数・推定流入数・キーワード数）

    - **`estimatedTraffic` (required)**

      `number` — 対象全体の推定検索流入数（月間）

    - **`keywordCount` (required)**

      `number` — ランクインしているキーワード数

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "targets": [
        "https://example.com/"
      ]
    },
    "summary": {
      "totalCount": 983,
      "returnedCount": 100,
      "estimatedTraffic": 2824,
      "keywordCount": 983
    },
    "items": [
      {
        "target": "https://example.com/",
        "keyword": "ラッコ",
        "metrics": {
          "seoDifficulty": 30,
          "searchVolume": 10000,
          "cpc": 0,
          "competition": 0
        },
        "ranking": {
          "position": 1,
          "estimatedTraffic": 438,
          "url": "https://example.com/page"
        }
      }
    ]
  },
  "errors": []
}
```

### InfluxPagesDto

- **Type:**`object`

* **`targets` (required)**

  `array` — 獲得キーワード調査（ページ軸）の対象ドメインまたはURLとマッチタイプの配列。最大20件まで指定可能。

  **Items:**

  - **`url` (required)**

    `string` — ドメインまたはURL

  - **`matchType`**

    `string`, possible values: `"url", "forward_url", "domain", "sub_domain"`, default: `"sub_domain"` — マッチタイプ。url / forward\_url / domain / sub\_domain。省略時は sub\_domain。

* **`filter`**

  `object` — 結果のフィルタリング条件。合計推定流入数・キーワード数・合計集客価値・タイトル・URL・トップキーワード・SEO難易度で絞り込む。

  - **`keywordCount`**

    `object` — キーワード数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`title`**

    `object` — タイトルフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`topKeyword`**

    `object` — トップキーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`topSeoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`totalEtv`**

    `object` — 合計推定流入数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`totalTrafficValue`**

    `object` — 合計集客価値（USD）フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`url`**

    `object` — URLフィルタ（含む/含まないURL指定）

    - **`includes`**

      `array` — 含むURLのリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まないURLのリスト

      **Items:**

      `string`

* **`limit`**

  `integer`, default: `100` — 取得件数。1〜10000 の整数を指定する。省略時は 100。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"totalEtv", "totalTrafficValue", "keywordCount"`, default: `"totalEtv"` — ソート項目。totalEtv / totalTrafficValue / keywordCount。省略時は totalEtv。

* **`topKeywordCollapse`**

  `boolean`, default: `false` — トップキーワード重複除去の有効/無効。true にすると同一トップキーワードの重複を除去する。省略時は false。

**Example:**

```json
{
  "targets": [
    {
      "url": "https://rakkokeyword.com/",
      "matchType": "sub_domain"
    }
  ],
  "topKeywordCollapse": false,
  "filter": {
    "totalEtv": {
      "min": 100,
      "max": 10000
    },
    "keywordCount": {
      "min": 100,
      "max": 10000
    },
    "totalTrafficValue": {
      "min": 100,
      "max": 10000
    },
    "title": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "url": {
      "includes": [
        "https://rakkokeyword.com/"
      ],
      "notIncludes": [
        "https://rakkokeyword.com/result/"
      ]
    },
    "topKeyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "topSeoDifficulty": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "totalEtv",
  "orderBy": "desc",
  "limit": 100
}
```

### InfluxPagesResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 獲得キーワード調査結果（ページ軸）データ

  - **`items` (required)**

    `array` — 獲得キーワード調査結果（ページ軸）のリスト。各アイテムに対象・ページ情報・パフォーマンス指標・代表キーワードを含む。

    **Items:**

    - **`page` (required)**

      `object` — ページ情報（タイトル・URL）

      - **`title` (required)**

        `string` — ページタイトル

      - **`url` (required)**

        `string` — ページURL

    - **`performance` (required)**

      `object` — パフォーマンス指標（ランクインキーワード数・推定流入数・集客価値）

      - **`estimatedTraffic` (required)**

        `number` — このページの推定検索流入数（月間）

      - **`rankingKeywordCount` (required)**

        `number` — このページでランクインしているキーワード数

      - **`trafficValue` (required)**

        `number` — このページの集客価値（USD）。推定流入数×CPC で算出される広告換算価値。

    - **`target` (required)**

      `string` — このページが属する対象URLまたはドメイン

    - **`topKeyword` (required)**

      `object` — 代表キーワード情報（キーワード・順位・指標）

      - **`keyword` (required)**

        `string` — このページで最も代表的な獲得キーワード

      - **`metrics` (required)**

        `object` — 代表キーワードの各種指標（SEO難易度・月間検索数）

        - **`searchVolume` (required)**

          `number` — 代表キーワードの月間検索数（年平均）

        - **`seoDifficulty` (required)**

          `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

      - **`position` (required)**

        `number` — 代表キーワードでの検索順位

  - **`query` (required)**

    `object` — リクエストで指定されたクエリ情報

    - **`targets` (required)**

      `array` — 獲得キーワード調査の対象URLまたはドメイン一覧

      **Items:**

      `string`

  - **`summary` (required)**

    `object` — 集計サマリー（件数・推定流入数・キーワード数）

    - **`estimatedTraffic` (required)**

      `number` — 対象全体の推定検索流入数（月間）

    - **`keywordCount` (required)**

      `number` — ランクインしているキーワード数

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "targets": [
        "https://example.com/"
      ]
    },
    "summary": {
      "totalCount": 319,
      "returnedCount": 100,
      "estimatedTraffic": 2824,
      "keywordCount": 983
    },
    "items": [
      {
        "target": "https://example.com/",
        "page": {
          "title": "ラッコキーワード｜キーワード分析ツール",
          "url": "https://rakkokeyword.com/"
        },
        "performance": {
          "rankingKeywordCount": 2173,
          "estimatedTraffic": 10000,
          "trafficValue": 5000
        },
        "topKeyword": {
          "keyword": "ラッコ",
          "position": 1,
          "metrics": {
            "seoDifficulty": 30,
            "searchVolume": 10000
          }
        }
      }
    ]
  },
  "errors": []
}
```

### CompetitiveDto

- **Type:**`object`

* **`url` (required)**

  `string` — 競合分析を行う対象のドメインURL。対象サイトの競合サイトを抽出し、キーワード重複率や流入数などの指標を比較する。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"duplicate", "duplicateRate", "competitorUnique", "targetUnique", "etv", "keywordCount", "trafficValue", "pageCount"`, default: `"etv"` — ソート項目。duplicate / duplicateRate / competitorUnique / targetUnique / etv / keywordCount / trafficValue / pageCount。省略時は etv。

**Example:**

```json
{
  "url": "https://rakkokeyword.com/",
  "sortBy": "etv",
  "orderBy": "desc"
}
```

### CompetitiveResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 競合サイト抽出結果データ

  - **`items` (required)**

    `array` — 競合サイト抽出結果のリスト。各アイテムにサイト情報と各種指標を含む。

    **Items:**

    - **`metrics` (required)**

      `object` — 競合サイトの各種指標（流入数・集客価値・キーワード数・重複率など）

      - **`competitorUniqueKeywordCount` (required)**

        `number` — 競合サイトにのみ存在し、入力対象サイトには存在しないキーワード数

      - **`duplicateKeywordCount` (required)**

        `number` — 入力対象サイトと競合サイトで重複しているキーワード数

      - **`duplicateRate` (required)**

        `number` — 重複キーワード率。0〜1 で表し、高いほど入力対象とのキーワード重複率が高い。

      - **`estimatedTraffic` (required)**

        `number` — 競合サイト全体の推定検索流入数（月間）

      - **`keywordCount` (required)**

        `number` — 競合サイトが獲得しているキーワード数

      - **`pageCount` (required)**

        `number` — 競合サイトのインデックスされたページ数

      - **`targetUniqueKeywordCount` (required)**

        `number` — 入力対象サイトにのみ存在し、競合サイトには存在しないキーワード数

      - **`trafficValue` (required)**

        `number` — 競合サイト全体の集客価値（USD）。推定流入数×CPC で算出される広告換算価値。

    - **`site` (required)**

      `object` — 競合サイト情報（ドメイン・タイトル）

      - **`domain` (required)**

        `string` — 競合サイトのドメイン名

      - **`title` (required)**

        `string` — 競合サイトのタイトル。SERP データから取得できない場合は空文字。

  - **`query` (required)**

    `object` — リクエストで指定されたクエリ情報

    - **`targets` (required)**

      `array` — 競合サイト抽出の対象URLまたはドメイン一覧

      **Items:**

      `string`

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "targets": [
        "https://rakkoma.com/"
      ]
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "site": {
          "domain": "rakko.inc",
          "title": "ラッコ株式会社"
        },
        "metrics": {
          "estimatedTraffic": 15803,
          "trafficValue": 51386,
          "keywordCount": 119,
          "pageCount": 51,
          "duplicateKeywordCount": 119,
          "duplicateRate": 1,
          "competitorUniqueKeywordCount": 0,
          "targetUniqueKeywordCount": 596
        }
      }
    ]
  },
  "errors": []
}
```

### ContentSearchDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — 集客コンテンツ検索の検索キーワード。指定キーワードに関連する上位表示コンテンツを検索する。1文字以上の文字列を指定する。

* **`filter`**

  `object` — 結果のフィルタリング条件。推定流入数・ランクインキーワード数・集客価値・タイトル・URL・トップキーワード・ディスクリプション・SEO難易度で絞り込む。

  - **`description`**

    `object` — ディスクリプションフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`estimatedTraffic`**

    `object` — 推定流入数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`rankingKeywordCount`**

    `object` — ランクインキーワード数フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`title`**

    `object` — タイトルフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`topKeyword`**

    `object` — トップキーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`trafficValue`**

    `object` — 集客価値（USD）フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`url`**

    `object` — URLフィルタ（含む/含まないURL指定）

    - **`includes`**

      `array` — 含むURLのリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まないURLのリスト

      **Items:**

      `string`

* **`isAdvancedSearch`**

  `boolean`, default: `true` — 拡張検索の有効/無効。true にするとキーワードを形態素解析して検索精度を高める。省略時は true。

* **`limit`**

  `integer`, default: `100` — 取得件数。1〜5000 の整数を指定する。省略時は 100。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`searchTarget`**

  `string`, possible values: `"title", "keyword", "description", "titleAndKeyword", "titleAndKeywordAndDescription"`, default: `"titleAndKeywordAndDescription"` — 検索対象。title / keyword / description / titleAndKeyword / titleAndKeywordAndDescription。省略時は titleAndKeywordAndDescription。

* **`sortBy`**

  `string`, possible values: `"estimatedTraffic", "trafficValue", "rankingKeywordCount"`, default: `"trafficValue"` — 結果のソート項目。estimatedTraffic / trafficValue / rankingKeywordCount。省略時は trafficValue。

* **`topKeywordCollapse`**

  `boolean`, default: `false` — トップキーワード除去の有効/無効。true にすると同一トップキーワードの重複を除去する。省略時は false。

**Example:**

```json
{
  "keyword": "ラッコ",
  "searchTarget": "titleAndKeywordAndDescription",
  "isAdvancedSearch": true,
  "topKeywordCollapse": false,
  "filter": {
    "estimatedTraffic": {
      "min": 100,
      "max": 10000
    },
    "rankingKeywordCount": {
      "min": 1,
      "max": 100
    },
    "trafficValue": {
      "min": 100,
      "max": 10000
    },
    "title": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "url": {
      "includes": [
        "https://rakkokeyword.com/"
      ],
      "notIncludes": [
        "https://rakkokeyword.com/result/"
      ]
    },
    "topKeyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "description": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    }
  },
  "sortBy": "trafficValue",
  "orderBy": "desc",
  "limit": 100
}
```

### ContentSearchResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 集客コンテンツ検索結果データ

  - **`items` (required)**

    `array` — 集客コンテンツ検索結果のリスト。各アイテムにページ情報・指標・トップキーワードを含む。

    **Items:**

    - **`metrics` (required)**

      `object` — ページの各種指標（推定流入数・集客価値・ランクインキーワード数）

      - **`estimatedTraffic` (required)**

        `number` — このページの推定検索流入数（月間）

      - **`rankingKeywordCount` (required)**

        `number` — このページでランクインしているキーワード数

      - **`trafficValue` (required)**

        `number` — このページの集客価値（USD）。推定流入数×CPC で算出される広告換算価値。

    - **`page` (required)**

      `object` — ページ情報（ドメイン・URL・タイトル・ディスクリプション）

      - **`description` (required)**

        `string` — ページの説明文

      - **`domain` (required)**

        `string` — ページのドメイン名

      - **`title` (required)**

        `string` — ページのタイトル

      - **`url` (required)**

        `string` — ページの完全なURL

    - **`topKeyword` (required)**

      `object` — トップキーワード情報（代表キーワード・単語数・順位・指標）

      - **`keyword` (required)**

        `string` — このページで最も代表的な獲得キーワード

      - **`metrics` (required)**

        `object` — 代表キーワードの各種指標（SEO難易度・月間検索数）

        - **`searchVolume` (required)**

          `number` — 代表キーワードの月間検索数（年平均）

        - **`seoDifficulty` (required)**

          `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

      - **`position` (required)**

        `number` — 代表キーワードでの検索順位

      - **`wordCount` (required)**

        `number` — 代表キーワードを構成する単語数（スペース区切り）

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 集客コンテンツ検索の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 3
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "page": {
          "domain": "rakkokeyword.com",
          "url": "https://rakkokeyword.com/result/contentSearch?q=%E3%83%A9%E3%83%83%E3%82%B3",
          "title": "ラッコキーワード",
          "description": "多機能でサクサク使えるキーワードリサーチツール。生成AIによる記事生成機能搭載。SEO/市場ニーズ調査/競合分析/コンテンツ制作/商品開発にお役立ていただけます。無料でも使えます！"
        },
        "metrics": {
          "estimatedTraffic": 14000,
          "trafficValue": 2266,
          "rankingKeywordCount": 18
        },
        "topKeyword": {
          "keyword": "ラッコ",
          "wordCount": 1,
          "position": 2,
          "metrics": {
            "seoDifficulty": 37,
            "searchVolume": 5000
          }
        }
      }
    ]
  },
  "errors": []
}
```

### HeadlineDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — 見出し抽出を行う検索キーワード。1文字以上の文字列を指定する。

* **`h1`**

  `boolean`, default: `true` — h1タグの見出しを含めるかどうか。省略時は true。

* **`h2`**

  `boolean`, default: `true` — h2タグの見出しを含めるかどうか。省略時は true。

* **`h3`**

  `boolean`, default: `true` — h3タグの見出しを含めるかどうか。省略時は true。

* **`h4`**

  `boolean`, default: `true` — h4タグの見出しを含めるかどうか。省略時は true。

* **`h5`**

  `boolean`, default: `false` — h5タグの見出しを含めるかどうか。省略時は false。

* **`h6`**

  `boolean`, default: `false` — h6タグの見出しを含めるかどうか。省略時は false。

* **`lessCharacters`**

  `boolean`, default: `false` — 文字数1,000未満のページを除外するかどうか。true で除外する。省略時は false。

* **`lessHeadlines`**

  `boolean`, default: `false` — 見出し5件未満のページを除外するかどうか。true で除外する。省略時は false。

* **`limit`**

  `integer`, default: `20` — 取得件数。1〜20 の整数を指定する。省略時は 20。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"asc"` — ソート順。asc: 昇順 / desc: 降順。省略時は asc。

* **`sortBy`**

  `string`, possible values: `"position", "title", "headlineCount", "wordCount"`, default: `"position"` — ソート項目。position / title / headlineCount / wordCount。省略時は position。

**Example:**

```json
{
  "keyword": "ラッコ",
  "lessHeadlines": false,
  "lessCharacters": false,
  "h1": true,
  "h2": true,
  "h3": true,
  "h4": true,
  "h5": false,
  "h6": false,
  "sortBy": "position",
  "orderBy": "asc",
  "limit": 20
}
```

### HeadlineResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 見出し抽出の検索結果データ

  - **`items` (required)**

    `array` — 見出し抽出アイテムのリスト。各アイテムにページ情報・指標・見出し一覧を含む。

    **Items:**

    - **`headlines` (required)**

      `array` — ページ内の見出し一覧。指定した見出しレベル（h1–h6）に応じてフィルタされる。

      **Items:**

      - **`level` (required)**

        `string` — 見出しレベル（h1, h2, h3, h4 など）

      - **`text` (required)**

        `string` — 見出しテキスト

    - **`metrics` (required)**

      `object` — ページの各種指標（検索順位・見出し数・文字数）

      - **`headlineCount` (required)**

        `number` — このページに含まれる見出し数

      - **`position` (required)**

        `number` — 検索順位

      - **`wordCount` (required)**

        `number` — このページの文字数

    - **`page` (required)**

      `object` — 検索結果ページの基本情報（URL・タイトル・ディスクリプション）

      - **`description` (required)**

        `string` — 検索結果ページのディスクリプション

      - **`title` (required)**

        `string` — 検索結果ページのタイトル

      - **`url` (required)**

        `string` — 検索結果ページの URL

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 見出し抽出の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数・文字数・見出し数のサマリー情報

    - **`averageHeadlineCount` (required)**

      `number` — 1ページあたりの平均見出し数

    - **`averageWordCount` (required)**

      `number` — 1ページあたりの平均文字数

    - **`maxWordCount` (required)**

      `number` — ページ文字数の最大値

    - **`minWordCount` (required)**

      `number` — ページ文字数の最小値

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 2
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100,
      "averageHeadlineCount": 19.5,
      "averageWordCount": 7782,
      "minWordCount": 2935,
      "maxWordCount": 12629
    },
    "items": [
      {
        "page": {
          "url": "https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%83%E3%82%B3",
          "title": "ラッコ - Wikipedia",
          "description": "ラッコは、..."
        },
        "metrics": {
          "position": 1,
          "headlineCount": 19,
          "wordCount": 14190
        },
        "headlines": [
          {
            "level": "h1",
            "text": "ラッコ"
          }
        ]
      }
    ]
  },
  "errors": []
}
```

### CoOccurrenceDto

- **Type:**`object`

* **`keyword` (required)**

  `string` — 共起語取得の元となる検索キーワード。1文字以上の文字列を指定する。

* **`getDetails`**

  `boolean`, default: `true` — URLごとの詳細情報を取得するかどうか。true にすると各共起語について検索上位ページごとの出現情報を返す。省略時は true。

* **`limit`**

  `integer` — 取得件数の上限。正の整数を指定。省略時はすべての結果を返す。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"word", "occurrencePageCount", "occurrenceTitleCount", "occurrenceHeadingCount", "siteCountTotal", "siteCountHeading"`, default: `"siteCountTotal"` — ソート項目。word / occurrencePageCount / occurrenceTitleCount / occurrenceHeadingCount / siteCountTotal / siteCountHeading。省略時は siteCountTotal。

**Example:**

```json
{
  "keyword": "ラッコ",
  "getDetails": true,
  "sortBy": "siteCountTotal",
  "orderBy": "desc",
  "limit": 10
}
```

### CoOccurrenceResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 共起語検索結果データ

  - **`items` (required)**

    `array` — 共起語アイテムのリスト。各アイテムに共起語・指標・詳細情報を含む。

    **Items:**

    - **`metrics` (required)**

      `object` — 共起語の各種指標（本文・タイトル・見出しの出現回数、出現サイト数）

      - **`occurrenceHeadingCount` (required)**

        `number` — 検索上位ページの見出し内でこの共起語が出現した回数

      - **`occurrencePageCount` (required)**

        `number` — 検索上位ページ内でこの共起語が出現した回数

      - **`occurrenceTitleCount` (required)**

        `number` — 検索上位ページのタイトル内でこの共起語が出現した回数

      - **`siteCountHeading` (required)**

        `number` — 検索上位サイトのうち、この共起語が見出し内に出現したサイト数

      - **`siteCountTotal` (required)**

        `number` — 検索上位サイトのうち、この共起語が本文内で出現したサイト数

    - **`word` (required)**

      `string` — 検索上位ページから抽出した共起語

    - **`pageDetails`**

      `array` — URLごとの詳細情報（getDetails=true の場合のみ）

      **Items:**

      - **`count` (required)**

        `number` — 共起語の本文内出現回数

      - **`countInHeadline` (required)**

        `number` — 共起語の見出し内出現回数

      - **`countInTitle` (required)**

        `number` — 共起語のタイトル内出現回数

      - **`pageCount` (required)**

        `number` — 共起語が出現したページ数

      - **`pageCountInHeadline` (required)**

        `number` — 見出しに共起語が出現したページ数

      - **`rank` (required)**

        `number` — 検索結果における順位

      - **`title` (required)**

        `string` — ページタイトル

      - **`url` (required)**

        `string` — ページURL

  - **`query` (required)**

    `object` — リクエストで指定された検索クエリ情報

    - **`keyword` (required)**

      `string` — 共起語取得の元になった検索キーワード

  - **`summary` (required)**

    `object` — 件数サマリー（全体件数とレスポンスに含まれる件数）

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 2
  },
  "data": {
    "query": {
      "keyword": "ラッコ"
    },
    "summary": {
      "totalCount": 150,
      "returnedCount": 100
    },
    "items": [
      {
        "word": "水族館",
        "metrics": {
          "occurrencePageCount": 230,
          "occurrenceTitleCount": 8,
          "occurrenceHeadingCount": 21,
          "siteCountTotal": 13,
          "siteCountHeading": 7
        },
        "pageDetails": [
          {
            "rank": 1,
            "title": "ラッコ",
            "url": "https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%83%E3%82%B3",
            "count": 3,
            "countInHeadline": 0,
            "countInTitle": 0,
            "pageCount": 1,
            "pageCountInHeadline": 0
          }
        ]
      }
    ]
  },
  "errors": []
}
```

### SearchRankHistoryDto

- **Type:**`object`

* **`keywords` (required)**

  `array` — 順位チェックするキーワードの配列

  **Items:**

  `string`

* **`urls` (required)**

  `array` — 順位チェックするURL/ドメインの配列。最大50件まで指定可能。

  **Items:**

  `string`

* **`deduplicate`**

  `boolean`, default: `true` — キーワードの重複除去を行うかどうか。省略時は true。

* **`depth`**

  `integer`, default: `30` — 検索結果の取得深度。30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 のいずれかを指定。省略時は 30。

* **`isSearchVolumeAndSeoDifficultyEnabled`**

  `boolean`, default: `false` — 月間検索数/SEO難易度を取得するかどうか。省略時は false。

* **`matchType`**

  `string`, possible values: `"url", "forward_url", "domain", "sub_domain"`, default: `"sub_domain"` — マッチタイプ。url: 完全一致URL / forward\_url: 前方一致URL / domain: ドメイン完全一致 / sub\_domain: サブドメイン含むドメイン一致。省略時は sub\_domain。

**Example:**

```json
{
  "keywords": [
    "ラッコ",
    "カワウソ"
  ],
  "urls": [
    "https://rakkokeyword.com",
    "https://rakkokeyword.com/result/contentSearch?q=%E3%83%A9%E3%83%83%E3%82%B3"
  ],
  "matchType": "sub_domain",
  "depth": 30,
  "isSearchVolumeAndSeoDifficultyEnabled": false,
  "deduplicate": true
}
```

### SearchRankHistoryResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 履歴登録結果

  - **`requestId`**

    `string` — リクエストID

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 1.2
  },
  "data": {
    "requestId": "01HQZX5Y4JMQK8XNQ7WVZXZ5Y4"
  },
  "errors": []
}
```

### SearchRankHistoryOverallStatus

- **Type:**`string`

**Example:**

### SearchRankHistoriesResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 検索順位チェック履歴一覧データ

  - **`items` (required)**

    `array` — 検索順位チェック履歴アイテムのリスト

    **Items:**

    - **`completedAt` (required)**

      `object` — 全処理完了日時（ISO 8601、UTC）。未完了時は null。

    - **`createdAt` (required)**

      `string`, format: `date-time` — リクエスト作成日時（ISO 8601、UTC）

    - **`depth` (required)**

      `object` — 検索結果の取得深度。30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 のいずれか。取得深度が記録されていない古い履歴では null を返す。

    - **`isSearchVolumeAndSeoDifficultyEnabled` (required)**

      `boolean` — 月間検索数/SEO難易度の取得が有効かどうか

    - **`keywordCount` (required)**

      `number` — キーワードの件数

    - **`keywordSummary` (required)**

      `string` — キーワードのサマリ（カンマ区切り、先頭20件・255文字以内で切り詰め）

    - **`matchType` (required)**

      `string`, possible values: `"url", "forward_url", "domain", "sub_domain"` — マッチタイプ。url: 完全一致URL / forward\_url: 前方一致URL / domain: ドメイン完全一致 / sub\_domain: サブドメイン含むドメイン一致。

    - **`requestId` (required)**

      `string` — リクエストID

    - **`status` (required)**

      `string`, possible values: `"completed", "processing"` — 全体ステータス。statuses の両方が processed の場合に completed（月間検索数/SEO難易度取得 OFF の場合は serp のみで判定）。

    - **`statuses` (required)**

      `object` — 各処理のステータス情報

      - **`serp` (required)**

        `string`, possible values: `"unprocessed", "processing", "processed"` — SERP取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

      - **`searchVolumeAndSeoDifficulty`**

        `string`, possible values: `"unprocessed", "processing", "processed", "failed", "integration_failed"` — 月間検索数/SEO難易度ステータス。月間検索数/SEO難易度取得 OFF のリクエストでは欠落する。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / failed: 失敗 / integration\_failed: 統合失敗。

    - **`urlCount` (required)**

      `number` — URLの件数

    - **`urlSummary` (required)**

      `string` — URLのサマリ（カンマ区切り、先頭20件・255文字以内で切り詰め）

  - **`query` (required)**

    `object` — リクエストで指定されたクエリパラメータ

    - **`limit` (required)**

      `number` — リクエストで指定された取得件数

    - **`offset` (required)**

      `number` — リクエストで指定された取得開始位置

    - **`status` (required)**

      `object` — リクエストで指定されたステータスフィルタ

  - **`summary` (required)**

    `object` — 件数サマリ

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "limit": 100,
      "offset": 0,
      "status": null
    },
    "summary": {
      "totalCount": 1,
      "returnedCount": 1
    },
    "items": [
      {
        "requestId": "01HQZX5Y4JMQK8XNQ7WVZXZ5Y4",
        "createdAt": "2026-05-31T01:00:00.000Z",
        "completedAt": null,
        "status": "processing",
        "statuses": {
          "serp": "processed",
          "searchVolumeAndSeoDifficulty": "processing"
        },
        "keywordSummary": "ラッコ,カワウソ",
        "urlSummary": "https://rakkokeyword.com,https://rakko.inc",
        "keywordCount": 2,
        "urlCount": 2,
        "matchType": "sub_domain",
        "depth": 30,
        "isSearchVolumeAndSeoDifficultyEnabled": true
      }
    ]
  },
  "errors": []
}
```

### SearchRankStatusResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — ステータス情報

  - **`isCompleted`**

    `boolean` — 全処理完了フラグ。statuses.serp が processed かつ statuses.searchVolumeAndSeoDifficulty が processed またはなし の場合に true。failed または integration\_failed の場合は false。

  - **`statuses`**

    `object` — 各処理のステータス情報

    - **`searchVolumeAndSeoDifficulty`**

      `string`, possible values: `"unprocessed", "processing", "processed", "failed", "integration_failed"` — 月間検索数/SEO難易度ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了 / failed: 失敗 / integration\_failed: 統合失敗。

    - **`serp`**

      `string`, possible values: `"unprocessed", "processing", "processed"` — SERP取得ステータス。unprocessed: 未処理 / processing: 処理中 / processed: 完了。

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "isCompleted": true,
    "statuses": {
      "serp": "processed",
      "searchVolumeAndSeoDifficulty": "processing"
    }
  },
  "errors": []
}
```

### SearchRankResultsDto

- **Type:**`object`

* **`filter`**

  `object` — 結果のフィルタリング条件。キーワード・SEO難易度・月間検索数で絞り込む。

  - **`keyword`**

    `object` — キーワードフィルタ（含む/含まないキーワード指定）

    - **`includes`**

      `array` — 含む単語のリスト

      **Items:**

      `string`

    - **`notIncludes`**

      `array` — 含まない単語のリスト

      **Items:**

      `string`

  - **`searchVolume`**

    `object` — 月間検索数フィルタ（範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

  - **`seoDifficulty`**

    `object` — SEO難易度フィルタ（0〜100の範囲指定）

    - **`max`**

      `integer` — 最大値

    - **`min`**

      `integer` — 最小値

* **`limit`**

  `integer`, default: `100` — 取得件数。1以上の整数を指定する。省略時は 100。

* **`orderBy`**

  `string`, possible values: `"asc", "desc"`, default: `"desc"` — ソート順。asc: 昇順 / desc: 降順。省略時は desc。

* **`sortBy`**

  `string`, possible values: `"keyword", "seoDifficulty", "searchVolume"`, default: `"searchVolume"` — ソート項目。keyword / seoDifficulty / searchVolume。省略時は searchVolume。

* **`withAggregation`**

  `boolean`, default: `false` — ターゲットごとの集計情報（推定流入数）を出力するかどうか。省略時は false。

**Example:**

```json
{
  "filter": {
    "keyword": {
      "includes": [
        "水族館"
      ],
      "notIncludes": [
        "グッズ"
      ]
    },
    "seoDifficulty": {
      "min": 1,
      "max": 100
    },
    "searchVolume": {
      "min": 100,
      "max": 10000
    }
  },
  "sortBy": "searchVolume",
  "orderBy": "desc",
  "limit": 100,
  "withAggregation": false
}
```

### SearchRankResultsResponseDto

- **Type:**`object`

* **`data` (required)**

  `object` — 検索順位チェック結果データ

  - **`items` (required)**

    `array` — 検索順位チェック結果アイテムのリスト

    **Items:**

    - **`keyword` (required)**

      `string` — 検索順位を確認したキーワード

    - **`metrics` (required)**

      `object` — 各種指標（SEO難易度・月間検索数・CPC・広告競合性）

      - **`competition` (required)**

        `object` — 広告競合性。0–100で表し、高いほど競合性が高い（0–33:低 / 34–66:中 / 67–100:高）。無効な場合は null。

      - **`cpc` (required)**

        `object` — 推定クリック単価（USD）。無効な場合は null。

      - **`searchVolume` (required)**

        `object` — 月間検索数（年平均）。無効な場合は null。

      - **`seoDifficulty` (required)**

        `object` — SEO難易度。1–100で表し、高いほど難易度が高い（1–33:低 / 34–66:中 / 67–100:高）。不明な場合は null。

    - **`rankings` (required)**

      `array` — ターゲットごとの検索順位情報

      **Items:**

      - **`estimatedTraffic` (required)**

        `number` — このキーワードでの推定検索流入数

      - **`position` (required)**

        `object` — 検索順位。圏外または未検出の場合は null。

      - **`rankedUrl` (required)**

        `object` — 実際にランクインしたURL。未検出の場合は null。

      - **`target` (required)**

        `string` — 順位チェック対象のURLパターンまたはドメイン

  - **`query` (required)**

    `object` — 検索クエリ情報

    - **`requestId` (required)**

      `string` — 検索順位チェック結果を識別するリクエストID

  - **`summary` (required)**

    `object` — 件数サマリー

    - **`returnedCount` (required)**

      `number` — このレスポンスに含まれている件数

    - **`targets` (required)**

      `array` — ターゲットごとの検索順位分布と推定流入数（フィルター条件にマッチした全件の集計）

      **Items:**

      - **`estimatedTraffic` (required)**

        `number` — 推定検索流入数の合計（withAggregation=false の場合は0）

      - **`rankingPositionDistribution` (required)**

        `object` — フィルター条件にマッチした全件の順位分布

        - **`1-3` (required)**

          `number` — 順位1〜3位のキーワード数

        - **`101+` (required)**

          `number` — 順位101位以上のキーワード数

        - **`11-20` (required)**

          `number` — 順位11〜20位のキーワード数

        - **`21-30` (required)**

          `number` — 順位21〜30位のキーワード数

        - **`31-50` (required)**

          `number` — 順位31〜50位のキーワード数

        - **`4-10` (required)**

          `number` — 順位4〜10位のキーワード数

        - **`51-100` (required)**

          `number` — 順位51〜100位のキーワード数

      - **`target` (required)**

        `string` — 順位チェック対象のURLパターンまたはドメイン

    - **`totalCount` (required)**

      `number` — 取得対象全体の件数

* **`errors` (required)**

  `array` — エラーメッセージの配列。正常時は空配列。

  **Items:**

  `string`

* **`meta` (required)**

  `object` — リクエストに関するメタ情報（課金・消費リソースなど）

  - **`consumedCredit` (required)**

    `number` — このリクエストで消費されたクレジット数。

* **`result` (required)**

  `boolean` — API 呼び出しの成否。正常時は true、エラー時は false。

**Example:**

```json
{
  "result": true,
  "meta": {
    "consumedCredit": 0
  },
  "data": {
    "query": {
      "requestId": "sr_20260309_001"
    },
    "summary": {
      "totalCount": 2,
      "returnedCount": 2,
      "targets": [
        {
          "target": "*.rakkoma.com/*",
          "estimatedTraffic": 7391,
          "rankingPositionDistribution": {
            "1-3": 40,
            "4-10": 15,
            "11-20": 5,
            "21-30": 4,
            "31-50": 5,
            "51-100": 3,
            "101+": 10
          }
        }
      ]
    },
    "items": [
      {
        "keyword": "サイト売買 個人",
        "metrics": {
          "seoDifficulty": 23,
          "searchVolume": 70,
          "cpc": 3.47,
          "competition": 41
        },
        "rankings": [
          {
            "target": "*.rakkoma.com/*",
            "position": 3,
            "rankedUrl": "https://rakkoma.com/",
            "estimatedTraffic": 9
          }
        ]
      }
    ]
  },
  "errors": []
}
```
