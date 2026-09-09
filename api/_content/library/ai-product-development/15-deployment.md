# 15 — Deployment

**Status:** v1.0 · 2 September 2026
**Experiment:** `experiments/01-request-response-app`, same product as Chapters 04–14
**Lenses:** 1 (product and system architecture) · 7 (operational evaluation)

---

```
LEARNING PATH

LEARN     Release engineering and why configuration travels with the binary
          (S-072) · what a compensating transaction can and cannot restore
          (S-073) · rollout, revision and rollback mechanics (S-074) ·
          canarying as "partial and time-limited" (S-075)
WATCH     No video assigned. Nothing retrieved met the bar - see 17
BUILD     A release identity derived from code PLUS config PLUS schema · a
          deployment state machine that cannot skip verification · an audited,
          server-owned runtime kill path · rollback as five separate
          operations · change attribution · an explainability check that runs
TEST      746 deterministic tests. 63 new, all testing the DEPLOYMENT
          machinery · plus 64 runtime checks including a real cross-process
          restart
BREAK     Fifteen chapters with no way to turn anything off · containment that
          a restart silently undid · an admin who could not reach the affected
          tenant · a restart test that was not a restart, for the third time ·
          a route that would have crashed on first use, under 683 green tests
REFLECT   What did the rollback actually reverse?
```

> **PRODUCTION FINDINGS: NOT MEASURED.** Deskline serves no users. Every deploy
> and every rollback in this chapter is **production-like runtime
> verification** against the real server, over real HTTP, against a real
> database, including one demonstration across a real process boundary. G-69
> remains **BLOCKING**, and G-80 is now blocked by it.

> **REAL MODEL FINDINGS: NOT RUN.** `ANTHROPIC_API_KEY` is still unset (G-18).
> Deployment readiness and model-path readiness are reported as separate rows
> for exactly this reason.

---

## 1. The question

Chapter 02 taught branching, committing and reverting, and ended with a caution
that was explicitly deferred to here:

> *"Reversing the code does not reverse the world. A revert does not un-send an
> email, un-migrate a database, or un-publish a release. Everything in this
> chapter is reversible because Deskline touches nothing outside itself. **That
> stops being true in Chapter 15.**"*

It stopped being true in Chapter 08, when Deskline got tools; in Chapter 10,
when those tools reached other people's servers; and in Chapter 07, when runs
became things that could be queued, approved, and resumed hours later. By
Chapter 14 the product had thirteen chapters of controls and no way to operate
any of them.

So the governing question is the one that sounds like it has an obvious answer:

> **WE DEPLOYED SOMETHING BAD AND ROLLED IT BACK. WHAT ACTUALLY REVERSED?**

---

## 2. Two findings before a line of code

Phase 1 was reading, not building, and it produced both of the chapter's
structural findings.

**There was no runtime control path at all.** Every switch Deskline has —
`allowAgentRuns`, `allowExternalTools`, `allowUnreviewedServers`,
`autonomyLevel`, twelve of them — is read once from the environment in
`startServer()` and frozen for the life of the process. The only way to turn
anything off was to restart with different variables:

```
RESTART != KILL PATH.
```

A restart stops the unsafe thing by stopping everything, including the runs
mid-flight, the approvals somebody is waiting on, and the queued work about to
resume. It is pulling the mains out because a lamp is flickering, and it feels
like a control because the flickering stops. That is FR-44, and the
uncomfortable part is that every chapter from 07 onward built machinery
assuming an operator could intervene — approval gates, server revocation, an
adversarial suite, alerts that fire. **Nothing built the thing that acts.**

**The database has no schema version.** Every migration in `openDb` is an
additive `ALTER TABLE ... ADD COLUMN` guarded by a column check. Forward-only,
no down path, and nothing records which shape is running. That turns out to
matter enormously in §7 (G-77).

---

## 3. A release is not a commit

Chapter 01 deferred a sentence here too: *"the same code behaves differently in
different environments"*, demonstrated by `SLOW_MS`, `FAIL_WRITES` and
`RATE_LIMIT`.

