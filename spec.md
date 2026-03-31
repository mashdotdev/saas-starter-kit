
**AI SaaS Starter Kit**

Product Specification

────────────────────────────

Version 1.0  ·  Author: Mashhood Hussain  ·  2026

npx create-ai-saas my-app

| Status | In development |
| :---- | :---- |
| **License** | MIT (free tier) / Commercial (pro tier) |
| **Repo** | github.com/mashhoodhussain/ai-saas-starter |
| **Stack** | Next.js 16, FastAPI, Prisma, BetterAuth, Lemon Squeezy, Qdrant |
| **Target** | SaaS founders, Upwork clients, developers |

# **1\. Project overview**

The AI SaaS Starter Kit is a production-ready, open-source boilerplate that gives developers a battle-tested foundation for building AI-powered SaaS products. Instead of spending weeks wiring together authentication, billing, database schemas, and AI integrations, developers run a single command and get a fully working application skeleton they can build on immediately.

The kit is the primary Upwork portfolio piece and serves three simultaneous goals:

* Demonstrate production architecture to potential clients on Upwork

* Generate GitHub stars and inbound developer interest as a top-of-funnel asset

* Sell directly as a Pro extended template via Gumroad

## **1.1  The problem this solves**

Every SaaS founder hiring on Upwork faces the same six unsolved problems from day one:

| Problem | Cost without this kit |
| :---- | :---- |
| **Authentication** | 8–12 hours re-implementing sessions, OAuth, and guards every project |
| **Billing & subscriptions** | 20–30 hours per project wiring Lemon Squeezy webhooks, plans, and portals |
| **Multi-tenancy** | Most devs skip org scoping then spend weeks refactoring data isolation later |
| **AI integration** | No agreed architecture for agents, RAG, streaming UI — reinvented per project |
| **Type safety** | Frontend-to-backend type drift causes runtime errors in production |
| **Animated frontend** | Generic templates with no GSAP — client landing pages look like every other SaaS |

# **2\. System architecture**

The kit uses a hybrid architecture: a Next.js 16 monolith handles frontend, tRPC API, and auth, while a separate FastAPI microservice owns all AI logic. This decoupling means AI models and agents can be swapped or scaled independently without touching the frontend.

## **2.1  Layer breakdown**

### **Layer 1 — Frontend (Next.js 16\)**

| Component | Description | Status |
| :---- | :---- | ----- |
| **App Router** | Full Next.js 16 App Router with React Server Components. Pages co-located with server logic. | **included** |
| **GSAP landing** | Animated hero with scroll-triggered reveals, staggered text entrance, and parallax on dashboard mockup. | **included** |
| **Dashboard UI** | Tailwind CSS \+ shadcn/ui component library. Pre-built: sidebar, data tables, stat cards, command palette. | **included** |
| **Streaming UI** | Vercel AI SDK useChat hook wired to the FastAPI streaming endpoint. Real-time token output. | **included** |

### **Layer 2 — API (tRPC \+ Next.js)**

| Component | Description | Status |
| :---- | :---- | ----- |
| **tRPC router** | End-to-end type-safe API. No REST boilerplate. Client calls feel like local function calls. | **included** |
| **Middleware stack** | Auth guard, tenant injector, rate limiter, and permission check — composable per-procedure. | **included** |
| **AI bridge** | tRPC procedures that proxy to FastAPI for AI tasks. Handles auth context forwarding. | **included** |

### **Layer 3 — AI service (FastAPI)**

| Component | Description | Status |
| :---- | :---- | ----- |
| **Agent orchestration** | OpenAI Agents SDK. Pre-built agent with tool definitions for web search, database read, and file ops. | **included** |
| **RAG pipeline** | LangChain document loader → chunking → Qdrant upsert → retrieval chain. Plug in any doc source. | **included** |
| **Streaming endpoint** | SSE streaming response. Compatible with Vercel AI SDK on the frontend. | **included** |
| **Usage metering** | Token counter middleware on every AI call. Writes to ai\_usage table for billing. | **included** |
| **MCP integration** | Model Context Protocol server stub. Ready to connect GitHub, Notion, Slack as agent tools. | **pro** |

