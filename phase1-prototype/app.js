/* ====================================================
   ICR Phase 1 — Intelligent Capability Router Engine
   ==================================================== */

// ─── SKILL DEFINITIONS ────────────────────────────────
const SKILLS = {
  'weekly-report': {
    name: 'Weekly Status Report', icon: '📊',
    description: 'Generates formatted weekly status reports for engineering teams',
    keywords: ['status report','weekly report','sprint progress','standup','team update'],
    tokens: 900, quality: 5, speed: 8, consistency: 'High',
    benefits: ['Remembers your team structure','Consistent formatting every time','Reusable weekly']
  },
  'code-review': {
    name: 'Security Code Reviewer', icon: '🔒',
    description: 'Reviews code for OWASP Top 10 vulnerabilities',
    keywords: ['security','code review','vulnerability','sql injection','xss','auth bypass','owasp'],
    tokens: 1100, quality: 5, speed: 10, consistency: 'High',
    benefits: ['OWASP Top 10 checklist','Severity-ranked findings','Fix suggestions included']
  },
  'api-docs': {
    name: 'API Doc Writer', icon: '📝',
    description: 'Generates OpenAPI-style documentation from code',
    keywords: ['api doc','documentation','openapi','swagger','endpoint','api reference','write docs'],
    tokens: 1400, quality: 4, speed: 9, consistency: 'High',
    benefits: ['OpenAPI format','Auto-generates examples','Consistent structure']
  }
};

const SIMPLE_PROMPT = {
  name: 'Simple Prompt', icon: '📝',
  tokens: 2100, quality: 3, speed: 12, consistency: 'Low',
  benefits: ['Good for one-off requests']
};

// ─── PATTERN TRACKER ──────────────────────────────────
const patternTracker = {
  'pr-description': { label: 'PR descriptions', count: 1, threshold: 3, keywords: ['pr description','pull request','diff summary','pr for'] },
  'email-draft':    { label: 'Email drafts', count: 0, threshold: 3, keywords: ['draft email','write email','email to'] }
};

// ─── STATE ────────────────────────────────────────────
let state = { routedCount: 0, acceptedCount: 0, tokensSaved: 0 };

// ─── DOM REFS ─────────────────────────────────────────
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const btnSend = document.getElementById('btn-send');
const intentPreview = document.getElementById('intent-preview');
const intentPreviewContent = document.getElementById('intent-preview-content');
const routingLog = document.getElementById('routing-log');
const demoPanel = document.getElementById('demo-panel');
const scaffoldModal = document.getElementById('scaffold-modal');

// ─── INTENT ANALYSIS ENGINE ───────────────────────────
function analyzeIntent(text) {
  const lower = text.toLowerCase();
  let bestMatch = null, bestScore = 0;

  for (const [id, skill] of Object.entries(SKILLS)) {
    let score = 0;
    for (const kw of skill.keywords) {
      if (lower.includes(kw)) score += kw.split(' ').length * 15;
    }
    if (score > bestScore) { bestScore = score; bestMatch = { id, skill, score }; }
  }

  // Check for multi-intent
  const intentMatches = [];
  for (const [id, skill] of Object.entries(SKILLS)) {
    let s = 0;
    for (const kw of skill.keywords) { if (lower.includes(kw)) s += kw.split(' ').length * 15; }
    if (s > 10) intentMatches.push({ id, skill, score: s });
  }
  const isMultiIntent = intentMatches.length >= 2;

  // Check for pattern triggers
  let patternTriggered = null;
  for (const [id, pattern] of Object.entries(patternTracker)) {
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) { patternTriggered = { id, pattern }; break; }
    }
    if (patternTriggered) break;
  }

  // Calculate confidence
  let confidence = bestScore > 0 ? Math.min(95, 40 + bestScore) : 15;
  if (lower.length < 20) confidence = Math.min(confidence, 35);

  return { bestMatch, confidence, isMultiIntent, intentMatches, patternTriggered, text };
}

