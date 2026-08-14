import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';

const root=process.cwd();
const outRoot=path.join(root,'generated');
const detailRoot=path.join(outRoot,'patterns');
const brandRoot=path.join(outRoot,'brands');
const historyRoot=path.join(outRoot,'history');
const libraryMeta=JSON.parse(await fs.readFile(path.join(root,'library-meta.json'),'utf8'));

function sourceRank(file){
  if(file==='patterns.js')return 0;
  if(file==='patterns-extra.js')return 1;
  const wave=file.match(/^patterns-wave(\d+)(?:-|\.)/);
  if(wave)return 10+Number(wave[1]);
  if(file==='patterns-eyewear.js')return 80;
  if(file==='patterns-idols.js')return 90;
  if(file==='patterns-idols2.js')return 91;
  return 70;
}

const allRootFiles=await fs.readdir(root);
const allSourceFiles=allRootFiles
  .filter(file=>/^patterns(?:-[a-z0-9]+)*\.js$/i.test(file))
  .sort((a,b)=>sourceRank(a)-sourceRank(b)||a.localeCompare(b));
if(!allSourceFiles.includes('patterns.js'))throw new Error('patterns.js is required');

const wave3BeforeFiles=allSourceFiles.filter(file=>file==='patterns.js'||file==='patterns-extra.js'||/^patterns-wave[12]\.js$/.test(file));
const wave3AfterFiles=[...wave3BeforeFiles,...allSourceFiles.filter(file=>file==='patterns-wave3.js')];

await fs.rm(outRoot,{recursive:true,force:true});
await fs.mkdir(detailRoot,{recursive:true});
await fs.mkdir(brandRoot,{recursive:true});
await fs.mkdir(historyRoot,{recursive:true});

async function loadPatterns(files){
  const sandbox={window:{LIKEWHAT_PATTERNS:[]},console};
  vm.createContext(sandbox);
  for(const file of files){
    const code=await fs.readFile(path.join(root,file),'utf8');
    vm.runInContext(code,sandbox,{filename:file});
  }
  const taxonomy=await fs.readFile(path.join(root,'taxonomy.js'),'utf8');
  vm.runInContext(taxonomy,sandbox,{filename:'taxonomy.js'});
  const patterns=sandbox.window.LIKEWHAT_PATTERNS;
  if(!Array.isArray(patterns)||!patterns.length)throw new Error(`No patterns generated for ${files.join(', ')}`);
  return patterns;
}

const rawPatterns=await loadPatterns(allSourceFiles);
const wave3Before=await loadPatterns(wave3BeforeFiles);
const wave3After=await loadPatterns(wave3AfterFiles);
const generatedAt=new Date().toISOString();

function inferEntryKind(p){
  if(p.entryKind)return p.entryKind;
  if(p.groupType==='industry-cluster')return 'industry-cluster';
  if(p.scene)return 'scene';
  if(p.collectionType==='idol-era')return 'artist';
  if(p.domain==='Education'||/University|大学|慶應|早稲田|東京大学|京都大学|MIT|Harvard|Oxford|Cambridge|Stanford/i.test(p.brand||''))return 'institution';
  return 'brand';
}

function provenanceFor(p){
  return p.provenance||{
    sourceType:p.sourceType||'primary-reference',
    checkedAt:p.checkedAt||null,
    observed:Array.isArray(p.observed)?p.observed:[...(p.visual||[])],
    editorialInference:Array.isArray(p.editorialInference)?p.editorialInference:[p.description,...(p.philosophy||[])].filter(Boolean)
  };
}

const patterns=rawPatterns.map(p=>({...p,entryKind:inferEntryKind(p),provenance:provenanceFor(p)}));
const ids=new Set(patterns.map(p=>p.id));
const errors=[];
const warnings=[];
const required=['id','brand','family','name','oneLiner','description','prompt','sourceLabel','sourceUrl','designSpace'];
const axes=['density','emotion','exploration','authority','interaction','order'];

