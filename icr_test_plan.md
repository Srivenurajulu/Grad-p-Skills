# Unified ICR Platform — Comprehensive Test Plan

This test plan verifies the full implementation of the **Intelligent Capability Router (ICR)** Unified Platform, covering all interactive features across 7 modules and 9 user journey simulations.

## 1. Environment Setup & Access

- **Action:** Open the main platform file in any modern web browser.
- **URL/Path:** `file:///Users/srivenurajulu/Documents/Claude%20Skills/unified-icr/index.html`
- **Expected Result:** The application loads instantly with the dark glassmorphism theme.

---

## 2. UI/UX & Thematic Verification

- [ ] **Background:** Off-black (`#0d0806`) with warm radial gradients.
- [ ] **Glassmorphism Panels:** Dark brown translucent cards with blur effect.
- [ ] **Accents:** Gold (`#facc15`) buttons, borders, and avatars.
- [ ] **Typography:** Off-white (`#e8e6e3`) primary, muted beige (`#a39e96`) secondary.

---

## 3. Routing Playground (Phase 1 & 2)

1. **Simple Prompt Routing**
   - Input: `"Fix typo in README"` → Click Evaluate Intent.
   - Expected: Recommends **Simple Prompt**, ~150 tokens.

2. **Agent Worker Routing**
   - Input: `"Fix the authentication bug spanning across user and session services"` → Click Evaluate Intent.
   - Expected: Recommends **Agent Worker**, ~4,500 tokens.

3. **Skill Routing**
   - Input: `"Generate a weekly status report based on my Jira tickets"` → Click Evaluate Intent.
   - Expected: Recommends **Skill**, ~1,200 tokens.

---

## 4. Interactive Journey Simulations (Phase 2+)

Test all 9 interactive chatbot-style journeys in the Routing Playground:

| # | Trigger Prompt | Persona | Expected Outcome |
|---|---|---|---|
| 1 | `write a weekly status report for my engineering team` | Marcus | Suggests Skill creation, shows comparison card |
| 2 | `summarize these conflicting meeting notes` | Priya | Suggests dedicated Skill for meeting synthesis |
| 3 | `do a security review of this authentication module` | Sarah | Proposes Agent + Skill combo |
| 4 | `analyze dataset and find correlations` | David | Runs mock workflow, creates "Automated EDA" Skill |
| 5 | `convert figma notes to jira tickets` | Elena | Scaffolds Figma-to-JIRA formatter Skill |
| 6 | `write a terraform script for aws eks` | Alex | Creates "Terraform EKS Architect" Knowledge-Base Skill |

**For each journey:**
- [ ] Type the trigger prompt and press Enter.
- [ ] Verify the chatbot responds with a contextual recommendation.
- [ ] Follow the multi-step conversation by typing responses like `yes`, `tell me more`, `create it`.
- [ ] Verify the Skill is added to the **Skill Ecosystem** tab after acceptance.
- [ ] Verify the interaction is logged in the **Analytics & Journal** table.

---

## 5. Skill Scaffolder (Phase 3)

### A. Auto-Scaffold Detection
- [ ] Navigate to **Skill Scaffolder** tab.
- [ ] Click **Auto-Scaffold** on the "Repetitive Pattern Detected" card.
- [ ] Expected: Button shows "Scaffolding...", then reveals `SKILL.md` code preview.

### B. Template Preview (Eye Icon)
- [ ] Click the **👁️ icon** on any of the 6 template cards (API Documentation, Unit Test Generator, Release Notes, Security Audit, Code Migration, DB Schema Designer).
- [ ] Expected: A modal overlay appears showing the Skill's YAML rules and instructions.
- [ ] Click the **× close button** → Modal closes.
- [ ] Click **"Use This Template"** button in modal → Modal closes, scrolls to code preview, shows token savings message.

### C. Use Template Button
- [ ] Click **"Use Template"** on any card directly.
- [ ] Expected: Green success message appears: "✨ Template Loaded! Save ~35% tokens per run."

---

## 6. Workflow Composer (Phase 5)

### A. Build a Pipeline
- [ ] Navigate to **Workflow Composer** tab.
- [ ] Click skills from the **Available Skills Library** (left panel): e.g., "Security Reviewer", then "API Doc Writer", then "PR Description Writer".
- [ ] Expected: Each skill appears in the **Current Workflow Pipeline** (right panel) connected by `↓` arrows.
- [ ] The **Deploy Workflow** button becomes enabled after adding at least 1 skill.

### B. Deploy and Verify
- [ ] Click **Deploy Workflow**.
- [ ] Expected: Button turns green → "Workflow Deployed!".
- [ ] An **"Active Workflows"** section appears below with a new card showing the pipeline steps, step count, and estimated token savings.
- [ ] The builder resets after 2 seconds, ready for another workflow.

---

## 7. Health Monitor (Phase 4)

- [ ] Navigate to **Skill Health Monitor** tab.
- [ ] Verify the UI displays conflict detection cards and stale skill warnings.
- [ ] Click **"Run Full Audit"** button (visual mockup).

---

## 8. Analytics & Journal

- [ ] Navigate to **Analytics & Journal** tab.
- [ ] Verify the Decision Log table exists with an `#analytics-body` container.
- [ ] Go back to **Routing Playground** and submit any journey prompt.
- [ ] Return to Analytics → Verify a new row was dynamically added with: Timestamp, User Intent, Recommended Capability, and Token Savings.

---

## 9. Skill Ecosystem & API Console

- [ ] Navigate to **Skill Ecosystem** tab → Verify marketplace UI with community skills.
- [ ] Complete any journey in the Routing Playground → Accept the Skill creation.
- [ ] Return to Ecosystem → Verify the new Skill appears with "Created by" details.
- [ ] Navigate to **API Console** tab → Verify the developer console with curl example.

---

## 10. Cross-Module Integration

- [ ] **End-to-End Flow:** Type `write a weekly status report` in Playground → Accept Skill creation → Verify it appears in Ecosystem → Verify it's logged in Analytics.
- [ ] **Navigation:** Click every sidebar tab → Verify all 7 views render without JavaScript errors.
- [ ] **Console Check:** Open browser DevTools (F12) → Console tab → Verify no red errors during normal usage.
