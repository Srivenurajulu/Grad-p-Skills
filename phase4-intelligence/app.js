/* ═══ ICR Phase 4 — Intelligence & Teams ═══ */

const SKILLS=[
  {id:'weekly-report',name:'Weekly Status Report',icon:'📊',desc:'Engineering team reports',kw:['status report','weekly report','sprint progress','team update'],tokens:900,quality:3,speed:8,type:'manual'},
  {id:'code-review',name:'Security Reviewer',icon:'🔒',desc:'OWASP Top 10 analysis',kw:['security','code review','vulnerability','sql injection','xss','owasp'],tokens:1100,quality:5,speed:10,type:'manual'},
  {id:'api-docs',name:'API Doc Writer',icon:'📝',desc:'OpenAPI documentation',kw:['api doc','documentation','openapi','swagger','endpoint','write docs'],tokens:1400,quality:4,speed:9,type:'manual'},
  {id:'email',name:'Email Drafter',icon:'📧',desc:'Professional emails',kw:['draft email','write email','email to','compose email'],tokens:600,quality:2,speed:5,type:'manual'},
  {id:'pr-desc',name:'PR Description Writer',icon:'🔀',desc:'Generates PR descriptions',kw:['pr description','pull request','diff','pr for'],tokens:700,quality:5,speed:7,type:'auto'}
];

const SIMPLE={tokens:2100,quality:3,speed:12};

// Feedback State
const fbStats={acc:0,rej:0,ovr:0};

const $=id=>document.getElementById(id);
const msgs=$('msgs'),inp=$('inp'),ibar=$('ibar');

// ── Tabs ──
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
  t.classList.add('on');$(`v-${t.dataset.v}`).classList.add('on');
  if(t.dataset.v==='learning')renderChart();
}));