for(const p of patterns){
  for(const key of required){if(p[key]===undefined||p[key]===null||p[key]==='')errors.push(`${p.id||'unknown'} missing ${key}`);}
  for(const key of ['visual','useCases','avoid']){if(!Array.isArray(p[key])||!p[key].length)errors.push(`${p.id||'unknown'} missing ${key}[]`);}
  if(!libraryMeta.entryKinds.includes(p.entryKind))errors.push(`${p.id} invalid entryKind ${p.entryKind}`);
  for(const axis of axes){const value=Number(p.designSpace?.[axis]);if(!Number.isFinite(value)||value<0||value>100)errors.push(`${p.id} invalid designSpace.${axis}: ${p.designSpace?.[axis]}`);}
  for(const field of ['related','opposites'])for(const target of p[field]||[]){if(!ids.has(target))errors.push(`${p.id} ${field} references unknown id ${target}`);}
  try{new URL(p.sourceUrl);}catch{errors.push(`${p.id} invalid sourceUrl ${p.sourceUrl}`);}
  if(!p.philosophy?.length)warnings.push(`${p.id} has no explicit philosophy; computed vocabulary will be used`);
}
if(new Set(patterns.map(p=>p.id)).size!==patterns.length)errors.push('duplicate pattern ids found');
if(errors.length){console.error(errors.map(x=>`ERROR ${x}`).join('\n'));throw new Error(`Pattern validation failed with ${errors.length} error(s)`);}
if(warnings.length)console.warn(warnings.map(x=>`WARN ${x}`).join('\n'));

const compactKeys=[
  'id','brand','family','name','oneLiner','tags','uiParts','mock','domain','medium','archetype','interactionModel','philosophy','designSpace','related','opposites','scene','entryKind',
  'groupType','industry','memberBrands','collectionType','era','idolLens','sourceLabel','sourceUrl','implementationTerms','designTerms','philosophyTerms','schemaVersion'
];
const normalize=value=>String(value||'').normalize('NFKC').toLowerCase();
function searchTextFor(p){
  const memberText=(p.members||[]).flatMap(m=>[m.brand,m.role,m.note,m.sourceLabel]).join(' ');
  return normalize([
    p.brand,p.family,p.name,p.era,p.scene,p.entryKind,p.oneLiner,p.description,
    ...(p.memberBrands||[]),memberText,...(p.tags||[]),...(p.uiParts||[]),...(p.visual||[]),...(p.useCases||[]),...(p.avoid||[]),p.prompt,
    p.domain,p.medium,p.archetype,p.interactionModel,...(p.philosophy||[]),...(p.implementationTerms||[]),...(p.designTerms||[]),...(p.philosophyTerms||[])
  ].join(' '));
}
function compact(p){
  const out=Object.fromEntries(compactKeys.filter(key=>p[key]!==undefined).map(key=>[key,p[key]]));
  if(Array.isArray(p.members)&&p.members.length)out.clusterMembers=p.members.map(m=>({brand:m.brand,role:m.role||''}));
  return out;
}
const fileFor=id=>`${String(id).replace(/[^a-zA-Z0-9._-]/g,'_')}.json`;
const brandFileFor=brand=>`${Buffer.from(String(brand),'utf8').toString('base64url')}.json`;
const records=patterns.map(p=>({...compact(p),detailFile:fileFor(p.id)}));
const searchRecords=patterns.map(p=>({id:p.id,text:searchTextFor(p)}));

await Promise.all(patterns.map(p=>fs.writeFile(path.join(detailRoot,fileFor(p.id)),JSON.stringify(p),'utf8')));
const coreCatalog={schemaVersion:4,generatedAt,referenceCount:patterns.length,records};
const searchIndex={schemaVersion:1,generatedAt,referenceCount:patterns.length,records:searchRecords};
const legacyCatalog={schemaVersion:4,generatedAt,referenceCount:patterns.length,records:records.map(record=>({...record,searchText:searchRecords.find(x=>x.id===record.id)?.text||''}))};
await fs.writeFile(path.join(outRoot,'catalog-core.json'),JSON.stringify(coreCatalog),'utf8');
await fs.writeFile(path.join(outRoot,'search-index.json'),JSON.stringify(searchIndex),'utf8');
await fs.writeFile(path.join(outRoot,'catalog.json'),JSON.stringify(legacyCatalog),'utf8');

