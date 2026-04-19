import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(dirname, "..", "..");

const prismaTracingGlobs = [
	"../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**",
	"../../node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**",
];

const nextConfig: NextConfig = {
	outputFileTracingRoot: monorepoRoot,
	outputFileTracingIncludes: {
		"/*": prismaTracingGlobs,
	},
	serverExternalPackages: ["@prisma/client"],
	transpilePackages: ["@rotra/ui", "@rotra/db"],
};

export default nextConfig;
