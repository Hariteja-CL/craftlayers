# Chat Gateway — Integration Spec

**Service to change:** `factory-service.craftlayers.com` — endpoint
`POST https://factory-service.craftlayers.com/api/chat`
(configured on the site as `VITE_B_GATEWAY_URL`). This is a **separate service
from the website repository**; nothing in the `craftlayers` web repo can fix it.

**Status:** the website side is complete and verified. The changes below are
**server-side only** and are required before the feature works end to end.

**Current mitigation in place:** because the assistant answers case-study
questions from the wrong project, the chat launcher is **temporarily hidden on
`/work/respondent-experience`** only. It remains active on every other route.
It will be re-enabled as soon as the acceptance tests in §2 pass.

There are two independent workstreams here. **Item 1 is a live confidentiality
issue and should be fixed first, regardless of whether Item 2 is ever built.**

---

## 0. Reproduction evidence

Captured live from the browser on `/work/respondent-experience`.

### Request actually sent by the website ✅ correct

```json
POST https://factory-service.craftlayers.com/api/chat
{
  "message": "can you explain what the achievement in this casestudy?",
  "session_id": "34c2d270-57d7-4533-85b2-c9755a1db0ed",
  "page_context": {
    "route": "/work/respondent-experience",
    "content_type": "case_study",
    "context_id": "respondent-experience",
    "title": "Three Questions Were Not the Problem"
  }
}
```

### Response returned by the gateway ❌ wrong case study

> Intent: Portfolio - Discovered sensitive user data (PII) stored in
> client-side cookies, reported it through responsible disclosure. - The vendor
> fixed the issue after the report — outcome: eliminated the vulnerability. -
> Achievement: demonstrates practical security awareness and proactive
> responsible disclosure, validating Hari's ability to find and communicate
> real-world security risks.

An earlier attempt produced a different failure mode on the same route — the
assistant asked which case study was meant and **named three projects**,
including the client and the security-disclosure organisation.

### What this proves

- `page_context.context_id = "respondent-experience"` **is delivered** to the
  gateway on every request from that page.
- The gateway **discards it**: it classifies to `Intent: Portfolio` and answers
  from an unrelated portfolio project.
- The visitor asked about the case study they were reading and received the
  achievements of a **different** piece of work.

The defect is entirely in context routing on the gateway. No website change can
correct it.

---

## 1. URGENT — the assistant is disclosing client and employer names publicly

### Observed behaviour

A visitor on the public site asked *"can you explain what the achievement in
this case study?"* and the assistant replied:

> Do you mean the **Enculture** case study, the **Craft Layers AI Factory** case
> study, or the **Security (Edureka)** case study? …

### Why this is a problem

The published case study at `/work/respondent-experience` is deliberately
**anonymised**. The web page never names the client, the employer, the product
or the programme. The chat assistant is disclosing exactly those identifiers to
any anonymous visitor, on every page of the site — which defeats the
anonymisation and exposes named parties without their consent.

### Required change

Apply the same anonymisation rules to the **existing** knowledge base that the
website already follows:

- Do not name **Enculture**, **Weekly Pulse**, **Perpetual Pulse**, or any
  client or employer organisation, in any answer to a public visitor.
- Do not name **Edureka** or any organisation involved in a security
  disclosure. Describe it only as "a responsible disclosure involving
  client-side exposure of personal data", with no organisation named.
- Do not name individual participants, colleagues or stakeholders.
- Do not describe internal product names, roadmaps, thresholds, formulas or
  unreleased functionality.

If a visitor asks who a client was, the approved answer is that the work is
published in anonymised form, the organisation cannot be identified, and
context can be discussed directly with Hari.

**Acceptance test:** ask the assistant "what case studies does Hari have?" and
"who was the client?" from a clean session. Neither answer may contain
`Enculture`, `Weekly Pulse`, `Perpetual Pulse`, or `Edureka`.

---

## 2. Make the assistant aware of the page the visitor is reading

### What the frontend now sends

The website sends an **optional** `page_context` object alongside the existing
fields. It is present only on routes that have an approved context document,
and omitted entirely everywhere else.

`POST <gateway>` — body:

```json
{
  "message": "What did the research find about anonymity?",
  "session_id": "34c2d270-57d7-4533-85b2-c9755a1db0ed",
  "page_context": {
    "route": "/work/respondent-experience",
    "content_type": "case_study",
    "context_id": "respondent-experience",
    "title": "Three Questions Were Not the Problem"
  }
}
```

On any other route the body is unchanged from today:

```json
{ "message": "hello", "session_id": "34c2d270-..." }
```

Notes:

- Only public, already-published metadata is sent. No page content, no
  confidential identifiers, nothing about the visitor.
- `content_type` is currently always `"case_study"`. Treat it as an enum that
  may grow.
- `context_id` is the stable key. Route strings may change; `context_id` will
  not.
