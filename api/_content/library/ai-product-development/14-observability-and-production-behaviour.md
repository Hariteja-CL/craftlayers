# 14 — Observability & Production Behaviour

**Status:** v1.0 · 2 September 2026
**Experiment:** `experiments/01-request-response-app`, same product as Chapters 04–13
**Lenses:** 1 (product and system architecture) · 7 (operational evaluation)

---

```
LEARNING PATH

LEARN     Trace, span, context propagation (S-068) · head vs tail sampling and
          what each cannot do (S-069) · what's broken vs why, and what a page
          is for (S-070) · the three-stage lifecycle and "at a sampled rate"
          (S-071)
WATCH     No video assigned. Nothing retrieved met the bar - see 16
BUILD     One trace per request, created before anything can fail · an event
          contract that is an allow-list · nine sampling strata that keep every
          denial and 5% of successes · rates that refuse to exist without a
          denominator · alerts that refuse to fire without a baseline · a
          shadow that cannot write · a review queue · a promotion path from
          trace to evaluation case that requires a human
TEST      683 deterministic tests. 80 new, all testing the TELEMETRY · plus 38
          runtime checks against the real server
BREAK     Thirteen chapters of logs that never correlate · a tenant resolved
          too late to see the failures that matter · a trace that said 403 and
          could not say why · a failure path that named the front door every
          time · a redaction net that missed a short sentence
REFLECT   What does our telemetry let us claim, and what does it only let us
          suspect?
```

> **PRODUCTION FINDINGS: NOT MEASURED.** Deskline serves no users. Everything
> in this chapter that runs, runs against the real server over real HTTP with a
> real database, and is called **production-like runtime verification**. It is
> not production and the word is not used for it. G-69, and it is the first
> gap in this handbook classified BLOCKING.

> **REAL MODEL FINDINGS: NOT RUN.** `ANTHROPIC_API_KEY` is still unset. G-18 is
> unchanged and unchanged for the same reason as in Chapter 13: one environment
> variable, not a build project.

---

## 1. The question

Chapter 13 ended by saying that every number so far was offline. This chapter
starts one layer below that, with a question so ordinary it is easy to miss
that the system could not answer it:

> **A MEMBER SAYS THEIR TRIAGE FAILED THIS MORNING. WHICH REQUEST WAS IT, AND
> WHAT HAPPENED INSIDE IT?**

Deskline has had logging since Chapter 01. It is careful logging: method,
route, status, duration, user id, and — deliberately — no question text. It was
extended honestly through thirteen chapters. Here is what it produces:

```
request  POST /api/questions/12/triage  403  14ms  user=bo
```

True, complete, and useless. It does not say which authorization check refused,
under which policy version, after which retrieval, with what confidence, or
whether an external call had already gone out. Each of those subsystems logged
its own line, in its own file, with nothing joining them but a timestamp.

Google's SRE book put the distinction in one sentence a decade before any of
this was about models (S-070):

> *"Your monitoring system should address two questions: what's broken, and
> why? The 'what's broken' indicates the symptom; the 'why' indicates a
> (possibly intermediate) cause."*

Chapter 01's log answers **what**. Nothing in Deskline answered **why**. That
is FR-38, and it is not a bug that was introduced — it is a system that grew
past its instrument while every individual log line stayed correct.

The chapter's core experiment is therefore simply: **make that question
answerable, and see what the answer exposes.**

---

## 2. Logging is not observability

The vocabulary matters here, because the two words are used interchangeably by
people selling both. OpenTelemetry's definitions (S-068):

| Term | Definition, verbatim |
|---|---|
| Trace | *"The path of a request through your application"* |
| Span | *"A span represents a unit of work or operation. Spans are the building blocks of Traces"* |
| Context propagation | *"Spans can be correlated with one another and assembled into a trace, regardless of where Spans are generated"* |
| Attributes | *"Key-value pairs that contain metadata that you can use to annotate a Span"* |
| Span event | *"A structured log message (or annotation) on a Span... a meaningful, singular point in time"* |

