const faqs = [
  {
    q: "What's included in the open-source version?",
    a: "The community version includes the full Next.js 16 app, Better Auth with OAuth and magic links, a Prisma schema wired to Supabase, and the base project structure — everything you need to get started without spending a dime.",
  },
  {
    q: "Do I need to know AI to use the Pro AI features?",
    a: "No. The AI agent logic, tool calling, and streaming responses are pre-built using the OpenAI Agents SDK. You just configure your API key and start extending — no ML background required.",
  },
  {
    q: "How does billing work? Can I switch plans later?",
    a: "Billing is handled end-to-end via Lemon Squeezy — subscriptions, webhooks, and the customer portal are all wired up. You can upgrade, downgrade, or cancel at any time directly from the portal.",
  },
  {
    q: "Is this production-ready or just a boilerplate?",
    a: "It's production-ready. The stack includes CI/CD via GitHub Actions, one-click Vercel deployment, Redis caching with Upstash, vector search with Qdrant, and RBAC for multi-tenant apps — not a toy starter.",
  },
  {
    q: "What database does it use and is it easy to migrate?",
    a: "It uses Postgres (via Supabase) with Prisma ORM for type-safe, migration-backed queries. Switching providers is straightforward — update the connection string and re-run migrations.",
  },
  {
    q: "What do I get with the Pro plan beyond the code?",
    a: "Pro includes access to the private Discord community where you can ask questions, get architecture feedback, and stay updated on new features and releases as the kit evolves.",
  },
];

const FAQs = () => {
  return (
    <section className="min-h-screen px-4 md:px-0 container mx-auto py-24">
      <h1 className="text-center text-5xl md:text-7xl font-heading uppercase tracking-tight leading-[0.92]">
        Frequently asked questions
      </h1>

      <div className="mt-18 divide-y divide-zinc-800">
        {faqs.map((faq, i) => (
          <div key={i} className="py-7">
            <p className="text-lg md:text-xl font-medium text-white">{faq.q}</p>
            <p className="mt-3 text-zinc-400 text-base leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
