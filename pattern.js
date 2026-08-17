(function () {
  const patterns = window.LIKEWHAT_PATTERNS || [];
  const { render, esc } = window.LikeWhatUI;
  const vocabulary = window.LikeWhatVocabulary;
  const designSpace = window.LikeWhatDesignSpace;
  const microDetails = window.LikeWhatMicroDetails;
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
  const opposite = designSpace && p.designSpace ? designSpace.editorialOpposite(p, patterns) : null;
  const related = patterns.filter(x => x.id !== p.id).map(x => ({x, score:(x.brand===p.brand?5:0)+x.tags.filter(t=>p.tags.includes(t)).length})).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>v.x);
  const curatedPair = patterns.find(x => x.id !== p.id && ((p.related || []).includes(x.id) || (x.related || []).includes(p.id))) || null;
  const editorialPair = curatedPair || related[0] || null;
  const compareTargets = [
    diversity?.nearest?.pattern ? {
      key:'nearest',
      label:'NEAREST',
      question:'Similarity / 微差を見る',
      pattern:diversity.nearest.pattern,
      distance:diversity.nearest.distance,
      copy:'6軸で最も近い参照。似ているからこそ、残っている小さな差が設計判断として見える。'
    } : null,
    editorialPair ? {
      key:'curated',
      label:curatedPair ? 'CURATED PAIR' : 'EDITORIAL RELATED',
      question:'Contrast / 分岐を見る',
      pattern:editorialPair,
      distance:designSpace && p.designSpace && editorialPair.designSpace ? designSpace.distanceBetween(p.designSpace, editorialPair.designSpace) : null,
      copy:curatedPair ? '編集上、同じ問題領域の別解として結び付けた参照。何を残し、どこで優先順位を変えたかを見る。' : 'ブランド・タグ・視覚文法の近接から選んだ参照。共通項を保ったまま、別の組み立て方を読む。'
    } : null,
    opposite?.pattern ? {
      key:'opposite',
      label:'OPPOSITE',
      question:'Inversion / 反転を見る',
      pattern:opposite.pattern,
      distance:opposite.currentDistance,
      copy:'6軸の優先順位を反転した先に近い参照。元の設計が「何を選ばなかったか」まで見える。'
    } : null
  ].filter(Boolean);
  const microTrace = microDetails ? microDetails.forPattern(p) : null;

  function lexiconColumn(label, title, items) {
    return `<section class="lexicon-column"><p class="eyebrow">${esc(label)}</p><h3>${esc(title)}</h3><div class="lexicon-items">${items.map(item=>`<article class="lexicon-item"><a class="lexicon-term-link" href="vocabulary.html?term=${encodeURIComponent(item.term)}"><strong>${esc(item.term)}</strong><span>${esc(item.ja)}</span></a><p>${esc(item.note)}</p></article>`).join('')}</div></section>`;
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

  function oppositeReferenceCard(pattern, label, linked) {
    const inner = `<div class="opposite-reference-preview">${render(pattern, 'related')}</div><div class="opposite-reference-copy"><small>${esc(label)}</small><strong>${esc(pattern.brand)}</strong><span>${esc(pattern.name)}</span><p>${esc(pattern.oneLiner)}</p></div>`;
    return linked ? `<a class="opposite-reference-card" href="pattern.html?id=${encodeURIComponent(pattern.id)}">${inner}</a>` : `<div class="opposite-reference-card current">${inner}</div>`;
  }

  function oppositeAxisRows(opposition) {
    return opposition.flips.map(flip=>`<div class="opposite-axis-row ${flip.crossed?'crossed':''}">
      <strong>${esc(flip.name)}</strong>
      <span class="from">${esc(flip.fromLabel)} <b>${Math.round(flip.a)}</b></span>
      <i>→</i>
      <span class="to">${esc(flip.toLabel)} <b>${Math.round(flip.b)}</b></span>
    </div>`).join('');
  }

  function compareRouteCard(item) {
    const target = item.pattern;
    const diffs = designSpace && p.designSpace && target.designSpace ? designSpace.differenceBreakdown(p.designSpace, target.designSpace).slice(0,2) : [];
    const distance = Number.isFinite(item.distance) ? item.distance.toFixed(1) : '—';
    return `<a class="compare-route-card compare-route-${esc(item.key)}" href="compare.html?a=${encodeURIComponent(p.id)}&b=${encodeURIComponent(target.id)}">
      <div class="compare-route-preview">${render(target, 'related')}</div>
      <div class="compare-route-body">
        <div class="compare-route-meta"><span>${esc(item.label)}</span><b>${distance}</b></div>
        <small>${esc(item.question)}</small>
        <strong>${esc(target.brand)}</strong>
        <h3>${esc(target.name)}</h3>
        <p>${esc(item.copy)}</p>
        ${diffs.length ? `<div class="compare-route-diffs">${diffs.map(d=>`<span>${esc(d.name)} <b>Δ${Math.round(d.diff)}</b></span>`).join('')}</div>` : ''}
        <em>Compare this pair ↗</em>
      </div>
    </a>`;
  }

  const vocabularyLine = [...lex.design,...lex.philosophy].slice(0,8).map(x=>x.term).join(' / ');
  const spaceSummary = designSpace ? designSpace.summary(p.designSpace) : '';
  const spacePrompt = p.designSpace ? `\nDesign Space上の位置は、Density ${p.designSpace.density} / Emotional Intensity ${p.designSpace.emotion} / Exploration ${p.designSpace.exploration} / Authority ${p.designSpace.authority} / Direct Manipulation ${p.designSpace.interaction} / Systematic Order ${p.designSpace.order}。この数値を装飾ではなく、情報量・感情強度・探索性・権威性・操作直接性・秩序性の設計判断として反映してください。` : '';
  const oppositePrompt = opposite ? `\n対極参照は ${opposite.pattern.brand}「${opposite.pattern.name}」。特に ${opposite.flips.slice(0,3).map(f=>`${f.name}を「${f.fromLabel}」から「${f.toLabel}」へ反転させる方向`).join('、')} が対照的です。今回の設計ではこの対極側へ無自覚に寄せず、元パターンの優先順位を維持してください。` : '';
  const microPrompt = microDetails && microTrace ? microDetails.prompt(microTrace) : '';
  const expertPrompt = `${p.prompt}\n\n設計語彙として、${vocabularyLine} を意識してください。単にブランドの表層表現を模倣するのではなく、情報階層・密度・文脈保持・操作の開示タイミングまで設計原則として再現してください。${spacePrompt}${oppositePrompt}${microPrompt}`;

  // STEP15: FIRST READ用に、6軸のうちライブラリ平均から最も離れた軸を1つ求める。
  // lens.js相当の計算をここでも行う(pattern.htmlはlens.jsを読み込んでいないため)。
  const firstReadAxis = designSpace && p.designSpace ? designSpace.axes
    .map(a => {
      const value = Number(p.designSpace[a.key]);
      const mean = Number(libraryMean[a.key]);
      if (!Number.isFinite(value) || !Number.isFinite(mean)) return null;
      return { name: designSpace.axisNames?.[a.key] || a.key, value: Math.round(value), diff: Math.round(value - mean) };
    })
    .filter(Boolean)
    .sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff))[0] : null;
  const hasMicroTrace = !!microTrace?.groups?.length;
  // 解像度インジケータ(STEP16): 実測済みMICRO DETAILSがあれば5段、なければ3段で止まる。
  const resolutionMax = hasMicroTrace ? 5 : 3;
  function resolutionDots(step) {
    const filled = Math.min(step, resolutionMax);
    return `<span class="resolution-dots" aria-hidden="true">${'●'.repeat(filled)}${'○'.repeat(Math.max(0, resolutionMax - filled))}</span>`;
  }

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
        <section class="detail-block first-read-block"><p class="eyebrow">00 FIRST READ</p>${resolutionDots(1)}<p class="first-read-line">${esc(p.oneLiner)}</p>${firstReadAxis ? `<p class="first-read-axis">${esc(firstReadAxis.name)} ${firstReadAxis.value} · ライブラリ平均より${firstReadAxis.diff > 0 ? '+' : ''}${firstReadAxis.diff}</p>` : ''}</section>
        <section class="detail-block"><p class="eyebrow">01 DESIGN INTENT</p>${resolutionDots(2)}<h2>設計意図を言語化すると</h2><p class="large-copy">${esc(p.description)}</p></section>

        ${designSpace && p.designSpace ? `<section class="detail-block design-space-block">
          <p class="eyebrow">02 POSITIONING</p>${resolutionDots(3)}
          <h2>このデザインは、どこに位置する？</h2>
          <p class="design-space-intro">6つの対立軸で、このパターンの設計上の重心を可視化する。レーダーは全体形状、右側のスケールは各軸の意味を読むためのもの。破線は現在のLike What?ライブラリ全体の平均。</p>
          <div class="space-layout">
            ${designSpace.radar(p.designSpace, libraryMean)}
            ${designSpace.bars(p.designSpace, libraryMean, patterns, p.id)}
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
            <p class="diversity-note">Diversity Scoreは「最寄りパターンまでの距離」のライブラリ内パーセンタイル。高いほど孤立した設計座標にいる。Farthestは6軸距離だけで計算しており、思想的な“対極”とは区別する。</p>
          </section>` : ''}

          ${opposite ? `<section class="opposite-analysis">
            <div class="opposite-heading">
              <div><p class="eyebrow">OPPOSITE REFERENCE / INVERT THE PRIORITIES</p><h3>この設計を反転すると、何になる？</h3><p>現在値を6軸すべて反転した「理想上の対極」を作り、その座標に最も近い別文脈の実在パターンを探す。</p></div>
              <div class="opposite-fit"><strong>${opposite.fit}</strong><span>/ 100</span><small>Opposition Fit</small></div>
            </div>
            <div class="opposite-reference-pair">
              ${oppositeReferenceCard(p, 'CURRENT PRIORITIES', false)}
              <div class="opposite-switch" aria-hidden="true"><span>↔</span><small>INVERT</small></div>
              ${oppositeReferenceCard(opposite.pattern, opposite.mode==='curated'?'CURATED OPPOSITE':'EDITORIAL OPPOSITE', true)}
            </div>
            <div class="opposite-flip-list">
              ${opposite.flips.slice(0,3).map((flip,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><small>${esc(flip.name)}</small><p>${esc(flip.fromConcept)}<b>→</b>${esc(flip.toConcept)}</p></div></article>`).join('')}
            </div>
            <div class="opposite-axis-matrix">
              <div class="opposite-axis-header"><span>Axis</span><span>${esc(p.brand)}</span><i></i><span>${esc(opposite.pattern.brand)}</span></div>
              ${oppositeAxisRows(opposite)}
            </div>
            <p class="opposite-note">Opposition Fitは「理想上の完全反転ベクトル」にどれだけ近いか。Farthestが“現在地から最遠”なのに対し、Oppositeは“優先順位を反転した先”を探す。${opposite.mode==='curated'?'このパターンは手動指定された対極を使用。':'同ブランド・同Domain・同Archetypeには軽いペナルティを加え、異なる文脈の参照を優先。'}</p>
          </section>` : ''}

          <p class="space-method-note">※ Design Spaceの0–100は客観的な品質点ではなく、パターン同士を比較するための編集的・ヒューリスティックな座標。Diversity ScoreとOpposition Fitも現在の収録パターン構成に依存する相対的な参照指標。</p>
        </section>` : ''}

        ${compareTargets.length ? `<section class="detail-block compare-route-block">
          <div class="compare-route-heading">
            <div><p class="eyebrow">COMPARE WITH / THREE DIRECTIONS</p><h2>何と比べると、この設計が見える？</h2><p>比較の目的を変えると、同じパターンから別の設計判断が見える。Nearestは微差、Curatedは同じ問題への別解、Oppositeは優先順位の反転を見る。</p></div>
            <a href="compare.html?a=${encodeURIComponent(p.id)}&b=${encodeURIComponent(compareTargets[0].pattern.id)}">Contrastを開く ↗</a>
          </div>
          <div class="compare-route-grid">${compareTargets.map(compareRouteCard).join('')}</div>
          <p class="compare-route-note">同じ参照が複数の役割に現れる場合がある。それは「距離が近い」「編集上の対照である」など、別の理由が同時に成立していることを示す。</p>
        </section>` : ''}

        <section class="detail-block grammar-block">
          <p class="eyebrow">03 DESIGN GRAMMAR</p>${resolutionDots(4)}<h2>技術・デザイン・思想の3層で分解する</h2>
          <p class="grammar-intro">「○○風」を装飾の模倣で終わらせず、実装構造、視覚・インタラクション設計、認知・設計思想へ分解した語彙。</p>
          <div class="lexicon-grid">
            ${lexiconColumn('IMPLEMENTATION', '実装構造', lex.implementation)}
            ${lexiconColumn('DESIGN SYSTEM', '視覚・インタラクション', lex.design)}
            ${lexiconColumn('PHILOSOPHY', '認知・設計思想', lex.philosophy)}
          </div>
        </section>

        ${microDetails ? microDetails.render(microTrace, esc, resolutionDots(5)) : ''}
        <section class="detail-block"><p class="eyebrow">VISUAL / INTERACTION PRINCIPLES</p><h2>パターンを成立させる設計原則</h2><ol class="principle-list">${p.visual.map((v,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(v)}</p></li>`).join('')}</ol></section>
        <section class="detail-block"><p class="eyebrow chapter-eyebrow">05 GOOD FIT / TRADE-OFF</p>${resolutionDots(resolutionMax)}<div class="two-up"><div><p class="eyebrow">GOOD FIT</p><h2>適合しやすい文脈</h2><ul>${p.useCases.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div><div><p class="eyebrow">TRADE-OFF / RISK</p><h2>相性が悪い文脈</h2><ul>${p.avoid.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div></div></section>
        <section class="detail-block prompt-block"><div class="prompt-head"><div><p class="eyebrow">06 TAKE IT / IMPLEMENTATION BRIEF</p><h2>AIへ渡す設計指示</h2></div><button id="copyPrompt">コピー</button></div><pre id="promptText">${esc(expertPrompt)}</pre><p id="copyStatus" class="copy-status" aria-live="polite"></p></section>
      </article>

      <aside class="detail-aside">
        <div class="sticky-note"><p class="eyebrow">DISCOVERY TERMS</p><h3>検索・参照に使う語彙</h3><div class="detail-tags">${[...lex.design.slice(0,3).map(x=>x.term),...p.tags].map(t=>`<a href="./?q=${encodeURIComponent(t)}#patterns">${esc(t)}</a>`).join('')}</div><hr><p class="eyebrow">SURFACE / COMPONENTS</p><div class="detail-tags muted">${p.uiParts.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${p.philosophy?.length?`<hr><p class="eyebrow">PHILOSOPHICAL POSITION</p><div class="detail-tags muted">${p.philosophy.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div>
      </aside>
    </section>

    <section class="related"><div class="browser-head"><div><p class="eyebrow">RELATED PATTERNS</p><h2>近接する視覚文法</h2></div></div><div class="related-grid">${related.map(x=>`<a href="pattern.html?id=${encodeURIComponent(x.id)}"><div>${render(x,'related')}</div><p>${esc(x.brand)}</p><strong>${esc(x.name)}</strong></a>`).join('')}</div></section>`;

  const btn = document.getElementById('copyPrompt');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(expertPrompt); btn.textContent='コピー済み'; document.getElementById('copyStatus').textContent='専門語彙、Design Space座標、対極参照、細部トレースを含む設計指示をコピーした。'; setTimeout(()=>btn.textContent='コピー',1800); }
    catch { document.getElementById('copyStatus').textContent='コピーできなかったため、本文を選択してコピーしてください。'; }
  });
})();