Google's release engineering chapter puts the structural version of it
(S-072): *"binary configurations tend to be tightly bound to particular
versions of binaries."* Kubernetes puts the negative version — only a change to
the Pod template creates a new revision (S-074), so a change living outside the
tracked artefact is **invisible to the history an operator reads during an
incident.**

So `buildRelease()` derives the release id from code, configuration and schema
together, and it is derived rather than supplied:

```
commit aaaa111  +  config hash  +  schema s-6b330a34   ->  r-4b9feca5d6
commit aaaa111  +  failWrites:true                     ->  r-a5489418a6
```

**Same commit. Different release.** Verified at runtime, along with the
converse: redeploying identical inputs keeps the same id, because the deployer
and the timestamp are recorded and are not identity.

The config surface is an allow-list of twelve fields, each carrying what
changes when it changes. `port` and `dbFile` are excluded — a port is not a
deployment, and a snapshot that swallows whatever is on `cfg` makes every test
run look like a new release.

One detail turned into a finding while writing the verification. The snapshot
must come from the **resolved** config — `DEFAULTS` merged with environment
merged with options — not from the object a human passed in. A release id built
from declared config differs from the running one, which is configuration drift
with extra steps (F18.8).

---

## 4. Deployment states are not rollout stages

```
PREPARED → DEPLOYING → VERIFYING → ACTIVE → DEGRADED → ROLLING_BACK → ROLLED_BACK
                                                                    ↘ FAILED
```

Two properties are enforced rather than remembered.

**`DEPLOYING → ACTIVE` is not a legal transition.** You cannot reach ACTIVE
without passing through VERIFYING, because a process that started is not a
deployment that worked, and making that unreachable is cheaper than remembering
it under pressure.

**`ROLLED_BACK` is terminal.** From there you deploy forward. This follows
Kubernetes exactly, and the phrasing in S-074 is worth keeping: *"Each rollback
updates the revision of the Deployment."* **A rollback is a new revision, not a
return to an old one** — the system has been somewhere, and pretending
otherwise is how the state after a rollback becomes untracked.

And a deployment state is **orthogonal to Chapter 14's rollout stages**. A
canary can be ACTIVE; a full rollout can be ROLLING_BACK. No second rollout
model was built; `internal → canary → partial → full` is inherited unchanged,
and S-075 confirms rather than replaces it — its definition of canarying,
*"a partial and time-limited deployment of a change in a service and its
evaluation"*, makes the observation window part of the definition rather than
an option.

---

## 5. The kill path

Six controls, closed set, each parameterised or not:

```
agent_runs                       every run, new and resumed
external                         everything that leaves the process
retrieval                        grounded answers; the system abstains
tool:<name>                      one tool, everywhere
mcp_server:<name>                one server
blast_at_or_above:<radius>       a CLASS, not a tool
```

The set is closed because an operator under pressure needs a list they can
read, not a namespace they can invent keys in. A mistyped `agnet_runs` is
refused with `UNKNOWN_CONTROL`, because **a typo that disables nothing is worse
than no switch: it looks like containment and is not.**

Everything about a change is mandatory — `reason`, `actor`, and an explicit
`scope`. Every change is journalled and bumps a version. A self-asserted actor
is refused outright: Chapter 11 builds the actor, and a client claim is not one.
There is no ops back door, because an ops back door is an unaudited authority
that outlives whoever built it.

The blast-radius control is checked **by rank, not by string equality**.
Disabling `R2_EXTERNALLY_VISIBLE` must also stop `R3_IRREVERSIBLE`, or "turn
off everything externally visible" quietly leaves the worst things running.

Verified live, without a restart:

```
triage before          200
disable agent_runs     scope: all
triage after           503 CAPABILITY_DISABLED, reason: "ch15 verification"
GET /api/questions     200        <- the product keeps serving
enable                 control version 4
triage                 200
```

**A kill switch is not an outage**, and that is the whole difference between it
and the restart it replaces.

---

## 6. Where the switch lands decides what is possible

