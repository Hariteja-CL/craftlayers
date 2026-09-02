# 16 — Complete AI Product Capstone

**Status:** v1.0 · 2 September 2026 · **final chapter**
**Experiment:** `experiments/01-request-response-app`, the same product since Chapter 01
**Lenses:** all 7

---

```
LEARNING PATH

LEARN     Nothing new. Sixteen chapters of sources already retrieved; the
          capstone synthesises rather than surveys
BUILD     No new capability. One read-only contract: what the product promises,
          what each input is trusted FOR, and how a consequential action
          reconstructs its own authority
TEST      789 deterministic tests. 41 new, all CROSS-COMPONENT · 272 runtime
          checks across 7 harnesses, 65 of them integrated
BREAK     A fixture that copied a policy vocabulary and drifted from it · the
          capstone's own check passing for the wrong reason · "no freshness
          check ran" reported as a satisfactory answer
DECIDE    G-78: FIXED, with a real cross-process restart to prove it
REFLECT   What can we actually claim after sixteen chapters?
```

> **REAL USER FINDINGS: NOT MEASURED.** G-69, **BLOCKING**.
> **REAL MODEL FINDINGS: NOT RUN.** G-18. **MODEL-IN-THE-LOOP CAPSTONE
> SCENARIOS: NOT EXECUTED** (G-83).
> Everything below is **INTEGRATED PRODUCTION-LIKE RUNTIME VERIFICATION**.

---

## 1. The question

Fifteen chapters each proved one thing and each proved it alone. The capstone
cannot prove a sixteenth. It has exactly two questions available:

> **DO THESE PIECES STILL FORM ONE COHERENT PRODUCT WHEN THEY ALL OPERATE
> TOGETHER?**
>
> **AND WHAT CAN WE ACTUALLY CLAIM AFTERWARDS?**

The answer to the first turns out to be *mostly, and the exceptions are
instructive*. The answer to the second is much shorter than sixteen chapters of
work suggests it should be, and §11 is that list.

---

## 2. What the capstone found before writing any code

Phase 1 was building an integration map: every boundary, its owner, its trust
class, its authority decision, its failure mode, its evidence. Listing the
canonical vocabularies and asking *who owns this one* took about ten minutes
and produced the chapter's central finding.

Chapter 15's control plane can disable "everything at or above a blast radius".
It accepted a `blastRank` function as a parameter, so the deployment layer need
not depend on the agent layer. Every caller therefore supplied one. The tests
and the runtime harness supplied this:

```js
const rank = (b) => ({ R0_READ: 0, R1_INTERNAL_WRITE: 1,
                       R2_EXTERNALLY_VISIBLE: 2, R3_IRREVERSIBLE: 3 }[b] ?? 0);
```

**Two of those four names do not exist.** Chapter 07's ladder is:

```
R0_READ · R1_REVERSIBLE_WRITE · R2_EXTERNALLY_VISIBLE
R3_PERMISSION_CHANGE · R4_FINANCIAL · R5_DESTRUCTIVE
```

So a rule meaning *"contain everything externally visible and worse"* stopped
`R2_EXTERNALLY_VISIBLE` and let `R3_PERMISSION_CHANGE`, `R4_FINANCIAL` and
`R5_DESTRUCTIVE` through — they were absent from the map and fell to `0` via
`?? 0`, and `0` means *harmless read*.

The test passed. It asserted R2 was blocked and "R1" was not, and both were
true of the fixture's private universe.

**The sharpest part is what the copy lost.** Production `blastRank` throws:

```js
if (i < 0) throw new Error(`Unknown blast radius: ${b}`);
```

The duplicate did not merely drift. It **removed a safety property the original
had** — the original fails loudly on an unknown radius, the copy returned the
safest-looking number.

Fixed at the root, four ways: `control.mjs` imports the canonical `blastRank`
and uses it as the *default*; `parse()` rejects a `blast_at_or_above:` target
that is not on the canonical ladder, so the bad control cannot be created;
tests and harness import `BLAST`; and a new test asserts R2-and-above stops
R2, R3, R4 and R5 while leaving R0 and R1 alone. FR-50.

> **A TEST FIXTURE IS NOT A SOURCE OF TRUTH.**

That is the capstone's governing rule and the last of the chapter's
distinctions, and it was earned rather than asserted.

---

## 3. Trust is not a property of a thing

The trust map is the artefact that most repays being written once, at the end,
in one place. Twelve inputs, five questions each, and the useful column is
`grantsAuthority`:

