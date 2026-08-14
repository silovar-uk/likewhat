(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const repairs={
    'fmarinos-action-oriented-ticketing':{
      related:['mancity-matchday-service-hub','frontale-match-navi']
    }
  };
  for(const [id,patch] of Object.entries(repairs)){
    const pattern=patterns.find(item=>item.id===id);
    if(pattern)Object.assign(pattern,patch);
  }
})();
