(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const line=(w=70,strong=false)=>`<span class="mock-line ${strong?'strong':''}" style="--w:${w}%"></span>`;
  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} wave1-ui theme-${String(pattern.brand).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    let inner='';
    switch(pattern.mock){
      case 'govuk-service': inner=`<div class="govuk-mock"><div class="govuk-head">GOV.UK</div><main><a>← Back</a><h3>Apply for a service</h3><p>Which option applies to you?</p><label><i></i> Option one</label><label><i></i> Option two</label><button>Continue</button></main></div>`;break;
      case 'maximalist-retail': inner=`<div class="maxi-mock"><b class="maxi-a">激安!</b><b class="maxi-b">SALE</b><b class="maxi-c">驚安</b><span class="price">¥999</span><span class="burst">今だけ!</span><div class="maxi-grid">${Array.from({length:12},(_,i)=>`<i class="m${i%4}"></i>`).join('')}</div></div>`;break;
      case 'playful-toy': inner=`<div class="toy-mock"><div class="toy-logo">LEGO</div><div class="studs">${Array.from({length:12},(_,i)=>`<i class="s${i%5}"></i>`).join('')}</div><div class="toy-card"><strong>BUILD & PLAY</strong><span>8+ · 1,204 pcs</span><button>Explore</button></div></div>`;break;
      case 'luxury-editorial': inner=`<div class="lux-mock"><div class="lux-nav">CELINE <span>WOMEN · MEN · COLLECTIONS</span></div><div class="lux-image"></div><div class="lux-copy"><small>AUTOMNE 2026</small><b>THE COLLECTION</b><span>DISCOVER</span></div></div>`;break;
      case 'game-menu': inner=`<div class="p5-mock"><div class="p5-slash one"></div><div class="p5-slash two"></div><div class="p5-title">MENU</div><div class="p5-items"><b>ITEM</b><b>SKILL</b><b>EQUIP</b><b>PERSONA</b></div><div class="p5-selected">CONFIDANT</div></div>`;break;
      case 'retro-desktop': inner=`<div class="win95-mock"><div class="desktop-icons"><i>▣<span>My Computer</span></i><i>▤<span>Documents</span></i></div><div class="win-window"><header>Explorer <b>×</b></header><section>${line(78,true)}${line(58)}${line(68)}</section></div><footer><button>Start</button><span>12:45</span></footer></div>`;break;
      case 'map-spatial': inner=`<div class="map-mock"><div class="road r1"></div><div class="road r2"></div><div class="road r3"></div><i class="pin p1">●</i><i class="pin p2">●</i><div class="map-search">⌕ Search here</div><div class="route-card"><b>18 min</b><span>2.4 km · fastest</span></div></div>`;break;
      case 'terminal-density': inner=`<div class="terminal-mock"><header>IBM US Equity <span>LAST 233.41</span></header><div class="terminal-grid">${Array.from({length:30},(_,i)=>`<span class="${i%5===0?'hot':''}">${['PX_LAST','VOL','YLD','BID','ASK'][i%5]} ${((i+3)*7.13).toFixed(2)}</span>`).join('')}</div><footer>1) DES  2) GP  3) NEWS  4) FA</footer></div>`;break;
      case 'cultural-editorial': inner=`<div class="hobo-mock"><header>ほぼ日</header><div class="hobo-date">8月10日号</div><div class="hobo-columns"><section><b>今日のダーリン</b>${line(92)}${line(74)}${line(84)}</section><section><b>きょうのメニュー</b><a>読みもの</a><a>お買いもの</a><a>寄り道</a></section></div><div class="hobo-note">やさしく、つよく、おもしろく。</div></div>`;break;
      case 'hypertext-doc': inner=`<div class="wiki-mock"><aside><b>Contents</b><a>1 History</a><a>2 Design</a><a>3 References</a></aside><main><h3>Hypertext</h3><p><a>Hypertext</a> is text displayed on a computer display with references to other text.</p><h4>Structure</h4>${line(98)}${line(88)}${line(93)}<small>[1] Reference · [2] Citation</small></main></div>`;break;
      case 'physical-wayfinding': inner=`<div class="ikea-mock"><div class="floor-route"><i class="zone z1">SHOWROOM</i><i class="zone z2">MARKET</i><i class="zone z3">CHECKOUT</i><span class="arrow a1">→</span><span class="arrow a2">↓</span><span class="arrow a3">→</span></div><div class="ikea-sign">You are here ●</div></div>`;break;
      case 'lottery-flow': inner=`<div class="lottery-mock"><div class="lottery-head">抽選申込</div><div class="lottery-steps"><i class="done">1<span>申込</span></i><b></b><i class="done">2<span>確認</span></i><b></b><i>3<span>待機</span></i><b></b><i>4<span>結果</span></i></div><div class="wait-card"><strong>受付完了</strong><span>結果発表までお待ちください</span><small>8/14 18:00</small></div></div>`;break;
      default:return base(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={render,esc};
})();
