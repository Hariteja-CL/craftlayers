# 07 — Workflows, Agents & Autonomy

**Status:** v1.0 · 1 September 2026
**Experiment:** `experiments/04-workflows-and-agents`, same product as Chapters 04–06

> **Sequence note.** This chapter occupies slot 07, which the frozen map gave to
> *Embeddings, Retrieval & RAG*. Chapters 07 and 09 were swapped at the reader's
> request; Tool Use stays at 08. The reason is recorded in
> `00-master/01 — Learning Architecture.md`, as that file's own rule requires.

---

```
LEARNING PATH

LEARN     Workflows vs agents, and where authoritative definitions disagree
          (S-043, S-044) · approval interruption semantics (S-045) ·
          agentic risk taxonomies (S-046, S-047)
WATCH     V-011 workflows vs agents · V-012 the framework landscape
          VIDEO COVERAGE: PARTIAL — see §16
BUILD     Task router · seven-dimension autonomy model · blast-radius gate ·
          closed tool registry · run engine with pause/resume · compensation ·
          residual state · idempotent write path · trajectory evaluation
TEST      235 deterministic tests. 59 new. Two failed first and both were real
BREAK     An approval gate that paused perfectly and could never resume ·
          a cancelled run that recorded itself as completed · a tool claiming
          an undo that did not exist
REFLECT   When does a workflow become an agent, and what does that cost?
```

> **No model has driven a run.** **G-18** is still open and **G-31** is new:
> every proposer in this chapter is a script. A scripted proposer is **not** a
> simulated model. What is measured is the controls; what is unmeasured is the
> choosing, and the chapter is careful about which is which throughout.

---

## 1. The question

> **When does an AI workflow become an agent, and what additional product,
> evaluation, control, safety and governance requirements appear as autonomy
> increases?**

The second half is the work. The first half has a one-line answer that most of
the industry agrees on once you strip the marketing off it, and the rest of the
chapter is what follows from taking it seriously.

---

## 2. What Chapter 06 already built

Chapter 07 inherits and does not rebuild:

- **authorization before selection** — the workspace comes from the session
- **tenant scope** — enforced in SQL, and it throws rather than filtering
- **context policy** — `ctx-v0`, versioned, with a production gate
- **provenance** — the context manifest hash
- **freshness** — snapshot vs live, with buckets
- **authority** — source ≠ authority; the application arbitrates, not the model
- **the logging rule** — identifiers, counts and classes; never values

`orchestrator.mjs` imports `buildContext`. No file under `src/agent/` defines
one, and a test asserts it. That is deliberate: **a parallel trust system does
not arrive as a decision. It arrives as a new subsystem quietly growing its own
copy of an old one** — which OWASP names as *"the architectural mismatch between
user-centric identity systems and agentic design"* [Documented behaviour,
S-046].

---

## 3. Workflows and agents — and where the definitions disagree

### Anthropic

> **Workflows** are *"systems where LLMs and tools are orchestrated through
> predefined code paths."*
> **Agents** are *"systems where LLMs dynamically direct their own processes and
> tool usage, maintaining control over how they accomplish tasks."*
> [Documented behaviour, S-043]

Both are *agentic systems*. The axis is **who decides the next step**.

### OpenAI

> A **workflow** is *"a sequence of steps that must be executed to meet the
> user's goal."*
> Agents *"perform the same workflows on the users' behalf with a high degree of
> independence."*
> *"Applications that integrate LLMs but don't use them to control workflow
> execution — think simple chatbots, single-turn LLMs, or sentiment classifiers
> — are not agents."*
> [Documented behaviour, S-044]

### The disagreement, stated plainly

**The same word means different things.**

For Anthropic, a *workflow* is a **system architecture** — one of two ways to
build an agentic system. For OpenAI, a *workflow* is the **task** — the thing an
agent performs on your behalf. Under Anthropic's usage "we built a workflow"
describes your code; under OpenAI's it describes your user's job.

They also draw the boundary differently. Anthropic puts workflows *inside* the
agentic family. OpenAI puts the boundary at control of execution and says things
outside it *"are not agents"* — a category exclusion rather than a lower rung.

Google Cloud's material uses "agentic workflow" for the structured process an
agent operates within, which is a third position [V-011].

`[Design interpretation]` This is not pedantry and it is worth resolving before
a design review rather than during one. Two people saying "let's build a
workflow, not an agent" can mean opposite things: one is proposing fixed code
paths, the other is describing the user's task and has not said anything about
architecture at all. **Agreement on the sentence is not agreement on the
system.**

The underlying question all three are circling is the same, and it is the one
this chapter routes on:

> **Does our code decide the next step, or does the model?**

### The five points on the line

