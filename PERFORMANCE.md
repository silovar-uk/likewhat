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

The build executes `taxonomy.js` against source Patterns and generates analysis-ready output:

```text
generated/catalog.json
generated/patterns/<id>.json
generated/brands/index.json
generated/brands/<manifest>.json
generated/history/wave3.json
```

`generated/catalog.json` contains compact but analysis-ready records for every reference, including derived implementation / design / philosophy terms. Long-form fields stay in one JSON per Pattern.

`generated/history/wave3.json` stores compact 63-reference and 78-reference snapshots so historical Coverage Delta does not depend on today's 104-reference library.

## Pattern detail loading

When `pattern.html?id=x` opens:

1. fetch `generated/catalog.json`
2. resolve `x`
3. fetch exactly one `generated/patterns/x.json`
4. replace that compact catalog record with the full record in memory
5. run the existing Design Space / Vocabulary / Opposite / NEXT REFERENCES logic against `1 full + N-1 compact` records

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
→ 3 Era details

IVE
→ IVE manifest
→ 1 Concept detail
```

Runtime diagnostics:

```js
window.LikeWhatBrandLoadMetrics
```

Brand View cost therefore scales with the selected collection, not total library size.

## Library-wide analysis pages

Design Map, Vocabulary, Contrast and Coverage now use `analysis-bootstrap.js` and no longer load `patterns*.js` directly.

### Design Map

```text
compact catalog
+ Design Space engine
+ preview renderer stack
```

No Full Detail records are required. Coordinates, domain, archetype, philosophy and preview keys all live in the analysis-ready catalog.

### Vocabulary

```text
compact catalog
+ Vocabulary engine
+ preview renderer stack
```

Vocabulary co-occurrence runs from generated implementation / design / philosophy terms plus the compact Pattern metadata.

### Contrast

```text
compact catalog
+ selected A Full Detail
+ selected B Full Detail
```

Selectors, curated pairs and Design Space comparison run from compact records. `useCases` and `avoid` are long-form decision data, so only the currently selected pair is hydrated through `LikeWhatDetailStore`. Changing one side fetches only that new Pattern and caches it.

### Coverage

```text
current compact catalog
+ generated/history/wave3.json
```

Current Coverage Snapshot / gaps use 104 compact references. Historical Coverage Delta temporarily evaluates the generated 63 → 78 snapshot, then returns to the current catalog. No historical raw Pattern bundle is loaded.

Runtime diagnostics for all four pages:

```js
window.LikeWhatAnalysisLoadMetrics
```

For Contrast, `fullDetailRecords` reports the number of pair details fetched so far. For the other analysis pages it remains zero.

## Deployment verification

The Pages workflow verifies:

- `generated/catalog.json` exists and reports 104 references
- exactly 104 Pattern detail JSON files are produced
- compact catalog schema is analysis-ready
- every compact record has id / Design Space / detail routing
- `generated/history/wave3.json` exists
- Wave 3 history remains exactly 63 → 78 with 15 added ids
- Brand / Artist manifest count matches unique non-Cluster brands
- manifest Pattern totals match non-Cluster references
- every manifest file listed by the index exists

When reference count changes, update expected deployment counts deliberately rather than allowing silent drift.

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
        ↓ build + taxonomy enrichment
analysis-ready compact catalog
per-Pattern detail JSON
Brand / Artist manifests
historical snapshots
        ↓
TOP
  shell → deferred library bundle

PATTERN DETAIL
  compact catalog + 1 full Pattern

BRAND / ARTIST VIEW
  compact catalog + manifest + collection Full Details

DESIGN MAP / VOCABULARY
  compact catalog only (+ preview renderers)

CONTRAST
  compact catalog + selected pair Full Details

COVERAGE
  compact current catalog + compact historical snapshot
```

## Next migration boundary

The largest remaining architectural inconsistency is the TOP page itself: when the library is finally requested, it still falls back to the original `patterns*.js` bundle rather than the generated compact catalog.

The next step should move TOP search / grouping / sorting to `generated/catalog.json`, then hydrate Full Detail only for operations that genuinely need long-form data. After that, `patterns*.js` becomes build-time editorial input rather than a browser runtime dependency almost everywhere.

## Editorial constraint

Performance optimizations must preserve the current information architecture:

`Brand / Artist / Industry Cluster → Pattern / Era / Variation → Design Principle`

Do not solve performance by flattening Brand / Artist grouping or deleting explanatory metadata from the editorial source library.
