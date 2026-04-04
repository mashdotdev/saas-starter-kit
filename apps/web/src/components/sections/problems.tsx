"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    num: "01",
    heading: "Time Waste",
    desc: "Spend hours setting up boilerplate, repo structures, and CI/CD pipelines before writing a single feature.",
    image: "/images/1.png",
    painPoints: [
      "Configure ESLint, Prettier, Husky",
      "Wire up CI/CD from scratch",
      "Design and migrate the DB schema",
      "Set up email provider & templates",
      "Build auth flows before your first user",
    ],
    stat: "6+ weeks",
    statLabel: "lost before first feature ships",
  },
  {
    num: "02",
    heading: "Auth Headaches",
    desc: "Complex multi-tenant RBAC, OAuth providers, and session management that usually takes weeks to perfect.",
    image: "/images/2.png",
    painPoints: [
      "Google, GitHub, and magic-link OAuth",
      "Session expiry & refresh token logic",
      "Role-based access per organisation",
      "Invite flows for non-existing users",
      "Email verification & account recovery",
    ],
    stat: "40+ hours",
    statLabel: "typical auth implementation",
  },
  {
    num: "03",
    heading: "Billing Complexity",
    desc: "Webhooks, subscription logic, tiered pricing, it's harder than it looks.",
    image: "/images/2.png",
    painPoints: [
      "Webhook signature verification",
      "Failed payment & dunning logic",
      "Proration on mid-cycle plan changes",
      "Customer portal & invoice history",
      "Tax calculation across regions",
    ],
    stat: "3–5 sprints",
    statLabel: "to get billing production-ready",
  },
];

const Problems = () => {
  const problemRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".problem-row").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
          },
        });
      });
    },
    { scope: problemRef },
  );

  return (
    <section className="pt-12 container mx-auto px-4 md:px-0" ref={problemRef}>
      {/* Section header */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center mb-16">
        <div className="overflow-hidden">
          <h3 className="font-heading tracking-tighter text-5xl md:text-6xl xl:text-7xl leading-[0.92] text-foreground uppercase">
            The <span className="text-brand-orange">high</span> cost of{" "}
            <br className="hidden md:block" />
            building from scratch
          </h3>
        </div>
        <p className="text-base md:text-lg text-zinc-400 max-w-sm leading-relaxed">
          Engineering shouldn&apos;t be about reinventing the wheel. Most
          startups die in the{" "}
          <span className="font-semibold text-foreground">
            auth and billing
          </span>{" "}
          phase.
        </p>
      </div>

      {/* Problem rows */}
      <div className="flex flex-col divide-y  divide-white/5">
        {problems.map(
          ({ num, heading, desc, image, painPoints, stat, statLabel }) => (
            <div
              key={num}
              className="problem-row grid grid-cols-1 md:grid-cols-3 gap-6 py-12"
            >
              {/* Left — number + heading + desc */}
              <div className="flex flex-col justify-between gap-6">
                <span className="font-mono text-sm text-zinc-500">{num}</span>
                <div>
                  <h2 className="font-subheading text-4xl md:text-5xl xl:text-6xl tracking-tighter leading-none">
                    {heading}
                  </h2>
                  <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Centre — image */}
              <div className="relative w-full h-64 md:h-auto min-h-70">
                <Image
                  src={image}
                  alt={heading}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Right — pain points + stat */}
              <div className="flex flex-col justify-between md:items-end gap-6">
                <ul className="flex flex-col gap-2.5">
                  {painPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 text-brand-orange text-xs shrink-0">
                        ✕
                      </span>
                      <span className="text-sm text-zinc-400 leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/8 pt-5">
                  <p className="font-heading text-4xl md:text-5xl text-brand-orange tracking-tight leading-none">
                    {stat}
                  </p>
                  <p className="mt-1.5 text-xs text-zinc-500 uppercase tracking-widest font-mono">
                    {statLabel}
                  </p>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default Problems;