### **Layer 4 — Data (Prisma \+ Postgres \+ Redis)**

| Component | Description | Status |
| :---- | :---- | ----- |
| **Prisma ORM** | Type-safe schema definitions. Migrations via prisma migrate. All tables inferred to TypeScript. | **included** |
| **PostgreSQL** | Supabase. | **included** |
| **Redis** | Redis for rate limiting (sliding window per user) and session caching. | **included** |
| **Qdrant** | Vector database for RAG. Org-scoped collections — each tenant gets isolated vector storage. | **included** |

### **Layer 5 — Auth (BetterAuth)**

| Component | Description | Status |
| :---- | :---- | ----- |
| **Email \+ password** | Secure sign-up / sign-in with hashed passwords. Email verification flow included. | **included** |
| **OAuth providers** | Google and GitHub OAuth pre-configured. Add more providers with one config entry. | **included** |
| **Basic RBAC** | Two roles: admin and member. Permission checks on tRPC procedures via middleware. | **included** |
| **Full RBAC** | Custom role definitions, permission inheritance, and per-resource access control. | **pro** |
| **Multi-tenancy** | Organization model. Users belong to orgs. All data scoped by orgId. Invite system. | **pro** |

### **Layer 6 — Billing (Lemon Squeezy)**

| Component | Description | Status |
| :---- | :---- | ----- |
| **Flat subscriptions** | Monthly and annual plans. Checkout session → webhook → DB sync. Plan gating on features. | **included** |
| **Customer portal** | Lemon Squeezy-hosted self-serve portal. Users upgrade, downgrade, cancel without contacting support. | **included** |
| **Usage billing** | Token/API call metering per org. Lemon Squeezy usage records synced nightly. Overage alerts. | **pro** |
| **Per-seat pricing** | Billing scales with active org members. Seat count synced on member add/remove. | **pro** |

# **3\. Database schema**

All tables follow a consistent pattern: UUID primary keys, orgId foreign key for tenant scoping, and timestamps. The schema is defined in Prisma and generates full TypeScript types automatically.

## **3.1  Core tables**

### **users**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | uuid PK | Auto-generated primary key |
| email | text UNIQUE | User's email address — must be verified before login |
| name | text | Display name |
| passwordHash | text | Argon2id hash — never stored or returned in plain text |
| emailVerified | boolean | Gates access until email is confirmed |
| createdAt | timestamp | Account creation time — UTC |

### **orgs**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | uuid PK | Org identifier — injected into all tenant-scoped queries |
| name | text | Organization display name |
| slug | text UNIQUE | URL-safe identifier used in subdomains and paths |
| plan | enum | free | pro | enterprise — controls feature access |
| lemonSqueezyId | text | Lemon Squeezy customer ID — links org to billing |
| createdAt | timestamp | UTC creation time |

### **memberships**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | uuid PK |  |
| userId | uuid FK | References users.id |
| orgId | uuid FK | References orgs.id |
| role | enum | admin | member | viewer — controls permissions within the org |
| invitedBy | uuid FK | User who sent the invite — nullable for founding member |
| joinedAt | timestamp | When the membership was accepted |

### **ai\_usage**

| Column | Type | Description |
| :---- | :---- | :---- |
| id | uuid PK |  |
| orgId | uuid FK | Tenant scoping — all usage belongs to an org |
| userId | uuid FK | Which user triggered this usage event |
| model | text | e.g. gpt-4o, gpt-4o-mini — recorded per call |
| inputTokens | integer | Prompt tokens consumed |
| outputTokens | integer | Completion tokens generated |
| cost | numeric | Computed cost in USD at time of call — cached for billing |
| usedAt | timestamp | UTC — used for monthly aggregation and overage detection |

# **4\. File structure**

