(function(){
  const data=window.LIKEWHAT_PATTERN_DATA;
  const pattern=data?.selected;
  const root=document.getElementById('patternPage');
  if(!pattern||!root)return;
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const KEY={saved:'likewhat:saved:v1',recent:'likewhat:recent:v1',compare:'likewhat:compare:v1'};
  const read=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return[];}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent('likewhat:memory-change'));}catch{}};
  const toggle=(key,id,max=50)=>{const list=read(key),exists=list.includes(id);write(key,exists?list.filter(x=>x!==id):[id,...list].slice(0,max));return !exists;};
  const shareDir=String(pattern.id).replace(/[^a-zA-Z0-9._-]/g,'_');
  const shareUrl=new URL(`generated/share/${encodeURIComponent(shareDir)}/`,new URL('./',location.href)).href;

  const recent=[pattern.id,...read(KEY.recent).filter(id=>id!==pattern.id)].slice(0,20);write(KEY.recent,recent);

  const titleRow=root.querySelector('.detail-title-row');
  if(titleRow){
    const bar=document.createElement('div');bar.className='pattern-utility-bar';
    bar.innerHTML='<button type="button" data-save-pattern>☆ Save</button><button type="button" data-compare-pattern>＋ Compare tray</button><button type="button" data-share-pattern>↗ Share</button>';
    titleRow.querySelector('div')?.appendChild(bar);
    const save=bar.querySelector('[data-save-pattern]'),compare=bar.querySelector('[data-compare-pattern]'),share=bar.querySelector('[data-share-pattern]');
    const refresh=()=>{const saved=read(KEY.saved).includes(pattern.id),comp=read(KEY.compare).includes(pattern.id);save.classList.toggle('active',saved);save.textContent=saved?'★ Saved':'☆ Save';compare.classList.toggle('active',comp);compare.textContent=comp?'✓ Compare tray':'＋ Compare tray';};
    save.addEventListener('click',()=>{toggle(KEY.saved,pattern.id);refresh();});
    compare.addEventListener('click',()=>{let list=read(KEY.compare);if(list.includes(pattern.id))list=list.filter(id=>id!==pattern.id);else list=[...list,pattern.id].slice(-4);write(KEY.compare,list);refresh();});
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
