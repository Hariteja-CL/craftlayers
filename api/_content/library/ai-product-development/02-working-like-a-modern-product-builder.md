# 02 — Working Like a Modern Product Builder

**Status:** v1.0 · 31 August 2026
**Experiment:** `experiments/01-request-response-app` — the same Deskline from
Chapter 01. No new project.
**Work item:** `experiments/01-request-response-app/issues/F-05-network-failure.md`

---

```
LEARNING PATH

LEARN     Pro Git on branches and revert (S-028, S-030) · MDN on AbortController
          (S-029) · Node's test runner (S-031)
WATCH     V-007 How Git Works (mental model only — see the caution)
BUILD     Fix F-05, a real defect left open at the end of Chapter 01
TEST      Six regression tests, written first, failing first
BREAK     A weak red · a second bug found mid-fix · 32 green tests over a
          completely broken application · an edit the running process ignored
REFLECT   What of this workflow survives contact with an AI writing the code
```

---

## 1. The problem

Chapter 01 ended with a defect written down and left alone:

> **F-05 — Network failure is not handled (open).** `app.js` handles every
> response the server sends. It does not handle the server sending nothing at
> all… There is also no timeout. A request that never returns leaves the button
> disabled indefinitely.

This chapter fixes it. But fixing it is not the point — it is the vehicle.

The point is the thing that happens around the fix. Because here is the position
you are actually in, and it is new:

**You can now get code written for you.** Describe what you want and something
will produce a plausible implementation, with tests, with confident explanations
of why it works. The bottleneck has moved. It is no longer *can I write this*. It
is:

> **Do I have any idea whether what I just accepted is correct?**

That question has a real answer, and it is not "read every line carefully". It is
a workflow: reproduce before you fix, write the expected result before you see
the actual one, keep the change small enough to review, look at the diff, verify
from the integrated state, and keep every step reversible.

None of that is about Git. Git is where some of it is *recorded*. The commands in
this chapter are answers to questions, and the questions are the subject.

## 2. Why a Product Designer should care

You already run this workflow. You just run it on designs.

| What you do with designs | The same move, in code |
|---|---|
| Reproduce the user's problem before redesigning | Reproduce the defect before fixing it |
| Write acceptance criteria before exploring | Write the test before the implementation |
| Explore in a copy, not the master file | Work on a branch |
| Review a change against the brief | Review the diff against the issue |
| Version history so you can go back | Commits, and `revert` |
| Design critique | Code review |

The unfamiliar part is not the discipline. It is the vocabulary and the fact that
the artefacts are text.

And there is a second reason, sharper. Three things in this chapter are
**product decisions wearing engineering clothes**: what the acceptance criteria
say, what the failure messages claim, and what we decided we are *not allowed to
tell the user*. All three were settled in this workflow, not in a design review.
If you are not in the workflow, you are not in those decisions.

---

## 3. Where am I? — orienting before touching anything

Four questions, four commands. Ask them in this order every time you sit down in
a repository, especially one you did not write.

### "Where am I?"

```bash
pwd
```

Sounds trivial. It is the reason someone eventually runs a destructive command in
the wrong directory. Prints the current working directory, nothing else.

### "Is this working tree already carrying changes?"

```bash
git status
```

This is the important one, and it is almost never taught as what it is. It is not
"display information about the repository". It is:

> **Before I touch anything: is there already unfinished work here — mine from
> yesterday, or something a tool left behind?**

Starting work on top of somebody else's half-finished edits is how two unrelated
changes end up in one commit, and how a reviewer ends up unable to tell which
change caused which effect. Our answer:

```
$ git status --short --branch
## master
```

One line, no file list. The tree is clean, we are on `master`. Safe to start.

`[Design interpretation]` **This matters much more in an AI-assisted session than
it used to.** An agent may have edited six files while you were reading
something. `git status` before you begin is how you find out what the session
already did, rather than discovering it later inside your own commit.

### "What has been happening here?"

```bash
git log --oneline -6
```

> **What is the recent story of this project, and who has been working on what?**

```
18a5e30 chapter 01: how modern software products work
34d48c7 research: close G-03, G-07 and G-08; freeze the chapter sequence
73394ea research: reduce G-02 and G-04, revise evaluation and chapter architecture
d55ff3b chore: establish handbook planning artifacts
```

Four commits, four coherent units of work. That readability is not an accident of
the tool — it is a consequence of somebody deciding what belongs in one commit.
A log of `wip`, `fix`, `fix again`, `actually fix` is a project whose history has
stopped being usable.

### "What actually changed in that commit?"

```bash
git show --stat 18a5e30      # which files, how much
git show 18a5e30             # every line
git diff                     # what I have changed and not yet committed
```

> **What did this change actually do — as opposed to what its message claims?**

The message is a person's summary. The diff is what happened. When they disagree,
the diff is right.

### Reading an unfamiliar codebase: trace, do not read

You will not read Deskline top to bottom, and you should not. Follow the
behaviour you care about:

```
1. README.md            what is this, how do I run it, what is known broken
2. the file tree        what are the pieces, roughly
3. the entry point      src/start.mjs — where does execution begin
4. the relevant path    only the request you care about
5. the relevant test    what does the project already claim about this
6. the state boundary   what is in memory, what is on disk
7. adjacent code        LAST, and only if the trace demanded it
```

For F-05 that is about fifteen minutes and four files, not four hundred lines.
Step 5 is the one people skip and shouldn't: **the existing tests tell you what
the project believes about itself**, in a form that had to be true at least once.

---

## 4. Reproduce before you fix

F-05 was already written up. It would have been entirely reasonable to read the
note and start coding.

That would have produced the wrong fix.

Two situations were reproduced in a browser. Case B, a server that accepts the
request and never answers (`SLOW_MS=999000`):

| Elapsed | Button | Status region | Error region |
|---|---|---|---|
| 6 s | `Sending…`, disabled | "Sending your question…" | *(empty)* |
| 30 s | `Sending…`, disabled | "Sending your question…" | *(empty)* |

Case A, the server process stopped entirely:

```
raw:   { name: "TypeError", message: "Failed to fetch", hasStatus: false }
shown: errorShownToUser: "Failed to fetch"
       button: "Send", disabled: false        ← the button recovered fine
```

**And now compare that with what the bug report said.**