Chapter 07 established `CANCEL != COMPENSATE != ROLLBACK`. Chapter 08
established `TIMEOUT != FAILURE`. The same discipline applied to a kill switch
produces three rows, and the middle one is the one people want to skip:

| Observed | Can stop? | Outcome | State after | Compensation |
|---|---|---|---|---|
| BEFORE the action | yes | known | nothing happened | not applicable |
| **DURING the action** | **no** | **UNKNOWN** | **unknown** | **requires a human decision** |
| AFTER the action | no | known | the effect is real and stays real | possible if a compensator exists |

The request already left. **A kill switch does not reach into somebody else's
server** — that is not a missing feature, it is the boundary of the mechanism
(G-76), and treating it as "stopped" is the lie the table exists to prevent. An
unrecognised step status is classified `DURING_ACTION`, never assumed safe.

---

## 7. The experiment: deploy, break, roll back, and look

**Release A** — `commit aaaa111`, clean config. Baseline verified across all
eight checks: the process answers, the release id matches, the config matches,
policy versions are right, an authenticated request succeeds, **an unauthorized
one is still refused**, a failing request produces a trace that explains it, and
the kill path works without a restart.

That sixth check is the one that matters, and V8 is the one that would have
been discovered missing during an incident.

**Release B** — the *same commit*, `failWrites: true`. Writes return 500. The
config diff names the field, both values, and the effect. Change attribution
says:

```
behaviour changed with the CONFIG ALONE: failWrites false -> true
```

and when the same comparison is run with both code and config moved, it
refuses:

```
BOTH code and config differ: not attributable to either without a further experiment
```

The useful answer is *run another experiment*, not *pick the more interesting
candidate*.

**The response.** Not automatically a rollback — `chooseResponse()` returns an
ordered list, narrowest first, following S-075's *"pause and roll back"*
ordering. One bad tool gets `DISABLE_CAPABILITY`. A config fault gets
`ROLLBACK_CONFIG` and specifically **not** `ROLLBACK_CODE`, because a code
rollback that leaves config forward produces a combination nobody has ever run.

**The rollback, reported in five layers:**

```
CODE     not required   same commit: this is a CONFIG-ONLY rollback, and
                        calling it a code rollback would be wrong
CONFIG   required       failWrites: true -> false
POLICY   not required   no policy movement
DATA     not required   no schema change
EFFECT   required       2 recorded effects: 1 compensable, 1 IRREVERSIBLE

complete: false
"1 external effects are IRREVERSIBLE and remain true after rollback"
```

**The plan cannot report success.** That is the chapter. `complete` is false
and stays false, because one of the recorded effects was an email that has been
read, and no code movement un-reads it. S-073 is the authority and its wording
is precise: *"a compensating transaction does not necessarily return the system
data to its state at the start of the original operation. Instead, the
transaction compensates for the work that the operation completes successfully
before it failed."* Compensation is not reversal. It is a second action with
its own failure modes, and for high-impact cases *"the customer should make
this decision, not the system."*

**The schema case.** Run the same plan with the schema moved forward and the
DATA layer refuses:

```
DATA rollback is BLOCKED
"schema s-ffffffff -> s-6b330a34. Deskline's migrations are ADDITIVE AND
 FORWARD-ONLY: there is no down path"
```

Deskline is *lucky* here rather than careful: its migrations only add columns,
which old code ignores, which is precisely why code rollback is safe. Nothing
in the system would have told you the next migration was the kind that makes
rollback impossible (G-77).

**After restoring A:** writes work, the security property holds, and the
release id is byte-identical to the original. And then:

---

## 8. What the rollback cost

The rollback was a restart. The restart re-enabled everything an operator had
switched off.

```
child process: disable tool:send_email      1 disabled, version 1
kill, start a new process
                                             0 disabled, version 0
```

FR-45, and it is worse than a lost setting for two reasons. **The restart is
often the response to the same incident** — an operator contains a problem with
a switch, someone rolls the code back to fix it, and the rollback silently
undoes the containment; two safe actions combining into an unsafe one. And **it
fails open.** Everything in Chapters 11 and 12 fails closed by construction. A
safety control that re-enables itself is the one direction such a thing must
never move on its own.