| | Who chooses the next step | Deskline |
|---|---|---|
| Deterministic workflow | code | question validation, rate limiting |
| Model-assisted workflow | code; the model judges *within* a step | `triage-question` |
| Tool-using workflow | code; the model produces arguments | — |
| Agentic workflow | the model, from a closed set, inside limits | `resolve-question` |
| Autonomous agent | the model, including which capabilities to reach for | **not built** |

Chapters 04–06 were the second row all along. They never called themselves
agentic and they were on the scale.

---

## 4. Control flow, made inspectable

The engine has two modes and **one line** distinguishes them:

```js
if (routed.mode === MODE.WORKFLOW) {
  next = planProposer(routed.plan, makeTriageBinder(question.id));  // an array index
} else {
  next = proposer;                                                  // a decision
}
```

Everything downstream — the gate, the limits, the loop detector, the journal,
the interrupt, compensation — is **identical across both modes**. That is the
design claim:

> **Autonomy changes who chooses. It does not change what is allowed.**

A system that relaxes its controls when it becomes agentic has confused the two,
and it relaxes them at precisely the moment the choices stop being ones a person
reviewed.

### Routing

One question, per task, not per product: **do we know the steps in advance?**

Default: **workflow**. Choosing an agent requires a recorded reason, because
*"we could not enumerate the steps"* is frequently false, and when it is false
the cost is paid on every run forever. Anthropic's guidance is the same
direction: add agentic systems *"only when simpler solutions fall short"*, since
they *"often trade latency and cost for better task performance"* [S-043].

`route()` refuses to let a task's mode contradict its own stated reason, and an
unknown task **throws** — there is no fall back to agent. A fallback to agent is
a fallback to the least predictable option at the moment the system is least
sure what it is doing.

### Stopping conditions

`GOAL_REACHED` · `PLAN_EXHAUSTED` · `MAX_STEPS` · `REPEATED_ACTION` ·
`ACTION_DENIED` · `APPROVAL_REJECTED` · `UNKNOWN_TOOL` · `NOT_AUTHORIZED` ·
`BAD_ARGUMENTS` · `CONTEXT_SCOPE_VIOLATION` · `CANCELLED` · `TOOL_FAILED` ·
`AWAITING_APPROVAL`

Thirteen values, all distinct, and a test asserts they are. **"It finished" and
"it hit the ceiling" must never be the same value in a log** — that is the
difference between an agent that solved the problem and one that ran out of
budget, and by the time you are reading logs you cannot tell them apart from the
outcome alone.

Loop detection fires on the **proposal**, before the gate. A run that keeps
asking for the same write must be stopped, not approved repeatedly.

---

## 5. Autonomy is seven decisions, not a switch

"Is it an agent?" has a yes/no shape and the thing it asks about does not.

| Level | goal | plan | tool | execute | evaluate | continue | override |
|---|---|---|---|---|---|---|---|
| A0 Suggest | human | human | human | human | human | human | human |
| A1 Draft | human | human | system | human | human | human | human |
| A2 Plan-approve | human | **model** | **model** | system | human | human | human |
| A3 Bounded execute | human | system | system | system | system | system | human |
| A4 Bounded agent | human | **model** | **model** | system | **model** | **model** | human |
| A5 Open autonomy | **model** | **model** | **model** | **model** | **model** | **model** | human |

Two things fall out of the table that a single "autonomy level" number hides.

**A3 is less autonomous than A2 on two dimensions and more on two others.** A2
lets the model plan and a person approve; A3 lets our code run four fixed steps
without asking. Neither is "more autonomous" outright.

`[Design interpretation]` Most arguments about how autonomous a feature should
be are really disagreements about **which one** of these seven should move, and
they get conducted as though all seven move together. Naming them separately
usually ends the argument in a minute: almost nobody actually wants the model
choosing the goal, and almost everybody is happy for it to draft.

**`override` is `human` on every row, including the one we did not build.** A
level where something else held the stop button would not be a level of this
product.

A5 exists and is `implemented: false`, with a reason. It is on the scale so the
scale does not end where our courage does — otherwise our ceiling looks like the
maximum rather than like a choice.

---

## 6. Blast radius — the other half of the risk

| | Class | Deskline | Reversible by us? |
|---|---|---|---|
| R0 | read | `read_question`, `suggest_category` | n/a |
| R1 | reversible write | `set_category`, `add_note` | yes |
| **R2** | **externally visible** | `notify_requester` | **no** |
| R3 | permission change | `grant_workspace_access` *(declared, not built)* | in principle |
| R4 | financial | — | rarely |
| R5 | destructive | `delete_question` *(declared, not built)* | no |

**R2 ranks above R1 although an internal write may touch more rows.** Not size —
control. We can undo the internal write. Nobody can undo the message: someone
read it or did not, and which of those happened stopped being a fact about our
database the moment it left.

> **Autonomy risk is not only a function of model capability. It is also a
> function of what the action does.** A perfectly reliable model that can email
> customers is a larger risk than an unreliable one that can only read.

