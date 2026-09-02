# 03 — Testing & Evaluation Foundations · **Part A**

**Status:** Part A · v1.0 · 31 August 2026
**Part B does not exist yet, and cannot be written until the exercise in §9 is
complete.**

---

```
LEARNING PATH — Part A

LEARN     NIST's glossary on verification, validation, evaluation, measurement
          and monitoring (S-034) · Morville's UX Honeycomb (S-032) · Google's
          HEART and Goals–Signals–Metrics (S-033) · Anthropic on success
          criteria (S-005)
WATCH     VIDEO COVERAGE: PARTIAL — see §11
BUILD     Nothing runs. No API key. The artefact you build is a judgement
TEST      A deterministic suite that passes on a terrible output
BREAK     Your own criteria, against eight cases chosen to break them
REFLECT   Deferred to Part B, on purpose — reflection before the disagreement
          is speculation
```

**No model is involved in Part A. No API key is required. Nothing is automated.**

---

## 1. The problem

Chapter 02 ended with a moment worth staring at.

Thirty-two tests passed. The application would not load at all — a blank page,
nothing working, because a module import returned `404` and no test could see it.
Both facts were true at the same moment.

That was a *deterministic* system. Deskline has right answers. A question is
saved or it is not; a status code is 403 or it is not. And even there, a green
suite could not tell us the product was broken.

Now hold that thought and consider what Chapter 04 introduces: a system whose
output is **different every time**, where there is no single correct answer to
compare against, and where the wrong answer is *fluent* — constructed, by the
mechanism itself, to look exactly like a right one.

If a test suite could not catch a blank page, what do you imagine it will do
about a paragraph that is plausible and wrong?

This chapter is the answer, and it starts a long way from AI. It starts with a
question that turns out to be much harder than it sounds:

> **What does *good* mean, and how would we know?**

## 2. Why this chapter is here, and here specifically

The chapter map originally put this after your first model call. It was moved
forward, and the reason is in `00-master/01 — Learning Architecture.md`:

> Under that ordering the reader builds something whose output has no single
> correct answer *before* owning any vocabulary for judging it — and the reflex
> that forms is "it looks right."

That reflex is the failure the whole handbook is arranged against. Once it forms
it is very hard to remove, because it feels like judgement.

So: vocabulary and practice first, on outputs where nothing is probabilistic and
nothing is fashionable. **If a criterion cannot survive contact with an error
message, it will not survive contact with a language model.**

`[Design interpretation]` There is a second reason, and it is about you rather
than the material. Evaluating output quality is **design work**. It is not a
thing engineering does and shows you afterwards. The moment a team writes down
what *good* means, they have made a product decision — usually without noticing,
frequently in a hurry, and almost always without a designer present.

---

## 3. Five words that are not synonyms

Five words get used interchangeably in almost every team, and the confusion is
expensive. Here they are with authoritative definitions, and each one grounded in
something Deskline actually did.

`[Documented behaviour]` All definitions below are from **NIST's glossary
*The Language of Trustworthy AI*** (S-034), which collects definitions from
ISO/IEC, IEEE and DOD sources. NIST is explicit that its goal *"is not to declare
one specific meaning for identified terms, but to provide interested parties with
a broader awareness of the multiple meanings."* Treat these as the field's
vocabulary, not as the last word.

### Verification — *did we build it correctly?*

> `[Documented behaviour]` "provides evidence that the system or system element
> performs its intended functions and meets all performance requirements listed
> in the system performance specification…; answers the question, **'Did you
> build the system correctly?'**"
> — NIST glossary (S-034), citing DOD TEVV

**In Deskline.** `T-14` asserts that reading another user's question returns
`403`. That is verification: we specified 403, we got 403.

### Validation — *did we build the right thing?*

> `[Documented behaviour]` "Confirmation, through the provision of objective
> evidence, that the requirements for a specific intended use or application have
> been fulfilled."
> — NIST glossary (S-034), citing IEEE
>
> "…answers the question, **'Is it the right solution to the problem?'**"
> — same entry, citing DOD TEVV

**In Deskline.** Nothing. Not one thing in either previous chapter was
validation, and that is not an oversight — it is a fact worth sitting with. We
verified extensively. Nobody ever asked whether a person with a real question
needed Deskline.

`[Design interpretation]` This pair is the single most useful thing in the
section. **Verification asks whether the thing works. Validation asks whether it
should exist.** A product can be perfectly verified and completely invalid, and
the entire apparatus of testing will report success the whole way.

### Testing — *does observed behaviour match a specified expectation?*

> `[Documented behaviour]` "any activity aimed at evaluating an attribute or
> capability of a program or system and determining that it meets its required
> results."
> — NIST glossary (S-034), citing Hetzel

**In Deskline.** All 32 of them. Note the shape: a test needs *a specified
expectation to compare against*. No specification, no test.

### Evaluation — *how good is it, against defined criteria?*

> `[Documented behaviour]` "(1) systematic determination of the extent to which
> an entity meets its **specified criteria**; (2) action that assesses the value
> of something."
> — NIST glossary (S-034), citing ISO/IEC 24765

**In Deskline.** Also nothing — until §9 of this chapter.

`[Design interpretation]` Look at what the definition requires: **specified
criteria**. Not "expert opinion", not "taste". If the criteria are not written
down, what is happening is not evaluation; it is preference, and preference
cannot be disagreed with productively because there is nothing to point at.

The difference from testing is narrower than people assume and matters more:

| | Testing | Evaluation |
|---|---|---|
| Asks | Did the specified thing happen? | How good is this, against defined criteria? |
| Answer shape | Pass / fail | A judgement, usually graded |
| Needs | A specification | Criteria, and someone to apply them |
| Can two careful people differ? | **Almost never** | **Routinely — and that is information** |

That last row is the reason Part A exists as an exercise rather than a lecture.

### Measurement — *how do we represent it?*

> `[Documented behaviour]` "act or process of assigning a number or category to
> an entity to describe an attribute of that entity."
> — NIST glossary (S-034), citing ISO/IEC 24765

**In Deskline.** The `ms` field in every log line. `640` is a measurement.

**Note what measurement is not.** Assigning the number is a separate act from
deciding the number matters, and from deciding what value is acceptable. A great
deal of bad practice lives in that gap: a system is measured thoroughly, and
nobody ever said what a good result would be.

### Monitoring — *how do we keep watching?*

> `[Documented behaviour]` "Continual checking, supervising, critically observing
> or determining the status in order to identify change from the performance
> level required or expected."
> — NIST glossary (S-034), citing NIST SP 800-160

**In Deskline.** Not implemented. The logs exist; nobody watches them.

### And the one that contains all of them

> `[Documented behaviour]` **TEVV** — Test and Evaluation, Verification and
> Validation — *"A framework for assessing, incorporating methods and metrics to
> determine that a technology or system satisfactorily meets its design
> specifications and requirements, and that it is sufficient for its intended
> use."*
> — NIST glossary (S-034), citing the NSCAI report

`[Our observation]` This closes gap **G-01**, open since 30 August. Two earlier
research passes failed to retrieve NIST's own definitions; this one succeeded
because the glossary is published as a spreadsheet and the CSV export was
fetchable when the pages around it were not. The framework's §0 vocabulary was
labelled *our synthesis* until now. It can be attributed.

### The summary that matters

```
VERIFICATION   Did we build it correctly?      Deskline: extensively
VALIDATION     Should it exist at all?          Deskline: never asked
TESTING        Did the specified thing happen?  Deskline: 32 times
EVALUATION     How good is it, by what criteria? Deskline: never — until §9
MEASUREMENT    What number describes it?         Deskline: latency, in ms
MONITORING     Is anyone still watching?         Deskline: no
```

Four of six are honestly "no". That is a fair picture of most software.

---

## 4. Testing and evaluation, on the same output

Definitions are cheap. Here is the distinction as something you can watch happen.

An internal service fails a database write and returns this to a client, which
renders the `message` field straight to the user:

> Error code 0x80070057 occurred in module DBWRITE (attempt 1 of 1). See
> documentation for details.

The client's deterministic checks:

| Check | Result |
|---|---|
| Response body is valid JSON | **PASS** |
| Required fields `code`, `module`, `message` all present | **PASS** |
| HTTP status is in the expected set | **PASS** |
| `message` is between 10 and 200 characters | **PASS** |

**Four out of four. Green.**

Now read the message again as the person who was trying to save something.

