# Like What?

「Apple風」「ILLITっぽい」「MITっぽい」「404をもっと遊びにしたい」のような曖昧なイメージを、具体的なUIパターン・視覚文法・世界観・実装構造・設計思想へ変換する個人用リファレンスライブラリです。

**The library is the entrance; design principles are the exit.**

## Current model

Like What? is no longer a Brand-only gallery. It handles five entry kinds in one design space:

- Brand
- Artist
- Institution
- Scene
- Industry Cluster

The hierarchy is:

`Library → Entry → Pattern / Era / State Variation → Design Principle`

Reference count and kind counts are generated at build time into `generated/meta.json`; they are intentionally not duplicated as hand-maintained documentation constants.

## Library v5

### Faceted, shareable state

TOP filtering is modeled as independent state rather than overloading text search:

`q / kind / brand / scene / domain / medium / part / sort / seed`

This allows combinations such as Institution × Loading or a Brand × Error search and makes filter states shareable through the URL.

### Scene lifecycle

Scene references are organized by user time:

- Before — Onboarding
- During — Loading
- Outcome — Empty / Success / Error
- Recovery — 404

The next Scene additions should fill lifecycle gaps before multiplying decorative variants.

### Brand × Scene Composer

The Composer combines an Identity reference with a Scene reference and produces a role-separated design brief. It is deliberately different from the three-way Collision Engine: Composer is practical and constrained; Collision is exploratory.

### Contrast

Design Space can be used in two modes conceptually:

- within-context — useful comparison among similar problem spaces
- across-worlds — deliberate cross-domain discovery

Curated `related` and `opposites` are optional overrides. Missing relations are valid because the library computes Nearest / Farthest / Opposite from Design Space.

## Runtime architecture

Editorial source remains `patterns*.js`, discovered automatically by the build.

Generated runtime data:

```text
generated/meta.json
generated/catalog-core.json
generated/search-index.json
generated/catalog.json              # compatibility while analysis pages migrate
generated/patterns/<id>.json
generated/brands/*.json
generated/history/wave3.json
```

TOP loads the core catalog first and defers the long-form search index until text search.

See `PERFORMANCE.md` and `docs/architecture-v5.md` for the full contract.

## Source / abstraction policy

References are grounded in official product, artist, institution or design-system pages where possible, while Pattern names, Design Space coordinates and reusable grammar names are editorial abstractions created for Like What?.

Generated Full Detail records carry a provenance envelope:

- `sourceType`
- `checkedAt`
- `observed`
- `editorialInference`

`checkedAt` remains null unless the source was deliberately researched; build time is not treated as verification time.

A reference is not added merely because it is famous. The editorial question is:

> What can this reference explain that the current library cannot explain well yet?

## Coverage policy

Expansion is not evaluated by card count.

`Coverage → Expansion → Delta → Next Coverage`

A new reference should improve spatial, conceptual, contextual, Scene-lifecycle or contrast coverage.

## Design Space

Six editorial 0–100 axes:

- Density: Sparse ↔ Dense
- Emotional Intensity: Calm ↔ Excitable
- Goal Orientation: Efficiency ↔ Exploration
- Authority: Personal ↔ Institutional
- Interaction: Observation ↔ Direct Manipulation
- Order: Chaotic ↔ Systematic

Coordinates are comparative heuristics, not quality scores.

## Validation

GitHub Pages CI runs the build and validates:

- required fields
- unique ids
- valid entry kinds
- Design Space ranges
- curated relation targets
- source URL syntax
- split runtime catalog consistency
- collection manifest consistency
- historical Wave 3 snapshot
- core catalog gzip budget

## Run locally

```bash
node scripts/build-pattern-data.mjs
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` builds, lints and deploys the static site on every push to `main`.
