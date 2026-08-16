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
const shell=fs.readFileSync('styles-shell-v2.css','utf8');
const polish=fs.readFileSync('styles-ui-polish.css','utf8');
const index=fs.readFileSync('index.html','utf8');
const map=fs.readFileSync('map.js','utf8');
const topBootstrap=fs.readFileSync('top-bootstrap.js','utf8');
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
  assert(sheets.some(sheet=>sheet.startsWith('styles.css?v=')),`${page} does not load a versioned styles.css`);
  assert(sheets.at(-2)?.startsWith('styles-shell-v2.css?v='),`${page} must load the versioned responsive shell before polish`);
  assert(sheets.at(-1)?.startsWith('styles-ui-polish.css?v='),`${page} must load a versioned styles-ui-polish.css last`);
  assert(html.includes('shell-v2.js?v='),`${page} does not load the shared navigation and filter controller`);
}

assert(shell.includes('--lw-rail-width'), 'responsive shell is missing the desktop rail token');
assert(shell.includes('@media (max-width: 1023px)'), 'responsive shell is missing the mobile layout boundary');
assert(shell.includes('prefers-reduced-motion'), 'responsive shell is missing reduced-motion handling');
assert(polish.includes('var(--ink, #171716)'), 'critical dark backgrounds need a hard-coded token fallback');
assert(polish.includes('.prompt-block pre'), 'prompt reflow guard is missing');
assert(polish.includes('white-space: pre-wrap'), 'preformatted copy may force page-level horizontal scrolling');
assert(polish.includes(':focus-visible'), 'visible keyboard focus guard is missing');
assert(polish.includes('--control-height: 40px'), 'shared interactive target floor is missing');
assert(index.includes('<wbr><span>×「どの場面？」</span>'), 'Composer heading lacks a semantic wrap opportunity');
assert(map.includes('class="map-point-hit"'), 'Design Map points lack their enlarged invisible hit area');
assert(topBootstrap.includes('beforeNode.parentNode.insertBefore(el,beforeNode)'), 'deferred TOP styles must be inserted before the responsive shell');
assert(topBootstrap.includes('map(href=>stylesheet(href,shell))'), 'deferred TOP styles are not anchored before the responsive shell');
assert(!topBootstrap.includes('document.head.appendChild(shell)'), 'TOP bootstrap must not reorder the responsive shell during scroll-triggered loading');
assert(!topBootstrap.includes('document.head.appendChild(polish)'), 'TOP bootstrap must not reorder the final polish layer during scroll-triggered loading');
assert(index.includes('top-bootstrap.js?v='), 'TOP bootstrap must be cache-busted with UI releases');

if(failures.length){
  console.error('UI foundation check failed:');
  failures.forEach(message=>console.error(`- ${message}`));
  process.exit(1);
}

console.log(`UI foundation verified across ${publicPages.length} pages.`);