**Deliberately not fixed** (G-78). The fix is persistence with a defined
precedence over deploy-time config, and both wrong answers are worse than the
current state: a durable switch nobody can find is an outage with no cause, and
a switch a deploy silently overwrites is this bug wearing a database.

**And getting here took a third encounter with an old trap.** The first version
of this check called `close()` then `startServer()` in the same process and
found the switches still set — because `controlPlane()` is a module-level
singleton and the process never died. Chapter 01's `start.mjs` has a comment at
the top of the file describing exactly this, about exactly this:

> *"The test looked like a restart and was not."*

That is F-04, third occurrence, and the fix was written down in the file I
should have read first (FR-47). Both outcomes are now asserted, because a
reader who tries the obvious thing deserves to be told why it does not work.

---

## 9. Queued work does not get a pass

A run approved under release A and resumed under release B has three possible
policies, and leaving the choice implicit is not one of them:

```
A. original release semantics   honour what was approved
B. current release semantics    honour what is true now
C. refuse and re-evaluate       make a human look
```

Deskline chooses **B for controls and C for changed authority, and never A.**
A is the only option under which turning something off fails to protect
anyone — the entire point of a switch is that work created before you flipped
it stops too.

```
tool disabled after approval    -> DISABLED_SINCE_QUEUED
approval predates the release   -> APPROVAL_PREDATES_RELEASE_CHANGE
blast class disabled            -> stopped, by rank
nothing changed                 -> resumes
```

> **AN APPROVAL IS EVIDENCE THAT SOMEBODY CONSENTED TO AN ACTION. IT IS NOT A
> LICENCE THAT OUTLIVES THE CONDITIONS IT WAS GIVEN UNDER.**

The second row is the subtle one: the approver was shown an action in a system
that is no longer the one that would execute it, so their consent has expired
even though nothing was disabled.

---

## 10. The admin who could not contain the problem

`POST /api/control/disable` defaults `scope` to the caller's workspace — the
right default, since a containment action should not be a cross-tenant outage.
Then the runtime verification produced this:

```
bo   the only seeded workspace_admin      w-globex
ana  running the triage in question       w-acme

bo disables agent_runs   -> scope w-globex
ana's next triage        -> 200. It ran.
```

The switch was set, the journal recorded it, and the operator had every reason
to believe the capability was off. It was off for the one workspace that was
not doing anything.

**Not fixed by changing the default**, which is the obvious move and the wrong
one — `all` by default means the first person who uses containment in anger
takes down customers with no part in the incident. Fixed by making scope
visible in the response and the journal, and requiring `scope: 'all'` to be
asked for.

The real finding is about who holds the switch. Every role in Chapter 11 is
workspace-scoped, which is correct for a product and insufficient for an
incident. **A platform operator is a role this product does not have**, and the
gap only became visible when there was finally something for one to do (G-79).

---

## 11. Can this path explain itself?

Chapter 14's strongest finding was that asking a trace to explain a 403 exposed
a route that had bypassed the authorization layer for fourteen chapters. That
question found a correctness bug two security sweeps had missed, so here it
stops being a lesson and becomes a check that runs.

Ten requirements, each answerable from **recorded evidence alone** — not
chain-of-thought, not a model explanation:

```
E1 which request      E6  what authorization decided, and why
E2 which actor class  E7  what path: retrieval, tool, external
E3 which tenant       E8  what side effect occurred
E4 which release      E9  where it failed
E5 which policies     E10 what remains irreversible
```

The bar scales with consequence: a read that returns one row does not owe an
answer to E8 or E10; an external action does. And the verdict wording is the
part that carries the lesson —

> a consequential path that cannot reconstruct itself from recorded evidence is
> reported as a **DEFECT**, not as thin logging.

The FR-40 trace — a 403 with no authorization span — fails E6 under this check,
which is the retrospective proof that it would have been caught.

**Should this move earlier in the handbook?** Probably, and it is recorded as a
transferable practice rather than a resequencing. The check costs almost
nothing, needs no adversarial imagination, and has now found one real
correctness defect and one operational blind spot. Chapters are not being
reordered on two data points, but a reader building their own system should
run it from the first consequential path they write.