const collectionPatterns=patterns.filter(p=>p.entryKind!=='industry-cluster'&&p.entryKind!=='scene');
const brands=[...new Set(collectionPatterns.map(p=>p.brand))];
const brandIndex=[];
for(const brand of brands){
  const items=collectionPatterns.filter(p=>p.brand===brand);
  const file=brandFileFor(brand);
  const kinds=[...new Set(items.map(p=>p.entryKind))];
  const type=kinds.includes('artist')?'artist':kinds.includes('institution')?'institution':'brand';
  const manifest={schemaVersion:2,brand,type,entryKind:type,patternCount:items.length,patternIds:items.map(p=>p.id),detailFiles:items.map(p=>fileFor(p.id)),eras:[...new Set(items.map(p=>p.era).filter(Boolean))],generatedAt};
  await fs.writeFile(path.join(brandRoot,file),JSON.stringify(manifest),'utf8');
  brandIndex.push({brand,type,entryKind:type,file,patternCount:items.length,route:items.length===1?`pattern.html?id=${encodeURIComponent(items[0].id)}`:`brand.html?brand=${encodeURIComponent(brand)}`});
}
await fs.writeFile(path.join(brandRoot,'index.json'),JSON.stringify({schemaVersion:2,generatedAt,brands:brandIndex}),'utf8');

const wave3Ids=new Set(wave3After.map(p=>p.id).filter(id=>!wave3Before.some(old=>old.id===id)));
const coverageHistory={schemaVersion:1,generatedAt,label:`Wave 3 / ${wave3Before.length} → ${wave3After.length}`,waveIds:[...wave3Ids],before:wave3Before.map(p=>({...compact(p),entryKind:inferEntryKind(p)})),after:wave3After.map(p=>({...compact(p),entryKind:inferEntryKind(p)}))};
await fs.writeFile(path.join(historyRoot,'wave3.json'),JSON.stringify(coverageHistory),'utf8');

const kindCounts=Object.fromEntries(libraryMeta.entryKinds.map(kind=>[kind,patterns.filter(p=>p.entryKind===kind).length]));
const sceneCounts=Object.fromEntries(libraryMeta.sceneOrder.map(scene=>[scene,patterns.filter(p=>p.scene===scene).length]).filter(([,count])=>count));
const meta={
  schemaVersion:1,
  generatedAt,
  referenceCount:patterns.length,
  collectionCount:brandIndex.length,
  entryKinds:libraryMeta.entryKinds,
  kindCounts,
  sceneOrder:libraryMeta.sceneOrder,
  sceneCounts,
  sceneLifecycle:libraryMeta.sceneLifecycle,
  designSpaceAxes:libraryMeta.designSpaceAxes,
  currentWave:libraryMeta.currentWave,
  sourceFiles:allSourceFiles
};
await fs.writeFile(path.join(outRoot,'meta.json'),JSON.stringify(meta),'utf8');

const coreBytes=Buffer.byteLength(JSON.stringify(coreCatalog));
const searchBytes=Buffer.byteLength(JSON.stringify(searchIndex));
const legacyBytes=Buffer.byteLength(JSON.stringify(legacyCatalog));
const gzipSize=value=>zlib.gzipSync(Buffer.from(JSON.stringify(value))).byteLength;
console.log(`Generated ${patterns.length} pattern details from ${allSourceFiles.length} source files`);
console.log(`Generated ${brandIndex.length} brand / artist / institution manifests`);
console.log(`Generated Wave 3 history ${wave3Before.length} → ${wave3After.length}`);
console.log(`Core catalog: ${(coreBytes/1024).toFixed(1)} KB raw / ${(gzipSize(coreCatalog)/1024).toFixed(1)} KB gzip`);
console.log(`Search index: ${(searchBytes/1024).toFixed(1)} KB raw / ${(gzipSize(searchIndex)/1024).toFixed(1)} KB gzip`);
console.log(`Legacy catalog: ${(legacyBytes/1024).toFixed(1)} KB raw / ${(gzipSize(legacyCatalog)/1024).toFixed(1)} KB gzip`);
if(gzipSize(coreCatalog)>100*1024)throw new Error('Core catalog exceeds 100 KB gzip performance budget');