The operative word is **correlated**. A log line is a statement. A trace is a
statement with a place in a structure. The difference is invisible in a
single-file server and total by the time a request crosses identity,
authorization, context assembly, retrieval, a model, a tool and an external
system — which is exactly the arc Chapters 04 through 12 built.

`src/observability/trace.mjs` implements ten stages, matching the layers this
product actually has:

```
request · identity · authorization · context · retrieval
model · tool · external · action · result
```

**One divergence from OTel is deliberate.** Its span status has three values —
`Unset`, `Error`, `Ok` — and all three assume the outcome is knowable.
Chapter 08 established that it is not: an external action that times out after
the request left is genuinely, irreducibly unknown, and Chapter 10 built a
whole envelope discipline around not lying about it. So `trace.mjs` has a third
status, `unknown`, which is **not** OTel's `Unset`. Exporting to a standard
collector would require mapping it and would lose the distinction. That is
G-70, recorded rather than smoothed over.

---

## 3. The experiment: trace a failing request

A cross-tenant read. Bo, an admin in `w-globex`, asks for a question belonging
to Ana in `w-acme`. The correct answer is 403, and Deskline has returned 403
here since Chapter 11.

**Before instrumentation** — one log line, quoted in §1.

**After instrumentation, first run:**

```
request/GET /api/questions/2 [ok] 2ms  method=GET  tenantId=w-globex  status=403
```

One span. The trace exists, is sampled, is stored under the right tenant, is
fetchable by id — and **it says 403 and cannot say why**.

That is not an instrumentation gap. `GET /api/questions/:id` was written in
Chapter 01 and still carried Chapter 01's check:

```js
if (q.user_id !== session.userId) return fail(res, 403, 'FORBIDDEN', ...);
```

Ownership hard-coded as the scope. Chapter 11 wired the routes it was thinking
about. Chapter 12 swept for routes with *no* authorization — and this route has
a check, so it was never on that list. It took a third question, asked from a
different direction, to find it: not *is this route protected* but **can this
route explain itself**. That is FR-40, and it is the third appearance of the
FR-31 shape.

**After routing it through the authorization layer:**

```
request/GET /api/questions/2 [ok] 5ms  method=GET  route=/api/questions/2
                                       tenantId=w-globex  status=403
  identity/buildActor [ok] 1ms          tenantId=w-globex  actorClass=workspace_admin
                                        authAssurance=recent_proof
                                        identityPolicyVersion=idp-v1
  authorization/question:read [error] 0ms
                                        decision=DENY  denyReason=WRONG_TENANT
                                        identityPolicyVersion=idp-v1
```

That is the chapter. The request was refused at the authorization layer, for
`WRONG_TENANT`, under policy `idp-v1`, after identity succeeded at
`recent_proof` assurance — and every one of those facts is now attributable to
a version, which is what makes a future regression diagnosable rather than
arguable.

Note what the trace still does not contain: the question, Ana's user id, Bo's
user id, or any text at all. §4 is why.

**The finding underneath the finding.** The instrumentation did not merely
observe a bug; it *located* one that two security audits missed. The general
rule is worth stating plainly, because it makes tracing a correctness tool and
not only an operational one:

> **A REQUEST THAT CANNOT EXPLAIN ITS OWN OUTCOME IS USUALLY A REQUEST THAT
> BYPASSED SOMETHING.**

---

## 4. What may be written down

Telemetry is the one subsystem with a standing reason to touch every other
subsystem's data. Chapter 06 established a deny-list for logs — block the
fields somebody named. That scales to one subsystem. Across six it fails in the
obvious direction: it blocks what was remembered.

`events.mjs` inverts it. **45 declared fields, and nothing else is written.**

```
OPERATIONAL   tenantId · route · status · durationMs · errorType · stage ...
EVALUATION    actorClass · denyReason · confidence · abstained · toolName
              blastRadius · snapshotHash · contextManifestHash · promptHash ...
OPTIONAL      inputTokens · retryCount · cacheHit ...
PROHIBITED    19 fields, each with a reason
```

