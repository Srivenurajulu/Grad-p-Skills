/* ═══ ICR Phase 5 — Platform & Ecosystem ═══ */

const $=id=>document.getElementById(id);

// ── Tabs ──
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
  t.classList.add('on');$(`v-${t.dataset.v}`).classList.add('on');
}));

// ═══════════════════════════════════════════════
// WORKFLOW COMPOSER
// ═══════════════════════════════════════════════

// Suggestion banner
$('accept-suggestion')?.addEventListener('click',()=>{
  const banner=$('suggest-banner');
  banner.style.borderColor='var(--green)';
  banner.innerHTML=`<div class="sb-icon">✅</div><div class="sb-body"><strong>Workflow Created!</strong><p>"Post-PR Security + Docs" workflow added to your library.</p></div>`;
  setTimeout(()=>{banner.style.opacity='0';setTimeout(()=>banner.remove(),300);},2500);
});
$('dismiss-suggestion')?.addEventListener('click',()=>{
  const banner=$('suggest-banner');
  banner.style.opacity='0';setTimeout(()=>banner.remove(),300);
});

// Workflow Run Simulation
document.querySelectorAll('.wf-run-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const card=btn.closest('.wf-card');
    const steps=card.querySelectorAll('.wf-step');
    const wfName=card.querySelector('h4').textContent;
    btn.disabled=true;btn.textContent='Running...';

    // Clear empty state
    const log=$('exec-log');
    const empty=log.querySelector('.exec-empty');
    if(empty)empty.remove();

    // Animate steps sequentially
    let i=0;
    function runStep(){
      if(i>=steps.length){
        btn.disabled=false;btn.textContent='▶ Run';
        // Add completion entry
        addExecEntry('✅',`${wfName} completed`,`${steps.length} steps · All passed`,new Date().toLocaleTimeString());
        return;
      }
      steps[i].classList.add('running');
      const name=steps[i].querySelector('strong').textContent;
      addExecEntry('⏳',`Running: ${name}`,`Step ${i+1}/${steps.length}`,new Date().toLocaleTimeString());
      setTimeout(()=>{
        steps[i].classList.remove('running');
        steps[i].classList.add('done');
        setTimeout(()=>steps[i].classList.remove('done'),2000);
        i++;runStep();
      },800+Math.random()*600);
    }
    runStep();
  });
});

function addExecEntry(icon,title,sub,time){
  const log=$('exec-log');
  const d=document.createElement('div');d.className='exec-entry';
  d.innerHTML=`<div class="ex-icon">${icon}</div><div class="ex-body"><strong>${title}</strong><small>${sub}</small></div><div class="ex-time">${time}</div>`;
  log.prepend(d);
  if(log.children.length>20)log.lastChild.remove();
}

// New Workflow button
$('new-workflow')?.addEventListener('click',()=>{
  const grid=document.querySelector('.wf-grid');
  const card=document.createElement('div');card.className='wf-card';card.style.animation='up .4s ease';
  card.innerHTML=`
    <div class="wf-card-hdr"><div><h4>New Workflow</h4><span class="wf-meta">0 steps · Draft</span></div><div class="wf-status draft">Draft</div></div>
    <div class="wf-steps"><div style="padding:20px;text-align:center;font-size:.76rem;color:var(--t3)">Drag Skills here to build your pipeline</div></div>
    <div class="wf-card-foot"><div class="wf-savings"><span style="color:var(--t3)">Add steps to calculate savings</span></div><div class="wf-actions"><button class="btn-g">Delete</button></div></div>`;
  grid.appendChild(card);
  card.querySelector('.btn-g').onclick=()=>{card.style.opacity='0';setTimeout(()=>card.remove(),300);};
});

// ═══════════════════════════════════════════════
// API CONSOLE
// ═══════════════════════════════════════════════

