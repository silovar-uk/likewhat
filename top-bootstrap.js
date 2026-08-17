(function(){
  const browser=document.getElementById('patterns');
  const composer=document.querySelector('.composer');
  const input=document.getElementById('searchInput');
  const randomDraw=document.getElementById('randomDraw');
  const randomModes=document.getElementById('randomModes');
  const examples=document.querySelector('.query-examples');
  const resultCount=document.getElementById('resultCount');
  const groups=document.getElementById('patternGroups');
  const railNav=document.querySelector('.site-header nav');
  const catalogMeta=window.LIKEWHAT_CATALOG||{};
  const bootstrapVersion=(()=>{try{return new URL(document.currentScript?.src||location.href).searchParams.get('v')||'';}catch{return '';}})();
  const versioned=url=>bootstrapVersion&&!/[?]/.test(url)?`${url}?v=${encodeURIComponent(bootstrapVersion)}`:url;
  let loading=null;
  let pendingAction=null;

  const budgets=catalogMeta.performanceBudget||{initialPatternDetailData:0,initialPreviewRendering:0,initialDiversityCalculations:0,initialDomNodes:1000};
  window.LikeWhatPerformanceBudget=budgets;

  // 訪問状態(初見/再訪/作業中)の判定。workbench.jsのlocalStorageキーを
  // そのまま読む(exportされていないため文字列を直接参照。キー自体は
  // workbench.js側で変更していない)。同期実行し、初回ペイントの前に
  // body[data-visit-state]を確定させ、ちらつきを避ける。
  function detectVisitState(){
    const safeParse=(raw,fallback)=>{try{const v=JSON.parse(raw||'');return v??fallback;}catch{return fallback;}};
    let recent=[],projects={};
    try{
      recent=safeParse(localStorage.getItem('lw:wb:recent:v1'),[]);
      projects=safeParse(localStorage.getItem('lw:wb:projects:v1'),{});
    }catch{/* localStorage無効環境は初見扱いにフォールバック */}
    const hasSaved=projects&&typeof projects==='object'&&Object.values(projects).some(list=>Array.isArray(list)&&list.length>0);
    if(hasSaved)return'working';
    if(Array.isArray(recent)&&recent.length>0)return'returning';
    return'first-time';
  }
  const visitState=detectVisitState();
  document.body.dataset.visitState=visitState;
  window.LikeWhatVisitState=visitState;

  function setupRandomRailButton(){
    if(!railNav||railNav.querySelector('.lw-nav-random')||!randomDraw)return;
    const button=document.createElement('button');
    button.type='button';
    button.className='lw-nav-random';
    button.setAttribute('aria-label','全ライブラリからランダムに3件引く');
    button.innerHTML='<span class="lw-nav-index" aria-hidden="true"></span><span>Random 3</span>';
    const external=[...railNav.querySelectorAll('a')].find(link=>link.target==='_blank'||link.classList.contains('lw-external'));
    railNav.insertBefore(button,external||null);
    [...railNav.querySelectorAll('a, .lw-nav-random')].forEach((item,index)=>{
      let number=item.querySelector('.lw-nav-index');
      if(!number){number=document.createElement('span');number.className='lw-nav-index';number.setAttribute('aria-hidden','true');item.prepend(number);}
      number.textContent=String(index+1).padStart(2,'0');
    });
    if(!document.getElementById('lw-random-rail-style')){
      const style=document.createElement('style');
      style.id='lw-random-rail-style';
      style.textContent=`
        .site-header nav .lw-nav-random{appearance:none;font:inherit;text-align:left;cursor:pointer}
        @media (min-width:1024px){
          .site-header.site-header nav .lw-nav-random{display:flex;align-items:center;min-height:46px;padding:10px 12px;border:1px solid rgb(215 255 73 / 24%);border-radius:10px;background:rgb(215 255 73 / 7%);color:#e8ff91;font-size:13px;font-weight:650;transition:background .16s ease,color .16s ease,transform .16s ease}
          .site-header.site-header nav .lw-nav-random:hover{background:rgb(215 255 73 / 14%);color:#f3ffbd;transform:translateX(2px)}
          .site-header.site-header nav .lw-nav-random .lw-nav-index{color:#a7b85d}
        }
        @media (max-width:1023px){
          .site-header.site-header nav .lw-nav-random{display:flex;width:100%;align-items:center;min-height:48px;padding:11px 14px;border:1px solid rgb(215 255 73 / 24%);border-radius:10px;background:rgb(215 255 73 / 8%);color:inherit;font-size:13px;font-weight:700}
        }
      `;
      document.head.appendChild(style);
    }
    button.addEventListener('click',()=>{
      if(window.LIKEWHAT_LIBRARY_READY)document.querySelector('[data-random-mode="random"]')?.click();
      randomDraw.click();
    });
  }

  function script(src,attrs={}){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=versioned(src);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${src}`));document.body.appendChild(el);});}
  async function json(url){const response=await fetch(versioned(url),{cache:'default'});if(!response.ok)throw new Error(`${response.status} ${url}`);return response.json();}
  function stylesheet(href,beforeNode=null){const target=versioned(href);if(document.querySelector(`link[href="${target}"]`)||document.querySelector(`link[href="${href}"]`))return Promise.resolve();return new Promise((resolve,reject)=>{const el=document.createElement('link');el.rel='stylesheet';el.href=target;el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${href}`));if(beforeNode?.parentNode)beforeNode.parentNode.insertBefore(el,beforeNode);else document.head.appendChild(el);});}
  async function loadStyles(){const shell=document.querySelector('link[href^="styles-shell-v2.css"]');await Promise.all(['styles-wave1.css','styles-wave2.css','styles-wave3.css','styles-wave4.css','styles-wave5.css','styles-wave6.css','styles-eyewear.css','styles-idols.css','styles-idols2.css','styles-preview-contract.css','styles-group-preview.css','styles-library-grid.css','styles-brand-links.css','styles-group-official.css','styles-discovery-v2.css'].map(href=>stylesheet(href,shell)));if(!document.querySelector('link[href^="styles-ui-polish.css"]'))await stylesheet('styles-ui-polish.css?v=20260815-ui3');}

  async function loadData(){
    const [meta,catalog]=await Promise.all([json('generated/meta.json'),json('generated/catalog-core.json')]);
    window.LIKEWHAT_LIBRARY_META=meta;window.LIKEWHAT_GENERATED_CATALOG=catalog;
    window.LIKEWHAT_PATTERNS=catalog.records.map(record=>({...record,description:'',members:(record.clusterMembers||[]).map(member=>({...member}))}));
    const heroCount=document.getElementById('heroReferenceCount');if(heroCount)heroCount.textContent=`${meta.referenceCount} references · ${meta.designSpaceAxes||6} axes`;
    let searchPromise=null,searchMap=null;
    window.LikeWhatSearchStore={
      get ready(){return !!searchMap;},text(id){return searchMap?.get(id)||'';},
      ensure(){if(searchMap)return Promise.resolve(searchMap);if(searchPromise)return searchPromise;searchPromise=json('generated/search-index.json').then(index=>{searchMap=new Map((index.records||[]).map(record=>[record.id,record.text||'']));window.dispatchEvent(new CustomEvent('likewhat:search-index-ready',{detail:{referenceCount:index.referenceCount}}));return searchMap;}).catch(error=>{searchPromise=null;throw error;});return searchPromise;}
    };
    return {meta,catalog};
  }
  async function loadCore(){await script('design-space.js');await script('lens.js');await script('entry-kinds.js');await script('library-groups.js');await script('vocabulary.js');}
  async function loadRenderers(){await script('ui.js');for(const src of ['ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-wave5.js','ui-wave6.js','ui-tv.js','ui-eyewear.js'])await script(src);await script('ui-idols.js',{'data-load-expansion':'false'});await script('ui-idols2.js');await script('ui-preview-contract.js');await script('top-performance.js');}
  async function loadControllers(){await script('app.js');for(const src of ['brand-links.js','group-official-links.js','group-sort.js','library-memory.js'])await script(src);}

  function initialBudgetSnapshot(){
    const scripts=[...document.scripts].map(s=>s.getAttribute('src')||'').filter(Boolean);const detailScripts=scripts.filter(src=>/^patterns(?:-|\.)|^ui-(?:wave|eyewear|idols)/.test(src));const previews=document.querySelectorAll('.mini-ui').length;const domNodes=document.getElementsByTagName('*').length;
    const checks={initialPatternDetailData:{value:detailScripts.length,limit:budgets.initialPatternDetailData,pass:detailScripts.length<=budgets.initialPatternDetailData},initialPreviewRendering:{value:previews,limit:budgets.initialPreviewRendering,pass:previews<=budgets.initialPreviewRendering},initialDiversityCalculations:{value:0,limit:budgets.initialDiversityCalculations,pass:true},initialDomNodes:{value:domNodes,limit:budgets.initialDomNodes,pass:domNodes<=budgets.initialDomNodes}};
    window.LikeWhatInitialBudget={checkedAt:performance.now(),checks,pass:Object.values(checks).every(x=>x.pass)};if(!window.LikeWhatInitialBudget.pass)console.warn('[Like What?] initial performance budget exceeded',window.LikeWhatInitialBudget);
  }
  function showLoading(){if(resultCount)resultCount.textContent='Core catalog · loading only what this view needs';if(groups&&!groups.querySelector('.library-loading-note'))groups.innerHTML='<div class="library-loading-note">Loading the core reference catalog…</div>';}
  function loadLibrary(reason='viewport'){
    if(window.LIKEWHAT_LIBRARY_READY)return Promise.resolve();if(loading)return loading;showLoading();document.documentElement.dataset.libraryLoadReason=reason;const started=performance.now();
    loading=(async()=>{const [,data]=await Promise.all([loadStyles(),loadData()]);await loadCore();await loadRenderers();await loadControllers();window.LIKEWHAT_LIBRARY_READY=true;window.LikeWhatLoadMetrics={reason,durationMs:Math.round(performance.now()-started),patterns:(window.LIKEWHAT_PATTERNS||[]).length,fullDetailRecords:0,catalogSchema:data.catalog.schemaVersion,runtimePatternSource:'generated/catalog-core.json',searchIndexLoaded:window.LikeWhatSearchStore?.ready||false,budgets};window.dispatchEvent(new CustomEvent('likewhat:library-ready',{detail:window.LikeWhatLoadMetrics}));const action=pendingAction;pendingAction=null;action?.();})().catch(error=>{console.error('[Like What?] deferred library load failed',error);if(resultCount)resultCount.textContent='Library failed to load · reload to retry';throw error;});return loading;
  }
  function deferAction(reason,action){if(window.LIKEWHAT_LIBRARY_READY){action();return;}pendingAction=action;loadLibrary(reason);}

  setupRandomRailButton();
  initialBudgetSnapshot();requestAnimationFrame(initialBudgetSnapshot);
  const params=new URLSearchParams(location.search);if([...params.keys()].some(key=>['q','kind','brand','scene','domain','medium','part','sort'].includes(key)))loadLibrary('query-param');if(location.hash==='#patterns')loadLibrary('anchor');
  const observeTargets=[composer,browser].filter(Boolean);
  if(observeTargets.length&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{const hit=entries.find(entry=>entry.isIntersecting);if(!hit)return;observer.disconnect();loadLibrary(hit.target===composer?'composer-viewport':'viewport');},{rootMargin:'300px 0px'});observeTargets.forEach(target=>observer.observe(target));}else if(browser||composer)loadLibrary('fallback');
  input?.addEventListener('input',()=>loadLibrary('search-input'),{once:true});input?.addEventListener('focus',()=>{if(input.value.trim())loadLibrary('search-focus');},{once:true});
  examples?.addEventListener('click',event=>{const button=event.target.closest('[data-query]');if(!button||window.LIKEWHAT_LIBRARY_READY)return;event.preventDefault();event.stopImmediatePropagation();const q=button.dataset.query||'';if(input){input.value=q;input.focus();}deferAction('query-example',()=>button.click());},true);
  randomDraw?.addEventListener('click',event=>{if(window.LIKEWHAT_LIBRARY_READY)return;event.preventDefault();event.stopImmediatePropagation();deferAction('collision',()=>randomDraw.click());},true);
  randomModes?.addEventListener('click',event=>{if(window.LIKEWHAT_LIBRARY_READY)return;const button=event.target.closest('[data-random-mode]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();deferAction('collision-mode',()=>button.click());},true);

  if(params.get('random3')==='1'&&randomDraw){
    deferAction('rail-random3',()=>{
      document.querySelector('[data-random-mode="random"]')?.click();
      randomDraw.click();
      const clean=new URL(location.href);
      clean.searchParams.delete('random3');
      history.replaceState(null,'',`${clean.pathname}${clean.search}${clean.hash}`);
    });
  }

  document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();input?.focus();input?.select();}});
})();