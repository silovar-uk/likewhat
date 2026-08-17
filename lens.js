(function(){
  const ds=window.LikeWhatDesignSpace;

  // 与えられたcentroid(グループの6軸平均)と、ライブラリ全体平均を比較し、
  // 偏差が大きい順に軸を並べて返す。catalog-core由来の値のみを使うため、
  // 追加のネットワーク取得は発生しない。
  function topDeviationAxes(centroid,libraryMean,limit=6){
    if(!ds||!centroid||!libraryMean)return [];
    return ds.axes.map(axis=>{
      const value=Number(centroid[axis.key]);
      const meanValue=Number(libraryMean[axis.key]);
      if(!Number.isFinite(value)||!Number.isFinite(meanValue))return null;
      return {key:axis.key,name:(ds.axisNames&&ds.axisNames[axis.key])||axis.key,value:Math.round(value),diff:Math.round(value-meanValue)};
    }).filter(Boolean).sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff)).slice(0,limit);
  }

  function maxDeviationAxis(centroid,libraryMean){
    return topDeviationAxes(centroid,libraryMean,1)[0]||null;
  }

  window.LikeWhatLens={maxDeviationAxis,topDeviationAxes};
})();
