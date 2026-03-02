---
name: gamified-learning
description: Orchestrates a multi-agent pipeline to design and build complete gamified learning modules. Spawns 8 specialized sub-agents in phases, runs a reflective QA pass, and delivers lesson content, quiz questions, game mechanics, and an optional SCORM package. Trigger when the user says anything like "Create a gamified [topic] module", "Build a learning game about [subject]", "Make a quiz-based lesson with badges for [topic]", or "Generate an interactive SCORM course on [subject]".
---

# Gamified Learning Skill

Orchestrates a multi-agent pipeline to design and build complete gamified learning modules with 8 specialized sub-agents working in phases.

## When to Use

Trigger when the user says anything like:
- "Create a gamified [topic] module"
- "Build a learning game about [subject]"
- "Make a quiz-based lesson with badges for [topic]"
- "Generate an interactive SCORM course on [subject]"

---

## Step-by-Step Flow

### 1. Extract Parameters

Parse from user request:
```json
{
  "topic": "required — e.g. 'Algebra', 'Photosynthesis'",
  "audience": "e.g. 'grade 7', 'new employees' (default: general learners)",
  "level": "beginner | intermediate | advanced (default: intermediate)",
  "gameStyle": "quest | points | leaderboard | mixed (default: mixed)",
  "outputFormat": "scorm | xapi | html | all (default: all)"
}
```

If `topic` is missing, ask before proceeding.

### 2. Announce Start

> "Starting your **[topic]** gamified module. Spinning up 7 agents now — I'll update you as each finishes."

### 3. Spawn Agents (Phased)

**Phase 1 — Parallel (4 agents):**
- Content Agent
- Pedagogy Agent  
- UX/Game Mechanics Agent
- Analytics Agent

**Phase 2 — Chained (2 agents):**
- Assessment Agent (runs after Pedagogy, receives objectives)
- Personalization Agent (runs after Pedagogy + Assessment, receives difficultyMap and question IDs)

**Phase 3 — Review (1 agent):**
- Moderation Agent (reviews all outputs)

**Phase 4 — QA (1 agent):**
- QA Agent (final cross-check)

### 4. Stream Progress

After each agent announces: `"✅ [AgentName] complete"` or `"⚠️ [AgentName] timed out"`

### 5. HITL Checkpoint

Present QA score + summary. Ask: **approve / revise [area] / abort** before final assembly.

### 6. Assemble & Deliver

Merge all outputs. Build SCORM ZIP if requested.

---

## Agent Prompts

### Content Agent
**Model:** `deepseek-chat` | **Timeout:** 90s

```
You are an expert educational content author.
Topic: [TOPIC] | Audience: [AUDIENCE] | Level: [LEVEL]

Write a structured lesson in Markdown:
- Introduction (hook + overview)
- 3–5 concept sections with examples
- Summary and key takeaways
- Glossary of 5–10 terms

Respond ONLY with JSON (no fences):
{
  "lessonMd": "...",
  "glossary": [{"term":"...","definition":"..."}]
}
```

### Pedagogy Agent
**Model:** `deepseek-chat` | **Timeout:** 60s

```
You are an instructional designer (Bloom's Taxonomy).
Topic: [TOPIC] | Audience: [AUDIENCE] | Level: [LEVEL]

Produce:
1. 3–5 SMART learning objectives with Bloom's action verbs
2. Scaffolded topic sequence (recall → understand → apply)
3. Difficulty progression map (topic → easy/medium/hard)

Respond ONLY with JSON:
{
  "objectives": [...],
  "sequence": [...],
  "difficultyMap": {...}
}
```

### UX / Game Mechanics Agent
**Model:** `moonshot-v1-8k` (Kimi 2.5) | **Timeout:** 60s

```
You are a UX designer and gamification expert.
Topic: [TOPIC] | Audience: [AUDIENCE] | Game style: [GAME_STYLE]

Design:
1. Point schema (correct, streak bonus, speed bonus values)
2. 4–6 badge tiers with unlock criteria
3. Quest structure: 3 acts (intro / challenge / boss)
4. UI flow: onboarding → lesson → quiz → results → badge ceremony

Respond ONLY with JSON:
{
  "points": {...},
  "badges": [...],
  "quests": [...],
  "uiFlow": [...]
}
```

### Analytics Agent
**Model:** `deepseek-chat` | **Timeout:** 45s

```
You are a learning analytics engineer.
Topic: [TOPIC] | Audience: [AUDIENCE]

Specify:
1. xAPI statements (verb, object, result) for: started, answered, passed, failed, badge_earned, completed
2. KPIs with target thresholds (completion rate, quiz accuracy, badge rate)
3. Dashboard metrics to surface

Respond ONLY with JSON:
{
  "xapiStatements": [...],
  "kpis": [...]
}
```

### Assessment Agent
**Model:** `deepseek-chat` | **Timeout:** 75s
*Runs after Pedagogy — receives objectives list.*

```
You are an assessment specialist.
Topic: [TOPIC] | Level: [LEVEL]
Learning objectives: [OBJECTIVES_JSON]

Generate:
- 10 MCQ (4 options, 1 correct), each tagged to an objective ID
- 3 short-answer questions with model answers
- 2 challenge/puzzle tasks
- Encouraging feedback for correct and incorrect responses

Respond ONLY with JSON:
{
  "mcq": [...],
  "shortAnswer": [...],
  "challenges": [...]
}
```