They do not know what happened. They do not know whether their work exists. They
do not know what to do. `0x80070057` is not addressed to them — it is addressed
to somebody with access to a source tree. And *"attempt 1 of 1"* quietly informs
a reader who parses it that no retry occurred, which is the only genuinely useful
thing in the sentence and is buried in a parenthesis.

Nothing failed. Every specified expectation was met. The output is unusable.

> **The tests were not wrong.** They tested structure, and the structure is
> perfect. They cannot test the thing that is broken, because nobody specified
> it, because it is not specifiable in that form.

### Three properties, not one

This is the distinction to carry into every later chapter:

```
STRUCTURAL VALIDITY   Is it well-formed?
                      Valid JSON, required fields, status in range, length ok.
                      Deterministic. Cheap. Automatable today.
        ≠
SEMANTIC QUALITY      Is what it says true, relevant, clear, actionable?
                      Requires judgement against criteria.
        ≠
PRODUCT QUALITY       Did a person achieve what they came to do?
                      Requires a person, with a goal, in a real situation.
```

**Each is necessary. None substitutes for the one after it.** A response can be
structurally perfect and semantically useless (the case above). It can be
semantically excellent and still not help anyone, if it answers a question nobody
had.

And the direction of that dependency is worth noticing: structural validity is
the cheapest to check and the least informative. **The three get harder to
measure in exactly the order they get more important**, which is why teams drift
toward measuring the first one and calling it quality.

`[Design interpretation]` In Chapter 04, "did the model return valid JSON" will
be a real and useful check — the Level A discipline from the framework, and worth
having. It will also be almost completely uninformative about whether the output
was any good. Both of those will be true at once, exactly as they are here.

---

## 5. Correct, useful, truthful, clear, safe — and why the chain breaks

The core question — *what does good mean?* — resists a single answer because the
properties we want come apart. Not in edge cases. Routinely.

**Correct is not necessarily useful.** `HTTP 403` is correct. Shown to a user as
"403", it is useless.

**Useful is not necessarily truthful.** "Don't worry, everything's saved
automatically" is enormously useful to someone anxious about losing work. If the
editor only saves while the tab is focused, it is also false, and the person will
find out at the worst possible moment.

**Truthful is not necessarily clear.** Every word of *"Error code 0x80070057
occurred in module DBWRITE"* may be true. It communicates nothing.

**Clear is not necessarily safe.** *"Room B is booked by Priya Raman for
'Redundancy consultation — R. Okafor'"* is beautifully clear. It has also told a
stranger that a named colleague is being made redundant.

**Safe is not necessarily usable.** *"This action is not available."* leaks
nothing whatsoever, and leaves the user with no idea what happened, why, or
whether waiting would help.

**And passing a technical test is not passing a product evaluation.** §4.

`[Design interpretation]` Each link in that chain breaks in the same way: **a
property that is genuinely good, maximised on its own, at the cost of another
property that was also required.** This is not a list of mistakes. It is a list
of trade-offs, and a rubric that cannot express a trade-off will keep scoring
these as unqualified successes.

---

## 6. Criteria, before scoring

You cannot evaluate against criteria you have not written down. Writing them
afterwards means writing them while looking at the answers, which produces
criteria that fit what you already thought.

`[Documented behaviour]` Anthropic's guidance on success criteria (S-005) asks
for criteria that are **specific, measurable, achievable and relevant**, notes
that *"Most use cases need multidimensional evaluation along several success
criteria"*, and gives the contrast between a weak criterion — "Safe outputs" —
and a strong one: *"Less than 0.1% of outputs out of 10,000 trials flagged for
toxicity by the content filter."*

The full provisional set is in
`evaluation/rubrics/provisional-criteria-v0.1.md`. Six criteria:

| | Asks |
|---|---|
| **Truthfulness** | Does it state only things actually true of the system? |
| **Honesty about uncertainty** | Where the system does not know, does it avoid implying it does? |
| **Relevance** | Is it about what happened, to this person, now? |
| **Clarity** | Understandable on one read, by its intended reader? |
| **Actionability** | Does the reader know what to do next — and can they do it? |
| **Safety and privacy** | Does it expose nothing it shouldn't, and invite no harm? |

Scale: **1 Poor · 2 Weak · 3 Acceptable · 4 Good · 5 Strong**, plus `n/a`.

### Six, and the argument for keeping it small

Every criterion costs attention on every case, forever. A criterion that never
changes a decision is pure overhead — and worse, it dilutes the ones that do,
because it contributes to any average.

Two were deliberately cut:

**"Tone"** — real, and almost entirely a consequence of the others. A message
that is truthful, relevant, clear and actionable rarely has a tone problem left
over.

**"User effort"** — folded into Actionability, because in practice they were
never independent. A recovery path that costs ten minutes of re-typing is not a
5 for actionability; the criterion already has to account for it.

### The one that will be argued about

**Truthfulness** and **Honesty about uncertainty** look like one criterion. They
were nearly merged. Here is why they are separate, and it is the sharpest idea in
the framework:

> **An output can contain zero false statements and still leave the reader
> confidently wrong.**

It does this by omission — stating the more likely of two possibilities without
mentioning there were two. Nothing false was said. Someone was misled anyway.

If those are one criterion, that failure scores well and vanishes. Whether the
split survives contact with real cases is a genuine open question, and the
evaluation sheet asks about it directly.

### Honeycomb and HEART: taken from, not applied

Both were considered.

**Morville's UX Honeycomb** (S-032) — *useful, usable, desirable, findable,
accessible, credible, valuable* — built, in his words, *"to help clients
understand why they must move beyond usability."* Three facets map onto our
criteria: **Useful** → Relevance and Actionability; **Usable** → Clarity;
**Credible** → Truthfulness and uncertainty.

**Findable, Desirable and Accessible** are properties of a system or interface
and cannot sensibly be rated on a single message. **Valuable** is a business
property invisible from one output.

**Google's HEART** (Rodden, Hutchinson & Fu, CHI 2010, S-033) — *Happiness,
Engagement, Adoption, Retention, Task success*, with Goals–Signals–Metrics. HEART
is **product measurement across a population over time**. Using it to score a
single error message would be a category error. It belongs to the later chapter
about whether the product creates value — claim 5, which nothing in this exercise
touches.

Two things from that paper do transfer, and both are load-bearing:

`[Documented behaviour]` *"It is not always appropriate to employ metrics from
every category, but referring to the framework helps to make an explicit decision
about including or excluding a particular category."*

That is precisely the licence taken above. **A framework can earn its place by
making an exclusion explicit rather than accidental.**

`[Documented behaviour]` *"Choose signals that are sensitive and specific to the
goal — they should move only when the user experience is better or worse, not for
other, unrelated reasons."*

The same test applies to a criterion. **A criterion that moves for reasons
unrelated to quality is noise wearing a number.** If Clarity scores start
tracking message length rather than comprehensibility, it has stopped measuring
what it claims to — and it will keep producing numbers the whole time.

`[Design interpretation]` Both frameworks are being *drawn from* rather than
*applied*, and that is the intended use. Mechanically scoring seven Honeycomb
facets on an error message produces seven numbers, five of which mean nothing —
which is worse than not having them, because they will be averaged in with the
two that do.

---

## 7. Not all criteria are equal

Here is a genuine output, scored:

| Criterion | Rating |
|---|---|
| Clarity | **5** |
| Actionability | **5** |
| Relevance | **5** |
| Truthfulness | **5** |
| Honesty about uncertainty | n/a |
| **Safety and privacy** | **1** — it named a colleague and the subject of their meeting |

Arithmetic mean of the five that apply: **4.2 out of 5.**

The arithmetic is correct. The conclusion would be catastrophic.

### Compensatory and non-compensatory

Most criteria **compensate**. Clarity 5 / Relevance 3 is plausibly better than
4 / 4. Trading them off is reasonable, and an average is a way of expressing that
trade.

> **A non-compensatory criterion is one where a sufficiently bad score cannot be
> offset by any score on anything else.**

Safety and privacy is the obvious candidate. Truthfulness may be another.

Note what has gone wrong in the table above — it is not the number, it is the
question. *"How does this output score on average"* and *"should this ship"* are
different questions. The average answers the first one perfectly well. Nobody
asked it.

`[Design interpretation]` **This is the shape of nearly every serious AI failure
you will meet later.** A model that is helpful, articulate and correct 97% of the
time and leaks training data 3% of the time scores superbly on average.
An aggregate is a compression, and **compression works by discarding what is rare
— which is exactly where the failures live.**

