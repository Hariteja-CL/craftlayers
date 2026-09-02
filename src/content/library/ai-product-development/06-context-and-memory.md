# 06 — Context & Memory

**Status:** v1.0 · 1 September 2026
**Experiment:** `experiments/03-context-and-memory`, same feature as Chapters 04 and 05

---

```
LEARNING PATH

LEARN     Context windows, context rot and the stateless API (S-038, S-039)
          Context engineering as curation, not supply (S-041)
          Where the provider's own "memory" actually lives (S-040)
WATCH     V-008 context windows · V-009 context engineering · V-010 memory types
          VIDEO COVERAGE: PARTIAL — see §19
BUILD     Context specification · field registry · four context policies ·
          context manifest and hash · builder with scope, freshness and
          conflict resolution · comparison harness · inspection tool
TEST      176 deterministic tests. 92 new
BREAK     Ten context failures, each labelled by what kind of evidence it is ·
          three absences that produce one identical model input · a harness
          that reported a floor failure that was never in the fixture
REFLECT   When is context useful information, and when is it merely additional
          exposure?
```

> **No model has run.** Not in Chapter 04, not in 05, not here. **G-18 remains
> open.** Nothing in this chapter claims `ctx-v1` is better than `ctx-v0`,
> because nobody knows. What *is* claimed is measured, and every measurement
> below is labelled with how it was obtained.

---

## 1. The question

> **If the prompt is identical, why can the model still behave differently?**

Chapter 05 ended with a provenance record it was proud of. Every classification
carried the model, the configuration, the output contract, the prompt version,
and — the part that mattered — `promptHash`, the sha256 of the exact bytes sent
as the system prompt. A label can drift from the text it names. A hash of the
text cannot.

It is a real improvement and it has a hole in it, which this chapter is about.

Two calls can carry the same `promptHash`, the same model, the same
configuration and the same question, and still be different calls. Chapter 05
wrote **CONTEXT** as one word in a list of seven and moved on. That word was
hiding the variable.

---

## 2. What "same prompt" leaves out

Chapter 05's record:

```
PROMPT + MODEL + CONFIGURATION + CONTEXT + OUTPUT CONTRACT
       + DATASET + EVALUATOR
```

Chapter 06's, with the fourth term opened up:

```
PROMPT
+ MODEL
+ CONFIGURATION
+ USER INPUT              what the person is asking now
+ APPLICATION CONTEXT     what the product supplied for this request
+ CONVERSATION STATE      previous turns we chose to include
+ CONTEXT ORDER           the sequence they were assembled in
+ CONTEXT VERSION         the policy and schema that decided all of the above
+ OUTPUT CONTRACT
+ DATASET + EVALUATOR
```

Five new terms, and every one of them is a thing an application *decides*. None
of them is a property of the model.

> **Same prompt hash ≠ same model input.**

That sentence is the chapter. Everything else is what follows from taking it
seriously.

`[Design interpretation]` It is worth noticing why the hole was invisible from
inside Chapter 05. There, the context genuinely was constant — every call sent
exactly the question and nothing else — so a record that ignored it lost no
information. **A provenance record is only as good as the variation it has met.**
It looks complete right up to the first time something new starts varying, and
then it is silently wrong, in the direction of making different things look the
same.

---

## 3. Five things that get called "memory"

Before any code: the word "memory" covers at least five distinct mechanisms, and
collapsing them is how systems acquire behaviour nobody designed.

**1 — Current input.** What the user is asking now.

**2 — Application context.** Information the product deliberately supplies for
this request. In Deskline: which page a question was written from, and whether
this workspace has export at all.

**3 — Conversation context.** Previous turns included in *this* call. Not
retained anywhere by the model — assembled by us, sent by us, every time.

**4 — Persisted product state.** Information the application stores outside any
request. A database. It has an owner, a scope, a retention policy and (ideally) a
deletion path, all of which predate anyone calling it memory.

**5 — Provider state.** Anything the provider keeps between calls.

For the API this experiment uses, category 5 is empty. *"The API is stateless."*
[Documented behaviour, S-038]

The working rule for the rest of the chapter:

> **If the application cannot point to where information is stored and how it is
> retrieved, calling it memory is probably hiding architecture.**

`[Design interpretation]` "The assistant remembers your preferences" is a
sentence about a user experience. As a description of a system it is missing a
table name, a scope, a retention period, and an answer to *who else can read
this*. When those four are supplied, the word "memory" adds nothing. When they
cannot be supplied, the word is doing the work of concealing that they were never
decided.

---

## 4. Specification before code

The feature: Deskline's category suggestion, unchanged from Chapter 04, now
allowed to see a little of the product state around the question.

`context-spec.md` was written first. For every field: source, owner, trust class,
freshness, sensitivity, whether required, **whether it may enter a model request
at all**, why, where it is retained, and what happens when it is missing.

The specification has eight fields. **Four of them are marked never
model-visible**, and they are in the specification precisely because of that.

| Field | Trust | Freshness | Model-visible |
|---|---|---|---|
| `workspace_id` | authoritative | live | **no** |
| `asked_from_surface` | server-validated client assertion | **snapshot** | yes |
| `workspace_export_enabled` | authoritative | live | yes |
| `question_text` | **untrusted** | live | yes |
| `recent_category` | derived from user action | snapshot, ≤7 days | `ctx-v2` only |
| `user_department` | authoritative | live | **no** |
| `user_manager_id` | authoritative | live | **no** |
| `workspace_note` | **untrusted** | live | **no** |

`[Design interpretation]` A specification that lists only the fields you send
cannot record a decision *not* to send one — and an unrecorded exclusion is
indistinguishable from an oversight six months later. The `why` on
`user_manager_id` is not documentation. It is the argument, kept where the next
person will be standing when they wonder why it is not there.

The specification lives in two places on purpose. The prose is in
`context-spec.md`; the enforceable half is in `src/context/fields.mjs`, and the
code imports it. Chapter 05's **SR-01** was a rule that existed in `design.md`,
was believed to be in the system, and had never been transferred into the
artefact. Splitting a specification between a document and a code file is exactly
how that happens, so here the two name each other and a test asserts every field
carries every property.

**The most important field in the system is one the model never sees.**
`workspace_id` decides what may be read. It is not evidence about a category, so
it is not sent — and everything else in the request exists only because it
passed.

---

## 5. The context budget

The mental model that makes the rest of the chapter's decisions non-arbitrary:
**every model has a finite input budget, and context competes for it.**

Anthropic's own documentation puts this more strongly than a vendor usually
would:

> *"more context isn't automatically better. As token count grows, accuracy and
> recall degrade, a phenomenon known as context rot. This makes curating what's
> in context just as important as how much space is available."*
> [Documented behaviour, S-039]

And, from the engineering write-up, the principle stated as a target rather than
a warning — find

> *"the smallest possible set of high-signal tokens that maximize the likelihood
> of some desired outcome."*
> [Documented behaviour, S-041]

`[Design interpretation]` Two arguments arrive at the same rule from opposite
directions. The quality argument says send less because more degrades recall. The
privacy argument says send less because everything sent has left the building.
When a quality constraint and a privacy constraint point the same way, that is
the cheapest good decision available in this whole subject, and it should be
taken without further debate.

What additional context can buy you, beyond tokens: **cost · latency ·
distraction · contradiction · staleness · privacy exposure · attack surface.**
Deskline's context is under 400 bytes, so the recall argument is not doing much
work here. The other five are.