Every prohibited field carries an argument, not a rule:

```
userId    'use actorClass. A trace segmented by role answers every evaluation
           question; one segmented by person answers a different question
           nobody asked for'
rendered  'the assembled prompt contains every context value at once'
token     'a bearer credential replayable by anyone who can read a dashboard'
```

Four of those reasons said `'obviously'` until the chapter's own test asked
every prohibition to carry an argument a reader could act on (FR-42). It is a
small finding with a long fuse: **"obviously" is what a rule says just before
somebody adds an exception to it**, because a prohibition with no stated cost
cannot be weighed against a stated benefit, and the benefit always wins.

`filterAttributes()` returns what was kept **and what was dropped, with the
reason**, and the drop is recorded as a span event. Silence would be worse than
the drop itself: a dropped dimension and a missing value look identical on a
dashboard, and only one of them is an instrumentation bug.

Behind the allow-list sits a second net for content arriving under a
*permitted* name — a question pasted into `taskType`. It had a length guard,
`v.length > 60`, and so it missed this:

```
'how do I export my data from the reports page please'          51 characters
```

Eleven words, unmistakably prose, under the threshold. The net was calibrated
to catch essays and the thing it exists to catch is a sentence (FR-43). Prose
is a shape, not a length.

Retention differs per class — 30 days operational, 90 evaluation, 7 optional,
**0 prohibited** — because a single retention policy means the most sensitive
field decides how long the least sensitive one lives, and in practice that
means everything is kept as long as the least sensitive one. None of it is
enforced: nothing exports, nothing expires, the store is 500 traces in memory
(G-72). The policy is a design artefact and is labelled as one.

---

## 5. Sampling: keeping the traces worth keeping

Nobody stores every trace. The naive answer is a uniform rate, and OTel names
exactly why it fails (S-069): with head sampling *"it is not possible to make a
sampling decision based on data in the entire trace"*, so you cannot guarantee
keeping the errors.

Deskline samples at the **end** of a trace, on the completed thing — which
makes it tail sampling, and lets the decision depend on what happened:

| Stratum | Rate | Why |
|---|---|---|
| `security_denial` | 1.00 | The rarest and most expensive to be wrong about |
| `unknown_outcome` | 1.00 | Chapter 08's irreducible state |
| `external_action` | 1.00 | Something left the building |
| `error` | 1.00 | |
| `abstention` | 1.00 | Chapter 09 chose silence; was it right? |
| `retry` | 1.00 | The only implicit signal we keep in full |
| `low_confidence` | 1.00 | FR-37's open question needs these |
| `new_task_type` | 1.00 | The first of anything, before normal exists |
| `success` | **0.05** | The only stratum below 100% |

Order matters and is tested: a slow failing request is sampled as a failure,
not as a success. The decision is a deterministic hash of the trace id rather
than a random draw, so it can be re-derived during an incident — you can always
answer *why wasn't this one kept*.

The honest footnote: **tail sampling is nearly free here because a request
never leaves the process.** S-069 describes what it costs otherwise —
*"stateful systems that can accept and store a large amount of data"*, *"dozens
or even hundreds of compute nodes"*. This strata table is a design whose price
is unmeasured for any deployment that is more than one server (G-71).

The runtime verification shows the mechanism working in both directions:
twenty successful reads produced far fewer than twenty stored traces, and every
denial was kept. Early in the build that first result looked like a bug for
several minutes. It was the feature.

---

## 6. Count, rate, denominator, window

Chapter 13 established that a count is not a rate. Production adds a second
requirement that offline evaluation does not have: a **window**.

`productionRate()` refuses three ways:

```
NO_DENOMINATOR    "5 failures this week" — out of how many opportunities?
NO_WINDOW         a rate over unbounded history averages every version ever
                  deployed, which is how a regression hides inside an
                  improvement
thin denominator  reported, never hidden: "1/3 [DENOMINATOR 3 < 30: not
                  actionable]"
```

