# Claude Skills: Intelligent Capability Router (ICR) — Full Product Architecture

> **Product**: Intelligent Capability Router for Claude Skills  
> **Role**: Product Manager, Growth Team @ Anthropic  
> **Date**: April 2026

> **TL;DR**: Claude's expansion into Skills, Agents, and Workflows has created a paradox — more power, but more confusion. 60% of users default to simple prompting because they can't confidently choose between capabilities. This document proposes the **Intelligent Capability Router (ICR)** — a meta-cognitive AI layer where Claude itself recommends *how* to be used. The ICR analyzes user intent in real-time, predicts cost/quality/latency tradeoffs, and auto-scaffolds Skills from repeated patterns. Target: 4.8-7.2M "Capable but Uncertain" users, with projected $30-50M ARR upside from increased advanced feature adoption.

---

## 1. Problem Statement

As Claude evolves beyond simple prompting into Skills, Agents, and Workflows, users face **decision paralysis** — not about *what* Claude can do, but *how* to use it effectively. Users waste tokens through trial-and-error, fail to adopt advanced capabilities, and cannot predict cost/quality/latency tradeoffs.

This problem is structural, not educational. It stems from three root causes:

1. **Cognitive Overload**: With 5+ capability modes (simple prompt, Skill, Agent, Workflow, MCP tool), every interaction now begins with an implicit multi-option evaluation. Per Hick's Law, this logarithmically increases decision time and mental fatigue.

2. **Invisible Tradeoffs**: Users cannot see the cost/quality/latency implications of their capability choice *before* committing. They learn through expensive trial-and-error — burning tokens on suboptimal paths they could have avoided.

3. **No Feedback Loop**: Even when users stumble onto the right capability, there's no mechanism to reinforce that choice or generalize it to future tasks. Good decisions don't compound; each session starts from zero.

The result: **advanced capabilities that Anthropic invested heavily in building go underutilized**, creating a lose-lose — users get worse outcomes, Anthropic sees lower feature adoption and higher churn risk.

---

## 2. Hypothesis

**H1**: >60% of Claude users default to simple prompting even when a Skill or Workflow would yield better results — because they lack confidence in selecting the right capability.

**H2**: Users who receive proactive, contextual guidance on capability selection will show 2-3x higher adoption of advanced features and 30%+ reduction in wasted tokens.

**H3**: An AI-native "meta-routing" layer — where Claude itself recommends *how* to be used — will outperform static documentation or browsing-based discovery.

### Market Landscape — Deep Competitive Analysis (April 2026)

| Platform | Custom AI Approach | Routing/Selection Method | Key Gap | Threat Level |
|---|---|---|---|---|
| **OpenAI GPTs + GPT Store** | No-code builder, marketplace with 3M+ GPTs | Manual browsing; category-based discovery; no intelligent routing | Store plagued by quality issues, spam, and "what am I searching for?" problem. Users can't distinguish high-quality GPTs from low-effort ones. No guidance on GPT vs raw ChatGPT | **Medium** |
| **Google Gemini Gems + Opal** | Persistent expert personas, workspace-integrated, Opal visual workflow builder | Gems are manually selected; Opal workflows are manually created via natural language | Locked to Google ecosystem. No cross-platform portability. No recommendation on Gem vs raw Gemini vs Opal workflow. Multi-agent collaboration is powerful but setup-heavy | **High** |
| **Microsoft Copilot Studio** | Declarative agents, plugins, custom actions with rule-based topic routing | Rule-based routing via "topics" and trigger phrases; manual orchestration | Routing is deterministic (if-then), not intelligent. Requires explicit configuration of every routing path. Cannot adapt to novel intents | **Medium** |
| **Notion Custom Agents** | Autonomous event-driven agents, cross-tool connectivity (Slack, Calendar, Mail) | Manual agent creation; trigger-based execution; no intent-based routing | Agents are powerful but require significant setup. No recommendation layer. Usage-based pricing ($10/1K credits) adds cost uncertainty | **Low** |
| **Amazon Q Business** | Enterprise assistant with 40+ data connectors and action plugins | Data-source-based routing; routes to correct enterprise app via plugin matching | Routes based on *where data lives*, not *what the user intends to do*. No reasoning about capability modality. Enterprise-only | **Low** |
| **Claude Skills (Current)** | Markdown-based, portable, open-standard Skills with progressive disclosure architecture | **None** — user must manually decide between prompt, Skill, Agent, or Workflow | Full capability stack exists but no intelligent layer to guide selection | **N/A** — this is the problem we're solving |

**Competitive Insight**: The industry is converging on a common pattern — every platform is building *more* capability modes while simultaneously neglecting the selection problem. The result is an industry-wide "paradox of choice" where more power leads to less adoption. No major platform offers an AI-native decision layer that helps users choose *between* capabilities. Everyone assumes users know what they want. This is the whitespace.

### Why Now: The Convergence Window

Four forces are converging in Q2 2026 that make this the right moment for the ICR:

**1. The Capability Explosion Has Outpaced User Understanding**
Claude Skills launched in October 2025. In 6 months, the ecosystem has grown to include Skills, Agents, Workflows, MCP integrations, and code execution — but user education has been linear while capability growth has been exponential. The gap between "what Claude can do" and "what users know how to do" is widening.

