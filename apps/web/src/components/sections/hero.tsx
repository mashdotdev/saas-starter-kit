"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import CustomButton from "../custom-button";
import Marquee from "../marquee";

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
  { label: "RESEND", symbol: "✉" },
  { label: "BETTER AUTH", symbol: "⬡" },
  { label: "REDIS", symbol: "▲" },
  { label: "POSTGRES", symbol: "⬢" },
  { label: "TRPC", symbol: "⧖" },
  { label: "VERCEL", symbol: "△", accent: true },
];

// Two copies for seamless loop — animation goes 0 → -50%
const row1 = [...techItems, ...techItems, ...techItems, ...techItems];

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
    <section ref={heroRef} className="overflow-hidden">
      <div className="container mx-auto px-4 md:px-0 overflow-hidden pt-12 md:pt-40 ">
        <div className="gap-12 flex flex-col md:flex-row justify-between">
          {/* Text div */}
          <div>
            <h1
              ref={headlineRef}
              className="font-heading text-5xl md:text-6xl xl:text-7xl tracking-tight leading-[0.92] text-foreground uppercase"
            >
              Ship your AI SaaS in{" "}
              <span className="text-brand-orange">Days</span>
              , <br className="hidden lg:block" />
              not months
            </h1>

            <p className="text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed mt-4">
              The ultimate boilerplate for serious engineers.{" "}
              <span className="font-semibold text-foreground">
                Auth, billing, agents, and database
              </span>{" "}
              production-ready from day one.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <CustomButton variant="white" text="Get the Kit" />
              <CustomButton variant="orange" text="Star on Github" />
            </div>

            <div className="flex items-center gap-3 mt-12">
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

          {/* Video Div */}
          <div>
            <video
              src="/videos/home-engine.webm"
              autoPlay
              loop
              muted
              className="object-cover h-96"
            />
          </div>
        </div>
        <div className="overflow-hidden mb-4 mt-48"></div>
      </div>
      <Marquee row={row1} />
    </section>
  );
};

export default Hero;