| F-05 claimed | Reproduction showed |
|---|---|
| "the user gets the generic fallback message" | The user sees **"Failed to fetch"** — the browser's own string, text nobody on the team wrote |
| "leaves the button disabled indefinitely" | **Only in case B.** In case A `finally` runs and the button recovers |

The note had described **two different defects as one**, and had been wrong about
what the user sees. It was written by the person who wrote the code, one day
earlier.

> `[Design interpretation]` **A bug report is a hypothesis, not evidence.**
> Every bug report is somebody's reconstruction of something that happened to
> them, and reconstruction is where the errors get in. Reproducing is not
> ceremony before the real work. It is how you find out what you are fixing.

Had the fix been built from the note, it would have targeted a hang that does not
happen in the case being described, and the "Failed to fetch" string — the thing
a user actually sees — would have survived untouched.

---

## 5. Turning a defect into a work item

Before any code: `issues/F-05-network-failure.md`. Six sections, and each exists
to prevent a specific way this goes wrong.

| Section | What it prevents |
|---|---|
| **Problem** | Fixing a symptom because nobody stated the mechanism |
| **User consequence** | Solving the technically interesting half |
| **Expected behaviour** | "Better" as a target, which cannot be hit |
| **Acceptance criteria** | Finishing being a matter of opinion |
| **Out of scope** | A small fix becoming a large one |
| **Test requirement** | Deciding after the fact what would have counted |

The **acceptance criteria** are the part to take seriously, and they are the part
a designer will recognise instantly:

> **AC-2** — It rejects at roughly the timeout, not when the server eventually
> replies (measured: within timeout + 1500 ms).

That is a product statement in measurable form. Notice what it forecloses: a
"fix" that renames the existing behaviour and calls it a timeout would satisfy a
looser criterion and fails this one.

And **out of scope** does more work than it looks like:

- **No retry.** `POST` is not idempotent (Chapter 01, §6) — retrying it can
  create two questions. A real retry needs idempotency keys, which is a *server*
  change and a different piece of work.
- **No offline detection, no cancel button, no server changes.**

`[Design interpretation]` Every one of those is a reasonable thing to want, and
each would have doubled the change. **Scope is not written down to be
restrictive. It is written down so that "should we also…" has an answer that is
not a matter of energy levels at 5pm.**

### The three failures, and a product decision inside a technical one

The issue insists on three failure classes, not two:

| Situation | Class | Do we know if the write happened? |
|---|---|---|
| The server answered with an error | `HTTP_ERROR` | **Yes** — it told us |
| Sent, no answer in time | `TIMEOUT` | **No.** It may have been saved |
| The connection never opened | `UNREACHABLE` | **Yes** — never received |

To a user, `TIMEOUT` and `UNREACHABLE` are the same event: it didn't work. It is
very tempting to write one message for both.

Look at the third column and it becomes impossible. After a refused connection we
*know* nothing was saved. After a timeout **we do not know** — the server may
have written the row and simply been slow to say so. Telling that user "your
question was not saved" is a confident lie, and the thing they will do next is
send it again.

So the messages differ:

> **UNREACHABLE** — "We couldn't reach the server. Your question hasn't been sent
> — check your connection and try again."
>
> **TIMEOUT** — "The server is taking too long to respond. Your question **may or
> may not** have been saved — check your list before sending it again."

`[Design interpretation]` This is a UX decision that only exists if someone looked
at the mechanism. "May or may not have been saved" is worse copy by every
conventional measure — hedged, longer, less reassuring. It is also the only
honest thing we can say. **An interface may group failures. It must never assert
something the system does not know.**

---

## 6. The branch

```bash
git switch -c fix/f-05-network-failure-handling
```

> **Can I work without the risk of leaving the main line broken partway
> through?**

`[Documented behaviour]` Pro Git: *"A branch in Git is simply a lightweight
movable pointer to one of these commits."* And on cost: *"Creating a new branch
is as quick and simple as writing 41 bytes to a file (40 characters and a
newline)"*, in contrast with older tools where branching *"involves copying all
of the project's files into a second directory."* (S-028)

**What the branch gives you.** A place to be halfway through. Work can be broken,
committed, thought about overnight and abandoned without `master` ever containing
it. The whole change can be reviewed as one unit. And it can be thrown away
completely — which is what makes trying an approach cheap.

**What it does not give you.** This is the part usually skipped:

- **It is not isolation from the machine.** A branch does not undo a database
  migration, an installed package, or a file written outside the repository.
- **It is not isolation from other branches diverging.** The longer it lives, the
  more `master` has moved, and the merge gets harder — not linearly.
- **It does not make the change good.** A branch is a container. It has no
  opinion about what is in it.

**Why small and focused.** Our branch touched 8 files, +847 / −44, all inside one
experiment. That is reviewable in a sitting. A branch touching sixty files gets
approved rather than reviewed, and everyone involved knows it.

**Why unrelated changes must stay out** — proven below, in §8.

---

## 7. Red, green, and one weak red

The regression test came before the fix. Not as doctrine — **because of what this
particular defect is.**

> **Test-first is not always right. For a known defect it is close to
> unarguable**, for one reason: you have the failing behaviour in front of you
> *now*. Write the test after the fix and you can only write it against code that
> already passes it, and you will never see it fail. A regression test that has
> never failed is a test you are trusting on faith.

### The first red was a bad red

The test imported a module that did not exist yet:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module …/src/public/net.mjs
```

Red, technically. Worthless, actually. It proves **a file is missing** — it says
nothing about behaviour, and it would look identical for a typo in the path.

So the *existing* behaviour was extracted into `net.mjs` first, unchanged, and
the tests were run again. Now they failed for real reasons:

```
▶ F-05 — regression
  ✔ N-01 (AC-5) a successful request still resolves with the parsed body
  ✖ N-02 (AC-4) a server error rejects as HTTP_ERROR and keeps the status
  ✖ N-03 (AC-1) a slow server rejects as TIMEOUT                       (3042ms)
  ✖ N-04 (AC-2) the timeout fires near the deadline                    (3029ms)
  ✖ N-05 (AC-3) an unreachable server rejects as UNREACHABLE
  ✖ N-06 (AC-6) every failure carries one of our codes and a message we wrote
