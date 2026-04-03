"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

type ArchNode = { name: string; symbol: string; desc: string };
type ArchLayer = {
  label: string;
  accent: string;
  glow: string;
  nodes: ArchNode[];
};

const layers: ArchLayer[] = [
  {
    label: "01 — Client",
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.14)",
    nodes: [
      { name: "Next.js 15", symbol: "⌘", desc: "App Router · RSC · Streaming" },
      { name: "Tailwind CSS v4", symbol: "✦", desc: "Utility-first styling" },
      { name: "tRPC Client", symbol: "⧖", desc: "Type-safe hooks" },
      { name: "GSAP", symbol: "◎", desc: "Motion & scroll animations" },
    ],
  },
  {
    label: "02 — API Layer",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.12)",
    nodes: [
      { name: "tRPC Server", symbol: "⧖", desc: "RBAC · Org context" },
      { name: "Better Auth", symbol: "⬡", desc: "OAuth · Magic links · Sessions" },
      { name: "FastAPI", symbol: "⚡", desc: "Python AI microservice" },
      { name: "Stripe Webhooks", symbol: "$", desc: "Subscriptions · Billing events" },
      { name: "Resend", symbol: "✉", desc: "Transactional email" },
    ],
  },
  {
    label: "03 — Data & AI",
    accent: "#e879f9",
    glow: "rgba(232,121,249,0.12)",
    nodes: [
      { name: "Postgres", symbol: "⬢", desc: "Prisma ORM · Migrations" },
      { name: "Qdrant Cloud", symbol: "◈", desc: "Vector store · Per-org RAG" },
      { name: "Google Gemini", symbol: "◉", desc: "LLM · text-embedding-004" },
      { name: "Upstash Redis", symbol: "▲", desc: "Cache · Rate limiting" },
    ],
  },
];

const Architecture = () => {
  const archRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      const split = SplitText.create(headingRef.current, { type: "chars" });

      gsap.from(split.chars, {
        opacity: 0,
        yPercent: 80,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.015,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 82%",
        },
      });

      gsap.from(".arch-sub", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.35,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 82%",
        },
      });

      gsap.utils.toArray<HTMLElement>(".arch-layer").forEach((layer, i) => {
        gsap.from(layer.querySelector(".arch-layer-header"), {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: { trigger: layer, start: "top 85%" },
          delay: i * 0.05,
        });

        gsap.from(layer.querySelectorAll(".arch-node"), {
          opacity: 0,
          y: 24,
          scale: 0.96,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: { trigger: layer, start: "top 82%" },
          delay: i * 0.05 + 0.15,
        });
      });

      return () => split.revert();
    },
    { scope: archRef },
  );

  return (
    <section ref={archRef} className="relative pt-24 pb-24 px-4 md:px-0" id="architecture">
      <div className="container mx-auto">
        {/* Header */}
        <div className="overflow-hidden mb-2">
          <h1
            ref={headingRef}
            className="text-center text-5xl md:text-7xl font-heading uppercase tracking-tight leading-[0.92]"
          >
            The <span className="text-brand-orange">Architecture</span>
          </h1>
        </div>
        <p className="arch-sub text-center text-base md:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
          A production-grade monorepo wired for scale. Every layer chosen for
          reliability and developer velocity.
        </p>

        {/* Layer stack */}
        <div className="mt-16 max-w-5xl mx-auto flex flex-col items-center">
          {layers.map((layer, layerIdx) => (
            <div key={layer.label} className="arch-layer w-full">
              {/* Layer label row */}
              <div className="arch-layer-header flex items-center gap-3 mb-4">
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(to right, transparent, ${layer.accent}40)`,
                  }}
                />
                <span
                  className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border whitespace-nowrap"
                  style={{
                    color: layer.accent,
                    borderColor: `${layer.accent}40`,
                    background: `${layer.accent}12`,
                  }}
                >
                  {layer.label}
                </span>
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(to left, transparent, ${layer.accent}40)`,
                  }}
                />
              </div>

              {/* Node row */}
              <div
                className="relative rounded-2xl border p-6"
                style={{
                  borderColor: `${layer.accent}22`,
                  background: `radial-gradient(ellipse at 50% 0%, ${layer.glow}, transparent 70%), linear-gradient(140deg, #0f0e17 0%, #12111c 100%)`,
                }}
              >
                <div className="flex flex-wrap justify-center gap-3">
                  {layer.nodes.map((node) => (
                    <div
                      key={node.name}
                      className="arch-node flex items-start gap-3 rounded-xl border px-4 py-3 min-w-[155px] transition-colors duration-300"
                      style={{
                        borderColor: `${layer.accent}25`,
                        background: `${layer.accent}08`,
                      }}
                    >
                      <span
                        className="text-lg leading-none mt-0.5 shrink-0"
                        style={{ color: layer.accent }}
                      >
                        {node.symbol}
                      </span>
                      <div>
                        <p className="text-sm font-subheading text-white tracking-tight">
                          {node.name}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5 leading-snug">
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px rounded-full opacity-30"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${layer.accent}, transparent)`,
                  }}
                />
              </div>

              {/* Connector to next layer */}
              {layerIdx < layers.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-px h-5"
                      style={{
                        background: `linear-gradient(to bottom, ${layer.accent}70, ${layers[layerIdx + 1].accent}70)`,
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full border"
                      style={{
                        borderColor: layers[layerIdx + 1].accent,
                        background: `${layers[layerIdx + 1].accent}30`,
                      }}
                    />
                    <div
                      className="w-px h-5"
                      style={{
                        background: `linear-gradient(to bottom, ${layers[layerIdx + 1].accent}70, transparent)`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
