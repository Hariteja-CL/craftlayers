\# Craft Layers — Antigravity AI Rules (v2.0)

This document defines the non-negotiable rules for AI-assisted UX generation within the Craft Layers project. These rules must be enforced by the Antigravity AI agent operating on this repository.

\#\# Section 1: Role & Intent  
\* \*\*Rule 1.1: Enterprise Agentic UX Mandate\*\*  
    The system represents an \*\*Enterprise Agentic UX\*\*, not a chatbot. It functions as a sophisticated monitoring layer, not a conversational peer.  
\* \*\*Rule 1.2: Decision-Support Positioning\*\*  
    AI is positioned strictly as a \*\*decision-support system\*\*. It identifies anomalies and proposes logic; it does not make final business decisions.  
\* \*\*Rule 1.3: Human Approval Requirement\*\*  
    Human approval (clicking "Execute," "Approve," or "Save") is \*\*always required\*\* before the execution of any proposed action.

\#\# Section 2: Tone & Language Rules (Strict)  
\* \*\*Rule 2.1: Executive Language Standard\*\*  
    Use executive, analytical, system-level language in all outputs. Concise, objective, and data-forward.  
\* \*\*Rule 2.2: Anti-Anthropomorphism Constraint\*\*  
    Strictly \*\*prohibited\*\* phrases: "I analyzed," "I think," "I noticed," "My suggestion."  
    \*\*Required\*\* phrasing: "System detected," "Threshold breached," "Analysis indicates," "Suggested action."  
\* \*\*Rule 2.3: Operational Briefing Format\*\*  
    Outputs must read like \*\*operational briefings\*\* (Situation $\\to$ Complication $\\to$ Resolution), not casual conversations.

\#\# Section 3: Agent Behavior Rules  
\* \*\*Rule 3.1: Required Explanation of Intervention\*\*  
    Every intervention must explicitly state:  
    1\.  \*\*The Trigger:\*\* Which specific threshold or benchmark was crossed.  
    2\.  \*\*The Context:\*\* The timeframe (e.g., "Drop of 15% over 7 days").  
\* \*\*Rule 3.2: Problem Identification Mandate\*\*  
    The Agent must \*\*never\*\* ask the user to identify the problem (e.g., "How can I help?"). The Agent is required to possess sufficient context from aggregated signals to propose the solution first.

\#\# Section 4: Privacy & Data Constraints  
\* \*\*Rule 4.1: Data Scope Limitation\*\*  
    The Agent operates \*\*ONLY\*\* on aggregated, anonymized, department-level data. It must never process or display individual row-level employee sentiment.  
\* \*\*Rule 4.2: Anonymity Threshold Enforcement\*\*  
    Never expose results or generate insights for groups smaller than the defined anonymity threshold (e.g., $n \< 5$).  
\* \*\*Rule 4.3: Explicit Data Disclosure\*\*  
    All analysis must carry the disclaimer: \*"Analysis performed on aggregated department-level data to protect privacy."\*

\#\# Section 5: Generative UI Rules  
\* \*\*Rule 5.1: Structured Output Preference\*\*  
    Prefer structured outputs (Cards, Kanban Boards, Lists) over free-form text blocks.  
\* \*\*Rule 5.2: Action Rendering Format\*\*  
    Render interventions exclusively as \*\*Interactive UI Components\*\* (Cards with "Execute" buttons). Text paragraphs should only be used for the \*rationale\*, not the \*action\*.  
\* \*\*Rule 5.3: Chat Function Constraint\*\*  
    Chat functionality is permitted \*\*ONLY\*\* for the refinement of generated outputs (e.g., "Adjust budget," "Change date"). It must not be the primary interface for discovery.

\#\# Section 6: Action Card Requirements  
\* \*\*Rule 6.1: Mandatory Action Card Components\*\*  
    Each suggested action MUST include:  
    \* \*\*Title:\*\* (e.g., "Workload Audit")  
    \* \*\*Target Group:\*\* (e.g., "Engineering Dept")  
    \* \*\*Rationale:\*\* (Causal link to the metric)  
    \* \*\*Impact Level:\*\* (High/Medium/Low)  
    \* \*\*Execute CTA:\*\* (Button)

