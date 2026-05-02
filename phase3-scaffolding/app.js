/* ═══ ICR Phase 3 — Auto-Scaffolding Engine ═══ */

const SKILLS=[
  {id:'weekly-report',name:'Weekly Status Report',icon:'📊',desc:'Engineering team reports',kw:['status report','weekly report','sprint progress','team update'],tokens:900,quality:5,speed:8,type:'manual',
   code:'---\nname: "Weekly Status Report"\ndescription: "Generates formatted weekly\n  status reports for engineering teams"\n---\n\n## Instructions\n1. Sprint progress (% complete)\n2. Blockers and risks\n3. Next week priorities\n\n## Format\n- Markdown headers\n- Team members list\n- ~500 words'},
  {id:'code-review',name:'Security Reviewer',icon:'🔒',desc:'OWASP Top 10 analysis',kw:['security','code review','vulnerability','sql injection','xss','owasp'],tokens:1100,quality:5,speed:10,type:'manual',
   code:'---\nname: "Security Reviewer"\ndescription: "Reviews code for OWASP\n  Top 10 vulnerabilities"\n---\n\n## Instructions\nScan for:\n1. SQL Injection\n2. XSS\n3. Auth bypass\n4. CSRF\n\n## Output\n- Severity: High/Med/Low\n- Location + Fix suggestion'},
  {id:'api-docs',name:'API Doc Writer',icon:'📝',desc:'OpenAPI documentation',kw:['api doc','documentation','openapi','swagger','endpoint','write docs'],tokens:1400,quality:4,speed:9,type:'manual',
   code:'---\nname: "API Doc Writer"\ndescription: "Generates OpenAPI-style docs"\n---\n\n## Instructions\nDocument each endpoint:\n1. Method + Path\n2. Parameters\n3. Response schema\n4. Example request/response'},
  {id:'email',name:'Email Drafter',icon:'📧',desc:'Professional emails',kw:['draft email','write email','email to','compose email'],tokens:600,quality:4,speed:5,type:'manual',
   code:'---\nname: "Email Drafter"\ndescription: "Professional email drafts"\n---\n\n## Instructions\n1. Subject line\n2. Greeting\n3. Body with key points\n4. Professional closing'}
];

// ── Scaffold-able Patterns ──
const PATTERNS=[
  {id:'pr-desc',name:'PR Descriptions',icon:'🔀',kw:['pr description','pull request','diff','pr for','describe changes'],count:0,max:3,
   scaffold:{name:'PR Description Writer',desc:'Generates PR descriptions from diff summaries and commit messages',
     code:'---\nname: "PR Description Writer"\ndescription: "Generates PR descriptions from\n  diff summaries and commit messages"\n---\n\n## Instructions\nWrite a clear, concise PR description:\n1. What changed and why\n2. Key implementation details\n3. Testing approach\n4. Breaking changes (if any)\n\n## Format\n- Markdown headers per section\n- One-line summary at top\n- List affected files/modules\n- ~300 words max',
     sources:['Apr 15','Apr 22','Apr 29'],impact:'~800 tokens & ~3s per use',tokens:700}},
  {id:'meeting',name:'Meeting Summaries',icon:'📋',kw:['meeting summary','meeting notes','summarize meeting','recap meeting'],count:0,max:3,
   scaffold:{name:'Meeting Notes Generator',desc:'Creates structured meeting summaries with action items',
     code:'---\nname: "Meeting Notes Generator"\ndescription: "Creates structured meeting\n  summaries with action items"\n---\n\n## Instructions\n1. Attendees list\n2. Key discussion points\n3. Decisions made\n4. Action items with owners\n5. Next meeting date\n\n## Format\n- Headers for each section\n- Action items as checkboxes\n- Bold owner names\n- ~400 words',
     sources:['Apr 17','Apr 24','Apr 29'],impact:'~650 tokens & ~2s per use',tokens:550}},
  {id:'release',name:'Release Notes',icon:'🚀',kw:['release notes','changelog','version notes','release for'],count:0,max:3,
   scaffold:{name:'Release Notes Writer',desc:'Generates user-facing release notes from commits',
     code:'---\nname: "Release Notes Writer"\ndescription: "Generates user-facing release\n  notes from commit history"\n---\n\n## Instructions\n1. Version number & date\n2. New features\n3. Bug fixes\n4. Breaking changes\n5. Migration guide (if needed)\n\n## Format\n- Semantic versioning\n- Emoji categories\n- User-friendly language\n- ~300 words',
     sources:['Apr 18','Apr 25','Apr 29'],impact:'~750 tokens & ~3s per use',tokens:650}},
  {id:'bug',name:'Bug Reports',icon:'🐛',kw:['bug report','create bug','file bug','report issue'],count:0,max:3,
   scaffold:{name:'Bug Report Template',desc:'Structured bug reports with reproduction steps',
     code:'---\nname: "Bug Report Template"\ndescription: "Creates structured bug reports\n  with reproduction steps"\n---\n\n## Instructions\n1. Summary (one line)\n2. Steps to reproduce\n3. Expected vs actual behavior\n4. Environment details\n5. Severity assessment\n\n## Format\n- Numbered repro steps\n- Code blocks for logs\n- Screenshot placeholders\n- Priority: P0-P3',
     sources:['Apr 20','Apr 26','Apr 29'],impact:'~500 tokens & ~2s per use',tokens:500}}
];

