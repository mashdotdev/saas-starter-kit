"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import CustomButton from "../custom-button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Headline from "../headline";

gsap.registerPlugin(SplitText);

type TechItem = {
  label: string;
  symbol: string;
  highlight?: boolean;
  accent?: boolean;
};

const techItems: TechItem[] = [
  { label: "NEXT.JS", symbol: "⌘" },
  { label: "TAILWIND", symbol: "✦" },
  { label: "PRISMA", symbol: "◈" },
  { label: "STRIPE", symbol: "$" },
  { label: "SUPABASE", symbol: "⚡" },
  { label: "OPENAI", symbol: "◉", highlight: true },
  { label: "NODEMAILER", symbol: "✉" },
  { label: "BETTER AUTH", symbol: "⬡" },
  { label: "REDIS", symbol: "▲" },
  { label: "POSTGRES", symbol: "⬢" },
  { label: "TRPC", symbol: "⧖" },
  { label: "VERCEL", symbol: "△", accent: true },
];

// Two copies for seamless loop — animation goes 0 → -50%
const row1 = [...techItems, ...techItems];
const row2 = [...techItems, ...techItems].reverse();

const avatars = [
  { initials: "EK", bg: "#0a0908" },
  { initials: "DM", bg: "#ff5454" },
  { initials: "TJ", bg: "#3b82f6" },
];

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headlineRef.current || !gradientRef.current) return;

      const split = SplitText.create(headlineRef.current, { type: "chars" });

      const tl = gsap.timeline();

      gsap.to(".parallax-video", {
        yPercent: -30,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "center top",
          scrub: true,
        },
      });

      // Headline chars fly up from below
      tl.from(
        split.chars,
        {
          opacity: 0,
          yPercent: 100,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.018,
        },
        0,
      );

      // Gradient section fades in simultaneously
      tl.from(
        gradientRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
        },
        0,
      );

      return () => split.revert();
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="relative px-4 h-screen md:px-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
      }}
    >
      {/* ── Top: 2-col text area ── */}
      <div className="relative z-10 pt-16">
        <div className="flex justify-between flex-col lg:flex-row gap-6 items-center ">
          {/* Left: Headline */}
          <div className="overflow-hidden">
            <h1
              ref={headlineRef}
              className="font-heading text-5xl md:text-6xl xl:text-7xl tracking-tight leading-[0.92] text-foreground uppercase"
            >
              Ship your AI SaaS in{" "}
              <span className="text-brand-orange">Days</span>,{" "}
              <br className="hidden lg:block" />
              not months
            </h1>
          </div>

          {/* Right: Description + CTA + social proof */}
          <div className="flex flex-col justify-end gap-6">
            <p className="text-base md:text-lg text-foreground/60 max-w-xl leading-relaxed">
              The ultimate boilerplate for serious engineers.{" "}
              <span className="font-semibold text-foreground">
                Auth, billing, agents, and database
              </span>{" "}
              production-ready from day one.
            </p>

            <div className="flex flex-wrap gap-4">
              <CustomButton variant="white" text="Get the Kit" />
              <CustomButton variant="orange" text="Star on Github" />
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-3">
                {avatars.map(({ initials, bg }) => (
                  <div
                    key={initials}
                    className="w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-white text-[10px] font-bold select-none"
                    style={{ backgroundColor: bg }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/60">
                Trusted by{" "}
                <span className="font-bold text-foreground">500+</span>{" "}
                developers building the future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gradient marquee section ── */}
      <div
        ref={gradientRef}
        className="relative w-full py-12 md:py-16 mt-16 rounded-lg"
      >
        <video
          src="/videos/home-engine.webm"
          autoPlay
          loop
          muted
          className="object-cover h-96 absolute left-2/4 -translate-x-2/4 transform -top-36 parallax-video"
        />
        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden mb-4 mt-48">
          <div
            className="flex gap-4 w-max"
            style={{ animation: "marquee-left 30s linear infinite" }}
          >
            {row1.map(({ label, symbol }, i) => (
              <div
                key={`r1-${label}-${i}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm whitespace-nowrap"
              >
                <span className="text-white/80 text-sm leading-none">
                  {symbol}
                </span>
                <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 w-max"
            style={{ animation: "marquee-right 28s linear infinite" }}
          >
            {row2.map(({ label, symbol }, i) => (
              <div
                key={`r2-${label}-${i}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 border border-white/30 backdrop-blur-sm whitespace-nowrap"
              >
                <span className="text-white/70 text-sm leading-none">
                  {symbol}
                </span>
                <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
