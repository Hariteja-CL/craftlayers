Based on the comprehensive documentation and the specific "Action Engine" prototype we developed, here are the curated **UX, AI, and Security pointers** for your Dashboard Page.

### **🎨 UX Pointers (The "Agentic" Experience)**

* **System-Initiated Triggers (Ambient Intelligence):** The dashboard does not wait for the user to find a problem. It uses a **"Red Alert Banner"** that automatically appears when a metric (e.g., MET\_ENGAGEMENT) breaches a threshold, shifting the user from passive viewing to active resolution.  
* **Generative UI (GenUI):** instead of a text-based chat interface, the AI renders **Interactive Action Cards** (React components). This allows users to execute complex governance tasks (e.g., "Schedule Audit") with a single click rather than reading a report.  
* **Contextual Scenario Selectors:** The dashboard features a "Mission Brief" dropdown (e.g., *“Scenario: Burnout Crisis”* vs *“Post-Merger”*). Changing this selection instantly recalibrates the data visualization and AI context, framing the data around a specific business challenge.  
* **Role-Based Adaptation:** The UI dynamically adapts its layout and available actions based on the user's role (RBAC). An "Org Admin" sees governance tools, while a "Manager" might only see team-specific insights.  
* **Conversational Refinement:** Users can refine the AI's output using natural language (e.g., *"Make these options budget-friendly"*), which forces a re-render of the UI cards without breaking the visual flow.

### **🧠 AI Pointers (The "Action Engine")**

* **Prescriptive over Descriptive:** The AI strategy moves beyond "What happened?" (Descriptive) to **"What should we do?" (Prescriptive)**. It clusters open-ended feedback into themes and generates ranked interventions.  
* **RAG (Retrieval-Augmented Generation) Context:** The system uses a "Privacy Firewall" architecture where live, aggregated table data is injected into the LLM's system prompt. This ensures the AI "sees" the exact current state of the organization without hallucinating.  
* **Strict "Rule Book" Persona:** The AI operates under a strict "System Prompt" that forbids anthropomorphism (no *"I think"*) and enforces an objective, operational tone (e.g., *"System Signal Detected"*).  
* **Logic Rule Elements:** The dashboard leverages the platform's composable LogicRuleElement architecture to define exactly *when* the AI should be triggered (e.g., Score \< 50), ensuring efficient token usage.

### **🛡️ Security & Governance Pointers**

* **Privacy Firewall (Aggregation):** The system strictly aggregates data to the **Department** or **Tenant** level before sending it to the AI. No individual row-level PII (Personally Identifiable Information) is ever passed to the LLM context window.  
* **Anonymity Thresholds:** The dashboard enforces a "Minimum Response Rule" (e.g., $n \< 5$). If a filtered view (like "Design Dept") has fewer than 5 respondents, the AI and visualizers automatically suppress the data to protect user identity.  
* **Multi-Tenant Isolation:** All queries and AI contexts are strictly scoped by TenantID. This ensures that data from one organization can never "leak" into the insights generated for another, even when using shared models.  
* **Bias Mitigation Guardrails:** The System Prompt includes explicit rules to prevent the AI from making assumptions based on demographics (e.g., Age, Gender) or suggesting inequitable interventions.  
* **RBAC Data Access:** Access to the "Intervention Assistant" is controlled by the platform's Role-Based Access Control. Only users with specific permission bits (e.g., CAN\_VIEW\_SENSITIVE\_INSIGHTS) can trigger the AI analysis.

