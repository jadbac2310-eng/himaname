#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ラッコキーワードAPIで「低競合×そこそこ検索される」ロングテールを発掘する。
suggest-keywords の filter 機能を使い、1シード1コールで
  - 月間検索ボリューム VOL_MIN〜VOL_MAX
  - メトリクス（searchVolume / seoDifficulty / competition / cpc）付き
を直接取得する（重い一括調査フロー不要・低コスト）。

APIキーは環境変数 RAKKO_API_KEY から読む。
"""
import os, sys, json, time, csv, urllib.request, urllib.error

API = "https://api.rakkokeyword.com"
KEY = os.environ.get("RAKKO_API_KEY")
if not KEY:
    sys.exit("ERROR: 環境変数 RAKKO_API_KEY が未設定です。")

# ── 調査対象のシード語（編集して使う）─────────────────────────────
SEEDS = [
    # A. ネーミング属性網羅（[属性]+名前+かっこいい で無限量産）
    "動物 名前 かっこいい", "神話 名前 かっこいい", "色 名前 かっこいい",
    "花 名前 かっこいい", "星座 名前 かっこいい", "鳥 名前 かっこいい",
    "剣 名前 かっこいい", "魔法 名前 かっこいい", "国 名前 かっこいい",
    "ラテン語 かっこいい", "英語 かっこいい 単語", "二字熟語 かっこいい",
    "四字熟語 かっこいい", "漢字 一文字 かっこいい", "数字 名前 かっこいい",
    # B. ゲーマー直結ネーミング（バナー適合 最大）
    "ギルド名 かっこいい", "チーム名 かっこいい", "クラン名 かっこいい",
    "パーティー名 かっこいい", "キャラ名 かっこいい", "ユーザーネーム おしゃれ",
    "サーバー名 おしゃれ", "id かっこいい",
    # C. 心理テスト/診断/脳トレ（暇つぶし層）
    "心理テスト 当たる", "心理テスト 恋愛", "心理テスト 面白い",
    "心理テスト 性格", "性格診断", "深層心理 テスト",
    "脳トレ 問題", "脳トレ クイズ",
]
OUT_TAG = "expansion"  # 出力ファイル名のサフィックス
VOL_MIN, VOL_MAX = 10, 500     # 狙う月間検索ボリューム帯
DIFF_MAX_FILTER  = None        # APIで難易度上限を絞るなら数値(例45)。None=絞らず全難易度取得して後でランク
INCREASE = True                # キーワード増量(クレジット増)。Trueで網羅性UP
# ─────────────────────────────────────────────────────────────

total_credit = 0

def post(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
        headers={"X-API-Key": KEY, "Content-Type": "application/json"}, method="POST")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            msg = e.read().decode()
            if e.code == 429:
                print(f"  rate limited, wait 20s", flush=True); time.sleep(20); continue
            if e.code == 402:
                sys.exit(f"ERROR 402 クレジット不足: {msg}")
            print(f"  HTTP {e.code}: {msg[:300]}", flush=True)
            return None
        except Exception as ex:
            print(f"  retry({attempt}): {ex}", flush=True); time.sleep(5)
    return None

def fetch_seed(seed):
    global total_credit
    body = {
        "keyword": seed,
        "modes": ["google"],
        "increaseKeyword": INCREASE,
        "sortBy": "searchVolume", "orderBy": "desc",
        "filter": {"searchVolume": {"min": VOL_MIN, "max": VOL_MAX}},
    }
    if DIFF_MAX_FILTER:
        body["filter"]["seoDifficulty"] = {"min": 1, "max": DIFF_MAX_FILTER}
    r = post("/v1/suggest-keywords", body)
    if not r or not r.get("result"):
        print(f"[seed] {seed}: 取得失敗 {json.dumps(r, ensure_ascii=False)[:200] if r else ''}", flush=True)
        return []
    cred = (r.get("meta") or {}).get("consumedCredit", 0)
    total_credit += cred
    items = (r.get("data") or {}).get("items", [])
    summ = (r.get("data") or {}).get("summary", {})
    print(f"[seed] {seed}: {len(items)}件取得 (全体{summ.get('totalCount','?')}) credit={cred}", flush=True)
    rows = []
    for it in items:
        m = it.get("metrics") or {}
        rows.append({
            "keyword": it.get("keyword"),
            "volume": m.get("searchVolume"),
            "difficulty": m.get("seoDifficulty"),
            "competition": m.get("competition"),
            "cpc": m.get("cpc"),
            "suggestClass": it.get("suggestClass"),
            "seed": seed,
        })
    return rows

def main():
    all_rows, seen = [], set()
    for s in SEEDS:
        for row in fetch_seed(s):
            kw = row["keyword"]
            if kw and kw not in seen:
                seen.add(kw); all_rows.append(row)
        time.sleep(1.2)  # レート制限(60req/60s)に余裕

    # 難易度昇順→ボリューム降順（=勝ちやすく、かつ読まれる順）
    def sortkey(r):
        d = r["difficulty"] if isinstance(r["difficulty"], (int, float)) else 999
        v = r["volume"] if isinstance(r["volume"], (int, float)) else 0
        return (d, -v)
    all_rows.sort(key=sortkey)

    out = f"rakko_picked_{OUT_TAG}.csv"
    with open(out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["keyword", "volume", "seo_difficulty", "competition", "cpc", "suggestClass", "seed", "status"])
        for r in all_rows:
            w.writerow([r["keyword"], r["volume"], r["difficulty"], r["competition"],
                        r["cpc"], r["suggestClass"], r["seed"], "todo"])

    # 集計サマリーもJSONで残す
    summary = {
        "total_keywords": len(all_rows),
        "consumed_credit": total_credit,
        "vol_band": [VOL_MIN, VOL_MAX],
        "by_difficulty": {
            "low(1-33)":  sum(1 for r in all_rows if isinstance(r["difficulty"],(int,float)) and r["difficulty"]<=33),
            "mid(34-66)": sum(1 for r in all_rows if isinstance(r["difficulty"],(int,float)) and 34<=r["difficulty"]<=66),
            "high(67+)":  sum(1 for r in all_rows if isinstance(r["difficulty"],(int,float)) and r["difficulty"]>=67),
            "unknown":    sum(1 for r in all_rows if not isinstance(r["difficulty"],(int,float))),
        },
        "top50": all_rows[:50],
    }
    with open(f"rakko_summary_{OUT_TAG}.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 計 {len(all_rows)} 件 / 消費クレジット {total_credit}", flush=True)
    print(f"   難易度分布: {summary['by_difficulty']}", flush=True)
    print(f"   → {out} / rakko_summary.json に出力", flush=True)

if __name__ == "__main__":
    main()
