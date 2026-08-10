(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  const lines=(n=3)=>Array.from({length:n},(_,i)=>`<i class="w4-line" style="--w:${56+((i*19)%36)}%"></i>`).join('');
  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} wave4-ui theme-${String(pattern.brand).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
    let inner='';
    switch(pattern.mock){
      case 'sports-living-home':inner=`<div class="w4-living"><header><b>TEAM</b><span>NEWS　VIDEO　PLAYERS　SHOP</span></header><section class="match-hero"><small>NEXT MATCH</small><h3>HOME <em>vs</em> AWAY</h3><p>Sat 19:00 · Stadium</p><div><b>MATCH INFO</b><span>TICKETS →</span></div></section><main><article class="feature"><i></i><b>Latest from the team</b></article><aside><small>LATEST</small>${lines(4)}</aside></main></div>`;break;
      case 'club-editorial':inner=`<div class="w4-editorial"><header><b>CLUB MEDIA</b><span>⌕</span></header><main><article class="lead"><small>INTERVIEW</small><b>Inside the week</b><i></i></article><section><article><small>VIDEO</small><b>Training</b></article><article><small>LIVE</small><b>Matchday</b></article><article><small>NEWS</small><b>Squad update</b></article><article><small>GALLERY</small><b>Behind scenes</b></article></section></main></div>`;break;
      case 'matchday-hub':inner=`<div class="w4-matchday"><header><b>MATCHDAY</b><span>HOME GAME</span></header><section class="game"><small>15 AUG</small><h3>HOME <em>vs</em> AWAY</h3><b>TICKETS →</b></section><main>${[['01','BUY'],['02','MANAGE'],['03','TRAVEL'],['04','MATCH INFO'],['05','HOSPITALITY']].map(x=>`<article><small>${x[0]}</small><b>${x[1]}</b><span>→</span></article>`).join('')}</main></div>`;break;
      case 'seasonal-home':inner=`<div class="w4-seasonal"><header><b>CLUB</b><span>FIXTURES　TEAMS　TICKETS</span></header><section><small>THIS WEEK</small><h3>SEASON START</h3><p>Tour · Opening match · Membership</p></section><main><article class="big"><b>LIVE BLOG</b><span>Follow the tour →</span></article><article><b>SHOP</b></article><article><b>SPURSPLAY</b></article><article><b>WOMEN</b></article></main></div>`;break;
      case 'event-state-home':inner=`<div class="w4-event"><header><b>LIVE EVENT</b><span>ROUND 14</span></header><section class="state"><small>NOW</small><h3>QUALIFYING</h3><strong>12:48</strong><p>Session in progress</p><b>FOLLOW LIVE →</b></section><footer><article><small>NEXT</small><b>RACE</b></article><article><small>RESULTS</small><b>Q1 · Q2 · Q3</b></article><article><small>STANDINGS</small><b>DRIVERS</b></article></footer></div>`;break;
      case 'match-navi':inner=`<div class="w4-navi"><header><b>MATCH NAVI</b><span>直近の開催試合</span></header><main><small>HOME</small><h3>TEAM A <em>vs</em> TEAM B</h3><p>8.15 SAT · 19:00</p><div><b>チケット購入</b><b>日程を見る</b></div></main><footer>${lines(3)}</footer></div>`;break;
      case 'ticket-action':inner=`<div class="w4-ticket"><header><b>HOME GAMES</b><span>TICKET</span></header><main>${Array.from({length:3},(_,i)=>`<article><small>${['AUG 15','AUG 29','SEP 19'][i]}</small><b>HOME vs ${['TEAM A','TEAM B','TEAM C'][i]}</b><p>Stadium · 19:00</p><div><span>EVENT</span><strong>TICKET →</strong></div></article>`).join('')}</main></div>`;break;
      case 'ticket-task-ia':inner=`<div class="w4-task"><header><b>TICKET INFO</b><span>観戦の準備</span></header><main>${[['販売日を見る','01'],['席と価格を見る','02'],['買い方を知る','03'],['チケットを管理','04'],['スタジアムへ行く','05'],['MAPを見る','06']].map(x=>`<article><small>${x[1]}</small><b>${x[0]}</b><span>→</span></article>`).join('')}</main></div>`;break;
      case 'stadium-app':inner=`<div class="w4-app"><header><b>MATCHDAY</b><span>● LIVE</span></header><main><section class="phone-map"><i class="road a"></i><i class="road b"></i><b>STADIUM</b><em>●</em></section><aside><article><small>MY TICKET</small><b>Gate B · 214</b></article><article><small>NEXT</small><b>Find my seat →</b></article><article><small>NEARBY</small><b>Food · Restroom · Shop</b></article></aside></main><footer><span>HOME</span><span>TICKET</span><span>MAP</span><span>TEAM</span></footer></div>`;break;
      default:return base(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={...window.LikeWhatUI,render,esc};
})();