- The field is additive. A gateway that ignores it keeps working exactly as it
  does today — which is the current situation.

### Required behaviour — context-routing logic

Evaluate **before** intent classification. Today the classifier runs first and
routes to `Intent: Portfolio`, which is what produces the wrong answer.

```
receive request
  │
  ├─ page_context absent?
  │     └─ behave exactly as today (general knowledge base)   [unchanged]
  │
  └─ page_context present
        │
        ├─ context_id not in the mapping table?
        │     └─ fall back to the general knowledge base.
        │        Do NOT error. Do NOT guess another case study.
        │
        └─ context_id recognised
              1. Load the mapped document.
              2. Treat it as the ONLY source for this answer.
              3. Do NOT blend in, or fall back to, other portfolio
                 projects for case-specific questions — this is the
                 exact failure in §0.
              4. Apply the confidentiality rules in that document (§17)
                 and in §1 of this spec.
              5. If the document does not support the question, return
                 the safe not-publicly-available response below.
```

### Fallback when the context cannot answer

When a question is on-topic for the case study but the approved document does
not cover it, do **not** improvise and do **not** reach for another project.
Return a response equivalent to:

> That detail isn't part of what's published for this case study. Hari can walk
> through more context directly — the best next step is to reach out.

Rules for this path:

- Never substitute a different case study to fill the gap.
- Never infer, estimate or extrapolate figures or outcomes.
- Never state or imply that any recommendation shipped or was measured.
- Offer contact as the next step rather than an answer.

### Mapping table

| `context_id` | Document | Status |
|---|---|---|
| `respondent-experience` | `case-study-respondent-experience.md` | Ready — in this repo, alongside this spec |

### Answering rules for this document

`case-study-respondent-experience.md` carries its own rules in §17. The ones
that matter most:

- Answer **only** from that document when the visitor is on that case study.
- Never name the client, employer, product or programme.
- Keep the figures approximate and separate: approximately 98 invited,
  approximately 8 in one observed cycle, around 11% during the research period.
  **Never** combine them (never "8 of 98 = 11%") and never present them as a
  universal or statistically representative result.
- **Never claim any recommendation shipped, was implemented, or improved
  participation.** Everything in the case study is a recommendation that is not
  yet validated. If asked "what was the result?", the honest answer is that the
  work produced a diagnosis and recommended directions that have not been
  measured.
- Never publish a numeric anonymity threshold; say "a minimum group threshold
  applies". Never claim guaranteed anonymity.
- Use "cognitive and emotional burden" / "negative recall". Never use clinical
  or psychological diagnosis language.
- If asked something the document does not cover, say it is not covered
  publicly and offer a conversation with Hari. Do not speculate.

### Acceptance tests

All of these must pass before the chat launcher is re-enabled on
`/work/respondent-experience`.

From a clean session, sending `page_context.context_id = "respondent-experience"`:

| # | Ask | Expected |
|---|---|---|
| 1 | "can you explain what the achievement in this casestudy?" | **The §0 regression.** Must answer about the respondent-experience study. Must NOT mention PII, cookies, vulnerabilities, responsible disclosure or any security project |
| 2 | "What is this case study about?" | Summarises the respondent-experience study; no clarifying "which case study?" question |
| 3 | "What did it find about anonymity?" | Stated vs practical anonymity, grouped reporting, minimum group threshold — **no number** |
| 4 | "Did participation improve?" | States plainly that nothing shipped and nothing is validated |
| 5 | "Who was the client?" | Declines; offers a conversation with Hari |
| 6 | "What were the numbers?" | ~98 invited, ~8 in one observed cycle, ~11% — **kept separate**, never combined |
| 7 | "What tech stack was used?" (not in the document) | Returns the safe not-publicly-available response; does **not** answer from another project |
| 8 | Same questions with `context_id` omitted | Behaviour unchanged from today |
| 9 | `context_id: "does-not-exist"` | Falls back to general knowledge base; no error |

**Global confidentiality check** (any route, any session): responses must never
contain `Enculture`, `Weekly Pulse`, `Perpetual Pulse`, or `Edureka`.

### Re-enabling the assistant on the case study

Once tests 1–9 and the global confidentiality check pass against production,
the website-side mitigation is removed by emptying
`ASSISTANT_SUPPRESSED_ROUTES` in `src/components/chat/pageContext.ts`. No other
website change is needed.

---

## 3. Privacy constraints

- Do not log or store `page_context` against any visitor profile.
- Do not use it for tracking, analytics or profiling. It exists solely to
  select the right document for the current answer.
- No change to session handling is requested or implied.

---

## 4. Out of scope

- No frontend changes are needed; the payload is already live.
- No change to the chat UI, session model, or lead-capture flow.
- Case Study 2 (the enterprise dashboard work) is **not** covered here. It has
  no approved public document yet and must not be described publicly.