const SIMPLE={tokens:2100,quality:3,speed:12};
const convWindow=[];// sliding window of last 20 prompts
let autoSkillCount=0,totalTokensSaved=0;

// ── DOM ──
const $=id=>document.getElementById(id);
const msgs=$('msgs'),inp=$('inp'),ibar=$('ibar'),scaffoldModal=$('scaffold-modal');

// ── Tabs ──
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
  t.classList.add('on');$(`v-${t.dataset.v}`).classList.add('on');
  if(t.dataset.v==='patterns')renderPatternView();
  if(t.dataset.v==='library')renderLibraryView();
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

// ── Pattern Detection ──
function checkPatterns(text){
  const low=text.toLowerCase();
  let matched=null;
  for(const p of PATTERNS){
    for(const k of p.kw)if(low.includes(k)){matched=p;break;}
    if(matched)break;
  }
  if(matched){
    matched.count++;
    convWindow.push({text:text.substring(0,60),pattern:matched.id,time:new Date()});
    if(convWindow.length>20)convWindow.shift();
    updatePatternSidebar();
    if(matched.count>=matched.max){
      log(`🛠️ Pattern "${matched.name}" reached ${matched.count}/${matched.max} → SCAFFOLD TRIGGERED!`,'sc');
      setTimeout(()=>showScaffoldModal(matched),600);
      return{triggered:true,pattern:matched};
    }
    log(`🔍 Pattern "${matched.name}" (${matched.count}/${matched.max})`,'');
    return{triggered:false,pattern:matched};
  }
  convWindow.push({text:text.substring(0,60),pattern:null,time:new Date()});
  if(convWindow.length>20)convWindow.shift();
  return null;
}

// ── Intent Matching (reused from Phase 1/2) ──
function findSkill(text){
  const low=text.toLowerCase();
  let best=null,score=0;
  for(const sk of SKILLS){
    let s=0;for(const k of sk.kw)if(low.includes(k))s+=k.split(' ').length*12;
    if(s>score){score=s;best=sk;}
  }
  return score>10?{skill:best,conf:Math.min(95,40+score)}:null;
}

// ── Scaffold Modal ──
function showScaffoldModal(pattern){
  scaffoldModal.classList.remove('hidden');
  const sc=pattern.scaffold;
  $('sc-subtitle').textContent=`I drafted this Skill from your last ${pattern.count} similar prompts:`;
  const codeEl=$('sc-code');
  codeEl.textContent=sc.code;
  codeEl.contentEditable='false';
  codeEl.classList.remove('editing');
  $('sc-meta').innerHTML=`<span><strong>Sources:</strong> Conversations on ${sc.sources.join(', ')}</span><span><strong>Impact:</strong> Save ${sc.impact}</span>`;

  $('sc-accept').onclick=()=>{
    scaffoldModal.classList.add('hidden');
    const newSkill={id:`auto-${pattern.id}`,name:sc.name,icon:'🆕',desc:sc.desc,kw:pattern.kw,tokens:sc.tokens,quality:4,speed:7,type:'auto',code:codeEl.textContent,source:sc.sources,savedPerUse:SIMPLE.tokens-sc.tokens};
    SKILLS.push(newSkill);autoSkillCount++;totalTokensSaved+=newSkill.savedPerUse;
    updateSkillSidebar();updatePatternSidebar();
    log(`✅ Scaffolded & saved: "${sc.name}"`,'ok');
    addMsg('bot',`<p>✅ <strong>"${sc.name}"</strong> has been saved to your Skill library!</p><p style="color:var(--t3);font-size:.76rem">It will be automatically suggested next time. Estimated savings: ${sc.impact}.</p>`);
    pattern.count=0;// Reset after scaffolding
  };
  $('sc-edit').onclick=()=>{
    const ce=codeEl.contentEditable==='true';
    if(!ce){
      codeEl.contentEditable='true';codeEl.classList.add('editing');codeEl.focus();
      $('sc-edit').textContent='💾 Save Edits';
    }else{
      codeEl.contentEditable='false';codeEl.classList.remove('editing');
      $('sc-edit').textContent='✎ Edit First';
    }
  };
  $('sc-skip').onclick=()=>{
    scaffoldModal.classList.add('hidden');
    log(`⛔ Skipped scaffolding: "${sc.name}"`,'no');
    pattern.count=0;
  };
}
scaffoldModal.querySelector('.modal-bg').addEventListener('click',()=>scaffoldModal.classList.add('hidden'));

