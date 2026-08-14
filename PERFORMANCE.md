# Performance Architecture

Like What? is designed so library growth does not linearly increase initial page cost.

The core rule is:

> Editorial Pattern source is build-time input. Browser pages consume generated data matched to their task.

## Generated data v5

GitHub Pages runs `scripts/build-pattern-data.mjs` before deployment. `patterns*.js` files remain editorial source, but the build discovers them automatically so adding a new Wave file does not require another hard-coded source list.

Generated outputs:

```text
generated/meta.json
generated/catalog-core.json
generated/search-index.json
generated/catalog.json              # temporary compatibility artifact
generated/patterns/<id>.json
generated/brands/index.json
generated/brands/<manifest>.json
generated/history/wave3.json
```

### catalog-core.json

Contains only data required for Library grouping, Facets, previews, routing, Design Space and analysis.

### search-index.json

Contains `id → normalized text` and is loaded only when a real textual search needs long-form matching.

### Full Detail

Contains the complete editorial Pattern plus generated `entryKind` and `provenance` envelope.

## TOP progressive loading

### Stage 0 — shell

Loaded immediately:

- shared / home CSS
- `catalog-index.js`
- `top-bootstrap.js`

Initial Pattern details: **0**.

### Stage 1 — core library

When the library becomes relevant, TOP fetches:

```text
generated/meta.json
generated/catalog-core.json
```

It does not load Full Detail records.

### Stage 2 — search on demand

`generated/search-index.json` is deferred until the user actually enters textual search terms. Facet-only filtering does not pay the search-corpus transfer cost.

### Stage 3 — engines / previews

Design Space, grouping, vocabulary and preview renderer code loads after the core catalog. Full miniature previews hydrate near the viewport through `top-performance.js`.

## Pattern Detail

```text
core catalog + exactly 1 Full Detail
```

Cross-library Nearest / Opposite / NEXT REFERENCES use compact records.

## Brand / Artist / Institution View

Single-Pattern collections route directly to Pattern Detail.

Multi-Pattern collections load:

```text
core catalog + collection manifest + that collection's Full Details
```

## Scene

Scene is a transversal facet over the core catalog. It is not implemented by overwriting the text search query.

## Collision Engine

Runtime must not enumerate every three-item combination.

- Random: distinct-entry random sample.
- Far Apart: bounded greedy farthest-point candidates.
- Weird Combination: deterministic bounded sampling with Design Space / context / philosophy scoring.

This keeps interaction responsive as the library grows toward 300+ references.

## Deployment validation

Pages CI validates:

- generated reference/detail counts agree
- ids are unique
- every Pattern has an entryKind
- required long-form fields are present
- Design Space axes are numeric 0–100
- curated related/opposite ids resolve
- source URLs parse
- core/search/meta counts agree
- core catalog stays within the 100 KB gzip budget
- Wave 3 historical snapshot remains 63 → 78
- collection manifests and optimized routes are consistent
- TOP retains progressive-loading behavior

Missing curated relations are allowed because relations are computed by default and curated only as overrides.

## Provenance

Generated details include:

- sourceType
- checkedAt
- observed
- editorialInference

Build time is never silently substituted for `checkedAt`.

## Performance budget

- Initial Pattern detail scripts: **0**
- Full Detail records after opening TOP library: **0**
- Initial full previews: **0**
- Initial Diversity calculations: **0**
- Initial DOM nodes: **≤ 1,000**
- Core catalog: **< 100 KB gzip**
- Search index: deferred until text search

## Next migration boundary

The next likely runtime boundary after v5 is static per-Pattern HTML shells for richer OG/social sharing and search indexing. That should be build-generated while keeping the same Full Detail JSON source.
