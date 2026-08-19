# 2. Feature Architecture, Gemini AI Integration, and Dual Extension Flow

We decided to integrate Google Gemini AI as the primary intelligence provider, employ an interactive visual node graph for project lineage, and implement a dual extension workflow (Quick Resource Action Modal + Deep Inception Studio Wizard) across university, industry, and community challenges.

## Context
Project DNA needs to provide both immediate resource handoff (source code, datasets, blueprints) and structured academic continuation guidance (AI-driven gap analysis, lineage tree, real-world challenge matching).

## Decision
- **AI Model**: Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`) for natural language extraction, DNA card generation, and semantic gap analysis.
- **Lineage Visualization**: Interactive node graph rendering multi-generation ancestor-descendant relationships with interactive inspection.
- **Extension Workflow**: Dual-mode continuation flow:
  1. Quick Resource Modal: Direct access to reusable assets, GitHub repositories, datasets, and alumni/advisor contacts.
  2. Project Inception Studio: Guided wizard importing predecessor DNA, auto-generating extension roadmap, and mapping to real-world challenges.
- **Challenge Scope**: Expanded beyond local community to include university operations, regional industry, and global SDG challenges.