```
MAY GRANT AUTHORITY (3)      actor · approval · consent/delegation
MAY NEVER (9)                client request · session cookie · user text ·
                             retrieved passage · model output · tool arguments ·
                             tool/external result · MCP resource or prompt ·
                             deployment config
```

Nine of twelve. And the rows that matter are the ones where the same value is
trusted and untrusted at once:

| Input | Trusted for | Untrusted for |
|---|---|---|
| session cookie | naming which user id to look up | anything *about* that user — roles are never read from it |
| retrieved passage | being a passage that scored well | being relevant, correct, or safe to obey |
| model output | being a proposal | being well-formed, in-taxonomy, or authorised |
| tool result | being what a server sent | being true, being in-tenant, safe to render |
| approval | that a person consented to **one** action under the conditions then in force | authorising that action later, under a different release |

That last row is the one sixteen chapters were needed to write. An approval is
evidence about a moment, and Chapter 15's `resumeDecision` is what happens when
you take that seriously.

---

## 4. The authority path, assembled once

Twelve questions a consequential action must answer. Every value already
existed; nothing here decides anything. Until now no single place could show
them together, and an operator asking *why was this allowed?* had to read four
files.

Against a real cross-tenant refusal, over real HTTP:

```
A1  who requested it?         workspace_admin
A2  who is authenticated?     server-built actor
A3  which tenant?             w-globex
A4  which permission?         question:read
A9  runtime control state?    v2, 0 disabled
A11 which release and config? r-7c9c000a9c
```

Strip the release from a consequential trace and the verdict changes to
**`CAPSTONE DEFECT`**, which is the point: the reconstruction is a gate, not a
report.

**One bug in the gate itself, worth more than the gate.** A12 is *is authority
still fresh?*, answered from Chapter 12's per-step `assertStillAuthorized`.
Completeness was "every required answer is not null" — and `.some()` over steps
that were never checked returns `false`, a real value. So:

```
null  -> MISSING   we do not know whether authority was re-checked
false -> ANSWERED  we know it was NOT, which is the defect
```

The evidence view was reporting its worst finding as satisfied. FR-52, and the
third appearance of one idea in this repository:

> **NULL, FALSE AND NOT-APPLICABLE ARE THREE DIFFERENT ANSWERS.**

FR-36 was seven empty directories reading as coverage. Chapter 14 made "no
alert" distinguish healthy from not-enough-data. Chapter 15 made NOT RUN read
differently from FAIL. Each time, collapsing an absence into a value produced a
reassuring report pointing the wrong way.

---

## 5. Eight scenarios, one incident

Not dozens. Enough to exercise distinct architecture paths, integrated, over
real HTTP against a real database.

| | Scenario | Result |
|---|---|---|
| **A** | safe read: identity → authz → retrieval → answer | answers with a confidence band; **abstains** on "quantum bicycle chandelier" (FR-14 still holding) |
| **B** | authorized reversible action | triage runs as a **workflow**, 0 irreversible writes |
| **C** | high blast radius | R2 outranks R1 on the canonical ladder; every R2 task requires approval; **R3–R5 declared and deliberately empty** |
| **D** | indirect injection | hostile text accepted as *content*; roles unchanged; `audit:read` still 403 |
| **E** | cross-tenant / confused deputy | 403 before any side effect; a member cannot reach the control plane |
| **F** | deployment change mid-run | approval expires; containment applied *after* approval stops the resume, and stops every rung above it |
| **G** | unknown external outcome | cannot stop, outcome UNKNOWN, no automatic retry, compensation needs a human |
| **H** | incident + rollback | traced, attributed to config alone, contained, rolled back in five layers, `complete: false` |

Scenario D deserves its footnote, printed by the harness itself:

> *control-plane resistance only. MODEL obedience is UNMEASURED (G-58/G-18).*

The system demonstrably cannot have its authority changed by hostile retrieved
text. Whether a model would *obey* that text is a different claim, and this
handbook has never been able to make it.

**The incident**, end to end: release A healthy → deploy B (same commit, one
config field) → a real request 500s → the exact change identified
(`failWrites: false → true`) → response chosen narrowest-first
(`ROLLBACK_CONFIG`, explicitly not `ROLLBACK_CODE`) → five-layer rollback →
one irreversible effect survives → incident declared with user impact and a
scope of `3 of 12 write attempts in the window` → **a production trace refuses
to become an evaluation case without a human label** → with one, it carries
provenance → holdout still refused outright → safe path restored, release id
byte-identical to A.

---

