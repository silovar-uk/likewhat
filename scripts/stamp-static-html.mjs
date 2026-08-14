import fs from 'node:fs/promises';

const meta=JSON.parse(await fs.readFile('generated/meta.json','utf8'));
const count=meta.referenceCount;
const files=['map.html','vocabulary.html','compare.html','coverage.html'];

for(const file of files){
  let html=await fs.readFile(file,'utf8');
  html=html
    .replace(/>Brands<\/a>/g,'>Library</a>')
    .replace(/\b\d+ references\b/g,`${count} references`)
    .replace(/Like What\?の\d+パターン/g,`Like What?の${count}パターン`)
    .replace(/Like What\?の\d+参照/g,`Like What?の${count}参照`)
    .replace(/\b\d+の参照/g,`${count}の参照`)
    .replace(/いまの\d+件/g,`いまの${count}件`)
    .replace(/現在の\d+件/g,`現在の${count}件`)
    .replace(/current \d+-reference library/gi,`current ${count}-reference library`);
  await fs.writeFile(file,html,'utf8');
}
console.log(`Stamped ${count} references into ${files.length} static analysis pages`);
