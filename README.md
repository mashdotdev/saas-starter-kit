# AI SaaS Starter Kit

> Ship your AI SaaS in days, not months.

A production-ready monorepo for building AI-powered SaaS products. Includes auth, billing, multi-tenancy, RAG pipelines, streaming AI chat, and a Python AI microservice — all wired up and ready to customise.

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/create-ai-saas)](https://www.npmjs.com/package/create-ai-saas)
[![GitHub stars](https://img.shields.io/github/stars/mashdotdev/saas-starter-kit)](https://github.com/mashdotdev/saas-starter-kit)

---

## Quick start

```bash
npx create-ai-saas my-app
cd my-app

# Fill in your secrets
code apps/web/.env.local

# Push the database schema
cd packages/db && bun run db:push

# Start the dev server
cd ../.. && bun dev
```

The CLI clones this repo, copies `.env.example` → `.env.local`, and runs `bun install` (falls back to `npm install` if Bun is not found).

---

## What is this?

This kit gives you a fully working AI SaaS foundation so you can focus on your product's unique value instead of re-building auth, billing, and infrastructure from scratch.

The **Community tier** (this repo, MIT licensed) ships Next.js 16, Better Auth with OAuth, Lemon Squeezy subscriptions, Prisma + Postgres, and a Python FastAPI AI microservice with streaming chat. The **Pro tier** adds multi-tenancy, RBAC, Qdrant RAG pipelines, usage billing, and a private Discord community, one-time purchase, lifetime access.

---

## Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 (App Router) | React server components, streaming UI |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Auth | Better Auth | Email/password + Google/GitHub OAuth |
| API | tRPC v11 | End-to-end type-safe API layer |
| Database | PostgreSQL via Supabase | Primary data store |
| ORM | Prisma 7 | Type-safe queries + migrations |
| Billing | Lemon Squeezy | Subscriptions, webhooks, customer portal |
| AI service | Python FastAPI | LLM orchestration, RAG pipelines |
| Embeddings | Google `gemini-embedding-001` | Semantic search |
| Vector DB | Qdrant Cloud | Per-org document collections |
| LLM | Google Gemini (configurable) | Streaming chat responses |
| Caching | Upstash Redis (Pro) | Rate limiting, session caching |
| Monorepo | Turborepo + Bun | Fast builds, shared packages |
| Deployment | Vercel + Docker | Web on Vercel, AI service on any Docker host |

---

## Monorepo structure

```
saas-starter-kit/
├── apps/
│   ├── web/                    # Next.js frontend + API routes
│   │   ├── src/
│   │   │   ├── app/            # App Router pages and API routes
│   │   │   │   ├── (auth)/     # sign-in, sign-up, verify-email
│   │   │   │   ├── (marketing)/# Landing page
│   │   │   │   ├── api/        # REST endpoints (auth, AI chat, Stripe webhooks)
│   │   │   │   ├── dashboard/  # Protected app shell
│   │   │   │   └── invite/     # Org invite acceptance
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── lib/            # Auth client, Stripe client, utilities
│   │   │   └── server/         # tRPC routers, Prisma client, auth config
│   │   └── .env.local          # Your secrets (never committed)
│   │
│   └── ai-service/             # Python FastAPI microservice
│       ├── routers/            # chat.py, rag.py
│       ├── services/           # rag.py (Qdrant + LangChain)
│       ├── main.py
│       ├── Dockerfile
│       └── requirements.txt
│
├── packages/
│   ├── db/                     # Prisma schema + migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── prisma.config.ts
│   ├── auth/                   # Shared Better Auth config
│   ├── types/                  # Shared TypeScript types
│   └── create-ai-saas/         # npx CLI scaffolder
│
├── turbo.json
├── package.json
└── README.md
```

---

## Environment variables

Copy `apps/web/.env.local` and fill in the values below.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string (pooled, e.g. Supabase) |
| `DIRECT_URL` | Yes | Postgres direct connection string (for migrations) |
| `BETTER_AUTH_SECRET` | Yes | Random secret for session signing — `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app's public URL, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | OAuth | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | OAuth | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | OAuth | GitHub OAuth app client secret |
| `STRIPE_SECRET_KEY` | Billing | Stripe secret key (`sk_live_…` or `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Billing | Stripe webhook signing secret (`whsec_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Billing | Stripe publishable key (`pk_live_…`) |
| `AI_SERVICE_URL` | AI | Internal URL of the FastAPI AI service |
| `AI_SERVICE_SECRET` | AI | Shared secret for web → AI service auth |
| `GOOGLE_API_KEY` | AI | Google AI Studio key for Gemini + embeddings |
| `QDRANT_URL` | RAG (Pro) | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | RAG (Pro) | Qdrant Cloud API key |
| `RESEND_API_KEY` | Email | Resend key for invite and verification emails |
| `UPSTASH_REDIS_REST_URL` | Pro | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Pro | Upstash Redis REST token |

---

## What you can build

### 1. AI customer support SaaS

Let companies embed their knowledge base and give customers an AI agent that answers questions from their docs, FAQs, and policies — with source citations and escalation to human agents.

**How to use this kit:** Ingest company docs via the `/rag/ingest` endpoint. Wire the RAG retriever into the chat route to add context before each LLM call. Add a public-facing chat widget as a separate Next.js route (no auth required). Each customer organisation gets its own Qdrant collection so data stays isolated.

**Customise:** `apps/ai-service/services/rag.py` for retrieval logic, `apps/web/src/app/api/ai/chat/route.ts` for context injection, `apps/web/src/app/dashboard/` for the agent management UI.

---

### 2. AI document analysis SaaS

Let users upload PDFs, contracts, or reports and ask questions against them. Useful for legal, compliance, finance, and research teams.

**How to use this kit:** Use the existing `POST /rag/ingest` endpoint which already handles PDF extraction via `pypdf`. Add a file upload UI in the dashboard. Expose a "chat with this document" page that scopes retrieval to a specific document by adding a metadata filter on the Qdrant query.

**Customise:** `apps/ai-service/routers/rag.py` to add document-scoped filtering, `apps/web/src/app/dashboard/` for the upload + chat UI, Stripe billing for per-document or per-page usage metering.

---

### 3. AI coding assistant SaaS

A GitHub Copilot-style assistant that understands your users' codebases. Supports code generation, explanation, review, and refactoring via a chat interface.

**How to use this kit:** Ingest code files as documents (the chunker handles plain text). Add tool calls to the Gemini request in `apps/ai-service/routers/chat.py` — tools like `read_file`, `run_tests`, `search_codebase`. Stream tool output back to the frontend using the existing streaming response infrastructure.

**Customise:** `apps/ai-service/routers/chat.py` for tool definitions, `apps/web/src/components/dashboard/chat.tsx` for the code-aware chat UI (add syntax highlighting), billing by token or by seat.

---

### 4. SaaS analytics dashboard (no AI)

A multi-tenant analytics platform where teams can track metrics, build dashboards, and manage data — no AI needed. The kit's auth, billing, and org management are exactly what you need.

**How to use this kit:** Skip the AI service entirely. Add your data models to `packages/db/prisma/schema.prisma`. Build tRPC routers in `apps/web/src/server/trpc/routers/` for your metrics. Use the existing org switcher and RBAC (`orgProcedure`, `adminProcedure`) to scope all queries to the active organisation.

**Customise:** Replace the chat dashboard page with your charts and tables. Use Stripe's usage metering to bill by number of tracked events or data retention period.

---

### 5. AI writing assistant SaaS

A Notion-meets-Jasper tool where teams collaborate on AI-generated and AI-refined content — blog posts, marketing copy, emails, and social posts — with org-scoped history and templates.

**How to use this kit:** The streaming chat infrastructure handles real-time generation. Add a `Document` model to the Prisma schema to persist drafts scoped to an org. Use the invite system so marketing teams can collaborate. RAG-ingest brand guidelines and tone-of-voice docs so the AI stays on-brand per organisation.

**Customise:** `apps/web/src/app/dashboard/` for a rich-text editor (integrate Tiptap or Lexical), `apps/ai-service/routers/chat.py` for writing-specific system prompts, Stripe for per-seat or per-word billing.

---

## Free vs Pro

| Feature | Community (free) | Pro ($249 one-time) |
|---|---|---|
| Next.js 15 + App Router | Yes | Yes |
| Better Auth (email + OAuth) | Yes | Yes |
| Prisma + Postgres | Yes | Yes |
| Stripe subscriptions + webhooks | Yes | Yes |
| Python FastAPI AI microservice | Yes | Yes |
| Streaming AI chat | Yes | Yes |
| Multi-tenancy + org management | — | Yes |
| RBAC (admin / member roles) | — | Yes |
| Org invite system (email) | — | Yes |
| Qdrant RAG pipeline | — | Yes |
| Document ingestion (PDF + text) | — | Yes |
| Per-org vector collections | — | Yes |
| Upstash Redis caching | — | Yes |
| Usage billing (metered Stripe) | — | Yes |
| Private Discord community | — | Yes |
| License | MIT | Commercial |

Get Pro: [mashdotdev.gumroad.com/l/ai-saas-pro](https://mashdotdev.gumroad.com/l/ai-saas-pro)

---

## Deployment

### Web app — Vercel

1. Push this repo to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Set **Root Directory** to `apps/web`.
4. Add all environment variables from the table above.
5. Deploy. Vercel detects Next.js automatically.

For monorepo builds, Vercel runs `turbo build --filter=web` by default. If you need to override the build command, set it to:

```bash
cd ../.. && bun run build --filter=web
```

### AI microservice — Docker

```bash
cd apps/ai-service

# Build
docker build -t ai-service .

# Run
docker run -p 8000:8000 \
  -e GOOGLE_API_KEY=your_key \
  -e QDRANT_URL=your_qdrant_url \
  -e QDRANT_API_KEY=your_qdrant_key \
  -e AI_SERVICE_SECRET=your_shared_secret \
  ai-service
```

Deploy the container to any Docker host: Railway, Fly.io, Cloud Run, or a plain VPS. Point `AI_SERVICE_URL` in your web `.env.local` to the public URL.

### Database — Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the **Connection string (pooled)** → `DATABASE_URL`.
3. Copy the **Connection string (direct)** → `DIRECT_URL`.
4. Run migrations:

```bash
cd packages/db
bun run db:push
```

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes and ensure the build passes: `bun run build`
3. Open a pull request against `main` with a clear description of what you changed and why.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/mashdotdev/saas-starter-kit/issues).

---

## License

The Community tier (this repository, `main` branch) is MIT licensed — free to use, modify, and distribute, including in commercial products. See [LICENSE](./LICENSE).

The Pro tier (private `pro` branch) is licensed under a separate commercial license. Contact [mashhoodhussain@gmail.com](mailto:mashhoodhussain@gmail.com) for details.
