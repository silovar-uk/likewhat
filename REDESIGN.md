# Like What? UI redesign / 2026-08-16

## 実装した差分

- PC（1024px以上）では、256pxの固定左レールと可変幅の本体に分離した。
- スマホ／タブレットでは、本体を横幅いっぱいにし、ナビゲーションを右側のメニューへ格納した。
- 全ページ共通の外枠を `styles-shell-v2.css` と `shell-v2.js` に集約した。
- Library上部に追従する検索欄を追加し、ファーストビューの検索欄と双方向に同期した。
- Kind / Sceneは基本フィルターとして残し、Domain / Medium / UI Part / Brandは「詳細フィルター」に段階化した。
- スマホの詳細フィルターは全面ドロワーとし、Escapeキー、背景タップ、閉じるボタンに対応した。
- 選択中のフィルター数をボタンに表示し、既存のURLパラメータと絞り込みロジックは変更していない。
- PCのLibraryカードを標準2列にして、見出し・プレビュー・補足情報の判読性を上げた。1500px以上では3列になる。
- 画面外のカードに `content-visibility: auto` を追加し、長い一覧の描画負荷を抑えた。
- `prefers-reduced-motion` に対応し、動きを減らす設定ではメニューとドロワーの遷移を無効化した。

## 変更していない部分

- 163件の参照データと生成処理
- 検索、URL共有、Kind / Scene / Domain / Medium / UI Partの絞り込み
- Saved / Recent / Compareのローカル保存
- Pattern Detail、Design Map、Vocabulary、Contrast、Coverageの各機能
- GitHub Pagesのビルド方式

## 主なファイル

- `styles-shell-v2.css`：PC左レール、モバイルヘッダー、Libraryツールバー、フィルタードロワー、カード寸法
- `shell-v2.js`：メニュー、検索同期、詳細フィルター、フォーカス制御
- `index.html`：共通CSS / JavaScriptの読み込みと検索文言
- `top-bootstrap.js`：遅延CSS読込後も新しい外枠CSSを最終調整層の直前へ戻す

## ローカルで確認する方法

1. このフォルダーで `node scripts/build-pattern-data.mjs` を実行する。
2. 続けて `python3 -m http.server 8000` を実行する。
3. ブラウザで `http://localhost:8000/` を開く。
4. 終了するときは、ターミナルで `Ctrl + C` を押す。

HTMLファイルを直接ダブルクリックすると、生成JSONの取得がブラウザに止められることがある。そのため、ローカルサーバー経由で開く。

## 保守の目安

- 左レール幅は `--lw-rail-width`、モバイルヘッダー高は `--lw-mobile-header` で変更できる。
- PC／モバイルの切替幅は `1024px`。CSSと `shell-v2.js` の両方で同じ値を使う。
- 新しい公開ページを追加するときは、`styles-shell-v2.css` を `styles-ui-polish.css` の直前、`shell-v2.js` をページ固有JavaScriptの直前で読み込む。
- タップ対象は原則40px以上を維持する。参考：[WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- 通常文字のコントラストは4.5:1以上を目安にする。参考：[WCAG Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- `content-visibility` の仕様と注意点：[web.dev](https://web.dev/articles/content-visibility)
