(function(){
  const root=document.getElementById('randomResults');
  if(!root)return;
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const byId=new Map(patterns.map(p=>[p.id,p]));

  function roleFor(pattern){
    const source=(pattern?.philosophy?.length?pattern.philosophy:pattern?.tags)||[];
    return source.slice(0,2).join(' / ') || pattern?.family || 'Design principle';
  }

  function enhance(){
    if(!root.children.length){root.classList.remove('collision-ready');return;}
    if(root.dataset.polished==='true')return;
    const analysis=root.querySelector('.random-analysis');
    const grid=root.querySelector('.random-grid');
    if(!analysis||!grid)return;

    const copy=analysis.querySelector('.random-analysis-copy');
    const metrics=analysis.querySelector('.random-metrics');
    const brief=analysis.querySelector('.collision-brief');
    const cards=[...grid.querySelectorAll('.pattern-card')];
    if(!copy||!cards.length)return;

    const head=document.createElement('div');
    head.className='collision-board-head';
    head.appendChild(copy);
    if(metrics)head.appendChild(metrics);

    const refs=document.createElement('div');
    refs.className='collision-reference-grid';
    cards.forEach((card,index)=>{
      card.classList.add('collision-reference');
      const href=card.getAttribute('href')||'';
      const id=new URL(href,location.href).searchParams.get('id');
      const pattern=byId.get(id);
      const badge=document.createElement('span');
      badge.className='collision-card-index';
      badge.textContent=String(index+1).padStart(2,'0');
      card.prepend(badge);
      const body=card.querySelector('.card-body');
      if(body&&pattern){
        const role=document.createElement('p');
        role.className='collision-card-role';
        role.innerHTML=`<b>ROLE</b> ${roleFor(pattern)}`;
        const arrow=body.querySelector('.card-arrow');
        if(arrow)body.insertBefore(role,arrow);else body.appendChild(role);
      }
      refs.appendChild(card);
    });

    analysis.classList.add('collision-consumed');
    grid.classList.add('collision-consumed');
    root.prepend(refs);
    root.prepend(head);
    if(brief)root.appendChild(brief);
    root.classList.add('collision-ready');
    root.dataset.polished='true';
  }

  const observer=new MutationObserver(()=>{
    if(!root.children.length){root.dataset.polished='';root.classList.remove('collision-ready');return;}
    if(root.querySelector('.random-analysis:not(.collision-consumed)')){
      root.dataset.polished='';
      enhance();
    }
  });
  observer.observe(root,{childList:true});
  enhance();
})();