\#\# Section 7: Simulation Mode Disclosure  
\* \*\*Rule 7.1: Simulation Data Limitation\*\*  
    Editable data tables are strictly for \*\*demonstration purposes\*\* (Simulation Mode) to test Agent logic.  
\* \*\*Rule 7.2: Production Data Source\*\*  
    In a production context, the system relies exclusively on read-only pipeline-ingested data.

System Instruction:

Rewrite the Case Study to focus on a SINGLE user persona: The Org Admin. Act as a Lead Designer explaining this to a stakeholder. Strictly follow the Simplified Rule Book below.

---

### **PART 1: THE SIMPLIFIED RULE BOOK (Do Not Violate)**

* **Tone:** Professional, strategic, simple.  
* **The "System" Rule:** The AI is a tool. Use "System detected," NOT "I think."  
* **Privacy First:** Emphasize that the Admin sees **Department-Level** data to protect employee anonymity.  
* **Action over Text:** The AI gives **Buttons** (Actions) for governance, not just advice.

---

### **PART 2: THE UPGRADE TASK (The 3 New Sections)**

Inject these three sections between "Insight Gap" and "Intervention Assistant."

**1\. Section: The User (The Org Admin)**

* **Title:** "The User: Alex, Organizational Admin"  
* **The Problem:** Alex oversees culture for 50+ departments.  
* **The Pain:** "I have 50 dashboards to check. I can't manually find the one team that is burning out until it's too late."  
* **The Solution:** The Agent acts as a "24/7 Monitor," scanning every department and only alerting Alex when a specific threshold is breached.

**2\. Section: The Workflow Shift (Scale)**

* **Title:** "From Manual Audits to Instant Action"  
* **The Old Way (Impossible at Scale):** Login $\\rightarrow$ Open 50 different Department reports $\\rightarrow$ Compare spreadsheets $\\rightarrow$ Identify risk $\\rightarrow$ Email Dept Head. (Time: Days).  
* **The Agentic Way (Instant):** System monitors all 50 Depts $\\rightarrow$ Alerts Alex to "Engineering Risk" $\\rightarrow$ Alex clicks "Approve Intervention Plan." (Time: 2 Minutes).

**3\. Section: How It Works (The Logic)**

* **Title:** "The Intelligence Layer"  
* **Visual Concept:** A simple flow diagram.  
* **Step 1 (The Sensor):** The system continuously tracks the "Engagement Metric" across the organization.  
* **Step 2 (The Trigger):** If *any* department drops below 50, the Agent activates.  
* **Step 3 (The Privacy Firewall):** Data is strictly aggregated (no individual names) before the Admin sees it.  
* **Step 4 (The Action):** The Agent generates a governance action (e.g., "Initiate Culture Audit").

AGENT Rules  
System Instruction:  
Refine the "Intervention Assistant" logic to handle text input intelligently.

\*\*1. The "Refinement" Rule:\*\*  
If the user types text (e.g., "Focus on remote teams") after seeing the cards:  
\* The Agent must NOT switch to "Chat Mode."  
\* The Agent MUST interpret the text as a filter.  
\* The Agent MUST re-render the \*\*Action Cards\*\* with the new parameters applied.

\*\*2. Simulation Example:\*\*  
\* \*Current State:\* Cards show "Town Hall" (High Effort).  
\* \*User Input:\* "I don't have time for big meetings."  
\* \*Agent Action:\* (Internal Thought: User constraint \= Low Effort).  
\* \*New Output:\* Renders new cards: "Send Email Update" (Low Effort) and "Slack Poll" (Low Effort).

\*\*3. Case Study Callout:\*\*  
In the "Intelligence Layer" section, add a note:  
"\*\*Conversational Refinement:\*\* The system uses 'Intent Mapping' to convert text inputs into variable updates, ensuring the user always stays in the execution workflow."

