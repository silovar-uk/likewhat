(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const line=(w=70,strong=false)=>`<span class="mock-line ${strong?'strong':''}" style="--w:${w}%"></span>`;
  const rows=(n=4)=>Array.from({length:n},(_,i)=>`<div class="w2-row"><i></i><span>${line(50+(i*11)%34,i===0)}</span><small>${i+1}</small></div>`).join('');
  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} wave2-ui theme-${String(pattern.brand).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    let inner='';
    switch(pattern.mock){
      case 'nhs-service':inner=`<div class="nhs-mock"><header>NHS</header><main><a>← Back</a><h3>Tell us about your needs</h3><p>Choose the answer that best describes you.</p><label><i></i> First option</label><label><i></i> Another option</label><aside>Why we ask this</aside><button>Continue</button></main></div>`;break;
      case 'systematic-retail':inner=`<div class="yodo-mock"><header><b>YODOBASHI</b><div>⌕ 商品を検索</div></header><nav>家電　PC　カメラ　ゲーム　日用品</nav><main>${Array.from({length:6},(_,i)=>`<article><div class="prod p${i%3}"></div><section><b>PRODUCT ${i+1}</b><span>在庫あり · 明日お届け</span><strong>¥${(2480+i*1370).toLocaleString()}</strong><small>${10+i}% POINT</small></section></article>`).join('')}</main></div>`;break;
      case 'ip-commerce':inner=`<div class="poke-mock"><header>Pokémon Center</header><div class="poke-feature"><b>NEW COLLECTION</b><span>お気に入りのポケモンから探そう</span></div><div class="poke-grid">${Array.from({length:6},(_,i)=>`<i class="pk${i%4}"><b>●</b><small>ITEM</small></i>`).join('')}</div></div>`;break;
      case 'consultative-commerce':inner=`<div class="aesop-mock"><header>Aesop <span>SKIN · BODY · FRAGRANCE</span></header><main><div class="aesop-copy"><small>SKIN CARE</small><h3>Understand your skin</h3><p>Needs change with environment and routine.</p><a>START CONSULTATION →</a></div><div class="aesop-products">${Array.from({length:3},(_,i)=>`<i class="bottle b${i}"></i>`).join('')}</div></main></div>`;break;
      case 'ink-hud':inner=`<div class="splat-mock"><div class="ink left"></div><div class="ink right"></div><header><span>3:00</span><b>● ● ● ●</b><b>● ● ● ●</b></header><div class="reticle">＋</div><div class="ink-gauge"><i></i></div><footer>SPECIAL READY!</footer></div>`;break;
      case 'mission-control':inner=`<div class="mission-mock"><div class="spaces"><i>Desktop 1</i><i>Desktop 2</i><i>+</i></div><div class="windows"><section class="w1">${rows(3)}</section><section class="w2">${line(70,true)}${line(48)}</section><section class="w3">${rows(4)}</section></div></div>`;break;
      case 'clean-map':inner=`<div class="applemap-mock"><div class="clean-road r1"></div><div class="clean-road r2"></div><div class="clean-route"></div><div class="clean-pin">●</div><div class="clean-search">⌕ Search Maps</div><div class="clean-card"><b>18 min</b><span>Fastest Route</span><small>2.4 km</small></div></div>`;break;
      case 'modular-monitoring':inner=`<div class="grafana-mock"><header>Overview <span>Last 6 hours ▾</span></header><div class="grafana-grid">${Array.from({length:6},(_,i)=>`<section><small>${['REQUESTS','LATENCY','ERRORS','CPU','MEMORY','QUEUE'][i]}</small><b>${[842,127,3.1,68,74,19][i]}${i===2?'%':''}</b><i class="chart c${i}"></i></section>`).join('')}</div></div>`;break;
      case 'magazine-editorial':inner=`<div class="brutus-mock"><header>BRUTUS <span>No.1058</span></header><div class="brutus-cover"><small>FEATURE</small><b>珍奇鉱物</b><p>THE WORLD OF STRANGE MINERALS</p></div><div class="brutus-links"><b>CONTENTS</b><span>01 Story</span><span>02 Guide</span><span>03 People</span></div></div>`;break;
      case 'developer-docs':inner=`<div class="mdn-mock"><aside><b>Learn</b><a>Getting started</a><a>Core modules</a><a>Extensions</a></aside><main><small>LEARN WEB DEVELOPMENT</small><h3>How the web works</h3><div class="outcomes"><b>Learning outcomes</b>${line(88)}${line(72)}</div>${line(96)}${line(84)}${line(91)}<footer>Previous　·　Next →</footer></main></div>`;break;
      case 'service-locator':inner=`<div class="muji-mock"><header>無印良品 <span>店舗</span></header><main><h3>店舗を探す</h3><div class="muji-search">店名、住所</div><button>近隣店舗を探す</button><div class="muji-options"><i>都道府県から</i><i>サービスから</i></div></main></div>`;break;
      case 'preorder-flow':inner=`<div class="eplus-mock"><header>e+ <span>チケットを申込む</span></header><div class="eplus-methods"><i class="active">抽選<br><b>プレオーダー</b></i><i>先着<br><b>一般発売</b></i></div><div class="eplus-event"><small>受付中</small><b>公演日時・席種を確認</b><span>申込期間 8/10–8/16</span><button>申込む</button></div><div class="eplus-steps">検索 → 受付 → 確認 → 申込 → 結果</div></div>`;break;
      default:return base(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={render,esc};
})();