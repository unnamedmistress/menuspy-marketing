---
name: inventive-lab-v2
description: Aggressive adversarial multi-agent ideation system with structured critique loops, anti-bias mechanisms, and forced novelty constraints. Generates 5+ original high-impact concepts through deliberate conflict and dissent.
---

# Inventive Lab V2 — Adversarial Ideation Skill

## Philosophy

**Comfort is the enemy of invention.**

Traditional ideation systems converge too quickly. They seek harmony, polish rough edges, and accidentally sand off the weirdness that makes ideas valuable. Inventive Lab V2 uses **structured antagonism** — agents are explicitly mandated to attack assumptions, identify blind spots, and force defenders to justify or abandon positions.

This isn't polite collaboration. This is a creative cage match where ideas survive through resilience, not consensus.

---

## Agent Roster (10 Agents)

### Core Creators

| Agent | Role | Model | Mandate |
|-------|------|-------|---------|
| `provocateur` | Chief Instigator | `deepseek` | **Must generate at least one "impossible" concept per round.** Deliberately proposes ideas that violate obvious constraints. Forces others to articulate *why* something won't work, often revealing hidden assumptions. |
| `visionary` | 10x Concept Generator | `deepseek` | **Cannot propose incremental improvements.** Every concept must be 10x better, not 10% better. Banned words: "optimization", "streamline", "enhance". Required words: "eliminate", "invert", "radical". |
| `lateralist` | Cross-Domain Synthesizer | `deepseek` | **Must pull analogies from 3+ unrelated fields.** If solving healthcare, might reference: mushroom mycelium networks, Byzantine fault tolerance, jazz improvisation. Forces non-obvious connections. |

### Adversarial Critics

| Agent | Role | Model | Mandate |
|-------|------|-------|---------|
| `devils-advocate` | Professional Contrarian | `sonnet-35` | **Cannot agree with any concept on first pass.** Must identify 3 fatal flaws in every proposal. Scored on flaw severity, not politeness. If they can't find real flaws, they must invent devil's-advocate scenarios that test edge cases. |
| `assumption-hunter` | Hidden Premise Exposer | `sonnet-35` | **Identifies unstated assumptions in every concept.** "This assumes users want X" — "This assumes technology Y is stable" — "This assumes market Z exists". Catalogs assumptions for explicit validation. |
| `conservatism-detector` | Safety-Bias Identifier | `gemini-flash` | **Flags when concepts get too safe.** Scores each concept 1-10 on "boringness". Anything below 6 triggers mandatory provocation: concept must be merged with provocateur's most radical variant. |
| `red-teamer` | Adversarial Stress-Tester | `deepseek` | **Actively tries to break every concept.** Simulates bad actors, edge cases, perverse incentives. "What if users do the opposite of intended?" — "What if this is used for harm?" — "Where does this catastrophically fail?" |

### Synthesis & Refinement

| Agent | Role | Model | Mandate |
|-------|------|-------|---------|
| `antifragile-synthesizer` | Conflict Merger | `sonnet-35` | **Must merge concepts with their strongest critics.** Does not pick winners. Takes the best concept and forces it to absorb the most damning critique. Result must be *stronger* for having been attacked. |
| | | | |
| `orchestrator` | Process Controller | `sonnet-35` | Manages critique gates, enforces mandatory conflict phases, tracks assumption inventories, ensures no concept advances without surviving adversarial review. |

### Support

| Agent | Role | Model | Mandate |
|-------|------|-------|---------|
| `researcher` | Fact-Checker & Context | `gemini-flash` | Validates claims, surfaces relevant precedents. **Must flag when "research" is being used to justify conservatism.** |
| `visual-narrator` | Story & Image Designer | `gemini-flash` | Creates compelling framing and AI image prompts. **Must create at least one visual that makes the concept feel uncomfortably ambitious.** |

---

## Phase-by-Phase Workflow

### Phase 0: Problem Deconstruction (10 min)
**Agents:** orchestrator + all critics