ℹ pass 3   ℹ fail 5
```

| Test | Expected | Actual |
|---|---|---|
| N-02 | `HTTP_ERROR` | `TEXT_TOO_SHORT` — the server's code, not a failure class |
| N-03 | `TIMEOUT` | `SERVER_ERROR` — it waited the full 3 s |
| N-04 | reject near 500 ms | **3029 ms** — no deadline existed |
| N-05 | `UNREACHABLE` | `undefined` — a `TypeError` has no `code` |
| N-06 | 3 classified failures | one unclassified reached the caller |

**N-01 passing is the useful one.** The happy path was already correct and had to
stay correct; a fix that broke it would have been caught immediately.

> **A red that names the defect is worth having. A red that says "file missing"
> is a spelling check.** If your failing test does not tell you what is wrong
> with the *system*, it is not yet the test you need.

### Green

```
  ✔ N-01 (AC-5) a successful request still resolves with the parsed body (119ms)
  ✔ N-02 (AC-4) a server error rejects as HTTP_ERROR and keeps the status (44ms)
  ✔ N-03 (AC-1) a slow server rejects as TIMEOUT                          (553ms)
  ✔ N-04 (AC-2) the timeout fires near the deadline                       (531ms)
  ✔ N-05 (AC-3) an unreachable server rejects as UNREACHABLE                (5ms)
  ✔ N-06 (AC-6) every failure carries one of our codes and a message      (360ms)
ℹ pass 8   ℹ fail 0
```

**Read the durations, not the ticks.** N-03 went 3042 ms → 553 ms; N-04 3029 ms →
531 ms. The server still answers at 3000 ms. The client now stops waiting at 500.
That number is the fix. A green tick alone could not tell a real timeout from a
renamed 500 — which is exactly why AC-2 was written as a measurement.

### The implementation

`[Documented behaviour]` MDN: *"The `AbortController` interface represents a
controller object that allows you to abort one or more Web requests as and when
desired"*, and `abort()` *"is able to abort fetch requests, consumption of any
response bodies, and streams."* (S-029)

That is the whole mechanism. `fetch` has no timeout of its own and never will —
it waits as long as the connection stays open. **Something outside it has to
decide when to stop.**

```js
const controller = new AbortController();
let timedOut = false;                    // WHY we aborted, not just THAT we did

const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);

try {
  res = await fetch(url, { …, signal: controller.signal });
} catch (err) {
  if (timedOut)               throw new NetworkError(FAILURE.TIMEOUT, …);
  if (callerSignal?.aborted)  throw new NetworkError('CANCELLED', …);
  throw new NetworkError(FAILURE.UNREACHABLE, …, { cause: err });
} finally {
  clearTimeout(timer);
}
```

Three details worth noticing, because each is a decision:

1. **The `timedOut` flag.** An abort caused by our deadline and an abort caused
   by the user pressing Cancel arrive at the same `catch` looking identical.
   Without the flag we would report one as the other.
2. **`cause: err` is kept, and never displayed.** The runtime's message is
   genuinely useful in a log and genuinely wrong in an interface.
3. **`clearTimeout` in `finally`.** Same discipline as Chapter 01's loading state,
   and for the same reason: cleanup that only runs on success is cleanup that
   fails on the bad day.

---

## 8. Debugging, done properly

Debugging is not editing until the tests go green. It is a loop:

```
OBSERVATION → HYPOTHESIS → EVIDENCE → NARROWING → FIX → VERIFICATION
```

The step people skip is **EVIDENCE**, and skipping it is how you end up
"fixing" working code. Chapter 01 produced four cases where the first plausible
explanation was wrong: the rate limiter blamed for shared test state (F-01),
authorization blamed when the setup step never reached it (F-02), failure
handling blamed when the *cleanup* path hung (F-03), and sessions blamed for
surviving a restart that never happened (F-04).

Chapter 02 produced a fifth, and it followed the loop exactly.

### The case: three tests failed, including one that should not have

**OBSERVATION.** After adding the regression tests, three tests failed — and one
of them was `N-01`, the happy path, which had nothing to do with anything new.

**HYPOTHESIS.** "The new `net.mjs` broke the happy path." Plausible. That is the
only thing that changed.

**EVIDENCE — before touching a line.** The server's own log:

```json
{"event":"unhandled_error","route":"/api/questions","message":"data store unavailable",
 "stack":"Error: data store unavailable\n    at live (src/db.mjs:66:33)"}