### Measured, not estimated

`ctx-v0` (question only) against `ctx-v1` (question plus two product fields),
across the ten non-conversational dataset cases:

| | bytes of model input |
|---|---|
| `ctx-v0` | 506 |
| `ctx-v1` | 1837 |
| delta | **+1331 (+263%)** |

`[Our observation]` The percentage is inflated by a tiny baseline — 25 bytes for
*"Why can't I get this out?"*. Reported anyway, and reported in **bytes**,
because bytes are what was counted. Chapter 05 estimated tokens once; converting
here would turn an estimate into a measurement by repetition, and there is no
tokenizer in this run.

The unsafe policy in §9 sends **366 bytes** for a question that was decidable
from its first six words.

---

## 6. Trust: a heading is not a guarantee

Deskline's context has two origins and they are not equal.

**Trusted application context** — server-derived, or client-asserted against a
vocabulary the server owns:
`asked_from_surface` · `workspace_export_enabled` · the taxonomy itself.

**Untrusted content** — a person typed it:
the question · a workspace admin's free-text note · any previous model output.

The client tells us which page the question came from. That string arrives over
HTTP from a browser. So the honest description is: **the client asserts a value;
the server owns the vocabulary.**

```js
export function validateSurface(claimed) {
  if (typeof claimed !== 'string') return null;
  const trimmed = claimed.trim();
  return isKnownSurface(trimmed) ? trimmed : null;
}
```

A value outside the registry is not "unknown context". It is a **rejected
value** — and rejecting it is what stops this parameter from being a free-text
field inside the model's input.

Now the part that is easy to get wrong. Consider `workspace_note`: free text an
admin typed into their workspace settings. It is in our database. It is fetched
by our code. It arrives over TLS. It would sit inside a block headed
`<application_context>`.

Every one of those properties is true and **none of them says anything about who
wrote it.**

> **Location in the prompt does not establish trust.**

The delimiters in Deskline's serialization are documented as delimiters, and a
test asserts the comment saying so is still there:

```js
// The tags are delimiters, not a boundary. A model is not obliged to respect
// them and our code does not enforce anything with them; they exist so that a
// person reading a logged request can see where one thing ends and another
// begins.
```

Chapter 12 owns the defence. Chapter 06 owns the exclusion — which is the
cheaper half and the one available today.

---

## 7. Freshness: validly sourced is not fresh

Two kinds of freshness, and the distinction is *not* which database the value
came from.

**LIVE** — read from the authoritative store at request time. Fresh by
construction. `workspace_export_enabled` is live, which is why a permission
change takes effect on the next request with no invalidation logic anywhere in
the system.

**SNAPSHOT** — captured once, stored, ageing from that moment.
`asked_from_surface` is a snapshot.

A snapshot needs three things before it can be trusted:

**A stored timestamp.** `questions.surface_captured_at` exists for this and
nothing else. *A value with no timestamp cannot be stale — it can only be wrong,
silently, forever.*

**A registry that records retirement.** Export moved out of Reports on 20 August
2026:

```js
'reports/export': {
  label: 'Reports → Export',
  area: 'data',
  requiresCapability: 'export',
  retiredOn: '2026-08-20',
  replacedBy: 'data/export',
},
```

A question captured before that date still carries `reports/export` and always
will. The row is correct. The value passes validation. It names a page that does
not exist. It is excluded with `STALE_RETIRED_SURFACE`.

**A name that does not overclaim.** The field is `asked_from_surface`, not
`current_page`. See §16, CX-10 — this is the one context failure in the chapter
with no code fix.

> **"It came from our database" and "it is true now" are different claims, and
> only one of them is cheap to check.**

---

## 8. Authority: two of our own sources disagreeing

A person is on the export page. Their workspace does not have export.

Both facts come from us. Both are correctly recorded. They contradict each
other, and something has to decide.

**Not the model.** It has never seen our systems and has no way to know which of
two strings we trust. Sending both and letting it work it out is delegating a
question about our own architecture to something that cannot answer it — and
doing so invisibly, because the delegation appears nowhere in the code.

The rule, stated generally so it is not a special case:

> A non-authoritative field is **excluded** when it asserts something an
> authoritative field contradicts, and the conflict is **recorded**.

Surfaces declare `requiresCapability`. `data/export` requires `export`. If the
capability store authoritatively says no, the surface claim is contradicted:
the surface is dropped, the capability flag is sent, and `conflicts` is
non-empty.

> **SOURCE is not AUTHORITY.** A cached UI hint and a server authorization
> record are both "internal". Only one of them settles anything.

`[Design interpretation]` The conflict counter is a product signal, not
plumbing. A rising conflict rate means the surface registry and the capability
store have drifted apart — a real bug in a real system, surfaced by a mechanism
built for a different reason. Provenance keeps paying for itself this way.

And the rule that governs the whole area, previewing Chapter 11:
**authorization-sensitive context must always come from the authoritative
server-side source.** Never a model, never cached client state.

---

## 9. Minimisation: three different words

```
DATA AVAILABLE TO THE APPLICATION
  ⊋ DATA THE CALLER IS AUTHORIZED TO SEE
      ⊋ DATA NECESSARY FOR THIS MODEL CALL
```

Most privacy failures live in the second `⊋`. Not stolen data — **authorized
data, sent because it was there.**

`ctx-x1-unsafe` is that policy, written down so it can be tested rather than
merely warned about. It sends the surface, the capability flag, the previous
category, the workspace note, the user's department and their manager. Every
value is authorized. The caller may see all of it.

Three separate failures, which need three separate fixes:

**Sensitive-unnecessary.** Department and manager go to a third party on every
classification, for a speculative gain.

**Untrusted-as-context.** `workspace_note` is free text a person typed.

**Excessive.** 366 bytes against 212, for a question that was never in doubt.

The registry refuses to hand it to the server, and the gate has **two independent
conditions**:

```js
if (!policy.productionAllowed) throw new PolicyNotAllowedError(...);

const forbidden = policy.fields.filter((f) => NEVER_MODEL_VISIBLE.includes(f));
if (forbidden.length > 0) throw new PolicyNotAllowedError(...);
```

The second exists because the first is a flag someone can flip. **A field that
must never reach a model is a property of the field**, so checking it here means
a policy cannot grant itself permission by editing its own metadata.

### The marginal case, which is the only interesting one

Blanket rules are easy. The test of a minimisation policy is a field that would
genuinely help a little.

Dataset case **CX-07**:

> *"I need to raise something about a colleague's conduct and I don't want it
> visible to my team lead."*

Department and manager might nudge this toward `access`. So: quality against
exposure, honestly stated.

It resolves cleanly, and not because privacy always wins. It resolves because
**the manager is the person the user has just said they do not want to see
this.** Sending that identifier to a third party in the same request as the
complaint is the precise exposure the sentence asks us to prevent, in exchange
for a category we can already reach.

`[Design interpretation]` Notice what did the work. Not a principle, not a legal
category — the *content of the request*. A policy that reasons about field types
in the abstract cannot reach this answer. That is an argument for reviewing
context decisions against real cases, and against the worst ones rather than the
representative ones.

---

## 10. Scope, and the WHERE clause that is the boundary

| Scope | Example | Enforced by |
|---|---|---|
| request | the question | the request |
| session | who is signed in | the session map |
| user | `recent_category` | `q.user_id = ?` |
| workspace / tenant | capabilities, note | `u.workspace_id = ?` |
| global | the taxonomy, the surface registry, the prompt | code, versioned |