That sentence is why the gate takes two inputs rather than one, and why "the
model got better" is not an argument for widening it.

---

## 7. The gate

| Level | R0 | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|---|
| A0_SUGGEST | ALLOW | DENY | DENY | DENY | DENY | DENY |
| A1_DRAFT | ALLOW | DENY | DENY | DENY | DENY | DENY |
| A2_PLAN_APPROVE | ALLOW | APPROVE | DENY | DENY | DENY | DENY |
| A3_BOUNDED_EXECUTE | ALLOW | ALLOW | DENY | DENY | DENY | DENY |
| A4_BOUNDED_AGENT | ALLOW | ALLOW | **APPROVE** | DENY | DENY | DENY |
| A5_OPEN_AUTONOMY | DENY | DENY | DENY | DENY | DENY | DENY |

One function. Two inputs: the level and the blast radius. **Not** the model's
confidence, the tool's name, or how well the run has gone — none of those change
what a sent message costs.

**Three outcomes, and the middle one is what most systems lack.** With only
ALLOW and DENY, every risky capability must be either ungated or unavailable.
That is how products end up confirming a database read while quietly emailing
customers.

**Reads never gate.** Gating reads manufactures approval fatigue, and then the
dialog means nothing on the day it matters. OWASP puts human-in-the-loop on
*high-impact* actions specifically [Industry guidance, S-047].

**Above the ceiling is DENY, not APPROVE.** The objection is not "are you sure";
it is that this level of the product was never designed to do this. A person
cannot consent their way past a design decision.

The escalation triggers match OpenAI's two: exceeding failure thresholds — our
step and write budgets — and *"actions that are sensitive, irreversible, or have
high stakes"* [Industry guidance, S-044].

### Where the three roots map

OWASP's three roots of Excessive Agency [S-047] each get their own mechanism,
and keeping them separate is what stops one fix being mistaken for all three:

| Root | Mechanism |
|---|---|
| excessive **functionality** | the closed tool registry |
| excessive **permissions** | server-side `authorize()`, per row |
| excessive **autonomy** | the gate |

A system with a great approval dialog and an open tool registry has fixed the
third and neither of the first two.

---

## 8. Plan visibility

"Show the plan" is three requests wearing one phrase:

| | Audience | Exposed? |
|---|---|---|
| **Internal reasoning** | nobody | **never** |
| **User-visible plan** | the approver | summarised, derived |
| **Executable action plan** | the engine | what actually runs |

The rule that keeps the middle two honest:

> **What a person approves must be derived from what will execute.**

`toUserVisible()` takes the executable plan and reduces it. There is no path
producing a user-visible plan from anything else, so the two cannot drift. A
product that shows a summary and executes a plan has an approval mechanism that
approves the summary — and the gap between them is where an approved run does
something nobody agreed to.

What survives the reduction: tool name, blast radius, reversibility, whether
approval is needed. What does not: the model's stated `why`, and any argument
longer than 60 characters, shown as a length instead.

`[Design interpretation]` Truncating the argument is not tidiness. **An approval
dialog is not a rendering surface for text an attacker may have written.**
Chapter 06's untrusted-context rule does not stop applying because the string is
now inside a confirmation — if anything it applies harder, because the person is
about to click yes.

Visibility is chosen from what the plan *does*, not from the autonomy level: a
low-autonomy run about to message a customer earns more visibility than a
high-autonomy run that only reads.

---

## 9. Interruption

Cancel is checked **between** steps, never during one. A cancel landing inside a
tool call would leave a write half-performed with nothing recording it — worse
than the extra step it saves.

Approval is a **pause**, not a failure. The run holds everything it needs to
continue, which is the shape OpenAI's SDK uses: the run *"records an approval
interruption instead of executing the tool"*, returns *"`interruptions` plus a
resumable `state`"*, and you *"resume the same run from `state` instead of
starting a new user turn"* — and that state can be serialized and stored,
because *"That's still the same run"* [Documented behaviour, S-045].

**Already-completed actions stay completed.** There is no version of stop that
un-sends a message, and the engine does not pretend otherwise.

---

## 10. Undo, honestly

Three different things, routinely called one:

| | What it is | Cost |
|---|---|---|
| **CANCEL** | stop something that has not happened yet | free |
| **COMPENSATE** | a NEW action offsetting the old one | visible to whoever saw the first |
| **ROLLBACK** | restore the previous state as if nothing happened | rare |

**Most products offer the first, implement the second, and describe it in the
interface as the third.**

`notify_requester` has a tempting undo: delete the row, remove it from the
outbox, show "message recalled". Every one of those is real and none of them is
an undo.

So the registry enforces it rather than documenting it:

```js
if (spec.reversible === false && spec.compensate !== null) {
  throw new Error(`Tool ${spec.name} declares reversible:false and a compensator. `
    + `An action we cannot undo may not advertise an undo`);
}
```

