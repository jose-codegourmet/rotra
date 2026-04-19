import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(dirname, "..", "..");

const nextConfig: NextConfig = {
	outputFileTracingRoot: monorepoRoot,
	serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
