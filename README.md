# Like What?

「Apple風」「Linearっぽい」「オモコロっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚原則・AI向け指示文へ変換する個人用リファレンスライブラリです。

## What it does

- 既存ブランド / サービスを主入口にパターンを探す
- 一覧のミニモックで違いを視覚的に確認する
- 「静か」「高密度」「Editorial」「カタログ」などの言葉でも横断検索する
- 詳細ページで「何がそう見せているか」を言語化する
- AIへそのまま渡せる具体指示をコピーする
- 公式プロダクト / デザインシステムへの参考リンクを持つ

## Library

39 patterns across Apple, Notion, Linear, Arc, GitHub, Google, Stripe, Slack, Figma, Shopify, Airbnb, Vercel, オモコロ, 集英社 and Nintendo.

## Add a pattern

基本スキーマと追加ルールは [`docs/plan.md`](docs/plan.md) を参照してください。初期パターンは `patterns.js`、追加セットは `patterns-extra.js` に保持しています。独自ミニモックは `ui-extra.js` / `styles-extra.css` で拡張できます。

## Run locally

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` が `main` へのpushで静的サイトをdeployします。
