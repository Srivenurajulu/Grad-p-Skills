/* ═══ ICR Phase 2 — MVP Engine ═══ */

// ── Skills Database ──
const SKILLS={
  'weekly-report':{name:'Weekly Status Report',icon:'📊',desc:'Engineering team reports',kw:['status report','weekly report','sprint progress','standup','team update'],tokens:900,quality:5,speed:8,consistency:'High',benefits:['Remembers your team structure','Consistent formatting','Reusable weekly']},
  'code-review':{name:'Security Reviewer',icon:'🔒',desc:'OWASP Top 10 analysis',kw:['security','code review','vulnerability','sql injection','xss','owasp'],tokens:1100,quality:5,speed:10,consistency:'High',benefits:['OWASP Top 10 checklist','Severity-ranked findings','Fix suggestions']},
  'api-docs':{name:'API Doc Writer',icon:'📝',desc:'OpenAPI documentation',kw:['api doc','documentation','openapi','swagger','endpoint','write docs'],tokens:1400,quality:4,speed:9,consistency:'High',benefits:['OpenAPI format','Auto-generates examples','Consistent structure']},
  'email':{name:'Email Drafter',icon:'📧',desc:'Professional emails',kw:['draft email','write email','email to','compose email'],tokens:600,quality:4,speed:5,consistency:'High',benefits:['Professional tone','Template memory','Quick formatting']}
};
const SIMPLE={name:'Simple Prompt',icon:'📝',tokens:2100,quality:3,speed:12,consistency:'Low',benefits:['Good for one-off requests']};

// ── State ──
let abGroup='treatment';
const state={routed:0,accepted:0,dismissed:0,tokensSaved:0,journal:[]};
const dismissals={};// skillId -> count
const suppressed={};// skillId -> true if suppressed
const patterns={
  'pr':{label:'PR descriptions',count:1,max:3,kw:['pr description','pull request','diff summary','pr for']},
  'email':{label:'Email drafts',count:0,max:3,kw:['draft email','write email','email to']}
};

// ── DOM ──
const $=id=>document.getElementById(id);
const chatMsgs=$('chat-messages'),chatInput=$('chat-input'),intentBar=$('intent-bar');
const scaffoldModal=$('scaffold-modal');
const journalEntries=$('journal-entries');

// ── Tab Navigation ──
document.querySelectorAll('.tab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.view').forEach(x=>x.classList.remove('active-view'));
    t.classList.add('active');
    $(`view-${t.dataset.view}`).classList.add('active-view');
  });
});

// ── A/B Toggle ──
$('btn-toggle-ab').addEventListener('click',()=>{
  abGroup=abGroup==='treatment'?'control':'treatment';
  const dot=$('ab-indicator').querySelector('.ab-dot');
  dot.className=`ab-dot ${abGroup}`;
  dot.nextElementSibling.textContent=abGroup==='treatment'?'Treatment Group':'Control Group';
  $('group-label').textContent=abGroup==='treatment'?'Treatment':'Control';
  // Clear chat for fresh demo
  chatMsgs.innerHTML='';
  const banner=abGroup==='control'
    ?`<div class="control-banner"><p>⚠️ Control Group — No ICR recommendations. Standard Claude experience.</p></div>`:'';
  addMsg('sys',`${banner}<p>👋 <strong>ICR Phase 2 — MVP</strong></p><p>You're now in the <strong>${abGroup==='treatment'?'Treatment':'Control'}</strong> group.</p><p class="hint">Try: <em>"Write a weekly status report"</em> · <em>"Review this code for security"</em></p>`);
});

// ── Rollout Expand ──
$('btn-expand-rollout').addEventListener('click',function(){
  $('rollout-badge').textContent='🟢 Rollout: 25%';
  $('rollout-badge').style.background='rgba(34,197,94,0.2)';
  this.textContent='Expanded ✓';this.disabled=true;this.style.opacity='.5';
});

