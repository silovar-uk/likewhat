# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚文法・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**Brand is the entrance; design principles are the exit.**

## Current library

**78 patterns**

- Initial library: 39
- Wave 1: 12 deliberately distant Design Space extremes
- Wave 2: 12 neighboring / counterpoint references
- Wave 3: 15 coverage-driven references selected from underrepresented interaction models and media

Wave 3 adds Duolingo, Spotify, Canva, Blender, Ableton Live, Tesla, Transport for London, Monzo, Salesforce, Discord, Strava, Uber Driver, NASA Eyes, Amazon Alexa and Oura.

The Wave 3 selection was intentionally not “15 more famous websites.” It expands the library into new media and operational contexts: embedded touchscreen, physical + digital wayfinding, voice, wearable health, interactive 3D, expert desktop creation, real-time field operations, finance, education and community spaces.

## Core exploration

- Continuous three-column Pattern library
- Search by brand, UI term, vocabulary and philosophy
- Sort by Brand / Density / Exploration / Diversity / seeded Random
- URL-preserved query, filters and sort state
- 6-axis **Design Space**
- **Diversity Score**, Nearest / Farthest and Opposite Reference
- **NEXT REFERENCES** with Similar Position / Shared Principle-Different Context / Opposite Priorities
- **Design Map** for explainable two-axis projection
- **Design Vocabulary** knowledge graph
- **Contrast Pair** comparison engine
- **Collision Engine** with Random / Far Apart / Weird Combination
- **Coverage Planner** for deciding what to add next
- **Coverage Delta** for testing whether the previous expansion actually improved coverage
- separate **Official Brand** and **Reference Source** links

## Coverage feedback loop

The library now treats expansion as a measurable editorial cycle rather than a one-way accumulation process.

`Coverage → Expansion → Delta → Next Coverage`

### 1. Coverage Planner

`coverage.html` analyzes the current library itself rather than another design reference.

It combines four signals:

1. **6D Spatial Gaps** — scan `3^6 = 729` Low / Mid / High probe vectors and measure the nearest existing Pattern
2. **Thin Vocabulary** — count Pattern / Brand / Domain support for each concept
3. **Context Balance** — inspect underrepresented Domain / Medium and overrepresented brands
4. **Research Briefs** — combine Spatial 55% + Concept 25% + Context 20% into explainable next-research conditions

### 2. Coverage-driven expansion

A new reference should answer:

> What can this Pattern explain that the current library cannot explain well yet?

Fame alone is not an inclusion criterion.

### 3. Coverage Delta

The Coverage page also compares **Before Wave 3 = 63 references** with **After Wave 3 = 78 references** using the same formulas.

It deliberately does **not** collapse the result into one total score. Instead it compares:

- Maximum 6D open gap
- Mean of the top six open gaps
- Average local separation
- Unique Domains
- Unique Media
- Thin Vocabulary concepts
- Singleton Domains
- Largest-brand share

This preserves trade-offs. For example, adding new Domains may improve breadth while simultaneously creating more one-example Domains that need later reinforcement.

### 4. Open-vector compression

The six sparse vectors identified in the 63-reference library are re-measured against the 78-reference library at the **same coordinates**. This shows which actual Design Space gaps Wave 3 filled rather than merely comparing two separately selected lists.

### 5. Wave contribution

Every Wave 3 reference is compared with its nearest Pattern in the old 63-reference library. The old-neighbor Design Distance is used as an explainable novelty signal:

- **Frontier Gain** — far from the old library
- **Territory Expansion** — clearly extends an existing region
- **Bridge** — adds an adjacent route between regions
- **Reinforcement** — primarily thickens an existing region

New Domain and new Medium contributions are also marked separately.

`wave-metadata.js` keeps the set of references belonging to Wave 3 explicit so longitudinal analysis does not depend on file order or brand-name guesses.

## Design Space

Six editorial 0–100 axes:

- Density: Sparse ↔ Dense
- Emotional Intensity: Calm ↔ Excitable
- Goal Orientation: Efficiency ↔ Exploration
- Authority: Personal ↔ Institutional
- Interaction: Observation ↔ Direct Manipulation
- Order: Chaotic ↔ Systematic

Coordinates are comparative heuristics, not quality scores.

Pairwise Design Distance uses normalized Euclidean distance across all six axes.

## Discovery Architecture v2

### Continuous library grid

Brand sections remain in the data but do not create separate visual rows. Pattern cards flow continuously across the grid.

### Explainable sorting

- Brand order
- Density
- Exploration
- Diversity
- Random with persistent seed

### URL state

The main library preserves `q`, `brand`, `part`, `sort` and Random `seed`.

### NEXT REFERENCES

Each Pattern exposes three different relationship semantics instead of one generic Related list:

1. Similar Position
2. Shared Principle / Different Context
3. Opposite Priorities

## Traceable Reference Layer

The interface distinguishes:

- **Official Brand** — a brand-level official destination
- **Reference Source** — the exact official page grounding the Pattern analysis

Wave 3 sources use official product help, manuals, design standards, design guidance or product documentation wherever possible.

## Preview Contract

All miniature product samples are illustrations, not embedded functional interfaces.

`ui-preview-contract.js`:

- neutralizes nested links, buttons, form controls and other interactive mock markup
- renders samples on a shared 420×236 virtual canvas
- fits that canvas into cards, Pattern detail, Design Map, Vocabulary, Contrast, Collision and NEXT REFERENCES
- prevents a mock’s internal DOM from breaking outer navigation

## Key files

- `patterns.js` — initial library
- `patterns-extra.js` — Japanese media / Nintendo expansion
- `patterns-wave1.js` — Design Space extremes
- `patterns-wave2.js` — neighboring contrast references
- `patterns-wave3.js` — coverage-driven expansion
- `wave-metadata.js` — explicit longitudinal wave membership
- `ui-wave1.js` / `ui-wave2.js` / `ui-wave3.js` — abstract interface mocks
- `styles-wave1.css` / `styles-wave2.css` / `styles-wave3.css` — mock styling
- `taxonomy.js` — schema enrichment
- `design-space.js` — six-axis geometry
- `vocabulary.js` — grammar and knowledge graph
- `app.js` — search, filters and Collision Engine
- `discovery-v2.js` — sorting, URL state and NEXT REFERENCES
- `coverage.html` / `coverage.js` / `styles-coverage.css` — Coverage Planner
- `coverage-delta.js` / `styles-coverage-delta.css` — longitudinal Before / After analysis
- `brand-links.js` — official brand / exact source separation
- `ui-preview-contract.js` — inert preview / fitting contract
- `map.html` / `map.js` — Design Map
- `vocabulary.html` / `vocabulary-page.js` — Vocabulary explorer
- `compare.html` / `compare.js` — Contrast Pair

## Next expansion rule

Do not select the next wave because a brand is famous.

Prefer a reference when it can answer:

> What can this Pattern explain that the current library cannot explain well yet?

Then, after adding it, use Coverage Delta to check whether it actually filled the intended gap or merely increased the count.

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
