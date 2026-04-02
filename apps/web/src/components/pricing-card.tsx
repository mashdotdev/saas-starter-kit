"use client";

import { pricingFeatures } from "@/constants";
import clsx from "clsx";

interface PricingCardProps {
  variant: "open-source" | "pro";
  isRecommended?: boolean;
}

const PricingCard = ({ variant }: PricingCardProps) => {
  const isOpenSource = variant === "open-source" ? true : false;

  // button functionality
  const handleButtonFunction = () => {
    if (isOpenSource)
      window.open("https://github.com/mashdotdev/saas-starter-kit.git");
  };

  return (
    <div
      className={clsx(
        isOpenSource ? "border border-white/50" : "bg-white text-black",
        "p-6 min-h-96 flex flex-col rounded-lg overflow-hidden",
      )}
    >
      <h2 className="font-subheading text-2xl">
        {isOpenSource ? "Community" : "SaaS Kit Pro"}
      </h2>
      <div className="mt-2">
        <span className="text-6xl mt-2 font-heading">
          {isOpenSource ? "$0" : "$249"}
        </span>
        <span className="ml-2 text-zinc-400">
          {isOpenSource ? "/forever" : "/one-time"}
        </span>
      </div>

      <ul className="mt-8 mb-16 list-disc pl-6 text-zinc-400 space-y-3">
        {isOpenSource
          ? pricingFeatures.openSource.map((feature) => (
              <li key={feature}>{feature}</li>
            ))
          : pricingFeatures.pro.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
      </ul>

      <button
        className={clsx(
          isOpenSource ? "" : "bg-black text-white",
          "w-full mt-auto border p-4 cursor-pointer",
        )}
        onClick={handleButtonFunction}
      >
        {isOpenSource ? "Fork on Github" : "Get Lifetime Access"}
      </button>
    </div>
  );
};

export default PricingCard;