// ── Intent Analyzer ──
function analyze(text){
  const low=text.toLowerCase();
  let best=null,bestScore=0;
  for(const[id,sk]of Object.entries(SKILLS)){
    let s=0;for(const k of sk.kw)if(low.includes(k))s+=k.split(' ').length*15;
    if(s>bestScore){bestScore=s;best={id,skill:sk,score:s};}
  }
  // multi-intent
  const matches=[];
  for(const[id,sk]of Object.entries(SKILLS)){
    let s=0;for(const k of sk.kw)if(low.includes(k))s+=k.split(' ').length*15;
    if(s>10)matches.push({id,skill:sk,score:s});
  }
  // pattern
  let pat=null;
  for(const[id,p]of Object.entries(patterns)){
    for(const k of p.kw)if(low.includes(k)){pat={id,p};break;}
    if(pat)break;
  }
  let conf=bestScore>0?Math.min(95,40+bestScore):15;
  if(low.length<20)conf=Math.min(conf,35);
  // check suppression
  if(best&&suppressed[best.id])conf=10;
  return{best,conf,multi:matches.length>=2,matches,pat,text};
}

// ── Rendering ──
function addMsg(type,html){
  const d=document.createElement('div');
  d.className=`msg ${type==='user'?'user-msg':type==='sys'?'sys-msg':'bot-msg'}`;
  d.innerHTML=`<div class="msg-body">${html}</div>`;
  chatMsgs.appendChild(d);chatMsgs.scrollTop=chatMsgs.scrollHeight;return d;
}
function addCard(html){const d=document.createElement('div');d.innerHTML=html;chatMsgs.appendChild(d.firstElementChild);chatMsgs.scrollTop=chatMsgs.scrollHeight;}
function showTyping(){const d=document.createElement('div');d.className='msg bot-msg typ';d.innerHTML='<div class="msg-body"><div class="typing"><span></span><span></span><span></span></div></div>';chatMsgs.appendChild(d);chatMsgs.scrollTop=chatMsgs.scrollHeight;return d;}
function dots(n,t=5){return Array.from({length:t},(_,i)=>`<span class="q-dot${i<n?' f':''}"></span>`).join('');}
function logEntry(txt,cls=''){
  const el=$('routing-log'),empty=el.querySelector('.log-empty');if(empty)empty.remove();
  const e=document.createElement('div');e.className=`log-e ${cls}`;
  e.innerHTML=`<span class="log-t">${new Date().toLocaleTimeString()}</span><br>${txt}`;
  el.prepend(e);if(el.children.length>12)el.lastChild.remove();
}

// ── Journal ──
function addJournal(input,route,skill,outcome,tokensSaved=0){
  state.journal.push({input,route,skill,outcome,tokensSaved,time:new Date()});
  const empty=journalEntries.querySelector('.log-empty');if(empty)empty.remove();
  const badges={nudge:'nudge',comparison:'comp',silent:'silent',scaffold:'scaffold'};
  const results={accepted:`<span class="j-tag accepted">✓ Accepted</span>`,dismissed:`<span class="j-tag dismissed">✕ Dismissed</span>`};
  const e=document.createElement('div');e.className='j-entry';
  e.innerHTML=`<div class="j-entry-head"><span class="j-route-badge ${badges[route]||''}">${route.toUpperCase()}</span><span class="j-time">${new Date().toLocaleTimeString()}</span></div>
    <div class="j-entry-body">"${input.substring(0,80)}${input.length>80?'...':''}"${skill?` → <strong>${skill}</strong>`:''}</div>
    <div class="j-entry-result">${results[outcome]||''}${tokensSaved?`<span class="j-tag tokens">-${tokensSaved} tokens</span>`:''}</div>`;
  journalEntries.prepend(e);
  // Update summary
  const accepted=state.journal.filter(j=>j.outcome==='accepted').length;
  const dismissed=state.journal.filter(j=>j.outcome==='dismissed').length;
  const saved=state.journal.reduce((s,j)=>s+j.tokensSaved,0);
  $('j-total').textContent=state.journal.length;
  $('j-accepted').textContent=accepted;
  $('j-dismissed').textContent=dismissed;
  $('j-saved').textContent=saved.toLocaleString();
}

// ── Dismissal Intelligence ──
function trackDismissal(skillId){
  dismissals[skillId]=(dismissals[skillId]||0)+1;
  if(dismissals[skillId]>=3){
    suppressed[skillId]=true;
    logEntry(`🚫 Suppressed: "${SKILLS[skillId]?.name}" (3 dismissals → 30-day cooldown)`,'no');
  }
  updateDismissalUI();
}
function updateDismissalUI(){
  const el=$('dismissal-tracker');el.innerHTML='';
  for(const[id,sk]of Object.entries(SKILLS)){
    const count=dismissals[id]||0;
    const isSup=suppressed[id];
    const pips=Array.from({length:3},(_,i)=>`<span class="dismiss-pip${i<count?(isSup?' suppressed':' filled'):''}"></span>`).join('');
    el.innerHTML+=`<div class="dismiss-row"><span>${sk.name}</span><div class="dismiss-dots">${pips}</div></div>
      ${isSup?'<div class="dismiss-status" style="color:var(--red);padding-left:4px">Suppressed 30d</div>':''}`;
  }
}

