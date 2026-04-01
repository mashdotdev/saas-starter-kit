"use client";

import { scaleBox } from "@/constants";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ── Decorative SVG art per card type ── */
const Art = ({ type, accent }: { type: string; accent: string }) => {
  if (type === "lines")
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 260"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={i * 36}
            y1="0"
            x2={i * 36 - 120}
            y2="260"
            stroke={accent}
            strokeWidth="1"
          />
        ))}
      </svg>
    );

  if (type === "dots")
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 200 200"
      >
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 36 + 18}
              cy={row * 36 + 18}
              r="2.5"
              fill={accent}
            />
          )),
        )}
      </svg>
    );

  if (type === "grid")
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 200 200"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 28}
            x2="200"
            y2={i * 28}
            stroke={accent}
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 28}
            y1="0"
            x2={i * 28}
            y2="200"
            stroke={accent}
            strokeWidth="1"
          />
        ))}
      </svg>
    );

  if (type === "wave")
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 200"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${80 + i * 22} Q100 ${60 + i * 22} 200 ${80 + i * 22} T400 ${80 + i * 22}`}
            fill="none"
            stroke={accent}
            strokeWidth="1.2"
          />
        ))}
      </svg>
    );

  return null;
};

const Scale = () => {
  const scaleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!headingRef.current) return;

    const split = SplitText.create(headingRef.current, { type: "chars" });

    const tl = gsap.timeline({
      // scrollTrigger: {
      //   trigger: scaleRef.current,
      //   start: "top 55%",
      // },
    });

    tl.from(split.chars, {
      opacity: 0,
      yPercent: 80,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.015,
    })
      .from(
        ".scale-sub",
        { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      )
      .to(
        ".scale-box",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        },
        "-=0.2",
      );

    return () => split.revert();
  }, {});

  return (
    <section ref={scaleRef} className="relative px-6 md:px-0 ">
      <div className="relative z-10 container mx-auto pt-24 pb-24">
        {/* Section header */}
        <div className="overflow-hidden mb-2">
          <h1
            ref={headingRef}
            className="text-center text-5xl md:text-7xl font-heading uppercase tracking-tight leading-[0.92]"
          >
            Everything you need to{" "}
            <span className="text-brand-orange">scale</span>
          </h1>
        </div>
        <p className="scale-sub text-center text-base md:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
          Skip tedious setup. Jump straight into your business logic with
          pre-wired, production-grade modules.
        </p>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
          {scaleBox.map(
            ({
              tag,
              heading,
              description,
              gridClassName,
              accent,
              glow,
              symbol,
              art,
            }) => (
              <div
                key={heading}
                className={clsx(
                  gridClassName,
                  "scale-box relative overflow-hidden rounded-xl p-7 md:p-10 flex flex-col justify-between opacity-0 translate-y-6 group",
                )}
                style={{
                  background: `radial-gradient(ellipse at 0% 0%, ${glow} 0%, transparent 55%),
                               radial-gradient(ellipse at 100% 100%, ${glow} 0%, transparent 55%),
                               linear-gradient(140deg, #0f0e17 0%, #12111c 100%)`,
                }}
              >
                {/* SVG art layer */}
                <Art type={art} accent={accent} />

                {/* Corner glow blob */}
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ background: accent }}
                />

                {/* Tag */}
                <div className="relative z-10 flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      color: accent,
                      borderColor: `${accent}40`,
                      background: `${accent}15`,
                    }}
                  >
                    {tag}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto space-y-3">
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-2xl md:text-3xl font-subheading text-white leading-tight uppercase tracking-tighter">
                      {heading}
                    </h3>
                    <span
                      className="text-3xl leading-none shrink-0 opacity-70"
                      style={{ color: accent }}
                    >
                      {symbol}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed max-w-md">
                    {description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-40"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                  }}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default Scale;
