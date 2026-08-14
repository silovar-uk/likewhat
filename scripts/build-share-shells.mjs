import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const generated=path.join(root,'generated');
const catalog=JSON.parse(await fs.readFile(path.join(generated,'catalog-core.json'),'utf8'));
const shareRoot=path.join(generated,'share');
await fs.rm(shareRoot,{recursive:true,force:true});
await fs.mkdir(shareRoot,{recursive:true});

const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safe=id=>String(id).replace(/[^a-zA-Z0-9._-]/g,'_');
const entries=[];

for(const record of catalog.records){
  const dir=safe(record.id);
  const target=`../../../pattern.html?id=${encodeURIComponent(record.id)}`;
  const canonical=`https://silovar-uk.github.io/likewhat/generated/share/${encodeURIComponent(dir)}/`;
  const title=`${record.name} — Like What?`;
  const description=record.oneLiner||`${record.brand} / ${record.family}`;
  const html=`<!doctype html>
<html lang="ja"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Like What?">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
<meta http-equiv="refresh" content="0;url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)});</script>
</head><body><main><p>${esc(record.brand)} · ${esc(record.family)}</p><h1>${esc(record.name)}</h1><p>${esc(description)}</p><p><a href="${esc(target)}">Open this Pattern in Like What?</a></p></main></body></html>`;
  const out=path.join(shareRoot,dir);await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'index.html'),html,'utf8');
  entries.push({id:record.id,path:`generated/share/${dir}/`});
}
await fs.writeFile(path.join(generated,'share-index.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),count:entries.length,entries}),'utf8');
console.log(`Generated ${entries.length} static share shells`);
