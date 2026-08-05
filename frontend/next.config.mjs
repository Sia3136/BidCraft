/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 85],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  },
  experimental: {
    externalDir: true,
  },
  allowedDevOrigins: ["192.168.1.110", "localhost"],
}

export default nextConfig
