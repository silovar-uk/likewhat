(function(){
  if(!window.LikeWhatUI)return;
  const base=window.LikeWhatUI.render;
  const esc=window.LikeWhatUI.esc;
  function render(pattern,size='card'){
    const cls=`mini-ui mini-ui--${size} eyewear-ui`;
    let inner='';
    switch(pattern.mock){
      case 'eyewear-omnichannel':inner=`<div class="ew-omni"><header><b>FRAME</b><span>1. Frame　2. Prescription　3. Lens　4. Store</span></header><main><aside><small>FIND YOUR FRAME</small><strong>Shape / Size / Use</strong><div class="ew-filter"><i></i><i></i><i></i><i></i></div></aside><section><div class="ew-glasses"><i></i><b></b><i></i></div><div class="ew-steps"><span class="on">Frame ✓</span><span>Prescription</span><span>Lens</span></div><footer><b>Continue online</b><em>or visit store →</em></footer></section></main></div>`;break;
      case 'eyewear-identity':inner=`<div class="ew-identity"><header><b>ICON / COLLECTION</b><span>Customize　Editorial　New Collection</span></header><main><section class="portrait"><div class="face"><i></i><div class="glasses"><b></b><b></b><span></span></div></div><small>WHO DO YOU WANT TO BE?</small></section><aside><small>MODEL 01</small><h3>Your frame,<br>your identity.</h3><div class="chips"><i></i><i></i><i></i><i></i></div><b>EXPLORE COLLECTION →</b></aside></main></div>`;break;
      case 'eyewear-craft':inner=`<div class="ew-craft"><header><b>WHY THIS FORM?</b><span>Function　Factory　Craft</span></header><main><section class="product"><div class="technical-glasses"><i></i><b></b><i></i><span></span></div><small>FUNCTION → FORM</small></section><aside><article><small>01 / FUNCTION</small><strong>Fit · strength · adjustment</strong></article><article><small>02 / PROCESS</small><strong>Cut · polish · assemble</strong></article><article><small>03 / MAKER</small><strong>Craft provenance</strong></article></aside></main></div>`;break;
      case 'eyewear-consultation':inner=`<div class="ew-consult"><header><b>FIND THE RIGHT EXPERT</b><span>Store　Skill　Aftercare</span></header><main><section><div class="expert"><i></i><div><small>QUALIFIED OPTICIAN</small><strong>Talk before you decide.</strong><p>Purpose → measurement → fitting → care</p></div></div><div class="consult-flow"><span>Need</span><i>→</i><span>Expert</span><i>→</i><span>Fit</span><i>→</i><span>Care</span></div></section><aside><small>NEARBY</small><strong>3 stores</strong><div class="map-mini"><i></i><i></i><b>●</b></div><em>Find consultation →</em></aside></main></div>`;break;
      default:return base(pattern,size);
    }
    return `<div class="${cls}" data-brand="${esc(pattern.brand)}">${inner}</div>`;
  }
  window.LikeWhatUI={...window.LikeWhatUI,render,esc};
})();
