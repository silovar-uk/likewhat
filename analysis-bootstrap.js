(function(){
  const page=document.body.dataset.analysisPage||'';
  const started=performance.now();
  function script(src,attrs={}){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${src}`));document.body.appendChild(el);});}
  async function json(url){const response=await fetch(url,{cache:'default'});if(!response.ok)throw new Error(`${response.status} ${url}`);return response.json();}
  async function loadPreviewStack(){await script('ui.js');for(const src of ['ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-wave5.js','ui-wave6.js','ui-tv.js','ui-eyewear.js'])await script(src);await script('ui-idols.js',{'data-load-expansion':'false'});await script('ui-idols2.js');await script('ui-preview-contract.js');}
  async function boot(){
    const catalog=await json('generated/catalog-core.json');
    window.LIKEWHAT_PATTERNS=catalog.records;window.LIKEWHAT_ANALYSIS_DATA={catalog,page};
    await script('nav-v5.js');await script('design-space.js');await script('entry-kinds.js');await script('vocabulary.js');
    if(page==='map'){
      await loadPreviewStack();await script('map.js');
    }else if(page==='vocabulary'){
      await loadPreviewStack();await script('vocabulary-page.js');
    }else if(page==='compare'){
      const cache=new Map();window.LikeWhatDetailStore={async get(id){if(cache.has(id))return cache.get(id);const record=catalog.records.find(p=>p.id===id);if(!record)throw new Error(`Unknown pattern ${id}`);const promise=json(`generated/patterns/${encodeURIComponent(record.detailFile)}`).then(detail=>{const index=window.LIKEWHAT_PATTERNS.findIndex(p=>p.id===id);if(index>=0)window.LIKEWHAT_PATTERNS[index]=detail;return detail;});cache.set(id,promise);return promise;},size(){return cache.size;}};
      await loadPreviewStack();await script('micro-details.js');await script('compare.js');
    }else if(page==='coverage'){
      const history=await json('generated/history/wave3.json');window.LIKEWHAT_COVERAGE_DELTA=history;const current=window.LIKEWHAT_PATTERNS;window.LIKEWHAT_PATTERNS=history.after;window.LIKEWHAT_WAVES={wave3:{ids:history.waveIds,label:history.label}};await script('coverage-delta.js');window.LIKEWHAT_PATTERNS=current;await script('coverage.js');
    }else throw new Error(`Unknown analysis page ${page}`);
    window.LikeWhatAnalysisLoadMetrics={page,referenceCount:catalog.referenceCount,fullDetailRecords:page==='compare'?(window.LikeWhatDetailStore?.size?.()||0):0,durationMs:Math.round(performance.now()-started),runtimeCatalog:'generated/catalog-core.json'};
    window.dispatchEvent(new CustomEvent('likewhat:analysis-ready',{detail:window.LikeWhatAnalysisLoadMetrics}));
  }
  boot().catch(error=>{console.error('[Like What?] analysis bootstrap failed',error);document.querySelector('main')?.insertAdjacentHTML('afterbegin','<section class="not-found"><h1>Analysis could not load.</h1><p>分析用カタログの読み込みに失敗しました。</p><a href="./">TOPへ戻る</a></section>');});
})();