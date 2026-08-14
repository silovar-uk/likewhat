# Like What?

「Apple風」「ILLITっぽい」「Linearっぽい」のような曖昧なイメージを、具体的なUIパターン・視覚文法・世界観・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**Brand is the entrance; design principles are the exit.**

## Current library

**149 references**

- Initial library: 39
- Wave 1: 12 Design Space extremes
- Wave 2: 12 neighboring / counterpoint references
- Wave 3: 15 coverage-driven references
- Wave 4: 9 sports / club / live-event references
- Eyewear Industry Cluster: 4 grouped references covering 10 eyewear brands
- Idol / Artist concepts: 13 references across 11 artist / culture brands
- Wave 5: 45 references across brand / culture, university / institution, and UI scene / state patterns

### Wave 5 scope

Wave 5 expands the library in three directions instead of adding one more group of visually similar brands.

1. **Brand / Culture** — Toys“R”Us, 無印良品, CHANMINA, Tiffany & Co., Marvel plus adjacent references such as LEGO, Sanrio, IKEA, Aesop, Cartier, LOEWE, Disney, Billie Eilish and DC.
2. **Institution / University** — 東京大学, 京都大学, 早稲田大学, 慶應義塾, Oxford, Cambridge, Harvard, MIT and Stanford. Universities are read as institutional design systems: authority, publicness, research culture, student life and future orientation—not merely crest and school color.
3. **Scene / State** — Loading, 404, Empty, Error, Success and Onboarding patterns grounded in design-system references. Scene patterns ask what the interface should communicate and enable at a specific moment, not what decorative skin to apply.

## Information architecture v4

The top-level library is not `1 Pattern = 1 card`.

It supports four complementary ways into the same reference space.

### 1. Brand / Institution View

`Brand / Institution → multiple UI Patterns`

A brand such as **Apple** or an institution such as **MIT** appears once in the main library. Its card previews the Pattern grammars currently held by that name, and `brand.html?brand=...` opens the collection.

The collection keeps Pattern-level detail intact and displays Design Space as a **range** rather than flattening the name into one averaged coordinate.

### 2. Artist View

`Artist → multiple Era / Concept Patterns`

An artist such as **ILLIT** or **CHANMINA** also appears once in the main library, but the children are Era / Concept grammars.

Current ILLIT references:

- **SUPER REAL ME** — Dreamy Everyday Surrealism
- **NOT CUTE ANYMORE** — Cute Refusal / Identity Reversal
- **MAMIHLAPINATAPAI** — Self-styling in Motion

The idol / artist layer also includes references such as aespa, XG, FRUITS ZIPPER, LE SSERAFIM, ME:I, IVE, Perfume, BABYMONSTER, CUTIE STREET, KAWAII LAB. and CHANMINA.

Artist View reuses the same collection architecture but changes the language to `ARTIST VIEW / ERA & CONCEPT GRAMMARS` and adds an **Idol Lens** when the reference is an Artist Era.

### Idol Lens

The global six-axis Design Space remains unchanged. Idol Lens is an industry-specific annotation layer:

- Presence: Iconic ↔ Intimate
- Reality: Everyday ↔ Worldbuilding
- Tone: Soft ↔ Assertive
- Identity: Individual ↔ Collective Coding
- Relation: Editorial ↔ Participatory
- Continuity: Stable Identity ↔ Era Transformation

It is not a quality score. It exists so that an artist reference does not collapse into a color palette or one frozen campaign image.

### 3. Industry Cluster

When several brands solve essentially the same industry problem, they can be compressed into one editorial reference instead of inflating the library with near-duplicates.

Eyewear currently uses four clusters:

1. **Everyday Omnichannel Eyewear** — Zoff / JINS / OWNDAYS / 眼鏡市場
2. **Eyewear as Identity** — Ray-Ban / EYEVAN / Gentle Monster
3. **Engineering & Craft Provenance** — 999.9 / 金子眼鏡
4. **Professional Fitting & Consultation** — PARIS MIKI

Each cluster has one Design Space coordinate and counts as one Coverage reference. Its detail page expands into `COMMON GRAMMAR → BRAND VARIATIONS`.

### 4. Scene / State Lens

`Situation → multiple solutions`

Loading / 404 / Empty / Error / Success / Onboarding can be filtered independently of brand. This turns Like What? into a situation library as well as a name library.

