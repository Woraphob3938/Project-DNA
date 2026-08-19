# 1. Supabase and Next.js Architecture for Project DNA

We decided to build Project DNA using Next.js (App Router, React, Tailwind CSS, TypeScript) paired with Supabase as the backend database and authentication service, augmented by an AI Hybrid engine (Gemini/OpenAI with fallback seed dataset).

## Context
Project DNA needs to support interactive project discovery, DNA Card structured metadata, project lineage graphs, and AI-driven gap analysis for the SDGs Hackathon. The platform requires high visual fidelity matching the yellow-accented dashboard design, fast prototyping, and reliable demo capabilities.

## Decision
- **Frontend & Fullstack Framework**: Next.js (App Router) with TypeScript and Tailwind CSS.
- **Backend & Database**: Supabase (PostgreSQL with relational schema for Projects, Lineages, Challenges, and SDG Tags).
- **AI Integration**: Hybrid engine connecting to Google Gemini / OpenAI for real-time natural language query expansion and gap extraction, with bundled local seed datasets for fault-tolerant demonstrations.