The third is the one people get wrong in the safe-looking direction. Hiding a
metric with a thin denominator makes it look like a healthy one. Reporting it
with its own warning attached keeps the absence visible — the same move
Chapter 13 made with empty coverage cells.

A rate that survives states its own population and window:

```
2/200 (1.0%) of attempted protected actions, 2026-09-01 to 2026-09-02
```

---

## 7. A baseline before a threshold, and an alert is not an incident

Nine alert rules, each with a level and a **minimum denominator**. Two refusals
are enforced before any comparison happens:

```
BELOW_MINIMUM_DENOMINATOR   3 observations, the rule needs 50
NO_BASELINE                 'a threshold without a baseline is a number
                             somebody liked'
```

And critically, *no alert* is not one state. A healthy system and a system with
four observations produce different reasons, because collapsing them is how a
dashboard reports green on a service nobody is using.

Security incidents are the exception: A1–A3 fire on a single occurrence, with a
denominator floor of 1. A cross-tenant read does not need a trend.

Then the boundary that this handbook has not needed until now:

> **ALERT != INCIDENT.**

An alert is a statement about a metric. An incident is a statement about
people. `declareIncident()` refuses to convert one into the other without the
three things the alert does not contain:

```
userImpact   what somebody experienced, in a sentence about people.
             "the rate went up" is what the alert already said
evidence     trace ids. Not a chart, not a count — the actual requests
scope        a fraction of a named population, or the honest string
             'SCOPE NOT ESTABLISHED'
```

S-070 again, and it is a 2016 sentence that needed no updating for AI:
*"every page response should require intelligence. If a page merely merits a
robotic response, it shouldn't be a page."*

The postmortem template has five fields and each one routes somewhere real —
`whyOfflineEvaluationPassed` into `evaluation/datasets/`, `whyTheAlertWasLate`
into the alert rules, `whatWeStillCannotSee` into the gap register. The fourth
exists because **detection is a separate failure from causation**, and teams
that fix only the cause ship the same blind spot forward.

---

## 8. Feedback is not ground truth

A thumbs-down means a person was unhappy with something. It does not say which
span was wrong: retrieval, the model, the policy that refused, or a product
decision they disagree with and which was correct. Treating it as a label
trains on the last of those along with the first three.

`triageFeedback()` has two branches and **neither produces a label**:

```
explicit  -> REVIEW_QUEUE   a human reviews the trace and labels it
implicit  -> SAMPLE         'a retry may mean a bad answer, a changed mind,
                             a slow page, or a double click'
```

Implicit feedback is a **sampling trigger**. It raises the odds a trace is
kept and looked at. It never becomes a `gold` value.

The review queue is ordered by cost of being wrong, not by volume — the
loudest stratum in any real system is `success`, and a queue sorted by count
never reaches a denial. Every item states the decision being asked for, because
a queue that shows a trace without saying what it wants gets closed rather than
reviewed:

```
security_denial   'was this refusal correct, and did the message tell them
                   what to do?'
unknown_outcome   'did the external action happen? Nobody knows yet, and that
                   is the point'
abstention        'should the system have answered? Chapter 09 chose silence
                   here'
```

Truncation is always reported (`29 not shown`), never silent.

**And here is a tension the chapter does not resolve.** The telemetry contract
forbids user content, so the reviewer can see that retrieval abstained, at what
confidence, on which policy version — and cannot see the question. For
operational review that is enough. For **labelling** it is not. Each queue item
therefore carries `canLabelFromTraceAlone`, which is `false` for exactly the
strata where judgement needs the input.

The wrong fix, which is the one that usually happens, is to relax the telemetry
contract because the queue would be easier to work. The right one is a
separate, consented, access-controlled path to the source row. It does not
exist: G-74.

---

## 9. A trace is not an evaluation case

This is the join back to Chapter 13, and Microsoft names the step without
naming its hardest part (S-071): *"continuous evaluation: quality and safety
evaluation of production traffic at a sampled rate."*

