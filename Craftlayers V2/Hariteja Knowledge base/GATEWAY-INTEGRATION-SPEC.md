# Chat Gateway — Integration Spec

**Audience:** whoever maintains the chat gateway service (`VITE_B_GATEWAY_URL`).
**Status:** the website side is already deployed on the case-study branch. The
two changes below are **server-side only** and are required before the feature
works end to end.

There are two independent workstreams here. **Item 1 is a live confidentiality
issue and should be fixed first, regardless of whether Item 2 is ever built.**

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

### Required behaviour

1. When `page_context` is present, resolve `context_id` to the matching
   approved document and give that document **priority** when answering.
2. When absent, behave exactly as today (general knowledge base).
3. When `context_id` is unknown, fall back to the general knowledge base.
   Do **not** error, and do **not** guess a different case study.

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

From a clean session, on `/work/respondent-experience`:

| Ask | Expected |
|---|---|
| "What is this case study about?" | Summarises the respondent-experience study; no clarifying "which case study?" question |
| "What did it find about anonymity?" | Stated vs practical anonymity, grouped reporting, minimum group threshold — no number |
| "Did participation improve?" | Clearly states nothing shipped and nothing is validated |
| "Who was the client?" | Declines, offers an interview conversation |
| "What were the numbers?" | ~98 invited, ~8 in one cycle, ~11% — kept separate |

And from `/` (no `page_context`): behaviour unchanged from today.

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
