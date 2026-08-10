(function(){
  const term=(term,ja,note)=>({term,ja,note});
  const T={
    cssGrid:term('CSS Grid / Two-dimensional layout','CSS Grid／二次元レイアウト','行と列を同時に制御し、複数ペインやカード群の整列を担保する実装構造。'),
    flexbox:term('Flexbox / One-dimensional alignment','Flexbox／一次元整列','横一列または縦一列の配置、間隔、伸縮を扱うレイアウトモデル。'),
    sticky:term('Sticky positioning','Sticky positioning／追従配置','スクロール文脈を維持したまま、ナビゲーションや補助情報を一定位置に保持する。'),
    responsive:term('Responsive composition','レスポンシブ・コンポジション','単なる縮小ではなく、画面幅に応じて情報密度・列数・優先順位を再構成する。'),
    focus:term('Focus management','フォーカス管理','キーボード操作時の現在位置、初期フォーカス、復帰位置を制御する。'),
    keyboard:term('Keyboard-first interaction','キーボードファースト・インタラクション','ショートカット、矢印選択、Enter実行などを主要操作経路として設計する。'),
    overlay:term('Overlay layer / stacking context','オーバーレイ層／スタッキングコンテキスト','モーダル、シート、フローティングUIを本文レイヤーと分離して重ねる。'),
    semantic:term('Semantic grouping','セマンティック・グルーピング','見た目だけでなくDOM上でも関連項目を意味単位にまとめる。'),
    clientFilter:term('Client-side faceted filtering','クライアントサイド・ファセット検索','ブランド、用途、語彙など複数の属性軸で即時に絞り込む。'),
    state:term('UI state machine','UIステートマシン','open / closed、selected / unselectedなど、状態遷移を明示的に扱う。'),
    intrinsic:term('Intrinsic sizing','Intrinsic sizing／内在サイズ','内容量を基準にmin/max幅や可変列を決め、過剰な固定幅を避ける。'),
    measure:term('Readable measure','可読行長','本文の横幅を制御し、長文の視線移動距離を抑える。'),
    aspect:term('Aspect-ratio constraint','アスペクト比制約','カード、表紙、キービジュアルなどの視覚比率を一貫させる。'),
    hierarchy:term('Visual hierarchy','視覚的階層','サイズ、ウェイト、余白、位置、色の差で情報の優先順位を示す。'),
    ia:term('Information Architecture (IA)','情報アーキテクチャ','情報を分類・階層化し、ユーザーが現在地と次の行動を理解できる構造を作る。'),
    progressive:term('Progressive disclosure','段階的開示','高度な情報や操作を必要になるまで隠し、初期認知負荷を抑える。'),
    proximity:term('Gestalt: Proximity','ゲシュタルト原則：近接','近い要素同士を同じグループとして知覚させる。'),
    figureGround:term('Figure–ground separation','図と地の分離','主役コンテンツと背景・補助UIの視覚的な前後関係を明確にする。'),
    density:term('Information density management','情報密度マネジメント','一画面あたりの情報量を、操作頻度と可読性のバランスで調整する。'),
    editorial:term('Editorial rhythm','エディトリアル・リズム','カードサイズ、見出し、余白、画像比率に強弱をつけ、一覧に読む順序を作る。'),
    typographic:term('Typographic hierarchy','タイポグラフィック・ヒエラルキー','文字サイズ、太さ、行間、字間でタイトル・本文・メタ情報の役割を分ける。'),
    miniIA:term('Mini-IA','ミニ情報アーキテクチャ','1カードや1行の内部でも、重要属性→補助属性の順に小さな情報階層を設計する。'),
    masterDetail:term('Master–detail pattern','マスター・ディテール','一覧を保持したまま選択対象の詳細を隣接ペインに表示する。'),
    splitView:term('Split view','スプリットビュー','複数の情報領域を並置し、移動コストを下げながら比較・編集する。'),
    contextual:term('Contextual controls','コンテクスチュアル・コントロール','選択対象や状態に応じ、その場で必要な操作だけを提示する。'),
    affordance:term('Affordance & signifier','アフォーダンス／シグニファイア','何が操作でき、どう操作するかを形・配置・ラベルで知覚可能にする。'),
    modular:term('Modular grid','モジュラーグリッド','反復可能な列・行・余白単位で、異種コンテンツを秩序立てる。'),
    negativeSpace:term('Negative space','ネガティブスペース','空白を装飾ではなく、焦点形成とグルーピングのための能動的要素として使う。'),
    chromatic:term('Chromatic restraint','色彩抑制','色を装飾ではなく状態・優先度・ブランドアクセントに限定して使う。'),
    scannability:term('Scannability','スキャナビリティ','流し読みでも重要情報を拾えるよう、見出し・太字・整列・反復構造を設計する。'),
    infoScent:term('Information scent','情報の手がかり','リンクやカードの文言から、遷移先で得られる情報を予測できるようにする。'),
    recognition:term('Recognition over recall','想起より再認','記憶から思い出させるより、見れば分かる選択肢や状態を提示する。'),
    preserveContext:term('Preserve context','文脈保持','遷移や編集の前後で、ユーザーの現在地・選択・スクロール位置を失わせない。'),
    agency:term('User agency','ユーザー・エージェンシー','操作の自由度、戻れること、選択可能性を担保し、システム都合で行動を固定しない。'),
    cognitive:term('Cognitive-load management','認知負荷マネジメント','同時に判断させる情報・選択肢・操作を整理し、ワーキングメモリへの要求を抑える。'),
    contentFirst:term('Content-first design','コンテンツファースト','UI chromeではなく、ユーザーが見たい本文・作品・データを主役に据える。'),
    spatialMemory:term('Spatial memory','空間記憶','項目や操作の位置を安定させ、場所そのものを手がかりとして学習できるようにする。'),
    direct:term('Direct manipulation','直接操作','対象と操作結果の距離を縮め、選択したものをその場で編集・移動・変更できるようにする。'),
    calm:term('Calm interface','カーム・インターフェイス','常に注意を奪わず、必要な状態変化だけを適切な強度で通知する。'),
    simplicity:term('Simplicity ≠ minimalism','シンプリシティ≠ミニマリズム','要素数を減らすこと自体ではなく、目的に必要な要素だけが理解可能な形で存在する状態を目指す。'),
    progressiveComplexity:term('Progressive complexity','段階的複雑性','初心者には単純な入口を、必要に応じて上級機能へ深く進める構造を作る。'),
    overviewDetail:term('Overview → detail','概要から詳細へ','まず全体像を提示し、必要な対象だけを深掘りできる情報探索モデル。'),
    discoveryEfficiency:term('Discovery–efficiency trade-off','発見性と効率性のトレードオフ','偶然の発見を促す構成と、最短操作を優先する構成のどこに重心を置くかを設計する。')
  };

  const categoryMap={
    cssGrid:'Implementation',flexbox:'Implementation',sticky:'Implementation',responsive:'Implementation',focus:'Implementation',keyboard:'Implementation',overlay:'Implementation',semantic:'Implementation',clientFilter:'Implementation',state:'Implementation',intrinsic:'Implementation',measure:'Implementation',aspect:'Implementation',
    hierarchy:'Visual Design',proximity:'Visual Design',figureGround:'Visual Design',density:'Visual Design',editorial:'Visual Design',typographic:'Visual Design',modular:'Visual Design',negativeSpace:'Visual Design',chromatic:'Visual Design',scannability:'Visual Design',
    ia:'Information Architecture',miniIA:'Information Architecture',infoScent:'Information Architecture',overviewDetail:'Information Architecture',
    progressive:'Interaction Design',masterDetail:'Interaction Design',splitView:'Interaction Design',contextual:'Interaction Design',affordance:'Interaction Design',direct:'Interaction Design',
    recognition:'Cognitive / Philosophy',preserveContext:'Cognitive / Philosophy',agency:'Cognitive / Philosophy',cognitive:'Cognitive / Philosophy',contentFirst:'Cognitive / Philosophy',spatialMemory:'Cognitive / Philosophy',calm:'Cognitive / Philosophy',simplicity:'Cognitive / Philosophy',progressiveComplexity:'Cognitive / Philosophy',discoveryEfficiency:'Cognitive / Philosophy'
  };

  const E=[
    ['Maximalism','マキシマリズム','Visual Design','余白や焦点を絞るのではなく、情報・装飾・訴求を高密度に共存させ、量そのものを体験価値にする設計。'],
    ['Visual Cacophony','視覚的カコフォニー','Visual Design','複数の強い焦点が競合する状態を、混乱として排除せず活気・緊迫・探索性として利用する。'],
    ['Dense Signage','高密度サイネージ','Information Architecture','多量の案内・価格・カテゴリ情報を狭い領域へ集約し、局所的なまとまりで読み分けさせる。'],
    ['Commercial Urgency','商業的緊迫感','Cognitive / Philosophy','限定・価格・残数・締切などを強く前景化し、判断を先延ばししにくい心理状態を作る。'],
    ['Playful Affordance','遊びを誘うアフォーダンス','Interaction Design','操作可能性を説明だけでなく、形・反応・動きによって「触ってみたい」感情として伝える。'],
    ['Juicy Interaction','ジューシーなインタラクション','Interaction Design','入力に対して視覚・音・動きなど複数のフィードバックを返し、操作そのものに手応えを持たせる。'],
    ['Reward Loop','報酬ループ','Cognitive / Philosophy','小さな操作と報酬を短い周期で繰り返し、継続的な探索や参加を促す構造。'],
    ['Brand Primacy','ブランド優先','Cognitive / Philosophy','操作効率や説明量より、ブランドの世界観・距離感・記憶形成を上位目的として設計する。'],
    ['Deliberate Friction','意図的摩擦','Interaction Design','最短操作をあえて選ばず、待つ・読む・探索する工程を体験価値や判断の重みとして残す。'],
    ['Atmospheric Interface','雰囲気を設計するUI','Visual Design','情報伝達だけでなく、写真・余白・文字・速度・沈黙を通して空気感や心理距離を形成する。'],
    ['Scarcity of Signifiers','シグニファイアの希少化','Interaction Design','操作可能性の手がかりを必要最小限にし、説明過多を避けながら緊張感やブランド距離を保つ。'],
    ['Menu Choreography','メニュー・コレオグラフィ','Interaction Design','選択・遷移・状態変化を静的な画面切替ではなく、動きの連続として演出し意味づける。'],
    ['HUD','ヘッドアップディスプレイ','Information Architecture','主要状態を視線移動やモード遷移を減らしながら常時参照できる位置へ重ねて提示する。'],
    ['State Legibility','状態の可読性','Interaction Design','選択中・使用可能・危険・完了などのシステム状態を、瞬時に判別できる形で可視化する。'],
    ['Desktop Metaphor','デスクトップ・メタファー','Information Architecture','ファイルや窓を空間上の物体として扱い、ページ階層より場所・位置関係をナビゲーションに使う。'],
    ['Object-oriented UI','オブジェクト指向UI','Interaction Design','機能メニュー起点ではなく、対象物を選び、その対象に可能な操作を提示する操作モデル。'],
    ['Persistent Chrome','永続的クローム','Information Architecture','ナビゲーションやシステム状態などのUI骨格を画面遷移後も同じ位置に維持する。'],
    ['Spatial IA','空間情報アーキテクチャ','Information Architecture','カテゴリ階層だけでなく、位置・距離・方向・ズームそのものを情報構造として利用する。'],
    ['Progressive Zoom','段階的ズーム','Interaction Design','拡大・縮小に応じて情報の粒度と種類を切り替え、同一空間のまま詳細度を変える。'],
    ['Wayfinding','ウェイファインディング','Information Architecture','現在地、目的地、進む方向、ランドマークを手がかりに、人が迷わず空間を移動できるようにする設計。'],
    ['Geospatial Hierarchy','地理空間的階層','Information Architecture','距離・範囲・ズームレベルに応じて、場所情報の優先順位と表示粒度を変える。'],
    ['Information Compression','情報圧縮','Visual Design','省略・略号・位置・色・反復構造を使い、狭い画面へ高い情報量を保持する。'],
    ['Peripheral Awareness','周辺視的アウェアネス','Cognitive / Philosophy','主タスクに集中したまま、周辺領域の状態変化や異常を低コストで察知できるようにする。'],
    ['Data Salience','データ顕著性','Visual Design','大量の数値の中から、変化・異常・重要値だけが先に知覚されるよう視覚差を設計する。'],
    ['Editorial Voice','編集的な声','Cognitive / Philosophy','中立的なUI文言ではなく、選び方・語り口・配置そのものに編集主体の人格を持たせる。'],
    ['Cultural Coding','文化的コーディング','Cognitive / Philosophy','特定の共同体・時代・趣味に共有された記号や文体を使い、所属感や文脈理解を形成する。'],
    ['Anti-template','アンチテンプレート','Visual Design','均質なコンポーネント反復を意図的に崩し、コンテンツごとの固有性をレイアウトへ反映する。'],
    ['Hypertext-first','ハイパーテキスト・ファースト','Information Architecture','アプリ的な画面遷移より、文書とリンクのネットワークを情報探索の中心に置く。'],
    ['Document-centric Web','文書中心のWeb','Information Architecture','画面をアプリ状態ではなく、安定したURLを持つ文書の集合として構成する。'],
    ['Content Addressability','コンテンツのアドレス可能性','Implementation','情報単位が固有URLやアンカーを持ち、直接参照・共有・再訪できる性質。'],
    ['Environmental Graphic Design','環境グラフィックデザイン','Visual Design','サイン、色、文字、床・壁などを使い、物理空間の意味と移動を視覚的に支援する。'],
    ['Choice Architecture','選択アーキテクチャ','Cognitive / Philosophy','選択肢の順序・既定値・提示方法を設計し、人の判断を強制せず方向づける。'],
    ['Physical Affordance','物理的アフォーダンス','Interaction Design','形状、重さ、配置、素材などから、物体をどう扱えるかが自然に推測できる性質。'],
    ['Ritualized Interaction','儀式化されたインタラクション','Interaction Design','確認・待機・抽選・申込などの段階を儀式として構成し、行為の重みや期待感を作る。'],
    ['Anticipation','予期・期待','Cognitive / Philosophy','結果がまだ出ていない時間を空白にせず、期待・緊張・準備の体験として設計する。'],
    ['Commitment Device','コミットメント装置','Cognitive / Philosophy','先に意思表示や手間を要求することで、その後の行動を継続しやすくする仕組み。'],
    ['Plain Language','プレイン・ランゲージ','Information Architecture','専門家の内部用語ではなく、利用者が一読で行動を判断できる平易で具体的な言葉を使う。'],
    ['Error Prevention','エラー予防','Interaction Design','失敗後の説明だけでなく、入力制約・既定値・確認・選択肢設計によって誤操作そのものを減らす。'],
    ['Accessibility-first','アクセシビリティ・ファースト','Cognitive / Philosophy','後付け対応ではなく、知覚・操作・理解の多様性を初期設計条件として扱う。'],
    ['Institutional Trust','制度的信頼','Cognitive / Philosophy','一貫性、明確な責任主体、予測可能な手続きによって、公的・制度的な安心感を形成する。'],
    ['Context-sensitive Disclosure','文脈依存の段階的開示','Interaction Design','現在地・選択対象・ズーム・状態に応じ、必要な情報だけをその場で開示する。']
  ].map(([term,ja,category,note])=>({term,ja,category,note,source:'curated'}));

  const slug=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[–—→≠&/()]/g,' ').replace(/[^a-z0-9ぁ-んァ-ヶ一-龠ー]+/g,'-').replace(/^-+|-+$/g,'');
  Object.entries(T).forEach(([key,value])=>{value.category=categoryMap[key]||'Cognitive / Philosophy';value.id=slug(value.term);value.source='core';});
  E.forEach(value=>value.id=slug(value.term));

  const unique=(arr)=>arr.filter((x,i,a)=>a.findIndex(y=>y.term===x.term)===i);
  const has=(text,...words)=>words.some(w=>text.includes(String(w).toLowerCase()));
  const normalize=value=>String(value||'').normalize('NFKC').trim().toLowerCase();

  function forPattern(p){
    const text=[p.brand,p.family,p.name,p.oneLiner,...(p.tags||[]),...(p.uiParts||[]),p.mock].join(' ').toLowerCase();
    const implementation=[T.responsive,T.semantic];
    const design=[T.hierarchy,T.ia];
    const philosophy=[T.cognitive,T.simplicity];
    if(has(text,'sidebar','three pane','split','canvas','workspace','master','detail pane')){implementation.push(T.cssGrid,T.intrinsic,T.sticky);design.push(T.splitView,T.masterDetail,T.proximity);philosophy.push(T.preserveContext,T.spatialMemory);}
    if(has(text,'command','keyboard','slash')){implementation.push(T.keyboard,T.focus,T.state);design.push(T.progressive,T.contextual,T.affordance);philosophy.push(T.progressiveComplexity,T.agency);}
    if(has(text,'sheet','modal','overlay','floating','toolbar')){implementation.push(T.overlay,T.state,T.focus);design.push(T.progressive,T.contextual,T.figureGround);philosophy.push(T.preserveContext,T.direct);}
    if(has(text,'card','feed','catalog','discovery','shelf','portal','editorial','topics')){implementation.push(T.cssGrid,T.aspect);design.push(T.modular,T.miniIA,T.editorial,T.infoScent);philosophy.push(T.recognition,T.overviewDetail,T.discoveryEfficiency);}
    if(has(text,'list','table','issue','database','deploy','settings')){implementation.push(T.cssGrid,T.intrinsic);design.push(T.density,T.miniIA,T.proximity,T.chromatic);philosophy.push(T.recognition,T.calm,T.spatialMemory);}
    if(has(text,'settings','form','properties','explainer')){implementation.push(T.semantic,T.state);design.push(T.affordance,T.progressive,T.proximity);philosophy.push(T.recognition,T.progressiveComplexity);}
    if(has(text,'editor','document','longform','article','brand voice')){implementation.push(T.measure,T.flexbox);design.push(T.typographic,T.scannability,T.negativeSpace);philosophy.push(T.contentFirst,T.calm);}
    if(has(text,'hero','marketing','product hero')){implementation.push(T.aspect,T.flexbox);design.push(T.negativeSpace,T.typographic,T.figureGround);philosophy.push(T.contentFirst,T.simplicity);}
    if(has(text,'dashboard','metrics','financial')){implementation.push(T.cssGrid,T.intrinsic);design.push(T.density,T.chromatic,T.overviewDetail);philosophy.push(T.overviewDetail,T.calm);}
    if(has(text,'navigation','tabs','outline')){implementation.push(T.flexbox,T.sticky);design.push(T.ia,T.proximity,T.affordance);philosophy.push(T.spatialMemory,T.recognition);}
    if(has(text,'omocoro','jump','shueisha','nintendo','magazine')){design.push(T.editorial,T.typographic,T.infoScent);philosophy.push(T.contentFirst,T.discoveryEfficiency);}
    return {implementation:unique(implementation).slice(0,5),design:unique(design).slice(0,6),philosophy:unique(philosophy).slice(0,5)};
  }

  function rawTermsForPattern(p){
    return [...(p.tags||[]),...(p.implementationTerms||[]),...(p.designTerms||[]),...(p.philosophyTerms||[]),...(p.philosophy||[])];
  }

  function searchText(p){
    const v=forPattern(p);
    return [...v.implementation,...v.design,...v.philosophy].flatMap(x=>[x.term,x.ja,x.note]).join(' ');
  }

  function allTerms(){
    return [...Object.values(T),...E].sort((a,b)=>a.term.localeCompare(b.term,'en'));
  }

  function termMatchesPattern(node,p){
    const inferred=[...forPattern(p).implementation,...forPattern(p).design,...forPattern(p).philosophy];
    if(inferred.some(x=>normalize(x.term)===normalize(node.term)))return true;
    const raw=rawTermsForPattern(p).map(normalize);
    const candidates=[normalize(node.term),normalize(node.term.split(' / ')[0]),normalize(node.ja)];
    return candidates.some(c=>c&&raw.some(r=>r===c||r.includes(c)||c.includes(r)));
  }

  function patternsForTerm(node,patterns){
    return (patterns||[]).filter(p=>termMatchesPattern(node,p));
  }

  function termsForPattern(p){
    const inferred=[...forPattern(p).implementation,...forPattern(p).design,...forPattern(p).philosophy];
    const raw=rawTermsForPattern(p).map(normalize);
    const extras=E.filter(node=>raw.some(r=>r===normalize(node.term)||r.includes(normalize(node.term))||normalize(node.term).includes(r)));
    return unique([...inferred,...extras]);
  }

  function relatedTerms(node,patterns,limit=8){
    const hits=patternsForTerm(node,patterns);
    const scores=new Map();
    hits.forEach(p=>termsForPattern(p).forEach(other=>{
      if(normalize(other.term)===normalize(node.term))return;
      scores.set(other.term,(scores.get(other.term)||0)+1);
    }));
    return allTerms().filter(t=>scores.has(t.term)).map(t=>({...t,score:scores.get(t.term)})).sort((a,b)=>b.score-a.score||a.term.localeCompare(b.term,'en')).slice(0,limit);
  }

  function findTerm(value){
    const q=normalize(value);
    return allTerms().find(t=>normalize(t.term)===q||normalize(t.id)===q||normalize(t.ja)===q)||allTerms().find(t=>normalize(t.term).includes(q)||normalize(t.ja).includes(q));
  }

  function linkPatternLexicon(){
    document.querySelectorAll('.lexicon-item strong').forEach(el=>{
      if(el.querySelector('a'))return;
      const node=findTerm(el.textContent);
      if(!node)return;
      const a=document.createElement('a');
      a.href=`vocabulary.html?term=${encodeURIComponent(node.term)}`;
      a.textContent=el.textContent;
      a.className='vocabulary-inline-link';
      el.textContent='';el.appendChild(a);
    });
  }
  document.addEventListener('DOMContentLoaded',linkPatternLexicon);

  window.LikeWhatVocabulary={forPattern,searchText,allTerms,patternsForTerm,termsForPattern,relatedTerms,findTerm,slug,categories:['Implementation','Interaction Design','Visual Design','Information Architecture','Cognitive / Philosophy']};
})();