// ── Pattern Tracker UI ──
function updatePatterns(){
  // Patterns are shown in sidebar — reuse dismissal area space isn't enough, so skip for now
}

// ── ICR Renderers ──
function renderNudge(a){
  const sk=a.best.skill,saved=SIMPLE.tokens-sk.tokens;
  addCard(`<div class="icr-nudge"><div class="nudge-inner">
    <div class="nudge-txt">💡 I recommend using your <strong>"${sk.name}"</strong> Skill for this task.</div>
    <div class="nudge-btns"><button class="btn-primary nudge-yes" data-sk="${a.best.id}">▶ Use Skill</button><button class="btn-outline nudge-no" data-sk="${a.best.id}">Just reply this time</button></div>
    <div class="nudge-save">Estimated savings: ~${saved} tokens/use · Quality: High · Speed: ~${sk.speed}s</div>
    <div class="nudge-timer"></div>
  </div></div>`);
  const nudge=chatMsgs.querySelector('.icr-nudge:last-child');
  nudge.querySelector('.nudge-yes').onclick=()=>{
    state.accepted++;state.tokensSaved+=saved;
    logEntry(`✅ Accepted: ${sk.name} (saved ~${saved})`,`ok`);
    addJournal(a.text,'nudge',sk.name,'accepted',saved);
    nudge.remove();respondSkill(sk,a.text);
  };
  nudge.querySelector('.nudge-no').onclick=()=>{
    state.dismissed++;trackDismissal(a.best.id);
    logEntry(`⛔ Dismissed: ${sk.name}`,`no`);
    addJournal(a.text,'nudge',sk.name,'dismissed');
    nudge.remove();respondSimple(a.text);
  };
  setTimeout(()=>{if(nudge.parentNode){nudge.remove();respondSimple(a.text);}},10000);
}

function renderComparison(a){
  const sk=a.best.skill,saved=SIMPLE.tokens-sk.tokens;
  addCard(`<div class="icr-comp">
    <div class="comp-head">"I see a few ways to handle this. Here's the tradeoff:"</div>
    <div class="comp-grid">
      <div class="comp-opt" data-ch="simple"><div class="opt-title">${SIMPLE.icon} Simple Prompt</div>
        <div class="opt-metrics"><div class="m-row"><span>Tokens</span><span class="m-v">~${SIMPLE.tokens}</span></div><div class="m-row"><span>Quality</span><span class="q-dots">${dots(SIMPLE.quality)}</span></div><div class="m-row"><span>Consistency</span><span class="m-v">${SIMPLE.consistency}</span></div><div class="m-row"><span>Speed</span><span class="m-v">~${SIMPLE.speed}s</span></div></div>
        <div class="opt-bens"><span>${SIMPLE.benefits[0]}</span></div><button class="btn-use">Use This</button></div>
      <div class="comp-opt rec" data-ch="skill" data-sk="${a.best.id}"><div class="opt-title">${sk.icon} "${sk.name}"</div>
        <div class="opt-metrics"><div class="m-row"><span>Tokens</span><span class="m-v">~${sk.tokens}</span></div><div class="m-row"><span>Quality</span><span class="q-dots">${dots(sk.quality)}</span></div><div class="m-row"><span>Consistency</span><span class="m-v">${sk.consistency}</span></div><div class="m-row"><span>Speed</span><span class="m-v">~${sk.speed}s</span></div></div>
        <div class="opt-bens">${sk.benefits.map(b=>`<span class="ben">✦ ${b}</span>`).join('')}</div><button class="btn-use">Use This ★</button></div>
    </div>
    <div class="comp-foot"><span>★ = ICR recommended</span><span style="cursor:pointer;opacity:.7">Don't show comparisons for this</span></div>
  </div>`);
  const card=chatMsgs.querySelector('.icr-comp:last-child');
  card.querySelector('[data-ch="simple"] .btn-use').onclick=()=>{
    state.dismissed++;trackDismissal(a.best.id);
    logEntry(`⛔ Chose Simple over ${sk.name}`,'no');
    addJournal(a.text,'comparison',sk.name,'dismissed');
    card.remove();respondSimple(a.text);
  };
  card.querySelector('[data-ch="skill"] .btn-use').onclick=()=>{
    state.accepted++;state.tokensSaved+=saved;
    logEntry(`✅ Accepted: ${sk.name} via comparison`,'ok');
    addJournal(a.text,'comparison',sk.name,'accepted',saved);
    card.remove();respondSkill(sk,a.text);
  };
}