Examples:

- Loading: Skeleton / expressive progress / scoped inline loading / branded transition
- 404: utility-first recovery / illustrated recovery / exploration recovery
- Empty: guided first action / celebratory completion
- Error: outcome → cause → recovery
- Success: non-blocking confirmation
- Onboarding: teach at the empty state instead of starting a separate tour

The hierarchy is therefore:

`Brand / Artist / Institution / Industry Cluster / Scene → UI Pattern / Era / State Variation → Design Principle`

## Core exploration

- Brand / Artist / Institution / Cluster grouped library
- Scene filter for Loading / 404 / Empty / Error / Success / Onboarding
- Multiple previews inside grouped cards
- Collection View for all Patterns belonging to one brand or institution
- Artist View for Era / Concept changes
- Idol Lens for artist-specific comparison
- Search across brand, artist, institution, scene, era, cluster member, vocabulary and philosophy
- Brand / Density / Exploration / Diversity / seeded Random sorting
- Separate small **Official ↗** link on cards while the main card opens the internal collection view
- 6-axis Design Space shared by UI, retail, culture, institutions and scene states
- Diversity Score, Nearest / Farthest and Opposite Reference
- NEXT REFERENCES with Similar Position / Shared Principle-Different Context / Opposite Priorities
- Design Map
- Design Vocabulary
- Contrast Pair
- Collision Engine
- Coverage Planner and historical Coverage Delta

## Source / abstraction policy

References are grounded in official product, artist, institution or design-system pages where possible, while Pattern names and Design Space coordinates are editorial abstractions created for Like What?.

The source establishes the observable system: navigation, content hierarchy, service structure, documented component behavior, collection structure, institution information architecture or recurring identity model. Like What? translates those observations into reusable design ideas.

A reference is not added merely because it is famous. The editorial question is:

> What can this reference explain that the current library cannot explain well yet?

## Coverage policy

Expansion is not evaluated by card count.

`Coverage → Expansion → Delta → Next Coverage`

Industry Clusters are counted once so closely related brands do not artificially inflate coverage. Artist Eras remain separate Design Space references when they express meaningfully different design priorities; the main library still groups them under one Artist card. Scene references remain separate because a Loading state and a 404 state solve different temporal problems even when they originate from the same design system.

The historical Coverage Delta still compares **63 → 78** for Wave 3 using the same formulas. The current **149-reference** library is used by the live Coverage Snapshot and current gap analysis.

## Design Space

Six editorial 0–100 axes:

- Density: Sparse ↔ Dense
- Emotional Intensity: Calm ↔ Excitable
- Goal Orientation: Efficiency ↔ Exploration
- Authority: Personal ↔ Institutional
- Interaction: Observation ↔ Direct Manipulation
- Order: Chaotic ↔ Systematic

Coordinates are comparative heuristics, not quality scores.

## Key grouping files

- `library-groups.js` — builds Brand / Institution groups and keeps Industry Clusters standalone
- `brand.html` / `brand.js` / `styles-brand-page.css` — collection view
- `patterns-eyewear.js` — four grouped Eyewear references
- `ui-eyewear.js` / `styles-eyewear.css` — abstract Eyewear previews
- `cluster-detail.js` / `styles-cluster-detail.css` — Common Grammar / Brand Variations
- `patterns-idols.js` / `patterns-idols2.js` — Artist / Era concept references
- `ui-idols.js` / `styles-idols.css` and `ui-idols2.js` / `styles-idols2.css` — Artist previews
- `brand-idol.js` / `styles-brand-idol.css` — Artist View + Idol Lens
- `patterns-wave5-brand.js` — Wave 5 brand / culture references
- `patterns-wave5-university.js` — domestic / overseas university references
- `patterns-wave5-scenes.js` — Loading / 404 / Empty / Error / Success / Onboarding references
- `ui-wave5.js` / `styles-wave5.css` — Wave 5 abstract previews
- `scene-filter.js` — Scene-specific top filter
- `ui-preview-contract.js` / `styles-group-preview.css` — shared preview fitting

## Run locally

```bash
node scripts/build-pattern-data.mjs
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` generates the compact catalog, verifies the current reference count and duplicate IDs, then deploys the static site on every push to `main`.
