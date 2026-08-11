(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} idol2-ui`;
    let inner='';
    switch(pattern.mock){
      case 'idol-ive-have':inner=`<div class="id2-ive"><header><b>I HAVE</b><span>IVE / SELF-POSSESSION</span></header><main><section><div class="ive-subject"><i></i><b></b></div><small>SHOW WHAT YOU HAVE</small></section><aside><p>NOT BECOMING.</p><h3>ALREADY<br>HERE.</h3><div class="ive-rule"></div><span>01 / POISE</span><span>02 / PRESENCE</span><span>03 / CLAIM</span></aside></main></div>`;break;
      case 'idol-perfume-tech':inner=`<div class="id2-perfume"><header><b>PERFUME × TECHNOLOGY</b><span>SYNC / 120 BPM</span></header><main><div class="perf-stage"><div class="perf-person p1"></div><div class="perf-person p2"></div><div class="perf-person p3"></div><div class="perf-grid"></div><i class="beam b1"></i><i class="beam b2"></i><i class="beam b3"></i></div><aside><small>LIVE SYSTEM</small><strong>MOTION</strong><span>→ LIGHT</span><strong>TIME</strong><span>→ SPACE</span><strong>DATA</strong><span>→ CHOREO</span></aside></main></div>`;break;
      case 'idol-babymonster-id':inner=`<div class="id2-bm"><header><b>MONSTIEZ ID</b><span>ONE ID / MANY SERVICES</span></header><main><section><div class="id-core"><strong>M</strong><small>SHARED ID</small></div><div class="service-ring"><span>SHOP</span><span>FC</span><span>TICKET</span><span>MOBILE</span></div></section><aside><small>MEMBERSHIP</small><div class="member-tier active"><b>JP</b><span>Annual</span></div><div class="member-tier"><b>MOBILE</b><span>Monthly</span></div><div class="member-tier double"><b>W</b><span>Combined</span></div></aside></main></div>`;break;
      case 'idol-cutie-maker':inner=`<div class="id2-cutie"><header><b>KAWAII MAKER</b><span>WHO COULD YOU BE?</span></header><main><section class="cutie-parts"><div class="cutie-avatar"><i></i><b></b></div><div class="maker-palette"><span>A</span><span>B</span><span>C</span><span>D</span></div><small>MAKE / REMAKE / KEEP OPEN</small></section><aside><div class="maker-choice"><small>STYLE</small><b>SOFT</b></div><div class="maker-choice on"><small>MOOD</small><b>BRIGHT</b></div><div class="maker-choice"><small>COLOR</small><b>MINT</b></div><em>another me →</em></aside></main></div>`;break;
      case 'idol-kawaii-lab':inner=`<div class="id2-klab"><header><b>KAWAII LAB.</b><span>FROM HARAJUKU TO THE WORLD</span></header><main><section><div class="umbrella"><strong>K</strong><span>shared values</span></div><div class="portfolio-lines"><i></i><i></i><i></i></div><div class="child-brands"><article><b>FZ</b><span>NEW KAWAII</span></article><article><b>CT</b><span>OWN COLOR</span></article><article><b>CS</b><span>KAWAII MAKER</span></article></div></section><aside><small>PARENT LAYER</small><p>VALUES</p><p>DEVELOPMENT</p><p>EVENTS</p><hr><small>CHILD LAYER</small><b>DIFFERENCE</b></aside></main></div>`;break;
      default:return base(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={...window.LikeWhatUI,render,esc};

  function syncVisibleCounts(){
    const count=(window.LIKEWHAT_PATTERNS||[]).length;
    document.querySelectorAll('.explore-tool-copy span').forEach(node=>{if(/\d+\s+references/i.test(node.textContent))node.textContent=node.textContent.replace(/\d+\s+references/i,`${count} references`);});
    document.querySelectorAll('.map-hero p').forEach(node=>{if(/\d+の参照/.test(node.textContent))node.textContent=node.textContent.replace(/\d+の参照/,`${count}の参照`);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncVisibleCounts,{once:true});else syncVisibleCounts();
})();
