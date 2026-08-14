(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const ds=window.LikeWhatDesignSpace;
  const kinds=window.LikeWhatEntryKinds;
  const axes=ds?.axes||[];

  function average(items,fn){return items.length?items.reduce((sum,item)=>sum+fn(item),0)/items.length:0;}
  function centroid(items){const out={};axes.forEach(axis=>{out[axis.key]=Math.round(average(items,p=>Number(p.designSpace?.[axis.key]??50)));});return out;}
  function range(items){const out={};axes.forEach(axis=>{const values=items.map(p=>Number(p.designSpace?.[axis.key]??50));out[axis.key]={min:Math.min(...values),max:Math.max(...values)};});return out;}
  function entryKindFor(pattern){return kinds?.infer?.(pattern)||pattern.entryKind||'brand';}

  function build(source=patterns){
    const clusters=[];
    const scenes=[];
    const collections=[];
    source.forEach(p=>{
      const kind=entryKindFor(p);
      if(kind==='industry-cluster')clusters.push(p);
      else if(kind==='scene')scenes.push(p);
      else collections.push(p);
    });

    const byCollection=new Map();
    collections.forEach(p=>{
      const key=`${entryKindFor(p)}:${p.brand}`;
      if(!byCollection.has(key))byCollection.set(key,{brand:p.brand,entryKind:entryKindFor(p),items:[]});
      byCollection.get(key).items.push(p);
    });

    const groups=[];
    let index=0;
    byCollection.forEach(({brand,entryKind,items})=>groups.push({
      key:`${entryKind}:${brand}`,
      type:entryKind,
      entryKind,
      title:brand,
      brand,
      patterns:items,
      count:items.length,
      firstIndex:index++,
      centroid:centroid(items),
      range:range(items),
      memberBrands:[brand]
    }));

    const byScene=new Map();
    scenes.forEach(p=>{
      const scene=p.scene||'Scene';
      if(!byScene.has(scene))byScene.set(scene,[]);
      byScene.get(scene).push(p);
    });
    byScene.forEach((items,scene)=>groups.push({
      key:`scene:${scene}`,
      type:'scene',
      entryKind:'scene',
      title:scene,
      brand:'Scene',
      scene,
      patterns:items,
      count:items.length,
      firstIndex:index++,
      centroid:centroid(items),
      range:range(items),
      memberBrands:[...new Set(items.map(p=>p.brand))]
    }));

    clusters.forEach(p=>groups.push({
      key:`cluster:${p.id}`,
      type:'industry-cluster',
      entryKind:'industry-cluster',
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

  window.LikeWhatLibraryGroups={build,centroid,range,entryKindFor};
})();
