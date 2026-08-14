(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const browser=document.getElementById('patterns');
  if(!browser||!patterns.length)return;
  const KEY={saved:'likewhat:saved:v1',recent:'likewhat:recent:v1',compare:'likewhat:compare:v1'};
  const read=key=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[];}catch{return[];}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  const byId=new Map(patterns.map(p=>[p.id,p]));
  const valid=ids=>ids.filter(id=>byId.has(id));

  const shell=document.createElement('section');
  shell.className='library-memory';
  shell.innerHTML='<div class="memory-tabs"><button type="button" data-memory="saved">★ Saved <small>0</small></button><button type="button" data-memory="recent">↺ Recent <small>0</small></button><button type="button" data-memory="compare">⇄ Compare <small>0</small></button></div><div class="memory-panel" hidden></div>';
  const anchor=document.getElementById('activeFilters')||browser.querySelector('.browser-head');
  anchor.after(shell);
  const panel=shell.querySelector('.memory-panel');
  let open='';

  function idsFor(type){return valid(read(KEY[type]));}
  function renderCounts(){shell.querySelectorAll('[data-memory]').forEach(btn=>btn.querySelector('small').textContent=idsFor(btn.dataset.memory).length);}
  function item(pattern,type){
    const removable=type!=='recent';
    return `<article><a href="pattern.html?id=${encodeURIComponent(pattern.id)}"><small>${pattern.entryKind||'Reference'} · ${pattern.brand}</small><strong>${pattern.name}</strong><span>${pattern.oneLiner||''}</span></a>${removable?`<button type="button" data-remove-memory="${type}" data-id="${pattern.id}" aria-label="${pattern.name}を外す">×</button>`:''}</article>`;
  }
  function renderPanel(){
    renderCounts();
    if(!open){panel.hidden=true;panel.innerHTML='';return;}
    const ids=idsFor(open),items=ids.map(id=>byId.get(id)).filter(Boolean);
    panel.hidden=false;
    const compareAction=open==='compare'&&items.length>=2?`<a class="memory-compare-action" href="compare.html?a=${encodeURIComponent(items[0].id)}&b=${encodeURIComponent(items[1].id)}">最初の2件をContrast ↗</a>`:'';
    panel.innerHTML=`<div class="memory-panel-head"><strong>${open==='saved'?'Saved references':open==='recent'?'Recently viewed':'Compare tray'}</strong><button type="button" data-memory-close>Close</button></div>${items.length?`<div class="memory-items">${items.slice(0,12).map(p=>item(p,open)).join('')}</div>${compareAction}`:'<p class="memory-empty">まだ入っていない。Pattern Detailから追加できる。</p>'}`;
  }
  shell.addEventListener('click',event=>{
    const tab=event.target.closest('[data-memory]');
    if(tab){open=open===tab.dataset.memory?'':tab.dataset.memory;shell.querySelectorAll('[data-memory]').forEach(btn=>btn.classList.toggle('active',btn.dataset.memory===open));renderPanel();return;}
    if(event.target.closest('[data-memory-close]')){open='';shell.querySelectorAll('[data-memory]').forEach(btn=>btn.classList.remove('active'));renderPanel();return;}
    const remove=event.target.closest('[data-remove-memory]');
    if(remove){const type=remove.dataset.removeMemory;write(KEY[type],idsFor(type).filter(id=>id!==remove.dataset.id));renderPanel();window.dispatchEvent(new CustomEvent('likewhat:memory-change'));}
  });
  window.addEventListener('storage',renderPanel);
  window.addEventListener('likewhat:memory-change',renderPanel);
  renderCounts();
})();