Deskline gained a third demo user for this chapter. `ana` and `cy` share a
workspace; `bo` is in a different one. Two users in one tenant and one in another
is the smallest arrangement in which *"different user"* and *"different tenant"*
are distinguishable failures — with only two users they are the same test.

```sql
SELECT q.category, q.category_source, q.created_at
  FROM questions q
  JOIN users u ON u.id = q.user_id
 WHERE q.user_id = ?
   AND u.workspace_id = ?
   AND q.category IS NOT NULL
 ORDER BY q.id DESC LIMIT 1
```

Both conditions are stated although the first would usually be enough. **A
boundary that holds only because of an invariant maintained in a different file
is a boundary that breaks when that file changes.**

And in the builder, before any field is considered:

```js
const foreign = [
  ['workspace', req.workspace?.id],
  ['user', req.user?.workspace_id],
  ['recentCategory', req.recentCategory?.workspaceId],
].filter(([, id]) => id != null && id !== workspaceId);

if (foreign.length > 0) throw new ContextScopeError(...);
```

It **throws**. It does not drop the row quietly. A record from another tenant
reaching this point means a query upstream was missing a `WHERE` clause, and
continuing would ship that bug into a third-party API call. A silent filter would
make the most serious failure in the file the quietest one.

> **Isolation is application logic. It is never a request to the model to please
> ignore something.**

---

## 11. The manifest

The obvious implementation is to concatenate the context, hash it, and call the
problem solved. One line of code, and it answers one question: did the bytes
differ.

It cannot answer any of the questions you actually have at 2am.

- Which field was missing — and was it missing, or excluded?
- Was the surface dropped because it was stale, or because it conflicted?
- Did the value change, or only its freshness?
- What did the policy decide **not** to send?

A hash over rendered text cannot record an **exclusion** at all, because an
excluded field contributes nothing to render. And exclusions are most of what a
context policy does.

So the manifest is a structure first and a hash second. Here is a real one, from
the running application:

```
context schema  ctxs-v1
policy          ctx-v1
manifest sha256 7957c4c0f5355661

| # | Field | In | Trust | Value | Fresh | Reason |
|---|---|---|---|---|---|---|
| — | workspace_id            | no  | server-authoritative      | h:030793af3a968d72 | live   | NEVER_MODEL_VISIBLE |
| 0 | asked_from_surface      | yes | server-validated-client…  | data/export        | lt-1h  | INCLUDED |
| 1 | workspace_export_enabled| yes | server-authoritative      | true               | live   | INCLUDED |
| 2 | question_text           | yes | user-authored-untrusted   | h:2522ab2a599ff63f | live   | INCLUDED |
| — | recent_category         | no  | derived-from-user-action  | —                  | unknown| NOT_IN_POLICY |
| — | user_department         | no  | server-authoritative      | —                  | live   | NOT_IN_POLICY |
| — | user_manager_id         | no  | server-authoritative      | —                  | live   | NOT_IN_POLICY |
| — | workspace_note          | no  | user-authored-untrusted   | —                  | live   | NOT_IN_POLICY |

3 of 8 fields in the model input.
```

Four design decisions in that table are worth stating.

**Every specification field appears, always.** A field the policy never asks for
is `NOT_IN_POLICY`, not absent. *"Why was it not there?"* has an answer in every
case, and two policies' manifests diff line by line.

**Values or digests, decided per field.** Product-owned enum values are written
out — a hash of `true` tells nobody anything, and `data/export` is our own
vocabulary. Free text and identifiers become a 16-hex digest.

> **CONTENT PROVENANCE is not CONTENT STORAGE.** You can prove which value
> contributed, and whether two calls used the same one, without keeping it.

The digest is not a security boundary; a short hash of a low-entropy value is
guessable. It protects against incidental exposure in logs and debug views, not
against someone determined to recover the text. Anything needing the stronger
guarantee should not be in context at all.

**The freshness bucket is in the identity; the timestamp is not.** A hash
containing a millisecond timestamp is unique per request by construction, which
makes it useless for the one thing it exists to do. Buckets keep the hash stable
across genuinely equivalent requests and change when a value ages into a
different regime. The exact timestamp stays in the structure for debugging.

**Order is in the identity, and it is recorded rather than justified.** The
position is the field's index in the *policy's declared order*, not in the
rendered string — so dropping one field reports a change to one field, not to
every field after it. Whether order changes model behaviour on a six-way
classification is **unmeasured (G-25)**. What is claimed is narrower and still
worth having: *the input contract is deterministic even though the model is not.*

### What the hash is not

It does not explain behaviour. It identifies a runtime input state. Two calls
with different manifest hashes behaved differently *given different inputs* —
which is not the same as the context having caused the difference, because
Chapter 05 §10 established that identical inputs do not guarantee identical
outputs either.

**The manifest tells you what to compare. It does not tell you what to
conclude.**

### The central demonstration

```
promptHash            ceac63d178690c8e2312d2b99c257a60ab86b80d6687f6181d3adf76388899d6
model                 claude-opus-5
user input            "Why can't I get this out?"

contextManifestHash   7957c4c0…      surface data/export, export enabled
contextManifestHash   0aefcb14…      surface contradicted and dropped
```

Chapter 05's record makes these identical. The test that proves it builds
Chapter 05's record explicitly and asserts equality:

```js
const promptOnly = (x) => JSON.stringify({
  model: 'claude-opus-5',
  promptHash: promptHash(getPrompt('cat-v1').system),
  input: x.rendered.length > 0,
});
assert.equal(promptOnly(a), promptOnly(b));        // indistinguishable
assert.notEqual(a.manifestHash, b.manifestHash);   // and not the same call
```

### Three absences, one model input

`[Our observation]` The sharpest result in the chapter, and it needed no model.

Three cases produce **the same 135 bytes** under `ctx-v1` — the surface is gone
in all three:

| | What happened | Reason |
|---|---|---|
| CX-03 | the value was right and the feature moved | `STALE_RETIRED_SURFACE` |
| CX-05 | there was no value | `MISSING` |
| — | the client sent something we do not recognise | `REJECTED_VALUE` |

Three different problems, three different fixes, one identical request, three
different manifest hashes.

The converse is in the suite too: a `ctx-v1` request that selects nothing renders
**byte-identical** to a `ctx-v0` request and hashes differently. *"We looked and
found nothing"* and *"we never look"* are not the same call.

### Where the context goes in the request — and why

The context is placed in the **user turn**, never in `system`. That is
architectural, not cosmetic.

`promptHash` is the hash of the bytes sent as `system`. Put per-request context
there and the prompt hash changes whenever the *data* changes — destroying the
one property that makes both hashes worth having. It also keeps the stable
material contiguous at the front, which is where a cache prefix would begin if
this feature ever used caching: prefixes are built `tools → system → messages`.
[Documented behaviour, S-038]

---

## 12. Cache ≠ memory ≠ context

Three words used interchangeably in design reviews, describing three unrelated
mechanisms.

**Context** is what is in this request. It is sent every time. Nothing persists.

**Cache** changes the economics of sending it. On this provider, a cache write
costs 1.25× the base input rate (2× for the one-hour option) and a read costs
0.1×. [Documented behaviour, S-038]

And the sentence that settles the confusion:

