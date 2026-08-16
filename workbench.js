(function(){
  'use strict';

  const KEYS={
    projects:'lw:wb:projects:v1',
    projectNames:'lw:wb:project-names:v1',
    currentProject:'lw:wb:current-project:v1',
    recent:'lw:wb:recent:v1',
    compare:'lw:wb:compare:v1',
    learningSeen:'lw:wb:learning-seen:v1'
  };
  const DEFAULT_PROJECTS=['今回の参考','MultiMemos','Quick Links','Like What?','LP'];
  const GOALS={
    organize:{
      label:'情報を整理したい',
      hint:'一覧・階層・密度',
      tokens:['information architecture','hierarchy','navigation','dashboard','list','density','wayfinding','editorial','grid'],
      reason:'情報の優先順位と、一覧の見通しをつくる参照'
    },
    input:{
      label:'入力を気持ちよくしたい',
      hint:'フォーム・編集・集中',
      tokens:['editor','input','form','writing','command','productivity','focus','workspace','keyboard'],
      reason:'入力中のノイズを減らし、操作の手応えを整える参照'
    },
    mobile:{
      label:'スマホ操作を改善したい',
      hint:'タップ・遷移・省スペース',
      tokens:['mobile','touch','responsive','navigation','app','compact','gesture','bottom'],
      reason:'狭い画面でも迷わず触れる構造を考える参照'
    },
    joyful:{
      label:'もう少し楽しくしたい',
      hint:'遊び・反応・意外性',
      tokens:['playful','delight','motion','game','toy','entertainment','color','character','expressive'],
      reason:'常時派手にせず、使った瞬間に気分が上がる参照'
    },
    trust:{
      label:'信頼感を出したい',
      hint:'落ち着き・明快さ・制度感',
      tokens:['trust','institution','official','clarity','calm','systematic','financial','healthcare','academic','authority'],
      reason:'説明責任と安心感を、情報構造からつくる参照'
    },
    premium:{
      label:'上質に見せたい',
      hint:'余白・編集・距離感',
      tokens:['luxury','premium','editorial','fashion','jewelry','minimal','serif','gallery','quiet','craft'],
      reason:'装飾より、余白・タイポグラフィ・距離感で質を出す参照'
    },
    guidance:{
      label:'初見で迷わせたくない',
      hint:'導線・説明・状態',
      tokens:['onboarding','wayfinding','loading','empty state','error','404','progressive disclosure','guidance','navigation','status'],
      reason:'現在地・次の行動・状態変化を理解させる参照'
    },
    action:{
      label:'行動につなげたい',
      hint:'CTA・購入・予約',
      tokens:['commerce','ticket','booking','purchase','conversion','cta','action','ecommerce','checkout','campaign'],
      reason:'押してほしい行動を強くしつつ、圧を上げすぎない参照'
    }
  };

  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const norm=value=>String(value||'').normalize('NFKC').toLowerCase();
  const uniq=items=>[...new Set(items.filter(Boolean))];
  const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  const patterns=()=>window.LIKEWHAT_PATTERNS||[];
  const byId=id=>patterns().find(p=>p.id===id);

  const goalRoot=document.getElementById('workbenchGoals');
  const goalResult=document.getElementById('goalResult');
  const recentRoot=document.getElementById('recentRefs');
  const savedRoot=document.getElementById('savedRefs');
  const projectSelect=document.getElementById('projectSelect');
  const newProjectToggle=document.getElementById('newProjectToggle');
  const newProjectForm=document.getElementById('newProjectForm');
  const newProjectName=document.getElementById('newProjectName');
  const addProject=document.getElementById('addProject');
  const buildDecision=document.getElementById('buildDecision');
  const decisionOutput=document.getElementById('decisionOutput');
  const decisionText=document.getElementById('decisionText');
  const copyDecision=document.getElementById('copyDecision');
  const clearRecent=document.getElementById('clearRecent');
  const learningDetails=document.getElementById('learningPathDetails');

  let projectNames=uniq([...DEFAULT_PROJECTS,...parse(KEYS.projectNames,[])]);
  let projectData=parse(KEYS.projects,{});
  let currentProject=localStorage.getItem(KEYS.currentProject)||projectNames[0];
  if(!projectNames.includes(currentProject))projectNames.unshift(currentProject);
  let compareItems=parse(KEYS.compare,[]).slice(0,2);
  let activeGoal='';

  function saveProjectState(){
    write(KEYS.projectNames,projectNames);
    write(KEYS.projects,projectData);
    try{localStorage.setItem(KEYS.currentProject,currentProject);}catch{}
  }

  function itemFromPattern(p,href){
    if(!p)return null;
    return {
      id:p.id,
      brand:p.brand||'Unknown',
      name:p.name||p.family||'',
      oneLiner:p.oneLiner||'',
      scene:p.scene||'',
      domain:p.domain||'',
      family:p.family||'',
      href:href||`pattern.html?id=${encodeURIComponent(p.id)}`,
      at:Date.now()
    };
  }

  function rememberRecent(item){
    if(!item?.id)return;
    const recent=parse(KEYS.recent,[]).filter(x=>x.id!==item.id);
    recent.unshift({...item,at:Date.now()});
    write(KEYS.recent,recent.slice(0,8));
    renderRecent();
  }

  function saveReference(item){
    if(!item?.id)return;
    const list=(projectData[currentProject]||[]).filter(x=>x.id!==item.id);
    list.unshift({...item,at:Date.now()});
    projectData[currentProject]=list.slice(0,24);
    saveProjectState();
    renderSaved();
    decorateLibraryCards();
    toast(`「${item.brand}」を ${currentProject} に保存しました`,'saved');
  }

  function removeSaved(id){
    projectData[currentProject]=(projectData[currentProject]||[]).filter(x=>x.id!==id);
    saveProjectState();renderSaved();decorateLibraryCards();
  }

  function isSaved(id){return (projectData[currentProject]||[]).some(x=>x.id===id);}
  function isCompared(id){return compareItems.some(x=>x.id===id);}

  function renderProjectSelect(){
    if(!projectSelect)return;
    projectSelect.innerHTML=projectNames.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');
    projectSelect.value=currentProject;
  }

  function renderRecent(){
    if(!recentRoot)return;
    const list=parse(KEYS.recent,[]);
    if(!list.length){
      recentRoot.innerHTML='<p class="wb-empty">まだありません。事例を開くと、ここからすぐ戻れます。</p>';
      if(clearRecent)clearRecent.hidden=true;
      return;
    }
    if(clearRecent)clearRecent.hidden=false;
    recentRoot.innerHTML=list.slice(0,6).map(item=>`<a class="wb-mini-ref" href="${esc(item.href||`pattern.html?id=${encodeURIComponent(item.id)}`)}" data-wb-recent-open="${esc(item.id)}"><span><strong>${esc(item.brand)}</strong><small>${esc(item.name||item.family||'')}</small></span><b aria-hidden="true">→</b></a>`).join('');
  }

  function renderSaved(){
    if(!savedRoot)return;
    const list=projectData[currentProject]||[];
    if(!list.length){
      savedRoot.innerHTML='<p class="wb-empty">ライブラリの「参考にする」を押すと、この案件だけの参照束になります。</p>';
    }else{
      savedRoot.innerHTML=list.map(item=>`<div class="wb-saved-ref"><a href="${esc(item.href||`pattern.html?id=${encodeURIComponent(item.id)}`)}" data-wb-saved-open="${esc(item.id)}"><span><strong>${esc(item.brand)}</strong><small>${esc(item.name||item.family||'')}</small></span></a><button type="button" data-wb-remove-saved="${esc(item.id)}" aria-label="${esc(item.brand)}を参考から外す">×</button></div>`).join('');
    }
    if(buildDecision){
      buildDecision.disabled=list.length<2;
      buildDecision.textContent=list.length<2?'2件以上で設計方針を作る':`${Math.min(list.length,6)}件から設計方針を作る`;
    }
  }

  function textFor(p){
    return norm([
      p.brand,p.name,p.family,p.scene,p.domain,p.medium,p.archetype,p.interactionModel,p.oneLiner,
      ...(p.tags||[]),...(p.uiParts||[]),...(p.philosophy||[])
    ].join(' '));
  }

  function scorePattern(p,goal){
    const hay=textFor(p);
    let score=0;
    const matched=[];
    goal.tokens.forEach((token,index)=>{
      if(hay.includes(norm(token))){score+=Math.max(2,8-Math.floor(index/2));matched.push(token);}
    });
    if(p.oneLiner)score+=1;
    if(p.scene)score+=1;
    return {score,matched};
  }

  function topForGoal(goal,limit=4){
    const scored=patterns().map(p=>({p,...scorePattern(p,goal)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    const selected=[];const seenBrands=new Set();
    for(const row of scored){
      if(!seenBrands.has(row.p.brand)){selected.push(row);seenBrands.add(row.p.brand);}
      if(selected.length===limit)break;
    }
    if(selected.length<limit){
      for(const row of scored){if(!selected.includes(row))selected.push(row);if(selected.length===limit)break;}
    }
    return selected;
  }

  function recommendationCard(row,goal){
    const p=row.p;
    const matched=row.matched.slice(0,3);
    const meta=uniq([p.scene,p.domain,...(p.uiParts||[]).slice(0,2)]).slice(0,3);
    return `<article class="wb-rec-card">
      <a href="pattern.html?id=${encodeURIComponent(p.id)}" data-wb-rec-open="${esc(p.id)}">
        <small>${esc(meta.join(' · ')||p.family||'REFERENCE')}</small>
        <h4>${esc(p.brand)}</h4>
        <p>${esc(p.oneLiner||goal.reason)}</p>
        ${matched.length?`<div class="wb-match">${matched.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}
      </a>
      <div class="wb-rec-actions">
        <button type="button" data-wb-save-id="${esc(p.id)}" class="${isSaved(p.id)?'is-saved':''}">${isSaved(p.id)?'保存済み':'参考にする'}</button>
        <button type="button" data-wb-compare-id="${esc(p.id)}" class="${isCompared(p.id)?'is-compare':''}">${isCompared(p.id)?'比較中':'比較に追加'}</button>
      </div>
    </article>`;
  }

  async function ensureLibrary(){
    if(window.LIKEWHAT_LIBRARY_READY)return;
    const wait=new Promise(resolve=>window.addEventListener('likewhat:library-ready',resolve,{once:true}));
    const input=document.getElementById('searchInput');
    if(input)input.dispatchEvent(new Event('input',{bubbles:true}));
    await wait;
  }

  async function showGoal(key){
    const goal=GOALS[key];if(!goal||!goalResult)return;
    activeGoal=key;
    goalRoot?.querySelectorAll('[data-goal]').forEach(btn=>btn.classList.toggle('active',btn.dataset.goal===key));
    goalResult.innerHTML=`<div class="wb-loading"><span></span><p>「${esc(goal.label)}」に近い参照を探しています。</p></div>`;
    try{
      await ensureLibrary();
      const rows=topForGoal(goal,4);
      goalResult.innerHTML=`<div class="wb-result-head"><div><small>この課題なら</small><h3>${esc(goal.label)}</h3><p>${esc(goal.reason)}。ブランドの知名度ではなく、課題との近さで上位を出しています。</p></div><a href="#patterns">ライブラリ全体を見る ↓</a></div><div class="wb-rec-grid">${rows.map(row=>recommendationCard(row,goal)).join('')}</div>`;
    }catch(error){
      console.warn('[Like What?] workbench goal load failed',error);
      goalResult.innerHTML='<p class="wb-empty">参照の読み込みに失敗しました。ライブラリを開いてもう一度試してください。</p>';
    }
  }

  function topTerms(items,limit=5){
    const counts=new Map();
    items.forEach(p=>{
      const terms=uniq([...(p.philosophy||[]),...(p.tags||[]),...(p.uiParts||[]),p.family,p.scene]).filter(x=>String(x).length>1);
      terms.forEach(term=>counts.set(term,(counts.get(term)||0)+1));
    });
    const threshold=items.length<=2?2:Math.ceil(items.length/2);
    return [...counts.entries()].filter(([,n])=>n>=threshold).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([term])=>term);
  }

  function axisSummary(items){
    const ds=window.LikeWhatDesignSpace;
    if(!ds?.axes?.length)return [];
    return ds.axes.map(axis=>{
      const values=items.map(p=>Number(p.designSpace?.[axis.key])).filter(Number.isFinite);
      if(!values.length)return null;
      const avg=values.reduce((a,b)=>a+b,0)/values.length;
      const spread=Math.max(...values)-Math.min(...values);
      return {name:ds.axisNames?.[axis.key]||axis.key,avg,spread,label:ds.axisPosition?.(axis,avg)||''};
    }).filter(Boolean).sort((a,b)=>Math.abs(b.avg-50)-Math.abs(a.avg-50)||b.spread-a.spread).slice(0,2);
  }

  async function buildDecisionBrief(){
    const saved=(projectData[currentProject]||[]).slice(0,6);
    if(saved.length<2)return;
    await ensureLibrary();
    const refs=saved.map(item=>byId(item.id)).filter(Boolean);
    if(refs.length<2)return;
    const common=topTerms(refs,5);
    const contexts=uniq(refs.flatMap(p=>[p.scene,p.domain,...(p.uiParts||[]).slice(0,2)])).slice(0,6);
    const axes=axisSummary(refs);
    const lines=[];
    lines.push(`設計方針｜${currentProject}`,'');
    lines.push('■ 共通して採る');
    if(common.length)common.forEach(term=>lines.push(`- ${term}`));
    else lines.push('- 各参照の見た目ではなく、情報階層・距離感・操作原則を抽出して使う');
    lines.push('','■ 参照別に借りる');
    refs.forEach(p=>lines.push(`- ${p.brand}: ${p.oneLiner||p.family||p.name}`));
    lines.push('','■ 実装条件');
    if(contexts.length)lines.push(`- 主に意識する場面・要素: ${contexts.join(' / ')}`);
    axes.forEach(axis=>lines.push(`- ${axis.name}: ${axis.label||Math.round(axis.avg)} 側を基準にする${axis.spread>=25?'。参照間の振れ幅が大きいので、どちらへ寄せるか画面ごとに決める':''}`));
    lines.push('- 重要操作は状態変化が一目で分かること。色は装飾ではなく、選択・保存・比較などの状態に使う。');
    lines.push('','■ 採らない');
    lines.push('- ブランド固有の色・ロゴ・装飾を、そのまま平均してコピーしない。');
    lines.push('- 参照を増やすこと自体を目的にせず、今回の課題に効かない要素は捨てる。');
    lines.push('','■ 最後に確認する問い');
    lines.push('- この画面で最初に理解してほしいことは何か？');
    lines.push('- 次にしてほしい行動は何か？');
    lines.push('- その2つを邪魔している装飾・情報・操作はないか？');
    if(decisionText)decisionText.textContent=lines.join('\n');
    if(decisionOutput){decisionOutput.hidden=false;decisionOutput.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});}
  }

  function comparisonItem(p){return itemFromPattern(p);}
  function toggleCompare(item){
    if(!item?.id)return;
    const index=compareItems.findIndex(x=>x.id===item.id);
    if(index>=0){compareItems.splice(index,1);toast(`「${item.brand}」を比較から外しました`);}
    else if(compareItems.length<2){compareItems.push(item);toast(`比較 ${compareItems.length}/2 に追加しました`,'compare');}
    else{compareItems[1]=item;toast(`比較Bを「${item.brand}」に入れ替えました`,'compare');}
    write(KEYS.compare,compareItems);renderCompareTray();decorateLibraryCards();
    if(activeGoal)showGoal(activeGoal);
  }

  function renderCompareTray(){
    let tray=document.getElementById('wbCompareTray');
    if(!tray){
      tray=document.createElement('aside');tray.id='wbCompareTray';tray.className='wb-compare-tray';tray.setAttribute('aria-live','polite');document.body.appendChild(tray);
    }
    if(!compareItems.length){tray.hidden=true;return;}
    tray.hidden=false;
    const ready=compareItems.length===2;
    tray.innerHTML=`<div class="wb-compare-label"><small>QUICK CONTRAST</small><strong>比較 ${compareItems.length}/2</strong></div><div class="wb-compare-items">${compareItems.map((item,i)=>`<span><b>${i?'B':'A'}</b>${esc(item.brand)}<button type="button" data-wb-remove-compare="${esc(item.id)}" aria-label="比較から外す">×</button></span>`).join('')}</div>${ready?`<a href="compare.html?a=${encodeURIComponent(compareItems[0].id)}&b=${encodeURIComponent(compareItems[1].id)}">2件を比較する →</a>`:'<em>もう1件選ぶ</em>'}`;
  }

  function groupSummary(groupPatterns){
    const list=groupPatterns.filter(Boolean);if(!list.length)return null;
    const first=list[0];
    const feature=first.oneLiner||`${first.family||'デザイン'}の判断軸を見る`;
    const contexts=uniq(list.flatMap(p=>[p.scene,p.domain,...(p.uiParts||[]).slice(0,2)])).slice(0,4);
    const words=uniq(list.flatMap(p=>[...(p.philosophy||[]),...(p.tags||[]),...(p.uiParts||[])]).filter(x=>String(x).length>1)).slice(0,3);
    const avoid=list.flatMap(p=>p.avoid||[]).find(Boolean)||'';
    return {first,feature,contexts,words,avoid};
  }

  function decorateLibraryCards(){
    document.querySelectorAll('.library-group-card').forEach(card=>{
      const ids=(card.dataset.patternIds||'').split('|').filter(Boolean);
      const summary=groupSummary(ids.map(byId));if(!summary)return;
      let panel=card.querySelector('.wb-card-decision');
      if(!panel){panel=document.createElement('div');panel.className='wb-card-decision';card.appendChild(panel);}
      const p=summary.first;
      panel.innerHTML=`<div class="wb-card-why"><div><small>特徴</small><p>${esc(summary.feature)}</p></div>${summary.contexts.length?`<div><small>効く場面</small><p>${esc(summary.contexts.join(' · '))}</p></div>`:''}${summary.avoid?`<div><small>向かない場面</small><p>${esc(summary.avoid)}</p></div>`:''}</div>${summary.words.length?`<div class="wb-card-words"><small>見る言葉</small>${summary.words.map(word=>`<span>${esc(word)}</span>`).join('')}</div>`:''}<div class="wb-card-actions"><button type="button" data-wb-save-id="${esc(p.id)}" class="${isSaved(p.id)?'is-saved':''}">${isSaved(p.id)?'✓ 保存済み':'＋ 参考にする'}</button><button type="button" data-wb-compare-id="${esc(p.id)}" class="${isCompared(p.id)?'is-compare':''}">${isCompared(p.id)?'↔ 比較中':'↔ 比較に追加'}</button></div>`;
    });
  }

  function toast(message,tone=''){
    let el=document.getElementById('wbToast');
    if(!el){el=document.createElement('div');el.id='wbToast';el.className='wb-toast';el.setAttribute('role','status');document.body.appendChild(el);}
    el.className=`wb-toast ${tone?`is-${tone}`:''}`;el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1700);
  }

  function renderGoalButtons(){
    if(!goalRoot)return;
    goalRoot.innerHTML=Object.entries(GOALS).map(([key,goal])=>`<button type="button" data-goal="${key}"><strong>${esc(goal.label)}</strong><span>${esc(goal.hint)}</span></button>`).join('');
  }

  function setupLearningDisclosure(){
    if(!learningDetails)return;
    let seen=false;try{seen=localStorage.getItem(KEYS.learningSeen)==='1';}catch{}
    if(!seen){learningDetails.open=true;try{localStorage.setItem(KEYS.learningSeen,'1');}catch{}}
  }

  goalRoot?.addEventListener('click',event=>{const btn=event.target.closest('[data-goal]');if(btn)showGoal(btn.dataset.goal);});
  projectSelect?.addEventListener('change',()=>{currentProject=projectSelect.value;saveProjectState();renderSaved();decorateLibraryCards();if(activeGoal)showGoal(activeGoal);});
  newProjectToggle?.addEventListener('click',()=>{if(newProjectForm)newProjectForm.hidden=!newProjectForm.hidden;if(newProjectForm&&!newProjectForm.hidden)newProjectName?.focus();});
  addProject?.addEventListener('click',()=>{
    const name=String(newProjectName?.value||'').trim().slice(0,40);if(!name)return;
    if(!projectNames.includes(name))projectNames.push(name);currentProject=name;projectData[name]=projectData[name]||[];if(newProjectName)newProjectName.value='';if(newProjectForm)newProjectForm.hidden=true;saveProjectState();renderProjectSelect();renderSaved();decorateLibraryCards();toast(`「${name}」を作りました`,'saved');
  });
  newProjectName?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();addProject?.click();}});
  clearRecent?.addEventListener('click',()=>{write(KEYS.recent,[]);renderRecent();});
  buildDecision?.addEventListener('click',buildDecisionBrief);
  copyDecision?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(decisionText?.textContent||'');copyDecision.textContent='コピー済み';setTimeout(()=>copyDecision.textContent='設計方針をコピー',1300);}catch{copyDecision.textContent='選択してコピー';}});

  document.addEventListener('click',event=>{
    const saveBtn=event.target.closest('[data-wb-save-id]');
    if(saveBtn){event.preventDefault();event.stopPropagation();const p=byId(saveBtn.dataset.wbSaveId);if(p)saveReference(itemFromPattern(p));if(activeGoal)showGoal(activeGoal);return;}
    const compareBtn=event.target.closest('[data-wb-compare-id]');
    if(compareBtn){event.preventDefault();event.stopPropagation();const p=byId(compareBtn.dataset.wbCompareId);if(p)toggleCompare(comparisonItem(p));return;}
    const removeSavedBtn=event.target.closest('[data-wb-remove-saved]');
    if(removeSavedBtn){event.preventDefault();removeSaved(removeSavedBtn.dataset.wbRemoveSaved);return;}
    const removeCompareBtn=event.target.closest('[data-wb-remove-compare]');
    if(removeCompareBtn){event.preventDefault();const item=compareItems.find(x=>x.id===removeCompareBtn.dataset.wbRemoveCompare);if(item)toggleCompare(item);return;}
    const mainLink=event.target.closest('.library-group-main');
    if(mainLink){const card=mainLink.closest('.library-group-card');const id=(card?.dataset.patternIds||'').split('|')[0];const p=byId(id);if(p)rememberRecent(itemFromPattern(p,mainLink.getAttribute('href')));return;}
    const refLink=event.target.closest('[data-wb-rec-open],[data-wb-saved-open],[data-wb-recent-open]');
    if(refLink){const id=refLink.dataset.wbRecOpen||refLink.dataset.wbSavedOpen||refLink.dataset.wbRecentOpen;const p=byId(id);if(p)rememberRecent(itemFromPattern(p,refLink.getAttribute('href')));}
  });

  document.addEventListener('likewhat:groups-rendered',decorateLibraryCards);
  window.addEventListener('likewhat:library-ready',decorateLibraryCards);

  renderGoalButtons();renderProjectSelect();renderRecent();renderSaved();renderCompareTray();setupLearningDisclosure();
})();