// ── Responses ──
function respondSkill(sk){
  const t=showTyping();
  setTimeout(()=>{t.remove();
    const r={'Weekly Status Report':'<p>📊 <strong>Weekly Status Report</strong></p><ul><li>Auth migration: ✅ Done</li><li>Dashboard: 🔄 85%</li><li>Rate limiting: 📋 Next sprint</li></ul><p><strong>Blockers:</strong> CI pipeline issues</p>',
      'Security Reviewer':'<p>🔒 <strong>Security Review</strong></p><p>🔴 SQL Injection — user_query.py:42</p><p>🟡 XSS — views/profile.html:18</p><p>🟢 Missing rate limit — /api/auth</p>',
      'API Doc Writer':'<p>📝 <code>GET /api/v1/users/{id}</code> — Retrieves user by UUID</p><p><strong>200:</strong> { "id": "abc", "name": "Jane" }</p>',
      'Email Drafter':'<p>📧 Subject: Follow-up: Project Timeline</p><p>Hi [Name], Thank you for the productive meeting...</p>'};
    addMsg('bot',`${r[sk.name]||'<p>Task completed.</p>'}<p style="color:var(--green);font-size:.72rem;margin-top:4px">✦ Via "${sk.name}" · ~${sk.tokens} tokens · High consistency</p>`);
  },1100);
}
function respondSimple(){
  const t=showTyping();
  setTimeout(()=>{t.remove();addMsg('bot','<p>Here\'s my response. Output may vary across sessions.</p><p style="color:var(--t3);font-size:.72rem">⚡ Simple prompt · ~2100 tokens · Variable consistency</p>');},1200);
}

// ── Main Router ──
function process(text){
  if(!text.trim())return;
  addMsg('usr',`<p>${text}</p>`);
  inp.value='';inp.style.height='auto';ibar.classList.add('hidden');

  const patResult=checkPatterns(text);
  if(patResult&&patResult.triggered){respondSimple();return;}

  const match=findSkill(text);
  if(match&&match.conf>85){
    log(`🎯 High (${match.conf}%): ${match.skill.name} → Nudge`,'');
    const sk=match.skill,saved=SIMPLE.tokens-sk.tokens;
    addCard(`<div class="icr-nudge"><div class="ni">
      <div class="nt">💡 I recommend using your <strong>"${sk.name}"</strong> Skill.</div>
      <div class="nb"><button class="btn-p n-y">▶ Use Skill</button><button class="btn-o n-n">Just reply this time</button></div>
      <div class="ns">Savings: ~${saved} tokens · Quality: High · ~${sk.speed}s</div>
    </div></div>`);
    const nudge=msgs.querySelector('.icr-nudge:last-child');
    nudge.querySelector('.n-y').onclick=()=>{totalTokensSaved+=saved;log(`✅ Accepted: ${sk.name}`,'ok');nudge.remove();respondSkill(sk);};
    nudge.querySelector('.n-n').onclick=()=>{log(`⛔ Dismissed: ${sk.name}`,'no');nudge.remove();respondSimple();};
    setTimeout(()=>{if(nudge.parentNode){nudge.remove();respondSimple();}},10000);
  }else if(match&&match.conf>=50){
    log(`⚖️ Med (${match.conf}%): ${match.skill.name}`,'');
    respondSkill(match.skill);
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
    const m=findSkill(t);let patName='None';
    for(const p of PATTERNS)for(const k of p.kw)if(t.toLowerCase().includes(k)){patName=`${p.name} (${p.count}/${p.max})`;break;}
    const lvl=m?(m.conf>85?'high':m.conf>=50?'med':'low'):'low';
    const cols={high:'var(--green)',med:'var(--amber)',low:'var(--t3)'};
    ibar.innerHTML=`<span style="color:${cols[lvl]}">●</span> Conf: <strong>${m?m.conf+'%':'N/A'}</strong> · Match: <strong>${m?m.skill.name:'None'}</strong> · Pattern: <strong>${patName}</strong>`;
    ibar.classList.remove('hidden');
  },200);
});

