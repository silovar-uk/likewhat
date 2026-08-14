# Like What? — Product Plan v5

## Product thesis

Like What? turns a vague request such as “Apple-like”, “MUJI-like”, “university-like” or “make the 404 feel playful” into reusable design principles.

**The library is the entrance; design principles are the exit.**

The product is no longer organized around Brand only. It supports five entry kinds:

1. Brand
2. Artist
3. Institution
4. Scene
5. Industry Cluster

Hierarchy:

`Library → Entry → Pattern / Era / State Variation → Design Principle`

## Primary jobs

### Find
Use Facets and Search to locate a useful reference without knowing its exact brand name.

### Understand
Use Pattern Detail, Vocabulary and Design Space to understand why the reference works.

### Compare
Use Contrast, Nearest, Opposite and Within-context / Across-world views to make trade-offs explicit.

### Compose
Combine an Identity reference with a Scene such as Loading / Error / Success and produce an implementation brief.

### Discover
Use bounded Collision / Far Apart / Weird Combination modes for serendipity without blocking the main thread.

## Information architecture

Primary navigation:

- Library
- Design Map
- Vocabulary
- Contrast
- Coverage

TOP library state:

`q / kind / brand / scene / domain / medium / part / sort / seed`

All active filters are independent and shareable through the URL.

## Facets

Do not maintain SaaS-era Pattern categories as a fixed hand-authored list.

Derive useful Facets from runtime data:

- Entry kind
- Scene
- Domain
- Medium
- UI Part
- Brand / Collection

Hide a facet when it has no meaningful variation in the current result set.

## Scene lifecycle

Scene is organized by user time:

- Before: Onboarding
- During: Loading
- Outcome: Empty / Success / Error
- Recovery: 404

Add future Scene patterns to coverage gaps first: Auth, Permission, Search, Upload, Processing, Offline, Retry, Undo, Maintenance and Sold Out are higher-value gaps than adding many decorative 404 variants.

## Data policy

Every Pattern requires:

- id / entryKind
- name / family / oneLiner / description
- visual principles
- useCases / avoid
- prompt
- sourceLabel / sourceUrl
- Design Space values

Relations are computed by default and optionally curated. Curated relation ids must resolve to real Pattern ids.

## Provenance policy

Generated Full Detail records expose:

- sourceType
- checkedAt
- observed
- editorialInference

Never pretend build time is fact-check time. `checkedAt` stays null until deliberately researched.

## Performance policy

TOP should not load long-form Pattern details.

Runtime split:

- `catalog-core.json` for Library / Map / Facets
- `search-index.json` only on first textual search
- one Detail JSON when a Pattern is opened
- collection Details only for multi-Pattern collection views

Collision algorithms must use bounded candidate generation rather than enumerating all n³ triples.

## Growth rule

Expansion is evaluated by explanatory coverage, not card count.

`Coverage → Expansion → Delta → Next Coverage`

A new reference should improve spatial, conceptual, contextual, Scene-lifecycle or contrast coverage.
