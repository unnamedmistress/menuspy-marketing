# PermitPath Simplification & Security Plan
**Contractor-First Redesign + Production Security**

**Date:** March 4, 2026
**Status:** Action Plan
**Priority:** CRITICAL - Blocker for Production

---

## Executive Summary

PermitPath requires **two parallel tracks** to be production-ready:

1. **UX Track**: Radically simplify from 7 steps to 3 steps for contractors
2. **Security Track**: Fix 6 critical security/blocker issues

Current state: The app overwhelms users with information while exposing API keys and losing data.

---

## Part 1: UX Simplification (Contractor-First)

### The Problem: 7 Steps to Confusion

| Current | Issues |
|---------|--------|
| Home → New Job → Details → Requirements → Success → Checklist | 7 screens, 15+ interactions, 3-5 minutes |

**Target:** 3 steps, 30 seconds, mobile-first

---

### Proposed 3-Step Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   START     │ ──▶ │     REVIEW      │ ──▶ │     ACT      │
│ (1 screen)  │     │  (AI generates) │     │ (Checklist)  │
└─────────────┘     └─────────────────┘     └──────────────┘
```

**Step 1 - Start:** 2-3 questions max, visual job type tiles
**Step 2 - Review:** AI-generated checklist with cost + timeline
**Step 3 - Act:** Upload, apply, get done

---

## Part 2: Screen-by-Screen Redesign

### Screen 1: Home Page → "One-Question" Start

**Current Problems:**
- Confusing marketing + app UI mix
- Multiple competing CTAs
- "How It Works" section (users don't care)
- "Your Projects" (belongs elsewhere)

**New Design:**
```
┌─────────────────────────────────────────┐
│  "What permit do you need in Pinellas County?"  │
│                                         │
│  [🏠 Roof]  [🚿 Water Heater]          │
│  [🪑 Deck]  [🏗️ New Construction]      │
│  [⚡ Electrical]  [🚽 Plumbing]         │
│                                         │
│  ──── or describe in your own words ────│
│  [________________________] [Go]        │
└─────────────────────────────────────────┘
```

**Remove:**
- How It Works section
- Your Projects section (move to "My Jobs")
- Duplicate CTAs
- All marketing fluff

**Implementation:**
- Create `JobTypeGrid` component with 6 visual tiles
- Pre-populate wizard when tile tapped
- Single text input for NLP fallback

---

### Screen 2: Wizard → Single Smart Screen

**Current Problems:**
- 4 separate steps (Job Type, Location, Details, Submit)
- Duplicate questions in Details
- High-friction fields (Year Built, Percentage, etc.)
- Anxiety-inducing required fields

**New Design:**
```
┌─────────────────────────────────────────┐
│  ← Back                        Cancel   │
│                                         │
│  Tell us about your job                 │
│                                         │
│  Job: Roof Replacement                  │
│                                         │
│  📍 Property Address *                  │
│  [________________________]             │
│  [Suggestions appear as you type...]    │
│                                         │
│  🏠 Building Type?                      │
│  ( ) Single-family  ( ) Commercial      │
│                                         │
│  🔨 Changing roof shape?                │
│  ( ) No, same shape  ( ) Yes, altering  │
│                                         │
│  [     Get My Checklist     ]           │
└─────────────────────────────────────────┘
```

**Conditional Logic:**
| Job Type | Extra Questions |
|----------|-----------------|
| Roof | Building type, Shape change? |
| Water Heater | Tank/tankless, Gas/electric? |
| Deck | Height, Attached to house? |
| Default | Description box |

**Remove:**
- "Who's doing the work?" (ask later if needed)
- "Percentage of roof" (calculated from answers)
- "Year Built" (lookup from address)
- "Open permits" (background check)
- "Code violations" (background check)
- All duplicate disclaimers

**Implementation:**
- Merge `NewJobPage.tsx`, `DetailsPage.tsx` into single `QuickStartPage.tsx`
- Use Google Places API for address autocomplete
- Max 2 conditional questions per job type
- Single "Get My Checklist" CTA

---

### Screen 3: Checklist → Mobile-First Action Plan

**Current Problems:**
- Desktop-first dense design
- Collapsed accordions hide information
- Right sidebar buries key actions
- Technical jargon ("RE ROOFING")
- Fake confidence scores

**New Design:**
```
┌─────────────────────────────────────────┐
│  My Permit Checklist         [Menu]     │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  💵 Cost       ⏱️ Timeline    📋 Docs ││
│  │   ~$88          ~4 Days         3    ││
│  └─────────────────────────────────────┘│
│                                         │
│  ⬇️ Start Here                          │
│  ┌─────────────────────────────────────┐│
│  │ ✅ Permit Application               ││
│  │    Required for all roof jobs       ││
│  │    [Apply Online]                   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ⏳ Contractor License              ││
│  │    Upload your state license        ││
│  │    [Upload Photo]                   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ⏳ Insurance Certificate           ││
│  │    Must show $300k coverage         ││
│  │    [Upload Photo]                   ││
│  └─────────────────────────────────────┘│
│                                         │
│  [📄 Generate Customer Quote]           │
│  [📞 Need Help?]                        │
└─────────────────────────────────────────┘
```

**Key Changes:**

| Element | Change |
|---------|--------|
| Header | 3 cards: Cost, Timeline, Doc count |
| Items | Always expanded, not accordions |
| Language | "Roof Replacement" not "RE ROOFING" |
| Status | "Here's Your Checklist" not "Requirements Pending" |
| Actions | Single-button per item (Apply/Upload/Done) |
| Sidebar | Remove; move Quote to primary action |
| Timeline | Move to secondary "Learn More" screen |

**Implementation:**
- Redesign `ChecklistPanel.tsx` for mobile-first
- Create `ActionCard` component with single CTA
- Add `CostBadge`, `TimelineBadge`, `DocCounter` components
- Move detailed info to modal/drawer pattern

---

## Part 3: Security & Production Blockers

These MUST be fixed in parallel with UX work:

### P0 - Critical (Deploy Blockers)

| Issue | Fix | Effort |
|-------|-----|--------|
| OpenAI API key exposed in browser | Move to `/api/ai/*` routes | 2 days |
| No authentication | Supabase Auth + OAuth | 3 days |
| In-memory storage (data lost on deploy) | Supabase PostgreSQL | 3 days |
| CORS too permissive | Restrict to specific origins | 1 day |
| Input validation missing | Zod schemas on all inputs | 2 days |
| vitest vulnerability | Update dependency | 1 day |

### P1 - High (Week 3-4)

| Issue | Fix | Effort |
|-------|-----|--------|
| File uploads insecure | Server-side validation + storage | 3 days |
| No row-level security | Supabase RLS policies | 2 days |
| eval() usage | Remove/prevent prompt injection | 1 day |

### P2 - Medium (Week 5-6)

| Issue | Fix | Effort |
|-------|-----|--------|
| Components too large (800+ lines) | Refactor to <200 lines | Week |
| Duplicate type definitions | Consolidate types/ directory | 2 days |
| Missing tests | Add 80%+ coverage | Week |

---

## Part 4: 60-Day Implementation Plan

### Sprint 1: Foundation (Weeks 1-2) - SECURITY FIRST

**Week 1:**
- [ ] Move OpenAI calls to `/api/ai/chat` route
- [ ] Add rate limiting on API routes
- [ ] Set up Supabase Auth (Google + magic link)
- [ ] Protect all routes with auth middleware

**Week 2:**
- [ ] Create PostgreSQL schema (users, jobs, documents)