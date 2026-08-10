# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚文法・実装構造・設計思想・AI向け指示文へ変換する個人用リファレンスライブラリです。

## What it does

- 既存ブランド / サービスを主入口にパターンを探す
- 一覧のミニモックで違いを視覚的に確認する
- 「Visual Hierarchy」「Progressive Disclosure」「Editorial Rhythm」「Master–detail」などの専門語でも横断検索する
- 各パターンを **Implementation / Design System / Philosophy** の3層で言語化する
- 異なるブランドからランダムに3パターンを抽出し、意図的なセレンディピティを作る
- AIへそのまま渡せる、専門語彙付きの設計指示をコピーする
- 公式プロダクト / デザインシステムへの参考リンクを持つ

## Library

39 patterns across Apple, Notion, Linear, Arc, GitHub, Google, Stripe, Slack, Figma, Shopify, Airbnb, Vercel, オモコロ, 集英社 and Nintendo.

## Design grammar

`vocabulary.js` がパターンのブランド、family、tags、UI parts、mock typeから専門語彙を推定します。

- **Implementation**: CSS Grid, responsive composition, focus management, UI state machine, semantic grouping...
- **Design System**: Visual hierarchy, Information Architecture, Progressive disclosure, Mini-IA, Editorial rhythm, Master–detail...
- **Philosophy**: Recognition over recall, User agency, Cognitive-load management, Preserve context, Content-first design...

これらの語彙は詳細ページ表示だけでなく、全文検索とAI向け設計指示にも使用します。

## Add a pattern

基本スキーマと追加ルールは [`docs/plan.md`](docs/plan.md) を参照してください。初期パターンは `patterns.js`、追加セットは `patterns-extra.js` に保持しています。独自ミニモックは `ui-extra.js` / `styles-extra.css` で拡張できます。

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` が `main` へのpushで静的サイトをdeployします。
