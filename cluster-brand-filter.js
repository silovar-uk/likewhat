(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const root=document.getElementById('brandFilters');
  if(!root)return;
  const clusterBrands=[...new Set(patterns.filter(p=>p.groupType==='industry-cluster').map(p=>p.brand).filter(Boolean))];
  if(!clusterBrands.length)return;
  let selected='All';

  function apply(){
    const active=root.querySelector('.brand-chip.active');
    if(active)selected=active.dataset.brand||selected;
    clusterBrands.forEach(name=>{
      if(root.querySelector(`[data-brand="${CSS.escape(name)}"]`))return;
      const count=patterns.filter(p=>p.groupType==='industry-cluster'&&p.brand===name).length;
      const button=document.createElement('button');
      button.className=`brand-chip industry-chip ${selected===name?'active':''}`;
      button.dataset.brand=name;
      button.setAttribute('aria-pressed',String(selected===name));
      button.innerHTML=`<span>${name}</span><small>${count}</small>`;
      const all=root.querySelector('[data-brand="All"]');
      if(all?.nextSibling)root.insertBefore(button,all.nextSibling);else root.appendChild(button);
    });
  }

  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-brand]');
    if(!button)return;
    selected=button.dataset.brand||'All';
    queueMicrotask(apply);
  },true);
  new MutationObserver(()=>queueMicrotask(apply)).observe(root,{childList:true});
  apply();
})();
