# Enculture Case Study & Dashboard Rules
> "**Rule Book v2.0 (Enterprise Agentic UX)**"

This document defines the specific design and interaction rules for the **Proactive Culture Dashboard**, which serves as the interactive prototype for the Enculture Case Study. These rules extend the base [CraftLayers Theme](./CraftLayers%20theme%20rule%20book.md).

## 1. Dashboard & Data Visualization
- **Sentiment Heat Map**:
    - **High (>75%)**: Green/Teal.
    - **Neutral (50-75%)**: Indigo/Primary.
    - **Low (<50%)**: Red/Critical (Strict Enforcement).
- **Critical Actions**:
    - Critical alerts (Low Sentiment) must use a **Small Action Card** pattern (Toast style, bottom-right).
    - **Do NOT** use large top banners for critical alerts.
    - The sentiment value font size in charts must be prominent (`text-5xl` minimum).

## 2. Agentic Interactions (Zero Chat Mode)
- **Tool Calling**: The AI should not reply with conversational text. It must "call a tool" to render a UI widget.
- **Intervention Plan**:
    - Must be presented as a structured set of cards/tasks.
    - Actions must be "One-Click Executable".

## 3. Visual Consistency
- **Hotspots/Beacons**:
    - Must be positioned **beside** headers or elements, never overlapping text.
    - Style: 32px pulsing circle, Indigo or Red (context-dependent).
- **Widgets**:
    - Adhere to the "Glassmorphism" depth of the main theme but use stricter borders/shadows for "Enterprise" feel.
