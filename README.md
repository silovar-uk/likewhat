# Like What?

「Apple風」「Linearっぽい」のような曖昧なデザインイメージを、具体的なUIパターン・視覚原則・AI向け指示文へ変換する個人用リファレンスライブラリです。

## What it does

- 既存ブランド / サービスを主入口にパターンを探す
- 一覧のミニモックで違いを視覚的に確認する
- 「静か」「高密度」「Sidebar」などの言葉でも横断検索する
- 詳細ページで「何がそう見せているか」を言語化する
- AIへそのまま渡せる具体指示をコピーする
- 公式プロダクト / デザインシステムへの参考リンクを持つ

## Initial library

30 patterns across Apple, Notion, Linear, Arc, GitHub, Google, Stripe, Slack, Figma, Shopify, Airbnb and Vercel.

## Add a pattern

`patterns.js` に1件追加します。基本スキーマと追加ルールは [`docs/plan.md`](docs/plan.md) を参照してください。

## Run locally

静的サイトなので、任意のHTTP serverでルートディレクトリを配信してください。

```bash
python3 -m http.server 8000
```

## GitHub Pages

`.github/workflows/pages.yml` にGitHub Pages用のworkflowを用意しています。Repository SettingsでPagesのSourceを **GitHub Actions** に設定すると、`main` へのpushで静的サイトをdeployします。
