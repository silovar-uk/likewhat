# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚文法・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**Brand is the entrance; design principles are the exit.**

## What it does

- 63の実在ブランド / サービス参照を3列の連続グリッドで閲覧
- Brand / Pattern Type / キーワードで即時フィルタリング
- Brand order / Density / Exploration / Diversity / Randomでソート
- 検索・フィルター・ソート・Random seedをURLへ保存し、詳細から戻っても探索状態を維持
- 各ブランド名から公式サイト / 公式参照へ移動
- 各Pattern詳細で **Official Brand** と **Reference Source** を分離して表示
- 6軸の **Design Space** でパターンの位置を比較
- **Diversity Score** でライブラリ内の希少性を測定
- **Nearest / Farthest / Opposite Reference** を計算
- **NEXT REFERENCES** で「近い座標 / 同じ原則・別文脈 / 反対の優先順位」の3方向へ探索
- **Design Map** で任意の2軸を選んで63参照を地図化
- **Design Vocabulary** で専門語から別ブランド・別業界へ横断
- **Contrast Pair** で2参照のDesign Space・語彙・適合文脈を比較
- **Random / Far Apart / Weird Combination** で3参照を意図的に衝突
- 3参照を統合するためのAI briefを生成
- Game UI / OS / Physical Space / Public Service / Old Webまで同じ設計空間に配置

## Library

**63 patterns**

- Initial library: 39 patterns
- Wave 1: 12 deliberately distant Design Space extremes
- Wave 2: 12 contrast references that turn isolated extremes into comparable design regions

Wave 1 anchors include GOV.UK, ドン・キホーテ, LEGO, CELINE, Persona 5, Windows 95, Google Maps, Bloomberg Terminal, ほぼ日, Wikipedia, IKEA, チケットぴあ。

Wave 2 adds NHS, ヨドバシ.com, Pokémon Center, Aesop, Splatoon 3, macOS Mission Control, Apple Maps, Grafana, BRUTUS, MDN, 無印良品, e+ as nearby-but-different counterpoints.

## Taxonomy schema v2

`taxonomy.js` enriches patterns with:

- `domain`
- `medium`
- `archetype`
- `interactionModel`
- `philosophy`
- `designSpace`
- `implementationTerms`
- `designTerms`
- `philosophyTerms`
- `opposites`
- `related`

The reference layer additionally derives `brandUrl` separately from each pattern's exact `sourceUrl` so the UI can distinguish **brand destination** from **evidence / reference source**.

## Design Space

Every pattern is represented by six editorial 0–100 axes. These are comparative heuristic coordinates, not quality scores.

- Density: Sparse ↔ Dense
- Emotional Intensity: Calm ↔ Excitable
- Goal Orientation: Efficiency ↔ Exploration
- Authority: Personal ↔ Institutional
- Interaction: Observation ↔ Direct Manipulation
- Order: Chaotic ↔ Systematic

`design-space.js` provides normalized pairwise distance, nearest / farthest reference, Diversity Score, opposite-vector calculation, axis-difference breakdown and explainable labels.

## Discovery Architecture v2

### Continuous library grid

Brand sections remain in the data structure but no longer break visual rows. Cards flow continuously in three columns on desktop, two on medium screens and one on mobile. Brand order remains the default.

### Explainable sorting

The library supports:

- **Brand order** — source order / editorial default
- **Density** — Dense → Sparse
- **Exploration** — Exploration → Efficiency
- **Diversity** — Frontier → Clustered
- **Random** — stable seeded order

Random sorting stores a seed in the URL so navigation away and back does not silently reshuffle the library. A reroll control generates a new seed intentionally.

### URL state

The following exploration state is written to the query string:

- `q`
- `brand`
- `part`
- `sort`
- `seed` when Random is active

This means browser Back returns to the same filtered / sorted library state rather than resetting the exploration context.

### NEXT REFERENCES

Pattern detail pages replace the old generic Related Patterns / Compare routes with three explainable lanes:

1. **Similar Position** — nearest pattern in six-dimensional Design Space
2. **Shared Principle / Different Context** — a curated pair when available, otherwise a different-brand reference with strong Vocabulary overlap
3. **Opposite Priorities** — the reference closest to the inverted Design Space priorities

Each lane shows why it was selected using distance, shared concepts, or flipped axes, and offers both `Open pattern` and `Compare` actions.

## Traceable Reference Layer

A Pattern now has two distinct destinations in the interface:

