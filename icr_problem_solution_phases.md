# Claude Skills: Problem, Solution & Phase-by-Phase Implementation

> **Document**: ICR Problem Definition, Proposed Solution & Implementation Roadmap  
> **Companion to**: `claude_skills_architecture.md`  
> **Date**: April 2026

---

## Part 1: What's Wrong with Claude Skills Today

### The Core Problem

Claude Skills are technically powerful — markdown-based, portable, composable, and capable of code execution. But **the adoption curve is broken**. The technology works; the human decision-making layer around it does not.

Here's what's happening today:

### Problem 1: The "Which One Do I Use?" Paralysis

Claude now offers 5+ capability modes:

| Capability | What It Does | When to Use It |
|---|---|---|
| **Simple Prompt** | One-shot conversation | Quick questions, brainstorming |
| **Skill** | Reusable instruction set (SKILL.md) | Repeated tasks with consistent format |
| **Agent** | Autonomous multi-step execution | Complex tasks requiring tool use and planning |
| **Workflow** | Chained multi-Skill orchestration | End-to-end processes with multiple stages |
| **MCP Integration** | External tool/data connection | Tasks requiring real-time data or API access |

**The problem**: Users see this table and freeze. There's no guidance *within the product* on which capability fits their current task. Every interaction begins with an implicit, unanswered question: *"Should I just type my prompt, or is there a better way?"*

Per **Hick's Law**, decision time increases logarithmically with the number of choices. With 5+ options and no clear signals, users rationally default to the simplest option — the plain prompt — even when it's suboptimal.

### Problem 2: Invisible Tradeoffs

When a user chooses between a simple prompt and a Skill, they cannot see:

- **Token cost**: A Skill might use 900 tokens vs 2,100 for a plain prompt
- **Quality**: A Skill produces consistent output; a prompt varies every time
- **Latency**: Skills can be faster because they're pre-optimized
- **Reliability**: Skills don't drift across sessions; prompts do

Users discover these tradeoffs only *after* committing — through expensive trial-and-error. There's no "preview" of what each path will cost them.

### Problem 3: No Pattern Recognition

Users often type the same type of prompt repeatedly without realizing it. A developer might write "Review this code for security vulnerabilities" 20 times before it occurs to them that this could be a Skill. Claude has access to this pattern data but does nothing with it.

**There is no mechanism for Claude to say**: *"Hey, you've done this 5 times. Want me to save it as a reusable Skill?"*

### Problem 4: Skill Sprawl and Decay

For users who *do* create Skills, a new problem emerges: maintenance. Sarah's team built 12 Skills over 3 months. Now:

- 3 are stale (haven't been used in 30+ days)
- 2 are conflicting (overlapping instructions, different output formats)
- 2 have low effectiveness (users frequently edit the output)

There's no health monitoring, no conflict detection, no lifecycle management. Skills are created and abandoned — becoming digital clutter that makes the selection problem *worse*.

### Problem 5: No Learning Feedback Loop

Even when a user makes a great capability choice, that decision doesn't compound. Next session, they start from zero. There's no system that says: *"Last time you used your 'Weekly Report' Skill for this type of request and it worked well. Want to use it again?"*

Good decisions are ephemeral. Bad patterns repeat indefinitely.

### The Business Impact

| Impact Area | Consequence |
|---|---|
| **Feature adoption** | ~85-88% of Pro users have never created a Skill |
| **Token waste** | ~800-1,200 tokens wasted per session due to capability mismatch |
| **Retry rate** | ~18-22% of sessions involve users re-doing the same task differently |
| **Time to value** | ~45-60 days from signup to first Skill use (should be <7) |
| **Churn risk** | $15-25M ARR at risk from frustration-driven churn |
| **Revenue ceiling** | $30-50M ARR unrealized from underused advanced features |

---

## Part 2: The Proposed Solution — Intelligent Capability Router (ICR)

### What Is the ICR?

The Intelligent Capability Router is an **AI-native meta-layer** that sits between the user's intent and Claude's execution. Instead of users choosing "prompt vs Skill vs Agent vs Workflow," the ICR:

1. **Analyzes** the user's intent in real-time (what are they trying to do?)
2. **Recommends** the optimal capability path (which mode will work best?)
3. **Predicts** the tradeoffs (tokens, quality, latency for each option)
4. **Scaffolds** new Skills automatically (detects repeated patterns → generates SKILL.md)
5. **Learns** from outcomes (every accept/reject signal improves future routing)

### How It Solves Each Problem

| Problem | ICR Solution | Mechanism |
|---|---|---|
| **"Which one do I use?" paralysis** | ICR classifies intent and recommends the right capability | Haiku-based classifier runs in <100ms, scores each path 0-100 |
| **Invisible tradeoffs** | ICR shows token cost, quality, and latency predictions *before* committing | Cost-Quality-Latency Predictor trained on historical API data |
| **No pattern recognition** | ICR detects repeated prompt patterns and auto-drafts Skills | Sliding window over last 20 conversations; 3+ similar prompts in 7 days triggers scaffolding |
| **Skill sprawl and decay** | ICR monitors Skill health — stale, conflicting, low-effectiveness | Health Monitor scans usage frequency, overlap, and user edit rates |
| **No learning feedback loop** | ICR remembers which routing decisions worked and reinforces them | Accept/reject signals feed back into intent classifier weights |

### The Key Design Principle

**Confidence-based progressive disclosure**:

- **Confidence > 85%**: Show inline recommendation (subtle, non-blocking)
- **Confidence 50-85%**: Show comparison card (side-by-side options with tradeoffs)
- **Confidence < 50%**: Execute as simple prompt silently (no interruption)

This means the ICR **only speaks up when it's genuinely confident it can help**. It never becomes a nagging popup. At its best, the user never even notices the router — Claude just uses the right capability automatically.

### What the ICR is NOT

- ❌ A better UI for browsing Skills (the brief explicitly excludes this)
- ❌ A search engine for capabilities
- ❌ A static decision tree or FAQ wizard
- ❌ A cosmetic enhancement

### What the ICR IS

- ✅ Claude reasoning about *how to use itself* — genuine meta-cognition
- ✅ An AI system that treats capability selection as a classification + optimization problem
- ✅ The first AI platform feature where the AI helps users use the AI better

---

## Part 3: Phase-by-Phase Implementation

### Phase Overview

| Phase | Timeline | Focus | Key Features | Success Gate |
|---|---|---|---|---|
| **Phase 1: Foundation** | Month 1-2 | Build the core routing engine | Intent Analyzer, Cost Predictor, instrumentation | Internal dogfood; >75% classification accuracy |
| **Phase 2: MVP Launch** | Month 3-4 | Ship to real users; validate hypotheses | F1 + F2 live to 10% of Pro users; A/B testing | >35% recommendation acceptance rate |
| **Phase 3: Auto-Scaffolding** | Month 5-6 | Enable zero-effort Skill creation | F3 (pattern detection → Skill generation); 100% rollout | 50+ new Skills per 1K users/week |
| **Phase 4: Intelligence** | Month 7-9 | Team features + adaptive learning | Health Monitor, Team Analytics, Learning Loop | Skill adoption >40% of eligible users |
| **Phase 5: Platform** | Month 10-12 | Ecosystem + Workflow orchestration | Workflow Composer, API endpoint, marketplace | Revenue per user +20% |

---

### Phase 1: Foundation (Month 1-2)

**Goal**: Build the core routing engine and validate that intent classification works.

#### What We're Building

**1. Intent Analysis Engine**
- A Haiku 4.5-based lightweight classifier that processes every user message
- Extracts three signals: task type (what), complexity (how hard), pattern match (seen before?)
- Produces an "intent vector" that maps to capability recommendations
- Must add <100ms latency — this is non-negotiable for user experience

**2. Cost-Quality-Latency Predictor**
- A regression model trained on anonymized historical API logs
- For any given intent, predicts: estimated token consumption, expected quality score (0-100), estimated response time, and consistency/reliability rating
- Predictions are shown *per capability path* — so users can compare "simple prompt: ~2,100 tokens, medium quality" vs "Skill: ~900 tokens, high quality"

**3. Instrumentation Layer**
- Instrument Claude.ai, Claude Code, and the API to track:
  - Capability switching patterns (did user start with a Skill, then switch to prompting?)
  - Abandoned skill invocations (user selected a Skill, then backed out)
  - Prompt-to-skill conversion paths (did repeated prompts eventually become a Skill?)
  - Token consumption per capability mode per task type

**4. Internal Dogfooding**
- Deploy to all Anthropic employees for 4 weeks
- Collect qualitative feedback on recommendation relevance, timing, and annoyance level
- Use internal data to calibrate confidence thresholds (what score = "show recommendation" vs "stay silent"?)

#### Key Technical Decisions

| Decision | Choice | Why |
|---|---|---|
| Router model | Haiku 4.5 | Must be fast (<100ms) and cheap ($0.00025/decision). Haiku handles classification at 1/5th the cost of Sonnet |
| Skill matching | Embedding similarity + YAML metadata | Faster than full LLM reasoning. YAML frontmatter (name, description) provides structured signals for matching |
| Pattern detection | Sliding window over last 20 conversations | Balances accuracy with privacy. No long-term storage of actual prompts — only abstract pattern signatures |
| Cost prediction | Historical token distribution per task-type | Regression model on anonymized API logs. Updated weekly as usage patterns evolve |

#### Phase 1 Exit Criteria
- [ ] Intent classifier achieves >75% accuracy on internal test set
- [ ] Cost predictor is within ±20% of actual token consumption
- [ ] Latency overhead is <100ms at P95
- [ ] Internal team feedback: >70% find recommendations useful

---

### Phase 2: MVP Launch (Month 3-4)

**Goal**: Ship F1 (Intent Analyzer) and F2 (Cost Predictor) to real users and run the first A/B test.

#### What We're Building

**1. Recommendation UI (3 modes)**

- **Inline Nudge** (confidence >85%): A subtle, non-blocking suggestion that appears above Claude's response. Example: "💡 I recommend using your 'API Doc Writer' Skill for this. Estimated: ~2,400 tokens, high quality." Two buttons: [Use Skill] [Just Reply This Time]. Disappears in 10 seconds if ignored.

- **Comparison Card** (confidence 50-85%): A side-by-side card showing 2-3 capability options with token cost, quality rating (dot-scale), speed, and key benefits. User picks one. ICR recommendation is marked with ★ but not forced.

- **Silent Mode** (confidence <50%): No recommendation shown. Claude executes as simple prompt. Intent is logged for future training.

**2. A/B Test Infrastructure**
- **Control group** (50%): Normal Claude experience, no ICR
- **Treatment group** (50%): ICR enabled with all 3 recommendation modes
- Run for 4 weeks minimum to capture behavioral patterns
- Primary metric: Recommendation acceptance rate (target: >35%)
- Secondary metrics: Skill creation rate, token efficiency, user retention

**3. Dismissal Intelligence**
- Track dismissal patterns per user
- After 3 dismissals of the same recommendation type → suppress that type for 30 days
- This prevents the "Clippy effect" — the system learns when it's being unhelpful
- Annoyance/dismissal rate must stay below 25% (guardrail metric)

**4. Rollout Plan**
- Week 1-2: Ship to 10% of Pro users (highest-engagement cohort)
- Week 3-4: Expand to 25% if acceptance rate >30% and annoyance <20%
- Iterate on confidence thresholds based on real data

#### Phase 2 Exit Criteria
- [ ] Recommendation acceptance rate >35%
- [ ] Annoyance/dismissal rate <25%
- [ ] At least one statistically significant metric improvement vs control
- [ ] Latency overhead <150ms at P95 in production

---

### Phase 3: Auto-Scaffolding (Month 5-6)

**Goal**: Enable zero-effort Skill creation by detecting repeated patterns and auto-generating SKILL.md files.

#### What We're Building

**1. Pattern Detection Engine**
- Monitors the user's last 20 conversations using abstract pattern signatures (not raw prompts — privacy-first)
- Triggers when: 3+ similar prompts detected within a 7-day window
- "Similar" is defined by: same task type, same output format, overlapping domain keywords
- Example trigger: User typed "Write a PR description for..." with similar structure 4 times this week

**2. Skill Candidate Generator**
- When a pattern is detected, Claude analyzes the common elements:
  - **Fixed instructions** (always present across instances)
  - **Variable inputs** (change each time — these become parameters)
  - **Consistent output format** (the structure users expect)
  - **User corrections** (edits users made to Claude's output → become constraints)
- Generates a complete SKILL.md with YAML frontmatter, instructions, and format guidelines

**3. Scaffolding Review UI**
- Shows the user the auto-drafted Skill with full transparency:
  - The actual SKILL.md content (editable in-place)
  - Which conversations it was extracted from (source attribution)
  - Projected impact: "Save ~1,200 tokens and ~4s per use"
- Three actions: [✓ Accept] [✎ Edit First] [✕ Skip]
- If user edits, the edits are fed back as refinement signals for future scaffolding

**4. 100% Pro Rollout**
- Expand ICR (F1 + F2 + F3) to all Pro subscribers
- Launch API endpoint for developers: programmatic ICR access for custom integrations

#### Phase 3 Exit Criteria
- [ ] 50+ new Skills created per 1K active users per week
- [ ] Scaffolded Skills are accepted (with or without edits) >50% of the time
- [ ] Time-to-first-Skill drops from ~45 days to <7 days
- [ ] 100% Pro user rollout with no regression in core metrics

---

### Phase 4: Intelligence (Month 7-9)

**Goal**: Add team-level features and close the learning feedback loop.

#### What We're Building

**1. Skill Health Monitor (F4)**
- Scans each user's (and team's) Skill library on a weekly cadence
- Detects four conditions:
  - **Stale**: Skill not used in 30+ days → suggest archive
  - **Conflicting**: Two Skills with overlapping instructions but different outputs → suggest merge
  - **Low-effectiveness**: Users frequently edit the Skill's output → suggest refinement
  - **Redundant**: Skill that does something a newer, better Skill already handles → suggest consolidation
- Generates a "Skill Health Report" with actionable recommendations

**2. Team Skill Analytics (F6)**
- Dashboard showing:
  - Which Skills are most/least used across the team
  - Token ROI per Skill (tokens saved vs tokens consumed by the Skill instructions)
  - Which team members are still defaulting to simple prompting (opportunity identification)
  - Skill effectiveness scores (based on user edits and satisfaction signals)
- Enables team leads like Sarah to make data-driven decisions about Skill curation

**3. Adaptive Learning Loop (F7)**
- Every user interaction with the ICR generates a training signal:
  - **Accept** = positive reinforcement for that intent → capability mapping
  - **Reject** = negative signal, downweight that recommendation
  - **Override** (user picks a different capability) = strong negative signal + new positive signal
  - **Outcome quality** (thumbs up/down on the final output) = quality signal
- Signals are aggregated (anonymized) and used to retrain the intent classifier monthly
- Over time, the ICR gets smarter without any human curation

**4. Cross-Platform Context Persistence**
- If a user starts a task in Claude.ai and switches to Claude Code, the routing context carries over
- If a Skill was recommended on web, the same Skill is auto-suggested in Code
- Seamless cross-surface experience

#### Phase 4 Exit Criteria
- [ ] Skill adoption reaches 40%+ of eligible users
- [ ] Skill Health Monitor identifies and resolves 80%+ of stale/conflicting Skills
- [ ] Team Analytics is used by >60% of Team plan subscribers
- [ ] Intent classification accuracy reaches >90% (up from >75% in Phase 1)
- [ ] 30-day retention is +15% vs pre-ICR baseline

---

### Phase 5: Platform (Month 10-12)

**Goal**: Transform the ICR from a feature into a platform — enabling Workflow composition and ecosystem growth.

#### What We're Building

**1. Workflow Composer (F5)**
- Enables users to chain multiple Skills into multi-step workflows
- ICR detects when users regularly use Skills in sequence and suggests: "You use 'Security Reviewer' and 'API Doc Writer' back-to-back after every PR. Want to chain them into a single Workflow?"
- Visual preview shows the Workflow as a step sequence before execution
- Workflows are saved as composable, shareable artifacts

**2. Programmatic ICR API**
- Full API endpoint for developers to integrate ICR into their own tools
- Endpoints: `/route` (get recommendation for a given intent), `/predict` (get cost/quality/latency estimates), `/scaffold` (generate a Skill from pattern data)
- Priced at $0.50 per 1,000 decisions
- Enables third-party tools to build on top of the ICR intelligence

**3. Skill Ecosystem Foundations**
- Community Skill sharing (opt-in): users can publish Skills for others to discover
- Skill versioning: track changes to Skills over time, rollback to previous versions
- Skill templates: pre-built starting points for common use cases (code review, meeting notes, report writing)

**4. Advanced Features**
- **Token Budget Mode**: Users set a monthly token budget; ICR optimizes every routing decision to stay within that budget
- **Decision Journal**: A log of all routing decisions with outcomes — "In 30 days, ICR saved you ~14,400 tokens"
- **"What If" Preview**: Before committing, preview a sample output from each capability path

#### Phase 5 Exit Criteria
- [ ] Revenue per user increases by +20%
- [ ] Workflow creation rate: 10+ Workflows per 1K users/week
- [ ] API adoption: 100+ third-party integrations
- [ ] Feature adoption depth: >40% of users using 2+ capability types regularly
- [ ] NPS for ICR users is +10 points vs non-ICR users

---

## Phase Summary: Feature-to-Phase Mapping

| Feature | Phase | Month | ICE Score | Rationale |
|---|---|---|---|---|
| F1: Intent Analyzer | MVP (Phase 1-2) | 1-4 | 630 | Core routing — must ship first |
| F2: Cost-Quality Predictor | MVP (Phase 1-2) | 1-4 | 432 | Tradeoff visibility — differentiator |
| F3: Skill Auto-Scaffolding | Phase 3 | 5-6 | 315 | Zero-effort Skill creation — activation driver |
| F4: Skill Health Monitor | Phase 4 | 7-9 | 280 | Maintenance — prevents Skill decay |
| F5: Workflow Composer | Phase 5 | 10-12 | 192 | Composition — platform play |
| F6: Team Analytics | Phase 4 | 7-9 | 196 | Team adoption — enterprise value |
| F7: Adaptive Learning Loop | Phase 4 | 7-9 | 162 | Self-improvement — long-term moat |

---

## Investment & Expected Returns

| Phase | Investment (Eng Months) | Expected Outcome |
|---|---|---|
| Phase 1-2 | ~8 eng-months | Validate routing concept; 35%+ acceptance rate |
| Phase 3 | ~6 eng-months | Auto-Skill creation; 50+ Skills/1K users/week |
| Phase 4 | ~10 eng-months | Team adoption; 40%+ Skill adoption |
| Phase 5 | ~12 eng-months | Platform revenue; +20% revenue per user |
| **Total** | **~36 eng-months** | **$30-50M ARR upside; 15% retention lift** |

> **The bottom line**: The technology for advanced Claude capabilities already exists. The missing piece is helping users *decide* how to use it. The ICR doesn't add new capabilities — it unlocks the ones that are already there but going unused.
