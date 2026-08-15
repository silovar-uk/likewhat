import fs from 'node:fs';

const publicPages=[
  'index.html',
  'brand.html',
  'map.html',
  'vocabulary.html',
  'compare.html',
  'coverage.html',
  'pattern.html'
];

const requiredTokens=['--bg','--surface','--ink','--muted','--line','--soft'];
const core=fs.readFileSync('styles.css','utf8');
const polish=fs.readFileSync('styles-ui-polish.css','utf8');
const index=fs.readFileSync('index.html','utf8');
const map=fs.readFileSync('map.js','utf8');
const failures=[];

function assert(condition,message){
  if(!condition)failures.push(message);
}

assert(core.trim().length>12000,'styles.css is empty or missing the shared visual foundation');
for(const token of requiredTokens){
  assert(core.includes(`${token}:`),`styles.css does not define ${token}`);
}

for(const page of publicPages){
  const html=fs.readFileSync(page,'utf8');
  const sheets=[...html.matchAll(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']/g)].map(match=>match[1]);
  assert(sheets.includes('styles.css'),`${page} does not load styles.css`);
  assert(sheets.at(-1)==='styles-ui-polish.css',`${page} must load styles-ui-polish.css last`);
}

assert(polish.includes('var(--ink, #171716)'), 'critical dark backgrounds need a hard-coded token fallback');
assert(polish.includes('.prompt-block pre'), 'prompt reflow guard is missing');
assert(polish.includes('white-space: pre-wrap'), 'preformatted copy may force page-level horizontal scrolling');
assert(polish.includes(':focus-visible'), 'visible keyboard focus guard is missing');
assert(polish.includes('--control-height: 40px'), 'shared interactive target floor is missing');
assert(index.includes('<wbr><span>×「どの場面？」</span>'), 'Composer heading lacks a semantic wrap opportunity');
assert(map.includes('class="map-point-hit"'), 'Design Map points lack their enlarged invisible hit area');

if(failures.length){
  console.error('UI foundation check failed:');
  failures.forEach(message=>console.error(`- ${message}`));
  process.exit(1);
}

console.log(`UI foundation verified across ${publicPages.length} pages.`);