const API_DATA={
  route:{
    req:`curl -X POST https://api.anthropic.com/v1/icr/route \\
  -H "Authorization: Bearer sk-ant-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "intent": "Review this code for security vulnerabilities",
    "user_skills": ["security-reviewer", "api-doc-writer"],
    "context": {
      "platform": "claude-code",
      "recent_patterns": 3
    }
  }'`,
    res:`{
  "recommendation": {
    "capability": "skill",
    "skill_id": "security-reviewer",
    "confidence": 92,
    "reasoning": "High match on security keywords + user history"
  },
  "alternatives": [
    { "capability": "simple_prompt", "confidence": 45, "estimated_tokens": 2100 }
  ],
  "predictions": {
    "recommended": { "tokens": 1100, "quality_score": 88, "latency_ms": 9200, "consistency": "high" },
    "simple_prompt": { "tokens": 2100, "quality_score": 62, "latency_ms": 12400, "consistency": "low" }
  },
  "meta": { "router_version": "2.1", "model": "haiku-4.5", "decision_id": "dec_8f3a9c2b" }
}`,
    stats:{lat:'42ms',tok:'48',cost:'$0.0005',id:'dec_8f3a9c2b'}
  },
  predict:{
    req:`curl -X GET "https://api.anthropic.com/v1/icr/predict?intent=write+api+docs" \\
  -H "Authorization: Bearer sk-ant-..."`,
    res:`{
  "predictions": [
    { "capability": "skill:api-doc-writer", "tokens": 1400, "quality": 85, "latency_ms": 9000, "consistency": "high" },
    { "capability": "simple_prompt", "tokens": 2800, "quality": 58, "latency_ms": 14200, "consistency": "low" },
    { "capability": "agent", "tokens": 3200, "quality": 91, "latency_ms": 22000, "consistency": "medium" }
  ],
  "recommendation": "skill:api-doc-writer",
  "confidence": 87
}`,
    stats:{lat:'28ms',tok:'32',cost:'$0.0003',id:'pred_4e7b1a3d'}
  },
  scaffold:{
    req:`curl -X POST https://api.anthropic.com/v1/icr/scaffold \\
  -H "Authorization: Bearer sk-ant-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "pattern_signatures": [
      { "task_type": "code_review", "domain": "security", "frequency": 5, "window_days": 7 }
    ],
    "sample_prompts": [
      "Review this for SQL injection...",
      "Check for XSS vulnerabilities..."
    ]
  }'`,
    res:`{
  "skill": {
    "name": "Security Code Reviewer",
    "description": "Reviews code for OWASP Top 10 vulnerabilities",
    "skill_md": "---\\nname: Security Code Reviewer\\n---\\n\\n## Instructions\\n1. Analyze for SQL injection...\\n2. Check XSS vectors...\\n3. Output severity table...",
    "confidence": 84,
    "estimated_savings": { "tokens_per_use": 350, "monthly_savings": 7000 }
  }
}`,
    stats:{lat:'156ms',tok:'210',cost:'$0.0021',id:'scf_2c9f8e1a'}
  },
  health:{
    req:`curl -X GET "https://api.anthropic.com/v1/icr/skills/health?user_id=usr_abc123" \\
  -H "Authorization: Bearer sk-ant-..."`,
    res:`{
  "total_skills": 8,
  "health_score": 82,
  "issues": [
    { "type": "stale", "skill_id": "legacy-api-docs", "days_inactive": 42, "action": "archive" },
    { "type": "conflicting", "skills": ["pr-writer", "release-notes"], "overlap": 0.85, "action": "merge" },
    { "type": "low_effectiveness", "skill_id": "email-drafter", "edit_rate": 0.68, "action": "refine" }
  ],
  "recommendations": [
    "Archive 1 stale skill to reduce clutter",
    "Merge 2 conflicting skills into 1",
    "Refine instructions for Email Drafter (high edit rate)"
  ]
}`,
    stats:{lat:'89ms',tok:'95',cost:'$0.0009',id:'hlth_7d4e2f8b'}
  }
};

// Endpoint selection
document.querySelectorAll('.ep-card').forEach(card=>{
  card.addEventListener('click',()=>{
    document.querySelectorAll('.ep-card').forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    const ep=card.dataset.ep;
    const data=API_DATA[ep];
    $('req-code').querySelector('code').textContent=data.req;
    $('res-code').querySelector('code').textContent=data.res;
    // Reset view
    $('req-block').style.display='';$('res-block').style.display='none';
    $('api-stats').style.display='none';
    document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('on'));
    document.querySelectorAll('.ptab')[0].classList.add('on');
  });
});

// Panel tabs
document.querySelectorAll('.ptab').forEach((t,i)=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.ptab').forEach(x=>x.classList.remove('on'));
    t.classList.add('on');
    $('req-block').style.display=i===0?'':'none';
    $('res-block').style.display=i===1?'':'none';
  });
});

