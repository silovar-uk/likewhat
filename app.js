(function () {
  const patterns = window.LIKEWHAT_PATTERNS || [];
  const { render, esc } = window.LikeWhatUI;
  const input = document.getElementById('searchInput');
  const brandFilters = document.getElementById('brandFilters');
  const partFilters = document.getElementById('partFilters');
  const groups = document.getElementById('patternGroups');
  const resultCount = document.getElementById('resultCount');
  const empty = document.getElementById('emptyState');
  let brand = 'All';
  let part = 'All';
  let query = new URLSearchParams(location.search).get('q') || '';
  input.value = query;

  const brands = [...new Set(patterns.map(p => p.brand))];
  const parts = ['All', 'Navigation', 'List', 'Dashboard', 'Settings', 'Editor', 'Command', 'Cards', 'Detail'];

  function normalize(value) { return String(value || '').toLowerCase().normalize('NFKC'); }
  function searchable(p) { return normalize([p.brand,p.family,p.name,p.oneLiner,p.description,...p.tags,...p.uiParts,...p.visual,...p.useCases,p.prompt].join(' ')); }

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
    return `<a class="pattern-card" href="pattern.html?id=${encodeURIComponent(p.id)}" data-brand="${esc(p.brand)}">
      <div class="card-preview">${render(p, 'card')}</div>
      <div class="card-body">
        <div class="card-meta"><span>${esc(p.brand)}</span><span>${esc(p.family)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="one-liner">${esc(p.oneLiner)}</p>
        <div class="tag-row">${p.tags.slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
        <div class="card-arrow">見る <span>↗</span></div>
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

  function update() { renderBrandFilters(); renderPartFilters(); renderResults(); }

  brandFilters.addEventListener('click', e => { const btn=e.target.closest('[data-brand]'); if(!btn)return; brand=btn.dataset.brand; update(); });
  partFilters.addEventListener('click', e => { const btn=e.target.closest('[data-part]'); if(!btn)return; part=btn.dataset.part; update(); });
  input.addEventListener('input', () => { query=input.value; renderResults(); });
  document.querySelector('.query-examples').addEventListener('click', e => { const btn=e.target.closest('[data-query]'); if(!btn)return; input.value=btn.dataset.query; query=btn.dataset.query; brand='All'; part='All'; update(); input.focus(); });
  document.addEventListener('keydown', e => { if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.focus();input.select();} if(e.key==='Escape'&&document.activeElement===input){input.value='';query='';input.blur();update();} });

  update();
})();
