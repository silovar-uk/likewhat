(function () {
  const NAV_LABELS = new Map([
    ['map.html', 'デザインマップ'],
    ['vocabulary.html', 'デザイン語彙'],
    ['compare.html', '比較'],
    ['coverage.html', '分析'],
  ]);

  const EXACT = new Map([
    ['Reference catalog loads on approach.', 'ライブラリは近づくと読み込みます。'],
    ['Reference catalog loads when you approach this section.', 'この位置に近づくと参照データを読み込みます。'],
    ['Core catalog · loading only what this view needs', '参照データを読み込み中…'],
    ['Loading the core reference catalog…', '参照データを読み込み中…'],
    ['Library failed to load · reload to retry', '読み込みに失敗しました。ページを再読み込みしてください。'],
    ['Sort', '並び順'],
    ['Filter this scene', 'この場面で絞る'],
    ['Open pattern', '詳細を見る'],
    ['Open cluster', '業界を見る'],
    ['Explore artist', 'アーティストを見る'],
    ['Explore institution', '組織を見る'],
    ['Explore brand', 'ブランドを見る'],
    ['Horizontal / X', '横軸 / X'],
    ['Vertical / Y', '縦軸 / Y'],
    ['Domain', '領域'],
    ['↔ Swap axes', '↔ 軸を入れ替える'],
    ['visible patterns', '表示中の参照'],
    ['Random term', '語彙をランダム表示'],
    ['Reference A', '参照 A'],
    ['Reference B', '参照 B'],
  ]);

  const ACTIVE_LABELS = new Map([
    ['Search', '検索'],
    ['Kind', '種類'],
    ['Collection', 'コレクション'],
    ['Scene', '場面'],
    ['Domain', '領域'],
    ['Medium', '媒体'],
    ['UI Part', 'UI要素'],
  ]);

  const KIND_LABELS = new Map([
    ['brand', 'ブランド'],
    ['artist', 'アーティスト'],
    ['institution', '組織'],
    ['scene', '場面'],
    ['industry-cluster', '業界'],
    ['cluster', '業界'],
  ]);

  const SORT_LABELS = new Map([
    ['brand', '基本の並び'],
    ['density', '情報密度が高い順'],
    ['exploration', '探索的な順'],
    ['diversity', '多様性が高い順'],
    ['random', 'ランダム'],
  ]);

  let queued = false;

  function queueTranslate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      translateAll();
    });
  }

  function replaceExact(element) {
    if (!element || element.children.length) return;
    const next = EXACT.get(element.textContent.trim());
    if (next && element.textContent !== next) element.textContent = next;
  }

  function setLeadingText(button, label) {
    if (!button) return;
    const node = [...button.childNodes].find(item => item.nodeType === Node.TEXT_NODE && item.nodeValue.trim());
    if (node && node.nodeValue.trim() !== label) node.nodeValue = `${label} `;
  }

  function translateNav() {
    const nav = document.querySelector('.site-header nav');
    if (!nav) return;
    nav.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.includes('#patterns')) {
        const textNode = link.lastChild && link.lastChild.nodeType === Node.TEXT_NODE ? link.lastChild : null;
        const back = Boolean(textNode && textNode.nodeValue.trim().startsWith('←'));
        if (textNode) textNode.nodeValue = back ? ' ← ライブラリ' : ' ライブラリ';
        return;
      }
      for (const [needle, label] of NAV_LABELS) {
        if (!href.includes(needle)) continue;
        if (link.lastChild && link.lastChild.nodeType === Node.TEXT_NODE) link.lastChild.nodeValue = ` ${label}`;
      }
    });
  }

  function translateShell() {
    translateNav();
    const kicker = document.querySelector('.lw-brand-kicker');
    if (kicker && kicker.textContent !== 'デザインを言葉にする学習ライブラリ') kicker.textContent = 'デザインを言葉にする学習ライブラリ';

    const rail = document.querySelector('.lw-rail-footer');
    if (rail && rail.dataset.learningCopy !== 'ready') {
      rail.dataset.learningCopy = 'ready';
      rail.innerHTML = '<strong>見た目ではなく、<br>判断の理由を持ち帰る。</strong><span class="lw-rail-status">学習ツール</span><span>観察 → 言語化 → 比較 → 実装</span>';
    }

    document.querySelectorAll('footer p').forEach(p => {
      const text = p.textContent.trim();
      if (/^Like What\? —/.test(text)) p.textContent = 'Like What? — 見た目ではなく、設計の理由を持ち帰る。';
      if (/^References point to/.test(text)) p.textContent = '参照元は、確認できる範囲で公式ページへ接続しています。';
      if (/^Vocabulary relationships are/.test(text)) p.textContent = '語彙の関係は、現在の参照ライブラリ内の共起から生成しています。';
      if (/^Contrast values use/.test(text)) p.textContent = '比較には、ライブラリ共通の6軸Design Spaceを使用しています。';
      if (/^Coverage analysis is/.test(text)) p.textContent = '分析値は現在の参照ライブラリに対する相対値で、追加に応じて変化します。';
    });
  }

  function translateLibrary() {
    const result = document.getElementById('resultCount');
    if (result) {
      const text = result.textContent.trim();
      const match = text.match(/^(\d+) entries · (\d+) \/ (\d+) references(.*)$/);
      if (match) {
        const tail = match[4].includes('searching core fields') ? ' · 主要項目を検索中…' : '';
        result.textContent = `${match[1]}件 · 参照 ${match[2]} / ${match[3]}${tail}`;
      } else {
        replaceExact(result);
      }
    }

    const librarySearch = document.querySelector('.lw-library-search input');
    if (librarySearch) librarySearch.placeholder = '名前・場面・考え方から検索';

    document.querySelectorAll('.active-filter b').forEach(label => {
      const next = ACTIVE_LABELS.get(label.textContent.trim());
      if (next) label.textContent = next;
    });

    document.querySelectorAll('.sort-facet-row > span').forEach(label => {
      if (label.textContent.trim() === 'Sort') label.textContent = '並び順';
    });

    const sort = document.getElementById('librarySort');
    if (sort) [...sort.options].forEach(option => {
      const label = SORT_LABELS.get(option.value);
      if (label) option.textContent = label;
    });

    document.querySelectorAll('[data-facet="kind"][data-value]').forEach(button => {
      const label = KIND_LABELS.get(button.dataset.value);
      if (label) setLeadingText(button, label);
    });

    document.querySelectorAll('[data-facet][data-value="All"]').forEach(button => setLeadingText(button, 'すべて'));

    document.querySelectorAll('.group-pattern-list p').forEach(p => {
      const match = p.textContent.trim().match(/^\+\s*(\d+)\s+more patterns$/i);
      if (match) p.textContent = `+ ${match[1]}件`;
    });

    document.querySelectorAll('.library-group-main > footer span').forEach(replaceExact);

    document.querySelectorAll('.library-group-main > header small').forEach(small => {
      let text = small.textContent;
      text = text
        .replace(/\bBRAND\b/g, 'ブランド')
        .replace(/\bARTIST\b/g, 'アーティスト')
        .replace(/\bINSTITUTION\b/g, '組織')
        .replace(/\bSCENE\b/g, '場面')
        .replace(/\bBRANDS\b/g, 'ブランド')
        .replace(/\bVARIATIONS?\b/g, 'バリエーション')
        .replace(/\bPATTERNS?\b/g, 'パターン')
        .replace(/\bERA \/ CONCEPTS?\b/g, '時期 / コンセプト');
      if (text !== small.textContent) small.textContent = text;
    });

    const brandSummary = document.getElementById('brandFilterSummary');
    if (brandSummary && /^All(?: collections)?$/i.test(brandSummary.textContent.trim())) brandSummary.textContent = 'すべて';

    document.querySelectorAll('.library-loading-note').forEach(replaceExact);
  }

  function translateAnalysisPages() {
    document.querySelectorAll('.axis-control label, .map-control-button, .map-stat span, #randomTerm, .pair-control label').forEach(replaceExact);

    const mapLegend = document.querySelector('.map-legend');
    if (mapLegend && mapLegend.dataset.learningCopy !== 'ready') {
      mapLegend.dataset.learningCopy = 'ready';
      mapLegend.innerHTML = '<span><i class="legend-dot" aria-hidden="true"></i> 参照</span><span><i class="legend-ring" aria-hidden="true"></i> 境界 / 多様性が高い</span><span><i class="legend-open" aria-hidden="true"></i> この2軸で参照が薄い領域</span>';
    }

    const eyebrowMap = new Map([
      ['DESIGN SPACE / EXPLORE THE MAP', '地図で探す / DESIGN SPACE'],
      ['CURRENT PROJECTION', '現在の見え方 / CURRENT PROJECTION'],
      ['OPEN SPACE / UNDERREPRESENTED', '参照が薄い方向 / OPEN SPACE'],
      ['DESIGN VOCABULARY / KNOWLEDGE GRAPH', '言葉で理解する / DESIGN VOCABULARY'],
      ['BROWSE CONCEPTS', '概念を探す / BROWSE CONCEPTS'],
      ['CONTRAST PAIR / SAME PROBLEM, DIFFERENT PRIORITIES', '違いから学ぶ / CONTRAST'],
      ['CURATED CONTRASTS / WAVE 2+', 'おすすめの比較 / CURATED CONTRASTS'],
      ['COVERAGE PLANNER / WHERE THE LIBRARY IS THIN', '学びの偏りを見る / COVERAGE'],
      ['COVERAGE SNAPSHOT', '現在地 / COVERAGE SNAPSHOT'],
      ['01 / 6D SPATIAL GAPS', '01 / 参照が薄い座標'],
      ['02 / THIN VOCABULARY', '02 / 実例が薄い語彙'],
      ['03 / CONTEXT BALANCE', '03 / 文脈の偏り'],
      ['04 / NEXT RESEARCH BRIEFS', '04 / 次に調べる条件'],
    ]);
    document.querySelectorAll('.eyebrow').forEach(el => {
      const next = eyebrowMap.get(el.textContent.trim());
      if (next) el.textContent = next;
    });
  }

  function translateGeneric() {
    document.querySelectorAll('.library-loading-note, #resultCount').forEach(replaceExact);
  }

  function translateAll() {
    translateShell();
    translateLibrary();
    translateAnalysisPages();
    translateGeneric();
  }

  /* top-bootstrap reorders style links while lazily loading the Library. Keep this layer last. */
  const learningStyle = document.querySelector('link[href^="styles-learning.css"]');
  const headObserver = learningStyle ? new MutationObserver(() => {
    if (document.head.lastElementChild !== learningStyle) document.head.appendChild(learningStyle);
  }) : null;
  headObserver?.observe(document.head, { childList: true });

  const bodyObserver = new MutationObserver(queueTranslate);
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('likewhat:library-ready', () => {
    if (learningStyle && document.head.lastElementChild !== learningStyle) document.head.appendChild(learningStyle);
    queueTranslate();
  });
  window.addEventListener('likewhat:groups-rendered', queueTranslate);
  window.addEventListener('load', queueTranslate, { once: true });

  translateAll();
})();
