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

  const unique=(arr)=>arr.filter((x,i,a)=>a.findIndex(y=>y.term===x.term)===i);
  const has=(text,...words)=>words.some(w=>text.includes(String(w).toLowerCase()));

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
    if(has(text,'settings','form','properties','explainer')){implementation.push(T.semantic,T.state);design.push(T.affordance,T.progressive,T.proximity);philosophy.push(T.familiarity||T.recognition,T.progressiveComplexity);}
    if(has(text,'editor','document','longform','article','brand voice')){implementation.push(T.measure,T.flexbox);design.push(T.typographic,T.scannability,T.negativeSpace);philosophy.push(T.contentFirst,T.calm);}
    if(has(text,'hero','marketing','product hero')){implementation.push(T.aspect,T.flexbox);design.push(T.negativeSpace,T.typographic,T.figureGround);philosophy.push(T.contentFirst,T.simplicity);}
    if(has(text,'dashboard','metrics','financial')){implementation.push(T.cssGrid,T.intrinsic);design.push(T.density,T.chromatic,T.overviewDetail);philosophy.push(T.overviewDetail,T.calm);}
    if(has(text,'navigation','tabs','outline')){implementation.push(T.flexbox,T.sticky);design.push(T.ia,T.proximity,T.affordance);philosophy.push(T.spatialMemory,T.familiarity||T.recognition);}
    if(has(text,'omocoro','jump','shueisha','nintendo','magazine')){design.push(T.editorial,T.typographic,T.infoScent);philosophy.push(T.contentFirst,T.discoveryEfficiency);}

    return {
      implementation:unique(implementation).slice(0,5),
      design:unique(design).slice(0,6),
      philosophy:unique(philosophy).slice(0,5)
    };
  }

  function searchText(p){
    const v=forPattern(p);
    return [...v.implementation,...v.design,...v.philosophy].flatMap(x=>[x.term,x.ja,x.note]).join(' ');
  }

  window.LikeWhatVocabulary={forPattern,searchText};
})();
