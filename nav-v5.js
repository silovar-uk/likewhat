(function(){
  document.querySelectorAll('.site-header nav a[href="./#patterns"],.site-header nav a[href="#patterns"]').forEach(link=>{
    if(/brands/i.test(link.textContent||''))link.textContent=(link.textContent||'').includes('←')?'← Library':'Library';
  });
})();
