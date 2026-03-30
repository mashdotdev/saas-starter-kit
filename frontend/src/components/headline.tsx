import React from "react";

const Headline = () => {
  return (
    <div className="py-3 flex items-center justify-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 self-start">
        <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
        <span className="font-mono text-xs font-bold tracking-widest uppercase text-foreground/60">
          v1.0.0 Now Live
        </span>
      </div>
    </div>
  );
};

export default Headline;
