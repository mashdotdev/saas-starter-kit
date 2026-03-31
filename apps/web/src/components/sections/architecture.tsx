"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

const Architecture = () => {
  const archRef = useRef(null);

  useGSAP(() => {});

  return (
    <section className="min-h-screen pt-24 relative" ref={archRef}>
      <h1 className="text-center font-heading text-7xl">The Architecture</h1>
    </section>
  );
};

export default Architecture;
