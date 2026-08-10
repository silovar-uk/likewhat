(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const ds=window.LikeWhatDesignSpace;
  const vocab=window.LikeWhatVocabulary;
  const ui=window.LikeWhatUI;
  if(!patterns.length||!ds||!vocab||!ui)return;
  const {render,esc}=ui;
  const byId=new Map(patterns.map(p=>[p.id,p]));
  const pairSelectA=document.getElementById('pairA');
  const pairSelectB=document.getElementById('pairB');
  const swapBtn=document.getElementById('swapPair');
  const curatedList=document.getElementById('curatedPairs');
  const comparison=document.getElementById('comparison');
  const pairCount=document.getElementById('pairCount');

  const curatedPairs=[];
  const seen=new Set();
  patterns.forEach(p=>{
    (p.related||[]).forEach(id=>{
      const other=byId.get(id);
      if(!other)return;
      const key=[p.id,other.id].sort().join('|');
      if(seen.has(key))return;
      seen.add(key);
      curatedPairs.push({a:other,b:p});
    });
  });

  const params=new URLSearchParams(location.search);
  let a=byId.get(params.get('a'))||curatedPairs[0]?.a||patterns[0];
  let b=byId.get(params.get('b'))||curatedPairs[0]?.b||patterns.find(p=>p.id!==a?.id);
  if(a?.id===b?.id)b=patterns.find(p=>p.id!==a.id)||b;

  function normalize(v){return String(v||'').normalize('NFKC').toLowerCase();}
  function allTerms(p){
    const lex=vocab.forPattern(p);
    return [...(lex.implementation||[]),...(lex.design||[]),...(lex.philosophy||[])];
  }
  function termMap(p){return new Map(allTerms(p).map(t=>[normalize(t.term),t]));}
  function termDiff(left,right){
    const A=termMap(left),B=termMap(right);
    const shared=[...A.entries()].filter(([k])=>B.has(k)).map(([,v])=>v);
    const onlyA=[...A.entries()].filter(([k])=>!B.has(k)).map(([,v])=>v);
    const onlyB=[...B.entries()].filter(([k])=>!A.has(k)).map(([,v])=>v);
    return {shared,onlyA,onlyB};
  }
  function axisRows(){
    return ds.axes.map(axis=>{
      const av=Number(a.designSpace?.[axis.key]??50);
      const bv=Number(b.designSpace?.[axis.key]??50);
      const diff=Math.abs(av-bv);
      return {axis,name:ds.axisNames[axis.key],a:av,b:bv,diff,aLabel:ds.axisPosition(axis,av),bLabel:ds.axisPosition(axis,bv)};
    });
  }
  function axisClass(diff){if(diff<=8)return 'shared';if(diff<=18)return 'close';if(diff<=32)return 'shift';return 'diverge';}
  function axisClassLabel(diff){if(diff<=8)return 'Shared';if(diff<=18)return 'Close';if(diff<=32)return 'Shift';return 'Diverges';}
  function option(p){return `<option value="${esc(p.id)}">${esc(p.brand)} — ${esc(p.name)}</option>`;}
  function renderSelectors(){
    const sorted=[...patterns].sort((x,y)=>`${x.brand} ${x.name}`.localeCompare(`${y.brand} ${y.name}`,'ja'));
    const html=sorted.map(option).join('');
    pairSelectA.innerHTML=html;pairSelectB.innerHTML=html;pairSelectA.value=a.id;pairSelectB.value=b.id;
  }
  function pairIsActive(pair){return (pair.a.id===a.id&&pair.b.id===b.id)||(pair.a.id===b.id&&pair.b.id===a.id);}
  function renderCurated(){
    pairCount.textContent=`${curatedPairs.length} curated contrasts`;
    curatedList.innerHTML=curatedPairs.map((pair,i)=>`<button type="button" data-a="${esc(pair.a.id)}" data-b="${esc(pair.b.id)}" aria-pressed="${pairIsActive(pair)}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(pair.a.brand)} ↔ ${esc(pair.b.brand)}</strong><small>${esc(pair.a.family)} / ${esc(pair.b.family)}</small></div></button>`).join('');
  }
  function patternPanel(p,label){
    return `<article class="compare-pattern"><div class="compare-pattern-head"><div><small>${esc(label)}</small><h2>${esc(p.brand)}</h2><p>${esc(p.name)}</p></div><a href="pattern.html?id=${encodeURIComponent(p.id)}">Analyze ↗</a></div><div class="compare-preview">${render(p,'detail')}</div><p class="compare-liner">${esc(p.oneLiner)}</p><div class="compare-context"><span><small>DOMAIN</small><b>${esc(p.domain||'—')}</b></span><span><small>ARCHETYPE</small><b>${esc(p.archetype||'—')}</b></span></div></article>`;
  }
  function termChips(items){
    if(!items.length)return '<span class="empty-chip">—</span>';
    return items.slice(0,10).map(t=>`<a href="vocabulary.html?term=${encodeURIComponent(t.term)}">${esc(t.term)}</a>`).join('');
  }
  function listItems(items,limit=4){return (items||[]).slice(0,limit).map(v=>`<li>${esc(v)}</li>`).join('');}
  function insight(rows){
    const ordered=[...rows].sort((x,y)=>x.diff-y.diff);
    const nearest=ordered[0],furthest=ordered[ordered.length-1];
    return `両者で最も近いのは ${nearest.name}（${a.brand} ${Math.round(nearest.a)} / ${b.brand} ${Math.round(nearest.b)}）。最大の分岐は ${furthest.name} で、${a.brand} は「${furthest.aLabel}」、${b.brand} は「${furthest.bLabel}」側に位置する。同じ問題を扱っていても、この軸の置き方で体験の性格が変わる。`;
  }
  function aiBrief(rows,terms){
    const ordered=[...rows].sort((x,y)=>y.diff-x.diff);
    const major=ordered[0],second=ordered[1];
    const shared=terms.shared.slice(0,5).map(t=>t.term).join(' / ')||'共通語彙なし';
    return `次の2つのデザイン参照を比較し、表層を混ぜずに差分を設計判断として使ってください。\n\nA: ${a.brand} / ${a.name}\nB: ${b.brand} / ${b.name}\n\n共通基盤:\n${shared}\n\n最大の分岐:\n- ${major.name}: A ${Math.round(major.a)} (${major.aLabel}) / B ${Math.round(major.b)} (${major.bLabel})\n- ${second.name}: A ${Math.round(second.a)} (${second.aLabel}) / B ${Math.round(second.b)} (${second.bLabel})\n\nAが向く文脈:\n${(a.useCases||[]).slice(0,3).map(x=>`- ${x}`).join('\n')}\n\nBが向く文脈:\n${(b.useCases||[]).slice(0,3).map(x=>`- ${x}`).join('\n')}\n\n新しい案では、どちらかの見た目を模倣するのではなく、共通原則を維持したまま、上記の分岐軸をどちら側へ寄せるか明示してください。`;
  }
  function renderComparison(){
    if(!a||!b)return;
    const rows=axisRows();
    const terms=termDiff(a,b);
    const distance=ds.distanceBetween(a.designSpace,b.designSpace);
    const sharedAxes=rows.filter(r=>r.diff<=12).length;
    const divergedAxes=rows.filter(r=>r.diff>=25).length;
    const brief=aiBrief(rows,terms);
    document.title=`${a.brand} vs ${b.brand} — Like What?`;
    const url=new URL(location.href);url.searchParams.set('a',a.id);url.searchParams.set('b',b.id);history.replaceState({},'',url);
    pairSelectA.value=a.id;pairSelectB.value=b.id;renderCurated();
    comparison.innerHTML=`
      <section class="compare-headline"><div><p class="eyebrow">CURRENT CONTRAST</p><h1>${esc(a.brand)} <span>vs</span> ${esc(b.brand)}</h1><p>${esc(insight(rows))}</p></div><div class="compare-score"><strong>${distance.toFixed(1)}</strong><span>Design Distance</span><small>${esc(ds.distanceLabel(distance))}</small></div></section>
      <section class="compare-pattern-grid">${patternPanel(a,'REFERENCE A')}<div class="compare-versus" aria-hidden="true">↔</div>${patternPanel(b,'REFERENCE B')}</section>
      <section class="compare-metrics"><div><strong>${sharedAxes}</strong><span>near-shared axes</span></div><div><strong>${divergedAxes}</strong><span>divergent axes</span></div><div><strong>${terms.shared.length}</strong><span>shared vocabulary</span></div><div><strong>${new Set([a.domain,b.domain]).size}</strong><span>domains</span></div></section>
      <section class="compare-section"><div class="compare-section-head"><p class="eyebrow">DESIGN SPACE / AXIS DELTA</p><h2>同じ場所と、分岐する場所。</h2><p>6軸を同じ物差しで重ねる。差が小さい軸は共通基盤、大きい軸は体験を分ける設計判断。</p></div><div class="axis-compare-list">${rows.map(r=>`<div class="axis-compare-row ${axisClass(r.diff)}"><div class="axis-compare-title"><strong>${esc(r.name)}</strong><span>${axisClassLabel(r.diff)} · Δ${Math.round(r.diff)}</span></div><div class="axis-compare-values"><span><b>A</b>${esc(r.aLabel)} ${Math.round(r.a)}</span><span><b>B</b>${esc(r.bLabel)} ${Math.round(r.b)}</span></div><div class="axis-compare-track" aria-label="${esc(r.name)} A ${Math.round(r.a)}, B ${Math.round(r.b)}"><i class="axis-a" style="left:${r.a}%"></i><i class="axis-b" style="left:${r.b}%"></i></div><div class="axis-compare-poles"><span>${esc(r.axis.low)}</span><span>${esc(r.axis.high)}</span></div></div>`).join('')}</div></section>
      <section class="compare-section"><div class="compare-section-head"><p class="eyebrow">VOCABULARY DELTA</p><h2>同じ原則を、どこまで共有している？</h2></div><div class="vocab-delta-grid"><article><small>SHARED</small><h3>共通語彙</h3><div class="compare-chips shared">${termChips(terms.shared)}</div></article><article><small>${esc(a.brand)} ONLY</small><h3>A側で強い語彙</h3><div class="compare-chips">${termChips(terms.onlyA)}</div></article><article><small>${esc(b.brand)} ONLY</small><h3>B側で強い語彙</h3><div class="compare-chips">${termChips(terms.onlyB)}</div></article></div></section>
      <section class="compare-section"><div class="compare-section-head"><p class="eyebrow">DECISION RULE</p><h2>どちらを選ぶべきか。</h2><p>「どちらが優れているか」ではなく、目的・利用文脈と設計優先順位の適合で選ぶ。</p></div><div class="decision-grid"><article><small>CHOOSE A / ${esc(a.brand)}</small><h3>${esc(a.oneLiner)}</h3><ul>${listItems(a.useCases)}</ul><div class="avoid"><b>避けたい文脈</b><ul>${listItems(a.avoid,3)}</ul></div></article><article><small>CHOOSE B / ${esc(b.brand)}</small><h3>${esc(b.oneLiner)}</h3><ul>${listItems(b.useCases)}</ul><div class="avoid"><b>避けたい文脈</b><ul>${listItems(b.avoid,3)}</ul></div></article></div></section>
      <section class="compare-section brief-section"><div class="compare-section-head"><p class="eyebrow">COMPARE BRIEF FOR AI</p><h2>差分そのものを、指示にする。</h2></div><div class="compare-brief"><pre id="compareBrief">${esc(brief)}</pre><button type="button" id="copyCompare">比較指示をコピー</button></div></section>`;
    document.getElementById('copyCompare')?.addEventListener('click',async e=>{
      try{await navigator.clipboard.writeText(document.getElementById('compareBrief').textContent);e.currentTarget.textContent='コピー済み';setTimeout(()=>e.currentTarget.textContent='比較指示をコピー',1400);}catch{e.currentTarget.textContent='選択してコピー';}
    });
  }
  function setPair(nextA,nextB){if(!nextA||!nextB||nextA.id===nextB.id)return;a=nextA;b=nextB;renderComparison();}
  pairSelectA.addEventListener('change',()=>{const next=byId.get(pairSelectA.value);if(next?.id===b.id){const old=a;a=b;b=old;}else a=next;renderComparison();});
  pairSelectB.addEventListener('change',()=>{const next=byId.get(pairSelectB.value);if(next?.id===a.id){const old=b;b=a;a=old;}else b=next;renderComparison();});
  swapBtn.addEventListener('click',()=>{[a,b]=[b,a];renderComparison();});
  curatedList.addEventListener('click',e=>{const btn=e.target.closest('[data-a][data-b]');if(!btn)return;setPair(byId.get(btn.dataset.a),byId.get(btn.dataset.b));comparison.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
  renderSelectors();renderCurated();renderComparison();
})();