(function(){
  const patterns=(window.LIKEWHAT_PATTERNS||[]).filter(p=>p.groupType!=='industry-cluster');
  const ui=window.LikeWhatUI;
  const ds=window.LikeWhatDesignSpace;
  const vocab=window.LikeWhatVocabulary;
  const root=document.getElementById('brandPage');
  const brand=new URLSearchParams(location.search).get('brand')||'';
  const items=patterns.filter(p=>p.brand===brand);
  const esc=ui?.esc||((v)=>String(v??''));
  if(!root)return;
  if(!items.length){root.innerHTML='<section class="brand-not-found"><h1>Brand not found.</h1><a href="./#patterns">一覧へ戻る</a></section>';return;}

  document.title=`${brand} — Like What?`;
  const axes=ds?.axes||[];
  const mean={},range={};
  axes.forEach(axis=>{
    const vals=items.map(p=>Number(p.designSpace?.[axis.key]??50));
    mean[axis.key]=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
    range[axis.key]={min:Math.min(...vals),max:Math.max(...vals)};
  });

  function scoreSource(url){
    try{const u=new URL(url,location.href),path=u.pathname.replace(/\/+$/,'');let score=path.split('/').filter(Boolean).length*20+path.length;if(/help|support|docs?|manual|guideline/i.test(`${u.hostname}${path}`))score+=24;return score;}catch{return 9999;}
  }
  const official=[...new Set(items.map(p=>p.sourceUrl).filter(Boolean))].sort((a,b)=>scoreSource(a)-scoreSource(b))[0]||'';
  const families=[...new Set(items.map(p=>p.family))];
  const domains=[...new Set(items.map(p=>p.domain).filter(Boolean))];

  function shortName(p){
    const escapedBrand=String(brand).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return String(p.name||'').replace(new RegExp(`^${escapedBrand}\\s*[—–-]\\s*`,'i'),'')||p.family;
  }
  function patternCard(p,index){
    const lex=vocab?.forPattern(p),term=lex?.design?.[0]?.term||p.family;
    return `<a class="brand-pattern-card" href="pattern.html?id=${encodeURIComponent(p.id)}"><div class="brand-pattern-preview">${ui.render(p,'card')}</div><div class="brand-pattern-copy"><span>${String(index+1).padStart(2,'0')} / ${esc(p.family)}</span><h2>${esc(shortName(p))}</h2><p>${esc(p.oneLiner)}</p><div><b>${esc(term)}</b>${(p.tags||[]).slice(0,2).map(t=>`<i>${esc(t)}</i>`).join('')}</div><em>Open pattern ↗</em></div></a>`;
  }
  function rangeRows(){
    if(!axes.length)return'';
    return `<div class="brand-range-list">${axes.map(axis=>{const r=range[axis.key],m=mean[axis.key];return `<div class="brand-range-row"><div><strong>${esc(ds.axisNames?.[axis.key]||axis.key)}</strong><span>${r.min===r.max?`${r.min}`:`${r.min}–${r.max}`}</span></div><i><em style="left:${r.min}%;width:${Math.max(2,r.max-r.min)}%"></em><b style="left:${m}%"></b></i></div>`;}).join('')}</div>`;
  }

  root.innerHTML=`<section class="brand-hero"><div class="breadcrumb"><a href="./#patterns">Brands</a><span>/</span><strong>${esc(brand)}</strong></div><div class="brand-hero-grid"><div><p class="eyebrow">BRAND VIEW / MULTIPLE UI GRAMMARS</p><h1>${esc(brand)}</h1><p>同じブランドでも、画面の役割が変われば設計文法は変わる。${items.length}個のUI Patternを、ひとつのブランド名の下で比較する。</p></div>${official?`<a class="brand-official" href="${esc(official)}" target="_blank" rel="noreferrer"><small>OFFICIAL REFERENCE</small><strong>${esc(brand)} ↗</strong><span>${esc(official)}</span></a>`:''}</div><div class="brand-summary-strip"><div><small>UI PATTERNS</small><strong>${items.length}</strong></div><div><small>FAMILIES</small><strong>${families.length}</strong></div><div><small>DOMAINS</small><strong>${domains.length}</strong></div><div><small>DESIGN SPACE</small><strong>Range, not average</strong></div></div></section><section class="brand-range"><div><p class="eyebrow">DESIGN SPACE / BRAND RANGE</p><h2>${esc(brand)}らしさは、1つの座標ではない。</h2><p>ブランドを平均点に潰さず、各UI Patternが占める最小〜最大レンジを表示する。点はブランド内平均。</p></div>${rangeRows()}</section><section class="brand-patterns"><div class="brand-patterns-head"><div><p class="eyebrow">UI PATTERNS</p><h2>${items.length}の異なる設計問題。</h2></div><p>各カードから従来のPattern詳細へ進める。</p></div><div class="brand-pattern-grid">${items.map(patternCard).join('')}</div></section>`;
})();