function renderMulti(a){
  const steps=a.matches.map((m,i)=>`<div class="multi-step"><span class="step-n">${i+1}</span><span>${m.skill.kw[0]}</span><span class="step-tag">${m.skill.name}</span></div>`).join('');
  addCard(`<div class="icr-multi"><div class="multi-inner">
    <div class="multi-hdr">🔀 I detected <strong>${a.matches.length} sub-intents</strong>. I can chain them:</div>
    <div class="multi-steps">${steps}</div>
    <div style="display:flex;gap:8px"><button class="btn-primary multi-y">▶ Chain All</button><button class="btn-ghost multi-n">Just reply normally</button></div>
  </div></div>`);
  const card=chatMsgs.querySelector('.icr-multi:last-child');
  card.querySelector('.multi-y').onclick=()=>{
    state.accepted++;state.tokensSaved+=800;
    logEntry(`✅ Chained ${a.matches.length} steps`,'ok');
    addJournal(a.text,'comparison','Multi-chain','accepted',800);
    card.remove();
    addMsg('bot',`<p>🔗 <strong>Running chained workflow:</strong></p>${a.matches.map((m,i)=>`<p><strong>Step ${i+1}</strong> (${m.skill.name}): ✓ Complete</p>`).join('')}<p style="color:var(--green);margin-top:6px">✓ All steps done · ~${a.matches.reduce((s,m)=>s+m.skill.tokens,0)} tokens · Saved ~800 vs separate prompts</p>`);
  };
  card.querySelector('.multi-n').onclick=()=>{
    state.dismissed++;
    addJournal(a.text,'comparison',null,'dismissed');
    card.remove();respondSimple(a.text);
  };
}

function showScaffold(patId){
  scaffoldModal.classList.remove('hidden');
  $('sc-accept').onclick=()=>{
    scaffoldModal.classList.add('hidden');state.accepted++;state.tokensSaved+=800;
    logEntry(`✅ Scaffolded: "PR Description Writer"`,'ok');
    addJournal('PR Description pattern','scaffold','PR Description Writer','accepted',800);
    const lib=$('skills-lib');
    lib.innerHTML+=`<div class="skill-mini"><span class="sk-icon">🆕</span><div><strong>PR Description Writer</strong><small>Auto-generated</small></div></div>`;
    addMsg('bot','<p>✅ <strong>"PR Description Writer"</strong> Skill saved! It will auto-suggest next time.</p>');
  };
  $('sc-edit').onclick=()=>{scaffoldModal.classList.add('hidden');addMsg('bot','<p>Opening Skill editor for <strong>"PR Description Writer"</strong>...</p>');};
  $('sc-skip').onclick=()=>{scaffoldModal.classList.add('hidden');logEntry('⛔ Skipped scaffolding','no');addJournal('PR pattern','scaffold',null,'dismissed');};
}
scaffoldModal.querySelector('.modal-bg').addEventListener('click',()=>scaffoldModal.classList.add('hidden'));

