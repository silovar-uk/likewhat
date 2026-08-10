(function(){
  const patterns=(window.LIKEWHAT_PATTERNS||[]).filter(Boolean);
  const ds=window.LikeWhatDesignSpace;
  const vocab=window.LikeWhatVocabulary;
  const wave=window.LIKEWHAT_WAVES?.wave3;
  const root=document.getElementById('coverageDelta');
  if(!root||!patterns.length||!ds||!vocab||!wave)return;

  const waveIds=new Set(wave.ids||[]);
  const before=patterns.filter(p=>!waveIds.has(p.id)&&p.designSpace);
  const after=patterns.filter(p=>p.designSpace);
  const added=patterns.filter(p=>waveIds.has(p.id)&&p.designSpace);
  const axes=ds.axes;
  const axisNames=ds.axisNames;
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const average=items=>items.length?items.reduce((sum,n)=>sum+n,0)/items.length:0;
  const unique=items=>[...new Set(items.filter(Boolean))];
  const sign=n=>n>0?`+${n}`:`${n}`;
  const format1=n=>Number(n).toFixed(1);

  function countBy(pop,key){
    const map=new Map();
    pop.forEach(p=>{
      const value=p[key];
      if(value)map.set(value,(map.get(value)||0)+1);
    });
    return map;
  }

  function nearestToPoint(point,pop){
    let nearest=null;
    pop.forEach(pattern=>{
      const distance=ds.distanceBetween(point,pattern.designSpace);
      if(!nearest||distance<nearest.distance)nearest={pattern,distance};
    });
    return nearest;
  }

  function probePoints(){
    const levels=[10,50,90];
    const points=[];
    function walk(index,point){
      if(index===axes.length){points.push({...point});return;}
      const axis=axes[index];
      levels.forEach(value=>{point[axis.key]=value;walk(index+1,point);});
    }
    walk(0,{});
    return points;
  }
  const probes=probePoints();

  function probeAnalysis(pop){
    const ranked=probes.map(point=>({point,nearest:nearestToPoint(point,pop)})).sort((a,b)=>b.nearest.distance-a.nearest.distance);
    return {
      max:ranked[0]?.nearest.distance||0,
      meanTop6:average(ranked.slice(0,6).map(x=>x.nearest.distance)),
      ranked
    };
  }

  function selectOpenVectors(pop,limit=6){
    const candidates=probes.map(point=>{
      const nearest=nearestToPoint(point,pop);
      const extremes=axes.filter(axis=>point[axis.key]!==50).length;
      return {point,nearest,rankScore:nearest.distance-Math.max(0,extremes-4)*1.25};
    }).sort((a,b)=>b.rankScore-a.rankScore||b.nearest.distance-a.nearest.distance);
    const selected=[];
    for(const candidate of candidates){
      if(selected.some(item=>ds.distanceBetween(item.point,candidate.point)<24))continue;
      selected.push(candidate);
      if(selected.length===limit)break;
    }
    return selected;
  }

  function termMetrics(pop){
    const terms=vocab.allTerms?.()||[];
    const stats=terms.map(node=>{
      const hits=vocab.patternsForTerm(node,pop)||[];
      return {node,support:hits.length,brands:unique(hits.map(p=>p.brand)).length};
    });
    return {
      thin:stats.filter(x=>x.support<=2).length,
      singleBrand:stats.filter(x=>x.support>0&&x.brands===1).length
    };
  }

  function metrics(pop){
    const domainCounts=countBy(pop,'domain');
    const mediumCounts=countBy(pop,'medium');
    const brandCounts=countBy(pop,'brand');
    const probe=probeAnalysis(pop);
    const term=termMetrics(pop);
    const largestBrand=Math.max(0,...brandCounts.values());
    return {
      count:pop.length,
      avgLocal:average(pop.map(p=>ds.nearestDistance(p,pop))),
      maxGap:probe.max,
      meanTop6:probe.meanTop6,
      domains:domainCounts.size,
      media:mediumCounts.size,
      singletonDomains:[...domainCounts.values()].filter(n=>n===1).length,
      thinTerms:term.thin,
      singleBrandTerms:term.singleBrand,
      largestBrandShare:pop.length?largestBrand/pop.length*100:0
    };
  }

  const B=metrics(before);
  const A=metrics(after);

  function deltaSpec(label,key,{format='number',direction='neutral',note='' }={}){
    const b=B[key],a=A[key],delta=a-b;
    const fmt=value=>format==='percent'?`${format1(value)}%`:format==='decimal'?format1(value):String(Math.round(value));
    let tone='neutral';
    if(direction==='lower')tone=delta<0?'gain':delta>0?'tradeoff':'neutral';
    if(direction==='higher')tone=delta>0?'gain':delta<0?'tradeoff':'neutral';
    if(direction==='depth')tone=delta>0?'tradeoff':delta<0?'gain':'neutral';
    const d=format==='percent'?`${delta>0?'+':''}${format1(delta)}pt`:format==='decimal'?`${delta>0?'+':''}${format1(delta)}`:sign(Math.round(delta));
    return {label,before:fmt(b),after:fmt(a),delta:d,tone,note};
  }

  const metricSpecs=[
    deltaSpec('MAX 6D OPEN GAP','maxGap',{format:'decimal',direction:'lower',note:'小さいほど最大の空白が縮む'}),
    deltaSpec('MEAN TOP-6 GAP','meanTop6',{format:'decimal',direction:'lower',note:'上位空白6方向の平均'}),
    deltaSpec('AVG LOCAL SEPARATION','avgLocal',{format:'decimal',direction:'lower',note:'低下＝全体がより密になる'}),
    deltaSpec('UNIQUE DOMAINS','domains',{direction:'higher',note:'説明できる文脈の広さ'}),
    deltaSpec('UNIQUE MEDIA','media',{direction:'higher',note:'画面外も含む媒体の広さ'}),
    deltaSpec('THIN CONCEPTS','thinTerms',{direction:'lower',note:'接続Patternが2件以下の語彙'}),
    deltaSpec('SINGLETON DOMAINS','singletonDomains',{direction:'depth',note:'1件しかないDomain＝今後の深さ負債'}),
    deltaSpec('LARGEST BRAND SHARE','largestBrandShare',{format:'percent',direction:'lower',note:'最大ブランドへの集中度'})
  ];

  const maxGapGain=B.maxGap-A.maxGap;
  const top6Gain=B.meanTop6-A.meanTop6;
  const domainGain=A.domains-B.domains;
  const mediaGain=A.media-B.media;
  const thinGain=B.thinTerms-A.thinTerms;
  const singletonChange=A.singletonDomains-B.singletonDomains;

  const observations=[
    maxGapGain>0.05?`最大6D空白は ${format1(maxGapGain)}pt 縮小。Wave 3は少なくとも最も遠い空白方向を埋めた。`:`最大6D空白はほぼ不変。追加は空白充填より別の価値を担っている。`,
    `Contextは Domain ${sign(domainGain)} / Medium ${sign(mediaGain)}。Web中心の参照集合から、別媒体・別運用環境へ説明範囲が広がった。`,
    singletonChange>0?`一方でSingleton Domainは ${sign(singletonChange)}。広さを増やしたぶん「1例しかない世界」も増えたので、次は新規開拓だけでなく横展開が必要。`:`Singleton Domainは増えていない。文脈の広さと厚みを同時に確保できている。`
  ];

  function verdict(){
    if(maxGapGain>1&&domainGain>0)return '空白は縮んだ。説明できる世界も広がった。';
    if(maxGapGain>0)return '空白は縮んだ。ただし価値は「密度化」だけではない。';
    if(domainGain>0)return '空白距離より、文脈の広がりに効いた。';
    return '件数は増えた。次は追加価値の再設計が必要。';
  }

  function profileTitle(point){
    const labels=axes.filter(axis=>point[axis.key]!==50).map(axis=>point[axis.key]<50?axis.low:axis.high);
    return `${labels.slice(0,3).join(' × ')}${labels.length>3?` +${labels.length-3}`:''}`;
  }

  const baselineOpen=selectOpenVectors(before,6).map((item,index)=>{
    const afterNearest=nearestToPoint(item.point,after);
    return {...item,index,afterNearest,filled:item.nearest.distance-afterNearest.distance};
  });
  const maxOpen=Math.max(1,...baselineOpen.map(x=>x.nearest.distance));

  const baselineDomains=new Set(before.map(p=>p.domain).filter(Boolean));
  const baselineMedia=new Set(before.map(p=>p.medium).filter(Boolean));
  const addedImpact=added.map(pattern=>{
    const neighbors=before.map(old=>({pattern:old,distance:ds.distanceBetween(pattern.designSpace,old.designSpace)})).sort((a,b)=>a.distance-b.distance);
    const nearest=neighbors[0];
    const diffs=nearest?ds.differenceBreakdown(nearest.pattern.designSpace,pattern.designSpace).slice(0,2):[];
    const novelty=nearest?.distance||0;
    const level=novelty>=25?'FRONTIER GAIN':novelty>=18?'TERRITORY EXPANSION':novelty>=12?'BRIDGE': 'REINFORCEMENT';
    return {pattern,nearest,novelty,diffs,level,newDomain:!baselineDomains.has(pattern.domain),newMedium:!baselineMedia.has(pattern.medium)};
  }).sort((a,b)=>b.novelty-a.novelty);

  root.innerHTML=`
    <div class="delta-head">
      <div><p class="eyebrow">COVERAGE DELTA / BEFORE → AFTER</p><h2>15件は、どこを埋めた？</h2><p>Wave 3投入直前の63件と現在の78件に、同じDesign Space・Vocabulary・Context指標を適用する。追加件数ではなく、空白・厚み・広さの変化を見る。</p></div>
      <div class="delta-count"><small>${esc(wave.label)}</small><strong>${before.length}<i>→</i>${after.length}</strong><span>+${added.length} references</span></div>
    </div>

    <div class="delta-verdict"><div><small>READING</small><h3>${esc(verdict())}</h3></div><div class="delta-observations">${observations.map((text,i)=>`<p><span>0${i+1}</span>${esc(text)}</p>`).join('')}</div></div>

    <div class="delta-metrics">${metricSpecs.map(m=>`<article class="delta-metric ${m.tone}"><small>${esc(m.label)}</small><div><span>${esc(m.before)}</span><i>→</i><strong>${esc(m.after)}</strong></div><b>${esc(m.delta)}</b><p>${esc(m.note)}</p></article>`).join('')}</div>

    <div class="delta-subsection">
      <div class="delta-subhead"><div><p class="eyebrow">OPEN VECTOR COMPRESSION</p><h3>旧63件で空いていた6方向は、どこまで縮んだ？</h3></div><p>同じ座標点に対する最寄り距離をBefore / Afterで比較。</p></div>
      <div class="gap-compression-grid">${baselineOpen.map(item=>{
        const beforeW=item.nearest.distance/maxOpen*100;
        const afterW=item.afterNearest.distance/maxOpen*100;
        return `<article><div class="gap-compression-head"><span>0${item.index+1}</span><div><small>OPEN VECTOR</small><strong>${esc(profileTitle(item.point))}</strong></div><b>${item.filled>0?`−${format1(item.filled)}`:'±0.0'}</b></div><div class="compression-bars"><div><span>63</span><i><em style="width:${beforeW}%"></em></i><b>${format1(item.nearest.distance)}</b></div><div class="after"><span>78</span><i><em style="width:${afterW}%"></em></i><b>${format1(item.afterNearest.distance)}</b></div></div><p>現在の最寄り：<a href="pattern.html?id=${encodeURIComponent(item.afterNearest.pattern.id)}">${esc(item.afterNearest.pattern.brand)} / ${esc(item.afterNearest.pattern.name)} ↗</a></p></article>`;
      }).join('')}</div>
    </div>

    <div class="delta-subsection">
      <div class="delta-subhead"><div><p class="eyebrow">WAVE 3 CONTRIBUTION</p><h3>新しい領域を作ったのは、どの参照？</h3></div><p>各Wave 3参照と、旧63件の最寄りPatternとのDesign Distance。高いほど旧ライブラリから離れた領域を追加した。</p></div>
      <div class="wave-impact-list">${addedImpact.map((item,index)=>`<article><span class="impact-index">${String(index+1).padStart(2,'0')}</span><div class="impact-main"><small>${esc(item.pattern.brand)}</small><a href="pattern.html?id=${encodeURIComponent(item.pattern.id)}"><strong>${esc(item.pattern.name)}</strong></a><p>${esc(item.pattern.domain)} · ${esc(item.pattern.medium)}</p></div><div class="impact-badges"><span>${esc(item.level)}</span>${item.newDomain?'<b>NEW DOMAIN</b>':''}${item.newMedium?'<b>NEW MEDIUM</b>':''}</div><div class="impact-nearest"><small>NEAREST OLD</small><a href="pattern.html?id=${encodeURIComponent(item.nearest.pattern.id)}">${esc(item.nearest.pattern.brand)} / ${esc(item.nearest.pattern.name)}</a><p>${item.diffs.map(d=>`${esc(d.name)} Δ${Math.round(d.diff)}`).join(' · ')}</p></div><div class="impact-distance"><small>DISTANCE</small><strong>${format1(item.novelty)}</strong></div></article>`).join('')}</div>
    </div>

    <p class="delta-method-note">Coverage Deltaは「Wave 3が優れている」という評価ではない。Design Spaceの空白縮小、Vocabularyの厚み、Contextの広がり、Singleton増加という別々の効果を分離し、追加によって何を得て何を新しい負債として作ったかを読むための比較。</p>`;
})();
