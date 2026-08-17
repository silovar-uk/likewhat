#!/usr/bin/env node
// CSS競合の実測: 各CSSファイルのセレクタと !important 使用箇所を集計し、
// 複数ファイルにまたがって同じセレクタが定義されている箇所を検出する。
// 依存なし・標準機能のみ(正規表現ベースの簡易パーサ)。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:');
const cssFiles = readdirSync(root)
  .filter((f) => f.startsWith('styles') && f.endsWith('.css'))
  .sort();

/** @type {Map<string, {file:string, important:boolean}[]>} */
const selectorIndex = new Map();
const perFile = [];

for (const file of cssFiles) {
  const text = readFileSync(join(root, file), 'utf8');
  // コメント除去
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const importantCount = (stripped.match(/!important/g) || []).length;

  // ブロック単位でセレクタを抽出(ネストした @media 内も拾う簡易走査)
  const blockRe = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  let selectorCount = 0;
  while ((match = blockRe.exec(stripped))) {
    const rawSelector = match[1].trim();
    if (!rawSelector || rawSelector.startsWith('@')) continue;
    const body = match[2];
    const hasImportant = /!important/.test(body);
    for (const sel of rawSelector.split(',').map((s) => s.trim()).filter(Boolean)) {
      selectorCount++;
      if (!selectorIndex.has(sel)) selectorIndex.set(sel, []);
      selectorIndex.get(sel).push({ file, important: hasImportant });
    }
  }

  perFile.push({ file, bytes: Buffer.byteLength(text), importantCount, selectorCount });
}

const duplicates = [...selectorIndex.entries()]
  .filter(([, occurrences]) => new Set(occurrences.map((o) => o.file)).size > 1)
  .sort((a, b) => b[1].length - a[1].length);

const lines = [];
lines.push('# CSS競合の実測レポート');
lines.push('');
lines.push(`生成日: ${new Date().toISOString().slice(0, 10)}`);
lines.push(`対象ファイル数: ${cssFiles.length}`);
lines.push('');
lines.push('## ファイル別サマリー');
lines.push('');
lines.push('| ファイル | サイズ(bytes) | セレクタ数 | !important数 |');
lines.push('|---|---:|---:|---:|');
for (const f of perFile.sort((a, b) => b.importantCount - a.importantCount)) {
  lines.push(`| ${f.file} | ${f.bytes} | ${f.selectorCount} | ${f.importantCount} |`);
}
lines.push('');
lines.push(`## 複数ファイルにまたがるセレクタ(重複候補: ${duplicates.length}件)`);
lines.push('');
lines.push('同じセレクタ文字列が複数のCSSファイルで定義されている箇所。');
lines.push('後続で読み込まれるファイルが優先されるため、読み込み順に依存した上書きが発生している可能性がある。');
lines.push('');
lines.push('| セレクタ | 出現ファイル(読み込み順とは無関係、アルファベット順) | !important使用 |');
lines.push('|---|---|---|');
for (const [sel, occurrences] of duplicates.slice(0, 200)) {
  const files = [...new Set(occurrences.map((o) => o.file))].sort();
  const important = occurrences.some((o) => o.important) ? 'あり' : '-';
  const escaped = sel.replace(/\|/g, '\\|');
  lines.push(`| \`${escaped}\` | ${files.join(', ')} | ${important} |`);
}
if (duplicates.length > 200) {
  lines.push('');
  lines.push(`(上位200件のみ表示。全${duplicates.length}件)`);
}

lines.push('');
lines.push('## !important の総数');
lines.push('');
const totalImportant = perFile.reduce((sum, f) => sum + f.importantCount, 0);
lines.push(`全体: ${totalImportant}件`);
lines.push('');
lines.push('| ファイル | !important数 |');
lines.push('|---|---:|');
for (const f of perFile.filter((f) => f.importantCount > 0).sort((a, b) => b.importantCount - a.importantCount)) {
  lines.push(`| ${f.file} | ${f.importantCount} |`);
}

const outPath = join(root, 'docs', 'css-audit-2026-08.md');
writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
console.log(`CSS audit written to ${outPath}`);
console.log(`Files: ${cssFiles.length} / Duplicate selectors: ${duplicates.length} / !important total: ${totalImportant}`);