> *"Cached prompt prefixes still occupy the context window: prompt caching
> changes what you pay for those tokens, not whether they count."*
> [Documented behaviour, S-039]

**Memory** would be information that survives between calls and is deliberately
retrieved later. On this API, there is none: *"The API is stateless."*
[Documented behaviour, S-038]

> **Caching changes execution economics. It does not make information
> persistent product memory.**

`[Design interpretation]` The failure mode is specific and I have seen the
sentence that produces it: *"we cache the customer profile, so the model already
knows them."* Every clause is wrong in a different way. The profile is sent on
every request. It is billed on every request, at a discount. And a cache miss —
from a five-minute expiry, a changed prefix, a different workspace — is not
degraded memory, it is a full-price identical request. **A cache never changes
what the model is told. It changes what you were charged to tell it.**

Deskline uses no caching. A test asserts `cache_control` does not appear in the
model client, so the chapter cannot quietly acquire a mechanism it did not
explain.

---

## 13. Where memory actually lives

Now the word, defined.

**Short-term conversational context** — information included in the current
request. Not memory. Selected context that happens to be about the past.

**Persisted memory** — information stored outside the current request and
intentionally retrieved later.

The second one is a database, and the provider's own memory feature is the
clearest possible statement of that. When Claude uses the memory tool, it does
not store anything:

> *"The memory tool operates client-side: Claude requests file operations, and
> your application executes them."* … **"Memory lives entirely in your
> application."**
> [Documented behaviour, S-040]

The model asks. **Your application decides, stores, scopes and deletes.** Even
the feature named "memory" is a request for you to do a database write.

### Deskline's candidate, and what it turned out to be

`ctx-v2` adds one field: the user's most recent chosen category. The smallest
possible personalisation feature — which is exactly why it is worth taking
seriously. If it cannot survive the questions, nothing larger can.

There is no memory store. No `memories` table, no preference record, no
embedding. `recent_category` is a `SELECT` over `questions.category`, a column
that has existed since Chapter 04, where it was added so people could organise
their own questions.

`[Design interpretation]` **This is what most "AI memory" turns out to be on
inspection: a new READ of data the product already keeps for another reason.**
Nothing new was collected. A *secondary use* was created — and secondary use is
where most privacy failures actually live, because it changes four things that
were already settled without anyone deciding to change them:

| | Settled as | Silently becomes |
|---|---|---|
| Purpose | help this person find their own questions | condition a third-party API call |
| Audience | the person who wrote it | the person, plus a model provider |
| Scope | one user's list | one user's future classifications |
| Consent | implied by typing into their own list | not asked |

### The lifecycle table, and the blank row

Every persisted memory item needs answers to all of these.

| | Answer |
|---|---|
| **WRITE** — who, and why? | The user, choosing a category — to organise their own questions |
| **STORE** — where, scope, lifetime? | `questions.category`; user within workspace; lifetime of the question |
| **READ** — who, filtered how? | The context builder; `source='user'` only, ≤7 days, same workspace |
| **USE** — should it influence this task? | Weakly at most |
| **UPDATE** — can the user correct it? | Yes |
| **DELETE** — can the user remove it? | **NO** |
| — can they inspect it? | Partly. Nothing tells them it is being used this way |

**The blank row decided it.**

```js
productionAllowed: false,
productionBlockedBecause:
  'NO_USER_DELETION_PATH — Deskline cannot delete a question, so a user '
  + 'cannot remove a category that is now conditioning future model calls. '
  + 'Shipping this would create memory with no way out of it. F6.3.',
```

`ctx-v2` runs in the harness and in tests — a policy you cannot run is a policy
whose failures you cannot demonstrate — and the registry refuses to hand it to
the server.

`[Design interpretation]` Nobody argued about this. The table has six rows, one
was blank, and the blank row settled it. That is worth more than a debate about
whether personalisation feels creepy: it converts a judgement call into a
checkable gap. Deskline's inability to delete a question was a minor product gap
in a list view; **the moment that column is read to condition an automated
decision, the same gap becomes `F6.3`.**

### The correction that is not ground truth

A user changes `bug` → `how-to`. That is evidence of a correction. It is not
automatically ground truth, and it is not automatically memory worth keeping.

- **Was the user certain?** Unknown. The interface never asks, so treating every
  selection as confident is a choice made by not asking.
- **Was it anchored?** Partly answerable — `category_source` records whether a
  suggestion was on screen. Not fully: a suggestion they *rejected* still framed
  the alternatives.
- **Is it specific to this question?** Almost always yes.
- **Is it generalisable?** Almost always no.
- **Should it affect future classifications?** Weakly, briefly, for that person,
  reversibly. Three of those four are implemented.

Chapter 04's rule survives intact and is now enforced rather than remembered:
`ctx-v2` reads only categories with `source = 'user'`. A category *accepted from
a suggestion* is refused with `WRONG_SOURCE`, because feeding it back would make
the model's own earlier output an input to its next decision, with a click in
between laundering it into something that looks like a fact.

Dataset cases **CX-11** and **CX-13** are identical except for that one column
and produce different context. The rule removes the mechanical loop. It does not
remove the influence — a person who accepted a suggestion once may choose the
same label independently *because* they saw it, and no column records that.

### Proportional transparency

Not "always show all context". The tier follows the **consequence**, not the data:

| Context | Consequence | What is owed |
|---|---|---|
| current-page, capability flag | one dismissible suggestion | **No UI.** Explaining every input to a chip is noise, and it trains people to skip the explanations that matter |
| `recent_category` | **future** behaviour, invisibly, from something they did earlier | **Inspect, edit, reset** |
| department, manager | leaves the building | **Justification before use at all** — which it did not survive |

The middle row is the second reason `ctx-v2` does not ship: there is no delete,
and nothing tells the user the field is used.

---

## 14. Conversation context, and a window policy

Deskline is not a chat product and this chapter does not make it one. But the
mechanism is worth seeing once, because the multi-turn illusion is the single
biggest source of the confusion in §3.

> *"As the conversation advances through turns, each user message and assistant
> response accumulates within the context window… Input phase: Contains all
> previous conversation history plus the current user message."*
> [Documented behaviour, S-039]

The history is in the **request**. The client sends it. Every turn. The model
does not remember the conversation; **the application re-narrates it, in full,
every single time**, and pays for it.

That has consequences a chat interface hides:

- convenience and continuity, which is why it is done
- **hidden dependencies** — a request that only works because of an invisible
  earlier turn has a completely different test surface
- a larger input, growing turn over turn
- stale assumptions carried forward with no expiry
- privacy: everything ever said is re-sent on every subsequent call
- reproducibility: "it worked yesterday" may be a claim about turn 14

So if previous turns are included, there must be a **policy** — max turns, max
tokens, recency, role filtering — and never "the entire chat history".

Deskline's is deliberately trivial and entirely explicit: **one field, from the
same user, in the same workspace, chosen not accepted, within seven days.**

The seven days has **no evidence behind it (G-28)**. It is a stated position on
how long one click means anything. `[Design interpretation]` The alternative was
no window, which is not more neutral — it is the position that a click means
something forever, held by default and never written down. A number you can argue
with beats a default nobody noticed.

> **Conversation history is selected context, not magical memory.**

---

## 15. The controlled experiment

Chapter 05 varied the prompt with the context fixed. Chapter 06 does the inverse.

```
HOLD CONSTANT   model · prompt (cat-v1) · config · output schema · dataset
CHANGE          context policy
```