- **Official Brand** — a brand-level official destination, derived from the shallowest / most brand-oriented official source available in the current dataset
- **Reference Source** — the exact official page used to ground the specific Pattern

Brand labels in the main library also open the brand reference in a new tab while the rest of the card continues to open the internal Pattern analysis.

This keeps the library auditable without turning every card into a list of URLs.

## Design Distance / Diversity Score

Pairwise distance uses normalized Euclidean distance across all six axes.

`distance = sqrt(sum(axisDiff²)) / theoreticalMaxDistance × 100`

For each pattern:

- **Local Separation** = distance to its nearest neighbor
- **Diversity Score** = percentile rank of Local Separation in the current library
- **Nearest** = closest pattern in Design Space
- **Farthest** = geometrically farthest current reference

High Diversity means the current library has fewer nearby examples. It does not mean the design is better or more original.

## Opposite Reference

`Farthest` and `Opposite` are deliberately different.

- Farthest: most distant from the current coordinate
- Opposite: closest to the ideal vector produced by `100 - currentAxis` on every axis

Small contextual penalties discourage same-brand / same-domain results when a similarly good cross-context opposite exists. Curated opposites can override the computed candidate.

## Design Map

`map.html` is an explainable 2D projection of the six-dimensional space. The user selects X and Y axes rather than relying on opaque PCA / t-SNE reduction.

Features include selectable axes, presets, Domain filtering, Frontier indication, inspector previews and sparse Open Space markers.

## Design Vocabulary

`vocabulary.html` treats specialist terms as first-class knowledge nodes rather than tags attached to brands.

Five categories:

1. Implementation
2. Interaction Design
3. Visual Design
4. Information Architecture
5. Cognitive / Philosophy

Relationships are derived from co-occurrence across current patterns. The intended traversal is:

`Pattern → Vocabulary → different-world Pattern`

## Contrast Pair

`compare.html` compares any two references across:

- Design Distance
- six-axis deltas
- shared / unique Vocabulary
- context and use-case differences
- automatically generated comparison brief

Wave 2 curated pairs provide the default examples, but all 63 patterns are selectable.

## Collision Engine

Three draw modes:

- **Random** — ordinary serendipity across different brands
- **Far Apart** — maximin selection in six-dimensional Design Space
- **Weird Combination** — Design Distance plus Domain / Medium / Archetype / Philosophy incompatibility

Each draw contains exactly three references and an AI brief that assigns different design responsibilities instead of averaging visual styles.

## Preview Contract

All miniature UI samples are treated as illustrations, not functional embedded interfaces.

`ui-preview-contract.js`:

- neutralizes interactive elements inside mocks (`a`, `button`, inputs, forms, etc.)
- prevents nested-link DOM corruption
- fits previews into a shared virtual canvas
- applies the same containment rules to cards, detail, map, contrast, vocabulary, collision results and NEXT REFERENCES

This layer exists specifically to prevent a mock's internal HTML from breaking the outer navigation / comparison layout.

## QA / Accessibility

`styles-qa.css` adds shared focus-visible behavior, skip links, touch-target sizing, reduced-motion handling, readable mobile global navigation, ARIA state treatment and long-term wrapping rules.

## Key modules

- `patterns.js` — initial library
- `patterns-extra.js` — Japanese media / Nintendo expansion
- `patterns-wave1.js` — 12 Design Space extremes
- `patterns-wave2.js` — 12 contrast references
- `taxonomy.js` — schema v2 enrichment
- `design-space.js` — six-axis geometry / Diversity / Opposite
- `vocabulary.js` — grammar and knowledge graph
- `app.js` — search, filters and Collision Engine
- `discovery-v2.js` — sorting, URL state and NEXT REFERENCES
- `brand-links.js` — brandUrl / sourceUrl separation and official-link behavior
- `ui-preview-contract.js` — inert preview and fitting contract
- `map.html` / `map.js` — Design Map
- `vocabulary.html` / `vocabulary-page.js` — Vocabulary explorer
- `compare.html` / `compare.js` — Contrast Pair
- `styles-library-grid.css` — continuous 3-column library
- `styles-discovery-v2.css` — sort controls and NEXT REFERENCES
- `styles-brand-links.css` — official / source reference UI
- `styles-preview-contract.css` — preview containment
- `styles-qa.css` — mobile / accessibility hardening

## Next phase

The next planned system is **Coverage Map / Coverage Planner**: use geometric sparse regions, thin Vocabulary nodes, brand concentration and Domain / Medium gaps to choose Wave 3 references based on coverage value rather than fame or intuition.

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
