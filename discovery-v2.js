(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const ui=window.LikeWhatUI||{};
  const designSpace=window.LikeWhatDesignSpace;
  const vocabulary=window.LikeWhatVocabulary;
  const esc=ui.esc||function(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));};
  const render=ui.render;
  if(!patterns.length)return;

  function normalize(value){return String(value||'').toLowerCase().normalize('NFKC');}

  function initLibraryDiscovery(){
    const groups=document.getElementById('patternGroups');
    const brandFilters=document.getElementById('brandFilters');
    const partFilters=document.getElementById('partFilters');
    const input=document.getElementById('searchInput');
    const filterRow=document.querySelector('.secondary-filter-row');
    if(!groups||!filterRow)return;

    const params=new URLSearchParams(location.search);
    const validSorts=new Set(['brand','density','exploration','diversity','random']);
    let sort=validSorts.has(params.get('sort'))?params.get('sort'):'brand';
    let seed=params.get('seed')||String(Date.now()%1000000000);

    const shell=document.createElement('div');
    shell.className='library-sort';
    shell.innerHTML=`<label for="librarySort">Sort</label><select id="librarySort" aria-label="パターンの並び順"><option value="brand">Brand order</option><option value="density">Density · dense first</option><option value="exploration">Exploration · exploratory first</option><option value="diversity">Diversity · frontier first</option><option value="random">Random · stable seed</option></select><button type="button" class="sort-reroll" aria-label="Randomの並びを引き直す" title="Randomを引き直す">↻</button>`;
    filterRow.appendChild(shell);
    const select=shell.querySelector('select');
    const reroll=shell.querySelector('.sort-reroll');
    select.value=sort;
    reroll.hidden=sort!=='random';
    shell.dataset.mode=sort;

    function activeValue(container,key){
      return container?.querySelector(`[data-${key}].active`)?.dataset[key]||'All';
    }

    function syncUrl(){
      const next=new URLSearchParams(location.search);
      const q=input?.value.trim()||'';
      const brand=activeValue(brandFilters,'brand');
      const part=activeValue(partFilters,'part');
      q?next.set('q',q):next.delete('q');
      brand&&brand!=='All'?next.set('brand',brand):next.delete('brand');
      part&&part!=='All'?next.set('part',part):next.delete('part');
      sort!=='brand'?next.set('sort',sort):next.delete('sort');
      sort==='random'?next.set('seed',seed):next.delete('seed');
      const query=next.toString();
      history.replaceState(null,'',`${location.pathname}${query?`?${query}`:''}${location.hash}`);
    }

    function restoreFilter(container,key,value){
      if(!value||value==='All')return;
      const button=[...container.querySelectorAll(`[data-${key}]`)].find(btn=>btn.dataset[key]===value);
      button?.click();
    }

    restoreFilter(brandFilters,'brand',params.get('brand'));
    restoreFilter(partFilters,'part',params.get('part'));
    if(sort==='random'&&!params.get('seed'))syncUrl();

    select.addEventListener('change',()=>{
      sort=validSorts.has(select.value)?select.value:'brand';
      if(sort==='random'&&!seed)seed=String(Date.now()%1000000000);
      reroll.hidden=sort!=='random';
      shell.dataset.mode=sort;
      syncUrl();
      document.dispatchEvent(new CustomEvent('likewhat:sort-change',{detail:{sort,seed}}));
    });
    reroll.addEventListener('click',()=>{
      seed=String(Date.now()%1000000000);
      syncUrl();
      document.dispatchEvent(new CustomEvent('likewhat:sort-change',{detail:{sort,seed}}));
    });
    brandFilters?.addEventListener('click',()=>setTimeout(syncUrl,0));
    partFilters?.addEventListener('click',()=>setTimeout(syncUrl,0));
    input?.addEventListener('input',()=>setTimeout(syncUrl,0));
    document.querySelector('.query-examples')?.addEventListener('click',()=>setTimeout(syncUrl,0));
  }

  function termsFor(pattern){
    if(!vocabulary?.termsForPattern)return[];
    return vocabulary.termsForPattern(pattern)||[];
  }
  function commonTerms(a,b){
    const B=new Map(termsFor(b).map(term=>[normalize(term.term),term]));
    return termsFor(a).filter(term=>B.has(normalize(term.term))).map(term=>term.term);
  }

  function initNextReferences(){
    const root=document.querySelector('.detail-page');
    if(!root||!render||!designSpace)return;
    const id=new URLSearchParams(location.search).get('id');
    const current=patterns.find(p=>p.id===id)||patterns[0];
    if(!current?.designSpace)return;

    const diversity=designSpace.diversity(current,patterns);
    const opposite=designSpace.editorialOpposite(current,patterns);
    const nearest=diversity?.nearest?.pattern||null;
    const reserved=new Set([current.id,nearest?.id,opposite?.pattern?.id].filter(Boolean));

    const curated=patterns.find(x=>x.id!==current.id&&x.brand!==current.brand&&!reserved.has(x.id)&&((current.related||[]).includes(x.id)||(x.related||[]).includes(current.id)))||null;
    const scoredShared=patterns
      .filter(x=>x.id!==current.id&&x.brand!==current.brand&&!reserved.has(x.id))
      .map(x=>{
        const common=commonTerms(current,x);
        const domainShift=x.domain&&current.domain&&x.domain!==current.domain?3:0;
        const mediumShift=x.medium&&current.medium&&x.medium!==current.medium?1:0;
        return{x,common,score:common.length*10+domainShift+mediumShift};
      })
      .filter(item=>item.common.length)
      .sort((a,b)=>b.score-a.score||a.x.brand.localeCompare(b.x.brand,'en'));
    const shared=curated||scoredShared[0]?.x||patterns.find(x=>x.id!==current.id&&x.brand!==current.brand&&!reserved.has(x.id))||null;

    const lanes=[];
    if(nearest){
      const diffs=designSpace.differenceBreakdown(current.designSpace,nearest.designSpace).slice(0,2);
      lanes.push({
        key:'similar',number:'01',label:'SIMILAR POSITION',title:'座標が近い参照',target:nearest,
        metric:`Distance ${diversity.nearest.distance.toFixed(1)}`,
        why:`6軸で最も近い。差が残るのは ${diffs.map(d=>`${d.name} Δ${Math.round(d.diff)}`).join(' / ')||'ごく小さな調整'}。`,
        evidence:diffs.map(d=>`${d.name} Δ${Math.round(d.diff)}`)
      });
    }
    if(shared){
      const common=commonTerms(current,shared).slice(0,3);
      const context=[shared.domain,shared.medium].filter(Boolean).join(' · ');
      lanes.push({
        key:'principle',number:'02',label:'SHARED PRINCIPLE / DIFFERENT CONTEXT',title:'原則を持ち運ぶ参照',target:shared,
        metric:common.length?`${common.length} shared concepts`:'Editorial pair',
        why:curated&&shared.id===curated.id?'編集上「同じ問題への別解」として接続した参照。ブランドを越えて、残した原則と変えた優先順位を見る。':`共通語彙を持ちながら文脈が ${context||'別領域'} へ移る参照。見た目ではなく原則の移植可能性を見る。`,
        evidence:common.length?common:['Different context']
      });
    }
    if(opposite?.pattern){
      const flips=opposite.flips.slice(0,2);
      lanes.push({
        key:'opposite',number:'03',label:'OPPOSITE PRIORITIES',title:'選ばなかった方向を見る',target:opposite.pattern,
        metric:`Fit ${opposite.fit}/100`,
        why:`優先順位を反転した先に近い参照。${flips.map(f=>`${f.name}: ${f.fromLabel} → ${f.toLabel}`).join(' / ')}。`,
        evidence:flips.map(f=>f.name)
      });
    }
    if(!lanes.length)return;

    function laneMarkup(lane){
      const target=lane.target;
      return `<article class="next-reference-lane next-reference-${esc(lane.key)}">
        <div class="next-reference-head"><span>${lane.number}</span><div><small>${esc(lane.label)}</small><strong>${esc(lane.title)}</strong></div><b>${esc(lane.metric)}</b></div>
        <a class="next-reference-preview" href="pattern.html?id=${encodeURIComponent(target.id)}" aria-label="${esc(target.brand)} ${esc(target.name)}を開く">${render(target,'related')}</a>
        <div class="next-reference-copy"><p class="next-reference-brand">${esc(target.brand)}</p><h3>${esc(target.name)}</h3><p>${esc(lane.why)}</p><div class="next-reference-evidence">${lane.evidence.map(item=>`<span>${esc(item)}</span>`).join('')}</div></div>
        <div class="next-reference-actions"><a href="pattern.html?id=${encodeURIComponent(target.id)}">Open pattern</a><a href="compare.html?a=${encodeURIComponent(current.id)}&b=${encodeURIComponent(target.id)}">Compare ↗</a></div>
      </article>`;
    }

    const section=document.createElement('section');
    section.className='detail-block next-references-block';
    section.innerHTML=`<div class="next-references-heading"><div><p class="eyebrow">NEXT REFERENCES / EXPLAINABLE ROUTES</p><h2>次に何を見ると、この設計がもっと分かる？</h2><p>似ているもの、原則を共有する別文脈、優先順位を反転したもの。推薦理由を3種類に分け、同じ「関連」を混ぜない。</p></div><a href="compare.html?a=${encodeURIComponent(current.id)}&b=${encodeURIComponent(lanes[0].target.id)}">Contrastを開く ↗</a></div><div class="next-reference-grid">${lanes.map(laneMarkup).join('')}</div><p class="next-references-note">推薦は現在の${patterns.length}パターン、6軸Design Space、Vocabulary、編集上のrelated指定から計算する。SimilarityとOppositionは同じ意味ではない。</p>`;

    const oldCompare=root.querySelector('.compare-route-block');
    if(oldCompare)oldCompare.replaceWith(section);
    else root.querySelector('.detail-grid')?.before(section);
    root.querySelector('.related')?.remove();
  }

  initLibraryDiscovery();
  initNextReferences();
})();
