(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const repairs={
    'fmarinos-action-oriented-ticketing':{
      related:['mancity-matchday-service-hub','frontale-match-navi']
    },
    'apple-macos-sidebar':{philosophy:['Persistent orientation','Hierarchy through disclosure','Stable spatial memory','Progressive navigation']},
    'apple-wallet-stack':{philosophy:['Objects before menus','Spatial grouping','Immediate recognition','Contextual action']},
    'notion-property-panel':{philosophy:['Structure stays editable','Metadata in context','Progressive disclosure','Content first']},
    'linear-workspace-sidebar':{philosophy:['Navigation as operating memory','Dense but stable hierarchy','Keyboard-ready structure','Low-friction switching']},
    'arc-vertical-tabs':{philosophy:['Context over chrome','Persistent spatial organization','Browsing as workspace','Reduced horizontal competition']},
    'slack-workspace':{philosophy:['Conversation as information architecture','Persistent social context','Channels as shared memory','Activity over documents']},
    'slack-composer':{philosophy:['Action at point of expression','Progressive tool disclosure','Conversation continuity','Rich input without modal interruption']}
  };
  for(const [id,patch] of Object.entries(repairs)){
    const pattern=patterns.find(item=>item.id===id);
    if(pattern)Object.assign(pattern,patch);
  }
})();
