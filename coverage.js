(function(){
  const patterns=(window.LIKEWHAT_PATTERNS||[]).filter(Boolean);
  const ds=window.LikeWhatDesignSpace;
  const vocab=window.LikeWhatVocabulary;
  if(!patterns.length||!ds||!vocab)return;

  const valid=patterns.filter(p=>p.designSpace);
  const axes=ds.axes;
  const axisNames=ds.axisNames;
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
  const unique=items=>[...new Set(items.filter(Boolean))];
  const average=items=>items.length?items.reduce((a,b)=>a+b,0)/items.length:0;

  function countBy(key){
    const map=new Map();
    patterns.forEach(p=>{
      const value=typeof key==='function'?key(p):p[key];
      if(!value)return;
      map.set(value,(map.get(value)||0)+1);
    });
    return [...map.entries()].map(([name,count])=>({name,count}));
  }

  const brandCounts=countBy('brand').sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'ja'));
  const domainCounts=countBy('domain').sort((a,b)=>a.count-b.count||a.name.localeCompare(b.name,'ja'));
  const mediumCounts=countBy('medium').sort((a,b)=>a.count-b.count||a.name.localeCompare(b.name,'ja'));

  const termStats=(vocab.allTerms?.()||[]).map(node=>{
    const hits=vocab.patternsForTerm(node,patterns)||[];
    const brands=unique(hits.map(p=>p.brand));
    const domains=unique(hits.map(p=>p.domain));
    const brandMap=new Map();
    hits.forEach(p=>brandMap.set(p.brand,(brandMap.get(p.brand)||0)+1));
    const maxBrand=Math.max(0,...brandMap.values());
    const concentration=hits.length?maxBrand/hits.length:1;
    const support=hits.length;
    const thinness=support===0?100:Math.min(100,Math.round(62/support+(brands.length<=1?20:0)+(domains.length<=1?12:0)+concentration*8));
    return {node,hits,support,brands,domains,concentration,thinness};
  }).sort((a,b)=>b.thinness-a.thinness||a.support-b.support||a.node.term.localeCompare(b.node.term,'en'));

  function nearestToPoint(point){
    let nearest=null;
    valid.forEach(pattern=>{
      const distance=ds.distanceBetween(point,pattern.designSpace);
      if(!nearest||distance<nearest.distance)nearest={pattern,distance};
    });
    return nearest;
  }

  function candidatePoints(){
    const levels=[10,50,90];
    const out=[];
    function walk(index,point){
      if(index===axes.length){
        const nearest=nearestToPoint(point);
        const extremes=axes.filter(axis=>point[axis.key]!==50).length;
        const balancePenalty=Math.max(0,extremes-4)*1.25;
        out.push({point:{...point},nearest,extremes,rankScore:(nearest?.distance||0)-balancePenalty});
        return;
      }
      const axis=axes[index];
      levels.forEach(value=>{point[axis.key]=value;walk(index+1,point);});
    }
    walk(0,{});
    return out.sort((a,b)=>b.rankScore-a.rankScore||b.nearest.distance-a.nearest.distance);
  }

  function selectSpatialGaps(limit=6){
    const selected=[];
    for(const candidate of candidatePoints()){
      if(selected.some(item=>ds.distanceBetween(item.point,candidate.point)<24))continue;
      selected.push(candidate);
      if(selected.length===limit)break;
    }
    return selected;
  }

  const spatialGaps=selectSpatialGaps(6);
  const maxSpatial=Math.max(1,...spatialGaps.map(g=>g.nearest.distance));
  const avgNearest=average(valid.map(p=>ds.nearestDistance(p,valid)));
  const frontierCount=valid.filter(p=>ds.diversity(p,valid)?.score>=75).length;
  const thinTerms=termStats.filter(item=>item.support<=2).slice(0,12);
  const oneBrandTerms=termStats.filter(item=>item.support>0&&item.brands.length===1).length;
  const singletonDomains=domainCounts.filter(item=>item.count===1).length;

  function axisLabel(axis,value){
    return value===50?'Balanced':value<50?axis.low:axis.high;
  }

  function profileTitle(point){
    const parts=axes.filter(axis=>point[axis.key]!==50).slice(0,3).map(axis=>axisLabel(axis,point[axis.key]));
    const extra=axes.filter(axis=>point[axis.key]!==50).length-parts.length;
    return `${parts.join(' × ')}${extra>0?` +${extra}`:''}`;
  }

  function axisBars(point){
    return `<div class="gap-axis-list">${axes.map(axis=>{
      const value=point[axis.key];
      return `<div class="gap-axis"><div><span>${esc(axisNames[axis.key])}</span><b>${esc(axisLabel(axis,value))} · ${value}</b></div><i><em style="left:${value}%"></em></i></div>`;
    }).join('')}</div>`;
  }

  function renderStats(){
    const el=document.getElementById('coverageStats');
    if(!el)return;
    el.innerHTML=[
      ['REFERENCES',patterns.length,'current library'],
      ['AVG LOCAL SEPARATION',avgNearest.toFixed(1),'mean nearest distance'],
      ['THIN CONCEPTS',thinTerms.length,'≤ 2 connected patterns'],
      ['SINGLE-BRAND TERMS',oneBrandTerms,'concept dependency'],
      ['FRONTIER',frontierCount,'Diversity ≥ 75'],
      ['SINGLETON DOMAINS',singletonDomains,'only 1 reference']
    ].map(([label,value,note])=>`<article><small>${esc(label)}</small><strong>${esc(value)}</strong><span>${esc(note)}</span></article>`).join('');
  }

  function renderSpatial(){
    const el=document.getElementById('spatialGaps');
    if(!el)return;
    el.innerHTML=spatialGaps.map((gap,index)=>`<article class="spatial-gap-card">
      <div class="spatial-gap-head"><span>${String(index+1).padStart(2,'0')}</span><div><small>OPEN VECTOR</small><h3>${esc(profileTitle(gap.point))}</h3></div><b>${gap.nearest.distance.toFixed(1)}</b></div>
      ${axisBars(gap.point)}
      <div class="spatial-nearest"><small>NEAREST EXISTING</small><a href="pattern.html?id=${encodeURIComponent(gap.nearest.pattern.id)}"><strong>${esc(gap.nearest.pattern.brand)}</strong><span>${esc(gap.nearest.pattern.name)} ↗</span></a></div>
    </article>`).join('');
  }

  function renderVocabulary(){
    const el=document.getElementById('thinVocabulary');
    if(!el)return;
    el.innerHTML=thinTerms.map(item=>`<a class="thin-term" href="vocabulary.html?term=${encodeURIComponent(item.node.term)}">
      <div><small>${esc(item.node.category||'Concept')}</small><strong>${esc(item.node.term)}</strong><span>${esc(item.node.ja||'')}</span></div>
      <div class="thin-term-metrics"><b>${item.support}</b><span>patterns</span><b>${item.brands.length}</b><span>brands</span></div>
    </a>`).join('')||'<p class="coverage-empty">薄い語彙は検出されなかった。</p>';
  }

  function distributionBlock(label,items,{descending=false,limit=8}={}){
    const sorted=[...items].sort((a,b)=>descending?b.count-a.count:a.count-b.count).slice(0,limit);
    const max=Math.max(1,...items.map(i=>i.count));
    return `<section class="context-block"><div class="context-block-head"><small>${esc(label)}</small><span>${items.length} groups</span></div>${sorted.map(item=>`<div class="context-row"><div><strong>${esc(item.name)}</strong><span>${item.count}</span></div><i><em style="width:${Math.max(5,(item.count/max)*100)}%"></em></i></div>`).join('')}</section>`;
  }

  function renderContext(){
    const el=document.getElementById('contextBalance');
    if(!el)return;
    el.innerHTML=`${distributionBlock('UNDERREPRESENTED DOMAINS',domainCounts,{limit:8})}${distributionBlock('UNDERREPRESENTED MEDIA',mediumCounts,{limit:6})}${distributionBlock('HEAVIEST BRAND LOAD',brandCounts,{descending:true,limit:6})}`;
  }

  function conceptPressure(term){
    if(!term)return 30;
    if(term.support===0)return 100;
    if(term.support===1)return 86;
    if(term.support===2)return 68;
    if(term.support===3)return 48;
    return 30;
  }

  function contextPressure(domain,medium){
    const maxDomain=Math.max(1,...domainCounts.map(x=>x.count));
    const maxMedium=Math.max(1,...mediumCounts.map(x=>x.count));
    const d=domain?1-(domain.count/maxDomain):.5;
    const m=medium?1-(medium.count/maxMedium):.5;
    return Math.round((d*.65+m*.35)*100);
  }

  function positionSentence(point){
    return axes.map(axis=>`${axisNames[axis.key]}=${axisLabel(axis,point[axis.key])}(${point[axis.key]})`).join(' / ');
  }

  const waveConcepts=termStats.filter(item=>item.node.category!=='Implementation').slice(0,18);
  const underDomains=domainCounts.length?domainCounts: [{name:'new domain',count:0}];
  const underMedia=mediumCounts.length?mediumCounts:[{name:'new medium',count:0}];
  const waveBriefs=spatialGaps.map((gap,index)=>{
    const concept=waveConcepts[index%waveConcepts.length]||termStats[index%termStats.length]||null;
    const domain=underDomains[index%Math.min(underDomains.length,8)];
    const medium=underMedia[(index*2)%Math.min(underMedia.length,6)];
    const spatialScore=Math.round((gap.nearest.distance/maxSpatial)*100);
    const conceptScore=conceptPressure(concept);
    const contextScore=contextPressure(domain,medium);
    const priority=Math.round(spatialScore*.55+conceptScore*.25+contextScore*.20);
    const brief=`Wave 3候補として、次の条件を満たす実在サービス／ブランド／環境を調査する。\n\nDesign Space:\n${positionSentence(gap.point)}\n\nConcept gap:\n${concept?`${concept.node.term}（現在 ${concept.support} patterns / ${concept.brands.length} brands）`:'未指定'}\n\nContext preference:\nDomain: ${domain?.name||'新規Domain'}\nMedium: ${medium?.name||'新規Medium'}\n\nNearest existing reference:\n${gap.nearest.pattern.brand} / ${gap.nearest.pattern.name}（Design Distance ${gap.nearest.distance.toFixed(1)}）\n\n選定条件:\n- 表層の見た目ではなく、上記座標と概念を実際のIA・操作・情報密度として確認できること\n- 既存の主要ブランド群と異なる文脈を優先すること\n- 公式サイト、公式Design System、製品ドキュメント等で根拠を追跡できること\n- 既存Patternとほぼ同じなら採用せず、何を新しく説明できるかを1文で示すこと`;
    return {gap,concept,domain,medium,spatialScore,conceptScore,contextScore,priority,brief};
  }).sort((a,b)=>b.priority-a.priority);

  function renderWave3(){
    const el=document.getElementById('wave3Briefs');
    if(!el)return;
    el.innerHTML=waveBriefs.map((item,index)=>`<article class="wave3-card">
      <div class="wave3-score"><span>PRIORITY</span><strong>${item.priority}</strong><small>/ 100</small></div>
      <div class="wave3-copy"><p class="eyebrow">BRIEF ${String(index+1).padStart(2,'0')}</p><h3>${esc(profileTitle(item.gap.point))}</h3><p>空白座標に、<strong>${esc(item.concept?.node.term||'thin concept')}</strong>と、薄いContextを重ねた調査条件。</p></div>
      <div class="wave3-components"><span><small>SPATIAL</small><b>${item.spatialScore}</b></span><span><small>CONCEPT</small><b>${item.conceptScore}</b></span><span><small>CONTEXT</small><b>${item.contextScore}</b></span></div>
      <div class="wave3-targets"><span>Concept <b>${esc(item.concept?.node.term||'—')}</b></span><span>Domain <b>${esc(item.domain?.name||'—')}</b></span><span>Medium <b>${esc(item.medium?.name||'—')}</b></span></div>
      <details><summary>調査仕様を見る <span>Research brief</span></summary><pre>${esc(item.brief)}</pre></details>
      <button type="button" data-copy-brief="${index}">Briefをコピー</button>
    </article>`).join('');

    el.addEventListener('click',async event=>{
      const button=event.target.closest('[data-copy-brief]');
      if(!button)return;
      const item=waveBriefs[Number(button.dataset.copyBrief)];
      if(!item)return;
      try{await navigator.clipboard.writeText(item.brief);button.textContent='コピー済み';setTimeout(()=>button.textContent='Briefをコピー',1500);}catch{button.textContent='選択してコピー';}
    });
  }

  renderStats();
  renderSpatial();
  renderVocabulary();
  renderContext();
  renderWave3();
})();
