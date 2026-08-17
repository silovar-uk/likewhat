(function(){
  const asItems=value=>{
    if(Array.isArray(value))return value.map(item=>typeof item==='string'?{label:'NOTE',value:item}:item).filter(Boolean);
    if(value&&typeof value==='object')return Object.entries(value).map(([label,item])=>({label,value:String(item)}));
    return value?[{label:'NOTE',value:String(value)}]:[];
  };
  const groupLabels={typography:['TYPOGRAPHY','文字組み'],spacing:['SPACING','余白と間'],surface:['SURFACE','面・罫線・角丸'],layout:['LAYOUT','幅と整列'],interaction:['INTERACTION','操作と動き'],components:['COMPONENTS','コンポーネント'],responsive:['RESPONSIVE','レスポンシブ']};
  const traceLabels={curated:'CURATED TRACE',observed:'OBSERVED TRACE',measured:'MEASURED TRACE'};
  const methodLabels={curated:'CURATED',observed:'OBSERVED',measured:'MEASURED'};

  const legacyCuratedGroups=raw=>{
    if(!raw)return null;
    if(Array.isArray(raw))return raw.map((group,index)=>({key:group.key||`group-${index+1}`,label:group.label||group.title||'DETAIL',title:group.title||group.label||'Detail',items:asItems(group.items||group.values||group.details),cue:group.cue||''})).filter(group=>group.items.length);
    if(typeof raw!=='object')return null;
    return Object.entries(raw).map(([key,value])=>{
      const meta=groupLabels[key]||[String(key).toUpperCase(),String(key)];
      return {key,label:meta[0],title:meta[1],items:asItems(value?.items||value),cue:value?.cue||''};
    }).filter(group=>group.items.length);
  };

  const schemaTrace=raw=>{
    if(!raw||(raw.schemaVersion!==1&&raw.schemaVersion!==2)||!raw.groups||typeof raw.groups!=='object')return null;
    const sources=new Map((raw.sources||[]).map(source=>[source.id,source]));
    const groups=Object.entries(raw.groups).map(([key,value])=>{
      const meta=groupLabels[key]||[String(key).toUpperCase(),String(key)];
      const items=asItems(value?.items||[]).map(item=>{
        const source=sources.get(item.sourceId);
        return {...item,sourceLabel:source?.label||'',sourceUrl:source?.url||''};
      });
      return {key,label:meta[0],title:meta[1],items,cue:value?.cue||'',relations:value?.relations||[],meaning:value?.meaning||null};
    }).filter(group=>group.items.length);
    if(!groups.length)return null;
    return {mode:raw.traceLevel||'curated',checkedAt:raw.checkedAt||'',sources:[...sources.values()],groups};
  };

  // STEP20: designSpace座標からのランタイム推定(旧inferredTrace)は廃止した。
  // schema v1/v2の実測データを持たないパターンは、forPatternがnullを返す。
  // render()側でその状態を「まだ計測していません」と正直に表示する(原則P7)。
  function forPattern(pattern){
    const schema=schemaTrace(pattern?.microDetails);
    if(schema)return schema;
    const legacy=legacyCuratedGroups(pattern?.microDetails);
    if(legacy?.length)return {mode:'curated',groups:legacy};
    return null;
  }

  // STEP19: Evidence UI。出自の違いを色ではなく表現形式そのもので伝える。
  // measured: 数値を主役サイズ+出典リンク。observed: レンジ表記のみ。
  // curated: 数値を出さず言葉のみ(検証器がcuratedへの数値混入を防いでいる)。
  function itemMarkup(item,esc){
    const method=item.method||'curated';
    const confidenceNote=item.confidence&&item.confidence!=='high'?`<small class="micro-detail-item-confidence">confidence: ${esc(item.confidence)}</small>`:'';
    const sourceLink=method==='measured'&&item.sourceUrl?`<a class="micro-detail-item-source" href="${esc(item.sourceUrl)}" target="_blank" rel="noreferrer">${esc(item.sourceLabel||'出典')} ↗</a>`:'';
    return `<div class="micro-detail-item micro-detail-item--${esc(method)}">
      <dt>${esc(item.label||'Detail')}</dt>
      <dd>${esc(item.value||'—')}${item.note?`<span class="micro-detail-item-note">${esc(item.note)}</span>`:''}${confidenceNote}${sourceLink}</dd>
    </div>`;
  }

  function relationMarkup(relation,esc){
    return `<div class="micro-detail-relation"><span class="micro-detail-relation-label">${esc(relation.label)}</span><b class="micro-detail-relation-value">${esc(relation.value)}</b></div>`;
  }

  function render(trace,esc,resolutionDotsHtml){
    const heading=`<div class="micro-details-heading">
        <div><p class="eyebrow">04 MICRO DETAILS / TRACE THE SMALL DECISIONS</p>${resolutionDotsHtml||''}<h2>細部を、再現できる単位まで見る</h2><p>「雰囲気が似ている」で止めず、文字サイズ・行間・余白・角丸・幅・操作フィードバックまで分解する。</p></div>
        <span class="micro-trace-mode${trace?'':' is-none'}">${trace?esc(traceLabels[trace.mode]||traceLabels.curated):'未計測'}</span>
      </div>`;

    if(!trace?.groups?.length){
      return `<section class="detail-block micro-details-block micro-details-block--none">
        ${heading}
        <p class="micro-details-empty">まだ計測していません。公式ドキュメント・CSS・実測でこのパターンの細部を確認できた場合、ここへ追加します。それまでは値の形をした推定を表示しません。</p>
      </section>`;
    }

    const cards=trace.groups.map(group=>`<article class="micro-detail-card">
      <div class="micro-detail-card-head"><small>${esc(group.label)}</small><span>${esc(methodLabels[trace.mode]||'CURATED')}</span></div>
      <h3>${esc(group.title)}</h3>
      <dl>${group.items.map(item=>itemMarkup(item,esc)).join('')}</dl>
      ${group.relations?.length?`<div class="micro-detail-relations">${group.relations.map(r=>relationMarkup(r,esc)).join('')}</div>`:''}
      ${group.meaning?.text?`<p class="micro-detail-meaning">${esc(group.meaning.text)}</p>`:''}
      ${group.cue?`<p class="micro-detail-cue"><strong>Observed cue</strong>${esc(group.cue)}</p>`:''}
    </article>`).join('');
    const evidence=`schemaで保存した${methodLabels[trace.mode]||'CURATED'}データ。${trace.checkedAt?`最終確認 ${trace.checkedAt}。`:''}${trace.sources?.length?`参照ソース ${trace.sources.length}件。`:''}`;
    return `<section class="detail-block micro-details-block">
      ${heading}
      <div class="micro-details-grid">${cards}</div>
      <p class="micro-details-note">${esc(evidence)}</p>
    </section>`;
  }

  function prompt(trace){
    if(!trace?.groups?.length)return '';
    const summarizeItem=item=>{
      const cite=trace.mode==='measured'&&item.sourceUrl?`(出典: ${item.sourceUrl})`:'';
      return `${item.label} ${item.value}${cite}`;
    };
    const summary=trace.groups.map(group=>`${group.title}: ${group.items.slice(0,3).map(summarizeItem).join(' / ')}`).join('。');
    const caveat=trace.mode==='observed'
      ?`以下は${traceLabels[trace.mode]}として保存した観察に基づく概算です。`
      :`以下は${traceLabels[trace.mode]||'CURATED TRACE'}として保存した細部観察値です。`;
    return `\n\n細部トレース: ${caveat} ${summary}。大きな雰囲気だけでなく、文字組み・余白・面・幅・操作の小さな判断まで揃えてください。`;
  }

  window.LikeWhatMicroDetails={forPattern,render,prompt};
})();
