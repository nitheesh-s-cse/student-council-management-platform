import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from bundling `pg` (node-postgres) into the server
  // output. `pg` uses dynamic requires at runtime and breaks when bundled
  // for platform/serverless runtimes (e.g. Vercel, AWS Lambda) — leaving it
  // external means it is required from node_modules at request time.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
