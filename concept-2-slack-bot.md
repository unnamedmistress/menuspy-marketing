# Concept 2: The "Competitive Intel" Slack Bot

## Overview
A **Slack bot** that delivers competitor price alerts directly to team channels where restaurant ops teams already work.

## Problem Insight
Restaurant ops teams live in Slack/Teams. Checking another dashboard is friction. Alerts need to reach decision-makers where they work.

## Core Solution
`@menuspy track [Competitor Name]` → bot posts updates to channel automatically.

## Target Users
- Primary: Multi-location ops teams using Slack
- Secondary: Franchise groups with distributed managers
- Tertiary: Restaurant consulting firms

## Delivery Model

### Web Flow
1. Bot installation via OAuth → `/menuspy` command available
2. First use: Type `/menuspy track [restaurant name]`
3. Bot responds: "Tracking Burger King (5 locations). Weekly updates posted here."
4. Alert format: 🚨 "Burger King dropped Whopper price $0.50 (8%)"

### Key Commands
- `/menuspy track [name]` — start tracking
- `/menuspy report` — on-demand PDF summary
- `/menuspy compare` — side-by-side comparison
- DM support for private tracking

## Pitch Site Structure

**Hero**:
- Headline: "Your competitors just changed prices. You heard it in Slack first."
- Visual: Slack message with competitor alert

**Sections**:
1. 3-Step Integration
2. Sample Alerts
3. Team Collaboration Features
4. Security & Privacy
5. Pricing (free tier: 3 competitors)

## Visual Design

**Hero Image Prompt**:
> "A Slack interface screenshot showing a competitor price alert from MenuSpy bot, with a burger emoji and price drop notification. Clean UI, modern Slack aesthetic."

## Implementation Notes
- Requires Slack OAuth app development
- Rate limiting for API calls
- Start with Slack, expand to Microsoft Teams

## Strategic Value
- Workflow integration beats standalone dashboards
- "Land and expand" viral loop within organizations
- Higher activation rates through channel presence
- Reduces email notification fatigue

---
*Part of Inventive Lab Analysis for MenuSpy.ai*