// ── Rendering Helpers ──
function addMsg(type,html){
  const d=document.createElement('div');
  d.className=`msg ${type}`;d.innerHTML=`<div class="mb">${html}</div>`;
  msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;
}
function addCard(html){const d=document.createElement('div');d.innerHTML=html;msgs.appendChild(d.firstElementChild);msgs.scrollTop=msgs.scrollHeight;}
function showTyping(){const d=document.createElement('div');d.className='msg bot typ';d.innerHTML='<div class="mb"><div class="typing"><span></span><span></span><span></span></div></div>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;}
function log(txt,cls=''){
  const el=$('rlog'),e=el.querySelector('.muted');if(e)e.remove();
  const d=document.createElement('div');d.className=`rle ${cls}`;
  d.innerHTML=`<span class="rlt">${new Date().toLocaleTimeString()}</span><br>${txt}`;
  el.prepend(d);if(el.children.length>15)el.lastChild.remove();
}

function updateFbStats(){
  $('fb-acc').textContent=fbStats.acc;
  $('fb-rej').textContent=fbStats.rej;
  $('fb-ovr').textContent=fbStats.ovr;
}

function addLearningSignal(type,score,desc){
  const feed=$('sig-feed');
  const d=document.createElement('div');d.className='sig-item';
  let icon,cls,title;
  if(type==='acc'){icon='✓';cls='green';title=`Positive Signal (+${score})`;}
  if(type==='rej'){icon='✕';cls='red';title=`Negative Signal (-${score})`;}
  if(type==='ovr'){icon='⤤';cls='amber';title=`Override Signal (+${score})`;}
  
  d.innerHTML=`<div class="sig-icon ${cls}">${icon}</div><div class="sig-content"><strong>${title}</strong><span>${desc}</span></div>`;
  feed.prepend(d);
  
  // Highlight loop active step temporarily
  const steps=document.querySelectorAll('.ld-step');
  steps.forEach(s=>s.classList.remove('active'));
  steps[1].classList.add('active');
  setTimeout(()=>{steps[1].classList.remove('active');steps[2].classList.add('active');},1000);
  setTimeout(()=>{steps[2].classList.remove('active');steps[0].classList.add('active');},2000);
}

// ── Intent Matching ──
function findSkill(text){
  const low=text.toLowerCase();
  let best=null,score=0;
  for(const sk of SKILLS){
    let s=0;for(const k of sk.kw)if(low.includes(k))s+=k.split(' ').length*12;
    if(s>score){score=s;best=sk;}
  }
  return score>10?{skill:best,conf:Math.min(95,40+score)}:null;
}

// ── Responses ──
function respondSkill(sk){
  const t=showTyping();
  setTimeout(()=>{t.remove();
    addMsg('bot',`<p>Action completed via <strong>${sk.name}</strong>.</p><p style="color:var(--green);font-size:.72rem;margin-top:4px">✦ Quality: ${sk.quality}/5 · High consistency</p>`);
  },1000);
}
function respondSimple(){
  const t=showTyping();
  setTimeout(()=>{t.remove();addMsg('bot','<p>Here\'s the response generated via Simple Prompting.</p><p style="color:var(--t3);font-size:.72rem">⚡ ~2100 tokens · Variable consistency</p>');},1000);
}

// ── Main Router ──
function process(text){
  if(!text.trim())return;
  addMsg('usr',`<p>${text}</p>`);
  const tRaw=inp.value;
  inp.value='';inp.style.height='auto';ibar.classList.add('hidden');

  const match=findSkill(text);
  if(match&&match.conf>85){
    log(`🎯 High (${match.conf}%): ${match.skill.name} → Nudge`,'');
    const sk=match.skill,saved=SIMPLE.tokens-sk.tokens;
    addCard(`<div class="icr-nudge"><div class="ni">
      <div class="nt">💡 I recommend using your <strong>"${sk.name}"</strong> Skill.</div>
      <div class="nb"><button class="btn-p n-y">▶ Use Skill</button><button class="btn-o n-n">Just reply this time</button></div>
      <div class="ns">Savings: ~${saved} tokens · Quality: High</div>
    </div></div>`);
    const nudge=msgs.querySelector('.icr-nudge:last-child');
    nudge.querySelector('.n-y').onclick=()=>{
      log(`✅ Accepted: ${sk.name}`,'ok');
      fbStats.acc++;updateFbStats();
      addLearningSignal('acc',0.5,`User accepted "${sk.name}" for query "${tRaw}"`);
      nudge.remove();respondSkill(sk);
    };
    nudge.querySelector('.n-n').onclick=()=>{
      log(`⛔ Dismissed: ${sk.name}`,'no');
      fbStats.rej++;updateFbStats();
      addLearningSignal('rej',0.8,`User dismissed recommendation for "${sk.name}"`);
      nudge.remove();respondSimple();
    };
  }else if(match&&match.conf>=50){
    log(`⚖️ Med (${match.conf}%): ${match.skill.name} → Nudge`,'');
    const sk=match.skill;
    addCard(`<div class="icr-nudge"><div class="ni">
      <div class="nt">💡 Want me to use <strong>"${sk.name}"</strong> or just reply normally?</div>
      <div class="nb"><button class="btn-p n-y">▶ Use Skill</button><button class="btn-o n-n">Simple Prompt</button></div>
    </div></div>`);
    const nudge=msgs.querySelector('.icr-nudge:last-child');
    nudge.querySelector('.n-y').onclick=()=>{
      log(`✅ Accepted (Med): ${sk.name}`,'ok');
      fbStats.acc++;updateFbStats();
      addLearningSignal('acc',0.7,`User chose "${sk.name}" from comparison card`);
      nudge.remove();respondSkill(sk);
    };
    nudge.querySelector('.n-n').onclick=()=>{
      log(`⤤ Override: User chose simple`,'sc');
      fbStats.ovr++;updateFbStats();
      addLearningSignal('ovr',1.2,`User overrode "${sk.name}" prediction and chose Simple Prompt`);
      nudge.remove();respondSimple();
    };
  }else{
    log(`🔇 Low: Silent mode`,'si');
    respondSimple();
  }
}

// ── Live Intent Preview ──
let pt;
inp.addEventListener('input',()=>{
  inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,100)+'px';
  clearTimeout(pt);const t=inp.value.trim();
  if(t.length<5){ibar.classList.add('hidden');return;}
  pt=setTimeout(()=>{
    const m=findSkill(t);
    const lvl=m?(m.conf>85?'high':m.conf>=50?'med':'low'):'low';
    const cols={high:'var(--green)',med:'var(--amber)',low:'var(--t3)'};
    ibar.innerHTML=`<span style="color:${cols[lvl]}">●</span> Conf: <strong>${m?m.conf+'%':'N/A'}</strong> · Match: <strong>${m?m.skill.name:'None'}</strong>`;
    ibar.classList.remove('hidden');
  },200);
});

