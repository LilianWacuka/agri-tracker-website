import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    outputFileTracingIncludes: {
    "/api/*": ["./generated/prisma/**/*"],
  },

};

export default nextConfig;