## 6. G-78, decided

Chapter 15 left it open by choice, with the design question stated. The capstone
had to decide it, and decided **FIX**.

The mechanism is the smallest thing that works: one JSON file, written
atomically (temp file, then rename), read once at construction, established by
`startServer` before the listener binds. No table, no migration, no service.

**The interesting half is the failure direction.** If the file is corrupt,
truncated, or names a control this build cannot enforce, we do not know what was
supposed to be off. Starting clean with a warning is the original bug wearing an
apology. So the plane comes up **DEGRADED**: reads keep working, every
consequential capability is refused, and clearing it is an audited operator
decision rather than a dismissed warning.

Proven across a real process boundary — spawn, disable, kill, respawn:

```
a switch is set in a real child process         tool:send_email
THE G-78 FIX: the containment survived          1 disabled, version 1
  the reason survived with it                   "containment that must survive"
  and the restoration is in the journal         a restart is an event, not a silence
corrupt state comes up DEGRADED, not clean      CONTROL_STATE_UNREADABLE
  consequential capabilities refused            503
  and reads still work                          failing closed on safety state, not the product
a persisted control we cannot enforce degrades  a switch we cannot apply silently re-enables
```

**Residual and named:** the file is per-machine. This closes the single-node
case only; multi-machine control remains G-71/G-72.

**And the fix made an older check stale.** Chapter 15's harness asserted that
`close()` + `startServer()` did *not* clear the plane — F-04's trap,
demonstrated. `startServer` now re-establishes the plane deliberately, so it
does clear it. The check was **inverted and annotated, not deleted**: the F-04
lesson is unchanged and still true of module state generally; the control plane
simply stopped being an example of it, because this chapter made its lifecycle
explicit.

---

## 7. What we kept getting wrong

Fifty-two recorded failures. The counts matter less than the families.

**A. Harness and test model drift — 6 occurrences, and none found by the suite.**
FR-17 measured a default instead of the value it passed. FR-28 asserted an error
message instead of a code — one chapter after fixing that exact bug. FR-35 fitted
a pattern to one sample. FR-47 called `close()` a restart. FR-50 copied a policy
vocabulary. FR-51 passed an argument the function does not accept, **on the same
day, in a file whose header states the rule FR-50 exists to teach.**

*Why normal testing missed it:* the test is the thing that is wrong, and a wrong
test that passes looks exactly like a right test that passes.
*Strongest detection:* assert on a value the implementation had to compute — a
verdict string, a reason code — never on a boolean that several worlds satisfy.
*Prevention rule:* **import the vocabulary; never re-declare it.**

**B. Layer shadowing / route bypass — 5 occurrences.** FR-16 (a gate that never
executed), FR-24 (an api-key regex shadowed by a parallel rule, which then
recurred twice more), FR-29 (a route invisible to 508 tests), FR-31, FR-40.

*Why testing missed it:* every one of these had *a* check. The tests asserted
the outcome, and the outcome was right for the wrong reason.
*Strongest detection:* **"can this path explain itself?"** FR-40 was found by
asking a trace to justify a 403 and watching it fail — after two security
chapters had swept the same routes.

**C. Configuration and state invisibility — 4.** FR-38 (no correlation id, no
tenant), FR-39 (a segmentation key resolved too late), FR-44 (no runtime
control), FR-49 (a field recorded and not projected).

**D. Restart and lifecycle — 3.** F-04, FR-45, FR-47. Module state that
survives what looks like a restart, or vanishes across a real one.

**E. Absence read as a value — 4.** FR-02 (PASS on zero results), FR-36, FR-52,
plus Chapter 14's alert model. **The single most repeated idea in the register.**

**F. Missing external evidence — permanent.** G-18 and G-69 are not failures
and never become fixed. They are the shape of the whole project.

The synthesis worth carrying: **five of six families were found by looking at
the system from an angle it was not built to satisfy** — an integration map, a
real HTTP call, a process that actually died, a question about explainability.
The suite found almost none of them, and the suite is 789 tests.

---

## 8. Where the product does not tell the truth

Lenses 3 and 4 are the thinnest evidence in the handbook, and the capstone is
the only chapter claiming all seven, so this is the honest accounting rather
than a victory lap.

Deskline's interface does **not** currently tell a user:

- that retrieval ran, or which passages an answer rests on
- that the system **abstained** rather than failed — Chapter 09's most important
  behaviour is invisible at the surface
- what an approval will actually do, in blast-radius terms, before they grant it
- that an outcome is **UNKNOWN** rather than failed
- what a rollback did *not* reverse

