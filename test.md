# ICR Project — Test Plan

## Live URL
`https://srivenurajulu.github.io/Grad-p-Skills/`

---

## 1. Routing Playground Tests

| # | Input | Expected Route | Expected Tokens |
|---|-------|---------------|-----------------|
| 1 | "write a weekly status report" | Skill (Marcus journey) | -1,200 |
| 2 | "security review of auth module" | Skill (Priya journey) | -350 |
| 3 | "summarize conflicting meeting notes" | Action (Sarah journey) | -15,000 |
| 4 | "analyze dataset and find correlations" | Workflow (David journey) | -4,500 |
| 5 | "convert figma notes to jira tickets" | Skill (Elena journey) | -800 |
| 6 | "write a terraform script for aws eks" | Skill (Alex journey) | -20,000 |
| 7 | "fix a typo in my README" | Simple Prompt (fallback) | -150 |

**How to test**: Type each input in the Playground textarea → Click "Evaluate Intent" → Follow the chat flow → Verify routing badge and token savings in Analytics tab.

---

## 2. Journey Completion Tests

For each of the 6 journeys above:
1. Click through all conversation options until "Skill Created" / "Workflow Created" message appears
2. Verify the new Skill card appears in the **Skill Ecosystem** tab
3. Verify a new row is logged in the **Analytics & Journal** table
4. Click "Start Over" → Confirm chat resets cleanly

---

## 3. Skill Scaffolder Tests

| Test | Steps | Expected |
|------|-------|----------|
| Auto-Scaffold | Click "Auto-Scaffold" button | Button changes to "Scaffolded!", YAML code preview appears |
| Template Use | Click "Use Template" on any of 6 templates | Green success message + code preview shown |
| Template Preview | Click 👁️ icon on any template | Modal opens with YAML content |
| Modal Close | Click ✕ or "Use This Template" in modal | Modal closes; template loads if accepted |

---

## 4. Workflow Composer Tests

| Test | Steps | Expected |
|------|-------|----------|
| Add Skills | Click any skill button in left panel | Skill step appears in right pipeline with ↓ arrows |
| Deploy | Add 2+ skills → Click "Deploy Workflow" | Button turns green "Workflow Deployed!", card appears in Active Workflows |
| Reset | After deploy, wait 2s | Builder resets for next workflow |

---

## 5. Navigation Tests

Click each sidebar item and verify the correct view loads:

| Nav Item | View ID | Title Updates To |
|----------|---------|-----------------|
| 🎯 Routing Playground | `v-playground` | Routing Playground |
| 🔗 Workflow Composer | `v-workflows` | Workflow Composer |
| 🏗️ Skill Scaffolder | `v-scaffolder` | Skill Scaffolder |
| 🩺 Health Monitor | `v-health` | Skill Health Monitor |
| 📊 Analytics & Journal | `v-analytics` | Analytics & Journal |
| 🌐 Skill Ecosystem | `v-ecosystem` | Skill Ecosystem |
| ⚡ API Console | `v-api` | API Console |

---

## 6. UI / Visual Tests

- [ ] Dark theme renders correctly (no white flashes)
- [ ] Glassmorphism cards have proper blur and borders
- [ ] Token Budget sidebar widget shows 310k/500k with progress bar
- [ ] All animations (fade-in, slide-up) trigger on element appearance
- [ ] Responsive: no horizontal scroll on 1280px+ screens

---

## 7. Edge Cases

| Case | Input | Expected |
|------|-------|----------|
| Empty input | Click "Evaluate Intent" with blank textarea | Nothing happens (guarded by `if (!text) return`) |
| Unknown intent | "hello how are you" | Falls back to Simple Prompt route |
| Rapid clicks | Click "Evaluate Intent" multiple times fast | Only first click processes (chat step guard) |
| Enter key | Type intent + press Enter | Same as clicking button |

---

## 8. Cross-Browser

| Browser | Status |
|---------|--------|
| Chrome 120+ | ✅ Primary target |
| Firefox 120+ | ✅ Should work (CSS custom properties supported) |
| Safari 17+ | ✅ Should work |
| Mobile browsers | ⚠️ Not optimized (desktop-first design) |

---

## 9. PPT Generation Test

1. Open [Google Apps Script](https://script.google.com)
2. Paste contents of `icr_visual_pitch_script.js`
3. Run `createVisualICRPresentation()`
4. Verify: 12 slides generated in Google Drive
5. Check: All text is Times New Roman, size 12, white background
