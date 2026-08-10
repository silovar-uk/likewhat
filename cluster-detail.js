(function(){
  const root=document.querySelector('.detail-page');
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const id=new URLSearchParams(location.search).get('id');
  const p=patterns.find(item=>item.id===id);
  const esc=window.LikeWhatUI?.esc||((v)=>String(v??''));
  if(!root||!p||p.groupType!=='industry-cluster'||!(p.members||[]).length)return;

  const section=document.createElement('section');
  section.className='cluster-variations detail-block';
  section.innerHTML=`
    <div class="cluster-variations-head">
      <div><p class="eyebrow">INDUSTRY CLUSTER / COMMON GRAMMAR → VARIATIONS</p><h2>似ているからまとめる。<br>違うところだけ、残す。</h2><p>${esc(p.industry||'Industry')}という同じ購買・利用文脈で共通する設計Grammarを1 referenceとして扱い、その中で各ブランドがどこを強調しているかを比較する。</p></div>
      <div class="cluster-member-count"><strong>${p.members.length}</strong><span>brands in cluster</span></div>
    </div>
    <div class="cluster-common"><small>COMMON GRAMMAR</small><div>${(p.tags||[]).slice(0,5).map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><p>${esc(p.oneLiner)}</p></div>
    <div class="cluster-member-grid">${p.members.map((member,index)=>`<article class="cluster-member-card">
      <div class="cluster-member-index">${String(index+1).padStart(2,'0')}</div>
      <div class="cluster-member-body"><small>${esc(member.role||'Variation')}</small><h3>${esc(member.brand)}</h3><p>${esc(member.note||'')}</p></div>
      <a href="${esc(member.sourceUrl)}" target="_blank" rel="noreferrer"><span>Official reference</span><strong>${esc(member.sourceLabel||member.brand)} ↗</strong></a>
    </article>`).join('')}</div>
    <div class="cluster-reading"><p><strong>How to read:</strong> このClusterはブランドの違いを消すためではなく、「共通の問題」と「各社の分岐」を分離して読むためのもの。Coverage上では1 referenceとして数え、同一業界だけで密度を水増ししない。</p></div>`;

  const detailGrid=root.querySelector('.detail-grid');
  if(detailGrid)detailGrid.before(section); else root.appendChild(section);
})();
