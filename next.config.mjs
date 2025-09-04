/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mrrooy.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites () {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
};

export default nextConfig;