**2. "AI Brain Fry" Is Now a Documented Phenomenon**
Research from George Mason University (2026) has documented "AI-induced decision fatigue" — mental fog and slower decision-making when users manage multiple AI capabilities simultaneously. This is not hypothetical — it is measured and published.

**3. Competitors Have Left the Routing Problem Unsolved**
OpenAI's GPT Store struggles with discovery. Google Gems offer no guidance on *when* to use a Gem vs raw Gemini. Notion's Custom Agents require heavy setup with no recommendation layer. The first platform to ship an AI-native routing layer captures a defensible advantage through proprietary training data and user lock-in.

**4. Cognitive Psychology Validates the Approach**
- **Hick's Law**: Decision time increases logarithmically with the number of choices. Claude now offers 5+ capability modes — without routing, every interaction forces cognitive overhead
- **Paradox of Choice** (Barry Schwartz): Excessive options lead to decision paralysis and reduced satisfaction. Users who default to simple prompting aren't lazy — they're rationally avoiding the cognitive cost of evaluating alternatives
- **Progressive Disclosure** (Nielsen): The ICR's confidence-based intervention model directly applies this principle — surfacing complexity only when genuinely helpful

---

## 3. Research Approach

### Primary Research
- **Behavioral Analytics**: Instrument Claude.ai to track capability switching patterns, abandoned skill invocations, prompt-to-skill conversion paths
- **User Interviews (n=30)**: Segment across power users, developers, and knowledge workers. Focus on decision-making moments, not satisfaction
- **Session Replay Analysis**: Review 500+ sessions where users attempted Skills/Workflows to identify friction patterns

### Secondary Research
- **Community Mining**: Reddit r/ClaudeAI, Discord, GitHub Issues — catalog top 20 recurring complaints about capability selection
- **Competitive Teardown**: Deep-dive into OpenAI GPT Store analytics, Gemini Gems adoption curves
- **Token Waste Audit**: Analyze API logs for patterns where users burned >3x expected tokens due to capability mismatch

### Validation Metrics
| Hypothesis | Validation Signal | Target |
|---|---|---|
| H1 | % users never using Skills despite eligibility | >60% confirms |
| H2 | A/B test: guided vs unguided capability selection | 2x adoption lift |
| H3 | Router accuracy vs user self-selection | >80% match rate |

---

## 4. User Segmentation & Personas

### Target Segment: "Capable but Uncertain" Users
- **Not beginners** (they need onboarding, not routing)
- **Not experts** (they already know what to use)
- **The middle 60%** who have used Claude 10+ times, know Skills exist, but default to simple prompting

### Persona 1: "The Pragmatic Developer" — Priya
- **Behavior**: Uses Claude Code daily for coding. Has heard of Skills but finds creating/selecting them overhead. Defaults to long system prompts.
- **Pain**: "I don't know if a Skill will actually save me time or just add complexity"
- **Goal**: Ship code faster without learning a new abstraction layer

### Persona 2: "The Knowledge Worker" — Marcus
- **Behavior**: Uses Claude.ai for reports, research, email drafting. Pro subscriber. Never created a Skill.
- **Pain**: "I keep re-typing the same instructions. I know there's a better way but I don't know where to start"
- **Goal**: Consistent, high-quality outputs without becoming a prompt engineer

### Persona 3: "The Team Lead" — Sarah
- **Behavior**: Manages a team using Claude. Wants standardized outputs. Has tried creating Skills but they "drift" and maintenance is painful.
- **Pain**: "I built 12 Skills and now I don't know which ones are still relevant or conflicting"
- **Goal**: Reliable, maintainable team-wide Claude workflows

### Opportunity Sizing
- Claude Pro/Team subscribers (est. 8-12M users as of Q1 2026)
- "Capable but Uncertain" segment: ~60% = **4.8-7.2M users**
- Revenue at risk from churn due to frustration: est. $15-25M ARR
- Upside from increased API consumption via better routing: est. $30-50M ARR

---

## 5. Solution: The Intelligent Capability Router (ICR)

### Core Concept
An AI-native **meta-layer** that sits between the user's intent and Claude's execution. Instead of users choosing "prompt vs Skill vs Agent vs Workflow," the ICR analyzes their intent in real-time and:

1. **Recommends** the optimal capability path
2. **Explains** why (cost, quality, latency tradeoffs)
3. **Executes** the routing seamlessly if the user accepts
4. **Learns** from outcomes to improve future recommendations

### This is NOT:
- A better UI for browsing Skills
- A search engine for capabilities
- A static decision tree or FAQ

### This IS:
- Claude reasoning about *how to use itself* — a meta-cognitive layer
- An AI system that treats capability selection as a classification + optimization problem

### Alternatives Considered and Rejected

| Alternative | Description | Why Rejected |
|---|---|---|
| **Better Documentation & Tutorials** | Comprehensive guides explaining when to use each capability | **Passive** — requires users to seek help *before* they need it. Research shows <5% of users read documentation proactively. Doesn't solve in-the-moment decision-making |
| **Skills Marketplace with Ratings** | A curated store where users browse, rate, and discover Skills | **Browsing-based** — forces users to know what they're looking for. OpenAI's GPT Store proves this model struggles with the "what am I searching for?" problem |
| **Manual Curation / Editorial Picks** | Anthropic team manually recommends Skills for common use cases | **Doesn't scale** — works for 50 Skills, breaks at 5,000. Requires constant human curation. Not AI-native |
| **Interactive Decision Tree / Wizard** | Step-by-step questionnaire guiding users to the right capability | **Static and fragile** — breaks when new capabilities launch. Adds friction (3-5 clicks before any work happens). Cannot adapt to user history or context |

