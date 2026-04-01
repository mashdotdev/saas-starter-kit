"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

const Problems = () => {
  const problemRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: problemRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,

        pin: true,
      },
    });

    tl.to(".second-box", {
      top: 50,
    }).to(".third-box", {
      top: 100,
    });
  });

  return (
    <section className="h-screen pt-12 container mx-auto" ref={problemRef}>
      <div className="flex px-4 md:px-0 justify-between flex-col lg:flex-row gap-6 items-center">
        <div className="overflow-hidden">
          <h3 className="font-heading tracking-tighter text-5xl md:text-6xl xl:text-7xl leading-[0.92] text-foreground uppercase mb-12">
            The <span className="text-brand-orange">high</span> cost of <br />{" "}
            building from scratch
          </h3>
        </div>

        <div className="flex flex-col justify-end gap-6">
          <p className="text-base md:text-lg text-zinc-400 max-w-xl  leading-relaxed">
            The engineering shouldn&apos;t be about reinventing the wheel. Most
            startup die in{" "}
            <span className="font-semibold text-foreground">
              Auth and billing
            </span>{" "}
            phase
          </p>
        </div>
      </div>

      <div className="relative size-full">
        <div className="size-full px-4 md:px-0 py-4 md:py-8">
          <div className="flex justify-between">
            <div className="flex-1">
              <span className="mb-2 text-zinc-400">01</span>
              <h2 className="font-subheading text-6xl tracking-tighter">
                Time Waste
              </h2>
              <p className="max-w-xl mt-6">
                Spend hours setting up boilerplate, repo structures, and CI/CD
                pipelines before writing a single feature.
              </p>
            </div>

            <div className="relative flex-1 h-[70vh]">
              <Image
                src={"/images/1.png"}
                alt="check"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex-1">hello</div>
          </div>
        </div>
        <div className="backdrop-blur-3xl absolute inset-0 top-[70%] size-full second-box  px-4 md:px-0 py-4 md:py-8">
          <div className="flex justify-between">
            <div className="flex-1">
              <span className="mb-2 text-zinc-400">02</span>
              <h2 className="font-subheading text-6xl tracking-tighter">
                Auth Headaches
              </h2>
              <p className="max-w-xl mt-6">
                Complex multi-tenant RBAC, 0Auth providers, and session
                management that usually takes weeks to perfect.
              </p>
            </div>

            <div className="relative flex-1 h-[70vh]">
              <Image
                src={"/images/2.png"}
                alt="check"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex-1">hello</div>
          </div>
        </div>
        <div className="bg-black absolute inset-0 top-full size-full third-box px-4 md:px-0 py-4 md:py-8">
          <div className="flex justify-between">
            <div className="flex-1">
              <span className="mb-2 text-zinc-400">03</span>
              <h2 className="font-subheading text-6xl tracking-tighter">
                Billing Complexity
              </h2>
              <p className="max-w-xl mt-6">
                Stripe webhooks, subscription logic, tiered pricing, and tax
                compliance. it&apos; harder than it looks.
              </p>
            </div>

            <div className="relative flex-1 h-[70vh]">
              <Image
                src={"/images/2.png"}
                alt="check"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex-1">hello</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problems;
