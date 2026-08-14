(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const selected=window.LIKEWHAT_PATTERN_DATA?.selected;
  const ds=window.LikeWhatDesignSpace;
  const ui=window.LikeWhatUI;
  const root=document.getElementById('patternPage');
  if(!selected?.designSpace||!ds||!ui?.render||!root)return;
  const esc=ui.esc;
  const kind=p=>p.entryKind||(p.scene?'scene':p.collectionType==='idol-era'?'artist':p.groupType==='industry-cluster'?'industry-cluster':'brand');
  const candidates=patterns.filter(p=>p.id!==selected.id&&p.designSpace);
  const distance=p=>ds.distanceBetween(selected.designSpace,p.designSpace);
  const sameContext=p=>{
    if(selected.scene)return p.scene===selected.scene;
    if(kind(selected)==='institution')return kind(p)==='institution';
    if(selected.domain)return p.domain===selected.domain;
    return kind(p)===kind(selected);
  };
  const within=candidates.filter(sameContext).sort((a,b)=>distance(a)-distance(b))[0]||null;
  const across=candidates.filter(p=>!sameContext(p)&&(p.domain!==selected.domain||kind(p)!==kind(selected))).map(p=>({p,d:distance(p),bonus:(p.domain!==selected.domain?4:0)+(kind(p)!==kind(selected)?5:0)})).sort((a,b)=>(a.d-a.bonus)-(b.d-b.bonus))[0]?.p||null;
  if(!within&&!across)return;

  function card(p,label,copy){
    if(!p)return'';
    const d=distance(p);const diffs=ds.differenceBreakdown(selected.designSpace,p.designSpace).slice(0,2);
    return `<a class="context-neighbor" href="compare.html?a=${encodeURIComponent(selected.id)}&b=${encodeURIComponent(p.id)}"><div class="context-neighbor-preview">${ui.render(p,'related')}</div><div class="context-neighbor-copy"><small>${esc(label)}</small><strong>${esc(p.brand)}</strong><span>${esc(p.name)}</span><p>${esc(copy)} Distance ${d.toFixed(1)}.</p><div class="context-neighbor-diffs">${diffs.map(x=>`<b>${esc(x.name)} Δ${Math.round(x.diff)}</b>`).join('')}</div></div></a>`;
  }
  const section=document.createElement('section');section.className='context-neighbors';
  section.innerHTML=`<div class="context-neighbors-head"><div><p class="eyebrow">CONTEXT SWITCH / SERIOUS × SERENDIPITY</p><h2>近い、を2種類に分ける。</h2></div><p>同じ問題領域で微差を見る比較と、別世界へ原則を持ち運ぶ比較を混ぜない。</p></div><div class="context-neighbor-grid">${card(within,'WITHIN CONTEXT','同じScene / Institution / Domainを優先した最寄り参照。')}${card(across,'ACROSS WORLDS','別文脈の中で設計座標が比較的近い参照。原則の移植可能性を見る。')}</div>`;
  const next=root.querySelector('.next-references-block');
  if(next)next.before(section);else root.querySelector('.detail-grid')?.after(section);
})();
