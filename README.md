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

A fully working AI SaaS foundation so you can focus on your product's unique value instead of rebuilding auth, billing, and infrastructure from scratch.

Ships with Next.js 16, Better Auth with OAuth, Lemon Squeezy subscriptions, Prisma + Postgres, multi-tenancy with RBAC, org invite system, and a Python FastAPI AI microservice with streaming chat and a Qdrant RAG pipeline.

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
| Embeddings | Google `text-embedding-004` | Semantic search |
| Vector DB | Qdrant Cloud | Per-org document collections |
| LLM | Google Gemini | Streaming chat responses |
| Caching | Upstash Redis | Rate limiting, session caching |
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
│   │   │   │   ├── api/        # REST endpoints (auth, AI chat, billing webhooks)
│   │   │   │   ├── dashboard/  # Protected app shell
│   │   │   │   └── invite/     # Org invite acceptance
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── lib/            # Auth client, billing client, utilities
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
| `LEMONSQUEEZY_API_KEY` | Billing | Lemon Squeezy API key |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Billing | Lemon Squeezy webhook signing secret |
| `LEMONSQUEEZY_STORE_ID` | Billing | Your Lemon Squeezy store ID |
| `AI_SERVICE_URL` | AI | Internal URL of the FastAPI AI service |
| `AI_SERVICE_SECRET` | AI | Shared secret for web → AI service auth |
| `GOOGLE_API_KEY` | AI | Google AI Studio key for Gemini + embeddings |
| `QDRANT_URL` | RAG | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | RAG | Qdrant Cloud API key |
| `RESEND_API_KEY` | Email | Resend key for invite and verification emails |
| `UPSTASH_REDIS_REST_URL` | Cache | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Cache | Upstash Redis REST token |

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

**Customise:** `apps/ai-service/routers/rag.py` to add document-scoped filtering, `apps/web/src/app/dashboard/` for the upload + chat UI, Lemon Squeezy billing for per-document or per-page usage metering.

---

### 3. AI coding assistant SaaS

A GitHub Copilot-style assistant that understands your users' codebases. Supports code generation, explanation, review, and refactoring via a chat interface.

**How to use this kit:** Ingest code files as documents (the chunker handles plain text). Add tool calls to the Gemini request in `apps/ai-service/routers/chat.py` — tools like `read_file`, `run_tests`, `search_codebase`. Stream tool output back to the frontend using the existing streaming response infrastructure.

**Customise:** `apps/ai-service/routers/chat.py` for tool definitions, `apps/web/src/components/dashboard/chat.tsx` for the code-aware chat UI (add syntax highlighting), billing by token or by seat.

---

### 4. SaaS analytics dashboard

A multi-tenant analytics platform where teams can track metrics, build dashboards, and manage data. The kit's auth, billing, and org management are exactly what you need.

**How to use this kit:** Skip the AI service entirely. Add your data models to `packages/db/prisma/schema.prisma`. Build tRPC routers in `apps/web/src/server/trpc/routers/` for your metrics. Use the existing org switcher and RBAC (`orgProcedure`, `adminProcedure`) to scope all queries to the active organisation.

**Customise:** Replace the chat dashboard page with your charts and tables. Use Lemon Squeezy's usage billing to charge by number of tracked events or data retention period.

---

### 5. AI writing assistant SaaS

A Notion-meets-Jasper tool where teams collaborate on AI-generated and AI-refined content — blog posts, marketing copy, emails, and social posts — with org-scoped history and templates.

**How to use this kit:** The streaming chat infrastructure handles real-time generation. Add a `Document` model to the Prisma schema to persist drafts scoped to an org. Use the invite system so marketing teams can collaborate. RAG-ingest brand guidelines and tone-of-voice docs so the AI stays on-brand per organisation.

**Customise:** `apps/web/src/app/dashboard/` for a rich-text editor (integrate Tiptap or Lexical), `apps/ai-service/routers/chat.py` for writing-specific system prompts, Lemon Squeezy for per-seat or per-word billing.

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

## Building your SaaS with this kit

This section is a practical guide for customising the kit into a real product. Every section points to the exact files you need to touch.

---

### Adding AI agents with tool calling

Agents differ from plain chat in one way: they can call tools (functions) and reason over the results before responding. Gemini supports this natively.

**Step 1 — Define tools in the AI service**

Open `apps/ai-service/routers/chat.py`. Add tool declarations to the `tools` list passed to the Gemini request:

```python
tools = [
    {
        "function_declarations": [
            {
                "name": "search_knowledge_base",
                "description": "Search the organisation's knowledge base for relevant information.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "The search query"},
                    },
                    "required": ["query"],
                },
            },
            {
                "name": "create_ticket",
                "description": "Create a support ticket in the system.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                    },
                    "required": ["title", "priority"],
                },
            },
        ]
    }
]
```

