(function(){
  const infer=pattern=>{
    if(pattern.entryKind)return pattern.entryKind;
    if(pattern.groupType==='industry-cluster')return 'industry-cluster';
    if(pattern.scene)return 'scene';
    if(pattern.collectionType==='idol-era')return 'artist';
    if(pattern.domain==='Education'||/University|大学|慶應|早稲田|東京大学|京都大学|MIT|Harvard|Oxford|Cambridge|Stanford/i.test(pattern.brand||''))return 'institution';
    return 'brand';
  };
  const label={brand:'Brand',artist:'Artist',institution:'Institution',scene:'Scene', 'industry-cluster':'Industry Cluster'};
  window.LikeWhatEntryKinds={infer,label};
})();