Both are configuration. Changing both at once is the easiest mistake in this
chapter to make by accident, and it produces a number nobody can attribute. So
the harness checks — from the rows, not from what the caller claimed:

```js
const promptsUsed = [...new Set([...rowsA, ...rowsB].map((r) => r.promptVersion).filter(Boolean))];
if (promptsUsed.length > 1) {
  out.push(`ABORTED: the prompt is not identical in both arms — ${promptsUsed.join(' vs ')}`);
  ...
  return out.join('\n');
}
```

### Four verdicts, two of which are refusals

`CONTEXT_HELPED` · `CONTEXT_HURT` · `NO_MATERIAL_CHANGE` · `UNABLE_TO_DETERMINE`

The fourth is the one that earns its place:

```js
// Something changed and it is not a pass/fail flip: two different wrong
// answers, or two different acceptable ones. A changed output is not a
// finding. Calling this "helped" is how context earns credit it has not
// been shown to deserve.
return 'UNABLE_TO_DETERMINE';
```

### The scoring choice, made out loud

CX-01 has **two defensible right answers**, and they disagree.

- **WORLD TRUTH** — the question is about export; the label is `data`. `ctx-v0`
  is wrong, because the product shipped the wrong category.
- **INPUT TRUTH** — given only the question, `unclear` is correct, and a model
  that abstained reasoned properly from what it had.

Both are true. A harness that quietly picks one is publishing an opinion as a
measurement.

This one scores **world truth** — the user receives one category and does not
know what we sent — and then **flags** every case where the other frame
disagrees, so the divergence is visible rather than averaged away.

`[Design interpretation]` This is a new kind of evaluation decision, and it only
appears once context exists. In Chapter 03 the output was the whole story. Here
the same output is right or wrong depending on which question you are asking, and
the harness has to declare which one.

### The simulated run

**SIMULATED RESPONSES — NOT MODEL BEHAVIOUR.**

```
CONTEXT_HELPED         1
CONTEXT_HURT           2
NO_MATERIAL_CHANGE     5
UNABLE_TO_DETERMINE    2

POINTWISE FLOOR — reported before, and separately from, any tally
  ctx-v0: PASS (10 evaluated)
  ctx-v1: FAIL — NOT SHIPPABLE regardless of the tally below
      CX-10  FLOOR_FAILURE  forced "billing" where the question cannot be placed

DETERMINISTIC — measured without a model
  ctx-v0: 506 bytes    ctx-v1: 1837 bytes    delta: +1331 (+263%)
  manifests differing: 10/10
  ctx-v1: source conflicts resolved by the application in CX-04
```

What that establishes: the machinery works, all four verdict states are
reachable, the floor prints before the tally, and a floor failure overrides a
positive tally.

What it establishes about `ctx-v1`: **nothing at all.**

The fixture was written to produce exactly this shape — one win and a floor
failure — because that is the outcome a real context change is most likely to
have and the one an average would hide. It is a test of the instrument, not a
preview of the result.

One more thing the harness does, which Chapter 05's did not: when every call
fails, it still prints the deterministic section. **With no model there is still
real evidence about the application** — bytes, manifests, conflicts, untrusted
fields — and throwing it away because the model half failed would discard the
half that worked.

---

## 16. What broke

Ten demonstrations. Each labelled by **what kind of evidence it is**, because
blurring those categories is how a chapter convinces itself of something.

| # | Failure | Case | Status |
|---|---|---|---|
| 1 | missing context | CX-05 | **OBSERVED** — `MISSING`, no default invented |
| 2 | irrelevant context | CX-02 | **STRUCTURALLY PROVEN** — the policy includes it because policies cannot judge relevance |
| 3 | stale context | CX-03 | **OBSERVED** — retired surface excluded; verified in the running app |
| 4 | contradictory context | CX-04 | **OBSERVED** — conflict recorded, authoritative source kept |
| 5 | sensitive unnecessary | CX-07 | **OBSERVED** — values present in the request, absent from the input |
| 6 | wrong-scope / tenant | — | **OBSERVED** — `ContextScopeError` on three different carriers |
| 7 | malicious instruction in untrusted context | CX-08 | **SIMULATED** for the model half; **OBSERVED** that no production policy sends it |
| 8 | context-manifest mismatch | — | **OBSERVED** — three absences, one input, three hashes |
| 9 | same prompt hash, different context | — | **OBSERVED** — the central test |
| 10 | memory deletion / reset | `ctx-v2` | **NOT YET TESTABLE** — there is no delete path, which is why the policy is blocked |

Two are worth their own space.

### CX-02 — irrelevant context is not a data problem

*"How do I reset my password?"*, asked from `data/export`.

The surface is real, fresh, correctly validated, correctly stored, and has
nothing to do with the question. `ctx-v1` includes it.

That is not a bug to fix. **A context policy is a structural rule; it cannot know
relevance.** The only thing in the system that could judge relevance is the
model, and asking it to is precisely the ambiguity we introduced by adding the
field.

`[Design interpretation]` This is the honest cost of context selection and it
does not go away with better engineering. Every unconditional inclusion rule
supplies irrelevant context some fraction of the time. The choices are: accept
it, add relevance logic (which is a second model, or a heuristic that will be
wrong differently), or do not include the field. Chapter 07's retrieval makes
this question central rather than incidental.

### CX-10 — the failure with no code fix

*"Following up on my previous request — any update?"* — asked six days ago from
`billing/invoices`.

The field is included. It is correct. It passes every check.

And a reader who takes `asked_from_surface` to mean *where the user is now* has
misunderstood it, because nothing in the system knows where they are now. There
is no validation that catches this. **The mitigations are the NAME — not
`current_page` — and the manifest carrying `capturedAt`.**

> **Some context failures are naming failures, and no amount of correct data
> fixes one.**

### FR-04 — the harness found a floor failure that was never in the fixture

The first simulated run reported three floor failures. Two were not in the file.

The simulated classifier looked its case up by matching the question text:

```js
const c = dataset.cases.find((x) => x.text === text);
```

Four cases share the question *"Why can't I get this out?"* **on purpose** —
holding the question constant while the context varies is the entire experiment.
`find` returned the first one every time.

**Fix:** the case id travels with the call; the fixture is keyed by id. The
regression test is behavioural rather than a grep — four cases sharing a question
are given four different fixtures, and the harness must return four different
answers.

`[Design interpretation]` Two lessons, and the second is the uncomfortable one.

**An evaluation harness must identify a case by its identifier, never by its
content.** Content collides, and it collides most often in exactly the
experiments where content is deliberately held constant. A prompt comparison
never meets this, because there the question varies and the prompt is fixed.
Invert the design and the assumption breaks silently.

And: it produced a **false finding of the most dangerous possible shape** —
specific, correctly formatted, and in agreement with the hypothesis I already
held (*added context breaks abstention*). It was believable **because** it
agreed. That is the entire argument for checking a result against the fixture
that supposedly produced it, and it is why no model result may be reported
without one.

### FR-05 — a catch-all swallowed a sub-path

`/^\/api\/questions\/(.+)$/` matched `/api/questions/1/context-preview` and
answered *"that is not a valid question id"*. The route was written in Chapter 01
and was correct for every path that existed then.

**A catch-all is a claim about paths that do not exist yet.** Found only because
a test asserted a specific status rather than "not 200".

---

## 17. Debugging: the inspection artefact

