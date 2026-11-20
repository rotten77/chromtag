# UX Research Methodology

Synthesized from:
- **Nielsen Norman Group** — *Which UX Research Methods?* · *User Interviews* · *Usability Testing 101* · *UX Research Cheat Sheet* · *Discount Usability: 20 Years* · *Why You Only Need to Test With 5 Users* (Nielsen & Landauer model) · *Thinking Aloud: The #1 Usability Tool*.
- **GOV.UK Service Manual** — *User Research* chapters (planning, recruitment, consent, data management, sensitive subjects, disabled users, non-digital users, phase-by-phase research).

Layer sits **before** any design work — informs what to design, not how. Read alongside `laws-of-ux.md`; the laws explain *why* things work, research tells you *what's actually happening*.

---

## 1. NN/g's three-dimensional method taxonomy

NN/g maps every UX research method onto three axes:

| Axis | Poles | What it distinguishes |
|---|---|---|
| **Attitudinal ↔ Behavioral** | What people say vs. what they do | Surveys and interviews capture stated belief; observation captures actual behavior |
| **Qualitative ↔ Quantitative** | "Why / how to fix" vs. "how many / how much" | Qual reveals causes; quant measures effects |
| **Context of use** | Natural product use · scripted · limited/decontextualized · no product use | How close to real-world |

Use the framework as a **gap-check**: what's your current belief based on? If it's all attitudinal (surveys + interviews), you have no behavioral evidence. If it's all quantitative (analytics), you have no cause.

### 1.1 The 20 methods (NN/g)

**Behavioral-leaning**
- Usability testing (moderated or unmoderated)
- Eye-tracking
- Field studies / ethnography
- Contextual inquiry
- Remote moderated testing
- Analytics / clickstream analysis

**Attitudinal-leaning**
- User interviews
- Focus groups
- Surveys
- Card sorting (open or closed)
- Concept testing
- Desirability studies

**Mixed / flexible**
- Unmoderated testing
- Participatory design
- Diary studies
- Tree testing
- A/B testing
- Customer feedback channels
- Usability benchmarking
- Intercept studies

### 1.2 Method × project phase (NN/g)

| Phase | Research type | Purpose | Methods |
|---|---|---|---|
| **Strategize / Discover** | Generative | Open-ended; find directions | Field studies, interviews, diary studies, participatory design |
| **Design / Explore** | Formative | Improve iteratively | Card sort, tree test, usability test, remote test, competitive analysis, journey mapping |
| **Launch / Test** | Formative → summative | Validate readiness | Usability testing, benchmark test, accessibility eval |
| **Assess / Listen** | Summative | Monitor in the wild | Analytics, surveys, search-log analysis, A/B, feedback channels |

**Top prioritization recommendation (NN/g):** "If you can do only one activity and aim to improve an existing system, do qualitative (think-aloud) usability testing." Highest problem-discovery rate per hour.

---

## 2. The 5-user rule (Nielsen & Landauer)

### 2.1 The model

Fraction of problems discovered with `n` users:

```
P(n) = 1 − (1 − L)^n
```

Where **L ≈ 0.31** = proportion of problems a single user reveals (empirical, 1993 study of usability projects).

| Users | Problems found |
|---|---|
| 1 | 31 % |
| 2 | 52 % |
| 3 | 67 % |
| 4 | 77 % |
| 5 | 84 % |
| 6 | 89 % |
| 10 | 97 % |
| 15 | 99.5 % |

### 2.2 Why 5

Curve bends sharply. 6th user overlaps heavily with the first 5. **Three rounds of 5** discovers more than one round of 15 because the design gets to evolve between rounds — new problems surface that the original version hid.

### 2.3 When to test more

- **Multiple distinct user groups.** 3–4 per group for two audiences; 3 per group for three+. Groups must genuinely differ in mental model or workflow — not just demographics.
- **Quantitative benchmarking.** ≥ 20 per condition for reliable means; more for subgroup analysis.
- **A/B tests for statistical significance.** Hundreds to thousands depending on effect size.
- **High-stakes decisions** where executives need confidence numbers, not lists of problems.