`promoteToCase()` turns a reviewed trace into a Chapter 13 case, and its four
refusals are the content:

```
NO_HUMAN_LABEL                'a trace is an observation. A case is a
                               judgement. Somebody has to make it'
NO_LABELLER                   a label with no author cannot be re-examined
HOLDOUT_IS_NOT_A_DUMPING_GROUND
                              'a holdout grown from live failures measures
                               memory, not generalisation'
INPUT_NOT_IN_TRACE            the trace carries no user content BY DESIGN.
                               Fetch it deliberately, through the consented
                               path, and let that step be visible in the code
```

The last one is the interesting refusal. It would have been easy to let the
input ride along in the trace so promotion was one call. That single
convenience would have quietly repealed §4. Making the code fail here means the
consent boundary is crossed on purpose, in the open, by someone who had to
write a line to do it.

The provenance string is not decoration:

```
provenance: 'production-trace dcb2ef7c, labelled by ana'
source:     'production'
```

When a metric moves six months from now, the first question is whether the
**data** changed, and only provenance answers it.

---

## 10. Shadow, rollout, and what may never be randomised

**A shadow serves nobody.** `runShadow()` refuses any candidate whose blast
radius is above `R0_READ` — and refuses *before running it*, which the test
asserts by checking the candidate never executed at all. A crashed shadow
agrees with nothing (`agreed: null`, not `false`) and never fails the request
it rode along with. Every result carries the sentence:

> **SHADOW RESULT IS NOT A USER OUTCOME. Nobody saw this.**

Four rollout stages — `internal`, `canary`, `partial`, `full` — each with an
entry criterion, a rollback trigger, and what to watch. Entry criteria refer to *evidence from the
previous stage*, not to the previous stage having happened, which is the
difference between staged rollout and a slow deploy.

And the boundary:

```
NEVER RANDOMISE   authorization decisions · tenant isolation · consent
                  requirements · approval gates on irreversible actions ·
                  credential handling · result trust classification ·
                  audit completeness
MAY RANDOMISE     explanation format and wording · ranking policy WITHIN an
                  already-scoped corpus · UI presentation and ordering ·
                  non-safety prompt phrasing · abstention message copy
```

Two of those are worth reading closely. Ranking may be randomised only *within
an already-scoped corpus*, because Chapter 09's rule was scope-before-ranking —
the scoping is the control and the ordering is the product. And the abstention
*message* may vary while the abstention *threshold* may not, since one is copy
and the other decides whether the system speaks.

*"A control is not a variant"* — you do not run a holdout group without tenant
isolation to measure how much it costs, because you already know the answer and
the cost is unacceptable. This is the operational form of the line Chapter 12
drew: some things are gates, and a gate you A/B test is a gate you have already
opened for half your users.

---

## 11. Drift, on things we can actually observe

Seven dimensions, each naming why it matters: `task_mix`, `tenant_mix`,
`actor_mix`, `tool_mix`, `retrieval_use`, `model_version` and `policy_version`
— the last two being the attribution axis, because a metric that moved when a
version shipped is a different finding from one that drifted underneath a
stable version.

`driftBetween()` refuses to call a change drift below a sample floor:

```
n=1 vs 40: too few to call a change drift
```

The general failure this guards against is F17.17: measuring drift on the
**output** rather than the **input**. Quality scores can hold perfectly steady
while the task mix changes underneath them — the system did not get worse at
anything, it just stopped being asked the questions it was good at.

Everything here has been demonstrated on constructed distributions. There is no
real one (G-69).

---

## 12. What broke

Six failures, all found during this chapter, in a system with 603 passing tests
and two prior security audits.

