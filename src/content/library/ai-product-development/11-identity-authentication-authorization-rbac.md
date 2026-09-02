# 11 — Identity, Authentication, Authorization, RBAC

**Status:** v1.0 · 1 September 2026
**Experiment:** `experiments/01-request-response-app`, same product as Chapters 04–10

---

```
LEARNING PATH

LEARN     OAuth's roles and the rule that an issuer may narrow a requested
          scope (S-059) · least privilege and audience restriction (S-060) ·
          what broken access control actually looks like (S-061) · the RBAC
          core model, and the question it does not answer (S-062) · purpose
          limitation, data minimisation and prospective withdrawal (S-063)
WATCH     No video assigned. Nothing retrieved met the bar - see 15
BUILD     An actor built only by the server · role -> permission @ scope as
          one grant · one authorization decision, in one place · consent
          records with purpose, data class, destination, expiry and evidence ·
          delegation that can only narrow · per-permission freshness and
          step-up · an executable layer map with a probe per layer
TEST      508 deterministic tests. 64 new. 28 evaluation cases. 30 runtime
          checks over real HTTP
BREAK     A consent check that could never run · a refusal that filed another
          tenant's ids in your audit log · a denial recommending a remedy that
          could not work · the same test bug one chapter after fixing it · a
          new route shadowed by an old one, in the chapter about shadowing
REFLECT   How many different questions were we answering with one word?
```

> **No model has run.** G-18 is still open. And a caveat specific to this
> chapter: **there is no authentication here** (G-51). Chapter 01 established
> that Deskline has no password and said why; Chapter 11 does not add one.
> Everything below is about *authorization*, and the distinction the chapter
> insists on — authentication is not authorization — is precisely why it can be
> honest about one without the other.

---

## 1. The question

Chapter 10 ended with a two-field object doing far too much work:

```js
const actor = { userId: me.id, workspaceId: me.workspace_id };
```

That object carried the confused-deputy defence for the entire system. It had
no role, no permission, no scope, no expiry, and no way to say that a support
agent may triage a colleague's question while a member may not — which meant
**Deskline could not have a support agent**, because the check that would have
allowed one did not exist.

So the question:

> **Who is asking, what may they do, to which resource, and for how long is
> that answer still true?**

Four questions. The chapter is mostly about the fact that they are four.

---

## 2. Six words that are not synonyms

Everything below is one of these collapses, and each collapse has its own bug:

| | |
|---|---|
| **authentication ≠ authorization** | knowing who you are is not knowing what you may do |
| **role ≠ permission** | a category of actor is not an operation |
| **permission ≠ scope** | an operation is not the set of rows it reaches |
| **approval ≠ consent** | "do this now" is not "this class of processing may happen at all" |
| **capability ≠ authority** | what the system CAN do is not what this person MAY do |
| **connection ≠ trust** | Chapter 10's, carried forward unchanged |

---

## 3. Role, permission, scope

NIST's core RBAC model gives two of the three:

> "Each user is assigned one or more roles, and each role is assigned one or
> more privileges that are permitted to users in that role." — S-062

Read it again for what it does **not** say. It says nothing about which *rows* a
privilege reaches, because a role model on its own has no opinion about that.
That silence is where the interesting failure lives.

Deskline's three roles:

| role | `question:read` | `note:delete` | `message:send` |
|---|---|---|---|
| `member` | **`@own`** | — | — |
| `support_agent` | **`@workspace`** | `@workspace` | — |
| `workspace_admin` | `@workspace` | `@workspace` | `@workspace` |

**`member` and `support_agent` both hold `question:read`.** A check that stops
at the permission cannot tell them apart, because at that level of detail they
are identical:

```js
const holds = (r) => roleScopeFor(r, PERMISSION.QUESTION_READ) !== SCOPE.NONE;
assert.equal(holds(ROLE.MEMBER), holds(ROLE.SUPPORT_AGENT));   // both true
```

Only the scope separates them, and the resulting refusal is the one that makes
the distinction real:

```
ana reads her own    ALLOW (scope=own)
ana reads cy's       DENY  SCOPE_TOO_NARROW      <- has the permission, refused anyway
cy  reads ana's      ALLOW (scope=workspace)
```

OWASP names the bug this prevents first in its list: *"Violation of the
principle of least privilege or deny by default, where access should only be
granted for particular capabilities, roles, or users, but is available to
anyone"* (S-061).

