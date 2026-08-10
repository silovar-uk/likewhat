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
- 異なるブランドからランダムに3パターンを抽出し、意図的なセレンディピティを作る
- AIへそのまま渡せる、専門語彙＋Design Space座標付きの設計指示をコピーする
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

Diversity Score is a relative library statistic, not a quality score. A high score means the pattern occupies a comparatively underrepresented region of the current reference space. `Farthest` is deliberately described as a geometric result rather than an editorial “opposite”; philosophical opposite references are a separate next phase.

These distance functions are the foundation for opposite references, the global Design Map and Far Apart random selection.

## Design grammar

`vocabulary.js` maps patterns to specialist terms.

- **Implementation**: CSS Grid, responsive composition, focus management, UI state machine, semantic grouping...
- **Design System**: Visual hierarchy, Information Architecture, Progressive disclosure, Mini-IA, Editorial rhythm, Master–detail...
- **Philosophy**: Recognition over recall, User agency, Cognitive-load management, Preserve context, Content-first design...

## Pattern modules

- `patterns.js` — initial library
- `patterns-extra.js` — オモコロ / 集英社 / Nintendo expansion
- `patterns-wave1.js` — 12 design-space extremes
- `taxonomy.js` — schema v2 and Design Space enrichment
- `design-space.js` / `styles-design-space.css` — six-axis visualization, pairwise distance and Diversity Score
- `ui-extra.js` / `styles-extra.css` — Japanese media mocks
- `ui-wave1.js` / `styles-wave1.css` — mocks for the 12 extremes

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
