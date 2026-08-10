# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚文法・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**Brand is the entrance; design principles are the exit.**

## Current library

**78 patterns**

- Initial library: 39
- Wave 1: 12 deliberately distant Design Space extremes
- Wave 2: 12 neighboring / counterpoint references
- Wave 3: 15 coverage-driven references selected from underrepresented interaction models and media

Wave 3 adds:

- Duolingo — motivational guided learning
- Spotify — personalized media discovery
- Canva — template-first creation
- Blender — task-oriented expert workspaces
- Ableton Live — non-linear Session Grid
- Tesla — safety-constrained vehicle HMI
- Transport for London — network-wide wayfinding
- Monzo — accessible personal finance control
- Salesforce — object-centric enterprise records
- Discord — persistent community channels
- Strava — spatial performance storytelling
- Uber Driver — live dispatch operations
- NASA Eyes — interactive scientific visualization
- Amazon Alexa — conversational voice flow
- Oura — calm health interpretation

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
- separate **Official Brand** and **Reference Source** links

## Coverage Planner

`coverage.html` analyzes the library itself rather than another design reference.

It combines four signals:

1. **6D Spatial Gaps** — scan `3^6 = 729` Low / Mid / High probe vectors and measure the nearest existing Pattern
2. **Thin Vocabulary** — count Pattern / Brand / Domain support for each concept
3. **Context Balance** — inspect underrepresented Domain / Medium and overrepresented brands
4. **Research Briefs** — combine Spatial 55% + Concept 25% + Context 20% into explainable next-research conditions

Coverage is relative to the current library. Adding Wave 3 therefore changes the next open vectors automatically.

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

The main library preserves:

- `q`
- `brand`
- `part`
- `sort`
- `seed`

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
- `ui-wave1.js` / `ui-wave2.js` / `ui-wave3.js` — abstract interface mocks
- `styles-wave1.css` / `styles-wave2.css` / `styles-wave3.css` — mock styling
- `taxonomy.js` — schema enrichment
- `design-space.js` — six-axis geometry
- `vocabulary.js` — grammar and knowledge graph
- `app.js` — search, filters and Collision Engine
- `discovery-v2.js` — sorting, URL state and NEXT REFERENCES
- `coverage.html` / `coverage.js` / `styles-coverage.css` — Coverage Planner
- `brand-links.js` — official brand / exact source separation
- `ui-preview-contract.js` — inert preview / fitting contract
- `map.html` / `map.js` — Design Map
- `vocabulary.html` / `vocabulary-page.js` — Vocabulary explorer
- `compare.html` / `compare.js` — Contrast Pair

## Next expansion rule

Do not select the next wave because a brand is famous.

Prefer a reference when it can answer:

> What can this Pattern explain that the current library cannot explain well yet?

The Coverage Planner is the starting point for that decision.

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
