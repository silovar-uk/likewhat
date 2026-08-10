# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚文法・実装構造・設計思想・AI向け指示文へ変換する個人用リファレンスライブラリです。

## What it does

- 既存ブランド / サービスを主入口にパターンを探す
- 一覧のミニモックで違いを視覚的に確認する
- 「Visual Hierarchy」「Progressive Disclosure」「Maximalism」「Spatial IA」などの専門語でも横断検索する
- 各パターンを **Implementation / Design System / Philosophy** の3層で言語化する
- 各詳細ページで6軸の **Design Space** をレーダー＋両極スケールで可視化し、ライブラリ平均と比較する
- **Diversity Score** で、現在のライブラリ内にどれだけ似た参照が少ないかを測る
- Design Space上の **Nearest / Farthest** を計算し、どの軸が距離を作っているか比較する
- **Opposite Reference** で、現在の設計優先順位を反転した先に近い実在パターンを提示する
- **Design Map** で6軸から任意の2軸を選び、51件の密集・Frontier・空白方向をインタラクティブに探索する
- **Design Vocabulary** で概念を独立した知識ノードとして探索し、別ブランド・別業界の実例へ横断する
- **Random / Far Apart / Weird Combination** の3モードで、偶然・距離・異質さから3つの参照を衝突させる
- 抽出した3件を統合するためのAI briefを自動生成・コピーする
- AIへそのまま渡せる、専門語彙＋Design Space座標＋対極参照付きの設計指示をコピーする
- Web/SaaSだけでなく、Game UI / OS / Physical Space / Public Service / Old Webまで同じ設計空間に置く

## Library

51 patterns. Initial 39 patterns plus 12 deliberately distant design-space extremes:

- GOV.UK — Public / Institutional
- ドン・キホーテ — Maximalism / Chaos
- LEGO — Play / Children
- CELINE — Luxury / Restraint
- Persona 5 — Game UI
- Windows 95 — OS / Device
- Google Maps — Maps / Movement
- Bloomberg Terminal — Dense Information / Monitoring
- ほぼ日 — Culture / Art Direction
- Wikipedia — Primitive / Old Web
- IKEA — Physical / Environmental Design
- チケットぴあ — Deliberate Friction / Ritual

## Taxonomy schema v2

`taxonomy.js` enriches every pattern without breaking the original data objects.

Each pattern can now carry:

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

`opposites` can contain curated pattern IDs. When no curated opposite is supplied, Like What? computes one from Design Space.

## Design Space

`design-space.js` treats every pattern as a point in a six-dimensional editorial design space. The coordinates are not quality scores; they are comparative, heuristic positions used to describe contrast between patterns.

Six 0–100 axes:

- Density: Sparse ↔ Dense
- Emotional Intensity: Calm ↔ Excitable
- Goal Orientation: Efficiency ↔ Exploration
- Authority: Personal ↔ Institutional
- Interaction: Observation ↔ Direct Manipulation
- Order: Chaotic ↔ Systematic

Pattern detail pages show:

- six-axis radar profile
- current Like What? library mean as a dashed baseline
- bipolar axis bars with exact values
- Domain / Medium / Archetype / Interaction Model
- a short Character Profile derived from the strongest axis positions

## Design Distance / Diversity Score

Each pair of patterns has a normalized Euclidean distance across the six Design Space axes.

`distance = sqrt(sum(axisDiff²)) / theoreticalMaxDistance × 100`

For each pattern:

- **Local Separation** = distance to the nearest pattern
- **Diversity Score** = percentile rank of Local Separation inside the current library
- **Nearest** = geometrically closest pattern in Design Space
- **Farthest** = geometrically farthest pattern in the current library
- **Axis delta** = the three axes contributing the largest difference between two references

Diversity Score is a relative library statistic, not a quality score. A high score means the pattern occupies a comparatively underrepresented region of the current reference space.

## Opposite Reference

`Farthest` and `Opposite` are deliberately different concepts.

- **Farthest** asks: which existing pattern is geometrically farthest from the current point?
- **Opposite** asks: if every design priority were inverted, which existing reference is closest to that ideal inverted position?

The ideal opposite vector is calculated axis by axis:

`oppositeAxis = 100 - currentAxis`

The computed editorial opposite is the candidate closest to that ideal vector. Small penalties are added for the same brand, domain, archetype and medium so that a useful cross-context reference is preferred when distances are similar.

Pattern detail pages show:

- **Opposition Fit** = closeness to the ideal inverted vector
- current pattern and opposite reference side by side
- the three strongest priority reversals in plain Japanese
- all six axes as Current → Opposite values
- explicit distinction between geometric Farthest and editorial Opposite

A curated opposite can override the computed result by adding its pattern ID to `opposites`.

## Design Map

`map.html` is an interactive 2D projection of the six-dimensional Design Space. It deliberately avoids an opaque dimensionality-reduction algorithm: users choose the two axes they want to inspect, so the meaning of every point remains explainable.