*"Same prompt, same model, same question — why did it behave differently?"*

The prompt cannot answer it, because the prompt did not change.

```
node eval/inspect-context.mjs CX-04 ctx-v1
GET  /api/questions/:id/context-preview?policy=ctx-v1     (gated)
```

Both print the manifest, and both print the **same** structure the provenance
record carries — a debugging view that shows something other than what production
used is worse than no view at all.

What they do not print: the value of any field stored as a digest. A tool that
dumps raw context copies user and customer content into terminal scrollback,
screenshots and support tickets. That is the same failure as logging question
text, wearing a developer-tools badge.

The route is off unless `ALLOW_CONTEXT_PREVIEW=1`, refuses non-production
policies, and enforces the same 403 as reading the question — verified in the
running application, not only in tests.

**Logging** follows the same rule. The `suggest` line carries
`contextPolicy`, `contextManifestHash`, `contextFieldCount`, `contextBytes` —
hashes, counts and classes. Never a value. And the deny-list in `log.mjs` is a
backstop, not the mechanism: the mechanism is that free text is a digest *inside
the manifest*, so the value is not available to be logged by accident.

---

## 18. A context failure taxonomy

Twelve classes, added to `00-master/05 — Failure Taxonomy.md` as **F9**. Every
one has a real Deskline case or a named dataset case; nothing is there because it
sounded plausible.

`F9.1` missing · `F9.2` irrelevant · `F9.3` stale · `F9.4` contradictory ·
`F9.5` excessive · `F9.6` sensitive unnecessary · `F9.7` wrong-scope ·
`F9.8` untrusted treated as authoritative · `F9.9` version/order mismatch ·
`F9.10` missing provenance · `F9.11` misattributed provenance ·
`F9.12` poisoned persisted context

`[Design interpretation]` They group into three, and the grouping is the useful
part. **F9.1–F9.4** are failures of *knowing what you have*. **F9.5–F9.8** are
failures of *deciding what to send*. **F9.9–F9.11** are failures of *being able
to say what you sent*.

The third group has no user-visible symptom, which is why it survives longest.

### F9.12 and the write path, narrowly

If persisted memory or context can be written by a user, a model, or a third
party, then a malicious or simply wrong value can influence future calls.

Deskline's exposure is small and real: `workspace_note` is written by a person,
and `questions.category` is written by the user whose future context reads it.

The point to carry forward is one sentence: **the context write path is part of
the attack surface.** Chapters 07, 09 and 12 own the rest — retrieval and agents
make it very much larger.

`[Our observation]` OWASP's *Agentic AI — Threats and Mitigations v1.0* exists
and was confirmed at its resource page (retrieved 1 September 2026); its threat
identifiers live inside a PDF the page links rather than serves. A search result
described a "T1 Memory Poisoning" class with three attack vectors. **That is
search-result evidence, not a retrieved source, so it is cited nowhere in this
chapter.** Recorded as **G-26**.

---

## 19. Sources

**S-038 — Prompt caching.** *"The API is stateless."* Prefixes built
`tools → system → messages`; 512-token minimum on Opus 5; 5-minute default TTL,
1-hour option; writes at 1.25×/2×, reads at 0.1×; cache hits require identical
prefixes. Grounds §12.

**S-039 — Context windows.** Context rot named and defined by the vendor; the
window as *"working memory"*; history is client-supplied every turn; everything
in the request counts; cached prefixes still occupy the window. Grounds §5, §12,
§14.

**S-040 — Memory tool.** *"Memory lives entirely in your application."* Grounds
§13. Deskline does not use this tool — Chapter 08 owns tool use.

**S-041 — Effective context engineering for AI agents.** Context engineering as
curation distinguished from prompt engineering; *"the smallest possible set of
high-signal tokens"*. Grounds §5.

**S-042 — OWASP LLM02:2025 Sensitive Information Disclosure.** Cited in §9 for
one point specifically: *"Limit model access to external data sources, and ensure
runtime data orchestration is securely managed"* — the control is on what the
application assembles, not on what the model is asked to ignore.

### Videos

**V-008 — What is a Context Window?** (IBM Technology, 11:30). The mechanism
behind §5. Any token count in it is a snapshot; take sizes from S-039.

**V-009 — What Is Context Engineering?** (IBM Technology, 9:56). Its own
description leads with this chapter's thesis: *"More data doesn't always mean
better AI."* The page notes AI was used to create its transcript and metadata —
recorded because provenance of a source about provenance is not a joke to skip.

**V-010 — Memory in AI agents** (Google Cloud Tech, 4:34). Watch it **critically**.
Every time a memory *type* is named, ask §3's question: *where is it stored, and
how is it retrieved?* Where the video answers, the term is doing work. Where it
does not, the term is standing in for an architecture nobody has drawn.

**VIDEO COVERAGE: PARTIAL.** Context windows, context engineering and memory
vocabulary are covered. Nothing was found on context provenance or context
versioning — **G-27**.

---

## 20. Learning Checkpoint

Eight scenarios. Reasoning in §21 — work through them first.

**Q1 — The same prompt, different answers.** A colleague reports that the same
prompt and the same model gave two different answers to the same question, and
concludes the model is unreliable. Two previous turns differed. What actually
happened, what is the minimum record that would have shown it, and is the model
unreliable?

**Q2 — "More context helps."** An engineer proposes sending the customer's full
record — plan, seat count, contacts, support history, billing address — with
every classification, arguing that more context helps and the data is already
authorized. Give the response, and say which of their claims are true.

**Q3 — The old preference.** A user set their default category to `billing` in
March. Today they explicitly select `access` on a question, and the system
suggests `billing` again next time because the stored preference is weighted
higher than the current choice. Name the failure, and say what the rule should be.

**Q4 — The tenant leak.** Tenant A's workspace note appears in a model request
made for Tenant B. The context builder was correct. Where do you look, what do
you do first, and what would have caught it?

**Q5 — "Do not reveal it."** A design proposes sending the model everything the
application can read, plus an instruction: *"You may only use information the
user is authorized to see. Do not reveal anything else."* What is wrong with
this, and what is the correct ordering?

**Q6 — The cached profile.** In a design review someone says: *"we cache the
customer profile, so the model already knows them and we don't pay for it
twice."* Correct each clause.

**Q7 — The stored correction.** A user corrects a suggestion from `bug` to
`how-to`. The product stores it as a preference and uses it forever. Give the
four questions this skips, and say what a defensible version looks like.

**Q8 — The privacy trade.** Adding the user's department improves classification
on ambiguous cases from 61% to 68%. It is authorized, it is already in your
database, and it is an employment attribute. How do you decide, and what would
change your answer?

---

## 21. Checkpoint Discussion / Reasoning

**Q1.** Nothing surprising happened, and the model is not the thing that has
been shown to be unreliable.

Two previous turns differed, so **the model input differed**. Same prompt, same
model, different input — different output is the correct behaviour of a system
working exactly as designed. Your colleague compared two things that were never
the same call and concluded the varying part was the part they had held fixed.

The minimum record is the one this chapter builds: a **context manifest hash**
alongside the prompt hash. With it, the first thing anyone sees is that the two
calls had different context, and the conversation is over in ten seconds.
Without it, the two calls are indistinguishable in the log and the only available
explanation is *"models are like that"* — which is how an architecture problem
becomes a folk belief about the vendor.

Two honest qualifications:

