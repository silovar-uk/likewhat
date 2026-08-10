(function () {
  const patterns = window.LIKEWHAT_PATTERNS || [];
  const { render, esc } = window.LikeWhatUI;
  const vocabulary = window.LikeWhatVocabulary;
  const designSpace = window.LikeWhatDesignSpace;
  const root = document.getElementById('patternPage');
  const id = new URLSearchParams(location.search).get('id');
  const p = patterns.find(item => item.id === id) || patterns[0];

  if (!p) {
    root.innerHTML = '<section class="not-found"><h1>Pattern not found.</h1><a href="./">一覧へ戻る</a></section>';
    return;
  }

  document.title = `${p.name} — Like What?`;
  const lex = vocabulary ? vocabulary.forPattern(p) : {implementation:[],design:[],philosophy:[]};
  const libraryMean = designSpace ? designSpace.mean(patterns) : {};
  const diversity = designSpace && p.designSpace ? designSpace.diversity(p, patterns) : null;
  const related = patterns.filter(x => x.id !== p.id).map(x => ({x, score:(x.brand===p.brand?5:0)+x.tags.filter(t=>p.tags.includes(t)).length})).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>v.x);

  function lexiconColumn(label, title, items) {
    return `<section class="lexicon-column"><p class="eyebrow">${esc(label)}</p><h3>${esc(title)}</h3><div class="lexicon-items">${items.map(item=>`<article class="lexicon-item"><strong>${esc(item.term)}</strong><span>${esc(item.ja)}</span><p>${esc(item.note)}</p></article>`).join('')}</div></section>`;
  }

  function metaCard(label, value) {
    return `<div class="space-meta"><small>${esc(label)}</small><strong>${esc(value || '—')}</strong></div>`;
  }

  function distanceReference(item, label, sublabel) {
    if (!item?.pattern) return '';
    const target = item.pattern;
    const diffs = item.differences.slice(0,3);
    return `<a class="distance-reference" href="pattern.html?id=${encodeURIComponent(target.id)}">
      <div class="distance-reference-preview">${render(target, 'related')}</div>
      <div class="distance-reference-body">
        <div class="distance-reference-head"><div><small>${esc(label)}</small><strong>${esc(target.brand)}</strong><span>${esc(target.name)}</span></div><b>${item.distance.toFixed(1)}</b></div>
        <p>${esc(sublabel)}</p>
        <div class="distance-diffs">${diffs.map(d=>`<span>${esc(d.name)} <b>Δ${Math.round(d.diff)}</b></span>`).join('')}</div>
      </div>
    </a>`;
  }

  const vocabularyLine = [...lex.design,...lex.philosophy].slice(0,8).map(x=>x.term).join(' / ');
  const spaceSummary = designSpace ? designSpace.summary(p.designSpace) : '';
  const spacePrompt = p.designSpace ? `\nDesign Space上の位置は、Density ${p.designSpace.density} / Emotional Intensity ${p.designSpace.emotion} / Exploration ${p.designSpace.exploration} / Authority ${p.designSpace.authority} / Direct Manipulation ${p.designSpace.interaction} / Systematic Order ${p.designSpace.order}。この数値を装飾ではなく、情報量・感情強度・探索性・権威性・操作直接性・秩序性の設計判断として反映してください。` : '';
  const expertPrompt = `${p.prompt}\n\n設計語彙として、${vocabularyLine} を意識してください。単にブランドの表層表現を模倣するのではなく、情報階層・密度・文脈保持・操作の開示タイミングまで設計原則として再現してください。${spacePrompt}`;

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

        ${designSpace && p.designSpace ? `<section class="detail-block design-space-block">
          <p class="eyebrow">DESIGN SPACE / POSITIONING</p>
          <h2>このデザインは、どこに位置する？</h2>
          <p class="design-space-intro">6つの対立軸で、このパターンの設計上の重心を可視化する。レーダーは全体形状、右側のスケールは各軸の意味を読むためのもの。破線は現在のLike What?ライブラリ全体の平均。</p>
          <div class="space-layout">
            ${designSpace.radar(p.designSpace, libraryMean)}
            ${designSpace.bars(p.designSpace, libraryMean)}
          </div>
          <div class="space-profile">
            ${metaCard('Domain', p.domain)}
            ${metaCard('Medium', p.medium)}
            ${metaCard('Archetype', p.archetype)}
            ${metaCard('Interaction Model', p.interactionModel)}
          </div>
          <p class="space-summary"><strong>Character profile:</strong> ${esc(spaceSummary)}</p>

          ${diversity ? `<section class="diversity-analysis">
            <div class="diversity-heading">
              <div><p class="eyebrow">DESIGN DISTANCE / DIVERSITY SCORE</p><h3>近傍から、どれだけ離れている？</h3><p>最も近いパターンまでの6次元距離を基準に、現在のライブラリ内での希少性を測る。</p></div>
              <div class="diversity-score" aria-label="Diversity Score ${diversity.score} out of 100"><strong>${diversity.score}</strong><span>/ 100</span><small>${esc(diversity.label)}</small></div>
            </div>
            <div class="diversity-metrics">
              <div><small>LOCAL SEPARATION</small><strong>${diversity.localDistance.toFixed(1)}</strong><span>${esc(diversity.localDistanceLabel)}</span></div>
              <div><small>NEAREST BRAND</small><strong>${esc(diversity.nearest?.pattern?.brand || '—')}</strong><span>最寄りの設計座標</span></div>
              <div><small>FARTHEST BRAND</small><strong>${esc(diversity.farthest?.pattern?.brand || '—')}</strong><span>現ライブラリ内の最遠点</span></div>
            </div>
            <div class="distance-reference-grid">
              ${distanceReference(diversity.nearest, 'NEAREST IN DESIGN SPACE', '似ている理由より、どの軸がまだ違うかを見る。')}
              ${distanceReference(diversity.farthest, 'FARTHEST IN CURRENT LIBRARY', '「対極」と断定する前の、純粋な幾何学的最遠参照。')}
            </div>
            <p class="diversity-note">Diversity Scoreは「最寄りパターンまでの距離」のライブラリ内パーセンタイル。高いほど孤立した設計座標にいる。Farthestは6軸距離だけで計算しており、思想的な“対極”は次フェーズで別に定義する。</p>
          </section>` : ''}

          <p class="space-method-note">※ Design Spaceの0–100は客観的な品質点ではなく、パターン同士を比較するための編集的・ヒューリスティックな座標。Diversity Scoreも現在の収録パターン構成に応じて変動する相対値。</p>
        </section>` : ''}

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
        <div class="sticky-note"><p class="eyebrow">DISCOVERY TERMS</p><h3>検索・参照に使う語彙</h3><div class="detail-tags">${[...lex.design.slice(0,3).map(x=>x.term),...p.tags].map(t=>`<a href="./?q=${encodeURIComponent(t)}#patterns">${esc(t)}</a>`).join('')}</div><hr><p class="eyebrow">SURFACE / COMPONENTS</p><div class="detail-tags muted">${p.uiParts.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${p.philosophy?.length?`<hr><p class="eyebrow">PHILOSOPHICAL POSITION</p><div class="detail-tags muted">${p.philosophy.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div>
      </aside>
    </section>

    <section class="related"><div class="browser-head"><div><p class="eyebrow">RELATED PATTERNS</p><h2>近接する視覚文法</h2></div></div><div class="related-grid">${related.map(x=>`<a href="pattern.html?id=${encodeURIComponent(x.id)}"><div>${render(x,'related')}</div><p>${esc(x.brand)}</p><strong>${esc(x.name)}</strong></a>`).join('')}</div></section>`;

  const btn = document.getElementById('copyPrompt');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(expertPrompt); btn.textContent='コピー済み'; document.getElementById('copyStatus').textContent='専門語彙とDesign Space座標を含む設計指示をコピーした。'; setTimeout(()=>btn.textContent='コピー',1800); }
    catch { document.getElementById('copyStatus').textContent='コピーできなかったため、本文を選択してコピーしてください。'; }
  });
})();
