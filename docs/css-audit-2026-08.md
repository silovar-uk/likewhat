# CSS競合の実測レポート

生成日: 2026-08-17
対象ファイル数: 41

## ファイル別サマリー

| ファイル | サイズ(bytes) | セレクタ数 | !important数 |
|---|---:|---:|---:|
| styles-home.css | 12179 | 127 | 181 |
| styles-learning.css | 13435 | 124 | 45 |
| styles-workbench.css | 16458 | 180 | 25 |
| styles-shell-v2.css | 17022 | 143 | 19 |
| styles-preview-contract.css | 6552 | 87 | 17 |
| styles-ui-polish.css | 16366 | 391 | 9 |
| styles-discovery-v2.css | 4593 | 53 | 8 |
| styles-pattern-opposite-fix.css | 3212 | 29 | 7 |
| styles-qa.css | 4234 | 89 | 7 |
| styles-group-preview.css | 593 | 9 | 6 |
| styles-coverage.css | 9329 | 134 | 2 |
| styles-enhancements.css | 6996 | 93 | 2 |
| styles-brand-idol.css | 2565 | 29 | 0 |
| styles-brand-links.css | 2958 | 28 | 0 |
| styles-brand-page.css | 5229 | 72 | 0 |
| styles-cluster-detail.css | 3077 | 38 | 0 |
| styles-compare.css | 8945 | 128 | 0 |
| styles-coverage-delta.css | 7070 | 104 | 0 |
| styles-design-space.css | 11913 | 152 | 0 |
| styles-extra.css | 5778 | 87 | 0 |
| styles-eyewear.css | 6030 | 89 | 0 |
| styles-group-official.css | 597 | 7 | 0 |
| styles-idols.css | 12719 | 149 | 0 |
| styles-idols2.css | 8002 | 108 | 0 |
| styles-library-grid.css | 4605 | 41 | 0 |
| styles-library-v5.css | 9172 | 125 | 0 |
| styles-map.css | 7006 | 101 | 0 |
| styles-micro-details.css | 2680 | 28 | 0 |
| styles-pattern-compare.css | 3475 | 38 | 0 |
| styles-pattern-idol.css | 1863 | 21 | 0 |
| styles-pattern-v5.css | 3971 | 54 | 0 |
| styles-rail-light.css | 2831 | 19 | 0 |
| styles-top-performance.css | 1249 | 10 | 0 |
| styles-vocabulary.css | 7895 | 94 | 0 |
| styles-wave1.css | 9428 | 130 | 0 |
| styles-wave2.css | 10139 | 154 | 0 |
| styles-wave3.css | 22210 | 303 | 0 |
| styles-wave4.css | 8698 | 127 | 0 |
| styles-wave5.css | 16017 | 220 | 0 |
| styles-wave6.css | 7142 | 106 | 0 |
| styles.css | 18404 | 272 | 0 |

## 複数ファイルにまたがるセレクタ(重複候補: 386件)

同じセレクタ文字列が複数のCSSファイルで定義されている箇所。
後続で読み込まれるファイルが優先されるため、読み込み順に依存した上書きが発生している可能性がある。

