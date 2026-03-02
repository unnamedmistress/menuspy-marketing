# Session: 2026-02-23 13:56:22 UTC

- **Session Key**: agent:main:main
- **Session ID**: c94f2815-bf0c-4e35-ada5-a98b3ce3e2eb
- **Source**: webchat

## Conversation Summary

user: [Mon 2026-02-23 13:37 UTC] push it up
assistant: You're on `main` and already up to date with `origin/main`. No commits to push.

But you have uncommitted changes:

**Modified:**
- `package.json` & `package-lock.json`

**New files (untracked):**
- `.env.creative-assembly-line`
- Various skill outputs (`ai-capability-games/`, `gamified-learning-output/`, etc.)
- `src/` components (Hero, Navigation, Labyrinth, etc.)

Want me to:
1. **Commit & push** — stage everything, commit with a message, then push?
2. **Push a different branch** — like `fix-auth-data-handling` or `redesign-mvp`?
3. **Stash** the changes and keep main clean?

What would you like to do?
user: [Mon 2026-02-23 13:55 UTC] list your skills
assistant:  Here are the skills currently available in your workspace:

## Core Skills (in `/app/skills/`)

| Skill | Description |
|-------|-------------|
| **coding-agent** | Delegate coding tasks to Codex, Claude Code, or Pi agents — for building features, reviewing PRs, refactoring |
| **gh-issues** | Fetch GitHub issues, spawn agents to implement fixes, open PRs, monitor reviews |
| **github** | GitHub operations via `gh` CLI — check PRs, issues, CI runs, code review |
| **gog** | Google Workspace CLI — Gmail, Calendar, Drive, Contacts, Sheets, Docs |
| **healthcheck** | Host security hardening, firewall/SSH/update hardening, risk posture |
| **mcporter** | MCP server CLI — list, configure, auth, and call MCP servers/tools |
| **openai-image-gen** | Batch-generate images via OpenAI API, with random prompt sampler + gallery |
| **openai-whisper-api** | Transcribe audio via OpenAI Whisper API |
| **session-logs** | Search and analyze your own session logs using jq |
| **skill-creator** | Create or update AgentSkills with scripts, references, and assets |
| **summarize** | Summarize or extract text/transcripts from URLs, podcasts, local files |
| **weather** | Current weather and forecasts via wttr.in or Open-Meteo |

## Multi-Agent Skills (in `~/.openclaw/skills/`)

| Skill | Description |
|-------|-------------|
| **ai-capability-atlas** | 9-agent orchestrator that builds a 20-page interactive digital newspaper on AI capabilities |
| **audience-empathy** | Persona-based empathy simulator that surfaces conflicts/consensus in user needs |
| **creative-assembly-line** | Multi-agent system that builds products through creative tension |
| **inventive-lab** | Multi-agent ideation that generates 5+ original solution concepts with pitch sites |
| **marketing-command-center** | 6-agent marketing team (Strategist, Copywriter, Designer, Analyst, Editor, Publisher) |
| **studio-beast** | Multi-agent studio that turns an app concept into a build-ready product |

## Workspace Skills (in `~/.openclaw/workspace/skills/`)

| Skill | Description |
|-------|-------------|
| **gamified-learning** | Orchestrates 8 specialized sub-agents to design & build complete gamified learning modules |
| **improvisation-theater** | Create pitch websites through role-playing with archetypal personas |

---

Want me to show more details about any specific skill?
