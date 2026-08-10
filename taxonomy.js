(function(){
  const patterns=window.LIKEWHAT_PATTERNS||[];
  const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
  const text=p=>[p.brand,p.family,p.name,...(p.tags||[]),...(p.uiParts||[])].join(' ').toLowerCase();

  const brandPresets={
    'Apple':{domain:'Digital Product',medium:'Web / App / OS',space:[35,20,25,45,60,90]},
    'Notion':{domain:'SaaS / Knowledge Work',medium:'Web App',space:[55,20,45,35,70,85]},
    'Linear':{domain:'SaaS / Operations',medium:'Web App',space:[80,15,20,45,85,95]},
    'Arc':{domain:'Browser / Productivity',medium:'Desktop App',space:[45,35,55,25,85,70]},
    'GitHub':{domain:'Developer Platform',medium:'Web App',space:[75,15,25,55,75,90]},
    'Google':{domain:'Productivity / Platform',medium:'Web App',space:[60,25,35,65,70,85]},
    'Stripe':{domain:'Fintech / SaaS',medium:'Web App',space:[65,15,20,70,70,92]},
    'Slack':{domain:'Communication / SaaS',medium:'Web App',space:[70,45,50,40,80,75]},
    'Figma':{domain:'Creative Tool',medium:'Web App',space:[70,30,50,25,95,85]},
    'Shopify':{domain:'Commerce / Admin',medium:'Web App',space:[65,20,25,55,80,90]},
    'Airbnb':{domain:'Marketplace / Travel',medium:'Web / App',space:[50,45,65,25,70,80]},
    'Vercel':{domain:'Developer Platform',medium:'Web App',space:[65,15,25,45,80,95]},
    'オモコロ':{domain:'Media / Culture',medium:'Web',space:[75,90,95,10,35,25]},
    '集英社':{domain:'Publishing / Media',medium:'Web',space:[65,60,75,55,30,60]},
    'Nintendo':{domain:'Entertainment / Games',medium:'Web / Device',space:[55,70,70,35,55,75]}
  };

  function archetypeFor(p){
    const s=text(p);
    if(/dashboard|metrics|deploy|financial/.test(s)) return 'Monitoring Dashboard';
    if(/command|slash/.test(s)) return 'Command-driven Interface';
    if(/editor|document|longform|article/.test(s)) return 'Content-first Editor / Reader';
    if(/catalog|listing|shelf|software/.test(s)) return 'Catalog & Discovery';
    if(/feed|editorial|topics|discovery/.test(s)) return 'Editorial Discovery';
    if(/settings|properties|form/.test(s)) return 'Configuration Interface';
    if(/sidebar|navigation|tabs|workspace/.test(s)) return 'Persistent Navigation';
    if(/detail|issue|repo/.test(s)) return 'Master–Detail / Object Detail';
    if(/hero|marketing/.test(s)) return 'Brand / Product Narrative';
    if(/sheet|overlay|floating|modal/.test(s)) return 'Contextual Overlay';
    return 'General Interaction Pattern';
  }

  function interactionFor(p){
    const s=text(p);
    if(/command|slash/.test(s)) return 'Command-driven';
    if(/canvas|editor|toolbar/.test(s)) return 'Direct manipulation';
    if(/dashboard|metrics|deploy/.test(s)) return 'Monitoring & drill-down';
    if(/catalog|listing|shelf|feed|editorial|topics|discovery/.test(s)) return 'Browse → scan → select';
    if(/table|list|issue|database/.test(s)) return 'Scan → filter → act';
    if(/settings|properties|form/.test(s)) return 'Inspect → configure → confirm';
    if(/navigation|sidebar|tabs|workspace/.test(s)) return 'Persistent spatial navigation';
    if(/hero|marketing|longform/.test(s)) return 'Read / observe / progress';
    if(/sheet|overlay|modal/.test(s)) return 'Contextual decision';
    return 'Browse → select → act';
  }

  function philosophyFor(p){
    const s=text(p),out=[];
    if(/settings|table|list|dashboard|issue/.test(s)) out.push('Recognition over recall','Operational clarity');
    if(/editor|document|longform|article/.test(s)) out.push('Content-first design','Low interface chrome');
    if(/command|slash|overlay|sheet/.test(s)) out.push('Progressive complexity','Context preservation');
    if(/editorial|feed|discovery|catalog|topics|shelf/.test(s)) out.push('Serendipity','Information scent');
    if(/hero|marketing/.test(s)) out.push('Brand primacy','Focused attention');
    if(p.brand==='オモコロ') out.push('Editorial personality','Anti-template');
    if(p.brand==='Nintendo') out.push('Playful legibility','Approachable systems');
    if(p.brand==='集英社') out.push('Publication rhythm','IP-centered navigation');
    return [...new Set(out)].slice(0,4);
  }

  function designSpaceFor(p,preset){
    let [density,emotion,exploration,authority,interaction,order]=preset.space;
    const s=text(p);
    if(/hero|marketing/.test(s)){density-=25;emotion+=20;exploration+=15;interaction-=20;}
    if(/settings|properties|form/.test(s)){density+=5;exploration-=25;authority+=10;order+=5;}
    if(/editorial|feed|discovery|topics/.test(s)){density+=5;emotion+=15;exploration+=25;interaction-=10;order-=10;}
    if(/command|slash/.test(s)){density+=10;exploration-=20;interaction+=20;order+=5;}
    if(/dashboard|table|list|issue|database|deploy/.test(s)){density+=15;exploration-=20;interaction+=10;order+=5;}
    if(/sheet|overlay|modal|floating/.test(s)){density-=5;exploration-=10;interaction+=15;}
    if(/catalog|listing|shelf/.test(s)){density+=10;exploration+=15;}
    if(/longform|article|document/.test(s)){interaction-=25;order+=5;}
    return {density:clamp(density),emotion:clamp(emotion),exploration:clamp(exploration),authority:clamp(authority),interaction:clamp(interaction),order:clamp(order)};
  }

  patterns.forEach(p=>{
    const preset=brandPresets[p.brand]||{domain:'Digital Product',medium:'Web',space:[50,40,50,40,60,70]};
    p.schemaVersion=2;
    p.domain=p.domain||preset.domain;
    p.medium=p.medium||preset.medium;
    p.archetype=p.archetype||archetypeFor(p);
    p.interactionModel=p.interactionModel||interactionFor(p);
    p.philosophy=p.philosophy||philosophyFor(p);
    p.designSpace=p.designSpace||designSpaceFor(p,preset);
    p.implementationTerms=p.implementationTerms||[];
    p.designTerms=p.designTerms||[];
    p.philosophyTerms=p.philosophyTerms||[];
    p.opposites=p.opposites||[];
    p.related=p.related||[];
  });

  window.LikeWhatTaxonomy={
    schemaVersion:2,
    axes:[
      {key:'density',low:'Sparse',high:'Dense'},
      {key:'emotion',low:'Calm',high:'Excitable'},
      {key:'exploration',low:'Efficiency',high:'Exploration'},
      {key:'authority',low:'Personal',high:'Institutional'},
      {key:'interaction',low:'Observation',high:'Direct Manipulation'},
      {key:'order',low:'Chaotic',high:'Systematic'}
    ],
    brandPresets
  };
})();