The framework's F8.4 names this: *aggregate score hid a category failure.*

### What is deliberately not decided yet

Which criteria are non-compensatory, what threshold disqualifies, and whether to
aggregate at all — **none of that is settled**, and settling it before grading
real cases would be guessing.

The sheet has a separate `Critical failure? Yes / No` flag for exactly this
reason. It is recorded **independently of the numbers**. If a case is flagged
critical while every rating is 4 or 5, that contradiction is data about the
criteria — not a mistake by the grader.

---

## 8. Do not aggregate. Not yet.

There is no total column on the evaluation sheet. This is deliberate and it will
be uncomfortable.

An aggregate feels like progress. `4.2/5` is portable — it goes in a slide, it
compares across versions, it sounds like measurement. It is also, at this stage,
a way of not looking at the thing.

Two questions to hold while grading, both left open on purpose:

> **If an output scores Clarity 5, Usefulness 5, Privacy 1 — should its average
> determine whether it ships?**

> **If two outputs both average 4.0, and one got there with straight 4s while the
> other got there with 5s and a 2 — are they equally good?**

Answer them for yourself during the exercise. Part B will collect the answers.

---

## 9. The exercise

**This is the checkpoint for Part A.** There is no quiz at the end of this
chapter, because a quiz about evaluation would be a test of reading, and the
whole argument of the chapter is that those are different things.

### What is frozen

Committed before anyone graded anything:

| Artefact | Path |
|---|---|
| 20-case dataset | `evaluation/datasets/product-outputs/dataset-v1.md` |
| Provisional criteria v0.1 | `evaluation/rubrics/provisional-criteria-v0.1.md` |
| The 8 exercise cases | `evaluation/human-evaluation/exercise-01-cases.md` |
| Your evaluation sheet | `evaluation/human-evaluation/exercise-01-sheet.md` |

**Why frozen, and why it is committed rather than merely written.** The same
reason Chapter 01's `T-23` caught a false test: **a standard written after you
have seen the results is not a standard.** If the cases can be reworded once the
disagreements appear, the disagreements get edited away instead of understood —
and the process would feel like it was working the entire time.

The commit is the proof that the criteria pre-date the answers. It is checkable
by anyone, including you, and it does not rely on anybody's memory of the order
things happened in.

### The dataset

Twenty product outputs. Several are Deskline's real shipped messages. The rest
are constructed to cover combinations that come apart: technically correct with
poor UX, helpful but misleading, truthful but unhelpful, safe but frustrating,
verbose and accurate, concise and missing the critical thing, an appropriate
refusal, an unnecessary refusal, uncertainty communicated well, uncertainty
hidden, two responses with different trade-offs.

**They are product outputs, not AI outputs.** Error messages, confirmations,
refusals, help text. If these concepts only work on model output, they are not
concepts — they are a fashion.

The dataset records only `Scenario`, `System reality`, `Output`, and sometimes
`Context`. **No expected rating, no preferred answer, no failure classification,
no explanation.** A dataset carrying its own answers cannot tell you what two
people think; it can only tell you whether they agree with whoever wrote it.

### The eight

Eight of the twenty, chosen to **maximise disagreement** rather than to be
representative. A set everyone agrees about teaches nothing about the criteria.

Seven are judged **pointwise** — one output, against the criteria. One is
**pairwise** — two responses to the identical situation, where you say which is
better, why, and then, separately:

> **Would you actually accept either one?**

`[Design interpretation]` That last question is the point of including a
comparison at all. **"A beat B" and "A is good" are different findings.** It is
entirely possible for the winner of a comparison to be unacceptable — and a
process that only ever compares will never notice, because there is always a
winner. Keep the two separate now, by hand, and the formal vocabulary later will
attach to something you have already felt.

### Two graders

Grader 1 is you. Grader 2 grades the same frozen text afterwards, **without
seeing your sheet.**

The disagreement is not a problem to be minimised. It is the finding. Every
place two careful readers diverge is one of:

```
unclear criterion  ·  ambiguous scenario  ·  genuinely different values
different reading of the scale  ·  missing context  ·  grader inconsistency
```

Those are six different problems with six different fixes, and **only the first
two are fixed by rewriting the rubric.** A disagreement rooted in different
values cannot be resolved by better wording — it has to be decided, by someone
with the authority to decide it. Discovering which kind you have is the whole
exercise.

`[Design interpretation]` **This is also the entire foundation for automated
evaluation**, which is why it is being done by hand first. Later, something will
grade outputs at scale, and the only way to know whether to believe it is to
compare it against human labels. If you have never produced human labels, you
have nothing to compare against, and the automated scores become authoritative by
default — which is `F8.3`, *unvalidated judge treated as ground truth*, and the
most expensive failure in this handbook's taxonomy.

**Somebody has to grade something by hand.** Google's own judge-validation
documentation requires *"an evaluation dataset with human ratings as the ground
truth"* before a judge can be trusted at all. That requirement is where this
exercise comes from, and there is no shortcut through it.

### How to do it

1. Read `evaluation/rubrics/provisional-criteria-v0.1.md`.
2. Read `evaluation/human-evaluation/exercise-01-cases.md`.
3. Fill in `evaluation/human-evaluation/exercise-01-sheet.md`.
4. **Grade in order, X-1 to X-8, and do not go back and adjust.** If your
   standard shifts partway through, that shift is a finding. Smoothing it out
   erases the most interesting thing this can tell us.
5. Answer the four questions at the end of the sheet — they are about the
   *instrument*, not the cases, and they are the part most likely to change v0.2.

Expect roughly 30–45 minutes. Rushing it produces agreement, and agreement here
is the uninformative outcome.

### What Part B will do

1. Grader 2 grades the same eight frozen cases.
2. The two sets are compared and every disagreement located.
3. Each disagreement is classified against the six causes above.
4. Criteria revised to v0.2, with the revision recorded rather than made
   silently.
5. Selected cases re-graded.
6. **Whether agreement actually improved** is checked — because revising a rubric
   always *feels* like an improvement, and feeling is not measurement.

Part B also introduces the formal vocabulary for what you will have already done
by hand, and the Chapter 03 Learning Checkpoint.

**Still not in Part B:** LLM-as-a-judge, automated rubric grading, judge
calibration. Those need a validated human baseline to exist first, and after Part
B one will.

---

## 10. What Part A has established

**Vocabulary, with sources.** Verification, validation, testing, evaluation,
measurement, monitoring — six distinct activities, four of which Deskline never
performed.

**That structural validity, semantic quality and product quality are three
different properties**, get harder to measure in exactly the order they get more
important, and that a green suite says nothing about the two that matter most.

**That the properties of a good output come apart** — correct/useful,
useful/truthful, truthful/clear, clear/safe, safe/usable — routinely, not
exceptionally.

**That criteria must be written before scoring**, and committed, so that the
standard cannot follow the results.

**That criteria are not equal**, and that an average is a compression which
discards exactly what is rare — which is where the failures live.

**And what it has not established:** whether these six criteria are any good.
Nobody knows. That is §9's job, and it needs a human.

---

## 11. Sources

**Read**
1. NIST, *The Language of Trustworthy AI: An In-Depth Glossary of Terms*
   (NIST.AI.100-3) (S-034) — retrieved 31 Aug 2026. **Closes gap G-01.**
2. Morville, *User Experience Design* — the UX Honeycomb (S-032) — retrieved 31 Aug 2026
3. Rodden, Hutchinson & Fu, *Measuring the User Experience on a Large Scale*,
   CHI 2010 — HEART and Goals–Signals–Metrics (S-033) — retrieved 31 Aug 2026
4. Anthropic, *Define your success criteria* (S-005) — retrieved 30 Aug 2026

**Watched — VIDEO COVERAGE: PARTIAL**

`[Our observation]` **No video was added for Part A.** Searched for material on
testing versus evaluation, evaluation criteria, and human evaluation. What
surfaced was either about LLM benchmarks — which require model knowledge Part A
deliberately does not assume, and which push toward exactly the aggregate scoring
§8 argues against — or about LLM-as-a-judge, which Part A defers on purpose.

The one relevant registered video, **V-001** *LLM as a Judge*, is **deliberately
withheld until after the exercise.** Watching it first would supply the
conclusion the exercise is supposed to produce.

Recorded as a gap rather than filled. Revisit in Part B, where the judge material
becomes appropriate.

## 12. Artefacts

