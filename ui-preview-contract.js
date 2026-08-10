(function(){
  const ui=window.LikeWhatUI;
  if(!ui||typeof ui.render!=='function')return;
  const base=ui.render;
  const onPatternDetail=()=>Boolean(document.querySelector('.detail-page'));
  function render(pattern,size='card'){
    const safeSize=(size==='detail'&&!onPatternDetail())?'card':size;
    return base(pattern,safeSize);
  }
  window.LikeWhatUI={...ui,render};
})();