---

## 12. Readiness, without an average

Fourteen dimensions, no overall score, because an averaged number lets two
BLOCKED rows hide behind eight READY ones.

```
READY            build/release reproducibility   release id from code + config + schema
READY            configuration attribution       config snapshot in every release, diffable
READY            functional verification         746 tests, 8 verification checks
READY            security                        authorization + adversarial suite, unchanged
READY            observability                   traces carry release and policy versions
READY            irreversible-effect handling    recorded, surfaced, never auto-compensated
READY            evaluation                      Chapters 13 and 14, unchanged
PARTIALLY READY  privacy                         telemetry contract enforced; consent and deletion are not (G-74)
PARTIALLY READY  operability                     kill path works; it does not survive a restart (FR-45)
PARTIALLY READY  rollback                        code and config reverse; data and effects do not
PARTIALLY READY  kill path                       reaches new, queued and resumed work; not in-flight
PARTIALLY READY  migrations                      additive and forward-only; no down path, no stored version
BLOCKED          model path                      G-18, ANTHROPIC_API_KEY unset
BLOCKED          real-user evidence              G-69, no users
```

Both BLOCKED rows carry `blocksDeployment: false`, and that is a deliberate
claim rather than a convenience. **A system can be deployable and have no
real-user evidence.** Collapsing those into one verdict produces either a
launch nobody can defend or a permanent block nobody can lift.

---

## 13. What would close G-69

G-69 stays **BLOCKING**. This is written down now, before any data exists,
precisely so it cannot be closed by a criterion invented after the data
arrives.

The minimum evidence plan asks for 8 participants across 2 workspaces, 10
working days, 300 sampled traces with every non-success stratum kept in full, 5
task types at n ≥ 20 each, 30 attempted actions above `R0_READ`, 40
human-reviewed traces including every denial, at least 2 releases so attribution
can be demonstrated, and informed consent with a named deletion path.

Each number is justified by what it makes answerable — 2 tenants because below
that nothing can be said about tenant-scoped behaviour; 20 per cell because
Chapter 13 already refuses to compute a rate below it; 30 protected-action
opportunities because *"0 unauthorized writes"* is only evidence if there were
writes to authorize.

Meeting all of it moves G-69 to **PARTIALLY MEASURED**. It never moves it to
CLOSED, and the plan says what stays unknowable first: no usable confidence
interval on anything rare, nothing about scale or concurrency, nothing
adversarial (8 friendly participants are not an attacker), no claim that the
real task distribution resembles the synthetic one at any larger population,
and nothing at all about model behaviour, which stays blocked on G-18 however
many users there are.

---

## 14. What broke

| | Failure | Class | Found by |
|---|---|---|---|
| FR-44 | Fifteen chapters and no way to turn anything off | F18.1 | Reading `startServer` in Phase 1 |
| FR-45 | Containment silently undone by a restart | F18.2 | A real cross-process restart. **OPEN** |
| FR-46 | The admin could not reach the affected tenant | F18.3 | Runtime verification |
| FR-47 | A restart test that was not a restart, third time | F18.4 | The check failing when it should have passed |
| FR-48 | A route that would have crashed on first use | F18.5 | Grep, before any test called it |
| FR-49 | The release was on the record and not on the screen | F18.6 | A runtime check with an empty value |

Two are worth a second look.

**FR-48 is the smallest and says the most.** The new operator routes called
`readJson` instead of `readJsonBody`. All 683 tests passed — because no test
called the route, and the route was new. A green suite is evidence about the
code the suite exercises, and 683 is a large enough number to feel like it
should have meant more than that. The runtime verification would have caught it
on its first run, which is the argument for running the integration path early
rather than after the unit tests are tidy.

**FR-49 is the same lesson in the other direction.** `releaseId` was added to
the trace, travelled correctly, was stored correctly — and was missing from the
hand-written projection in `GET /api/traces`. Grouping failures by release is
the first thing an operator does, and the list could not do it. **A field that
exists and is not projected does not exist.**

