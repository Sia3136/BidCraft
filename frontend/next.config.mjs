/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
