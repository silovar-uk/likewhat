# 性能ベースライン(2026-08-17)

再設計の実装前に記録した基準値。以降のPhaseはこの数値からの劣化がないことを検証する。

計測環境: `python3 -m http.server`(gzip非圧縮配信)。gzipサイズは
`gzip -c | wc -c` で別途算出した参考値。実運用のGitHub Pagesはgzip配信のため、
実際の転送量はここでの「gzip換算」列に近い。

## ビルド出力(`node scripts/build-pattern-data.mjs` より)

| 項目 | 値 | 予算(PERFORMANCE.md) | 判定 |
|---|---:|---:|---|
| Pattern件数 | 187 | — | — |
| Brand/Artist/Institution manifest | 130 | — | — |
| Core catalog | 201.2 KB raw / 46.6 KB gzip | < 100 KB gzip | ✅ 余裕あり |
| Search index | 270.8 KB raw / 81.1 KB gzip | 遅延読み込み(検索起動まで0) | ✅ |
| Legacy catalog | 466.4 KB raw / 116.3 KB gzip | — | — |
| Wave 3 history | 63 → 78件 | 63 → 78(CI固定) | ✅ |

## 画面別 DOM ノード数

| 画面 | 初期DOM数 | 予算 | 判定 |
|---|---:|---:|---|
| Home(`index.html`、初期表示) | 306 | ≤ 1,000 | ✅ |
| Pattern Detail(`pattern.html?id=apple-ios-settings`、読み込み完了後) | **1,030** | ≤ 1,000 | ⚠️ **既存で超過(30ノード)** |

**所見:** Pattern Detailは13セクション構成(現行)のため、既に予算をわずかに超えている。
本書のPhase 7(§9-2, 7章への再構成)で関係セクション5つを2箇所へ統合する際、
このノード数削減が副次効果として見込める。Phase 7完了時に再計測し、
予算内に収まることをAcceptance Criteriaへ追加すること。

## 個別アセットの転送量(参考)

| ファイル | raw | gzip換算 |
|---|---:|---:|
| `styles.css` | 18,404 B | 4,847 B |
| `generated/catalog-core.json` | 206,068 B | 47,655 B |
| `generated/patterns/apple-ios-settings.json` | 2,306 B | 1,172 B |

## 既存CI検証(ベースライン時点で全て合格)

```
check-micro-details.mjs : MICRO DETAILS schema v1 verified: 0 traced patterns / 0 stored items
check-sources.mjs       : Checked 187 reference URLs; 2 need review (404/503、既存の外部リンク切れ、本書の対象外)
check-ui-foundation.mjs : UI foundation verified across 7 pages.
```