### 2.4 The equity correction

The 5-user rule is a **problem-finding** rule, not a representation rule. If your 5 users are all able-bodied, native English-speaking, digitally fluent, you'll have a 5-user-rule-worth of findings for that population — and nothing for anyone else. Recruit per user group, not per study.

---

## 3. Usability testing — the operational method

### 3.1 Core protocol (NN/g Usability Testing 101)

1. **Recruit** representative users (or users matching target demographic's needs + background).
2. **Write tasks** that mirror realistic activities, not hypothetical ones. Phrasing matters — do not leak the solution.
3. **Facilitator** administers tasks, observes, clarifies without leading, records.
4. **Participant** performs tasks; think-aloud encouraged.
5. **Analyze** — collect problems, severity-rate, prioritize fixes.

### 3.2 Task design

**Good task (realistic, outcome-specified):**
> "You're moving to a new city next month and need to rent an apartment under $2000 near public transit. Use the site to find one you'd actually consider."

**Bad task (leads, abstracts):**
> "Click on Search, enter '2000' in the price field, select 'near transit', and tell me what you think."

Rules:
- **Outcome, not steps.** Specify what "done" looks like; let them find the path.
- **First-person context.** "You're planning a trip…" beats "Plan a trip."
- **Realistic constraints.** Price ceilings, deadlines, shared accounts — real constraints expose real paths.
- **No UI vocabulary.** Avoid "button", "menu", "filter" — the user should find those.

### 3.3 Moderated vs unmoderated

| | Moderated | Unmoderated |
|---|---|---|
| Scripted probing | Yes | No |
| Follow-ups | Yes | No |
| Observation of confusion | Live | Recording |
| Cost | ~$250–$800 per session | ~$50–$150 per session |
| Quality floor | Higher | Lower |
| Best for | Early rounds, complex tasks, sensitive topics | Later rounds, simpler tasks, benchmarking |

**Default for a design-phase study: moderated remote (Zoom / Lookback / UserTesting).** Fastest + cheapest without losing probe quality.

### 3.4 Think-aloud (NN/g: "the #1 usability tool")

**Definition:** participant continuously verbalizes thoughts while using the interface.

**Strengths**
- Reveals misconceptions — not just failures, but *why*.
- Low-cost, one-day setup possible.
- Tolerates imperfect facilitation — findings still valid.
- Applicable from paper prototypes to live products.
- Motivates skeptical stakeholders by showing real user reactions.
- Trainable in a day.

**Limitations**
- Doesn't yield statistics without large samples (≠ NN/g's purpose).
- Unnatural — users don't normally narrate. Can alter behavior.
- Participants edit thoughts to look competent (social desirability).
- Facilitator probes can leak; careful wording matters.

**Variants**
- **Concurrent think-aloud** — verbalize during task. Default.
- **Retrospective think-aloud** — review recording after task, narrate. Less intrusive, but memory is reconstruction.
- **Silent observation + post-task probe** — use when think-aloud would distort behavior (e.g., cognitive-load research).

### 3.5 Severity rating (Nielsen 0–4 scale)

| Level | Meaning |
|---|---|
| 0 | Not a usability problem |
| 1 | Cosmetic — fix if time permits |
| 2 | Minor — low priority |
| 3 | Major — high priority, fix before release |
| 4 | Catastrophic — must fix before release |

Rate each finding on: (a) frequency, (b) impact, (c) persistence. A problem that hits every user once is different from one that hits one user every time.

---

## 4. Guerrilla / discount usability (NN/g Discount Usability)

### 4.1 The case

Nielsen's 1988 MacPaint study of 20 teams: **58 % of variability in problems found tied to methodology quality; 42 % to team talent + chance**. Teams scoring 20–30 % on best-practice compliance still caught ~25 % of serious problems. Best-performing team scored only 56 %.

