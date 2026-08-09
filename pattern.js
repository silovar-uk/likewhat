(function () {
  const patterns = window.LIKEWHAT_PATTERNS || [];
  const { render, esc } = window.LikeWhatUI;
  const root = document.getElementById('patternPage');
  const id = new URLSearchParams(location.search).get('id');
  const p = patterns.find(item => item.id === id) || patterns[0];

  if (!p) {
    root.innerHTML = '<section class="not-found"><h1>Pattern not found.</h1><a href="./">一覧へ戻る</a></section>';
    return;
  }

  document.title = `${p.name} — Like What?`;
  const related = patterns.filter(x => x.id !== p.id).map(x => ({x, score:(x.brand===p.brand?5:0)+x.tags.filter(t=>p.tags.includes(t)).length})).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>v.x);

  root.innerHTML = `
    <section class="detail-hero">
      <div class="breadcrumb"><a href="./#patterns">Patterns</a><span>/</span><span>${esc(p.brand)}</span><span>/</span><span>${esc(p.family)}</span></div>
      <div class="detail-title-row">
        <div><p class="eyebrow">${esc(p.brand)} · ${esc(p.family)}</p><h1>${esc(p.name)}</h1><p class="detail-lead">${esc(p.oneLiner)}</p></div>
        <a class="source-link" href="${esc(p.sourceUrl)}" target="_blank" rel="noreferrer">Reference ↗<small>${esc(p.sourceLabel)}</small></a>
      </div>
      <div class="detail-preview">${render(p, 'detail')}</div>
    </section>

    <section class="detail-grid">
      <article class="detail-main">
        <section class="detail-block"><p class="eyebrow">IN ONE SENTENCE</p><h2>この感じを言葉にすると</h2><p class="large-copy">${esc(p.description)}</p></section>
        <section class="detail-block"><p class="eyebrow">WHY IT LOOKS LIKE THIS</p><h2>何が「それっぽさ」を作る？</h2><ol class="principle-list">${p.visual.map((v,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(v)}</p></li>`).join('')}</ol></section>
        <section class="detail-block two-up"><div><p class="eyebrow">GOOD FOR</p><h2>向いている</h2><ul>${p.useCases.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div><div><p class="eyebrow">NOT IDEAL FOR</p><h2>向いていない</h2><ul>${p.avoid.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div></section>
        <section class="detail-block prompt-block"><div class="prompt-head"><div><p class="eyebrow">COPY FOR AI</p><h2>AIへの指示文</h2></div><button id="copyPrompt">コピー</button></div><pre id="promptText">${esc(p.prompt)}</pre><p id="copyStatus" class="copy-status" aria-live="polite"></p></section>
      </article>

      <aside class="detail-aside">
        <div class="sticky-note"><p class="eyebrow">VOCABULARY</p><h3>このパターンを探す言葉</h3><div class="detail-tags">${p.tags.map(t=>`<a href="./?q=${encodeURIComponent(t)}#patterns">${esc(t)}</a>`).join('')}</div><hr><p class="eyebrow">UI PARTS</p><div class="detail-tags muted">${p.uiParts.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div>
      </aside>
    </section>

    <section class="related"><div class="browser-head"><div><p class="eyebrow">RELATED</p><h2>近いパターン</h2></div></div><div class="related-grid">${related.map(x=>`<a href="pattern.html?id=${encodeURIComponent(x.id)}"><div>${render(x,'related')}</div><p>${esc(x.brand)}</p><strong>${esc(x.name)}</strong></a>`).join('')}</div></section>`;

  const btn = document.getElementById('copyPrompt');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(p.prompt); btn.textContent='コピー済み'; document.getElementById('copyStatus').textContent='AIへの指示文をコピーした。'; setTimeout(()=>btn.textContent='コピー',1800); }
    catch { document.getElementById('copyStatus').textContent='コピーできなかったため、本文を選択してコピーしてください。'; }
  });
})();