**Why ICR wins**: It's the only approach that is (a) proactive rather than passive, (b) contextual rather than generic, (c) self-improving rather than manually maintained, and (d) invisible at its best — routing happens without the user even noticing.

---

## 6. Feature Prioritization (ICE Scoring)

| # | Feature | Impact | Confidence | Ease | ICE | Phase |
|---|---|---|---|---|---|---|
| F1 | **Intent Analyzer** — Classify user input into capability recommendation | 10 | 9 | 7 | 630 | **MVP** |
| F2 | **Cost-Quality Predictor** — Show estimated tokens, quality, latency per path | 9 | 8 | 6 | 432 | **MVP** |
| F3 | **One-Click Skill Scaffolding** — Auto-generate a Skill from repeated prompt patterns | 9 | 7 | 5 | 315 | **MVP** |
| F4 | **Skill Health Monitor** — Detect stale/conflicting skills, suggest consolidation | 8 | 7 | 5 | 280 | V2 |
| F5 | **Workflow Composer** — Chain Skills into multi-step workflows with visual preview | 8 | 6 | 4 | 192 | V2 |
| F6 | **Team Skill Analytics** — Dashboard showing skill usage, effectiveness, token ROI | 7 | 7 | 4 | 196 | V2 |
| F7 | **Adaptive Learning Loop** — Router improves from accept/reject signals | 9 | 6 | 3 | 162 | V3 |

### MVP Rationale
**F1 + F2 + F3** form the MVP because they address the complete decision cycle:
- F1 solves "which capability?" 
- F2 solves "what will it cost me?"
- F3 solves "how do I get started?"

### Bonus Features (Creative Delighters)

**Token Budget Mode**: Users set a monthly token budget, and the ICR optimizes *every* routing decision within that constraint. Like a financial advisor for AI spending. Turns a cost concern into a feature — Anthropic helps users spend *less* per interaction while retaining them *longer*.

**Decision Journal**: A lightweight log of every routing decision — what was recommended, what the user chose, and the actual outcome. "In the last 30 days, ICR recommended Skills 23 times. You accepted 18 (78%). Those 18 uses saved ~14,400 tokens vs simple prompting." Builds trust through transparency and creates a self-reinforcing adoption loop.

---