**Step 2 — Handle tool calls in the response loop**

After sending the message to Gemini, check if the response contains a `function_call` part instead of text. Execute the function, send the result back, and let Gemini continue:

```python
response = model.generate_content(messages, tools=tools)

for part in response.candidates[0].content.parts:
    if part.function_call:
        name = part.function_call.name
        args = dict(part.function_call.args)

        # Execute the tool
        if name == "search_knowledge_base":
            result = await rag_service.retrieve(args["query"], org_id)
        elif name == "create_ticket":
            result = await create_ticket_in_db(args)

        # Send tool result back to Gemini
        messages.append({"role": "function", "parts": [{"function_response": {"name": name, "response": result}}]})
        response = model.generate_content(messages, tools=tools)
```

**Step 3 — Stream the final answer**

Once Gemini returns a text part (no more tool calls), stream it back to the Next.js route via the existing SSE response in `apps/web/src/app/api/ai/chat/route.ts`.

---

### Extending RBAC — adding new roles

The kit ships with two roles: `admin` and `member`. Here is how to add a `viewer` role that can read but not write.

**Step 1 — Update the Prisma enum**

In `packages/db/prisma/schema.prisma`:

```prisma
enum MemberRole {
  admin
  member
  viewer   // add this
}
```

Run `bun run db:push` from `packages/db`.

**Step 2 — Add a tRPC procedure**

In `apps/web/src/server/trpc/init.ts`, add a `viewerProcedure` below `orgProcedure`:

```ts
export const viewerProcedure = orgProcedure.use(({ ctx, next }) => {
  const allowed: MemberRole[] = ["admin", "member", "viewer"];
  if (!allowed.includes(ctx.membership.role)) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

**Step 3 — Use the right procedure per route**

```ts
// Anyone in the org can read
export const docsRouter = router({
  list: viewerProcedure.query(({ ctx }) => { ... }),

  // Only admins can delete
  delete: adminProcedure.mutation(({ ctx, input }) => { ... }),
});
```

**Step 4 — Show/hide UI based on role**

In any server component, read the membership from the tRPC caller context or directly from Prisma:

```ts
const membership = await prisma.membership.findFirst({
  where: { userId: session.user.id, orgId: activeOrgId },
});

const canEdit = membership?.role === "admin" || membership?.role === "member";
```

---

### Customising organisation logic

**Add fields to the Org model**

In `packages/db/prisma/schema.prisma`:

```prisma
model Org {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  plan          String   @default("free")
  // add your own fields:
  logoUrl       String?
  customPrompt  String?   // per-org AI system prompt
  maxSeats      Int       @default(5)
  createdAt     DateTime @default(now())
  // ...relations
}
```

Run `bun run db:push`.

**Expose org settings via tRPC**

In `apps/web/src/server/trpc/routers/org.ts`, add an `update` mutation scoped to admins:

```ts
update: adminProcedure
  .input(z.object({
    name: z.string().min(1).optional(),
    logoUrl: z.string().url().optional(),
    customPrompt: z.string().max(2000).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.org.update({
      where: { id: ctx.org.id },
      data: input,
    });
  }),
```

**Use the custom prompt in the AI service**

Pass `customPrompt` when calling the chat endpoint from `apps/web/src/app/api/ai/chat/route.ts`, then use it as the system message in `apps/ai-service/routers/chat.py`:

```python
system_prompt = body.get("systemPrompt") or "You are a helpful assistant."
messages = [{"role": "user", "parts": [{"text": system_prompt}]}, ...user_messages]
```

---

### Adding new billing plans (Lemon Squeezy)

**Step 1 — Create variants in Lemon Squeezy**

In your Lemon Squeezy dashboard, create a product with two variants: `starter` and `growth`. Copy their variant IDs.

**Step 2 — Map variants to plan names**

In `apps/web/src/lib/lemonsqueezy.ts` (or wherever you handle webhooks):

```ts
export const PLAN_VARIANT_MAP: Record<string, string> = {
  "123456": "starter",
  "789012": "growth",
};
```

**Step 3 — Store the plan on the Org**

In your Lemon Squeezy webhook handler, update the org's `plan` field when a subscription is created or updated:

```ts
const variantId = event.data.attributes.variant_id.toString();
const plan = PLAN_VARIANT_MAP[variantId] ?? "free";

await prisma.org.update({
  where: { id: orgId },
  data: { plan },
});
```

**Step 4 — Gate features by plan**

Add a `planProcedure` in `apps/web/src/server/trpc/init.ts`:

```ts
export const growthProcedure = orgProcedure.use(({ ctx, next }) => {
  if (ctx.org.plan !== "growth") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Upgrade to Growth to use this feature." });
  }
  return next({ ctx });
});
```

---

### Adding a new database model and API

Example: adding a `Project` model scoped to an org.

**Step 1 — Schema**

```prisma
model Project {
  id        String   @id @default(cuid())
  orgId     String
  name      String
  createdAt DateTime @default(now())
  org       Org      @relation(fields: [orgId], references: [id], onDelete: Cascade)
}
```

Add `projects Project[]` to the `Org` model. Run `bun run db:push`.

**Step 2 — tRPC router**

Create `apps/web/src/server/trpc/routers/project.ts`:

```ts
import { z } from "zod";
import { router, orgProcedure, adminProcedure } from "../init";

