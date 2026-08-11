# Like What?

「Apple風」「ILLITっぽい」「Linearっぽい」のような曖昧なイメージを、具体的なUIパターン・視覚文法・世界観・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**Brand is the entrance; design principles are the exit.**

## Current library

**104 references**

- Initial library: 39
- Wave 1: 12 Design Space extremes
- Wave 2: 12 neighboring / counterpoint references
- Wave 3: 15 coverage-driven references
- Wave 4: 9 sports / club / live-event references
- Eyewear Industry Cluster: 4 grouped references covering 10 eyewear brands
- Idol / Artist concepts: 13 references across 11 artist / culture brands

## Information architecture v3

The top-level library is not `1 Pattern = 1 card`.

It supports three entry forms.

### 1. Brand View

`Brand → multiple UI Patterns`

A brand such as **Apple** appears once in the main library. Its card previews several UI grammars, and `brand.html?brand=Apple` opens every Apple Pattern currently in the library.

The Brand View keeps Pattern-level detail intact and displays Design Space as a **range** rather than flattening the brand into one averaged coordinate.

### 2. Artist View

`Artist → multiple Era / Concept Patterns`

An artist such as **ILLIT** also appears once in the main library, but the children are Era / Concept grammars.

Current ILLIT references:

- **SUPER REAL ME** — Dreamy Everyday Surrealism
- **NOT CUTE ANYMORE** — Cute Refusal / Identity Reversal
- **MAMIHLAPINATAPAI** — Self-styling in Motion

The idol / artist layer currently also includes:

- **aespa** — Synthetic Myth Worldbuilding
- **XG / AWE** — Alien Fashion Editorial
- **FRUITS ZIPPER / NEW KAWAII** — Hyper-Kawaii Identity Coding
- **LE SSERAFIM / IM FEARLESS** — Fearless Performance Minimalism
- **ME:I** — Continuous Fan Relationship Interface
- **IVE** — Self-possession Editorial
- **Perfume** — Technology as Choreography
- **BABYMONSTER / MONSTIEZ** — Shared Fan Identity Ecosystem
- **CUTIE STREET / KAWAII MAKER** — Kawaii as Becoming
- **KAWAII LAB.** — Platform for Differentiated Kawaii

The second expansion deliberately avoids adding five more versions of “cute idol visual.” Each reference has to add a different reusable design idea: self-possession, synchronized human-machine performance, shared fan identity, identity becoming, or portfolio brand architecture.

Artist View reuses the same Brand page architecture but changes the language to `ARTIST VIEW / ERA & CONCEPT GRAMMARS` and adds an **Idol Lens** when the reference is an Artist Era.

### Idol Lens

The global six-axis Design Space remains unchanged. Idol Lens is an industry-specific annotation layer:

- Presence: Iconic ↔ Intimate
- Reality: Everyday ↔ Worldbuilding
- Tone: Soft ↔ Assertive
- Identity: Individual ↔ Collective Coding
- Relation: Editorial ↔ Participatory
- Continuity: Stable Identity ↔ Era Transformation

It is not a quality score. It exists so that “ILLIT-like” does not collapse into a color palette or one frozen comeback image.

### 3. Industry Cluster

When several brands solve essentially the same industry problem, they can be compressed into one editorial reference instead of inflating the library with near-duplicates.

Eyewear currently uses four clusters:

1. **Everyday Omnichannel Eyewear** — Zoff / JINS / OWNDAYS / 眼鏡市場
2. **Eyewear as Identity** — Ray-Ban / EYEVAN / Gentle Monster
3. **Engineering & Craft Provenance** — 999.9 / 金子眼鏡
4. **Professional Fitting & Consultation** — PARIS MIKI

Each cluster has one Design Space coordinate and counts as one Coverage reference. Its detail page expands into `COMMON GRAMMAR → BRAND VARIATIONS`.

The hierarchy is therefore:

`Brand / Artist / Industry Cluster → UI Pattern / Era / Brand Variation → Design Principle`

## Core exploration

- Three-column Brand / Artist / Cluster library
- Multiple previews inside Brand / Artist cards
- Brand View for all Patterns belonging to one brand
- Artist View for Era / Concept changes
- Idol Lens for artist-specific comparison
- Search across brand, artist, era, cluster member, vocabulary and philosophy
- Brand / Density / Exploration / Diversity / seeded Random sorting
- Separate small **Official ↗** link on Brand cards while the main card opens the internal Brand / Artist View
- 6-axis Design Space
- Diversity Score, Nearest / Farthest and Opposite Reference
- NEXT REFERENCES with Similar Position / Shared Principle-Different Context / Opposite Priorities
- Design Map
- Design Vocabulary
- Contrast Pair
- Collision Engine
- Coverage Planner and historical Coverage Delta

## Idol source / abstraction policy

Idol references are grounded in official artist, label, project or discography pages, but the grammar names are editorial abstractions created for Like What?.

Official sources establish facts such as group-name meanings, Era names, project concepts, service structures and recurring content models. Like What? then translates those facts into reusable design ideas such as `Soft Surrealism`, `Interface as Fiction`, `Collective Individuality`, `Technology as Choreography`, or `Shared Fan Identity`.

An artist is not added merely because it is famous. The editorial question is:

> What can this artist / project explain that the current library cannot explain well yet?

## Coverage policy

Expansion is not evaluated by card count.

`Coverage → Expansion → Delta → Next Coverage`

Industry Clusters are counted once so closely related brands do not artificially inflate coverage. Artist Eras remain separate Design Space references when they express meaningfully different design priorities; the main library still groups them under one Artist card.

The historical Coverage Delta still compares **63 → 78** for Wave 3 using the same formulas. The current **104-reference** library is used by the live Coverage Snapshot and current gap analysis.

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

- `library-groups.js` — builds Brand groups and keeps Industry Clusters standalone
- `brand.html` / `brand.js` / `styles-brand-page.css` — Brand View
- `patterns-eyewear.js` — four grouped Eyewear references
- `ui-eyewear.js` / `styles-eyewear.css` — abstract Eyewear previews
- `cluster-detail.js` / `styles-cluster-detail.css` — Common Grammar / Brand Variations
- `patterns-idols.js` — first Artist / Era concept expansion
- `patterns-idols2.js` — second Artist / culture expansion
- `ui-idols.js` / `styles-idols.css` — first abstract idol concept previews and expansion hook
- `ui-idols2.js` / `styles-idols2.css` — second expansion previews
- `brand-idol.js` / `styles-brand-idol.css` — Artist View + Idol Lens
- `pattern-idol.js` / `styles-pattern-idol.css` — Era context on individual detail pages
- `idol-group-enhance.js` — Artist-specific top-card language
- `group-sort.js` — applies existing sort semantics to grouped cards
- `group-official-links.js` / `styles-group-official.css` — preserves direct official-brand links
- `ui-preview-contract.js` / `styles-group-preview.css` — shared preview fitting

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
