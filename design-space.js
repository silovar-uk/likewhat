(function(){
  const taxonomy=window.LikeWhatTaxonomy||{};
  const axes=taxonomy.axes||[
    {key:'density',low:'Sparse',high:'Dense'},
    {key:'emotion',low:'Calm',high:'Excitable'},
    {key:'exploration',low:'Efficiency',high:'Exploration'},
    {key:'authority',low:'Personal',high:'Institutional'},
    {key:'interaction',low:'Observation',high:'Direct Manipulation'},
    {key:'order',low:'Chaotic',high:'Systematic'}
  ];
  const axisNames={density:'Density',emotion:'Emotional Intensity',exploration:'Goal Orientation',authority:'Authority',interaction:'Interaction',order:'Order'};
  const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));

  function mean(patterns){
    const valid=(patterns||[]).filter(p=>p.designSpace);
    const out={};
    axes.forEach(a=>{
      out[a.key]=valid.length?valid.reduce((sum,p)=>sum+clamp(p.designSpace[a.key]),0)/valid.length:50;
    });
    return out;
  }

  function pointFor(value,index,radius=88,cx=100,cy=100){
    const angle=(-90+index*(360/axes.length))*Math.PI/180;
    const r=radius*(clamp(value)/100);
    return [cx+Math.cos(angle)*r,cy+Math.sin(angle)*r];
  }

  function polygon(space,radius=88){
    return axes.map((a,i)=>pointFor(space?.[a.key]??50,i,radius).map(v=>v.toFixed(2)).join(',')).join(' ');
  }

  function ringPoints(percent,radius=88){
    return axes.map((a,i)=>pointFor(percent,i,radius).map(v=>v.toFixed(2)).join(',')).join(' ');
  }

  function radar(space,baseline){
    const axisLines=axes.map((a,i)=>{
      const [x,y]=pointFor(100,i);
      return `<line x1="100" y1="100" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" />`;
    }).join('');
    const labels=axes.map((a,i)=>{
      const [x,y]=pointFor(118,i);
      const anchor=x<88?'end':x>112?'start':'middle';
      return `<text x="${x.toFixed(2)}" y="${(y+3).toFixed(2)}" text-anchor="${anchor}">${axisNames[a.key]}</text>`;
    }).join('');
    return `<div class="space-radar-wrap">
      <svg class="space-radar" viewBox="-28 -24 256 248" role="img" aria-label="6軸Design Spaceレーダー">
        <g class="space-radar-grid">
          <polygon points="${ringPoints(25)}"/><polygon points="${ringPoints(50)}"/><polygon points="${ringPoints(75)}"/><polygon points="${ringPoints(100)}"/>${axisLines}
        </g>
        <polygon class="space-radar-baseline" points="${polygon(baseline)}"/>
        <polygon class="space-radar-current" points="${polygon(space)}"/>
        ${axes.map((a,i)=>{const [x,y]=pointFor(space?.[a.key]??50,i);return `<circle class="space-radar-dot" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.3"/>`;}).join('')}
        <g class="space-radar-labels">${labels}</g>
      </svg>
      <div class="space-legend"><span><i class="current"></i>Current pattern</span><span><i class="baseline"></i>Library mean</span></div>
    </div>`;
  }

  function axisPosition(axis,value){
    const v=clamp(value);
    if(v<=33)return axis.low;
    if(v>=67)return axis.high;
    return 'Balanced';
  }

  function bars(space,baseline){
    return `<div class="space-axis-list">${axes.map(axis=>{
      const value=Math.round(clamp(space?.[axis.key]??50));
      const avg=Math.round(clamp(baseline?.[axis.key]??50));
      return `<div class="space-axis-row">
        <div class="space-axis-head"><strong>${axisNames[axis.key]}</strong><span>${axisPosition(axis,value)} · ${value}</span></div>
        <div class="space-scale-labels"><span>${axis.low}</span><span>${axis.high}</span></div>
        <div class="space-track" aria-label="${axisNames[axis.key]} ${value} / 100">
          <span class="space-midline"></span><span class="space-average" style="left:${avg}%" title="Library mean ${avg}"></span><span class="space-value" style="left:${value}%"></span>
        </div>
      </div>`;
    }).join('')}</div>`;
  }

  function profile(space){
    return axes.map(axis=>{
      const value=clamp(space?.[axis.key]??50);
      const distance=Math.abs(value-50);
      return {axis,value,distance,label:axisPosition(axis,value)};
    }).sort((a,b)=>b.distance-a.distance);
  }

  function summary(space){
    const strongest=profile(space).slice(0,3);
    return strongest.map(x=>`${axisNames[x.axis.key]}: ${x.label}`).join(' / ');
  }

  window.LikeWhatDesignSpace={axes,axisNames,mean,radar,bars,summary,profile};
})();
