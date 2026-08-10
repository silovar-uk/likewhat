(function(){
  const ui=window.LikeWhatUI;
  if(!ui||typeof ui.render!=='function')return;

  const baseRender=ui.render;
  const VIRTUAL_WIDTH=420;
  const VIRTUAL_HEIGHT=236;
  const previewSelector=[
    '.card-preview',
    '.detail-preview',
    '.distance-reference-preview',
    '.opposite-reference-preview',
    '.map-inspector-preview',
    '.compare-preview',
    '.compare-route-preview',
    '.vocab-pattern-preview',
    '.next-reference-preview',
    '.related-grid > a > div'
  ].join(',');

  const interactiveSelector='a,button,input,select,textarea,label,form,details,summary';
  const replacementFor={
    A:['span','mock-link'],
    BUTTON:['span','mock-button'],
    INPUT:['span','mock-input'],
    SELECT:['span','mock-select'],
    TEXTAREA:['span','mock-textarea'],
    LABEL:['span','mock-label'],
    FORM:['div','mock-form'],
    DETAILS:['div','mock-details'],
    SUMMARY:['span','mock-summary']
  };
  const unsafeAttributes=new Set(['href','target','rel','type','name','value','for','action','method','tabindex','role','onclick','onchange','onsubmit']);

  function neutralizePreviewMarkup(html){
    const template=document.createElement('template');
    template.innerHTML=String(html||'').trim();

    template.content.querySelectorAll(interactiveSelector).forEach(node=>{
      const spec=replacementFor[node.tagName]||['span','mock-control'];
      const replacement=document.createElement(spec[0]);
      const classes=[node.getAttribute('class')||'',spec[1]].filter(Boolean).join(' ').trim();
      if(classes)replacement.setAttribute('class',classes);
      replacement.setAttribute('data-mock-tag',node.tagName.toLowerCase());

      [...node.attributes].forEach(attr=>{
        const name=attr.name.toLowerCase();
        if(name==='class'||unsafeAttributes.has(name)||name.startsWith('on'))return;
        if(name==='style'||name.startsWith('data-')||name==='title')replacement.setAttribute(attr.name,attr.value);
      });

      if(node.tagName==='INPUT'){
        replacement.textContent=node.getAttribute('placeholder')||node.getAttribute('value')||'';
      }else{
        while(node.firstChild)replacement.appendChild(node.firstChild);
      }
      node.replaceWith(replacement);
    });

    template.content.querySelectorAll('[tabindex]').forEach(node=>node.removeAttribute('tabindex'));
    const root=template.content.firstElementChild;
    if(root?.classList.contains('mini-ui')){
      root.setAttribute('aria-hidden','true');
      root.setAttribute('data-preview-contract','inert');
    }
    return template.innerHTML;
  }

  const onPatternDetail=()=>Boolean(document.querySelector('.detail-page'));
  function render(pattern,size='card'){
    const safeSize=(size==='detail'&&!onPatternDetail())?'card':size;
    return neutralizePreviewMarkup(baseRender(pattern,safeSize));
  }
  window.LikeWhatUI={...ui,render};

  function directMiniUi(viewport){
    return [...viewport.children].find(node=>node.classList?.contains('mini-ui'))||null;
  }

  function fit(viewport){
    if(!(viewport instanceof Element))return;
    const canvas=directMiniUi(viewport);
    if(!canvas)return;
    const style=getComputedStyle(viewport);
    const pl=parseFloat(style.paddingLeft)||0;
    const pr=parseFloat(style.paddingRight)||0;
    const pt=parseFloat(style.paddingTop)||0;
    const pb=parseFloat(style.paddingBottom)||0;
    const width=Math.max(1,viewport.clientWidth-pl-pr);
    const height=Math.max(1,viewport.clientHeight-pt-pb);
    if(width<=2||height<=2)return;
    const scale=Math.min(width/VIRTUAL_WIDTH,height/VIRTUAL_HEIGHT);
    viewport.classList.add('preview-fit');
    canvas.style.setProperty('--preview-scale',String(scale));
    canvas.style.left=`${pl+width/2}px`;
    canvas.style.top=`${pt+height/2}px`;
  }

  const observed=new WeakSet();
  const resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(entries=>entries.forEach(entry=>fit(entry.target))):null;

  function register(viewport){
    if(!(viewport instanceof Element))return;
    if(!observed.has(viewport)){
      observed.add(viewport);
      resizeObserver?.observe(viewport);
    }
    fit(viewport);
  }

  function scan(root){
    if(!(root instanceof Element||root instanceof Document))return;
    if(root instanceof Element&&root.matches(previewSelector))register(root);
    root.querySelectorAll?.(previewSelector).forEach(register);
  }

  scan(document);
  const mutationObserver=new MutationObserver(mutations=>{
    mutations.forEach(mutation=>{
      if(mutation.target instanceof Element&&mutation.target.matches(previewSelector))register(mutation.target);
      mutation.addedNodes.forEach(node=>{if(node instanceof Element)scan(node);});
    });
  });
  mutationObserver.observe(document.body,{childList:true,subtree:true});

  window.addEventListener('load',()=>scan(document),{once:true});
})();
