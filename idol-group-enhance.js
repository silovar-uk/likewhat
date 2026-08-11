(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const root=document.getElementById('patternGroups');
  if(!root)return;
  const idolBrands=new Map();
  patterns.filter(p=>p.collectionType==='idol-era').forEach(p=>{
    if(!idolBrands.has(p.brand))idolBrands.set(p.brand,[]);
    idolBrands.get(p.brand).push(p);
  });
  function apply(){
    root.querySelectorAll('.brand-group-card').forEach(card=>{
      const brand=card.dataset.brand,items=idolBrands.get(brand);if(!items?.length)return;
      card.classList.add('artist-group-card');
      const kicker=card.querySelector('.library-group-main>header small');
      if(kicker)kicker.textContent=`ARTIST · ${items.length} CONCEPT PATTERN${items.length===1?'':'S'}`;
      const footer=card.querySelector('.library-group-main>footer span');
      if(footer)footer.textContent='Explore artist';
      const more=card.querySelector('.group-pattern-list>p');
      if(more){const hidden=Math.max(0,items.length-4);more.textContent=`+ ${hidden} more concept patterns`;}
      card.querySelectorAll('.group-pattern-list>div').forEach((row,index)=>{
        const item=items[index];if(!item)return;
        const sub=row.querySelector('span');if(sub)sub.textContent=item.era||'Concept Era';
      });
    });
  }
  new MutationObserver(apply).observe(root,{childList:true,subtree:true});apply();
})();