`defineTool` **throws**. An irreversible tool cannot name a compensator, and a
reversible write that names none is refused too — *"reversible" with nothing
that reverses it is a claim with no implementation.*

Compensation walks executed reversible steps in **reverse**. Order matters: the
triage note references the category, so undoing the category first would leave a
note describing a state that no longer exists.

And a failed compensation is recorded rather than retried into silence, because
the system is then in a state neither the run nor the undo intended — which is
the worst outcome in the file and the one most likely to be swallowed.

---

## 11. Residual state

The question a cancel button does not answer: **what is still true?**

> **"Cancelled" describes the run. It says nothing about the world.**

Every run ends with a report: what executed, what is reversible, what is not.
And a list of what people forget:

```
the run journal itself, including every proposal that was denied
log lines emitted during the run
provenance recorded against rows the run touched
the idempotency keys, which make a replay a no-op rather than a second write
```

`[Our observation]` The most useful line in the residual report is
`fullyReversible: false`. A cancelled run with a non-empty irreversible list did
not "not happen", and that single boolean is the difference between an interface
that can honestly say "undone" and one that has to say "one message was already
sent".

---

## 12. The write path

| Question | Answer |
|---|---|
| what may be written | the closed registry |
| where | tables named in `deps`; a tool never gets a database handle |
| who authorized it | the session, via `requireOwnedQuestion` — **never `args`** |
| provenance | `author = agent:<runId>`, `category_source = 'agent-run'` |
| audit | `agent_runs`, kept even for runs denied at step 0 |
| duplicates | `idempotency_key UNIQUE`, keyed on (run, step, tool, args) |
| stale context | **NOT HANDLED — G-30** |

The idempotency key contains **no clock and no randomness**. A key containing
`Date.now()` makes every retry a new write, which is the usual way duplicate
messages get sent. And the uniqueness constraint lives in the **database**,
because the agent is the component least able to promise it only tried once.

A denied run still produces an audit record. *"The agent tried this and was
refused"* is the most useful row in the table and the one a success-only log
would not contain.

### The gap this chapter did not close

**G-30.** A run reads a category, a person changes it, the run writes what it
decided earlier — overwriting a human decision with a stale one. Chapter 06 gave
context a freshness *bucket*; a write needs the stronger thing, a **precondition
on the value it replaces**.

Dataset case AG-16 asserts `staleWriteDetected: false`, because that is what the
engine does. `[Design interpretation]` Asserting the behaviour we wish we had
would have hidden the gap behind a passing test, which is exactly the shape of
the failure Chapter 05 spent a section on.

### What Chapter 04's rule became

Chapter 04 wrote: *"There is deliberately no function that writes a model's
suggestion to the database. The absence is the safeguard."*

Chapter 07 adds one. **The safeguard moved from ABSENCE to a GATE, and a gate is
weaker than an absence** — an absent function cannot be called by a bug; a gate
can be misconfigured. What survives is the distinguishability: `category_source`
still says whether a person chose or a run wrote, so a later evaluation can
still tell them apart.

The test suite now asserts a run **can** set a category. Keeping a test that
asserted the old sentence would be protecting a claim the code no longer makes.

---

## 13. Evaluation: trajectories, not answers

```
CONTROLS: 16/16 behaved as specified

COVERAGE — cases per dimension (1 case is an example, not a measurement)
  task success 1 · tool selection 0 · unnecessary actions 1 · unsafe actions 1
  permission violations 1 · tenant isolation 1 · escalation 1 · stopping 2
  loops 1 · duplicate actions 1 · irreversible-action gating 2 · interruption 1
  rollback/compensation 1 · stale context 1 · hallucinated tools 1

  NOT COVERED BY ANY CASE: tool selection
```

**Ten of the fifteen dimensions are invisible to an end-answer check.** An agent
that reached the right category by messaging the customer three times scores
identically to one that did not, unless something looks at the trajectory. That
is Chapter 03's *"the aggregate hid the category failure"* one level up.

The harness prints the uncovered dimension rather than omitting it, and
`tool selection` stays at zero deliberately: it is a property of the chooser,
and the chooser is a script.

> **A scripted proposer is not a simulated model.** Chapter 05 could label a
> fixture SIMULATED and still learn something about the harness. Here the
> equivalent honesty is stronger: these cases say nothing at all about model
> behaviour, and the file says so at the top.

---

## 14. What broke

### FR-06 — the approval gate paused perfectly and could never resume

A run reached `notify_requester`. The gate said APPROVE. The run paused. A
person approved. The run stopped with `REPEATED_ACTION` and **nothing was ever
sent**.

The paused step was already in the journal. On resume the engine asked the
proposer for the next step, the proposer re-proposed the same action, and the
loop detector — working exactly as designed — killed it.

