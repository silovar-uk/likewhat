(function(){
  function injectStyles(){
    if(document.getElementById('lw-site-polish'))return;
    const style=document.createElement('style');
    style.id='lw-site-polish';
    style.textContent=`
      /* SERENDIPITY — mode first, draw action immediately beside it. */
      .randomizer{grid-template-columns:minmax(0,1fr)!important;}
      .randomizer-copy{max-width:none!important;}
      .random-control-row{display:flex;align-items:flex-end;gap:9px;flex-wrap:nowrap;margin-top:13px;position:relative;z-index:3;}
      .random-control-row .random-modes{margin-top:0!important;flex:0 1 auto;}
      .random-control-row .random-draw-button{margin:0!important;flex:0 0 auto;height:39px!important;min-height:39px!important;padding:0 16px!important;border-radius:999px!important;box-shadow:0 3px 0 #77736b,0 8px 18px rgba(20,20,18,.13)!important;font-weight:780!important;}
      .random-control-row .random-draw-button:hover{transform:translateY(-1px)!important;box-shadow:0 4px 0 #77736b,0 10px 22px rgba(20,20,18,.16)!important;}
      .random-control-row .random-draw-button:active{transform:translateY(2px)!important;box-shadow:0 1px 0 #77736b,0 4px 10px rgba(20,20,18,.12)!important;}
      .random-control-row .random-draw-button>span{font-size:10px!important;font-weight:780!important;}
      @media(max-width:650px){
        .random-control-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;margin-top:11px;}
        .random-control-row .random-modes{width:100%!important;margin:0!important;}
        .random-control-row .random-draw-button{width:auto!important;justify-self:end!important;height:36px!important;min-height:36px!important;padding:0 12px!important;}
      }
      @media(max-width:430px){
        .random-control-row{grid-template-columns:1fr;}
        .random-control-row .random-draw-button{justify-self:start!important;}
      }

      /* マツコの知らない世界 — warm candy-set palette + dense, playful presentation grammar. */
      .tv-expert-presentation[data-brand="マツコの知らない世界"]{
        --tv-paper:#f6a21f;
        --tv-ink:#542443;
        --tv-hot:#e94668;
        --tv-cool:#4f963f;
        color:var(--tv-ink)!important;
        background:
          radial-gradient(circle at 12% 18%,rgba(255,242,204,.92) 0 3px,transparent 4px),
          radial-gradient(circle at 83% 74%,rgba(255,238,190,.72) 0 4px,transparent 5px),
          linear-gradient(145deg,#ffc13a 0%,#f7a51f 48%,#ed7f27 100%)!important;
        font-weight:700;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] header{
        min-height:35px!important;
        padding:7px 10px!important;
        border-bottom:3px solid #e94668!important;
        background:#fff0c8!important;
        color:#542443!important;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] header b{
        font-size:10px!important;
        font-weight:950!important;
        letter-spacing:-.055em!important;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] header span{
        padding:2px 5px;
        border-radius:999px;
        background:#4f963f;
        color:#fff9df;
        font-weight:900;
        letter-spacing:.08em;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] main{
        position:relative;
        grid-template-columns:minmax(0,1fr) 62px!important;
        gap:8px!important;
        padding:10px 15px 10px 9px!important;
        background:linear-gradient(90deg,transparent calc(100% - 10px),repeating-linear-gradient(135deg,#fff0c8 0 6px,#e94668 6px 12px) calc(100% - 10px)/10px 100% no-repeat)!important;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-slide{
        position:relative;
        overflow:hidden;
        padding:8px!important;
        border:2px solid #542443!important;
        border-radius:7px;
        background:#fff0c8!important;
        box-shadow:3px 3px 0 #e94668;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-slide:after{
        content:'';
        position:absolute;
        top:6px;
        right:7px;
        width:21px;
        height:21px;
        border:2px solid #fff0c8;
        border-radius:50%;
        background:radial-gradient(circle at 50% 50%,#fff0c8 0 18%,#e94668 19% 35%,#fff0c8 36% 50%,#e94668 51% 68%,#fff0c8 69% 100%);
        box-shadow:0 0 0 1px #542443;
        opacity:.92;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-slide>small{
        display:inline-flex!important;
        align-items:center;
        min-height:16px;
        padding:2px 6px!important;
        border-radius:999px;
        background:#4f963f;
        color:transparent!important;
        font-size:0!important;
        letter-spacing:0!important;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-slide>small:after{
        content:'偏愛歴 → DEEP';
        color:#fff9df;
        font-size:6px;
        font-weight:950;
        letter-spacing:.08em;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-slide strong{
        max-width:82%;
        margin:7px 0 6px!important;
        color:#542443;
        font-size:14px!important;
        font-weight:950!important;
        line-height:1.02;
        letter-spacing:-.07em!important;
        text-shadow:0 1px 0 #fff8e6;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-chiprow{gap:4px!important;}
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-chiprow i{
        min-width:25px;
        padding:4px 5px!important;
        border:1px solid #e94668!important;
        border-radius:4px!important;
        background:#fffaf0;
        color:#542443;
        font-size:6px!important;
        font-weight:950!important;
        text-align:center;
        box-shadow:1px 1px 0 rgba(84,36,67,.18);
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-rating{
        position:relative;
        justify-content:center!important;
        gap:5px!important;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-rating:before{
        content:'偏愛深度';
        display:block;
        margin-bottom:1px;
        color:#542443;
        font-size:6px;
        font-weight:950;
        text-align:center;
        letter-spacing:.08em;
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-rating b{
        padding:5px 4px!important;
        border:1px solid #542443!important;
        border-radius:4px;
        background:#fff0c8!important;
        color:#542443!important;
        font-size:7px!important;
        font-weight:950!important;
        text-align:center;
        box-shadow:1px 2px 0 rgba(84,36,67,.2);
      }
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-rating b:nth-child(2){background:#ffc73c!important;}
      .tv-expert-presentation[data-brand="マツコの知らない世界"] .tv-rating b:last-child{
        border-color:#b62f51!important;
        background:#e94668!important;
        color:#fff8e7!important;
        transform:rotate(-2deg) scale(1.03);
      }
    `;
    document.head.appendChild(style);
  }

  function setupRandomControlRow(){
    const modes=document.getElementById('randomModes');
    const draw=document.getElementById('randomDraw');
    if(!modes||!draw||modes.closest('.random-control-row'))return;
    const row=document.createElement('div');
    row.className='random-control-row';
    modes.parentNode.insertBefore(row,modes);
    row.appendChild(modes);
    row.appendChild(draw);
  }

  injectStyles();
  setupRandomControlRow();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupRandomControlRow,{once:true});
})();