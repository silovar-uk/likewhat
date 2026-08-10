# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚文法・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**Brand is the entrance; design principles are the exit.**

## Current library

**91 references**

- Initial library: 39
- Wave 1: 12 Design Space extremes
- Wave 2: 12 neighboring / counterpoint references
- Wave 3: 15 coverage-driven references
- Wave 4: 9 sports / club / live-event references
- Eyewear Industry Cluster: 4 grouped references covering 10 eyewear brands

## Information architecture v3

The top-level library is no longer `1 Pattern = 1 card`.

It now uses two entry types:

### Brand View

`Brand → multiple UI Patterns`

A brand such as **Apple** appears once in the main library. Its card previews several UI grammars, and `brand.html?brand=Apple` opens a Brand View containing every Apple Pattern currently in the library.

The Brand View keeps Pattern-level detail intact. It also displays Design Space as a **range** across the brand's patterns rather than flattening the brand into one averaged coordinate.

The same automatic grouping applies to Notion, Linear, Nintendo and every other brand that has multiple Patterns.

### Industry Cluster

When several brands solve essentially the same industry problem, they can be compressed into one editorial reference instead of inflating the library with near-duplicates.

Eyewear currently uses four clusters:

1. **Everyday Omnichannel Eyewear** — Zoff / JINS / OWNDAYS / 眼鏡市場
2. **Eyewear as Identity** — Ray-Ban / EYEVAN / Gentle Monster
3. **Engineering & Craft Provenance** — 999.9 / 金子眼鏡
4. **Professional Fitting & Consultation** — PARIS MIKI

Each cluster has one Design Space coordinate and counts as **one Coverage reference**. Its detail page then expands into `COMMON GRAMMAR → BRAND VARIATIONS`, preserving the meaningful differences between members and their individual official sources.

This creates three different levels:

`Brand / Industry Cluster → UI Pattern / Brand Variation → Design Principle`

## Core exploration

- Three-column Brand / Cluster library
- Multiple UI previews inside each Brand card
- Brand View for all Patterns belonging to one brand
- Search by brand, cluster member, UI term, vocabulary and philosophy
- Brand / Density / Exploration / Diversity / seeded Random sorting
- Brand and Industry-level filters; Eyewear can be filtered as a whole or by member brand such as Ray-Ban or JINS
- Separate small **Official ↗** link on Brand cards while the main card opens the internal Brand View
- 6-axis Design Space
- Diversity Score, Nearest / Farthest and Opposite Reference
- NEXT REFERENCES with Similar Position / Shared Principle-Different Context / Opposite Priorities
- Design Map
- Design Vocabulary
- Contrast Pair
- Collision Engine
- Coverage Planner and historical Coverage Delta

## Coverage policy

Expansion is not evaluated by card count.

`Coverage → Expansion → Delta → Next Coverage`

Industry Clusters are intentionally counted once in Coverage so that adding Zoff, JINS, OWNDAYS and 眼鏡市場 does not make `Retail / Eyewear` look four times more represented merely because four similar brands were researched.

The historical Coverage Delta still compares **63 → 78** for Wave 3 using the same formulas. The current 91-reference library is used by the live Coverage Snapshot and current gap analysis.

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
- `cluster-brand-filter.js` — industry-level filter such as Eyewear
- `group-sort.js` — applies existing sort semantics to grouped cards
- `group-official-links.js` / `styles-group-official.css` — preserves direct official-brand links
- `ui-preview-contract.js` / `styles-group-preview.css` — shared preview fitting for group mosaics and Brand View

## Source policy

Normal Pattern pages distinguish:

- **Official Brand** — brand-level official destination
- **Reference Source** — exact official page grounding the Pattern analysis

Industry Cluster pages do not pretend there is one canonical brand URL. Instead, every member variation keeps its own official source.

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` deploys the static site on every push to `main`.
