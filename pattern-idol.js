(function(){
  const root=document.querySelector('.detail-page');
  const id=new URLSearchParams(location.search).get('id');
  const p=(window.LIKEWHAT_PATTERNS||[]).find(item=>item.id===id);
  if(!root||!p||p.collectionType!=='idol-era')return;
  const esc=window.LikeWhatUI?.esc||((v)=>String(v??''));
  const axes=[
    ['intimacy','Presence','Iconic','Intimate'],
    ['worldbuilding','Reality','Everyday','Worldbuilding'],
    ['assertiveness','Tone','Soft','Assertive'],
    ['collectiveCoding','Identity','Individual','Collective Coding'],
    ['participation','Relation','Editorial','Participatory'],
    ['transformation','Continuity','Stable','Era Transformation']
  ];
  const section=document.createElement('section');
  section.className='detail-block idol-era-context';
  section.innerHTML=`<div class="idol-era-head"><div><p class="eyebrow">ERA CONTEXT / IDOL LENS</p><h2>${esc(p.brand)} / ${esc(p.era||'Concept')}</h2><p>この値は品質点ではなく、同じアイドル表現の中で距離感・世界観・参加性を読む補助座標。ブランド全体ではなく、このEraだけの位置。</p></div><a href="brand.html?brand=${encodeURIComponent(p.brand)}">All ${esc(p.brand)} concepts ↗</a></div><div class="idol-era-axis-grid">${axes.map(([key,name,low,high])=>{const value=Number(p.idolLens?.[key]??50);return `<article><div><small>${esc(name)}</small><strong>${esc(low)} <i>↔</i> ${esc(high)}</strong><span>${value}</span></div><b><em style="width:${value}%"></em><i style="left:${value}%"></i></b></article>`;}).join('')}</div>`;
  const detailGrid=root.querySelector('.detail-grid');
  if(detailGrid)detailGrid.before(section);else root.appendChild(section);
})();
