# Gamification Mechanics Library

## Point Systems

### Standard Scoring
| Action | Points | Rationale |
|--------|--------|-----------|
| Correct answer (first try) | 20 pts | Rewards competence |
| Correct answer (retry) | 10 pts | Still rewards persistence |
| Incorrect answer | 0 pts | No penalty, encourages trying |
| 3-answer streak | +15 pts | Rewards consistency |
| 5-answer streak | +25 pts | Mastery recognition |
| Speed bonus (< 10s) | +5 pts | Rewards fluency |
| Speed bonus (< 5s) | +10 pts | Expert recognition |
| Challenge solved | 30 pts | Difficulty bonus |
| Hint used | -5 pts | Small cost for support |
| Module completed | 50 pts | Milestone achievement |
| Perfect quiz (100%) | +25 pts | Excellence bonus |

### Badge Tiers
1. **Novice** - Complete onboarding
2. **Explorer** - Complete first lesson  
3. **Practitioner** - Score 80%+ on quiz
4. **Expert** - Complete all challenges
5. **Master** - 100% completion + perfect scores

### Quest Structure
- **Act 1**: Introduction + Hook + Basic concepts
- **Act 2**: Challenge + Applied learning
- **Act 3**: Boss Level + Complex problem

## Adaptive Triggers
- Score < 60% → Remedial micro-lesson
- Score 60-80% → Reinforcement activities
- Score 80%+ → Unlock advanced content

## xAPI Statements
- initialized (started module)
- answered (question response)
- passed/failed (assessment result)
- earned (badge achieved)
- completed (module finished)
