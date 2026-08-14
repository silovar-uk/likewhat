import fs from 'node:fs/promises';

const catalog=JSON.parse(await fs.readFile('generated/catalog-core.json','utf8'));
const records=catalog.records.filter(record=>record.sourceUrl);
const timeoutMs=10000;
const concurrency=8;
let cursor=0;
const results=[];

async function probe(record){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  const headers={'user-agent':'LikeWhat-Reference-Health/1.0'};
  try{
    let response=await fetch(record.sourceUrl,{method:'HEAD',redirect:'follow',headers,signal:controller.signal});
    if([403,405,429].includes(response.status)){
      response=await fetch(record.sourceUrl,{method:'GET',redirect:'follow',headers:{...headers,range:'bytes=0-1024'},signal:controller.signal});
    }
    return {id:record.id,url:record.sourceUrl,status:response.status,ok:response.ok||[401,403,429].includes(response.status),finalUrl:response.url};
  }catch(error){return{id:record.id,url:record.sourceUrl,status:0,ok:false,error:error.name==='AbortError'?'timeout':String(error.message||error)};}
  finally{clearTimeout(timer);}
}

async function worker(){while(cursor<records.length){const index=cursor++;results[index]=await probe(records[index]);}}
await Promise.all(Array.from({length:Math.min(concurrency,records.length)},worker));
const failed=results.filter(result=>!result.ok);
console.log(`Checked ${results.length} reference URLs; ${failed.length} need review.`);
failed.forEach(result=>console.warn(`WARN ${result.id}: ${result.status||result.error} ${result.url}`));

const summary=process.env.GITHUB_STEP_SUMMARY;
if(summary){
  const lines=[`## Like What? source health`,`Checked **${results.length}** reference URLs. **${failed.length}** need review.`,``,`This check is advisory: auth blocks, bot protection and temporary rate limits do not block deployment.`];
  if(failed.length){lines.push('','| Pattern | Result | URL |','|---|---:|---|',...failed.slice(0,50).map(r=>`| \`${r.id}\` | ${r.status||r.error} | ${r.url.replace(/\|/g,'%7C')} |`));}
  await fs.appendFile(summary,lines.join('\n')+'\n');
}
process.exitCode=0;