- The model **is** non-deterministic even on identical input — Chapter 05 §10.
  So identical manifest hashes would not have proven the reverse. What the
  manifest establishes is which hypothesis is *available*, not which is true.
- If the two calls turn out to have identical manifests, you have a genuine
  stability question, and the answer is `--repeat`, not an opinion. **G-22.**

**Q2.** Two of their claims are true and the conclusion does not follow from
either.

*True:* the data is authorized. *True:* the application can read it. What is
missing is the third relation:

```
AVAILABLE ⊋ AUTHORIZED ⊋ NECESSARY
```

Nothing about being allowed to read something makes it necessary to send it to a
third party.

The concrete costs, none of which is hypothetical: every field is transmitted
outside your system on every classification; the input grows and degrades recall
as it does (**context rot**, S-039); a support-history field is free text someone
typed, so it is an injection vector inside a block labelled *context*; a billing
address is a sensitive attribute with a compliance surface the classifier does
not need; and the whole record is a snapshot that will be stale in ways nobody is
tracking.

The counter-proposal is not "send less". It is: **name the field, state the
classification decision it changes, and defend it individually.** In Deskline
that produced two fields out of eight, and the capability flag earned its place
by moving a question between `bug` and `access` — a specific claim someone can
argue with.

`ctx-x1-unsafe` exists so this argument can be tested rather than had: 366 bytes
against 212 on CX-06, for a question decidable from its first six words.

**Q3.** The failure is **stale context given authority over current input**, and
in the taxonomy it is `F9.3` compounded by `F9.4` — the two sources disagree and
the wrong one wins.

The specific defect is the weighting. A stored preference from March and an
explicit selection made a moment ago are not two opinions to be balanced. One is
a **snapshot**; the other is **live** and is the most authoritative signal the
system will ever get about this user's intent.

The rule: **an explicit current choice always outranks a stored past one.** Not
"weighted higher" — outranks. And the stored value needs the two things §7
requires of any snapshot: a timestamp, so it can be known to be old, and a
window, so it stops applying. Deskline's `recent_category` has a seven-day window
for exactly this, and the window is stated with its lack of evidence attached
(**G-28**).

There is a second failure underneath, worth naming: nobody told the user their
March choice was still shaping suggestions in September. Under §13's proportional
transparency, persisted context that affects future behaviour needs
inspect/edit/reset. This one had none of the three.

**Q4.** *"The context builder was correct"* is the most useful sentence in the
question, and it tells you where **not** to look.

**Look upstream, at the query.** Something handed the builder a row it should
never have seen. In Deskline the equivalent bug would be a `SELECT` missing its
`workspace_id` condition — which is why the note-fetching query carries both
`user_id` and `workspace_id` even though one would usually do.

**First action is containment, not diagnosis.** Data has left the building.
Disable the context policy — one configuration change, because policies are
versioned exactly so this is possible — before starting the investigation. The
system runs on `ctx-v0` and keeps working, because the core product never
depended on the enhancement.

**What would have caught it:** the scope check that **throws**.

```js
const foreign = [...].filter(([, id]) => id != null && id !== workspaceId);
if (foreign.length > 0) throw new ContextScopeError(...);
```

A cross-tenant row is not filtered out quietly. Filtering would have made the
request succeed with the leak removed *this time* and left the broken query in
place. Throwing turns a silent data-boundary violation into a loud failure at the
last point before the data leaves.

And what would have caught it earlier: **the test that constructs a cross-tenant
request for every carrier** — workspace, user, and previous category — rather
than for the one that seemed most likely.

**Q5.** The instruction is not a weaker control. It is not a control.

Once the data is in the request, **it has left the building**. It has been
transmitted, it is in the provider's processing path, it counts toward the
context window, and it is billed. The instruction asks a probabilistic process
to be discreet about something it has already received. Even if the model
complies perfectly on every request, the disclosure that mattered has already
happened.

There is a second failure that the first one hides: the model has been made the
authorization system. It has never seen your permission model, it cannot query
it, and it will now decide — inconsistently, and unauditably — what a user may
see. If your access-control logic is a sentence in a prompt, you do not have
access control.

The correct ordering:

```
AUTHENTICATE  →  AUTHORIZE DATA  →  SELECT PERMITTED CONTEXT  →  MODEL CALL
```

Authorization decides what may be *read*. Context selection decides which of that
is *necessary*. Only then does anything leave. Chapter 11 owns the first step;
this chapter owns the ordering, because context selection is where authorization
either happened or silently did not.

The tell that you are in the failure mode: **an instruction in the prompt
describing what the model should not do with data you gave it.**

**Q8 is the version of this question where the trade-off is real.** This one is
not a trade-off; it is a control that does not exist.

**Q6.** Every clause is wrong, in a different way.

*"we cache the customer profile"* — you cache a **prefix of a request**. If the
profile is not at a stable position at the front, before anything that varies, it
is not being cached at all. Prefixes are built `tools → system → messages`
(S-038), and a cache hit requires the segment to be **100% identical** up to the
breakpoint. A profile that changes per user is a different prefix per user.

*"the model already knows them"* — it does not. The profile is **sent on every
request**. Nothing persists. *"The API is stateless."* (S-038) The cache is on
the provider's side, keyed to the exact bytes, expiring in five minutes by
default.

*"we don't pay for it twice"* — you pay every time, at a different rate. A cache
read is **0.1×** the base input rate; the write that created it was **1.25×**
(2× for the one-hour TTL). Cheaper. Not free. And on a miss — expiry, a changed
prefix, a different workspace — it is a full-price identical request, not
degraded memory.

The sentence that resolves all three:

> *"Cached prompt prefixes still occupy the context window: prompt caching
> changes what you pay for those tokens, not whether they count."* (S-039)

**A cache never changes what the model is told. It changes what you were charged
to tell it.**

**Q7.** Four questions, and the correction survives none of them intact.

**Was the user certain?** Unknown — the interface never asked. Treating every
selection as confident is a choice made by not asking.

**Was it anchored?** A suggestion was on screen. Even a *rejected* suggestion
framed the alternatives. Chapter 04's rule stands: user-accepted AI output is not
independent ground truth, and storing it does not make it so. Deskline enforces
this rather than remembering it — `ctx-v2` refuses categories whose
`category_source` is `user-accepted-suggestion`, with the reason `WRONG_SOURCE`.

**Is it specific to this question?** Almost certainly. *"This question is a
how-to"* is a statement about one question, not about the person.

**Is it generalisable?** Almost certainly not. One person choosing `how-to` once
tells you very little about their next question and nothing about the taxonomy.

And *"forever"* fails a fifth question the four imply: **can they undo it?**
Storing a correction permanently, with no expiry and no way to remove it, is
`F6.3` — no deletion path — and it is the exact reason `ctx-v2` is blocked from
production in this chapter.

A defensible version: **weak, short-lived, user-scoped, source-filtered,
inspectable, deletable.** Deskline implements the first four. It does not ship,
because it cannot do the last two.

**Q8.** This is the honest version of Q2, and it does not resolve by reflex in
either direction.

**First, interrogate the number.** Seven points on which cases, and how many? If
the ambiguous subset is thirty cases, seven points is two cases and could be
noise. Was it measured on a holdout, or on the set used to design the feature
(**G-23**)? Was it a single run, on a non-deterministic system (**G-22**)? The
gain has to survive being a real number before it can be weighed against
anything.

