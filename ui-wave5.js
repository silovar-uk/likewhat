(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const slug=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const lines=(n=3)=>Array.from({length:n},(_,i)=>`<i class="w5-line" style="--w:${58+((i*17)%34)}%"></i>`).join('');
  const chips=(items)=>`<div class="w5-chips">${items.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;
  const shell=(pattern,size,kind,inner)=>`<div class="mini-ui mini-ui--${size} wave5-ui w5-${kind} theme-${slug(pattern.brand)}" data-brand="${esc(pattern.brand)}">${inner}</div>`;

  function play(pattern,size){
    const mode=pattern.mock;
    if(mode==='play-age-browse')return shell(pattern,size,'play',`<header><b>FIND YOUR FUN</b><span>⌕</span></header><main><small>SHOP BY AGE</small><div class="w5-age-grid">${['0–2','3–4','5–7','8–10','11+','13+'].map(x=>`<i>${x}</i>`).join('')}</div>${chips(['GIFTS','OUTDOOR','BUILD','GAMES'])}</main>`);
    if(mode==='play-mascot')return shell(pattern,size,'play',`<header><b>HELLO!</b><span>★</span></header><main class="w5-mascot"><i class="head">●</i><i class="neck"></i><div><small>WHERE TO?</small><b>LET’S FIND<br>YOUR NEXT PLAY</b><span>SHOP →</span></div></main>`);
    return shell(pattern,size,'play',`<header><b>PLAY!</b><span>NEW　GIFTS　BRANDS</span></header><main><section class="w5-play-hero"><small>SUMMER FUN</small><strong>GO<br>OUTSIDE</strong><i></i></section><div class="w5-play-tiles"><b>BUILD</b><b>CREATE</b><b>IMAGINE</b></div></main>`);
  }

  function quiet(pattern,size){
    if(pattern.mock==='quiet-finder')return shell(pattern,size,'quiet',`<header><b>店舗を探す</b><span>MUJI</span></header><main class="w5-finder"><label>店名、住所</label><div class="search">検索 <b>⌕</b></div>${['近隣店舗から','都道府県から','サービスから','取扱商品から'].map((x,i)=>`<p><small>0${i+1}</small>${x}<span>→</span></p>`).join('')}</main>`);
    if(pattern.mock==='quiet-context')return shell(pattern,size,'quiet',`<header><b>暮らしから選ぶ</b><span>無印良品</span></header><main><section class="w5-quiet-photo"></section><small>SMALL DAILY SYSTEMS</small><h3>整える。しまう。休む。</h3>${chips(['収納','食卓','眠る','働く'])}</main>`);
    return shell(pattern,size,'quiet',`<header><b>無印良品</b><span>衣服　生活雑貨　食品</span></header><main class="w5-quiet-grid">${Array.from({length:4},(_,i)=>`<article><i></i><b>${['暮らしの基本','収納','食卓','衣服'][i]}</b><small>simple / useful</small></article>`).join('')}</main>`);
  }

  function artist(pattern,size){
    if(pattern.mock==='artist-archive')return shell(pattern,size,'artist',`<header><b>CHANMINA</b><span>DISCOGRAPHY</span></header><main class="w5-albums">${['01','02','03','04'].map((x,i)=>`<article><i></i><small>${x}</small><b>${['TEST ME','AREA','DIAMOND','LOVE'][i]}</b></article>`).join('')}</main>`);
    if(pattern.mock==='artist-fandom')return shell(pattern,size,'artist',`<header><b>ROYAL FAMILY</b><span>MEMBERS ONLY</span></header><main class="w5-fandom"><small>JOIN THE WORLD</small><strong>YOU’RE<br>INSIDE.</strong><div><span>01 EVENT</span><span>02 DROP</span><span>03 PLAY</span></div><b>ENTER →</b></main>`);
    return shell(pattern,size,'artist',`<header><b>CHANMINA</b><span>NEWS　LIVE　VIDEO</span></header><main class="w5-artist-hero"><small>NEW ERA</small><strong>NO<br>PERMISSION</strong><i></i><span>PLAY →</span></main>`);
  }

  function luxury(pattern,size){
    if(pattern.mock==='luxury-ritual')return shell(pattern,size,'luxury',`<header><b>TIFFANY & CO.</b><span>CLIENT CARE</span></header><main class="w5-ritual"><small>THE TIFFANY EXPERIENCE</small><h3>Begin your visit.</h3><p>Private appointment · In store / Virtual</p><button>BOOK AN APPOINTMENT</button></main>`);
    if(pattern.mock==='luxury-collection')return shell(pattern,size,'luxury',`<header><b>TIFFANY & CO.</b></header><main class="w5-luxury-collections">${['T','LOCK','KNOT'].map(x=>`<article><i></i><small>${x}</small><b>An expression of love</b></article>`).join('')}</main>`);
    return shell(pattern,size,'luxury',`<header><b>TIFFANY & CO.</b><span>1837</span></header><main class="w5-luxury-hero"><small>AN ICON</small><h3>One color.<br>One memory.</h3><i></i><span>DISCOVER →</span></main>`);
  }

  function franchise(pattern,size){
    if(pattern.mock==='franchise-timeline')return shell(pattern,size,'franchise',`<header><b>MARVEL</b><span>MOVIES</span></header><main class="w5-timeline">${[['JUL 2026','SPIDER-MAN'],['DEC 2026','AVENGERS'],['2027','SECRET WARS']].map(x=>`<article><small>${x[0]}</small><b>${x[1]}</b><i></i></article>`).join('')}</main>`);
    if(pattern.mock==='franchise-character')return shell(pattern,size,'franchise',`<header><b>MARVEL</b><span>CHARACTERS</span></header><main class="w5-character"><i></i><div><small>HERO FILE</small><strong>CHARACTER</strong>${chips(['MOVIES','COMICS','GEAR'])}</div></main>`);
    return shell(pattern,size,'franchise',`<header><b>MARVEL</b><span>COMICS　MOVIES　TV</span></header><main class="w5-universe"><small>ENTER THE UNIVERSE</small><strong>EVERY STORY<br>CONNECTS.</strong><div><b>MOVIES</b><b>COMICS</b><b>HEROES</b></div></main>`);
  }

  function adjacent(pattern,size){
    const b=pattern.brand;
    if(b==='LEGO')return shell(pattern,size,'lego',`<header><b>LEGO</b><span>BUILD YOUR WAY</span></header><main class="w5-bricks"><i></i><i></i><i></i><i></i><strong>THEME<br>AGE<br>INTEREST</strong></main>`);
    if(b==='Sanrio')return shell(pattern,size,'sanrio',`<header><b>WHO’S YOUR FAVORITE?</b></header><main class="w5-faces">${['◉','●','◉','●','◉'].map((x,i)=>`<i class="f${i}">${x}</i>`).join('')}<strong>JUST FOR YOU</strong></main>`);
    if(b==='IKEA')return shell(pattern,size,'ikea',`<header><b>IKEA</b><span>暮らしのアイデア</span></header><main><section class="w5-room"><i></i><i></i><i></i></section><div><b>小さな部屋を、もっと自由に。</b><small>IDEAS · PRODUCTS · SERVICE</small></div></main>`);
    if(b==='Aesop')return shell(pattern,size,'aesop',`<header><b>Aesop</b><span>Skin · Body · Home</span></header><main><i class="bottle"></i><article><small>AN OBSERVATION</small><h3>Considered care,<br>patiently chosen.</h3>${lines(3)}</article></main>`);
    if(b==='Cartier')return shell(pattern,size,'cartier',`<header><b>CARTIER</b></header><main><small>THE MAISON</small><strong>ICONS<br>ENDURE</strong><i class="ring"></i><span>DISCOVER →</span></main>`);
    if(b==='LOEWE')return shell(pattern,size,'loewe',`<header><b>LOEWE</b><span>CRAFT　STORIES</span></header><main><article class="w5-craft-a"></article><article class="w5-craft-b"><small>CRAFT, FORWARD</small><b>Material becomes story.</b></article></main>`);
    if(b==='Disney')return shell(pattern,size,'disney',`<header><b>Disney</b><span>MOVIES · PARKS · +</span></header><main class="w5-portals"><strong>ONE<br>MAGIC</strong><div><b>WATCH</b><b>VISIT</b><b>PLAY</b></div></main>`);
    if(b==='Billie Eilish')return shell(pattern,size,'billie',`<header><b>BILLIE EILISH</b><span>STORE</span></header><main><small>HIT ME HARD AND SOFT</small><strong>ERA<br>YOU CAN<br>WEAR.</strong><i></i></main>`);
    if(b==='DC')return shell(pattern,size,'dc',`<header><b>DC</b><span>COMICS　MOVIES　NEWS</span></header><main><small>NOW IN THE UNIVERSE</small><strong>NEW STORY.<br>DEEP ARCHIVE.</strong><div>${lines(4)}</div></main>`);
    return base(pattern,size);
  }

  function university(pattern,size){
    const mode=pattern.mock;
    const b=esc(pattern.brand);
    const motifs={
      'university-public':['PUBLIC RESEARCH','Knowledge, responsibility, society.'],
      'university-free':['FREE INQUIRY','Question first. Institution second.'],
      'university-urban':['LIVING UNIVERSITY','Research · Students · Culture · Sports'],
      'university-legacy':['ONE INSTITUTION','Applicants · Students · Alumni · Public'],
      'university-collegiate':['COLLEGIATE','Courses · Colleges · Departments'],
      'university-human':['PEOPLE & DISCOVERY','Study · Research · Student life'],
      'university-curated':['IN FOCUS','Ideas for the public world.'],
      'university-research':['TODAY’S SPOTLIGHT','Research becomes the front page.'],
      'university-future':['ADVANCING THE FRONTIER','Research · Education · Impact']
    };
    const [kicker,copy]=motifs[mode]||['UNIVERSITY','Research · Education · Community'];
    return shell(pattern,size,'university',`<header><b>${b}</b><span>SEARCH　MENU</span></header><main><small>${kicker}</small><h3>${copy}</h3><section class="w5-campus-image"></section><div class="w5-university-nav"><span>RESEARCH</span><span>STUDY</span><span>COMMUNITY</span></div></main>`);
  }

  function scene(pattern,size){
    const m=pattern.mock;
    if(m==='scene-loading-skeleton')return shell(pattern,size,'scene',`<header><b>LOADING</b><span>STRUCTURE FIRST</span></header><main class="w5-skeleton"><i></i><div>${lines(4)}</div><section>${Array.from({length:3},()=>'<article><i></i><b></b><b></b></article>').join('')}</section></main>`);
    if(m==='scene-loading-progress')return shell(pattern,size,'scene',`<header><b>LOADING</b><span>VISIBLE PROGRESS</span></header><main class="w5-progress"><strong>68%</strong><div><i></i></div><small>PREPARING YOUR VIEW…</small></main>`);
    if(m==='scene-loading-inline')return shell(pattern,size,'scene',`<header><b>PAGE STAYS ACTIVE</b></header><main class="w5-inline-load">${['Repository','Status checks','Review'].map((x,i)=>`<p><b>${x}</b><span>${i===1?'◌':'READY'}</span></p>`).join('')}</main>`);
    if(m==='scene-loading-branded')return shell(pattern,size,'scene',`<main class="w5-brand-load"><i></i><i></i><i></i><strong>MAKING<br>SOMETHING…</strong><small>please keep this tab open</small></main>`);
    if(m==='scene-404-utility')return shell(pattern,size,'scene',`<main class="w5-404 utility"><small>404</small><h3>Page not found</h3><p>Check the address, or return to the service.</p><b>Back to home →</b></main>`);
    if(m==='scene-404-illustrated')return shell(pattern,size,'scene',`<main class="w5-404 illustrated"><i>?</i><small>404</small><h3>Nothing here.</h3><p>Let’s get you back.</p><b>Go home →</b></main>`);
    if(m==='scene-404-explore')return shell(pattern,size,'scene',`<main class="w5-404 explore"><small>LOST?</small><h3>Wrong turn.<br>Good discovery.</h3><div><b>POPULAR</b><b>SEARCH</b><b>RANDOM →</b></div></main>`);
    if(m==='scene-empty-guided')return shell(pattern,size,'scene',`<main class="w5-empty"><i>＋</i><h3>Nothing here yet</h3><p>Create your first item to get started.</p><b>CREATE ITEM</b></main>`);
    if(m==='scene-empty-celebrate')return shell(pattern,size,'scene',`<main class="w5-empty celebrate"><i>✓</i><h3>All clear!</h3><p>You’re done here.</p><small>Nice work.</small></main>`);
    if(m==='scene-error-recovery')return shell(pattern,size,'scene',`<main class="w5-error"><small>COULDN’T SAVE</small><h3>Your file didn’t sync.</h3><p>Connection was interrupted.</p><b>TRY AGAIN →</b></main>`);
    if(m==='scene-success-confirm')return shell(pattern,size,'scene',`<main class="w5-success"><section><i>✓</i><div><b>Saved</b><small>Your changes are live.</small></div><span>×</span></section><div>${lines(5)}</div></main>`);
    if(m==='scene-onboarding-first')return shell(pattern,size,'scene',`<main class="w5-onboarding"><small>FIRST TIME HERE?</small><i>01</i><h3>Start where the work will live.</h3><p>No tour. One useful first action.</p><b>CREATE FIRST PROJECT →</b></main>`);
    return base(pattern,size);
  }

  function render(pattern,size='card'){
    const m=pattern.mock||'';
    if(m.startsWith('play-'))return play(pattern,size);
    if(m.startsWith('quiet-'))return quiet(pattern,size);
    if(m.startsWith('artist-'))return artist(pattern,size);
    if(m.startsWith('luxury-'))return luxury(pattern,size);
    if(m.startsWith('franchise-'))return franchise(pattern,size);
    if(['lego-modular','sanrio-character','ikea-room','aesop-literary','cartier-maison','loewe-craft','disney-portal','billie-era','dc-serial'].includes(m))return adjacent(pattern,size);
    if(m.startsWith('university-'))return university(pattern,size);
    if(m.startsWith('scene-'))return scene(pattern,size);
    return base(pattern,size);
  }
  window.LikeWhatUI={...window.LikeWhatUI,render,esc};
})();
