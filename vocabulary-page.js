(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const vocab=window.LikeWhatVocabulary;
  const ui=window.LikeWhatUI;
  if(!vocab||!ui)return;
  const {render,esc}=ui;
  const input=document.getElementById('vocabSearch');
  const categoryFilters=document.getElementById('categoryFilters');
  const grid=document.getElementById('termGrid');
  const inspector=document.getElementById('termInspector');
  const count=document.getElementById('vocabCount');
  const stats=document.getElementById('vocabStats');
  const empty=document.getElementById('vocabEmpty');
  const randomBtn=document.getElementById('randomTerm');
  const params=new URLSearchParams(location.search);
  let category='All';
  let query=params.get('q')||'';
  let selected=vocab.findTerm(params.get('term')||'')||null;
  input.value=query;
  const terms=vocab.allTerms();
  const normalize=value=>String(value||'').normalize('NFKC').toLowerCase();

  function usage(node){return vocab.patternsForTerm(node,patterns);}
  function filteredTerms(){
    const q=normalize(query).trim();
    return terms.filter(node=>{
      const catOK=category==='All'||node.category===category;
      const hay=normalize([node.term,node.ja,node.note,node.category].join(' '));
      return catOK&&(!q||q.split(/\s+/).every(part=>hay.includes(part)));
    });
  }

  function renderStats(){
    const connected=terms.filter(t=>usage(t).length>0).length;
    const totalLinks=terms.reduce((sum,t)=>sum+usage(t).length,0);
    stats.innerHTML=`<div><strong>${terms.length}</strong><span>named concepts</span></div><div><strong>${connected}</strong><span>connected concepts</span></div><div><strong>${patterns.length}</strong><span>reference patterns</span></div><div><strong>${totalLinks}</strong><span>concept ↔ pattern links</span></div>`;
  }

  function renderCategories(){
    categoryFilters.innerHTML=['All',...vocab.categories].map(cat=>{
      const n=cat==='All'?terms.length:terms.filter(t=>t.category===cat).length;
      return `<button type="button" data-category="${esc(cat)}" class="${cat===category?'active':''}"><span>${esc(cat)}</span><small>${n}</small></button>`;
    }).join('');
  }

  function termCard(node){
    const hits=usage(node);
    const brands=new Set(hits.map(p=>p.brand)).size;
    return `<button class="term-card ${selected?.term===node.term?'selected':''}" type="button" data-term="${esc(node.term)}">
      <span class="term-category">${esc(node.category)}</span>
      <strong>${esc(node.term)}</strong>
      <em>${esc(node.ja)}</em>
      <p>${esc(node.note)}</p>
      <div><span>${hits.length} patterns</span><span>${brands} brands</span><b>→</b></div>
    </button>`;
  }

  function renderGrid(){
    const filtered=filteredTerms();
    count.textContent=`${filtered.length} / ${terms.length} concepts`;
    grid.innerHTML=filtered.map(termCard).join('');
    empty.hidden=filtered.length>0;
    grid.hidden=filtered.length===0;
  }

  function crossWorldExamples(hits,limit=6){
    const seen=new Set();
    const out=[];
    for(const p of hits){
      if(seen.has(p.brand))continue;
      seen.add(p.brand);out.push(p);
      if(out.length===limit)break;
    }
    return out;
  }

  function patternMini(p){
    return `<a class="vocab-pattern" href="pattern.html?id=${encodeURIComponent(p.id)}">
      <div class="vocab-pattern-preview">${render(p,'related')}</div>
      <div><small>${esc(p.brand)} · ${esc(p.domain||p.family)}</small><strong>${esc(p.name)}</strong><p>${esc(p.oneLiner)}</p></div>
    </a>`;
  }

  function renderInspector(){
    if(!selected){
      inspector.innerHTML=`<div class="term-inspector-empty"><p class="eyebrow">SELECT A CONCEPT</p><h3>語彙をひとつ選ぶ。</h3><p>定義、関連概念、異なるブランドでの実例をここに表示する。</p></div>`;
      return;
    }
    const hits=usage(selected);
    const related=vocab.relatedTerms(selected,patterns,8);
    const examples=crossWorldExamples(hits);
    const brands=[...new Set(hits.map(p=>p.brand))];
    const domains=[...new Set(hits.map(p=>p.domain).filter(Boolean))];
    inspector.innerHTML=`
      <div class="term-inspector-head">
        <p class="eyebrow">${esc(selected.category)}</p>
        <h2>${esc(selected.term)}</h2>
        <h3>${esc(selected.ja)}</h3>
        <p>${esc(selected.note)}</p>
      </div>
      <div class="term-inspector-metrics"><div><strong>${hits.length}</strong><span>patterns</span></div><div><strong>${brands.length}</strong><span>brands</span></div><div><strong>${domains.length}</strong><span>domains</span></div></div>
      <section><p class="eyebrow">RELATED CONCEPTS / CO-OCCURRENCE</p><div class="related-term-list">${related.length?related.map(t=>`<button type="button" data-term="${esc(t.term)}"><span>${esc(t.term)}</span><small>${t.score} shared</small></button>`).join(''):'<p class="muted-copy">関連語はまだ十分に蓄積されていない。</p>'}</div></section>
      <section><p class="eyebrow">CROSS-WORLD EXAMPLES</p><h3>別の世界で、同じ原則を見る。</h3><div class="vocab-pattern-list">${examples.length?examples.map(patternMini).join(''):'<p class="muted-copy">この語彙に接続されたパターンはまだない。</p>'}</div></section>
      ${hits.length>examples.length?`<details class="all-pattern-links"><summary>すべての関連パターンを見る <span>${hits.length}</span></summary><div>${hits.map(p=>`<a href="pattern.html?id=${encodeURIComponent(p.id)}"><span>${esc(p.brand)}</span><strong>${esc(p.name)}</strong></a>`).join('')}</div></details>`:''}
      <a class="term-search-link" href="./?q=${encodeURIComponent(selected.term)}#patterns">この語でパターン一覧を検索 ↗</a>`;
  }

  function selectTerm(value,push=true){
    const node=vocab.findTerm(value);
    if(!node)return;
    selected=node;
    if(push){
      const url=new URL(location.href);url.searchParams.set('term',node.term);history.replaceState({},'',url);
    }
    renderGrid();renderInspector();
    if(window.innerWidth<980)inspector.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function update(){renderCategories();renderGrid();renderInspector();}
  categoryFilters.addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;category=btn.dataset.category;update();});
  grid.addEventListener('click',e=>{const btn=e.target.closest('[data-term]');if(btn)selectTerm(btn.dataset.term);});
  inspector.addEventListener('click',e=>{const btn=e.target.closest('[data-term]');if(btn)selectTerm(btn.dataset.term);});
  input.addEventListener('input',()=>{query=input.value;renderGrid();});
  randomBtn.addEventListener('click',()=>{const connected=terms.filter(t=>usage(t).length);const pool=connected.length?connected:terms;selectTerm(pool[Math.floor(Math.random()*pool.length)].term);});
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.focus();input.select();}
    if(e.key==='Escape'&&document.activeElement===input){input.value='';query='';input.blur();renderGrid();}
  });
  renderStats();update();
})();
