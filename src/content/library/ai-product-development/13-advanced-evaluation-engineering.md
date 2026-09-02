# 13 — Advanced Evaluation Engineering

**Status:** v1.0 · 2 September 2026
**Experiment:** `experiments/01-request-response-app`, same product as Chapters 04–12
**Lenses:** 2 (AI behaviour and quality evaluation) · and all, since this chapter audits the others

---

```
LEARNING PATH

LEARN     Eval design principles, and the one this chapter partly resists
          (S-066) · judge biases and what "80% agreement with humans" also
          means (S-067)
WATCH     No video assigned. Nothing retrieved met the bar - see 16
BUILD     A loader that ENFORCES a holdout · metrics that refuse a rate with
          no population · a confusion matrix that refuses a set with no
          negatives · a coverage matrix that reports empty cells first · a
          judge contract with probes that can fail · dimension-specific gates
TEST      603 deterministic tests. 50 new, all of them testing the EVALUATION
          system rather than the product
BREAK     A pattern fitted to one sample, for the third time · seven empty
          directories reading as coverage · a "confidence" never compared to
          correctness
REFLECT   What do all our numbers, taken together, actually support?
```

> **REAL MODEL FINDINGS: NOT RUN.** G-18 is open, and Phase 15 asked exactly
> *what* blocks execution. The answer is precise: the provider adapter
> (`src/classify/model.mjs`, `claude-opus-5`, validated output, provenance) is
> present, `@anthropic-ai/sdk` is installed, and the harness path exists.
> **`ANTHROPIC_API_KEY` is unset.** G-18 is one environment variable, not a
> build project (G-63).

---

## 1. The question

Chapters 04–12 each produced numbers, and each reported them honestly inside
its own chapter. This chapter asks the thing no individual chapter was
positioned to ask:

> **Taken together, what do our numbers actually support?**

The audit runs in `eval/audit-evaluations.mjs`, and its answer is
uncomfortable:

```
cases across all datasets                                          165
datasets carrying a split field                                    0 of 8
datasets whose cases influenced the implementation they measure    8 of 8
```

Seven of fourteen dataset directories are empty. One dataset has a declared
split — Chapter 04's, in a markdown file, enforced by nothing.

Six distinctions follow from that, and the chapter is those six:

| | |
|---|---|
| **test passing ≠ product quality** | 603 tests describe the code, not the experience |
| **case count ≠ coverage** | 22 cases across a 4×3×3×3 space is 22 samples from 108 cells |
| **count ≠ rate** | a rate needs a population somebody chose |
| **rate ≠ certainty** | 0/22 is 0%, and consistent with one in seven |
| **dev set ≠ holdout set** | one is for fixing; the other stops being a holdout when you read it |
| **model score ≠ ground truth** | a judge agreeing with humans 80% of the time disagrees 20% of the time |

---

## 2. What are we evaluating?

Not "AI quality". Eleven things, which fail differently and need different
instruments:

| property | measured by | current state |
|---|---|---|
| model output quality | reference + judge | **NOT RUN** (G-18) |
| retrieval quality | hit-rate@3, MRR, P@3 | deterministic, dev only |
| tool selection | — | **never measured**; calls are hand-written (G-36) |
| argument generation | — | same |
| authorization compliance | 28 identity cases | deterministic |
| agent control | 16 trajectory cases | scripted proposer, not a model |
| task completion | 4 task cases | deterministic |
| safety / security | 22 adversarial cases | counts, not rates |
| latency | wall-clock | ~29s for the suite |
| cost | tokens, money | zero, because no model runs |
| user-facing usefulness | — | **never measured** |

Two rows in that table say "never measured" and one says "NOT RUN". Collapsing
these into one score would hide all three.

---

## 3. Count, rate, coverage — and none of them is certainty

Chapter 12 reported *"22 attacks, none succeeded"* and was careful to call it a
count. Here is what happens when it is turned into a rate:

```
0/22 = 0%, 95% Wilson CI [0.0%, 14.9%]
Can 22 observations support "attack success rate below 5%"?   NO
```

**With 22 attacks and no successes, a true success rate of one in seven is
still consistent with what we observed.** That is not a criticism of Chapter
12 — it never claimed otherwise — it is what 22 observations are worth.