```

The failure was not in `net.mjs`. The database was gone. The hypothesis was
already dead, and it cost one command.

**NARROWING.** Which database, and why gone? The test starts three servers. The
third exists only to obtain a port that nothing is listening on, so it is closed
immediately. And:

```js
let db = null;                                    // module-level. Shared.
export function closeDb() { …; db = null; }       // for everyone
```

Closing *any* server sets the handle to `null` for *all* of them.

**FIX — and the decision not to make it.** The obvious fix is to give each server
its own handle. That is a real defect and the right fix, and **it was not made
here.** F-05 is a client-side issue whose own scope section says the server is not
touched. Filed as **F-06**; the test now gets its dead port from a plain
`node:net` socket instead.

**VERIFICATION.** Re-run. N-01 passes, and the remaining five failures are exactly
the five acceptance criteria not yet implemented.

> `[Design interpretation]` **"I found a second bug" is not permission to fix it
> here.** Two fixes in one branch produce a diff where a reviewer cannot tell
> which change caused which effect — and if something breaks after the merge, you
> have two suspects instead of one. Write it down, and let it be somebody's whole
> attention later.

**And notice what did the work twice now.** Chapter 01's F-01 was diagnosed from
a log line. So was this. The logging in `log.mjs` was written as a teaching
example about privacy; it has since paid for itself twice as the fastest route to
evidence. That is what logs are actually for.

---

## 9. AI-assisted development

The most important section in this chapter, because it is the part of your
working life that changed most recently.

**The failure mode is not that AI writes bad code.** It writes plausible code,
which is harder. Bad code announces itself. Plausible code looks like the thing
you asked for and is wrong in one place you did not think to check.

### The workflow that survives contact with a confident collaborator

**1. Ask it to inspect before changing.** *"Read `app.js` and tell me how a
failed request reaches the user"* before *"add a timeout"*. A model that has not
read the code will still answer, fluently.

**2. Require a reproduction.** *"Show me the failure happening before you fix
it."* This chapter's reproduction corrected the bug report in two places. Without
it, the fix targets a description rather than a defect.

**3. Define acceptance criteria yourself, before generation.** This is the
highest-value thing on the list, and the one only you can do. AC-2 — *fires near
the deadline, not when the server replies* — is a product judgement. Ask an AI to
"add a timeout" and you may well get one that satisfies the word and not the
requirement.

**4. Ask for a small diff.** "Change as little as possible" is a real instruction
and it works. The default is expansive: a helper, an abstraction, a config
object, three files you did not ask about.

**5. Inspect what was generated — and inspect the tests harder than the code.**
Here is why, and it is not hypothetical:

> **AI-generated tests can be wrong in the specific way that is hardest to
> notice: they pass.**

Chapter 01's **F-04** is the evidence. A test asserting that a session does *not*
survive a restart "restarted" the server by closing and reopening it **inside one
process**. The module was never unloaded, the session survived, and the test
reported `200`. Had that expected value been written as `200` — the observed
behaviour — it would have passed forever while documenting the exact opposite of
the truth.

It was caught only because `401` had been written down **before the run**, in
`eval/test-set.md`, and could not be quietly adjusted to match reality.

> **A passing test proves the code does what the test says. It proves nothing
> about whether the test says the right thing.** Read the assertion. Ask what
> would have to be true for it to pass while the system is broken.

**6. Run the tests yourself.** Not "did it say they passed". Run them. Read the
count. `ℹ pass 32 ℹ fail 0` is evidence; a summary of it is a claim.

**7. Check what changed outside the intended scope.** `git status` and
`git diff` after every generated change. This is the single highest-yield habit
in AI-assisted work, because the tools are fast enough to touch files you were
not thinking about.

**8. Reject unnecessary abstractions.** "This might be useful later" is how a
40-line fix becomes a 400-line framework. `net.mjs` is 138 lines including its
comments and exports one function.

**9. Preserve evidence.** Failing output, log lines, measurements. When someone
asks in three weeks why the messages differ, `failures.md` answers and memory
does not.

**10. Challenge confident explanations.** Fluency is not correlated with
correctness — not in an AI, and not in a senior engineer. Every wrong hypothesis
in these two chapters was *plausible*. The rate limiter really could have been
firing early. `net.mjs` really could have broken the happy path.

> **A plausible explanation is not evidence.** The question is always the same
> one: *what would I observe if this were true, and have I observed it?*

**11. Read shell commands before running them.** Slower than accepting, and the
only thing between you and a command that touches a directory you did not intend.
`rm -rf`, `git reset --hard`, `git push --force`, anything with a wildcard.

### And the honest limit on AI review

An AI can review this diff, and it will find real things. But:

> **If it wrote the implementation, its review of that implementation is not
> independent evidence.** It is the same model, with the same assumptions,
> reading its own reasoning. It will be persuasive about them.

Use it as a second pair of eyes. Do not use it as a second opinion.

---

## 10. Reading the diff before you commit

The diff is the last point at which a change is cheap to stop.

```bash
git status              # which files — anything unexpected?
git diff --stat         # how big
git diff                # every line
```

The nine questions, run against this change:

| Question | Our answer |
|---|---|
| Did only intended files change? | Yes — 2 modified, 3 added, all inside the experiment |
| Is every changed line necessary? | Yes. `server.mjs` gained 6 lines, 5 of them a comment |
| Did the AI refactor unrelated code? | No — checked by reading, not assumed |
| Did dependencies change? | No `package.json` exists. Nothing to change |
| Did security/privacy behaviour change? | See §11 |
| Did error handling change? | **Yes, and that is the point** — so it got the closest reading |
| Were tests weakened to make them pass? | `git diff --stat -- tests/api.test.mjs tests/failure-modes.test.mjs` → **empty**. The 24 existing tests are untouched |
| Was an assertion removed? | `git diff \| grep "^-.*assert"` → **empty** |
| Did expected behaviour silently change? | One place, examined below |

Two of those deserve more than a tick.

**"Were tests weakened?"** is the question that catches the most damaging thing a
change can do, and it has a mechanical answer:

```bash
git diff --stat -- tests/api.test.mjs tests/failure-modes.test.mjs   # empty
git diff -- experiments/ | grep -E "^-.*assert"                      # empty
```

No existing test modified, no assertion deleted. **A suite that was made to pass
by lowering what it asserts is worse than no suite**, because it still reports
green.

**"Did expected behaviour silently change?"** — yes, in one place the diff does
not draw attention to. The final `else` branch used to be:

```js
} else {
  setError(err.message);          // ← could be "Failed to fetch"
}
```

and is now a message we wrote. That is the fix working. But it means **the
sign-in handler**, thirty lines away and untouched by this change, still does
`setError(e.message)` — and is now safe only because `net.mjs` guarantees it
never emits a runtime string. Safe by an invariant rather than by inspection.

That invariant is asserted, in N-06:

```js
assert.ok(!/failed to fetch/i.test(err.message),
  `a runtime-authored message escaped to the caller: "${err.message}"`);