The repository is a monorepo managed with bun workspaces. Two main apps: the Next.js frontend/API and the FastAPI AI service. Shared types live in a packages/ directory.

## **4.1  Root layout**

ai-saas-starter/

├── apps/

│   ├── web/               ← Next.js 16 app

│   └── ai-service/        ← FastAPI Python service

├── packages/

│   ├── db/                ← Prisma schema \+ migrations

│   ├── auth/              ← BetterAuth config \+ plugins

│   └── types/             ← Shared TypeScript types

├── packages/create-ai-saas/  ← The npx CLI

├── docker-compose.yml

├── package.json           ← bun workspaces config

└── turbo.json

## **4.2  Web app (apps/web/)**

apps/web/

├── app/

│   ├── (marketing)/       ← Landing page, pricing, docs

│   │   └── page.tsx       ← Hero \+ GSAP animations

│   ├── (auth)/            ← Sign-in, sign-up, verify

│   └── (dashboard)/       ← Protected app routes

│       ├── layout.tsx     ← Sidebar \+ auth guard

│       ├── page.tsx       ← Main dashboard

│       ├── billing/       ← Plan management

│       ├── settings/      ← Org \+ user settings

│       └── ai/            ← AI chat interface

├── server/

│   ├── trpc/

│   │   ├── router.ts      ← Root router

│   │   ├── middleware.ts  ← Auth, tenant, rate limit

│   │   └── routers/       ← Feature routers

│   │       ├── user.ts

│   │       ├── org.ts

│   │       ├── billing.ts

│   │       └── ai.ts

│   └── webhooks/

│       └── lemon-squeezy.ts  ← Lemon Squeezy event handler

├── components/

│   ├── ui/                ← shadcn/ui components

│   ├── marketing/         ← Landing page sections

│   └── dashboard/         ← App UI components

└── lib/

    ├── lemon-squeezy.ts   ← Lemon Squeezy client \+ helpers

    ├── redis.ts           ← Redis client

    └── utils.ts

## **4.3  AI service (apps/ai-service/)**

apps/ai-service/

├── main.py                ← FastAPI app \+ CORS

├── routers/

│   ├── chat.py            ← Streaming chat endpoint

│   ├── agents.py          ← Agent run endpoint

│   └── rag.py             ← Document ingest \+ retrieval

├── services/

│   ├── agent.py           ← OpenAI Agents SDK setup

│   ├── rag.py             ← LangChain \+ Qdrant pipeline

│   └── metering.py        ← Token counter \+ usage writer

├── middleware/

│   └── auth.py            ← JWT verification from Next.js

└── requirements.txt

# **5\. API reference**

The tRPC router handles all frontend-to-backend communication. The FastAPI service exposes AI-specific HTTP endpoints called by the tRPC ai router. All procedures require authentication unless marked public.

## **5.1  tRPC procedures**

### **user router**

| Procedure | Access | Description |
| :---- | :---- | :---- |
| user.me | protected | Returns the current user \+ their active org membership |
| user.update | protected | Update display name or avatar |
| user.deleteAccount | protected | Soft-delete — purges data and cancels billing |

### **org router**

| Procedure | Access | Description |
| :---- | :---- | :---- |
| org.get | member | Fetch current org details, plan, and member count |
| org.update | admin | Update org name or slug — admin only |
| org.members.list | member | List all members with roles |
| org.members.invite | admin | Send email invite — creates pending membership |
| org.members.remove | admin | Revoke membership and downgrade seat count |
| org.leave | member | Member removes themselves — blocked if last admin |

### **billing router**

| Procedure | Access | Description |
| :---- | :---- | :---- |
| billing.plans | public | List available plans with prices from Lemon Squeezy |
| billing.subscription | member | Current org plan, renewal date, and usage this period |
| billing.checkout | admin | Create Lemon Squeezy checkout session for plan upgrade |
| billing.portal | admin | Create Lemon Squeezy customer portal session for self-serve management |
| billing.usage | member | Token usage breakdown by model and day for current billing period |

### **ai router (tRPC → FastAPI bridge)**