Every one of those is a real product gap, and every one is a place where the
system's actual guarantees are better than what the user can see. **The
guarantees are invisible, which means they cannot be trusted by the person who
needs them.** G-81.

And the product-value question, answered plainly: several Deskline features
exist because a chapter needed an experiment. The triage workflow is a genuine
product path. The MCP loopback server, the delegation model, the shadow
evaluator and the payload corpus are **learning artefacts** — correct, tested,
and not things a helpdesk needs. Saying so is cheaper than pretending a teaching
repository is a product roadmap.

---

## 9. Cost and latency, composed

| Stage | Measured |
|---|---|
| identity + authorization | < 1 ms |
| retrieval | ~6 ms |
| tool / persistence | 1–2 ms |
| tracing overhead | 2–5 ms per traced request |
| full deterministic suite | 789 tests in ~23 s |
| integrated capstone harness | 65 checks incl. 4 real process spawns |
| **model latency** | **NOT MEASURED** (G-18) |
| **model cost** | **NOT MEASURED** — zero calls, zero tokens, zero money |

No token or money estimate appears anywhere in this handbook, because inventing
one would be the exact failure the whole book is about.

---

## 10. Evaluation coverage of the capstone scenarios

| Scenario | Deterministic | Regression | Adversarial | Runtime | Model | Human | Production |
|---|---|---|---|---|---|---|---|
| A safe read | ✓ | ✓ | — | ✓ | **—** | — | **—** |
| B reversible action | ✓ | ✓ | — | ✓ | **—** | — | **—** |
| C high blast | ✓ | — | ✓ | ✓ | **—** | ✓ | **—** |
| D injection | ✓ | — | ✓ | ✓ | **— G-58** | — | **—** |
| E cross-tenant | ✓ | ✓ | ✓ | ✓ | n/a | — | **—** |
| F deploy mid-run | ✓ | — | — | ✓ | n/a | — | **—** |
| G unknown outcome | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | **—** |
| H incident | ✓ | — | — | ✓ | n/a | ✓ | **—** |

**The production column is empty for every row.** So is the model column
wherever a model would be involved. The empty cells are the finding, exactly as
Chapter 13 required, and no capstone score is computed over them.

---

## 11. What Deskline can and cannot claim

**CAN — each with its qualifier attached, because the qualifier is the claim:**

- tenant isolation holds **on every path this repository tests** — tested paths, not a proof
- authorization is decided per call, server-side, re-checked per step **for routes that reach the layer** — FR-40 found one that did not
- retrieved and external content is labelled untrusted before reaching the model — **labelling is enforced; model obedience is unmeasured**
- an unknown external outcome stays unknown **for the injected failures tested**
- telemetry contains no user content, user ids or credentials — allow-list enforced, drops recorded
- capabilities can be disabled at runtime and survive a restart — **single process, single machine**
- rollback reports five operations and refuses to claim the world reversed — **effects are recorded, not discovered**
- evaluation enforces a dev/holdout split and refuses a rate with no denominator — **one labeller** (G-64)

**CANNOT — each pointing at a gap, not a hedge:**

- real-user product value (G-69) · production-scale reliability (G-80) · real-model behaviour of any kind (G-18) · prompt-injection resistance (G-58) · absence of vulnerabilities (G-61) · multi-machine operation (G-71/G-72) · complete observability (G-72) · drift behaviour (G-69) · that a pilot would generalise — the closure plan itself caps a pilot at PARTIALLY MEASURED

The contract refuses the word **secure** outright. You cannot prove the absence
of a vulnerability; 22 attacks held, and the suite was written by the defender.

---

## 12. Two readinesses, and why they must not be averaged

**ENGINEERING READINESS: PARTIALLY READY.**
Release identity, configuration attribution, functional verification, security
controls, observability, irreversible-effect handling and evaluation machinery
are READY. Privacy, operability, rollback, kill path and migrations are
PARTIALLY READY, each with a named residual.

**EVIDENCE READINESS: BLOCKED.**
G-18 — no model has ever run. G-69 — no user has ever used it. G-80 — no
deployment under load, over time, or across machines.

These are different questions and collapsing them produces two lies. Averaged
upward it reads *ready*, which is false. Averaged downward it reads *blocked*,
which is also false and would discard sixteen chapters of working machinery.
The accurate sentence is longer and duller:

> **The machinery is built and the evidence about the world is absent, and no
> amount of further work in this repository can change the second.**

---

