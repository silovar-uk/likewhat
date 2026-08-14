(function(){
  const input=document.getElementById('searchInput');
  const anchor=document.querySelector('.secondary-filter-row');
  const patterns=window.LIKEWHAT_PATTERNS||[];
  if(!input||!anchor)return;
  const scenes=[...new Set(patterns.map(p=>p.scene).filter(Boolean))];
  if(!scenes.length)return;

  const row=document.createElement('div');
  row.className='secondary-filter-row scene-filter-row';
  row.innerHTML='<span>Scene</span><div id="sceneFilters" class="part-filters" aria-label="場面で絞り込む"></div>';
  anchor.after(row);
  const root=row.querySelector('#sceneFilters');
  const countFor=scene=>patterns.filter(p=>p.scene===scene).length;
  const render=()=>{
    const current=input.value.trim().toLowerCase();
    root.innerHTML=['All',...scenes].map(scene=>{
      const active=scene==='All'?!scenes.some(x=>x.toLowerCase()===current):scene.toLowerCase()===current;
      const count=scene==='All'?scenes.reduce((n,x)=>n+countFor(x),0):countFor(scene);
      return `<button class="part-chip ${active?'active':''}" type="button" data-scene="${scene}" aria-pressed="${active}">${scene}<small>${count}</small></button>`;
    }).join('');
  };
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-scene]');
    if(!button)return;
    document.querySelector('[data-brand="All"]')?.click();
    input.value=button.dataset.scene==='All'?'':button.dataset.scene;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.focus();
    render();
  });
  input.addEventListener('input',render);
  render();
})();
