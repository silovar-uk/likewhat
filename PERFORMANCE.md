# Performance Architecture

Like What? is designed so library growth does not linearly increase initial page cost.

The core rule is:

> Editorial Pattern source is build-time input. Browser pages should consume generated data matched to their task.

## Generated data

GitHub Pages runs `scripts/build-pattern-data.mjs` before deployment. Existing `patterns*.js` files remain the editorial source of truth.

The build executes `taxonomy.js` and generates:

```text
generated/catalog.json
generated/patterns/<id>.json
generated/brands/index.json
generated/brands/<manifest>.json
generated/history/wave3.json
```

`generated/catalog.json` is schema v3 and contains compact, analysis-ready records for all references.

In addition to Design Space / taxonomy metadata, each compact record contains:

- `searchText`: a precomputed normalized search corpus built from long-form source fields
- `clusterMembers`: only brand / role summaries needed to render Industry Cluster cards
- `detailFile`: route to the Full Detail JSON
- `scene`: optional state key for Loading / 404 / Empty / Error / Success / Onboarding references

This preserves TOP search quality without carrying description, visual rules, prompts and full Cluster member notes as separate runtime fields.

## TOP progressive loading

### Stage 0 — shell

Loaded immediately:

- shared / home CSS
- `catalog-index.js`
- `top-bootstrap.js`

Initial Pattern details: **0**.

### Stage 1 — catalog requested

The TOP library starts only when:

- the Brand / Artist / Institution / Cluster section comes within roughly 300 px of the viewport
- the user searches
- a query parameter is already present
- the page opens with `#patterns`
- Collision Engine is used

At that point TOP fetches:

```text
generated/catalog.json
```

It does **not** load `patterns.js`, Wave files, Eyewear source files or Idol source files.

The compact records are adapted into the shape expected by the existing grouping / search / random controllers. `searchText` is exposed as the searchable description field, and `clusterMembers` supplies the lightweight Cluster card list.

### Stage 2 — engines / grouping

TOP then loads:

```text
design-space.js
library-groups.js
vocabulary.js
```

Taxonomy is not recomputed in the browser because generated catalog records are already enriched at build time.

Diversity remains lazy and is calculated only when Diversity sorting is selected.

### Stage 3 — previews and scene controls

Preview renderer code loads only after the compact catalog is requested. Full miniature UI previews are then hydrated near the viewport through `top-performance.js`, with per-frame work limits.

Wave 5 adds `ui-wave5.js` / `styles-wave5.css` for brand, university and state previews. `scene-filter.js` derives its buttons from the compact catalog and reuses the existing search/filter path rather than introducing a second data model.

TOP runtime diagnostics:

```js
window.LikeWhatPerformanceBudget
window.LikeWhatInitialBudget
window.LikeWhatLoadMetrics
```

`LikeWhatLoadMetrics` reports:

```js
{
  runtimePatternSource: 'generated/catalog.json',
  fullDetailRecords: 0,
  catalogSchema: 3
}
```

## Pattern Detail

```text
compact catalog
+ exactly 1 Full Detail
```

`pattern.html?id=x` resolves the id from the compact catalog and fetches one `generated/patterns/x.json`.

Cross-library Nearest / Opposite / NEXT REFERENCES continue to use the compact records.

Runtime diagnostics:

```js
window.LikeWhatPatternLoadMetrics
```

## Brand / Artist / Institution View

```text
compact catalog
+ collection manifest
+ only that collection's Full Details
```

Examples:

```text
Apple → Apple Pattern details only
ILLIT → 3 Era details only
CHANMINA → 3 Era / Concept details only
MIT → MIT Institution detail only
```

Runtime diagnostics:

```js
window.LikeWhatBrandLoadMetrics
```

## Library-wide analysis pages

### Design Map

```text
compact catalog + Design Space + preview renderers
```

Full Detail: **0**.

### Vocabulary

```text
compact catalog + Vocabulary + preview renderers
```

Full Detail: **0**.

### Contrast

```text
compact catalog + selected A Full Detail + selected B Full Detail
```

Only `useCases` / `avoid` and other long-form comparison fields force hydration. Changed selections are fetched one at a time and cached.

### Coverage

```text
current compact catalog + generated/history/wave3.json
```

Full Detail: **0**.

The historical 63 → 78 comparison is a generated compact snapshot, independent of the current 149-reference library.

## Deployment verification

Pages CI verifies:

- current reference count is **149**
- generated Full Detail JSON file count exactly matches the catalog count
- all Pattern ids are unique
- compact catalog schema is at least v3
- every compact record has id / Design Space / detail routing / `searchText`
- Industry Cluster records have `clusterMembers`
- TOP HTML does not directly load Pattern source files
- `top-bootstrap.js` does not fall back to Pattern source files
- TOP bootstrap explicitly loads `generated/catalog.json`
- Wave 3 history remains 63 → 78 with 15 added ids
- Brand / Artist / Institution manifest counts and Pattern totals are consistent

This makes a regression from generated runtime data back to `patterns*.js` a deployment failure rather than a silent performance regression.

## Performance budget

Current TOP budget:

- Initial Pattern detail scripts: **0**
- Full Detail records after opening TOP library: **0**
- Initial full previews: **0**
- Initial Diversity calculations: **0**
- Initial DOM nodes: **≤ 1,000**
- Compact catalog target: **< 100 KB compressed / encoded transfer**

The Wave 5 CI build reports **353.4 KB raw** for the 149-reference compact catalog. Raw size is intentionally not treated as transfer size; the split threshold should be evaluated against compressed network transfer before introducing another request.

## Current architecture

```text
patterns*.js
(editorial source only)
        ↓
build + taxonomy enrichment
        ↓
┌────────────────────────────────────┐
│ generated/catalog.json             │
│ generated/patterns/<id>.json       │
│ generated/brands/*.json            │
│ generated/history/wave3.json       │
└────────────────────────────────────┘
        ↓
TOP
  compact catalog, 0 Full Detail

PATTERN DETAIL
  compact catalog + 1 Full Detail

BRAND / ARTIST / INSTITUTION
  compact catalog + manifest + collection details

SCENE
  compact catalog + scene filter; no extra dataset

MAP / VOCABULARY
  compact catalog, 0 Full Detail

CONTRAST
  compact catalog + selected pair details

COVERAGE
  compact current + compact history
```

## Next migration boundary

The major runtime architecture migration is now complete.

The next likely bottleneck is the **compact catalog itself**. Because `searchText` preserves rich TOP search, catalog transfer size will grow with the editorial corpus even though Full Detail does not.

When the compressed catalog approaches the performance budget, the next step should be:

```text
catalog-core.json
  id / grouping / design-space / preview / taxonomy

search-index.json
  id → normalized search corpus
```

TOP should fetch `catalog-core.json` when the library becomes visible, and load `search-index.json` only on the first actual search. Map / Coverage would never need the search index.

Do not split this prematurely: measure compressed transfer size first and introduce the second request only when the current compact catalog approaches the budget.

## Editorial constraint

Performance optimizations must preserve:

`Brand / Artist / Institution / Industry Cluster / Scene → Pattern / Era / State Variation → Design Principle`

Do not solve performance by flattening grouping, deleting design metadata, or reducing the explanatory source library.