```
evaluation/datasets/product-outputs/dataset-v1.md      20 cases, unlabelled
evaluation/rubrics/provisional-criteria-v0.1.md        6 criteria + scale
evaluation/human-evaluation/exercise-01-cases.md       the 8 selected
evaluation/human-evaluation/exercise-01-sheet.md       ← fill this in
```

**Part B begins when the sheet is complete.**


---

# 03 — Testing & Evaluation Foundations · **Part B**

**Status:** Part B · v1.0 · 31 August 2026
**Requires:** Part A, and the completed exercise. Do not read this first.

---

```
LEARNING PATH — Part B

LEARN     Google on pointwise/pairwise and static/adaptive rubrics (S-014, S-016,
          S-017) · calibration against human labels (S-010) · agreement metrics
          (S-016, S-018) · HEART's own scope caveat (S-033)
WATCH     V-001 LLM as a Judge — appropriate NOW, and not before. See §12
BUILD     The evaluation laboratory: a comparison, a taxonomy, rubric v0.2
TEST      v0.2 against the five cases v0.1 struggled with
BREAK     Naive averaging · an ambiguous criterion · a hidden omission · a
          verdict disagreement from identical scores · an `n/a` rule that fires
          backwards
REFLECT   What we learned about evaluating outputs before AI enters the system
```

---

## 1. What the exercise actually produced

Two graders. Nine outputs. Six criteria.

They agreed on the verdict in **six of nine** cases and on the Critical flag in
**seven of nine**. Their individual criterion scores landed within one point of
each other **88% of the time**.

That sounds like a working instrument. It is not, and the reason is the whole of
this chapter:

> **Six of the nine verdicts were decided by rules that were not in the rubric.**

Both graders discovered this independently and said so in almost the same words.

> Grader 1: *"some failures invalidate the whole output regardless of the other
> scores."*
> Grader 2: *"three of my four rejections turn on a single column while every
> other column is 4 or 5. If these scores were ever averaged, all three would
> ship."*

The rubric was measuring one thing while the decision was made somewhere else.
**That is the failure Part B exists to diagnose**, and it is far more common than
a rubric that produces wrong numbers — because it produces *right-looking*
numbers that do not predict the conclusion.

## 2. Provenance, before anything is claimed

| | Grader 1 | Grader 2 |
|---|---|---|
| Who | Hari, **with assistant support** | A Claude subagent |
| Context | Full project, including the chapters where three of these outputs were designed | Four frozen files. No chapters, no history, no Grader 1 answers |
| Independent human? | **No** | **No** |

**Nothing in this chapter claims human-versus-AI agreement, inter-human
reliability, or statistical validation.** This is a rubric-debugging experiment
with two correlated evaluators holding different context.

The asymmetry that makes it useful anyway:

> **Agreement between correlated evaluators is weak evidence** — they agree partly
> because they are alike.
> **Disagreement is strong evidence** — two evaluators with shared priors who
> nonetheless diverge have found something the rubric genuinely fails to
> determine.

`[Our observation]` The session's main assistant could not serve as Grader 2. It
had read and transcribed Grader 1's submission and could not un-see it, so an
isolated subagent was spawned with access to exactly four files. Performing the
grading directly and calling it independent would have been the comfortable option
and a false one. **The provenance is recorded in the artefacts, not only in
conversation**, because a caveat that lives in a chat has been mentioned, not
recorded.

Full comparison: `evaluation/results/exercise-01-comparison.md`.

---

## 3. The agreements that carried structure

Not every matching number means something. Four do, and each implies a rule the
rubric did not contain.

**Both rejected X-4 — the room booking that names a colleague's redundancy
consultation — despite five scores of 5.** Grader 1's mean was 4.0; Grader 2's was
4.2. Both rejected anyway, from opposite ends of the context spectrum.

> **Rule: a non-compensatory disclosure gate.** No quality score lifted a
> disclosure. Two evaluators applied that with no rule telling them to.

**Both preferred X-7A, both rejected X-7B, both would ship A.** And both, unbidden,
wrote down the same caution:

> G2: *"A beating B is not what makes A acceptable."*
> G1: *"A beats B, but A winning does not make A ideal."*

**Both scored Truthfulness 1 exactly twice, on the same two cases**, and rejected
both — including X-3, which they both scored Clarity 5.

> **Rule: a stated falsehood is disqualifying, however well it reads.**

**Both accepted X-6 with changes**, Actionability 2, Critical No — while both
rejected X-2 at Actionability 1.

> **Rule: a *wrong* next step disqualifies; a *missing* one degrades.** Neither
> rubric version said this. Both graders applied it.

---

## 4. The disagreements, and what caused them

Six meaningful disagreements. **Not one was a disagreement about quality.**

### The `n/a` rule fired backwards

| | Grader 1 | Grader 2 |
|---|---|---|
| X-1 Uncertainty | **5** | **n/a** |
| X-2 Uncertainty | **1** | **n/a** |

Grader 2 followed v0.1's letter — *"n/a where the system genuinely knows the
answer"* — and immediately reported the consequence as a defect:

> *"a criterion whose flagship failure mode reads `n/a` on the case that most
> exhibits confident misassertion is a criterion that needs its scope written
> more carefully."*

The criterion was **written** as *is there something the system doesn't know* and
**named** as *does the output represent what the system knows honestly*. X-2 — a
message that confidently blames the wrong cause — is the purest instance of the
name and scores `n/a` under the wording.

**Cause: criterion definition.** Not values, not thresholds. A sentence.

### Clarity meant two things, and a grader called it in advance

**X-7B Clarity: 5 versus 2** — the widest cell in the exercise. Grader 1 scored
readability (*"pleasant and simple"*). Grader 2 scored situational comprehension,
and named the fork before diverging on it:

> *"If Clarity had been scored as readability, B would have won that column, and I
> think that would have been the criterion measuring the wrong thing."*

Both readings are legitimate under *"understand it on one read"*, because the
criterion never says **understand what**.

### Identical scores, opposite decisions

**X-5.** Both graders scored Honesty about uncertainty = **1**. Grader 1
rejected and flagged Critical; Grader 2 accepted with changes and did not.

Grader 2 self-reported inventing a rule mid-exercise to get there — accept if the
repair is *additive*, reject if it is *subtractive* — and flagged that the rule
appears nowhere in v0.1.

> **This is the sharpest finding available.** v0.1 contains no rule connecting a
> score of 1 to a verdict. So each grader supplied one, silently, and differently.
> **The rubric produced the numbers; the graders produced the decision.**

### And two disagreements that were never disagreements

**X-8 Relevance: 4 versus 2.** Both graders identified precisely the same defect —
the dialog omits that four tasks belong to other people — and **filed it in
different columns**, because there was no column for it. Both said so.

**X-2 Relevance: 3 versus 1.** The same shape.

`[Design interpretation]` This is the most transferable lesson in Part B and it
generalises well past evaluation:

> **When two careful evaluators disagree, the first hypothesis should be that the
> instrument has no place to put what they both see** — not that they disagree.

Debugging the rubric found more than adjudicating the graders would have.

---

## 5. The Critical flag was doing all the work

| Case | G1 Critical | G1 Safety | G2 Critical | G2 Safety |
|---|---|---|---|---|
| X-2 | **Yes** | 4 | **Yes** | 4 |
| X-3 | **Yes** | 4 | **Yes** | 2 |
| X-4 | **Yes** | 1 | **Yes** | 1 |
| X-5 | **Yes** | 5 | No | 4 |
| X-7B | **Yes** | 5 | No | 3 |
| X-8 | **Yes** | 2 | **Yes** | 2 |

**Four of Grader 1's six Critical flags sit on a Safety score of 4 or 5.** The
flag tracks no column. X-5 carries a 1 and only one grader flagged it; X-8 has
nothing below 2 and both did.

Grader 2 named the consequence exactly:

> *"the flag has no stated trigger, so it means whatever each grader decides it
> means. Two graders can produce identical numbers and opposite flags without
> either being wrong."*

### The smallest taxonomy the cases justify

Every flag either grader raised, and what actually triggered it:

| Trigger | Cases | Agreement |
|---|---|---|
| **Material falsehood** | X-2, X-3 | **Both** |
| **Unauthorised disclosure** | X-4 | **Both** |
| **Withheld decision-changing fact** | X-8; X-5; X-2 | Both on X-8, split on X-5 |
| **Harmful next step** | X-2, X-3, X-7B | Split on X-7B |

**Four.** Two commanded agreement; two were the exact locus of both verdict
disagreements — which is not a coincidence. **They were contested because nobody
had written them down.**

