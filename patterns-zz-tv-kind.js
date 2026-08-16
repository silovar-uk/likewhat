(function(){
  // Pattern source files are loaded alphabetically within the same source rank.
  // This normalization runs after patterns-tv.js so television references are
  // first-class Program entries rather than being mislabeled as Brand entries.
  for(const pattern of window.LIKEWHAT_PATTERNS||[]){
    if(pattern.domain==='Media / Television')pattern.entryKind='program';
  }
})();
