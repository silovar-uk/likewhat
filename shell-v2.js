(function () {
  const body = document.body;
  const header = document.querySelector('.site-header');
  if (!body || !header || header.dataset.shellV2 === 'ready') return;

  header.dataset.shellV2 = 'ready';
  body.classList.add('lw-shell-ready');

  const currentPath = location.pathname.split('/').pop() || 'index.html';
  const isHome = /^(?:index\.html)?$/.test(currentPath) || location.pathname.endsWith('/likewhat/');
  if (isHome) body.classList.add('lw-home');

  const brand = header.querySelector('.brandmark');
  const nav = header.querySelector('nav');
  if (!brand || !nav) return;

  // The navigation is owned by the shared shell, not by individual pages.
  // This intentionally replaces any stale per-page markup so every view stays in sync.
  const activeKey = currentPath === 'map.html'
    ? 'map'
    : currentPath === 'vocabulary.html'
      ? 'vocabulary'
      : currentPath === 'compare.html'
        ? 'compare'
        : currentPath === 'coverage.html'
          ? 'coverage'
          : 'library';

  const navItems = [
    { key: 'library', label: 'ライブラリ', href: './#patterns' },
    { key: 'map', label: 'デザインマップ', href: 'map.html' },
    { key: 'vocabulary', label: 'デザイン語彙', href: 'vocabulary.html' },
    { key: 'compare', label: '比較', href: 'compare.html' },
    { key: 'coverage', label: '分析', href: 'coverage.html' }
  ];

  nav.setAttribute('aria-label', 'グローバルナビゲーション');
  nav.innerHTML = [
    ...navItems.map(item => `<a href="${item.href}" data-lw-nav="${item.key}"${item.key === activeKey ? ' aria-current="page"' : ''}>${item.label}</a>`),
    '<button type="button" class="lw-nav-random" data-lw-nav="random" aria-label="全ライブラリからランダムに3件引く">Random 3</button>',
    '<a href="https://github.com/silovar-uk/likewhat" target="_blank" rel="noreferrer" data-lw-nav="github">GitHub ↗</a>'
  ].join('');

  const kicker = document.createElement('span');
  kicker.className = 'lw-brand-kicker';
  kicker.textContent = 'Design reference library';
  brand.appendChild(kicker);

  [...nav.querySelectorAll('a, button')].forEach((item, index) => {
    const number = document.createElement('span');
    number.className = 'lw-nav-index';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(2, '0');
    item.prepend(number);
    if (item instanceof HTMLAnchorElement && item.target === '_blank') item.classList.add('lw-external');
  });

  const randomNav = nav.querySelector('.lw-nav-random');
  randomNav?.addEventListener('click', () => {
    if (!isHome) {
      location.href = './?random3=1#randomizer';
      return;
    }
    document.querySelector('[data-random-mode="random"]')?.click();
    const draw = document.getElementById('randomDraw');
    if (draw) draw.click();
    else location.href = './?random3=1#randomizer';
  });

  const railFooter = document.createElement('div');
  railFooter.className = 'lw-rail-footer';
  railFooter.innerHTML = '<strong>Find the principle,<br>not the visual skin.</strong><span class="lw-rail-status">Library ready</span><span>Independent design research tool.</span>';
  header.appendChild(railFooter);

  const menuButton = document.createElement('button');
  menuButton.className = 'lw-menu-button';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'メニューを開く');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span aria-hidden="true"></span>';
  header.appendChild(menuButton);

  const navScrim = document.createElement('button');
  navScrim.className = 'lw-nav-scrim';
  navScrim.type = 'button';
  navScrim.setAttribute('aria-label', 'メニューを閉じる');
  body.appendChild(navScrim);

  function setNav(open) {
    body.classList.toggle('lw-nav-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (open) nav.querySelector('a, button')?.focus();
  }

  menuButton.addEventListener('click', () => setNav(!body.classList.contains('lw-nav-open')));
  navScrim.addEventListener('click', () => setNav(false));
  nav.addEventListener('click', event => {
    if (event.target.closest('a, button')) setNav(false);
  });

  let closeLibraryFilters = null;

  function setupLibraryTools() {
    const browser = document.getElementById('patterns');
    const panel = document.getElementById('facetPanel');
    const primarySearch = document.getElementById('searchInput');
    const activeFilters = document.getElementById('activeFilters');
    const brandDisclosure = browser?.querySelector('.brand-filter-disclosure');
    if (!browser || !panel || !primarySearch || !activeFilters || panel.dataset.shellV2 === 'ready') return;
    panel.dataset.shellV2 = 'ready';

    const toolbar = document.createElement('div');
    toolbar.className = 'lw-library-toolbar';
    toolbar.innerHTML = '<label class="lw-library-search"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg><span class="sr-only">Libraryを検索</span><input type="search" autocomplete="off" placeholder="名前・場面・デザイン語彙を検索"></label><button class="lw-filter-button" type="button" aria-expanded="false"><span class="lw-filter-label">詳細フィルター</span><span class="lw-filter-count" aria-label="選択中のフィルター数">0</span></button>';
    activeFilters.before(toolbar);

    const sheet = document.createElement('div');
    sheet.className = 'lw-filter-sheet';
    sheet.id = 'lwFilterSheet';
    sheet.innerHTML = '<div class="lw-filter-sheet-head"><strong>絞り込み</strong><button class="lw-filter-close" type="button" aria-label="フィルターを閉じる">×</button></div>';
    panel.before(sheet);
    sheet.append(panel);
    if (brandDisclosure) sheet.append(brandDisclosure);

    const scrim = document.createElement('button');
    scrim.className = 'lw-filter-scrim';
    scrim.type = 'button';
    scrim.setAttribute('aria-label', 'フィルターを閉じる');
    body.append(scrim);

    const filterButton = toolbar.querySelector('.lw-filter-button');
    const filterLabel = toolbar.querySelector('.lw-filter-label');
    const filterCount = toolbar.querySelector('.lw-filter-count');
    const librarySearch = toolbar.querySelector('input');
    const closeButton = sheet.querySelector('.lw-filter-close');
    let lastFocused = null;

    function isMobile() {
      return matchMedia('(max-width: 1023px)').matches;
    }

    function setFilters(open) {
      if (isMobile()) {
        body.classList.toggle('lw-filters-open', open);
        sheet.setAttribute('role', 'dialog');
        sheet.setAttribute('aria-modal', 'true');
        sheet.setAttribute('aria-label', 'ライブラリの絞り込み');
        if (open) {
          lastFocused = document.activeElement;
          closeButton.focus();
        } else if (lastFocused instanceof HTMLElement) {
          lastFocused.focus();
        }
      } else {
        sheet.classList.toggle('is-advanced-open', open);
        filterLabel.textContent = open ? '詳細を閉じる' : '詳細フィルター';
      }
      filterButton.setAttribute('aria-expanded', String(open));
    }

    closeLibraryFilters = () => setFilters(false);

    filterButton.setAttribute('aria-controls', sheet.id);
    filterButton.addEventListener('click', () => {
      const open = isMobile()
        ? !body.classList.contains('lw-filters-open')
        : !sheet.classList.contains('is-advanced-open');
      setFilters(open);
    });
    closeButton.addEventListener('click', () => setFilters(false));
    scrim.addEventListener('click', () => setFilters(false));

    librarySearch.addEventListener('input', () => {
      if (primarySearch.value === librarySearch.value) return;
      primarySearch.value = librarySearch.value;
      primarySearch.dispatchEvent(new Event('input', { bubbles: true }));
    });
    primarySearch.addEventListener('input', () => {
      if (librarySearch.value !== primarySearch.value) librarySearch.value = primarySearch.value;
    });
    librarySearch.value = primarySearch.value;

    function updateFilterCount() {
      const selected = activeFilters.querySelectorAll('.active-filter').length;
      filterCount.textContent = String(selected);
      filterButton.classList.toggle('has-filters', selected > 0);
      if (selected) filterButton.setAttribute('aria-label', `詳細フィルター、${selected}件選択中`);
      else filterButton.removeAttribute('aria-label');
    }

    new MutationObserver(updateFilterCount).observe(activeFilters, { childList: true, subtree: true });
    updateFilterCount();

    matchMedia('(max-width: 1023px)').addEventListener('change', () => {
      body.classList.remove('lw-filters-open');
      sheet.classList.remove('is-advanced-open');
      filterButton.setAttribute('aria-expanded', 'false');
      filterLabel.textContent = '詳細フィルター';
      sheet.removeAttribute('role');
      sheet.removeAttribute('aria-modal');
      sheet.removeAttribute('aria-label');
    });

    sheet.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !body.classList.contains('lw-filters-open')) return;
      const focusable = [...sheet.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), summary, a[href]')]
        .filter(element => element.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  setupLibraryTools();
  window.addEventListener('likewhat:library-ready', setupLibraryTools, { once: true });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (body.classList.contains('lw-filters-open')) {
      closeLibraryFilters?.();
      return;
    }
    if (body.classList.contains('lw-nav-open')) setNav(false);
  });
})();