// Send request
$('api-send')?.addEventListener('click',()=>{
  const btn=$('api-send');
  btn.textContent='Sending...';btn.disabled=true;
  const activeEp=document.querySelector('.ep-card.active')?.dataset.ep||'route';
  const data=API_DATA[activeEp];

  setTimeout(()=>{
    // Show response
    document.querySelectorAll('.ptab').forEach(x=>x.classList.remove('on'));
    document.querySelectorAll('.ptab')[1].classList.add('on');
    $('req-block').style.display='none';$('res-block').style.display='';
    $('api-stats').style.display='grid';

    // Update stats
    const items=$('api-stats').querySelectorAll('.as-v');
    items[0].textContent=data.stats.lat;
    items[1].textContent=data.stats.tok;
    items[2].textContent=data.stats.cost;
    items[3].textContent=data.stats.id;

    btn.textContent='▶ Send Request';btn.disabled=false;
  },600+Math.random()*400);
});

// Copy button
$('copy-req')?.addEventListener('click',()=>{
  const code=$('req-code').textContent;
  navigator.clipboard?.writeText(code);
  $('copy-req').textContent='Copied!';
  setTimeout(()=>$('copy-req').textContent='Copy',1500);
});

// ═══════════════════════════════════════════════
// ECOSYSTEM
// ═══════════════════════════════════════════════

const TEMPLATES=[
  {icon:'🔒',name:'Code Security Review',desc:'OWASP Top 10 vulnerability scanner for PRs',cat:'code',uses:'2.4K',tag:'Popular'},
  {icon:'📊',name:'Weekly Status Report',desc:'Structured team updates with sprint metrics',cat:'pm',uses:'3.1K',tag:'Trending'},
  {icon:'📝',name:'API Documentation',desc:'Generate OpenAPI docs from code comments',cat:'code',uses:'1.8K',tag:'New'}
];

const COMMUNITY=[
  {icon:'🧪',name:'Unit Test Generator',author:'@devpriya',desc:'Auto-generates Jest/Pytest tests from function signatures with edge case coverage.',cat:'code',stars:48,downloads:892,ver:'2.1.0'},
  {icon:'📋',name:'Sprint Retro Summarizer',author:'@pmSarah',desc:'Converts raw retro notes into actionable insights grouped by theme.',cat:'pm',stars:35,downloads:567,ver:'1.3.0'},
  {icon:'📈',name:'Data Pipeline Reviewer',author:'@dataMax',desc:'Reviews ETL pipeline code for performance bottlenecks and data quality issues.',cat:'data',stars:29,downloads:412,ver:'1.0.2'},
  {icon:'🐳',name:'Dockerfile Optimizer',author:'@opsKai',desc:'Analyzes Dockerfiles for layer caching, size reduction, and security best practices.',cat:'ops',stars:52,downloads:1203,ver:'3.0.0'},
  {icon:'✍️',name:'Technical Blog Writer',author:'@writeMaya',desc:'Transforms technical concepts into engaging blog posts with code examples.',cat:'writing',stars:41,downloads:734,ver:'1.5.1'},
  {icon:'🔄',name:'Migration Script Builder',author:'@devAlex',desc:'Generates database migration scripts from schema diffs with rollback support.',cat:'code',stars:23,downloads:345,ver:'1.1.0'}
];

const VERSIONS={
  'Dockerfile Optimizer':[
    {ver:'3.0.0',date:'Apr 25, 2026',changes:'Major rewrite: Added multi-stage build analysis, BuildKit optimization hints, and Trivy integration for CVE scanning.',current:true},
    {ver:'2.4.1',date:'Mar 18, 2026',changes:'Fixed false positive on COPY instructions with --chown flag.'},
    {ver:'2.4.0',date:'Mar 02, 2026',changes:'Added support for .dockerignore analysis and layer size estimates.'},
    {ver:'2.3.0',date:'Feb 10, 2026',changes:'Initial multi-arch build detection.'}
  ]
};

function renderTemplates(){
  const row=$('template-row');row.innerHTML='';
  TEMPLATES.forEach(t=>{
    row.innerHTML+=`<div class="tmpl-card"><div class="tmpl-icon">${t.icon}</div><div class="tmpl-name">${t.name}</div><div class="tmpl-desc">${t.desc}</div><div class="tmpl-meta"><span>${t.uses} uses</span><span class="tmpl-badge">${t.tag}</span></div></div>`;
  });
}