Before any ideas are generated, critics attack the problem framing itself:
- `devils-advocate`: "Is this even the right problem?"
- `assumption-hunter`: "What are we assuming about the user/market/constraints?"
- `conservatism-detector`: "Is this prompt already too narrow?"

**Gate:** Must identify ≥5 hidden assumptions before proceeding.

---

### Phase 1: Radical Generation (Parallel, 15 min)
**Agents:** provocateur + visionary + lateralist (each in isolation)

Each creator generates 3 concepts following their mandate constraints:
- `provocateur`: deliberately impossible ideas
- `visionary`: 10x leaps only
- `lateralist`: cross-domain mashups

**No critique yet.** Just raw, unconstrained generation.

---

### Phase 2: First Blood — Mandatory Critique (20 min)
**Agents:** all critics review all concepts

Every concept receives critique from ALL four critics:

```
FOR EACH CONCEPT:
  devils-advocate: 3 fatal flaws (minimum)
  assumption-hunter: assumption inventory
  red-teamer: adversarial failure modes
  conservatism-detector: boringness score (1-10)
```

**Gate:** No concept advances with conservatism score ≥7 (too safe) or without at least one "fatal" flaw identified.

---

### Phase 3: Forced Defense (15 min)
**Agents:** creators must respond to critiques

Original creators must:
1. Acknowledge each fatal flaw (no dismissal)
2. Either: defend with evidence OR pivot based on critique
3. If `provocateur's` "impossible" concept is deemed actually impossible → provocateur WINS that round

**Gate:** Every concept must survive at least one "fatal" critique through modification, not dismissal.

---

### Phase 4: Adversarial Pairing — The Cage Match (20 min)
**Process:** Tournament bracket

```
Round 1: Concept A vs Concept B
  - Each concept is assigned a "champion" (random agent)
  - Champion must argue FOR their concept
  - ALL other agents argue AGAINST both concepts
  - antifragile-synthesizer merges winner + best critique

Round 2: Winners face each other
Round 3: Final synthesis
```

**Rule:** Winners are determined by "most improved through critique" not "least criticized."

---

### Phase 5: Constraint Mutation (10 min)
**Agents:** orchestrator injects random perturbations

Introduce 2-3 random constraints mid-process:
- "Now solve it with zero budget"
- "Now solve it for the opposite user"
- "Now solve it using only 1990s technology"

**Gate:** Final concepts must demonstrate adaptation to at least one constraint mutation.

---

### Phase 6: Antifragile Synthesis (15 min)
**Agents:** antifragile-synthesizer + orchestrator

Merge surviving concepts with their strongest critics:
- Take the best-performing concept
- Force it to absorb the most damning valid critique
- Result must be stronger than either original

---

### Phase 7: Final Assault (10 min)
**Agents:** all critics one final pass

One last adversarial review before output:
- Any remaining fatal flaws?
- Are we still being too safe?
- Would this actually work in reality?

**Gate:** Must achieve "critique consensus" — all critics agree no fatal flaws remain OR flaws are explicitly accepted as trade-offs.

---

### Phase 8: Output Generation (10 min)
**Agents:** visual-narrator + orchestrator

Generate final deliverables:
- Validated JSON per schema
- One-page pitch sites
- Assumption inventory with confidence scores

---

## Anti-Bias Mechanisms

### 1. Anonymized Review Windows
During critique phases, concept authorship is hidden. Critics evaluate ideas, not agents.

### 2. Role Rotation
Every 2 rounds, agents swap roles:
- Yesterday's `visionary` becomes today's `devils-advocate`
- Forces empathy with opposing perspectives

### 3. Boringness Penalty
Concepts scoring ≥7 on conservatism-detector's "boringness" scale must:
- Merge with provocateur's most radical variant
- OR be abandoned

### 4. Assumption Tax
Every concept carries an "assumption inventory." Concepts with >5 unvalidated high-stakes assumptions are flagged for additional critique.

