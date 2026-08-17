(function(){
  const root=document.getElementById('patternGroups');
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const ds=window.LikeWhatDesignSpace;
  if(!root)return;

  const byId=new Map(patterns.map(p=>[p.id,p]));
  let diversityById=null;

  function hash(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function mode(){return document.getElementById('librarySort')?.value||'brand';}
  function seed(){return new URLSearchParams(location.search).get('seed')||'0';}

  function buildDiversityIndex(){
    if(diversityById||!ds)return diversityById||new Map();
    const valid=patterns.filter(p=>p.designSpace);
    const nearest=new Map(valid.map(p=>[p.id,Infinity]));
    for(let i=0;i<valid.length-1;i++){
      for(let j=i+1;j<valid.length;j++){
        const distance=ds.distanceBetween(valid[i].designSpace,valid[j].designSpace);
        if(distance<nearest.get(valid[i].id))nearest.set(valid[i].id,distance);
        if(distance<nearest.get(valid[j].id))nearest.set(valid[j].id,distance);
      }
    }
    const distances=[...nearest.values()].map(v=>Number.isFinite(v)?v:0);
    const denominator=Math.max(1,distances.length-1);
    diversityById=new Map();
    valid.forEach(pattern=>{
      const local=nearest.get(pattern.id);
      const below=distances.filter(value=>value<local).length;
      const equal=distances.filter(value=>value===local).length;
      const score=Math.max(0,Math.min(100,Math.round(((below+Math.max(0,equal-1)*0.5)/denominator)*100)));
      diversityById.set(pattern.id,score);
    });
    return diversityById;
  }

  function groupDiversity(card){
    if(card.dataset.sortDiversity)return Number(card.dataset.sortDiversity);
    const index=buildDiversityIndex();
    const ids=(card.dataset.patternIds||'').split('|').filter(Boolean);
    const values=ids.map(id=>index.get(id)).filter(value=>Number.isFinite(value));
    const score=values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
    card.dataset.sortDiversity=String(score);
    return score;
  }

  const axisKeys=new Set((ds?.axes||[]).map(a=>a.key));

  function apply(){
    const cards=[...root.querySelectorAll('.library-group-card')];
    const current=mode(),randomSeed=seed();
    cards.forEach(card=>{
      const index=Number(card.dataset.sortIndex||0);
      let order=index;
      if(axisKeys.has(current))order=-Number(card.dataset[`sort${current[0].toUpperCase()}${current.slice(1)}`]||0)*1000+index;
      else if(current==='diversity')order=-groupDiversity(card)*1000+index;
      else if(current==='random')order=hash(`${randomSeed}:${card.dataset.groupKey||''}`);
      card.style.order=String(order);
    });
  }

  document.addEventListener('likewhat:sort-change',apply);
  root.addEventListener('likewhat:groups-rendered',apply);
  apply();
})();
