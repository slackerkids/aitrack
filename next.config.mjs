/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
          pathname: '**', // Allows all image paths from this domain
        },
      ],
    },
  };
  
  export default nextConfig;
  