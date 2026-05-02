# Part 2: Feature Prioritization, MVP Design & Data Flow

## 6. Feature Prioritization

### Feature Matrix (ICE Scoring: Impact × Confidence × Ease)

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

## 8. Skill Auto-Scaffolding (F3) — How It Works

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
