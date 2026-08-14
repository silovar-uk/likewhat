import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const allSourceFiles=[
  'patterns.js','patterns-extra.js','patterns-wave1.js','patterns-wave2.js','patterns-wave3.js','patterns-wave4.js','patterns-eyewear.js','patterns-idols.js','patterns-idols2.js',
  'patterns-wave5-brand.js','patterns-wave5-university.js','patterns-wave5-scenes.js'
];
const wave3BeforeFiles=['patterns.js','patterns-extra.js','patterns-wave1.js','patterns-wave2.js'];
const wave3AfterFiles=[...wave3BeforeFiles,'patterns-wave3.js'];
const outRoot=path.join(root,'generated');
const detailRoot=path.join(outRoot,'patterns');
const brandRoot=path.join(outRoot,'brands');
const historyRoot=path.join(outRoot,'history');

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

const patterns=await loadPatterns(allSourceFiles);
const wave3Before=await loadPatterns(wave3BeforeFiles);
const wave3After=await loadPatterns(wave3AfterFiles);

const compactKeys=[
  'id','brand','family','name','oneLiner','tags','uiParts','mock','domain','medium','archetype','interactionModel','philosophy','designSpace','related','opposites','scene',
  'groupType','industry','memberBrands','collectionType','era','idolLens','sourceLabel','sourceUrl',
  'implementationTerms','designTerms','philosophyTerms','schemaVersion'
];
const normalize=value=>String(value||'').normalize('NFKC').toLowerCase();
function searchTextFor(p){
  const memberText=(p.members||[]).flatMap(m=>[m.brand,m.role,m.note,m.sourceLabel]).join(' ');
  return normalize([
    p.brand,p.family,p.name,p.era,p.scene,p.oneLiner,p.description,
    ...(p.memberBrands||[]),memberText,...(p.tags||[]),...(p.uiParts||[]),...(p.visual||[]),...(p.useCases||[]),
    ...(p.avoid||[]),p.prompt,p.domain,p.medium,p.archetype,p.interactionModel,
    ...(p.philosophy||[]),...(p.implementationTerms||[]),...(p.designTerms||[]),...(p.philosophyTerms||[])
  ].join(' '));
}
function compact(p){
  const out=Object.fromEntries(compactKeys.filter(key=>p[key]!==undefined).map(key=>[key,p[key]]));
  out.searchText=searchTextFor(p);
  if(Array.isArray(p.members)&&p.members.length)out.clusterMembers=p.members.map(m=>({brand:m.brand,role:m.role||''}));
  return out;
}
const fileFor=id=>`${String(id).replace(/[^a-zA-Z0-9._-]/g,'_')}.json`;
const brandFileFor=brand=>`${Buffer.from(String(brand),'utf8').toString('base64url')}.json`;
const records=patterns.map(p=>({...compact(p),detailFile:fileFor(p.id)}));
const generatedAt=new Date().toISOString();

await Promise.all(patterns.map(p=>fs.writeFile(path.join(detailRoot,fileFor(p.id)),JSON.stringify(p),'utf8')));
const catalog={schemaVersion:3,generatedAt,referenceCount:patterns.length,records};
await fs.writeFile(path.join(outRoot,'catalog.json'),JSON.stringify(catalog),'utf8');

const brandPatterns=patterns.filter(p=>p.groupType!=='industry-cluster');
const brands=[...new Set(brandPatterns.map(p=>p.brand))];
const brandIndex=[];
for(const brand of brands){
  const items=brandPatterns.filter(p=>p.brand===brand);
  const file=brandFileFor(brand);
  const type=items.some(p=>p.collectionType==='idol-era')?'artist':'brand';
  const manifest={schemaVersion:1,brand,type,patternCount:items.length,patternIds:items.map(p=>p.id),detailFiles:items.map(p=>fileFor(p.id)),eras:[...new Set(items.map(p=>p.era).filter(Boolean))],generatedAt};
  await fs.writeFile(path.join(brandRoot,file),JSON.stringify(manifest),'utf8');
  brandIndex.push({brand,type,file,patternCount:items.length});
}
await fs.writeFile(path.join(brandRoot,'index.json'),JSON.stringify({schemaVersion:1,generatedAt,brands:brandIndex}),'utf8');

const wave3Ids=new Set(wave3After.map(p=>p.id).filter(id=>!wave3Before.some(old=>old.id===id)));
const coverageHistory={schemaVersion:1,generatedAt,label:'Wave 3 / 63 → 78',waveIds:[...wave3Ids],before:wave3Before.map(compact),after:wave3After.map(compact)};
await fs.writeFile(path.join(historyRoot,'wave3.json'),JSON.stringify(coverageHistory),'utf8');

const catalogBytes=Buffer.byteLength(JSON.stringify(catalog));
console.log(`Generated ${patterns.length} pattern details`);
console.log(`Generated ${brandIndex.length} brand / artist manifests`);
console.log(`Generated Wave 3 history ${wave3Before.length} → ${wave3After.length}`);
console.log(`Catalog size: ${(catalogBytes/1024).toFixed(1)} KB raw`);
if(catalogBytes>450*1024)console.warn('Catalog raw size exceeds 450 KB; consider splitting search text into a separate index.');