export const projectRouter = router({
  list: orgProcedure.query(({ ctx }) =>
    ctx.prisma.project.findMany({ where: { orgId: ctx.org.id } })
  ),

  create: adminProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.project.create({ data: { orgId: ctx.org.id, name: input.name } })
    ),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.project.delete({ where: { id: input.id, orgId: ctx.org.id } })
    ),
});
```

**Step 3 — Mount the router**

In `apps/web/src/server/trpc/root.ts`, add:

```ts
import { projectRouter } from "./routers/project";

export const appRouter = router({
  // ...existing routers
  project: projectRouter,
});
```

**Step 4 — Use in a component**

```ts
const { data: projects } = trpc.project.list.useQuery();
```

---

### Adding a new dashboard page

**Step 1 — Create the route**

Create `apps/web/src/app/dashboard/projects/page.tsx`. It is automatically protected by the dashboard layout's auth check.

```tsx
import { trpc } from "@/server/trpc/server"; // server-side caller

export default async function ProjectsPage() {
  const projects = await trpc.project.list();
  return (
    <div>
      {projects.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

**Step 2 — Add to sidebar**

In `apps/web/src/components/dashboard/sidebar.tsx`, add an entry to the nav links array:

```ts
{ label: "Projects", href: "/dashboard/projects", icon: FolderIcon },
```

---

### Customising the RAG pipeline

**Scope retrieval to a specific document**

In `apps/ai-service/services/rag.py`, add a `must` filter to the Qdrant query so only chunks from a specific document are returned:

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

results = qdrant.search(
    collection_name=f"org_{org_id}",
    query_vector=embedding,
    query_filter=Filter(
        must=[FieldCondition(key="document_id", match=MatchValue(value=document_id))]
    ),
    limit=5,
)
```

Store `document_id` in the Qdrant payload when ingesting:

```python
points = [PointStruct(
    id=str(uuid4()),
    vector=embedding,
    payload={"text": chunk, "document_id": doc_id, "source": filename}
) for chunk, embedding in zip(chunks, embeddings)]
```

**Change the chunk size**

In `apps/ai-service/services/rag.py`:

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1200,   # larger chunks = more context per result
    chunk_overlap=150,
)
```

**Swap the embedding model**

Replace `models/text-embedding-004` with any Google embedding model:

```python
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
```

---

### Sending custom emails with Resend

Invite emails are sent from `apps/web/src/server/trpc/routers/org.ts`. To send any other transactional email, use the same Resend client:

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Your App <noreply@yourdomain.com>",
  to: user.email,
  subject: "Your report is ready",
  html: `<p>Hi ${user.name}, your weekly report is ready. <a href="${reportUrl}">View it here</a>.</p>`,
});
```

For complex layouts use [React Email](https://react.email) — build a component, render it to HTML with `render()`, and pass the string to `html`.

---

### Handling multi-tenant data isolation

Every query in the kit is scoped to `ctx.org.id` — this comes from `orgProcedure` in `apps/web/src/server/trpc/init.ts`. When you add a new model, always filter by `orgId`:

```ts
// CORRECT — user can only see their org's data
ctx.prisma.project.findMany({ where: { orgId: ctx.org.id } })

// WRONG — leaks data across orgs
ctx.prisma.project.findMany()
```

For the AI service, every Qdrant collection is named `org_{orgId}`, so vector search is automatically isolated. When calling the AI service from Next.js, always pass `orgId` from the membership context — never trust a client-supplied `orgId`.

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes and ensure the build passes: `bun run build`
3. Open a pull request against `main` with a clear description of what you changed and why.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/mashdotdev/saas-starter-kit/issues).

---

## License

MIT — free to use, modify, and distribute, including in commercial products. See [LICENSE](./LICENSE).