| Procedure | Access | Description |
| :---- | :---- | :---- |
| ai.chat | member | Streams chat response via SSE. Checks plan limits before forwarding. |
| ai.agent.run | member | Runs an agent task. Returns structured result \+ tool call log. |
| ai.docs.ingest | admin | Upload document to RAG pipeline. Chunks, embeds, and upserts to Qdrant. |
| ai.docs.list | member | List all ingested documents for this org. |
| ai.docs.delete | admin | Remove document and its vectors from Qdrant. |

# **6\. Build phases**

The project is built in four sequential phases. Each phase produces a shippable, demo-able state. Phase 1 is the Upwork portfolio MVP. Phase 4 is the full commercial product.

| Phase | Name | Deliverables | Target |
| ----- | :---- | :---- | :---- |
| **1** | **Foundation** | Repo setup, Prisma schema, BetterAuth (email \+ OAuth), tRPC skeleton, basic dashboard UI, Lemon Squeezy flat billing, Vercel deploy config | Week 1–2 |
| **2** | **AI layer** | FastAPI service, streaming chat endpoint, Vercel AI SDK integration, OpenAI Agents SDK agent, usage metering to DB | Week 3–4 |
| **3** | **Multi-tenancy** | Org model, memberships, invite system, RBAC middleware, org-scoped tRPC middleware, tenant-isolated Qdrant collections, RAG pipeline | Week 5–6 |
| **4** | **Polish \+ ship** | GSAP landing page, CLI (npx create-ai-saas), Docker Compose, README, demo video, Gumroad listing, Upwork portfolio update | Week 7–8 |

## **6.1  Phase 1 acceptance criteria**

* Running locally with bun dev — no errors

* User can sign up, verify email, sign in, and sign out

* Google OAuth flow completes end to end

* Dashboard renders with sidebar and empty state

* Lemon Squeezy checkout session created for the Pro plan

* Lemon Squeezy webhook updates the user's plan in the DB

* prisma migrate dev runs without errors on Supabase

## **6.2  Phase 2 acceptance criteria**

* FastAPI starts on port 8000 via docker-compose up

* Chat endpoint streams tokens to the browser — visible in real time

* Agent runs a test task and returns structured result

* Every AI call writes a row to ai\_usage

* Rate limit rejects the 11th request in a 60-second window

## **6.3  Phase 3 acceptance criteria**

* User can create an org and invite a second user via email

* Invited user joins and sees only their org's data

* Admin procedures reject non-admin callers with FORBIDDEN

* Document ingested via ai.docs.ingest appears in ai.docs.list

* RAG retrieval returns contextually relevant chunks from ingested doc

* Two orgs' Qdrant collections are fully isolated — no cross-tenant leakage

# **7\. Environment variables**

All secrets live in .env files. The .env.example file is committed to the repo with blank values. Never commit actual secrets.

| Variable | Required | Description |
| :---- | :---- | :---- |
| DATABASE\_URL | yes | Supabase Postgres connection string |
| REDIS\_URL | yes | Redis connection URL |
| BETTER\_AUTH\_SECRET | yes | 32-char random string for session signing |
| GOOGLE\_CLIENT\_ID | optional | OAuth — enable Google sign-in |
| GOOGLE\_CLIENT\_SECRET | optional | OAuth — pair with above |
| GITHUB\_CLIENT\_ID | optional | OAuth — enable GitHub sign-in |
| GITHUB\_CLIENT\_SECRET | optional | OAuth — pair with above |
| LEMONSQUEEZY\_API\_KEY | yes | Lemon Squeezy API key |
| LEMONSQUEEZY\_WEBHOOK\_SECRET | yes | Webhook signing secret from Lemon Squeezy dashboard |
| LEMONSQUEEZY\_PRO\_VARIANT\_ID | yes | Lemon Squeezy Variant ID for the Pro plan |
| OPENAI\_API\_KEY | yes | OpenAI key — used by FastAPI service |
| QDRANT\_URL | yes | Qdrant instance URL |
| QDRANT\_API\_KEY | yes | Qdrant API key |
| AI\_SERVICE\_URL | yes | FastAPI base URL — http://localhost:8000 locally |
| AI\_SERVICE\_INTERNAL\_SECRET | yes | Shared secret for Next.js → FastAPI auth |
| NEXT\_PUBLIC\_APP\_URL | yes | Public URL of the app — used in emails and OAuth callbacks |