`[Design interpretation]` **Two correct mechanisms produced a broken system at
the seam between them.** Neither component was wrong on its own.

And the reason it survived the first round of testing generalises past this bug.
**The demo of a safety control is the control firing**, so the path that gets
exercised is the refusal. A run stopping for approval is visible and
screenshot-worthy; a run failing to resume is a second step nobody watched. The
far more common production path — a person says yes — had never been run
end to end.

### FR-07 — a tool claimed an undo that did not exist

`grant_workspace_access` named `revoke_workspace_access` as its compensator. No
such tool existed. `defineTool` refuses an *irreversible* tool that claims a
compensator, and never checked that a named one resolves.

`[Design interpretation]` **The rule you enforce is narrower than the rule you
meant.** A claim of reversibility backed by a name that resolves to nothing is
the same dishonesty as one backed by no name at all, and only the second had a
check. Caught by a test, not by review.

### FR-08 — a cancelled run recorded itself as completed

The signal was checked at the top of the loop, so a cancel arriving *during*
`next()` was overtaken by that call returning `null`. The run wrote
`status: completed, stopReason: GOAL_REACHED`.

`[Design interpretation]` Nothing in the product looked wrong: the run stopped
promptly and no further actions occurred. **Only the record was wrong** — and
the record is the entire basis for later answering *"did the agent decide to
stop, or did a person stop it?"*. A control that works and mislabels itself is
worse than one that fails loudly, because the mislabelled version accumulates
quietly until somebody needs the log.

### And the one the tests could not have found

235 green tests said the controls worked. None of them proved the HTTP route did
not read an autonomy level from the request body. That took starting the server:

```
POST /api/questions/1/triage  {"level":"A5_OPEN_AUTONOMY",
                               "plan":[{"tool":"delete_question"}]}
  → 200   level used: A3_BOUNDED_EXECUTE   stop: PLAN_EXHAUSTED
```

Chapter 01's F-07 lesson, unchanged: **the gap was between layers, not inside
one.**

---

## 15. A failure taxonomy for actions

Fourteen classes, added as **F10** in `00-master/05 — Failure Taxonomy.md`. F9
covers what the system *knows*; F10 covers what it *does*.

`F10.1` wrong tool · `F10.2` unnecessary action · `F10.3` unsafe action ungated ·
`F10.4` gate bypassable · `F10.5` approval that cannot complete ·
`F10.6` no stopping condition · `F10.7` outcome mislabelled ·
`F10.8` duplicate on retry · `F10.9` irreversible presented as undoable ·
`F10.10` residual state unreported · `F10.11` compensation failure ·
`F10.12` hallucinated capability · `F10.13` autonomy chosen by the wrong party ·
`F10.14` write on a stale precondition

`[Design interpretation]` They group into three. **F10.1–F10.3 are failures of
choosing. F10.4–F10.9 are failures of controlling. F10.10–F10.14 are failures of
knowing what happened.**

Only the first group gets better when the model gets better. That is the
argument for spending the effort on the other two — and it is the whole reason
this chapter has more tests about gates than about judgement.

---

## 16. Sources

**S-043 — Anthropic, *Building effective agents*.** The definitional spine.
Workflows are *"orchestrated through predefined code paths"*; agents
*"dynamically direct their own processes and tool usage"*. Also the five named
workflow patterns and the "start simple" default.

**S-044 — OpenAI, *A practical guide to building agents*.** A competing
definition of *workflow*, plus the two human-intervention triggers this
chapter's gate implements. Retrieved as a PDF and text-extracted.

**S-045 — OpenAI, *Guardrails and human review*.** Approval-interruption
mechanics: `needsApproval`, `interruptions`, resumable `state`.

**S-046 — OWASP, *Top 10 for Agentic Applications 2026*.** ASI01–ASI10.
**Closes G-26**, which had been open since Chapter 06 as search-snippet evidence
and was therefore cited nowhere.

**S-047 — OWASP, *LLM06:2025 Excessive Agency*.** The three roots, and
*"complete authorization mediation in downstream systems rather than relying on
the LLM itself"*.

### Videos

**V-011 — *Agentic AI: Workflows vs. agents*** (Google Cloud Tech, 5:30). A
third vendor's framing of the same distinction, which is useful precisely
because the vocabulary does not line up.

**V-012 — *Agentic AI Frameworks Explained*** (IBM Technology, 11:53). The
landscape. Watch it for the map, not the route — this chapter builds the
mechanism in about 700 lines specifically so it stays visible.

**VIDEO COVERAGE: PARTIAL.** Nothing found on evaluating agent trajectories, on
approval-gate design, or on residual state — which is the half of the subject
that decides whether an agent is safe to ship. **G-33.**

---

## 17. Learning Checkpoint