```

`[Design interpretation]` **Recording that is the review.** An invariant nobody
has written down is a comment waiting to be violated by someone who never knew it
existed.

---

## 11. Committing

Three commits, deliberately:

```
7c2fe74 fix(F-05): classify network failures instead of showing runtime errors
da0a3db docs(F-05): record the reproduction, the RED/GREEN evidence and three new failures
83ae412 docs: correct stale counts in the experiment README
```

**What a commit is.** A snapshot plus a reason. The snapshot is mechanical. The
reason is the only part a human writes, and the only part that survives usefully.

**What belongs together.** The regression tests went in the *same* commit as the
implementation, on purpose: a regression test and its fix are one unit of
meaning. Reverting the fix and keeping the test would leave the suite red;
reverting both restores a coherent state.

**What stays separate.** The documentation went in its own commit, and the README
correction in a third — that one was found during review and has nothing to do
with F-05. Bundling it would have made a documentation typo look like part of the
network fix.

**The message.** No convention worth arguing about. One test:

> **Will a future reader — probably you, having forgotten all of this — be able
> to tell what changed and why?**

Which means the body carries the *why*, because the diff already carries the
what. Ours records the two reproductions, why `TIMEOUT` and `UNREACHABLE` stayed
separate, and what was deliberately not fixed. The last is the one people omit
and the one that saves the most time later: without it, F-06 looks like an
oversight instead of a decision.

---

## 12. Review — four perspectives, one reviewer

No second developer here. The perspectives still work, because each asks a
different question and the honest answers differ.

### Correctness — does it solve the defined problem?

Against the seven acceptance criteria: AC-1 through AC-6 have a test each, all
passing. AC-7 (the existing 24 still pass) verified. **Yes** — for exactly what
was defined, which is the only thing the criteria can speak to.

### Regression — did anything else break?

32/32 green, including all 24 from Chapter 01 unmodified. And a finding worth
more than the tick: **for a while, all of them passed while the application was
completely broken.** See §13.

### Product / UX — is the failure behaviour understandable and recoverable?

Measured in a browser after integration:

| | TIMEOUT | UNREACHABLE |
|---|---|---|
| Time to a message | ~8 s (the deadline) | ~0.4 s |
| Button usable again | yes | yes |
| Typed text preserved | yes | yes |
| Message claims a saved state? | **No — "may or may not"** | Yes — "hasn't been sent" |

Understandable and recoverable. **Is it good?** No evidence. Nobody has read one
of these messages while actually trying to get something done. Claim 4 is
unsupported and saying otherwise would be exactly the error this handbook exists
to prevent.

One thing this review *did* surface: an 8-second wait before the timeout message
is a long time to look at a disabled button. Defensible for a save, probably
wrong for a page-load probe. Recorded, not fixed — it is a new decision, not part
of F-05.

### Security / privacy — does this expose data or weaken anything?

Covered in §13. Short version: one thing got safer, one thing needs watching.

### The limit on this review

Three of those four perspectives were exercised by the same party that wrote the
implementation. **That is not independent review**, and calling it review would
be a small lie of the kind that accumulates. It catches the things you can catch
by changing which question you ask. It cannot catch the things you cannot see,
which is what a second person is actually for.

---

## 13. Integration: "it worked on my branch" is not "it works"

Every test green. Diff reviewed. Committed. Then the application was opened:

```
GET http://127.0.0.1:3431/net.mjs → 404 Not Found [FAILED: net::ERR_ABORTED]
```

**Nothing worked.** Blank interface, no sign-in, no anything.

`app.js` imports `./net.mjs`. In a browser that import is a **separate HTTP
request**, and the server's static-file map listed `/`, `/app.js` and
`/style.css`. A failed module import stops the entire script.

**Why did 32 tests pass?** Because Node imports `net.mjs` **from the filesystem**.
It never consults the static-file map, so it never meets the route that does not
exist. The tests exercised the module. The browser needed the module *and a way
to fetch it*, and only one of those was under test.

> `[Design interpretation]` This is the second of the five claims, caught in the
> act. **The tests passed and the implementation did not work.** No amount of
> adding tests at that layer would have found it — the gap was *between* layers.
> It was found by opening the application, which took four seconds and is the
> step that feels most skippable when the suite is green.

Recorded as **F-07**. One line fixed it.

And then **F-08**, immediately after: the route still returned `404`. The edit
was correct; the server had been started before the edit, and Node does not
reload source while running. The process was still executing the old code. Same
family of mistake as Chapter 01's F-04 — *assuming a system reflects a change
that was never applied to it.*

### Merging, and verifying from the merged state

```bash
git diff --name-only master..HEAD | grep -v "^experiments/01-request-response-app/"
# (empty — the branch stayed in scope)

