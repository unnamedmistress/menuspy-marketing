# PermitFlow

PermitFlow is a full-stack Next.js application for permit prediction, concierge chat, status visualization, and historical timeline analytics.

## Stack
- Next.js App Router + TypeScript strict mode
- Prisma + PostgreSQL
- NextAuth.js (Credentials + optional Google OAuth)
- OpenAI API integration for concierge and intent extraction
- Framer Motion for theater animations
- Vitest + Testing Library

## Local Setup
1. Install dependencies:
```bash
npm install
```
2. Configure env:
```bash
cp .env.example .env.local
```
3. Run migrations and generate client:
```bash
npm run db:generate
npm run db:migrate
```
4. Seed demo data:
```bash
npm run db:seed
```
5. Start app:
```bash
npm run dev
```

Demo login: `demo@permitflow.io` / `demo12345`

## Testing
```bash
npm test
```

## Deployment (Vercel)
1. Create Vercel project from this folder.
2. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENAI_API_KEY`, optional Google OAuth keys.
3. Build command: `npm run build`
4. Post-deploy: run `prisma migrate deploy` and `npm run db:seed` as needed.