| | Failure | Class | Found by |
|---|---|---|---|
| FR-38 | Thirteen chapters of logs that never correlate | F17.1 | Asking the chapter's own question |
| FR-39 | Tenant resolved too late to see early failures | F17.2 | `0 denied traces` in the first runtime run |
| FR-40 | A trace that said 403 and could not say why | F17.3 | The core experiment |
| FR-41 | Every failure path named the front door | F17.4 | The first test of `failurePath()` |
| FR-42 | Four prohibitions that said "obviously" | F17.5 | A test asking each rule for its argument |
| FR-43 | A redaction net that missed a short sentence | F17.5 | A realistic question instead of a long one |

Three deserve a second look.

**FR-39 is the shape most likely to recur.** The trace store is tenant-scoped,
correctly. `tenantId` was assigned inside `actorOrDeny()`, correctly — that is
where a workspace becomes known. Consequence:

```
a request refused BEFORE an actor is built
  -> tenantId stays null
  -> invisible to every tenant-scoped query
  -> invisible in exactly the tenant it belongs to
```

The 401s, the malformed ids, the rate-limited floods — filed under no tenant at
all, and an operator investigating *"my workspace is getting errors"* would be
shown a clean list. **The traces you most want are the ones from requests that
died early.** The rule: the segmentation key is resolved at the earliest point
it is knowable, not at the point the application happens to need it.

**FR-41 is the chapter's instrument having the chapter's own bug.**
`firstFailure()` was `spans.find(failed)`, and `spans` is in creation order, so
the root span — which fails whenever anything under it fails — was returned for
every failing request in the system. Every failure path was one span long and
named the HTTP boundary as the cause of everything. It returned a value, never
threw, and looked fine. The runtime verification did **not** catch it, because
that renders all spans rather than the path. Only the unit test did. This is
Chapter 13's rule — the instruments get tested like the product — collecting
within a single session.

**FR-40 is a correctness bug found by an observability question.** It is the
third occurrence of FR-31's shape and the first found this way, and it revises
what Chapter 12's sweep should have asked. Not *which routes lack
authorization* but **which routes reach the authorization layer** — and only a
trace can answer the second.

---

## 13. What this chapter cannot claim

The list is longer than usual, and the first item bounds everything else.

**PRODUCTION FINDINGS: NOT MEASURED (G-69, BLOCKING).** Deskline serves no
users. The 5% success rate has never been sized against real volume. No
baseline describes a real Tuesday. No alert has ever fired on real behaviour.
No drift has been observed. No human has worked the review queue. No trace has
been promoted to a case. The infrastructure is real, exercised over real HTTP
against a real database, and the **distribution is not**.

This is the first BLOCKING gap in this handbook, and it is blocking in a
specific sense: it does not stop the chapter teaching what it teaches, and it
does stop the chapter making a single production claim.

**REAL MODEL FINDINGS: NOT RUN (G-18).** Unchanged. `model` spans exist and
carry `promptHash`, latency and token fields; no model has filled them.

**Alerting is working but not tuned (G-73).** We can demonstrate that an alert
with no baseline does not fire. We cannot demonstrate one that *should* fire.

**Our tail sampling is cheap for a reason that will not survive scale (G-71).**

**Nothing leaves the process (G-72).** No collector, no exporter, no retention
enforcement. `RETENTION` is a declaration.

**The reviewer cannot see the input (G-74).** Unresolved by design.

**No experiment has been run (G-75).** The boundary is declared, not tested.

**And a scope note carried from Chapter 13.** The chapter map assigns
"Production Behaviour" to 14 while Chapter 03 defers "production evaluation" to
13. Chapter 13 handed it forward; this chapter took it. Both chapters now say
so, and the split that emerged is: **13 owns the instruments, 14 owns what
production does to them.**

---

## 14. Learning Checkpoint

1. Chapter 01's log line is accurate, minimal and privacy-conscious. Name the
   question it cannot answer, and say why that is not a logging defect.
2. Why does `unknown` exist as a span status when OpenTelemetry has only three,
   and what is lost when you export it?
3. A tenant-scoped trace store filed early failures under no tenant. Why is
   that the worst possible subset to lose?
4. `failurePath()` returned a value for every failing request and was wrong
   every time. What makes this class of bug hard to notice?
