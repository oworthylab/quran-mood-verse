import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: '**github.com' }, { hostname: '**unsplash.com' }],
  },

  async redirects() {
    return [
      {
        source: '/account',
        destination: '/account/settings',
        permanent: true,
      },
    ]
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
