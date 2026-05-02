function createClaudeSkillsPresentation() {
  var p = SlidesApp.create('Claude Skills ICR - Final Presentation');
  var D='#1a1a2e',B='#0f3460',G='#e2b714',W='#ffffff',LG='#c4c4c4',GR='#00b894',RD='#e74c3c';

  function ss(s){s.getBackground().setSolidFill(D);var b=s.insertShape(SlidesApp.ShapeType.RECTANGLE,0,0,720,8);b.getBorder().setTransparent();b.getFill().setSolidFill(G);}
  function at(s,t,y){var x=s.insertTextBox(t,40,y||20,640,50);x.getText().getTextStyle().setFontSize(24).setBold(true).setForegroundColor(G).setFontFamily('Montserrat');return x;}
  function ab(s,t,x,y,w,h,fs){var b=s.insertTextBox(t,x||40,y||90,w||640,h||300);b.getText().getTextStyle().setFontSize(fs||14).setForegroundColor(W).setFontFamily('Open Sans');return b;}
  function ac(s,x,y,w,h,c){var k=s.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE,x,y,w,h);k.getFill().setSolidFill(c||B);k.getBorder().setTransparent();return k;}
  function ln(s,y){var l=s.insertShape(SlidesApp.ShapeType.RECTANGLE,40,y,640,2);l.getFill().setSolidFill(G);l.getBorder().setTransparent();}
  function sn(s,t,y){var n=s.insertTextBox(t,40,y||370,640,25);n.getText().getTextStyle().setFontSize(10).setItalic(true).setForegroundColor(LG).setFontFamily('Open Sans');}

  // ===== SLIDE 0: TITLE =====
  var s0=p.getSlides()[0]; s0.getBackground().setSolidFill(D);
  var sh=s0.getShapes(); for(var i=sh.length-1;i>=0;i--)sh[i].remove();
  s0.insertShape(SlidesApp.ShapeType.RECTANGLE,0,0,720,10).getFill().setSolidFill(G);
  s0.insertShape(SlidesApp.ShapeType.RECTANGLE,0,395,720,10).getFill().setSolidFill(G);
  s0.insertShape(SlidesApp.ShapeType.RECTANGLE,680,0,40,405).getFill().setSolidFill(B);
  var mt=s0.insertTextBox('Intelligent Capability\nRouter for Claude Skills',40,70,640,120);
  mt.getText().getTextStyle().setFontSize(36).setBold(true).setForegroundColor(W).setFontFamily('Montserrat');
  var st=s0.insertTextBox('Solving Decision Fatigue in Enterprise AI',40,200,640,35);
  st.getText().getTextStyle().setFontSize(20).setForegroundColor(G).setFontFamily('Open Sans');
  s0.insertTextBox('From Prompt Paralysis to Intelligent Automation\nGraduation Project | May 2026',40,245,640,50).getText().getTextStyle().setFontSize(14).setForegroundColor(LG).setFontFamily('Open Sans');

  // ===== SLIDE 1: PROBLEM STATEMENT =====
  var s1=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s1);
  at(s1,'1. Problem Statement');
  ab(s1,
    'As Claude evolves into Skills, Agents, and Workflows, users face decision paralysis — not about what Claude can do, but how to use it effectively.\n\n'+
    'Three Root Causes:\n\n'+
    '1. Cognitive Overload (Hick\'s Law)\n'+
    'With 5+ capability modes, every interaction begins with an implicit multi-option evaluation. Decision time increases logarithmically with choices.\n\n'+
    '2. Invisible Tradeoffs\n'+
    'Users cannot see cost, quality, or latency implications before committing. They learn through expensive trial-and-error, burning tokens on suboptimal paths.\n\n'+
    '3. No Feedback Loop\n'+
    'Even when users find the right capability, there is no mechanism to reinforce that choice. Good decisions do not compound — each session starts from zero.',
    40,65,640,330,12);

  // ===== SLIDE 2: MARKET SIZE & OPPORTUNITY =====
  var s2=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s2);
  at(s2,'2. Market Size & Opportunity');
  ac(s2,30,65,320,80,'#2d3436');
  ab(s2,'TAM: $143B\nGlobal Enterprise AI Market by 2027\n(Source: IDC)',40,70,300,70,12);
  ac(s2,370,65,320,80,'#2d3436');
  ab(s2,'SAM: $12B\nAI Developer Tools & Platforms\n(Prompt mgmt, orchestration, LLMOps)',380,70,300,70,12);
  ac(s2,30,160,660,80,B);
  ab(s2,'SOM: $500M — Enterprise teams using Claude Pro/Team/Enterprise plans\nTarget: 4.8M - 7.2M "Capable but Uncertain" users who have access to advanced features but default to simple prompting.\nProjected upside: $30-50M ARR from increased advanced feature adoption.',40,165,640,70,12);
  ln(s2,255);
  ab(s2,'Why Now? (Q2 2026 Convergence Window):\n\n'+
    '• Claude\'s capability stack has reached critical mass — Skills, Agents, MCP, Workflows all live.\n'+
    '• Enterprise AI budgets are under scrutiny — CFOs demand measurable ROI per AI dollar spent.\n'+
    '• Competitor platforms (OpenAI GPTs, Gemini Gems) are adding capabilities but ignoring the selection problem.\n'+
    '• No major platform offers an AI-native decision layer. This is the whitespace.',
    40,265,640,130,12);

  // ===== SLIDE 3: COMPETITOR ANALYSIS =====
  var s3=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s3);
  at(s3,'3. Competitive Landscape');
  var comps=[
    ['OpenAI Custom GPTs','3M+ GPTs in Store\n✅ No-code builder\n✅ Custom instructions\n❌ No intelligent routing\n❌ Quality spam in store\n❌ No team governance','#2d3436'],
    ['Google Gemini Gems','Workspace-integrated\n✅ Persistent personas\n✅ Opal workflow builder\n❌ Locked to Google\n❌ No cost optimization\n❌ Setup-heavy','#2d3436'],
    ['Microsoft Copilot','Rule-based topics\n✅ Enterprise plugins\n✅ Declarative agents\n❌ Deterministic routing\n❌ Cannot adapt to intent\n❌ Manual orchestration','#2d3436']
  ];
  for(var c=0;c<comps.length;c++){var cx=20+(c*235);ac(s3,cx,65,225,175,comps[c][2]);ab(s3,comps[c][0]+'\n\n'+comps[c][1],cx+10,70,205,165,10);}
  ac(s3,20,250,680,60,B);
  ab(s3,'🏆 Gap: NO competitor offers an AI-native intelligence layer that recommends HOW to use the platform.\nEvery platform assumes users know what they want. The ICR fills this whitespace.',30,255,660,50,12);
  sn(s3,'Source: Product analysis of OpenAI, Google, Microsoft platforms — April 2026',320);

  // ===== SLIDE 4: USER SEGMENT (4 REAL USERS) =====
  var s4=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s4);
  at(s4,'4. Target Users — Primary Research (n=7)');
  var users=[
    ['Srivatsan','Enterprise | 1yr+','Knows Skills exist but forgets them. Cannot predict if a Skill will help. Wants token cost visibility before committing.',GR],
    ['Sri Sakthi M','Team | 3-6mo','Uses Excel Skill but forgets it exists. Confidence: 3/5. Biggest barrier: cannot predict Skill outcomes.',G],
    ['Srishti','Pro | 1-3mo','Power user but rushed. Quote: "It took too long to figure how it would turn out." Wants auto-suggestions.',RD],
    ['Preetha','Pro | 6-12mo','Regular user. Quote: "Writing my newsletter — Skills really helped me." Sticks to simple prompts from habit.','#6c5ce7']
  ];
  for(var u=0;u<users.length;u++){var ux=u<2?20+(u*350):20+((u-2)*350),uy=u<2?60:220;
    ac(s4,ux,uy,340,145,'#2d3436');
    var us=s4.insertShape(SlidesApp.ShapeType.RECTANGLE,ux,uy,340,5);us.getFill().setSolidFill(users[u][3]);us.getBorder().setTransparent();
    ab(s4,users[u][0]+' ('+users[u][1]+')\n\n'+users[u][2],ux+10,uy+12,320,125,11);
  }
  sn(s4,'Source: User Segment Reviews Survey — April 2026. 71% working professionals, 57% daily users.');

  // ===== SLIDE 5: SURVEY KEY FINDINGS =====
  var s5=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s5);
  at(s5,'5. Survey Insights & Validation');
  ac(s5,30,60,320,75,'#b71c1c');
  ab(s5,'86% take 2-3+ attempts\nto get desired output with\nprofessional documents',40,65,300,65,14);
  ac(s5,370,60,320,75,B);
  ab(s5,'71% cannot confidently decide\nwhen to use a Skill vs.\na simple prompt',380,65,300,65,14);
  ac(s5,30,150,320,75,'#2d3436');
  ab(s5,'100% of respondents said\nSkills Advisor would be\nvaluable (rated 3-5/5)',40,155,300,65,14);
  ac(s5,370,150,320,75,'#00695c');
  ab(s5,'85% would choose the Skill\npath when shown token savings\nand quality predictions upfront',380,155,300,65,14);
  ln(s5,240);
  ab(s5,'Top 3 Barriers to Skills Adoption (from survey):\n\n'+
    '1. "I can\'t predict if a Skill will work for my specific need" — 57% of respondents\n'+
    '2. "Skills feel complicated or intimidating" — 29% of respondents\n'+
    '3. "Forgetting that Skills exist when I need them" — 57% of respondents\n\n'+
    'Top requested feature: "Based on the prompt, suggest the skills available for that" — Srivatsan',
    40,250,640,140,12);

  // ===== SLIDE 6: STRUCTURED PROBLEM BREAKDOWN =====
  var s6=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s6);
  at(s6,'6. Structured Problem Breakdown');
  var qa=[
    ['How do we know it\'s real?','86% users need 2-3+ tries. Survey + industry reports confirm trial-and-error fatigue and cost overruns.'],
    ['Who faces this?','Working professionals on Pro/Team/Enterprise plans who use Claude daily for document creation and code tasks.'],
    ['Why solve NOW?','Enterprise AI spend hits $143B by 2027. Cost governance is the #1 blocker to scaling LLM adoption.'],
    ['What is the TRUE problem?','A missing intelligence layer between user intent and Claude\'s growing capability spectrum.']
  ];
  for(var q=0;q<qa.length;q++){var qy=62+(q*50);ac(s6,30,qy,660,44,q%2===0?B:'#2d3436');ab(s6,'❓ '+qa[q][0]+'  →  '+qa[q][1],42,qy+6,636,34,11);}
  ln(s6,270);
  ac(s6,30,280,325,80,'#00695c');
  ab(s6,'👤 Value for Professionals\n• Eliminates blank-canvas paralysis\n• Automates multi-step workflow chains\n• Saves 35-40% tokens per task',40,285,305,70,11);
  ac(s6,365,280,325,80,'#4a148c');
  ab(s6,'🏢 Value for Business\n• Departmental token budgets & alerts\n• Team-wide prompt standardization\n• Measurable AI ROI per employee',375,285,305,70,11);

  // ===== SLIDE 7: PROPOSED SOLUTION =====
  var s7=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s7);
  at(s7,'7. Proposed Solution: The ICR Platform');
  ab(s7,'The Intelligent Capability Router (ICR) is a meta-cognitive AI layer where Claude itself recommends HOW to be used. It intercepts user intent, predicts cost/quality/latency tradeoffs, and auto-scaffolds Skills from detected patterns.',40,60,640,50,12);
  var layers=[
    ['🎯 Intent Interceptor','NLP classifies input as Simple / Complex / Multi-step with confidence scoring'],
    ['🔀 Routing Engine','Dynamically selects cheapest path: Prompt → Skill → Agent → Workflow'],
    ['🔗 Workflow Composer','Drag-and-drop pipeline builder — chains Skills with data pass-through'],
    ['🏗️ Skill Scaffolder','Auto-detects repetitive patterns and generates YAML Skill templates with 6 default templates'],
    ['📊 Analytics Engine','Real-time token economics, adoption heatmaps, and decision journal logging'],
    ['🌐 Skill Ecosystem','Team-wide marketplace for sharing, versioning, and installing community Skills']
  ];
  for(var l=0;l<layers.length;l++){var ly=115+(l*45);ac(s7,30,ly,660,40,l%2===0?B:'#2d3436');ab(s7,layers[l][0]+' — '+layers[l][1],45,ly+5,630,30,11);}

  // ===== SLIDE 8: RICE PRIORITIZATION =====
  var s8=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s8);
  at(s8,'8. Ideation & Prioritization (RICE)');
  ac(s8,30,60,660,32,G);
  s8.insertTextBox('Feature                                  Reach  Impact  Conf   Effort  Score',40,63,640,25).getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(D).setFontFamily('Courier New');
  var rd=[
    ['ICR Intent Router (Core)              High    High    Med    High     8.5','#2d3436'],
    ['Workflow Composer (Chaining)          Med     High    Med    Low      8.0',B],
    ['Skill Scaffolder + Templates          High    Med     High   Med      7.0','#2d3436'],
    ['Token Economics Dashboard             Med     High    Low    Med      6.5',B],
    ['Skill Health Monitor                  Low     Med     High   High     5.5','#2d3436']
  ];
  for(var r=0;r<rd.length;r++){var ry=94+(r*33);ac(s8,30,ry,660,30,rd[r][1]);ab(s8,rd[r][0],40,ry+3,640,24,11);}
  ln(s8,265);
  ab(s8,'RICE Scoring: Reach (% of target users affected) × Impact (value delivered) × Confidence (data backing) ÷ Effort (engineering weeks).\n\n'+
    'MVP Decision: ICR Router + Workflow Composer + Scaffolder form the core differentiated stack. Health Monitor and Token Dashboard are Phase 2 enhancements.',
    40,275,640,100,12);

  // ===== SLIDE 9: USER FLOW =====
  var s9=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s9);
  at(s9,'9. User Flow & Solution Architecture');
  ab(s9,'End-to-end flow: User types intent → ICR intercepts → Confidence scoring → Route recommendation → User accepts → Skill executes → Analytics logged.\n',40,55,640,35,12);
  var flow=['User Types Intent','ICR Intercepts','Confidence Score','Route: Prompt / Skill / Agent','User Accepts or Overrides','Skill Executes','Analytics Logged'];
  for(var f=0;f<flow.length;f++){
    var fx=15+(f*100);
    ac(s9,fx,100,92,50,f%2===0?B:'#2d3436');
    ab(s9,flow[f],fx+5,105,82,40,9);
  }
  ab(s9,'What We Built (Live Prototype):\n\n'+
    '• Routing Playground: 9 interactive chatbot journeys (Marcus, Priya, Sarah, David, Elena, Alex + 3 more)\n'+
    '• Skill Scaffolder: 6 pre-built templates with 👁️ preview modals showing YAML rules\n'+
    '• Workflow Composer: Interactive pipeline builder — select Skills from library, chain with arrows, deploy as workflow\n'+
    '• Skill Ecosystem: Community marketplace with "Created by" attribution\n'+
    '• Analytics Dashboard: Real-time logging of every intent evaluation\n'+
    '• Health Monitor: Conflict detection and stale skill identification\n'+
    '• API Console: Developer integration with REST endpoint examples',
    40,165,640,230,12);

  // ===== SLIDE 10: USER JOURNEYS & MVP =====
  var s10=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s10);
  at(s10,'10. MVP: 9 Interactive User Journeys');
  var jn=[
    ['Marcus (Engineer)','Types: "write a weekly status report"\nICR detects repetition and offers to create a reusable Skill. Shows comparison card with token savings.\nOutcome: Creates "Weekly Report" Skill.',GR],
    ['Aisha (Eng Manager)','Opens Workflow Composer. Chains Security Reviewer → API Doc Writer → PR Description Writer.\nClicks Deploy. Pipeline card appears below.\nOutcome: Saves 3,100 tokens per PR.',B],
    ['Raj (Sr. Architect)','Clicks 👁️ preview on DB Schema template. Reads Prisma rules in modal. Clicks "Use Template".\nDeploys to team via Ecosystem.\nOutcome: 100% team adoption.',RD]
  ];
  for(var j=0;j<jn.length;j++){var jy=60+(j*105);ac(s10,30,jy,660,95,'#2d3436');
    var js=s10.insertShape(SlidesApp.ShapeType.RECTANGLE,30,jy,8,95);js.getFill().setSolidFill(jn[j][2]);js.getBorder().setTransparent();
    ab(s10,jn[j][0]+'\n'+jn[j][1],50,jy+8,625,80,11);
  }
  sn(s10,'All journeys are fully interactive in the live prototype with real-time analytics integration.');

  // ===== SLIDE 11: METRICS (KPI TREE) =====
  var s11=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s11);
  at(s11,'11. Metrics Framework (KPI Tree)');
  ac(s11,180,58,360,40,'#b71c1c');
  ab(s11,'⭐ NSM: Skill Adoption Rate — % users with ≥1 active Skill in 30 days',190,62,340,32,11);
  ac(s11,40,115,310,65,B);
  ab(s11,'L1 Growth Metrics:\n• Workflows deployed per week\n• Monthly token expenditure saved ($)',50,118,290,58,11);
  ac(s11,370,115,310,65,B);
  ab(s11,'L1 Activation Metrics:\n• Skills created per user per month\n• Scaffold template acceptance rate',380,118,290,58,11);
  ac(s11,40,195,310,65,'#2d3436');
  ab(s11,'L2 Engagement Metrics:\n• Time-to-first-Skill activation\n• ICR routing accuracy (% correct path)',50,198,290,58,11);
  ac(s11,370,195,310,65,'#2d3436');
  ab(s11,'L2 Retention Metrics:\n• Weekly active Skill users (WAU)\n• Ecosystem install rate per Skill',380,198,290,58,11);
  ac(s11,100,278,520,55,'#4a148c');
  ab(s11,'🛡️ Guardrail Metrics:\n• Output quality (thumbs ↑/↓ ratio > 80%) • Routing override rate < 15%\n• Token budget breach alerts < 5% of teams • Skill staleness rate < 10%',110,282,500,48,11);
  sn(s11,'KPI tree follows NSM → L1 (Growth + Activation) → L2 (Engagement + Retention) → Guardrails framework.');

  // ===== SLIDE 12: BUSINESS MODEL =====
  var s12=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s12);
  at(s12,'12. Business Model & Revenue');
  ac(s12,20,60,220,130,'#2d3436');
  ab(s12,'🆓 Free Tier\n\nBasic ICR routing\n3 Skills/month\nCommunity templates\nNo analytics',30,65,200,120,11);
  ac(s12,250,60,220,130,B);
  ab(s12,'⭐ Pro — $20/mo\n\nUnlimited Skills\nScaffolder + Ecosystem\nPersonal analytics\nTemplate previews',260,65,200,120,11);
  ac(s12,480,60,220,130,'#00695c');
  ab(s12,'🏢 Enterprise\n\nHealth Monitor + FinOps\nAPI Console + RBAC\nTeam analytics + SLA\nCustom workflows',490,65,200,120,11);
  ln(s12,200);
  ab(s12,'Growth Strategy (PLG — Product-Led Growth):\n\n'+
    '• Acquisition: Free tier drives adoption via ICR routing value.\n'+
    '• Activation: First Skill creation within 48 hours via Scaffolder nudges.\n'+
    '• Revenue: Pro conversion driven by token savings proof (dashboard shows exact $ saved).\n'+
    '• Expansion: Enterprise upsell via team analytics and governance features.\n\n'+
    'Distribution Channels:\n'+
    '• L1: Native integration in Claude.ai sidebar.\n'+
    '• L2: Anthropic API marketplace listing.\n'+
    '• L3: Partner channel — consulting firms and system integrators.',
    40,210,640,180,11);

  // ===== SLIDE 13: RISK MITIGATION =====
  var s13=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s13);
  at(s13,'13. Risk Analysis & Mitigation');
  var risks=[
    ['Low Adoption Risk','Users ignore ICR recommendations and stick to simple prompts.','Show exact token/time savings upfront in comparison cards. Survey shows 85% switch when shown data.','#b71c1c'],
    ['Trust Deficit Risk','Users do not trust AI-generated Skill templates.','Transparent 👁️ preview modals show exact rules before execution. Users validate before committing.','#e67e22'],
    ['Ecosystem Decay Risk','Shared Skill library becomes bloated with stale, conflicting Skills.','Health Monitor auto-detects conflicts and archives Skills unused for 90 days. Maintains library hygiene.','#2980b9'],
    ['Cost Prediction Risk','Token estimates are inaccurate, eroding user trust.','Regression model calibrated weekly on anonymized API logs. Target: ±20% accuracy at P95.','#8e44ad']
  ];
  for(var ri=0;ri<risks.length;ri++){var ry=60+(ri*82);ac(s13,30,ry,660,75,'#2d3436');
    var rs=s13.insertShape(SlidesApp.ShapeType.RECTANGLE,30,ry,8,75);rs.getFill().setSolidFill(risks[ri][3]);rs.getBorder().setTransparent();
    ab(s13,risks[ri][0]+'\nThreat: '+risks[ri][1]+'\nMitigation: '+risks[ri][2],50,ry+5,625,65,10);
  }

  // ===== SLIDE 14: DEMO & PROTOTYPE =====
  var s14=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s14);
  at(s14,'14. Live Prototype & Demo');
  ab(s14,'The ICR platform is a fully functional, interactive prototype built with vanilla HTML/CSS/JS.\nNo backend required — opens directly in any modern browser.',40,55,640,40,12);
  var demos=[
    ['🎯 Routing Playground','Type any of 6 trigger prompts.\nWatch the ICR chatbot simulate\nmulti-step Skill creation dialogues.'],
    ['🏗️ Skill Scaffolder','Click 👁️ to preview 6 templates.\nAuto-scaffold from detected patterns.\nDeploy directly to the Ecosystem.'],
    ['🔗 Workflow Composer','Select Skills from the library.\nChain them into automated pipelines.\nDeploy and see active workflow cards.']
  ];
  for(var d=0;d<demos.length;d++){var dx=20+(d*235);ac(s14,dx,105,225,170,'#2d3436');
    var ds=s14.insertShape(SlidesApp.ShapeType.RECTANGLE,dx,105,225,5);ds.getFill().setSolidFill(GR);ds.getBorder().setTransparent();
    ab(s14,demos[d][0]+'\n\n'+demos[d][1],dx+10,115,205,150,12);
  }
  ac(s14,30,295,660,55,B);
  ab(s14,'📂 Project Files: unified-icr/index.html | app.js | style.css\n📄 Architecture: claude_skills_architecture.md (872 lines) | Test Plan: icr_test_plan.md',40,300,640,45,12);

  // ===== SLIDE 15: THANK YOU =====
  var s15=p.appendSlide(SlidesApp.PredefinedLayout.BLANK); ss(s15);
  s15.insertShape(SlidesApp.ShapeType.RECTANGLE,0,185,720,4).getFill().setSolidFill(G);
  var ty=s15.insertTextBox('Thank You',200,100,320,60);
  ty.getText().getTextStyle().setFontSize(40).setBold(true).setForegroundColor(W).setFontFamily('Montserrat');
  var tq=s15.insertTextBox('Questions?',260,160,200,30);
  tq.getText().getTextStyle().setFontSize(18).setForegroundColor(G).setFontFamily('Open Sans');
  ab(s15,'Key Takeaways:\n\n'+
    '• Real problem validated by primary research (n=7, 86% face decision fatigue)\n'+
    '• No competitor offers an AI-native routing intelligence layer\n'+
    '• Built a fully interactive 7-module prototype with 9 user journeys\n'+
    '• Clear monetization path: Free → Pro ($20/mo) → Enterprise',
    140,210,440,160,14);

  Logger.log('15-slide presentation created! Check Google Drive.');
}