$('send').addEventListener('click',()=>process(inp.value));
inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();process(inp.value);}});
document.addEventListener('click',e=>{if(e.target.tagName==='EM'&&e.target.closest('.hint')){inp.value=e.target.textContent;inp.dispatchEvent(new Event('input'));inp.focus();}});

function updateSkillSidebar(){
  const el=$('skills-sidebar');el.innerHTML='';
  $('skill-count').textContent=SKILLS.length;
  for(const sk of SKILLS){
    el.innerHTML+=`<div class="sk-sb"><span class="sk-i">${sk.icon}</span><div><strong>${sk.name}</strong><small>${sk.desc}</small></div></div>`;
  }
}

// ── Health Scan Simulation ──
$('run-scan').addEventListener('click',function(){
  const btn=this;
  btn.textContent='Scanning...';btn.disabled=true;
  const cards=document.querySelectorAll('.hc-card');
  cards.forEach(c=>{c.style.opacity='0.3';c.style.transform='scale(0.98)';});
  
  setTimeout(()=>{
    btn.textContent='↻ Run Scan Now';btn.disabled=false;
    cards.forEach((c,i)=>{
      setTimeout(()=>{
        c.style.transition='all 0.4s ease';
        c.style.opacity='1';c.style.transform='scale(1)';
        c.style.boxShadow='0 0 15px var(--ag)';
        setTimeout(()=>c.style.boxShadow='none',600);
      },i*150);
    });
  },1500);
});

// ── Chart ──
let chartRendered=false;
function renderChart(){
  if(chartRendered)return;
  const ctx=$('accuracy-chart').getContext('2d');
  
  // Custom simple line chart using Canvas API
  const W=ctx.canvas.width=ctx.canvas.parentElement.clientWidth;
  const H=ctx.canvas.height=220;
  
  const data=[75,76,78,79,83,85,87,89,90,91];
  const padding=30;
  const cw=W-padding*2;
  const ch=H-padding*2;
  
  ctx.clearRect(0,0,W,H);
  
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.05)';
  ctx.lineWidth=1;
  ctx.beginPath();
  for(let i=0;i<=4;i++){
    const y=padding+(ch/4)*i;
    ctx.moveTo(padding,y);ctx.lineTo(W-padding,y);
  }
  ctx.stroke();
  
  // Line
  ctx.beginPath();
  ctx.strokeStyle='#8b5cf6';
  ctx.lineWidth=3;
  ctx.lineCap='round';
  ctx.lineJoin='round';
  
  data.forEach((val,i)=>{
    const x=padding+(cw/(data.length-1))*i;
    const y=padding+ch-((val-70)/25)*ch;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.stroke();
  
  // Gradient fill
  ctx.lineTo(W-padding,H-padding);
  ctx.lineTo(padding,H-padding);
  ctx.fillStyle='rgba(139,92,246,0.1)';
  ctx.fill();
  
  // Points
  ctx.fillStyle='#8b5cf6';
  data.forEach((val,i)=>{
    const x=padding+(cw/(data.length-1))*i;
    const y=padding+ch-((val-70)/25)*ch;
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle='#1e1e32';
    ctx.lineWidth=2;
    ctx.stroke();
    
    if(i===0||i===data.length-1||i===5){
      ctx.fillStyle='#9898a8';
      ctx.font='11px Inter';
      ctx.textAlign='center';
      ctx.fillText(val+'%',x,y-12);
      ctx.fillStyle='#8b5cf6';
    }
  });

  chartRendered=true;
}

// ── Init ──
updateSkillSidebar();
updateFbStats();
