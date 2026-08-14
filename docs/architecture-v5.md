# Like What? — Architecture v5

## Product model

Like What? is a design-reference library, not a brand gallery.

Top-level entry kinds:

- Brand
- Artist
- Institution
- Scene
- Industry Cluster

Every entry resolves to one or more reusable Patterns, and every Pattern resolves to design principles.

`Library → Entry → Pattern → Principle`

Scene is a transversal lens rather than a fake brand. It can be combined with another entry kind in the library state.

## Library state

The TOP library uses one shareable state model:

```text
q / kind / brand / scene / domain / medium / part / sort / seed
```

Filters are independent and URL-synchronized. A Scene filter must never be implemented by overwriting the search query.

## Runtime data

Build-time editorial source remains `patterns*.js`, discovered automatically.

Generated runtime data is split by task:

```text
generated/meta.json
generated/catalog-core.json
generated/search-index.json
generated/patterns/<id>.json
generated/brands/*.json
generated/history/wave3.json
```

- Core catalog: grouping, facets, Design Space, routing and previews.
- Search index: normalized long-form search corpus, loaded only on first real search.
- Detail: one Full Detail record per Pattern.
- Meta: counts, entry kinds, Scene lifecycle and source-file inventory.

`generated/catalog.json` remains temporarily as a compatibility artifact for pages not yet migrated.

## Relationship model

Relations are `computed by default + curated override`.

- `related`: optional editorial override. Missing is valid.
- `opposites`: optional editorial override. Missing is valid.
- Any declared relation must point to an existing Pattern id.
- Nearest / Farthest / Opposite can be computed from Design Space when no override exists.

## Provenance

Every generated Full Detail record receives a provenance envelope:

- sourceType
- checkedAt
- observed
- editorialInference

`checkedAt` remains null unless explicitly researched. Build time is not silently treated as fact-check time.

## Scene lifecycle

Scene patterns are grouped by user time:

- Before — Onboarding
- During — Loading
- Outcome — Empty / Success / Error
- Recovery — 404

Future Scene additions should fill lifecycle gaps before multiplying variations inside one state.

## Performance

Collision must not enumerate all triples at runtime.

- Far Apart: greedy farthest-point candidates.
- Weird Combination: deterministic bounded sampling plus editorial scoring.
- Diversity stays lazy.
- Core catalog target: <100 KB gzip.
- Search corpus is deferred until a textual search actually needs it.

## Growth rule

Do not add a new Wave merely because examples are available.

Add references when they improve at least one of:

- spatial coverage
- conceptual coverage
- context coverage
- Scene lifecycle coverage
- curated contrast quality