function renderCommunity(filter='all'){
  const grid=$('eco-grid');grid.innerHTML='';
  const filtered=filter==='all'?COMMUNITY:COMMUNITY.filter(s=>s.cat===filter);
  $('community-count').textContent=filtered.length;
  filtered.forEach(s=>{
    grid.innerHTML+=`<div class="eco-card" data-name="${s.name}"><div class="eco-icon">${s.icon}</div><div class="eco-info"><div class="eco-name">${s.name}</div><div class="eco-author">by ${s.author} · v${s.ver}</div><div class="eco-desc">${s.desc}</div><div class="eco-foot"><span class="stars">★ ${s.stars}</span><span>↓ ${s.downloads}</span><div class="eco-actions-row"><button class="btn-s eco-install">Install</button><button class="btn-g eco-ver">History</button></div></div></div></div>`;
  });

  // Install buttons
  grid.querySelectorAll('.eco-install').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      btn.textContent='Installed ✓';btn.style.color='var(--green)';btn.disabled=true;
    });
  });

  // Version history buttons
  grid.querySelectorAll('.eco-ver').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      const name=btn.closest('.eco-card').dataset.name;
      showVersionHistory(name);
    });
  });
}

function showVersionHistory(name){
  const panel=$('version-panel');
  $('vp-title').textContent=name+' — Version History';
  const body=$('vp-body');body.innerHTML='';
  const versions=VERSIONS[name]||[{ver:'1.0.0',date:'Unknown',changes:'Initial release.',current:true}];
  versions.forEach(v=>{
    body.innerHTML+=`<div class="ver-item ${v.current?'current':''}"><div class="ver-tag"><span class="ver-num">v${v.ver}</span>${v.current?'<span class="ver-badge">Current</span>':'<span class="ver-date">${v.date}</span>'}</div><div class="ver-changes">${v.changes}</div></div>`;
  });
  panel.style.display='block';
}
$('vp-close')?.addEventListener('click',()=>$('version-panel').style.display='none');

// Category filter
document.querySelectorAll('.cat-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    renderCommunity(btn.dataset.cat);
  });
});

// Search
$('eco-search')?.addEventListener('input',(e)=>{
  const q=e.target.value.toLowerCase();
  document.querySelectorAll('.eco-card').forEach(c=>{
    const name=c.dataset.name.toLowerCase();
    c.style.display=name.includes(q)?'':'none';
  });
});

// Publish button
$('publish-btn')?.addEventListener('click',()=>{
  const btn=$('publish-btn');
  btn.textContent='📤 Publishing...';btn.disabled=true;
  setTimeout(()=>{
    btn.textContent='✅ Published!';
    setTimeout(()=>{btn.textContent='📤 Publish a Skill';btn.disabled=false;},2000);
  },1200);
});

// ═══════════════════════════════════════════════
// DECISION JOURNAL
// ═══════════════════════════════════════════════

const JOURNAL=[
  {time:'10:42 AM',intent:'Review auth middleware for vulnerabilities',rec:'Security Reviewer',chose:'Security Reviewer',outcome:'match',tokens:1100,signal:'pos'},
  {time:'10:38 AM',intent:'Write docs for /api/users endpoint',rec:'API Doc Writer',chose:'API Doc Writer',outcome:'match',tokens:1400,signal:'pos'},
  {time:'10:15 AM',intent:'Draft email to stakeholders about launch',rec:'Email Drafter',chose:'Simple Prompt',outcome:'override',tokens:2100,signal:'ovr'},
  {time:'09:52 AM',intent:'Summarize sprint 14 progress',rec:'Weekly Status Report',chose:'Weekly Status Report',outcome:'match',tokens:900,signal:'pos'},
  {time:'09:30 AM',intent:'Help me brainstorm product names',rec:'Simple Prompt',chose:'Simple Prompt',outcome:'match',tokens:1800,signal:'pos'},
  {time:'09:11 AM',intent:'Write PR description for auth refactor',rec:'PR Description Writer',chose:'PR Description Writer',outcome:'match',tokens:700,signal:'pos'},
  {time:'Yesterday',intent:'Generate unit tests for PaymentService',rec:'Simple Prompt',chose:'Simple Prompt',outcome:'match',tokens:2400,signal:'pos'},
  {time:'Yesterday',intent:'Review database queries for injection',rec:'Security Reviewer',chose:'Security Reviewer',outcome:'match',tokens:1100,signal:'pos'},
  {time:'Yesterday',intent:'Write weekly team update email',rec:'Weekly Status Report',chose:'Email Drafter',outcome:'override',tokens:600,signal:'ovr'},
  {time:'2 days ago',intent:'Explain how OAuth2 PKCE flow works',rec:'Simple Prompt',chose:'Simple Prompt',outcome:'match',tokens:1950,signal:'pos'}
];