`rate()` therefore refuses to compute without a named population, as a throw
rather than a warning:

```js
rate({ numerator: 0, denominator: 22, population: 'stuff' });
// MetricError: A rate needs its population named in words. "0 leaks" is not a
// finding until somebody can ask "out of how many opportunities, of what kind?"
```

**Wilson, not the normal approximation**, because every dataset here is small
and most of the interesting proportions sit at 0 or 1 — where the normal
interval has *zero width* and is simply wrong. "0 failures out of 22, ± 0" is
the most misleading thing a report can say.

---

## 4. The experiment: characterising a detector

This is the chapter's runnable core, and FR-34 is why it exists. Chapter 12's
shadowing detector had, by its own report, perfect attack detection — and a 42%
false-positive rate that nobody could have known, because the suite contained
no negatives.

> **A DETECTOR EVALUATED ONLY ON POSITIVES HAS NO MEASURED FALSE-POSITIVE
> RATE, WHATEVER ITS RECALL LOOKS LIKE.**

So `confusion()` refuses a set with no negative cases, and
`evaluation/datasets/golden/secret-detector-v1.json` is a human-labelled golden
set where **13 of 30 cases are negatives** — ordinary support strings a real
system carries. The hard ones are deliberate: a product identifier beginning
`sk-`, an invoice number beginning `AKIA`, and *"I did not include the password
in this message."*

### What happened, in four measurements

| | dev recall | holdout recall | gap |
|---|---|---|---|
| as found | 88.9% | 75.0% | 13.9 pts |
| after patching the dev case | **100%** | **75.0%** | **25.0 pts** |
| after adding dev cases probing rule shape | 76.9% | 75.0% | 1.9 pts |
| after generalising the patterns | 100% | **100%** | 0 pts |

