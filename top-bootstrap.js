(function(){
  const browser=document.getElementById('patterns');
  const input=document.getElementById('searchInput');
  const randomDraw=document.getElementById('randomDraw');
  const randomModes=document.getElementById('randomModes');
  const examples=document.querySelector('.query-examples');
  const resultCount=document.getElementById('resultCount');
  const groups=document.getElementById('patternGroups');
  const catalogMeta=window.LIKEWHAT_CATALOG||{};
  let loading=null;
  let pendingAction=null;

  const budgets=catalogMeta.performanceBudget||{
    initialPatternDetailData:0,
    initialPreviewRendering:0,
    initialDiversityCalculations:0,
    initialDomNodes:1000
  };
  window.LikeWhatPerformanceBudget=budgets;

  function script(src,attrs={}){
    return new Promise((resolve,reject)=>{
      const el=document.createElement('script');el.src=src;
      Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));
      el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(el);
    });
  }
  async function json(url){
    const response=await fetch(url,{cache:'default'});
    if(!response.ok)throw new Error(`${response.status} ${url}`);
    return response.json();
  }
  function stylesheet(href){
    if(document.querySelector(`link[href="${href}"]`))return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const el=document.createElement('link');el.rel='stylesheet';el.href=href;
      el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${href}`));document.head.appendChild(el);
    });
  }

  async function loadStyles(){
    await Promise.all([
      'styles-wave1.css','styles-wave2.css','styles-wave3.css','styles-wave4.css','styles-wave5.css','styles-eyewear.css','styles-idols.css','styles-idols2.css',
      'styles-preview-contract.css','styles-group-preview.css','styles-library-grid.css','styles-brand-links.css','styles-group-official.css','styles-discovery-v2.css'
    ].map(stylesheet));
  }

  async function loadData(){
    const [meta,catalog]=await Promise.all([json('generated/meta.json'),json('generated/catalog-core.json')]);
    window.LIKEWHAT_LIBRARY_META=meta;
    window.LIKEWHAT_GENERATED_CATALOG=catalog;
    window.LIKEWHAT_PATTERNS=catalog.records.map(record=>({
      ...record,
      description:'',
      members:(record.clusterMembers||[]).map(member=>({...member}))
    }));

    const heroCount=document.getElementById('heroReferenceCount');
    if(heroCount)heroCount.textContent=`${meta.referenceCount} references · ${meta.designSpaceAxes||6} axes`;

    let searchPromise=null;
    let searchMap=null;
    window.LikeWhatSearchStore={
      get ready(){return !!searchMap;},
      text(id){return searchMap?.get(id)||'';},
      ensure(){
        if(searchMap)return Promise.resolve(searchMap);
        if(searchPromise)return searchPromise;
        searchPromise=json('generated/search-index.json').then(index=>{
          searchMap=new Map((index.records||[]).map(record=>[record.id,record.text||'']));
          window.dispatchEvent(new CustomEvent('likewhat:search-index-ready',{detail:{referenceCount:index.referenceCount}}));
          return searchMap;
        }).catch(error=>{searchPromise=null;throw error;});
        return searchPromise;
      }
    };
    return {meta,catalog};
  }

  async function loadCore(){
    await script('design-space.js');
    await script('entry-kinds.js');
    await script('library-groups.js');
    await script('vocabulary.js');
  }
  async function loadRenderers(){
    await script('ui.js');
    for(const src of ['ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-wave5.js','ui-eyewear.js'])await script(src);
    await script('ui-idols.js',{'data-load-expansion':'false'});
    await script('ui-idols2.js');
    await script('ui-preview-contract.js');
    await script('top-performance.js');
  }
  async function loadControllers(){
    await script('app.js');
    for(const src of ['cluster-brand-filter.js','brand-links.js','group-official-links.js','group-sort.js'])await script(src);
  }

  function initialBudgetSnapshot(){
    const scripts=[...document.scripts].map(s=>s.getAttribute('src')||'').filter(Boolean);
    const detailScripts=scripts.filter(src=>/^patterns(?:-|\.)|^ui-(?:wave|eyewear|idols)/.test(src));
    const previews=document.querySelectorAll('.mini-ui').length;
    const domNodes=document.getElementsByTagName('*').length;
    const checks={
      initialPatternDetailData:{value:detailScripts.length,limit:budgets.initialPatternDetailData,pass:detailScripts.length<=budgets.initialPatternDetailData},
      initialPreviewRendering:{value:previews,limit:budgets.initialPreviewRendering,pass:previews<=budgets.initialPreviewRendering},
      initialDiversityCalculations:{value:0,limit:budgets.initialDiversityCalculations,pass:true},
      initialDomNodes:{value:domNodes,limit:budgets.initialDomNodes,pass:domNodes<=budgets.initialDomNodes}
    };
    window.LikeWhatInitialBudget={checkedAt:performance.now(),checks,pass:Object.values(checks).every(x=>x.pass)};
    if(!window.LikeWhatInitialBudget.pass)console.warn('[Like What?] initial performance budget exceeded',window.LikeWhatInitialBudget);
  }
  function showLoading(){
    if(resultCount)resultCount.textContent='Core catalog · loading only what this view needs';
    if(groups&&!groups.querySelector('.library-loading-note'))groups.innerHTML='<div class="library-loading-note">Loading the core reference catalog…</div>';
  }

  function loadLibrary(reason='viewport'){
    if(window.LIKEWHAT_LIBRARY_READY)return Promise.resolve();
    if(loading)return loading;
    showLoading();document.documentElement.dataset.libraryLoadReason=reason;
    const started=performance.now();
    loading=(async()=>{
      const [,data]=await Promise.all([loadStyles(),loadData()]);
      await loadCore();await loadRenderers();await loadControllers();
      window.LIKEWHAT_LIBRARY_READY=true;
      window.LikeWhatLoadMetrics={
        reason,durationMs:Math.round(performance.now()-started),patterns:(window.LIKEWHAT_PATTERNS||[]).length,fullDetailRecords:0,
        catalogSchema:data.catalog.schemaVersion,runtimePatternSource:'generated/catalog-core.json',searchIndexLoaded:window.LikeWhatSearchStore?.ready||false,budgets
      };
      window.dispatchEvent(new CustomEvent('likewhat:library-ready',{detail:window.LikeWhatLoadMetrics}));
      const action=pendingAction;pendingAction=null;action?.();
    })().catch(error=>{
      console.error('[Like What?] deferred library load failed',error);
      if(resultCount)resultCount.textContent='Library failed to load · reload to retry';
      throw error;
    });
    return loading;
  }
  function deferAction(reason,action){if(window.LIKEWHAT_LIBRARY_READY){action();return;}pendingAction=action;loadLibrary(reason);}

  initialBudgetSnapshot();requestAnimationFrame(initialBudgetSnapshot);
  const params=new URLSearchParams(location.search);
  if([...params.keys()].some(key=>['q','kind','brand','scene','domain','medium','part','sort'].includes(key)))loadLibrary('query-param');
  if(location.hash==='#patterns')loadLibrary('anchor');

  if(browser&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();loadLibrary('viewport');},{rootMargin:'300px 0px'});
    observer.observe(browser);
  }else if(browser)loadLibrary('fallback');

  input?.addEventListener('input',()=>loadLibrary('search-input'),{once:true});
  input?.addEventListener('focus',()=>{if(input.value.trim())loadLibrary('search-focus');},{once:true});
  examples?.addEventListener('click',event=>{
    const button=event.target.closest('[data-query]');if(!button)return;
    if(window.LIKEWHAT_LIBRARY_READY)return;
    event.preventDefault();event.stopImmediatePropagation();
    const q=button.dataset.query||'';if(input){input.value=q;input.focus();}
    deferAction('query-example',()=>button.click());
  },true);
  randomDraw?.addEventListener('click',event=>{if(window.LIKEWHAT_LIBRARY_READY)return;event.preventDefault();event.stopImmediatePropagation();deferAction('collision',()=>randomDraw.click());},true);
  randomModes?.addEventListener('click',event=>{if(window.LIKEWHAT_LIBRARY_READY)return;const button=event.target.closest('[data-random-mode]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();deferAction('collision-mode',()=>button.click());},true);
  document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();input?.focus();input?.select();}});
})();