function renderJournal(){
  const body=$('journal-body');body.innerHTML='';
  JOURNAL.forEach(j=>{
    const outcomeClass=j.outcome==='match'?'jt-match':j.outcome==='override'?'jt-over':'jt-miss';
    const outcomeLabel=j.outcome==='match'?'✓ Match':j.outcome==='override'?'⤤ Override':'✕ Miss';
    const sigClass=j.signal==='pos'?'pos':j.signal==='ovr'?'ovr':'neg';
    body.innerHTML+=`<tr><td>${j.time}</td><td style="max-width:220px;overflow:hidden;text-overflow:ellipsis">${j.intent}</td><td>${j.rec}</td><td>${j.chose}</td><td class="${outcomeClass}">${outcomeLabel}</td><td style="font-family:var(--mono)">${j.tokens.toLocaleString()}</td><td><span class="sig-dot ${sigClass}"></span>${j.signal==='pos'?'+0.5':j.signal==='ovr'?'+1.2':'-0.8'}</td></tr>`;
  });
}

// What If Preview
$('whatif-go')?.addEventListener('click',()=>{
  const text=$('whatif-inp').value.trim();
  if(!text)return;
  const results=$('whatif-results');
  results.style.display='grid';
  results.innerHTML=`
    <div class="wi-card recommended">
      <div class="wi-title">🔒 Security Reviewer</div>
      <div class="wi-row"><span class="wi-label">Tokens</span><span class="wi-val green">~1,100</span></div>
      <div class="wi-row"><span class="wi-label">Quality</span><span class="wi-val">88/100</span></div>
      <div class="wi-row"><span class="wi-label">Latency</span><span class="wi-val">~9.2s</span></div>
      <div class="wi-row"><span class="wi-label">Consistency</span><span class="wi-val green">High</span></div>
      <div class="wi-sample-lbl">Sample Output Preview</div>
      <div class="wi-sample">| Severity | Location | Issue | Fix |<br>| Critical | auth.js:42 | SQL injection via unsanitized user input | Use parameterized queries... |</div>
    </div>
    <div class="wi-card">
      <div class="wi-title">📝 Simple Prompt</div>
      <div class="wi-row"><span class="wi-label">Tokens</span><span class="wi-val">~2,100</span></div>
      <div class="wi-row"><span class="wi-label">Quality</span><span class="wi-val">62/100</span></div>
      <div class="wi-row"><span class="wi-label">Latency</span><span class="wi-val">~12.4s</span></div>
      <div class="wi-row"><span class="wi-label">Consistency</span><span class="wi-val amber">Low</span></div>
      <div class="wi-sample-lbl">Sample Output Preview</div>
      <div class="wi-sample">I'll review your code for potential security issues. Looking at the authentication middleware, I notice several concerns...</div>
    </div>
    <div class="wi-card">
      <div class="wi-title">🤖 Agent Mode</div>
      <div class="wi-row"><span class="wi-label">Tokens</span><span class="wi-val red">~3,200</span></div>
      <div class="wi-row"><span class="wi-label">Quality</span><span class="wi-val">91/100</span></div>
      <div class="wi-row"><span class="wi-label">Latency</span><span class="wi-val">~22s</span></div>
      <div class="wi-row"><span class="wi-label">Consistency</span><span class="wi-val">Medium</span></div>
      <div class="wi-sample-lbl">Sample Output Preview</div>
      <div class="wi-sample">Running multi-step analysis: 1) Static scan 2) Dependency audit 3) Runtime pattern check 4) Generate fix PRs...</div>
    </div>`;
});

// Budget toggle
$('budget-toggle')?.addEventListener('change',(e)=>{
  const label=document.querySelector('.toggle-label');
  label.textContent=e.target.checked?'Active':'Paused';
  label.style.color=e.target.checked?'':'var(--t3)';
});

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
renderTemplates();
renderCommunity();
renderJournal();
