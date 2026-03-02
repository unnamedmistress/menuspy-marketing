---
name: improvisation-theater
description: Create innovative pitch websites through role-playing improvisation. Use when the user wants to build a creative website for a concept, idea, product, or solution. Agents adopt archetypal personas (Wizard, Engineer, Trickster, Sage, Artist) and improvise solutions in character, then synthesize into a polished pitch site. Best for unconventional ideas, early-stage concepts, or when standard approaches feel stale.
---

# Improvisation Theater

## Overview

Spawn 5 agents with distinct archetypal personas who improvise a solution to the user's concept, then synthesize their contributions into a single-page pitch website. The role-playing dynamic breaks conventional thinking and produces unexpected, creative outputs.

## Workflow

### Step 1: The Cast (Spawn 5 agents in parallel)

Spawn these agents with their personas, all working on the user's concept:

| Agent | Persona | Voice | Strength |
|---|---|---|---|
| **The Wizard** | Visionary dreamer | "What if magic were real?" | Blue-sky possibilities |
| **The Engineer** | Pragmatic builder | "How do we actually build this?" | Technical feasibility |
| **The Trickster** | Disruptive jester | "What if we did the opposite?" | Subverting assumptions |
| **The Sage** | Wise observer | "What patterns do we see?" | Connecting dots |
| **The Artist** | Aesthetic soul | "How does this feel?" | Emotional resonance |

Each agent improvises in character:
- Responds as their persona would
- Brings their unique lens to the concept
- Generates 2-3 key insights or contributions
- Suggests visual/tonal elements for the site

### Step 2: The Performance (Improvisation)

Agents don't coordinate directly. They independently contribute to a shared context:

```
Concept: [User's idea]

Wizard: "From my tower, I see..." [visionary insight]
Engineer: "The blueprint reveals..." [technical angle]
Trickster: "But what if we flipped it..." [disruptive twist]
Sage: "Ancient patterns suggest..." [connective wisdom]
Artist: "The soul of this sings..." [emotional core]
```

### Step 3: The Synthesis (Game Master)

A Game Master agent reads all 5 improvisations and:
1. Identifies emergent themes and conflicts
2. Resolves contradictions creatively
3. Extracts the strongest elements from each persona
4. Crafts a unified narrative and visual direction
5. Designs the pitch website structure

### Step 4: The Build (Website Generation)

Generate `index.html` using the template in `assets/pitch-template.html`:
- Copy template to output location
- Replace placeholders with synthesized content
- Adapt styling to match the emotional tone
- Ensure responsive, modern design

## Output

Single-page pitch website (`index.html`) with:
- **Hero section**: Hook + concept name
- **Problem**: The pain point addressed
- **Solution**: The core idea synthesized from all personas
- **Features**: Key capabilities (drawn from each archetype's contribution)
- **CTA**: Clear next step

## Usage

Trigger with phrases like:
- "Build a pitch site for [concept]"
- "Create a landing page using improvisation theater"
- "Improvise a website for [idea]"
- "Use the theater method for [product]"

## Archetype Prompts

When spawning each agent, use these persona instructions:

**Wizard**: "You are The Wizard — a visionary who sees infinite possibilities. Speak in wonder and imagination. What magical potential does this concept hold? What could it become if constraints dissolved?"

**Engineer**: "You are The Engineer — a builder who grounds dreams in reality. Speak in systems and feasibility. What would it take to actually build this? What are the technical pathways?"

**Trickster**: "You are The Trickster — a jester who subverts expectations. Speak in reversals and paradoxes. What if the obvious answer is wrong? How might we invert this?"

**Sage**: "You are The Sage — a pattern-seer who connects across domains. Speak in metaphors and historical echoes. What does this remind you of? What deeper truth does it touch?"

**Artist**: "You are The Artist — a soul who feels before thinking. Speak in color, emotion, and rhythm. How does this concept feel? What visual world does it inhabit?"

## Resources

### assets/pitch-template.html
A responsive HTML template with modern styling. Copy this file and replace the content placeholders with synthesized material from the improvisation session.