function getConfidenceLevel(c) {
  if (c > 85) return 'high';
  if (c >= 50) return 'medium';
  return 'low';
}

// ─── COST-QUALITY PREDICTOR ───────────────────────────
function predictCostQuality(skill) {
  return {
    tokens: skill.tokens + Math.floor(Math.random() * 100 - 50),
    quality: skill.quality,
    speed: skill.speed + Math.floor(Math.random() * 2),
    consistency: skill.consistency
  };
}

// ─── RENDERING HELPERS ────────────────────────────────
function addMessage(type, html) {
  const div = document.createElement('div');
  div.className = `message ${type}-message`;
  div.innerHTML = `<div class="message-content">${html}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function addICRCard(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  chatMessages.appendChild(div.firstElementChild);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message assistant-message typing-msg';
  div.innerHTML = `<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function qualityDots(filled, total = 5) {
  return Array.from({ length: total }, (_, i) =>
    `<span class="quality-dot${i < filled ? ' filled' : ''}"></span>`
  ).join('');
}

function addLogEntry(text, type = '') {
  const emptyMsg = routingLog.querySelector('.log-empty');
  if (emptyMsg) emptyMsg.remove();
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  const now = new Date();
  entry.innerHTML = `<span class="log-time">${now.toLocaleTimeString()}</span><br/>${text}`;
  routingLog.prepend(entry);
  if (routingLog.children.length > 10) routingLog.lastChild.remove();
}

function updateStats() {
  document.getElementById('stat-routed-val').textContent = state.routedCount;
  document.getElementById('stat-accepted-val').textContent = state.acceptedCount;
  document.getElementById('stat-tokens-val').textContent = state.tokensSaved.toLocaleString();
}

function updatePatternUI() {
  const container = document.getElementById('pattern-tracker');
  container.innerHTML = '';
  for (const [id, p] of Object.entries(patternTracker)) {
    const pct = Math.min(100, (p.count / p.threshold) * 100);
    container.innerHTML += `<div class="pattern-item">
      <div class="pattern-bar-bg"><div class="pattern-bar" style="width:${pct}%"></div></div>
      <span class="pattern-label">${p.label} <span class="pattern-count">${p.count}/${p.threshold}</span></span>
    </div>`;
  }
}

// ─── ICR RECOMMENDATION RENDERERS ─────────────────────

function renderInlineNudge(analysis) {
  const skill = analysis.bestMatch.skill;
  const saved = SIMPLE_PROMPT.tokens - skill.tokens;
  const html = `<div class="icr-nudge">
    <div class="icr-nudge-inner">
      <div class="nudge-text">💡 I recommend using your <strong>"${skill.name}"</strong> Skill for this task.</div>
      <div class="nudge-actions">
        <button class="btn-primary nudge-accept" data-skill="${analysis.bestMatch.id}">▶ Use Skill</button>
        <button class="btn-ghost nudge-dismiss">Just reply this time</button>
      </div>
      <div class="nudge-savings">Estimated savings: ~${saved} tokens/use · Quality: High · Speed: ~${skill.speed}s</div>
      <div class="nudge-timer"></div>
    </div>
  </div>`;
  addICRCard(html);

  const nudge = chatMessages.querySelector('.icr-nudge:last-child');
  nudge.querySelector('.nudge-accept').onclick = () => {
    state.acceptedCount++; state.tokensSaved += saved; updateStats();
    addLogEntry(`✅ Accepted: ${skill.name} (saved ~${saved} tokens)`, 'accepted');
    nudge.remove();
    respondWithSkill(skill, analysis.text);
  };
  nudge.querySelector('.nudge-dismiss').onclick = () => {
    addLogEntry(`⛔ Dismissed: ${skill.name} recommendation`, 'rejected');
    nudge.remove();
    respondSimple(analysis.text);
  };
  setTimeout(() => { if (nudge.parentNode) { nudge.remove(); respondSimple(analysis.text); } }, 10000);
}

function renderComparisonCard(analysis) {
  const skill = analysis.bestMatch.skill;
  const sp = predictCostQuality(SIMPLE_PROMPT);
  const sk = predictCostQuality(skill);
  const saved = sp.tokens - sk.tokens;

  const html = `<div class="icr-comparison">
    <div class="comparison-header">"I see a few ways to handle this. Here's the tradeoff:"</div>
    <div class="comparison-grid">
      <div class="comparison-option" data-choice="simple">
        <div class="option-title">${SIMPLE_PROMPT.icon} Simple Prompt</div>
        <div class="option-metrics">
          <div class="metric-row"><span>Tokens</span><span class="metric-val">~${sp.tokens}</span></div>
          <div class="metric-row"><span>Quality</span><span class="quality-dots">${qualityDots(sp.quality)}</span></div>
          <div class="metric-row"><span>Consistency</span><span class="metric-val">${sp.consistency}</span></div>
          <div class="metric-row"><span>Speed</span><span class="metric-val">~${sp.speed}s</span></div>
        </div>
        <div class="option-benefits"><span>${SIMPLE_PROMPT.benefits[0]}</span></div>
        <button class="btn-use">Use This</button>
      </div>
      <div class="comparison-option recommended" data-choice="skill" data-skill="${analysis.bestMatch.id}">
        <div class="option-title">${skill.icon} "${skill.name}"</div>
        <div class="option-metrics">
          <div class="metric-row"><span>Tokens</span><span class="metric-val">~${sk.tokens}</span></div>
          <div class="metric-row"><span>Quality</span><span class="quality-dots">${qualityDots(sk.quality)}</span></div>
          <div class="metric-row"><span>Consistency</span><span class="metric-val">${sk.consistency}</span></div>
          <div class="metric-row"><span>Speed</span><span class="metric-val">~${sk.speed}s</span></div>
        </div>
        <div class="option-benefits">${skill.benefits.map(b => `<span class="benefit">✦ ${b}</span>`).join('')}</div>
        <button class="btn-use">Use This ★</button>
      </div>
    </div>
    <div class="comparison-footer">
      <span>★ = ICR recommended</span>
      <span style="cursor:pointer;opacity:0.7">Don't show comparisons for this</span>
    </div>
  </div>`;
  addICRCard(html);

  const card = chatMessages.querySelector('.icr-comparison:last-child');
  card.querySelector('[data-choice="simple"] .btn-use').onclick = () => {
    addLogEntry(`⛔ Chose Simple Prompt over ${skill.name}`, 'rejected');
    card.remove(); respondSimple(analysis.text);
  };
  card.querySelector('[data-choice="skill"] .btn-use').onclick = () => {
    state.acceptedCount++; state.tokensSaved += saved; updateStats();
    addLogEntry(`✅ Accepted: ${skill.name} via comparison (saved ~${saved} tokens)`, 'accepted');
    card.remove(); respondWithSkill(skill, analysis.text);
  };
}

function renderMultiIntent(analysis) {
  const steps = analysis.intentMatches.map((m, i) => {
    const tag = m.skill ? m.skill.name : 'Simple Prompt';
    return `<div class="multi-step"><span class="step-num">${i + 1}</span><span>${m.skill.keywords[0]}</span><span class="step-skill-tag">${tag}</span></div>`;
  });
  // Add a simple prompt step for remainder
  if (analysis.intentMatches.length < 3) {
    steps.push(`<div class="multi-step"><span class="step-num">${steps.length + 1}</span><span>Remaining tasks</span><span class="step-skill-tag">Simple Prompt</span></div>`);
  }

  const html = `<div class="icr-multi">
    <div class="multi-inner">
      <div class="multi-header">🔀 I detected <strong>${analysis.intentMatches.length} sub-intents</strong>. I can chain them:</div>
      <div class="multi-steps">${steps.join('')}</div>
      <div class="multi-actions">
        <button class="btn-primary multi-accept">▶ Chain All Steps</button>
        <button class="btn-ghost multi-dismiss">Just reply normally</button>
      </div>
    </div>
  </div>`;
  addICRCard(html);

  const card = chatMessages.querySelector('.icr-multi:last-child');
  card.querySelector('.multi-accept').onclick = () => {
    state.acceptedCount++; state.tokensSaved += 800; updateStats();
    addLogEntry(`✅ Accepted multi-step chain (${analysis.intentMatches.length} steps)`, 'accepted');
    card.remove();
    addMessage('assistant', `<p>🔗 <strong>Running chained workflow:</strong></p>
      ${analysis.intentMatches.map((m, i) => `<p><strong>Step ${i+1}</strong> (${m.skill.name}): Processing...</p>`).join('')}
      <p style="color:var(--green);margin-top:8px">✓ All steps completed. Total tokens used: ~${analysis.intentMatches.reduce((s, m) => s + m.skill.tokens, 0)} (saved ~800 vs separate prompts)</p>`);
  };
  card.querySelector('.multi-dismiss').onclick = () => {
    addLogEntry(`⛔ Dismissed multi-step recommendation`, 'rejected');
    card.remove(); respondSimple(analysis.text);
  };
}

function showScaffoldModal(patternId) {
  scaffoldModal.classList.remove('hidden');
  const p = patternTracker[patternId];

  scaffoldModal.querySelector('.scaffold-subtitle').textContent =
    `I drafted this Skill from your last ${p.count} similar prompts:`;

  document.getElementById('scaffold-accept').onclick = () => {
    scaffoldModal.classList.add('hidden');
    state.acceptedCount++; state.tokensSaved += 800; updateStats();
    addLogEntry(`✅ Skill scaffolded: "${p.label}" → saved to library`, 'accepted');

    // Add new skill to sidebar
    const lib = document.getElementById('skills-library');
    const card = document.createElement('div');
    card.className = 'skill-card-mini';
    card.innerHTML = `<span class="skill-icon">🆕</span><div><div class="skill-name">PR Description Writer</div><div class="skill-desc">Auto-generated from patterns</div></div>`;
    lib.appendChild(card);

    addMessage('assistant', `<p>✅ <strong>"PR Description Writer"</strong> Skill has been created and saved to your library!</p><p style="color:var(--text-muted);font-size:.82rem">It will be automatically suggested next time you write a PR description. Estimated savings: ~800 tokens per use.</p>`);
  };
  document.getElementById('scaffold-edit').onclick = () => {
    scaffoldModal.classList.add('hidden');
    addLogEntry(`✎ Editing scaffolded Skill: "${p.label}"`, '');
    addMessage('assistant', `<p>Opening Skill editor for <strong>"PR Description Writer"</strong>... You can customize the instructions before saving.</p>`);
  };
  document.getElementById('scaffold-skip').onclick = () => {
    scaffoldModal.classList.add('hidden');
    addLogEntry(`⛔ Skipped Skill scaffolding: "${p.label}"`, 'rejected');
  };
}

// ─── RESPONSE GENERATORS ─────────────────────────────
function respondWithSkill(skill, userText) {
  const typing = showTyping();
  setTimeout(() => {
    typing.remove();
    const responses = {
      'Weekly Status Report': `<p>📊 <strong>Weekly Status Report — Engineering Team</strong></p>
        <p><strong>Sprint Progress (78% complete)</strong></p>
        <ul><li>Auth service migration: ✅ Complete</li><li>Dashboard redesign: 🔄 In progress (85%)</li><li>API rate limiting: 📋 Planned for next sprint</li></ul>
        <p><strong>Blockers</strong></p><ul><li>CI pipeline intermittent failures — DevOps investigating</li></ul>
        <p><strong>Next Week Priorities</strong></p><ul><li>Complete dashboard redesign</li><li>Begin API rate limiting implementation</li><li>Security audit prep</li></ul>
        <p style="color:var(--green);font-size:.78rem;margin-top:8px">✦ Generated via "${skill.name}" Skill · ~${skill.tokens} tokens · High consistency</p>`,
      'Security Code Reviewer': `<p>🔒 <strong>Security Review Results</strong></p>
        <table style="width:100%;font-size:.8rem;border-collapse:collapse"><tr style="border-bottom:1px solid var(--border-subtle)"><th style="text-align:left;padding:4px">Severity</th><th style="text-align:left;padding:4px">Issue</th><th style="text-align:left;padding:4px">Location</th><th style="text-align:left;padding:4px">Fix</th></tr>
        <tr><td style="padding:4px;color:var(--red)">🔴 High</td><td style="padding:4px">SQL Injection</td><td style="padding:4px">user_query.py:42</td><td style="padding:4px">Use parameterized queries</td></tr>
        <tr><td style="padding:4px;color:var(--amber)">🟡 Medium</td><td style="padding:4px">XSS in template</td><td style="padding:4px">views/profile.html:18</td><td style="padding:4px">Escape user input</td></tr></table>
        <p style="color:var(--green);font-size:.78rem;margin-top:8px">✦ Generated via "${skill.name}" Skill · ~${skill.tokens} tokens · OWASP coverage</p>`,
      'API Doc Writer': `<p>📝 <strong>API Documentation</strong></p>
        <p><code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:.82rem">GET /api/v1/users/{id}</code></p>
        <p>Retrieves a user by their unique identifier.</p>
        <p><strong>Parameters:</strong> <code>id</code> (string, required) — The user's UUID</p>
        <p><strong>Response 200:</strong></p>
        <pre style="background:var(--bg-tertiary);padding:8px 12px;border-radius:6px;font-size:.78rem;font-family:var(--font-mono);overflow-x:auto">{ "id": "abc-123", "name": "Jane Doe", "email": "jane@example.com" }</pre>
        <p style="color:var(--green);font-size:.78rem;margin-top:8px">✦ Generated via "${skill.name}" Skill · ~${skill.tokens} tokens · OpenAPI format</p>`
    };
    addMessage('assistant', responses[skill.name] || `<p>Task completed using <strong>${skill.name}</strong> Skill.</p><p style="color:var(--green);font-size:.78rem">✦ ~${skill.tokens} tokens · High quality · Consistent format</p>`);
  }, 1200);
}

function respondSimple(userText) {
  const typing = showTyping();
  setTimeout(() => {
    typing.remove();
    addMessage('assistant', `<p>Here's my response to your request. Since this was processed as a simple prompt, the output may vary in format and detail across sessions.</p><p style="color:var(--text-muted);font-size:.78rem">⚡ Processed as simple prompt · ~${SIMPLE_PROMPT.tokens} tokens · Variable consistency</p>`);
  }, 1500);
}

// ─── MAIN ROUTING LOGIC ──────────────────────────────
function processMessage(text) {
  if (!text.trim()) return;

  addMessage('user', `<p>${text}</p>`);
  chatInput.value = '';
  chatInput.style.height = 'auto';
  intentPreview.classList.add('hidden');

  const analysis = analyzeIntent(text);
  state.routedCount++;
  updateStats();

  const level = getConfidenceLevel(analysis.confidence);

  // Check for pattern detection trigger
  if (analysis.patternTriggered) {
    const pt = analysis.patternTriggered;
    patternTracker[pt.id].count++;
    updatePatternUI();
    if (patternTracker[pt.id].count >= patternTracker[pt.id].threshold) {
      addLogEntry(`🔍 Pattern detected: "${pt.pattern.label}" (${patternTracker[pt.id].count}/${patternTracker[pt.id].threshold}) → Scaffold triggered`, '');
      setTimeout(() => showScaffoldModal(pt.id), 800);
      respondSimple(text);
      return;
    }
    addLogEntry(`🔍 Pattern: "${pt.pattern.label}" (${patternTracker[pt.id].count}/${patternTracker[pt.id].threshold})`, '');
  }

  // Multi-intent check
  if (analysis.isMultiIntent) {
    addLogEntry(`🔀 Multi-intent detected (${analysis.intentMatches.length} intents, conf: ${analysis.confidence}%)`, '');
    renderMultiIntent(analysis);
    return;
  }

  // Route based on confidence
  if (level === 'high' && analysis.bestMatch) {
    addLogEntry(`🎯 High confidence (${analysis.confidence}%): ${analysis.bestMatch.skill.name} → Inline Nudge`, '');
    renderInlineNudge(analysis);
  } else if (level === 'medium' && analysis.bestMatch) {
    addLogEntry(`⚖️ Medium confidence (${analysis.confidence}%): ${analysis.bestMatch.skill.name} → Comparison Card`, '');
    renderComparisonCard(analysis);
  } else {
    addLogEntry(`🔇 Low confidence (${analysis.confidence}%): No match → Silent mode`, 'silent');
    respondSimple(text);
  }
}

// ─── LIVE INTENT PREVIEW ─────────────────────────────
let previewTimeout;
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';

  clearTimeout(previewTimeout);
  const text = chatInput.value.trim();
  if (text.length < 5) { intentPreview.classList.add('hidden'); return; }

  previewTimeout = setTimeout(() => {
    const analysis = analyzeIntent(text);
    const level = getConfidenceLevel(analysis.confidence);
    const colors = { high: 'var(--green)', medium: 'var(--amber)', low: 'var(--text-muted)' };
    const labels = { high: 'Inline Nudge', medium: 'Comparison Card', low: 'Silent Mode' };
    const match = analysis.bestMatch ? analysis.bestMatch.skill.name : 'None';
    const multi = analysis.isMultiIntent ? ' · 🔀 Multi-intent' : '';

    intentPreviewContent.innerHTML = `<span style="color:${colors[level]}">●</span> Confidence: <strong>${analysis.confidence}%</strong> · Route: <strong>${labels[level]}</strong> · Match: <strong>${match}</strong>${multi}`;
    intentPreview.classList.remove('hidden');
  }, 300);
});