// ── Events ──
$('send').addEventListener('click',()=>process(inp.value));
inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();process(inp.value);}});
document.addEventListener('click',e=>{if(e.target.tagName==='EM'&&e.target.closest('.hint')){inp.value=e.target.textContent;inp.dispatchEvent(new Event('input'));inp.focus();}});

// ── Sidebar Updates ──
function updatePatternSidebar(){
  const el=$('pattern-sidebar');el.innerHTML='';
  for(const p of PATTERNS){
    const pct=Math.min(100,(p.count/p.max)*100);
    const cls=p.count>=p.max?'ready':p.count>0?'':'';
    const color=p.count>=p.max?'var(--green)':p.count>0?'var(--a)':'var(--t3)';
    el.innerHTML+=`<div class="pat-sb ${cls}"><div class="pat-sb-name">${p.icon} ${p.name}</div><div class="pat-sb-bar"><div class="pat-sb-fill" style="width:${pct}%;background:${color}"></div></div><div class="pat-sb-info"><span>${p.count}/${p.max} matches</span><span>${p.count>=p.max?'🛠️ Scaffold!':p.count>0?'Watching...':'Idle'}</span></div></div>`;
  }
}
function updateSkillSidebar(){
  const el=$('skills-sidebar');el.innerHTML='';
  $('skill-count').textContent=SKILLS.length;
  for(const sk of SKILLS){
    const auto=sk.type==='auto'?' auto':'';
    el.innerHTML+=`<div class="sk-sb${auto}"><span class="sk-i">${sk.icon}</span><div><strong>${sk.name}</strong><small>${sk.desc}</small></div></div>`;
  }
}

// ── Pattern Engine View ──
function renderPatternView(){
  const grid=$('pattern-grid');grid.innerHTML='';
  for(const p of PATTERNS){
    const pct=Math.min(100,(p.count/p.max)*100);
    const status=p.count>=p.max?'triggered':p.count>0?'active':'';
    const badge=p.count>=p.max?'triggered':p.count>0?'watching':'idle';
    const color=p.count>=p.max?'var(--green)':p.count>0?'var(--a)':'var(--t3)';
    grid.innerHTML+=`<div class="pat-card ${status}"><div class="pat-hdr"><span class="pat-name">${p.icon} ${p.name}</span><span class="pat-badge ${badge}">${badge}</span></div><div class="pat-kw">Keywords: ${p.kw.slice(0,3).join(', ')}</div><div class="pat-progress"><div class="pat-bar"><div class="pat-fill" style="width:${pct}%;background:${color}"></div></div></div><div class="pat-info"><span>${p.count}/${p.max} detections</span><span>7-day window</span></div></div>`;
  }
  const cw=$('conv-window');cw.innerHTML='';
  if(convWindow.length===0){cw.innerHTML='<p class="muted">No conversations in window yet. Start chatting!</p>';return;}
  convWindow.slice().reverse().forEach((c,i)=>{
    const isMatch=c.pattern!==null;
    const pat=isMatch?PATTERNS.find(p=>p.id===c.pattern):null;
    cw.innerHTML+=`<div class="conv-item${isMatch?' matched':''}"><span class="conv-num">${convWindow.length-i}</span><span class="conv-text">${c.text}${c.text.length>=60?'...':''}</span>${isMatch?`<span class="conv-tag match">${pat?pat.name:'Match'}</span>`:''}</div>`;
  });
}

// ── Library View ──
function renderLibraryView(){
  const grid=$('lib-grid');grid.innerHTML='';
  $('ls-total').textContent=SKILLS.length;
  $('ls-manual').textContent=SKILLS.filter(s=>s.type==='manual').length;
  $('ls-auto').textContent=SKILLS.filter(s=>s.type==='auto').length;
  $('ls-saved').textContent=totalTokensSaved.toLocaleString();
  for(const sk of SKILLS){
    const isAuto=sk.type==='auto';
    grid.innerHTML+=`<div class="lib-card${isAuto?' auto':''}"><div class="lib-top"><span class="lib-name">${sk.icon} ${sk.name}</span><span class="lib-badge ${sk.type}">${isAuto?'Auto-Scaffolded':'Manual'}</span></div><div class="lib-desc">${sk.desc}</div><div class="lib-meta"><span>~${sk.tokens} tokens</span><span>Quality: ${'●'.repeat(sk.quality)}${'○'.repeat(5-sk.quality)}</span>${isAuto&&sk.source?`<span>Source: ${sk.source.join(', ')}</span>`:''}</div><div class="lib-code">${sk.code}</div></div>`;
  }
}

// ── Init ──
updatePatternSidebar();
updateSkillSidebar();
