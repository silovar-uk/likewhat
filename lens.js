(function(){
  const ds=window.LikeWhatDesignSpace;

  // 与えられたcentroid(グループの6軸平均)と、ライブラリ全体平均を比較し、
  // 最も偏差が大きい軸を1つ返す。catalog-core由来の値のみを使うため、
  // 追加のネットワーク取得は発生しない。
  function maxDeviationAxis(centroid,libraryMean){
    if(!ds||!centroid||!libraryMean)return null;
    let best=null;
    ds.axes.forEach(axis=>{
      const value=Number(centroid[axis.key]);
      const meanValue=Number(libraryMean[axis.key]);
      if(!Number.isFinite(value)||!Number.isFinite(meanValue))return;
      const diff=value-meanValue;
      if(!best||Math.abs(diff)>Math.abs(best.diff)){
        best={key:axis.key,name:(ds.axisNames&&ds.axisNames[axis.key])||axis.key,value:Math.round(value),diff:Math.round(diff)};
      }
    });
    return best;
  }

  window.LikeWhatLens={maxDeviationAxis};
})();