`[Design interpretation]` *Hidden material uncertainty* does not need a fifth
category. X-5's failure is that a decision-changing fact — a second, disagreeing
source — was withheld. **Concealed uncertainty is a species of withholding**, and
seeing that keeps the taxonomy at four instead of five. Categories that collapse
into each other are how a taxonomy becomes a checklist.

---

## 6. Material omission: does it earn a place?

Both graders reached for it. Grader 2 named it and reported misfiling a point into
Safety for want of a column. Grader 1 named it as the missing criterion:
*"Actionability asks whether the user knows what to do, but doesn't capture
whether the system helps them understand the consequences of doing it."*

**Tested honestly, the result is mixed:**

| Case | The omission | Does an existing criterion already catch it? |
|---|---|---|
| X-3 | The 30-second window | **Yes** — it is part of the falsehood |
| X-5 | The second source | **Yes** — that is the Uncertainty criterion |
| X-2 | The discarded form | **No** |
| X-8 | Four tasks belong to others | **No** |

Duplicated twice, genuinely uncovered twice.

**Decision: it earns a place — as a gate, not as a seventh quality dimension.**

The reason is its *shape*. When a decision-changing fact is withheld, the output
is not worse — it is unacceptable, whatever else it scores. X-8 is a
5-5-2-5-3-2 that both graders rejected.

> **A criterion that only ever disqualifies is a gate wearing a scale.** Putting
> it in Layer B would have produced one more number to average, which is the
> mechanism Part A §7 warned about.

---

## 7. Rubric v0.2 — three layers

Full text: `evaluation/rubrics/provisional-rubric-v0.2.md`.

```
LAYER A — GATES          Does this disqualify?      Binary. Any hit → Reject.
LAYER B — QUALITY        How good is it otherwise?  Graded 1–5.
LAYER C — DECISION RULE  How A and B produce a verdict.
```

**Layer A — four gates**, each derived from a flag an actual grader raised:

| | |
|---|---|
| **A1 Material falsehood** | Asserts what the system reality contradicts |
| **A2 Unauthorised disclosure** | Reveals what the reader is not entitled to |
| **A3 Withheld decision-changing fact** | The system had it; it would change the reader's action; it is absent |
| **A4 Harmful next step** | The stated action makes it worse or cannot succeed |

**A4 is not triggered by a missing step** — that is the X-6/X-2 rule both graders
applied. A3 carries three tests precisely so it cannot swallow everything.

**Layer B — six dimensions**, three of them repaired:

**Calibration** (was *Honesty about uncertainty*) now has four states, and `n/a`
is legitimate in exactly one of them:

| State | Situation | Score |
|---|---|---|
| A | No meaningful uncertainty, no overclaim | **`n/a`** |
| B | Uncertainty exists, represented | 4–5 |
| C | Uncertainty exists, hidden | 1–2 |
| **D** | **System knows; output overclaims or contradicts** | **1 — never `n/a`** |

This resolves X-1 toward Grader 2 and X-2 toward Grader 1 — **in opposite
directions**, which is the sign worth trusting. A rule that had simply sided with
one grader would more likely have encoded that grader's preference than fixed the
criterion.

**Clarity** now rules for situational comprehension, not readability. *"A short,
fluent sentence that leaves the reader not knowing their own state scores low,
however pleasant it is to read."*

**Discretion** (was *Safety and privacy*) is narrowed, because the old column
carried three unlike injuries — and the graders split on exactly that fork
(X-3 Safety 4/2; X-7B Safety 5/3):

| Injury | v0.2 home |
|---|---|
| Third-party sensitive disclosure | **Gate A2** |
| Advice that harms the user | **Gate A4** |
| Concealed consequence to others | **Gate A3** |
| Revealing more than needed, sub-critical | **B6 Discretion** |

`[Design interpretation]` The answer to *"should Safety split?"* was neither yes
nor no. **Most of what it carried was never a quality gradient at all.** What
remains in Layer B is the genuine gradient — X-6's existence disclosure, where the
graders sat at 3 and 4 and the verdict was unaffected. That is what a quality
dimension should look like: a spread that does not change the decision.

**Layer C — the decision rule.** Applied in order, stop at the first match:

```
1. Any Layer A gate = yes         →  REJECT
2. Any Layer B score of 1 or 2    →  ACCEPT WITH CHANGES
3. Otherwise                      →  ACCEPT
```

**No aggregation. No mean, no weighted sum, ever.** A Layer A hit is absolute, not
a heavy weight.

And the rule that resolves the X-5 split explicitly: **a single low Layer B score
does not reject.** Anything genuinely disqualifying has already been caught by a
gate — so **if a Layer B 1 feels like it should reject, that is evidence a gate is
missing**, and it gets raised as a rubric finding rather than absorbed silently
into a verdict.

**Where human judgement remains — named, not hidden:** whether a withheld fact is
decision-changing (A3); whether a next step "cannot succeed" (A4); whether
disclosure is unauthorised when the reader is authenticated and adjacent (A2).
Those three are where the remaining disagreement will live. **That is the result
of having located it, not a defect to engineer away.**

---

## 8. Re-grading five cases

Full working: `evaluation/results/exercise-01-regrade-v0.2.md`.

| Case | v0.1 verdicts | v0.2 | Reproduced? | Reason improved? |
|---|---|---|---|---|
| X-2 | Reject / Reject | Reject | ✔ | **Three named gates** replace one unexplained flag |
| X-4 | Reject / Reject | Reject | ✔ | **No misleading 4.2 is ever produced** |
| X-5 | **Reject / Accept w/ ch** | Reject | **Resolved** | Dissent becomes a specific, answerable claim |
| X-7A | Accept w/ ch / Accept | Accept | **Resolved** | Wording notes leave the verdict |
| X-7B | Reject / Reject, flags split | Reject | ✔ | Flag split and Clarity fork both closed |
| X-8 | Reject / Reject | Reject | ✔ | One named gate replaces two scattered columns |

**Nine verdicts, none reversed. Two disagreements resolved.**

**And that is worth very little as validation.** v0.2 was built from these cases;
agreeing with them was never in doubt. It is `F8.2` — *threshold set after seeing
results* — by construction, done deliberately with the consequence stated.

The finding is the **shape** of the improvement, not the score:

- **X-4** produces no aggregate to explain away. Under v0.1 both graders generated
  five excellent scores and then overrode them. An aggregate that must be
  explained away is one that will eventually be used unexplained.
- **X-8** stopped scattering. The Relevance 4-versus-2 spread was never about
  relevance; it was two people routing an unnamed defect through the nearest
  column. **Naming it removed a disagreement that had never existed.**
- **X-2** trips three gates independently. That is more information than any
  score: a rewrite must fix three separate things.

**The real test has not been run**, and cannot be on this data: apply v0.2 to
cases it has never seen — ten remain untouched in the dataset — with graders who
did not build it.

---

## 9. Pointwise and pairwise

You have now done both by hand. The vocabulary can attach to something you have
felt.

**Pointwise** — one output, judged against criteria. X-1 through X-6, and X-8.
**Pairwise** — two outputs for the same situation, judged against each other. X-7.

`[Documented behaviour]` Google implements these as two named metric classes and
— usefully — defines them by **the ground-truth column each needs for
validation**: a `PointwiseMetric` is checked against a `{metric_name}/human_rating`
column, a `PairwiseMetric` against a `{metric_name}/human_pairwise_choice` column.
— Google Cloud, *Evaluate a judge model* (S-016), retrieved 31 Aug 2026.
**These are Google's product names**, not universal vocabulary; the underlying
distinction is general.

> **The difference is what a human would have had to write down to check it** —
> a rating, or a choice. Everything else follows.

And that is exactly what you produced. On X-1 you wrote ratings. On X-7 you wrote
a choice. **They are different kinds of data and they validate different things.**

### The rule to carry forward

Both graders reached it independently, and it is the most durable thing in this
exercise:

> ## PAIRWISE WIN ≠ POINTWISE PASS

X-7A beat B. A also happened to clear every gate. **Those are two separate
findings**, and X-7 was constructed so that they could have come apart — a
comparison always produces a winner, including when both responses are
unacceptable.

`[Design interpretation]` This becomes load-bearing the moment comparison is
automated. A pipeline that ranks prompt A against prompt B will report a winner
every time, forever, with no opinion about whether anything is good. Model
selection run purely on pairwise preference will confidently pick the best of a
bad set and report it as an improvement. **Every pairwise process needs a
pointwise floor**, and v0.2's Layer A is that floor.