**Then ask what the field is doing.** Department improving classification means
the model is inferring category from *who is asking*, not from *what they asked*.
That is a correlation across your user base, and it will be right on average and
wrong for the individual — the Finance person asking a genuine access question
gets `billing`. Population accuracy improving while individual accuracy degrades
for anyone atypical is a fairness concern (`F6.6`), not only a privacy one, and
the aggregate metric is exactly the thing that hides it.

**Then the exposure.** An employment attribute leaves your system on every
classification, forever, for a seven-point gain on a subset.

**Then look for the third option**, which usually exists and which the framing
suppresses. If the model needs to know the question is about invoices, a field
that says *the question is about invoices* is better than one that says *this
person works in Finance* — narrower, less sensitive, and it does not encode an
assumption about people. Deskline took exactly this route: `workspace_export_enabled`
is a fact about the **product**, not about the **person**.

**What would change the answer.** A larger and better-established gain on
holdout data; a demonstration that the improvement is not concentrated in
stereotype-consistent cases; a genuine absence of any less sensitive field that
does the same work; and a specific, stated retention and deletion position for
the attribute.

`[Design interpretation]` Notice the shape of the reasoning. The privacy question
was not settled by a principle. It was settled by asking what the field is
actually doing, and finding that the thing it does well is something a
non-sensitive field does better. **The best privacy arguments are usually also
better engineering arguments** — and when they are not, you are in a real
trade-off and should say so plainly rather than reaching for a rule.

---

## 22. Reflect

### When is context useful information, and when is it merely additional exposure?

Three questions, in this order.

**Does it change a decision this system makes?** Not *"is it related"* — does it
move the output. `workspace_export_enabled` moves a question between `bug` and
`access`; that is a specific claim someone can argue with. `user_department`
might nudge some cases toward some categories; that is a hope with a data
transfer attached.

**Is it the narrowest thing that does the job?** If a fact about the *product*
does the same work as a fact about the *person*, the person's fact was never
necessary. This is where most of the real wins are, and it is the question that
gets skipped because both fields are sitting in the same row of the same
database.

**Would you defend it individually?** A field added as part of "send the customer
record" was never justified; it was carried. The test is whether you can write
one sentence saying what it changes. Deskline's specification requires that
sentence for every field, including the four it refuses to send.

Anything that fails all three is exposure. Anything that passes all three has
still bought you cost, latency, staleness and attack surface, and should be
written down as a decision rather than as an addition.

`[Design interpretation]` What I did not expect from building this: the exposure
question and the quality question kept giving the same answer. Anthropic's
context-engineering guidance targets *"the smallest possible set of high-signal
tokens"* (S-041) for accuracy reasons and arrives at the same rule data
minimisation reaches for privacy reasons. That convergence is not universal —
Q8 is the case where it breaks — but it is common enough to be the default
expectation, and it means the privacy argument rarely has to be made alone.

### Where does memory actually live in an AI product?

**In the boxes that were already there.**

The provider is stateless. Caching changes what tokens cost, not whether they are
sent. Even the provider's own memory tool is a request for *your application* to
perform a file operation: *"Memory lives entirely in your application."* (S-040)

Deskline's one candidate memory field turned out to be a `SELECT` over a column
added in Chapter 04 for an unrelated reason. No new store. No new collection.
**A new read.**

That is the pattern to expect, and it is why the word is dangerous. "Memory"
sounds like a component you are adding, so it gets designed like one — with a
schema and a retention policy and someone asking who owns it. When it is instead
a new *read* of existing data, all of those questions have already been answered
for a different purpose, and the answers are silently wrong for the new one.

The four things that change without anyone deciding: purpose, audience, scope,
consent. None of them appears in a diff. All four are visible the moment you fill
in a lifecycle table, which is why `ctx-v2` is blocked by a blank cell rather
than by an argument.

> **If you cannot say where it is stored and how it is retrieved, you have not
> found the memory yet. You have found a word standing where an architecture
> should be.**

### What must be recorded so that two model calls can meaningfully be compared?

Everything that could differ, and that is a longer list than it looks.

```
prompt version + prompt hash          the bytes, not the label
model + what actually served it       identifiers get repointed
configuration                         effort, contract, limits
context policy version + schema       what we intended to select
context manifest hash                 what was actually selected
context field count + bytes           the cost of it
dataset version + split               what it was measured on
evaluator + criteria version          who judged, against what
```

Three properties matter more than the list.

**Hashes over labels.** A version string is a claim; a hash is the thing. Chapter
05 learned this for prompts and this chapter applies it to context.

**Exclusions, not just inclusions.** The manifest records every field in the
specification with a reason, so *"why was it not there?"* is always answerable. A
record of what you sent cannot distinguish a considered refusal from an oversight
— and the two need completely different responses.

**Buckets, not timestamps.** An identity containing a millisecond is unique per
request and therefore identifies nothing. This is the subtlest of the three and
the one most likely to be got wrong by someone who has understood everything
else.

And the boundary on all of it: **provenance tells you what to compare. It does
not tell you what to conclude.** Two calls with different manifest hashes
produced different outputs *given different inputs* — which is not the same as
the context having caused it, because the model is non-deterministic on identical
input too. Provenance narrows the hypothesis space. It does not close it.

`[Our observation]` The most useful thing built in this chapter cost about forty
lines: recording the *reason* a field was absent. Three different problems —
stale, missing, rejected — produce byte-identical model input and three different
provenance records. Without the reason field they are one indistinguishable
event, and the wrong fix gets applied to two of them.

---

## 23. Artefacts

| Path | What |
|---|---|
| `experiments/03-context-and-memory/context-spec.md` | the specification |
| `experiments/03-context-and-memory/architecture.md` | diagram with trust and authorization boundaries |
| `experiments/03-context-and-memory/memory-decision.md` | the lifecycle table and the blank row |
| `experiments/03-context-and-memory/results.md` | every measurement, labelled by how it was obtained |
| `src/context/fields.mjs` | the specification, enforceable |
| `src/context/surfaces.mjs` | the vocabulary the server owns |
| `src/context/policies/` | `ctx-v0` (frozen) · `ctx-v1` · `ctx-v2` · `ctx-x1-unsafe` |
| `src/context/manifest.mjs` | manifest, canonical form, hash, inspection |
| `src/context/build.mjs` | scope → policy → resolve → freshness → conflict → render |
| `eval/compare-context.mjs` | prompt fixed, context varied, four verdicts |
| `eval/inspect-context.mjs` | the debugging artefact |
| `eval/fixtures/context-demo.json` | **SIMULATED** |
| `evaluation/datasets/category-suggestion/context-v1.json` | 13 cases, 10 context classes |
| `tests/context.test.mjs` | 92 tests |
| `00-master/05 — Failure Taxonomy.md` | **F9** |

### Open gaps

**G-18** — no credential. Blocks everything below it.
**G-24** — is `ctx-v1` better than `ctx-v0`? Unknown. One command closes it.
**G-25** — does field order matter? Unmeasured, and deliberately not asserted.
**G-26** — OWASP's agentic memory-poisoning taxonomy, not retrieved.
**G-27** — no video on context provenance or versioning.
**G-28** — the seven-day window has no evidence behind it.

```bash
ANTHROPIC_API_KEY=... node eval/compare-context.mjs ctx-v0 ctx-v1
```

Until that runs, the honest summary of this chapter is: **the application does
what it was designed to do, and whether the design is right is unknown.** Those
are different claims, and keeping them apart is the point of everything above.