git switch master
git merge --no-ff fix/f-05-network-failure-handling
```

`--no-ff` keeps the branch visible:

```
*   276847a merge: F-05 network failure handling
|\
| * 83ae412 docs: correct stale counts in the experiment README
| * da0a3db docs(F-05): record the reproduction, the RED/GREEN evidence…
| * 7c2fe74 fix(F-05): classify network failures instead of showing runtime errors
|/
* 18a5e30 chapter 01: how modern software products work
```

A fast-forward would have made those three commits look like work done directly
on `master`, losing the fact that they are one reviewed unit.

**Then everything was run again, from `master`:**

```
ℹ tests 32   ℹ pass 32   ℹ fail 0
```

And the app opened from the merged state:

```
GET /  → 200      GET /app.js → 200      GET /net.mjs → 200
POST /api/questions → 201
```

> **"It worked on my branch" and "it works after integration" are different
> claims.** Your branch is your code against `master`-as-it-was. The merged state
> is your code against `master`-as-it-is. Nothing here had moved underneath us —
> and the check still cost fifteen seconds, which is the correct price for not
> having to find out from someone else.

---

## 14. Reversibility

The reason this workflow is safe is not care. It is that every step can be undone.

**Look before you leap:**

```bash
git show 7c2fe74            # what did that commit actually do?
git diff 18a5e30..HEAD      # everything since Chapter 01
git log --oneline --graph   # the shape of the history
```

**Undoing an uncommitted change to one file:**

```bash
git restore path/to/file    # discard my edits, back to the last commit
```

**Undoing a change that is already committed and shared:**

```bash
git revert <commit>
```

`[Documented behaviour]` Git's own documentation: *"Given one or more existing
commits, revert the changes that the related patches introduce, and record some
new commits that record them."* And, on the difference from `reset`: revert
*"is used to record some new commits to reverse the effect of some earlier
commits"*, whereas to *"throw away all uncommitted changes in your working
directory, you should see git-reset, particularly the --hard option."* (S-030)

The distinction matters and it is not stylistic:

| | `git revert` | `git reset --hard` |
|---|---|---|
| What it does | Adds a **new** commit undoing an old one | Moves the branch pointer, **discarding** commits |
| History | Preserved — the mistake and the undo both visible | Rewritten — the mistake vanishes |
| Safe on shared branches | **Yes** | **No** — it removes commits others may have |
| Recoverable | Trivially | Sometimes not |

> **Default to `revert`.** "The mistake is gone from history" sounds like
> tidiness and is actually the loss of the record of what happened and why. This
> handbook's rule about failed experiments (`CLAUDE.md`) is the same rule applied
> to version control.

`[Design interpretation]` **Reversibility is what makes speed safe.** The reason
you can move quickly with an AI writing code is not that its output is reliable —
it is that a bad change costs one command to undo, *provided* you committed
before starting and kept the change small enough to identify. Both of those are
decisions you make before you need them.

**One caution.** Reversing the *code* does not reverse the *world*. A revert does
not un-send an email, un-migrate a database, or un-publish a release. Everything
in this chapter is reversible because Deskline touches nothing outside itself.
That stops being true in Chapter 15.

---

## 15. Development hygiene

Not a security chapter — Chapter 12 is. Six habits that belong to the workflow.

**Never commit secrets.** Not keys, tokens, passwords or connection strings. And
understand *why removing it later is not enough*: a committed secret is in the
history, and the history is what gets cloned. **Treat any secret that reached a
commit as compromised and rotate it.** Deleting it in a later commit changes
nothing.

**Read `.gitignore` before your first commit.**

```
node_modules/
.env
.env.*
!.env.example
experiments/*/data/
```

`.env` is excluded so local configuration never reaches a commit.
`experiments/*/data/` is excluded because it is regenerated by running the
tests — committing it would put churn in every diff and hide the real change.

**Secrets belong in the environment.** Deskline reads `PORT`, `DB_FILE`,
`SLOW_MS`, `RATE_LIMIT` from the environment. The code is shared; the environment
is not. Chapter 01 §14 is the sharper form: an API key in frontend code is an API
key you have published.

**Dependency caution.** This experiment still has zero dependencies. When that
changes, the question is not "does it work" but *what did I just agree to run,
who maintains it, and what does it pull in with it.* An AI suggesting a package
is not a recommendation — it is a completion.

**Logs and sensitive data.** `log.mjs` still refuses to write question text. Any
change to logging is a privacy change and gets read as one.

**Read before you run.** Every shell command, especially generated ones. The
principle underneath all of it: **least change.** The smallest diff that
satisfies the acceptance criteria. Not the most elegant, not the most general —
the smallest. Everything else is a claim you will have to defend later.

### What this change did to security and privacy

| | Before | After |
|---|---|---|
| Failure detail shown to users | The runtime's own string | Only messages we wrote |
| Runtime error object | Discarded | Kept as `cause`, never displayed |
| Server behaviour | — | Unchanged. One static route added |
| Logging | — | Unchanged |
| Validation | — | Unchanged; no assertion removed |

One genuine improvement: `"Failed to fetch"` is mild, but the pattern of passing
runtime strings to an interface is exactly how stack traces and file paths reach
users. Chapter 01 asserted that for the server (`T-19`, `T-24`); the client now
matches.

One thing to watch: `cause` holds a real runtime error. It is never displayed
today. If someone later writes a "details" panel that dumps an error object,
it will be.

---

## 16. What this workflow is, in product terms

Every step has a design equivalent, and the mapping is not decorative — it is why
this is your work and not somebody else's.

| Development | Product |
|---|---|
| **Acceptance criteria** | Explicit behaviour, before anyone builds. "Fires at the deadline, not when the server replies" is a product statement |
| **Reproduction** | Observing the actual problem instead of the reported one. The report was wrong twice |
| **Regression test** | A promise you have made to users, written down so it cannot be broken silently |
| **Branch** | A safe place to explore. Same reason you duplicate the artboard |
| **Diff** | The real scope of a change, as opposed to the described scope |
| **Code review** | Design critique, for behaviour |
| **Logs** | Evidence about system reality — twice the fastest route to the truth here |
| **Error handling** | The recovery experience. `TIMEOUT` vs `UNREACHABLE` was a copy decision made from a mechanism |
| **Version history** | The record of product decisions, and why they were made |

`[Design interpretation]` The one to take away: **the difference between the two
failure messages was decided in a workflow, not in a design review.** Nobody
would have raised it in a critique, because from the outside they are the same
event. It only became visible to someone tracing what the system could actually
know.

That is the argument for a designer being in this loop. Not so you can write the
code. So you are present when a technical distinction turns out to be a decision
about what you are entitled to tell someone.

---

## 17. What I can now do

**Orient** — `pwd`, `git status`, `git log`, `git show`, `git diff`, and know
which *question* each answers.

**Enter an unfamiliar codebase** by tracing one behaviour — README, tree, entry
point, request path, test, state boundary — rather than reading files.

**Turn a defect into a work item** with a reproduction, a user consequence,
deterministic acceptance criteria, an explicit out-of-scope list, and a test
requirement.

**Work on a branch**, and say what it does and does not protect.

**Write a regression test first**, tell a strong red from a weak one, and read
durations as well as ticks.

**Debug by loop** — observation, hypothesis, *evidence*, narrowing, fix,
verification — and treat a plausible explanation as a hypothesis.

**Work with an AI** without surrendering judgement: inspect before changing,
require a reproduction, set the criteria yourself, demand a small diff, read the
generated tests harder than the generated code, run the suite yourself, check
what changed outside scope.

**Review a diff** against nine questions, including the two that matter most —
*were tests weakened* and *did expected behaviour silently change*.

**Commit** with a reason a future reader can use, and split what does not belong
together.

**Verify after integration**, because a green branch is not a working `master`.

**Undo** — `restore` for uncommitted work, `revert` for committed work, and know
why `reset --hard` is the wrong default.

**And distinguish, still:** the command ran · the implementation works · the
tests pass · the experience is good · the product is valuable. This chapter
produced a moment where claim 3 was true and claim 2 was false, and nothing about
the test output revealed it.

---

## 18. Learning Checkpoint

Attempt these before reading §19. Each has a defensible answer that requires
reasoning, not recall. Write yours down first — the value is in the gap between
your answer and the discussion.

**Q1 — The dirty tree.**
You sit down to fix a bug. `git status` shows two modified files you do not
recognise; one is a config file, the other a test. You did not make these changes,
though an AI session was open on this machine yesterday. What do you do before
writing a single line, and what is the specific risk if you just start working?

**Q2 — The test that passes.**
An AI adds a regression test for a bug where a user's draft was lost on submit
failure. It passes on the first run, before any fix was applied. What are the
three possible explanations, how would you tell them apart, and which one should
you assume first?

**Q3 — The oversized diff.**
You asked for a timeout on one request. The diff touches 14 files, adds a
`utils/` directory, and changes an unrelated component's props. The tests pass
and the timeout demonstrably works. Do you commit it? Justify your answer in
terms of what a diff is *for*.

**Q4 — Regression after merge.**
Your branch was green. You merge; `master` is now red, in a test you never
touched. Give three distinct explanations, and say which command you would run
first for each. Then: what does the fact that this happened tell you about the
process that let it happen?

**Q5 — The wrong first hypothesis.**
A checkout flow shows "payment declined" for some users. The payments engineer
says the gateway logs show those transactions **succeeding**. Your first
hypothesis is "the gateway is lying". Write the observation → hypothesis →
evidence chain you would follow. What single piece of evidence would most quickly
kill your first hypothesis, and what would you look at next?

**Q6 — The secret in the diff.**
Reviewing a diff before commit, you see a real API key on line 40 of a config
file. You delete the line and commit. Are you safe? What if it had already been
committed and pushed an hour ago? What exactly do you do, and why is deleting it
insufficient?

**Q7 — The fix that moved the goalposts.**
Acceptance criterion: *"a request that exceeds the timeout rejects with
code TIMEOUT within timeout + 1500ms."* The submitted fix passes a test asserting
`err.code === 'TIMEOUT'` — and the test was changed to remove the timing
assertion, because "it was flaky in CI". The suite is green. What has actually
been demonstrated, what has been lost, and what would you do about the flakiness
instead?

**Q8 — The green suite and the broken app.**
Your team's suite is 400 tests, all passing, and a user reports the main page is
completely blank. Before debugging the page: what class of defect does this
pattern suggest, what would you check first, and what does it tell you about
where your suite's coverage *stops*?

---

## 19. Checkpoint Discussion / Reasoning

*Read only after attempting §18.*

### Q1 — The dirty tree

**Do not start.** Run `git diff` and read both changes, then `git log --oneline -3`
to see what the last commit was, and decide deliberately: keep, discard, or set
aside (`git stash`).

**The specific risk** is not that the changes are bad. It is that they become
*invisible*. If you start editing and later run `git add -A`, those two files land
in your commit, attributed to your work, described by your message. When
something breaks next week, the diff says your bug fix changed a config file, and
you will have no memory of it because you never made that change.

The config file is the more dangerous of the two — a modified test is at least
likely to fail loudly, whereas a config change can alter behaviour silently in
one environment.

> `git status` is not a status report. It is the question *"is my starting point
> what I think it is?"*, and it is the cheapest question in this chapter.

### Q2 — The test that passes

**The three explanations:**

1. **The bug is already fixed** — by someone else, or by an earlier change.
2. **The test does not exercise the bug.** It asserts something adjacent —
   perhaps that an error message appears, when the defect was that the *draft*
   was cleared.
3. **The assertion is vacuous.** It cannot fail. Asserting a property that is
   always true, or asserting inside a callback that never runs.

**How to tell them apart, and this is the whole answer: make it fail on purpose.**
Break the fix — or in this case, since there is no fix, deliberately break the
behaviour the test claims to protect. Clear the draft explicitly. If the test
still passes, it is (2) or (3). If it fails, it is (1), and you have learned
something real.

**Which to assume first: (2) or (3).** Not because AI-written tests are
especially bad, but because a regression test that has never been seen to fail is
untrusted by construction — that is the argument for test-first in §7. And note
the specific risk here: the bug is about *losing the user's draft*, which is a
state assertion. It is very easy to write a test that checks the error message
appeared and never checks the textarea.

**Chapter 01's F-04 is exactly explanation (3) in the wild**, and it survived
only because the expected value had been committed to paper before the run.

### Q3 — The oversized diff

**No.** And "the tests pass and it works" is not a counter-argument — it is a
description of a state that is also true of many changes you would reject.

**What a diff is for:** it is the unit at which a change can be *understood* and,
if necessary, *undone*. A 14-file diff for a one-request timeout fails both. You
cannot tell which of the fourteen files caused the behaviour you observed. And if
something breaks in a fortnight, reverting the timeout fix also reverts a `utils/`
directory other code may by then depend on.

**The specific objections, in order of seriousness:**

- **The unrelated component's props** are a behaviour change to something nobody
  asked about, riding in under a commit message about timeouts. If it breaks,
  nobody will look there.
- **The `utils/` directory** is an abstraction created for one caller. It has no
  second use case, so its shape is a guess — and it is now a shared thing that is
  awkward to change.
- **14 files** means the review will be an approval.

**What to do:** ask for the smallest change that satisfies the criteria. If some
of the other work is genuinely good, it belongs on its own branch with its own
justification, where it can be judged on its merits instead of being carried in
by a fix everyone wants.

> The test of scope is not "is this change good?" It is *"if this breaks, will
> the next person be able to tell what broke it?"*

### Q4 — Regression after merge

**Three explanations, and the first command for each:**

1. **Something landed on `master` while you were working**, and it interacts with
   your change. → `git log --oneline HEAD~10..` on `master`, looking for what
   arrived after you branched.
2. **Your change has a side effect you did not test** — shared state, a shared
   module, ordering. → Run the failing test alone. If it passes in isolation, it
   is coupling, not logic. (This is exactly Chapter 01's **F-01** and Chapter
   02's **F-06**.)
3. **The merge itself resolved badly** — a conflict resolution that produced
   syntactically valid, semantically wrong code. → `git show --stat` on the merge
   commit, then read the resolved regions.

**And the harder half of the question.** That this happened at all says the
branch was integrated *without being verified against current `master` first*.
The fix is not more discipline at merge time — it is **merging more often**, so
divergence stays small. A branch that lives a day has almost no room for this. A
branch that lives three weeks is a merge conflict with a commit history.

Note that our merge could not have hit case (1): nothing had landed on `master`.
The check still ran, because *"nothing changed underneath me"* is a fact to
verify, not to assume.

### Q5 — The wrong first hypothesis

**The chain:**

**OBSERVATION.** Some users see "payment declined". The gateway reports those
same transactions as successful. Both parties are looking at real data.

**HYPOTHESIS.** "The gateway is lying." Plausible, and it has the shape of every
wrong hypothesis in these two chapters: *it blames the component furthest from
me.*

**The single piece of evidence that kills it fastest:** find **one** specific
transaction — one user, one timestamp, one ID — and follow that exact ID through
both systems. Not aggregates. One case, end to end.

**Why that kills it.** Almost certainly you will find the gateway returned
success and *your* system recorded a decline. At which point the gateway is not
lying, and the question becomes: what happened between the gateway's response and
your interpretation of it?

**What to look at next.** The seam. Which is where these bugs almost always live:

- A **timeout on your side** while the gateway succeeded — this is precisely the
  `TIMEOUT` case from F-05. You gave up waiting; it worked anyway. Your UI then
  asserted something it did not know.
- A **retry** that succeeded on the second attempt while the UI reported the
  first.
- Response parsing that treats an unexpected field or status as a decline.

`[Design interpretation]` Note where the reasoning arrived. The most likely
explanation is the exact failure this chapter fixed in a toy application — the
client concluding "it didn't work" from *not having heard*, and telling the user
so. That is why the message says *"may or may not have been saved."* In a
checkout flow, the equivalent mistake takes money and denies the order.

### Q6 — The secret in the diff

**Case 1: you caught it before committing.** Deleting the line is sufficient — the
key never entered the history. Verify with `git diff` that it is gone, and ask the
real question: *why was a key in a file that was about to be committed?* It
belongs in `.env`, and `.env` belongs in `.gitignore`.

**Case 2: already committed and pushed.** You are **not** safe, and this is the
part that surprises people.

- Deleting it in a new commit removes it from the *current state* and **not from
  the history**. `git show <that commit>` still prints it. Anyone who cloned or
  fetched has it on their disk.
- Rewriting history to remove it is possible, disruptive, and **still not
  sufficient** — the commit may exist on the remote's servers, in CI logs, in
  build caches, in a fork, in someone's editor.

**What you actually do, in this order:**

1. **Rotate the key. Immediately.** This is the only step that genuinely fixes it.
   Everything else is cleanup.
2. Remove it from the code and put it in the environment.
3. Add the pattern to `.gitignore`.
4. Tell whoever owns the credential — it may be in use elsewhere.
5. *Then*, optionally, consider history rewriting.

> **Treat any secret that reached a commit as compromised.** Not "probably fine
> because the repo is private". Compromised. The cost of rotating is minutes; the
> cost of being wrong is unbounded.

### Q7 — The fix that moved the goalposts

**What has been demonstrated:** that the code produces the string `TIMEOUT`.
That is all.

**What has been lost:** the entire content of the criterion. AC-2 exists
specifically because a "timeout" that fires when the server eventually replies is
**not a timeout** — it is the old behaviour with a new name. Our own red proved
this was a live possibility: N-04 failed at 3029ms while the deadline was 500ms.
Remove the timing assertion and that implementation passes.

**The deeper problem:** the acceptance criterion was changed to match the
implementation, rather than the implementation changed to meet the criterion.
The suite is green because the standard moved.

> This is the most dangerous item on the diff-review list, and the least visible.
> The diff shows *lines removed from a test file* — which looks like cleanup, not
> like a lowered standard. **Any deleted assertion is a change to what the
> project promises**, and it deserves the same scrutiny as a change to what it
> does.

**What to do about the flakiness instead:**

1. **Establish it is actually flaky** rather than correctly detecting a genuinely
   slow implementation. Run it fifty times and record the distribution.
2. **Widen the bound, do not delete it.** Our own AC-2 allows deadline + 1500 ms —
   generous on purpose, and still fails a 3000 ms non-timeout by a wide margin. A
   loose assertion that can still fail is worth far more than none.
3. **Reduce the variance.** A shared-machine CI runner is noisy; the assertion may
   need a bigger gap between the deadline and the server's delay.
4. **If it genuinely cannot be made reliable**, mark it and say so out loud. A
   test that is skipped and visible is honest. A test that has been quietly
   hollowed out is not.

### Q8 — The green suite and the broken app

**The class of defect: an integration or delivery failure — a gap *between*
layers rather than inside one.** The suite tests units against each other in an
environment that is not the browser's. Something the browser needs to *fetch*,
*parse*, or *load* is missing or wrong, and no unit test can see it because the
test runner never performs that step.

**What to check first, in order — all cheap:**

1. **The browser console.** A blank page is usually one uncaught error, and it
   names itself.
2. **The network panel.** Any `404` on a script, stylesheet or module. **This is
   exactly F-07**: `GET /net.mjs → 404`, one missing route, whole app dead, 32
   tests green.
3. **What shipped.** Is the built asset the one you tested? Did the process
   restart (**F-08**)? Is the deployed commit the one you think?

**What it says about your coverage.** Your 400 tests stop at the boundary of the
runtime they run in. They prove your modules behave; they say nothing about
whether the browser can *obtain* those modules. Between "the code is correct" and
"the user can use it" there are steps — serving, bundling, loading, caching — that
your suite never executes.

**The correct response is not 401 tests.** It is one check at the layer you are
missing: load the actual application and assert that it rendered. One
smoke test that opens the page catches the entire class.

> And the cheap version, which cost four seconds here and which no amount of unit
> testing replaces: **open the thing.** The suite was green. The app was blank.
> Both facts were true simultaneously, and only one of them was about the user.

---

## 20. Sources

**Read**
1. Pro Git (Chacon & Straub), *Branching in a Nutshell* (S-028) — retrieved 31 Aug 2026
2. MDN, *AbortController* (S-029) — retrieved 31 Aug 2026
3. Git, *git-revert* documentation (S-030) — retrieved 31 Aug 2026
4. Node.js, *Test runner* (S-031) — retrieved 31 Aug 2026

**Watched**
- **V-007** — *How Git Works: Explained in 4 Minutes*, ByteByteGo, 28 Nov 2023,
  4m18s. For the mental model only: commits as snapshots, branches as pointers.
  **Secondary-tier source** — Pro Git (S-028) is the authority, and any specific
  claim should be checked there.

`[Our observation]` **No video was added for code review or AI-assisted
development.** Both were searched. Nothing official or authoritative surfaced,
and the available material was generic. Recorded as a gap rather than filled —
`VIDEO COVERAGE: PARTIAL` for this chapter.

## 21. Experiment

`experiments/01-request-response-app` — the same Deskline. New in this chapter:
`issues/F-05-network-failure.md`, `src/public/net.mjs`,
`tests/network-failure.test.mjs`, and four new entries in `failures.md`
(F-05 corrected and closed, F-06, F-07, F-08).

Branch `fix/f-05-network-failure-handling`, three commits, merged at `276847a`.
