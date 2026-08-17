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
  const axisConcepts={
    density:{low:'情報を絞り、余白と選択的提示を使う',high:'情報を圧縮し、同時提示量を増やす'},
    emotion:{low:'静かで低刺激な情緒に抑える',high:'高揚・演出・感情刺激を強める'},
    exploration:{low:'最短完遂と予測可能性を優先する',high:'寄り道・発見・探索を価値にする'},
    authority:{low:'個人的・親密・非制度的に振る舞う',high:'制度性・公式性・権威の明確さを強める'},
    interaction:{low:'観察・読解・受容を中心にする',high:'直接操作・即時反応・介入を中心にする'},
    order:{low:'競合・揺らぎ・カオスを許容する',high:'系統性・反復・規則性を強く保つ'}
  };
  const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
  const MAX_RAW_DISTANCE=Math.sqrt(axes.length*10000);

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

  const escHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  // STEP23: 各軸について、ライブラリ内で最も近い思想/最も遠い思想の実在パターンを
  // 2件ずつ探す。追加のネットワーク取得は発生しない(patternsは既にページが
  // 保持している配列をそのまま渡すだけ)。1軸だけのシンプルな距離(絶対値の差)で
  // 判定する(6軸合成距離は別の指標としてDiversity Score側が既に担っている)。
  function axisNeighbors(axisKey,value,patterns,excludeId){
    const others=(patterns||[]).filter(p=>p.id!==excludeId&&p.designSpace&&Number.isFinite(Number(p.designSpace[axisKey])));
    if(!others.length)return{near:[],far:[]};
    const withDelta=others.map(p=>({p,delta:Math.abs(Number(p.designSpace[axisKey])-value)}));
    const uniqueByBrand=(list)=>{
      const seen=new Set();const out=[];
      for(const item of list){if(seen.has(item.p.brand))continue;seen.add(item.p.brand);out.push(item);if(out.length===2)break;}
      return out;
    };
    const near=uniqueByBrand([...withDelta].sort((a,b)=>a.delta-b.delta));
    const far=uniqueByBrand([...withDelta].sort((a,b)=>b.delta-a.delta));
    return{near:near.map(x=>x.p),far:far.map(x=>x.p)};
  }

  function bars(space,baseline,patterns,currentId){
    return `<div class="space-axis-list">${axes.map(axis=>{
      const value=Math.round(clamp(space?.[axis.key]??50));
      const avg=Math.round(clamp(baseline?.[axis.key]??50));
      // STEP24: 軸名をクリックすると、その軸をレンズにしたLibraryへ遷移する
      // (STEP08で追加したstate.sort=軸キーの仕組みをそのまま再利用)。
      const axisHeading=`<a class="space-axis-lens-link" href="./?sort=${encodeURIComponent(axis.key)}#patterns" title="${escHtml(axisNames[axis.key])}をレンズにLibraryを見る">${escHtml(axisNames[axis.key])}</a>`;
      const neighbors=patterns?axisNeighbors(axis.key,value,patterns,currentId):null;
      const neighborsMarkup=neighbors&&(neighbors.near.length||neighbors.far.length)?`<div class="space-axis-neighbors">
        ${neighbors.near.length?`<span class="space-axis-near">近い思想: ${neighbors.near.map(p=>escHtml(p.brand)).join(' / ')}</span>`:''}
        ${neighbors.far.length?`<span class="space-axis-far">遠い思想: ${neighbors.far.map(p=>escHtml(p.brand)).join(' / ')}</span>`:''}
      </div>`:'';
      return `<div class="space-axis-row">
        <div class="space-axis-head"><strong>${axisHeading}</strong><span>${axisPosition(axis,value)} · ${value}</span></div>
        <div class="space-scale-labels"><span>${axis.low}</span><span>${axis.high}</span></div>
        <div class="space-track" aria-label="${axisNames[axis.key]} ${value} / 100">
          <span class="space-midline"></span><span class="space-average" style="left:${avg}%" title="Library mean ${avg}"></span><span class="space-value" style="left:${value}%"></span>
        </div>
        ${neighborsMarkup}
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

  function distanceBetween(spaceA,spaceB){
    if(!spaceA||!spaceB)return 0;
    const raw=Math.sqrt(axes.reduce((sum,axis)=>{
      const diff=clamp(spaceA[axis.key])-clamp(spaceB[axis.key]);
      return sum+diff*diff;
    },0));
    return Number(((raw/MAX_RAW_DISTANCE)*100).toFixed(2));
  }

  function differenceBreakdown(spaceA,spaceB){
    return axes.map(axis=>{
      const a=clamp(spaceA?.[axis.key]??50);
      const b=clamp(spaceB?.[axis.key]??50);
      return {key:axis.key,name:axisNames[axis.key],a,b,diff:Math.abs(a-b),direction:b>a?axis.high:b<a?axis.low:'Same'};
    }).sort((x,y)=>y.diff-x.diff);
  }

  function neighbors(pattern,patterns){
    if(!pattern?.designSpace)return [];
    return (patterns||[]).filter(other=>other.id!==pattern.id&&other.designSpace).map(other=>({
      pattern:other,
      distance:distanceBetween(pattern.designSpace,other.designSpace),
      differences:differenceBreakdown(pattern.designSpace,other.designSpace)
    })).sort((a,b)=>a.distance-b.distance);
  }

  function nearestDistance(pattern,patterns){
    return neighbors(pattern,patterns)[0]?.distance??0;
  }

  function diversityLabel(score){
    if(score>=75)return 'Frontier';
    if(score>=50)return 'Outlying';
    if(score>=25)return 'Distinctive';
    return 'Clustered';
  }

  function distanceLabel(distance){
    if(distance<8)return 'Very close';
    if(distance<15)return 'Nearby';
    if(distance<25)return 'Separated';
    if(distance<40)return 'Far';
    return 'Very far';
  }

  function diversity(pattern,patterns){
    const valid=(patterns||[]).filter(x=>x.designSpace);
    const ordered=neighbors(pattern,valid);
    const nearest=ordered[0]||null;
    const farthest=ordered.length?ordered[ordered.length-1]:null;
    const localDistance=nearest?.distance??0;
    const allNearest=valid.map(item=>({id:item.id,distance:nearestDistance(item,valid)}));
    const below=allNearest.filter(x=>x.distance<localDistance).length;
    const equal=allNearest.filter(x=>x.distance===localDistance).length;
    const denominator=Math.max(1,allNearest.length-1);
    const percentile=Math.max(0,Math.min(100,Math.round(((below+Math.max(0,equal-1)*0.5)/denominator)*100)));
    return {
      score:percentile,
      label:diversityLabel(percentile),
      nearest,
      farthest,
      localDistance,
      localDistanceLabel:distanceLabel(localDistance),
      all:ordered
    };
  }

  function oppositeVector(space){
    const out={};
    axes.forEach(axis=>{out[axis.key]=100-clamp(space?.[axis.key]??50);});
    return out;
  }

  function oppositionFlips(spaceA,spaceB){
    return axes.map(axis=>{
      const a=clamp(spaceA?.[axis.key]??50);
      const b=clamp(spaceB?.[axis.key]??50);
      const crossed=(a<50&&b>50)||(a>50&&b<50);
      const strength=Math.abs(a-50)+Math.abs(b-50);
      const aSide=a<50?'low':a>50?'high':'mid';
      const bSide=b<50?'low':b>50?'high':'mid';
      const fromConcept=aSide==='mid'?'中間的なバランス':axisConcepts[axis.key][aSide];
      const toConcept=bSide==='mid'?'中間的なバランス':axisConcepts[axis.key][bSide];
      return {
        key:axis.key,
        name:axisNames[axis.key],
        a,b,
        fromLabel:axisPosition(axis,a),
        toLabel:axisPosition(axis,b),
        crossed,
        strength,
        fromConcept,
        toConcept
      };
    }).sort((x,y)=>(Number(y.crossed)-Number(x.crossed))||(y.strength-x.strength));
  }

  function editorialOpposite(pattern,patterns){
    if(!pattern?.designSpace)return null;
    const valid=(patterns||[]).filter(x=>x.id!==pattern.id&&x.designSpace);
    if(!valid.length)return null;
    const ideal=oppositeVector(pattern.designSpace);
    const manualId=(pattern.opposites||[]).find(id=>valid.some(x=>x.id===id));
    let selected=null;
    let mode='computed';

    if(manualId){
      selected=valid.find(x=>x.id===manualId);
      mode='curated';
    }else{
      selected=valid.map(candidate=>{
        const targetDistance=distanceBetween(ideal,candidate.designSpace);
        const contextPenalty=(candidate.brand===pattern.brand?12:0)+(candidate.domain===pattern.domain?4:0)+(candidate.archetype===pattern.archetype?3:0)+(candidate.medium===pattern.medium?1:0);
        return {candidate,targetDistance,editorialCost:targetDistance+contextPenalty};
      }).sort((a,b)=>a.editorialCost-b.editorialCost)[0]?.candidate||null;
    }

    if(!selected)return null;
    const targetDistance=distanceBetween(ideal,selected.designSpace);
    const currentDistance=distanceBetween(pattern.designSpace,selected.designSpace);
    return {
      pattern:selected,
      mode,
      ideal,
      targetDistance,
      currentDistance,
      fit:Math.round(Math.max(0,100-targetDistance)),
      flips:oppositionFlips(pattern.designSpace,selected.designSpace),
      differences:differenceBreakdown(pattern.designSpace,selected.designSpace)
    };
  }

  window.LikeWhatDesignSpace={axes,axisNames,axisConcepts,axisPosition,mean,radar,bars,summary,profile,distanceBetween,differenceBreakdown,neighbors,nearestDistance,diversity,distanceLabel,oppositeVector,oppositionFlips,editorialOpposite};
})();