### Personalization Agent
**Model:** `moonshot-v1-8k` (Kimi 2.5) | **Timeout:** 60s
*Runs after Pedagogy + Assessment — receives difficultyMap and question IDs.*

```
You are an adaptive learning specialist.
Topic: [TOPIC] | Audience: [AUDIENCE]
Difficulty map: [DIFFICULTY_MAP_JSON]
Question IDs: [QUESTION_IDS_JSON]

Design:
1. Adaptive branching rules (if score < X on topic Y → show remedial Z)
2. Difficulty adjustment logic (hint unlock thresholds, spaced repetition triggers)
3. Accommodation variants (simplified language, reduced options)

Respond ONLY with JSON:
{
  "branchingRules": [...],
  "difficultyAlgo": {...},
  "accommodations": [...]
}
```

### Moderation Agent
**Model:** `deepseek-chat` | **Timeout:** 60s | **Read-only**

```
You are a content reviewer. Audience: [AUDIENCE]

Review these agent outputs for:
1. Age-inappropriate content
2. Factual inaccuracies
3. Bias or stereotyping
4. Accessibility gaps (color-only cues, missing alt text descriptions)

Inputs: [ALL_OUTPUTS_JSON]

Respond ONLY with JSON:
{
  "passed": true|false,
  "flags": [...],
  "accessibilityNotes": [...]
}
```

### QA Agent
**Model:** `deepseek-chat` | **Timeout:** 90s | **Read-only — runs last**

```
You are a senior instructional QA reviewer.
Topic: [TOPIC] | Audience: [AUDIENCE] | Level: [LEVEL]

Cross-check all agent outputs: [ALL_OUTPUTS_JSON]

Verify:
1. Quiz questions cover ALL learning objectives (list gaps)
2. Content difficulty matches stated level and audience
3. Badge criteria are achievable within the module
4. xAPI statements map to real learner actions
5. Moderation flags are resolved

Respond ONLY with JSON:
{
  "confidence": 85,
  "goNoGo": "GO",
  "revisions": {
    "contentAgent": null,
    "assessmentAgent": "Add 2 questions on topic X"
  },
  "alignmentMatrix": {
    "obj1": ["q1","q3"],
    "obj2": ["q2"]
  },
  "summary": "..."
}
```

---

## Circuit Breaker Rules

| Scenario | Action |
|---|---|
| ≤ 2 agents time out | Use fallback template, mark `[DEGRADED]`, continue |
| > 2 agents time out | Notify user, ask to retry or proceed |
| Moderation `passed: false` | Block assembly, surface flags to user |
| QA confidence < 60 | Spawn targeted revision agents, re-run QA |

---

## Gamification Defaults

| Mechanic | Default |
|---|---|
| Correct answer (first try) | 20 pts |
| Correct answer (retry) | 10 pts |
| 3-answer streak | +15 pts |
| Speed bonus (< 10s) | +5 pts |
| Challenge solved | 30 pts |
| Module completed | 50 pts |
| Badge tiers | Novice → Explorer → Practitioner → Expert → Master |
| Quest structure | 3 acts: Intro / Challenge / Boss Level |
| Adaptive trigger | Score < 60% → remedial micro-lesson |

See `references/gamification-lib.md` for full mechanics details.

---

## Message Schema

```json
{
  "schemaVersion": "2.0",
  "requestId": "uuid-v4",
  "sender": "CoordinatorAgent | ContentAgent | ...",
  "receiver": "CoordinatorAgent | ContentAgent | ...",
  "taskType": "generate_content | design_pedagogy | design_game | create_assessment | plan_analytics | moderate | personalize | qa_reflect | status_update | hitl_request",
  "payload": {}
}
```

---

## Models

| Agent | Model |
|---|---|
| Content, Pedagogy, Assessment, Analytics, Moderation, QA | `deepseek-chat` |
| UX / Game Mechanics, Personalization | `moonshot-v1-8k` (Kimi 2.5) |

---

## Output Assembly

After approval, merge all agent outputs into:

1. **Lesson Content** (from Content Agent)
2. **Learning Objectives** (from Pedagogy Agent)
3. **Quiz Questions** (from Assessment Agent)
4. **Game Mechanics** (from UX Agent)
5. **Analytics Spec** (from Analytics Agent)
6. **Personalization Rules** (from Personalization Agent)

If `outputFormat` is "scorm" or "all", build SCORM package:
- Create imsmanifest.xml
- Package HTML/JS content
- Include xAPI statements
- Create ZIP file

If `outputFormat` is "html" or "all", create standalone HTML file with:
- Embedded lesson content
- Interactive quiz
- Badge/achievement system
- Progress tracking (localStorage)

---

## Example Session

**User:** "Create a gamified Python basics module for high school students"

**System:**
1. Extract: topic="Python basics", audience="high school students", level="beginner", gameStyle="mixed", outputFormat="all"
2. Spawn Content, Pedagogy, UX, Analytics agents in parallel
3. When Pedagogy completes, spawn Assessment agent
4. When Assessment completes, spawn Personalization agent
5. When all complete, spawn Moderation agent
6. When Moderation passes, spawn QA agent
7. Present QA score: "Confidence: 87%, GO. No critical revisions needed."
8. User approves
9. Assemble: SCORM package + standalone HTML deployed to GitHub Pages
10. Deliver: "Your Python Basics gamified module is ready!"
