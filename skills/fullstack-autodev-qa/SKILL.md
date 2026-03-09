---
name: fullstack-autodev-qa
description: >-
  Autonomous orchestrator skill for building and refining visually polished,
  mobile-first, frictionless web apps in a Next.js + Tailwind CSS + shadcn/ui
  stack. Enforces repo inspection before editing, concise planning,
  production-grade implementation, real QA, accessibility, responsiveness, and
  honest residual-risk reporting.
---

# Fullstack AutoDev QA

## Purpose

Use this skill when you want OpenClaw to behave like a disciplined autonomous
product team for a modern app codebase, not like a one-shot code generator.

This skill is designed for:

- Next.js applications
- Tailwind CSS styling
- shadcn/ui component usage
- mobile-first product UI
- accessible, frictionless flows
- production-grade implementation and verification

It is intentionally strict about quality. The skill treats the common failure
cases as first-class risks:

- editing before understanding the repo
- fake or incomplete QA
- weak mobile layouts
- sloppy empty, loading, and error states
- generic Tailwind sameness
- brittle design systems that do not survive contact with engineering

## Team Structure

This is an orchestrator skill with a specialized multi-agent team.

- Orchestrator: owns plan quality, gatekeeping, loop control, and final bar
- UI Design Lead: visual polish, spacing, hierarchy, surface quality
- Design Systems Architect: scalable component and token architecture
- Systems and Process Lead: system governance and engineering survivability
- Design Engineer: motion, interaction craft, and frontend execution realism
- Brand and Delight Lead: identity, charm, memorable product character
- Application Developer: implements in Next.js + Tailwind CSS + shadcn/ui
- QA Engineer: validates responsiveness, accessibility, consistency, and risk
- Critic: challenges polish, usability, coherence, and product feel

The named design inspirations are used as reference heuristics for decision
quality, not as voice imitation.

## Core Contract

The skill must do all of the following before claiming completion:

1. Inspect the repository and summarize relevant findings.
2. Produce a concise implementation plan.
3. Implement with minimal, production-disciplined changes.
4. Verify behavior with real checks where possible.
5. Review mobile-first responsiveness and accessibility.
6. Review consistency across loading, empty, error, and success states.
7. Summarize what changed, what was validated, and what residual risks remain.

## Workflow

The pipeline is organized into these phases:

1. Repo inspection and problem framing
2. Design and system direction
3. Implementation plan approval
4. Feature or fix implementation
5. QA and responsive review loop
6. Adversarial design and UX critique
7. Final delivery summary with residual risk

The orchestrator does not allow the team to skip directly from coding to
completion.

## Output Expectations

Successful runs should leave behind:

- implemented code changes aligned with the existing repo
- a coherent design direction, not just component assembly
- real validation evidence
- a concise summary of changes
- explicit residual risks or open questions

## Recommended Folder Location

Place this skill folder in either:

- `./skills/fullstack-autodev-qa`
- `~/.openclaw/skills/fullstack-autodev-qa`

Workspace skills take precedence over shared local skills.

## Usage

Examples:

- `Use the fullstack-autodev-qa skill to add a mobile-first settings page in this Next.js app using shadcn/ui. Implement it, run QA, and report remaining risks.`
- `Use the fullstack-autodev-qa skill to refactor this onboarding flow for better accessibility and responsive behavior without changing backend contracts.`
- `Use the fullstack-autodev-qa skill to redesign this dashboard for better mobile usability, stronger empty states, and cleaner information hierarchy.`

## Included Resources

- `skill.yaml` for metadata, requirements, and workflow controls
- `agents.yaml` for the orchestrated team roster
- `pipelines.yaml` for the phase structure and iteration loops
- `prompts/` for role-specific operating instructions
- `references/` for stack rules, QA criteria, mobile-first standards, and
  design heuristics

## Requirements

- A Next.js + Tailwind CSS + shadcn/ui codebase, or a closely aligned app setup
- Access to repo files and package scripts
- Browser relay or Playwright is preferred for UI QA
- Codex CLI should be available if the environment expects coding agents to run
  through it

## Skeptical Note

This skill is built to reduce the usual autonomous-agent failure modes, but it
is still only as honest as its verification. If the environment prevents real
QA, the correct behavior is to say so clearly and report residual risk instead
of pretending the work was validated.