(function(){
  const ui=window.LikeWhatUI;
  const patterns=window.LIKEWHAT_PATTERNS||[];
  if(!ui||typeof ui.render!=='function'||!patterns.length)return;

  const baseRender=ui.render;
  const byId=new Map(patterns.map(p=>[p.id,p]));
  const pending=[];
  let frame=0;

  function placeholder(pattern,size){
    const label=(pattern.name||pattern.brand||'Preview').replace(/^.*?[—–-]\s*/,'');
    return `<div class="lw-lazy-preview" data-preview-id="${ui.esc(pattern.id)}" data-preview-size="${ui.esc(size)}" aria-hidden="true"><span>${ui.esc(label.slice(0,34))}</span><i></i></div>`;
  }

  function render(pattern,size='card'){
    if(size==='related'&&document.getElementById('patternGroups'))return placeholder(pattern,size);
    return baseRender(pattern,size);
  }
  window.LikeWhatUI={...ui,render};

  function hydrate(node){
    if(!(node instanceof Element)||node.dataset.hydrated==='1')return;
    const pattern=byId.get(node.dataset.previewId);
    if(!pattern)return;
    node.dataset.hydrated='1';
    node.insertAdjacentHTML('afterend',baseRender(pattern,node.dataset.previewSize||'related'));
    node.remove();
  }

  function flush(){
    frame=0;
    let count=0;
    while(pending.length&&count<4){
      const node=pending.shift();
      if(node?.isConnected)hydrate(node);
      count++;
    }
    if(pending.length)frame=requestAnimationFrame(flush);
  }
  function queue(node){
    if(!node||node.dataset.queued==='1')return;
    node.dataset.queued='1';
    pending.push(node);
    if(!frame)frame=requestAnimationFrame(flush);
  }

  const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      io.unobserve(entry.target);
      queue(entry.target);
    });
  },{rootMargin:'700px 0px 700px'}):null;

  function observe(root=document){
    const nodes=[];
    if(root instanceof Element&&root.matches('.lw-lazy-preview'))nodes.push(root);
    root.querySelectorAll?.('.lw-lazy-preview').forEach(node=>nodes.push(node));
    nodes.forEach(node=>{
      const card=node.closest('.library-group-card');
      const rect=card?.getBoundingClientRect();
      if(!io||(rect&&rect.top<window.innerHeight+500&&rect.bottom>-300))queue(node);
      else io.observe(node);
    });
  }

  const groups=document.getElementById('patternGroups');
  if(groups){
    new MutationObserver(mutations=>{
      mutations.forEach(m=>m.addedNodes.forEach(node=>{if(node instanceof Element)observe(node);}));
    }).observe(groups,{childList:true});
    observe(groups);
  }
})();
