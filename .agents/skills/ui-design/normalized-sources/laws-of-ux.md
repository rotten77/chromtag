# Laws of UX

**Source:** https://lawsofux.com (Jon Yablonski, CC BY-NC-ND 4.0)
**Type:** Collection of psychological/cognitive principles relevant to UX & UI.
**Why it matters:** Names the mental phenomena that predict how users actually behave. Lets design decisions be justified from first principles instead of taste.

---

## 1. Aesthetic-Usability Effect
**Definition:** Users often perceive aesthetically pleasing design as more usable.
**Origin:** Kurosu & Kashimura, Hitachi 1995. Study of 26 ATM interfaces with 252 users — aesthetic rating correlated more strongly with *perceived* usability than *actual* usability.
**Implications:**
- Visual polish creates positive halo; users tolerate minor functional flaws in attractive UIs.
- *Danger:* polished aesthetics mask real usability problems in tests. Always test the flow, not the finish.
- Visual quality is not a "nice-to-have" — it materially changes perceived competence and trust.

## 2. Choice Overload
**Definition:** Users get overwhelmed when presented with a large number of options.
**Implications:**
- Cap primary options; tuck secondary actions into menus/drawers.
- Curate and recommend over exhaustive lists.
- For catalogues, offer filters & defaults, not "all 400 products on one screen".

## 3. Chunking
**Definition:** Individual pieces of information are broken down and grouped into meaningful wholes.
**Implications:**
- Phone numbers, card numbers, serial keys: visually grouped in chunks of 3–4.
- Long forms broken into steps.
- Lists of 20+ items benefit from category headers.

## 4. Cognitive Bias
**Definition:** Systematic errors of thinking that influence perception and decisions.
**Implications:**
- Expect and design around anchoring, loss aversion, confirmation bias, status-quo bias.
- Pre-fill sensible defaults; defaults bias choice.

