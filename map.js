(function(){
  const patterns=(window.LIKEWHAT_PATTERNS||[]).filter(p=>p.designSpace);
  const ds=window.LikeWhatDesignSpace;
  const {render,esc}=window.LikeWhatUI;
  if(!ds||!patterns.length)return;

  const svg=document.getElementById('designMap');
  const stage=document.getElementById('mapStage');
  const tooltip=document.getElementById('mapTooltip');
  const inspector=document.getElementById('mapInspector');
  const openSpaceList=document.getElementById('openSpaceList');
  const xSelect=document.getElementById('xAxis');
  const ySelect=document.getElementById('yAxis');
  const domainSelect=document.getElementById('domainFilter');
  const swapButton=document.getElementById('swapAxes');
  const projectionTitle=document.getElementById('projectionTitle');
  const projectionDescription=document.getElementById('projectionDescription');
  const visibleCount=document.getElementById('visibleCount');

  const axisByKey=Object.fromEntries(ds.axes.map(a=>[a.key,a]));
  const domains=[...new Set(patterns.map(p=>p.domain||'Other'))].sort((a,b)=>a.localeCompare(b,'ja'));
  let xKey='exploration';
  let yKey='order';
  let domain='All';
  let selectedId='donki-retail-maximalism';

  const stats=new Map(patterns.map(p=>[p.id,ds.diversity(p,patterns)]));

  function axisOption(axis){
    return `<option value="${axis.key}">${esc(ds.axisNames[axis.key])} — ${esc(axis.low)} ↔ ${esc(axis.high)}</option>`;
  }
  xSelect.innerHTML=ds.axes.map(axisOption).join('');
  ySelect.innerHTML=ds.axes.map(axisOption).join('');
  domainSelect.innerHTML=['All',...domains].map(d=>`<option value="${esc(d)}">${esc(d)}</option>`).join('');
  xSelect.value=xKey;
  ySelect.value=yKey;

  function visiblePatterns(){
    return patterns.filter(p=>domain==='All'||p.domain===domain);
  }

  function plotX(v){return 72+(Number(v)||0)*8.45;}
  function plotY(v){return 582-(Number(v)||0)*5.2;}

  function emptyZones(items){
    if(!items.length)return [];
    const candidates=[];
    for(let x=10;x<=90;x+=10){
      for(let y=10;y<=90;y+=10){
        const nearest=Math.min(...items.map(p=>Math.hypot((p.designSpace[xKey]-x),(p.designSpace[yKey]-y))));
        candidates.push({x,y,nearest});
      }
    }
    candidates.sort((a,b)=>b.nearest-a.nearest);
    const chosen=[];
    for(const c of candidates){
      if(chosen.every(o=>Math.hypot(o.x-c.x,o.y-c.y)>=28))chosen.push(c);
      if(chosen.length===3)break;
    }
    return chosen;
  }

  function axisSide(key,value){
    const axis=axisByKey[key];
    if(value<=33)return axis.low;
    if(value>=67)return axis.high;
    return 'Balanced';
  }

  function openZoneLabel(zone){
    return `${axisSide(xKey,zone.x)} × ${axisSide(yKey,zone.y)}`;
  }

  function pointMarkup(p){
    const stat=stats.get(p.id);
    const x=plotX(p.designSpace[xKey]);
    const y=plotY(p.designSpace[yKey]);
    const r=5+Math.min(5,(stat?.score||0)/20);
    const frontier=(stat?.score||0)>=75;
    const selected=p.id===selectedId;
    return `<g class="map-point ${frontier?'frontier':''} ${selected?'selected':''}" data-id="${esc(p.id)}" tabindex="0" role="button" aria-pressed="${selected}" aria-label="${esc(p.brand)}、${esc(p.name)}。${esc(ds.axisNames[xKey])} ${Math.round(p.designSpace[xKey])}、${esc(ds.axisNames[yKey])} ${Math.round(p.designSpace[yKey])}">
      <circle class="map-point-hit" cx="${x}" cy="${y}" r="${Math.max(12,r+7)}"/>
      ${frontier?`<circle class="map-point-ring" cx="${x}" cy="${y}" r="${r+5}"/>`:''}
      <circle class="map-point-dot" cx="${x}" cy="${y}" r="${r}"/>
      ${(frontier||selected)?`<text class="map-point-label" x="${x+12}" y="${y-10}">${esc(p.brand)}</text>`:''}
    </g>`;
  }

  function updatePresetStates(){
    document.querySelectorAll('.map-presets [data-x][data-y]').forEach(btn=>{
      btn.setAttribute('aria-pressed',String(btn.dataset.x===xKey&&btn.dataset.y===yKey));
    });
  }

  function renderMap(){
    if(xKey===yKey){
      yKey=ds.axes.find(a=>a.key!==xKey)?.key||'order';
      ySelect.value=yKey;
    }
    const items=visiblePatterns();
    const xAxis=axisByKey[xKey];
    const yAxis=axisByKey[yKey];
    const zones=emptyZones(items);

    projectionTitle.textContent=`${ds.axisNames[xKey]} × ${ds.axisNames[yKey]}`;
    projectionDescription.textContent=`横：${xAxis.low} → ${xAxis.high} ／ 縦：${yAxis.low} → ${yAxis.high}`;
    visibleCount.textContent=items.length;
    svg.setAttribute('aria-label',`${ds.axisNames[xKey]} と ${ds.axisNames[yKey]} のDesign Map。${items.length}件を表示`);

    const grid=[25,50,75].map(v=>`<line x1="${plotX(v)}" y1="62" x2="${plotX(v)}" y2="582"/><line x1="72" y1="${plotY(v)}" x2="917" y2="${plotY(v)}"/>`).join('');
    const zoneMarks=zones.map(z=>`<g class="map-open-zone"><circle cx="${plotX(z.x)}" cy="${plotY(z.y)}" r="23"/><text x="${plotX(z.x)}" y="${plotY(z.y)+3}" text-anchor="middle">OPEN</text></g>`).join('');

    svg.innerHTML=`
      <g class="map-grid">${grid}<line class="map-mid" x1="${plotX(50)}" y1="62" x2="${plotX(50)}" y2="582"/><line class="map-mid" x1="72" y1="${plotY(50)}" x2="917" y2="${plotY(50)}"/></g>
      <g class="map-axis-labels">
        <text x="72" y="620" text-anchor="start">${esc(xAxis.low)}</text>
        <text x="917" y="620" text-anchor="end">${esc(xAxis.high)}</text>
        <text x="28" y="580" transform="rotate(-90 28 580)" text-anchor="start">${esc(yAxis.low)}</text>
        <text x="28" y="64" transform="rotate(-90 28 64)" text-anchor="end">${esc(yAxis.high)}</text>
      </g>
      <g class="map-open-zones">${zoneMarks}</g>
      <g class="map-points">${items.map(pointMarkup).join('')}</g>`;

    renderOpenSpaces(zones);
    ensureSelection(items);
    updatePresetStates();
    bindMapEvents();
  }

  function ensureSelection(items){
    if(!items.some(p=>p.id===selectedId))selectedId=items[0]?.id||null;
    renderInspector();
  }

  function renderOpenSpaces(zones){
    openSpaceList.innerHTML=zones.map((zone,i)=>`<article class="open-space-item">
      <span>${String(i+1).padStart(2,'0')}</span>
      <div><strong>${esc(openZoneLabel(zone))}</strong><small>X ${zone.x} / Y ${zone.y} · nearest 2D gap ${zone.nearest.toFixed(1)}</small></div>
    </article>`).join('');
  }

  function renderInspector(){
    const p=patterns.find(x=>x.id===selectedId);
    if(!p){
      inspector.innerHTML='<p class="map-empty">表示中のパターンがありません。</p>';
      return;
    }
    const stat=stats.get(p.id);
    const opposite=ds.editorialOpposite(p,patterns);
    inspector.innerHTML=`
      <div class="map-inspector-head">
        <div><p class="eyebrow">SELECTED REFERENCE</p><h2>${esc(p.brand)}</h2><p>${esc(p.name)}</p></div>
        <a href="pattern.html?id=${encodeURIComponent(p.id)}">Analyze ↗</a>
      </div>
      <div class="map-inspector-preview">${render(p,'detail')}</div>
      <div class="map-inspector-metrics">
        <div><small>${esc(ds.axisNames[xKey])}</small><strong>${Math.round(p.designSpace[xKey])}</strong><span>${esc(axisSide(xKey,p.designSpace[xKey]))}</span></div>
        <div><small>${esc(ds.axisNames[yKey])}</small><strong>${Math.round(p.designSpace[yKey])}</strong><span>${esc(axisSide(yKey,p.designSpace[yKey]))}</span></div>
        <div><small>Diversity</small><strong>${stat?.score??0}</strong><span>${esc(stat?.label||'—')}</span></div>
      </div>
      <div class="map-inspector-context">
        <div><small>DOMAIN</small><strong>${esc(p.domain||'—')}</strong></div>
        <div><small>ARCHETYPE</small><strong>${esc(p.archetype||'—')}</strong></div>
        <div><small>NEAREST</small><strong>${esc(stat?.nearest?.pattern?.brand||'—')}</strong></div>
        <div><small>OPPOSITE</small><strong>${esc(opposite?.pattern?.brand||'—')}</strong></div>
      </div>
      <p class="map-inspector-summary">${esc(ds.summary(p.designSpace))}</p>`;
  }

  function tooltipHtml(p){
    const stat=stats.get(p.id);
    return `<strong>${esc(p.brand)}</strong><span>${esc(p.name)}</span><small>${esc(ds.axisNames[xKey])} ${Math.round(p.designSpace[xKey])} · ${esc(ds.axisNames[yKey])} ${Math.round(p.designSpace[yKey])} · Diversity ${stat?.score??0}</small>`;
  }

  function showTooltip(evt,p){
    tooltip.innerHTML=tooltipHtml(p);
    tooltip.hidden=false;
    const rect=stage.getBoundingClientRect();
    const x=Math.min(rect.width-260,Math.max(8,evt.clientX-rect.left+14));
    const y=Math.min(rect.height-100,Math.max(8,evt.clientY-rect.top+14));
    tooltip.style.left=`${x}px`;
    tooltip.style.top=`${y}px`;
  }

  function hideTooltip(){tooltip.hidden=true;}

  function selectPoint(id,restoreFocus=false){
    selectedId=id;
    renderMap();
    if(restoreFocus)requestAnimationFrame(()=>svg.querySelector(`.map-point[data-id="${CSS.escape(id)}"]`)?.focus());
  }

  function movePointFocus(node,delta){
    const points=[...svg.querySelectorAll('.map-point')];
    const index=points.indexOf(node);
    if(index<0||!points.length)return;
    points[(index+delta+points.length)%points.length].focus();
  }

  function bindMapEvents(){
    svg.querySelectorAll('.map-point').forEach(node=>{
      const p=patterns.find(x=>x.id===node.dataset.id);
      if(!p)return;
      node.addEventListener('mouseenter',e=>showTooltip(e,p));
      node.addEventListener('mousemove',e=>showTooltip(e,p));
      node.addEventListener('mouseleave',hideTooltip);
      node.addEventListener('focus',()=>{
        const rect=node.getBoundingClientRect();
        showTooltip({clientX:rect.left+rect.width/2,clientY:rect.top},p);
      });
      node.addEventListener('blur',hideTooltip);
      node.addEventListener('click',()=>selectPoint(p.id));
      node.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPoint(p.id,true);}
        if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();movePointFocus(node,1);}
        if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();movePointFocus(node,-1);}
      });
    });
  }

  xSelect.addEventListener('change',()=>{xKey=xSelect.value;renderMap();});
  ySelect.addEventListener('change',()=>{yKey=ySelect.value;renderMap();});
  domainSelect.addEventListener('change',()=>{domain=domainSelect.value;renderMap();});
  swapButton.addEventListener('click',()=>{
    [xKey,yKey]=[yKey,xKey];
    xSelect.value=xKey;
    ySelect.value=yKey;
    renderMap();
  });
  document.querySelector('.map-presets')?.addEventListener('click',e=>{
    const btn=e.target.closest('[data-x][data-y]');
    if(!btn)return;
    xKey=btn.dataset.x;
    yKey=btn.dataset.y;
    xSelect.value=xKey;
    ySelect.value=yKey;
    renderMap();
  });

  renderMap();
})();