**A grant is one value, not two fields.** `permission@scope`. Storing
`permissions: [...]` beside `scopes: [...]` reads as more flexible and is
strictly worse — it cross-multiplies, and a support agent who may read across
the workspace would acquire `message:send@workspace` for free (`F14.6`).

**What was there before.** The old check was `q.user_id !== session.userId`.
That is a scope check with the scope hard-coded to `own` (`F14.7`), and it is
why the product could not express a support agent without bypassing it.

---

## 4. The actor: seven questions per field

Every field had to answer seven questions before it was allowed in — who
creates it, who may modify it, who verifies it, how long is it valid, is it
model-visible, is it client-supplied, can it widen authority. Fields that could
not answer are not there.

| field | created by | validity | from client? | can widen? |
|---|---|---|---|---|
| `subject` | store | session | **never** | no |
| `sessionId` | server | session | cookie | no |
| `workspaceId` | store | session | **never** | no |
| `roles` | store | **per call** | **never** | no |
| `authAssurance` | server (step-up) | per call | **never** | no |
| `delegation` | store | its own expiry | **never** | **never** |
| `authorizedAt` | builder | `maxAge` | **never** | no |
| `policyVersion` | builder | per call | **never** | no |

**What is deliberately absent is the more interesting half.**

`permissions` — derived from roles at decision time, never stored. A cached
permission list outlives the role change that removed it (`F14.16`).

`scopes` — Chapter 10 stored a `scopes` array on credential handles that
nothing read, and this chapter had to decide what to do about it. It is **not**
resurrected as actor state, because a scope is a property of a *decision about a
permission*, not a property of a person. §6 covers the decision in full.

`consent` — not an attribute of the actor at all. It is a record about a
purpose, looked up per action, revocable without touching anyone's identity.
Putting a consent reference in the actor would make revocation a session
problem.

`buildActor` is the only constructor, and it reads every field from the store:

```js
const forged = buildActor({ store: db, session: {
  userId: 'ana', roles: ['workspace_admin'], workspaceId: 'w-globex',
  grants: ['message:send@workspace'], subject: 'bo', isAdmin: true,
}});
assert.deepEqual([...forged.roles], ['member']);   // from the store
assert.equal(forged.workspaceId, 'w-acme');        // from the store
```

That is not defensive style, it is the property OWASP asks for: *"Access
control is only effective in trusted server-side code or server-less API, where
the attacker cannot modify the access control check or metadata"* (S-061).

---

## 5. Scopes: made real, not removed

Chapter 10's handoff was blunt — `scopes` is stored and read by nothing — and
Phase 5 demanded a decision either way. **Implemented**, for two reasons.

The role model needed it anyway: without a scope concept there is no way to
express `member` versus `support_agent`, and the product needs both. And
Chapter 10's delegation story is unfinishable without attenuation.

The one function everything routes through:

```js
export function attenuate(held, requested) {
  return scopeRank(requested) < scopeRank(held) ? requested : held;
}
```

Widening is not something the code can express, rather than something it is
careful not to do. RFC 6749 puts that power on the issuer's side — *"The
authorization server MAY fully or partially ignore the scope requested by the
client"* — and requires the issuer to say so when it narrows: *"the
authorization server MUST include the 'scope' response parameter to inform the
client of the actual scope granted"* (S-059). So a clamp is recorded:

```
ana (own) delegates @workspace
  granted question:read@own
  clamped [{ permission: 'question:read', requested: 'workspace', granted: 'own' }]
```

RFC 9700 gives the reason to prefer narrow: privileges *"SHOULD be restricted to
the minimum required for the particular application or use case"*, which
*"reduce[s] the impact of access token leakage"* (S-060).

---

## 6. One decision, in one place

The brief said: *do not create another parallel policy layer unless evidence
proves one is necessary.* The evidence was collected first, and it argued the
opposite way — there were already eight authorization-adjacent controls, and a
ninth beside them would have been F13.7 committed deliberately.

So `authorize()` is not a new layer beside the others. It is the function the
existing route checks now delegate to, and it deliberately does **not** absorb
the ones asking different questions:

```
MAY *THIS ACTOR* PERFORM *THIS PERMISSION* ON *THIS RESOURCE*, NOW?

  1 TENANT        first: its failure is a breach, not a refusal
  2 FRESHNESS     a stale actor's roles are a stale answer
  3 ASSURANCE     is a cookie enough for this?
  4 PERMISSION @ SCOPE   asked together, because asking them apart is the bug
  5 CONSENT       may this class of processing happen at all?
```