---

## 10. Static and adaptive rubrics

`[Documented behaviour]` Google distinguishes **static rubrics** — *"a single,
fixed set of scoring guidelines to every example in your dataset"*, one numeric
score per prompt — from **adaptive rubrics**, which generate *"a unique set of
pass or fail rubrics for each individual prompt"*, described as *"similar to unit
tests in software development"* and run in two steps: rubric generation, then
validation producing *"a clear Pass or Fail verdict and a rationale"*. Google
recommends adaptive as the default.
— Google Cloud, *Gen AI evaluation service overview* and *Define your evaluation
metrics* (S-014, S-015).

You have now seen why, without any of that tooling.

> **"4.1 out of 5" versus "rejected: A3 — the dialog withheld that four of these
> tasks belong to other people."**

The first is portable, comparable, and tells you nothing to do. The second names
the defect, names the fix, and cannot be averaged away.

X-4 makes the point at its strongest. **A static-rubric mean of 4.2 on an output
that discloses a colleague's redundancy consultation.** The arithmetic was
correct; the question was wrong.

`[Design interpretation]` v0.2's Layer A is, in effect, a small hand-written
adaptive rubric — four pass/fail tests rather than a scale. That is not a
coincidence; it is what the cases pushed toward. **Specific failure criteria are
more actionable than a scalar score**, and the reason is structural: a score
compresses, and compression discards what is rare, and what is rare is where the
failures live.

**Not implemented here.** Generated rubrics and judge validation belong to
Chapter 13. The principle is what Part B establishes.

---

## 11. Deterministic and judgement-based evaluation

The framework's rule, now with worked examples from your own repository:

> **Use the lowest-cost, most deterministic evaluator that can validly measure the
> property.**

| Deterministic — machine-checkable | Judgement — needs criteria and a grader |
|---|---|
| Required field present | Clarity |
| HTTP status in the expected set | Helpfulness |
| Body is valid JSON | Appropriate uncertainty |
| Timeout fired before the deadline (`N-04`) | Material completeness |
| Message length within range | Acceptable recovery guidance |
| No secret appears in the output | Whether a fact is decision-changing |

**Both halves of the rule bite.**

*Do not use judgement where a deterministic check is valid.* Asking a grader
whether the response is valid JSON is expensive, slower, and less reliable than
`JSON.parse`.

*Do not use deterministic checks as a substitute for semantic or product quality.*
Part A's worked example — `Error code 0x80070057 occurred in module DBWRITE` —
passes four deterministic checks and is unusable. Chapter 02's F-07 is the same
lesson at a different layer: **32 green tests over an application that would not
load**.

`[Design interpretation]` And notice where v0.2's gates sit. A1 through A4 are
*judgement* gates — a machine cannot yet decide whether a withheld fact is
decision-changing. But **some of them decompose**: "no third-party name appears in
this message" is a deterministic check that would have caught X-4. Part of A2 can
be pushed down to Level A. **Most "we need a judge" problems are partly Level A
problems that have not been decomposed yet.**

---

## 12. Agreement metrics — and why not to report one here

`[Documented behaviour]` For judge validation Google publishes **2-class balanced
accuracy** — `(1/2)*(TPR + TNR)` — and **balanced F1** for binary scores and
two-way preferences; **multiple-class** versions for scales such as 1–5 or
preferences including *Tie*; and a **confusion matrix** with labels.
— Google Cloud, *Evaluate a judge model* (S-016).

`[Documented behaviour]` Its AutoSxS pipeline additionally reports **Cohen's
Kappa**, *"a measurement of agreement between the autorater and human raters that
takes the likelihood of random agreement into account"*, with published
interpretation bands from *"worse than or equivalent to random chance"* through to
*"nearly perfect"*.
— Google Cloud, *Run AutoSxS pipeline* (S-018).

**None of that may be computed from this exercise as evidence**, for five reasons:

1. **n = 9**, one rater pair, and the cases were chosen *to maximise
   disagreement* — which biases every number in an unquantifiable direction.
2. **The graders are not independent humans.** One assistant-assisted, one an AI,
   correlated by training. Agreement between correlated evaluators is not evidence
   about the world.
3. **The scores are ordinal.** The gap from 1 to 2 is not the gap from 4 to 5.
4. **Some cells are `n/a`**, and the two graders used `n/a` differently — which is
   one of the findings. Cells excluded on a disputed rule cannot be excluded
   neutrally.
5. **The rubric was revised after inspecting the results**, so any re-grade is not
   independent evidence about the revision.

### DESCRIPTIVE ONLY — NOT VALIDATION EVIDENCE

| Measure | Value |
|---|---|
| Exact cell agreement | 29 / 49 = **59%** |
| Agreement within 1 point | 43 / 49 = **88%** |
| Critical flag agreement | 7 / 9 = **78%** |
| Verdict exact agreement | 6 / 9 = **67%** |
| Ship / do-not-ship agreement | 8 / 9 = **89%** |

Now look at it properly.

> **88% agreement within one point. And the two graders disagreed about whether
> to ship X-5.**

High cell agreement, opposite decisions on a real case. This is Part A §7's
argument arriving from a new direction — and this time **the aggregate that hid
the category failure was the reliability statistic itself.**

`[Design interpretation]` A team reporting "88% inter-rater agreement" would be
telling the truth and describing nothing. The number is dominated by the cells
where agreement is cheap — Clarity was 5 in six of nine rows — and says nothing
about the cells where the decision was actually made. **A reliability number can
look healthy while the graders disagree about the only thing that matters.**

The confusion was more valuable than the number. That is the point of the section.

---

## 13. The evaluator can fail

Part A named `F8` as a failure class in the abstract. This exercise produced
real instances. All of them have been added to the taxonomy
(`00-master/05 — Failure Taxonomy.md`).

| ID | Failure | Where it happened here |
|---|---|---|
| `F8.1` | No success criteria beforehand | *Avoided* — criteria frozen at `f4f41f5` |
| `F8.2` | Threshold set after seeing results | **v0.2 itself.** Done deliberately, stated |
| `F8.3` | Unvalidated judge treated as ground truth | *Avoided* — no judge yet |
| `F8.4` | Aggregate hid a category failure | **X-4's 4.2**, and the 88% agreement figure |
| `F8.5` | Test set too small to conclude | **n = 9**, chosen for disagreement |
| `F8.6` | Passing command mistaken for working product | Chapter 02's F-07 |
| **`F8.7`** | **Ambiguous criterion** | **Clarity: readability vs comprehension. 5 vs 2** |
| **`F8.8`** | **Missing criterion** | **Material omission. Scattered across two columns** |
| **`F8.9`** | **Defective `n/a` rule** | **X-2 scored `n/a` on the confidence criterion** |
| **`F8.10`** | **Overloaded criterion** | **Safety carried three unlike injuries** |
| **`F8.11`** | **Grader standard drift** | **Grader 2 self-reported three shifts** |
| **`F8.12`** | **Hidden decision threshold** | **X-5: identical scores, opposite verdicts** |
| **`F8.13`** | **Evaluator contamination** | **The main assistant could not be Grader 2** |
| **`F8.14`** | **Correlated evaluators** | **Both graders are AI-influenced** |

`[Design interpretation]` Eight new failure classes from one afternoon with nine
error messages and no model involved. **Every one of them will recur, amplified,
the moment the thing being evaluated is probabilistic** — and several will be
harder to see, because a model's output is fluent by construction and an
ambiguous criterion applied to fluent text produces confident numbers.

Two are worth singling out. **`F8.11` grader drift** was only visible because
Grader 2 was asked to report it and did — *"had X-5 come before X-3, I suspect I
would have rejected X-5 as well."* An evaluator whose standard moves during a run
produces scores that are not comparable *within the same run*, and nothing in the
output reveals it.

**`F8.13` contamination** is the one most likely to catch you personally. It cost
nothing here because it was noticed. It is invisible when it is not.

---

## 14. Calibration — the pattern, not the implementation

You have now produced the thing every automated evaluation depends on:
**human-labelled cases**.

`[Documented behaviour]` Google states you can *"directly compare the autorater's
judgments against your 'source of truth'"* by *"creating a benchmark dataset of
human-rated examples"*, which *"allows you to calibrate its performance, measure
its alignment with you."* Its judge-validation documentation requires *"an
evaluation dataset with human ratings as the ground truth."*
— Google Cloud (S-010, S-016).

