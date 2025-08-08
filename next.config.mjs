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
};

export default nextConfig;