# **8\. OSS strategy and Upwork funnel**

## **8.1  The npx CLI**

The create-ai-saas package is published to npm under the same name. When run, it prompts for a project name and tier, then clones the correct template branch and sets up the .env file.

npx create-ai-saas my-app

? Which template?

  \> Free  (single-tenant, MIT)

    Pro   (multi-tenant \+ RBAC, requires purchase)

? Project name: my-app

  Cloning template...

  Setting up .env...

  Done. Run: cd my-app && bun install && bun dev

## **8.2  Repo branch strategy**

| Branch | Access | Contents |
| :---- | :---- | :---- |
| main | Public (MIT) | Free tier. Single-tenant, basic RBAC (admin/member), flat Lemon Squeezy billing. |
| pro | Private (Gumroad key) | Full multi-tenancy, custom RBAC, usage billing, per-seat pricing, MCP stub. |
| docs | Public | Documentation site source (Next.js). |

## **8.3  Upwork conversion funnel**

Every touchpoint in the kit is designed to route warm leads to the Upwork profile:

* GitHub README → 'Need this built custom? Hire me on Upwork →'

* Landing page pricing section → 'Hire Mashhood' card links to Upwork profile

* npm package description → Upwork profile link

* Gumroad product page → 'Prefer done-for-you? Hire me to build it →'

* Demo site footer → Upwork link \+ contact form

The proposition in every proposal: 'I built the starter kit this is based on. I can ship your MVP in two weeks instead of two months.'

## **8.4  LinkedIn content from this project**

The build process generates 8+ LinkedIn posts using the 7-day content pillar rotation:

* Day 1 (build in public) — shipping the Prisma schema \+ multi-tenant middleware

* Day 2 (lesson) — why most devs implement multi-tenancy wrong

* Day 3 (result) — 'npx create-ai-saas now works. Here's what's in it'

* Day 4 (client win) — first Upwork proposal that referenced the kit

* Day 5 (tool/resource) — the 6 env vars every AI SaaS needs

* Day 6 (opinion) — tRPC vs REST for SaaS in 2026

* Day 7 (story) — what I learned building a production auth system at 20

# **9\. Non-functional requirements**

## **9.1  Performance**

* tRPC API p95 response time: under 200ms for non-AI procedures

* AI streaming first token: under 800ms from request to first SSE event

* Dashboard initial load: Core Web Vitals LCP under 2.5 seconds on Vercel Edge

* Prisma queries: all list queries include explicit LIMIT — no unbounded scans

## **9.2  Security**

* All auth tokens are httpOnly cookies — no localStorage

* tRPC procedures validate input with Zod before touching the database

* Lemon Squeezy webhooks verify signatures before processing any event

* FastAPI verifies the internal shared secret on every request from Next.js

* Multi-tenant queries always filter by orgId — no cross-tenant data leakage possible

* Rate limiting: 10 req/min on auth endpoints, 60 req/min on AI endpoints per user

## **9.3  Developer experience**

* bun dev starts all services with one command via Turbo

* prisma studio runs in browser for database inspection during development

* All tRPC procedures are fully typed — TypeScript errors surface before runtime

* Comprehensive .env.example with comments explaining every variable

* README covers setup from zero to running in under 15 minutes

## **9.4  Observability**

* All AI calls logged to ai\_usage with model, tokens, cost, and orgId

* tRPC errors surfaced with structured error codes — not raw stack traces

* Lemon Squeezy webhook events logged to a lemon\_squeezy\_events table before processing

* FastAPI exposes /health endpoint for uptime monitoring