// ── Responses ──
function respondSkill(sk,text){
  const t=showTyping();
  setTimeout(()=>{t.remove();
    const r={'Weekly Status Report':`<p>📊 <strong>Weekly Status Report</strong></p><p><strong>Sprint Progress (78%)</strong></p><ul><li>Auth migration: ✅ Done</li><li>Dashboard redesign: 🔄 85%</li><li>API rate limiting: 📋 Next sprint</li></ul><p><strong>Blockers</strong></p><ul><li>CI pipeline intermittent failures</li></ul><p><strong>Next Week</strong></p><ul><li>Complete dashboard</li><li>Start rate limiting</li><li>Security audit prep</li></ul>`,
      'Security Reviewer':`<p>🔒 <strong>Security Review</strong></p><p>🔴 <strong>High:</strong> SQL Injection in user_query.py:42 → Use parameterized queries</p><p>🟡 <strong>Medium:</strong> XSS in views/profile.html:18 → Escape user input</p><p>🟢 <strong>Low:</strong> Missing rate limiting on /api/auth → Add throttle middleware</p>`,
      'API Doc Writer':`<p>📝 <strong>API Documentation</strong></p><p><code>GET /api/v1/users/{id}</code> — Retrieves user by UUID</p><p><strong>Params:</strong> id (string, required)</p><p><strong>200:</strong> { "id": "abc-123", "name": "Jane Doe" }</p><p><strong>401:</strong> Unauthorized · <strong>404:</strong> Not found</p>`,
      'Email Drafter':`<p>📧 <strong>Email Draft</strong></p><p>Subject: Follow-up: Project Timeline Discussion</p><p>Hi [Name],<br>Thank you for the productive meeting today. As discussed, I'm summarizing the key action items...</p>`
    };
    addMsg('bot',`${r[sk.name]||'<p>Task completed.</p>'}<p style="color:var(--green);font-size:.74rem;margin-top:6px">✦ Via "${sk.name}" Skill · ~${sk.tokens} tokens · High consistency</p>`);
  },1200);
}
function respondSimple(text){
  const t=showTyping();
  setTimeout(()=>{t.remove();addMsg('bot',`<p>Here's my response to your request. Output may vary across sessions.</p><p style="color:var(--t3);font-size:.74rem">⚡ Simple prompt · ~${SIMPLE.tokens} tokens · Variable consistency</p>`);},1400);
}

// ── Main Router ──
function process(text){
  if(!text.trim())return;
  addMsg('user',`<p>${text}</p>`);
  chatInput.value='';chatInput.style.height='auto';intentBar.classList.add('hidden');
  state.routed++;
  const a=analyze(text);

  // Control group — no ICR
  if(abGroup==='control'){
    logEntry(`🔇 Control group — no routing`,'silent');
    addJournal(text,'silent',null,'dismissed');
    respondSimple(text);return;
  }

  // Pattern check
  if(a.pat){
    patterns[a.pat.id].count++;
    if(patterns[a.pat.id].count>=patterns[a.pat.id].max){
      logEntry(`🔍 Pattern "${a.pat.p.label}" → Scaffold triggered`,'');
      setTimeout(()=>showScaffold(a.pat.id),800);
      respondSimple(text);return;
    }
    logEntry(`🔍 Pattern: "${a.pat.p.label}" (${patterns[a.pat.id].count}/${patterns[a.pat.id].max})`,'');
  }

  // Multi-intent
  if(a.multi){logEntry(`🔀 Multi-intent (${a.matches.length})`,'');renderMulti(a);return;}

  const level=a.conf>85?'high':a.conf>=50?'med':'low';
  if(level==='high'&&a.best){logEntry(`🎯 High (${a.conf}%): ${a.best.skill.name} → Nudge`,'');renderNudge(a);}
  else if(level==='med'&&a.best){logEntry(`⚖️ Med (${a.conf}%): ${a.best.skill.name} → Comparison`,'');renderComparison(a);}
  else{logEntry(`🔇 Low (${a.conf}%): Silent`,'silent');addJournal(text,'silent',null,'dismissed');respondSimple(text);}
}

// ── Live Intent Preview ──
let pTimeout;
chatInput.addEventListener('input',()=>{
  chatInput.style.height='auto';chatInput.style.height=Math.min(chatInput.scrollHeight,110)+'px';
  clearTimeout(pTimeout);
  const t=chatInput.value.trim();
  if(t.length<5){intentBar.classList.add('hidden');return;}
  pTimeout=setTimeout(()=>{
    const a=analyze(t);
    const lvl=a.conf>85?'high':a.conf>=50?'med':'low';
    const colors={high:'var(--green)',med:'var(--amber)',low:'var(--t3)'};
    const labels={high:'Inline Nudge',med:'Comparison Card',low:'Silent Mode'};
    const match=a.best?a.best.skill.name:'None';
    const sup=a.best&&suppressed[a.best.id]?' · 🚫 Suppressed':'';
    intentBar.innerHTML=`<span style="color:${colors[lvl]}">●</span> Confidence: <strong>${a.conf}%</strong> · Route: <strong>${labels[lvl]}</strong> · Match: <strong>${match}</strong>${a.multi?' · 🔀 Multi':''}${sup}`;
    intentBar.classList.remove('hidden');
  },250);
});

