(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  if(!patterns.length)return;

  function scoreSource(url){
    try{const u=new URL(url,location.href);if(!/^https?:$/.test(u.protocol))return Number.POSITIVE_INFINITY;const path=u.pathname.replace(/\/+$/,'');const segments=path.split('/').filter(Boolean).length;const text=`${u.hostname}${path}`.toLowerCase();let score=segments*20+path.length;if(/\b(help|support|docs?|documentation|guidelines?|manual)\b/.test(text))score+=24;if(/developer\./.test(u.hostname))score+=10;return score;}catch{return Number.POSITIVE_INFINITY;}
  }

  const brandPatterns=patterns.filter(p=>p.groupType!=='industry-cluster');
  const brandSources=new Map();
  [...new Set(brandPatterns.map(p=>p.brand))].forEach(brand=>{
    const candidates=brandPatterns.filter(p=>p.brand===brand&&p.sourceUrl).map(p=>p.sourceUrl).filter((url,index,all)=>all.indexOf(url)===index).sort((a,b)=>scoreSource(a)-scoreSource(b));
    if(candidates[0])brandSources.set(brand,candidates[0]);
  });

  patterns.forEach(pattern=>{pattern.brandUrl=pattern.groupType==='industry-cluster'?'':(brandSources.get(pattern.brand)||pattern.sourceUrl||'');});
  window.LikeWhatReferences={
    brandUrlFor(value){if(typeof value==='object'&&value?.groupType==='industry-cluster')return'';const brand=typeof value==='string'?value:value?.brand;return brandSources.get(brand)||value?.sourceUrl||'';},
    sourceUrlFor(pattern){return pattern?.sourceUrl||'';},
    sourceLabelFor(pattern){return pattern?.sourceLabel||'Reference source';},
    brandSources
  };

  function wire(el,brand,{keyboard=false}={}){
    if(!el||!brand||el.dataset.brandExternal)return;const url=brandSources.get(brand);if(!url)return;
    el.dataset.brandExternal=url;el.classList.add('brand-external-link');el.title=`${brand} — official reference`;el.setAttribute('aria-label',`${brand}の公式サイトを新しいタブで開く`);if(keyboard){el.setAttribute('role','link');el.tabIndex=0;}
  }
  function sourceCard(kind,label,title,meta,url){
    if(!url)return null;const a=document.createElement('a');a.className=`reference-source-card reference-source-${kind}`;a.href=url;a.target='_blank';a.rel='noreferrer';const small=document.createElement('small');small.textContent=label;const strong=document.createElement('strong');strong.textContent=`${title} ↗`;const span=document.createElement('span');span.textContent=meta||url;a.append(small,strong,span);return a;
  }
  function enhanceDetailSources(detail,pattern){
    if(!detail||!pattern||pattern.groupType==='industry-cluster'||detail.querySelector('.reference-source-stack'))return;
    const source=detail.querySelector('.source-link');if(!source)return;const stack=document.createElement('div');stack.className='reference-source-stack';const brandCard=sourceCard('brand','OFFICIAL BRAND',pattern.brand,pattern.brandUrl,pattern.brandUrl);const referenceCard=sourceCard('reference','REFERENCE SOURCE',pattern.sourceLabel||'Source',pattern.sourceUrl,pattern.sourceUrl);if(brandCard)stack.appendChild(brandCard);if(referenceCard)stack.appendChild(referenceCard);source.replaceWith(stack);
  }
  function apply(root=document){
    root.querySelectorAll?.('.pattern-card[data-brand]').forEach(card=>{wire(card.querySelector('.card-meta span:first-child'),card.dataset.brand);});
    const detail=document.querySelector('.detail-page');
    if(detail){const id=new URLSearchParams(location.search).get('id');const pattern=patterns.find(p=>p.id===id)||patterns[0];const crumbSpans=detail.querySelectorAll('.breadcrumb span');if(pattern&&pattern.groupType!=='industry-cluster'&&crumbSpans[1])wire(crumbSpans[1],pattern.brand,{keyboard:true});enhanceDetailSources(detail,pattern);}
  }
  function openBrand(target,event){const url=target?.dataset?.brandExternal;if(!url)return;event.preventDefault();event.stopPropagation();window.open(url,'_blank','noopener,noreferrer');}
  document.addEventListener('click',event=>{const target=event.target.closest?.('[data-brand-external]');if(target)openBrand(target,event);});
  document.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const target=event.target.closest?.('[data-brand-external][role="link"]');if(target)openBrand(target,event);});
  apply(document);
  const observer=new MutationObserver(mutations=>{for(const mutation of mutations){for(const node of mutation.addedNodes){if(node instanceof Element)apply(node);}}});observer.observe(document.body,{childList:true,subtree:true});
})();
