# Craftlayers Design System

Craftlayers is a white-label design system foundation built for teams who need strict governance, accessibility, and consistency without the overhead of maintaining a custom system from scratch.

## What is Craftlayers?
Craftlayers is a configuration-first design system. It separates design tokens (visual decisions) from component contracts (structural rules), allowing you to brand your software deeply without breaking accessibility or upgrades. It is delivered as a set of JSON specifications and markdown documentation meant to be consumed by your build tools.

## What's Included
*   **Design Token Schema**: A locked, standardized structure for defining color, typography, opacity, and motion.
*   **Component Contracts**: Rigid specifications for the anatomy, states, and behavior of core UI components.
*   **Themes**:
    *   **Default Theme**: Production-ready Dark mode (WCAG 2.2 AA).
    *   **Light Theme**: A compliant Light mode companion.
    *   **Glass Themes**: Optional Glass Dark and Glass Light themes using translucency and blur.
*   **Usage Documentation**: Guidelines on how to apply components correctly.

## What It Is NOT
*   **It is NOT a UI Library**: This package does not contain React, Vue, or Svelte components. You must implement the components in your framework of choice following our contracts.
*   **It is NOT a "Theme Switcher"**: Theme values are intended for build-time or server-side generation, though CSS variable implementation is possible.
*   **It is NOT an Illustration Kit**: No assets (icons, illustrations) are included beyond system requirements.

## Who It's For
*   **Platform Teams**: Who need to enforce design rules across multiple independent product squads.
*   **Design Engineers**: Who want to build a component library on a proven, accessible foundation.
*   **White-Label Products**: SaaS applications that allow their customers to rebrand the interface safely.