5. Why does `sampleDecision()` hash the trace id instead of calling a random
   number generator?
6. A dashboard shows "denial rate: 0.4%". Name three things you must know
   before you can act on it.
7. Distinguish an alert from an incident using something other than severity.
8. A user gives a thumbs-down on a correct refusal. What happens if you use it
   as a label?
9. Why does `promoteToCase()` refuse to take the input from the trace, when
   putting it there would have been one line?
10. Give an example where every quality metric holds steady and the product is
    getting worse anyway.

---

## 15. Checkpoint Discussion

**1.** It cannot answer *why*. S-070 splits monitoring into what's broken and
why; a log line is a statement, and answering *why* requires statements with a
place in a structure. The log was proportionate to a single-file server and
stayed correct while the system grew past it — nothing degraded, which is
precisely what makes it hard to notice.

**2.** OTel's three statuses (`Unset`, `Error`, `Ok`) all assume the outcome is
knowable. Chapter 08 showed it sometimes is not: an external action that times
out after the request has left has a real, irreducible unknown result. Mapping
`unknown` onto `Error` for export loses the one distinction the status exists
for — the difference between *it failed* and *we do not know, and someone must
find out*.

**3.** Because the requests that die early are the ones you most need to see:
authentication failures, malformed input, rate-limited floods, and every
refusal that happens before identity resolves. The subset that is invisible is
the subset with the highest information density per trace, and the query
returns a clean list, so the instrument reads *healthy* exactly where it is
blind (F17.10).

**4.** It never fails loudly. It returns a plausible value of the right type,
renders without error, and is wrong in a way that requires knowing what the
right answer looks like. "First" was a vocabulary error that compiled: in a
nested structure, first-in-creation-order is *outermost*, which is the least
specific frame available.

**5.** So the decision can be re-derived. During an incident the question "why
was this trace not kept?" has an answer, and re-running the sampler on the same
id gives the same result. A random draw makes sampling unauditable, and an
unauditable sampler cannot be distinguished from a broken one.

**6.** Denominator (0.4% of what?), window (over what period, spanning which
deployed versions?), and baseline (what is normal?). Missing any one, the
number is not actionable — and the fourth, implied: whether the metric can see
the thing it claims to measure. FR-40 is a route that would have kept a denial
rate looking healthy by never producing a denial to count.

**7.** An alert is a claim about a metric; an incident is a claim about people.
The conversion needs three things the alert does not have — what somebody
experienced, which specific traces evidence it, and how many out of how many.
S-070: if a page merits only a robotic response, it should not be a page.

**8.** You train the system to stop doing something correct. Explicit feedback
reports dissatisfaction, not a diagnosis, and it cannot distinguish "retrieval
was wrong" from "the model was wrong" from "the policy refused and I disagree
with the policy". The refusal was right; the user's unhappiness was also real;
they are different facts and only one of them is a label.

**9.** Because that one line would have quietly repealed the event contract.
The moment user content rides in a trace to make promotion convenient, it is in
telemetry — with wider access, longer retention and different backups than the
database it was meant to live in. Failing at the boundary forces the consent
crossing to be deliberate and visible in the code, which is the only place it
can be reviewed.

**10.** The task mix changes. The product was good at triage and is now
receiving mostly export questions; every quality score holds steady on the
population still asking triage questions, and the growing population is being
served badly by a system that scores well. Drift on the input finds it; drift
on the output cannot (F17.17).

---

## 16. Reflect

The chapter's own question, turned on the chapter.

**What does our telemetry let us claim?** That a failing request in Deskline
can be explained: which layer refused, for what reason, under which policy
version, after which upstream steps, without any user content being written
down. That the mechanism keeps every denial and drops most successes. That a
rate cannot be computed without a denominator and a window, an alert cannot
fire without a baseline, a shadow cannot write, and a trace cannot become an
evaluation case without a human.

