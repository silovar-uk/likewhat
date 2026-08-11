# Performance Architecture

Like What? is designed to keep the top page responsive as the reference library grows.

The core rule is:

> Library size must not directly determine initial top-page cost.

## Progressive loading

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

## Performance budget

The current top-page budget is defined in `catalog-index.js` and checked by `top-bootstrap.js`.

- Initial Pattern detail scripts: **0**
- Initial full previews: **0**
- Initial Diversity calculations: **0**
- Initial DOM nodes: **≤ 1,000**
- Compact catalog target: **< 100 KB compressed / encoded transfer**

Runtime diagnostics are exposed as:

```js
window.LikeWhatPerformanceBudget
window.LikeWhatInitialBudget
window.LikeWhatLoadMetrics
```

`LikeWhatLoadMetrics.reason` records why the deferred library was loaded, such as `viewport`, `search-input`, `collision`, `query-param` or `anchor`.

## Current split

`catalog-index.js` is deliberately tiny. It contains only global catalog metadata, bundle membership and performance budgets.

The detailed library remains in the existing Pattern source files for now, but those files are no longer part of the initial top-page request.

This is the first migration step toward:

```text
catalog index
    ↓
brand / artist manifest
    ↓
pattern detail
```

## Next migration boundary

When deferred library loading itself becomes noticeably slow, the next step is not another DOM optimization.

Split Pattern source into generated outputs:

- lightweight per-reference catalog records
- Brand / Artist manifests
- on-demand Pattern detail JSON

At that point, search and sorting can run entirely from compact catalog records and a Pattern detail file will be fetched only when its detail page is opened.

## Editorial constraint

Performance optimizations must preserve the current information architecture:

`Brand / Artist / Industry Cluster → Pattern / Era / Variation → Design Principle`

Do not solve performance by flattening Brand / Artist grouping or deleting explanatory metadata from the source library.