| セレクタ | 出現ファイル(読み込み順とは無関係、アルファベット順) | !important使用 |
|---|---|---|
| `.random-draw-button` | styles-enhancements.css, styles-home.css, styles-learning.css, styles-qa.css, styles-ui-polish.css, styles-workbench.css | あり |
| `.library-group-card` | styles-group-official.css, styles-learning.css, styles-library-grid.css, styles-shell-v2.css, styles-top-performance.css | - |
| `.randomizer` | styles-enhancements.css, styles-home.css, styles-learning.css, styles-shell-v2.css, styles-workbench.css | あり |
| `.random-modes button` | styles-enhancements.css, styles-home.css, styles-learning.css, styles-qa.css, styles-ui-polish.css | あり |
| `button` | styles-learning.css, styles-qa.css, styles-ui-polish.css, styles.css | - |
| `input` | styles-learning.css, styles-qa.css, styles-ui-polish.css, styles.css | - |
| `select` | styles-learning.css, styles-qa.css, styles-ui-polish.css | - |
| `.composer` | styles-learning.css, styles-library-v5.css, styles-shell-v2.css, styles-workbench.css, styles.css | あり |
| `.composer-controls button` | styles-learning.css, styles-library-v5.css, styles-ui-polish.css, styles-workbench.css | あり |
| `#patternGroups.pattern-groups` | styles-library-grid.css, styles-shell-v2.css | - |
| `.brand-pattern-card` | styles-brand-page.css, styles-shell-v2.css, styles-ui-polish.css | - |
| `.curated-pairs` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-preview` | styles-compare.css, styles-preview-contract.css | - |
| `.delta-metrics` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.opposite-reference-card` | styles-design-space.css, styles-pattern-opposite-fix.css | あり |
| `.random-modes strong` | styles-enhancements.css, styles-home.css, styles-ui-polish.css | あり |
| `.random-draw-button:hover` | styles-enhancements.css, styles-home.css, styles-learning.css, styles-qa.css, styles-workbench.css | あり |
| `.random-analysis` | styles-enhancements.css, styles-home.css, styles-qa.css | あり |
| `.source-link` | styles-enhancements.css, styles-qa.css, styles-ui-polish.css, styles.css | あり |
| `.explore-tool` | styles-home.css, styles-learning.css, styles-ui-polish.css | - |
| `.explore-tool-copy span` | styles-home.css, styles-learning.css, styles-ui-polish.css | - |
| `:root` | styles-learning.css, styles-qa.css, styles-shell-v2.css, styles-ui-polish.css, styles-workbench.css, styles.css | - |
| `.lw-home .hero` | styles-learning.css, styles-shell-v2.css, styles-workbench.css | あり |
| `.lw-home .hero h1` | styles-learning.css, styles-shell-v2.css, styles-workbench.css | あり |
| `.site-header nav a` | styles-map.css, styles-qa.css, styles-shell-v2.css, styles-ui-polish.css | あり |
| `.reference-source-card` | styles-brand-links.css, styles-ui-polish.css | - |
| `.gap-compression-grid` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.coverage-stats` | styles-coverage.css, styles-ui-polish.css | - |
| `.spatial-gap-grid` | styles-coverage.css, styles-ui-polish.css | - |
| `.wave3-grid` | styles-coverage.css, styles-ui-polish.css | - |
| `.opposite-switch` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.opposite-axis-row` | styles-design-space.css, styles-ui-polish.css | - |
| `.next-reference-preview` | styles-discovery-v2.css, styles-preview-contract.css | - |
| `.randomizer-copy h2` | styles-enhancements.css, styles-home.css | あり |
| `.random-modes button.active` | styles-enhancements.css, styles-home.css, styles-learning.css, styles-ui-polish.css, styles-workbench.css | あり |
| `.random-modes span` | styles-enhancements.css, styles-home.css, styles-ui-polish.css | あり |
| `.random-grid` | styles-enhancements.css, styles-home.css | あり |
| `.prompt-block pre` | styles-enhancements.css, styles-ui-polish.css, styles.css | - |
| `.randomizer:before` | styles-home.css, styles-learning.css, styles-workbench.css | あり |
| `.site-header.site-header nav` | styles-learning.css, styles-shell-v2.css | - |
| `.lw-home .hero-copy` | styles-learning.css, styles-shell-v2.css, styles-workbench.css | あり |
| `.composer-copy-button` | styles-learning.css, styles-library-v5.css, styles-ui-polish.css, styles-workbench.css | あり |
| `.active-filter` | styles-learning.css, styles-library-v5.css, styles-shell-v2.css, styles-ui-polish.css | あり |
| `footer` | styles-learning.css, styles-qa.css, styles-shell-v2.css, styles.css | - |
| `.library-group-main` | styles-library-grid.css, styles-shell-v2.css, styles-ui-polish.css | - |
| `.map-control-button` | styles-map.css, styles-qa.css, styles-ui-polish.css | - |
| `.site-header nav` | styles-map.css, styles-qa.css, styles.css | - |
| `.detail-preview` | styles-preview-contract.css, styles.css | - |
| `.site-header` | styles-qa.css, styles.css | - |
| `.term-card` | styles-qa.css, styles-shell-v2.css, styles-ui-polish.css, styles-vocabulary.css | - |
| `.hero h1` | styles-qa.css, styles-ui-polish.css, styles.css | あり |
| `.reference-source-stack` | styles-brand-links.css, styles-ui-polish.css | - |
| `.reference-source-card small` | styles-brand-links.css, styles-ui-polish.css | あり |
| `.reference-source-card strong` | styles-brand-links.css, styles-ui-polish.css | あり |
| `.reference-source-card span` | styles-brand-links.css, styles-ui-polish.css | あり |
| `.curated-pairs button` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-score span` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-score small` | styles-compare.css, styles-ui-polish.css | - |
| `.impact-main strong` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.opposite-reference-pair` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.opposite-reference-preview` | styles-design-space.css, styles-pattern-opposite-fix.css, styles-preview-contract.css | あり |
| `.opposite-reference-copy` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.opposite-reference-copy p` | styles-design-space.css, styles-pattern-opposite-fix.css, styles-ui-polish.css | - |
| `.opposite-switch span` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.opposite-axis-header` | styles-design-space.css, styles-ui-polish.css | - |
| `.next-reference-actions a` | styles-discovery-v2.css, styles-ui-polish.css | あり |
| `.secondary-filter-row` | styles-discovery-v2.css, styles-qa.css, styles.css | - |
| `.random-modes` | styles-enhancements.css, styles-home.css | あり |
| `.random-results` | styles-enhancements.css, styles-home.css | あり |
| `.random-analysis-copy h3` | styles-enhancements.css, styles-home.css | あり |
| `.collision-brief pre` | styles-enhancements.css, styles-qa.css, styles-ui-polish.css | - |
| `.collision-brief button` | styles-enhancements.css, styles-ui-polish.css | あり |
| `.explore-tool-copy small` | styles-home.css, styles-learning.css, styles-ui-polish.css | - |
| `.explore-tool-copy strong` | styles-home.css, styles-learning.css | - |
| `:where(a` | styles-learning.css, styles-qa.css, styles-ui-polish.css | - |
| `summary` | styles-learning.css, styles-qa.css, styles-ui-polish.css | - |
| `.site-header.site-header` | styles-learning.css, styles-shell-v2.css | - |
| `.site-header .lw-rail-footer` | styles-learning.css, styles-shell-v2.css | - |
| `.query-examples button` | styles-learning.css, styles-qa.css, styles-ui-polish.css, styles.css | - |
| `.lw-library-toolbar` | styles-learning.css, styles-shell-v2.css | - |
| `.composer-copy h2` | styles-library-v5.css, styles-ui-polish.css | - |
| `.map-hero h1` | styles-map.css, styles-qa.css, styles-ui-polish.css | あり |
| `.map-stage-shell` | styles-map.css, styles-ui-polish.css | - |
| `.map-inspector-preview` | styles-map.css, styles-preview-contract.css | - |
| `.card-preview` | styles-preview-contract.css, styles-qa.css, styles.css | - |
| `.term-search-link` | styles-qa.css, styles-ui-polish.css, styles-vocabulary.css | - |
| `.term-inspector` | styles-qa.css, styles-vocabulary.css | - |
| `.browser` | styles-qa.css, styles-shell-v2.css, styles.css | - |
| `.browser-head` | styles-qa.css, styles-shell-v2.css, styles.css | - |
| `.vocab-hero h1` | styles-qa.css, styles-ui-polish.css, styles-vocabulary.css | あり |
| `.detail-title-row` | styles-brand-links.css, styles.css | - |
| `.brand-page` | styles-brand-page.css, styles-shell-v2.css | - |
| `.brand-official small` | styles-brand-page.css, styles-ui-polish.css | - |
| `.brand-official span` | styles-brand-page.css, styles-ui-polish.css | - |
| `.brand-summary-strip small` | styles-brand-page.css, styles-ui-polish.css | - |
| `.brand-range-row span` | styles-brand-page.css, styles-ui-polish.css | - |
| `.brand-pattern-preview` | styles-brand-page.css, styles-group-preview.css | - |
| `.brand-pattern-copy em` | styles-brand-page.css, styles-ui-polish.css | - |
| `.cluster-member-count span` | styles-cluster-detail.css, styles-ui-polish.css | - |
| `.cluster-member-index` | styles-cluster-detail.css, styles-ui-polish.css | - |
| `.cluster-member-body p` | styles-cluster-detail.css, styles-ui-polish.css | - |
| `.cluster-reading p` | styles-cluster-detail.css, styles-ui-polish.css | - |
| `.compare-page` | styles-compare.css, styles-shell-v2.css | - |
| `.compare-hero h1` | styles-compare.css, styles-ui-polish.css | あり |
| `.curated-pairs strong` | styles-compare.css, styles-ui-polish.css | - |
| `.curated-pairs small` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-context small` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-context b` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-metrics span` | styles-compare.css, styles-ui-polish.css | - |
| `.axis-compare-values` | styles-compare.css, styles-ui-polish.css | - |
| `.axis-compare-poles` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-brief pre` | styles-compare.css, styles-ui-polish.css | - |
| `.compare-brief button` | styles-compare.css, styles-ui-polish.css | - |
| `.delta-count small` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.delta-count span` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.gap-compression-head small` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.gap-compression-head strong` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.compression-bars span` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.compression-bars b` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-main small` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-main p` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-nearest small` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-nearest a` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-nearest p` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-distance small` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.impact-badges b` | styles-coverage-delta.css, styles-ui-polish.css | - |
| `.coverage-page` | styles-coverage.css, styles-shell-v2.css | - |
| `.coverage-hero h1` | styles-coverage.css, styles-ui-polish.css | あり |
| `.coverage-stats article` | styles-coverage.css, styles-ui-polish.css | あり |
| `.coverage-stats small` | styles-coverage.css, styles-ui-polish.css | - |
| `.coverage-stats span` | styles-coverage.css, styles-ui-polish.css | - |
| `.gap-axis span` | styles-coverage.css, styles-ui-polish.css | - |
| `.gap-axis b` | styles-coverage.css, styles-ui-polish.css | - |
| `.spatial-nearest a strong` | styles-coverage.css, styles-ui-polish.css | - |
| `.spatial-nearest a span` | styles-coverage.css, styles-ui-polish.css | - |
| `.thin-term small` | styles-coverage.css, styles-ui-polish.css | - |
| `.thin-term strong` | styles-coverage.css, styles-ui-polish.css | - |
| `.context-row strong` | styles-coverage.css, styles-ui-polish.css | - |
| `.context-row span` | styles-coverage.css, styles-ui-polish.css | - |
| `.wave3-score span` | styles-coverage.css, styles-ui-polish.css | - |
| `.wave3-score small` | styles-coverage.css, styles-ui-polish.css | - |
| `.wave3-components small` | styles-coverage.css, styles-ui-polish.css | - |
| `.wave3-card pre` | styles-coverage.css, styles-ui-polish.css | - |
| `.coverage-method summary` | styles-coverage.css, styles-ui-polish.css | - |
| `.space-radar-labels text` | styles-design-space.css, styles-ui-polish.css | - |
| `.space-axis-head span` | styles-design-space.css, styles-ui-polish.css | - |
| `.space-summary` | styles-design-space.css, styles-ui-polish.css | - |
| `.diversity-score small` | styles-design-space.css, styles-ui-polish.css | - |
| `.distance-reference-preview` | styles-design-space.css, styles-preview-contract.css | - |
| `.opposite-fit small` | styles-design-space.css, styles-ui-polish.css | - |
| `.opposite-reference-card:not(.current)` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.opposite-reference-copy small` | styles-design-space.css, styles-pattern-opposite-fix.css, styles-ui-polish.css | - |
| `.opposite-reference-copy strong` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.opposite-reference-copy span` | styles-design-space.css, styles-pattern-opposite-fix.css, styles-ui-polish.css | - |
| `.opposite-switch small` | styles-design-space.css, styles-pattern-opposite-fix.css, styles-ui-polish.css | - |
| `.opposite-flip-list` | styles-design-space.css, styles-pattern-opposite-fix.css | - |
| `.library-sort label` | styles-discovery-v2.css, styles-ui-polish.css | - |
| `.library-sort select` | styles-discovery-v2.css, styles-ui-polish.css | - |
| `.next-reference-head small` | styles-discovery-v2.css, styles-ui-polish.css | あり |
| `.next-reference-head strong` | styles-discovery-v2.css, styles-ui-polish.css | あり |
| `.randomizer-copy>p:last-of-type` | styles-enhancements.css, styles-home.css | あり |
| `.random-modes button:hover` | styles-enhancements.css, styles-home.css, styles-qa.css | あり |
| `.random-metrics span` | styles-enhancements.css, styles-ui-polish.css | - |
| `.random-metrics small` | styles-enhancements.css, styles-ui-polish.css | - |
| `.collision-brief` | styles-enhancements.css, styles-home.css, styles-qa.css | あり |
| `.collision-brief summary` | styles-enhancements.css, styles-home.css, styles-ui-polish.css | あり |
| `.collision-brief>div` | styles-enhancements.css, styles-home.css | あり |
| `.lexicon-column` | styles-enhancements.css, styles-qa.css | - |
| `.random-grid .pattern-card:last-child` | styles-enhancements.css, styles-home.css | あり |
| `.group-official-link` | styles-group-official.css, styles-ui-polish.css | - |
| `.group-preview-single` | styles-group-preview.css, styles-library-grid.css | - |
| `.group-preview-tile>div` | styles-group-preview.css, styles-library-grid.css | - |
| `.random-draw-button:before` | styles-home.css, styles-learning.css | あり |
| `.random-draw-button:after` | styles-home.css, styles-learning.css | あり |
| `body` | styles-learning.css, styles-ui-polish.css, styles.css | - |
| `.site-header .brandmark` | styles-learning.css, styles-shell-v2.css | - |
| `.site-header .lw-brand-kicker` | styles-learning.css, styles-shell-v2.css | - |
| `.site-header.site-header nav a[aria-current='page']` | styles-learning.css, styles-shell-v2.css | - |
| `.lw-home .site-header.site-header nav a:first-child` | styles-learning.css, styles-shell-v2.css | - |
| `.site-header.site-header nav a.lw-external` | styles-learning.css, styles-shell-v2.css | - |
| `.lw-menu-button` | styles-learning.css, styles-shell-v2.css | あり |
| `.lw-home .hero::before` | styles-learning.css, styles-shell-v2.css | - |
| `.lw-home .search-shell` | styles-learning.css, styles-shell-v2.css | - |
| `.explore-tool:nth-child(1)` | styles-learning.css, styles-workbench.css | あり |
| `.explore-tool:nth-child(2)` | styles-learning.css, styles-workbench.css | あり |
| `.explore-tool:nth-child(3)` | styles-learning.css, styles-workbench.css | あり |
| `.explore-tool:nth-child(1):hover` | styles-learning.css, styles-workbench.css | あり |
| `.explore-tool:nth-child(2):hover` | styles-learning.css, styles-workbench.css | あり |
| `.explore-tool:nth-child(3):hover` | styles-learning.css, styles-workbench.css | あり |
| `.randomizer .eyebrow` | styles-learning.css, styles-workbench.css | あり |
| `.lw-library-search` | styles-learning.css, styles-shell-v2.css | - |
| `.lw-filter-button` | styles-learning.css, styles-shell-v2.css | あり |
| `.lw-filter-button .lw-filter-count` | styles-learning.css, styles-shell-v2.css | - |
| `.library-group-preview` | styles-library-grid.css, styles-shell-v2.css | - |
| `.group-pattern-list` | styles-library-grid.css, styles-shell-v2.css | - |
| `.composer-brief small` | styles-library-v5.css, styles-ui-polish.css | - |
| `.composer-brief strong` | styles-library-v5.css, styles-ui-polish.css | - |
| `.map-page` | styles-map.css, styles-shell-v2.css | - |
| `.map-presets button` | styles-map.css, styles-qa.css, styles-ui-polish.css | - |
| `.map-tooltip strong` | styles-map.css, styles-ui-polish.css | - |

(上位200件のみ表示。全386件)

## !important の総数

全体: 328件

| ファイル | !important数 |
|---|---:|
| styles-home.css | 181 |
| styles-learning.css | 45 |
| styles-workbench.css | 25 |
| styles-shell-v2.css | 19 |
| styles-preview-contract.css | 17 |
| styles-ui-polish.css | 9 |
| styles-discovery-v2.css | 8 |
| styles-pattern-opposite-fix.css | 7 |
| styles-qa.css | 7 |
| styles-group-preview.css | 6 |
| styles-coverage.css | 2 |
| styles-enhancements.css | 2 |
