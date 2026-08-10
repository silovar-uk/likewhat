window.LIKEWHAT_PATTERNS.push(
  {
    id:'eyewear-everyday-omnichannel',brand:'Eyewear',family:'Industry Cluster',groupType:'industry-cluster',industry:'Eyewear',name:'Everyday Omnichannel Eyewear',oneLiner:'フレーム・度数・レンズ・店舗という複雑さを、日常的な買い物へ変換する。',
    description:'Zoff、JINS、OWNDAYS、眼鏡市場に共通するのは、眼鏡購入を「店頭で専門家に一から相談する行為」だけに閉じず、商品探索、試着、度数情報、レンズ選択、店舗受取や交換をデジタルと店舗の間で連続させること。共通Grammarはセルフサービス化だが、各社がどこをデジタル化するかは異なる。',
    tags:['Omnichannel','Prescription Continuity','Faceted Search','Virtual Try-on','Service Bridge'],uiParts:['Product Discovery','Prescription','Lens Selection','Store Bridge'],visual:['商品探索と視力・度数情報を別階層として扱う','オンラインで完結できない工程を店舗への導線として設計する','フレーム選択後にレンズ・度数という専門情報を段階表示する','大量商品を形・サイズ・用途など認識可能な条件へ変換する'],useCases:['眼鏡EC','店舗連携EC','専門商品コマース','フィッティングを伴う購買'],avoid:['完全デジタルで完結する単純EC','一点物ラグジュアリーの世界観訴求'],prompt:'Zoff / JINS / OWNDAYS / 眼鏡市場に共通するように、商品探索・個人の度数情報・オプション選択・店舗サービスを一続きの購入体験として設計してください。専門情報を最初から一度に見せず、ユーザーが今決める必要のある選択肢だけを段階的に開示してください。',
    sourceLabel:'Official eyewear service references',sourceUrl:'https://www.jins.com/jp/about/onlineshop/',domain:'Retail / Eyewear',medium:'Web + Mobile + Store',archetype:'Omnichannel Prescription Commerce',interactionModel:'Discover frame → confirm prescription → choose lens → buy or continue in store',philosophy:['Everyday accessibility','Service continuity','Progressive expertise','Digital and physical handoff'],designSpace:{density:68,emotion:42,exploration:42,authority:56,interaction:76,order:90},mock:'eyewear-omnichannel',
    memberBrands:['Zoff','JINS','OWNDAYS','眼鏡市場'],members:[
      {brand:'Zoff',role:'Feature / prescription-led',note:'店舗・オンライン双方の購入履歴や度数情報を再利用し、度数が不明ならレンズ交換券で店舗へ接続する。',sourceLabel:'Zoff — 度付きメガネの注文方法',sourceUrl:'https://faq.zoff.co.jp/%E3%80%90%E3%82%AA%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%82%A2%E3%80%91%E5%BA%A6%E4%BB%98%E3%81%8D%E3%83%A1%E3%82%AC%E3%83%8D%E3%81%AE%E6%B3%A8%E6%96%87%E6%96%B9%E6%B3%95-6850c6510429b3b27ab47b20'},
      {brand:'JINS',role:'Account / prescription continuity',note:'度数登録、購入、保証書・度数管理、3D試着、店舗在庫確認をアカウントとアプリへ集約する。',sourceLabel:'JINSオンラインショップについて',sourceUrl:'https://www.jins.com/jp/about/onlineshop/'},
      {brand:'OWNDAYS',role:'Virtual try-on / store bridge',note:'AR試着、過去度数の利用、レンズ交換をオンラインへ広げつつ、難しいケースは店舗専門スタッフへ戻す。',sourceLabel:'OWNDAYS — バーチャル試着',sourceUrl:'https://www.owndays.com/jp/ja/try-on'},
      {brand:'眼鏡市場',role:'Specification / faceted selection',note:'形状・サイズ・カラー・ブランド・価格など眼鏡固有の属性をファセット化し、大量のフレームを条件から絞る。',sourceLabel:'眼鏡市場 — 商品検索',sourceUrl:'https://www.meganeichiba.jp/shop/goods/search.aspx'}
    ]
  },
  {
    id:'eyewear-identity-fashion',brand:'Eyewear',family:'Industry Cluster',groupType:'industry-cluster',industry:'Eyewear',name:'Eyewear as Identity',oneLiner:'「見えるための道具」を、「自分がどう見えるか」を選ぶインターフェースへ変える。',
    description:'Ray-Ban、EYEVAN、Gentle Monsterでは、眼鏡は視力矯正器具だけでなく自己表現の媒体になる。商品属性を検索するより、アイコンモデル、編集的世界観、コレクションの物語から「自分がどう見えるか」を想像させる。Identityを起点にしながら、Ray-Banはカスタマイズ、EYEVANはファッション編集、Gentle Monsterは実験的コレクションへ分岐する。',
    tags:['Identity','Editorial Commerce','Customization','Collection Story','Fashion'],uiParts:['Collection','Customization','Editorial','Product'],visual:['製品単体より着用イメージやコレクションを大きく扱う','モデル名やシルエットを強い識別記号にする','仕様選択を自己表現のカスタマイズとして見せる','ブランド世界観から商品へ降りる階層を作る'],useCases:['ファッションEC','アクセサリー','カスタム製品','ブランドコレクション'],avoid:['制度的申請','高密度な業務管理'],prompt:'Ray-Ban / EYEVAN / Gentle Monsterのように、商品を仕様表から選ばせるだけでなく「この製品を身につけた自分」を想像できる編集構造にしてください。Icon、Editorial、Experimental Collectionのいずれを主軸にするか明確にし、商品選択をIdentityの選択として設計してください。',
    sourceLabel:'Official eyewear identity references',sourceUrl:'https://www.ray-ban.com/japan/c/customize',domain:'Fashion / Eyewear',medium:'Web + Retail',archetype:'Identity-led Fashion Commerce',interactionModel:'Enter collection/icon → imagine identity → customize or select → purchase',philosophy:['Identity before specification','Editorial desire','Product as cultural sign','Choice as self-expression'],designSpace:{density:38,emotion:84,exploration:82,authority:18,interaction:58,order:62},mock:'eyewear-identity',
    memberBrands:['Ray-Ban','EYEVAN','Gentle Monster'],members:[
      {brand:'Ray-Ban',role:'Icon-led customization',note:'Wayfarer等の強いモデル記号を起点に、フレーム・レンズ・刻印を個人化し、対応モデルではバーチャル試着で確認する。',sourceLabel:'Ray-Ban — Customize',sourceUrl:'https://www.ray-ban.com/japan/c/customize'},
      {brand:'EYEVAN',role:'Editorial fashion',note:'「着るメガネ」という思想から、眼鏡をファッションアイテムとして編集し、文化とクラフトを背景に置く。',sourceLabel:'EYEVAN — About',sourceUrl:'https://www.eyevan.com/about/?lang=lang'},
      {brand:'Gentle Monster',role:'Experimental collection',note:'コレクションごとに形態・ディテール・キャンペーン世界を作り、眼鏡そのものをステートメントピースとして提示する。',sourceLabel:'Gentle Monster — 2026 Collection',sourceUrl:'https://www.gentlemonster.com/jp/ja/stories/2026-collection/'}
    ]
  },
  {
    id:'eyewear-engineering-craft',brand:'Eyewear',family:'Industry Cluster',groupType:'industry-cluster',industry:'Eyewear',name:'Engineering & Craft Provenance',oneLiner:'製品の価値を「見た目」ではなく、機能の必然性と作り手の由来から説明する。',
    description:'999.9と金子眼鏡はどちらも製品の背後にあるものづくりを信頼の根拠にする。ただし999.9は「掛けやすい・壊れにくい・調整しやすい」という機能から形を説明し、金子眼鏡は自社工場・工程・職人というMaker Provenanceから品質を説明する。結果ではなく「なぜこの形・品質になるのか」を可視化するProduct Storytelling。',
    tags:['Provenance','Function becomes Form','Craft','Product Story','Trust'],uiParts:['Philosophy','Factory Story','Product Detail','Mechanism'],visual:['製品写真と機構・工程の説明を往復させる','ブランド史や工場を商品の外側ではなく価値証拠として置く','装飾的コピーより機能・素材・工程の因果を示す','長期使用を想起させる静かな情報設計にする'],useCases:['工芸品','高品質プロダクト','製造業ブランド','専門用品'],avoid:['価格だけで比較する大量EC','瞬間的なキャンペーンLP'],prompt:'999.9 / 金子眼鏡のように、商品の価値を「高級そう」ではなく機能・設計・工程・作り手の因果で説明してください。Function → Form または Maker → Process → Product のどちらを信頼の主線にするか明確にし、由来を商品理解へ接続してください。',
    sourceLabel:'Official engineering and craft references',sourceUrl:'https://www.fournines.co.jp/collections/999-9/',domain:'Craft / Eyewear',medium:'Web + Physical Product',archetype:'Provenance-led Product Narrative',interactionModel:'Understand philosophy → inspect mechanism/process → inspect product → trust choice',philosophy:['Evidence before prestige','Function creates form','Maker provenance','Durable trust'],designSpace:{density:36,emotion:30,exploration:40,authority:72,interaction:34,order:94},mock:'eyewear-craft',
    memberBrands:['999.9','金子眼鏡'],members:[
      {brand:'999.9',role:'Function → Form',note:'「眼鏡は道具である」を起点に、掛けやすさ・壊れにくさ・調整しやすさを追求した結果として美しい形を説明する。',sourceLabel:'999.9 — 眼鏡は道具である',sourceUrl:'https://www.fournines.co.jp/collections/999-9/'},
      {brand:'金子眼鏡',role:'Maker → Process → Product',note:'自社工場で企画・切削・加工・研磨・組立・調整までを一貫し、職人と工程そのものを品質の根拠として提示する。',sourceLabel:'金子眼鏡 — Factory',sourceUrl:'https://www.kaneko-optical.co.jp/en/factory?lang=en'}
    ]
  },
  {
    id:'eyewear-professional-consultation',brand:'Eyewear',family:'Industry Cluster',groupType:'industry-cluster',industry:'Eyewear',name:'Professional Fitting & Consultation',oneLiner:'UIだけで解決せず、「適切な人に相談できること」をサービスのインターフェースにする。',
    description:'PARIS MIKIを代表例に、眼鏡作製技能士など人間の専門性を購買体験へ組み込むパターン。自己選択を最大化するECとは逆に、測定、フィッティング、用途理解、アフターケアを専門家との対話で解く。デジタルの役割は専門家を置き換えることではなく、適切な店舗・技能・相談へ到達させるWayfindingになる。',
    tags:['Human Expertise','Consultation','Professional Service','Trust','Service Design'],uiParts:['Expert Finder','Store Search','Consultation','Aftercare'],visual:['商品より相談・技能・店舗を同等以上の入口として扱う','資格や専門性を信頼の証拠として明示する','自己診断で完結させず相談へ自然にエスカレーションする','購入後の調整・ケアを体験の一部に置く'],useCases:['医療周辺サービス','専門販売','フィッティング','高関与購買'],avoid:['完全セルフサービスのみを価値とするサービス','娯楽的探索フィード'],prompt:'PARIS MIKIの専門フィッティングのように、専門家への相談そのものをインターフェースの一部として設計してください。ユーザーが商品を自力で選び切れないことを失敗扱いせず、適切な資格・店舗・相談・アフターケアへ滑らかにエスカレーションできる構造にしてください。',
    sourceLabel:'PARIS MIKI — 眼鏡作製技能士',sourceUrl:'https://www.paris-miki.co.jp/afterservice/professional_optician/',domain:'Professional Service / Eyewear',medium:'Web + Store + Human Service',archetype:'Human-expertise Service Interface',interactionModel:'Recognize need → find qualified expert → consult/measure → fit → receive aftercare',philosophy:['Human expertise as interface','Escalation is not failure','Trust through qualification','Service continues after purchase'],designSpace:{density:44,emotion:28,exploration:18,authority:90,interaction:54,order:96},mock:'eyewear-consultation',
    memberBrands:['PARIS MIKI'],members:[
      {brand:'PARIS MIKI',role:'Qualified human consultation',note:'眼鏡作製技能士という専門資格を明示し、適切な眼鏡作製と目の健康を支える専門サービスを前面に置く。',sourceLabel:'PARIS MIKI — 眼鏡作製技能士',sourceUrl:'https://www.paris-miki.co.jp/afterservice/professional_optician/'}
    ]
  }
);
