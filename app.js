(function () {
  const patterns = window.LIKEWHAT_PATTERNS || [];
  const { render, esc } = window.LikeWhatUI;
  const vocabulary = window.LikeWhatVocabulary;
  const designSpace = window.LikeWhatDesignSpace;
  const input = document.getElementById('searchInput');
  const brandFilters = document.getElementById('brandFilters');
  const partFilters = document.getElementById('partFilters');
  const groups = document.getElementById('patternGroups');
  const resultCount = document.getElementById('resultCount');
  const empty = document.getElementById('emptyState');
  const randomDraw = document.getElementById('randomDraw');
  const randomResults = document.getElementById('randomResults');
  const randomModes = document.getElementById('randomModes');
  let randomMode = 'random';
  let brand = 'All';
  let part = 'All';
  let query = new URLSearchParams(location.search).get('q') || '';
  input.value = query;

  const brands = [...new Set(patterns.map(p => p.brand))];
  const parts = ['All', 'Navigation', 'List', 'Dashboard', 'Settings', 'Editor', 'Command', 'Cards', 'Detail'];
  const modeCopy = {
    random:{title:'Random 3',label:'3つ引く',description:'異なるブランドから、偶然の組み合わせを3つ引く。'},
    far:{title:'Far Apart',label:'遠い3つを引く',description:'6次元Design Spaceで、互いの最短距離が最大になる3つを選ぶ。'},
    weird:{title:'Weird Combination',label:'変な3つを引く',description:'距離だけでなくDomain・Archetype・設計思想の不一致も加点し、異質な3つを衝突させる。'}
  };

  function normalize(value) { return String(value || '').toLowerCase().normalize('NFKC'); }
  function searchable(p) {
    const expert = vocabulary ? vocabulary.searchText(p) : '';
    const taxonomy = [p.domain,p.medium,p.archetype,p.interactionModel,...(p.philosophy||[]),...(p.implementationTerms||[]),...(p.designTerms||[]),...(p.philosophyTerms||[])].join(' ');
    return normalize([p.brand,p.family,p.name,p.oneLiner,p.description,...p.tags,...p.uiParts,...p.visual,...p.useCases,p.prompt,taxonomy,expert].join(' '));
  }
  function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function filterPatterns() {
    const q = normalize(query).trim();
    return patterns.filter(p => {
      const brandOK = brand === 'All' || p.brand === brand;
      const partOK = part === 'All' || p.uiParts.some(x => normalize(x).includes(normalize(part))) || normalize(p.family).includes(normalize(part));
      const queryOK = !q || q.split(/\s+/).every(term => searchable(p).includes(term));
      return brandOK && partOK && queryOK;
    });
  }

  function renderBrandFilters() {
    brandFilters.innerHTML = ['All', ...brands].map(name => {
      const count = name === 'All' ? patterns.length : patterns.filter(p => p.brand === name).length;
      return `<button class="brand-chip ${brand===name?'active':''}" data-brand="${esc(name)}"><span>${esc(name)}</span><small>${count}</small></button>`;
    }).join('');
  }

  function renderPartFilters() {
    partFilters.innerHTML = parts.map(name => `<button class="part-chip ${part===name?'active':''}" data-part="${esc(name)}">${esc(name)}</button>`).join('');
  }

  function card(p) {
    const lex = vocabulary ? vocabulary.forPattern(p) : null;
    const expertTerm = lex?.design?.[0]?.term || p.family;
    return `<a class="pattern-card" href="pattern.html?id=${encodeURIComponent(p.id)}" data-brand="${esc(p.brand)}">
      <div class="card-preview">${render(p, 'card')}</div>
      <div class="card-body">
        <div class="card-meta"><span>${esc(p.brand)}</span><span>${esc(p.family)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="one-liner">${esc(p.oneLiner)}</p>
        <div class="tag-row"><span class="expert-tag">${esc(expertTerm)}</span>${p.tags.slice(0,2).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
        <div class="card-arrow">Analyze <span>↗</span></div>
      </div>
    </a>`;
  }

  function renderResults() {
    const filtered = filterPatterns();
    resultCount.textContent = `${filtered.length} / ${patterns.length} patterns`;
    empty.hidden = filtered.length > 0;
    groups.hidden = filtered.length === 0;
    const byBrand = brands.map(name => [name, filtered.filter(p => p.brand === name)]).filter(([, items]) => items.length);
    groups.innerHTML = byBrand.map(([name, items]) => `<section class="brand-section">
      <div class="brand-section-head"><h3>${esc(name)}</h3><span>${items.length} patterns</span></div>
      <div class="card-grid">${items.map(card).join('')}</div>
    </section>`).join('');
  }

  function ordinaryTriple() {
    const selected = [];
    for (const brandName of shuffle(brands)) {
      const candidates = patterns.filter(p => p.brand === brandName);
      if (candidates.length) selected.push(candidates[Math.floor(Math.random() * candidates.length)]);
      if (selected.length === 3) break;
    }
    return selected;
  }

  function pairDistances(items) {
    if (!designSpace) return [0,0,0];
    return [
      designSpace.distanceBetween(items[0].designSpace,items[1].designSpace),
      designSpace.distanceBetween(items[0].designSpace,items[2].designSpace),
      designSpace.distanceBetween(items[1].designSpace,items[2].designSpace)
    ];
  }

  function farApartTriple() {
    if (!designSpace) return ordinaryTriple();
    const valid = patterns.filter(p=>p.designSpace);
    let best = null;
    for (let i=0;i<valid.length-2;i++) {
      for (let j=i+1;j<valid.length-1;j++) {
        for (let k=j+1;k<valid.length;k++) {
          if (new Set([valid[i].brand,valid[j].brand,valid[k].brand]).size<3) continue;
          const items=[valid[i],valid[j],valid[k]];
          const distances=pairDistances(items);
          const min=Math.min(...distances);
          const avg=distances.reduce((a,b)=>a+b,0)/3;
          const score=min*2+avg;
          if (!best || score>best.score) best={items,distances,min,avg,score};
        }
      }
    }
    return best?.items || ordinaryTriple();
  }

  function jaccardDissimilarity(a,b) {
    const A=new Set((a||[]).map(normalize));
    const B=new Set((b||[]).map(normalize));
    const union=new Set([...A,...B]);
    if (!union.size) return 1;
    let intersection=0;
    A.forEach(v=>{if(B.has(v))intersection++;});
    return 1-intersection/union.size;
  }

  function weirdTriple() {
    if (!designSpace) return ordinaryTriple();
    const valid = patterns.filter(p=>p.designSpace);
    const ranked=[];
    for (let i=0;i<valid.length-2;i++) {
      for (let j=i+1;j<valid.length-1;j++) {
        for (let k=j+1;k<valid.length;k++) {
          const items=[valid[i],valid[j],valid[k]];
          if (new Set(items.map(x=>x.brand)).size<3) continue;
          const distances=pairDistances(items);
          const avgDistance=distances.reduce((a,b)=>a+b,0)/3;
          const domainVariety=new Set(items.map(x=>x.domain)).size;
          const mediumVariety=new Set(items.map(x=>x.medium)).size;
          const archetypeVariety=new Set(items.map(x=>x.archetype)).size;
          const philosophyGap=(
            jaccardDissimilarity(items[0].philosophy,items[1].philosophy)+
            jaccardDissimilarity(items[0].philosophy,items[2].philosophy)+
            jaccardDissimilarity(items[1].philosophy,items[2].philosophy)
          )/3;
          const score=avgDistance+(domainVariety-1)*5+(mediumVariety-1)*2.5+(archetypeVariety-1)*4+philosophyGap*12;
          ranked.push({items,score});
        }
      }
    }
    ranked.sort((a,b)=>b.score-a.score);
    const pool=ranked.slice(0,Math.min(18,ranked.length));
    return pool[Math.floor(Math.random()*pool.length)]?.items || farApartTriple();
  }

  function selectionForMode() {
    if (randomMode==='far') return farApartTriple();
    if (randomMode==='weird') return weirdTriple();
    return ordinaryTriple();
  }

  function collisionPrompt(selected) {
    const [a,b,c]=selected;
    return `次の3つの参照を、表層的に平均化せず、役割を分けて1つのデザインへ統合してください。\n\n1. ${a.brand} / ${a.name}\n   担当する原則: ${a.philosophy?.slice(0,2).join(' / ') || a.tags.slice(0,2).join(' / ')}\n2. ${b.brand} / ${b.name}\n   担当する原則: ${b.philosophy?.slice(0,2).join(' / ') || b.tags.slice(0,2).join(' / ')}\n3. ${c.brand} / ${c.name}\n   担当する原則: ${c.philosophy?.slice(0,2).join(' / ') || c.tags.slice(0,2).join(' / ')}\n\n共通化するのは色や装飾ではなく、情報階層・操作モデル・感情強度・探索性・秩序性です。3つの矛盾を消さず、どの場面でどの参照を優先するか明示してください。`;
  }

  function randomMeta(selected) {
    const distances=designSpace?pairDistances(selected):[];
    const min=distances.length?Math.min(...distances):null;
    const avg=distances.length?distances.reduce((a,b)=>a+b,0)/distances.length:null;
    const domains=new Set(selected.map(x=>x.domain)).size;
    const archetypes=new Set(selected.map(x=>x.archetype)).size;
    const prompt=collisionPrompt(selected);
    return `<div class="random-analysis">
      <div class="random-analysis-copy">
        <p class="eyebrow">${esc(modeCopy[randomMode].title)} / DRAW ANALYSIS</p>
        <h3>${randomMode==='random'?'偶然を、そのまま入口にする。':randomMode==='far'?'設計空間の三角形を、できるだけ大きくする。':'矛盾を消さず、ひとつの案へ衝突させる。'}</h3>
        <p>${esc(modeCopy[randomMode].description)}</p>
      </div>
      <div class="random-metrics">
        ${avg!==null?`<span><small>AVG DISTANCE</small><b>${avg.toFixed(1)}</b></span>`:''}
        ${min!==null?`<span><small>MIN DISTANCE</small><b>${min.toFixed(1)}</b></span>`:''}
        <span><small>DOMAINS</small><b>${domains}</b></span>
        <span><small>ARCHETYPES</small><b>${archetypes}</b></span>
      </div>
      <details class="collision-brief"><summary>この3つを混ぜるなら？ <span>AI brief</span></summary><div><pre>${esc(prompt)}</pre><button type="button" data-copy-collision>指示文をコピー</button></div></details>
    </div>`;
  }

  function drawThree() {
    if (!randomDraw || !randomResults || patterns.length < 3) return;
    const selected = selectionForMode();
    randomResults.innerHTML = `${randomMeta(selected)}<div class="random-grid">${selected.map(card).join('')}</div>`;
    randomDraw.querySelector('span').textContent = '引き直す';
    randomDraw.querySelector('small').textContent = modeCopy[randomMode].title;
    randomResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setRandomMode(mode) {
    randomMode=modeCopy[mode]?mode:'random';
    randomModes?.querySelectorAll('[data-random-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.randomMode===randomMode));
    if(randomDraw){
      randomDraw.querySelector('span').textContent=modeCopy[randomMode].label;
      randomDraw.querySelector('small').textContent=modeCopy[randomMode].title;
    }
    if(randomResults) randomResults.innerHTML='';
  }

  function update() { renderBrandFilters(); renderPartFilters(); renderResults(); }

  brandFilters.addEventListener('click', e => { const btn=e.target.closest('[data-brand]'); if(!btn)return; brand=btn.dataset.brand; update(); });
  partFilters.addEventListener('click', e => { const btn=e.target.closest('[data-part]'); if(!btn)return; part=btn.dataset.part; update(); });
  input.addEventListener('input', () => { query=input.value; renderResults(); });
  document.querySelector('.query-examples')?.addEventListener('click', e => { const btn=e.target.closest('[data-query]'); if(!btn)return; input.value=btn.dataset.query; query=btn.dataset.query; brand='All'; part='All'; update(); input.focus(); });
  randomModes?.addEventListener('click',e=>{const btn=e.target.closest('[data-random-mode]');if(btn)setRandomMode(btn.dataset.randomMode);});
  randomDraw?.addEventListener('click', drawThree);
  randomResults?.addEventListener('click',async e=>{
    const btn=e.target.closest('[data-copy-collision]');
    if(!btn)return;
    const pre=btn.closest('.collision-brief')?.querySelector('pre');
    if(!pre)return;
    try{await navigator.clipboard.writeText(pre.textContent);btn.textContent='コピー済み';setTimeout(()=>btn.textContent='指示文をコピー',1600);}catch{btn.textContent='選択してコピー';}
  });
  document.addEventListener('keydown', e => { if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.focus();input.select();} if(e.key==='Escape'&&document.activeElement===input){input.value='';query='';input.blur();update();} });

  setRandomMode('random');
  update();
})();
