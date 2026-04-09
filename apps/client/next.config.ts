import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@rotra/ui", "@rotra/db"],
	images: {
		remotePatterns: [{ hostname: "i.pravatar.cc" }],
	},
};

export default nextConfig;