## 13. What an AI product actually consists of

The synthesis, for a reader who has forgotten the implementation.

1. **Deterministic code ends** where a value stops being derivable from inputs
   and starts being *chosen*. Everything before that boundary is ordinary
   software and should be built as such.
2. **Probabilistic behaviour begins** at exactly one place in a well-built
   product: a proposal. Never at a decision.
3. **Authority lives server-side, is rebuilt per call, and is re-checked per
   step.** It is never in a token the client holds, a field the model emitted,
   or an answer cached when the run began.
4. **The model may decide** what to suggest, what to propose next, and how to
   word something.
5. **The model must never decide** whether an actor is authorized, which tenant
   a request belongs to, whether an action is approved, what its own blast
   radius is, whether content it read is trustworthy, or what gets logged.
6. **Context and retrieval are inputs, not instructions.** Relevance is a
   ranking property and has nothing to say about trust.
7. **Tools and external systems change the risk class, not the code.** The
   question is never "did the call succeed" but "what is now true in the world
   that we cannot undo".
8. **Identity and scope govern action**, and a permission without a scope is a
   permission over everything.
9. **Security is tested by attacking your own controls**, and the result has no
   denominator — you can report what you tried, never what exists.
10. **Evaluation differs from testing** in that a test asserts a known answer
    and an evaluation estimates a rate. Rates need denominators, populations,
    windows, and intervals wide enough to be embarrassing.
11. **Production is different** because it has a distribution you did not
    author, and an offline pass is a statement about the distribution you had.
12. **Rollback is not undo.** Code, config and policy reverse; data sometimes;
    effects never.
13. **What is still missing here** is a model, users, and a deployment — and
    those are not engineering tasks.

And the sentence the whole book converges on:

> **THE PRODUCT IS THE SET OF BOUNDARIES, CONTROLS, EVIDENCE AND RECOVERY PATHS
> AROUND THE MODEL.** The model is the part you did not build.

---

## 14. Artefacts

| File | Lines | What |
|---|---|---|
| `src/capstone/contract.mjs` | 335 | System contract, trust map, authority evidence view, claims and limits |
| `tests/capstone.test.mjs` | 347 | 41 cross-component tests |
| `eval/verify-capstone-runtime.mjs` | 522 | 65 integrated runtime checks, 4 real process spawns |

**Modified:** `src/deployment/control.mjs` — canonical `blastRank` imported and
defaulted, `UNKNOWN_BLAST_RADIUS` guard, file persistence, degraded mode,
`clearDegraded`. `src/server.mjs` — control file established before the
listener binds. `tests/deployment.test.mjs` and
`eval/verify-deployment-runtime.mjs` — canonical vocabulary imported (FR-50),
one stale check inverted and annotated.

**Tests:** 789 passing, up from 746. **No previous test was weakened or
skipped.** One assertion was deliberately inverted, with its reason recorded in
the file and in the failure register.

**Runtime:** 272 checks across 7 harnesses, all passing. 9 evaluation harnesses,
all exit 0.

**Registries:** FR-50, FR-51, FR-52 recorded. **FR-01, FR-02 and FR-03
registered retrospectively** — the completion audit found them cited in
Chapter 04 and absent from the register. F19 added, 11 subclasses. G-78
**CLOSED**; G-81, G-82, G-83 opened; the final grouped gap state written.

---

## 15. Sources

**No new sources.** The capstone synthesises what sixteen chapters retrieved.
Adding a literature survey here would have padded the registry to make the
final chapter look substantial, and the registry has a rule against exactly
that. 75 sources, all directly retrieved, all with dates.

The four that carried the most weight across the whole book: **S-021** (IBM's
offline vs in-the-loop distinction), **S-064** (OWASP: *"it is unclear if there
are fool-proof methods of prevention for prompt injection"*), **S-070** (Google
SRE: *what's broken, and why*), **S-073** (Azure: *identify compensable versus
irreversible steps*).

---

## 16. Handbook status

**COMPLETE WITH OPEN EVIDENCE GAPS.**

Sixteen chapters, all present, all titled as the Learning Architecture says.
Every core experiment exists and runs. Every source, gap, failure and taxonomy
id cited in a chapter resolves — verified, and one class of cross-reference
defect fixed to make that true.

Three gaps are BLOCKING and none of them is an engineering task. G-18 is one
environment variable. G-69 is users. G-80 is a deployment. The handbook stops
here because more repository work cannot touch any of them, and pretending
otherwise would be the failure this book spent sixteen chapters learning to
name.