**Conclusion:** bad user testing > no user testing. The marginal cost of adding one observation is tiny relative to shipping blind.

### 4.2 Practical setup

- **Location:** where your target users already are — cafés near the office, libraries, community centers, conferences in the same vertical.
- **Recruitment:** intercept + $10–20 gift card. Screen with 2–3 questions for target-segment fit.
- **Session length:** 15–30 minutes. Long enough to complete 2–3 tasks; short enough to avoid fatigue.
- **Capture:** one researcher facilitates, one takes notes. Phone camera for screen-capture if needed.
- **Iteration speed:** NN/g cites one case running 8 design iterations in 90 hours, another running 11 in 60 hours. Round trips in days, not weeks.

### 4.3 Limits

- Intercept recruiting biases toward available-at-that-time populations.
- Café noise + no screen recording → less polished evidence for stakeholders.
- Not suitable for: highly regulated domains (medical, legal, financial), sensitive subjects, minors, populations requiring accessibility accommodations.
- Findings rate per session lower than lab — compensate with more sessions.

---

## 5. User interviews (NN/g)

### 5.1 Planning

- **Define the decision the research informs.** "Learn about users" is too broad. "Understand why cart abandonment spikes at the shipping step" is actionable.
- **Write research questions** (what you want to know) separately from **interview questions** (what you'll actually ask).

### 5.2 Question craft

**Open-ended, story-seeking:**
- "Walk me through a typical day for you."
- "Tell me about the last time you [did X]."
- "What happened before / after / during?"

**Probes that don't lead:**
- "Tell me more about that."
- "Why is that important to you?"
- "What were you thinking when…?"
- "Can you give me an example?"

**Avoid**
- **Leading** — "Wouldn't it be easier if…?" → user agrees to be polite.
- **Double-barreled** — "Do you use X or Y, and why?" → merged answers.
- **Assuming** — "When you use X every day…" → user may not.
- **Hypothetical future** — "Would you pay for Y?" → stated intent is a poor predictor of purchase.
- **Recall-heavy** — "How often in the last year did you…?" → memory is reconstructed, not retrieved.

### 5.3 Structure

| Type | When |
|---|---|
| **Structured** | Benchmarking, comparison across subjects. Same questions, same order. |
| **Semi-structured** | **Default for discovery.** Guide of topics + starter questions; reorder and follow threads. |
| **Unstructured** | Deep ethnographic immersion. Requires experienced interviewer. |

### 5.4 Bias — the short list to watch

- **Social desirability** — user says what sounds good.
- **Confirmation bias (yours)** — you hear what supports your hypothesis.
- **Recency bias** — user over-weights latest experience.
- **Memory decay** — 2-week-old usage is 20 % accurate.
- **Interviewer effect** — your tone shapes answers. Neutral "mmhmm", no reactions.

### 5.5 Analysis

- Transcribe (or time-stamp + note).
- **Affinity diagram** — sort quotes into emergent themes (bottom-up). Don't pre-code with categories.
- Build artifacts only if they serve the decision: user-need statements, personas, journey maps, empathy maps.
- Return to the research question — did the data answer it?

### 5.6 Sample size

NN/g defers to a separate article on interview sample size. Practical rule: **8–12 per user group** saturates most common themes; **20+** only when the audience is unusually heterogeneous or findings will drive major strategy.

---

## 6. GOV.UK service manual — research through the service lifecycle

GOV.UK structures research around the four service-delivery phases. The framing is public-sector-ized but transfers cleanly to private work.

### 6.1 Phases

| Phase | Research priority | Core activity |
|---|---|---|
| **Discovery** | Understand user needs, policy intent, existing journeys | Interviews, contextual observation, stakeholder mapping, assumption inventory |
| **Alpha** | Test rough prototypes against needs | Paper / clickable prototype usability testing, concept validation |
| **Beta** | Test end-to-end with real users on real data | Moderated + unmoderated usability testing, accessibility testing, edge-case coverage |
| **Live** | Monitor + improve in production | Analytics, in-service feedback, search logs, periodic usability testing |

### 6.2 Planning a round of research

Each round needs:
1. **Research questions** — specific, decision-linked.
2. **Recruitment plan** — who, how many, how recruited.
3. **Session plan** — tasks, probes, timings.
4. **Consent + data plan** — what's collected, how stored, how long.
5. **Analysis + readout plan** — who sees findings, in what format.

### 6.3 Consent + data management (GDS mandates)

- **Informed consent** — participant understands purpose, recording, data retention, withdrawal rights. Written + verbal.
- **Storage** — minimum necessary; delete per retention policy; encrypt at rest; access limited to research team.
- **Anonymization** — remove name, contact, identifying context before sharing widely.
- **Withdrawal** — participant may withdraw at any point; their data must be removable.
- **Emotionally sensitive / contentious subjects** — enhanced consent, participant support (referrals, debrief), trained interviewer, short sessions.
- **Pre-election / political periods** — pause content-adjacent research that could be construed as partisan.

### 6.4 Accessibility of research

**Research itself must be accessible.** Common failures:
- Screen-shared prototype that screen-reader users can't interact with.
- Session length that fatigues users with certain cognitive conditions.
- Recruitment pool that excludes non-digital users (online screener).
- Compensation via electronic gift card that excludes unbanked participants.

**Fixes:**
- Offer format options (phone, in-person, video, async).
- Longer sessions with breaks when needed.
- Recruit via community orgs, not just online panels.
- Pay in cash / check alongside gift cards.

### 6.5 Underrepresented groups (GOV.UK mandate — good practice generally)

- **Disabled people** — AT users (screen reader, switch, eye-gaze), users with low vision, deaf/HoH users, users with cognitive or learning differences. If your product will serve the general public, some percentage of users will fall here — test accordingly.
- **Low-digital-skill users** — older users, first-time internet users, low-literacy users. They surface problems that "power users" don't.
- **Non-digital-service users** — people who've chosen not to use a digital equivalent. Understanding *why* informs whether digital is the right medium.
- **Linguistic minority users** — test in target languages with native speakers, not machine-translated English.

---

## 7. Analytics, surveys, A/B — the quantitative leg

### 7.1 Analytics (behavioral, summative)

- **Funnel analysis** — where users drop off. Reveals *where*, not *why*.
- **Cohort analysis** — behavior over time per sign-up period. Separates product-quality signal from acquisition-mix change.
- **Segment analysis** — behavior differs by user type. Always break down totals.
- **Search logs** — what users type when they can't find something. Gold for IA, labels, content gaps.

**Rule:** analytics answer *what* and *when*, rarely *why*. Pair with qualitative to interpret.

### 7.2 Surveys (attitudinal, quant or qual)

- **Purpose narrowly.** Decide what to measure before writing questions.
- **Question types** — single-choice, multi-choice, Likert, ranking, open-ended. Mix cautiously.
- **Likert scales** — 5 or 7 points. Label every point or only endpoints — not inconsistent.
- **Sample size** — effect-size dependent; for rough prevalence, 200+ per segment.
- **Bias watch** — selection bias (who bothers to answer), acquiescence (tendency to agree), order effects, scale usage.

### 7.3 A/B testing

- **Test one change at a time** — or use factorial designs with enough traffic.
- **Pre-register hypothesis + metric + stopping rule.** Post-hoc cherry-picking inflates false positives.
- **Sample-size calculation before running.** Effect × baseline × significance threshold → required N.
- **Segment post-hoc only if pre-planned.** Multiple-comparison correction applies.
- **Guardrail metrics** — confirm the test didn't break a core KPI while optimizing a secondary one.

---

## 8. When to use which method — quick table

| You need to know… | First choice | Backup |
|---|---|---|
| What problems exist in the current design | Think-aloud usability test (5 users) | Unmoderated remote test |
| Why users abandon | Interviews + funnel analytics | Exit survey + session replay |
| What vocabulary users use | Card sort (open) + interviews | Search-log analysis |
| Whether the IA makes sense | Tree test | First-click test |
| Which of two designs wins | A/B test | Comparative usability |
| What users feel about the brand | Survey + interviews | Sentiment analysis |
| How real users behave over time | Diary study | Longitudinal analytics |
| Whether the product is accessible | Manual + AT testing with disabled participants | Automated scan (floor only) |
| How it compares to competitors | Comparative benchmark usability | Competitive heuristic review |
| Whether a concept is worth building | Concept testing + interviews | Landing-page demand test |

---

## 9. Anti-patterns (field-useful)

- **Skipping discovery** — going straight to design on assumed needs. All downstream findings tethered to an unvalidated problem.
- **Leading questions** — "Do you like the new design?" vs "Tell me about your experience."
- **Recruiting from your team's network** — biases toward digitally fluent, friendly-to-product users.
- **Treating 5-user findings as statistics** — "80 % of users failed" on 5 users is not a statistic. It's a list of 4 people who failed.
- **Running one round only** — 1×15 finds fewer real problems than 3×5 with iteration between rounds.
- **Interviewing about future behavior** — stated intent doesn't predict purchase / use.
- **Asking disabled users about accessibility, then not shipping the fix** — research without follow-through is extraction.
- **Sharing findings without owners + deadlines** — findings without assignment don't become fixes.
- **Treating negative findings as bad news for the researcher** — kill the messenger = future research gets politeness, not signal.
- **Focus groups for usability** — groupthink distorts individual responses. Use for attitudinal / concept exploration, not task performance.
- **Analytics as the whole story** — quant without qual measures what's happening, never why.
- **Skipping accessibility research** — shipping without AT users means shipping an untested product for 15 %+ of the population.

---

## 10. Research deliverables — what to produce

Match the deliverable to the consumer.

| Consumer | Format | Depth |
|---|---|---|
| **Designer on the team** | Clips, raw quotes, tagged transcript, priority problem list | Rich, raw |
| **Design team (readout)** | 30-min playback of session highlights + problem list + severity | Medium |
| **Cross-functional (PM, eng)** | 1-page summary with top 3 findings, recommendations, evidence links | Compact |
| **Executives** | 3-slide: question, finding, decision-support | Tightest |
| **Compliance / legal** | Consent records, data-management log | Administrative |

**Rule:** one research round produces different artifacts per consumer. Don't present the exec deck to the design team or vice versa.

---

## 11. Source-level agreements + emphasis differences

**All sources agree:**
- Qualitative usability testing is the highest-leverage single method.
- 5 users per group is the working size for problem discovery.
- Observation > self-report when both are available.
- Research is iterative, not one-shot.
- Consent + ethics are non-negotiable.

**Emphasis differences worth knowing:**
- **NN/g leans qualitative** (think-aloud, interviews, small-N). Good for design teams that can run frequent small studies.
- **GOV.UK leans inclusive and ethical** — heavier on consent, accessibility, underrepresented groups. Appropriate for public-sector, insightful for anyone serving broad audiences.
- **NN/g's 5-user rule is often misquoted as "5 users cover everyone"** — it covers ~85 % of problems in the tested population. Multiple audiences mean multiple 5-user rounds, not one 5-user round.
- **Guerrilla studies** are endorsed by NN/g for iterate-fast teams; GOV.UK requires richer setup given the ethical + accessibility floor.

---

## 12. Where to go deeper

- NN/g article index for specific methods (card sort, tree test, diary).
- *Just Enough Research* — Erika Hall (small-team-friendly primer).
- *Interviewing Users* — Steve Portigal (interview craft in depth).
- *Measuring the User Experience* — Tullis & Albert (quant-leaning).
- *A Practitioner's Guide to User Research* — Gregg Bernstein.
- *The Mom Test* — Rob Fitzpatrick (bias-resistant customer interviews).

This file covers the methodological scaffolding. The reading list adds craft depth.
