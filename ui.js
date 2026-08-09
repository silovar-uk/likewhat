(function () {
  const esc = (value = '') => String(value).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function line(width = 70, strong = false) {
    return `<span class="mock-line ${strong ? 'strong' : ''}" style="--w:${width}%"></span>`;
  }

  function rows(n = 4) {
    return Array.from({ length: n }, (_, i) => `<div class="mock-row"><span class="mock-dot"></span>${line(48 + ((i * 13) % 33), i === 1)}<span class="mock-meta">${i + 1}</span></div>`).join('');
  }

  function cards(n = 3) {
    return Array.from({ length: n }, (_, i) => `<div class="mock-card"><div class="mock-block ${i === 0 ? 'accent' : ''}"></div>${line(68, true)}${line(42)}</div>`).join('');
  }

  function render(pattern, size = 'card') {
    const cls = `mini-ui mini-ui--${size} theme-${pattern.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    let inner = '';
    switch (pattern.mock) {
      case 'settings-list': inner = `<div class="phone-shell"><div class="mock-title">Settings</div><div class="grouped">${rows(3)}</div><div class="grouped">${rows(2)}</div></div>`; break;
      case 'product-hero': inner = `<div class="hero-mock"><div class="mock-kicker">NEW</div><div class="hero-word">Pro</div>${line(46)}<div class="mock-actions"><i></i><i></i></div><div class="hero-object"></div></div>`; break;
      case 'editorial-cards': inner = `<div class="editorial-grid"><div class="editorial-big">${line(58,true)}${line(34)}</div><div class="editorial-small">${line(62,true)}</div><div class="editorial-small alt">${line(48,true)}</div></div>`; break;
      case 'sidebar-list': inner = `<div class="window-mock"><aside>${rows(5)}</aside><main><div class="mock-title">General</div>${cards(2)}</main></div>`; break;
      case 'bottom-sheet': inner = `<div class="phone-shell sheet-scene"><div class="back-content">${rows(4)}</div><div class="sheet"><span class="grabber"></span><div class="mock-title">Filter</div>${rows(3)}</div></div>`; break;
      case 'wallet-stack': inner = `<div class="wallet"><div class="pass p1">PASS</div><div class="pass p2">TICKET</div><div class="pass p3">MEMBER</div></div>`; break;
      case 'doc-sidebar': inner = `<div class="window-mock notion"><aside>${rows(6)}</aside><main><div class="doc-title"></div>${line(90)}${line(76)}${line(82)}<br>${line(60)}${line(88)}</main></div>`; break;
      case 'database-table': inner = `<div class="table-mock"><div class="table-head">Database <span>Filter · Sort</span></div>${rows(5)}</div>`; break;
      case 'command-menu':
      case 'linear-command':
      case 'arc-command': inner = `<div class="command-scene"><div class="ghost-page">${rows(4)}</div><div class="command-box"><div class="command-input">⌘ Search or command</div>${rows(4)}</div></div>`; break;
      case 'property-panel': inner = `<div class="property-mock"><div class="doc-title"></div>${Array.from({length:5},(_,i)=>`<div class="property-row"><span>${['Status','Owner','Type','Date','Tags'][i]}</span>${line(55,i===0)}</div>`).join('')}</div>`; break;
      case 'issue-list': inner = `<div class="dense-list"><div class="dense-toolbar">Issues <span>⌘K</span></div>${rows(7)}</div>`; break;
      case 'detail-pane': inner = `<div class="split-detail"><div class="list-side">${rows(6)}</div><div class="detail-side"><div class="mock-title">Issue detail</div>${line(88,true)}${line(68)}<div class="chips"><i></i><i></i></div>${line(92)}${line(74)}</div></div>`; break;
      case 'workspace-sidebar':
      case 'vertical-tabs': inner = `<div class="workspace-side"><aside><div class="side-top">Workspace</div>${rows(7)}</aside><main>${line(65,true)}${cards(2)}</main></div>`; break;
      case 'repo-overview': inner = `<div class="repo-mock"><div class="tabs"><b>Code</b><span>Issues</span><span>PR</span></div><div class="repo-list">${rows(4)}</div><div class="readme"><b>README</b>${line(92)}${line(70)}</div></div>`; break;
      case 'issue-detail': inner = `<div class="issue-mock"><div class="issue-main"><div class="mock-title">Issue title</div>${cards(2)}</div><aside><div class="chip"></div>${rows(3)}</aside></div>`; break;
      case 'material-cards': inner = `<div class="material-grid"><div class="mat-card big"><span>●</span>${line(56,true)}</div><div class="mat-card">${line(74,true)}${line(44)}</div><div class="mat-card alt">${line(60,true)}${line(36)}</div></div>`; break;
      case 'three-pane': inner = `<div class="three-pane"><aside>${rows(4)}</aside><section>${rows(7)}</section><main><div class="mock-title">Message</div>${line(86)}${line(70)}${line(93)}</main></div>`; break;
      case 'docs-code': inner = `<div class="docs-code"><aside>${rows(5)}</aside><main><div class="mock-title">Create a request</div>${line(92)}${line(80)}${line(74)}</main><pre><code>const api = new SDK();\nawait api.create({\n  id: 'demo'\n});</code></pre></div>`; break;
      case 'metrics-dashboard': inner = `<div class="metrics"><div class="metric-row"><div><small>Revenue</small><b>¥8.4M</b></div><div><small>Orders</small><b>1,284</b></div><div><small>Rate</small><b>72%</b></div></div><div class="spark"><i></i></div>${rows(3)}</div>`; break;
      case 'chat-workspace': inner = `<div class="chat"><aside>${rows(6)}</aside><main><div class="messages">${cards(2)}</div><div class="composer">Message… <b>↑</b></div></main></div>`; break;
      case 'rich-composer': inner = `<div class="composer-scene"><div class="message-lines">${rows(3)}</div><div class="rich-box"><div>Write a message…</div><div class="tools">＋ B I @ <b>↑</b></div></div></div>`; break;
      case 'canvas-inspector': inner = `<div class="canvas"><aside>${rows(5)}</aside><main><div class="artboard"><div></div></div></main><section>${rows(5)}</section></div>`; break;
      case 'floating-toolbar': inner = `<div class="float-scene"><div class="selected-box"></div><div class="float-tools"><i></i><i></i><i></i><i></i></div></div>`; break;
      case 'admin-cards': inner = `<div class="admin">${cards(3)}</div>`; break;
      case 'settings-form': inner = `<div class="form-mock">${Array.from({length:3},(_,i)=>`<section><div><b>${['Store','Account','Notifications'][i]}</b>${line(72)}</div><div><span class="input"></span><span class="input short"></span></div></section>`).join('')}</div>`; break;
      case 'listing-cards': inner = `<div class="listing"><div class="search-pill">Where · When · Who</div><div class="listing-grid">${cards(4)}</div></div>`; break;
      case 'deployments': inner = `<div class="deploy"><div class="dense-toolbar">Deployments <span>Production</span></div>${Array.from({length:6},(_,i)=>`<div class="mock-row"><span class="status-dot ${i===2?'warn':''}"></span>${line(56,i===0)}<span class="mock-meta">${i+2}m</span></div>`).join('')}</div>`; break;
      default: inner = `<div class="generic">${cards(3)}</div>`;
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }

  window.LikeWhatUI = { render, esc };
})();
