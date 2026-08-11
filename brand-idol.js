(function(){
  const root=document.getElementById('brandPage');
  const brand=new URLSearchParams(location.search).get('brand')||'';
  const items=(window.LIKEWHAT_PATTERNS||[]).filter(p=>p.brand===brand&&p.collectionType==='idol-era');
  if(!root||!items.length)return;

  const axes=[
    {key:'intimacy',name:'Presence',low:'Iconic',high:'Intimate'},
    {key:'worldbuilding',name:'Reality',low:'Everyday',high:'Worldbuilding'},
    {key:'assertiveness',name:'Tone',low:'Soft',high:'Assertive'},
    {key:'collectiveCoding',name:'Identity',low:'Individual',high:'Collective Coding'},
    {key:'participation',name:'Relation',low:'Editorial',high:'Participatory'},
    {key:'transformation',name:'Continuity',low:'Stable Identity',high:'Era Transformation'}
  ];
  const avg=values=>Math.round(values.reduce((a,b)=>a+b,0)/values.length);
  const esc=window.LikeWhatUI?.esc||((v)=>String(v??''));

  const eyebrow=root.querySelector('.brand-hero .eyebrow');
  if(eyebrow)eyebrow.textContent='ARTIST VIEW / ERA & CONCEPT GRAMMARS';
  const heroCopy=root.querySelector('.brand-hero-grid > div:first-child > p:last-child');
  if(heroCopy)heroCopy.textContent=`同じアーティストでも、Eraが変われば世界観・距離感・自己像は動く。${items.length}個のConcept Patternを、ひとつのアーティスト名の下で比較する。`;
  const summary=root.querySelectorAll('.brand-summary-strip > div');
  if(summary[0]){summary[0].querySelector('small').textContent='CONCEPT PATTERNS';summary[0].querySelector('strong').textContent=items.length;}
  if(summary[1]){summary[1].querySelector('small').textContent='ERAS';summary[1].querySelector('strong').textContent=new Set(items.map(p=>p.era).filter(Boolean)).size;}
  if(summary[2]){summary[2].querySelector('small').textContent='ARTIST TYPE';summary[2].querySelector('strong').textContent='Idol / Pop';}

  const rangeTitle=root.querySelector('.brand-range h2');
  if(rangeTitle)rangeTitle.textContent=`${brand}らしさは、1つのEraではない。`;
  const rangeCopy=root.querySelector('.brand-range > div:first-child > p:last-child');
  if(rangeCopy)rangeCopy.textContent='既存6軸ではEraごとの設計位置をRangeとして保持する。下のIdol Lensでは、アイドル／アーティスト特有の距離感・世界観・参加性・変身幅を別軸で読む。';

  const patternEyebrow=root.querySelector('.brand-patterns .eyebrow');
  if(patternEyebrow)patternEyebrow.textContent='ERA / CONCEPT PATTERNS';
  const patternTitle=root.querySelector('.brand-patterns-head h2');
  if(patternTitle)patternTitle.textContent=`${items.length}つの異なる世界観。`;
  const patternNote=root.querySelector('.brand-patterns-head > p');
  if(patternNote)patternNote.textContent='Eraごとに「何を残し、何を変えたか」を読む。';

  root.querySelectorAll('.brand-pattern-card').forEach((card,index)=>{
    const item=items[index];
    const meta=card.querySelector('.brand-pattern-copy > span');
    if(meta&&item)meta.textContent=`${String(index+1).padStart(2,'0')} / ${item.era||'CONCEPT'}`;
  });

  const lens=document.createElement('section');
  lens.className='idol-lens-section';
  lens.innerHTML=`<div class="idol-lens-head"><div><p class="eyebrow">IDOL LENS / INDUSTRY-SPECIFIC READING</p><h2>世界観を、6つの距離で読む。</h2><p>Design Spaceを置き換える採点ではない。同じアイドル表現の中で「親密さ／象徴性」「日常／世界構築」などを比較する補助Lens。</p></div><span>${items.length} concept${items.length===1?'':'s'}</span></div><div class="idol-lens-grid">${axes.map(axis=>{
    const values=items.map(p=>Number(p.idolLens?.[axis.key]??50));
    const min=Math.min(...values),max=Math.max(...values),mean=avg(values);
    return `<article><div><small>${esc(axis.name)}</small><strong>${esc(axis.low)} <i>↔</i> ${esc(axis.high)}</strong><span>${min===max?min:`${min}–${max}`}</span></div><div class="idol-lens-track"><em style="left:${min}%;width:${Math.max(2,max-min)}%"></em><b style="left:${mean}%"></b></div></article>`;
  }).join('')}</div>${items.length>1?`<div class="idol-era-mini">${items.map(item=>`<div><span>${esc(item.era||item.name)}</span>${axes.map(axis=>`<i title="${esc(axis.name)} ${item.idolLens?.[axis.key]??50}"><em style="width:${item.idolLens?.[axis.key]??50}%"></em></i>`).join('')}</div>`).join('')}</div>`:''}`;

  const patternsSection=root.querySelector('.brand-patterns');
  if(patternsSection)patternsSection.before(lens); else root.appendChild(lens);
})();