What it does **not** decide, and where those live instead: whether the action is
dangerous (Chapter 07's gate), whether the arguments are valid (Chapter 08),
which corpus may be searched (Chapter 09), whether a server may be reached
(Chapter 10). Collapsing them into a general-purpose `can()` would produce a
function whose callers could not tell which of five refusals they had received.

---

## 7. Consent is not approval, and neither is login

Four things, routinely collapsed, each collapse a different bug:

> **LOGIN** — I am who I say I am.
> **AUTHORIZATION** — my role permits this operation at this scope.
> **APPROVAL** — yes, do *this*, *now*.
> **CONSENT** — this *class* of processing may happen, for *this purpose*, to
> *this data*, via *this destination*, until *this date*, and I may withdraw it.

The field list is not invented. Each entry traces to a requirement:

| field | why | source |
|---|---|---|
| `purpose` (closed enum) | *"specified, explicit and legitimate purposes"* | Art 5(1)(b) |
| `dataClasses` | *"limited to what is necessary in relation to the purposes"* | Art 5(1)(c) |
| `evidence`, immutable record | *"the controller shall be able to demonstrate"* | Art 7(1) |
| `revokedAt` (timestamp, not delete) | withdrawal *"shall not affect the lawfulness of processing based on consent before its withdrawal"* | Art 7(3) |

That last one decided the hardest question in the file. **Revocation is
prospective.** Already-sent email does not become unlawful; the *next* send is
refused. That is why `revokedAt` is a timestamp and the record survives it.

`purpose` is a closed enum rather than free text because free-text purposes
cannot be compared — "customer support" and "support comms" become two consents
nobody can reconcile, and a system that cannot compare purposes cannot refuse a
mismatched one.

`EVIDENCE.ASSUMED` exists **so that it can be refused**:

```
assumed consent   ASSUMED_CONSENT_REFUSED
```

A seeded default is not consent. The database ships with no consent records at
all, which means a fresh Deskline cannot email a customer until somebody
records one — and that is the correct starting state.

**The demonstration.** `workspace_admin` holds `message:send@workspace`. The
role permits it. The action is still refused:

```
admin sends, no consent recorded     ASSURANCE_TOO_LOW + CONSENT_ABSENT
with consent + step-up               ALLOW  consent=aa736a3a
same consent, different destination  DENY   CONSENT_ABSENT
after withdrawal                     DENY   CONSENT_REVOKED
```

Capability answering a question about purpose is `F14.9`, and the admin row is
where it would have happened.

**And consent still does not remove approval.** Chapter 07's gate decides
whether *this instance* runs unattended, and it decides by blast radius, which
consent knows nothing about. A workspace that has consented to customer support
email has not thereby approved every email.

---

## 8. Delegated authority

Three authorities, kept apart because Chapter 10 proved what happens when two of
them blur:

```
USER AUTHORITY        what this person may do
SYSTEM AUTHORITY      what our service credential can reach
DELEGATED AUTHORITY   what this person has handed to something else
```

Chapter 10's confused deputy was the first two confused. Delegation has its own
failure mode: one that **widens**. Somebody with `question:read@own` delegates
to a scheduled job; the job asks for `@workspace` because that is what it needs;
something obliging grants it.

`issueDelegation` cannot express that. Requested scopes are intersected with
what the delegator holds, and a permission they do not hold at all is **refused
rather than dropped** — because a silently narrowed delegation looks broader
than it is:

```
ana delegates a permission she lacks   DELEGATION_EXCEEDS_DELEGATOR
```

Audience, tenant, expiry and revocation are all checked **at use**, not at
issue. A delegation checked only when issued is a delegation that never expires.

---

## 9. Authorization is not permanent

```
20-minute-old authority, default 15m   DENY AUTHORITY_STALE
90-second-old authority, reading       ALLOW
90-second-old authority, message:send  DENY AUTHORITY_STALE
```

Freshness is per permission, not global. Reading tolerates fifteen minutes;
emailing a customer tolerates sixty seconds, because a role revoked during a
long-running plan must stop the action *before* it happens rather than be
discovered afterwards.

**Roles are read per call.** There is no cached copy anywhere to fall back on,
which produces the strongest available answer to "role revoked mid-session":

```
before revoke / after revoke   ALLOW -> NO_ROLES
```

The actor cannot even be *built*. And a user with no roles is refused rather
than defaulted — OWASP's *"Except for public resources, deny by default"*
(S-061), and Deskline has no public resources.

**Step-up** is one endpoint, not an authentication product. It raises a session
from `session` to `recent_proof`, and `message:send` requires the higher level
so that a stolen cookie alone cannot email a customer. What it actually
verifies is a confirmation the server already knows (G-53) — it tests whether an
assurance level *gates a permission*, without pretending to be authentication.

---

## 10. The layer audit — F13.7, answered

Chapter 09 found a gate that could never fire. Chapter 10 found a rule that had
never matched. The taxonomy entry that came out of it was a warning with nothing
behind it, and Chapter 11 was about to add authorization to a system that
already had eight authorization-adjacent controls.

So `layers.mjs` came first: a machine-readable inventory of every control —
what question it answers, what it consumes, what it produces, when it runs, what
happens if it does not, and which other layer duplicates it.

**What the audit found.** Twelve layers. Two declared overlaps, both kept
deliberately:

- `AUTHORIZATION` ↔ `TOOL_AUTHORIZE` — both answer "may this actor touch this
  row". Real duplication. Collapsing it would be wrong: the Chapter 08 check
  runs *inside the tool* where a tool author can see it, and the Chapter 11
  check runs *at the route* where a role can be consulted. Removing either
  leaves a path with no check on it.
- `AUTHORIZATION` ↔ `MCP_ACTOR_AUTH` — the same question at the external
  boundary, and Chapter 10's confused-deputy defence depends on it staying
  there.

Tenant is checked in five places. That is *not* duplication — it is the same
question asked of five different resources, and each has its own probe.

**The probes are the point.** For each of the three layers this chapter added,
a test constructs an input that **only that layer** refuses:

```js
// PROBE AUTHORIZATION: same tenant, real row, valid session, schema-valid id,
// no external server, no consent requirement. Every other layer passes this.
const d = authorize({ actor: ana, permission: QUESTION_READ, resource: CYS, store: db });
assert.equal(d.reason, 'SCOPE_TOO_NARROW');
assert.equal(d.allFailures.length, 1, 'more than one layer refused; the probe is not isolated');
```

That last assertion is the one that matters. A probe caught by a second layer
fails the test rather than passing it.

---

## 11. What broke

Five, recorded as FR-25…FR-29.

**FR-25 — the consent check could never run.** `authorize()` returned on the
first failure, and every permission requiring consent also requires step-up
assurance, which was checked earlier. For any ordinary session, **consent was
unreachable**. The output looked right — the action was refused — and the reason
was about something else. I nearly recorded it as evidence that consent worked.

The fix is not local: every requirement is now evaluated, `allFailures` carries
them all, and I7 asserts each probe produces exactly one. **A warning in a
taxonomy did not stop me committing this shape twice more; a structural change
did.**

**FR-26 — a refusal that filed the other tenant's identifiers in your audit
log.** A cross-tenant denial returned `resource: { workspaceId: 'w-globex',
ownerId: 'bo', id: 3 }`, and the decision goes into the audit log. Every guessed
id added a row naming another workspace, user and record to *your* trail.
Chapter 09 had asserted the equivalent for retrieval passages; the rule had
never been applied to the object that says no.

> **A security mechanism's own output is a data flow, and it is the one nobody
> threat-models.**

**FR-27 — a denial recommending a remedy that could not work.** A support agent
asking to send a customer email failed two checks: no `message:send` at any
scope, and no step-up. The reported reason was the first evaluated — assurance —
so the user was told *"That action needs you to confirm it is you."* They could
confirm as convincingly as they liked. It is bad advice, and a small disclosure:
"prove it is you" implies stepping up would help. Reasons are now ranked by how
fundamental they are, and the primary one is the one the caller **cannot** fix.

**FR-28 — the same test bug, one chapter after fixing it.** Sixteen assertions
used `assert.throws(fn, /NO_ROLES/)`, which matches the *message*, while the
codes live on `err.code`. Chapter 10 ended by fixing exactly this and adding a
helper. The lesson was in a failure record, one chapter earlier, and I wrote a
new file and did it again. **A lesson in a document does not transfer to the
next file; a helper in the file does.**

**FR-29 — a new route shadowed by an old one, in the chapter about shadowing.**
Chapter 11 added `GET /api/me`. Chapter 01 had added `GET /api/me` four hundred
lines earlier. The dispatcher is a chain of `if`s, so the earlier arm wins
silently: the new route was **unreachable dead code**, and every unit test that
appeared to exercise it was exercising the other one. Invisible to the entire
deterministic suite; found only by driving the real server.

The fix is not to merge them, and that is the more interesting half. Chapter
01's `/api/me` answers *"am I signed in"* from the session alone, and
`failure-modes.test.mjs` asserts it still returns 200 **after the database has
been broken**. Identity-aware `/api/me` cannot satisfy that, because knowing
what you may *do* requires the store.

> **TWO QUESTIONS THAT NEED DIFFERENT DEPENDENCIES ARE TWO ENDPOINTS.**

So it became `/api/me/authority`, and the inherited test is untouched — merging
would have quietly weakened an inherited test to make a new feature fit. And a
structural guard now parses `server.mjs` and asserts no `(method, route)` pair
appears twice, with a second assertion proving the guard can actually see a
duplicate.

---

## 12. Evaluation

28 cases. **TASK and SECURITY are never averaged**, and here the separation
earns its keep more visibly than anywhere else in the handbook:

> **A system that refuses everything scores 100% on security.**
> **A system that allows everything scores 100% on task.**

Neither is a product. The four TASK cases exist so that "no security failures"
cannot be achieved by breaking the application — **unnecessary denial is a
defect with a cost, not a safe default.**

```
TASK  (did the product still work? unnecessary denial is a FAILURE here)
  cases            4
  allowed          4/4
  wrongly denied   (none)

SECURITY  (never averaged with the above)
  cases            24
  held             24/24
  FAILURES         (none)
```

IU-02 is the one worth naming: *does a support agent reach a colleague's
question?* Before this chapter the answer was no, and it was no because the
check could not express anything else.

---

## 13. Runtime verification

30 checks against the real HTTP server. FR-29 is the argument for this section
existing: it was invisible to 508 passing tests.

```
--- client privilege escalation -----------------------------
PASS  a forged role in the body changes nothing
PASS  a member cannot widen scope from the request body       403 FORBIDDEN
PASS    and the message does not reveal the rule              "That question belongs to someone else."

--- normal authorized path ----------------------------------
PASS  a SUPPORT AGENT reaches a colleague's question          200

--- step-up -------------------------------------------------
PASS  step-up with the wrong confirmation fails               STEP_UP_FAILED
PASS  step-up raises the session's assurance                  recent_proof

--- consent -------------------------------------------------
PASS  a member cannot record consent                          403 FORBIDDEN
PASS  assumed consent is refused                              ASSUMED_CONSENT_REFUSED
PASS  consent is recorded for the ACTOR's workspace, not the body's   w-globex
PASS  withdrawal records a timestamp and keeps the record

--- the audit trail -----------------------------------------
PASS  every decision carries its permission, policy version and time
PASS  a denial is recorded in the denied actor's tenant, not the target's
PASS  the audit contains no other tenant's identifiers        w-globex only

--- the model-visible boundary -------------------------------
PASS  the model view carries capability flags only  {"role":"workspace_admin","canReadOthersQuestions":true,"canSend":true}
PASS    and no subject, workspace or session id

--- external confused deputy remains blocked -----------------
PASS  a member cannot reach the CRM through MCP
```

The escalation body carries every field an attacker would try — `role`, `roles`,
`isAdmin`, `scope`, `scopes`, `permissions`, `workspaceId`, `subject`,
`assurance`, `consent`, `approved`, `delegationId` — and none of them reaches a
decision, because `buildActor` never looks at a body.

---

## 14. The model-visible boundary

```json
{ "role": "workspace_admin", "canReadOthersQuestions": true, "canSend": true }
```

No subject, no workspace, no session id, no delegation, no assurance level, no
policy version. Chapter 06's boundary, applied to identity.

But **not nothing**, and the reason is a product argument rather than a security
one. Without `canSend`, the assistant offers to email a customer, the gate
refuses, and the user is told no by a system that had already offered. That is a
UX failure caused by hiding too much. The model needs to know what the user
**can do** so it does not propose what will be refused — and it does not need to
know **who they are** to know that.

---

## 15. Sources

**S-059** — IETF, *RFC 6749* §1.1, §3.3. Retrieved 1 Sep 2026. The four roles,
and the rule that an issuer may narrow a requested scope and must say so.

**S-060** — IETF, *RFC 9700* (OAuth Security BCP). Retrieved 1 Sep 2026. Least
privilege and audience restriction.

**S-061** — OWASP, *Top 10:2021 A01 Broken Access Control*. Retrieved 1 Sep
2026. Deny by default; server-side enforcement; log failures. The chapter's
spine.

**S-062** — NIST, *Role Based Access Control* (INCITS 359-2012). Retrieved 1
Sep 2026. The core model — and the resource question it does not answer.

**S-063** — GDPR Articles 5(1)(b), 5(1)(c), 7(1), 7(3). Retrieved 1 Sep 2026.
Every field of a consent record traces to one of these. **Cited as a source of
design questions, not as a compliance claim** — see G-55.

**Video: none.** Nothing retrieved met the bar, and adding one for the sake of a
row would be the filler this handbook's research rules exclude.

**Gaps opened:** G-51 (authentication is a stand-in), G-52 (three roles, one
level, no hierarchy), G-53 (step-up confirms a known subject), G-54 (nothing
measured at scale), **G-55 (consent is workspace-level, not data-subject-level
— the chapter uses GDPR for its questions, not to claim compliance)**, G-56
(pending-action revocation is pull, not push), G-57 (the authz audit does not
survive a restart).

---

## 16. Learning Checkpoint

**Q1 — "We have RBAC."** A team shows you a role table and a `hasPermission()`
helper, and every endpoint calls it. What has not been decided yet?

**Q2 — The support agent.** Product wants agents to triage any question in the
workspace, while members see only their own. Your current check is
`row.user_id !== session.userId`. What is wrong with adding
`|| user.isAgent` to it?

**Q3 — The consent checkbox.** A colleague proposes a signup checkbox: *"I agree
Deskline may contact customers on my behalf."* Ticking it sets
`workspace.consented = true`. Name three things this cannot answer.

**Q4 — Revoked mid-flight.** A user withdraws consent while a Chapter 07 run is
paused awaiting approval. Someone approves it a minute later. What should
happen, and what should happen to the emails already sent?

**Q5 — The scheduled job.** A support agent wants a nightly digest of workspace
questions, so they delegate `question:read@workspace` to a job. Later they are
demoted to `member`. What must happen to the delegation, and when is that
checked?

**Q6 — The helpful error.** Your denial says *"You need the support_agent role
to read other people's questions."* What is good about that message, and what is
wrong with it?

**Q7 — The green suite.** You add an authorization layer. All 508 tests pass,
including 64 new ones. What have you established, and what specifically have you
not?

**Q8 — What the model sees.** An engineer wants to put the actor object into the
prompt so the assistant "knows who it's talking to". Push back — and say what
you *would* include.

---

## 17. Checkpoint Discussion / Reasoning

**Q1.** Which rows. NIST's core model assigns privileges to roles and users to
roles (S-062), and says nothing about the resources a privilege reaches —
because a role model has no opinion about that.

So `hasPermission(actor, 'question:read')` is answerable and not useful. Two
roles can both hold it, and one of them may read only their own rows. The
missing argument is the **resource**, and until the decision takes one, the
system cannot express the difference between a member and a support agent
(`F14.5`).

The follow-up question worth asking that team: *"show me two roles that hold the
same permission"*. If none do, the model is probably fine and probably also
under-specified. If two do, ask what stops the narrower one reaching everything.

**Q2.** It works, and it is the wrong shape, in a way that compounds.

It works because there are two cases today. It is wrong because
`row.user_id !== session.userId` is a scope check with the scope frozen at
`own` (`F14.7`), and `|| user.isAgent` freezes a second scope beside it. The
next requirement — *admins can see archived questions across the workspace, but
only agents can see the ones marked sensitive* — adds a third clause to the same
boolean, and now the authorization model is an expression nobody can review.

The structural version is that the check should take a **required scope** and a
**held scope** and compare them. That is one comparison whatever the role table
does next, and adding a role becomes a data change instead of a code change.

There is also a smaller point that matters operationally: `user.isAgent` puts
the role on the *user*, not on the user *in a workspace*. That is why the roles
here are a join table — being an agent somewhere is not being an agent
everywhere.

**Q3.** More than three, but the three that bite:

**For what purpose?** GDPR Art 5(1)(b) requires purposes *"specified, explicit
and legitimate"*. "Contact customers" is a category, not a purpose. Support
replies and marketing are different purposes and a system that cannot compare
them cannot refuse the second.

**To which destination, and with what data?** A boolean cannot say that
consenting to email through the ticket system is not consenting to push contact
details into a CRM. Art 5(1)(c) requires data *"limited to what is necessary in
relation to the purposes"* — which needs a data-class list to check against.

**Who consented, when, on what evidence, and until when?** Art 7(1) requires the
controller to be able to *"demonstrate that the data subject has consented"*. A
boolean column demonstrates that a boolean is true. And a flag with no expiry is
consent nobody ever revisits.

The fourth, which is really the giveaway: **how is it withdrawn, and what
happens to what already went out?** Art 7(3) makes withdrawal prospective, so
the answer has to be "the next send is refused, and the sent ones stay lawful" —
which a boolean flip cannot express, because flipping it back destroys the
record that consent ever existed.

**Q4.** The approval must not proceed, and the sent email stays lawful.

The first half is a design decision with a real cost, and it is the right one:
`authorize()` is called per action, immediately before execution, so a consent
withdrawn between the pause and the resume refuses the resume. Approval said
*"do this now"*; consent said *"this class of processing may happen"*; the
second was withdrawn, so the first has nothing to authorise.

The second half is Art 7(3) directly: *"The withdrawal of consent shall not
affect the lawfulness of processing based on consent before its withdrawal."*
Retroactively reclassifying sent mail would be both impossible and wrong. The
consent record survives with a `revokedAt` timestamp so the audit trail can say
that processing before that instant was covered.

What this system does **not** do, and it is recorded as G-56: actively sweep
queued runs and cancel them at the moment of withdrawal. The check is pull, not
push. That is adequate here because every action re-checks, and it would not be
adequate if an action could be committed to before its final check.

**Q5.** The delegation must narrow to `question:read@own` — or rather, it must
stop granting anything wider, and it must do so **at use**, not at issue.

At issue it was legitimate: the agent held `@workspace` and delegated
`@workspace`. Nothing about the delegation record is wrong. What changed is the
delegator, and `authorize()` intersects the delegation with what the actor holds
*now*:

```js
held = min(scopeForRoles(actor.roles, permission), delegatedScope(...));
```

So the demotion lands on the next call, with no need to find and rewrite
delegations. That is the same reasoning as roles being read per call rather than
cached on a session (`F14.15`, `F14.16`).

The complementary answer: a delegation that was checked only when issued would
still be granting `@workspace` a month after the demotion, which is why expiry,
audience and revocation are also checked at use. **A delegation checked only at
issue is a delegation that never expires.**

**Q6.** Good: it is specific, it names the thing that would fix it, and it does
not make the user guess. For an internal admin tool that is often exactly right.

Wrong: it tells an unauthorised caller the name of a role and the shape of the
permission model. Someone probing your API now knows `support_agent` exists and
what it grants — which is a small disclosure, and small disclosures are how the
map gets drawn.

Deskline's answer is to keep the reason internal and the message plain: the
decision record carries `SCOPE_TOO_NARROW` for the audit log, and the caller
gets *"That question belongs to someone else."* The runtime verification asserts
the response does not contain the string `support_agent`.

The sharper version of the question is FR-27, which is the same trade-off going
wrong in the other direction: a message that is not merely uninformative but
**actively misleading**. Telling someone to confirm their identity for an action
they will never be permitted is worse than telling them nothing, because they
will do it.

**Q7.** You have established that the code does what the tests say. You have not
established that the layer **runs**.

That distinction is not theoretical here — it is four defects across three
chapters. Chapter 09's structural gate could never fire because an earlier gate
caught the same inputs. Chapter 10's secret-detection regex had never matched
anything, and a passing evaluation case about leaked credentials was passing for
the wrong reason. Chapter 11's own consent check was unreachable behind the
assurance check (FR-25), and Chapter 11's new route was shadowed by a
four-hundred-line-older one and was **dead code that 508 tests could not see**
(FR-29).

What to do about it, concretely:

**Probe each layer alone.** Construct an input that only that layer refuses, and
assert it produced exactly one failure. `allFailures.length === 1` is the
assertion that catches shadowing, because a probe caught by a second layer fails
rather than passes.

**Check structurally where you can.** A test that parses the dispatcher and
asserts no route pattern appears twice catches FR-29 forever, and catches it
without anybody remembering.

**Run the real thing.** FR-29 was invisible to every unit test and obvious on
the first HTTP request.

**Q8.** Push back on the object; agree with the goal.

The actor carries a subject, a session id, a workspace, a delegation reference
and an assurance level. None of those helps a model answer a question, all of
them will end up in a log or a transcript, and the workspace id in particular is
the tenant identifier that Chapters 06 and 09 spent two chapters keeping out of
prompts.

What to include instead is what the engineer actually wants, which is
**capability, not identity**:

```json
{ "role": "workspace_admin", "canReadOthersQuestions": true, "canSend": true }
```

The argument for including even that much is a product one. If the model does
not know the user cannot send email, the assistant offers to send one, the gate
refuses, and the user is told no by a system that had already offered. Hiding
capability produces a worse experience and no additional security, because the
gate refuses either way.

The rule that falls out: **the model should know what the user may do, and not
who they are.** The first shapes what it offers; the second only shapes what
leaks.

---

## 18. Reflect

**How many questions were we answering with one word?** Six, and the count is
the chapter.

`{ userId, workspaceId }` was doing authentication, authorization, scope,
tenancy and freshness at once — not because anyone decided it should, but
because each of those got added when it was needed and the object was already
there. That is how identity models usually grow, and the tell is not complexity.
The tell is that the product **cannot express a role it needs**. Deskline could
not have a support agent, and the reason was one line in a route.

**What changed in how I read an authorization check.** The question is no longer
"is this check correct" but **"what is this check's third argument?"** A check
with an actor and a permission and no resource is answering a question about
capability while being read as an answer about authority, and the two are the
same shape and different sizes.

**The thing that stayed uncomfortable.** Three chapters running, I have shipped
a security control that could not execute. Chapter 09's gate, Chapter 10's
regex, and here both a requirement (FR-25) and an entire route (FR-29) — the
last one committed *while writing the chapter about shadowing*, in a file I had
read that morning.

That is not carelessness, and treating it as carelessness is why it keeps
happening. **Shadowing is invisible at the point of writing, because the thing
you are writing looks complete.** It is only visible from outside — at runtime,
or from a check that reads the whole dispatcher at once, or from an assertion
that a probe produced exactly one failure and not two.

So the durable output of this chapter is not the role table. It is that
`allFailures` and the route-uniqueness guard make one class of invisible failure
into a test result, and that the layer map is a file rather than a paragraph.
The warning in the taxonomy did not stop me. The structure might.

---

## 19. Artefacts

**Source** — `experiments/01-request-response-app/src/identity/`
`model.mjs` (role/permission/scope, attenuation) · `actor.mjs` (the actor,
model view, audit view, freshness) · `authorize.mjs` (one decision, ranked
reasons, per-permission requirements) · `consent.mjs` (consent records,
withdrawal, delegation) · `layers.mjs` (the executable layer map)

**Store** — `src/db.mjs` gained `user_roles`, `consents`, `delegations` and
their accessors; the seed assigns ana `member`, cy `support_agent`, bo
`workspace_admin`

**Routes** — `GET /api/me/authority` · `POST /api/session/step-up` ·
`GET|POST /api/consents` · `DELETE /api/consents/:id` · `GET /api/authz-audit`;
the suggest and triage routes now authorize instead of comparing ids

**Tests** — `tests/identity.test.mjs`, 64 tests in eight suites (I1–I8). Suite
total 508.

**Evaluation** — `evaluation/datasets/identity/identity-v1.json` (28 cases) ·
`eval/run-identity-eval.mjs` · `eval/verify-identity-runtime.mjs`

**Records** — `failures.md` FR-25…FR-29 · `00-master/05 — Failure Taxonomy.md`
F14.1–F14.19 · `research/source-registry/source-registry.md` S-059–S-063,
G-51–G-57

---

## 20. Handoff to Chapter 12

Chapter 12 is **Secure AI Product Development**, and the Learning Architecture
already drew the line: Chapter 11 asks *what may you access*, Chapter 12 asks
*how can this be bypassed*. Chapter 11 is about the correct behaviour of a
control and has right answers. Chapter 12 has no completion condition.

Three things to attack.

**The controls are correct on inputs their author imagined.** 24 security cases
held, and the dataset says plainly that a real attacker writes cases this author
did not think of (G-50, and the same limit applies here). Every one of FR-25 to
FR-29 was found by the author's own probing, which is the weakest possible
adversarial signal.

**Step-up is a stand-in.** G-51 and G-53: there is no authentication. An
assurance level that gates a permission is real; the thing that raises it is
not. Chapter 12 should treat `recent_proof` as an assumption to be attacked
rather than a fact.

**Layer shadowing is now detectable, not prevented.** `allFailures`, the probes
and the route guard catch three specific shapes. F13.7 and F14.1/F14.4 remain
open as a class, and the honest summary after three chapters is that **the
system is one un-probed layer away from the same failure again**.

And one that is not a weakness so much as a seam: OWASP LLM06 *Excessive
Agency* sits exactly on the boundary between these two chapters — an
authorization design failure that manifests as a security incident. Chapter 11
built the permission model. Chapter 12 gets to find out whether a model can be
talked into asking for the wrong thing with the right authority.