```
HUMAN-LABELLED CASES
   → GOLD / REFERENCE SET
      → RUN AUTOMATED JUDGE
         → COMPARE JUDGE vs HUMAN LABELS
            → MEASURE AGREEMENT / ERROR
               → ADJUST RUBRIC OR JUDGE
                  → ONLY THEN SCALE
```

**Two things follow, and both are rules.**

> **An LLM judge is not ground truth.** It is an instrument that approximates
> human preference, and the approximation has to be measured before it is
> trusted. Treating it as ground truth is `F8.3`.

> **Judge validity is scoped, and it expires.** A judge validated on one task, one
> rubric, one domain, one output distribution and one model version is not
> validated elsewhere. **A judge whose model version changed is unvalidated
> again.** No record, no scores as evidence.

`[Our observation]` And this exercise adds a caution the vendor guidance does not:
**the human labels themselves can be contaminated.** Ours are — one grader was
assistant-assisted, and the assisting model had read the chapters where three of
the graded outputs were designed. A gold set built from those labels would encode
that correlation and then measure a judge against it, producing a validation score
that is partly a measurement of shared priors.

**A gold set is only as independent as the people who made it.** That is why the
provenance label sits at the top of the submission file rather than in a footnote.

---

## 15. Evaluation is not product measurement

`[Documented behaviour]` HEART — *Happiness, Engagement, Adoption, Retention, Task
success* — with Goals–Signals–Metrics (Rodden, Hutchinson & Fu, CHI 2010, S-033).

Part A deliberately refused to apply it, and now the reason can be stated
precisely.

| | Evaluation | Product measurement |
|---|---|---|
| Asks | *Is this output good?* | *Does the product perform well, across users, over time?* |
| Unit | One output | A population |
| Timeframe | Now | Longitudinal |
| Method | Criteria and a grader | Signals and metrics |
| This exercise | All of it | **None of it** |

Scoring an error message for "Retention" produces a number that means nothing —
and worse, a number that will be averaged with numbers that do.

The paper says so itself:

`[Documented behaviour]` *"It is not always appropriate to employ metrics from
every category, but referring to the framework helps to make an explicit decision
about including or excluding a particular category."*

`[Design interpretation]` **The two can move in opposite directions, and that is
the case to watch for.** Engagement can rise because outputs got worse and people
have to retry. Task Success can fall while output quality improves, if the
improvement made the system more honest about what it cannot do — X-7A is longer,
clumsier and more truthful than X-7B, and would plausibly measure worse on
time-to-completion.

**Neither number is lying. They are answering different questions**, and a team
that only watches one will optimise the wrong thing with excellent data.

---

## 16. Where the frameworks sit

These are **lenses at different levels of the same system**, not competitors. The
common mistake is applying one at the wrong altitude.

```
PRODUCT / POPULATION      HEART                Does the product perform, over
   over time              (Goals–Signals–      time, across users?
                          Metrics)             Claim 5.

EXPERIENCE QUALITY        UX Honeycomb         Is the whole experience useful,
   whole journey          (Morville)           usable, credible, findable…?

INTERFACE & INTERACTION   Heuristic            Where does this screen violate
   one screen/flow        evaluation           known interaction principles?

STRUCTURE & COMPONENTS    Atomic Design        Is this built from consistent,
   the design system                           reusable parts?

OUTPUT & SYSTEM           This framework       Is this specific output true,
   BEHAVIOUR              (v0.2 + 7 lenses)    calibrated, safe, actionable?
   one output                                  Claims 2–4.
```

**Nothing here replaces what you already use.** The AI/product evaluation
framework fills a level the others do not reach: **the quality of an individual
system output**, including its truthfulness, its handling of uncertainty, and its
failure behaviour.

A heuristic evaluation will not tell you that "Arriving today" conceals a
disagreement between two data sources. HEART will not tell you that a room-booking
message disclosed a redundancy consultation. Those live at the output level, and
that level had no lens until now.

`[Design interpretation]` The reverse is equally true and worth saying, because
this handbook could easily overclaim. **v0.2 cannot tell you whether the product
is worth building.** It scores outputs. Validation — *should this exist* — is
still unanswered for Deskline, as Part A §3 noted, and no amount of output grading
will answer it.

---

## 17. What Chapter 03 established

**Vocabulary, sourced** — verification, validation, testing, evaluation,
measurement, monitoring, TEVV.

**That structural validity, semantic quality and product quality are three
properties**, harder to measure in exactly the order they matter more.

**That criteria must be written and committed before scoring** — and that even so,
a rubric can score one thing while the verdict is decided by another.

**That an aggregate compresses, and compression discards what is rare** — which is
where the failures live. Demonstrated twice: X-4's 4.2, and an 88% agreement
statistic sitting over a verdict disagreement.

**That pairwise win ≠ pointwise pass.**

**That the evaluator can fail** — eight new named ways, all observed.

**And what it did not establish:** that v0.2 is reliable, general, or validated.
It is a hypothesis with good provenance, built from nine cases by two correlated
graders, and it has never met an unseen case.

---

## 18. Learning Checkpoint

Attempt these before §19.

**Q1 — Green suite, misleading answer.**
A support assistant's output passes every deterministic check: valid JSON, all
required fields, correct status, length in range, no PII detected. A customer
follows its advice and cancels a subscription they meant to keep. Which of the
three properties from Part A §4 was actually violated, and which of your
deterministic checks could ever have caught it? What would you add — and at which
layer?

**Q2 — The pairwise winner.**
Your team compares two prompt versions on 200 cases. Prompt B wins 71% of
pairwise comparisons and ships. Complaints rise. What did the experiment measure,
what did it not measure, and what single addition to the process would have caught
this before shipping?

**Q3 — The hidden 1.**
A vendor reports their model scores 4.3/5 on your rubric across 1,000 outputs.
What do you need to see before that number means anything, and what specific
result would make you reject the model despite the 4.3?

**Q4 — Two graders, one criterion.**
Two reviewers score the same output "Helpfulness 2" and "Helpfulness 5". Before
adjudicating, what are the four things that could be true — and how would you tell
them apart? Which one is *not* fixed by rewriting the criterion?

**Q5 — The judge that changed underneath you.**
Six months ago you validated an LLM judge against 200 human-labelled cases:
balanced accuracy 0.87. Since then the provider released a new model version and
your product moved from summarisation into drafting. Your dashboard still shows
judge scores. What is that dashboard now measuring? What must happen before it
means anything again?

**Q6 — The metrics disagree.**
After a release, Task Success is up 8% and average session length is up 20%. Your
output-quality scores dropped from 4.1 to 3.6. Give two stories consistent with
all three numbers — one where the release was good and one where it was bad. What
would you look at to tell them apart?

**Q7 — The rubric that came second.**
An engineer shows you a rubric that scores your model at 92%. You learn it was
written after reading a sample of that model's outputs. What exactly is wrong,
what is the failure class, and is the rubric now worthless? How would you salvage
what is salvageable?

**Q8 — The production failure.**
A user reports that your assistant told them a refund had been processed when it
had not. The bug is fixed in a day. What should happen to this incident
afterwards, in evaluation terms — and what precisely gets stored, so that it can
never silently recur?

---

## 19. Checkpoint Discussion / Reasoning

*Read after attempting §18.*

**Q1.** **Semantic quality** was violated; structural validity was intact and
product quality was catastrophic. **None of those checks could ever have caught
it** — they test the shape of the response, and the defect is in what it means.
"No PII detected" is the tell: it is a content check that still only pattern-matches.

What to add, and *where* matters more than *what*: a **Layer A gate**, not another
score. If the assistant advised an irreversible action on incorrect grounds, that
is **A1** (material falsehood) or **A3** (a withheld fact — that cancellation
cannot be undone). A quality dimension called "advice accuracy" would have scored
2 and averaged into 4.1.

**And one piece can be pushed down.** "Does this output recommend an irreversible
account action?" is deterministic — a bounded set of actions, matchable. It does
not decide whether the advice was right, but it can *route* those outputs to
mandatory review. Most "we need a judge" problems are partly Level A problems not
yet decomposed.

**Q2.** It measured **relative preference**. It did not measure **whether either
version is acceptable** — and a comparison always produces a winner, including
when both options are bad. B may have won 71% of the time and still failed a gate
on 30% of cases; pairwise scoring cannot see that, because it never asks.

There is a second, sharper possibility: **B won on the dimension the comparison
was sensitive to** — usually fluency or confidence — while losing on one nobody
scored. A more confident-sounding assistant wins comparisons and generates
complaints. That is not hypothetical; it is X-7 with the verdicts reversed.