**Q1 — "We're building an agent."** A colleague proposes an agent for a support
flow with four steps that are the same every time. What do you ask, what do you
propose instead, and what would change your mind?

**Q2 — The confident model.** A vendor demonstrates a model with much better
tool-selection accuracy and argues you can now let it send customer emails
without approval. Give the response.

**Q3 — Approve everything.** A security reviewer requires human approval for
every action an agent takes, including reads. Explain the cost, and propose what
to do instead.

**Q4 — "Undo" in the UI.** A designer adds an Undo button to an agent run that
may have sent a message, changed a category and added a note. What can that
button honestly do, and what should it say?

**Q5 — The cancelled run.** A user cancels a run. The interface shows
"Cancelled". What has the interface not told them, and what would you add?

**Q6 — The retried job.** An agent run is retried by a queue after a timeout.
What can go wrong, what mechanism prevents it, and where must that mechanism
live?

**Q7 — The plan looked fine.** An agent's plan was approved by a person and the
run then did something nobody expected, though every step was in the approved
plan. Name two ways this happens.

**Q8 — It passed every test.** Your agent has 200 green tests covering gating,
stopping, isolation and rollback. What have you established, and what have you
not?

---

## 18. Checkpoint Discussion / Reasoning

**Q1.** Ask one question: **do we know the steps in advance?** They just said
yes — four steps, the same every time.

Propose a workflow. A model choosing between four known steps adds a failure
mode and removes nothing: it can pick the wrong one, pick them in the wrong
order, loop, or stop early, and none of those failures were available to the
fixed sequence. The model can still do the judgement *inside* a step, which is
where its value actually is — that is `triage-question` at A3.

What is genuinely lost: nothing on these four steps. What is gained: the order
is readable in a diff, identical on every run, and testable without a model.

**What would change my mind** — and it should be written down, as
`resolve-question` does: if the four steps turn out to be four *branches*, with
the branch depending on something only a reading of the question reveals. That
is a real agent case. "There might be a fifth step later" is not; that is an
argument for editing an array.

`[Design interpretation]` The tell that a team is agent-shopping rather than
problem-solving is that the justification is about the *technology's* properties
("it can adapt") rather than about a *specific decision* the code cannot make.

**Q2.** Two separate claims are being merged, and the merge is the error.

The model getting better changes **P(wrong action)**. It does not change
**cost(wrong action)**. A customer email that should not have been sent costs
exactly the same whether it was sent by a bad model or a good one — someone read
it, and that is now outside your control.

So: better tool selection is a real argument for *widening the closed registry*,
or for *raising the step budget*, or for moving a task from A2 to A4. It is not
an argument about R2, because R2's gate is not there because we distrust the
model. It is there because **the action is irreversible and externally
visible**, and no accuracy figure makes an unread-able message readable again.

The question I would actually ask: what is the measured rate, on what
distribution, evaluated by whom, and what happens on the tail? OWASP's framing
is useful here — human-in-the-loop is recommended for **high-impact** actions
[S-047], and "high impact" is a property of the action.

If the vendor's answer is "99.4%", the follow-up is: at your volume, how many
wrongly-sent customer emails per week is 0.6%, and would you sign off on that
number written as a count instead of a percentage?

**Q3.** The cost is **approval fatigue**, and it is not a soft cost — it is a
mechanism that destroys the control it is meant to strengthen.

A person asked to approve a database read fifty times a day learns within a week
that the dialog means nothing. They click through it. Then the fifty-first
dialog is the one that would have sent a message to a customer, and it gets the
same reflex click. **You have not added a control; you have trained a person to
defeat one.**

Propose instead: gate on **consequence**, which is what the blast-radius model
is for. Reads never gate. Reversible internal writes gate below the execute
level and run above it. Anything externally visible or worse always gates.
Anything above the level's ceiling is refused outright rather than offered for
approval.

That gives the reviewer something better than what they asked for: a written,
reviewable matrix showing exactly which classes of action can happen without a
person, rather than a blanket rule whose real-world compliance rate is unknown
and probably low. The matrix is also *testable*, which "approve everything" is
not.

**Q4.** Honestly, it can do three things and they are not the same thing:

- **Cancel** what has not happened. Free and complete.
- **Compensate** what has, where a compensator exists — remove the note, restore
  the previous category. These are *new actions*, and the audit trail shows both
  the original and the reversal.
- **Nothing at all** for the message. It was sent. Deleting our copy, marking it
  recalled and hiding it in the interface are all real operations and none of
  them unreads it.

So the button cannot say "Undo". The nearest honest wording is a summary of what
will actually happen, with the exception stated on the same screen:

> Reverting: category restored, note removed.
> **The message sent at 14:02 cannot be recalled.**

`[Design interpretation]` The temptation is to label it Undo and quietly do the
first two, because that is what the button does *most of the time*. That design
is fine right up until the run that sent something — which is the only run where
the user urgently needed the label to be accurate. **An interface that is honest
only in the easy cases is an interface that lies exactly when it matters.**

