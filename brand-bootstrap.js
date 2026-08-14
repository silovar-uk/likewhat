(function(){
  const root=document.getElementById('brandPage');
  const brand=new URLSearchParams(location.search).get('brand')||'';
  const started=performance.now();
  function script(src,attrs={}){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));el.onload=()=>resolve(el);el.onerror=()=>reject(new Error(`Failed to load ${src}`));document.body.appendChild(el);});}
  async function json(url){const response=await fetch(url,{cache:'default'});if(!response.ok)throw new Error(`${response.status} ${url}`);return response.json();}
  function notFound(){document.title='Collection not found — Like What?';root.innerHTML='<section class="brand-not-found"><h1>Collection not found.</h1><p>指定されたBrand / Artist / Institutionは現在のLibraryにありません。</p><a href="./#patterns">Libraryへ戻る</a></section>';}
  async function boot(){
    if(!brand){notFound();return;}
    root.innerHTML='<section class="brand-not-found"><p class="eyebrow">COLLECTION VIEW</p><h1>Loading this collection…</h1><p>この入口に属するPatternだけを取得しています。</p></section>';
    const [catalog,index]=await Promise.all([json('generated/catalog-core.json'),json('generated/brands/index.json')]);
    const entry=index.brands.find(item=>item.brand===brand);if(!entry){notFound();return;}
    const manifest=await json(`generated/brands/${encodeURIComponent(entry.file)}`);
    const details=await Promise.all(manifest.detailFiles.map(file=>json(`generated/patterns/${encodeURIComponent(file)}`)));
    window.LIKEWHAT_PATTERNS=details;window.LIKEWHAT_BRAND_DATA={catalog,manifest,details};
    await script('taxonomy.js');await script('design-space.js');await script('entry-kinds.js');await script('vocabulary.js');await script('ui.js');
    for(const src of ['ui-extra.js','ui-wave1.js','ui-wave2.js','ui-wave3.js','ui-wave4.js','ui-wave5.js','ui-eyewear.js'])await script(src);
    await script('ui-idols.js',{'data-load-expansion':'false'});await script('ui-idols2.js');await script('ui-preview-contract.js');await script('brand.js');await script('brand-idol.js');
    window.LikeWhatBrandLoadMetrics={brand,type:manifest.type,referenceCount:catalog.referenceCount,fullDetailRecords:details.length,skippedFullDetailRecords:Math.max(0,catalog.referenceCount-details.length),durationMs:Math.round(performance.now()-started),runtimeCatalog:'generated/catalog-core.json'};
    window.dispatchEvent(new CustomEvent('likewhat:brand-ready',{detail:window.LikeWhatBrandLoadMetrics}));
  }
  boot().catch(error=>{console.error('[Like What?] collection bootstrap failed',error);root.innerHTML='<section class="brand-not-found"><h1>Collection could not load.</h1><p>データの読み込みに失敗しました。</p><a href="./#patterns">Libraryへ戻る</a></section>';});
})();
