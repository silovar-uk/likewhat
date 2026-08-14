(function(){
  const root=document.getElementById('patternPage');
  const id=new URLSearchParams(location.search).get('id');
  const started=performance.now();
  function script(src,attrs={}){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${src}`));document.body.appendChild(el);});}
  async function json(url){const response=await fetch(url,{cache:'default'});if(!response.ok)throw new Error(`${response.status} ${url}`);return response.json();}
  function notFound(){document.title='Pattern not found — Like What?';root.innerHTML='<section class="not-found"><h1>Pattern not found.</h1><p>指定された参照は現在のLibraryにありません。</p><a href="./#patterns">Libraryへ戻る</a></section>';}
  async function boot(){
    if(!id){notFound();return;}
    root.innerHTML='<section class="pattern-loading"><p class="eyebrow">PATTERN DETAIL</p><h1>Loading one reference…</h1><p>詳細データは、このPatternだけ取得しています。</p></section>';
    const catalog=await json('generated/catalog-core.json');
    const record=catalog.records.find(item=>item.id===id);if(!record){notFound();return;}
    const detail=await json(`generated/patterns/${encodeURIComponent(record.detailFile)}`);
    window.LIKEWHAT_PATTERNS=catalog.records.map(item=>item.id===id?detail:{...item});window.LIKEWHAT_PATTERN_DATA={catalog,selected:detail};
    await script('taxonomy.js');await script('design-space.js');await script('entry-kinds.js');await script('vocabulary.js');await script('ui.js');
    for(const src of ['ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-wave5.js','ui-eyewear.js'])await script(src);
    await script('ui-idols.js',{'data-load-expansion':'false'});await script('ui-idols2.js');await script('ui-preview-contract.js');
    await script('pattern.js');await script('cluster-detail.js');await script('pattern-idol.js');await script('brand-links.js');await script('discovery-v2.js');await script('context-neighbors.js');await script('pattern-tools.js');
    window.LikeWhatPatternLoadMetrics={selectedId:id,referenceCount:catalog.referenceCount,fullDetailRecords:1,compactRecords:catalog.records.length-1,durationMs:Math.round(performance.now()-started),runtimeCatalog:'generated/catalog-core.json'};
    window.dispatchEvent(new CustomEvent('likewhat:pattern-ready',{detail:window.LikeWhatPatternLoadMetrics}));
  }
  boot().catch(error=>{console.error('[Like What?] pattern bootstrap failed',error);root.innerHTML='<section class="not-found"><h1>Pattern could not load.</h1><p>詳細データの読み込みに失敗しました。</p><a href="./#patterns">Libraryへ戻る</a></section>';});
})();
