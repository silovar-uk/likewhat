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
  function groupDiversity(items){
    if(!ds)return 0;
    return Math.round(average(items,p=>ds.diversity(p,patterns)?.score??0));
  }

  function build(source=patterns){
    const normal=source.filter(p=>p.groupType!=='industry-cluster');
    const clusters=source.filter(p=>p.groupType==='industry-cluster');
    const seen=new Set();
    const groups=[];

    normal.forEach((p,index)=>{
      if(seen.has(p.brand))return;
      seen.add(p.brand);
      const items=normal.filter(x=>x.brand===p.brand);
      groups.push({
        key:`brand:${p.brand}`,
        type:'brand',
        title:p.brand,
        brand:p.brand,
        patterns:items,
        count:items.length,
        firstIndex:index,
        centroid:centroid(items),
        range:range(items),
        diversity:groupDiversity(items),
        memberBrands:[p.brand]
      });
    });

    clusters.forEach((p,index)=>groups.push({
      key:`cluster:${p.id}`,
      type:'industry-cluster',
      title:p.name,
      brand:p.brand,
      industry:p.industry,
      patterns:[p],
      count:1,
      firstIndex:normal.length+index,
      centroid:centroid([p]),
      range:range([p]),
      diversity:groupDiversity([p]),
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
