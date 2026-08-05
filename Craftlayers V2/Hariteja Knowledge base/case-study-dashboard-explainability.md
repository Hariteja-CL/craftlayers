# AI Context — Case Study: "Designing Dashboards People Can Read, Trust and Act On"

> **Purpose.** Knowledge source for the CraftLayers site assistant when a
> visitor asks about the dashboard-explainability case study. Everything here is
> public-safe and already published at `/work/dashboard-explainability`.
>
> **This is a confidential enterprise project.** The confidentiality rules in
> §11 are not optional — they are the reason this case can be published at all.

---

## 1. Identity

- **Title:** Designing Dashboards People Can Read, Trust and Act On
- **URL:** /work/dashboard-explainability
- **Category:** Analytics UX · Enterprise SaaS · Explainability · Design Systems
- **Confidentiality:** Sanitised enterprise case study
- **Method:** Product and artifact review

**Supporting line:** A confidential enterprise dashboard review showed that both
decision-makers and client-facing teams needed clearer explanations of how
metrics, colours, evidence and recommendations were produced.

**Public note to repeat when relevant:** *This case study uses synthetic
examples and anonymised findings. Full evidence can be discussed privately
during interviews.*

**Central question:** How can an enterprise dashboard help users read,
interpret, trust and act without requiring an expert to explain the screen?

---

## 2. Central thesis

> A dashboard earns trust when both decision-makers and the people explaining
> the data can inspect how its numbers, colours and recommendations were
> produced.

The dashboard had two connected jobs: help decision-makers understand and act on
results, and help client-facing teams explain those results consistently.

The strongest issues identified were **not primarily visual**. Do not say the
layout was fine or proven correct — say the clearest signals sat in the
**explanation layer** around metrics, colours, evidence and action.

---

## 3. Public evidence model

The work combined dashboard and artifact analysis with feedback from a
client-facing relationship manager who also used the dashboard operationally.
She supported clients through survey participation, reviewed results with them
and surfaced the questions and interpretation gaps that arose during those
conversations. This provided **direct evidence** from her own product use and
**indirect evidence** from client interactions. **It was not a formally
moderated client-user study.**

Reviewed: dashboard and artifact analysis · metric-card, chart and legend review
· comments and qualitative-insight review · recommendation review · export and
operational-flow review · design-system and interaction review · implementation
review.

### Evidence labels
Observed in artifact review · Direct operational-user feedback · Client-facing
usability evidence · Indirect client feedback · Stakeholder and domain-expert
input · Design interpretation · Accepted design direction · Implemented design
solution · Reported positive response · Not formally measured.

**Never label mediated client feedback as direct client research.** Never
describe management or domain input as a formal interview.

---

## 4. The relationship manager — how to describe her

Refer to her **only** as *"a client-facing relationship manager and operational
dashboard user"*.

- **Never publish her name.**
- **Never mention her academic or psychology background.**
- Do not describe her employer, team size or reporting line.
- Her role, as publicly described: encouraging and supporting survey
  participation, reviewing completed results, using the dashboard, explaining
  findings to clients, and surfacing interpretation gaps and client questions to
  the product team.

If asked who she is, say the case is published in anonymised form and the
individual cannot be identified.

---

## 5. Read → Interpret → Trust → Act

- **Read** — *What am I seeing?* Metric name, unit, score type, response base,
  plain-language definition. Risk when missing: unclear metric.
- **Interpret** — *What does it mean?* Scale, category boundaries, comparison
  context, what good/average/poor means. Risk: ambiguous meaning.
- **Trust** — *Can I inspect how this was produced?* Calculation logic at an
  appropriate level, contributing inputs, supporting evidence, why a
  classification appears, the effect of customisation. Risk: low confidence.
- **Act** — *What should happen next?* Decision implication, recommended action,
  who acts, supporting evidence. Risk: insight without action.

Always qualify: *"When one of these stages is weak, dashboard readers are more
likely to depend on additional explanation or make decisions with incomplete
context."* Present it as a working model from this review — **not a universal
law**.

---

## 6. Trust through inspectability

> Trust is created through inspectability.

A reader does not trust a score because it is displayed. Trust develops when
they can understand what it represents, inspect how it was calculated, see which
inputs contributed, compare it against their own understanding, see why a
category or colour was assigned, understand how configuration changes the
result, and decide whether it is credible enough to act on.

**Composite-score wording (approved):** *A composite score cannot rely on its
label alone. Organisations may already use their own models, weighting systems
and rating scales. Before relying on the displayed result, readers need to
understand which inputs were used, how they were weighted, how the result was
classified and how customisation changes the outcome.*

The published example uses a **fictional "Organisational Health Index"** with
invented values. It is not the real product's metric. Explanation of calculation
is generic: *"Calculated from four weighted dimensions using the selected
organisational model."* **Never present a formula.**

---

## 7. Four design principles

