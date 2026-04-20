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
	transpilePackages: ["@rotra/ui", "@rotra/db", "@rotra/legal-content"],
	images: {
		remotePatterns: [
			{ hostname: "i.pravatar.cc" },
			{ protocol: "https", hostname: "*.fbcdn.net", pathname: "/**" },
			{ protocol: "https", hostname: "*.fbsbx.com", pathname: "/**" },
			{ protocol: "https", hostname: "graph.facebook.com", pathname: "/**" },
		],
	},
};

export default nextConfig;