---

## 15. Learning Checkpoint

1. Two processes run the same commit. Give a concrete reason they may be
   different systems, and say what breaks if you call them one.
2. Why is `DEPLOYING → ACTIVE` not a legal transition here?
3. Kubernetes says each rollback *updates* the revision. What does that imply
   about the state you are in after a rollback?
4. Name the five things "rollback" can mean, and say which of them can report
   success.
5. An operator disables a tool, then someone rolls the code back. What happened
   to the containment, and which direction did it fail in?
6. A kill switch is flipped while an external call is in flight. What is the
   state of that action?
7. A run was approved yesterday under a different release. Should it resume?
   Defend the answer against the other two options.
8. Why is a mistyped control name refused rather than accepted?
9. 683 tests passed over a route that would crash on its first call. What does
   the number 683 actually tell you?
10. Distinguish observability from operability using something from this
    chapter.

---

## 16. Checkpoint Discussion

**1.** `SLOW_MS`, `FAIL_WRITES`, `RATE_LIMIT`, `allowExternalTools`,
`autonomyLevel` — any of them changes what the product does while the commit
stays identical. If you call them one system, the incident is unreproducible:
you check out the commit, cannot reproduce the failure, and conclude the report
was wrong.

**2.** Because the transition you are tempted to make is *the process started,
therefore we are live*. Making it unreachable in the state machine is cheaper
than remembering it under pressure, and VERIFYING is where V6 — is an
unauthorized request still refused — actually runs.

**3.** That you are not back where you were; you are somewhere new that
resembles it. The code matches an earlier revision, and the data, the external
effects and the runtime controls do not. `ROLLED_BACK` is terminal here for the
same reason: from there you deploy forward.

**4.** CODE, CONFIG, POLICY, DATA, EFFECT. The first three reverse. DATA
sometimes reverses and refuses when the shape moved forward. **EFFECT never
reverses** — at best it compensates, which is a second action with its own
failure modes, and at worst it is acknowledged.

**5.** It was silently re-enabled, and it failed **open**. That is the direction
a safety control must never move on its own, and the sting is that the restart
was itself part of the response to the same incident.

**6.** Unknown. The request has left; the switch is on this side of it. This is
Chapter 08's `TIMEOUT != FAILURE` arriving through a new door, and the honest
outcome is `UNKNOWN` with a human decision pending — not "stopped".

**7.** No, on both available grounds. If the tool is now disabled, the whole
point of the switch is that work created before it stops too — that is why
"original release semantics" is never the policy. If the release changed, the
approver consented to an action in a system that is no longer the one that would
execute, so the approval expired even though nothing was disabled. "Current
release semantics" alone would silently execute under conditions nobody
approved; "refuse and re-evaluate" alone would block routine work every time
anything shipped.

**8.** Because a typo that disables nothing looks exactly like containment. The
operator believes the capability is off, stops watching, and the switch is not
connected to anything. A closed set means an unknown key is an error rather
than a no-op with a comforting response.

**9.** That 683 assertions hold about the code they exercise. It says nothing
about a route written thirty seconds earlier — which is F16.17's coverage
lesson in its plainest form: the empty cell is the finding, and a large total
disguises it.

**10.** Chapter 14 could tell you a request failed at the authorization layer,
under policy `idp-v1`, for `WRONG_TENANT`. It could not turn the tool off.
**Observability is knowing. Operability is being able to do something** — and
Deskline had the first without the second for fourteen chapters, which is
exactly why FR-44 was invisible.

---

## 17. Reflect

The rollback worked and the report says `complete: false`, and both of those
are true at once. That combination is the thing to carry out of this chapter.

Everything before this in the handbook could be made correct by making the code
correct. A wrong authorization decision is fixable. A contaminated holdout is
fixable, expensively. A trace that cannot explain a failure is fixable. This is
the first chapter where the honest answer to *can we fix it* is sometimes no —
the email was read, and no amount of correct code un-reads it. The only
available discipline is to know which steps are like that **before** running
them, and to say so plainly afterwards.

