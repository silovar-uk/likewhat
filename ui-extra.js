(function(){
  if(!window.LikeWhatUI) return;
  const baseRender=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const line=(w=70,strong=false)=>`<span class="mock-line ${strong?'strong':''}" style="--w:${w}%"></span>`;
  const tiny=(t)=>`<span class="extra-tiny">${esc(t)}</span>`;
  const cover=(i=0)=>`<div class="extra-cover c${i%5}"><span></span><b></b></div>`;
  const article=(i=0)=>`<div class="extra-article"><div class="extra-thumb t${i%4}"></div><div>${tiny(['特集','漫画','ラジオ','ブロス'][i%4])}${line(88,true)}${line(65)}<small>2026.08.${String(i+1).padStart(2,'0')}</small></div></div>`;
  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} extra-ui theme-${pattern.brand.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    let inner='';
    switch(pattern.mock){
      case 'omocoro-feed': inner=`<div class="omocoro-feed"><div class="omocoro-word">OMOCORO</div><div class="omocoro-grid">${article(0)}${article(1)}${article(2)}${article(3)}</div></div>`; break;
      case 'omocoro-index': inner=`<div class="omocoro-index"><div class="extra-head"><b>オモコロ特集</b><span>新着順⌄</span></div>${[0,1,2,3,4].map(i=>`<div class="omocoro-index-row">${tiny('特集')}<small>2026.07.${29-i}</small><strong>${['アニメキャラの誕生日を性格や容姿から逆算する','ぼくのかんがえたさいきょうの恋リア','本格探偵物語','ものづくりしりとり','重-1グランプリ'][i]}</strong><em>writer</em></div>`).join('')}</div>`; break;
      case 'omocoro-longform': inner=`<div class="omocoro-long"><div class="omocoro-long-title">頭を悪くする時間を<br>あなたに</div>${line(92)}${line(84)}${line(67)}<div class="fake-chart"><i style="--h:46%"></i><i style="--h:78%"></i><i style="--h:60%"></i><i style="--h:92%"></i></div>${line(75,true)}${line(88)}</div>`; break;
      case 'shueisha-portal': inner=`<div class="shueisha-portal"><div class="shueisha-logo">SHUEISHA</div><section class="portal-pick"><b>PICK UP</b><div></div></section><section class="portal-shelf"><b>NEW RELEASES</b>${cover(0)}${cover(1)}${cover(2)}${cover(3)}</section><section class="portal-news">${line(82,true)}${line(67)}${line(75)}</section></div>`; break;
      case 'shueisha-issue': inner=`<div class="jump-issue"><div class="jump-red">WEEKLY<br>SHONEN<br>JUMP</div><div class="jump-cover">35</div><div class="jump-meta"><b>2026 35号</b>${line(80)}${line(58)}<div class="jump-buttons"><i></i><i></i></div></div><div class="jump-strip">NEW COMICS → NEWS → SERIES</div></div>`; break;
      case 'shueisha-shelf': inner=`<div class="book-shelf"><div class="extra-head"><b>7.22 発売</b><span>雑誌 / コミックス</span></div><div class="covers">${[0,1,2,3,4,5].map(cover).join('')}</div><div class="extra-head lower"><b>7.17 発売</b><span>もっと見る</span></div></div>`; break;
      case 'nintendo-topics': inner=`<div class="nintendo-topics"><div class="nintendo-bar"><b>Nintendo</b><span>TOPICS</span></div><div class="topic-grid">${[0,1,2].map(i=>`<div class="topic-card"><div class="topic-img n${i}"></div>${tiny('Nintendo Switch 2')}<b>${['新しい遊びを紹介します','本日発売。最新情報','アップデートのお知らせ'][i]}</b><small>2026.7.${24-i}</small></div>`).join('')}</div></div>`; break;
      case 'nintendo-catalog': inner=`<div class="nintendo-catalog"><div class="nintendo-bar"><b>Nintendo Switch 2</b><span>SOFTWARE</span></div><div class="catalog-section"><strong>発売中のソフト</strong><div class="game-covers">${[0,1,2,3].map(i=>`<div class="game-cover g${i}"><span>SWITCH 2</span></div>`).join('')}</div></div><div class="catalog-label">Nintendo Switch 2 Edition</div></div>`; break;
      case 'nintendo-explainer': inner=`<div class="nintendo-explainer"><div class="nintendo-bar"><b>Switch 2 Edition</b></div><h4>Nintendo Switch 2 Editionについて</h4><div class="explain-icons"><i>+</i><i>↑</i><i>2</i></div><div class="explain-copy">${line(92)}${line(78)}${line(86)}</div><div class="upgrade-card"><div class="game-cover g2"></div><div><b>追加内容</b>${line(74)}${line(61)}${line(68)}</div></div></div>`; break;
      default:return baseRender(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={render,esc};

  function setupRandomizerPolish(){
    const randomizer=document.getElementById('randomizer');
    const results=document.getElementById('randomResults');
    const draw=document.getElementById('randomDraw');
    const modes=document.getElementById('randomModes');
    if(!randomizer||!results||!draw||!modes)return;

    const modeLabels={random:['Random','偶然に任せる'],far:['Far Apart','設計空間で遠くする'],weird:['Weird','異質な思想をぶつける']};
    modes.querySelectorAll('[data-random-mode]').forEach(button=>{
      const [label,description]=modeLabels[button.dataset.randomMode]||[];
      if(!label)return;
      const strong=button.querySelector('strong');
      const span=button.querySelector('span');
      if(strong)strong.textContent=label;
      if(span)span.textContent=description;
      button.title=description;
      button.setAttribute('aria-label',`${label}：${description}`);
    });

    const sync=()=>{
      const copy=results.querySelector('.random-analysis-copy');
      const hasResults=!!results.querySelector('.random-grid');
      randomizer.classList.toggle('has-results',hasResults);
      if(!copy||copy.querySelector('.random-reroll-inline'))return;
      const heading=copy.querySelector('h3');
      if(!heading)return;
      const reroll=document.createElement('button');
      reroll.type='button';
      reroll.className='random-reroll-inline';
      reroll.setAttribute('aria-label','ランダム3件を引き直す');
      reroll.innerHTML='<span aria-hidden="true">↻</span><span>引き直す</span>';
      heading.insertAdjacentElement('afterend',reroll);
    };

    new MutationObserver(sync).observe(results,{childList:true,subtree:true});
    results.addEventListener('click',event=>{
      const reroll=event.target.closest('.random-reroll-inline');
      if(!reroll)return;
      draw.click();
    });
    sync();
  }

  setupRandomizerPolish();
})();
