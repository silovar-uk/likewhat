import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const sourceFiles=[
  'patterns.js','patterns-extra.js','patterns-wave1.js','patterns-wave2.js','patterns-wave3.js','patterns-wave4.js','patterns-eyewear.js','patterns-idols.js','patterns-idols2.js'
];
const outRoot=path.join(root,'generated');
const detailRoot=path.join(outRoot,'patterns');

await fs.rm(outRoot,{recursive:true,force:true});
await fs.mkdir(detailRoot,{recursive:true});

const sandbox={window:{LIKEWHAT_PATTERNS:[]},console};
vm.createContext(sandbox);
for(const file of sourceFiles){
  const code=await fs.readFile(path.join(root,file),'utf8');
  vm.runInContext(code,sandbox,{filename:file});
}
const patterns=sandbox.window.LIKEWHAT_PATTERNS;
if(!Array.isArray(patterns)||!patterns.length)throw new Error('No patterns generated');

const compactKeys=[
  'id','brand','family','name','oneLiner','tags','uiParts','mock','domain','medium','archetype','interactionModel','philosophy','designSpace','related','opposites',
  'groupType','industry','memberBrands','collectionType','era','idolLens'
];
const compact=p=>Object.fromEntries(compactKeys.filter(key=>p[key]!==undefined).map(key=>[key,p[key]]));
const fileFor=id=>`${String(id).replace(/[^a-zA-Z0-9._-]/g,'_')}.json`;
const records=patterns.map(p=>({...compact(p),detailFile:fileFor(p.id)}));

await Promise.all(patterns.map(p=>fs.writeFile(path.join(detailRoot,fileFor(p.id)),JSON.stringify(p), 'utf8')));
const catalog={schemaVersion:1,generatedAt:new Date().toISOString(),referenceCount:patterns.length,records};
await fs.writeFile(path.join(outRoot,'catalog.json'),JSON.stringify(catalog),'utf8');

const catalogBytes=Buffer.byteLength(JSON.stringify(catalog));
console.log(`Generated ${patterns.length} pattern details`);
console.log(`Catalog size: ${(catalogBytes/1024).toFixed(1)} KB raw`);
if(catalogBytes>300*1024)console.warn('Catalog raw size exceeds 300 KB; consider a more aggressive compact schema.');