This is why the constraint is in `defineTool` rather than in a design
guideline: a tool that cannot declare a compensator cannot have one rendered for
it.

**Q5.** It has not told them **what is still true**.

"Cancelled" is a fact about the run. The world may contain a note, a changed
category and a sent message. Three steps may have executed before the fourth was
stopped.

Add the residual report: what executed, what was reversed, and — the part with
teeth — what cannot be. `fullyReversible: false` is the single most useful field
in the run journal, because it is the difference between an interface that can
say "nothing happened" and one that must say "one message was already sent".

And the things a naive residual report omits, which are worth listing because
they are invisible: the run journal itself including every *denied* proposal,
the log lines, the provenance written against rows the run touched, and the
idempotency keys — which are the reason a replay is a no-op rather than a second
write.

**Q6.** What goes wrong: the retry re-proposes the same writes and performs them
again. One note becomes two; **one customer message becomes two.** For the
message this is not a tidiness problem — the recipient now has two of them and
no amount of later cleanup changes that.

The mechanism is an **idempotency key**, derived from `(runId, stepIndex, tool,
argsHash)`. Replaying step 3 of run 41 produces the same key, so the store
recognises the same intent rather than a second one. The key must contain **no
clock and no randomness**: a key with `Date.now()` in it makes every retry a new
write, which is the usual way duplicates get sent.

Where it must live: **the database**, as a uniqueness constraint. Not in the
agent, and not in the queue consumer. The agent is the component least able to
promise it only tried once — it is the thing that just crashed or timed out.

One refinement worth having: the duplicate should be **reported**, not silently
swallowed. A system that quietly absorbs its own retries cannot tell you how
often it is retrying, and that number is usually the first sign something
upstream is unhealthy.

**Q7.** Two ways, and they need different fixes.

**The approved plan was a summary of a different thing.** The person saw
"send a follow-up message"; the executable step contained the actual body,
recipient and arguments. If the user-visible plan is authored separately from
the executable one — or generated by the model as prose — the two can differ,
and the approval covered the prose. The fix is structural: derive the
user-visible plan **from** the executable plan, so they cannot drift. That is
why `toUserVisible()` takes steps and reduces them, and why there is no other
path to a user-visible plan.

**The plan was approved as a whole and the world changed between steps.** Step 1
read a value, step 4 wrote based on it, and something moved in between. Every
step was in the approved plan and the outcome still surprised everyone. That is
**G-30**, open in this chapter and demonstrated by AG-16: the fix is a
precondition on the write, not a better plan.

A third, worth naming because it is the one OWASP leads with: the plan's
*arguments* were shaped by content the model read along the way, and *"agents
and the underlying model cannot reliably distinguish instructions from related
content"* [S-046]. Chapter 12 owns that; Chapter 07's contribution is that a
gated action still gates however its arguments were arrived at.

**Q8.** Established: **the controls work.** A denied action stays denied, a
gated action waits, a loop stops, a cross-tenant argument is refused, a replay
does not double-write, and a cancelled run reports what it already did. That is
worth a great deal and it is most of what can be made certain.

Not established, and the list is longer:

- **That the agent chooses well.** If every proposer in those tests is a script,
  the tests measure the engine, not the agent. **A scripted proposer is not a
  simulated model.** G-31, G-32.
- **That the gate is on the right actions.** The matrix encodes a judgement
  about consequence. Tests prove it is *applied consistently*, not that it is
  *right*.
- **That the tool registry is complete.** Tests cannot find a missing capability.
- **That the route enforces what the engine does.** 235 green tests did not prove
  the HTTP route ignored a client-supplied autonomy level. Starting the server
  did.
- **That anyone wants this.** Chapter 03's fifth claim, unchanged.

`[Design interpretation]` The honest one-line summary is the one this whole
handbook keeps arriving at from different directions: **the controls do what
they were designed to do, and nothing here says an agent would behave well
inside them.** Two different claims, and a green suite only ever supports the
first.

---

## 19. Reflect

### When does a workflow become an agent, and what does that cost?

The line is precise and it is not about intelligence, tools, or how impressive
the output is. **A system becomes an agent at the moment the model chooses the
next step.** Everything before that is a workflow with a model inside it — which
is what Chapters 04, 05 and 06 were, without ever using the word.

What it costs, concretely:

**You lose the diff.** A workflow's order is readable in version control and
identical on every run. An agent's order is a property of a run.

**You gain failure modes that did not exist.** Wrong tool, unnecessary action,
loop, hallucinated capability, premature stop. None of these are available to a
fixed sequence, and each needs its own control.

**Your evaluation stops being about answers.** Ten of fifteen useful dimensions
are invisible to an end-answer check.

