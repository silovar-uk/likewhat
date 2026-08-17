(function(){
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const round=(value,step=1)=>Math.round(value/step)*step;
  const valueOf=(pattern,key,fallback=50)=>{
    const value=Number(pattern?.designSpace?.[key]);
    return Number.isFinite(value)?value:fallback;
  };
  const cue=(pattern,regex,fallback)=>{
    const match=(pattern?.visual||[]).find(item=>regex.test(String(item)));
    return match||fallback;
  };
  const asItems=value=>{
    if(Array.isArray(value))return value.map(item=>typeof item==='string'?{label:'NOTE',value:item}:item).filter(Boolean);
    if(value&&typeof value==='object')return Object.entries(value).map(([label,item])=>({label,value:String(item)}));
    return value?[{label:'NOTE',value:String(value)}]:[];
  };
  const curatedGroups=raw=>{
    if(!raw)return null;
    if(Array.isArray(raw))return raw.map((group,index)=>({key:group.key||`group-${index+1}`,label:group.label||group.title||'DETAIL',title:group.title||group.label||'Detail',items:asItems(group.items||group.values||group.details),cue:group.cue||''})).filter(group=>group.items.length);
    if(typeof raw!=='object')return null;
    const labels={typography:['TYPOGRAPHY','文字組み'],spacing:['SPACING','余白と間'],surface:['SURFACE','面・罫線・角丸'],layout:['LAYOUT','幅と整列'],interaction:['INTERACTION','操作と動き']};
    return Object.entries(raw).map(([key,value])=>{
      const meta=labels[key]||[String(key).toUpperCase(),String(key)];
      return {key,label:meta[0],title:meta[1],items:asItems(value?.items||value),cue:value?.cue||''};
    }).filter(group=>group.items.length);
  };

  function inferredTrace(pattern){
    const density=valueOf(pattern,'density');
    const emotion=valueOf(pattern,'emotion');
    const exploration=valueOf(pattern,'exploration');
    const authority=valueOf(pattern,'authority');
    const interaction=valueOf(pattern,'interaction');
    const order=valueOf(pattern,'order');

    const sectionGap=round(clamp(86-density*.52,32,76),4);
    const localGap=round(clamp(24-density*.15,9,20),2);
    const padding=round(clamp(34-density*.18,14,28),2);
    const headingSize=emotion>=72?'36–56px':authority>=72?'30–46px':'26–42px';
    const headingWeight=authority>=72?'600–700':emotion>=72?'650–800':'500–650';
    const bodySize=density>=72?'13–15px':density>=46?'14–16px':'15–18px';
    const bodyLeading=density>=72?'1.40–1.55':density>=46?'1.50–1.70':'1.65–1.85';
    const tracking=authority>=72?'-0.02em〜0':emotion>=68?'-0.03em〜0':'0〜0.02em';
    const radius=order>=72?'6–12px':exploration>=68?'16–28px':'10–18px';
    const contentWidth=density>=72?'960–1280px':density<=34?'720–960px':'840–1120px';
    const motion=interaction>=70||exploration>=70?'160–240ms':'120–180ms';
    const target=interaction>=68?'40–48px':'36–44px';

    return [
      {
        key:'typography',label:'01 TYPOGRAPHY',title:'文字組み',
        items:[
          {label:'Headline scale',value:headingSize},
          {label:'Headline weight',value:headingWeight},
          {label:'Body / leading',value:`${bodySize} / ${bodyLeading}`},
          {label:'Letter spacing',value:tracking},
          {label:'Font family',value:'参照先の公式指定を優先。未確認時は system-ui から検証'}
        ],
        cue:cue(pattern,/見出し|文字|ラベル|コピー|タイポ|本文|フォント|行間/,'見出し・本文・補助ラベルのサイズ差と行間差を先に観察する。')
      },
      {
        key:'spacing',label:'02 SPACING',title:'余白と間',
        items:[
          {label:'Section rhythm',value:`約 ${sectionGap}px`},
          {label:'Local gap',value:`約 ${localGap}px`},
          {label:'Inner padding',value:`約 ${padding}px`},
          {label:'Density cue',value:density>=68?'詰める。ただし整列は強く保つ':density<=36?'空白を意味のある面として使う':'中密度。群ごとの呼吸を残す'}
        ],
        cue:cue(pattern,/余白|間隔|行高|密度|詰め|広く|gap|padding/,'要素間隔を均等化せず、「まとまり内」と「まとまり間」の差を見る。')
      },
      {
        key:'surface',label:'03 SURFACE',title:'面・罫線・角丸',
        items:[
          {label:'Corner radius',value:radius},
          {label:'Border',value:order>=65?'1px前後の弱い線を基準':'必要箇所だけ。背景差で分ける'},
          {label:'Shadow',value:emotion>=70?'面を浮かせる場合も弱く広い影':'原則なし〜ごく薄く'},
          {label:'Contrast',value:authority>=70?'明暗差を明確にして階層化':'低〜中コントラストで連続性を保つ'}
        ],
        cue:cue(pattern,/角丸|罫線|背景|影|色|カード|境界/,'境界線だけに頼らず、背景差・角丸・余白の組み合わせで面を分ける。')
      },
      {
        key:'layout',label:'04 LAYOUT',title:'幅と整列',
        items:[
          {label:'Content width',value:contentWidth},
          {label:'Alignment',value:order>=66?'基準線を強く揃える':'主役の位置を優先し、必要な非対称を許す'},
          {label:'Column behavior',value:density>=65?'複数列でも列幅と行高を揃える':'列数を増やしすぎず、1ブロック1焦点'},
          {label:'Responsive',value:'幅を縮めるより、列を落として情報階層を維持'}
        ],
        cue:cue(pattern,/中央|左|右|幅|グリッド|列|並べ|サイドバー|整列/,'端・中心・ベースラインのどこを基準に揃えているかを見る。')
      },
      {
        key:'interaction',label:'05 INTERACTION',title:'操作と動き',
        items:[
          {label:'Motion',value:motion},
          {label:'Target size',value:target},
          {label:'Disclosure',value:exploration>=62?'hover / focus / 展開で段階的に見せる':'主要操作は先に見せ、補助操作だけ隠す'},
          {label:'Feedback',value:interaction>=64?'押下・選択・hoverの状態差を明確に':'変化量は小さく、状態差だけ確実に伝える'}
        ],
        cue:cue(pattern,/hover|focus|選択|操作|CTA|スクロール|展開|遷移|切り替/,'動きの派手さより、操作前後で何が変わったかの差分を見る。')
      }
    ];
  }

  function forPattern(pattern){
    const curated=curatedGroups(pattern?.microDetails);
    if(curated?.length)return {mode:'curated',groups:curated};
    return {mode:'estimate',groups:inferredTrace(pattern)};
  }

  function render(trace,esc){
    if(!trace?.groups?.length)return '';
    const modeLabel=trace.mode==='curated'?'CURATED TRACE':'EDITORIAL ESTIMATE';
    const cards=trace.groups.map(group=>`<article class="micro-detail-card">
      <div class="micro-detail-card-head"><small>${esc(group.label)}</small><span>${esc(modeLabel)}</span></div>
      <h3>${esc(group.title)}</h3>
      <dl>${group.items.map(item=>`<div><dt>${esc(item.label||'Detail')}</dt><dd>${esc(item.value||'—')}</dd></div>`).join('')}</dl>
      ${group.cue?`<p class="micro-detail-cue"><strong>Observed cue</strong>${esc(group.cue)}</p>`:''}
    </article>`).join('');
    return `<section class="detail-block micro-details-block">
      <div class="micro-details-heading">
        <div><p class="eyebrow">MICRO DETAILS / TRACE THE SMALL DECISIONS</p><h2>細部を、再現できる単位まで見る</h2><p>「雰囲気が似ている」で止めず、文字サイズ・行間・余白・角丸・幅・操作フィードバックまで分解する。</p></div>
        <span class="micro-trace-mode">${esc(modeLabel)}</span>
      </div>
      <div class="micro-details-grid">${cards}</div>
      <p class="micro-details-note">${trace.mode==='curated'?'この項目は個別パターンに保存した観察値を表示。':'数値レンジは公式CSS値の転載ではなく、Like What?で再現へ落とすための編集的な目安。参照先でCSS・ガイド・実測値を確認できた場合は、個別の microDetails を保存してこの推定を上書きする。'}</p>
    </section>`;
  }

  function prompt(trace){
    if(!trace?.groups?.length)return '';
    const summary=trace.groups.map(group=>`${group.title}: ${group.items.slice(0,3).map(item=>`${item.label} ${item.value}`).join(' / ')}`).join('。');
    const caveat=trace.mode==='curated'?'以下は個別に記録した細部観察値です。':'以下はLike What?上の再現レンジであり、公式CSS値ではありません。';
    return `\n\n細部トレース: ${caveat} ${summary}。大きな雰囲気だけでなく、文字組み・余白・面・幅・操作の小さな判断まで揃えてください。`;
  }

  window.LikeWhatMicroDetails={forPattern,render,prompt};
})();
