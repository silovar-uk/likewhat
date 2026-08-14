(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const ui=window.LikeWhatUI||{};
  const render=ui.render;
  const esc=ui.esc||function(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));};
  const designSpace=window.LikeWhatDesignSpace;
  const groupModel=window.LikeWhatLibraryGroups;
  const entryKinds=window.LikeWhatEntryKinds;
  const meta=window.LIKEWHAT_LIBRARY_META||{};
  const searchStore=window.LikeWhatSearchStore;

  const input=document.getElementById('searchInput');
  const groups=document.getElementById('patternGroups');
  const resultCount=document.getElementById('resultCount');
  const empty=document.getElementById('emptyState');
  const activeFilters=document.getElementById('activeFilters');
  const brandFilters=document.getElementById('brandFilters');
  const brandSummary=document.getElementById('brandFilterSummary');
  const kindFilters=document.getElementById('kindFilters');
  const sceneFilters=document.getElementById('sceneFilters');
  const domainFilters=document.getElementById('domainFilters');
  const mediumFilters=document.getElementById('mediumFilters');
  const partFilters=document.getElementById('partFilters');
  const facetPanel=document.getElementById('facetPanel');
  const randomDraw=document.getElementById('randomDraw');
  const randomResults=document.getElementById('randomResults');
  const randomModes=document.getElementById('randomModes');
  const composerIdentity=document.getElementById('composerIdentity');
  const composerScene=document.getElementById('composerScene');
  const composerBuild=document.getElementById('composerBuild');
  const composerResult=document.getElementById('composerResult');

  if(!patterns.length||!groups||!render)return;

  const validSorts=new Set(['brand','density','exploration','diversity','random']);
  const urlState=()=>{
    const p=new URLSearchParams(location.search);
    return {
      q:p.get('q')||'',kind:p.get('kind')||'All',brand:p.get('brand')||'All',scene:p.get('scene')||'All',domain:p.get('domain')||'All',medium:p.get('medium')||'All',part:p.get('part')||'All',
      sort:validSorts.has(p.get('sort'))?p.get('sort'):'brand',seed:p.get('seed')||String(Date.now()%1000000000)
    };
  };
  let state=urlState();
  let randomMode='random';
  let renderFrame=0;
  let searchToken=0;
  if(input)input.value=state.q;

  const normalize=value=>String(value||'').normalize('NFKC').toLowerCase();
  const unique=items=>[...new Set(items.filter(Boolean))];
  const countBy=items=>items.reduce((map,value)=>(map.set(value,(map.get(value)||0)+1),map),new Map());
  const kindOf=p=>entryKinds?.infer?.(p)||p.entryKind||'brand';
  const kindLabel=kind=>entryKinds?.label?.[kind]||kind;
  const lifecycleFor=scene=>{
    for(const [phase,scenes] of Object.entries(meta.sceneLifecycle||{}))if((scenes||[]).includes(scene))return phase;
    return '';
  };
  const brandMatches=(p,value)=>value==='All'||p.brand===value||(p.memberBrands||[]).includes(value)||(p.clusterMembers||[]).some(m=>m.brand===value);
  const partMatches=(p,value)=>value==='All'||(p.uiParts||[]).some(x=>normalize(x)===normalize(value))||normalize(p.family).includes(normalize(value));

  function coreText(p){
    return normalize([p.brand,p.family,p.name,p.era,p.scene,p.entryKind,p.oneLiner,...(p.tags||[]),...(p.uiParts||[]),p.domain,p.medium,p.archetype,p.interactionModel,...(p.philosophy||[]),...(p.memberBrands||[])].join(' '));
  }
  function queryMatches(p,q){
    const terms=normalize(q).trim().split(/\s+/).filter(Boolean);
    if(!terms.length)return true;
    const text=`${coreText(p)} ${searchStore?.text?.(p.id)||''}`;
    return terms.every(term=>text.includes(term));
  }

  function matches(p,omit=null){
    if(omit!=='q'&&!queryMatches(p,state.q))return false;
    if(omit!=='kind'&&state.kind!=='All'&&kindOf(p)!==state.kind)return false;
    if(omit!=='brand'&&!brandMatches(p,state.brand))return false;
    if(omit!=='scene'&&state.scene!=='All'&&p.scene!==state.scene)return false;
    if(omit!=='domain'&&state.domain!=='All'&&p.domain!==state.domain)return false;
    if(omit!=='medium'&&state.medium!=='All'&&p.medium!==state.medium)return false;
    if(omit!=='part'&&!partMatches(p,state.part))return false;
    return true;
  }
  const filteredPatterns=()=>patterns.filter(p=>matches(p));

  function syncUrl(mode='replace'){
    const next=new URLSearchParams();
    if(state.q)next.set('q',state.q);
    for(const key of ['kind','brand','scene','domain','medium','part'])if(state[key]&&state[key]!=='All')next.set(key,state[key]);
    if(state.sort!=='brand')next.set('sort',state.sort);
    if(state.sort==='random')next.set('seed',state.seed);
    const url=`${location.pathname}${next.toString()?`?${next}`:''}${location.hash}`;
    history[mode==='push'?'pushState':'replaceState'](null,'',url);
  }

  function setState(patch,{historyMode='push',ensureSearch=false}={}){
    state={...state,...patch};
    syncUrl(historyMode);
    if(ensureSearch&&state.q.trim()){
      const token=++searchToken;
      searchStore?.ensure?.().then(()=>{if(token===searchToken)scheduleRender();}).catch(error=>console.warn('[Like What?] search index unavailable',error));
    }
    scheduleRender();
  }

  function facetValues(key){
    const base=patterns.filter(p=>matches(p,key));
    if(key==='kind')return countBy(base.map(kindOf));
    if(key==='brand')return countBy(base.flatMap(p=>[p.brand,...(p.memberBrands||[])]));
    if(key==='scene')return countBy(base.map(p=>p.scene).filter(Boolean));
    if(key==='domain')return countBy(base.map(p=>p.domain).filter(Boolean));
    if(key==='medium')return countBy(base.map(p=>p.medium).filter(Boolean));
    if(key==='part')return countBy(base.flatMap(p=>p.uiParts||[]));
    return new Map();
  }

  function sortedEntries(map,key){
    const order=key==='scene'?(meta.sceneOrder||[]):key==='kind'?(meta.entryKinds||[]):[];
    return [...map.entries()].sort((a,b)=>{
      const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);
      if(ai>=0||bi>=0)return (ai<0?999:ai)-(bi<0?999:bi);
      return b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),'ja');
    });
  }

  function facetButton(key,value,count){
    const active=state[key]===value;
    let label=value;
    if(key==='kind')label=kindLabel(value);
    if(key==='scene'){const phase=lifecycleFor(value);label=phase?`${value} · ${phase}`:value;}
    return `<button type="button" class="part-chip ${active?'active':''}" data-facet="${esc(key)}" data-value="${esc(value)}" aria-pressed="${active}">${esc(label)} <small>${count}</small></button>`;
  }

  function renderFacetRoot(root,key,{limit=18}={}){
    if(!root)return;
    const values=facetValues(key);
    const entries=sortedEntries(values,key).filter(([,count])=>count>0);
    const current=state[key];
    const visible=entries.slice(0,limit);
    if(current!=='All'&&!visible.some(([value])=>value===current)&&values.has(current))visible.unshift([current,values.get(current)]);
    root.innerHTML=facetButton(key,'All',patterns.filter(p=>matches(p,key)).length)+visible.map(([value,count])=>facetButton(key,value,count)).join('');
    const row=root.closest('.facet-row');
    if(row)row.hidden=entries.length<=1&&current==='All';
  }

  function renderBrands(){
    if(!brandFilters)return;
    const entries=sortedEntries(facetValues('brand'),'brand');
    brandFilters.innerHTML=facetButton('brand','All',patterns.filter(p=>matches(p,'brand')).length)+entries.map(([value,count])=>`<button type="button" class="brand-chip ${state.brand===value?'active':''}" data-facet="brand" data-value="${esc(value)}" aria-pressed="${state.brand===value}"><span>${esc(value)}</span><small>${count}</small></button>`).join('');
    if(brandSummary)brandSummary.textContent=state.brand==='All'?'All collections':state.brand;
  }

  function renderActive(){
    if(!activeFilters)return;
    const labels={q:'Search',kind:'Kind',brand:'Collection',scene:'Scene',domain:'Domain',medium:'Medium',part:'UI Part'};
    const active=[];
    if(state.q)active.push(['q',state.q]);
    for(const key of ['kind','brand','scene','domain','medium','part'])if(state[key]!=='All')active.push([key,key==='kind'?kindLabel(state[key]):state[key]]);
    activeFilters.innerHTML=active.map(([key,value])=>`<button type="button" class="active-filter" data-clear="${esc(key)}"><b>${labels[key]}</b>${esc(value)} ×</button>`).join('');
  }

  function ensureSortControl(){
    if(!facetPanel||document.getElementById('librarySort'))return;
    const row=document.createElement('div');row.className='facet-row sort-facet-row';
    row.innerHTML='<span>Sort</span><div class="library-sort"><select id="librarySort" aria-label="ライブラリの並び順"><option value="brand">Library order</option><option value="density">Density · dense first</option><option value="exploration">Exploration · exploratory first</option><option value="diversity">Diversity · frontier first</option><option value="random">Random · stable seed</option></select><button type="button" class="sort-reroll" title="Randomを引き直す">↻</button></div>';
    facetPanel.appendChild(row);
    const select=row.querySelector('select'),reroll=row.querySelector('button');select.value=state.sort;reroll.hidden=state.sort!=='random';
    select.addEventListener('change',()=>{state.sort=validSorts.has(select.value)?select.value:'brand';if(state.sort==='random'&&!state.seed)state.seed=String(Date.now()%1000000000);reroll.hidden=state.sort!=='random';syncUrl('push');document.dispatchEvent(new CustomEvent('likewhat:sort-change',{detail:{sort:state.sort,seed:state.seed}}));});
    reroll.addEventListener('click',()=>{state.seed=String(Date.now()%1000000000);syncUrl('push');document.dispatchEvent(new CustomEvent('likewhat:sort-change',{detail:{sort:state.sort,seed:state.seed}}));});
  }

  function shortPatternName(p,brandName){return String(p.name||'').replace(new RegExp(`^${String(brandName).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\s*[—–-]\\s*`,'i'),'')||p.family;}
  function groupCard(group,index){
    const items=group.patterns;
    const cluster=group.entryKind==='industry-cluster';
    const scene=group.entryKind==='scene';
    const artist=group.entryKind==='artist';
    const institution=group.entryKind==='institution';
    const previews=items.slice(0,4);
    const previewCount=cluster?(group.cluster?.memberBrands?.length||1):items.length;
    const kicker=cluster?`${esc(group.industry||'INDUSTRY').toUpperCase()} · ${previewCount} BRANDS`:scene?`SCENE · ${items.length} VARIATION${items.length===1?'':'S'}`:artist?`ARTIST · ${items.length} ERA / CONCEPT${items.length===1?'':'S'}`:institution?`INSTITUTION · ${items.length} PATTERN${items.length===1?'':'S'}`:`BRAND · ${items.length} PATTERN${items.length===1?'':'S'}`;
    const single=!cluster&&!scene&&items.length===1;
    const href=cluster?`pattern.html?id=${encodeURIComponent(group.cluster.id)}`:scene?`./?scene=${encodeURIComponent(group.scene)}#patterns`:single?`pattern.html?id=${encodeURIComponent(items[0].id)}`:`brand.html?brand=${encodeURIComponent(group.brand)}`;
    const list=cluster?(group.cluster.members||[]).map(m=>({label:m.brand,sub:m.role})):scene?items.map(p=>({label:p.brand,sub:p.family})):items.map(p=>({label:p.era||shortPatternName(p,group.brand),sub:p.family}));
    const previewMarkup=cluster?`<div class="group-preview-single">${render(group.cluster,'related')}</div>`:`<div class="group-preview-mosaic count-${Math.min(4,previews.length)}">${previews.map(p=>`<div class="group-preview-tile"><div>${render(p,'related')}</div><span>${esc(scene?p.brand:(p.era||shortPatternName(p,group.brand)))}</span></div>`).join('')}${items.length>4?`<b class="group-preview-more">+${items.length-4}</b>`:''}</div>`;
    return `<article class="library-group-card ${cluster?'industry-cluster-card':'brand-group-card'} ${artist?'artist-group-card':''}" data-group-key="${esc(group.key)}" data-group-type="${esc(group.type)}" data-entry-kind="${esc(group.entryKind)}" data-brand="${esc(group.brand)}" data-pattern-ids="${esc(items.map(p=>p.id).join('|'))}" data-sort-index="${index}" data-sort-density="${group.centroid?.density??50}" data-sort-exploration="${group.centroid?.exploration??50}"><a class="library-group-main ${single?'is-direct':''}" href="${href}"><header><small>${kicker}</small><h3>${esc(group.title)}</h3></header><div class="library-group-preview">${previewMarkup}</div><div class="group-pattern-list">${list.slice(0,4).map(item=>`<div><strong>${esc(item.label)}</strong><span>${esc(item.sub||'')}</span></div>`).join('')}${list.length>4?`<p>+ ${list.length-4} more patterns</p>`:''}</div><footer><span>${scene?'Filter this scene':single?'Open pattern':cluster?'Open cluster':artist?'Explore artist':institution?'Explore institution':'Explore brand'}</span><b>↗</b></footer></a></article>`;
  }

  function renderResults(){
    const filtered=filteredPatterns();
    const grouped=groupModel?.build?.(filtered)||[];
    resultCount.textContent=`${grouped.length} entries · ${filtered.length} / ${patterns.length} references${state.q&&searchStore&&!searchStore.ready?' · searching core fields…':''}`;
    empty.hidden=grouped.length>0;groups.hidden=grouped.length===0;
    groups.innerHTML=grouped.map(groupCard).join('');
    groups.dispatchEvent(new CustomEvent('likewhat:groups-rendered',{bubbles:true,detail:{count:grouped.length}}));
    renderFacetRoot(kindFilters,'kind',{limit:10});renderFacetRoot(sceneFilters,'scene',{limit:20});renderFacetRoot(domainFilters,'domain',{limit:14});renderFacetRoot(mediumFilters,'medium',{limit:14});renderFacetRoot(partFilters,'part',{limit:18});renderBrands();renderActive();
    document.dispatchEvent(new CustomEvent('likewhat:sort-change',{detail:{sort:state.sort,seed:state.seed}}));
  }
  function scheduleRender(){cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(renderResults);}

  function handleFacetClick(event){
    const button=event.target.closest('[data-facet]');if(!button)return;
    const key=button.dataset.facet,value=button.dataset.value||'All';
    setState({[key]:value},{historyMode:'push'});
  }
  [kindFilters,sceneFilters,domainFilters,mediumFilters,partFilters,brandFilters].forEach(root=>root?.addEventListener('click',handleFacetClick));
  activeFilters?.addEventListener('click',event=>{const button=event.target.closest('[data-clear]');if(!button)return;const key=button.dataset.clear;setState({[key]:key==='q'?'':'All'},{historyMode:'push'});if(key==='q'&&input)input.value='';});

  input?.addEventListener('input',()=>{state.q=input.value;setState({q:state.q},{historyMode:'replace',ensureSearch:true});});
  document.querySelector('.query-examples')?.addEventListener('click',event=>{const button=event.target.closest('[data-query]');if(!button)return;const q=button.dataset.query||'';if(input)input.value=q;setState({q},{historyMode:'push',ensureSearch:true});document.getElementById('patterns')?.scrollIntoView({behavior:'smooth',block:'start'});});
  window.addEventListener('popstate',()=>{state=urlState();if(input)input.value=state.q;const sort=document.getElementById('librarySort');if(sort)sort.value=state.sort;if(state.q)searchStore?.ensure?.().finally(scheduleRender);else scheduleRender();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.activeElement===input){input.value='';setState({q:''},{historyMode:'replace'});input.blur();}});

  function initComposer(){
    if(!composerIdentity||!composerScene||!composerBuild||!composerResult)return;
    const identities=patterns.filter(p=>!['scene','industry-cluster'].includes(kindOf(p)));
    const scenes=patterns.filter(p=>kindOf(p)==='scene');
    composerIdentity.innerHTML=identities.map(p=>`<option value="${esc(p.id)}">${esc(p.brand)} — ${esc(p.name)}</option>`).join('');
    composerScene.innerHTML=scenes.map(p=>`<option value="${esc(p.id)}">${esc(p.scene||'Scene')} — ${esc(p.brand)} / ${esc(p.name)}</option>`).join('');
    const preferred=identities.find(p=>state.brand!=='All'&&p.brand===state.brand);if(preferred)composerIdentity.value=preferred.id;
    const preferredScene=scenes.find(p=>state.scene!=='All'&&p.scene===state.scene);if(preferredScene)composerScene.value=preferredScene.id;

    composerBuild.addEventListener('click',()=>{
      const identity=patterns.find(p=>p.id===composerIdentity.value),scene=patterns.find(p=>p.id===composerScene.value);if(!identity||!scene)return;
      const diffs=designSpace?.differenceBreakdown?.(identity.designSpace,scene.designSpace)?.slice(0,3)||[];
      const target={
        density:scene.designSpace?.density??50,emotion:identity.designSpace?.emotion??50,exploration:scene.designSpace?.exploration??50,
        authority:identity.designSpace?.authority??50,interaction:scene.designSpace?.interaction??50,order:identity.designSpace?.order??50
      };
      const identityRules=(identity.philosophy||identity.tags||[]).slice(0,3);
      const sceneRules=[scene.oneLiner,...(scene.philosophy||[]),...(scene.tags||[])].filter(Boolean).slice(0,3);
      const brief=`${identity.brand}「${identity.name}」をIdentity、${scene.scene||'Scene'} / ${scene.brand}「${scene.name}」をSituationとして統合してください。\n\nIdentityが担当：感情強度・権威性・秩序。${identityRules.join(' / ')}\nSituationが担当：情報密度・探索性・直接操作。${sceneRules.join(' / ')}\n\nTarget Design Space: Density ${target.density} / Emotion ${target.emotion} / Exploration ${target.exploration} / Authority ${target.authority} / Interaction ${target.interaction} / Order ${target.order}.\n\n表層の色・ロゴ・装飾をコピーせず、役割を混同しないこと。${diffs.length?`特に緊張が大きい軸は ${diffs.map(d=>`${d.name} Δ${Math.round(d.diff)}`).join(' / ')}。場面要件を満たしつつIdentity側の距離感を失わないこと。`:''}`;
      composerResult.innerHTML=`<div class="composer-brief"><article><small>IDENTITY / OWNS TONE</small><strong>${esc(identity.brand)}</strong><p>${esc(identity.name)} — ${esc(identity.oneLiner)}</p></article><article><small>SITUATION / OWNS BEHAVIOR</small><strong>${esc(scene.scene||'Scene')} · ${esc(scene.brand)}</strong><p>${esc(scene.name)} — ${esc(scene.oneLiner)}</p></article><article class="full"><small>IMPLEMENTATION BRIEF</small><pre>${esc(brief)}</pre><button type="button" class="composer-copy-button">Briefをコピー</button></article></div>`;
      composerResult.querySelector('.composer-copy-button')?.addEventListener('click',async event=>{try{await navigator.clipboard.writeText(brief);event.currentTarget.textContent='コピー済み';setTimeout(()=>event.currentTarget.textContent='Briefをコピー',1500);}catch{event.currentTarget.textContent='選択してコピー';}});
    });
  }

  const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const entryKey=p=>kindOf(p)==='scene'?`scene:${p.scene}:${p.brand}`:`${kindOf(p)}:${p.brand}`;
  function ordinaryTriple(){const selected=[];const keys=shuffle(unique(patterns.map(entryKey)));for(const key of keys){const pool=patterns.filter(p=>entryKey(p)===key);if(pool.length)selected.push(pool[Math.floor(Math.random()*pool.length)]);if(selected.length===3)break;}return selected;}
  function distance(a,b){return designSpace?.distanceBetween?.(a.designSpace,b.designSpace)||0;}
  function farApartTriple(){
    const valid=patterns.filter(p=>p.designSpace);if(valid.length<3)return ordinaryTriple();
    const pairs=[];
    for(let i=0;i<valid.length-1;i++)for(let j=i+1;j<valid.length;j++){if(entryKey(valid[i])===entryKey(valid[j]))continue;pairs.push([distance(valid[i],valid[j]),valid[i],valid[j]]);}
    pairs.sort((a,b)=>b[0]-a[0]);const top=pairs.slice(0,Math.min(24,pairs.length));const chosen=top[Math.floor(Math.random()*top.length)]||pairs[0];if(!chosen)return ordinaryTriple();
    const [,,a,b]=[null,...chosen];
    const third=valid.filter(p=>entryKey(p)!==entryKey(a)&&entryKey(p)!==entryKey(b)).map(p=>({p,score:Math.min(distance(a,p),distance(b,p))+0.25*Math.max(distance(a,p),distance(b,p))})).sort((x,y)=>y.score-x.score)[0]?.p;
    return third?[a,b,third]:ordinaryTriple();
  }
  function seededRandom(seed){let h=2166136261;for(const ch of String(seed)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function jaccard(a,b){const A=new Set((a||[]).map(normalize)),B=new Set((b||[]).map(normalize)),u=new Set([...A,...B]);if(!u.size)return 1;let i=0;A.forEach(v=>{if(B.has(v))i++;});return 1-i/u.size;}
  function weirdTriple(){
    const valid=patterns.filter(p=>p.designSpace);if(valid.length<3)return ordinaryTriple();
    const rng=seededRandom(`${state.seed}:${Date.now()>>12}`);const best=[];const samples=Math.min(1800,Math.max(500,valid.length*8));
    for(let n=0;n<samples;n++){
      const a=valid[Math.floor(rng()*valid.length)],b=valid[Math.floor(rng()*valid.length)],c=valid[Math.floor(rng()*valid.length)];
      if(!a||!b||!c||new Set([a.id,b.id,c.id]).size<3||new Set([entryKey(a),entryKey(b),entryKey(c)]).size<3)continue;
      const items=[a,b,c],dist=(distance(a,b)+distance(a,c)+distance(b,c))/3;
      const domain=new Set(items.map(x=>x.domain)).size,kind=new Set(items.map(kindOf)).size,archetype=new Set(items.map(x=>x.archetype)).size;
      const philosophy=(jaccard(a.philosophy,b.philosophy)+jaccard(a.philosophy,c.philosophy)+jaccard(b.philosophy,c.philosophy))/3;
      best.push({items,score:dist+(domain-1)*5+(kind-1)*6+(archetype-1)*3+philosophy*12});
    }
    best.sort((a,b)=>b.score-a.score);const pool=best.slice(0,12);return pool[Math.floor(rng()*pool.length)]?.items||farApartTriple();
  }
  const modeCopy={random:{title:'Random 3',label:'3つ引く',description:'異なる入口から偶然の3つを引く。'},far:{title:'Far Apart',label:'遠い3つを引く',description:'上位の遠距離ペアから三角形を広げる。全組合せは列挙しない。'},weird:{title:'Weird Combination',label:'変な3つを引く',description:'bounded samplingで文脈・思想の不一致を高く評価する。'}};
  const selectionForMode=()=>randomMode==='far'?farApartTriple():randomMode==='weird'?weirdTriple():ordinaryTriple();
  function collisionPrompt(items){return `次の3つの参照を表層的に平均化せず、役割を分けて統合してください。\n\n${items.map((p,i)=>`${i+1}. ${p.brand} / ${p.name}\n   担当原則: ${(p.philosophy||p.tags||[]).slice(0,2).join(' / ')}`).join('\n')}\n\n共通化するのは色ではなく、情報階層・操作モデル・感情強度・探索性・秩序性です。どの場面でどの参照を優先するか明示してください。`;}
  function card(p){return `<a class="pattern-card" href="pattern.html?id=${encodeURIComponent(p.id)}"><div class="card-preview">${render(p,'card')}</div><div class="card-body"><div class="card-meta"><span>${esc(kindLabel(kindOf(p)))}</span><span>${esc(p.brand)}</span></div><h3>${esc(p.name)}</h3><p class="one-liner">${esc(p.oneLiner)}</p><div class="tag-row">${(p.tags||[]).slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="card-arrow">Analyze <span>↗</span></div></div></a>`;}
  function drawThree(){const selected=selectionForMode();if(selected.length<3)return;const prompt=collisionPrompt(selected);randomResults.innerHTML=`<div class="random-analysis"><div class="random-analysis-copy"><p class="eyebrow">${modeCopy[randomMode].title} / BOUNDED</p><h3>${esc(modeCopy[randomMode].description)}</h3></div><details class="collision-brief"><summary>この3つを混ぜるなら？ <span>AI brief</span></summary><div><pre>${esc(prompt)}</pre><button type="button" data-copy-collision>指示文をコピー</button></div></details></div><div class="random-grid">${selected.map(card).join('')}</div>`;randomDraw.querySelector('span').textContent='引き直す';randomResults.scrollIntoView({behavior:'smooth',block:'nearest'});}
  function setRandomMode(mode){randomMode=modeCopy[mode]?mode:'random';randomModes?.querySelectorAll('[data-random-mode]').forEach(btn=>{const active=btn.dataset.randomMode===randomMode;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});if(randomDraw){randomDraw.querySelector('span').textContent=modeCopy[randomMode].label;randomDraw.querySelector('small').textContent=modeCopy[randomMode].title;}if(randomResults)randomResults.innerHTML='';}
  randomModes?.addEventListener('click',event=>{const button=event.target.closest('[data-random-mode]');if(button)setRandomMode(button.dataset.randomMode);});randomDraw?.addEventListener('click',drawThree);randomResults?.addEventListener('click',async event=>{const button=event.target.closest('[data-copy-collision]');if(!button)return;const pre=button.closest('.collision-brief')?.querySelector('pre');if(!pre)return;try{await navigator.clipboard.writeText(pre.textContent);button.textContent='コピー済み';setTimeout(()=>button.textContent='指示文をコピー',1500);}catch{button.textContent='選択してコピー';}});

  ensureSortControl();initComposer();setRandomMode('random');
  if(state.q)searchStore?.ensure?.().finally(scheduleRender);else scheduleRender();
})();
