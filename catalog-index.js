window.LIKEWHAT_CATALOG={
  schemaVersion:2,
  referenceCount:104,
  entryKinds:['brand','artist','industry-cluster'],
  exploration:{axes:6,lenses:['Design Map','Vocabulary','Contrast','Coverage']},
  runtime:{
    source:'generated/catalog.json',
    fullDetailRecordsOnTop:0,
    searchIndex:'precomputed searchText',
    clusterSummary:'clusterMembers'
  },
  deferredBundles:{
    data:['generated/catalog.json'],
    analysis:['design-space.js','library-groups.js','vocabulary.js'],
    renderers:['ui.js','ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-eyewear.js','ui-idols.js','ui-idols2.js','ui-preview-contract.js'],
    controllers:['top-performance.js','app.js','cluster-brand-filter.js','brand-links.js','group-official-links.js','discovery-v2.js','group-sort.js']
  },
  performanceBudget:{
    initialPatternDetailData:0,
    initialPreviewRendering:0,
    initialDiversityCalculations:0,
    catalogTargetGzipKB:100,
    initialDomNodes:1000
  }
};
