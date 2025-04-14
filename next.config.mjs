/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['mrrooy.s3.ap-southeast-2.amazonaws.com'],  // Cho phép tải ảnh từ AWS S3
      },
      
};

export default nextConfig;
