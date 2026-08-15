(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const slug=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const shell=(pattern,size,kind,inner)=>`<div class="mini-ui mini-ui--${size} wave6-ui w6-${kind} theme-${slug(pattern.brand)}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  const lines=(n=3)=>Array.from({length:n},(_,i)=>`<i class="w6-line" style="--w:${62+((i*13)%28)}%"></i>`).join('');
  const chips=items=>`<div class="w6-chips">${items.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;

  function hospitality(pattern,size){
    const m=pattern.mock;
    if(m==='hospitality-portfolio')return shell(pattern,size,'portfolio',`<header><b>STAY, YOUR WAY</b><span>星野リゾート</span></header><main><small>CHOOSE THE EXPERIENCE</small><div class="w6-brand-grid">${[['星のや','IMMERSION'],['界','LOCAL'],['RISONARE','PLAY'],['OMO','CITY'],['BEB','LOOSE'],['LUCY','MOUNTAIN']].map(x=>`<article><b>${x[0]}</b><span>${x[1]}</span></article>`).join('')}</div></main>`);
    if(m==='hospitality-place')return shell(pattern,size,'place',`<header><b>${esc(pattern.brand)}</b><span>DESTINATIONS</span></header><main><section class="w6-landscape"></section><small>PLACE / TIME / RITUAL</small><h3>${pattern.brand==='Aman'?'A sanctuary shaped by place.':'その瞬間の、特等席へ。'}</h3><span class="w6-arrow">DISCOVER →</span></main>`);
    if(m==='hospitality-local')return shell(pattern,size,'local',`<header><b>界 KAI</b><span>温泉旅館</span></header><main><small>COMMON GRAMMAR / LOCAL VARIATION</small><div class="w6-local-grid">${[['温泉','湯'],['ご当地楽','技'],['会席','食'],['ご当地部屋','室']].map(x=>`<article><i>${x[1]}</i><b>${x[0]}</b></article>`).join('')}</div><p>土地ごとの文化を、同じ型にのせる。</p></main>`);
    if(m==='hospitality-program')return shell(pattern,size,'program',`<header><b>RISONARE</b><span>PLAY HARD</span></header><main><section class="w6-program-hero"><small>THIS SEASON</small><strong>DO MORE<br>THAN STAY.</strong></section>${chips(['NATURE','EVENT','FOOD','ACTIVITY'])}</main>`);
    if(m==='hospitality-neighborhood')return shell(pattern,size,'neighborhood',`<header><b>OMO</b><span>GO-KINJO</span></header><main><div class="w6-map"><i></i><i></i><i></i><i></i><b>YOU</b></div><aside><small>THE CITY IS THE HOTEL</small><strong>歩く。食べる。<br>街を好きになる。</strong>${chips(['MAP','GUIDE','BASE'])}</aside></main>`);
    if(m==='hospitality-loose')return shell(pattern,size,'loose',`<header><b>BEB</b><span>LOOSE HOTEL</span></header><main><strong>だいたい、<br>でいい。</strong><div>${['24h LOUNGE','BRING YOUR OWN','LATE-ish CHECKOUT'].map(x=>`<p>✓ ${x}</p>`).join('')}</div><small>PERMISSION IS A FEATURE.</small></main>`);
    if(m==='hospitality-access')return shell(pattern,size,'access',`<header><b>LUCY</b><span>MOUNTAIN HOTEL</span></header><main><small>6 PROMISES</small><div class="w6-promises">${['BED','TOILET','SHOWER','MEAL','SHOP','Wi-Fi'].map((x,i)=>`<i><b>0${i+1}</b><span>${x}</span></i>`).join('')}</div><strong>山に行けそう、をつくる。</strong></main>`);
    if(m==='hospitality-commons')return shell(pattern,size,'commons',`<header><b>ACE HOTEL</b><span>LOCAL / GLOBAL</span></header><main><div class="w6-lobby"><i></i><i></i><i></i></div><aside><small>LOBBY TONIGHT</small><b>ART · FOOD · MUSIC · PEOPLE</b><p>Stay here. Meet here. Live here.</p></aside></main>`);
    if(m==='hospitality-wellness')return shell(pattern,size,'wellness',`<header><b>SIX SENSES</b><span>WELLNESS</span></header><main><div class="w6-orbit"><i></i><i></i><i></i><b>YOU</b></div><aside><small>PERSONAL JOURNEY</small><strong>BODY<br>MIND<br>PLACE</strong>${chips(['RITUAL','SCIENCE','NATURE'])}</aside></main>`);
    if(m==='hospitality-sustainable')return shell(pattern,size,'sustainable',`<header><b>1 HOTELS</b><span>NATURE IS OUR TRUE NORTH</span></header><main><section class="w6-leaf"></section><div><small>VALUES → OPERATIONS</small>${['BUILD','EAT','MOVE','GIVE'].map(x=>`<p><b>${x}</b><span>→</span></p>`).join('')}</div></main>`);
    if(m==='hospitality-loyalty')return shell(pattern,size,'loyalty',`<header><b>MARRIOTT BONVOY</b><span>MEMBER</span></header><main><section><small>STATUS</small><strong>GOLD ELITE</strong><div class="w6-progress"><i></i></div><span>18 / 25 NIGHTS</span></section><div class="w6-earn">${['STAY','DINE','SPA','EXPERIENCE'].map(x=>`<b>${x}<small>＋PTS</small></b>`).join('')}</div></main>`);
    if(m==='hospitality-ownership')return shell(pattern,size,'ownership',`<header><b>NOT A HOTEL</b><span>OWN / STAY</span></header><main><small>ONE MODEL, FOUR PROMISES</small><div class="w6-own-grid">${[['10','NIGHTS+'],['↔','NETWORK'],['◇','ASSET'],['0','MAINT.']].map(x=>`<article><b>${x[0]}</b><span>${x[1]}</span></article>`).join('')}</div><p>持つことと、泊まることをつなぐ。</p></main>`);
    if(m==='hospitality-cluster')return shell(pattern,size,'cluster',`<header><b>HOSPITALITY</b><span>STAY EXPERIENCE</span></header><main><small>WHAT IS THE HOTEL ACTUALLY DESIGNING?</small><div class="w6-cluster-axis">${['PLACE','LOCAL','CITY','SOCIAL','WELLNESS','LOYALTY','OWNERSHIP'].map((x,i)=>`<span style="--i:${i}">${x}</span>`).join('')}</div><strong>ROOM ≠ WHOLE EXPERIENCE</strong></main>`);
    return base(pattern,size);
  }

  function render(pattern,size='card'){
    if(String(pattern.mock||'').startsWith('hospitality-'))return hospitality(pattern,size);
    return base(pattern,size);
  }
  window.LikeWhatUI={...window.LikeWhatUI,render,esc};
})();