(function () {
  const patterns = window.LIKEWHAT_PATTERNS || [];
  const { render, esc } = window.LikeWhatUI;
  const vocabulary = window.LikeWhatVocabulary;
  const root = document.getElementById('patternPage');
  const id = new URLSearchParams(location.search).get('id');
  const p = patterns.find(item => item.id === id) || patterns[0];

  if (!p) {
    root.innerHTML = '<section class="not-found"><h1>Pattern not found.</h1><a href="./">一覧へ戻る</a></section>';
    return;
  }

  document.title = `${p.name} — Like What?`;
  const lex = vocabulary ? vocabulary.forPattern(p) : {implementation:[],design:[],philosophy:[]};
  const related = patterns.filter(x => x.id !== p.id).map(x => ({x, score:(x.brand===p.brand?5:0)+x.tags.filter(t=>p.tags.includes(t)).length})).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>v.x);

  function lexiconColumn(label, title, items) {
    return `<section class="lexicon-column"><p class="eyebrow">${esc(label)}</p><h3>${esc(title)}</h3><div class="lexicon-items">${items.map(item=>`<article class="lexicon-item"><strong>${esc(item.term)}</strong><span>${esc(item.ja)}</span><p>${esc(item.note)}</p></article>`).join('')}</div></section>`;
  }

  const vocabularyLine = [...lex.design,...lex.philosophy].slice(0,8).map(x=>x.term).join(' / ');
  const expertPrompt = `${p.prompt}\n\n設計語彙として、${vocabularyLine} を意識してください。単にブランドの表層表現を模倣するのではなく、情報階層・密度・文脈保持・操作の開示タイミングまで設計原則として再現してください。`;

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
        <section class="detail-block"><p class="eyebrow">DESIGN INTENT</p><h2>設計意図を言語化すると</h2><p class="large-copy">${esc(p.description)}</p></section>

        <section class="detail-block grammar-block">
          <p class="eyebrow">DESIGN GRAMMAR</p><h2>技術・デザイン・思想の3層で分解する</h2>
          <p class="grammar-intro">「○○風」を装飾の模倣で終わらせず、実装構造、視覚・インタラクション設計、認知・設計思想へ分解した語彙。</p>
          <div class="lexicon-grid">
            ${lexiconColumn('IMPLEMENTATION', '実装構造', lex.implementation)}
            ${lexiconColumn('DESIGN SYSTEM', '視覚・インタラクション', lex.design)}
            ${lexiconColumn('PHILOSOPHY', '認知・設計思想', lex.philosophy)}
          </div>
        </section>

        <section class="detail-block"><p class="eyebrow">VISUAL / INTERACTION PRINCIPLES</p><h2>パターンを成立させる設計原則</h2><ol class="principle-list">${p.visual.map((v,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(v)}</p></li>`).join('')}</ol></section>
        <section class="detail-block two-up"><div><p class="eyebrow">GOOD FIT</p><h2>適合しやすい文脈</h2><ul>${p.useCases.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div><div><p class="eyebrow">TRADE-OFF / RISK</p><h2>相性が悪い文脈</h2><ul>${p.avoid.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div></section>
        <section class="detail-block prompt-block"><div class="prompt-head"><div><p class="eyebrow">IMPLEMENTATION BRIEF FOR AI</p><h2>AIへ渡す設計指示</h2></div><button id="copyPrompt">コピー</button></div><pre id="promptText">${esc(expertPrompt)}</pre><p id="copyStatus" class="copy-status" aria-live="polite"></p></section>
      </article>

      <aside class="detail-aside">
        <div class="sticky-note"><p class="eyebrow">DISCOVERY TERMS</p><h3>検索・参照に使う語彙</h3><div class="detail-tags">${[...lex.design.slice(0,3).map(x=>x.term),...p.tags].map(t=>`<a href="./?q=${encodeURIComponent(t)}#patterns">${esc(t)}</a>`).join('')}</div><hr><p class="eyebrow">SURFACE / COMPONENTS</p><div class="detail-tags muted">${p.uiParts.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div>
      </aside>
    </section>

    <section class="related"><div class="browser-head"><div><p class="eyebrow">RELATED PATTERNS</p><h2>近接する視覚文法</h2></div></div><div class="related-grid">${related.map(x=>`<a href="pattern.html?id=${encodeURIComponent(x.id)}"><div>${render(x,'related')}</div><p>${esc(x.brand)}</p><strong>${esc(x.name)}</strong></a>`).join('')}</div></section>`;

  const btn = document.getElementById('copyPrompt');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(expertPrompt); btn.textContent='コピー済み'; document.getElementById('copyStatus').textContent='専門語彙を含む設計指示をコピーした。'; setTimeout(()=>btn.textContent='コピー',1800); }
    catch { document.getElementById('copyStatus').textContent='コピーできなかったため、本文を選択してコピーしてください。'; }
  });
})();
