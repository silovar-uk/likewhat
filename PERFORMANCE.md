# Performance Architecture

Like What? is designed to keep both the top page and detail pages responsive as the reference library grows.

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

## Pattern detail loading

Pattern detail pages no longer load every full Pattern source file.

GitHub Pages runs `scripts/build-pattern-data.mjs` before deployment. The build step executes the existing Pattern source files as the editorial source of truth and generates:

```text
generated/catalog.json
generated/patterns/<id>.json
```

`generated/catalog.json` contains compact records for every reference. A compact record keeps only the information needed for cross-library analysis and navigation, including:

- id / brand / family / name
- one-line summary
- tags / UI parts
- Design Space coordinates
- domain / medium / archetype / interaction model
- philosophy
- related / opposite ids
- preview renderer key
- artist / cluster metadata
- source URL / label

Long-form fields such as full description, visual rules, use cases, avoid cases, prompts and member variation detail stay in the per-Pattern JSON.

When `pattern.html?id=x` opens:

1. fetch `generated/catalog.json`
2. resolve `x`
3. fetch exactly one `generated/patterns/x.json`
4. replace that compact catalog record with the full record in memory
5. run the existing Taxonomy / Design Space / Vocabulary / Opposite / NEXT REFERENCES logic against `1 full + N-1 compact` records

This preserves analytical comparison without downloading all long-form detail data.

Runtime diagnostics are exposed as:

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

Invalid Pattern ids are rejected from the compact catalog before any detail file is requested.

## Generated-data policy

The generated JSON is a deploy artifact, not an editorial source of truth.

Edit the existing `patterns*.js` source files. The Pages build regenerates catalog/detail output automatically.

The deployment workflow verifies:

- `generated/catalog.json` exists
- exactly 104 Pattern detail JSON files are produced
- the generated catalog reports 104 references

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

`LikeWhatLoadMetrics.reason` records why the deferred top library was loaded, such as `viewport`, `search-input`, `collision`, `query-param` or `anchor`.

## Current architecture

```text
editorial Pattern source files
        ↓ build
compact catalog + per-Pattern detail JSON
        ↓
TOP: deferred full library bundle
DETAIL: compact catalog + one full Pattern
```

The next migration target is Brand / Artist View.

Today a Brand page still loads the complete Pattern source library. The next step is:

```text
compact catalog
    ↓
brand / artist manifest
    ↓
only the full detail records needed by that Brand / Artist View
```

## Editorial constraint

Performance optimizations must preserve the current information architecture:

`Brand / Artist / Industry Cluster → Pattern / Era / Variation → Design Principle`

Do not solve performance by flattening Brand / Artist grouping or deleting explanatory metadata from the source library.
