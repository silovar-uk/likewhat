(function(){
  const data=window.LIKEWHAT_PATTERN_DATA;
  const pattern=data?.selected;
  const root=document.getElementById('patternPage');
  if(!pattern||!root)return;
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const KEY={saved:'likewhat:saved:v1',recent:'likewhat:recent:v1',compare:'likewhat:compare:v1'};
  const WB={projects:'lw:wb:projects:v1',projectNames:'lw:wb:project-names:v1',recent:'lw:wb:recent:v1',compare:'lw:wb:compare:v1'};
  const read=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return[];}};
  const readObject=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return{};}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent('likewhat:memory-change'));}catch{}};
  const toggle=(key,id,max=50)=>{const list=read(key),exists=list.includes(id);write(key,exists?list.filter(x=>x!==id):[id,...list].slice(0,max));return !exists;};
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const itemFrom=p=>({id:p.id,brand:p.brand||'Unknown',name:p.name||p.family||'',oneLiner:p.oneLiner||'',scene:p.scene||'',domain:p.domain||'',family:p.family||'',href:`pattern.html?id=${encodeURIComponent(p.id)}`,at:Date.now()});
  const itemForId=id=>{const found=patterns.find(p=>p.id===id);return found?itemFrom(found):{id,brand:'Reference',name:id,href:`pattern.html?id=${encodeURIComponent(id)}`,at:Date.now()};};
  const syncRecent=()=>{const item=itemFrom(pattern);const list=(()=>{try{const v=JSON.parse(localStorage.getItem(WB.recent)||'[]');return Array.isArray(v)?v:[];}catch{return[];}})().filter(x=>x.id!==pattern.id);write(WB.recent,[item,...list].slice(0,8));};
  const syncSaved=active=>{const projects=readObject(WB.projects);let list=Array.isArray(projects['今回の参考'])?projects['今回の参考']:[];list=list.filter(x=>x.id!==pattern.id);if(active)list.unshift(itemFrom(pattern));projects['今回の参考']=list.slice(0,24);write(WB.projects,projects);let names=read(WB.projectNames);if(!names.includes('今回の参考'))names=['今回の参考',...names];write(WB.projectNames,names);};
  const syncCompare=ids=>write(WB.compare,ids.slice(-2).map(itemForId));
  const migrateLegacy=()=>{
    const projects=readObject(WB.projects);
    let saved=Array.isArray(projects['今回の参考'])?projects['今回の参考']:[];
    read(KEY.saved).forEach(id=>{if(!saved.some(item=>item.id===id))saved.push(itemForId(id));});
    projects['今回の参考']=saved.slice(0,24);write(WB.projects,projects);
    let names=read(WB.projectNames);if(!names.includes('今回の参考'))names=['今回の参考',...names];write(WB.projectNames,names);
    let recentItems=(()=>{try{const v=JSON.parse(localStorage.getItem(WB.recent)||'[]');return Array.isArray(v)?v:[];}catch{return[];}})();
    read(KEY.recent).forEach(id=>{if(!recentItems.some(item=>item.id===id))recentItems.push(itemForId(id));});
    write(WB.recent,recentItems.slice(0,8));
    if(!(()=>{try{const v=JSON.parse(localStorage.getItem(WB.compare)||'[]');return Array.isArray(v)&&v.length;}catch{return false;}})())syncCompare(read(KEY.compare));
  };
  migrateLegacy();
  const shareDir=String(pattern.id).replace(/[^a-zA-Z0-9._-]/g,'_');
  const shareUrl=new URL(`generated/share/${encodeURIComponent(shareDir)}/`,new URL('./',location.href)).href;

  const recent=[pattern.id,...read(KEY.recent).filter(id=>id!==pattern.id)].slice(0,20);write(KEY.recent,recent);syncRecent();

  const titleRow=root.querySelector('.detail-title-row');
  if(titleRow){
    const bar=document.createElement('div');bar.className='pattern-utility-bar';
    bar.innerHTML='<button type="button" data-save-pattern>☆ Save</button><button type="button" data-compare-pattern>＋ Compare tray</button><button type="button" data-share-pattern>↗ Share</button>';
    titleRow.querySelector('div')?.appendChild(bar);
    const save=bar.querySelector('[data-save-pattern]'),compare=bar.querySelector('[data-compare-pattern]'),share=bar.querySelector('[data-share-pattern]');
    const refresh=()=>{const saved=read(KEY.saved).includes(pattern.id),comp=read(KEY.compare).includes(pattern.id);save.classList.toggle('active',saved);save.textContent=saved?'★ Saved':'☆ Save';compare.classList.toggle('active',comp);compare.textContent=comp?'✓ Compare tray':'＋ Compare tray';};
    save.addEventListener('click',()=>{const active=toggle(KEY.saved,pattern.id);syncSaved(active);refresh();});
    compare.addEventListener('click',()=>{let list=read(KEY.compare);if(list.includes(pattern.id))list=list.filter(id=>id!==pattern.id);else list=[...list,pattern.id].slice(-4);write(KEY.compare,list);syncCompare(list);refresh();});
    share.addEventListener('click',async()=>{try{if(navigator.share){await navigator.share({title:`${pattern.name} — Like What?`,text:pattern.oneLiner||'',url:shareUrl});return;}await navigator.clipboard.writeText(shareUrl);share.textContent='✓ Copied';setTimeout(()=>share.textContent='↗ Share',1500);}catch(error){if(error?.name!=='AbortError'){try{await navigator.clipboard.writeText(shareUrl);share.textContent='✓ Copied';setTimeout(()=>share.textContent='↗ Share',1500);}catch{share.textContent='Copy URL';}}}});
    refresh();
  }

  const provenance=pattern.provenance;
  const main=root.querySelector('.detail-main');
  if(provenance&&main){
    const sourceBlock=[...main.querySelectorAll('.detail-block')].find(block=>/DESIGN INTENT/i.test(block.textContent||''))||main.firstElementChild;
    const section=document.createElement('section');section.className='provenance-block';
    const checked=provenance.checkedAt||'Not explicitly checked';
    const observed=(provenance.observed||[]).slice(0,4).join(' / ')||'—';
    const inference=(provenance.editorialInference||[]).slice(0,3).join(' / ')||'—';
    section.innerHTML=`<p class="eyebrow">PROVENANCE / FACT × EDITORIAL READING</p><h3>どこまでが観察で、どこからが解釈？</h3><div class="provenance-grid"><div><small>SOURCE TYPE</small><strong>${esc(provenance.sourceType||'primary-reference')}</strong></div><div><small>CHECKED AT</small><strong>${esc(checked)}</strong></div><div><small>OBSERVED</small><strong>${esc(observed)}</strong></div><div><small>EDITORIAL INFERENCE</small><strong>${esc(inference)}</strong></div></div><p>Sourceの事実とLike What?の編集的抽象化を混同しないためのメタ情報。Build時刻は検証日時として扱わない。</p>`;
    sourceBlock?.after(section);
  }
})();
