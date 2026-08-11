(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const lines=(n=3)=>Array.from({length:n},(_,i)=>`<i class="idol-line" style="--w:${58+((i*19)%35)}%"></i>`).join('');

  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} idol-ui idol-${String(pattern.brand).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    let inner='';
    switch(pattern.mock){
      case 'idol-illit-super-real':inner=`<div class="id-illit-real"><header><b>SUPER REAL ME</b><span>REAL / SUPER</span></header><main><section class="real-photo"><div class="figure"><i></i><b></b></div><em class="spark s1">✦</em><em class="spark s2">♡</em><small>ordinary day / strange little dream</small></section><aside><span class="sticker a">today</span><span class="sticker b">real me?</span><span class="sticker c">★ lucky</span><div class="note"><b>MY WORLD</b>${lines(3)}</div><i class="tape"></i></aside></main></div>`;break;
      case 'idol-illit-not-cute':inner=`<div class="id-illit-refusal"><header><span>ILLIT</span><b>NOT CUTE ANYMORE</b></header><main><section><div class="cutout c1">CUTE</div><div class="cutout c2">NOT</div><div class="cutout c3">MY NAME</div><div class="cutout c4">♥</div><i class="slash"></i></section><aside><small>IDENTITY UPDATE</small><h3>I can keep<br>what I was<br>and still change.</h3><div>${lines(3)}</div></aside></main></div>`;break;
      case 'idol-illit-mami':inner=`<div class="id-illit-mami"><header><b>GRWM</b><span>IT'S ME　/　FREE RIDER</span></header><main><section class="mirror"><div class="mirror-face"><i></i><b></b></div><span>try another self →</span></section><aside><div class="choice"><small>LOOK 01</small><b>soft</b></div><div class="choice active"><small>LOOK 02</small><b>me?</b></div><div class="choice"><small>LOOK 03</small><b>free</b></div><footer><span>not final</span><em>keep editing</em></footer></aside></main></div>`;break;
      case 'idol-aespa-synk':inner=`<div class="id-aespa"><header><b>æ / SYNK</b><span>KWANGYA SYSTEM ONLINE</span></header><main><section class="synk-stage"><div class="avatar human"><span>ME</span></div><i class="synk-line"></i><div class="avatar ae"><span>æ</span></div><div class="portal"></div><small>connection: stable</small></section><aside><small>LORE NODE</small><h3>Avatar X<br>Experience</h3><div class="lore-list"><span>01　SYNK</span><span>02　ASPECT</span><span>03　WORLD</span></div><b>ENTER SYSTEM →</b></aside></main></div>`;break;
      case 'idol-xg-awe':inner=`<div class="id-xg"><header><span>XG / AWE</span><b>UNKNOWN ENTITY</b></header><main><section class="alien-stage"><div class="alien-shape"><i></i><b></b><span></span></div><em>AWE</em><small>fear　×　curiosity</small></section><aside><h3>DON'T<br>EXPLAIN<br>TOO FAST.</h3><p>leave enough friction<br>to make them look again</p><div class="signal">••• SIGNAL FOUND •••</div></aside></main></div>`;break;
      case 'idol-fruits-new-kawaii':inner=`<div class="id-fruits"><header><b>NEW KAWAII</b><span>HARAJUKU → WORLD</span></header><main><section class="member-grid">${['A','S','Y','L','M','K','N'].map((x,i)=>`<div class="member m${i}"><b>${x}</b><span>MEMBER ${i+1}</span></div>`).join('')}</section><aside><small>ONE SYSTEM</small><h3>Different<br>is the rule.</h3><div class="color-key">${Array.from({length:7},(_,i)=>`<i class="m${i}"></i>`).join('')}</div><p>color = identity<br>layout = unity</p></aside></main></div>`;break;
      case 'idol-lesserafim-fearless':inner=`<div class="id-lesserafim"><header><span>LE SSERAFIM</span><b>IM FEARLESS</b></header><main><section class="fearless-figure"><div class="body"><i></i><b></b><span></span></div><small>MOVE FORWARD</small></section><aside><h3>NO<br>EXCUSE.</h3><p>presence first.<br>explanation second.</p><i class="rule"></i><b>CONFIDENCE / 01</b></aside></main></div>`;break;
      case 'idol-mei-relationship':inner=`<div class="id-mei"><header><b>ME:I</b><span>FOR YOU / EVERY DAY</span></header><main><aside class="member-nav"><small>MEMBERS</small>${['MIU','MOMONA','AYANE','KEIKO','RINON','SUZU','TSUZUMI'].map((x,i)=>`<span class="${i===1?'on':''}">${x}</span>`).join('')}</aside><section><div class="content-tabs"><b>BLOG</b><span>MOVIE</span><span>PHOTO</span><span>Q&A</span><span>RADIO</span></div><article><small>TODAY / MOMONA</small><h3>A small update,<br>not a big announcement.</h3>${lines(3)}</article><footer><span>ticket</span><span>message</span><span>member card</span></footer></section></main></div>`;break;
      default:return base(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={...window.LikeWhatUI,render,esc};
})();

(function loadIdolExpansion2(){
  const css=document.createElement('link');
  css.rel='stylesheet';css.href='styles-idols2.css';document.head.appendChild(css);
  if(document.readyState==='loading'){
    document.write('<script src="patterns-idols2.js"><\\/script><script src="ui-idols2.js"><\\/script>');
  }
})();