Which reframes what deployment machinery is for. It is not for making changes
safe; nothing makes an irreversible action safe. It is for making the
irreversible parts **small, visible, and deliberately entered**. That is what
the blast-radius model has been doing since Chapter 07, and what the five-layer
rollback report does here: it does not make the email un-sendable, it makes the
email the only thing you have to think about while the other four layers take
care of themselves.

The second thing worth carrying is smaller and more immediately useful. Two
findings in this chapter — FR-48 and FR-49 — were about the gap between what
the code contains and what anyone can see. A route with a typo under 683 green
tests; a field that was recorded, stored, correct, and absent from the screen.
Neither was a hard bug. Both survived a full test suite. Both were caught in
seconds by driving the real thing and looking at what came back, which is an
argument about ordering rather than about testing: **run the integrated path
early, because it is the only place where the difference between "the code is
right" and "the system works" shows up.**

---

## 18. Artefacts

**New source (2,001 lines, of which 998 are product code):**

| File | Lines | What |
|---|---|---|
| `src/deployment/release.mjs` | 355 | Config surface and snapshot, release identity, deployment state machine, five-layer rollback plan |
| `src/deployment/control.mjs` | 315 | Six runtime controls, audited disable/enable, kill semantics, resume decision |
| `src/deployment/verify.mjs` | 328 | Eight verification checks, change attribution, explainability check, response selection, readiness, G-69 closure plan |
| `tests/deployment.test.mjs` | 480 | 63 tests |
| `eval/verify-deployment-runtime.mjs` | 523 | 64 runtime checks including a real cross-process restart |

**Modified:** `src/server.mjs` — control plane and active release, established
before the listener binds; kill check at the triage route and in run deps;
`releaseId` on every trace and in the trace list; `GET /api/release`,
`GET /api/control`, `POST /api/control/{disable,enable}` behind `audit:read`.
`src/agent/run.mjs` — a per-step kill check before freshness.
`src/agent/orchestrator.mjs` — release stamping on runs.
`src/db.mjs` — `schemaShape()`, derived because nothing stores it.
`src/observability/trace.mjs` — `releaseId` on the trace and its record.

**Tests:** 746 passing, up from 683. **No previous test was weakened, skipped
or modified.**

**Registry:** S-072–S-075 added, all directly retrieved. G-76–G-80 added; G-69
remains the only BLOCKING gap, now blocking G-80 as well; **G-78 is a known
safety defect left open with its design question stated.** F18 added with 20
subclasses. FR-44–FR-49 recorded.

---

## 19. Sources

| ID | What it grounded |
|---|---|
| S-072 | Google SRE Ch. 8 — configuration bound to the binary; RELEASE != COMMIT |
| S-073 | Azure Compensating Transaction — what compensation restores, points of no return, and why a human decides |
| S-074 | Kubernetes Deployments — a rollback is a new revision; only tracked changes create one |
| S-075 | SRE Workbook Ch. 16 — canarying as partial and time-limited; pause before rollback |

Four sources, each grounding a distinct layer, none padding another. S-072 and
S-075 predate this handbook's subject matter by roughly a decade and needed no
adjustment for AI products — which is worth noticing before reaching for
AI-specific deployment advice. What AI *does* change is which steps are
irreversible and how many of them a single request can reach, and that is a
question about blast radius, which Chapter 07 already answered.

---

## 20. Handoff to Chapter 16

Chapter 16 is the Capstone: integration across all seven lenses. Three things
go to it.

**The product is deployable and has never been deployed to anyone.** Those are
two different claims and the readiness table now keeps them apart. G-69 is
BLOCKING, its closure criteria are written down in advance, and nothing in this
chapter closed it.

**One known safety defect is open by choice.** G-78 — runtime controls do not
survive a restart, and fail open when they vanish. It is left open with the
design question stated rather than closed with a guess, and a capstone that
integrates everything should decide it rather than inherit it.

**Ask the integrated question early.** Two of this chapter's six findings
survived 683 passing tests and died in seconds against the real server. The
capstone is the chapter with the most surface for that gap to hide in.
