(function(){
  const browser=document.getElementById('patterns');
  const input=document.getElementById('searchInput');
  const randomDraw=document.getElementById('randomDraw');
  const randomModes=document.getElementById('randomModes');
  const examples=document.querySelector('.query-examples');
  const resultCount=document.getElementById('resultCount');
  const groups=document.getElementById('patternGroups');
  let loading=null;
  let pendingAction=null;

  const budgets={
    initialPatternDetailData:0,
    initialPreviewRendering:0,
    initialDiversityCalculations:0,
    catalogTargetGzipKB:100,
    initialDomNodes:1000
  };
  window.LikeWhatPerformanceBudget=budgets;

  function script(src,attrs={}){
    return new Promise((resolve,reject)=>{
      const el=document.createElement('script');
      el.src=src;
      Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));
      el.onload=()=>resolve(el);
      el.onerror=()=>reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(el);
    });
  }

  async function loadData(){
    await script('patterns.js');
    await Promise.all([
      'patterns-extra.js','patterns-wave1.js','patterns-wave2.js','patterns-wave3.js','patterns-wave4.js','patterns-eyewear.js','patterns-idols.js','patterns-idols2.js'
    ].map(src=>script(src)));
  }

  async function loadCore(){
    await script('taxonomy.js');
    await script('design-space.js');
    await script('library-groups.js');
    await script('vocabulary.js');
  }

  async function loadRenderers(){
    await script('ui.js');
    for(const src of ['ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-eyewear.js'])await script(src);
    await script('ui-idols.js',{'data-load-expansion':'false'});
    await script('ui-idols2.js');
    await script('ui-preview-contract.js');
    await script('top-performance.js');
  }

  async function loadControllers(){
    await script('app.js');
    for(const src of ['cluster-brand-filter.js','brand-links.js','group-official-links.js','discovery-v2.js','group-sort.js'])await script(src);
  }

  function showLoading(){
    if(resultCount)resultCount.textContent='Library data · loading only when needed';
    if(groups&&!groups.querySelector('.library-loading-note'))groups.innerHTML='<div class="library-loading-note">Loading the reference catalog…</div>';
  }

  function loadLibrary(reason='viewport'){
    if(window.LIKEWHAT_LIBRARY_READY)return Promise.resolve();
    if(loading)return loading;
    showLoading();
    document.documentElement.dataset.libraryLoadReason=reason;
    const started=performance.now();
    loading=(async()=>{
      await loadData();
      await loadCore();
      await loadRenderers();
      await loadControllers();
      window.LIKEWHAT_LIBRARY_READY=true;
      window.LikeWhatLoadMetrics={reason,durationMs:Math.round(performance.now()-started),patterns:(window.LIKEWHAT_PATTERNS||[]).length,budgets};
      window.dispatchEvent(new CustomEvent('likewhat:library-ready',{detail:window.LikeWhatLoadMetrics}));
      const action=pendingAction;pendingAction=null;action?.();
    })().catch(error=>{
      console.error('[Like What?] deferred library load failed',error);
      if(resultCount)resultCount.textContent='Library failed to load · reload to retry';
      throw error;
    });
    return loading;
  }

  function deferAction(reason,action){
    if(window.LIKEWHAT_LIBRARY_READY){action();return;}
    pendingAction=action;
    loadLibrary(reason);
  }

  if(new URLSearchParams(location.search).get('q'))loadLibrary('query-param');
  if(location.hash==='#patterns')loadLibrary('anchor');

  if(browser&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();
      loadLibrary('viewport');
    },{rootMargin:'300px 0px'});
    observer.observe(browser);
  }else if(browser){
    loadLibrary('fallback');
  }

  input?.addEventListener('input',()=>loadLibrary('search-input'),{once:true});
  input?.addEventListener('focus',()=>{
    if(input.value.trim())loadLibrary('search-focus');
  },{once:true});
  examples?.addEventListener('click',event=>{
    const button=event.target.closest('[data-query]');
    if(!button)return;
    event.preventDefault();
    const q=button.dataset.query||'';
    if(input){input.value=q;input.focus();}
    deferAction('query-example',()=>button.click());
  },true);
  randomDraw?.addEventListener('click',event=>{
    if(window.LIKEWHAT_LIBRARY_READY)return;
    event.preventDefault();event.stopImmediatePropagation();
    deferAction('collision',()=>randomDraw.click());
  },true);
  randomModes?.addEventListener('click',event=>{
    if(window.LIKEWHAT_LIBRARY_READY)return;
    const button=event.target.closest('[data-random-mode]');if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    deferAction('collision-mode',()=>button.click());
  },true);

  document.addEventListener('keydown',event=>{
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
      input?.focus();input?.select();
    }
  });
})();
