import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@rotra/ui', '@rotra/db'],
}

export default nextConfig
