(function(){
  const root=document.getElementById('patternGroups');
  if(!root)return;
  function hash(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function mode(){return document.getElementById('librarySort')?.value||'brand';}
  function seed(){return new URLSearchParams(location.search).get('seed')||'0';}
  function apply(){
    const cards=[...root.querySelectorAll('.library-group-card')];
    const current=mode(),randomSeed=seed();
    cards.forEach(card=>{
      let order=Number(card.dataset.sortIndex||0);
      if(current==='density')order=-Number(card.dataset.sortDensity||0)*1000+Number(card.dataset.sortIndex||0);
      else if(current==='exploration')order=-Number(card.dataset.sortExploration||0)*1000+Number(card.dataset.sortIndex||0);
      else if(current==='diversity')order=-Number(card.dataset.sortDiversity||0)*1000+Number(card.dataset.sortIndex||0);
      else if(current==='random')order=hash(`${randomSeed}:${card.dataset.groupKey||''}`);
      card.style.order=String(order);
    });
  }
  document.addEventListener('change',e=>{if(e.target?.id==='librarySort')queueMicrotask(apply);});
  document.addEventListener('click',e=>{if(e.target.closest?.('.sort-reroll'))setTimeout(apply,0);});
  const observer=new MutationObserver(apply);observer.observe(root,{childList:true,subtree:true});
  apply();
})();