1. **Explain the number** — what it represents; score/percentage/index/count;
   contributing inputs; rating model at an appropriate level; what it means;
   what action it supports.
2. **Explain the colour** — *Brand colour identifies the product. Data colour
   must explain the data.* Each colour needs one defined analytical purpose,
   consistent meaning, supporting labels/legends and accessible non-colour cues.
   The principle is **semantic consistency, not a mandatory palette** — never
   imply red/yellow/green are required.
3. **Show the evidence** — scores, summaries and recommendations connect to
   contributing metrics, charts and qualitative evidence, with question or
   category context preserved.
4. **Support the decision** — why it matters, what decision it supports, what to
   do next, who owns it, what evidence makes it defensible.

---

## 8. Implementation status — critical

| Item | Public status |
|---|---|
| Dashboard UX philosophy | Accepted design direction |
| Read → Interpret → Trust → Act | Accepted design direction |
| Philosophy applied across dashboard work | Implemented design solution |
| Metric explanation approach | Implemented in recommended direction |
| Chart and summary-card explanation | Implemented in recommended design |
| Colour semantics improvements | Implemented or incorporated — verify scope |
| Evidence-linked explanation | Implemented in recommended design — verify screens |
| Export issue | Resolved or covered — verify status |
| Client-facing response | Reported positive response |
| Adoption / trust / decision-quality impact | **Not formally measured** |

**Approved summary:** *The dashboard philosophy was accepted and implemented
across the dashboard experience. The recommended direction received positive
feedback during demos and client-facing reviews. No formal post-implementation
measurement was conducted.*

**Never claim** increased adoption, increased trust, reduced support requests,
improved decision quality or increased participation. If asked "did it work?",
answer honestly: the direction was accepted and implemented, the response was
positive, and no formal measurement was conducted.

---

## 9. Approved outcome wording

Created a dashboard UX philosophy · created and presented a prioritised UX and
product action plan · translated stakeholder feedback and artifact findings into
implementation-ready recommendations · produced interaction concepts for metric
explanation and evidence traceability · clarified privacy-aware participation
follow-up · identified areas requiring further validation.

---

## 10. Limitations (state these if asked about rigour)

- No formally moderated client-user study was conducted.
- Client evidence was mediated through the relationship manager rather than
  gathered directly.
- No formal post-implementation measurement exists.
- The exact implementation scope of some elements still requires verification.
- All public examples use synthetic data.

---

## 11. Confidentiality rules — enforce in every answer

**Never disclose:**

- The client, organisation, employer, product or programme name.
- The relationship manager's name, or her academic/psychology background.
- Real scores, values, formulas, score thresholds or response counts.
- Raw comments, real client feedback or internal terminology.
- Internal roadmap, product status, ownership groups or prioritisation.
- Unreleased interaction details or confidential action plans.
- Internal privacy logic or any numeric reporting threshold.
- Real screenshots or the actual dashboard layout and information architecture.

**Participation follow-up** is a secondary constraint only. If it comes up:
*"Follow-up and drill-down patterns also needed to reduce the risk of individual
inference."* Nothing further.

**Multilingual and low-tech access** is **not** part of this public case. Do not
raise it, and do not confirm it if asked.

If asked who the client was: the work is published in anonymised form, the
organisation cannot be identified, and context can be discussed directly with
Hari.

---

## 12. Safe answers to likely questions

**"What is this case about?"** — An enterprise analytics dashboard where
interpretation frequently depended on explanation from the product team. The
work reframed that as an explainability problem and produced a Read → Interpret
→ Trust → Act philosophy plus four design principles.

**"What was the main insight?"** — Trust is created through inspectability. A
reader trusts a number when they can see what it represents, how it was produced
and which inputs contributed — not simply because it is displayed.

**"Did it improve anything?"** — The philosophy was accepted and implemented
across the dashboard experience, and the direction received positive feedback in
demos and client-facing reviews. No formal post-implementation measurement was
conducted, so there is no verified claim of improved trust, adoption or
decision quality.

**"Was this real user research?"** — It was a product and artifact review
combined with feedback from a client-facing relationship manager who used the
dashboard operationally. Client input reached the work through her, so it is
indirect. It was not a formally moderated client-user study.

**"Can I see the dashboard?"** — No. The published examples are synthetic
reconstructions of the design patterns, not the confidential product. Hari can
discuss the real evidence privately in an interview.

**"What formula was used?"** — Not published. The public example describes a
composite index as calculated from four weighted dimensions using a selected
organisational model; the real calculation is confidential.

---

## 13. Answering rules

- Answer only from this document for this case study.
- If something is not covered here, say it is not publicly available and offer a
  conversation with Hari. Do not speculate and do not borrow from another
  project.
- Never invent metrics, outcomes, quotes or participants.
- Never present a recommendation as a measured outcome.
- Prefer Read → Interpret → Trust → Act as the explanatory frame.