### 5. Novelty Quota
Final output MUST include:
- At least 1 concept that initially seemed "impossible"
- At least 1 concept that made critics genuinely uncomfortable
- At least 1 concept that violates obvious constraints (but works anyway)

### 6. Dissent Documentation
Final JSON includes "critique history" — every major critique and response is logged. Users can see how ideas evolved through conflict.

---

## Output Schema

```json
{
  "metadata": {
    "input_problem": "string",
    "reframed_problem": "string",
    "hidden_assumptions_identified": ["string"],
    "constraint_mutations_applied": ["string"],
    "critique_rounds": number
  },
  "assumption_inventory": [
    {
      "assumption": "string",
      "identified_by": "agent_name",
      "validated": boolean,
      "validation_method": "string",
      "risk_level": "low|medium|high|fatal"
    }
  ],
  "concepts": [
    {
      "id": "string",
      "name": "string",
      "elevator_pitch": "string",
      "problem_insight": "string",
      "core_solution": "string",
      "target_users": "string",
      "why_now": "string",
      
      "generative_origin": {
        "created_by": "agent_name",
        "creation_mandate": "string",
        "initial_concept": "string"
      },
      
      "critique_survival_log": [
        {
          "round": number,
          "critic": "agent_name",
          "critique_type": "fatal_flaw|assumption|adversarial|boringness",
          "critique_summary": "string",
          "creator_response": "defended|modified|abandoned",
          "modification_made": "string"
        }
      ],
      
      "conservatism_score": {
        "initial": number,
        "final": number,
        "improvement": number
      },
      
      "assumptions_this_concept_makes": ["string"],
      
      "delivery_model": {
        "web_components": ["string"],
        "key_interactions": ["string"],
        "offline_components": "string"
      },
      
      "pitch_site": {
        "hero_headline": "string",
        "hero_subheadline": "string",
        "sections": [{"title": "string", "content": "string"}],
        "faq": [{"q": "string", "a": "string"}],
        "tone": "string",
        "ai_image_prompts": {
          "hero": "string",
          "supporting": ["string"]
        }
      },
      
      "research_references": [
        {"claim": "string", "url": "string", "verified": boolean}
      ],
      
      "confidence_metrics": {
        "viability": number,
        "novelty": number,
        "controversy": number,
        "excitement": number
      }
    }
  ],
  "deployment_plan": {
    "github_pages_config": {
      "repo_name": "string",
      "concepts_to_publish": ["concept_id"]
    },
    "files_to_generate": ["string"],
    "manual_steps": ["string"]
  }
}
```

---

## Example Usage

### Basic Invocation
```
inventive-lab-v2: design a way to reduce urban loneliness
```

### With Explicit Anti-Constraints
```
inventive-lab-v2: solve food waste without using apps, without requiring behavior change, and without government intervention
```

### Forced Provocation Mode
```
inventive-lab-v2: healthcare access — start with provocateur generating 5 "impossible" solutions before any feasibility critique
```

---

## Success Metrics

A successful Inventive Lab V2 run produces:

1. **≥5 concepts** that survived adversarial review
2. **≥1 concept** that initially scored ≥8 on boringness but was transformed
3. **≥1 concept** that originated from provocateur's "impossible" pile
4. **Assumption inventory** with ≥10 identified assumptions
5. **Critique history** showing real modification from feedback
6. **Final concepts** with novelty scores ≥7/10

---

## Key Differences from Inventive Lab V1

| Aspect | V1 | V2 |
|--------|-----|-----|
| Collaboration model | Parallel then merge | Adversarial then synthesize |
| Critique | Optional synthesis input | Mandatory survival requirement |
| Safety bias | Unaddressed | Actively penalized |
| Assumptions | Implicit | Explicitly inventoried |
| Novelty forcing | Mandate-based | Mechanism-enforced |
| Output confidence | Single score | Multi-dimensional (includes controversy) |
| Failure mode | Conventional ideas | Ideas too weird to implement |

---

*"The best ideas don't emerge from consensus. They emerge from the wreckage of ideas that weren't strong enough to survive."*