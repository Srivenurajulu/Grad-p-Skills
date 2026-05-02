document.addEventListener('DOMContentLoaded', () => {
  // Navigation Logic
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');
  const topTitle = document.getElementById('top-title');

  const viewTitles = {
    'playground': 'Routing Playground',
    'workflows': 'Workflow Composer',
    'scaffolder': 'Skill Scaffolder',
    'health': 'Skill Health Monitor',
    'analytics': 'Analytics & Journal',
    'ecosystem': 'Skill Ecosystem',
    'api': 'API Console'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update nav items
      navItems.forEach(n => n.classList.remove('on'));
      item.classList.add('on');

      // Update views
      const targetView = item.getAttribute('data-v');
      views.forEach(v => {
        if (v.id === `v-${targetView}`) {
          v.classList.add('on');
        } else {
          v.classList.remove('on');
        }
      });

      // Update Top Title
      if (viewTitles[targetView]) {
        topTitle.textContent = viewTitles[targetView];
      }
    });
  });

  // Routing Playground Logic
  const routeBtn = document.getElementById('route-btn');
  const pgResult = document.getElementById('pg-result');
  const intentInput = document.getElementById('intent-input');

  let chatStep = 0;
  let currentJourney = null;

  if (routeBtn && pgResult && intentInput) {
    routeBtn.addEventListener('click', handleInput);
    intentInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleInput();
      }
    });

    function handleInput() {
      const text = intentInput.value.trim();
      if (!text) return;

      if (chatStep === 0) {
        // Init chat UI
        pgResult.style.display = 'flex';
        pgResult.style.flexDirection = 'column';
        pgResult.style.gap = '16px';
        pgResult.style.padding = '20px';
        pgResult.style.backgroundColor = 'var(--bg1)';
        pgResult.style.border = '1px solid var(--border)';
        pgResult.style.borderRadius = '12px';
        pgResult.style.maxHeight = '500px';
        pgResult.style.overflowY = 'auto';
        pgResult.innerHTML = '';
        
        appendMessage('user', text);
        intentInput.value = '';

        const intent = text.toLowerCase();
        
        if (intent.includes('weekly status report')) {
          recordAnalytics(text, 'Skill', '-1,200', '<span class="amber">⏳ Evaluating</span>');
          currentJourney = 'marcus';
          chatStep = 1;
          setTimeout(() => {
            appendMessage('claude', `I notice you've asked for similar reports 4 times this month.<br><br>Want me to create a reusable Skill that remembers your format and team names? It would save ~1,200 tokens per use.`);
            appendOptions([
              { text: "Oh, that's actually useful. Tell me more.", action: marcusNext }
            ]);
          }, 800);
        } else if (intent.includes('security review')) {
          recordAnalytics(text, 'Skill', '-350', '<span class="amber">⏳ Evaluating</span>');
          currentJourney = 'priya';
          chatStep = 1;
          setTimeout(() => {
            appendMessage('claude', `I detected a recurring pattern (~400 tokens of instructions, 5th time this week).<br><br>I can save this as a 'Security Reviewer' Skill — same quality, ~350 fewer tokens each time. Want me to draft it?`);
            appendOptions([
              { text: "Hmm, let me see it first. Preview Skill.", action: priyaNext }
            ]);
          }, 800);
        } else if (intent.includes('stale') || intent.includes('conflicting') || intent.includes('meeting notes')) {
          recordAnalytics(text, 'Action', '-15,000', '<span class="amber">⏳ Evaluating</span>');
          currentJourney = 'sarah';
          chatStep = 1;
          setTimeout(() => {
            appendMessage('claude', `I found 2 Skills for this. They have overlapping instructions but different formats.<br><br>Want me to merge them into one?`);
            appendOptions([
              { text: "Yes! I didn't even know Jake made one.", action: sarahNext }
            ]);
          }, 800);
        } else if (intent.includes('analyze dataset') || intent.includes('correlations')) {
          recordAnalytics(text, 'Workflow', '-4,500', '<span class="amber">⏳ Evaluating</span>');
          currentJourney = 'david';
          chatStep = 1;
          setTimeout(() => {
            appendMessage('claude', `This is a complex data task. Instead of a single prompt, I can route this to an 'Automated EDA' Workflow which will write Python, run the code, and visualize the output.`);
            appendOptions([
              { text: "Yes, run the workflow.", action: davidNext }
            ]);
          }, 800);
        } else if (intent.includes('figma notes') || intent.includes('jira tickets')) {
          recordAnalytics(text, 'Skill', '-800', '<span class="amber">⏳ Evaluating</span>');
          currentJourney = 'elena';
          chatStep = 1;
          setTimeout(() => {
            appendMessage('claude', `You've converted Figma notes 3 times. Want to create a 'Figma to JIRA' Skill using your preferred ticket format?`);
            appendOptions([
              { text: "That would save hours. Preview Skill.", action: elenaNext }
            ]);
          }, 800);
        } else if (intent.includes('terraform script') || intent.includes('aws eks')) {
          recordAnalytics(text, 'Skill', '-20,000', '<span class="amber">⏳ Evaluating</span>');
          currentJourney = 'alex';
          chatStep = 1;
          setTimeout(() => {
            appendMessage('claude', `You're including 20,000 tokens of AWS EKS documentation. I can create a 'Terraform EKS Architect' Skill with this documentation permanently attached as a Knowledge Base.`);
            appendOptions([
              { text: "Token savings are huge. Preview Skill.", action: alexNext }
            ]);
          }, 800);
        } else {
          // Fallback logic for other inputs
          recordAnalytics(text, 'Prompt', '-150', '<span class="green">👍 Accepted</span>');
          setTimeout(() => {
            appendMessage('claude', `I evaluated your intent. I recommend using a Simple Prompt for this task (~150 tokens).`);
            chatStep = 0;
          }, 600);
        }
      } else {
        appendMessage('user', text);
        intentInput.value = '';
        if (currentJourney === 'marcus') {
          marcusNext();
        } else if (currentJourney === 'priya') {
          priyaNext();
        } else if (currentJourney === 'sarah') {
          sarahNext();
        } else if (currentJourney === 'david') {
          davidNext();
        } else if (currentJourney === 'elena') {
          elenaNext();
        } else if (currentJourney === 'alex') {
          alexNext();
        }
      }
    }

    function recordAnalytics(intentText, recommendedType, tokens, signalHtml) {
      const tbody = document.getElementById('analytics-body');
      if (!tbody) return;
      
      const tr = document.createElement('tr');
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mins = now.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${mins} ${ampm}`;
      
      let badgeClass = 'simple';
      if (recommendedType === 'Skill' || recommendedType === 'Action') badgeClass = 'skill';
      if (recommendedType === 'Agent') badgeClass = 'agent';
      
      const shortIntent = intentText.length > 25 ? intentText.substring(0, 25) + '...' : intentText;
      
      tr.innerHTML = `
        <td>${timeStr}</td>
        <td>"${shortIntent}"</td>
        <td><span class="badge ${badgeClass}">${recommendedType}</span></td>
        <td>${tokens}</td>
        <td class="analytics-signal">${signalHtml}</td>
      `;
      tbody.insertBefore(tr, tbody.firstChild);
    }

    function appendMessage(sender, html) {
      const msg = document.createElement('div');
      msg.style.padding = '12px 16px';
      msg.style.borderRadius = '8px';
      msg.style.maxWidth = '85%';
      msg.style.fontSize = '0.9rem';
      msg.style.lineHeight = '1.5';
      msg.style.animation = 'up 0.3s ease';

      if (sender === 'user') {
        msg.style.alignSelf = 'flex-end';
        msg.style.backgroundColor = 'var(--primary)';
        msg.style.color = '#fff';
      } else {
        msg.style.alignSelf = 'flex-start';
        msg.style.backgroundColor = 'var(--bg2)';
        msg.style.color = 'var(--t1)';
        msg.style.border = '1px solid var(--border)';
        msg.innerHTML = '<strong style="display:block;margin-bottom:6px;color:var(--t2);font-size:0.75rem;text-transform:uppercase;">Claude / ICR</strong>';
      }
      
      const content = document.createElement('div');
      content.innerHTML = html;
      msg.appendChild(content);

      pgResult.appendChild(msg);
      pgResult.scrollTop = pgResult.scrollHeight;
    }

    function appendOptions(options) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '10px';
      row.style.alignSelf = 'flex-start';
      row.style.animation = 'up 0.3s ease';
      
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-o';
        btn.style.fontSize = '0.85rem';
        btn.style.padding = '8px 16px';
        btn.textContent = opt.text;
        btn.onclick = () => {
          row.remove();
          appendMessage('user', opt.text);
          opt.action();
        };
        row.appendChild(btn);
      });
      pgResult.appendChild(row);
      pgResult.scrollTop = pgResult.scrollHeight;
    }

    function addSkillToEcosystem(icon, name, author, desc) {
      const grid = document.querySelector('.eco-grid');
      if (!grid) return;
      const card = document.createElement('div');
      card.className = 'eco-card card';
      card.style.border = '1px solid var(--green)';
      card.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.1)';
      card.innerHTML = `
        <div class="eco-hdr">
          <div class="eco-icon">${icon}</div>
          <div>
            <h4 style="color: var(--green)">${name}</h4>
            <small>By ${author}</small>
          </div>
        </div>
        <p class="eco-desc mt-2">${desc}</p>
        <div class="eco-foot mt-4">
          <span class="green" style="font-size: 0.8rem; font-weight: 500;">✨ Just Published</span>
          <button class="btn-s" disabled style="opacity: 0.7;">Installed ✓</button>
        </div>
      `;
      grid.insertBefore(card, grid.firstChild);
    }

    function resetChat() {
      chatStep = 0;
      currentJourney = null;
      pgResult.innerHTML = '';
      pgResult.style.display = 'none';
      intentInput.focus();
    }

    // --- MARCUS JOURNEY ---
    function marcusNext() {
      if (chatStep === 1) {
        chatStep = 2;
        setTimeout(() => {
          const cardHtml = `
            <div style="margin-bottom: 16px;">Here is a comparison of the options:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 8px;">
              <div style="border: 1px solid var(--border); border-radius: 8px; padding: 16px; background: var(--bg1);">
                <div style="font-weight: 600; margin-bottom: 12px; font-size:1rem;">📝 Simple Prompt</div>
                <div style="font-size: 0.85rem; color: var(--t2); margin-bottom: 4px;"><strong>Tokens:</strong> ~2,100</div>
                <div style="font-size: 0.85rem; color: var(--t2); margin-bottom: 4px;"><strong>Quality:</strong> Medium</div>
                <div style="font-size: 0.85rem; color: var(--t2); margin-bottom: 16px;"><strong>Time:</strong> 12s</div>
              </div>
              <div style="border: 2px solid var(--green); border-radius: 8px; padding: 16px; background: var(--bg1); position: relative;">
                <div style="position: absolute; top: -10px; right: 10px; background: var(--green); color: #fff; font-size: 0.7rem; padding: 3px 8px; border-radius: 12px; font-weight: 700; letter-spacing: 0.5px;">NEW</div>
                <div style="font-weight: 600; margin-bottom: 12px; font-size:1rem; color: var(--green);">⚡ "Weekly Report" Skill</div>
                <div style="font-size: 0.85rem; color: var(--t1); margin-bottom: 4px;"><strong>Tokens:</strong> ~900</div>
                <div style="font-size: 0.85rem; color: var(--t1); margin-bottom: 4px;"><strong>Quality:</strong> High</div>
                <div style="font-size: 0.85rem; color: var(--t1); margin-bottom: 16px;"><strong>Time:</strong> 8s</div>
                <div style="font-size: 0.8rem; color: var(--green); margin-top: 8px;">✦ Remembers team structure</div>
                <div style="font-size: 0.8rem; color: var(--green); margin-top: 4px;">✦ Consistent formatting every time</div>
              </div>
            </div>
          `;
          appendMessage('claude', cardHtml);
          appendOptions([
            { text: 'The token savings are real. Create Skill.', action: marcusNext }
          ]);
        }, 1200);
      } else if (chatStep === 2) {
        chatStep = 3;
        setTimeout(() => {
          const scaffoldHtml = `
            <div style="margin-bottom: 12px;">I drafted this Skill from your last 4 similar prompts:</div>
            <pre style="background: var(--bg1); padding: 16px; border-radius: 8px; border: 1px solid var(--border); font-size: 0.85rem; overflow-x: auto; font-family: 'JetBrains Mono', monospace; line-height: 1.5; color: var(--t1);">
<span style="color:var(--t3)">---</span>
<span style="color:var(--green)">name:</span> "Weekly Status Report"
<span style="color:var(--green)">description:</span> "Generates formatted weekly status reports"
<span style="color:var(--t3)">---</span>

<span style="color:#60A5FA; font-weight:bold;">## Instructions</span>
1. Sprint progress (% complete, key deliverables)
2. Blockers and risks
3. Next week's priorities

<span style="color:#60A5FA; font-weight:bold;">## Format</span>
- Markdown headers for each section
- Keep to ~500 words
            </pre>
          `;
          appendMessage('claude', scaffoldHtml);
          appendOptions([
            { text: 'It already knows my format! Accept.', action: marcusNext }
          ]);
        }, 1500);
      } else if (chatStep === 3) {
        chatStep = 4;
        setTimeout(() => {
          appendMessage('claude', `<div style="display:flex; align-items:center; gap:10px; font-weight:500; font-size:1rem; margin-bottom:8px;"><span style="font-size:1.5rem">✅</span> Skill Created</div><div>"Weekly Report" has been added to your library and published to the Team Ecosystem!</div><br><div style="font-size:0.85rem; color:var(--t2); background:var(--bg1); padding:12px; border-radius:6px; border-left: 3px solid var(--primary);"><strong>Tip:</strong> Next time you ask for a weekly report, I will auto-suggest using this Skill.<br><br>Since you now have 5 active Skills, consider chaining them into Workflows or sharing them with your teammates!</div>`);
          addSkillToEcosystem('📊', 'Weekly Report', '@Marcus', 'Generates formatted weekly status reports for engineering teams.');
          appendOptions([
            { text: 'Start Over', action: resetChat }
          ]);
        }, 1000);
      }
    }

    // --- PRIYA JOURNEY ---
    function priyaNext() {
      if (chatStep === 1) {
        chatStep = 2;
        setTimeout(() => {
          const scaffoldHtml = `
            <div style="margin-bottom: 12px;">Here is the auto-drafted SKILL.md with extracted review criteria.<br><span class="green">Token savings: ~350/use × 20 uses/month = ~7,000 tokens/month saved.</span></div>
            <pre style="background: var(--bg1); padding: 16px; border-radius: 8px; border: 1px solid var(--border); font-size: 0.85rem; overflow-x: auto; font-family: 'JetBrains Mono', monospace; line-height: 1.5; color: var(--t1);">
<span style="color:var(--t3)">---</span>
<span style="color:var(--green)">name:</span> "Security Reviewer"
<span style="color:var(--green)">description:</span> "Automated OWASP Top 10 code checks"
<span style="color:var(--t3)">---</span>

<span style="color:#60A5FA; font-weight:bold;">## Instructions</span>
1. Check for SQL Injection & XSS
2. Verify Authentication boundaries
3. Flag unsanitized inputs

<span style="color:#60A5FA; font-weight:bold;">## Output Format</span>
- Severity Level (Critical/High/Medium)
- Recommended Fix Patch
            </pre>
          `;
          appendMessage('claude', scaffoldHtml);
          appendOptions([
            { text: 'It actually captured my criteria correctly. Save with minor edit.', action: priyaNext }
          ]);
        }, 1200);
      } else if (chatStep === 2) {
        chatStep = 3;
        setTimeout(() => {
          appendMessage('claude', `<div style="display:flex; align-items:center; gap:10px; font-weight:500; font-size:1rem; margin-bottom:8px;"><span style="font-size:1.5rem">✅</span> Skill Created</div><div>"Security Reviewer" has been added to your library and committed to the team's git repo!</div><br><div style="font-size:0.85rem; color:var(--t2); background:var(--bg1); padding:12px; border-radius:6px; border-left: 3px solid var(--primary);"><strong>Tip:</strong> Output consistency is now guaranteed. Next code review, ICR will auto-suggest using 'Security Reviewer'.<br><br>You now have 4 coding Skills. Consider chaining Security Review + API Docs into a post-PR Workflow!</div>`);
          addSkillToEcosystem('🔒', 'Security Reviewer', '@Priya', 'Automated OWASP Top 10 code checks for PRs.');
          appendOptions([
            { text: 'Start Over', action: resetChat }
          ]);
        }, 1000);
      }
    }

    // --- SARAH JOURNEY ---
    function sarahNext() {
      if (chatStep === 1) {
        chatStep = 2;
        setTimeout(() => {
          const auditHtml = `
            <div style="margin-bottom: 12px;"><strong>ICR Health Audit Complete:</strong></div>
            <ul style="padding-left: 20px; font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">
              <li><strong>5</strong> Active Skills</li>
              <li style="color:var(--amber)"><strong>3</strong> Stale Skills (unused > 90 days)</li>
              <li style="color:var(--amber)"><strong>2</strong> Conflicting Skills (Meeting Notes)</li>
            </ul>
            <div style="background:var(--bg1); border-radius:8px; padding:12px; border:1px solid var(--border);">
              <strong>Recommendation:</strong> Archive 3 stale skills, and merge the 2 conflicting ones.<br>
              <span class="green">Projected Savings: ~15,000 tokens/month.</span>
            </div>
          `;
          appendMessage('claude', auditHtml);
          appendOptions([
            { text: 'This is the visibility I needed. Archive stale & Merge.', action: sarahNext }
          ]);
        }, 1200);
      } else if (chatStep === 2) {
        chatStep = 3;
        setTimeout(() => {
          appendMessage('claude', `<div style="display:flex; align-items:center; gap:10px; font-weight:500; font-size:1rem; margin-bottom:8px;"><span style="font-size:1.5rem">✨</span> Clean up complete!</div><div>3 Stale Skills archived. 2 Skills merged into "Team Meeting Notes".</div><br><div style="font-size:0.85rem; color:var(--t2); background:var(--bg1); padding:12px; border-radius:6px; border-left: 3px solid var(--primary);"><strong>Status:</strong> The new "Team Meeting Notes" skill has been designated as "team-approved". ICR will prioritize this for all members, including new hires during onboarding.</div>`);
          addSkillToEcosystem('📋', 'Team Meeting Notes', '@Sarah', 'Standardized meeting minutes with actionable follow-ups.');
          appendOptions([
            { text: 'Start Over', action: resetChat }
          ]);
        }, 1000);
      }
    }

    // --- DAVID JOURNEY ---
    function davidNext() {
      if (chatStep === 1) {
        chatStep = 2;
        setTimeout(() => {
          const workflowHtml = `
            <div style="margin-bottom: 12px;"><strong>Executing 'Automated EDA' Workflow...</strong></div>
            <ul style="padding-left: 20px; font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">
              <li><span class="green">✓ Data Cleaning (Imputing missing values)</span></li>
              <li><span class="green">✓ Correlation Matrix Generation</span></li>
              <li><span class="green">✓ Statistical Summary Report</span></li>
            </ul>
            <div style="background:var(--bg1); border-radius:8px; padding:12px; border:1px solid var(--border);">
              <span class="green">Workflow Complete.</span> Saved ~20 minutes of manual back-and-forth prompting.
            </div>
          `;
          appendMessage('claude', workflowHtml);
          appendOptions([
            { text: 'That saved me 20 minutes.', action: davidNext }
          ]);
        }, 1200);
      } else if (chatStep === 2) {
        chatStep = 3;
        setTimeout(() => {
          appendMessage('claude', `I can save this multi-step process as an 'Automated EDA' Workflow for your team.`);
          appendOptions([
            { text: 'Looks powerful. Create Workflow.', action: davidNext }
          ]);
        }, 1000);
      } else if (chatStep === 3) {
        chatStep = 4;
        setTimeout(() => {
          appendMessage('claude', `<div style="display:flex; align-items:center; gap:10px; font-weight:500; font-size:1rem; margin-bottom:8px;"><span style="font-size:1.5rem">✅</span> Workflow Created!</div><div>"Automated EDA" has been added to your library and published to the Team Ecosystem.</div>`);
          addSkillToEcosystem('📈', 'Automated EDA', '@David', 'End-to-end exploratory data analysis workflow.');
          appendOptions([
            { text: 'Start Over', action: resetChat }
          ]);
        }, 1000);
      }
    }

    // --- ELENA JOURNEY ---
    function elenaNext() {
      if (chatStep === 1) {
        chatStep = 2;
        setTimeout(() => {
          const scaffoldHtml = `
            <div style="margin-bottom: 12px;">Here is the auto-drafted SKILL.md with your extracted Acceptance Criteria format.</div>
            <pre style="background: var(--bg1); padding: 16px; border-radius: 8px; border: 1px solid var(--border); font-size: 0.85rem; overflow-x: auto; font-family: 'JetBrains Mono', monospace; line-height: 1.5; color: var(--t1);">
<span style="color:var(--t3)">---</span>
<span style="color:var(--green)">name:</span> "Figma to JIRA"
<span style="color:var(--green)">description:</span> "Translates design notes into standard JIRA epics and tasks."
<span style="color:var(--t3)">---</span>

<span style="color:#60A5FA; font-weight:bold;">## Format</span>
- Epic Name
- User Story: As a [user], I want to [action] so that [benefit]
- Acceptance Criteria: Given/When/Then
            </pre>
          `;
          appendMessage('claude', scaffoldHtml);
          appendOptions([
            { text: 'Perfect format. Accept and Publish.', action: elenaNext }
          ]);
        }, 1200);
      } else if (chatStep === 2) {
        chatStep = 3;
        setTimeout(() => {
          appendMessage('claude', `<div style="display:flex; align-items:center; gap:10px; font-weight:500; font-size:1rem; margin-bottom:8px;"><span style="font-size:1.5rem">✅</span> Skill Created!</div><div>"Figma to JIRA" has been published to the Team Ecosystem.<br><br>Now your whole team can use it to write better tickets consistently.</div>`);
          addSkillToEcosystem('🎨', 'Figma to JIRA', '@Elena', 'Translates design notes into standard JIRA epics and tasks.');
          appendOptions([
            { text: 'Start Over', action: resetChat }
          ]);
        }, 1000);
      }
    }

    // --- ALEX JOURNEY ---
    function alexNext() {
      if (chatStep === 1) {
        chatStep = 2;
        setTimeout(() => {
          const scaffoldHtml = `
            <div style="margin-bottom: 12px;">Here is the drafted Skill with Knowledge Base attached.</div>
            <pre style="background: var(--bg1); padding: 16px; border-radius: 8px; border: 1px solid var(--border); font-size: 0.85rem; overflow-x: auto; font-family: 'JetBrains Mono', monospace; line-height: 1.5; color: var(--t1);">
<span style="color:var(--t3)">---</span>
<span style="color:var(--green)">name:</span> "Terraform EKS Architect"
<span style="color:var(--green)">knowledge_base:</span> "aws_eks_best_practices.md" (20,400 tokens)
<span style="color:var(--t3)">---</span>

<span style="color:#60A5FA; font-weight:bold;">## Instructions</span>
1. Generate complete Terraform HCL
2. Ensure IAM roles and VPC configurations follow attached docs
3. Output a summary of created resources
            </pre>
          `;
          appendMessage('claude', scaffoldHtml);
          appendOptions([
            { text: 'Accept and Publish to Team.', action: alexNext }
          ]);
        }, 1200);
      } else if (chatStep === 2) {
        chatStep = 3;
        setTimeout(() => {
          appendMessage('claude', `<div style="display:flex; align-items:center; gap:10px; font-weight:500; font-size:1rem; margin-bottom:8px;"><span style="font-size:1.5rem">✅</span> Skill Created!</div><div>"Terraform EKS Architect" is now available to the team. By attaching the context natively, it will save ~1M tokens if the team uses it 50 times this month.</div>`);
          addSkillToEcosystem('🏗️', 'Terraform EKS Architect', '@Alex', 'Generates AWS EKS infrastructure with attached AWS docs.');
          appendOptions([
            { text: 'Start Over', action: resetChat }
          ]);
        }, 1000);
      }
    }
  }

  // Scaffolder Logic
  const scaffoldBtn = document.getElementById('scaffold-accept');
  const scaffoldCode = document.getElementById('scaffold-code');

  if (scaffoldBtn && scaffoldCode) {
    scaffoldBtn.addEventListener('click', () => {
      scaffoldBtn.textContent = 'Scaffolding...';
      setTimeout(() => {
        scaffoldBtn.textContent = 'Scaffolded!';
        scaffoldBtn.disabled = true;
        scaffoldBtn.classList.replace('btn-p', 'btn-o');
        scaffoldCode.style.display = 'block';
      }, 600);
    });
  }

  // --- Scaffolder Template Handler ---
  window.showTemplatePreview = function(templateName) {
    const msgDiv = document.getElementById('template-msg');
    if (msgDiv) {
      msgDiv.style.display = 'block';
      msgDiv.innerHTML = `<strong>✨ Template Loaded!</strong> Use this '${templateName}' Skill and save ~35% tokens per run compared to standard prompting. Customize it in the code preview above.`;
      
      const codePreview = document.getElementById('scaffold-code');
      if (codePreview) {
        codePreview.style.display = 'block';
        // Scroll to the top of the container
        codePreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const templateContents = {
    'API Documentation': `name: API Documentation\ndescription: Generates OpenAPI 3.0 spec\nrules:\n  - Use JSON format\n  - Include required security definitions\n  - Provide sample responses for 200 and 400 status codes`,
    'Unit Test Generator': `name: Unit Test Generator\ndescription: Generates Jest tests for React components\nrules:\n  - Target 80%+ coverage\n  - Mock all external API calls\n  - Test edge cases (null, empty array)`,
    'Release Notes': `name: Release Notes\ndescription: Formats Jira tickets into customer-facing release notes\nrules:\n  - Group by 'Features', 'Bug Fixes', 'Performance'\n  - Remove technical jargon\n  - Keep tone professional but approachable`,
    'Security Audit': `name: Security Audit\ndescription: Scans code for OWASP Top 10 vulnerabilities\nrules:\n  - Highlight injection risks\n  - Check for hardcoded secrets\n  - Validate input sanitization methods`,
    'Code Migration': `name: Code Migration\ndescription: Migrates Python to Go\nrules:\n  - Use idiomatic Go (goroutines, channels)\n  - Convert Python classes to Go structs with receivers\n  - Include comprehensive error handling`,
    'DB Schema Designer': `name: DB Schema Designer\ndescription: Generates Prisma schema\nrules:\n  - Use relational best practices (1:n, m:n)\n  - Add @map and @@map for snake_case db names\n  - Include @updatedAt on all models`
  };

  let currentPreviewTemplate = '';

  window.previewTemplateModal = function(templateName) {
    currentPreviewTemplate = templateName;
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modal = document.getElementById('template-modal');
    
    if (modalTitle && modalContent && modal) {
      modalTitle.textContent = templateName + ' Preview';
      modalContent.textContent = templateContents[templateName] || 'Content not available.';
      modal.style.display = 'flex';
    }
  };

  window.closeTemplateModal = function() {
    const modal = document.getElementById('template-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  window.useTemplateFromModal = function() {
    closeTemplateModal();
    showTemplatePreview(currentPreviewTemplate);
  };

  // --- Workflow Composer Builder Logic ---
  const wfAddBtns = document.querySelectorAll('.wf-add-btn');
  const wfDropzone = document.getElementById('wf-dropzone');
  const wfEmptyText = document.getElementById('wf-empty-text');
  const wfDeployBtn = document.getElementById('deploy-wf-btn');

  if (wfAddBtns.length > 0 && wfDropzone) {
    wfAddBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (wfEmptyText) wfEmptyText.style.display = 'none';
        
        const skillName = btn.getAttribute('data-skill');
        const stepCount = wfDropzone.querySelectorAll('.wf-step').length;
        
        if (stepCount > 0) {
          const arrow = document.createElement('div');
          arrow.className = 'wf-arrow';
          arrow.textContent = '↓';
          arrow.style.animation = 'up 0.2s ease';
          wfDropzone.appendChild(arrow);
        }
        
        const step = document.createElement('div');
        step.className = 'wf-step';
        step.style.animation = 'up 0.3s ease';
        step.textContent = skillName;
        wfDropzone.appendChild(step);
        
        if (wfDeployBtn) wfDeployBtn.disabled = false;
      });
    });

    if (wfDeployBtn) {
      wfDeployBtn.addEventListener('click', () => {
        wfDeployBtn.textContent = 'Deploying...';
        setTimeout(() => {
          wfDeployBtn.textContent = 'Workflow Deployed!';
          wfDeployBtn.style.backgroundColor = 'var(--green)';
          wfDeployBtn.style.color = '#fff';
          wfDeployBtn.disabled = true;

          // Get steps
          const steps = Array.from(wfDropzone.querySelectorAll('.wf-step')).map(el => el.textContent);
          
          // Render workflow card
          const container = document.getElementById('deployed-workflows-container');
          const grid = document.getElementById('deployed-workflows-grid');
          if (container && grid) {
            container.style.display = 'block';
            
            const cardHtml = `
              <div class="wf-card-hdr">
                <div>
                  <h4>Custom Pipeline</h4>
                  <span class="wf-meta">${steps.length} steps · Just now</span>
                </div>
                <div class="wf-status live">Live</div>
              </div>
              <div class="wf-steps">
                ${steps.map((s, i) => `
                  <div class="wf-step">${s}</div>
                  ${i < steps.length - 1 ? '<div class="wf-arrow">↓</div>' : ''}
                `).join('')}
              </div>
              <div class="wf-card-foot mt-4">
                <span class="green">▼ Est. ${steps.length * 1000} tokens saved</span>
                <button class="btn-s">▶ Run</button>
              </div>
            `;
            
            const card = document.createElement('div');
            card.className = 'wf-card card';
            card.style.animation = 'up 0.5s ease';
            card.innerHTML = cardHtml;
            grid.insertBefore(card, grid.firstChild);
          }
          
          // Reset builder for next time after 2 seconds
          setTimeout(() => {
            wfDropzone.innerHTML = '<p style="color: var(--t2); font-size: 0.9rem; text-align: center; margin-top: 40px;" id="wf-empty-text">Click a skill on the left to add it to your pipeline.</p>';
            wfDeployBtn.textContent = 'Deploy Workflow';
            wfDeployBtn.style.backgroundColor = '';
            wfDeployBtn.style.color = '';
          }, 2000);

        }, 800);
      });
    }
  }
});
