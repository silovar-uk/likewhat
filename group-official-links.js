(function(){
  const patterns=(window.LIKEWHAT_PATTERNS||[]).filter(p=>p.groupType!=='industry-cluster');
  const root=document.getElementById('patternGroups');
  if(!root)return;
  function score(url){
    try{const u=new URL(url,location.href),path=u.pathname.replace(/\/+$/,'');let s=path.split('/').filter(Boolean).length*20+path.length;if(/help|support|docs?|manual|guideline/i.test(`${u.hostname}${path}`))s+=24;return s;}catch{return 9999;}
  }
  const urlByBrand=new Map();
  [...new Set(patterns.map(p=>p.brand))].forEach(brand=>{
    const urls=[...new Set(patterns.filter(p=>p.brand===brand).map(p=>p.sourceUrl).filter(Boolean))].sort((a,b)=>score(a)-score(b));
    if(urls[0])urlByBrand.set(brand,urls[0]);
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
  new MutationObserver(apply).observe(root,{childList:true,subtree:true});apply();
})();