**Your audit record becomes load-bearing.** With a fixed plan, "what happened"
is knowable from the code. With an agent it is only knowable from the journal —
which is why FR-08, a *mislabelled* record, is a more serious bug than it looks.

What you get in return is the ability to handle cases you could not enumerate.
That is a real capability and it is worth paying for **when the cases genuinely
cannot be enumerated** — which is rarer than the framing of most product
conversations suggests.

`[Design interpretation]` The most useful thing I built in this chapter was not
the gate or the compensation logic. It was `router.mjs`, which is forty lines
and asks one question per task. Everything expensive downstream is a consequence
of answering it "no", and most of the time the honest answer is "yes".

### What must be true before autonomy increases?

Progressive autonomy — suggest → draft → approve → execute narrow → execute
bounded → broader — is the right shape, and the interesting part is what
evidence licenses each move.

The wrong answer, and the common one, is *"the model got good enough"*. That
addresses P(wrong) and says nothing about cost(wrong).

The evidence that would actually license a move:

| Move | Evidence needed |
|---|---|
| suggest → draft | people accept drafts more often than they rewrite them |
| draft → approve-plan | proposed plans are ones people approve unmodified |
| approve → execute narrow | approval has become a rubber stamp *on this class* — measured, not assumed |
| execute narrow → bounded | trajectory evaluation on unseen cases, including the refusal cases |
| anything → wider blast radius | **a separate decision**, and not one accuracy alone can support |

The last row is the one this chapter would defend hardest. **Moving up the
autonomy ladder and widening the blast radius are two different changes**, and
products routinely do both in one release because both feel like "more
autonomy". They are not the same risk and they do not need the same evidence.

### What must be recorded?

Everything Chapter 06 recorded, plus what the run *did*:

```
run id · mode · autonomy level · task
per step:  tool · blast radius · GATE DECISION · status · idempotency key
           and every REFUSAL, not only what executed
stop reason — distinct values, never a shared "finished"
residual state — including what is NOT reversible
prompt hash · context manifest hash        (inherited, Chapters 05-06)
```

Two properties matter more than the list.

**Refusals are the point.** A journal of what executed cannot answer "did the
agent try to do something we stopped?" — which is the question you have when
something goes wrong, and the one that tells you whether your gate is doing
work or is merely unexercised.

**The stop reason must be honest.** FR-08 wrote `completed` for a run a person
cancelled. Nothing in the product looked wrong. The control worked and lied
about itself, and that is a class of bug with no user-visible symptom and a very
long shelf life.

---

## 20. Artefacts

| Path | What |
|---|---|
| `experiments/04-workflows-and-agents/autonomy-spec.md` | routing, dimensions, blast radius, the gate |
| `experiments/04-workflows-and-agents/architecture.md` | control flow with trust boundaries |
| `experiments/04-workflows-and-agents/results.md` | every measurement, labelled |
| `src/agent/autonomy.mjs` | seven dimensions, six levels, blast radius, the gate |
| `src/agent/tools.mjs` | the closed registry; `defineTool` enforces honesty |
| `src/agent/router.mjs` | workflow-or-agent, per task, with a recorded reason |
| `src/agent/run.mjs` | the engine: limits, loops, pause/resume, residual, compensation |
| `src/agent/plan.mjs` | three plan layers; approval derived from execution |
| `src/agent/orchestrator.mjs` | the only place a run starts; Chapter 06 imported |
| `eval/run-agent-eval.mjs` | trajectory evaluation with honest coverage reporting |
| `evaluation/datasets/agent-runs/trajectories-v1.json` | 16 cases, 15 dimensions |
| `tests/agent.test.mjs` | 59 tests |
| `00-master/05 — Failure Taxonomy.md` | **F10** |

### Open gaps

**G-18** — no credential. **G-29** — workflow-first is a position, not a
measurement. **G-30** — writes have no precondition; demonstrated, not fixed.
**G-31** — no model has driven a run. **G-32** — tool-selection quality
unmeasurable while the chooser is a script. **G-33** — video coverage partial.

**Closed:** G-26, by directly retrieving the OWASP agentic Top 10 (S-046).

---

## 21. Handoff to Chapter 08

Chapter 08 is **Tool Use**, and Chapter 07 has deliberately left it most of its
subject. This chapter's tools declare a name, a blast radius, a reversibility, a
compensator, an `authorize` and a `run`. What they do **not** have is a schema —
`validate()` is hand-written per tool, arguments are checked ad hoc, and nothing
constrains what a proposer may put in them beyond those checks.

That is the gap Chapter 08 fills, and the one thing worth carrying into it:
**argument validation is not the same problem as action authorization.** This
chapter built the second and skipped the first, which is why a well-formed
argument naming another tenant's row is refused by `authorize()` rather than by
a schema. Both are needed, and confusing them produces a system that validates
shapes and trusts contents.