**Row two is the chapter.** The golden set found a real miss — `sk_test_...`,
the underscore form (FR-35, and FR-24's bug for the third time). I fixed it.
Development recall went to a perfect 100%.

**The holdout did not move at all.** The gap *widened*, from 14 points to 25.

That is the signature of fitting to the development set, and without a holdout
it would have read as a fix. What it actually was: patching the one case in
front of me while the underlying rule stayed as narrow as it had been.

Row three is the honest estimate. Five new *development* cases probing
separators, label spacing, two-word labels and other PEM types — written from
the shape of the rules, not from the holdout — dropped dev recall to 77%, which
is what the detector was worth all along.

Row four is generalisation: `sk[-_.]`, labels with optional spaces. Both splits
moved together.

**The holdout was scored four times and never inspected.** Its failing case ids
were never printed. The `--holdout` flag exists, prints a warning that using it
spends the holdout, and was never passed.

### And the number that is still weak

```
false-positive rate  0.0%  95% CI [0, 35]
```

Zero false positives on 7 negatives. The interval reaches 35%. **A measured
0% over a tiny denominator is not a low false-positive rate** — it is the
beginning of one.

---

## 5. Dev, holdout, regression

Chapter 04 wrote the best split document in this repository — fourteen
development cases, ten holdout, and a paragraph admitting the contamination
that had already happened. It is a markdown file. Nothing enforces it.

> **A SPLIT THAT LIVES IN PROSE IS A PROMISE. A SPLIT THAT LIVES IN THE LOADER
> IS A CONSTRAINT.**

`loadDataset` defaults to `allowHoldout: false`, so the ordinary path — a
developer running the suite while changing code — **cannot see the holdout**.
Seeing it requires saying so in the call.

Three splits, not two:

- **dev** — inspectable while fixing; contaminated by design
- **holdout** — scored, not inspected; a *procedural* guarantee, not a pristine benchmark
- **regression** — derived from a fixed defect; proves that bug is gone and measures nothing else

Regression is separate because a regression case was written *from* the failure,
*by* the person who fixed it. It is guaranteed to pass. Counting regressions in
a headline rate inflates it with cases that cannot fail.

**Contamination has three forms and only two are mechanical.** Duplicate inputs
and shared ids are detected. The third — *a holdout failure used to tune the
system* — is a process rule, and `contamination()` returns that sentence with
every result rather than implying it has been handled.

---

## 6. Coverage is not case count

```
3 cases occupy 1 of 6 cells; 5 combinations were never sampled
```

`coverage()` reports empty cells **first**, and caps the filled list. Run
against Chapter 12's real adversarial dataset across the nine attack surfaces,
it finds unsampled surfaces — 22 cases across 20 threat classes was honest, and
it was not coverage.

A case that fits no cell is counted as `unclassifiable` rather than silently
dropped, because a case that quietly vanishes is how a coverage number gets
better without anything improving.

---

## 7. Judges: built, probed, and NOT RUN

The chapter map's core experiment is *judge validation against a human-labelled
golden set*. The golden set exists. The judge does not, because G-18 is open.

What is built: the rubric, the pointwise and pairwise contracts, three bias
probes and a six-step validation protocol — all exercised against a
**deterministic stub whose behaviour is known**.

**A criterion must be observable**, enforced at construction:

```js
criterion({ id: 'R', question: 'is it good?', observable: '' });
// JudgeError: "Good", "high quality" and "professional" are not criteria — two
// people will not agree on them, and neither will a judge with itself.
```

**Pointwise and pairwise answer different questions.** Pointwise scores against
a rubric and names *which* criterion failed. Pairwise produces an **ordering**
and `pairwise()` deliberately emits **no score field**:

> Two outputs can be ranked confidently while both are unacceptable. A 70% win
> rate says nothing about whether either should ship.

A test asserts exactly that: two outputs that both fail the rubric still order,
and only pointwise knows they are both unacceptable.

**Pairwise runs both orders, always.** S-067 lists position bias first, and a
harness that presents A then B and takes the answer has measured the judge's
preference for the first *slot*. A judge that flips when the order flips has
told you it has no opinion, and `consistent: false` is more useful than a
winner.

**The probes can fail**, which is Chapter 12's lesson applied here. There are
deliberately-biased stubs — one that always picks the first slot, one that
always prefers the longer output — and the tests assert the probes catch them.
A probe that cannot fail has not been tested.

**Self-preference is NOT RUN** and says what it needs: two models from
different families and a credential.

**The 80% figure, read carefully.** S-067 reports strong judges reaching *"over
80% agreement, the same level of agreement between humans"*. That is genuinely
good — and it also means **one judgement in five differs from a human's**. A
judge is a measuring instrument with a known error rate, not ground truth
(`F16.14`).

---

## 8. Calibration: is "confidence" a confidence?

Chapter 09 has emitted `confidence: 'high' | 'low'` for four chapters. FR-15
recorded the threshold as provisional. Nothing ever asked the prior question:

```
low     n= 3  correct 100.0%  95% CI [44, 100]
high    n= 9  correct 100.0%  95% CI [70, 100]
correctness does not decrease as the band rises
```

That is the weakest possible pass. Both bands are 100%, so **the band carries
no information about correctness in this sample** — it has never been observed
to separate a right answer from a wrong one, because on these twelve queries
there were no wrong answers to separate.

FR-37, and **deliberately not fixed**. The fix is not code; it is a query set
containing cases the retriever gets wrong (G-65). No test could have caught
this, because every existing test asserted what the band *was* rather than what
it *predicted*.

---

## 9. Tiers, and gates that cannot be averaged

Chapter 03 already defines grading Levels A–E. Inventing "Tier 1..6" beside
them would give the repository two ladders, so the levels stay and the tiers add
the missing axis: **when each runs, and what it costs**.

| tier | level | what | cost | blocks |
|---|---|---|---|---|
| 1 | A | 603 unit tests + runtime verification | ~29 s, no money | merge |
| 2 | A/B | regression cases from FR-01…FR-37 | seconds | merge |
| 3 | A/B | dev-split chapter datasets | seconds today | merge, security only |
| 4 | C | holdout + model judge | **NOT RUN** (G-18, G-63) | release |
| 5 | D | human rubric on disagreements | minutes of human time | release, for a new judge |
| 6 | E | adversarial + production | seconds today | release, any critical failure |

Gates are **per dimension**, and there is deliberately **no function that
combines them**:

> **ONE CRITICAL SECURITY FAILURE MUST NOT BECOME "95% OVERALL".**

```js
evaluateGates({ crossTenantLeaks: 1, hitRateAt3: 0.99 });
// passed: false, critical: ['G1'], score: undefined
```

Two gates earn their place beyond the obvious. **G6** requires a false-positive
rate *with a measured denominator* — an unmeasured 0% is the FR-34 state and
fails. **G7** fails on false-positive refusals, because every other gate can be
driven to zero by refusing everything.

---

## 10. What broke

**FR-35 — the same prefix bug, a third time.** §4. Found by the discipline
rather than by luck, which is the difference between noticing a bug and having
a method that notices bugs.

**FR-36 — seven empty directories reading as coverage.**
`authorization/`, `edge/`, `privacy/`, `realistic/`, `regression/`,
`product-outputs/` contain nothing. On a file listing — how anyone forms a first
impression of an evaluation suite — they read as coverage that exists. The
audit now names them every run. **An artefact's existence is not evidence of its
content.**

**FR-37 — a confidence never compared to correctness.** §8.

---

## 11. Cost

| tier | wall-clock | model calls | money |
|---|---|---|---|
| full test suite (603) | ~29 s | 0 | £0 |
| all four chapter eval suites | ~8 s | 0 | £0 |
| detector characterisation | ~1 s | 0 | £0 |
| evaluation audit | <1 s | 0 | £0 |
| **Tier 4 (judge)** | — | — | **unknown — never run** |

Everything runnable today is free and fast enough to run on every change, which
is a real finding and also a consequence of the thing that limits the whole
chapter: **nothing here calls a model** (G-68).

---

## 12. Learning Checkpoint

**Q1 — "100% on our eval."** A team reports 100% on a 30-case suite. What do you
ask?

**Q2 — The holdout.** Your holdout run fails four cases. Your colleague opens
them to see what went wrong. What has just happened?

**Q3 — The detector.** Someone shows you a PII detector that caught all 40 PII
samples in testing. Would you ship it?

**Q4 — Count or rate?** "Zero cross-tenant leaks." When is that a finding, and
when is it a sentence?

**Q5 — Pairwise.** Your judge says version B beats version A 70% of the time.
What may you conclude?

**Q6 — The judge that agrees.** Your LLM judge agrees with human labels 82% of
the time. Ship it as ground truth?

**Q7 — Confidence.** Your retriever labels answers high/low confidence. What
experiment tells you whether the label means anything?

**Q8 — The gate.** Product wants a single "quality score" on the release
dashboard. What do you build?

---

## 13. Checkpoint Discussion / Reasoning

**Q1.** Four questions, in order of how much they usually change the answer.

**Was any of it held out?** If the same 30 cases guided the implementation, 100%
measures fit, not generalisation. Our own audit says 8 of 8 datasets were used
while fixing the system they measure.

**What is the interval?** 30/30 has a 95% lower bound near 88%. So "100%" is
consistent with a true rate of 88%, and if the acceptance bar is 95% the sample
cannot tell you whether you have met it.

**What is the coverage?** Thirty cases across four dimensions is thirty samples
from a much larger grid. Ask which cells are empty.

**Are there negative cases?** A suite of thirty things-that-should-work says
nothing about things that should be refused — the FR-34 shape.

The tell that discriminates a good answer from a defensive one: a team that has
thought about this will *volunteer* the interval and the empty cells. A team
that has not will explain why 30 cases is enough.

**Q2.** They have converted the holdout into a development set, and nothing
announced it.

Not a rule violation with a sanction — a change of what the number means. From
now on, any fix informed by those four cases produces a holdout score that
measures fit. The guarantee was never cryptographic; it was procedural, and the
procedure has been spent.

What to do, concretely: record that it happened and when, treat those four cases
as dev from now on, and — if a genuine holdout is still needed — write new cases
that nobody has seen. That is expensive, which is exactly why the loader makes
the safe path the default and the unsafe path require an explicit flag.

This chapter's own run is the demonstration. The holdout was scored four times
across §4's four rows, and its failing ids were never printed.

**Q3.** No, and one question explains why: **how many non-PII samples did you
test?**

Forty positives give a recall. They give no false-positive rate at all, because
there were no negatives — the state Chapter 12's shadowing detector was in when
it reported perfect detection and turned out to fire on 42% of a clean run.

A PII detector with an unmeasured false-positive rate is a product risk in a
specific way: it will redact ordinary support text, agents will stop trusting
the redaction, and eventually somebody will turn it off. **An alarm's
false-positive rate is a property of the alarm**, and shipping without it means
shipping without knowing whether anyone will keep it on.

What I would ask for: negatives that look hard. Not lorem ipsum — real support
strings containing the *word* "password", identifiers shaped like keys, and
sentences that mention credentials without containing one. Ours are SD-21,
SD-22 and SD-49.

**Q4.** It is a finding when a population is named, and a sentence otherwise.

"Zero cross-tenant leaks" alone cannot be argued with, which is what makes it
useless. Zero out of what? Our own answer would need: how many opportunities to
leak, across how many tenants, tools, data classes and actors — and whether the
opportunities were *representative* or the twenty somebody thought of.

It becomes a finding as: *"0 leaks across 340 attempted cross-tenant reads
spanning 2 tenants × 6 tools × 3 data classes; 95% CI [0%, 1.1%]."* Now a
reader can ask whether 340 was the right population and whether 1.1% is
acceptable — both good questions, and neither askable of the original.

And even then it is not certainty. It is a rate with an interval over a
population somebody chose.

**Q5.** That B is preferred to A. Nothing about whether B is any good.

Pairwise produces an **ordering**. Two outputs can be ranked confidently while
both are unacceptable, which is why `pairwise()` in this chapter emits no score
field and a test asserts the absence.

Three things to check before believing even the ordering. **Was the order
swapped?** If A was always presented first, 70% may be measuring the first slot
— position bias is the first thing S-067 lists. **How many comparisons?** 70% of
20 has an interval from roughly 48% to 86%, which includes "no preference".
**Were the two outputs the same length?** If B is systematically longer, that
may be verbosity bias rather than quality.

And the question the win rate cannot answer: *is A acceptable today?* That needs
pointwise scoring against a rubric, which is a different instrument.

**Q6.** No — and 82% is a good number, which is what makes this the trap.

S-067 reports strong judges reaching *"over 80% agreement, the same level of
agreement between humans"*. Read the second half: at 82%, **roughly one
judgement in five differs from a human's.** So the judge is a measuring
instrument with an 18% error rate, and every number it produces inherits that.

Practically that means: report the judge's error rate alongside its output;
never use it as the label a human decision is graded against; and use it where
an 18% error is tolerable — ranking many candidates, flagging cases for human
review — rather than where it is not, like a release gate on a safety property.

Also worth checking before believing 82%: what does *chance* agreement look
like? If 80% of the golden set has the same label, two labellers agree 68% of
the time by accident. That is what Cohen's kappa strips out, and it is
implemented here for exactly this reason.

**Q7.** Compare the label to being right, over a set that contains cases the
system gets **wrong**.

Group outputs by band, and within each band measure the proportion that were
correct against an independent gold label — independent being the load-bearing
word, since a gold label derived from the system's own output makes the
experiment circular.

Then look for two things. Does correctness *rise* with the band? And do the
intervals **separate**? A high band at 90% and a low band at 85% on twenty cases
each has proved nothing.

Our own run is the cautionary version: both bands scored 100% over twelve
queries. Correctness did not decrease, which is technically a pass and actually
means the experiment could not run — **there were no wrong answers to separate**
(FR-37). The fix is a harder query set, not a code change.

**Q8.** Push back on the single number, and give them something better than a
refusal.

A single score has to weight a cross-tenant leak against a latency regression,
and any weighting makes one of them absorbable. That is `F16.7`, and it is how
"95% overall" ends up on a dashboard above a breach.

What I would build instead: a small board of **dimension-specific gates**, each
red or green on its own terms — tenancy, authorization, credentials,
irreversible actions, retrieval floor, detector false-positive rate, task
success, latency. Green across the board is the shippable state, and it reads
just as fast as a number.

If they still want one figure, the honest one is a **count of failing gates**
weighted by nothing — "0 gates failing" or "1 critical gate failing" — which
carries the severity rather than dissolving it.

The reason to hold the line: a dashboard is read by people deciding whether to
ship. A number designed to be reassuring will reassure them.

---

## 14. Reflect

**What do all our numbers, taken together, support?**

Less than the sum, and the shortfall is structural rather than anyone's fault.
165 cases, 0 datasets with an enforced split before this chapter, 8 of 8 written
by the person fixing the system they measure. Every chapter's numbers describe
**fit**. None of them describes **generalisation**, and until this chapter
nothing in the repository could have told the difference.

**The moment that earned the chapter** was row two of §4. I found a real bug
with a golden set, fixed it, and watched development recall hit 100% while the
holdout sat unmoved at 75%. Fifteen minutes of work that looked like an
improvement and was an overfit — and the *only* reason I know that is that ten
cases existed which I had agreed not to read.

That is a small experiment with an uncomfortable implication for the twelve
chapters behind it. Every one of them fixed defects using the cases that
measured them. Several reported perfect scores afterwards. **I have no way to
know how many of those were the same shape**, because there was no holdout to
disagree.

**What changed in how I read an evaluation result.** The number is now the least
interesting part. What I want first is the denominator, then the interval, then
which cells were empty, then whether anyone could have seen the answers. A
result without those is not wrong — it is unfalsifiable, which is worse.

**The one that will not go away.** Two chapters have now been written around an
absent model. This chapter built the judge apparatus, the rubric, the bias
probes and the validation protocol, and validated all of it against a stub —
which tests the *harness* and establishes nothing about a judge. The core
experiment the chapter map asks for is built and unexecuted, and the blocker is
one environment variable.

---

## 15. Artefacts

**Source** — `experiments/01-request-response-app/src/evaluation/`
`dataset.mjs` (closed case schema, enforced splits, contamination, holdout
hash) · `metrics.mjs` (rate with population, Wilson, confusion with required
negatives, kappa, calibration) · `coverage.mjs` (matrix, tiers, gates) ·
`judge.mjs` (rubric, pointwise, pairwise, three probes, validation protocol)

**Data** — `evaluation/datasets/golden/secret-detector-v1.json`, 30 cases,
13 negatives, dev/holdout, human-labelled

**Harnesses** — `eval/audit-evaluations.mjs` · `eval/characterise-detectors.mjs`
(`--holdout` to spend the holdout, and it says so)

**Fix** — `src/mcp/credentials.mjs`, FR-35

**Tests** — `tests/evaluation.test.mjs`, 50 tests in eight suites (E1–E8).
Suite total 603.

**Records** — `failures.md` FR-35…FR-37 · `00-master/05 — Failure Taxonomy.md`
F16.1–F16.17 · `research/source-registry/source-registry.md` S-066–S-067,
G-63–G-68

---

## 16. Sources

**S-066** — Anthropic, *Create strong empirical evaluations*. Retrieved 2 Sep
2026. Three design principles, and an edge-case list that became the golden
set's negative controls. Its third principle — *"More questions with slightly
lower signal automated grading is better than fewer questions with high-quality
human hand-graded evals"* — is the one this chapter partly resists: our largest
dataset is 30 cases, so we have neither volume nor the pretence of it, and the
honest response is wide intervals rather than a bigger-sounding number.

**S-067** — Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot
Arena* (arXiv:2306.05685). Retrieved 2 Sep 2026, abstract only. Position,
verbosity and self-enhancement biases; the 80% agreement figure, used here for
the reading the paper supports and people usually skip.

**Video: none.** Nothing retrieved met the bar.

**Gaps opened:** **G-63 (judge validation built, NOT RUN — blocked by G-18)**,
G-64 (one labeller, who also wrote the detector), G-65 (the confidence band is
untested as a predictor), G-66 (seven empty dataset directories, now reported),
**G-67 (seven of eight datasets have no holdout — blocking for any
generalisation claim)**, G-68 (evaluation cost is wall-clock only).

---

## 17. Handoff to Chapter 14

Chapter 14 is **Observability & Production Behaviour**, and this chapter hands
it three things.

**Every number so far is offline.** 165 cases, all synthetic, all authored.
Production is the only place a real task distribution exists, and S-066's first
principle — *"Design evals that mirror your real-world task distribution"* —
cannot be satisfied by a dataset nobody sampled from users.

**The empty cells are a sampling plan.** §6 reports which combinations were
never tried. Production traffic is where you find out which of them matter,
which is the difference between a coverage matrix and a wish list.

**The instruments now exist and are untested against reality.** Wilson
intervals, confusion matrices, calibration bands, dimension-specific gates —
all of them work on 30 cases in a test file. Chapter 14 gets to find out what
they say about a system that real people are using, and whether the gates fire
when something is actually wrong rather than when a test fixture changes.
