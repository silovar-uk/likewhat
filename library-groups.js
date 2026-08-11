(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const ds=window.LikeWhatDesignSpace;
  const axes=ds?.axes||[];

  function average(items,fn){return items.length?items.reduce((sum,item)=>sum+fn(item),0)/items.length:0;}
  function centroid(items){
    const out={};
    axes.forEach(axis=>{out[axis.key]=Math.round(average(items,p=>Number(p.designSpace?.[axis.key]??50)));});
    return out;
  }
  function range(items){
    const out={};
    axes.forEach(axis=>{
      const values=items.map(p=>Number(p.designSpace?.[axis.key]??50));
      out[axis.key]={min:Math.min(...values),max:Math.max(...values)};
    });
    return out;
  }

  function build(source=patterns){
    const normal=[];
    const clusters=[];
    source.forEach(p=>(p.groupType==='industry-cluster'?clusters:normal).push(p));

    const byBrand=new Map();
    normal.forEach(p=>{
      if(!byBrand.has(p.brand))byBrand.set(p.brand,[]);
      byBrand.get(p.brand).push(p);
    });

    const groups=[];
    let index=0;
    byBrand.forEach((items,brand)=>{
      groups.push({
        key:`brand:${brand}`,
        type:'brand',
        title:brand,
        brand,
        patterns:items,
        count:items.length,
        firstIndex:index++,
        centroid:centroid(items),
        range:range(items),
        memberBrands:[brand]
      });
    });

    clusters.forEach(p=>groups.push({
      key:`cluster:${p.id}`,
      type:'industry-cluster',
      title:p.name,
      brand:p.brand,
      industry:p.industry,
      patterns:[p],
      count:1,
      firstIndex:index++,
      centroid:centroid([p]),
      range:range([p]),
      memberBrands:p.memberBrands||[],
      cluster:p
    }));

    return groups;
  }

  function filterGroups(groups,{brand='All'}={}){
    if(brand==='All')return groups;
    return groups.filter(group=>group.brand===brand||group.memberBrands.includes(brand));
  }

  window.LikeWhatLibraryGroups={build,filterGroups,centroid,range};
})();
