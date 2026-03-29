import ReactLenis from "lenis/react";
import React from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  return <ReactLenis root>{children}</ReactLenis>;
};

export default SmoothScroll;
