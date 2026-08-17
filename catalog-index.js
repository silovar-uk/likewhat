window.LIKEWHAT_CATALOG={
  schemaVersion:3,
  metaSource:'generated/meta.json',
  runtime:{
    coreSource:'generated/catalog-core.json',
    searchSource:'generated/search-index.json',
    legacySource:'generated/catalog.json',
    fullDetailRecordsOnTop:0,
    searchIndex:'deferred',
    clusterSummary:'clusterMembers'
  },
  deferredBundles:{
    core:['generated/catalog-core.json'],
    search:['generated/search-index.json'],
    analysis:['design-space.js','entry-kinds.js','library-groups.js','vocabulary.js'],
    renderers:['ui.js','ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-wave5.js','ui-wave6.js','ui-eyewear.js','ui-idols.js','ui-idols2.js','ui-preview-contract.js'],
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

(function(){
  const load=(src,key)=>{
    if(document.querySelector(`script[data-${key}]`))return;
    const script=document.createElement('script');
    script.src=src;
    script.setAttribute(`data-${key}`,'true');
    document.head.appendChild(script);
  };
  load('site-polish.js?v=20260817-polish1','lw-site-polish');
  load('suiyobi-polish.js?v=20260817-suiyobi1','lw-suiyobi-polish');
})();
