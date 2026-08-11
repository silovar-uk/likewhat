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
      if(kicker)kicker.textContent=`ARTIST · ${items.length} ERA / CONCEPT${items.length===1?'':'S'}`;
      const footer=card.querySelector('.library-group-main>footer span');
      if(footer)footer.textContent='Explore artist';
    });
  }
  root.addEventListener('likewhat:groups-rendered',apply);
  apply();
})();
