import React from "react";

const Headline = () => {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)",
      }}
      className="h-8 flex items-center justify-center"
    >
      <span className="text-white">Headline</span>
    </div>
  );
};

export default Headline;