## 7. MVP System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INPUT LAYER                      │
│   Claude.ai  │  Claude Code  │  API  │  Mobile          │
└──────────┬──────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│              INTENT ANALYSIS ENGINE                      │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Task     │  │ Complexity   │  │ Pattern           │  │
│  │ Classifier│  │ Estimator    │  │ Matcher           │  │
│  │ (what)   │  │ (how hard)   │  │ (seen before?)    │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
│       └───────────┬────┘                   │             │
│                   ▼                        │             │
│         ┌─────────────────┐                │             │
│         │  Intent Vector  │◄───────────────┘             │
│         └────────┬────────┘                              │
└──────────────────┼───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              CAPABILITY ROUTING ENGINE                    │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │              Decision Matrix                       │   │
│  │                                                    │   │
│  │  Intent Vector ──► Match against:                  │   │
│  │    • Simple Prompt (baseline)                      │   │
│  │    • Existing Skills (user's library)              │   │
│  │    • Community Skills (marketplace)                │   │
│  │    • Agent Mode (autonomous execution)             │   │
│  │    • Workflow (multi-step orchestration)            │   │
│  │                                                    │   │
│  │  Output: Ranked recommendations with scores        │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │         Cost-Quality-Latency Predictor             │   │
│  │                                                    │   │
│  │  For each recommendation, estimate:                │   │
│  │    • Token cost (input + output)                   │   │
│  │    • Expected quality score (0-100)                │   │
│  │    • Estimated latency                             │   │
│  │    • Reliability/consistency rating                │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│            RECOMMENDATION PRESENTATION                   │
│                                                          │
│  "I recommend using your 'API Doc Writer' Skill for     │
│   this task. Estimated: ~2,400 tokens, high quality.     │
│   Alternative: simple prompt (~800 tokens, medium        │
│   quality). Would you like me to proceed with the Skill?"│
│                                                          │
│   [Use Skill]  [Use Simple Prompt]  [Show More Options]  │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              FEEDBACK & LEARNING LOOP                    │
│                                                          │
│  • Did user accept recommendation? (accept/reject)       │
│  • Did user complete task successfully? (outcome)        │
│  • Actual tokens consumed vs predicted                   │
│  • User satisfaction signal (thumbs up/down)             │
│                                                          │
│  ──► Feed back into Intent Analyzer weights              │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User types message
       │
       ▼
[1] PRE-FLIGHT ANALYSIS (< 100ms overhead)
    ├── Extract: task type, domain, complexity signals
    ├── Check: user's skill library for matches
    └── Check: recent conversation patterns
       │
       ▼
[2] ROUTING DECISION
    ├── Score each capability path (0-100)
    ├── Calculate cost/quality/latency per path
    └── Apply user preference weights
       │
       ▼
[3] CONFIDENCE CHECK
    ├── If confidence > 85%: Show inline recommendation
    ├── If confidence 50-85%: Show comparison card
    └── If confidence < 50%: Execute as simple prompt (no interruption)
       │
       ▼
[4] EXECUTION
    ├── Route to selected capability
    ├── Log: routing decision, actual performance
    └── Update user preference model
       │
       ▼
[5] POST-EXECUTION
    ├── Compare predicted vs actual tokens
    ├── Capture implicit quality signal
    └── Detect: "should this become a Skill?" pattern
```

### Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Router model | Haiku 4.5 (lightweight) | Must add <100ms latency; Haiku handles classification well at 1/5th cost |
| Skill matching | Embedding similarity + metadata | Faster than full LLM reasoning; YAML frontmatter provides structured signals |
| Pattern detection | Sliding window over last 20 conversations | Balance between accuracy and privacy; no long-term storage of prompts |
| Cost prediction | Historical token distribution per task-type | Regression model trained on anonymized API logs |

---

## 8. Skill Auto-Scaffolding (F3)

```
[Pattern Detection]
  User has sent 3+ similar prompts in 7 days
  (e.g., "Write a PR description for..." repeated)
       │
       ▼
[Skill Candidate Generation]
  Claude analyzes the common pattern:
  - Fixed instructions (always present)
  - Variable inputs (change each time)
  - Consistent output format
       │
       ▼
[Auto-Draft Skill]
  Generate SKILL.md with:
  - name: "PR Description Writer"
  - description: "Generates PR descriptions from diff summaries"
  - instructions: extracted from repeated patterns
  - constraints: inferred from user corrections
       │
       ▼
[User Review]
  "I noticed you write PR descriptions frequently.
   I've drafted a Skill for this. Want to review it?"
  
  [Accept & Save]  [Edit First]  [Dismiss]
```

---

## 9. Handling Uncertainty: Edge Cases in Routing

| Edge Case | Scenario | ICR Behavior | Rationale |
|---|---|---|---|
| **Ambiguous Intent** | User types "help me with my project" — too vague | Execute as simple prompt. Do NOT show a recommendation. Ask a clarifying follow-up naturally | Interrupting with a recommendation on a vague prompt feels like clippy-style annoyance |
| **Novel Task** | Task type the router has never encountered | Route to simple prompting silently. Log the intent vector for future training | Cold-start gracefully: admit uncertainty by defaulting to the safest option |
| **Multi-Intent** | User wants to do 3 things in one message | Decompose into sub-intents. Recommend chaining: "I can handle this as 3 steps — use Skill A for review, Skill B for docs, simple prompting for the PR" | Shows ICR intelligence by reasoning about composition |
| **Conflicting Skills** | Two Skills match with similar confidence | Surface the conflict explicitly: "I found 2 Skills that could work. Here's how they differ..." Let user choose | Transparency over guessing — builds trust |
| **User Override** | User explicitly picks a "suboptimal" path | Respect the choice completely. Do NOT re-suggest for this task. Log the override for learning | Autonomy is sacred. The ICR advises, never overrides |
| **Stale Skill Match** | Best-matching Skill hasn't been used in 60+ days | Recommend with a caveat: "Your 'Budget Report' Skill matches, but it hasn't been used since February. Want to review it first?" | Prevents bad outcomes from outdated instructions |
| **Cross-Platform Context** | User starts in Claude.ai, continues in Claude Code | Carry over the routing context. If a Skill was recommended on web, auto-suggest the same in Code | Seamless cross-platform experience |

### Fallback Hierarchy
```
When ICR confidence < 50%:
  Priority 1: Execute as simple prompt (zero friction)
  Priority 2: After completion, show passive hint:
              "Tip: Tasks like this often work well as Skills."
  Priority 3: Log unroutable intent for batch analysis
              → feeds into monthly Skill gap identification
```

---

## 10. Wireframes: Key UI Screens

### Screen 1: Inline Recommendation Nudge
```
┌─────────────────────────────────────────────────────────────┐
│  Claude.ai Chat Interface                                    │
│                                                              │
│  [User]: "Write a weekly status report for my engineering    │
│   team covering sprint progress, blockers, and priorities"   │
│                                                              │
│  ┌─── ICR Recommendation (subtle, non-blocking) ──────────┐ │
│  │ 💡 Similar reports requested 4 times this month.        │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐                     │ │
│  │  │ ▶ Create a   │  │   Just reply │                     │ │
│  │  │   Skill      │  │   this time  │                     │ │
│  │  └──────────────┘  └──────────────┘                     │ │
│  │  Estimated savings: ~1,200 tokens/use                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Claude's response appears below regardless of choice]      │
└─────────────────────────────────────────────────────────────┘

Design: Non-blocking; response generates regardless; disappears in 10s if ignored
```

### Screen 2: Capability Comparison Card
```
┌─────────────────────────────────────────────────────────────┐
│  "I see a few ways to handle this. Here's the tradeoff:"    │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │ 📝 Simple Prompt    │  │ ⚡ "Weekly Report"   │           │
│  │                     │  │     Skill (NEW)      │           │
│  │ Tokens: ~2,100      │  │ Tokens: ~900         │           │
│  │ Quality: ●●●○○      │  │ Quality: ●●●●●       │           │
│  │ Consistency: Low     │  │ Consistency: High    │           │
│  │ Speed: ~12s          │  │ Speed: ~8s           │           │
│  │                     │  │                      │           │
│  │ Good for one-off     │  │ ✦ Remembers format   │           │
│  │ requests             │  │ ✦ Knows your team    │           │
│  │                     │  │ ✦ Reusable weekly     │           │
│  │  [ Use This ]        │  │  [ Use This ] ★      │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                              │
│  ★ = ICR recommended                                         │
│  [Show more options ▾]  [Don't show comparisons for this]   │
└─────────────────────────────────────────────────────────────┘

Design: Side-by-side; quality as dot-scale; recommended option marked but not forced
```

### Screen 3: Skill Auto-Scaffolding Review
```
┌─────────────────────────────────────────────────────────────┐
│  "I drafted this Skill from your last 4 similar prompts:"   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ---                                                    │  │
│  │  name: "Weekly Status Report"                           │  │
│  │  description: "Generates formatted weekly status        │  │
│  │    reports for engineering teams"                        │  │
│  │  ---                                                    │  │
│  │                                                         │  │
│  │  ## Instructions                                        │  │
│  │  1. Sprint progress (% complete, key deliverables)      │  │
│  │  2. Blockers and risks                                  │  │
│  │  3. Next week's priorities                              │  │
│  │                                                         │  │
│  │  ## Format                                              │  │
│  │  - Markdown headers for each section                    │  │
│  │  - Team members: [extracted list]                       │  │
│  │  - Keep to ~500 words                                   │  │
│  │                                                         │  │
│  │  📝 [Edit in place]                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Sources: Conversations on Apr 7, 14, 21, 28                │
│  Impact: Save ~1,200 tokens and ~4s per use                 │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌─────────┐               │
│  │ ✓ Accept │  │ ✎ Edit First │  │ ✕ Skip  │               │
│  └──────────┘  └──────────────┘  └─────────┘               │
└─────────────────────────────────────────────────────────────┘

Design: Shows actual SKILL.md content; full in-place editing; source transparency
```

---

## 11. User Journey Maps

### Journey 1: Marcus (Knowledge Worker)


```
STAGE 1: AWARENESS (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: Marcus types: "Write a weekly status report for my engineering team..."

What happens: Claude responds:
  "I notice you've asked for similar reports 4 times this month. 
   Want me to create a reusable Skill that remembers your format 
   and team names? It would save ~1,200 tokens per use."

Marcus: "Oh, that's actually useful." → Clicks "Tell me more"
Emotion: Curious → Interested

STAGE 2: EVALUATION (30 seconds later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude shows a comparison card:
  ┌─────────────────────────────────────────────┐
  │  Option A: Simple Prompt                     │
  │  Tokens: ~2,100  Quality: Medium  Time: 12s  │
  │                                               │
  │  Option B: "Weekly Report" Skill (NEW)        │
  │  Tokens: ~900   Quality: High    Time: 8s     │
  │  ✦ Remembers your team structure               │
  │  ✦ Consistent formatting every time            │
  └─────────────────────────────────────────────┘

Marcus: "The token savings are real." → Clicks "Create Skill"
Emotion: Interested → Convinced

STAGE 3: ACTIVATION (2 minutes later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude auto-scaffolds the Skill from Marcus's past 4 prompts.
Marcus: "It already knows my format!" → Accepts with minor edit
Emotion: Convinced → Delighted

STAGE 4: REPEATED USE (Day 3-30)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next time: Claude auto-suggests "Use your 'Weekly Report' Skill? ▶"
ICR notices other patterns → suggests more Skills
Emotion: Delighted → Dependent (positive lock-in)

STAGE 5: EXPANSION (Day 30+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Marcus has 5 active Skills. ICR suggests chaining them into Workflows.
Marcus shares Skills with team → teammates convert.
Emotion: Dependent → Evangelist
```

### Journey 2: Priya (Pragmatic Developer)

```
STAGE 1: SKEPTICISM (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priya is using Claude Code. She types a long system prompt for security review
(~400 tokens of instructions, 5th time this week).

ICR detects the pattern and adds:
  "I can save this as a 'Security Reviewer' Skill — same quality,
   ~350 fewer tokens each time. Want me to draft it?"

Priya: "Hmm, let me see it first." → Clicks "Preview Skill"
Emotion: Skeptical → Cautiously Curious

STAGE 2: VALIDATION (1 minute later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude shows auto-drafted SKILL.md with extracted review criteria.
Token savings: ~350/use × 20 uses/month = ~7,000 tokens/month saved.

Priya: "It actually captured my criteria correctly." → Saves with minor edit
Emotion: Cautiously Curious → Impressed

STAGE 3: TRUST BUILDING (Day 2-14)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next code review: Claude auto-suggests "Use 'Security Reviewer'? ▶"
Output is consistent. ICR suggests a second Skill for API docs.
Emotion: Impressed → Convinced

STAGE 4: POWER USER (Day 15-30)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priya has 4 coding Skills. Commits them to team's git repo.
ICR suggests chaining Security Review + API Docs into a post-PR Workflow.
Emotion: Convinced → Advocate

STAGE 5: TEAM ADOPTION (Day 30+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Teammates clone her Skills folder. ICR adapts to their patterns.
Priya becomes the team's "Skill curator."
Emotion: Advocate → Internal Champion
```

### Journey 3: Sarah (Team Lead)

```
STAGE 1: FRUSTRATION (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sarah's team has 12 Skills, many stale. Two conflicting "meeting notes" Skills.
ICR detects the conflict and flags:
  "I found 2 Skills for this. They have overlapping instructions but
   different formats. Want me to merge them into one?"

Sarah: "Yes! I didn't even know Jake made one."
Emotion: Frustrated → Relieved

STAGE 2: CLEANUP (Day 1-3)
━━━━━━━━━━━━━━━━━━━━━━━━━━
ICR health audit: 5 active, 3 stale, 2 conflicting, 2 low-effectiveness.
Recommendation: Archive 3, merge 2. Projected savings: ~15,000 tokens/month.

Sarah: "This is the visibility I needed." → Archives stale Skills
Emotion: Relieved → In Control

STAGE 3: STANDARDIZATION (Day 7-14)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Designates 5 "team-approved" Skills. ICR prioritizes these for all members.
New hire onboards → ICR suggests relevant team Skills in first 3 conversations.
Emotion: In Control → Confident

STAGE 4: OPTIMIZATION (Day 30+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team Analytics shows which Skills save the most tokens, which members still
default to prompting, where new Skill opportunities exist.
Sarah uses data in monthly productivity review.
Emotion: Confident → Strategic
```

### Journey 4: David (Data Analyst)

```text
STAGE 1: COMPLEXITY (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: David types: "analyze dataset and find correlations"
He pastes a large CSV and asks for correlation analysis. ICR detects a multi-step data task.

ICR: "This is a complex data task. Instead of a single prompt, I can route this to an 'Automated EDA' Workflow which will write Python, run the code, and visualize the output."
David: "Yes, run the workflow."
Emotion: Overwhelmed → Supported

STAGE 2: AUTOMATION (2 minutes later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Workflow executes: Data Cleaning → Correlation Matrix → Summary.
David: "That saved me 20 minutes of back-and-forth."
Emotion: Supported → Impressed

STAGE 3: PUBLISHING (Day 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━
ICR asks: "I can save this multi-step process as an 'Automated EDA' Workflow for your team."
David: "Looks powerful. Create Workflow."
Emotion: Impressed → Empowered
```

### Journey 5: Elena (UX Designer)

```text
STAGE 1: DISCOVERY (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: Elena types: "convert figma notes to jira tickets"
She tries to write a complex prompt to format her UX notes.

ICR interrupts: "You've converted Figma notes 3 times. Want to create a 'Figma to JIRA' Skill using your preferred ticket format?"
Elena: "That would save hours. Preview Skill."
Emotion: Tedious → Intriguied

STAGE 2: ADOPTION (1 minute later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude shows the drafted skill with Acceptance Criteria format.
Elena: "Perfect format. Accept and Publish."
Emotion: Intriguied → Satisfied

STAGE 3: ECOSYSTEM VALUE (Day 10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Elena's PM uses the Skill from the Ecosystem to convert their own notes.
Elena: "My whole team is writing better tickets now."
Emotion: Satisfied → Multiplier
```

### Journey 6: Alex (DevOps Engineer)

```text
STAGE 1: INEFFICIENCY (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: Alex types: "write a terraform script for aws eks"
He pastes massive AWS architecture docs (~20k tokens).

ICR: "You're including 20,000 tokens of AWS EKS documentation. I can create a 'Terraform EKS Architect' Skill with this documentation permanently attached as a Knowledge Base."
Alex: "Token savings are huge. Preview Skill."
Emotion: Annoyed by limits → Optimistic

STAGE 2: OPTIMIZATION (1 minute later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude shows drafted skill with Knowledge Base attached.
Alex: "Accept and Publish to Team."
Emotion: Optimistic → Efficient

STAGE 3: SCALE (Day 30+)
━━━━━━━━━━━━━━━━━━━━━━━━
The team uses Alex's skill 50 times a month, saving 1 million tokens.
ICR analytics highlights Alex's skill as the highest ROI asset.
Emotion: Efficient → Recognized Leader
```

### Journey 7: Carlos (System Architect) - The Scaffolder Experience

```text
STAGE 1: BLANK CANVAS SYNDROME (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: Carlos navigates to the "Skill Scaffolder" tab. He wants to standardize his team's API documentation but doesn't know how to write a good meta-prompt.

ICR detects his goal: "I see you want to create a Skill. You can either Auto-Scaffold based on a detected pattern (like 'React Type Fixer'), or start from one of our Popular Default Templates."
Carlos: "I'll use the 'API Documentation' default template."
Emotion: Uncertain → Guided

STAGE 2: CUSTOMIZATION (2 minutes later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude loads a best-practice OpenAPI/Swagger spec generator template.
Carlos tweaks it to include his specific company header format.
Carlos: "This is exactly what I needed. It saved me 30 minutes of writing instructions."
Emotion: Guided → Relieved

STAGE 3: STANDARDIZATION (Day 7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Carlos deploys the Skill. His entire backend team starts using the standard template via the Ecosystem.
ICR Analytics show a 100% adoption rate for API doc formatting across 12 engineers.
Emotion: Relieved → Impactful
```

### Journey 8: Aisha (Engineering Manager) - The Workflow Composer

```text
STAGE 1: FRAGMENTED PROCESSES (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: Aisha navigates to the "Workflow Composer" tab. Her team has 7 active Skills, but developers keep forgetting to run them in the correct order for PR reviews.

ICR displays the "Available Skills Library" featuring all her team's deployed Skills.
Aisha: "I need to standardize our PR review pipeline."
Emotion: Overwhelmed by process → Focused

STAGE 2: VISUAL CHAINING (2 minutes later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aisha clicks on Skills from the left panel to add them to her pipeline:
1. Clicks "🔒 Security Reviewer"
2. Clicks "📝 API Doc Writer"
3. Clicks "🔀 PR Description Writer"

The UI visually links them together with arrows in the "Current Workflow Pipeline" dropzone.
Aisha: "That was incredibly intuitive. Deploy Workflow."
Emotion: Focused → Empowered

STAGE 3: ORCHESTRATION (Day 7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aisha's team now runs the single "Post-PR Review Pipeline" instead of 3 separate prompts.
ICR Analytics show a massive drop in manual prompt errors and a 3,100 token saving per PR.
Emotion: Empowered → Orchestrator
```

### Journey 9: Raj (Senior Engineer) - Template Inspection

```text
STAGE 1: SKEPTICISM (Day 0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger: Raj is skeptical of using AI-generated templates. He navigates to the "Skill Scaffolder" to see what the "DB Schema Designer" actually does under the hood.

He notices the 👁️ (Preview) icon in the top right corner of the template card and clicks it.
Raj: "Let's see what rules it's actually enforcing."
Emotion: Skeptical → Curious

STAGE 2: VALIDATION (1 minute later)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A modal overlay appears displaying the exact YAML/Markdown contents of the Skill.
Raj reads the rules: "- Use relational best practices (1:n, m:n)", "- Add @map for snake_case".
Raj: "Oh, it actually enforces the exact Prisma rules my team uses. This is solid."
He clicks "Use This Template" directly from the modal.
Emotion: Curious → Convinced

STAGE 3: ADOPTION (Day 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Raj scaffolds the template, deploys it to the Ecosystem, and tells his team to start using it for all new backend features.
Emotion: Convinced → Advocate
```

---

## 12. Success Metrics

### North Star Metric
**Skill Adoption Rate**: % of eligible users who create or activate ≥1 Skill within 30 days of first ICR recommendation.

### Leading Metrics (Early Signals)

| Metric | Definition | Target (90 days) |
|---|---|---|
| Recommendation Acceptance Rate | % of ICR suggestions accepted | >35% |
| Skill Creation Rate | New Skills per 1K active users/week | 50+ |
| Intent Classification Accuracy | % routing decisions users agree with | >80% |
| Time-to-First-Skill | Median days from signup to first Skill | <7 days |
| Router Latency Overhead | P95 latency added by ICR | <150ms |

### Lagging Metrics (Business Impact)

| Metric | Definition | Target (6 months) |
|---|---|---|
| Token Efficiency Ratio | Tokens saved via Skills vs prompting | 30%+ reduction |
| Feature Adoption Depth | % users using ≥2 capability types | 40%+ |
| Retention Lift | 30-day retention ICR vs control | +15% |
| NPS Impact | NPS for ICR users vs non-ICR | +10 points |
| Revenue per User | Monthly revenue per ICR user | +20% |

### Guardrail Metrics

| Metric | Threshold |
|---|---|
| Conversation start latency | Must not increase by >200ms |
| Annoyance/dismissal rate | Must stay below 25% |
| False positive routing | Must stay below 15% |

### Current State Baseline (Estimated, Pre-ICR)

| Metric | Estimated Current State | ICR Target |
|---|---|---|
| % Pro users who have created ≥1 Skill | ~12-15% | 40%+ (within 90 days) |
| % eligible users defaulting to simple prompting | ~65-70% | <40% |
| Average tokens wasted per session (capability mismatch) | ~800-1,200 | <400 |
| Retry rate (user re-does same task differently) | ~18-22% of sessions | <10% |
| Average time from signup to first Skill use | ~45-60 days | <7 days |
| User-reported clarity on "when to use what" | ~2.8/5 | 4.0+/5 |

### Metric Conflict Resolution

| Conflict | Resolution |
|---|---|
| Adoption ↑ but Annoyance ↑ | Annoyance is the guardrail — **tighten confidence thresholds** until annoyance drops below 25%, even if it slows adoption |
| Token efficiency ↑ but Revenue/user ↓ | Acceptable short-term if retention improves. Monitor 60-day retention |
| Acceptance ↑ but Quality ↓ | Investigate if router recommends convenient but inferior paths. Weight quality more heavily in decision matrix |

---

## 13. Monetization Plan

### Value-Based Tiering

| Tier | ICR Features | Price |
|---|---|---|
| **Free** | Basic intent hints, 3 auto-scaffolds/month | $0 |
| **Pro** ($20/mo) | Full ICR, unlimited scaffolding, cost predictor | Included |
| **Team** ($30/user/mo) | Team analytics, shared library, workflow composer | Included |
| **API** | Programmatic ICR endpoint, batch optimization | $0.50/1K decisions |

### Unit Economics
- ICR routing cost: ~50 tokens (Haiku) = $0.00025 per decision
- Revenue per Pro conversion: $240/year
- Expected conversion: 1 per ~5K routing decisions → **highly profitable**

---

## 14. Distribution Strategy

### Channel 1: In-Product Viral Loop (Primary)
ICR is embedded in every Claude conversation. First recommendation triggers on 3rd conversation where a pattern is detected. Users share auto-generated Skills → teammates convert.

### Channel 2: Claude Code / Developer Community
ICR detects project type from `.git`, `package.json` → recommends coding-specific Skills. Targets 500K+ Claude Code developers.

### Channel 3: "Skill of the Week" Content Program
Weekly content featuring high-impact Skills discovered from anonymized patterns. "Users who do X saved 40% of tokens with this Skill."

### First 1,000 Clients
1. **Week 1-4**: Internal dogfood at Anthropic
2. **Week 5-8**: Private beta with top 200 API customers
3. **Week 9-12**: Pro subscribers with highest retry rates
4. **Week 13+**: General availability

---

## 15. Risk Factors & Mitigation

| Risk | Severity | Probability | Mitigation |
|---|---|---|---|
| Users find recommendations annoying | High | Medium | Progressive disclosure; 3 dismissals = suppress 30 days |
| Router accuracy too low initially | High | Medium | High confidence threshold (>85%); below = silent execution |
| Latency overhead | High | Low | Haiku routing (<100ms); pre-compute on conversation start |
| Privacy concerns | Medium | Medium | Ephemeral pattern detection; opt-out available; transparency doc |
| Revenue cannibalization | Medium | Low | Monitor total revenue; hypothesis is net-positive |
| Competitors copy approach | Medium | High | First-mover advantage + proprietary training data |
| Skill sprawl | Low | Medium | Health Monitor (V2) for stale/conflicting skill detection |

---

## 16. Implementation Timeline

```
Month 1-2: Foundation
├── Build Intent Analysis Engine (Haiku-based classifier)
├── Build Cost-Quality Predictor (regression on historical data)
├── Instrument Claude.ai for pattern tracking
└── Internal dogfood

Month 3-4: MVP Launch
├── Ship F1 (Intent Analyzer) to 10% of Pro users
├── Ship F2 (Cost Predictor) alongside F1
├── A/B test: ICR vs control group
└── Iterate on confidence thresholds

Month 5-6: Scale & Auto-Scaffolding
├── Ship F3 (Skill Auto-Scaffolding)
├── Expand to 100% of Pro users
├── Launch API endpoint for developers
└── Begin V2 planning (Health Monitor, Workflows)
```

---

## 17. What Makes This AI-Native

1. **Meta-Cognition**: Claude reasons about *how to use itself* — no external taxonomy needed
2. **Self-Improving**: Every accept/reject signal improves routing without human curation
3. **Zero-UI Decision Making**: Best routing decisions are invisible — Claude just uses the right capability
4. **Composable Intelligence**: Skills are living instruction sets Claude adapts based on context

> **The key insight: The best AI product decision is the one the user never has to make.**

---

## 18. Current Build Status (May 2026)

### Prototype Stack
- **Technology:** Vanilla HTML, CSS, JavaScript (no framework dependencies)
- **File:** `unified-icr/index.html`, `unified-icr/app.js`, `unified-icr/style.css`
- **Theme:** Glassmorphism dark theme with gold accents

### Implemented Modules

| Module | Status | Key Features |
|--------|--------|--------------|
| Routing Playground | ✅ Live | Intent evaluation engine, confidence scoring, 9 interactive journey simulations |
| Skill Scaffolder | ✅ Live | Auto-scaffold detection, 6 pre-built templates, 👁️ preview modals with YAML content |
| Workflow Composer | ✅ Live | Interactive pipeline builder, 7-skill library, deploy and active workflow cards |
| Health Monitor | ✅ UI Complete | Conflict detection cards, stale skill warnings, audit trigger |
| Analytics & Journal | ✅ Live | Real-time logging of intent evaluations with dynamic DOM injection |
| Skill Ecosystem | ✅ Live | Marketplace UI, dynamic skill addition from journey completions |
| API Console | ✅ UI Complete | Developer console with REST endpoint documentation |

### Interactive User Journeys (9 Total)

| # | Persona | Trigger | Module Demonstrated |
|---|---------|---------|---------------------|
| 1 | Marcus (Engineer) | "write a weekly status report" | ICR routing + Skill creation |
| 2 | Priya (PM) | "summarize conflicting meeting notes" | Skill scaffolding |
| 3 | Sarah (Team Lead) | "security review of auth module" | Agent + Skill combo routing |
| 4 | David (Data Analyst) | "analyze dataset and find correlations" | Workflow automation |
| 5 | Elena (UX Designer) | "convert figma notes to jira tickets" | Template scaffolding |
| 6 | Alex (DevOps) | "write a terraform script for aws eks" | Knowledge-base Skill |
| 7 | Carlos (System Architect) | Scaffolder tab navigation | Template selection flow |
| 8 | Aisha (Eng Manager) | Workflow Composer tab | Pipeline chaining |
| 9 | Raj (Senior Engineer) | 👁️ preview icon click | Template inspection |

### Scaffolder Templates (6 Pre-Built)

| Template | Content Focus |
|----------|--------------|
| API Documentation | OpenAPI 3.0 spec generation with security definitions |
| Unit Test Generator | Jest/PyTest scaffold with 80%+ coverage rules |
| Release Notes | Jira ticket extraction with customer-facing formatting |
| Security Audit | OWASP Top 10 checklist and vulnerability scanning |
| Code Migration | Python-to-Go translation with idiomatic patterns |
| DB Schema Designer | Prisma schema generation with relational best practices |

