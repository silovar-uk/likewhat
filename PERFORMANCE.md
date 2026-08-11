# Performance Architecture

Like What? is designed to keep both the top page and deep-navigation pages responsive as the reference library grows.

The core rule is:

> Library size must not directly determine initial page cost.

## Top page progressive loading

The top page has four stages.

### Stage 0 — shell

Loaded immediately:

- shared page CSS
- home / hero CSS
- `catalog-index.js`
- `top-bootstrap.js`

Not loaded initially:

- Pattern data
- Design Space engine
- Vocabulary engine
- Pattern renderers
- Brand / Artist card renderers
- preview mocks
- sorting / discovery controllers

### Stage 1 — library requested

The full library bundle starts only when one of these occurs:

- the Brand / Artist / Cluster section comes within roughly 300 px of the viewport
- the user enters a search
- a URL query is already present
- the page opens with `#patterns`
- Collision Engine is used

Library-specific CSS and Pattern data are requested in parallel.

### Stage 2 — grouped catalog

After data and analysis engines are available, Brand / Artist / Cluster cards are created.

Diversity is still not calculated unless the user selects Diversity sorting.

### Stage 3 — previews

Full miniature UI previews are not rendered with the card DOM.

`top-performance.js` inserts lightweight placeholders and hydrates previews only near the viewport, with a per-animation-frame work limit.

## Generated data

GitHub Pages runs `scripts/build-pattern-data.mjs` before deployment. Existing `patterns*.js` files remain the editorial source of truth.

The build generates:

```text
generated/catalog.json
generated/patterns/<id>.json
generated/brands/index.json
generated/brands/<manifest>.json
```

`generated/catalog.json` contains compact records for every reference. Long-form detail stays in one JSON per Pattern.

Brand / Artist manifests contain only collection membership and routing metadata:

- brand / artist name
- `brand` or `artist` type
- Pattern ids
- Pattern detail filenames
- Era names where applicable

Manifest filenames use a filesystem-safe encoded brand name and are resolved through `generated/brands/index.json`.

## Pattern detail loading

When `pattern.html?id=x` opens:

1. fetch `generated/catalog.json`
2. resolve `x`
3. fetch exactly one `generated/patterns/x.json`
4. replace that compact catalog record with the full record in memory
5. run the existing Taxonomy / Design Space / Vocabulary / Opposite / NEXT REFERENCES logic against `1 full + N-1 compact` records

This preserves cross-library analysis without downloading all long-form detail data.

Runtime diagnostics:

```js
window.LikeWhatPatternLoadMetrics
```

Expected shape:

```js
{
  selectedId: 'apple-ios-settings',
  referenceCount: 104,
  fullDetailRecords: 1,
  compactRecords: 103,
  durationMs: 123
}
```

## Brand / Artist View loading

Brand and Artist pages no longer load the full Pattern library.

When `brand.html?brand=ILLIT` opens:

1. fetch the compact catalog and Brand / Artist index in parallel
2. resolve the ILLIT manifest
3. fetch that manifest
4. fetch only the Pattern detail JSON files listed by the manifest
5. render the existing Brand View and Idol Lens from those Full Detail records

Examples:

```text
Apple
→ Apple manifest
→ only Apple UI Pattern details

ILLIT
→ ILLIT manifest
→ SUPER REAL ME
→ NOT CUTE ANYMORE
→ MAMIHLAPINATAPAI

IVE
→ IVE manifest
→ one Concept Pattern
```

Runtime diagnostics:

```js
window.LikeWhatBrandLoadMetrics
```

Expected shape:

```js
{
  brand: 'ILLIT',
  type: 'artist',
  referenceCount: 104,
  fullDetailRecords: 3,
  skippedFullDetailRecords: 101,
  durationMs: 140
}
```

This means Brand View cost scales with the size of the selected Brand / Artist, not with total library size.

## Deployment verification

The Pages workflow verifies:

- `generated/catalog.json` exists
- exactly 104 Pattern detail JSON files are produced
- the generated catalog reports 104 references
- `generated/brands/index.json` exists
- Brand / Artist manifest count matches unique non-Cluster brands in the compact catalog
- the sum of all manifest Pattern counts matches the number of non-Cluster references
- every manifest file listed by the index exists

When reference count changes, update the expected deployment count deliberately rather than allowing silent drift.

## Performance budget

The current top-page budget is defined in `catalog-index.js` and checked by `top-bootstrap.js`.

- Initial Pattern detail scripts: **0**
- Initial full previews: **0**
- Initial Diversity calculations: **0**
- Initial DOM nodes: **≤ 1,000**
- Compact catalog target: **< 100 KB compressed / encoded transfer**

Top runtime diagnostics:

```js
window.LikeWhatPerformanceBudget
window.LikeWhatInitialBudget
window.LikeWhatLoadMetrics
```

## Current architecture

```text
editorial Pattern source files
        ↓ build
compact catalog
per-Pattern detail JSON
Brand / Artist manifests
        ↓
TOP
  shell → deferred library bundle

PATTERN DETAIL
  compact catalog + 1 full Pattern

BRAND / ARTIST VIEW
  compact catalog + manifest + selected collection Full Details
```

## Next migration boundary

The remaining pages that still benefit from a library-wide view are:

- Design Map
- Vocabulary
- Contrast
- Coverage

These pages do not need every long-form Pattern field. The next optimization should migrate them from full `patterns*.js` sources to `generated/catalog.json`, loading Full Detail only when a UI surface genuinely needs it.

That migration is more important than further micro-optimizing Brand View.

## Editorial constraint

Performance optimizations must preserve the current information architecture:

`Brand / Artist / Industry Cluster → Pattern / Era / Variation → Design Principle`

Do not solve performance by flattening Brand / Artist grouping or deleting explanatory metadata from the editorial source library.