// ─── EVENT HANDLERS ──────────────────────────────────
btnSend.addEventListener('click', () => processMessage(chatInput.value));
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); processMessage(chatInput.value); }
});

// Demo panel
document.getElementById('btn-demo-scenarios').addEventListener('click', () => demoPanel.classList.remove('hidden'));
document.getElementById('btn-close-demos').addEventListener('click', () => demoPanel.classList.add('hidden'));
demoPanel.addEventListener('click', (e) => { if (e.target === demoPanel) demoPanel.classList.add('hidden'); });

const DEMO_MESSAGES = {
  'high-confidence': 'Write a weekly status report for my engineering team covering sprint progress, blockers, and next week priorities',
  'medium-confidence': 'Analyze this API and write documentation for the endpoints',
  'low-confidence': 'Help me brainstorm creative names for my new startup in the AI space',
  'pattern-detect': 'Write a PR description for my latest changes to the auth module',
  'security-review': 'Review this code for SQL injection, XSS, and authentication bypass vulnerabilities',
  'multi-intent': 'Review this code for security issues, write API documentation, and create a PR description'
};

document.querySelectorAll('.demo-card').forEach(card => {
  card.addEventListener('click', () => {
    const demo = card.dataset.demo;
    demoPanel.classList.add('hidden');
    // For pattern-detect, pump the counter first
    if (demo === 'pattern-detect') { patternTracker['pr-description'].count = 2; updatePatternUI(); }
    chatInput.value = DEMO_MESSAGES[demo];
    chatInput.dispatchEvent(new Event('input'));
    setTimeout(() => processMessage(DEMO_MESSAGES[demo]), 400);
  });
});

// Scaffold modal backdrop close
scaffoldModal.querySelector('.modal-backdrop').addEventListener('click', () => scaffoldModal.classList.add('hidden'));

// Hint text click handlers
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'EM' && e.target.closest('.hint-text')) {
    chatInput.value = e.target.textContent;
    chatInput.dispatchEvent(new Event('input'));
    chatInput.focus();
  }
});

// Init
updatePatternUI();