## 5. Cognitive Load
**Definition:** The mental resources needed to understand and interact with an interface.
**Implications:**
- Remove noise, redundant labels, visual decoration that does not convey information.
- Prefer recognition over recall (show options instead of asking users to remember commands).
- Use familiar patterns (see Jakob's Law).

## 6. Doherty Threshold
**Definition:** Productivity soars when a computer and its users interact at a pace <400ms, so neither waits on the other.
**Origin:** Doherty & Thadani, IBM Systems Journal, 1982.
**Implications:**
- Aim response time < 400ms for perceived-responsive interaction.
- Where real work takes longer, use skeleton screens, optimistic UI, progress indicators.
- Strategic delay (e.g., a small pause before an "advanced" recommendation) can signal work and build trust, but default to fast.

## 7. Fitts's Law
**Definition:** Time to acquire a target is a function of the distance to and size of the target.
**Origin:** Paul Fitts, 1954.
**Implications:**
- Touch targets must be sized for accurate selection — WCAG 2.2 mandates ≥ 24×24 CSS px minimum; ≥ 44×44 is Apple/Google recommended.
- Space interactive elements adequately; collapse/hide interferes less than dense clustering.
- Put primary actions close to the user's current focus; corners and edges of the screen have effectively infinite size ("Mac menu bar effect").

## 8. Flow
**Definition:** Mental state of full immersion and energized focus in an activity.
**Implications:**
- Minimize interruptions/modals that break flow.
- Match challenge to user skill: easy onboarding, stretch tasks once engaged.

## 9. Goal-Gradient Effect
**Definition:** Tendency to accelerate toward a goal as proximity increases.
**Implications:**
- Show visible progress toward completion; users push harder near the end.
- Give early "easy wins" (pre-filled steps, pre-completed items) to accelerate motivation.

## 10. Hick's Law
**Definition:** Time to decide increases with the number and complexity of choices.
**Origin:** Hick & Hyman, 1952.
**Implications:**
- Minimize choices in time-critical flows (checkout, onboarding).
- Break complex decisions into sequential smaller ones.
- Highlight a recommended option.
- Progressive disclosure — reveal complexity as needed, not upfront.
- *Caveat:* don't over-simplify to the point of abstraction/ambiguity.

## 11. Jakob's Law
**Definition:** Users spend most of their time on other sites; they prefer yours to work the same way.
**Origin:** Jakob Nielsen.
**Implications:**
- Honor established conventions: hamburger = menu, magnifier = search, X = close, bottom-right FAB, logo top-left links home, underlined blue = link.
- Mental models transfer across products — don't invent where a convention exists.
- When you must redesign radically, allow opt-in/opt-out transition (e.g., YouTube 2017 preview).

## 12. Law of Common Region
**Definition:** Elements are perceived as grouped when they share a clearly defined boundary.
**Implications:**
- Cards, panels, colored backgrounds group related items more clearly than just proximity.
- Overuse of cards, however, creates visual noise — use sparingly.

## 13. Law of Proximity
**Definition:** Objects near each other are perceived as grouped.
**Implications:**
- Space is the primary signal of grouping — before borders or backgrounds.
- Label adjacency: a label closer to the next field than to its own field will be misread (see Refactoring UI: avoid ambiguous spacing).

## 14. Law of Prägnanz (Figure-Ground / Simplicity)
**Definition:** People perceive ambiguous/complex images as the simplest form possible.
**Implications:**
- Reduce shapes to their essence; use simple geometry before elaborate illustration.
- Users will complete partial shapes with mental pattern-matching.

## 15. Law of Similarity
**Definition:** Similar elements are perceived as a group/shape even when separated.
**Implications:**
- Color, shape, size create implicit grouping.
- Consistent component styling = consistent perceived function.

## 16. Law of Uniform Connectedness
**Definition:** Visually connected elements are perceived as more related than unconnected ones.
**Implications:**
- Connect related items with lines, shared backgrounds, or containers — trumps mere proximity/similarity.

## 17. Mental Model
**Definition:** A compressed internal model of how a system works.
**Implications:**
- Match the user's mental model, not the system's architecture (e.g., users think "trash", not "tombstone flag in DB").
- Mismatched mental models cause frustration and errors.
- Test with domain-naïve users; they reveal the true model gap.

## 18. Miller's Law
**Definition:** The average person can keep ~7 (±2) items in working memory.
**Origin:** George Miller, 1956.
**Implications:**
- Chunking is the application — don't misuse the number 7 as a hard cap on navigation, bullets, etc.
- Working memory capacity varies by expertise and context.

## 19. Occam's Razor
**Definition:** Among competing hypotheses that predict equally well, choose the one with fewest assumptions.
**Implications:**
- Simplest design that solves the problem wins.
- Every element must justify itself; default is removal.

## 20. Paradox of the Active User
**Definition:** Users do not read manuals; they start using software immediately.
**Implications:**
- Design for learn-by-doing. In-context hints over up-front tutorials.
- Error messages are teaching moments; make them educative.

## 21. Pareto Principle (80/20)
**Definition:** ~80% of effects come from 20% of causes.
**Implications:**
- Focus design/effort on the critical 20% of features driving 80% of value.
- Analytics: the top paths are disproportionately important.

## 22. Parkinson's Law
**Definition:** Work expands to fill available time.
**Implications:**
- Timer-driven UX reduces hesitation in forms/checkout.
- Remove unnecessary friction; short paths encourage action.

## 23. Peak-End Rule
**Definition:** People judge an experience by its peak moment and its ending, not the total or average.
**Origin:** Kahneman et al., 1993.
**Implications:**
- Invest design care in peak moments (first success, big reveal) and endings (order confirmation, "done" state, empty state after use).
- Negative peaks loom larger than positive ones — prioritize reducing painful peaks (error states, payment failure, cancel flows).
- Example: Mailchimp's animated "high-five" at send; Uber framing cancellations humanely.

## 24. Postel's Law (Robustness Principle)
**Definition:** "Be liberal in what you accept, and conservative in what you send."
**Origin:** Jon Postel, TCP RFC.
**Implications:**
- Accept input flexibly: phone numbers with/without dashes, emails with whitespace trimmed, dates in multiple formats.
- Anticipate user behavior variety: different devices, abilities, contexts.
- Yet communicate precisely: clear expectations, clear errors.
- Especially aligns with accessibility.

## 25. Selective Attention
**Definition:** Focusing attention on a subset of stimuli while ignoring others.
**Implications:**
- "Banner blindness" — users tune out regions that look like ads.
- Visual hierarchy directs where attention lands; if everything shouts, nothing is heard.

## 26. Serial Position Effect
**Definition:** First and last items in a series are remembered best; middle items fade.
**Origin:** Ebbinghaus.
**Implications:**
- Place critical nav items at first and last positions (e.g., Home on the far left, Account/Cart on the far right).
- Place least-critical items in the middle.
- Complements Peak-End Rule.

## 27. Tesler's Law (Conservation of Complexity)
**Definition:** Every system has a minimum amount of complexity that cannot be reduced — it can only be shifted.
**Implications:**
- If you remove complexity from the user, it lands on the designer/engineer or support.
- Decide where complexity lives: configuration defaults hide complexity from most users and expose it to advanced ones.
- "Simple UX = complex backend" is often the right trade.

## 28. Von Restorff Effect (Isolation Effect)
**Definition:** Among similar objects, the one that differs is most likely to be remembered.
**Origin:** Hedwig von Restorff, 1933.
**Implications:**
- Emphasize primary action (primary button vs. ghost secondary buttons).
- Use sparingly — too many "different" elements cancel each other.
- Don't rely on color alone (accessibility).
- Respect motion sensitivity when using animation to differentiate.

## 29. Working Memory
**Definition:** Cognitive system that temporarily holds and manipulates information to complete tasks.
**Implications:**
- Keep relevant context visible during a task (don't make users hold values in their head across screens).
- Show summaries/review steps before commits.

## 30. Zeigarnik Effect
**Definition:** Uncompleted or interrupted tasks are remembered better than completed ones.
**Origin:** Bluma Zeigarnik, 1920s.
**Implications:**
- Progress indicators motivate completion.
- "You're 60% done — 2 steps left" builds urgency.
- Preview/peek UI hints at more content, pulling users to explore.
- Artificial early progress (pre-checked first step) increases follow-through.

---

## How these laws cluster into decisions

**Reducing cognitive load:** Hick, Miller, Chunking, Cognitive Load, Law of Proximity/Common Region/Similarity, Progressive disclosure.
**Directing attention:** Von Restorff, Selective Attention, Prägnanz, Serial Position.
**Motivation & completion:** Goal-Gradient, Zeigarnik, Peak-End, Flow.
**Speed & responsiveness:** Doherty Threshold, Fitts, Parkinson.
**Conventions & expectations:** Jakob's Law, Mental Model, Postel's Law.
**Perceived quality:** Aesthetic-Usability Effect, Peak-End.
**Complexity management:** Tesler's Law, Occam's Razor, Pareto, Paradox of Active User.
