import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@repo/db", "@repo/auth", "@repo/types"],
};

export default nextConfig;