// ── Events ──
$('btn-send').addEventListener('click',()=>process(chatInput.value));
chatInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();process(chatInput.value);}});
document.addEventListener('click',e=>{if(e.target.tagName==='EM'&&e.target.closest('.hint')){chatInput.value=e.target.textContent;chatInput.dispatchEvent(new Event('input'));chatInput.focus();}});

// ── Charts (simple canvas) ──
function drawCharts(){
  // Acceptance trend
  const c1=$('chart-acceptance');if(!c1)return;
  const ctx1=c1.getContext('2d');
  const w=c1.width=c1.parentElement.clientWidth-36,h=c1.height=180;
  const data=[28,31,33,35,34,36,37,38,39,38,40,41,38,42];
  const target=35;
  ctx1.clearRect(0,0,w,h);
  // Grid
  ctx1.strokeStyle='rgba(255,255,255,0.05)';ctx1.lineWidth=1;
  for(let i=0;i<5;i++){const y=h*0.1+i*(h*0.8/4);ctx1.beginPath();ctx1.moveTo(40,y);ctx1.lineTo(w,y);ctx1.stroke();}
  // Target line
  const ty=h*0.9-((target-20)/(50-20))*(h*0.8);
  ctx1.strokeStyle='rgba(245,158,11,0.4)';ctx1.setLineDash([4,4]);ctx1.beginPath();ctx1.moveTo(40,ty);ctx1.lineTo(w,ty);ctx1.stroke();ctx1.setLineDash([]);
  ctx1.fillStyle='rgba(245,158,11,0.6)';ctx1.font='10px Inter';ctx1.fillText('Target 35%',w-60,ty-4);
  // Line
  ctx1.strokeStyle='#8b5cf6';ctx1.lineWidth=2;ctx1.beginPath();
  const gap=(w-50)/(data.length-1);
  data.forEach((v,i)=>{
    const x=50+i*gap,y=h*0.9-((v-20)/(50-20))*(h*0.8);
    i===0?ctx1.moveTo(x,y):ctx1.lineTo(x,y);
  });ctx1.stroke();
  // Dots
  data.forEach((v,i)=>{
    const x=50+i*gap,y=h*0.9-((v-20)/(50-20))*(h*0.8);
    ctx1.beginPath();ctx1.arc(x,y,3,0,Math.PI*2);ctx1.fillStyle=v>=target?'#22c55e':'#8b5cf6';ctx1.fill();
  });
  // Labels
  ctx1.fillStyle='rgba(255,255,255,0.3)';ctx1.font='9px Inter';
  ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14'].forEach((l,i)=>{
    ctx1.fillText(l,46+i*gap,h-2);
  });
  ctx1.fillText('20%',8,h*0.9);ctx1.fillText('35%',8,ty+3);ctx1.fillText('50%',8,h*0.1+8);

  // Confidence distribution
  const c2=$('chart-confidence');if(!c2)return;
  const ctx2=c2.getContext('2d');
  const w2=c2.width=c2.parentElement.clientWidth-36,h2=c2.height=180;
  ctx2.clearRect(0,0,w2,h2);
  const bars=[{label:'<50%\nSilent',value:22,color:'rgba(90,90,110,0.6)'},{label:'50-85%\nComparison',value:41,color:'rgba(245,158,11,0.6)'},{label:'>85%\nNudge',value:37,color:'rgba(139,92,246,0.7)'}];
  const bw=(w2-100)/3,bx=60;
  bars.forEach((b,i)=>{
    const bh=(b.value/50)*h2*0.7;
    const x=bx+i*(bw+15),y=h2*0.85-bh;
    ctx2.fillStyle=b.color;
    ctx2.beginPath();ctx2.roundRect(x,y,bw,bh,4);ctx2.fill();
    ctx2.fillStyle='rgba(255,255,255,0.8)';ctx2.font='bold 13px Inter';ctx2.textAlign='center';
    ctx2.fillText(b.value+'%',x+bw/2,y-8);
    ctx2.fillStyle='rgba(255,255,255,0.3)';ctx2.font='9px Inter';
    const lines=b.label.split('\n');
    lines.forEach((l,li)=>ctx2.fillText(l,x+bw/2,h2*0.85+12+li*12));
  });
  ctx2.textAlign='left';
}

// Init
updateDismissalUI();
setTimeout(drawCharts,100);
window.addEventListener('resize',drawCharts);
