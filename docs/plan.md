# Like What? — product plan

## 5人のプロによる設計会議

### 参加者
1. **プロダクトデザイナー** — 見た瞬間に違いが分かることを担当
2. **情報アーキテクト** — 100〜300パターンに増えた時の分類と検索を担当
3. **デザインシステム設計者** — 「ブランド名」から再利用可能な原則へ分解することを担当
4. **フロントエンドアーキテクト** — 静的サイトとして壊れにくく追加しやすい実装を担当
5. **AIプロンプト設計者** — 人間の「こんな感じ」をAIが再現しやすい指示へ翻訳することを担当

## 議論

### 1. プロダクトデザイナー
ブランド名だけを並べてもPinterest的な参考集で終わる。一覧カードの時点で「iOS Settings」と「Apple.com Product Hero」が別物だと視覚で分からなければいけない。**全カードにミニモックを必須**にする。

### 2. 情報アーキテクト
入口はブランド中心がよい。ただし将来「静か」「高密度」「右ペイン」「Progressive Disclosure」のような言葉からも探したくなる。分類階層を深くするより、`brand / family / tags / uiParts` をデータとして持ち、横断検索で解決する。

### 3. デザインシステム設計者
「Apple風」を色や角丸のコピーにしない。各パターンに「何がそう見せているか」を3〜4個の原則として持つ。**ブランドは発見の入口、原則は再利用の出口**にする。

### 4. フロントエンドアーキテクト
初期版はフレームワーク不要。GitHub Pagesで確実に動くHTML/CSS/Vanilla JSにする。パターン追加は `patterns.js` に1オブジェクト追加するだけ。詳細ページはquery parameterで共通テンプレートを使い、30個のHTMLを複製しない。

### 5. AIプロンプト設計者
「Appleっぽく」はAIにとって曖昧。AI向け指示文には、**構造 / 情報密度 / 階層 / 表示タイミング / 避けるもの**まで含める。詳細ページからそのままコピーできるようにする。

## 最終合意
- Primary navigation: **Brand**
- Secondary navigation: **Pattern type**
- Search: `brand / family / name / tags / principles / prompt` を横断
- Index: 初期30パターンすべてに視覚モック
- Detail: **言語化 → 視覚原則 → 向き不向き → AI指示 → 参考リンク**
- Mobile: フィルターをモーダル化せず横スクロール。画面を覆わない
- Data first: 新規パターンはデータ追加中心
- No clone policy: ブランドをそのまま再現するのではなく、特徴を抽象化した小さなモックとして表現

## コード設計

### File structure
```text
/
  index.html          # 検索・ブランド別一覧
  pattern.html        # 共通詳細ページ
  styles.css          # サイト + ミニモック
  patterns.js         # パターンデータ（Single Source of Truth）
  ui.js               # ミニモック描画
  app.js              # 一覧検索・filter・grouping
  pattern.js          # 詳細描画・関連候補・prompt copy
  docs/plan.md        # 設計判断
```

### Pattern schema
```js
{
  id,
  brand,
  family,
  name,
  oneLiner,
  description,
  tags: [],
  uiParts: [],
  visual: [],
  useCases: [],
  avoid: [],
  prompt,
  sourceLabel,
  sourceUrl,
  mock
}
```

### Search v1
初期版はAND検索。入力を空白で分割し、全語が `brand + family + name + tags + uiParts + visual + prompt` のどこかに含まれるパターンを表示する。検索結果の意外性より**予測可能性**を優先する。

### Expansion rule
新規パターン追加時は最低限 `visual 3件 / useCases / avoid / prompt / sourceUrl / mock` を持たせる。既存mockで表現できない場合のみ `ui.js` と `styles.css` に新しいmock typeを追加する。

## 初期30パターンの配分
- Apple: 6
- Notion: 4
- Linear: 4
- Arc: 2
- GitHub: 2
- Google: 2
- Stripe: 2
- Slack: 2
- Figma: 2
- Shopify: 2
- Airbnb: 1
- Vercel: 1