Features:

- selectable X and Y axes across all six Design Space dimensions
- presets such as Exploration × Order, Emotion × Density and Authority × Interaction
- Domain filtering
- point size / outer ring to surface high-Diversity **Frontier** patterns
- hover detail and click-to-inspect interaction
- selected pattern preview with Diversity, Nearest and Opposite context
- three automatically sampled **Open Space** markers showing sparse coordinates in the current 2D projection
- horizontal scrolling on small screens instead of compressing the map until labels become unreadable

Open Space is explicitly a 2D projection heuristic, not a claim that the same region is empty in the full six-dimensional space.

The Design Map is reachable from the global header and the top-page map entry card.

## Collision Engine / Random modes

The top-page discovery module has three distinct draw modes.

### Random

Selects three different brands by ordinary randomized sampling. This keeps serendipity as the primary mechanism rather than optimizing a score.

### Far Apart

Uses the full six-dimensional Design Space. It evaluates triples from different brands and applies a **maximin** rule: the minimum of the three pairwise distances is maximized first, with average distance used as additional separation pressure.

This prevents a visually impressive triangle where two references are actually close together.

### Weird Combination

Looks for productive incompatibility rather than pure geometric distance. Candidate triples are scored using:

- average six-dimensional distance
- number of distinct Domains
- number of distinct Mediums
- number of distinct Archetypes
- pairwise dissimilarity of Philosophy terms

Instead of always returning one deterministic mathematical optimum, it randomly samples from a small pool of the highest-scoring triples so repeated draws remain generative.

Every draw shows:

- average and minimum pairwise Design Distance
- number of Domains and Archetypes represented
- the three selected pattern cards
- a deterministic **「この3つを混ぜるなら？」AI brief** that assigns each reference a principle role and explicitly asks the model not to average away the contradictions
- one-click copying of that collision brief

## Design Vocabulary

`vocabulary.html` turns specialist terms into first-class knowledge nodes instead of leaving them as tags attached to brands.

The vocabulary currently combines the original cross-pattern grammar with curated concepts introduced by the wider reference worlds, including:

- Wayfinding / Spatial IA / Progressive Zoom
- Maximalism / Visual Cacophony / Dense Signage
- Deliberate Friction / Atmospheric Interface / Scarcity of Signifiers
- Menu Choreography / HUD / State Legibility
- Hypertext-first / Document-centric Web / Content Addressability
- Choice Architecture / Ritualized Interaction / Commitment Device
- Plain Language / Error Prevention / Institutional Trust

Terms are organized into five transferable categories:

1. **Implementation**
2. **Interaction Design**
3. **Visual Design**
4. **Information Architecture**
5. **Cognitive / Philosophy**

Each term node provides:

- English term and Japanese label
- a concise working definition
- number of connected patterns, brands and domains
- **Related Concepts** computed from term co-occurrence across shared patterns
- **Cross-world Examples** that prefer different brands so the same principle can be compared outside one product family
- links back to every connected pattern
- a direct link to search the main pattern library with that concept

Pattern detail pages now link specialist terms in `DESIGN GRAMMAR` directly into their Vocabulary nodes, creating the path:

`Pattern → Vocabulary → different-world Pattern`

This relationship is intentionally data-driven: as new references connect to existing vocabulary, co-occurrence and cross-world traversal improve without hand-authoring a fixed concept graph.

## Design grammar

`vocabulary.js` still powers the per-pattern grammar layer while also exposing the knowledge-graph functions used by `vocabulary.html`.

- **Implementation**: CSS Grid, responsive composition, focus management, UI state machine, semantic grouping...
- **Interaction / Visual / IA**: Visual hierarchy, Progressive disclosure, Mini-IA, Editorial rhythm, Master–detail, Wayfinding...
- **Philosophy**: Recognition over recall, User agency, Cognitive-load management, Preserve context, Content-first design...

## Pattern modules

- `patterns.js` — initial library
- `patterns-extra.js` — オモコロ / 集英社 / Nintendo expansion
- `patterns-wave1.js` — 12 design-space extremes
- `taxonomy.js` — schema v2 and Design Space enrichment
- `design-space.js` / `styles-design-space.css` — six-axis visualization, pairwise distance, Diversity Score and Opposite Reference
- `map.html` / `map.js` / `styles-map.css` — interactive two-axis Design Map and sparse-zone discovery
- `vocabulary.html` / `vocabulary-page.js` / `styles-vocabulary.css` — searchable knowledge graph, co-occurrence and cross-world traversal
- `app.js` / `styles-enhancements.css` — search, filtering and three-mode collision engine
- `ui-extra.js` / `styles-extra.css` — Japanese media mocks
- `ui-wave1.js` / `styles-wave1.css` — mocks for the 12 extremes

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
