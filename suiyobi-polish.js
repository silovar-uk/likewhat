(function(){
  const STYLE_ID='lw-suiyobi-polish';
  const SELECTOR='.tv-hypothesis-lab[data-brand="水曜日のダウンタウン"]';

  function injectStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      /* 水曜日のダウンタウン — retro showmanship outside, dry verification inside. */
      ${SELECTOR}{
        --wd-mint:#7be1cf;
        --wd-red:#d8394d;
        --wd-black:#11100f;
        --wd-cream:#fbf6e9;
        --wd-orange:#e97829;
        --wd-yellow:#f2df31;
        --tv-paper:var(--wd-cream);
        --tv-ink:var(--wd-black);
        --tv-hot:var(--wd-red);
        color:var(--wd-black)!important;
        background:
          radial-gradient(circle at 12% 16%,var(--wd-yellow) 0 3px,transparent 4px),
          radial-gradient(circle at 88% 83%,var(--wd-mint) 0 4px,transparent 5px),
          linear-gradient(135deg,#cc2f45 0 11%,#ef5563 11% 14%,#c52d42 14% 28%,#e94b59 28% 31%,#c42c40 31% 100%)!important;
        border:2px solid var(--wd-black)!important;
        box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)!important;
        font-family:ui-sans-serif,system-ui,-apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif!important;
      }
      ${SELECTOR} header{
        min-height:36px!important;
        padding:6px 8px!important;
        border-bottom:3px solid var(--wd-black)!important;
        background:var(--wd-cream)!important;
        color:var(--wd-black)!important;
        overflow:hidden;
      }
      ${SELECTOR} header b{
        display:inline-block;
        padding:3px 5px 2px!important;
        border:2px solid var(--wd-black)!important;
        background:var(--wd-mint)!important;
        color:var(--wd-black)!important;
        box-shadow:3px 0 0 var(--wd-red),6px 0 0 var(--wd-black);
        font-size:9px!important;
        font-weight:950!important;
        line-height:1!important;
        letter-spacing:-.075em!important;
      }
      ${SELECTOR} header span{
        color:var(--wd-black)!important;
        font-size:5px!important;
        font-weight:950!important;
        letter-spacing:.055em!important;
      }
      ${SELECTOR} main{
        position:relative;
        isolation:isolate;
        grid-template-rows:minmax(50px,1fr) auto auto!important;
        gap:5px!important;
        padding:9px 10px!important;
        overflow:hidden;
      }
      ${SELECTOR} main:before{
        content:'';
        position:absolute;
        z-index:-2;
        inset:0;
        background:
          repeating-conic-gradient(from -7deg at 50% 112%,rgba(255,255,255,.12) 0 8deg,transparent 8deg 17deg),
          linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.10));
      }
      ${SELECTOR} main:after{
        content:'';
        position:absolute;
        z-index:-1;
        left:6px;
        right:6px;
        top:5px;
        bottom:5px;
        border:1px solid rgba(251,246,233,.52);
        pointer-events:none;
      }
      ${SELECTOR} .tv-thesis{
        position:relative;
        display:grid!important;
        grid-template-columns:29px minmax(0,1fr);
        align-items:center;
        gap:5px;
        min-height:51px;
        padding:7px 8px 7px 6px!important;
        border:3px double var(--wd-black)!important;
        border-radius:2px!important;
        background:
          linear-gradient(90deg,transparent 0 7px,rgba(123,225,207,.34) 7px 8px,transparent 8px calc(100% - 8px),rgba(216,57,77,.28) calc(100% - 8px) calc(100% - 7px),transparent calc(100% - 7px)),
          var(--wd-cream)!important;
        color:var(--wd-black)!important;
        text-align:left!important;
        box-shadow:3px 3px 0 rgba(17,16,15,.82)!important;
      }
      ${SELECTOR} .tv-thesis:before,
      ${SELECTOR} .tv-thesis:after{
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        color:var(--wd-red);
        font:950 12px/1 Georgia,"Times New Roman",serif;
      }
      ${SELECTOR} .tv-thesis:before{content:'←';left:-8px;}
      ${SELECTOR} .tv-thesis:after{content:'→';right:-8px;}
      ${SELECTOR} .tv-thesis .wd-setsu{
        display:grid;
        width:27px;
        height:27px;
        place-items:center;
        border:2px solid var(--wd-black);
        background:var(--wd-mint);
        color:var(--wd-black);
        font-family:"Yu Mincho","Hiragino Mincho ProN",serif;
        font-size:16px;
        font-weight:950;
        line-height:1;
        box-shadow:2px 2px 0 var(--wd-red);
      }
      ${SELECTOR} .tv-thesis .wd-hypothesis{
        display:block;
        min-width:0;
        color:var(--wd-black);
        font-family:"Yu Mincho","Hiragino Mincho ProN",serif;
        font-size:10px;
        font-weight:950;
        line-height:1.2;
        letter-spacing:-.105em;
        text-shadow:0 1px 0 #fff;
      }
      ${SELECTOR} .tv-testflow{
        display:grid!important;
        grid-template-columns:1fr auto 1fr auto 1fr!important;
        align-items:center!important;
        gap:2px!important;
        padding:0 3px;
        color:var(--wd-cream)!important;
      }
      ${SELECTOR} .tv-testflow b{
        position:relative;
        padding:4px 3px 3px!important;
        border:1px solid var(--wd-black)!important;
        background:var(--wd-black)!important;
        color:var(--wd-cream)!important;
        font-size:6px!important;
        font-weight:900!important;
        letter-spacing:.03em!important;
        text-align:center!important;
        box-shadow:1px 1px 0 rgba(251,246,233,.35);
      }
      ${SELECTOR} .tv-testflow b:nth-of-type(2){background:var(--wd-mint)!important;color:var(--wd-black)!important;}
      ${SELECTOR} .tv-testflow b:nth-of-type(3){background:var(--wd-yellow)!important;color:var(--wd-black)!important;}
      ${SELECTOR} .tv-testflow span{color:var(--wd-cream)!important;font-size:7px!important;font-weight:950!important;}
      ${SELECTOR} .tv-verdict{
        position:relative;
        display:flex!important;
        align-items:center;
        justify-content:space-between;
        gap:5px;
        min-height:23px;
        padding:4px 7px!important;
        border:2px solid var(--wd-black)!important;
        background:
          repeating-conic-gradient(from -12deg at 0% 50%,rgba(255,255,255,.20) 0 6deg,transparent 6deg 13deg),
          var(--wd-orange)!important;
        color:var(--wd-black)!important;
        font-size:6px!important;
        font-weight:950!important;
        text-align:left!important;
        box-shadow:2px 2px 0 var(--wd-black);
      }
      ${SELECTOR} .tv-verdict .wd-result-label{
        padding:2px 4px;
        border:1px solid var(--wd-black);
        background:var(--wd-cream);
        font-family:"Yu Mincho","Hiragino Mincho ProN",serif;
        font-size:6px;
        letter-spacing:-.04em;
        white-space:nowrap;
      }
      ${SELECTOR} .tv-verdict .wd-result-copy{
        overflow:hidden;
        font-size:7px;
        line-height:1.05;
        letter-spacing:-.07em;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function polish(root=document){
    root.querySelectorAll?.(SELECTOR).forEach(card=>{
      if(card.dataset.wdPolished==='true')return;
      card.dataset.wdPolished='true';
      const headerMeta=card.querySelector('header span');
      if(headerMeta)headerMeta.textContent='WEDNESDAY / DOWNTOWN';
      const thesis=card.querySelector('.tv-thesis');
      if(thesis)thesis.innerHTML='<span class="wd-setsu">説</span><strong class="wd-hypothesis">これ、本当に成立する説。</strong>';
      const flow=card.querySelector('.tv-testflow');
      if(flow)flow.innerHTML='<b>仮説</b><span>→</span><b>検証</b><span>→</span><b>結果</b>';
      const verdict=card.querySelector('.tv-verdict');
      if(verdict)verdict.innerHTML='<span class="wd-result-label">検証結果</span><strong class="wd-result-copy">想定外も、証拠。</strong>';
    });
  }

  injectStyles();
  polish();
  const observer=new MutationObserver(records=>{
    if(records.some(record=>record.addedNodes.length))polish();
  });
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',()=>{
    polish();
    observer.observe(document.body,{childList:true,subtree:true});
  },{once:true});
})();
