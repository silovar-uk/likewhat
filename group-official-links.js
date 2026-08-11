(function(){
  const patterns=(window.LIKEWHAT_PATTERNS||[]).filter(p=>p.groupType!=='industry-cluster');
  const root=document.getElementById('patternGroups');
  if(!root)return;
  function score(url){
    try{const u=new URL(url,location.href),path=u.pathname.replace(/\/+$/,'');let s=path.split('/').filter(Boolean).length*20+path.length;if(/help|support|docs?|manual|guideline/i.test(`${u.hostname}${path}`))s+=24;return s;}catch{return 9999;}
  }
  const candidates=new Map();
  patterns.forEach(p=>{
    if(!p.sourceUrl)return;
    if(!candidates.has(p.brand))candidates.set(p.brand,new Set());
    candidates.get(p.brand).add(p.sourceUrl);
  });
  const urlByBrand=new Map();
  candidates.forEach((urls,brand)=>{
    const best=[...urls].sort((a,b)=>score(a)-score(b))[0];
    if(best)urlByBrand.set(brand,best);
  });

  function apply(){
    root.querySelectorAll('.brand-group-card').forEach(card=>{
      if(card.querySelector('.group-official-link'))return;
      const brand=card.dataset.brand,url=urlByBrand.get(brand);if(!url)return;
      const link=document.createElement('a');
      link.className='group-official-link';link.href=url;link.target='_blank';link.rel='noreferrer';link.textContent='Official ↗';link.setAttribute('aria-label',`${brand}の公式サイトを新しいタブで開く`);
      card.appendChild(link);
    });
  }
  root.addEventListener('likewhat:groups-rendered',apply);
  apply();
})();