**The single addition: a pointwise gate pass on every candidate, before the
comparison is allowed to decide anything.** Every pairwise process needs a
pointwise floor. Report both: *B preferred in 71%; B fails a gate in 12%.*

**Q3.** Three things, and the third is the one people forget.

**The distribution, not the mean.** 4.3 is consistent with every output scoring
4.3, and with 90% scoring 4.7 and 10% scoring 1.2. Those are different products.

**The gate results, separately and unaggregated.** How many of the 1,000 tripped a
disclosure, a falsehood, a withheld fact? That number must never enter an average.

**How the rubric was applied** — by whom, whether the judge was validated against
human labels, when, on what task, and on which model version. A 4.3 from an
unvalidated judge is `F8.3`.

**What would make me reject despite 4.3:** any non-trivial gate failure rate. If
20 of 1,000 outputs disclosed another user's data, the model is unshippable at
4.3, at 4.8, at any number. That is what non-compensatory means, and X-4 is the
9-case version of it.

**Q4.** Four possibilities:

1. **Ambiguous criterion** — "Helpfulness" means different things to them.
   *Tell:* ask each what they were scoring. If they describe different properties,
   it is this. Our Clarity 5-vs-2 was exactly this.
2. **Different scale interpretation** — same property, different bar for a 5.
   *Tell:* their rank ordering across several outputs agrees; only levels differ.
3. **Missing criterion** — both see the same defect, and one is expressing it
   through Helpfulness because there is nowhere else. *Tell:* the written comments
   describe the same thing. **Our X-8 Relevance 4-vs-2 was this**, and it looked
   like disagreement for a week.
4. **Genuinely different values** — both understood the criterion and weigh
   thoroughness against brevity differently.

**Number 4 is not fixed by rewriting the criterion.** It is a decision that has to
be made by someone with the authority to make it, and then written down as a
convention. Trying to word your way out of a values disagreement produces longer
criteria and the same disagreement.

**Q5.** **It is measuring nothing you can currently interpret.** Two things changed
independently, and both invalidate the 0.87:

- **The judge model version changed.** The instrument is not the instrument you
  measured. That alone voids it.
- **The task changed.** Summarisation and drafting have different failure modes.
  A judge tuned to detect unsupported claims in a summary has never been asked
  whether a draft is appropriately hedged.

The dashboard is producing numbers with the same shape and unknown meaning, which
is worse than producing nothing — nobody distrusts a chart that has always been
there.

**What must happen:** re-validate. Fresh human labels **on the new task**, against
the current judge version, then re-measure agreement. And record it: what it was
validated against, when, on what, with what agreement. **No record, no scores as
evidence.** Judge validity is scoped and it expires.

**Q6.** **The good story.** The release made outputs more honest — more hedging,
more "I'm not certain", more clarifying questions. Output scores drop because a
rubric weighted toward decisiveness penalises hedging. Users succeed more often
because they are no longer acting on confident wrong answers. Sessions are longer
because a clarifying exchange takes an extra turn. **This is X-7A: longer,
clumsier, more truthful, and it would measure worse on time-to-completion.**

**The bad story.** Outputs got vaguer. Users retry, rephrase and dig, which is why
sessions are 20% longer. Task Success is up because the metric counts *task
completed* however many attempts it took. Quality scores dropped because quality
dropped.

**Both are consistent with all three numbers.** To separate them:

- **Turns-to-completion**, not session length. The good story predicts a small
  increase; the bad story predicts a large one.
- **Retries and rephrasings**, which the bad story predicts and the good one does
  not.
- **Read the outputs that dropped.** Did they lose a claim, or gain a hedge?
- **Check whether the rubric penalises appropriate uncertainty** — if it does, the
  score drop may be measuring the rubric rather than the product.

`[Design interpretation]` Note what makes this hard: **the bad story looks better
on the engagement metric.** A team watching HEART alone would ship the vague
version and celebrate.

**Q7.** The failure is **`F8.2`, threshold set after seeing results** — and, if
the rubric was tuned until the number looked good, `F8.1` as well, because the
criteria are no longer independent of the outcome.

**What is wrong, precisely:** the rubric encodes what that model already does
well. It has learned the model's strengths as its definition of quality. The 92%
is close to circular — the score is high because the criteria were selected, or
worded, in the presence of the answers.

**Is it worthless? No, and this matters.** The rubric may contain real insight;
whoever wrote it was reading real outputs and probably noticed real things. What
is worthless is **the 92%**.

**How to salvage it:** treat the rubric as a *hypothesis*, exactly as v0.2 is
treated in this chapter. Freeze it. Apply it to **outputs it has never seen**,
ideally from a **different model**, graded by someone who did not write it. If it
still discriminates, it is a rubric. If everything scores 90%+, it is a
description of one model.

And note the double standard to avoid: **this chapter did the same thing.** v0.2
was written after seeing the disagreements. The difference is that it is labelled,
its re-grade is explicitly not called validation, and the untested cases are named.

**Q8.** Fixing the bug is the smallest part of it.

**What gets stored, and where:**

1. **The failing input, verbatim** — the exact conversation state that produced
   it. Not a paraphrase. The reproduction *is* the artefact.
2. **The system reality** — what the refund state actually was. Without it, nobody
   can ever grade the output again.
3. **The classification.** This is `A1`, material falsehood: it asserted something
   the system contradicted. Also plausibly `A3` — the user needed to know the
   refund had *not* processed.
4. **A regression case** in the evaluation set, so any future model, prompt or
   version is checked against it. This is Chapter 02's rule — *promote real
   failures to regression cases* — moved from tests to evaluation.
5. **A gate, if one is missing.** "Did the assistant assert a financial state?"
   is narrow, checkable, and worth a mandatory verification step.

**And the part most teams skip:** ask whether the *evaluation set* should have
caught this. If refund-status questions were never in it, the gap was in the
dataset, not the model — and the fix is dataset coverage, not a better judge.

`[Design interpretation]` One production failure produces one regression case.
**A hundred produce an evaluation set that reflects what actually goes wrong**,
rather than what someone imagined might. That is the highest-value evaluation data
any product has, and it is generated for free by things going badly — provided
somebody writes them down.

---

## 20. Sources

**Read**
1. Google Cloud, *Evaluate a judge model* (S-016) — pointwise/pairwise ground-truth columns; balanced accuracy, balanced F1, confusion matrix
2. Google Cloud, *Gen AI evaluation service overview* · *Define your evaluation metrics* (S-015, S-014) — static vs adaptive rubrics
3. Google Cloud, *Run AutoSxS pipeline* (S-018) — Cohen's Kappa and interpretation bands
4. Google Cloud blog, *How to evaluate your gen AI at every stage* (S-010) — calibration against human-rated benchmarks
5. Rodden, Hutchinson & Fu, *Measuring the User Experience on a Large Scale* (S-033) — HEART, and its own scope caveat
6. NIST, *The Language of Trustworthy AI* (S-034) — vocabulary, from Part A

**Watched**
- **V-001** — *LLM as a Judge: Scaling AI Evaluation Strategies*, IBM Technology,
  15 Sep 2025, 6m09s.

`[Design interpretation]` **This video was deliberately withheld through Part A**,
and the sequencing is the point. Watching it first supplies the conclusion the
exercise exists to produce — that human evaluation does not scale and something
must automate it. Watch it now and you will notice what it does not say: it
describes the judge as an instrument and says nothing about **who produces the
labels it is validated against**, or what happens when those labels are
themselves contaminated. You have just made a contaminated label set. Watch it
with that in hand.

- **V-002** — *Can You Trust an AI to Judge Fairly?*, IBM Technology, 23 Sep 2025,
  7m32s. Now also appropriate. The bias categories are corroborated by Zheng et
  al. (S-011), which remains the citable source.

## 21. Artefacts

```
evaluation/results/exercise-01-comparison.md      case-by-case, disagreements classified
evaluation/rubrics/provisional-rubric-v0.2.md     three layers, four gates
evaluation/results/exercise-01-regrade-v0.2.md    five cases re-graded
evaluation/human-evaluation/                      both submissions, with provenance
evaluation/datasets/product-outputs/dataset-v1.md 20 cases; 10 still untouched
```

**Chapter 03 is complete. Chapter 04 introduces a model — and it will be the first
output in this handbook that cannot be checked by reading the system reality,
because there will not be one.**
