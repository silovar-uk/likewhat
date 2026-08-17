import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const detailDir=path.join(root,'generated','patterns');
const allowedGroups=new Set(['typography','spacing','surface','layout','interaction','components','responsive']);
const allowedLevels=new Set(['curated','observed','measured']);
const allowedConfidence=new Set(['low','medium','high']);
const allowedSourceKinds=new Set(['official','reference','css','screenshot','other']);
const allowedSchemaVersions=new Set([1,2]);
const measuredSourceKinds=new Set(['official','css']);
const numericLikeValue=/\d\s*(px|em|rem|%|ms|s|:|x|pt|vh|vw)\b|^\d+(\.\d+)?\s*:\s*\d+(\.\d+)?$/i;
const MAX_TRACED_PATTERNS=20;
const errors=[];
let tracedPatterns=0;
let tracedItems=0;

const isObject=value=>value&&typeof value==='object'&&!Array.isArray(value);
const text=value=>typeof value==='string'&&value.trim().length>0;
const validDate=value=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return false;
  const date=new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
};
const validUrl=value=>{
  try{const url=new URL(value);return ['http:','https:'].includes(url.protocol);}catch{return false;}
};
const fail=(id,message)=>errors.push(`${id}: ${message}`);

let files=[];
try{
  files=(await fs.readdir(detailDir)).filter(file=>file.endsWith('.json')).sort();
}catch{
  throw new Error('generated/patterns is missing. Run node scripts/build-pattern-data.mjs first.');
}

for(const file of files){
  const pattern=JSON.parse(await fs.readFile(path.join(detailDir,file),'utf8'));
  const id=pattern.id||file;
  const trace=pattern.microDetails;
  if(trace===undefined||trace===null)continue;
  tracedPatterns+=1;

  if(!isObject(trace)){fail(id,'microDetails must be an object');continue;}
  if(!allowedSchemaVersions.has(trace.schemaVersion))fail(id,`microDetails.schemaVersion must be 1 or 2, got ${trace.schemaVersion}`);
  if(!allowedLevels.has(trace.traceLevel))fail(id,`invalid traceLevel ${trace.traceLevel}`);
  if(!validDate(trace.checkedAt))fail(id,`invalid checkedAt ${trace.checkedAt}`);

  if(!Array.isArray(trace.sources)||trace.sources.length===0){
    fail(id,'sources[] is required');
  }
  const sourceIds=new Set();
  for(const [index,source] of (trace.sources||[]).entries()){
    if(!isObject(source)){fail(id,`sources[${index}] must be an object`);continue;}
    if(!text(source.id))fail(id,`sources[${index}].id is required`);
    else if(sourceIds.has(source.id))fail(id,`duplicate source id ${source.id}`);
    else sourceIds.add(source.id);
    if(!text(source.label))fail(id,`sources[${index}].label is required`);
    if(!validUrl(source.url))fail(id,`sources[${index}].url must be http(s)`);
    if(!allowedSourceKinds.has(source.kind))fail(id,`sources[${index}].kind invalid: ${source.kind}`);
  }

  if(!isObject(trace.groups)||Object.keys(trace.groups).length===0){
    fail(id,'groups object is required');
    continue;
  }

  for(const [groupKey,group] of Object.entries(trace.groups)){
    if(!allowedGroups.has(groupKey))fail(id,`unknown group ${groupKey}`);
    if(!isObject(group)){fail(id,`${groupKey} must be an object`);continue;}
    if(group.cue!==undefined&&!text(group.cue))fail(id,`${groupKey}.cue must be a non-empty string when present`);
    if(!Array.isArray(group.items)||group.items.length===0){
      fail(id,`${groupKey}.items[] is required`);
      continue;
    }
    const itemLabels=new Set();
    for(const [index,item] of group.items.entries()){
      tracedItems+=1;
      const prefix=`${groupKey}.items[${index}]`;
      if(!isObject(item)){fail(id,`${prefix} must be an object`);continue;}
      if(!text(item.label))fail(id,`${prefix}.label is required`);
      else itemLabels.add(item.label);
      if(!text(item.value))fail(id,`${prefix}.value is required`);
      if(!allowedConfidence.has(item.confidence))fail(id,`${prefix}.confidence invalid: ${item.confidence}`);
      if(!allowedLevels.has(item.method))fail(id,`${prefix}.method invalid: ${item.method}`);
      if(!text(item.sourceId))fail(id,`${prefix}.sourceId is required`);
      else if(!sourceIds.has(item.sourceId))fail(id,`${prefix}.sourceId does not match sources[]: ${item.sourceId}`);
      if(item.note!==undefined&&!text(item.note))fail(id,`${prefix}.note must be a non-empty string when present`);
      // 捏造防止: curatedは編集的な読みであり、数値の形をした値を書けない。
      if(item.method==='curated'&&text(item.value)&&numericLikeValue.test(item.value))
        fail(id,`${prefix}.value looks numeric but method is 'curated' — use words, not a measured-looking value: "${item.value}"`);
      // measuredは出典元のkindがofficial/cssでなければならない(スクリーンショットや編集推定を「測定」と偽装できないように)。
      if(item.method==='measured'&&text(item.sourceId)){
        const source=(trace.sources||[]).find(s=>s.id===item.sourceId);
        if(source&&!measuredSourceKinds.has(source.kind))
          fail(id,`${prefix}.method is 'measured' but sourceId "${item.sourceId}" has kind "${source.kind}" (must be official or css)`);
      }
    }
    if(Array.isArray(group.relations)){
      for(const [index,relation] of group.relations.entries()){
        const prefix=`${groupKey}.relations[${index}]`;
        if(!isObject(relation)){fail(id,`${prefix} must be an object`);continue;}
        if(!text(relation.label))fail(id,`${prefix}.label is required`);
        if(!text(relation.value))fail(id,`${prefix}.value is required`);
        if(!text(relation.from)||!itemLabels.has(relation.from))fail(id,`${prefix}.from must match an items[].label in ${groupKey}: "${relation.from}"`);
        if(!text(relation.to)||!itemLabels.has(relation.to))fail(id,`${prefix}.to must match an items[].label in ${groupKey}: "${relation.to}"`);
        if(!allowedConfidence.has(relation.confidence))fail(id,`${prefix}.confidence invalid: ${relation.confidence}`);
        if(!allowedLevels.has(relation.method))fail(id,`${prefix}.method invalid: ${relation.method}`);
      }
    }
    if(group.meaning!==undefined){
      if(!isObject(group.meaning))fail(id,`${groupKey}.meaning must be an object`);
      else{
        if(!text(group.meaning.text))fail(id,`${groupKey}.meaning.text is required`);
        if(!['relations','items','editorial'].includes(group.meaning.basis))fail(id,`${groupKey}.meaning.basis invalid: ${group.meaning.basis}`);
      }
    }
  }
}

if(tracedPatterns>MAX_TRACED_PATTERNS){
  fail('(corpus)',`microDetails is set on ${tracedPatterns} patterns, exceeding the ${MAX_TRACED_PATTERNS}-pattern cap for this rollout stage`);
}

if(errors.length){
  console.error(errors.map(message=>`ERROR ${message}`).join('\n'));
  throw new Error(`MICRO DETAILS validation failed with ${errors.length} error(s)`);
}

console.log(`MICRO DETAILS schema v1 verified: ${tracedPatterns} traced patterns / ${tracedItems} stored items`);