**What does it only let us suspect?** Everything about how any of this behaves
under real traffic. Whether 5% is the right success rate. Whether nine strata
is too many or too few. Whether the alert thresholds are anywhere near right.
Whether the review queue is workable by a person for an hour without the
`canLabelFromTraceAlone: false` items making it useless.

There is a temptation at the end of a chapter like this to say the system is
now observable. It is not. It is **instrumented**. Observability is a property
you demonstrate by answering questions you did not anticipate, and the only
question this chapter has answered is the one it was built to answer.

What it did do — and this is the finding worth carrying forward — is expose a
correctness bug that two security-focused chapters missed, by asking a question
neither of them thought to ask. Not *is this protected*, but *can this explain
itself*. That question found FR-40 in an afternoon and would have found FR-31
and FR-25 earlier, which suggests it belongs much closer to the front of the
process than the operational chapter at the end of it.

---

## 17. Artefacts

**New source (2,063 lines):**

| File | Lines | What |
|---|---|---|
| `src/observability/trace.mjs` | 347 | Spans, nesting, context stack, failure path, tenant-scoped store |
| `src/observability/events.mjs` | 209 | 45 declared fields, 19 prohibitions with reasons, retention by class |
| `src/observability/signals.mjs` | 402 | 9 strata, 28 signals across 6 dimensions, 9 alert rules, shadow, drift, rollout |
| `src/observability/production.mjs` | 316 | Incident model, review queue, trace→case promotion, release gates |
| `tests/observability.test.mjs` | 548 | 80 tests |
| `eval/verify-observability-runtime.mjs` | 241 | 38 runtime checks against the real server |

**Modified:** `src/server.mjs` — one trace per request created before anything
can fail; tenant resolved from the session at the top of `handle()`; identity
and authorization spans; `traceId`, `sampled` and `stratum` on the existing log
line; `GET /api/traces` and `GET /api/traces/:id` gated on `AUDIT_READ`;
`GET /api/questions/:id` routed through the authorization layer (FR-40).

**Tests:** 683 passing, up from 603. **No previous test was weakened, skipped
or modified.** FR-40 changed a route's implementation and all 603 inherited
tests still pass unchanged, including `T-14 reading another user's question ->
403, not 401 and not 404`, which is the test that made the route look covered.

**Registry:** S-068 through S-071 added, all directly retrieved. G-69 through
G-75 added; **G-69 is the first BLOCKING gap in this handbook**. F17 added to
the failure taxonomy with 18 subclasses. FR-38 through FR-43 recorded.

---

## 18. Sources

| ID | What it grounded |
|---|---|
| S-068 | OpenTelemetry Traces — the vocabulary of `trace.mjs`, and the one divergence (G-70) |
| S-069 | OpenTelemetry Sampling — head vs tail, and why our strata are cheap here and not in general (G-71) |
| S-070 | Google SRE Ch. 6 — what's broken vs why (the core experiment), errors "by policy", and what a page is for |
| S-071 | Microsoft Foundry Observability — the three-stage lifecycle and "continuous evaluation... at a sampled rate" |

Four sources, each grounding a distinct part, none padding another. S-070 is
from 2016 and predates every model in this handbook; nothing in it needed
adjusting for AI, which is worth noticing before reaching for AI-specific
observability advice.

Carried forward and load-bearing: S-066 (real-world task distribution),
S-021 (IBM's offline vs in-the-loop evaluation), S-064 (why control-plane
defences are the ones that hold).

---

## 19. Handoff to Chapter 15

Three things go forward.

**The instruments are built and the distribution is missing.** Chapter 13
handed forward "every number is offline". Chapter 14 hands forward something
narrower and more actionable: the machinery to turn production behaviour into
evaluation cases exists, is tested, and refuses to run without a human in it.
What is absent is not code.

**Asking "can this explain itself?" finds bugs that "is this protected?"
misses.** FR-40 was found this way after surviving two audits. That question
generalises past observability and probably belongs earlier.

**One gap is now BLOCKING.** G-69 is the first, and it is worth being clear
about what would close it: not more code, and not a bigger test suite. Users.
